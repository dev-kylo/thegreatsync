# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

The Great Sync is a multimedia learning platform. It's a pnpm monorepo with multiple apps under `/apps`.

## Monorepo Structure

| App | Tech | Port | Description |
|-----|------|------|-------------|
| **coursehub** | Next.js (React 18, Pages Router) | 1218 | Main learning platform frontend |
| **strapi** | Strapi 4.25 | 1337 | Headless CMS backend (PostgreSQL) |
| **tgs** | Express.js | 8787 | RAG service with OpenAI embeddings + Supabase pgvector |
| **imagimodels** | Astro | - | Static site for model content |
| **salespages/imagine** | Next.js | - | Landing page for Imagine JavaScript course |
| **server** | Node.js | 2222 | GitHub webhook listener for auto-deploy |

Shared packages live in `/packages` (db-utils, express-utils).

## Common Commands

```bash
# From repo root:
pnpm hub:dev              # Start coursehub dev server (port 1218)
pnpm strapi:dev           # Start Strapi dev server (port 1337)

# Coursehub (from apps/coursehub):
npm run dev               # Next.js dev server
npm run build             # Production build
npm run lint              # ESLint
npm run lint:fix          # Auto-fix lint issues
npm run test              # Jest in watch mode

# Strapi (from apps/strapi):
pnpm strapi develop       # Dev mode
pnpm strapi build         # Production build (NODE_ENV=production)
npm run strapi ts:generate-types  # Generate TS types from schemas

# Filtering from root:
pnpm --filter coursehub <command>
pnpm --filter strapi <command>
```

## Architecture Notes

- **Auth**: coursehub uses NextAuth.js v4 with CredentialsProvider. JWT tokens from Strapi are stored in the NextAuth session and used for Strapi API calls. Auth logic is in `apps/coursehub/pages/api/auth/[...nextauth].ts` with services in `apps/coursehub/services/`.
- **Content flow**: Strapi manages courses/chapters/subchapters/pages. Coursehub fetches via Strapi REST API. Content types are in `apps/strapi/src/api/`.
- **Video**: Mux integration via `strapi-plugin-mux-video-uploader`, rendered with `@mux/mux-video-react` in coursehub.
- **RAG service (tgs)**: Embeds course content using OpenAI `text-embedding-3-small` (1536 dims), stores in Supabase PostgreSQL with pgvector. SQL migrations in `apps/tgs/sql/`.
- **Uploads**: AWS S3 via `@strapi/provider-upload-aws-s3`. Images served from S3/Cloudinary (configured in `next.config.js` remotePatterns).

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

## Code Style (coursehub)

ESLint extends `next/core-web-vitals` + `wesbos/typescript`. Prettier config: single quotes, trailing commas (es5), print width 120, tab width 4.
