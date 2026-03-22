import { Router } from 'express';
import { z } from 'zod';
import OpenAI from 'openai';
import { queryRAG } from '../services/rag-service';

const router = Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const CHAT_MODEL = process.env.CHAT_MODEL ?? 'gpt-4o-mini';

const ChatSchema = z.object({
  query: z.string().min(2),
  topK: z.number().int().min(1).max(50).default(8),
  collections: z.array(z.string()).optional(),
  filters: z.object({
    domain: z.string().optional(),
    concepts: z.array(z.string()).optional(),
    mnemonic_tags: z.array(z.string()).optional(),
    has_image: z.boolean().optional(),
    code: z.boolean().optional(),
  }).optional(),
  systemPrompt: z.string().optional(),
  temperature: z.number().min(0).max(2).default(0.7),
  maxTokens: z.number().int().min(1).max(4000).default(1000),
});

/**
 * POST /chat
 * RAG-powered chat endpoint
 * - Retrieves relevant context using vector + text search
 * - Generates response using OpenAI chat completions
 */
router.post('/chat', async (req, res) => {
  try {
    const args = ChatSchema.parse(req.body);

    // Step 1: Query RAG for relevant chunks
    const chunks = await queryRAG({
      query: args.query,
      topK: args.topK,
      collections: args.collections,
      filters: args.filters,
    });

    // Step 2: Format context from retrieved chunks
    const context = chunks.map((chunk, idx) => {
      const breadcrumb = [
        chunk.course_title,
        chunk.chapter_title,
        chunk.subchapter_title,
        chunk.page_title
      ].filter(Boolean).join(' > ');

      return `[Source ${idx + 1}] ${breadcrumb || chunk.collection}
${chunk.content}`;
    }).join('\n\n---\n\n');

    // Step 3: Build system prompt
    const systemPrompt = args.systemPrompt ?? `You are a helpful teaching assistant for The Great Sync learning platform.

Your role is to answer questions about programming and technical concepts using the provided course material context.

Guidelines:
- Base your answers primarily on the provided context
- If the context doesn't contain enough information, say so and provide general guidance
- Use clear, educational language appropriate for learners
- When referencing specific information, you can cite sources like "[Source 1]"
- If code examples are in the context, feel free to reference or explain them
- Be encouraging and supportive in your teaching style

Context from course materials:

${context}`;

    // Step 4: Call OpenAI chat completions
    const completion = await openai.chat.completions.create({
      model: CHAT_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: args.query }
      ],
      temperature: args.temperature,
      max_tokens: args.maxTokens,
    });

    const reply = completion.choices[0]?.message?.content ??
      'I apologize, but I need a moment to gather my thoughts. Could you rephrase that?';

    // Step 5: Return response with metadata
    res.json({
      ok: true,
      reply,
      sources: chunks.map(chunk => ({
        chunk_uid: chunk.chunk_uid,
        collection: chunk.collection,
        page_title: chunk.page_title,
        course_title: chunk.course_title,
        chapter_title: chunk.chapter_title,
        subchapter_title: chunk.subchapter_title,
        score: chunk.score,
        has_image: chunk.has_image,
        code_languages: chunk.code_languages,
      })),
      metadata: {
        model: CHAT_MODEL,
        chunks_retrieved: chunks.length,
        temperature: args.temperature,
        max_tokens: args.maxTokens,
      }
    });
  } catch (error) {
    console.error('Chat error:', error);

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
      error: 'chat_failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
