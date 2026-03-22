# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This monorepo hosts multiple projects under the Memverse umbrella using pnpm workspaces:

1. **The Great Sync (TGS)** - A multimedia learning platform for teaching JavaScript. Uses apps/coursehub as the frontend, apps/strapi for the backend content management, and apps/tgs for AI agent APIs
2. **AI Workflows for Coaches** - A nextjs site for visualizing JSON data on coach SOPs as AI workflows
3. **Future projects** - Coach workflow AI agents, etc.

Shared utilities live in `packages/` under the `@memverse` namespace.

## Development Commands

### Root-level Commands
```bash
pnpm install         # Install all workspace dependencies

# App shortcuts
pnpm hub:dev         # CourseHub on port 1218
pnpm strapi:dev      # Strapi CMS
pnpm tgs dev         # TGS agent service
pnpm audits dev      # Audits app
```

### Shared Packages
```bash
# Build packages (required before apps can use them)
pnpm --filter @memverse/db-utils build
pnpm --filter @memverse/express-utils build
```

### App-Specific Commands

**CourseHub (apps/coursehub)**
```bash
pnpm dev         # Start development server on port 1218
pnpm build       # Build for production
pnpm lint        # Run Next.js linter
pnpm test        # Run Jest tests
```

**Strapi CMS (apps/strapi)**
```bash
pnpm develop     # Start development server
pnpm build       # Build for production
pnpm strapi ts:generate-types  # Generate TypeScript types
```

**TGS Agent Service (apps/tgs)**
```bash
pnpm dev         # Start with nodemon
pnpm build       # Compile TypeScript
pnpm start       # Run compiled JavaScript
pnpm migrate     # Run database migrations
```

**Property Management (apps/property)**
```bash
pnpm dev         # Start with nodemon (port 3100)
pnpm build       # Compile TypeScript
pnpm start       # Run compiled JavaScript
pnpm migrate     # Run database migrations
```

## Architecture Overview

### Monorepo Structure
```
thegreatsync/
├── apps/
│   ├── coursehub/       # Next.js course platform
│   ├── strapi/          # Strapi CMS backend for coursehub
│   ├── tgs/             # TGS RAG agent service for coursehub
│   ├── property/        # Property management API
│   ├── audits/          # Audits Next.js app
│   └── ...
├── packages/
│   ├── db-utils/        # @memverse/db-utils - PostgreSQL utilities
│   └── express-utils/   # @memverse/express-utils - Express middleware
└── pnpm-workspace.yaml
```

### Shared Packages (@memverse/*)

**@memverse/db-utils**
- `createPool(config)` - PostgreSQL connection pool factory
- `withTransaction(pool, fn)` - Transaction wrapper
- Extracted from TGS for reuse across projects

**@memverse/express-utils**
- `createAuthMiddleware(options)` - Timing-safe Bearer token auth
- `createHealthCheck(options)` - Health check endpoint factory
- `validateBody(schema)` - Zod validation middleware
- `formatZodError(error)` - Consistent error formatting
- `createSupabaseJwtMiddleware(options)` - Fast JWT verification via JWKS (recommended)
- `createOptionalSupabaseJwtMiddleware(options)` - Optional auth for public/private routes
- `createSupabaseClientMiddleware(options)` - Full session validation via getUser()

### Tech Stack
- **Frontend**: Next.js (Pages Router) for CourseHub
- **Backend**: Strapi v4 CMS with PostgreSQL
- **Agent Services**: Express.js with OpenAI integration
- **State Management**: React Context API, SWR
- **Authentication**: NextAuth.js integrated with Strapi
- **Styling**: Tailwind CSS

### Database Strategy
Each project uses its **own database**:
- TGS: `thegreatsync_db` (shared with Strapi)
- Property: `property_management_db`

### TGS Agent Service (apps/tgs)
- RAG implementation with PostgreSQL vector storage
- OpenAI embeddings for semantic search
- 5 specialized agents (product_owner, model_builder, teacher_qa, realm_builder, course_instructor)
- Session management and context building

### Property Management (apps/property)
- Express API for n8n workflow integration
- Email ingestion from Gmail via n8n webhooks
- Property/tenant management
- Uses @memverse shared packages

## Strapi Content Types

### Content Hierarchy
```
Course → Chapters → Subchapters → Pages
```

### Core Types
- **Course**: uid, title, description, chapters, imagimodel
- **Chapter**: title, menu, subchapters, visible
- **Subchapter**: title, pages, menu, visible
- **Page**: title, type, content (dynamic zone), menu, links, concepts

### Page Types
text, video, text_code, text_image, text_image_code, blocks, reflection

### Media Components
text, video, text-image, text-image-code, code-editor, image

## Environment Variables

**TGS (apps/tgs)**
- `DATABASE_URL` - PostgreSQL connection
- `OPENAI_API_KEY` - OpenAI API
- `STRAPI_URL`, `STRAPI_ADMIN_TOKEN` - Strapi integration
- `ADMIN_TOKEN` - API authentication

**Property (apps/property)**
- `DATABASE_URL` - PostgreSQL connection (separate DB)
- `SUPABASE_URL` - Supabase project URL (for auth)
- `SUPABASE_ANON_KEY` - Supabase anon/public key
- `PORT` - Server port (default 3100)
- `ALLOWED_ORIGINS` - CORS origins

**CourseHub**
- `STRAPI_URL` - Strapi backend URL
- `NEXTAUTH_*` - Authentication config
- `MUX_*` - Video streaming

## Testing
- Jest for unit tests in CourseHub
- MSW for API mocking
- Test files alongside components
