# Agent Multi-Graph Architecture Specification

**Version:** 1.0
**Date:** 2025-10-17
**Status:** Draft

---

## Executive Summary

This specification outlines the architecture for extending The Great Sync Agent from a single-graph learning system to a **multi-graph knowledge platform** supporting three distinct interaction modes:

1. **Business Strategy Graph** - Long-form strategic analysis and market positioning
2. **Student Q&A Graph** - Short, pedagogical answers with course citations
3. **Model-Building Sprint Graph** - Multi-turn workflow for creating learning artifacts

Each graph operates independently with dedicated endpoints, state management, and outcomes, while sharing core infrastructure for vector retrieval, embeddings, database access, and indexing.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Shared Library Design](#2-shared-library-design)
3. [Graph Specifications](#3-graph-specifications)
4. [Database Schema](#4-database-schema)
5. [API Endpoints](#5-api-endpoints)
6. [Implementation Phases](#6-implementation-phases)
7. [Testing Strategy](#7-testing-strategy)
8. [Open Questions](#8-open-questions)

---

## 1. Architecture Overview

### 1.1 High-Level Design

```
┌─────────────────────────────────────────────────────────────┐
│                         API Layer                            │
│  POST /chat/business  │  POST /chat/guru  │  POST /chat/builder │
└───────────┬──────────────────┬─────────────────┬────────────┘
            │                  │                 │
┌───────────▼─────────┐ ┌──────▼────────┐ ┌────▼────────────┐
│  Business Graph     │ │  Student Q&A  │ │  Sprint Graph   │
│  Orchestrator       │ │  Orchestrator │ │  Orchestrator   │
└───────────┬─────────┘ └──────┬────────┘ └────┬────────────┘
            │                  │                 │
            └──────────────────┼─────────────────┘
                               │
            ┌──────────────────▼─────────────────┐
            │       Shared Library (/lib)        │
            ├────────────────────────────────────┤
            │ • retriever.ts   • indexer.ts      │
            │ • sql.ts         • embeddings.ts   │
            │ • prompts/       • topic_path.ts   │
            │ • canon.ts                          │
            └────────────────┬───────────────────┘
                             │
            ┌────────────────▼───────────────────┐
            │      PostgreSQL + pgvector         │
            │  • rag.chunks (shared vector store)│
            │  • Graph-specific state tables     │
            └────────────────────────────────────┘
```

### 1.2 Design Principles

1. **Separation of Concerns**: Each graph is self-contained with its own orchestrator, state, and prompts
2. **DRY (Don't Repeat Yourself)**: Common functionality extracted to shared library
3. **Composability**: Shared services designed as pure functions or stateless classes
4. **Type Safety**: Full TypeScript coverage with strict mode enabled
5. **Testability**: All components unit-testable; shared library independently testable
6. **Extensibility**: Adding new graphs should not require modifying existing ones

### 1.3 Technology Stack

- **Runtime**: Node.js 20+ with TypeScript 5.x
- **Framework**: Express.js 4.x
- **Database**: PostgreSQL 15+ with pgvector extension
- **Embeddings**: OpenAI `text-embedding-3-small` (1536-dimensional)
- **LLM**: OpenAI GPT-4o / GPT-4o-mini (graph-specific)
- **Validation**: Zod for request/response schemas
- **Testing**: Jest + Supertest for integration tests

---

## 2. Shared Library Design

### 2.1 Directory Structure

```
apps/agents/src/lib/
├── retriever.ts           # Hybrid vector + text search
├── indexer.ts             # Chunk upsert with embeddings
├── sql.ts                 # PostgreSQL query helpers
├── embeddings.ts          # OpenAI embedding wrapper
├── topic_path.ts          # Next-topic resolver for sprint
├── canon.ts               # Load canonical topics, truths, packs
├── prompts/               # Prompt builders per graph
│   ├── business.ts        # Business strategy prompts
│   ├── guru.ts            # Student Q&A prompts
│   └── builder.ts         # Sprint prompts
└── types.ts               # Shared TypeScript interfaces
```

### 2.2 Retriever (`lib/retriever.ts`)

**Purpose**: Unified hybrid search interface with per-graph collection filtering.

```typescript
export interface RetrievalOptions {
  query: string;
  topK?: number;
  collections?: string[];      // Filter: 'course_content', 'user_sessions', 'business_docs'
  domain?: string;              // Filter: 'javascript', 'react', 'business', etc.
  concepts?: string[];          // Filter by metadata.concepts
  hasImage?: boolean;           // Filter: chunks with images
  hasCode?: boolean;            // Filter: chunks with code
  minScore?: number;            // Minimum hybrid score threshold
  weights?: {                   // Customizable hybrid weights
    vector: number;             // Default: 0.7
    text: number;               // Default: 0.3
  };
}

export interface RetrievalResult {
  chunk_uid: string;
  content: string;
  metadata: Record<string, any>;
  score: number;
  vector_score: number;
  text_score: number;
  collection: string;
  source_type: string;
  source_id: string;
}

export async function retrieve(
  pool: Pool,
  options: RetrievalOptions
): Promise<RetrievalResult[]> {
  // 1. Generate query embedding
  // 2. Build parameterized SQL with filters
  // 3. Execute hybrid search
  // 4. Return sorted results by combined score
}

export async function retrieveById(
  pool: Pool,
  chunkUids: string[]
): Promise<RetrievalResult[]> {
  // Fetch specific chunks by UID (for citations)
}
```

**Key Features**:
- Single function for all graphs to use
- Collection parameter routes to correct content:
  - Business: `['business_docs', 'user_sessions']`
  - Student Q&A: `['course_content', 'reflections']`
  - Sprint: `['course_content', 'user_sessions', 'mnemonics']`
- Parameterized queries to prevent SQL injection
- Configurable hybrid weights per graph

---

### 2.3 Indexer (`lib/indexer.ts`)

**Purpose**: Upsert chunks into vector store with automatic embedding generation.

```typescript
export interface IndexChunkInput {
  chunk_uid: string;            // Deterministic UID
  collection: string;           // 'course_content' | 'user_sessions' | 'business_docs'
  source_type: string;          // 'course_page' | 'metaphor_map' | 'strategy_memo'
  source_id: string;            // Reference to source entity
  content: string;              // Full text for embedding + search
  domain?: string;              // Technology/business domain
  metadata?: Record<string, any>; // Flexible JSON storage
  concepts?: string[];          // For filtering
  has_image?: boolean;
  has_code?: boolean;
  code_languages?: string[];
}

export async function indexChunk(
  pool: Pool,
  chunk: IndexChunkInput
): Promise<string> {
  // 1. Generate embedding from content
  // 2. Compute tsv for text search
  // 3. Upsert into rag.chunks (ON CONFLICT chunk_uid DO UPDATE)
  // 4. Store previous version in rag.chunk_history if changed
  // 5. Return chunk_uid
}

export async function indexBatch(
  pool: Pool,
  chunks: IndexChunkInput[]
): Promise<string[]> {
  // Batch insert for efficiency
  // Returns array of chunk_uids
}

export async function deleteChunks(
  pool: Pool,
  chunkUids: string[]
): Promise<number> {
  // Soft delete or hard delete (TBD)
  // Returns count of deleted chunks
}
```

**Key Features**:
- Automatic embedding generation (no manual calls to embeddings.ts)
- Upsert pattern ensures idempotency
- Versioning via chunk_history table
- Batch operations for performance

---

### 2.4 Embeddings (`lib/embeddings.ts`)

**Purpose**: OpenAI embedding API wrapper with error handling and caching.

```typescript
export interface EmbeddingOptions {
  model?: string;  // Default: 'text-embedding-3-small'
  dimensions?: number; // Default: 1536
}

export async function generateEmbedding(
  text: string,
  options?: EmbeddingOptions
): Promise<number[]> {
  // 1. Validate input (non-empty, reasonable length)
  // 2. Call OpenAI API
  // 3. Handle rate limits and retries
  // 4. Return embedding vector
}

export async function generateEmbeddings(
  texts: string[],
  options?: EmbeddingOptions
): Promise<number[][]> {
  // Batch embedding generation (up to 2048 texts)
  // More efficient than individual calls
}
```

**Key Features**:
- Single source of truth for embedding model
- Retry logic for transient failures
- Input validation (max token limits)
- Optional caching layer (future enhancement)

---

### 2.5 SQL Helpers (`lib/sql.ts`)

**Purpose**: Reusable PostgreSQL utilities.

```typescript
// Re-export existing utilities from db/pool.ts
export { pool, withTx, q } from '../db/pool';

// Add new helpers for common patterns
export async function insertReturningId(
  pool: Pool,
  table: string,
  columns: Record<string, any>
): Promise<number> {
  // Generic INSERT RETURNING id
}

export async function upsert(
  pool: Pool,
  table: string,
  conflictColumn: string,
  columns: Record<string, any>
): Promise<void> {
  // Generic UPSERT pattern
}

export async function paginate<T>(
  pool: Pool,
  query: string,
  params: any[],
  limit: number,
  offset: number
): Promise<{ rows: T[]; total: number }> {
  // Pagination helper with count
}
```

---

### 2.6 Topic Path Resolver (`lib/topic_path.ts`)

**Purpose**: Determine next topic in learning sequence (Sprint Graph specific).

```typescript
export interface ProgressStatus {
  user_id?: string;
  realm_id: string;
  completed_topics: string[];
}

export async function getNextTopic(
  pool: Pool,
  status: ProgressStatus
): Promise<string | null> {
  // 1. Load topic order for realm
  // 2. Query session_progress for completed topics
  // 3. Return first unfinished topic, or null if all done
}

export async function getTopicProgress(
  pool: Pool,
  user_id: string | undefined,
  realm_id: string
): Promise<{
  total: number;
  completed: number;
  next: string | null;
  topics: Array<{ topic: string; status: 'completed' | 'in_progress' | 'pending' }>;
}> {
  // Full progress report
}
```

---

### 2.7 Canon Loader (`lib/canon.ts`)

**Purpose**: Load canonical learning content (topics, truths, packs).

```typescript
export interface CanonTopic {
  id: string;
  name: string;
  domain: string;
  entities: TopicEntity[];
  truths: string[];
  misconceptions: string[];
  tests: string[];
}

export interface CanonRealm {
  id: string;
  name: string;
  symbol_inventory: string[];
  hints: string[];
  entities?: Record<string, string>; // Predefined entity→symbol mappings
}

// Singleton cache
let topicsCache: Map<string, CanonTopic> | null = null;
let realmsCache: Map<string, CanonRealm> | null = null;

export async function loadTopic(topicId: string): Promise<CanonTopic> {
  // Load from src/data/topics/{topicId}.json
  // Cache in memory
}

export async function loadRealm(realmId: string): Promise<CanonRealm> {
  // Load from src/data/realms/{realmId}.json
  // Cache in memory
}

export async function loadTopicOrder(realmId: string): Promise<string[]> {
  // Load from src/data/topic-orders/{realmId}.json
  // Returns array of topic IDs
}

export async function listTopics(): Promise<CanonTopic[]> {
  // List all available topics
}

export async function listRealms(): Promise<CanonRealm[]> {
  // List all available realms
}

export function clearCache(): void {
  // For testing and hot-reload
}
```

---

### 2.8 Prompts (`lib/prompts/`)

Each graph has its own prompt builder module.

#### Business Graph Prompts (`lib/prompts/business.ts`)

```typescript
export function buildBusinessSystemPrompt(): string {
  // Role: Strategic advisor analyzing market position, student reception, direction
  // Tone: Analytical, data-driven, honest
  // Output: Structured memos with evidence
}

export function buildBusinessWelcome(): string {
  // Initial greeting for strategy session
}

export function buildBusinessSummarizePrompt(
  history: Message[]
): string {
  // Extract key insights from long strategy discussion
}
```

#### Student Q&A Prompts (`lib/prompts/guru.ts`)

```typescript
export function buildGuruSystemPrompt(): string {
  // Role: Patient teacher explaining concepts with course citations
  // Tone: Pedagogical, safe, encouraging
  // Output: Short explanations + links to course pages
  // Guidelines: Always cite sources, no guessing, admit unknowns
}

export function buildGuruResponsePrompt(
  query: string,
  retrievedChunks: RetrievalResult[]
): string {
  // Format retrieved course content as context
  // Request answer with citations in format [page_id]
}

export interface GuruCitation {
  page_id: string;
  course_id?: string;
  chapter_id?: string;
  subchapter_id?: string;
  title: string;
  url: string;
}

export function parseCitations(
  response: string,
  chunks: RetrievalResult[]
): { text: string; citations: GuruCitation[] } {
  // Extract [page_id] references
  // Map to full citation objects with URLs
  // Return cleaned text + citation list
}
```

#### Sprint Graph Prompts (`lib/prompts/builder.ts`)

```typescript
// Re-use existing session-prompts.ts logic
export {
  buildSessionSystemPrompt as buildSprintSystemPrompt,
  buildWelcomeMessage as buildSprintWelcome,
  buildArtifactExtractionPrompt as buildSprintExtractPrompt,
  buildValidationPrompt as buildSprintValidatePrompt
} from '../../prompts/session-prompts';

// Or refactor to lib/prompts/builder.ts if changes needed
```

---

## 3. Graph Specifications

### 3.1 Business Strategy Graph

**Purpose**: Long-form strategic analysis for The Great Sync, reviewing market positioning, student feedback, and future direction.

**User Stories**:
- As a founder, I want to analyze student reception data to understand what's working
- As a business strategist, I want to compare The Great Sync to competitors
- As a product lead, I want to explore new content directions based on trends

**State**: Stateless (or minimal session context)

**Inputs**:
- User messages with strategic questions
- Context from business documents, student feedback, market research

**Outputs**:
- Structured strategic memos
- Market analysis reports
- Data-driven recommendations

**Endpoint**: `POST /chat/business`

**Orchestrator**: `src/graphs/business/orchestrator.ts`

```typescript
export interface BusinessChatRequest {
  message: string;
  session_id?: string;  // Optional: for multi-turn context
  context?: {
    student_count?: number;
    completion_rates?: Record<string, number>;
    feedback_summary?: string;
  };
}

export interface BusinessChatResponse {
  reply: string;
  session_id?: string;
  sources?: string[];  // Chunk UIDs used
  insights?: {
    key_findings: string[];
    recommendations: string[];
  };
}

export async function runBusinessGraph(
  req: BusinessChatRequest
): Promise<BusinessChatResponse> {
  // 1. Retrieve relevant business docs + student feedback
  //    Collections: ['business_docs', 'user_sessions', 'reflections']
  // 2. Build context from retrieved chunks
  // 3. Call LLM with strategic analysis prompt
  // 4. Parse structured output
  // 5. Store interaction for future learning
  // 6. Return response with insights
}
```

**Collections Used**:
- `business_docs` - Strategic documents, market research
- `user_sessions` - Student learning artifacts (for patterns)
- `reflections` - Student feedback data

**Retrieval Strategy**:
- Hybrid search with higher text weight (0.5 vector / 0.5 text)
- No domain filtering (cross-domain insights)
- Top 10-20 chunks for rich context

**LLM Model**: GPT-4o (for complex reasoning)

**State Management**:
- Optional session for multi-turn
- Stored in `rag.business_sessions` table (simple key-value or chat history)

---

### 3.2 Student Q&A Graph (Guru)

**Purpose**: Short, pedagogical answers to student questions with citations to course pages.

**User Stories**:
- As a student, I want quick explanations of concepts I'm learning
- As a learner, I want to see where in the course a concept is taught
- As a user, I want safe, accurate answers that don't mislead me

**State**: Stateless (single-turn)

**Inputs**:
- Student question string

**Outputs**:
- Short explanation (2-5 paragraphs)
- List of course page citations with URLs
- "I don't know" for out-of-scope questions

**Endpoint**: `POST /chat/guru`

**Orchestrator**: `src/graphs/guru/orchestrator.ts`

```typescript
export interface GuruChatRequest {
  question: string;
  course_id?: string;  // Optional: scope to specific course
  user_id?: string;    // Optional: for personalization
}

export interface GuruChatResponse {
  answer: string;
  citations: Array<{
    page_id: string;
    course_id: string;
    chapter_id: string;
    subchapter_id: string;
    title: string;
    url: string;
    excerpt?: string;  // Relevant snippet from page
  }>;
  sources: string[];  // Chunk UIDs for feedback
  confidence: 'high' | 'medium' | 'low';
}

export async function runGuruGraph(
  req: GuruChatRequest
): Promise<GuruChatResponse> {
  // 1. Retrieve relevant course pages + reflections
  //    Collections: ['course_content', 'reflections']
  //    Filters: course_id if provided, high quality chunks only
  // 2. Build context with page metadata (titles, URLs)
  // 3. Call LLM with guru system prompt + retrieved context
  // 4. Parse response for [page_id] citations
  // 5. Map citations to full URLs
  // 6. Assess confidence based on retrieval scores
  // 7. Store interaction for feedback
  // 8. Return answer + citations
}
```

**Collections Used**:
- `course_content` - Course pages, chapters, subchapters
- `reflections` - Student-submitted reflections (peer learning)

**Retrieval Strategy**:
- Hybrid search with balanced weights (0.7 vector / 0.3 text)
- Domain filtering if course_id provided
- Top 5-10 chunks (concise context)
- Minimum score threshold: 0.6 (avoid irrelevant content)

**LLM Model**: GPT-4o-mini (for speed + cost efficiency)

**Safety Guardrails**:
- System prompt instructs: "If unsure, say 'I don't have information on this'"
- Citation validation: Only reference chunks actually retrieved
- Content filtering: No sensitive or inappropriate topics

**State Management**: None (stateless)

**Citation Format**:
```
Answer text here. [1] More text. [2]

[1] JavaScript Closures - Course: JS Fundamentals, Chapter 3, Subchapter 2
    /courses/js-fundamentals/closures/definition/page-1

[2] Hoisting Explained - Course: JS Fundamentals, Chapter 2, Subchapter 1
    /courses/js-fundamentals/basics/hoisting/page-3
```

---

### 3.3 Model-Building Sprint Graph (Builder)

**Purpose**: Multi-turn workflow for creating learning artifacts (legend, rules, script) using metaphor-based teaching.

**User Stories**:
- As a learner, I want to build a metaphor map to understand a complex concept
- As a student, I want to iterate on my understanding through conversation
- As a user, I want my completed artifact indexed for future retrieval

**State**: Stateful (multi-turn session)

**Inputs**:
- Realm ID + Topic ID (at session start)
- User messages during conversation

**Outputs**:
- Completed artifact: legend, rules, script, red_flags
- Vectorized and indexed artifact
- Progress tracking update

**Endpoints**:
- `POST /chat/builder` - Unified chat endpoint (handles start, chat, finish)

**Orchestrator**: `src/graphs/builder/orchestrator.ts`

```typescript
export interface BuilderChatRequest {
  message: string;
  session_id?: string;  // If null, starts new session
  realm_id?: string;    // Required for new session
  topic?: string;       // Required for new session, or auto-selected
  user_id?: string;     // Optional: for progress tracking
  action?: 'chat' | 'finish';  // Default: 'chat'
}

export interface BuilderChatResponse {
  reply: string;
  session_id: string;
  status: 'active' | 'finished';
  artifact?: SessionArtifact;  // Only on finish
  progress?: {
    realm_id: string;
    completed_topics: string[];
    next_topic: string | null;
  };
}

export async function runBuilderGraph(
  req: BuilderChatRequest
): Promise<BuilderChatResponse> {
  // If no session_id:
  //   1. Create new session (load realm, topic pack, next topic)
  //   2. Store system prompt
  //   3. Return welcome message
  // Else if action === 'chat':
  //   4. Validate session is active
  //   5. Retrieve relevant course content + user sessions
  //      Collections: ['course_content', 'user_sessions', 'mnemonics']
  //      Filters: domain = topic.domain, concepts = topic entities
  //   6. Build context window (last N messages + retrieved chunks)
  //   7. Call LLM with coaching prompt
  //   8. Store user message + assistant reply
  //   9. Return reply
  // Else if action === 'finish':
  //   10. Extract artifact from conversation history
  //   11. Optionally validate artifact
  //   12. Mark session as finished
  //   13. Vectorize artifact and index
  //   14. Update progress
  //   15. Return artifact + next topic
}
```

**Collections Used**:
- `course_content` - Teaching content for topic
- `user_sessions` - Previous learner artifacts (peer examples)
- `mnemonics` - Memory aids and metaphors

**Retrieval Strategy**:
- Hybrid search with vector emphasis (0.8 vector / 0.2 text)
- Domain + concept filtering for relevance
- Top 5-10 chunks (focused context)
- Retrieval on every turn (dynamic context)

**LLM Model**: GPT-4o-mini (for coaching conversation)

**State Management**:
- Reuse existing `rag.sessions`, `rag.session_events`, `rag.session_progress` tables
- Session-based workflow (start → chat turns → finish)

**Artifact Indexing**:
- On finish, extract artifact via LLM
- Vectorize script + rules + red_flags
- Store in `rag.chunks` with collection='user_sessions', source_type='metaphor_map'
- Metadata: legend, realm_id, topic, score

---

## 4. Database Schema

### 4.1 Existing Tables (No Changes)

- `rag.chunks` - Shared vector store for all graphs
- `rag.interactions` - Query feedback (all graphs)
- `rag.judgments` - Quality labels (all graphs)
- `rag.chunk_history` - Version tracking (all graphs)
- `rag._migrations` - Migration tracker

### 4.2 Builder Graph (Existing, No Changes)

- `rag.sessions` - Sprint sessions
- `rag.session_events` - Chat history
- `rag.session_progress` - Topic completion

### 4.3 Business Graph (New)

**`rag.business_sessions`** (optional, for multi-turn)

```sql
CREATE TABLE IF NOT EXISTS rag.business_sessions (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT,  -- nullable for admin/founder use
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_activity_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL CHECK (status IN ('active', 'archived')),
  context JSONB,  -- flexible storage for session state
  summary TEXT    -- LLM-generated summary on archive
);

CREATE INDEX idx_business_sessions_user ON rag.business_sessions(user_id);
CREATE INDEX idx_business_sessions_status ON rag.business_sessions(status);
```

**`rag.business_messages`** (chat history)

```sql
CREATE TABLE IF NOT EXISTS rag.business_messages (
  id BIGSERIAL PRIMARY KEY,
  session_id BIGINT NOT NULL REFERENCES rag.business_sessions(id) ON DELETE CASCADE,
  ts TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL
);

CREATE INDEX idx_business_messages_session ON rag.business_messages(session_id, ts);
```

### 4.4 Guru Graph (New)

**`rag.guru_interactions`** (for analytics)

```sql
CREATE TABLE IF NOT EXISTS rag.guru_interactions (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT,  -- nullable
  ts TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  citations JSONB NOT NULL,  -- array of {page_id, title, url}
  retrieved_chunk_uids TEXT[] NOT NULL,
  confidence TEXT NOT NULL CHECK (confidence IN ('high', 'medium', 'low')),
  feedback INTEGER,  -- nullable: +1 (helpful), 0 (neutral), -1 (not helpful)
  feedback_text TEXT  -- optional user comment
);

CREATE INDEX idx_guru_interactions_user ON rag.guru_interactions(user_id);
CREATE INDEX idx_guru_interactions_ts ON rag.guru_interactions(ts);
CREATE INDEX idx_guru_interactions_confidence ON rag.guru_interactions(confidence);
```

**Note**: No session state needed (stateless graph)

### 4.5 Collection Types

Update `rag.chunks.collection` to support new types:

```sql
ALTER TABLE rag.chunks DROP CONSTRAINT IF EXISTS chunks_collection_check;
ALTER TABLE rag.chunks ADD CONSTRAINT chunks_collection_check
  CHECK (collection IN (
    'course_content',
    'mnemonics',
    'reflections',
    'user_sessions',
    'business_docs'  -- NEW
  ));
```

### 4.6 Migration File

**`sql/004_multi_graph.sql`**

```sql
-- Business Graph
CREATE TABLE IF NOT EXISTS rag.business_sessions (
  -- schema above
);

CREATE TABLE IF NOT EXISTS rag.business_messages (
  -- schema above
);

-- Guru Graph
CREATE TABLE IF NOT EXISTS rag.guru_interactions (
  -- schema above
);

-- Update collection constraint
ALTER TABLE rag.chunks DROP CONSTRAINT IF EXISTS chunks_collection_check;
ALTER TABLE rag.chunks ADD CONSTRAINT chunks_collection_check
  CHECK (collection IN (
    'course_content',
    'mnemonics',
    'reflections',
    'user_sessions',
    'business_docs'
  ));

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_chunks_collection_domain
  ON rag.chunks(collection, domain);
```

---

## 5. API Endpoints

### 5.1 Business Graph

**`POST /chat/business`**

```typescript
// Request
{
  "message": "How is student engagement trending for JavaScript courses?",
  "session_id": "optional-uuid",
  "context": {
    "student_count": 1250,
    "completion_rates": { "js-fundamentals": 0.67, "react-basics": 0.54 }
  }
}

// Response
{
  "reply": "Based on recent data, JavaScript course engagement shows...",
  "session_id": "uuid",
  "sources": ["business_docs:report:2024Q4:0", "reflections:page:123:0"],
  "insights": {
    "key_findings": [
      "JS Fundamentals has 67% completion, above platform average",
      "Learners report closure concepts as most challenging"
    ],
    "recommendations": [
      "Add more interactive examples for closures",
      "Consider peer learning sessions for advanced topics"
    ]
  }
}
```

**Status Codes**:
- 200: Success
- 400: Invalid request (Zod validation error)
- 500: Internal error

---

### 5.2 Guru Graph

**`POST /chat/guru`**

```typescript
// Request
{
  "question": "What is a closure in JavaScript?",
  "course_id": "js-fundamentals",  // optional
  "user_id": "user-123"            // optional
}

// Response
{
  "answer": "A closure is a function that has access to variables in its outer scope, even after the outer function has returned. [1] Closures are created every time a function is defined inside another function. [2]",
  "citations": [
    {
      "page_id": "page-42",
      "course_id": "js-fundamentals",
      "chapter_id": "chapter-3",
      "subchapter_id": "subchapter-2",
      "title": "Understanding Closures",
      "url": "/courses/js-fundamentals/functions/closures/page-42",
      "excerpt": "A closure gives you access to an outer function's scope from an inner function..."
    },
    {
      "page_id": "page-45",
      "course_id": "js-fundamentals",
      "chapter_id": "chapter-3",
      "subchapter_id": "subchapter-2",
      "title": "Closure Examples",
      "url": "/courses/js-fundamentals/functions/closures/page-45",
      "excerpt": "Here's a practical example of a closure in action..."
    }
  ],
  "sources": ["course_content:course_page:page-42:0", "course_content:course_page:page-45:1"],
  "confidence": "high"
}
```

**Status Codes**:
- 200: Success
- 400: Invalid request
- 500: Internal error

**`POST /chat/guru/feedback`**

```typescript
// Request
{
  "interaction_id": 123,
  "feedback": 1,  // +1 helpful, 0 neutral, -1 not helpful
  "feedback_text": "Great explanation!"
}

// Response
{
  "ok": true
}
```

---

### 5.3 Builder Graph

**`POST /chat/builder`**

```typescript
// Request (start new session)
{
  "message": "",  // empty for start
  "realm_id": "fantasy",
  "topic": "js-closure",  // or auto-select next topic
  "user_id": "user-123"
}

// Response
{
  "reply": "Welcome to the Fantasy Realm! Today we'll explore closures using magical artifacts...",
  "session_id": "session-456",
  "status": "active"
}

// Request (chat turn)
{
  "message": "I think a closure is like a treasure chest that remembers where it was buried",
  "session_id": "session-456",
  "action": "chat"
}

// Response
{
  "reply": "Interesting analogy! Let's explore that. What would the 'treasure' represent in your metaphor?",
  "session_id": "session-456",
  "status": "active"
}

// Request (finish)
{
  "message": "",
  "session_id": "session-456",
  "action": "finish"
}

// Response
{
  "reply": "Great work! Here's your completed metaphor map:",
  "session_id": "session-456",
  "status": "finished",
  "artifact": {
    "legend": {
      "closure": "enchanted_scroll",
      "outer_scope": "ancient_library",
      "inner_function": "spell_scroll"
    },
    "rules": [
      "The spell scroll can always access the ancient library's knowledge",
      "Once the spell is cast, the library may be gone, but the scroll remembers",
      "Each scroll carries its own copy of the library's secrets"
    ],
    "script": "In the ancient library, a wizard creates an enchanted scroll...",
    "red_flags": [
      "Closures don't copy all variables, only references to them"
    ],
    "score": 0.85
  },
  "progress": {
    "realm_id": "fantasy",
    "completed_topics": ["js-scope", "js-hoisting", "js-closure"],
    "next_topic": "js-this"
  }
}
```

**Status Codes**:
- 200: Success
- 400: Invalid request (missing realm_id on start, invalid session_id, etc.)
- 404: Session not found
- 500: Internal error

---

### 5.4 Admin/Utility Endpoints (Unchanged)

- `POST /rag/reindex` - Trigger Strapi content reindex
- `GET /health` - Health check
- `GET /realms` - List available realms
- `GET /realms/:id/progress` - Get user progress

---

## 6. Implementation Phases

### Phase 1: Shared Library Foundation (Week 1)

**Goal**: Extract and refactor shared utilities into `/lib`.

**Tasks**:
1. Create `lib/` directory structure
2. Implement `lib/retriever.ts` with collection filtering
3. Implement `lib/indexer.ts` with automatic embedding
4. Implement `lib/embeddings.ts` wrapper
5. Move `db/pool.ts` helpers to `lib/sql.ts`
6. Implement `lib/canon.ts` (extract from existing data-loader.ts)
7. Implement `lib/topic_path.ts` (extract from session-orchestrator.ts)
8. Write unit tests for each library module
9. Update existing code to use new library

**Success Criteria**:
- All shared utilities pass unit tests
- Existing endpoints work unchanged (regression test)
- Zero duplication across graphs

---

### Phase 2: Student Q&A Graph (Week 2)

**Goal**: Implement Guru graph with citations.

**Tasks**:
1. Create `sql/004_guru_graph.sql` migration
2. Run migration on development database
3. Create `src/graphs/guru/` directory
4. Implement `lib/prompts/guru.ts` with citation parsing
5. Implement `src/graphs/guru/orchestrator.ts`
6. Create `src/routes/chat-guru.ts` endpoint
7. Wire up endpoint in `src/index.ts`
8. Write integration tests for Q&A flow
9. Test citation accuracy on sample questions
10. Add feedback endpoint

**Success Criteria**:
- Guru endpoint returns answers with valid citations
- Citations map to real course pages
- "I don't know" responses for out-of-scope questions
- Feedback stored in database

**Testing**:
```typescript
// Test cases
- Simple concept question (closure, hoisting, etc.)
- Multi-concept question (closures + scope)
- Out-of-scope question (non-course topic)
- Question with no good matches (low confidence)
- Question scoped to specific course
```

---

### Phase 3: Business Strategy Graph (Week 3)

**Goal**: Implement Business graph for strategic analysis.

**Tasks**:
1. Create `sql/005_business_graph.sql` migration
2. Run migration on development database
3. Create `src/graphs/business/` directory
4. Implement `lib/prompts/business.ts`
5. Implement `src/graphs/business/orchestrator.ts`
6. Create `src/routes/chat-business.ts` endpoint
7. Wire up endpoint in `src/index.ts`
8. Index sample business documents into `business_docs` collection
9. Write integration tests for strategy queries
10. Add session management for multi-turn

**Success Criteria**:
- Business endpoint returns structured insights
- Multi-turn context maintained across messages
- Sources from business_docs and student data
- Insights formatted with key findings + recommendations

**Testing**:
```typescript
// Test cases
- Single-turn strategy question
- Multi-turn deep dive on engagement
- Query combining student feedback + market research
- Request for specific metrics (completion rates, etc.)
```

---

### Phase 4: Builder Graph Refactor (Week 4)

**Goal**: Refactor existing session system to use shared library.

**Tasks**:
1. Move `src/prompts/session-prompts.ts` to `lib/prompts/builder.ts`
2. Create `src/graphs/builder/` directory
3. Refactor `src/services/session-orchestrator.ts` to `src/graphs/builder/orchestrator.ts`
4. Update orchestrator to use `lib/retriever.ts` and `lib/indexer.ts`
5. Create unified `src/routes/chat-builder.ts` endpoint (replaces separate start/chat/finish)
6. Update existing tests
7. Deprecate old endpoints (with warnings)
8. Migration guide for API consumers

**Success Criteria**:
- Existing Builder flow works with new architecture
- No regression in artifact quality
- Reduced code duplication
- Unified chat endpoint pattern

---

### Phase 5: Polish & Documentation (Week 5)

**Goal**: Production-ready system with full documentation.

**Tasks**:
1. Add rate limiting per graph
2. Add observability (logging, metrics)
3. Performance optimization (caching, batch operations)
4. Write API documentation (OpenAPI spec)
5. Write developer guide for adding new graphs
6. Write runbook for operations
7. Load testing and performance tuning
8. Security audit (input validation, injection prevention)
9. Deploy to staging environment
10. User acceptance testing

**Success Criteria**:
- All three graphs meet performance SLAs
- Complete API documentation
- Monitoring dashboards configured
- Security vulnerabilities addressed

---

## 7. Testing Strategy

### 7.1 Unit Tests

**Shared Library** (`lib/*.test.ts`):
- `retriever.ts`: Mock database, test filtering logic
- `indexer.ts`: Mock embeddings, test upsert logic
- `embeddings.ts`: Mock OpenAI API, test retry logic
- `canon.ts`: Test JSON loading, caching behavior
- `prompts/*.ts`: Test prompt generation with fixtures

**Goal**: 80%+ code coverage for shared library

---

### 7.2 Integration Tests

**Per Graph** (`graphs/*/orchestrator.test.ts`):
- End-to-end flow with test database
- Mock OpenAI API with fixtures
- Verify database state after operations

**API Endpoints** (`routes/*.test.ts`):
- Supertest for HTTP testing
- Valid/invalid request handling
- Error responses
- Authentication (if applicable)

**Goal**: All critical paths tested

---

### 7.3 Performance Tests

**Load Testing**:
- 100 concurrent users per graph
- Response time < 2s (p95)
- Throughput > 50 req/s per graph

**Database**:
- Vector search < 100ms (p95)
- Index write < 50ms (p95)

---

### 7.4 Manual Testing

**User Acceptance**:
- Real questions for Guru graph
- Strategy discussions for Business graph
- Complete Builder sprint with artifact

**Cross-Graph Testing**:
- Ensure collections don't bleed between graphs
- Test shared chunks (user_sessions) accessed by multiple graphs

---

## 8. Open Questions

### 8.1 Technical Decisions

1. **Session Management for Business Graph**:
   - Q: Do we need persistent sessions for multi-turn business strategy discussions?
   - Options:
     a. Stateless (each request independent) - simpler, no context
     b. Stateful (track conversation history) - more complex, better UX
   - **Recommendation**: Stateful with auto-archive after 1 hour inactivity

2. **Citation URL Format for Guru**:
   - Q: What's the URL structure for course pages in CourseHub?
   - Current assumption: `/courses/{courseId}/{chapterId}/{subchapterId}/{pageId}`
   - **Action**: Verify with CourseHub routing

3. **Business Documents Source**:
   - Q: Where do business strategy documents come from?
   - Options:
     a. Manual upload via admin UI
     b. Google Docs integration
     c. File upload API
   - **Recommendation**: Start with file upload API, add integrations later

4. **Embedding Model for Business Graph**:
   - Q: Should business documents use a different embedding model?
   - Options:
     a. Same model (text-embedding-3-small) - consistency
     b. Larger model (text-embedding-3-large) - better accuracy
   - **Recommendation**: Same model to start, benchmark if quality issues

5. **Retrieval Context Window**:
   - Q: How many chunks to retrieve per graph?
   - Current: Business (10-20), Guru (5-10), Builder (5-10)
   - **Action**: Benchmark accuracy vs. latency

6. **LLM Model per Graph**:
   - Q: Which models for each graph?
   - Current: Business (GPT-4o), Guru (GPT-4o-mini), Builder (GPT-4o-mini)
   - **Action**: Cost/quality analysis

---

### 8.2 Product Decisions

1. **Builder Graph Unified Endpoint**:
   - Q: Should we keep separate `/session/start`, `/session/chat`, `/session/finish`?
   - Or unify into `/chat/builder` with action parameter?
   - **Recommendation**: Unify for consistency with other graphs

2. **Guru Confidence Threshold**:
   - Q: What minimum confidence to return "I don't know"?
   - Options:
     a. Score-based (< 0.6)
     b. LLM-based (ask model to assess confidence)
   - **Recommendation**: Hybrid (score + LLM self-assessment)

3. **Business Graph Access Control**:
   - Q: Who can access business strategy endpoint?
   - Options:
     a. Admin only (bearer token)
     b. Founder + team (role-based)
   - **Recommendation**: Admin only to start, add RBAC later

4. **Citation Format in Guru Response**:
   - Q: Inline citations `[1]` or footnotes or hyperlinks?
   - **Recommendation**: Inline citations with footnote section (shown in spec)

5. **Builder Artifact Validation**:
   - Q: Should we auto-validate artifacts or make it optional?
   - Current: Optional quality scoring
   - **Recommendation**: Always validate, but don't block on low score (just warn)

---

### 8.3 Data Questions

1. **Business Documents Collection**:
   - Q: What documents to index initially?
   - Suggestions:
     - Company strategy memos
     - Student feedback surveys
     - Market research reports
     - Competitor analysis
     - Course analytics reports
   - **Action**: Work with team to prioritize

2. **Course Content Indexing**:
   - Q: Is `rag.chunks` already populated with course content?
   - **Action**: Verify Strapi reindex endpoint works for all courses

3. **User Sessions Visibility**:
   - Q: Should Business graph see anonymous user sessions?
   - Privacy consideration: Aggregate patterns OK, individual artifacts not
   - **Recommendation**: Filter out identifiable user_id, only aggregate

---

## Appendices

### A. File Structure (Final State)

```
apps/agent/
├── src/
│   ├── lib/                        # NEW: Shared library
│   │   ├── retriever.ts
│   │   ├── indexer.ts
│   │   ├── embeddings.ts
│   │   ├── sql.ts
│   │   ├── topic_path.ts
│   │   ├── canon.ts
│   │   ├── types.ts
│   │   └── prompts/
│   │       ├── business.ts
│   │       ├── guru.ts
│   │       └── builder.ts
│   ├── graphs/                     # NEW: Per-graph orchestrators
│   │   ├── business/
│   │   │   ├── orchestrator.ts
│   │   │   └── orchestrator.test.ts
│   │   ├── guru/
│   │   │   ├── orchestrator.ts
│   │   │   └── orchestrator.test.ts
│   │   └── builder/
│   │       ├── orchestrator.ts
│   │       └── orchestrator.test.ts
│   ├── routes/
│   │   ├── chat-business.ts        # NEW
│   │   ├── chat-guru.ts            # NEW
│   │   ├── chat-builder.ts         # NEW (unified)
│   │   ├── rag-query.ts            # Keep for direct RAG access
│   │   ├── rag-feedback.ts
│   │   ├── admin-reindex.ts
│   │   └── [deprecated]/           # OLD endpoints
│   │       ├── session.ts
│   │       └── ...
│   ├── services/                   # Refactored to repositories
│   │   ├── session-repository.ts
│   │   ├── events-repository.ts
│   │   ├── progress-repository.ts
│   │   ├── business-repository.ts  # NEW
│   │   └── guru-repository.ts      # NEW
│   ├── db/
│   │   ├── pool.ts
│   │   └── migrate.ts
│   ├── data/
│   │   ├── realms/
│   │   ├── topics/
│   │   └── topic-orders/
│   ├── types/
│   │   └── [graph-specific types move to graphs/]
│   ├── sql.ts
│   └── index.ts
├── sql/
│   ├── 001_rag_core.sql
│   ├── 002_add_domain_column.sql
│   ├── 003_sessions_schema.sql
│   ├── 004_guru_graph.sql          # NEW
│   └── 005_business_graph.sql      # NEW
├── package.json
└── tsconfig.json
```

---

### B. Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/thegreatsync

# OpenAI
OPENAI_API_KEY=sk-...
EMBED_MODEL=text-embedding-3-small  # Default
CHAT_MODEL_BUSINESS=gpt-4o          # For business graph
CHAT_MODEL_GURU=gpt-4o-mini         # For guru graph
CHAT_MODEL_BUILDER=gpt-4o-mini      # For builder graph

# Strapi Integration
STRAPI_URL=http://localhost:1337
STRAPI_ADMIN_TOKEN=...

# Authentication
ADMIN_TOKEN=...  # For /rag/reindex and /chat/business

# Server
PORT=8787
ALLOWED_ORIGINS=http://localhost:1218,http://localhost:3000

# Graph-Specific Config
GURU_CONFIDENCE_THRESHOLD=0.6       # Minimum score to return answer
GURU_MAX_CHUNKS=10                  # Max context for Guru
BUSINESS_MAX_CHUNKS=20              # Max context for Business
BUILDER_MAX_CHUNKS=10               # Max context for Builder
BUSINESS_SESSION_TTL=3600           # Session timeout (seconds)
```

---

### C. Example Curl Commands

**Business Graph**:
```bash
curl -X POST http://localhost:8787/chat/business \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -d '{
    "message": "What are the top 3 challenges students report in JS courses?",
    "context": {
      "student_count": 1250,
      "completion_rates": {"js-fundamentals": 0.67}
    }
  }'
```

**Guru Graph**:
```bash
curl -X POST http://localhost:8787/chat/guru \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What is a closure in JavaScript?",
    "course_id": "js-fundamentals"
  }'
```

**Builder Graph**:
```bash
# Start session
curl -X POST http://localhost:8787/chat/builder \
  -H "Content-Type: application/json" \
  -d '{
    "message": "",
    "realm_id": "fantasy",
    "topic": "js-closure",
    "user_id": "user-123"
  }'

# Chat turn
curl -X POST http://localhost:8787/chat/builder \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I think a closure is like a treasure chest",
    "session_id": "session-456",
    "action": "chat"
  }'

# Finish
curl -X POST http://localhost:8787/chat/builder \
  -H "Content-Type: application/json" \
  -d '{
    "message": "",
    "session_id": "session-456",
    "action": "finish"
  }'
```

---

### D. Success Metrics

**Per Graph**:

| Metric | Business | Guru | Builder |
|--------|----------|------|---------|
| Response time (p95) | < 3s | < 2s | < 2s |
| Accuracy | N/A (subjective) | > 85% citation accuracy | > 80% artifact quality |
| Throughput | 10 req/s | 50 req/s | 20 req/s |
| Error rate | < 1% | < 1% | < 2% |

**System-Wide**:
- Vector search latency (p95): < 100ms
- Embedding generation (p95): < 500ms
- Database connection pool exhaustion: 0 incidents

---

## Next Steps

1. **Review & Approval**: Share this spec with team for feedback
2. **Architecture Review**: Technical review session with engineers
3. **Resource Planning**: Assign developers to phases
4. **Sprint Planning**: Break down Phase 1 into sprint-sized tasks
5. **Environment Setup**: Provision development databases, API keys
6. **Kickoff**: Begin Phase 1 implementation

---

## Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-10-17 | Claude | Initial draft |

---

**End of Specification**
