/* eslint-disable @typescript-eslint/no-explicit-any */
import crypto from 'node:crypto';

// -----------------------------
// Public types the indexer expects
// -----------------------------
export interface UnitChunk {
    text: string;         // final text to embed
    meta: ChunkMeta;      // ready-to-insert metadata
    chunk_uid: string;    // unique identifier for this chunk
  }
  
  export interface ChunkMeta {
    // logical segmentation
    collection: 'course_content' | 'overviews' | 'mnemonics' | 'reflections' | 'surveys' | 'reviews' | 'blog' | 'notion';
    source_type:
      | 'page_unit'
      | 'chapter'
      | 'subchapter'
      | 'course'
      | 'imagimodel_layer'
      | 'imagimodel_zone'
      | 'reflection'
      | 'survey_response'
      | 'review'
      | 'blog_post'
      | 'notion_note';
    source_id: string;
    source_url?: string;

    // hierarchy (when applicable)
    course_id?: string | number;
    chapter_id?: string | number;
    subchapter_id?: string | number;
    course_title?: string;
    chapter_title?: string;
    subchapter_title?: string;
    page_title?: string;
    slug?: string;
    locale?: string;
    visible?: boolean;
    domain?: string;
  
    // ordering & identity
    order_idx?: number;          // page order in subchapter if you have it
    unit_kind?: 'slide' | 'block' | 'text_section';
    unit_type?: string;          // 'text_image_code' | 'text_image' | 'text' | 'blocks' | ...
    unit_idx?: number;
    chunk_idx?: number;
  
    // modality & taxonomy
    has_image?: boolean;
    image_urls?: string[];
    code_languages?: string[];   // ['js'] etc.
    concepts?: string[];         // your “canon” topics
    mnemonic_tags?: string[];    // ships, captains, islands, genies...
    technique_tags?: string[];
  
    // audience / privacy (rarely used here, but reserved)
    author_label?: string;
    user_hash?: string;
    pii_level?: number;
    sentiment?: number;
    rating?: number;
  
    // misc
    urls?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
  }
  
  // -----------------------------
  // Helpers (no external deps)
  // -----------------------------

  export function makeChunkUID(p: {
    collection: string;
    source_type: string;
    source_id: string | number;
    unit_anchor: string;  // e.g. u_12345 or u_abcd1234
    chunk_idx: number;
  }) {
    return `${p.collection}:${p.source_type}:${p.source_id}:${p.unit_anchor}:${p.chunk_idx}`;
  }
  
  
  function stripHtml(html?: string): string {
    if (!html) return '';
    return html
      .replace(/<\/(p|div|li|h\d)>/gi, '\n')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/\u00A0/g, ' ')
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }
  
  function fenceCode(code?: string, lang = 'js'): string {
    const c = (code ?? '').trim();
    if (!c) return '';
    return `\`\`\`${lang}\n${c}\n\`\`\``;
  }
  
  function sha256(input: string): string {
    return crypto.createHash('sha256').update(input).digest('hex');
  }

  /**
   * Slugify a string: lowercase, trim, replace spaces with hyphens
   */
  function slugify(s?: string): string {
    return (s ?? '').trim().toLowerCase().replace(/\s+/g, '-');
  }

  /**
   * Check if a course is the "Canon" course
   * Canon course uses subchapters as domains (JavaScript, React, Node, etc.)
   */
  function isCanonCourse(course?: { id?: string | number; title?: string; uid?: string }): boolean {
    if (!course) return false;
    const uid = (course.uid ?? '').toLowerCase();
    const title = (course.title ?? '').toLowerCase();
    return uid === 'canon' || title.includes('canon');
  }

  /**
   * Resolve domain based on content type and course structure
   *
   * Logic:
   * - Canon course: domain = slugified subchapter title (JavaScript, React, Node, etc.)
   * - Regular course: domain = course uid or slugified course title
   * - Imagimodels: inherit course domain
   * - Reflections: inherit course/subchapter domain
   */
  function resolveDomain(opts: {
    course?: { id?: string | number; title?: string; uid?: string };
    subchapter?: { id?: string | number; title?: string };
    isImagimodel?: boolean;
  }): string | undefined {
    const { course, subchapter, isImagimodel } = opts;

    if (!course) return undefined;

    // Canon course: use subchapter title as domain
    if (isCanonCourse(course) && subchapter?.title) {
      return slugify(subchapter.title);
    }

    // Imagimodel or regular course: use course uid or title
    if (isImagimodel || !subchapter) {
      return slugify(course.uid ?? course.title);
    }

    // Regular course with subchapter: use course uid or title
    return slugify(course.uid ?? course.title);
  }

  function normalizeConceptSlug(s: string): string {
    return s.trim().replace(/\s+/g, ' ').replace(/\s/g, '-').toLowerCase();
  }
  
  function uniq<T>(arr: T[]): T[] {
    return Array.from(new Set(arr.filter(Boolean))) as T[];
  }
  
  function chunkTextWithOverlap(text: string, target = 1000, overlap = 180): string[] {
    if (!text || text.length <= target) return [text];
    const out: string[] = [];
    let start = 0;
    while (start < text.length) {
      let end = Math.min(start + target, text.length);
      // try to break at paragraph or sentence boundary
      const slice = text.slice(start, end);
      const pBreak = Math.max(slice.lastIndexOf('\n\n'), slice.lastIndexOf('. '));
      if (pBreak > 200) end = start + pBreak + 1;
      out.push(text.slice(start, end).trim());
      start = Math.max(end - overlap, end);
    }
    return out.filter(Boolean);
  }
  
  type ImageDatum = { attributes?: { url?: string } };
  type ImageComp =
    | { data?: ImageDatum | ImageDatum[] }
    | undefined;
  
  type ClassificationConcept = { concept?: string };
  type ImageClassification = {
    actor?: string;     // e.g. "ship-captain"
    action?: string;    // free text
    concepts?: ClassificationConcept[];
  } | undefined;
  
  function extractImageUrls(img?: ImageComp): string[] {
    if (!img?.data) return [];
    const many = Array.isArray(img.data) ? img.data : [img.data];
    return uniq(many.map(i => i?.attributes?.url).filter(Boolean) as string[]);
  }
  
  function buildImageDescription(opts: {
    alt?: string;
    caption?: string;
    classifications?: ImageClassification | ImageClassification[];
  }) {
    const parts: string[] = [];
    const tags = new Set<string>();
    const concepts = new Set<string>();
  
    if (opts.alt) parts.push(opts.alt.trim());
    if (opts.caption) parts.push(opts.caption.trim());
  
    const clsArr = Array.isArray(opts.classifications) ? opts.classifications : [opts.classifications];
    for (const ic of clsArr) {
      if (!ic) continue;
      if (ic.actor) {
        parts.push(`Actor: ${ic.actor}`);
        tags.add(ic.actor.trim());
      }
      if (ic.action) parts.push(`Action: ${ic.action}`);
      for (const c of ic.concepts ?? []) {
        if (c?.concept) concepts.add(normalizeConceptSlug(c.concept));
      }
    }
  
    return {
      description: parts.filter(Boolean).join('\n'),
      mnemonicTags: Array.from(tags),
      concepts: Array.from(concepts),
    };
  }
  
  function conceptsFromPageConcepts(list?: Array<{ concept?: string }>): string[] {
    if (!list) return [];
    return uniq(
      list
        .map(c => (c?.concept ? normalizeConceptSlug(c.concept) : ''))
        .filter(Boolean)
    );
  }
  
  function unitTextTemplate(p: {
    breadcrumb: string;               // "Course > Chapter > Subchapter > Page Title"
    unitKind: 'slide' | 'block' | 'text_section';
    unitIdx: number;
    unitType: string;
    unitName?: string;
    imageDescriptions?: string[];
    paragraphs?: string;
    code?: string;                    // fenced or empty
  }) {
    const lines: string[] = [];
    lines.push(p.breadcrumb);
    lines.push(`[unit: ${p.unitKind} idx:${p.unitIdx} type:${p.unitType}]`);
    if (p.unitName) lines.push(p.unitName);
  
    if (p.imageDescriptions?.length) {
      lines.push('');
      lines.push('Image description(s):');
      for (const d of p.imageDescriptions) lines.push(`- ${d}`);
    }
  
    if (p.paragraphs && p.paragraphs.trim()) {
      lines.push('');
      lines.push('Explanatory text:');
      lines.push(p.paragraphs.trim());
    }
  
    if (p.code && p.code.trim()) {
      lines.push('');
      lines.push('Code:');
      lines.push(p.code.trim());
    }
  
    return lines.join('\n');
  }
  
  // -----------------------------
  // toUnits (Pages -> UnitChunks)
  // -----------------------------
  
  /**
   * Input shape expected from your Strapi Page.
   * We keep it wide/loose to accommodate your dynamic zone.
   */
  export type PageAttributes = {
    title: string;
    type: 'text_image_code' | 'text_image' | 'text_code' | 'video' | 'text' | 'blocks' | 'reflection';
    visible: boolean;
    content: any[];              // dynamic-zone entries
    links?: any[];
    menu?: any[];
    concepts?: Array<{ concept?: string }>;
    locale?: string;
    slug?: string;
    publishedAt?: string;
    updatedAt?: string;
    createdAt?: string;
  };
  
  export function toUnits(opts: {
    pageId: string | number;
    page: PageAttributes;
    course?: { id?: string | number; title?: string; uid?: string };
    chapter?: { id?: string | number; title?: string };
    subchapter?: { id?: string | number; title?: string };
    // optional page order in subchapter if you have it handy
    orderIdx?: number;
  }): UnitChunk[] {
    const { pageId, page, course, chapter, subchapter, orderIdx } = opts;
  
    const breadcrumb = [
      course?.title ?? 'Course',
      chapter?.title ?? 'Chapter',
      subchapter?.title ?? 'Subchapter',
      page.title ?? 'Page',
    ].join(' > ');
  
    const baseMeta: Omit<ChunkMeta, 'collection' | 'source_type' | 'source_id'> = {
      unit_type: page.type,
      course_id: course?.id,
      chapter_id: chapter?.id,
      subchapter_id: subchapter?.id,
      course_title: course?.title,
      chapter_title: chapter?.title,
      subchapter_title: subchapter?.title,
      page_title: page.title,
      slug: page.slug,
      locale: page.locale,
      visible: !!page.visible,
      order_idx: typeof orderIdx === 'number' ? orderIdx : undefined,
      domain: resolveDomain({ course, subchapter, isImagimodel: false }),
    };
  
    const pageConcepts = conceptsFromPageConcepts(page.concepts);
    const out: UnitChunk[] = [];
    let unitIdx = 0;
  
    const pushUnit = (unitText: string, meta: Partial<ChunkMeta>) => {
      const parts = chunkTextWithOverlap(unitText);
      parts.forEach((textPart, idx) => {
        const finalMeta = {
          collection: 'course_content' as const,
          source_type: 'page_unit' as const,
          source_id: String(pageId),
          ...baseMeta,
          ...meta,
          unit_idx: meta.unit_idx ?? unitIdx,
          chunk_idx: idx,
        };

        const chunk_uid = makeChunkUID({
          collection: finalMeta.collection,
          source_type: finalMeta.source_type,
          source_id: finalMeta.source_id,
          unit_anchor: `u_${finalMeta.unit_idx}`,
          chunk_idx: idx,
        });

        out.push({
          text: textPart,
          meta: finalMeta,
          chunk_uid,
        });
      });
      unitIdx += 1;
    };
  
    const items = Array.isArray(page.content) ? page.content : [];
  
    // --------------------
    // BLOCKS pages
    // --------------------
    if (page.type === 'blocks') {
      // Build logical sections that glue text+image+code that belong together.
      let section: { texts: string[]; codes: string[]; imgs: { urls: string[]; alt?: string; caption?: string; cls?: any }[] } | null = null;
  
      const flush = () => {
        if (!section) return;
  
        const imageDescriptions: string[] = [];
        const imageUrls: string[] = [];
        let mnemonicTags: string[] = [];
        let imgConcepts: string[] = [];
  
        for (const it of section.imgs) {
          const { description, mnemonicTags: t, concepts } = buildImageDescription({
            alt: it.alt,
            caption: it.caption,
            classifications: it.cls,
          });
          if (description) imageDescriptions.push(description);
          imageUrls.push(...it.urls);
          mnemonicTags = uniq([...mnemonicTags, ...t]);
          imgConcepts = uniq([...imgConcepts, ...concepts]);
        }
  
        const textBlock = section.texts.filter(Boolean).join('\n\n').trim();
        const codeBlock = section.codes.filter(Boolean).join('\n\n').trim();
        const fenced = codeBlock ? fenceCode(codeBlock, 'js') : '';
  
        const unitText = unitTextTemplate({
          breadcrumb,
          unitKind: 'block',
          unitIdx,
          unitType: 'blocks',
          imageDescriptions: imageDescriptions.length ? imageDescriptions : undefined,
          paragraphs: textBlock,
          code: fenced,
        });
  
        const concepts = uniq([...pageConcepts, ...imgConcepts]);
  
        pushUnit(unitText, {
          unit_kind: 'block',
          unit_type: 'blocks',
          has_image: imageUrls.length > 0,
          image_urls: imageUrls.length ? uniq(imageUrls) : undefined,
          code_languages: fenced ? ['js'] : undefined,
          concepts,
          mnemonic_tags: mnemonicTags.length ? mnemonicTags : undefined,
        });
  
        section = null;
      };
  
      for (const entry of items) {
        const k = entry?.__component as string;
        if (!k) continue;
  
        const isBoundary =
          k === 'media.image' || k === 'media.text-image' || k === 'media.text-image-code' || k === 'media.code-editor';
  
        if (isBoundary && section) flush();
        if (!section) section = { texts: [], codes: [], imgs: [] };
  
        if (k === 'media.text' || k === 'media.text-code') {
          if (entry.text) section.texts.push(stripHtml(entry.text));
          if (k === 'media.text-code' && entry.code) section.codes.push(stripHtml(entry.code));
        } else if (k === 'media.code-editor') {
          // code-editor has array of files
          if (entry.file && Array.isArray(entry.file)) {
            for (const f of entry.file) {
              if (f.code) section.codes.push(stripHtml(f.code));
            }
          }
          // Also capture description text if present
          if (entry.description?.text) {
            section.texts.push(stripHtml(entry.description.text));
          }
        } else if (k === 'media.text-image' || k === 'media.text-image-code' || k === 'media.image') {
          const urls = extractImageUrls(entry.image);
          section.imgs.push({
            urls,
            alt: entry.image_alt,
            caption: entry.image_caption ?? entry.caption ?? entry?.description?.text,
            cls: entry.image_classification,
          });
          if (entry.text) section.texts.push(stripHtml(entry.text));
          if (entry.code) section.codes.push(stripHtml(entry.code));
        } else {
          if (entry.text) section.texts.push(stripHtml(entry.text));
        }
      }
      flush();
      return out;
    }
  
    // --------------------
    // Non-BLOCKS pages
    // --------------------
    for (const entry of items) {
      const k = entry?.__component as string;
      if (!k) continue;
  
      // text_image_code → one unit per slide
      if (page.type === 'text_image_code' && (k === 'media.text_image_code' || k === 'media.text-image-code')) {
        const urls = extractImageUrls(entry.image);
        const { description, mnemonicTags, concepts: icConcepts } = buildImageDescription({
          alt: entry.image_alt,
          caption: entry.image_caption ?? entry.caption ?? entry?.description?.text,
          classifications: entry.image_classification,
        });
  
        const unitText = unitTextTemplate({
          breadcrumb,
          unitKind: 'slide',
          unitIdx,
          unitType: 'text_image_code',
          imageDescriptions: description ? [description] : undefined,
          paragraphs: stripHtml(entry.text),
          code: fenceCode(entry.code, 'js'),
        });
  
        const concepts = uniq([...pageConcepts, ...icConcepts]);
  
        pushUnit(unitText, {
          unit_kind: 'slide',
          unit_type: 'text_image_code',
          has_image: urls.length > 0,
          image_urls: urls.length ? urls : undefined,
          code_languages: ['js'],
          concepts,
          mnemonic_tags: mnemonicTags.length ? mnemonicTags : undefined,
        });
        continue;
      }
  
      // text_image → one unit per slide
      if (page.type === 'text_image' && (k === 'media.text_image' || k === 'media.text-image')) {
        const urls = extractImageUrls(entry.image);
        const { description, mnemonicTags, concepts: icConcepts } = buildImageDescription({
          alt: entry.image_alt,
          caption: entry.image_caption ?? entry.caption ?? entry?.description?.text,
          classifications: entry.image_classification,
        });
  
        const unitText = unitTextTemplate({
          breadcrumb,
          unitKind: 'slide',
          unitIdx,
          unitType: 'text_image',
          imageDescriptions: description ? [description] : undefined,
          paragraphs: stripHtml(entry.text),
        });
  
        const concepts = uniq([...pageConcepts, ...icConcepts]);
  
        pushUnit(unitText, {
          unit_kind: 'slide',
          unit_type: 'text_image',
          has_image: urls.length > 0,
          image_urls: urls.length ? urls : undefined,
          concepts,
          mnemonic_tags: mnemonicTags.length ? mnemonicTags : undefined,
        });
        continue;
      }
  
      // text_code → text + code (no image)
      if (page.type === 'text_code' && (k === 'media.text_code' || k === 'media.text-code')) {
        const unitText = unitTextTemplate({
          breadcrumb,
          unitKind: 'text_section',
          unitIdx,
          unitType: 'text_code',
          paragraphs: stripHtml(entry.text),
          code: fenceCode(entry.code, 'js'),
        });
  
        pushUnit(unitText, {
          unit_kind: 'text_section',
          unit_type: 'text_code',
          code_languages: ['js'],
          concepts: pageConcepts,
        });
        continue;
      }
  
      // text → plain sections (we emit per entry to retain headings/sections; your content is usually one big entry)
      if (page.type === 'text' && (k === 'media.text' || k === 'media.text')) {
        const unitText = unitTextTemplate({
          breadcrumb,
          unitKind: 'text_section',
          unitIdx,
          unitType: 'text',
          paragraphs: stripHtml(entry.text),
        });
  
        pushUnit(unitText, {
          unit_kind: 'text_section',
          unit_type: 'text',
          concepts: pageConcepts,
        });
        continue;
      }
  
      // ignore video/reflection at page level here
    }
  
    return out;
  }
  
  // -----------------------------
  // toMnemonics (Imagimodel -> chunks)
  // -----------------------------
  
  export type ImagimodelAttributes = {
    layers?: Array<{
      id?: string | number;
      name?: string;
      description?: string;
      image?: {
        image_alt?: string | null;
        image?: { data?: Array<{ attributes?: { url?: string } }> };
      };
      summaries?: { data?: Array<any> };
    }>;
    zones?: Array<{
      id?: string | number;
      name: string;
      centerPosition: number;
      focusPoint: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'left' | 'right';
      zoom: number;
    }>;
  };
  
  export function toMnemonics(opts: {
    imagimodelId: string | number;
    model: ImagimodelAttributes;
    course?: { id?: string | number; title?: string; uid?: string };
  }): UnitChunk[] {
    const { imagimodelId, model, course } = opts;
    const out: UnitChunk[] = [];

    const breadcrumb = `${course?.title ?? 'Course'} > Imagimodel`;
    const domain = resolveDomain({ course, subchapter: undefined, isImagimodel: true });
  
    // Layers → one chunk each
    (model.layers ?? []).forEach((layer, idx) => {
      const urls = extractImageUrls(layer.image?.image as any);
      const { description } = buildImageDescription({
        alt: layer.image?.image_alt ?? undefined,
        caption: layer.description ?? undefined,
      });
  
      const paragraphs = [
        layer.name ? `Layer: ${layer.name}` : '',
        layer.description ? `${layer.description}` : '',
      ].filter(Boolean).join('\n');
  
      const text = unitTextTemplate({
        breadcrumb,
        unitKind: 'block',
        unitIdx: idx,
        unitType: 'imagimodel_layer',
        unitName: layer.name,
        imageDescriptions: description ? [description] : undefined,
        paragraphs,
      });
  
      const meta = {
        collection: 'mnemonics' as const,
        source_type: 'imagimodel_layer' as const,
        source_id: String(imagimodelId),
        unit_kind: 'block' as const,
        unit_type: 'imagimodel_layer',
        unit_idx: idx,
        course_id: course?.id,
        course_title: course?.title,
        domain,
        has_image: urls.length > 0,
        image_urls: urls.length ? urls : undefined,
        mnemonic_tags: layer.name ? [normalizeConceptSlug(layer.name)] : undefined,
      };

      const chunk_uid = makeChunkUID({
        collection: meta.collection,
        source_type: meta.source_type,
        source_id: meta.source_id,
        unit_anchor: `u_${idx}`,
        chunk_idx: 0,
      });

      out.push({
        text,
        meta,
        chunk_uid,
      });
    });
  
    // Zones → one chunk each
    (model.zones ?? []).forEach((zone, idx) => {
      const paragraphs = [
        `Zone: ${zone.name}`,
        `Focus: ${zone.focusPoint}`,
        `Zoom: ${zone.zoom}`,
        `Center position: ${zone.centerPosition}`,
      ].join('\n');
  
      const text = unitTextTemplate({
        breadcrumb,
        unitKind: 'block',
        unitIdx: idx,
        unitType: 'imagimodel_zone',
        unitName: zone.name,
        paragraphs,
      });
  
      const meta = {
        collection: 'mnemonics' as const,
        source_type: 'imagimodel_zone' as const,
        source_id: String(imagimodelId),
        unit_kind: 'block' as const,
        unit_type: 'imagimodel_zone',
        unit_idx: idx,
        course_id: course?.id,
        course_title: course?.title,
        domain,
        mnemonic_tags: [normalizeConceptSlug(zone.name)],
      };

      const chunk_uid = makeChunkUID({
        collection: meta.collection,
        source_type: meta.source_type,
        source_id: meta.source_id,
        unit_anchor: `u_${idx}`,
        chunk_idx: 0,
      });

      out.push({
        text,
        meta,
        chunk_uid,
      });
    });
  
    return out;
  }
  
  export function toReflection(opts: {
    reflectionId: string | number;
    reflection: any;
    course?: { id?: string|number; title?: string; uid?: string };
    chapter?: { id?: string|number; title?: string };
    subchapter?: { id?: string|number; title?: string };
  }): UnitChunk[] {
    const { reflectionId, reflection, course, chapter, subchapter } = opts;
    const breadcrumb = [
      course?.title ?? 'Course',
      chapter?.title ?? 'Chapter',
      subchapter?.title ?? 'Subchapter',
      'Reflection',
    ].join(' > ');
  
    const text = [
      breadcrumb,
      `[unit: reflection id:${reflectionId}]`,
      '',
      `Reflection: ${reflection.reflection}`,
      reflection.comment ? `Comment: ${reflection.comment}` : '',
      reflection.user ? `User: ${reflection.user.username ?? reflection.user.id}` : '',
    ].join('\n');
  
    const meta: ChunkMeta = {
      collection: 'reflections',
      source_type: 'reflection',
      source_id: String(reflectionId),
      course_id: course?.id,
      chapter_id: chapter?.id,
      subchapter_id: subchapter?.id,
      course_title: course?.title,
      chapter_title: chapter?.title,
      subchapter_title: subchapter?.title,
      domain: resolveDomain({ course, subchapter, isImagimodel: false }),
      author_label: 'student',
      user_hash: reflection.user ? sha256(String(reflection.user.id)) : undefined,
      pii_level: 2, // since reflections are user-generated
      concepts: [],
    };

    const chunk_uid = makeChunkUID({
      collection: meta.collection,
      source_type: meta.source_type,
      source_id: meta.source_id,
      unit_anchor: 'u_0',
      chunk_idx: 0,
    });

    return [{ text, meta, chunk_uid }];
  }
  