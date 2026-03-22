🧠 SPEC: The Great Sync Multi-Agent System

Version 2.0 — November 2025 (IMPLEMENTED)

GOAL

Implement the core multi-agent framework and memory architecture for The Great Sync.
This version enables five specialized AI roles (agents), unified chat + RAG pipelines, long-term conversation storage, and structured lesson delivery from Strapi CMS.

🚩 OVERVIEW

**Implementation Status: ✅ COMPLETE**

The system provides:

Five AI agents, each with its own system prompt, retrieval strategy, and session type
- Three general-purpose agents using universal chat endpoint
- Two specialized agents with dedicated endpoints and workflows

A shared session and message persistence system (rag.sessions, rag.session_messages)

Two routing patterns:
- Universal endpoint: `/agents/:agent/chat` (all 5 agents)
- Specialized endpoints: `/course-instructor/*` (structured lessons)

RAG-powered context retrieval with agent-specific collection preferences

Strapi CMS integration for canon course content delivery

✅ All agents **always** have foundational metaphors
✅ Consistent voice and teaching style
✅ Core rules (references = windows, functions = portals) always accessible
✅ Red flags always available to prevent bad explanations
✅ Agents can reference canon explicitly: "As the canon states..."

## Agents

- Product Owner
- Model Builder
- Teacher QA
- Realm Builder
- Course Instructor

All agents now **preload The Great Sync Core Canon** (`src/data/canon.md`) on every request, ensuring agents always have access to the foundational metaphorical framework regardless of RAG retrieval results.
Added `buildFullContext(chunks)` function that combines canon + RAG

🧩 PART 1 — Database Layer

**Status: ✅ IMPLEMENTED**

Tables: `rag.sessions` and `rag.session_messages`
Migration: `sql/005_add_lesson_type.sql`

Schema additions:
- `agent` CHECK constraint: `'product_owner' | 'model_builder' | 'teacher_qa' | 'realm_builder' | 'course_instructor'`
- `session_type` CHECK constraint: `'improvement' | 'model_build' | 'qa' | 'lesson'`

The `context` JSONB field stores agent-specific state:
- **Realm Builder**: `{ realm_id, realm_snapshot, topic_pack }`
- **Course Instructor**: `{ course_id, subchapter_id, page_ids, current_page_index, total_pages }`
- **Others**: flexible key-value data

All session writes go through `src/services/agent-session-service.ts` - single source of truth for database operations.

🧭 PART 2 — Agent Definitions

**Status: ✅ IMPLEMENTED**

Configuration: `src/config/agents.ts`

All agents share the same architectural pattern:
- System prompt template with `{{context}}` placeholder
- RAG collection preferences
- Session type mapping
- Agent-specific logic in `src/agents/[agent-name].ts`

### 1. 🧠 Product Owner Agent

**Purpose**: Improves existing course materials based on student feedback and reviews

**Session Type**: `improvement`
**Collections**: `['course_content', 'reflections', 'reviews']`
**Endpoint**: `POST /agents/product_owner/chat`

Analyzes student reflections and course reviews to suggest specific improvements in wording, examples, and structure. Can rewrite copy or code examples directly in responses.

### 2. 🧩 Model Builder Agent

**Purpose**: Creates new metaphor models while maintaining consistency with existing Canon

**Session Type**: `model_build`
**Collections**: `['meta_canon', 'overviews', 'user_sessions', 'mnemonics']`
**Endpoint**: `POST /agents/model_builder/chat`

Helps extend The Great Sync into new topics by brainstorming analogies, detecting conflicts with existing metaphors, and linking new concepts to established symbolic structures.

### 3. 🧑‍🏫 Teacher QA Agent

**Purpose**: Answers student questions using Great Sync metaphors and canonical explanations

**Session Type**: `qa`
**Collections**: `['course_content', 'meta_canon', 'user_sessions']`
**Endpoint**: `POST /agents/teacher_qa/chat`

Provides both technical and metaphorical explanations for course topics and student code. Verifies all explanations align with canonical teachings.

### 4. 🏰 Realm Builder Agent

**Purpose**: Guides users in creating custom metaphor worlds using topic packs

**Session Type**: `model_build`
**Collections**: `['meta_canon', 'overviews', 'user_sessions', 'mnemonics']`
**Endpoint**: `POST /agents/realm_builder/chat`
**Implementation**: `src/agents/realm-builder.ts`

Interactive session where learners map technical entities to realm symbols (e.g., closures → portals). Uses structured extraction to create artifacts with legend, rules, script, and red flags. Completes with vectorization into `user_sessions` collection.

**Key Functions**:
- `startRealmSession(user_id, realm_id)` - loads realm & determines next topic
- `finishRealmSession(session_id)` - extracts artifact via OpenAI structured output
- `getRealmProgress(user_id, realm_id)` - tracks completed topics

### 5. 👩‍🎓 Course Instructor Agent

**Purpose**: Teaches structured lessons from Strapi canon courses page-by-page

**Session Type**: `lesson`
**Collections**: `['course_content', 'meta_canon', 'overviews']`
**Endpoints**: Specialized + Universal
**Implementation**: `src/agents/course-instructor.ts`, `src/routes/course-instructor.ts`

Delivers Strapi course content in a structured progression. Combines canon material from CMS with RAG-enhanced explanations. Tracks lesson progress in session context.

**Specialized Endpoints**:
- `POST /course-instructor/start` - begins lesson with `{ course_id, subchapter_id }`
- `POST /course-instructor/chat` - contextual Q&A using current page + RAG
- `POST /course-instructor/next-page` - advances to next page
- `POST /course-instructor/finish` - generates reflection summary
- `GET /course-instructor/session/:id` - retrieves progress

**Key Functions**:
- `startLessonSession()` - fetches subchapter from Strapi, creates session with page tracking
- `getLessonProgress()` - returns current page, index, and completion status
- `finishLessonSession()` - generates reflection (TODO: needs OpenAI implementation)

**Strapi Integration**: `src/services/strapi-client.ts`
- Uses admin token authentication (`STRAPI_ADMIN_TOKEN`)
- Fetches courses, subchapters, pages with populate queries
- Extracts text from Strapi's component-based content (text, video, code, images)
- Parses page types: text, video, text_code, text_image, text_image_code, blocks, reflection

⚙️ PART 3 — Routing Architecture

**Status: ✅ IMPLEMENTED**

The system implements two routing patterns:

### Pattern A: Universal Chat Endpoint

**Route**: `POST /agents/:agent/chat`
**Implementation**: `src/routes/agent-chat.ts`
**Supports**: All 5 agents

This endpoint handles conversational interactions with flexible session management. Works for all agents but is primary interface for Product Owner, Model Builder, and Teacher QA.

**Request Schema** (Zod validation):
```
{
  query: string,
  session_id?: uuid,           // resume existing session
  user_id?: uuid,
  topic?: string,
  domain?: string,
  filters?: { domain, concepts, mnemonic_tags, has_image, code },
  topK?: number (default: 8),
  temperature?: number (default: 0.7),
  maxTokens?: number (default: 1000),
  context?: Record<string, any>  // initial context for new session
}
```

**Flow**:
1. Validate agent parameter against `isValidAgent()`
2. Get or create session via `getOrCreateSession()` or resume with `session_id`
3. Query RAG using agent's preferred collections
4. **Special handling**: Realm Builder sessions get enhanced context via `buildCourseInstructorContext()` if `realm_snapshot` exists
5. Build system prompt by injecting context into agent template
6. Load recent message history (truncated to last 30 messages)
7. Call OpenAI with composed messages array
8. Save user + assistant messages via `addMessage()`
9. Return response with sources and metadata

### Pattern B: Specialized Endpoints

**Route**: `/course-instructor/*`
**Implementation**: `src/routes/course-instructor.ts`
**Supports**: Course Instructor only

These endpoints provide structured lesson workflow with page progression:

- **Start**: Creates session with Strapi subchapter data
- **Chat**: Combines current page text + RAG context for Q&A
- **Next Page**: Updates session context, loads new page
- **Finish**: Ends session with reflection (TODO: needs implementation)
- **Get Session**: Retrieves current progress

This pattern enables UX features not possible with universal chat (page navigation, progress tracking, structured completion).

### Helper Endpoints

**Route**: `GET /agents`
Lists all 5 available agents with descriptions and session types.

**Route**: `GET /agents/:agent/session/:session_id`
Retrieves session details for any agent.

**Route**: `GET /agents/:agent/session/:session_id/history`
Fetches conversation history with optional limit parameter.

🧱 PART 4 — Canon & Strapi Integration

**Status: ✅ IMPLEMENTED**

### Strapi Content Structure

**Types**: `src/types/strapi.ts`

The system models Strapi's hierarchical content:
- **Course** → **Chapter** → **Subchapter** → **Page**
- Each page has dynamic content components (text, video, code, images)
- Pages have `visible` flag for controlling lesson flow
- Menu breadcrumbs provide course context

### Content Delivery

**Service**: `src/services/strapi-client.ts`

Functions:
- `fetchCourse(courseId)` - loads course with chapters/subchapters
- `fetchSubchapterWithPages(subchapterId)` - gets full subchapter for lessons
- `fetchPage(pageId)` - retrieves single page with all components
- `fetchPages(pageIds[])` - batch fetch multiple pages
- `extractPageText(page)` - converts components to plain text
- `getPageCourseTitle(page)` - extracts course name from menu

Authentication uses `STRAPI_ADMIN_TOKEN` for full access to published and draft content.

### Vectorization Strategy

Course content should be indexed into `rag.chunks` with appropriate collection tags:
- `collection='meta_canon'` for Meta-Canon (symbolic rules, grammar)
- `collection='course_content'` for lesson pages
- `collection='overviews'` for high-level explanations

Metadata should include: `domain`, `concepts`, `mnemonic_tags`, `has_image`, `code_languages`

Note: Course Instructor agent fetches content directly from Strapi (not vectorized chunks) to ensure real-time page delivery. RAG supplements with related canonical knowledge.

🧩 PART 5 — Session Lifecycle

**Status: ✅ IMPLEMENTED**

**Service Layer**: `src/services/agent-session-service.ts`

This is the **single source of truth** for database writes. All agents must call through this service - no direct DB access.

### Core Functions

**Session Management**:
- `createSession(input)` - creates new session
- `getOrCreateSession(agent, user_id, topic, ...)` - resumes or creates
- `getSession(session_id)` - retrieves session data
- `updateSessionContext(session_id, context)` - updates JSONB context
- `endSession(session_id, summary, output, score)` - marks complete
- `markSessionVectorized(session_id)` - sets vectorized flag

**Message Management**:
- `addMessage(session_id, role, content, metadata)` - stores message
- `getSessionHistory(session_id, limit)` - fetches recent messages (chronological)
- `getFullHistory(session_id)` - all messages for session

### Lifecycle Example

**Realm Builder Session**:
1. `startRealmSession()` → `createSession()` with realm context
2. User chats via `/agents/realm_builder/chat` → `addMessage()` for each turn
3. `finishRealmSession()` → OpenAI extracts artifact → `endSession()` with output
4. `vectorizeSessionArtifact()` → creates chunks in `user_sessions` collection
5. `markSessionVectorized()` → completes lifecycle

**Course Instructor Session**:
1. `startLessonSession()` → `createSession()` with Strapi page tracking
2. User asks questions → `addMessage()` logs conversation
3. User advances → `updateSessionContext()` increments page index
4. `finishLessonSession()` → TODO: generate reflection → `endSession()`

🧠 PART 6 — Context Construction

**Status: ✅ IMPLEMENTED**

**Builder Service**: `src/services/context-builder.ts`

### Context Pipeline

For each chat turn:

1. **Load Core Canon**: `loadCoreCanon()` reads `src/data/canon.md` (cached after first load)
2. **Retrieve**: `queryRAG()` fetches top-K chunks using agent's collections
3. **Combine**: `buildFullContext(chunks)` creates unified context:
   ```
   === CORE CANON (Always Loaded) ===
   [104 lines of foundational metaphors - water, islands, ships, rules]

   === RELATED MATERIAL (Per Query) ===
   [RAG-retrieved chunks with breadcrumbs]
   ```
4. **Special Handling**:
   - Realm Builder: `buildCourseInstructorContext()` adds realm symbols + topic entities
   - Course Instructor: Appends current Strapi page after canon + RAG
5. **Inject**: `buildSystemPrompt(template, context)` replaces `{{context}}` placeholder
6. **History**: `truncateHistory(messages, 30)` keeps recent conversation
7. **Compose**: `buildOpenAIMessages(systemPrompt, history, newQuery)` creates messages array

### OpenAI Messages Structure

```javascript
[
  { role: 'system', content: SYSTEM_PROMPT_WITH_CONTEXT },
  { role: 'user', content: 'previous question' },
  { role: 'assistant', content: 'previous answer' },
  // ... up to 30 recent messages
  { role: 'user', content: 'current question' }
]
```

The system prompt includes the agent's role definition and the full context (canon + RAG + optional extras), ensuring OpenAI always has foundational metaphors available.

**Key Benefit**: Agents always reference Great Sync metaphors (water = flow, functions = portals, closures = kept keys) even when RAG doesn't retrieve those specific chunks. This ensures consistent teaching voice across all responses.

🚀 PART 7 — Implementation Files

**Status: ✅ COMPLETE**

### Database

- `sql/005_add_lesson_type.sql` - Migration for 5 agents + lesson type

### Core Configuration

- `src/config/agents.ts` - Agent definitions with prompts & collections
- `src/types/agent.ts` - TypeScript interfaces for sessions, messages, API
- `src/types/strapi.ts` - Strapi content structure types

### Services (Shared Infrastructure)

- `src/services/agent-session-service.ts` - Database layer (single source of truth)
- `src/services/context-builder.ts` - Context formatting and prompt injection
- `src/services/strapi-client.ts` - Strapi API integration
- `src/services/rag-service.ts` - Vector search (existing)
- `src/services/session-vectorizer.ts` - Artifact indexing (existing)

### Routes (API Endpoints)

- `src/routes/agent-chat.ts` - Universal chat endpoint (all 5 agents)
- `src/routes/course-instructor.ts` - Specialized lesson endpoints
- `src/index.ts` - Express app with route registration

### Agent Logic

- `src/agents/realm-builder.ts` - Realm building workflow
- `src/agents/course-instructor.ts` - Strapi lesson delivery

### Supporting

- `src/prompts/session-prompts.ts` - Prompt templates for extraction
- `CODE_REVIEW.md` - Code review with fixes applied

### Environment Variables Required

```bash
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
STRAPI_URL=http://localhost:1337
STRAPI_ADMIN_TOKEN=your-admin-token
CHAT_MODEL=gpt-4o-mini  # optional, defaults to gpt-4o-mini
```

## ✅ IMPLEMENTATION SUMMARY

### What Works

✅ 5 agents with distinct roles and RAG collections
✅ Universal chat endpoint (`/agents/:agent/chat`) for all agents
✅ Specialized Course Instructor endpoints with page progression
✅ **Core Canon preloading** - all agents always have foundational metaphors
✅ Session persistence with JSONB context storage
✅ Message history with truncation (last 30 messages)
✅ Strapi integration with admin token auth
✅ Context injection with agent-specific formatting
✅ Realm Builder with structured artifact extraction
✅ Zod validation on all endpoints
✅ Environment variable validation at startup
✅ TypeScript compilation with no errors
✅ File system caching for canon (0ms after first load)

### TODO

⏳ Complete `finishLessonSession()` reflection generation using OpenAI
⏳ Test with real Strapi course data
⏳ Run database migration (`pnpm migrate`)
⏳ Consider renaming `buildCourseInstructorContext()` to `buildRealmBuilderContext()` (minor)

### Architecture Decisions

**Dual-Pattern Routing**: Course Instructor has both universal (`/agents/course_instructor/chat`) and specialized endpoints. Universal works for general questions, specialized provides lesson-specific features (page navigation, progress tracking).

**Context Storage**: JSONB `context` field allows each agent to store custom state without schema changes. Realm Builder stores realm + topic data, Course Instructor stores page progression.

**Service Boundary**: All database writes funnel through `agent-session-service.ts`. Agents never write directly to DB, ensuring consistency.

**Strapi Direct Fetch**: Course Instructor fetches pages directly from Strapi instead of using vectorized chunks. This ensures real-time content delivery and allows content updates without reindexing. RAG supplements with related canonical material.

### Testing Next Steps

1. Set environment variables
2. Run `pnpm migrate`
3. Test universal endpoint: `POST /agents/teacher_qa/chat`
4. Test specialized workflow:
   - Start: `POST /course-instructor/start`
   - Chat: `POST /course-instructor/chat`
   - Advance: `POST /course-instructor/next-page`
   - Complete: `POST /course-instructor/finish`
5. Verify session persistence in database
6. Test Realm Builder artifact extraction