/**
 * Course Instructor Routes
 * Specialized endpoints for teaching Strapi course lessons
 */

import { Router } from 'express';
import { z } from 'zod';
import OpenAI from 'openai';
import {
  startLessonSession,
  getLessonProgress,
  finishLessonSession,
} from '../agents/course-instructor';
import { getAgent } from '../config/agents';
import { queryRAG } from '../services/rag-service';
import {
  getSession,
  addMessage,
  getSessionHistory,
  updateSessionContext,
} from '../services/agent-session-service';
import {
  buildFullContext,
  buildSystemPrompt,
  buildOpenAIMessages,
  buildMessageMetadata,
  extractSourceReferences,
  truncateHistory,
} from '../services/context-builder';
import { extractPageText } from '../services/strapi-client';
import type { AgentChatResponse, AgentErrorResponse } from '../types/agent';

const router = Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const CHAT_MODEL = process.env.CHAT_MODEL ?? 'gpt-4o-mini';

// ============================================================================
// Request Schemas
// ============================================================================

const StartLessonSchema = z.object({
  user_id: z.string().uuid().optional(),
  course_id: z.number().int().positive(),
  subchapter_id: z.number().int().positive(),
});

const ChatSchema = z.object({
  session_id: z.string().uuid(),
  message: z.string().min(1),
  topK: z.number().int().min(1).max(50).default(8),
  temperature: z.number().min(0).max(2).default(0.7),
  maxTokens: z.number().int().min(1).max(4000).default(1000),
});

const SessionIdSchema = z.object({
  session_id: z.string().uuid(),
});

// ============================================================================
// Specialized Course Instructor Endpoints
// ============================================================================

/**
 * POST /course-instructor/start
 * Start a new lesson session
 */
router.post('/course-instructor/start', async (req, res) => {
  try {
    const args = StartLessonSchema.parse(req.body);

    const result = await startLessonSession(
      args.user_id,
      args.course_id,
      args.subchapter_id
    );

    res.json({
      ok: true,
      session_id: result.session_id,
      subchapter: result.subchapter,
      first_page: result.first_page,
      total_pages: result.total_pages,
      message: result.message,
    });
  } catch (error) {
    console.error('Start lesson error:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        ok: false,
        error: 'validation_error',
        message: 'Invalid request parameters',
        details: error.issues,
      } as AgentErrorResponse);
    }

    res.status(500).json({
      ok: false,
      error: 'start_lesson_failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    } as AgentErrorResponse);
  }
});

/**
 * POST /course-instructor/chat
 * Chat within an active lesson session
 */
router.post('/course-instructor/chat', async (req, res) => {
  try {
    const args = ChatSchema.parse(req.body);
    const agentConfig = getAgent('course_instructor');

    // Validate session exists and is a lesson session
    const session = await getSession(args.session_id);
    if (session.agent !== 'course_instructor') {
      return res.status(400).json({
        ok: false,
        error: 'invalid_session',
        message: `Session ${args.session_id} is not a Course Instructor session`,
      } as AgentErrorResponse);
    }

    if (session.ended_at) {
      return res.status(400).json({
        ok: false,
        error: 'session_ended',
        message: 'This lesson session has already ended',
      } as AgentErrorResponse);
    }

    // Get current lesson progress
    const progress = await getLessonProgress(args.session_id);
    const currentPageText = extractPageText(progress.current_page);

    // Query RAG for additional context
    const chunks = await queryRAG({
      query: args.message,
      topK: args.topK,
      collections: agentConfig.collections,
      filters: {
        domain: session.domain,
      },
    });

    // Build context: Core Canon + Current Page + RAG results
    const coreAndRAG = buildFullContext(chunks);
    const pageContext = `Current Page: ${progress.current_page.title}\n\n${currentPageText}`;
    const fullContext = `${coreAndRAG}\n\n---\n\n=== CURRENT LESSON PAGE ===\n\n${pageContext}`;

    const systemPrompt = buildSystemPrompt(agentConfig.systemPromptTemplate, fullContext);

    // Load recent conversation history
    const fullHistory = await getSessionHistory(args.session_id, 100);
    const recentHistory = truncateHistory(fullHistory, 30);

    // Build OpenAI messages
    const messages = buildOpenAIMessages(systemPrompt, recentHistory, args.message);

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: CHAT_MODEL,
      messages,
      temperature: args.temperature,
      max_tokens: args.maxTokens,
    });

    const reply =
      completion.choices[0]?.message?.content ??
      'I apologize, but I need a moment to gather my thoughts. Could you rephrase that?';

    // Save messages
    const metadata = buildMessageMetadata(chunks, undefined, {
      topK: args.topK,
      temperature: args.temperature,
      maxTokens: args.maxTokens,
      current_page_id: progress.current_page.id,
      current_page_index: progress.current_page_index,
    });

    await addMessage(args.session_id, 'user', args.message, metadata);
    await addMessage(args.session_id, 'assistant', reply);

    // Return response with progress info
    const response: AgentChatResponse = {
      ok: true,
      reply,
      session_id: args.session_id,
      sources: extractSourceReferences(chunks),
      metadata: {
        agent: 'course_instructor',
        model: CHAT_MODEL,
        chunks_retrieved: chunks.length,
        temperature: args.temperature,
        max_tokens: args.maxTokens,
        messages_in_context: recentHistory.length,
      },
    };

    // Add lesson progress info separately
    res.json({
      ...response,
      lesson_progress: {
        current_page: progress.current_page.title,
        current_page_index: progress.current_page_index,
        total_pages: progress.total_pages,
        completed: progress.completed,
      },
    });
  } catch (error) {
    console.error('Course instructor chat error:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        ok: false,
        error: 'validation_error',
        message: 'Invalid request parameters',
        details: error.issues,
      } as AgentErrorResponse);
    }

    res.status(500).json({
      ok: false,
      error: 'chat_failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    } as AgentErrorResponse);
  }
});

/**
 * POST /course-instructor/next-page
 * Advance to the next page in the lesson
 */
router.post('/course-instructor/next-page', async (req, res) => {
  try {
    const { session_id } = SessionIdSchema.parse(req.body);

    // Get current progress
    const progress = await getLessonProgress(session_id);

    if (progress.completed) {
      return res.status(400).json({
        ok: false,
        error: 'lesson_completed',
        message: 'All pages have been completed. Use /finish to end the lesson.',
      } as AgentErrorResponse);
    }

    // Update session context to advance to next page
    const session = await getSession(session_id);
    const nextPageIndex = progress.current_page_index + 1;

    await updateSessionContext(session_id, {
      ...session.context,
      current_page_index: nextPageIndex,
    });

    // Get updated progress
    const updatedProgress = await getLessonProgress(session_id);
    const nextPageText = extractPageText(updatedProgress.current_page);

    const message = `Moving to page ${nextPageIndex + 1} of ${updatedProgress.total_pages}: **${updatedProgress.current_page.title}**\n\n${nextPageText.substring(0, 300)}...\n\nWhat questions do you have about this?`;

    // Save advancement message
    await addMessage(session_id, 'system', message, {
      page_advanced: true,
      previous_page_index: progress.current_page_index,
      new_page_index: nextPageIndex,
    });

    res.json({
      ok: true,
      session_id,
      current_page: updatedProgress.current_page,
      current_page_index: updatedProgress.current_page_index,
      total_pages: updatedProgress.total_pages,
      completed: updatedProgress.completed,
      message,
    });
  } catch (error) {
    console.error('Next page error:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        ok: false,
        error: 'validation_error',
        message: 'Invalid request parameters',
        details: error.issues,
      } as AgentErrorResponse);
    }

    res.status(500).json({
      ok: false,
      error: 'next_page_failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    } as AgentErrorResponse);
  }
});

/**
 * POST /course-instructor/finish
 * Finish the lesson and generate reflection
 */
router.post('/course-instructor/finish', async (req, res) => {
  try {
    const { session_id } = SessionIdSchema.parse(req.body);

    const result = await finishLessonSession(session_id);

    res.json({
      ok: true,
      session_id: result.session_id,
      reflection: result.reflection,
      concepts_learned: result.concepts_learned,
      chunk_uids: result.chunk_uids,
      message: result.message,
    });
  } catch (error) {
    console.error('Finish lesson error:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        ok: false,
        error: 'validation_error',
        message: 'Invalid request parameters',
        details: error.issues,
      } as AgentErrorResponse);
    }

    res.status(500).json({
      ok: false,
      error: 'finish_lesson_failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    } as AgentErrorResponse);
  }
});

/**
 * GET /course-instructor/session/:session_id
 * Get lesson session details and current progress
 */
router.get('/course-instructor/session/:session_id', async (req, res) => {
  try {
    const session = await getSession(req.params.session_id);

    if (session.agent !== 'course_instructor') {
      return res.status(400).json({
        ok: false,
        error: 'invalid_session',
        message: 'Not a Course Instructor session',
      } as AgentErrorResponse);
    }

    const progress = await getLessonProgress(req.params.session_id);

    res.json({
      ok: true,
      session,
      progress: {
        current_page: progress.current_page,
        current_page_index: progress.current_page_index,
        total_pages: progress.total_pages,
        completed: progress.completed,
      },
    });
  } catch (error) {
    res.status(404).json({
      ok: false,
      error: 'session_not_found',
      message: error instanceof Error ? error.message : 'Session not found',
    } as AgentErrorResponse);
  }
});

export default router;
