/**
 * Session vectorizer - indexes completed session artifacts into rag.chunks
 */

import OpenAI from 'openai';
import crypto from 'node:crypto';
import { pool } from '../db/pool';
import { SessionArtifact, TopicPack } from '../types/session';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const EMBED_MODEL = process.env.EMBED_MODEL ?? 'text-embedding-3-small';

/**
 * Vectorize and index a session artifact
 * @param sessionId - The session ID
 * @param artifact - The completed metaphor map artifact
 * @param topicPack - The topic pack (for domain metadata)
 * @param realmId - The realm ID
 * @returns Array of chunk UIDs created
 */
export async function vectorizeSessionArtifact(
  sessionId: number,
  artifact: SessionArtifact,
  topicPack: TopicPack,
  realmId: string
): Promise<string[]> {
  // Build content text: script + rules + red flags
  const rulesText = artifact.rules.length > 0
    ? `\n\n=== RULES ===\n${artifact.rules.map((r, i) => `${i + 1}. ${r}`).join('\n')}`
    : '';

  const redFlagsText = artifact.red_flags.length > 0
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
    legend: artifact.legend,
    realm_id: realmId,
    topic: topicPack.topic,
    score: artifact.score ?? null,
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
      String(sessionId),                  // source_id
      'block',                            // unit_kind
      'metaphor_map',                     // unit_type
      0,                                  // unit_idx
      0,                                  // chunk_idx
      topicPack.domain ?? null,           // domain
      content,                            // content
      contentHash,                        // content_hash
      JSON.stringify(metadata),           // metadata
      `[${embedding.join(',')}]`,         // embedding as vector
    ]
  );

  return [chunkUid];
}

/**
 * Generate deterministic chunk UID for a session
 * Format: user_sessions:metaphor_map:<session_id>:u_map:0
 */
function makeChunkUid(sessionId: number): string {
  return `user_sessions:metaphor_map:${sessionId}:u_map:0`;
}

/**
 * Compute SHA-256 hash of content
 */
function sha256(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex');
}
