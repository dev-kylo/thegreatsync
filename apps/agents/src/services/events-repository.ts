/**
 * Events repository for database operations on rag.session_events table
 */

import { pool } from '../db/pool';
import { SessionEvent, MessageRole } from '../types/session';

/**
 * Add a new event to a session
 * @param sessionId - The session ID
 * @param role - The message role ('user', 'assistant', 'system')
 * @param content - The message content
 * @returns The created event with ID and timestamp
 */
export async function addEvent(
  sessionId: number,
  role: MessageRole,
  content: string
): Promise<SessionEvent> {
  const { rows } = await pool.query(
    `INSERT INTO rag.session_events (session_id, role, content)
     VALUES ($1, $2, $3)
     RETURNING id, session_id, ts, role, content`,
    [sessionId, role, content]
  );

  return mapRowToEvent(rows[0]);
}

/**
 * Get recent events for a session
 * @param sessionId - The session ID
 * @param limit - Maximum number of events to return (default: 30)
 * @returns Array of events, ordered by timestamp (oldest first)
 */
export async function getRecentEvents(
  sessionId: number,
  limit: number = 30
): Promise<SessionEvent[]> {
  const { rows } = await pool.query(
    `SELECT id, session_id, ts, role, content
     FROM rag.session_events
     WHERE session_id = $1
     ORDER BY ts DESC
     LIMIT $2`,
    [sessionId, limit]
  );

  // Reverse to get oldest first (conversation order)
  return rows.reverse().map(mapRowToEvent);
}

/**
 * Get all events for a session
 * @param sessionId - The session ID
 * @returns Array of all events, ordered by timestamp (oldest first)
 */
export async function getAllEvents(sessionId: number): Promise<SessionEvent[]> {
  const { rows } = await pool.query(
    `SELECT id, session_id, ts, role, content
     FROM rag.session_events
     WHERE session_id = $1
     ORDER BY ts ASC`,
    [sessionId]
  );

  return rows.map(mapRowToEvent);
}

/**
 * Get event count for a session
 * @param sessionId - The session ID
 * @returns Number of events in the session
 */
export async function getEventCount(sessionId: number): Promise<number> {
  const { rows } = await pool.query(
    `SELECT COUNT(*) as count
     FROM rag.session_events
     WHERE session_id = $1`,
    [sessionId]
  );

  return parseInt(rows[0].count, 10);
}

/**
 * Delete all events for a session (used for cleanup/testing)
 * @param sessionId - The session ID
 */
export async function deleteSessionEvents(sessionId: number): Promise<void> {
  await pool.query(
    `DELETE FROM rag.session_events WHERE session_id = $1`,
    [sessionId]
  );
}

/**
 * Helper function to map database row to SessionEvent
 */
function mapRowToEvent(row: any): SessionEvent {
  return {
    id: row.id,
    session_id: row.session_id,
    ts: row.ts,
    role: row.role,
    content: row.content,
  };
}
