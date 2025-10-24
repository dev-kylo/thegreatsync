/**
 * Session repository for database operations on rag.sessions table
 */

import { pool } from '../db/pool';
import {
  SessionData,
  CreateSessionInput,
  UpdateSessionInput,
  SessionArtifact,
} from '../types/session';

/**
 * Create a new session
 * @param input - Session creation data
 * @returns The created session with ID
 */
export async function createSession(input: CreateSessionInput): Promise<SessionData> {
  const { rows } = await pool.query(
    `INSERT INTO rag.sessions (user_id, realm_id, topic, status, topic_pack, realm_snapshot)
     VALUES ($1, $2, $3, 'active', $4, $5)
     RETURNING id, user_id, realm_id, topic, status, started_at, finished_at,
               legend, rules, script, red_flags, score, topic_pack, realm_snapshot`,
    [
      input.user_id ?? null,
      input.realm_id,
      input.topic,
      JSON.stringify(input.topic_pack),
      JSON.stringify(input.realm_snapshot),
    ]
  );

  return mapRowToSessionData(rows[0]);
}

/**
 * Get a session by ID
 * @param sessionId - The session ID
 * @returns The session data or null if not found
 */
export async function getSession(sessionId: number): Promise<SessionData | null> {
  const { rows } = await pool.query(
    `SELECT id, user_id, realm_id, topic, status, started_at, finished_at,
            legend, rules, script, red_flags, score, topic_pack, realm_snapshot
     FROM rag.sessions
     WHERE id = $1`,
    [sessionId]
  );

  if (rows.length === 0) {
    return null;
  }

  return mapRowToSessionData(rows[0]);
}

/**
 * Get the active session for a user in a realm
 * @param userId - The user ID (nullable)
 * @param realmId - The realm ID
 * @returns The active session or null if none exists
 */
export async function getActiveSession(
  userId: string | undefined,
  realmId: string
): Promise<SessionData | null> {
  const { rows } = await pool.query(
    `SELECT id, user_id, realm_id, topic, status, started_at, finished_at,
            legend, rules, script, red_flags, score, topic_pack, realm_snapshot
     FROM rag.sessions
     WHERE user_id IS NOT DISTINCT FROM $1 AND realm_id = $2 AND status = 'active'
     ORDER BY started_at DESC
     LIMIT 1`,
    [userId ?? null, realmId]
  );

  if (rows.length === 0) {
    return null;
  }

  return mapRowToSessionData(rows[0]);
}

/**
 * Update a session
 * @param sessionId - The session ID
 * @param updates - Fields to update
 */
export async function updateSession(
  sessionId: number,
  updates: UpdateSessionInput
): Promise<void> {
  const fields: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (updates.status !== undefined) {
    fields.push(`status = $${paramIndex++}`);
    values.push(updates.status);
  }

  if (updates.finished_at !== undefined) {
    fields.push(`finished_at = $${paramIndex++}`);
    values.push(updates.finished_at);
  }

  if (updates.legend !== undefined) {
    fields.push(`legend = $${paramIndex++}`);
    values.push(JSON.stringify(updates.legend));
  }

  if (updates.rules !== undefined) {
    fields.push(`rules = $${paramIndex++}`);
    values.push(updates.rules);
  }

  if (updates.script !== undefined) {
    fields.push(`script = $${paramIndex++}`);
    values.push(updates.script);
  }

  if (updates.red_flags !== undefined) {
    fields.push(`red_flags = $${paramIndex++}`);
    values.push(updates.red_flags);
  }

  if (updates.score !== undefined) {
    fields.push(`score = $${paramIndex++}`);
    values.push(updates.score);
  }

  if (fields.length === 0) {
    return; // Nothing to update
  }

  values.push(sessionId); // Add sessionId as last parameter
  const query = `UPDATE rag.sessions SET ${fields.join(', ')} WHERE id = $${paramIndex}`;

  await pool.query(query, values);
}

/**
 * Finish a session with the final artifact
 * @param sessionId - The session ID
 * @param artifact - The completed metaphor map artifact
 */
export async function finishSession(
  sessionId: number,
  artifact: SessionArtifact
): Promise<void> {
  await pool.query(
    `UPDATE rag.sessions
     SET status = 'finished',
         finished_at = now(),
         legend = $2,
         rules = $3,
         script = $4,
         red_flags = $5,
         score = $6
     WHERE id = $1`,
    [
      sessionId,
      JSON.stringify(artifact.legend),
      artifact.rules,
      artifact.script,
      artifact.red_flags,
      artifact.score ?? null,
    ]
  );
}

/**
 * Get all sessions for a user in a realm
 * @param userId - The user ID (nullable)
 * @param realmId - The realm ID
 * @returns Array of sessions
 */
export async function getUserRealmSessions(
  userId: string | undefined,
  realmId: string
): Promise<SessionData[]> {
  const { rows } = await pool.query(
    `SELECT id, user_id, realm_id, topic, status, started_at, finished_at,
            legend, rules, script, red_flags, score, topic_pack, realm_snapshot
     FROM rag.sessions
     WHERE user_id IS NOT DISTINCT FROM $1 AND realm_id = $2
     ORDER BY started_at DESC`,
    [userId ?? null, realmId]
  );

  return rows.map(mapRowToSessionData);
}

/**
 * Helper function to map database row to SessionData
 */
function mapRowToSessionData(row: any): SessionData {
  return {
    id: row.id,
    user_id: row.user_id,
    realm_id: row.realm_id,
    topic: row.topic,
    status: row.status,
    started_at: row.started_at,
    finished_at: row.finished_at,
    legend: row.legend,
    rules: row.rules,
    script: row.script,
    red_flags: row.red_flags,
    score: row.score,
    topic_pack: row.topic_pack,
    realm_snapshot: row.realm_snapshot,
  };
}
