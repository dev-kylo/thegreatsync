/**
 * Agent Sessions Route
 * GET /agents/:agent/sessions - Get all sessions for an agent (optionally filtered by user)
 * GET /agents/:agent/session/:sessionId - Get specific session details
 * GET /agents/:agent/session/:sessionId/history - Get session message history
 */

import { Router } from 'express';
import { z } from 'zod';
import { isValidAgent, getAgent } from '../config/agents';
import {
  getUserSessions,
  getSession,
  getSessionHistory,
} from '../services/agent-session-service';
import type { AgentErrorResponse } from '../types/agent';

const router = Router();

// ============================================================================
// Request Schema
// ============================================================================

const SessionsQuerySchema = z.object({
  user_id: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

const HistoryQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

// ============================================================================
// GET /agents/:agent/sessions
// Get all sessions for an agent (optionally filtered by user)
// ============================================================================

router.get('/agents/:agent/sessions', async (req, res) => {
  // Validate agent parameter
  const agentParam = req.params.agent;

  if (!isValidAgent(agentParam)) {
    return res.status(400).json({
      ok: false,
      error: 'invalid_agent',
      message: `Unknown agent: ${agentParam}`,
    } as AgentErrorResponse);
  }

  const agentConfig = getAgent(agentParam);

  // Parse query parameters
  let query;
  try {
    query = SessionsQuerySchema.parse(req.query);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        ok: false,
        error: 'validation_error',
        message: 'Invalid query parameters',
        details: error.issues,
      } as AgentErrorResponse);
    }
    throw error;
  }

  try {
    // Get sessions for this agent
    const sessions = query.user_id
      ? await getUserSessions(query.user_id, agentConfig.id, query.limit)
      : []; // Don't return all sessions without user_id for privacy

    // Transform to include first message preview
    const sessionsWithPreview = sessions.map((session) => ({
      id: session.id,
      user_id: session.user_id,
      agent: session.agent,
      session_type: session.session_type,
      topic: session.topic,
      domain: session.domain,
      started_at: session.started_at,
      ended_at: session.ended_at,
      // Don't expose full context, summary, or output for list view
    }));

    res.json({
      ok: true,
      sessions: sessionsWithPreview,
      count: sessionsWithPreview.length,
    });
  } catch (error) {
    console.error('Failed to fetch sessions:', error);
    res.status(500).json({
      ok: false,
      error: 'fetch_failed',
      message: error instanceof Error ? error.message : 'Failed to fetch sessions',
    } as AgentErrorResponse);
  }
});

// ============================================================================
// GET /agents/:agent/session/:sessionId
// Get specific session details
// ============================================================================

router.get('/agents/:agent/session/:sessionId', async (req, res) => {
  // Validate agent parameter
  const agentParam = req.params.agent;

  if (!isValidAgent(agentParam)) {
    return res.status(400).json({
      ok: false,
      error: 'invalid_agent',
      message: `Unknown agent: ${agentParam}`,
    } as AgentErrorResponse);
  }

  const { sessionId } = req.params;

  try {
    const session = await getSession(sessionId);

    // Verify session belongs to this agent
    if (session.agent !== agentParam) {
      return res.status(400).json({
        ok: false,
        error: 'agent_mismatch',
        message: `Session ${sessionId} does not belong to agent ${agentParam}`,
      } as AgentErrorResponse);
    }

    res.json({
      ok: true,
      session,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      return res.status(404).json({
        ok: false,
        error: 'session_not_found',
        message: `Session not found: ${sessionId}`,
      } as AgentErrorResponse);
    }

    console.error('Failed to fetch session:', error);
    res.status(500).json({
      ok: false,
      error: 'fetch_failed',
      message: error instanceof Error ? error.message : 'Failed to fetch session',
    } as AgentErrorResponse);
  }
});

// ============================================================================
// GET /agents/:agent/session/:sessionId/history
// Get session message history
// ============================================================================

router.get('/agents/:agent/session/:sessionId/history', async (req, res) => {
  // Validate agent parameter
  const agentParam = req.params.agent;

  if (!isValidAgent(agentParam)) {
    return res.status(400).json({
      ok: false,
      error: 'invalid_agent',
      message: `Unknown agent: ${agentParam}`,
    } as AgentErrorResponse);
  }

  const { sessionId } = req.params;

  // Parse query parameters
  let query;
  try {
    query = HistoryQuerySchema.parse(req.query);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        ok: false,
        error: 'validation_error',
        message: 'Invalid query parameters',
        details: error.issues,
      } as AgentErrorResponse);
    }
    throw error;
  }

  try {
    // Verify session exists and belongs to this agent
    const session = await getSession(sessionId);

    if (session.agent !== agentParam) {
      return res.status(400).json({
        ok: false,
        error: 'agent_mismatch',
        message: `Session ${sessionId} does not belong to agent ${agentParam}`,
      } as AgentErrorResponse);
    }

    // Get message history
    const messages = await getSessionHistory(sessionId, query.limit);

    res.json({
      ok: true,
      messages,
      count: messages.length,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      return res.status(404).json({
        ok: false,
        error: 'session_not_found',
        message: `Session not found: ${sessionId}`,
      } as AgentErrorResponse);
    }

    console.error('Failed to fetch session history:', error);
    res.status(500).json({
      ok: false,
      error: 'fetch_failed',
      message: error instanceof Error ? error.message : 'Failed to fetch session history',
    } as AgentErrorResponse);
  }
});

export default router;
