/**
 * Context Builder Service
 * Shared helpers for formatting RAG context consistently across all agents
 */

import fs from 'fs';
import path from 'path';
import type { RagChunk } from './rag-service';
import type { SessionMessage } from '../types/agent';

// Cache the core canon to avoid file I/O on every request
let coreCanonCache: string | null = null;

/**
 * Load The Great Sync Core Canon
 * This provides the foundational metaphorical framework for all agents
 * Cached after first load for performance
 */
export function loadCoreCanon(): string {
  if (coreCanonCache) {
    return coreCanonCache;
  }

  try {
    const canonPath = path.join(__dirname, '../data/canon.md');
    coreCanonCache = fs.readFileSync(canonPath, 'utf-8');
    return coreCanonCache;
  } catch (error) {
    console.error('Failed to load core canon:', error);
    return '(Core canon unavailable)';
  }
}

/**
 * Build formatted context string from RAG chunks
 * Consistent format across all agents: [Source N] breadcrumb > content
 */
export function buildContextString(chunks: RagChunk[]): string {
  if (chunks.length === 0) {
    return 'No specific course material found for this query.';
  }

  return chunks
    .map((chunk, idx) => {
      // Build breadcrumb navigation
      const breadcrumb = [
        chunk.course_title,
        chunk.chapter_title,
        chunk.subchapter_title,
        chunk.page_title,
      ]
        .filter(Boolean)
        .join(' > ');

      // Format: [Source N] breadcrumb\ncontent
      return `[Source ${idx + 1}] ${breadcrumb || chunk.collection}\n${chunk.content}`;
    })
    .join('\n\n---\n\n');
}

/**
 * Build full context with core canon + RAG chunks
 * Core canon is always loaded, RAG chunks are query-specific
 */
export function buildFullContext(chunks: RagChunk[]): string {
  const coreCanon = loadCoreCanon();
  const ragContext = buildContextString(chunks);

  return `=== CORE CANON (Always Loaded) ===

${coreCanon}

=== RELATED MATERIAL (Per Query) ===

${ragContext}`;
}

/**
 * Build system prompt by injecting context into agent template
 * Replaces {{context}} placeholder with formatted RAG context
 */
export function buildSystemPrompt(agentTemplate: string, context: string): string {
  return agentTemplate.replace('{{context}}', context);
}

/**
 * Format session history into OpenAI message format
 * Filters out system messages (those are separate) and returns user/assistant messages
 */
export function formatMessagesForOpenAI(
  messages: SessionMessage[]
): Array<{ role: 'user' | 'assistant'; content: string }> {
  return messages
    .filter((msg) => msg.role !== 'system')
    .map((msg) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    }));
}

/**
 * Truncate conversation history to fit within token limits
 * Keeps most recent N messages (default: 30)
 */
export function truncateHistory(messages: SessionMessage[], maxMessages: number = 30): SessionMessage[] {
  if (messages.length <= maxMessages) {
    return messages;
  }

  // Keep most recent messages
  return messages.slice(-maxMessages);
}

/**
 * Build complete OpenAI messages array with system prompt and history
 */
export function buildOpenAIMessages(
  systemPrompt: string,
  history: SessionMessage[],
  userMessage: string
): Array<{ role: 'system' | 'user' | 'assistant'; content: string }> {
  const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
    { role: 'system', content: systemPrompt },
  ];

  // Add conversation history (excluding system messages)
  messages.push(...formatMessagesForOpenAI(history));

  // Add current user message
  messages.push({ role: 'user', content: userMessage });

  return messages;
}

/**
 * Build metadata object for message storage
 * Includes retrieved chunk IDs, filters used, and other query info
 */
export function buildMessageMetadata(
  chunks: RagChunk[],
  filters?: Record<string, any>,
  queryParams?: Record<string, any>
): Record<string, any> {
  return {
    retrieved_chunk_ids: chunks.map((c) => c.chunk_uid),
    retrieved_collections: [...new Set(chunks.map((c) => c.collection))],
    chunks_retrieved: chunks.length,
    filters: filters || {},
    query_params: queryParams || {},
    timestamp: new Date().toISOString(),
  };
}

/**
 * Extract source references from RAG chunks for API response
 */
export function extractSourceReferences(chunks: RagChunk[]) {
  return chunks.map((chunk) => ({
    chunk_uid: chunk.chunk_uid,
    collection: chunk.collection,
    page_title: chunk.page_title || undefined,
    course_title: chunk.course_title || undefined,
    chapter_title: chunk.chapter_title || undefined,
    subchapter_title: chunk.subchapter_title || undefined,
    score: chunk.score,
    has_image: chunk.has_image,
    code_languages: chunk.code_languages || [],
  }));
}

/**
 * Format Course Instructor context with realm symbols and topic entities
 * Special formatting for the Course Instructor agent
 */
export function buildCourseInstructorContext(
  realmSnapshot: { symbol_inventory: string[]; hints: string[] },
  topicPack: { entities: Array<{ id: string; name: string; description: string }> },
  ragContext: string
): string {
  const symbolsSection = `
Available Realm Symbols:
${realmSnapshot.symbol_inventory.join(', ')}

Guidance for Symbol Usage:
${realmSnapshot.hints.map((hint, idx) => `${idx + 1}. ${hint}`).join('\n')}
`;

  const entitiesSection = `
Entities to Map (Technical → Symbolic):
${topicPack.entities.map((e) => `- ${e.name}: ${e.description}`).join('\n')}
`;

  return `${symbolsSection}

${entitiesSection}

Relevant Course Material:

${ragContext}`;
}
