import { Router } from 'express';
import { z } from 'zod';
import OpenAI from 'openai';
import crypto from 'node:crypto';
import { pool } from '../db/pool';

const router = Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const EMBED_MODEL = process.env.EMBED_MODEL ?? 'text-embedding-3-small';

const NotionIngestSchema = z.object({
  page_id: z.string().min(1),
  properties: z.object({
    title: z.string().optional(),
    category: z.string().optional(),
    domain: z.string().optional(),
    tags: z.array(z.string()).optional(),
    date: z.string().optional(),
    author: z.string().optional(),
  }),
  content: z.string().min(1),
  url: z.string().optional(), // Allow any string, not just valid URLs (Notion URLs can be varied)
});

/**
 * Chunk text with overlap (duplicated from shapers.ts for standalone use)
 */
function chunkTextWithOverlap(text: string, target = 1000, overlap = 180): string[] {
  if (!text || text.length <= target) return [text];
  const out: string[] = [];
  let start = 0;
  while (start < text.length) {
    let end = Math.min(start + target, text.length);
    const slice = text.slice(start, end);
    const pBreak = Math.max(slice.lastIndexOf('\n\n'), slice.lastIndexOf('. '));
    if (pBreak > 200) end = start + pBreak + 1;
    out.push(text.slice(start, end).trim());
    start = Math.max(end - overlap, end);
  }
  return out.filter(Boolean);
}

/**
 * Generate deterministic chunk UID
 */
function makeChunkUID(p: {
  collection: string;
  source_type: string;
  source_id: string;
  unit_anchor: string;
  chunk_idx: number;
}): string {
  return `${p.collection}:${p.source_type}:${p.source_id}:${p.unit_anchor}:${p.chunk_idx}`;
}

/**
 * Compute SHA-256 hash
 */
function sha256(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex');
}

/**
 * POST /notion/ingest
 * Accepts Notion page data from n8n, embeds, and indexes to rag.chunks
 */
router.post('/notion/ingest', async (req, res) => {
  try {
    const input = NotionIngestSchema.parse(req.body);

    const { page_id, properties, content, url } = input;
    const title = properties.title || 'Untitled';
    const fullText = `${title}\n\n${content}`;

    // Chunk the content
    const textChunks = chunkTextWithOverlap(fullText);

    // Generate embeddings for all chunks
    const embeddings = await openai.embeddings.create({
      model: EMBED_MODEL,
      input: textChunks,
    });

    const chunkUids: string[] = [];

    // Prepare rows for batch upsert
    const rows = textChunks.map((chunk, idx) => {
      const chunk_uid = makeChunkUID({
        collection: 'notion',
        source_type: 'notion_note',
        source_id: page_id,
        unit_anchor: 'u_0',
        chunk_idx: idx,
      });

      chunkUids.push(chunk_uid);

      const content_hash = sha256(
        JSON.stringify({
          t: chunk,
          s: page_id,
          u: 0,
          k: 'text_section',
          ty: 'notion_note',
        })
      );

      const embedding = embeddings.data[idx].embedding;

      // Estimate tokens (rough approximation: 1 token ≈ 4 chars)
      const tokens = Math.ceil(chunk.length / 4);

      return {
        chunk_uid,
        collection: 'notion',
        source_type: 'notion_note',
        source_id: page_id,
        source_url: url || null,
        unit_kind: 'text_section',
        unit_type: 'notion_note',
        order_idx: null,
        unit_idx: 0,
        chunk_idx: idx,
        course_id: null,
        chapter_id: null,
        subchapter_id: null,
        course_title: null,
        chapter_title: null,
        subchapter_title: null,
        page_title: title,
        slug: null,
        locale: null,
        visible: null,
        domain: properties.domain || properties.category || null,
        has_image: false,
        image_urls: null,
        code_languages: null,
        concepts: properties.tags || null,
        mnemonic_tags: null,
        technique_tags: null,
        author_label: properties.author || null,
        user_hash: null,
        pii_level: 0,
        sentiment: null,
        rating: null,
        content: chunk,
        tokens,
        content_hash,
        embedding: `[${embedding.join(',')}]`,
        metadata: JSON.stringify({
          category: properties.category,
          date: properties.date,
        }),
      };
    });

    // Batch upsert to rag.chunks
    if (rows.length > 0) {
      const cols = [
        'chunk_uid', 'collection', 'source_type', 'source_id', 'source_url',
        'unit_kind', 'unit_type', 'order_idx', 'unit_idx', 'chunk_idx',
        'course_id', 'chapter_id', 'subchapter_id',
        'course_title', 'chapter_title', 'subchapter_title', 'page_title',
        'slug', 'locale', 'visible', 'domain',
        'has_image', 'image_urls', 'code_languages',
        'concepts', 'mnemonic_tags', 'technique_tags',
        'author_label', 'user_hash', 'pii_level', 'sentiment', 'rating',
        'content', 'tokens', 'content_hash', 'embedding', 'metadata'
      ];

      const values = rows
        .map((_, i) => `(${cols.map((__, j) => `$${i * cols.length + j + 1}`).join(',')})`)
        .join(',');

      const params: any[] = [];
      for (const r of rows) {
        for (const c of cols) {
          params.push((r as any)[c] ?? null);
        }
      }

      const sql = `
        INSERT INTO rag.chunks (${cols.join(',')})
        VALUES ${values}
        ON CONFLICT (chunk_uid) DO UPDATE SET
          content          = EXCLUDED.content,
          embedding        = EXCLUDED.embedding,
          source_url       = EXCLUDED.source_url,
          page_title       = EXCLUDED.page_title,
          domain           = EXCLUDED.domain,
          concepts         = EXCLUDED.concepts,
          author_label     = EXCLUDED.author_label,
          tokens           = EXCLUDED.tokens,
          content_hash     = EXCLUDED.content_hash,
          metadata         = EXCLUDED.metadata,
          updated_at       = now();
      `;

      await pool.query(sql, params);
    }

    res.json({
      ok: true,
      page_id,
      chunks_created: chunkUids.length,
      chunk_uids: chunkUids,
    });
  } catch (error) {
    console.error('Notion ingest error:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        ok: false,
        error: 'validation_error',
        details: error.errors
      });
    }

    res.status(500).json({
      ok: false,
      error: 'ingest_failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
