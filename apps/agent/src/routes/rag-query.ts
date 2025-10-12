import { Router } from 'express';
import { z } from 'zod';
import OpenAI from 'openai';
import { q } from '../db/pool';

const router = Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const MODEL = process.env.EMBED_MODEL ?? 'text-embedding-3-small';

const QuerySchema = z.object({
  query: z.string().min(2),
  topK: z.number().int().min(1).max(50).default(8),
  collections: z.array(z.string()).optional(),
  filters: z.object({
    domain: z.string().optional(),                  // 'javascript', 'react', 'node', etc.
    concepts: z.array(z.string()).optional(),
    mnemonic_tags: z.array(z.string()).optional(),
    has_image: z.boolean().optional(),
    code: z.boolean().optional(),
  }).optional(),
  intent: z.string().optional()                    // 'teach','explain_code','design_new_model',...
});

router.post('/rag/query', async (req, res) => {
  try {
    const args = QuerySchema.parse(req.body);

    const emb = await openai.embeddings.create({ model: MODEL, input: args.query });
    const v = emb.data[0].embedding;

    const collections = args.collections ?? ['course_content', 'mnemonics', 'reflections'];
    const domain = args.filters?.domain ?? null;
    const hasImage = args.filters?.has_image ?? null;
    const wantsCode = args.filters?.code ?? null;
    const concepts = args.filters?.concepts ?? null;
    const mTags = args.filters?.mnemonic_tags ?? null;

    const { rows } = await q(`
      SELECT
        chunk_uid, collection, source_type, source_id,
        page_title, course_title, chapter_title, subchapter_title,
        unit_type, unit_kind, unit_idx, chunk_idx,
        domain, concepts, mnemonic_tags, code_languages, has_image,
        content,
        1 - (embedding <=> $1::vector) AS vec_score,
        ts_rank(tsv, plainto_tsquery('english', $2)) AS txt_score,
        (0.7*(1 - (embedding <=> $1::vector)) + 0.3*ts_rank(tsv, plainto_tsquery('english', $2))) AS score
      FROM rag.chunks
      WHERE collection = ANY($3)
        AND ($4::text IS NULL OR domain = $4)
        AND ($5::bool IS NULL OR has_image = $5)
        AND ($6::bool IS NULL OR (code_languages IS NOT NULL AND cardinality(code_languages) > 0))
        AND ($7::text[] IS NULL OR concepts && $7)
        AND ($8::text[] IS NULL OR mnemonic_tags && $8)
      ORDER BY score DESC
      LIMIT $9
    `, [v, args.query, collections, domain, hasImage, wantsCode, concepts, mTags, args.topK]);

    res.json({ ok: true, results: rows });
  } catch (error) {
    console.error('RAG query error:', error);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        ok: false,
        error: 'validation_error',
        details: error.errors
      });
    }

    // Handle OpenAI API errors
    if (error && typeof error === 'object' && 'status' in error) {
      return res.status(500).json({
        ok: false,
        error: 'embedding_failed',
        message: error instanceof Error ? error.message : 'OpenAI API error'
      });
    }

    // Generic error
    res.status(500).json({
      ok: false,
      error: 'query_failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
