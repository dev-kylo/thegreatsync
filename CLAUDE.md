# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

The Great Sync is a multimedia learning platform built as a monorepo using pnpm workspaces. The project consists of multiple applications including a course hub (Next.js), Strapi CMS backend, landing pages, and a new agent service.

## Development Commands

### Root-level Commands (run from project root)
```bash
# Install dependencies across all workspaces
pnpm install

# Run specific app from root
pnpm hub:dev        # Runs CourseHub on port 1218
pnpm strapi:dev     # Runs Strapi development server
pnpm hub            # Access CourseHub package commands
pnpm strapi         # Access Strapi package commands
pnpm landing        # Access Landing package commands
pnpm imagine        # Access Imagine package commands
pnpm imagimodels    # Access Imagimodels package commands
```

### App-Specific Commands

**CourseHub (apps/coursehub)**
```bash
pnpm dev         # Start development server on port 1218
pnpm build       # Build for production
pnpm lint        # Run Next.js linter
pnpm lint:fix    # Auto-fix linting issues
pnpm test        # Run Jest tests in watch mode
```

**Strapi CMS (apps/strapi)**
```bash
pnpm develop     # Start development server
pnpm build       # Build for production (NODE_ENV=production)
pnpm strapi ts:generate-types  # Generate TypeScript types
```

**Agent Service (apps/agent)**
```bash
pnpm dev         # Start with nodemon watching
pnpm build       # Compile TypeScript
pnpm start       # Run compiled JavaScript
```

**Landing Pages (apps/landing)**
```bash
pnpm dev         # Start Next.js development
pnpm build       # Build for production
pnpm lint        # Run linter
```

## Architecture Overview

### Tech Stack
- **Frontend**: Next.js (Pages Router) for CourseHub and Landing pages
- **Backend**: Strapi v4 CMS with PostgreSQL
- **Agent Service**: Express.js with OpenAI integration for RAG functionality
- **State Management**: React Context API, SWR for data fetching
- **Authentication**: NextAuth.js integrated with Strapi
- **Styling**: Tailwind CSS across all frontend apps

### Key Architectural Patterns

1. **Monorepo Structure**: Uses pnpm workspaces for dependency management across multiple applications

2. **CourseHub Architecture**:
   - Pages Router with dynamic routing for course navigation (`/courses/[courseId]/[chapter]/[subchapter]/[pageId]`)
   - Component-based architecture with reusable UI components and layout systems
   - Context providers for navigation and step management
   - Service layer pattern for API calls (see `services/` directory)

3. **Strapi Backend**:
   - Content types for courses, chapters, pages, users, enrollments, reflections
   - Custom API endpoints for course progress, user completions, and RAG functionality
   - Component-based content modeling for different page types (text, video, code blocks)

4. **Agent Service (New)**:
   - RAG (Retrieval-Augmented Generation) implementation with PostgreSQL vector storage
   - OpenAI embeddings for semantic search
   - Express routes for querying, feedback, and admin reindexing

5. **Authentication Flow**:
   - NextAuth.js handles authentication in CourseHub
   - Sessions linked to Strapi user accounts
   - Protected routes and API endpoints

### Database Schema
- PostgreSQL database shared between Strapi and Agent services
- Strapi manages course content and user data
- Agent service adds vector embeddings for RAG functionality

## Strapi Content Types and Relationships

### Content Hierarchy
The course content follows a hierarchical structure:
```
Course (collection)
  └── Chapters (many-to-many relation)
      └── Subchapters (one-to-many relation)
          └── Pages (one-to-many relation)
```

### Core Content Types

**Course** (`api::course.course`)
- `uid`: Unique identifier (required)
- `title`: Course name (required)
- `description`: Dynamic zone with text/video components
- `chapters`: Many-to-many relation with chapters
- `imagimodel`: One-to-one relation with visual model

**Chapter** (`api::chapter.chapter`)
- `title`: Chapter name
- `menu`: Menu component for navigation
- `subchapters`: One-to-many relation with subchapters
- `visible`: Boolean visibility flag (default: true)
- `courses`: Many-to-many inverse relation with courses

**Subchapter** (`api::subchapter.subchapter`)
- `title`: Subchapter name (required)
- `pages`: One-to-many relation with pages
- `menu`: Menu component for navigation (required)
- `visible`: Boolean visibility flag (default: true)

**Page** (`api::page.page`)
- `title`: Page title (required)
- `type`: Enumeration defining page layout (required)
- `content`: Dynamic zone with media components
- `menu`: Repeatable menu components
- `visible`: Boolean visibility flag (default: true)
- `links`: Repeatable link components
- `concepts`: Repeatable concept metadata

### Page Types (Layouts)
Pages can have different layouts based on the `type` field:
- `text`: Simple text content
- `video`: Video player page
- `text_code`: Text with code editor
- `text_image`: Text with image
- `text_image_code`: Three-column layout with text, image, and code
- `blocks`: Flexible block-based content
- `reflection`: Special reflection/quiz page

### Media Components
Components used in dynamic zones for flexible content:

**text** (`media.text`)
- Rich text content

**video** (`media.video`)
- Relation to Mux video asset

**text-image** (`media.text-image`)
- Text with image, alt text, and optional caption

**text-image-code** (`media.text-image-code`)
- Combined text, image, and code content
- Includes image classification metadata

**code-editor** (`media.code-editor`)
- Interactive code editor with:
  - Multiple code files
  - Line numbers toggle
  - Preview toggle
  - Description types (explanation/answer/note)
  - Run button visibility control

**image** (`media.image`)
- Standalone image with metadata

### Additional Content Types

**Reflection** (`api::reflection.reflection`)
- User-submitted reflections linked to pages

**User Course Progress** (`api::user-course-progress.user-course-progress`)
- Tracks user completion status per page

**Enrollment** (`api::enrollment.enrollment`)
- Links users to courses they have access to

**Imagimodel** (`api::imagimodel.imagimodel`)
- Visual learning models with layers and zones

### Environment Variables
Key environment variables needed:
- `STRAPI_URL`: Strapi backend URL
- `DATABASE_URL`: PostgreSQL connection string
- `OPENAI_API_KEY`: For embeddings and AI features
- `NEXTAUTH_*`: Authentication configuration
- `MUX_*`: Video streaming credentials

### Testing Strategy
- Jest for unit tests in CourseHub
- MSW (Mock Service Worker) for API mocking
- Test files located alongside components