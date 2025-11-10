/**
 * Agent Chat Stream Route
 * POST /agents/:agent/chat/stream - Streaming chat endpoint using Server-Sent Events
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
import type { AgentErrorResponse } from '../types/agent';

const router = Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const CHAT_MODEL = process.env.CHAT_MODEL ?? 'gpt-4o-mini';

// ============================================================================
// Request Schema (same as non-streaming)
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
  context: z.record(z.string(), z.any()).optional(),
});

type ChatRequest = z.infer<typeof ChatSchema>;

// ============================================================================
// SSE Helper Functions
// ============================================================================

/**
 * Send a Server-Sent Event
 * Format: event: <type>\ndata: <json>\n\n
 */
function sendSSE(res: any, event: string, data: any): void {
  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

/**
 * Send error event and close connection
 */
function sendError(res: any, error: string, message: string): void {
  sendSSE(res, 'error', { error, message });
  res.end();
}

// ============================================================================
// Main Streaming Endpoint
// ============================================================================

/**
 * POST /agents/:agent/chat/stream
 * Streaming chat endpoint using Server-Sent Events (SSE)
 *
 * Event sequence:
 * 1. session - Session ID (new or existing)
 * 2. sources - RAG sources retrieved
 * 3. token - Individual tokens as they arrive (multiple events)
 * 4. done - Stream completion with metadata
 * 5. error - Any error that occurs (terminates stream)
 */
router.post('/agents/:agent/chat/stream', async (req, res) => {
  // Step 0: Validate agent parameter early
  const agentParam = req.params.agent;

  if (!isValidAgent(agentParam)) {
    return res.status(400).json({
      ok: false,
      error: 'invalid_agent',
      message: `Unknown agent: ${agentParam}. Valid agents: product_owner, model_builder, teacher_qa, realm_builder, course_instructor`,
    } as AgentErrorResponse);
  }

  const agentConfig = getAgent(agentParam);

  // Step 1: Parse and validate request body
  let args: ChatRequest;
  try {
    args = ChatSchema.parse(req.body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        ok: false,
        error: 'validation_error',
        message: 'Invalid request parameters',
        details: error.issues,
      } as AgentErrorResponse);
    }
    throw error;
  }

  // Step 2: Set up SSE headers BEFORE any async operations
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering

  // CORS headers for streaming (if needed)
  if (req.headers.origin) {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }

  // Keep connection alive with periodic comments (every 30s)
  const keepAliveInterval = setInterval(() => {
    res.write(': keepalive\n\n');
  }, 30000);

  // Cleanup on client disconnect
  req.on('close', () => {
    clearInterval(keepAliveInterval);
  });

  try {
    // Step 3: Get or create session
    let session_id: string;
    if (args.session_id) {
      // Resume existing session
      session_id = args.session_id;
      try {
        await getSession(session_id);
      } catch (error) {
        clearInterval(keepAliveInterval);
        return sendError(res, 'session_not_found', `Session not found: ${session_id}`);
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

    // Send session ID immediately
    sendSSE(res, 'session', { session_id });

    // Step 4: Query RAG using agent's preferred collections
    const chunks = await queryRAG({
      query: args.query,
      topK: args.topK,
      collections: agentConfig.collections,
      filters: args.filters,
    });

    // Step 5: Send sources immediately (before streaming starts)
    const sources = extractSourceReferences(chunks);
    sendSSE(res, 'sources', {
      sources,
      chunks_retrieved: chunks.length,
    });

    // Step 6: Build full context (Core Canon + RAG chunks)
    let fullContext = buildFullContext(chunks);

    // Special handling for Realm Builder if realm context exists
    const session = await getSession(session_id);
    if (agentConfig.id === 'realm_builder' && session.context?.realm_snapshot && session.context?.topic_pack) {
      fullContext = buildCourseInstructorContext(
        session.context.realm_snapshot,
        session.context.topic_pack,
        fullContext
      );
    }

    const systemPrompt = buildSystemPrompt(agentConfig.systemPromptTemplate, fullContext);

    // Step 7: Load recent message history
    const fullHistory = await getSessionHistory(session_id, 100);
    const recentHistory = truncateHistory(fullHistory, 30);

    // Step 8: Build OpenAI messages array
    const messages = buildOpenAIMessages(systemPrompt, recentHistory, args.query);

    // Step 9: Stream OpenAI response
    const stream = await openai.chat.completions.create({
      model: CHAT_MODEL,
      messages,
      temperature: args.temperature,
      max_tokens: args.maxTokens,
      stream: true, // ENABLE STREAMING
    });

    let fullReply = '';
    let tokenCount = 0;

    // Stream tokens as they arrive
    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content;

      if (delta) {
        fullReply += delta;
        tokenCount++;

        // Send token event
        sendSSE(res, 'token', { token: delta });
      }

      // Check for finish reason
      const finishReason = chunk.choices[0]?.finish_reason;
      if (finishReason) {
        // Stream has ended (can be 'stop', 'length', or other reasons)
        if (finishReason === 'length') {
          console.warn(`Stream ended due to max_tokens limit for agent ${agentConfig.id}`);
        }
      }
    }

    // Step 10: Save messages to database
    const metadata = buildMessageMetadata(chunks, args.filters, {
      topK: args.topK,
      temperature: args.temperature,
      maxTokens: args.maxTokens,
    });

    await addMessage(session_id, 'user', args.query, metadata);
    await addMessage(session_id, 'assistant', fullReply);

    // Step 11: Send completion event
    sendSSE(res, 'done', {
      metadata: {
        agent: agentConfig.id,
        model: CHAT_MODEL,
        chunks_retrieved: chunks.length,
        temperature: args.temperature,
        max_tokens: args.maxTokens,
        messages_in_context: recentHistory.length,
        tokens_streamed: tokenCount,
      },
    });

    // Clean up and close connection
    clearInterval(keepAliveInterval);
    res.end();

  } catch (error) {
    console.error('Streaming chat error:', error);

    // Send error event
    clearInterval(keepAliveInterval);

    // Determine error type and message
    let errorType = 'stream_failed';
    let errorMessage = 'Unknown error occurred';

    if (error instanceof Error) {
      errorMessage = error.message;

      // Categorize common errors
      if (error.message.includes('API key')) {
        errorType = 'api_key_error';
      } else if (error.message.includes('rate limit')) {
        errorType = 'rate_limit_error';
      } else if (error.message.includes('timeout')) {
        errorType = 'timeout_error';
      }
    }

    sendError(res, errorType, errorMessage);
  }
});

export default router;
