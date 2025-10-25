# RAG v1 Specification

## Overview

RAG (Retrieval-Augmented Generation) implementation for The Great Sync learning platform. Combines vector similarity search with full-text search to retrieve relevant educational content from course materials, visual mnemonics, user reflections, and learning session artifacts.

**Status**: Production-ready for course content, sessions system in active development

## Database Schema

Location: `apps/agents/sql/`

### Core Tables

**rag.chunks** (`001_rag_core.sql:7-54`)
- Primary vector storage table (1536-dim embeddings via `text-embedding-3-small`)
- Indexed with IVFFlat for fast cosine similarity search
- Full-text search via generated `tsv` column with GIN index
- Stores content hierarchy (course → chapter → subchapter → page)
- Metadata: `domain`, `concepts`, `mnemonic_tags`, `code_languages`, `has_image`, etc.
- Unique constraint on `chunk_uid` for idempotent upserts
- Domain column added in `002_add_domain_column.sql` for technology filtering (javascript, react, node, etc.)

**rag.chunk_history** (`001_rag_core.sql:76-82`)
- Audit trail of content changes
- Tracks content versions by `content_hash`

**rag.interactions** (`001_rag_core.sql:87-102`)
- Logs query/answer pairs with retrieved chunk metadata
- Used for feedback loop and future reranker training

**rag.judgments** (`001_rag_core.sql:104-113`)
- Explicit positive/negative relevance labels for chunk pairs
- Links to interactions for supervised learning data

**rag.sessions** (`003_sessions_schema.sql:5-21`)
- Learning session tracking (realm-based metaphor mapping)
- Stores final artifacts: `legend`, `rules`, `script`, `red_flags`
- Snapshots of `topic_pack` and `realm_snapshot` for reproducibility

**rag.session_events** (`003_sessions_schema.sql:35-42`)
- Chat history for sessions (user/assistant/system messages)

**rag.session_progress** (`003_sessions_schema.sql:51-59`)
- Tracks completed topics per user per realm

## Data Sources & Collections

### 1. Strapi Course Content (`collection: course_content`)

**Hierarchy**: Course → Chapter → Subchapter → Page

**Schema Files**:
- Page: `apps/strapi/src/api/page/content-types/page/schema.json`
- Course: `apps/strapi/src/api/course/content-types/course/schema.json`

**Page Types**: `text_image_code`, `text_image`, `text_code`, `video`, `text`, `blocks`, `reflection`

**Content Components** (Dynamic Zones):
- `media.text` - Rich text
- `media.text-image` - Text + image with metadata
- `media.text-image-code` - Three-column layout
- `media.code-editor` - Interactive code with multiple files
- `media.video` - Mux video player
- `media.image` - Standalone images

**Data Transformation**: `apps/strapi/src/api/rag/helpers/shapers.ts:299-580`
- Converts Strapi page content → structured text chunks
- Extracts image descriptions from `alt`, `caption`, `image_classification`
- Builds breadcrumb context (Course > Chapter > Subchapter > Page)
- Chunks long content (1000 chars target, 180 char overlap)
- Extracts concepts, mnemonic tags, code languages

**Domain Resolution** (`shapers.ts:134-155`):
- Canon course: domain = slugified subchapter title (e.g., `javascript`, `react`)
- Other courses: domain = course UID

### 2. Imagimodels (`collection: mnemonics`)

**Schema**: `apps/strapi/src/api/imagimodel/content-types/imagimodel/schema.json`

**Structure**:
- Layers: Visual mnemonic elements with images and descriptions
- Zones: Interactive focus areas with zoom/position metadata

**Data Transformation**: `shapers.ts:606-717`
- One chunk per layer, one per zone
- Extracts mnemonic tags from layer names
- Links to course via one-to-one relation

### 3. User Reflections (`collection: reflections`)

**Schema**: `apps/strapi/src/api/reflection/content-types/reflection/schema.json`

**Structure**: User-generated free text linked to course hierarchy

**Data Transformation**: `shapers.ts:719-769`
- PII level = 2 (user content)
- User ID hashed with SHA-256
- Single chunk per reflection

### 4. Session Artifacts (`collection: user_sessions`)

**Source**: Completed metaphor map learning sessions

**Data Structure** (`apps/agents/src/data/topics/*.json`):
- `entities` - Domain entities to be mapped
- `truths` - Correct understanding points
- `misconceptions` - Common errors to avoid
- `tests` - Validation questions

**Realm System** (`apps/agents/src/data/realms/*.json`):
- Symbol inventory (wizard, portal, key, etc.)
- Hints for creating metaphors

**Data Transformation**: `apps/agents/src/services/session-vectorizer.ts:21-91`
- Combines script + rules + red flags into single text
- Metadata includes `legend`, `realm_id`, `topic`, `score`
- Indexed on completion of learning session

## Indexing Flow

### Strapi Content Indexing

**Entry Point**: `POST /api/rag/reindex` (Strapi admin-only)

**Controller**: `apps/strapi/src/api/rag/controllers/rag.ts:206-368`

**Process**:
1. Iterator fetches pages/imagimodels/reflections (paginated, respects `visible`, `publishedAt`)
2. Exporter service (`apps/strapi/src/api/rag/services/exporter.ts`) resolves hierarchy and transforms to units
3. Batch embeddings (default 128 per batch) via OpenAI `text-embedding-3-small`
4. Compute `content_hash` (SHA-256) and deterministic `chunk_uid`
5. Upsert to `rag.chunks` (conflict on `chunk_uid` → update)

**Options**:
- `types`: `['pages', 'imagimodels', 'reflections', 'all']`
- `since`: ISO timestamp for incremental updates
- `dryRun`: Preview without database writes
- `prunePages`: Delete chunks for unpublished/invisible pages

**Chunk UID Format**: `{collection}:{source_type}:{source_id}:{unit_anchor}:{chunk_idx}`

**Reindex Behavior** (`rag.ts:40-100`):
- **UPSERT, not DELETE+INSERT** - Uses `ON CONFLICT (chunk_uid) DO UPDATE SET`
- **No duplicates** - Unique constraint on `chunk_uid` prevents duplication
- **Safe to run repeatedly** - Same content generates same `chunk_uid`, updates in place
- **Additive by default** - New content indexed, existing content updated, nothing deleted
- **Orphan chunks** - If you delete pages in Strapi, chunks remain unless `prunePages: true`
- **Deletion is conditional** - Only with `prunePages: true` AND only for invisible/unpublished pages

### Session Artifact Indexing

**Trigger**: Session completion (`finishSession`)

**Flow**: `apps/agents/src/services/session-orchestrator.ts:182-228`
1. Extract artifact from conversation via OpenAI structured output
2. Update `rag.sessions` with artifact
3. Mark topic complete in `rag.session_progress`
4. Vectorize artifact (`session-vectorizer.ts`) → insert to `rag.chunks`

## Query Flow

**Entry Point**: `POST /rag/query` (agents service)

**Handler**: `apps/agents/src/routes/rag-query.ts:24-88`

**Process**:
1. Embed user query via OpenAI `text-embedding-3-small`
2. Hybrid search:
   - Vector score: `1 - (embedding <=> query_embedding)` (cosine distance)
   - Text score: `ts_rank(tsv, plainto_tsquery(query))`
   - Combined: `0.7 * vec_score + 0.3 * txt_score`
3. Filter by:
   - `collections` (default: `course_content`, `mnemonics`, `reflections`)
   - `domain` (e.g., `javascript`)
   - `concepts` (array overlap)
   - `mnemonic_tags` (array overlap)
   - `has_image` (boolean)
   - `code` (has code_languages)
4. Return top K results (default 8, max 50)

**Returns**: `chunk_uid`, `content`, metadata, `vec_score`, `txt_score`, `score`

## Session Learning System

**Concept**: Guided metaphor mapping for technical topics using realm-based symbols

**Entry Point**: `POST /sessions/start` (agents service)

**Orchestrator**: `apps/agents/src/services/session-orchestrator.ts`

**Flow**:
1. **Start**: Load realm + select next uncompleted topic → create session
2. **Chat**: User explores topic, builds metaphor map with AI guidance
3. **Finish**: Extract structured artifact (legend, rules, script, red_flags) → index to RAG

**Components**:
- Session repository (`apps/agents/src/services/session-repository.ts`)
- Events repository (`apps/agents/src/services/events-repository.ts`)
- Progress repository (`apps/agents/src/services/progress-repository.ts`)
- Data loader (`apps/agents/src/services/data-loader.ts`)
- Prompts (`apps/agents/src/prompts/session-prompts.ts`)

**Example Topic**: `apps/agents/src/data/topics/js-closure.json`
**Example Realm**: `apps/agents/src/data/realms/fantasy.json`

## Feedback Loop

**Entry Point**: `POST /rag/feedback` (agents service)

**Handler**: `apps/agents/src/routes/rag-feedback.ts:28-87`

**Data Captured**:
- Interaction: query, answer, retrieved/selected chunks, domain, outcome (-1/0/1)
- Judgments: positive/negative chunk pairs with labels and reasoning

**Storage**: `rag.interactions` + `rag.judgments`

**Use Cases**:
- Identify low-quality chunks
- Train reranker models
- Improve retrieval via relevance feedback
- A/B test prompt variations

## Current Capabilities

### What RAG Can Do

1. **Multi-modal Content Retrieval**
   - Text content from course pages
   - Code snippets with language detection
   - Image descriptions with mnemonic tags
   - User-generated reflections
   - Session learning artifacts

2. **Hierarchical Context**
   - Full course breadcrumb (Course > Chapter > Subchapter > Page)
   - Domain filtering (javascript, react, node, etc.)
   - Concept taxonomy via tagged concepts

3. **Hybrid Search**
   - Semantic similarity (vector embeddings)
   - Keyword matching (PostgreSQL full-text search)
   - Weighted combination (70% semantic, 30% keyword)

4. **Flexible Filtering**
   - Collections (course_content, mnemonics, reflections, user_sessions)
   - Technology domain
   - Presence of images/code
   - Concept/tag overlap

5. **Incremental Updates**
   - Idempotent upserts via chunk_uid
   - Timestamp-based filtering (`since` parameter)
   - Selective reindexing by type

6. **Learning Artifact Generation**
   - Guided metaphor mapping sessions
   - Structured output extraction
   - Automatic indexing of completed sessions

7. **Quality Tracking**
   - Interaction logging
   - Explicit relevance judgments
   - Content versioning

### What RAG Cannot Do (Yet)

1. **Cross-Document Reasoning**
   - Cannot synthesize information across multiple chunks
   - No graph-based relationship traversal
   - Limited to similarity-based retrieval

2. **Reranking**
   - No learned reranker (using static 70/30 hybrid)
   - Judgments collected but not yet used for training

3. **Multimodal Embeddings**
   - Images described as text, not embedded visually
   - Cannot search by image similarity

4. **Query Understanding**
   - No query expansion or reformulation
   - No intent classification (beyond optional `intent` field)

5. **External Data Sources**
   - Currently limited to Strapi CMS and session artifacts
   - No web scraping, documentation imports, or API ingestion

6. **Real-time Updates**
   - Requires manual reindex trigger
   - No webhook listeners or CDC (change data capture)

7. **Multi-tenancy**
   - User filtering exists but not enforced
   - No ACL on chunk retrieval

## API Endpoints

### Strapi (apps/strapi)

**POST /api/rag/reindex** (Admin only)
- Trigger: Manual or cron job
- Auth: `admin::isAuthenticatedAdmin`
- Route: `apps/strapi/src/api/rag/routes/reindex.ts`

### Agents Service (apps/agents, port 8787)

**POST /rag/query**
- Query RAG system with filters
- No auth (relies on CORS)
- Route: `apps/agents/src/routes/rag-query.ts`

**POST /rag/feedback**
- Submit interaction judgments
- No auth
- Route: `apps/agents/src/routes/rag-feedback.ts`

**POST /rag/reindex** (Admin only)
- Proxy to Strapi reindex endpoint
- Auth: Bearer token (`ADMIN_TOKEN`)
- Route: `apps/agents/src/routes/admin-reindex.ts`

**POST /sessions/start**
- Start or resume learning session
- Route: `apps/agents/src/routes/session.ts`

**POST /sessions/:id/chat**
- Send message in active session
- Route: `apps/agents/src/routes/session.ts`

**POST /sessions/:id/finish**
- Complete session, extract and index artifact
- Route: `apps/agents/src/routes/session.ts`

## Environment Variables

**Required**:
- `DATABASE_URL` - PostgreSQL with pgvector extension
- `OPENAI_API_KEY` - OpenAI API access
- `STRAPI_URL` - Strapi CMS base URL
- `STRAPI_ADMIN_TOKEN` - Strapi admin auth token
- `ADMIN_TOKEN` - Agent service admin auth

**Optional**:
- `EMBED_MODEL` (default: `text-embedding-3-small`)
- `CHAT_MODEL` (default: `gpt-4o-mini`)
- `RAG_EMBED_BATCH` (default: 128)
- `PORT` (default: 8787 for agents)
- `ALLOWED_ORIGINS` (CORS, default: localhost:1218,3000)

## Notion Integration (n8n Webhook)

**Status**: Implemented

### Architecture

Notion pages → n8n automation → `POST /notion/ingest` → Embed & index to RAG

### Notion Database Setup

Create a Notion database with these properties:

| Property | Type | Purpose |
|----------|------|---------|
| **Title** | Title | Page title |
| **Category** | Select | `transcripts`, `ideas`, `research` |
| **Domain** | Select | `ai-systems`, `pedagogy`, `javascript`, etc. |
| **Tags** | Multi-select | Specific concepts for filtering |
| **Date** | Date | Creation/discussion date |
| **Author** | Person | Optional attribution |

### API Endpoint

**POST /notion/ingest**
- Route: `apps/agents/src/routes/notion-ingest.ts`
- Auth: None (rely on n8n webhook security or add token auth)
- Request body:
```json
{
  "page_id": "abc123-notion-page-id",
  "properties": {
    "title": "RAG System Design Discussion",
    "category": "transcripts",
    "domain": "ai-systems",
    "tags": ["rag", "architecture"],
    "date": "2025-01-25",
    "author": "keith"
  },
  "content": "# RAG System Design\n\nFull page content...",
  "url": "https://notion.so/rag-abc123"
}
```

### n8n Workflow Design

1. **Trigger**: Notion Database item updated/created
2. **Get Page Content**: Notion API - Get page blocks as Markdown
3. **Transform**: Map Notion properties to API format
4. **HTTP Request**: POST to `/notion/ingest`

### Data Transformation

**Shaper**: `apps/strapi/src/api/rag/helpers/shapers.ts:775-828`
- Chunks content (1000 chars, 180 overlap)
- Creates chunk_uid: `notion:notion_note:{page_id}:u_0:{chunk_idx}`
- Extracts domain from properties (domain field or category fallback)
- Tags become concepts array for filtering

### Findability Best Practices

**Content Structure:**
- Start with 2-3 sentence summary
- Use descriptive headings
- Include technical terms explicitly
- Add examples and context
- Link related concepts

**Metadata Strategy:**
- **Title**: Descriptive with key terms ("JavaScript Closure: Reference vs Copy")
- **Domain**: Broad category (3-5 domains max: `javascript`, `ai-systems`, `pedagogy`)
- **Tags**: Specific concepts (`closures`, `lexical-scope`, `memory-model`)
- **Category**: Content type (`transcripts`, `ideas`, `research`)

**Query Impact:**
- Content quality drives 70% of relevance score (semantic search)
- Title/tags improve 30% keyword matching
- Domain/tags enable precise filtering

### Chunk Storage

**Metadata stored**:
- `collection: 'notion'`
- `source_type: 'notion_note'`
- `source_id: page_id` (Notion page ID)
- `domain`: From properties
- `concepts`: Tags array
- `author_label`: From properties
- `metadata.category`: Content category
- `metadata.date`: Creation date

## Technical Debt

### Code Duplication Between Services

**Issue**: Significant code duplication between Strapi and Agents services for RAG indexing operations.

**Duplicated Code**:

1. **Embedding Logic**
   - Strapi: `apps/strapi/src/api/rag/controllers/rag.ts:35-38`
   - Agents: `apps/agents/src/routes/notion-ingest.ts:79-82`
   - Both call OpenAI embeddings API with `text-embedding-3-small`

2. **Vector Formatting**
   - Strapi: `apps/strapi/src/api/rag/controllers/rag.ts:276`
   - Agents: `apps/agents/src/routes/notion-ingest.ts:149`
   - Format: `[${embedding.join(',')}]`

3. **Chunk UID Generation**
   - Strapi: `apps/strapi/src/api/rag/helpers/shapers.ts` (makeChunkUID)
   - Agents: `apps/agents/src/routes/notion-ingest.ts:88-94`

4. **SHA-256 Hashing**
   - Strapi: `apps/strapi/src/api/rag/controllers/rag.ts:30-32`
   - Agents: `apps/agents/src/routes/notion-ingest.ts:59-61`

5. **Text Chunking**
   - Strapi: `apps/strapi/src/api/rag/helpers/shapers.ts:167-180`
   - Agents: `apps/agents/src/routes/notion-ingest.ts:28-41`
   - Algorithm: 1000 char target, 180 char overlap

6. **Database Upsert**
   - Strapi: `apps/strapi/src/api/rag/controllers/rag.ts:41-100`
   - Agents: `apps/agents/src/routes/notion-ingest.ts:158-199`
   - Nearly identical SQL, same column list

**Why It Exists**:
- Strapi service indexes CMS content (pages, imagimodels, reflections)
- Agents service indexes external sources (Notion via n8n)
- Both write to same `rag.chunks` table

**Future Refactoring Options**:

1. **Shared Package** (Recommended for scale)
   - Create `packages/rag-indexer/` with reusable functions
   - Import from both Strapi and Agents services
   - Maintains service independence

2. **Single Indexing Service**
   - Move all indexing to Agents service
   - Strapi triggers indexing via API calls
   - Consolidates logic but adds dependency

3. **Keep As-Is**
   - Accept ~100 lines of duplication
   - Services remain fully independent
   - Simpler for current scope

**Current Decision**: Keep as-is until adding more data sources justifies refactoring.

---

## Future Ingestion Sources

Based on schema types (`shapers.ts:15-27`), planned but not implemented:

- `collection: overviews` - High-level course summaries
- `collection: surveys` - User survey responses
- `collection: reviews` - Course reviews
- `collection: blog` - Blog posts

**Implementation Path**: Create new exporters in `apps/strapi/src/api/rag/services/` following pattern of `exporter.ts`, add to reindex controller types.
