/**
 * Agent Session Service
 *
 * CRITICAL: This is the ONLY layer that writes to rag.sessions and rag.session_messages
 * All other code (including Course Instructor agent) MUST call through this service.
 */

import { q } from '../db/pool';
import type {
  AgentSession,
  CreateSessionInput,
  UpdateSessionInput,
  SessionMessage,
  CreateMessageInput,
  MessageRole,
} from '../types/agent';
import type { AgentId, SessionType } from '../config/agents';

// ============================================================================
// Session Management
// ============================================================================

/**
 * Get or create a session for an agent
 * If user has an active session for this agent/topic, return it
 * Otherwise create a new one
 */
export async function getOrCreateSession(
  agent: AgentId,
  user_id?: string,
  topic?: string,
  domain?: string,
  session_type?: SessionType,
  context?: Record<string, any>
): Promise<string> {
  // Try to find existing active session
  if (topic) {
    const { rows } = await q(
      `SELECT id FROM rag.sessions
       WHERE user_id IS NOT DISTINCT FROM $1 AND agent = $2 AND topic = $3 AND ended_at IS NULL
       ORDER BY started_at DESC LIMIT 1`,
      [user_id || null, agent, topic]
    );

    if (rows.length > 0) {
      return rows[0].id;
    }
  }

  // Create new session
  const { rows } = await q(
    `INSERT INTO rag.sessions (user_id, agent, session_type, topic, domain, context)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id`,
    [
      user_id || null,
      agent,
      session_type || null,
      topic || null,
      domain || null,
      context ? JSON.stringify(context) : null,
    ]
  );

  return rows[0].id;
}

/**
 * Create a new session (without checking for existing)
 */
export async function createSession(input: CreateSessionInput): Promise<string> {
  const { rows } = await q(
    `INSERT INTO rag.sessions (user_id, agent, session_type, topic, domain, context)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id`,
    [
      input.user_id || null,
      input.agent,
      input.session_type,
      input.topic || null,
      input.domain || null,
      input.context ? JSON.stringify(input.context) : null,
    ]
  );

  return rows[0].id;
}

/**
 * Get session by ID
 * @throws Error if session not found
 */
export async function getSession(session_id: string): Promise<AgentSession> {
  const { rows } = await q(
    `SELECT id, user_id, agent, session_type, topic, domain, context,
            started_at, ended_at, summary, output, score, vectorized
     FROM rag.sessions
     WHERE id = $1`,
    [session_id]
  );

  if (rows.length === 0) {
    throw new Error(`Session not found: ${session_id}`);
  }

  return rows[0] as AgentSession;
}

/**
 * Get active session for user/agent/topic
 * Returns null if no active session found
 */
export async function getActiveSession(
  agent: AgentId,
  user_id?: string,
  topic?: string
): Promise<AgentSession | null> {
  const { rows } = await q(
    `SELECT id, user_id, agent, session_type, topic, domain, context,
            started_at, ended_at, summary, output, score, vectorized
     FROM rag.sessions
     WHERE agent = $1 AND ($2::text IS NULL OR user_id = $2) AND ($3::text IS NULL OR topic = $3)
       AND ended_at IS NULL
     ORDER BY started_at DESC LIMIT 1`,
    [agent, user_id || null, topic || null]
  );

  if (rows.length === 0) {
    return null;
  }

  return rows[0] as AgentSession;
}

/**
 * Update session context
 */
export async function updateSessionContext(
  session_id: string,
  context: Record<string, any>
): Promise<void> {
  await q(
    `UPDATE rag.sessions SET context = $2 WHERE id = $1`,
    [session_id, JSON.stringify(context)]
  );
}

/**
 * Update session fields
 */
export async function updateSession(
  session_id: string,
  updates: UpdateSessionInput
): Promise<void> {
  const fields: string[] = [];
  const values: any[] = [];
  let paramIndex = 2;

  if (updates.ended_at !== undefined) {
    fields.push(`ended_at = $${paramIndex++}`);
    values.push(updates.ended_at);
  }
  if (updates.summary !== undefined) {
    fields.push(`summary = $${paramIndex++}`);
    values.push(updates.summary);
  }
  if (updates.output !== undefined) {
    fields.push(`output = $${paramIndex++}`);
    values.push(JSON.stringify(updates.output));
  }
  if (updates.score !== undefined) {
    fields.push(`score = $${paramIndex++}`);
    values.push(updates.score);
  }
  if (updates.vectorized !== undefined) {
    fields.push(`vectorized = $${paramIndex++}`);
    values.push(updates.vectorized);
  }

  if (fields.length === 0) {
    return; // Nothing to update
  }

  await q(
    `UPDATE rag.sessions SET ${fields.join(', ')} WHERE id = $1`,
    [session_id, ...values]
  );
}

/**
 * End a session with summary and output
 */
export async function endSession(
  session_id: string,
  summary: string,
  output?: Record<string, any>,
  score?: number
): Promise<void> {
  await q(
    `UPDATE rag.sessions
     SET ended_at = now(), summary = $2, output = $3, score = $4
     WHERE id = $1`,
    [session_id, summary, output ? JSON.stringify(output) : null, score || null]
  );
}

/**
 * Mark session as vectorized
 */
export async function markSessionVectorized(session_id: string): Promise<void> {
  await q(
    `UPDATE rag.sessions SET vectorized = true WHERE id = $1`,
    [session_id]
  );
}

/**
 * Get sessions pending vectorization
 */
export async function getPendingVectorization(): Promise<AgentSession[]> {
  const { rows } = await q(
    `SELECT id, user_id, agent, session_type, topic, domain, context,
            started_at, ended_at, summary, output, score, vectorized
     FROM rag.sessions
     WHERE vectorized = false AND output IS NOT NULL AND ended_at IS NOT NULL
     ORDER BY ended_at ASC`
  );

  return rows as AgentSession[];
}

// ============================================================================
// Message Management
// ============================================================================

/**
 * Add a message to a session
 * Returns the message ID
 */
export async function addMessage(
  session_id: string,
  role: MessageRole,
  content: string,
  metadata?: Record<string, any>,
  attachments?: Record<string, any>
): Promise<string> {
  const { rows } = await q(
    `INSERT INTO rag.session_messages (session_id, role, content, metadata, attachments)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id`,
    [
      session_id,
      role,
      content,
      metadata ? JSON.stringify(metadata) : null,
      attachments ? JSON.stringify(attachments) : null,
    ]
  );

  return rows[0].id;
}

/**
 * Create a message (alternative API)
 */
export async function createMessage(input: CreateMessageInput): Promise<string> {
  return addMessage(
    input.session_id,
    input.role,
    input.content,
    input.metadata,
    input.attachments
  );
}

/**
 * Get session history (recent messages)
 * @param session_id - Session ID
 * @param limit - Maximum number of messages to return (default: 30)
 * @returns Array of messages ordered by creation time (oldest first)
 */
export async function getSessionHistory(
  session_id: string,
  limit: number = 30
): Promise<SessionMessage[]> {
  const { rows } = await q(
    `SELECT id, session_id, role, content, attachments, metadata, created_at
     FROM rag.session_messages
     WHERE session_id = $1
     ORDER BY created_at DESC
     LIMIT $2`,
    [session_id, limit]
  );

  // Reverse to get chronological order (oldest first)
  return (rows as SessionMessage[]).reverse();
}

/**
 * Get full conversation history for a session
 * @param session_id - Session ID
 * @returns All messages in chronological order
 */
export async function getFullHistory(session_id: string): Promise<SessionMessage[]> {
  const { rows } = await q(
    `SELECT id, session_id, role, content, attachments, metadata, created_at
     FROM rag.session_messages
     WHERE session_id = $1
     ORDER BY created_at ASC`,
    [session_id]
  );

  return rows as SessionMessage[];
}

/**
 * Delete all messages for a session (CASCADE from session deletion handles this automatically)
 */
export async function deleteSessionMessages(session_id: string): Promise<void> {
  await q(`DELETE FROM rag.session_messages WHERE session_id = $1`, [session_id]);
}

// ============================================================================
// Session Queries
// ============================================================================

/**
 * Get all sessions for a user
 */
export async function getUserSessions(
  user_id: string,
  agent?: AgentId,
  limit: number = 50
): Promise<AgentSession[]> {
  const query = agent
    ? `SELECT id, user_id, agent, session_type, topic, domain, context,
              started_at, ended_at, summary, output, score, vectorized
       FROM rag.sessions
       WHERE user_id = $1 AND agent = $2
       ORDER BY started_at DESC LIMIT $3`
    : `SELECT id, user_id, agent, session_type, topic, domain, context,
              started_at, ended_at, summary, output, score, vectorized
       FROM rag.sessions
       WHERE user_id = $1
       ORDER BY started_at DESC LIMIT $2`;

  const params = agent ? [user_id, agent, limit] : [user_id, limit];
  const { rows } = await q(query, params);

  return rows as AgentSession[];
}

/**
 * Delete a session and all its messages
 */
export async function deleteSession(session_id: string): Promise<void> {
  await q(`DELETE FROM rag.sessions WHERE id = $1`, [session_id]);
  // Messages are deleted automatically via CASCADE
}
