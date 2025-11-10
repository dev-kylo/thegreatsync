/**
 * Agent Chat Route
 * POST /agents/:agent/chat - Unified chat endpoint for all agents
 */

import { Router } from 'express';
import { z } from 'zod';
import OpenAI from 'openai';
import { getAgent, isValidAgent } from '../config/agents';
import { queryRAG } from '../services/rag-service';
import {
  getOrCreateSession,
  getSession,
  addMessage,
  getSessionHistory,
} from '../services/agent-session-service';
import {
  buildFullContext,
  buildSystemPrompt,
  buildOpenAIMessages,
  buildMessageMetadata,
  extractSourceReferences,
  buildCourseInstructorContext,
  truncateHistory,
} from '../services/context-builder';
import type { AgentChatResponse, AgentErrorResponse } from '../types/agent';

const router = Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const CHAT_MODEL = process.env.CHAT_MODEL ?? 'gpt-4o-mini';

// ============================================================================
// Request Schema
// ============================================================================

const ChatSchema = z.object({
  query: z.string().min(1),
  session_id: z.string().uuid().optional(),
  user_id: z.string().uuid().optional(),
  topic: z.string().optional(),
  domain: z.string().optional(),
  filters: z
    .object({
      domain: z.string().optional(),
      concepts: z.array(z.string()).optional(),
      mnemonic_tags: z.array(z.string()).optional(),
      has_image: z.boolean().optional(),
      code: z.boolean().optional(),
    })
    .optional(),
  topK: z.number().int().min(1).max(50).default(8),
  temperature: z.number().min(0).max(2).default(0.7),
  maxTokens: z.number().int().min(1).max(4000).default(1000),
  context: z.record(z.string(), z.any()).optional(), // Initial context for new session
});

type ChatRequest = z.infer<typeof ChatSchema>;

// ============================================================================
// Main Chat Endpoint
// ============================================================================

/**
 * POST /agents/:agent/chat
 * Universal chat endpoint for all agents
 */
router.post('/agents/:agent/chat', async (req, res) => {
  try {
    const agentParam = req.params.agent;

    // Step 1: Validate agent parameter
    if (!isValidAgent(agentParam)) {
      return res.status(400).json({
        ok: false,
        error: 'invalid_agent',
        message: `Unknown agent: ${agentParam}. Valid agents: product_owner, model_builder, teacher_qa, realm_builder, course_instructor`,
      } as AgentErrorResponse);
    }

    const agentConfig = getAgent(agentParam);

    // Step 2: Parse and validate request body
    const args: ChatRequest = ChatSchema.parse(req.body);

    // Step 3: Get or create session
    let session_id: string;
    if (args.session_id) {
      // Resume existing session
      session_id = args.session_id;
      try {
        await getSession(session_id); // Validate session exists
      } catch (error) {
        return res.status(404).json({
          ok: false,
          error: 'session_not_found',
          message: `Session not found: ${session_id}`,
        } as AgentErrorResponse);
      }
    } else {
      // Create new session
      session_id = await getOrCreateSession(
        agentConfig.id,
        args.user_id,
        args.topic,
        args.domain,
        agentConfig.session_type,
        args.context
      );
    }

    // Step 4: Query RAG using agent's preferred collections
    const chunks = await queryRAG({
      query: args.query,
      topK: args.topK,
      collections: agentConfig.collections,
      filters: args.filters,
    });

    // Step 5: Build full context (Core Canon + RAG chunks)
    let fullContext = buildFullContext(chunks);

    // Step 6: Build system prompt (agent template + context)
    // Special handling for Realm Builder if realm context exists
    const session = await getSession(session_id);
    if (agentConfig.id === 'realm_builder' && session.context?.realm_snapshot && session.context?.topic_pack) {
      // For Realm Builder, add realm-specific context after canon + RAG
      fullContext = buildCourseInstructorContext(
        session.context.realm_snapshot,
        session.context.topic_pack,
        fullContext
      );
    }

    const systemPrompt = buildSystemPrompt(agentConfig.systemPromptTemplate, fullContext);

    // Step 7: Load recent message history (via agent-session-service)
    const fullHistory = await getSessionHistory(session_id, 100);
    const recentHistory = truncateHistory(fullHistory, 30);

    // Step 8: Build OpenAI messages array
    const messages = buildOpenAIMessages(systemPrompt, recentHistory, args.query);

    // Step 9: Call OpenAI
    const completion = await openai.chat.completions.create({
      model: CHAT_MODEL,
      messages,
      temperature: args.temperature,
      max_tokens: args.maxTokens,
    });

    const reply =
      completion.choices[0]?.message?.content ??
      'I apologize, but I need a moment to gather my thoughts. Could you rephrase that?';

    // Step 10: Save messages (via agent-session-service - NOT direct DB write)
    const metadata = buildMessageMetadata(chunks, args.filters, {
      topK: args.topK,
      temperature: args.temperature,
      maxTokens: args.maxTokens,
    });

    await addMessage(session_id, 'user', args.query, metadata);
    await addMessage(session_id, 'assistant', reply);

    // Step 11: Return response
    const response: AgentChatResponse = {
      ok: true,
      reply,
      session_id,
      sources: extractSourceReferences(chunks),
      metadata: {
        agent: agentConfig.id,
        model: CHAT_MODEL,
        chunks_retrieved: chunks.length,
        temperature: args.temperature,
        max_tokens: args.maxTokens,
        messages_in_context: recentHistory.length,
      },
    };

    res.json(response);
  } catch (error) {
    console.error('Agent chat error:', error);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        ok: false,
        error: 'validation_error',
        message: 'Invalid request parameters',
        details: error.issues,
      } as AgentErrorResponse);
    }

    // Generic error
    res.status(500).json({
      ok: false,
      error: 'chat_failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    } as AgentErrorResponse);
  }
});

// ============================================================================
// Helper Endpoints
// ============================================================================

/**
 * GET /agents
 * List all available agents
 */
router.get('/agents', (_, res) => {
  res.json({
    ok: true,
    agents: [
      {
        id: 'product_owner',
        name: 'Product Owner Agent',
        description: 'Improves existing course materials',
        session_type: 'improvement',
      },
      {
        id: 'model_builder',
        name: 'Model Builder Agent',
        description: 'Creates metaphor models',
        session_type: 'model_build',
      },
      {
        id: 'teacher_qa',
        name: 'Teacher QA Agent',
        description: 'Answers student questions',
        session_type: 'qa',
      },
      {
        id: 'realm_builder',
        name: 'Realm Builder Agent',
        description: 'Guides users in creating their own metaphor worlds using topic packs',
        session_type: 'model_build',
      },
      {
        id: 'course_instructor',
        name: 'Course Instructor Agent',
        description: 'Teaches structured lessons from The Great Sync canon courses',
        session_type: 'lesson',
      },
    ],
  });
});

/**
 * GET /agents/:agent/session/:session_id
 * Get session details
 */
router.get('/agents/:agent/session/:session_id', async (req, res) => {
  try {
    const session = await getSession(req.params.session_id);
    res.json({ ok: true, session });
  } catch (error) {
    res.status(404).json({
      ok: false,
      error: 'session_not_found',
      message: error instanceof Error ? error.message : 'Session not found',
    });
  }
});

/**
 * GET /agents/:agent/session/:session_id/history
 * Get session conversation history
 */
router.get('/agents/:agent/session/:session_id/history', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
    const history = await getSessionHistory(req.params.session_id, limit);
    res.json({ ok: true, messages: history });
  } catch (error) {
    res.status(404).json({
      ok: false,
      error: 'session_not_found',
      message: error instanceof Error ? error.message : 'Session not found',
    });
  }
});

export default router;
