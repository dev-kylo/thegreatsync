import { Router } from 'express';
import { z } from 'zod';
import { queryRAG } from '../services/rag-service';

const router = Router();

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

    // Query RAG service
    const results = await queryRAG({
      query: args.query,
      topK: args.topK,
      collections: args.collections,
      filters: args.filters,
    });

    res.json({ ok: true, results });
  } catch (error) {
    console.error('RAG query error:', error);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        ok: false,
        error: 'validation_error',
        details: error.issues
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
