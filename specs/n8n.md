# n8n Setup & Integration

## Overview

n8n is used for workflow automation, primarily for ingesting Notion pages into the RAG system. This document covers local development setup and production deployment.

## Local Development Setup

### Prerequisites

- Docker installed on your machine
- `docker-compose.yml` in project root

### Running n8n Locally

```bash
# Start n8n
docker-compose up -d n8n

# View logs
docker-compose logs -f n8n

# Stop n8n
docker-compose down
```

### Access

- **URL**: http://localhost:5678
- **Username**: `admin`
- **Password**: Set in `docker-compose.yml` (default: `yourpassword`)

### Data Persistence

n8n uses **SQLite** by default with data stored in a Docker volume:

- **Volume**: `n8n_data` (Docker-managed)
- **Workflows**: Optionally persisted to `./n8n/workflows/` (gitignored)
- **What's stored**: Workflow definitions, execution history, credentials (encrypted), settings

**No database setup required** - n8n handles this automatically!

## Configuration

Located in `docker-compose.yml`:

```yaml
services:
  n8n:
    image: n8nio/n8n:latest
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=yourpassword
      - N8N_HOST=localhost
      - N8N_PROTOCOL=http
      - WEBHOOK_URL=http://localhost:5678/
      - GENERIC_TIMEZONE=Asia/Dubai
```

### Key Environment Variables

| Variable | Purpose | Local Value | Production Value |
|----------|---------|-------------|------------------|
| `N8N_HOST` | Hostname | `localhost` | Your domain |
| `N8N_PROTOCOL` | HTTP/HTTPS | `http` | `https` |
| `WEBHOOK_URL` | Webhook base URL | `http://localhost:5678/` | `https://yourdomain.com/` |
| `N8N_BASIC_AUTH_ACTIVE` | Enable authentication | `true` | `true` |
| `GENERIC_TIMEZONE` | Timezone | `Asia/Dubai` | Your timezone |

## Notion → RAG Integration Workflow

### Workflow Components

1. **Trigger**: Notion Database Item Created/Updated
2. **Transform**: Map Notion properties to API format
3. **HTTP Request**: POST to agents service `/notion/ingest`

### Notion Database Setup

Create a Notion database with these properties:

| Property | Type | Purpose | Required |
|----------|------|---------|----------|
| **Title** | Title | Page title | Yes |
| **Category** | Select | `transcripts`, `ideas`, `research` | No |
| **Domain** | Select | `ai-systems`, `pedagogy`, `javascript`, etc. | No |
| **Tags** | Multi-select | Specific concepts for filtering | No |
| **Date** | Date | Creation/discussion date | No |
| **Author** | Person | Optional attribution | No |

### API Endpoint

**POST** `http://host.docker.internal:8787/notion/ingest`

**Request Body:**
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

**Response:**
```json
{
  "ok": true,
  "page_id": "abc123",
  "chunks_created": 5,
  "chunk_uids": [
    "notion:notion_note:abc123:u_0:0",
    "notion:notion_note:abc123:u_0:1",
    "notion:notion_note:abc123:u_0:2",
    "notion:notion_note:abc123:u_0:3",
    "notion:notion_note:abc123:u_0:4"
  ]
}
```

### n8n Workflow Design

**Step 1: Notion Trigger**
- Node: Notion → Database Item
- Event: Item Created or Updated
- Database: Select your Notion database

**Step 2: Get Page Content**
- Node: Notion → Get Page Blocks
- Convert blocks to Markdown

**Step 3: Transform Data**
- Node: Function or Set
- Map Notion properties to API format
- Extract page ID, title, properties, content

**Step 4: HTTP Request**
- Node: HTTP Request
- Method: POST
- URL: `http://host.docker.internal:8787/notion/ingest`
- Headers: `Content-Type: application/json`
- Body: Transformed data from Step 3

### Docker Network Access

**From n8n container to host services:**
- Use `host.docker.internal` instead of `localhost`
- Example: `http://host.docker.internal:8787/notion/ingest`

**From host to n8n webhooks:**
- Use `http://localhost:5678/webhook/...`

## Content Best Practices

### Findability in RAG

**Content Structure:**
- Start with 2-3 sentence summary
- Use descriptive headings
- Include technical terms explicitly
- Add examples and context
- Link related concepts

**Metadata Strategy:**
- **Title**: Descriptive with key terms (e.g., "JavaScript Closure: Reference vs Copy")
- **Domain**: Broad category (3-5 domains max: `javascript`, `ai-systems`, `pedagogy`)
- **Tags**: Specific concepts (`closures`, `lexical-scope`, `memory-model`)
- **Category**: Content type (`transcripts`, `ideas`, `research`)

**Query Impact:**
- Content quality drives 70% of relevance score (semantic search)
- Title/tags improve 30% keyword matching
- Domain/tags enable precise filtering

## Production Deployment (Droplet)

### Steps

1. **Copy docker-compose.yml to droplet**
```bash
scp docker-compose.yml user@your-droplet:/path/to/app/
```

2. **Update environment variables**
```yaml
environment:
  - N8N_HOST=your-domain.com
  - N8N_PROTOCOL=https
  - WEBHOOK_URL=https://your-domain.com/
  - N8N_BASIC_AUTH_PASSWORD=strong-random-password
```

3. **Start n8n**
```bash
docker-compose up -d n8n
```

4. **Update Notion webhook URLs**
- Change from `host.docker.internal:8787` to your production agents service URL

### Optional: PostgreSQL Backend

For better performance/scalability:

```yaml
environment:
  - DB_TYPE=postgresdb
  - DB_POSTGRESDB_HOST=your-postgres-host
  - DB_POSTGRESDB_PORT=5432
  - DB_POSTGRESDB_DATABASE=n8n
  - DB_POSTGRESDB_USER=n8n
  - DB_POSTGRESDB_PASSWORD=secure-password
```

**Not required** - SQLite is sufficient for most use cases.

## Troubleshooting

### n8n Can't Reach Local Services

**Problem**: HTTP Request to `localhost:8787` fails

**Solution**: Use `host.docker.internal:8787` instead
- Docker containers can't access `localhost` (refers to container itself)
- `host.docker.internal` is Docker's special DNS name for the host machine

### Workflows Not Persisting

**Problem**: Workflows disappear after container restart

**Solution**: Check volume mounting
```bash
docker volume ls | grep n8n_data
```

If missing, recreate:
```bash
docker-compose down
docker-compose up -d
```

### Authentication Issues

**Problem**: Can't log in to n8n

**Solution**: Check environment variables
```bash
docker-compose logs n8n | grep AUTH
```

Reset password in `docker-compose.yml` and restart:
```bash
docker-compose restart n8n
```

## Workflow Export/Import

### Export Workflow (for backup/sharing)

1. Open workflow in n8n
2. Click "..." menu → Download
3. Saves as JSON file

### Import Workflow

1. n8n → Workflows → Import from File
2. Select JSON file
3. Activate workflow

## Security Notes

- **Change default password** in production
- **Use HTTPS** in production (update `N8N_PROTOCOL`)
- **Secure webhook URLs** - consider adding authentication tokens
- **Credentials encryption** - n8n encrypts stored credentials automatically
- **Network isolation** - Consider running n8n in private network on droplet

## Related Documentation

- **RAG Indexing**: See `specs/rag_v1.md` for Notion ingestion details
- **Agents Service**: See `apps/agents/src/routes/notion-ingest.ts` for API implementation
- **n8n Official Docs**: https://docs.n8n.io/
