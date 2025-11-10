import OpenAI from 'openai';
import { q } from '../db/pool';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const EMBED_MODEL = process.env.EMBED_MODEL ?? 'text-embedding-3-small';

export interface RagQueryParams {
  query: string;
  topK?: number;
  collections?: string[];
  filters?: {
    domain?: string;
    concepts?: string[];
    mnemonic_tags?: string[];
    has_image?: boolean;
    code?: boolean;
  };
}

export interface RagChunk {
  chunk_uid: string;
  collection: string;
  source_type: string;
  source_id: string;
  page_title: string;
  course_title: string;
  chapter_title: string;
  subchapter_title: string;
  unit_type: string;
  unit_kind: string;
  unit_idx: number;
  chunk_idx: number;
  domain: string;
  concepts: string[];
  mnemonic_tags: string[];
  code_languages: string[];
  has_image: boolean;
  content: string;
  vec_score: number;
  txt_score: number;
  score: number;
}

/**
 * Query RAG system with hybrid vector + text search
 * @param params - Query parameters including filters
 * @returns Array of relevant chunks sorted by score
 */
export async function queryRAG(params: RagQueryParams): Promise<RagChunk[]> {
  // Step 1: Embed the query
  const emb = await openai.embeddings.create({
    model: EMBED_MODEL,
    input: params.query
  });
  const vector = `[${emb.data[0].embedding.join(',')}]`;

  // Step 2: Prepare query parameters
  const collections = params.collections ?? ['course_content', 'mnemonics', 'reflections'];
  const topK = params.topK ?? 8;
  const domain = params.filters?.domain ?? null;
  const hasImage = params.filters?.has_image ?? null;
  const wantsCode = params.filters?.code ?? null;
  const concepts = params.filters?.concepts ?? null;
  const mTags = params.filters?.mnemonic_tags ?? null;

  // Step 3: Execute hybrid search query
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
  `, [vector, params.query, collections, domain, hasImage, wantsCode, concepts, mTags, topK]);

  return rows as RagChunk[];
}
