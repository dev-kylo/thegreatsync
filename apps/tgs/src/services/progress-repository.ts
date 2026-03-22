/**
 * Progress repository for database operations on rag.session_progress table
 */

import { pool } from '../db/pool';
import { ProgressRecord } from '../types/agent';

/**
 * Get all finished topics for a user in a realm
 * @param userId - The user ID (nullable)
 * @param realmId - The realm ID
 * @returns Array of finished topic IDs
 */
export async function getFinishedTopics(
  userId: string | undefined,
  realmId: string
): Promise<string[]> {
  const { rows } = await pool.query(
    `SELECT topic
     FROM rag.session_progress
     WHERE user_id IS NOT DISTINCT FROM $1 AND realm_id = $2 AND status = 'finished'
     ORDER BY finished_at ASC`,
    [userId ?? null, realmId]
  );

  return rows.map(row => row.topic);
}

/**
 * Mark a topic as finished for a user in a realm
 * @param userId - The user ID (nullable)
 * @param realmId - The realm ID
 * @param topic - The topic ID
 */
export async function markTopicFinished(
  userId: string | undefined,
  realmId: string,
  topic: string
): Promise<void> {
  await pool.query(
    `INSERT INTO rag.session_progress (user_id, realm_id, topic, status)
     VALUES ($1, $2, $3, 'finished')
     ON CONFLICT (user_id, realm_id, topic) DO UPDATE
     SET status = 'finished', finished_at = now()`,
    [userId ?? null, realmId, topic]
  );
}

/**
 * Get all progress records for a user in a realm
 * @param userId - The user ID (nullable)
 * @param realmId - The realm ID
 * @returns Array of progress records
 */
export async function getUserRealmProgress(
  userId: string | undefined,
  realmId: string
): Promise<ProgressRecord[]> {
  const { rows } = await pool.query(
    `SELECT id, user_id, realm_id, topic, status, finished_at
     FROM rag.session_progress
     WHERE user_id IS NOT DISTINCT FROM $1 AND realm_id = $2
     ORDER BY finished_at ASC`,
    [userId ?? null, realmId]
  );

  return rows.map(mapRowToProgressRecord);
}

/**
 * Check if a specific topic is finished
 * @param userId - The user ID (nullable)
 * @param realmId - The realm ID
 * @param topic - The topic ID
 * @returns true if topic is marked as finished
 */
export async function isTopicFinished(
  userId: string | undefined,
  realmId: string,
  topic: string
): Promise<boolean> {
  const { rows } = await pool.query(
    `SELECT EXISTS(
      SELECT 1 FROM rag.session_progress
      WHERE user_id IS NOT DISTINCT FROM $1
        AND realm_id = $2
        AND topic = $3
        AND status = 'finished'
    ) as finished`,
    [userId ?? null, realmId, topic]
  );

  return rows[0].finished;
}

/**
 * Get progress summary for a user across all realms
 * @param userId - The user ID (nullable)
 * @returns Array of progress records
 */
export async function getUserProgress(
  userId: string | undefined
): Promise<ProgressRecord[]> {
  const { rows } = await pool.query(
    `SELECT id, user_id, realm_id, topic, status, finished_at
     FROM rag.session_progress
     WHERE user_id IS NOT DISTINCT FROM $1
     ORDER BY finished_at ASC`,
    [userId ?? null]
  );

  return rows.map(mapRowToProgressRecord);
}

/**
 * Delete progress for a user in a realm (used for reset/testing)
 * @param userId - The user ID (nullable)
 * @param realmId - The realm ID
 */
export async function resetRealmProgress(
  userId: string | undefined,
  realmId: string
): Promise<void> {
  await pool.query(
    `DELETE FROM rag.session_progress
     WHERE user_id IS NOT DISTINCT FROM $1 AND realm_id = $2`,
    [userId ?? null, realmId]
  );
}

/**
 * Helper function to map database row to ProgressRecord
 */
function mapRowToProgressRecord(row: any): ProgressRecord {
  return {
    id: row.id,
    user_id: row.user_id,
    realm_id: row.realm_id,
    topic: row.topic,
    status: row.status,
    finished_at: row.finished_at,
  };
}
