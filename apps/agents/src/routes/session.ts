/**
 * Session API routes for realm-based learning
 */

import { Router } from 'express';
import { z } from 'zod';
import {
  startOrResumeSession,
  chatTurn,
  finishSession,
} from '../services/session-orchestrator';
import { getSession, getUserRealmSessions } from '../services/session-repository';
import { getAllEvents } from '../services/events-repository';
import { getUserRealmProgress } from '../services/progress-repository';
import { listRealms, loadRealm } from '../services/data-loader';

const router = Router();

// ============================================================================
// Validation Schemas
// ============================================================================

const StartSessionSchema = z.object({
  realm_id: z.string().min(1),
  user_id: z.string().optional(),
});

const ChatSchema = z.object({
  session_id: z.number().int().positive(),
  message: z.string().min(1),
});

const FinishSessionSchema = z.object({
  session_id: z.number().int().positive(),
});

// ============================================================================
// Routes
// ============================================================================

/**
 * POST /session/start
 * Start or resume a learning session in a realm
 */
router.post('/session/start', async (req, res) => {
  try {
    const body = StartSessionSchema.parse(req.body);

    const response = await startOrResumeSession(body.user_id, body.realm_id);

    res.json(response);
  } catch (error) {
    console.error('Session start error:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        ok: false,
        error: 'validation_error',
        details: error.errors,
      });
    }

    if (error instanceof Error) {
      // Check for specific error messages
      if (error.message.includes('not found') || error.message.includes('completed')) {
        return res.status(404).json({
          ok: false,
          error: error.message,
        });
      }
    }

    res.status(500).json({
      ok: false,
      error: 'session_start_failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /session/chat
 * Send a message in an active session
 */
router.post('/session/chat', async (req, res) => {
  try {
    const body = ChatSchema.parse(req.body);

    const response = await chatTurn(body.session_id, body.message);

    res.json(response);
  } catch (error) {
    console.error('Session chat error:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        ok: false,
        error: 'validation_error',
        details: error.errors,
      });
    }

    if (error instanceof Error) {
      if (error.message.includes('not found') || error.message.includes('not active')) {
        return res.status(404).json({
          ok: false,
          error: error.message,
        });
      }
    }

    res.status(500).json({
      ok: false,
      error: 'chat_failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /session/finish
 * Finish a session and extract the metaphor map artifact
 */
router.post('/session/finish', async (req, res) => {
  try {
    const body = FinishSessionSchema.parse(req.body);

    const response = await finishSession(body.session_id);

    res.json(response);
  } catch (error) {
    console.error('Session finish error:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        ok: false,
        error: 'validation_error',
        details: error.errors,
      });
    }

    if (error instanceof Error) {
      if (error.message.includes('not found') || error.message.includes('not active')) {
        return res.status(404).json({
          ok: false,
          error: error.message,
        });
      }
    }

    res.status(500).json({
      ok: false,
      error: 'finish_failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /session/:id
 * Get session details
 */
router.get('/session/:id', async (req, res) => {
  try {
    const sessionId = parseInt(req.params.id, 10);

    if (isNaN(sessionId)) {
      return res.status(400).json({
        ok: false,
        error: 'invalid_session_id',
      });
    }

    const session = await getSession(sessionId);

    if (!session) {
      return res.status(404).json({
        ok: false,
        error: 'session_not_found',
      });
    }

    res.json({ ok: true, session });
  } catch (error) {
    console.error('Get session error:', error);

    res.status(500).json({
      ok: false,
      error: 'get_session_failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /session/:id/history
 * Get conversation history for a session
 */
router.get('/session/:id/history', async (req, res) => {
  try {
    const sessionId = parseInt(req.params.id, 10);

    if (isNaN(sessionId)) {
      return res.status(400).json({
        ok: false,
        error: 'invalid_session_id',
      });
    }

    const events = await getAllEvents(sessionId);

    res.json({ ok: true, events });
  } catch (error) {
    console.error('Get history error:', error);

    res.status(500).json({
      ok: false,
      error: 'get_history_failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /realms
 * List available realms
 */
router.get('/realms', async (req, res) => {
  try {
    const realmIds = listRealms();

    const realms = realmIds.map(id => {
      try {
        return loadRealm(id);
      } catch {
        return null;
      }
    }).filter(r => r !== null);

    res.json({ ok: true, realms });
  } catch (error) {
    console.error('List realms error:', error);

    res.status(500).json({
      ok: false,
      error: 'list_realms_failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /realms/:id/progress
 * Get user progress in a realm
 * Query param: user_id (optional)
 */
router.get('/realms/:id/progress', async (req, res) => {
  try {
    const realmId = req.params.id;
    const userId = req.query.user_id as string | undefined;

    const progress = await getUserRealmProgress(userId, realmId);
    const sessions = await getUserRealmSessions(userId, realmId);

    res.json({
      ok: true,
      realm_id: realmId,
      user_id: userId ?? null,
      completed_topics: progress.map(p => p.topic),
      sessions: sessions.length,
      progress,
    });
  } catch (error) {
    console.error('Get progress error:', error);

    res.status(500).json({
      ok: false,
      error: 'get_progress_failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
