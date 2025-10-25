/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Context } from 'koa';
import OpenAI from 'openai';
import crypto from 'node:crypto';
import pg from 'pg';

// ---- env / defaults ----
const MODEL = process.env.EMBED_MODEL ?? 'text-embedding-3-small';
const EMBED_BATCH = Number(process.env.RAG_EMBED_BATCH ?? 128);
const DATABASE_URL = process.env.DATABASE_URL!;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;

// ---- singletons ----
let pgClient: pg.Client | null = null;
let openai: OpenAI | null = null;

async function getPg() {
  if (!pgClient) {
    pgClient = new pg.Client({ connectionString: DATABASE_URL });
    await pgClient.connect();
  }
  return pgClient;
}
function getOpenAI() {
  if (!openai) openai = new OpenAI({ apiKey: OPENAI_API_KEY });
  return openai;
}

// ---- helpers ----
function sha256(input: string) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

async function embedBatch(texts: string[]): Promise<number[][]> {
  const ai = getOpenAI();
  const res = await ai.embeddings.create({ model: MODEL, input: texts });
  return res.data.map(d => d.embedding as unknown as number[]);
}

async function upsertChunks(rows: any[]) {
  if (!rows.length) return;
  const db = await getPg();

  const cols = [
    'chunk_uid','collection','source_type','source_id','source_url',
    'unit_kind','unit_type','order_idx','unit_idx','chunk_idx',
    'course_id','chapter_id','subchapter_id',
    'course_title','chapter_title','subchapter_title','page_title',
    'slug','locale','visible','domain',
    'has_image','image_urls','code_languages',
    'concepts','mnemonic_tags','technique_tags',
    'author_label','user_hash','pii_level','sentiment','rating',
    'content','content_hash','embedding','metadata'
  ];

  const values = rows
    .map((_, i) => `(${cols.map((__, j) => `$${i * cols.length + j + 1}`).join(',')})`)
    .join(',');

  const params: any[] = [];
  for (const r of rows) for (const c of cols) params.push(r[c] ?? null);

  const sql = `
    INSERT INTO rag.chunks (${cols.join(',')})
    VALUES ${values}
    ON CONFLICT (chunk_uid) DO UPDATE SET
      content          = EXCLUDED.content,
      embedding        = EXCLUDED.embedding,
      source_url       = EXCLUDED.source_url,
      unit_kind        = EXCLUDED.unit_kind,
      unit_type        = EXCLUDED.unit_type,
      order_idx        = EXCLUDED.order_idx,
      unit_idx         = EXCLUDED.unit_idx,
      chunk_idx        = EXCLUDED.chunk_idx,
      course_id        = EXCLUDED.course_id,
      chapter_id       = EXCLUDED.chapter_id,
      subchapter_id    = EXCLUDED.subchapter_id,
      course_title     = EXCLUDED.course_title,
      chapter_title    = EXCLUDED.chapter_title,
      subchapter_title = EXCLUDED.subchapter_title,
      page_title       = EXCLUDED.page_title,
      slug             = EXCLUDED.slug,
      locale           = EXCLUDED.locale,
      visible          = EXCLUDED.visible,
      domain           = EXCLUDED.domain,
      has_image        = EXCLUDED.has_image,
      image_urls       = EXCLUDED.image_urls,
      code_languages   = EXCLUDED.code_languages,
      concepts         = EXCLUDED.concepts,
      mnemonic_tags    = EXCLUDED.mnemonic_tags,
      technique_tags   = EXCLUDED.technique_tags,
      author_label     = EXCLUDED.author_label,
      user_hash        = EXCLUDED.user_hash,
      pii_level        = EXCLUDED.pii_level,
      sentiment        = EXCLUDED.sentiment,
      rating           = EXCLUDED.rating,
      metadata         = EXCLUDED.metadata,
      updated_at       = now();
  `;
  await db.query(sql, params);
}

async function deleteChunksByPage(pageId: number | string) {
  const db = await getPg();
  await db.query(
    `DELETE FROM rag.chunks WHERE collection='course_content' AND source_type='page_unit' AND source_id=$1`,
    [String(pageId)]
  );
}

// ---- iterators using entityService (inside Strapi) ----
async function* iterPages(strapi: Strapi.Strapi, opts: { since?: string; pageSize?: number }) {
  const pageSize = Math.min(Math.max(opts.pageSize ?? 100, 1), 200);
  let start = 0;
  while (true) {
    const rows: any[] = await strapi.entityService.findMany('api::page.page', {
      filters: {
        publishedAt: { $notNull: true },
        visible: { $eq: true },
        ...(opts.since ? { updatedAt: { $gt: opts.since } } : {}),
      },
      sort: { updatedAt: 'asc' },
      populate: {
        content: {
          populate: {
            image: { populate: ['*'] },
            file: { populate: ['*'] },
            image_classification: { populate: { concepts: true } },
          },
        },
        menu: { populate: { course: { populate: ['*'] } } },
        concepts: true,
      },
      start,
      limit: pageSize,
    });
    if (!rows?.length) break;
    for (const r of rows) yield r;
    start += pageSize;
  }
}

async function* iterImagimodels(strapi: Strapi.Strapi, opts: { since?: string; pageSize?: number }) {
  const pageSize = Math.min(Math.max(opts.pageSize ?? 50, 1), 200);
  let start = 0;
  while (true) {
    const rows: any[] = await strapi.entityService.findMany('api::imagimodel.imagimodel', {
      filters: {
        ...(opts.since ? { updatedAt: { $gt: opts.since } } : {}),
      },
      sort: { updatedAt: 'asc' },
      populate: {
        layers: {
          populate: {
            image: { populate: { image: { populate: ['*'] } } },
            summaries: { populate: ['*'] },
          },
        },
        zones: true,
      },
      start,
      limit: pageSize,
    });
    if (!rows?.length) break;
    for (const r of rows) yield r;
    start += pageSize;
  }
}

async function* iterReflections(strapi: Strapi.Strapi, opts: { since?: string; pageSize?: number }) {
  const pageSize = Math.min(Math.max(opts.pageSize ?? 200, 1), 500);
  let start = 0;
  while (true) {
    const rows: any[] = await strapi.entityService.findMany('api::reflection.reflection', {
      filters: {
        ...(opts.since ? { updatedAt: { $gt: opts.since } } : {}),
      },
      sort: { updatedAt: 'asc' },
      populate: {
        user: true,
        subchapter: { populate: { chapter: { populate: { courses: true } } } },
        chapter: { populate: { courses: true } },
        course: true,
      },
      start,
      limit: pageSize,
    });
    if (!rows?.length) break;
    for (const r of rows) yield r;
    start += pageSize;
  }
}

// ---- controller ----
export default {
  /**
   * POST /api/rag/reindex
   * Body:
   * {
   *   types?: 'pages'|'imagimodels'|'reflections'|'all' | Array<...>,
   *   since?: string (ISO),
   *   pageSize?: number,
   *   dryRun?: boolean,
   *   prunePages?: boolean
   * }
   */
  async reindex(ctx: Context) {
    if (!ctx.state?.user && !ctx.state?.admin) return ctx.unauthorized('Admin only');

    const body = (ctx.request.body ?? {}) as any;
    const normalizeTypes = (t: any) => {
      if (!t) return ['pages']; // default
      if (Array.isArray(t)) return t;
      return [t];
    };

    const types = normalizeTypes(body.types).map((s) => String(s).toLowerCase());
    const since = body.since as string | undefined;
    const pageSize = Number(body.pageSize ?? 100);
    const dryRun = Boolean(body.dryRun ?? false);
    const prunePages = Boolean(body.prunePages ?? false);

    // exporter service
    const exporter = strapi.service('api::rag.exporter');

    let pagesProcessed = 0;
    let modelsProcessed = 0;
    let reflectionsProcessed = 0;
    let chunksUpserted = 0;

    // ---- PAGES ----
    if (types.includes('pages') || types.includes('all')) {
      for await (const page of iterPages(strapi, { since, pageSize })) {
        pagesProcessed += 1;

        // double-check visibility/publish; if not, optionally prune
        const pageAttrs = page.attributes || page;
        if (!pageAttrs.visible || !pageAttrs.publishedAt) {
          if (prunePages && !dryRun) await deleteChunksByPage(page.id);
          continue;
        }

        const { units } = await exporter.getPageUnits(page.id);

        if (!units?.length) continue;

        for (let i = 0; i < units.length; i += EMBED_BATCH) {
          const batch = units.slice(i, i + EMBED_BATCH);
          if (dryRun) {
            chunksUpserted += batch.length;
            continue;
          }
          const vectors = await embedBatch(batch.map((b) => b.text));
          const rows = batch.map((b, j) => {
            const content_hash = sha256(
              JSON.stringify({
                t: b.text,
                s: b.meta.source_id,
                u: b.meta.unit_idx,
                k: b.meta.unit_kind,
                ty: b.meta.unit_type,
              })
            );
            return {
              chunk_uid: b.chunk_uid,
              source_url: (b.meta as any).source_url,
              ...b.meta,
              content: b.text,
              content_hash,
              embedding: vectors[j],
            };
          });
          await upsertChunks(rows);
          chunksUpserted += batch.length;
        }
      }
    }

    // ---- IMAGIMODELS ----
    if (types.includes('imagimodels') || types.includes('all')) {
      for await (const model of iterImagimodels(strapi, { since, pageSize })) {
        modelsProcessed += 1;
        const { units } = await exporter.getImagimodelUnits(model.id);
        if (!units?.length) continue;

        for (let i = 0; i < units.length; i += EMBED_BATCH) {
          const batch = units.slice(i, i + EMBED_BATCH);
          if (dryRun) {
            chunksUpserted += batch.length;
            continue;
          }
          const vectors = await embedBatch(batch.map((b) => b.text));
          const rows = batch.map((b, j) => {
            const content_hash = sha256(
              JSON.stringify({
                t: b.text,
                s: b.meta.source_id,
                u: b.meta.unit_idx,
                k: b.meta.unit_kind,
                ty: b.meta.unit_type,
              })
            );
            return {
              chunk_uid: b.chunk_uid,
              source_url: (b.meta as any).source_url,
              ...b.meta,
              content: b.text,
              content_hash,
              embedding: vectors[j],
            };
          });
          await upsertChunks(rows);
          chunksUpserted += batch.length;
        }
      }
    }

    // ---- REFLECTIONS ----
    if (types.includes('reflections') || types.includes('all')) {
      for await (const r of iterReflections(strapi, { since, pageSize })) {
        reflectionsProcessed += 1;
        const { units } = await exporter.getReflectionUnits(r.id);
        if (!units?.length) continue;

        for (let i = 0; i < units.length; i += EMBED_BATCH) {
          const batch = units.slice(i, i + EMBED_BATCH);
          if (dryRun) {
            chunksUpserted += batch.length;
            continue;
          }
          const vectors = await embedBatch(batch.map((b) => b.text));
          const rows = batch.map((b, j) => {
            const content_hash = sha256(
              JSON.stringify({
                t: b.text,
                s: b.meta.source_id,
                u: b.meta.unit_idx ?? 0,
                k: b.meta.unit_kind ?? 'reflection',
                ty: b.meta.source_type,
              })
            );
            return {
              source_url: (b.meta as any).source_url,
              ...b.meta,
              content: b.text,
              content_hash,
              embedding: vectors[j],
            };
          });
          await upsertChunks(rows);
          chunksUpserted += batch.length;
        }
      }
    }

    ctx.body = {
      ok: true,
      types,
      since: since ?? null,
      pagesProcessed,
      modelsProcessed,
      reflectionsProcessed,
      chunksUpserted,
      model: MODEL,
      batchSize: EMBED_BATCH,
      dryRun,
      prunePages,
    };
  },
};
