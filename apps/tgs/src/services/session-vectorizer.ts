/**
 * Session vectorizer - indexes completed session artifacts into rag.chunks
 * Updated for multi-agent architecture - reads from sessions.output JSONB
 */

import OpenAI from 'openai';
import crypto from 'node:crypto';
import { pool } from '../db/pool';
import { SessionArtifact, TopicPack } from '../types/session';
import { getSession, markSessionVectorized } from './agent-session-service';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const EMBED_MODEL = process.env.EMBED_MODEL ?? 'text-embedding-3-small';

/**
 * Vectorize and index a session artifact
 * Reads artifact from sessions.output JSONB and context from sessions.context JSONB
 *
 * @param sessionId - The session ID (UUID)
 * @param artifactOverride - Optional: provide artifact directly (otherwise read from DB)
 * @returns Array of chunk UIDs created
 */
export async function vectorizeSessionArtifact(
  sessionId: string,
  artifactOverride?: SessionArtifact
): Promise<string[]> {
  // Get session data from database
  const session = await getSession(sessionId);

  // Extract artifact from output JSONB or use override
  const artifact: SessionArtifact = artifactOverride || (session.output as SessionArtifact);

  if (!artifact || !artifact.script) {
    throw new Error(`Session ${sessionId} has no artifact to vectorize`);
  }

  // Extract context data (realm_id, topic_pack)
  const context = session.context || {};
  const topicPack = context.topic_pack as TopicPack | undefined;
  const realmId = context.realm_id as string | undefined;

  // Build content text: script + rules + red flags
  const rulesText = artifact.rules && artifact.rules.length > 0
    ? `\n\n=== RULES ===\n${artifact.rules.map((r, i) => `${i + 1}. ${r}`).join('\n')}`
    : '';

  const redFlagsText = artifact.red_flags && artifact.red_flags.length > 0
    ? `\n\n=== RED FLAGS (Avoid These) ===\n${artifact.red_flags.map((f, i) => `${i + 1}. ${f}`).join('\n')}`
    : '';

  const content = `${artifact.script}${rulesText}${redFlagsText}`;

  // Generate embedding
  const embeddingResponse = await openai.embeddings.create({
    model: EMBED_MODEL,
    input: content,
  });

  const embedding = embeddingResponse.data[0].embedding;

  // Compute chunk_uid
  const chunkUid = makeChunkUid(sessionId);

  // Compute content hash
  const contentHash = sha256(content);

  // Prepare metadata JSON
  const metadata = {
    legend: artifact.legend || {},
    realm_id: realmId || null,
    topic: session.topic || topicPack?.topic || null,
    score: artifact.score ?? session.score ?? null,
    agent: session.agent,
    session_id: sessionId,
  };

  // Insert into rag.chunks
  await pool.query(
    `INSERT INTO rag.chunks (
      chunk_uid, collection, source_type, source_id,
      unit_kind, unit_type, unit_idx, chunk_idx,
      domain, content, content_hash, metadata, embedding
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    ON CONFLICT (chunk_uid) DO UPDATE SET
      content = EXCLUDED.content,
      content_hash = EXCLUDED.content_hash,
      metadata = EXCLUDED.metadata,
      embedding = EXCLUDED.embedding,
      updated_at = now()`,
    [
      chunkUid,
      'user_sessions',                    // collection
      'metaphor_map',                     // source_type
      sessionId,                          // source_id (UUID)
      'block',                            // unit_kind
      'metaphor_map',                     // unit_type
      0,                                  // unit_idx
      0,                                  // chunk_idx
      session.domain || topicPack?.domain || null, // domain
      content,                            // content
      contentHash,                        // content_hash
      JSON.stringify(metadata),           // metadata
      `[${embedding.join(',')}]`,         // embedding as vector
    ]
  );

  // Mark session as vectorized
  await markSessionVectorized(sessionId);

  return [chunkUid];
}

/**
 * Generate deterministic chunk UID for a session
 * Format: user_sessions:metaphor_map:<session_id>:u_map:0
 */
function makeChunkUid(sessionId: string): string {
  return `user_sessions:metaphor_map:${sessionId}:u_map:0`;
}

/**
 * Compute SHA-256 hash of content
 */
function sha256(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex');
}
