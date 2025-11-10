/**
 * Type definitions for the multi-agent system
 */

import type { AgentId, SessionType } from '../config/agents';

// ============================================================================
// Session Types
// ============================================================================

/**
 * Complete session data from database
 */
export interface AgentSession {
  id: string;                                // UUID
  user_id?: string;                          // UUID or null
  agent: AgentId;                            // Which agent handles this session
  session_type: SessionType;                 // Type of session workflow
  topic?: string;                            // Optional topic identifier
  domain?: string;                           // e.g., 'javascript', 'react'
  context: Record<string, any>;              // Agent-specific context data
  started_at: Date;
  ended_at?: Date;
  summary?: string;                          // Brief summary when session ends
  output?: Record<string, any>;              // Final artifacts
  score?: number;                            // Optional validation score (0..1)
  vectorized: boolean;                       // Whether output has been indexed
}

/**
 * Input for creating a new session
 */
export interface CreateSessionInput {
  user_id?: string;
  agent: AgentId;
  session_type: SessionType;
  topic?: string;
  domain?: string;
  context?: Record<string, any>;
}

/**
 * Input for updating a session
 */
export interface UpdateSessionInput {
  ended_at?: Date;
  summary?: string;
  output?: Record<string, any>;
  score?: number;
  vectorized?: boolean;
}

// ============================================================================
// Message Types
// ============================================================================

/**
 * Message role
 */
export type MessageRole = 'user' | 'assistant' | 'system';

/**
 * A single message in a session
 */
export interface SessionMessage {
  id: string;                                // UUID
  session_id: string;                        // UUID
  role: MessageRole;
  content: string;
  attachments?: Record<string, any>;         // Optional file attachments
  metadata?: Record<string, any>;            // Query metadata (chunk IDs, filters, etc.)
  created_at: Date;
}

/**
 * Input for creating a new message
 */
export interface CreateMessageInput {
  session_id: string;
  role: MessageRole;
  content: string;
  attachments?: Record<string, any>;
  metadata?: Record<string, any>;
}

// ============================================================================
// API Request/Response Types
// ============================================================================

/**
 * POST /agents/:agent/chat request body
 */
export interface AgentChatRequest {
  query: string;                             // User's message
  session_id?: string;                       // Optional: continue existing session
  user_id?: string;                          // Optional: user identifier
  topic?: string;                            // Optional: topic for new session
  domain?: string;                           // Optional: domain filter
  filters?: {                                // Optional: RAG filters
    domain?: string;
    concepts?: string[];
    mnemonic_tags?: string[];
    has_image?: boolean;
    code?: boolean;
  };
  topK?: number;                             // Number of RAG chunks to retrieve
  temperature?: number;                      // LLM temperature (0-2)
  maxTokens?: number;                        // Max tokens in response
  context?: Record<string, any>;             // Optional: initial context for new session
}

/**
 * POST /agents/:agent/chat response
 */
export interface AgentChatResponse {
  ok: boolean;
  reply: string;                             // AI assistant response
  session_id: string;                        // Session ID (existing or newly created)
  sources: SourceReference[];                // Retrieved RAG chunks
  metadata: {
    agent: AgentId;
    model: string;
    chunks_retrieved: number;
    temperature: number;
    max_tokens: number;
    messages_in_context: number;             // How many previous messages were included
  };
}

/**
 * Source reference for RAG chunks
 */
export interface SourceReference {
  chunk_uid: string;
  collection: string;
  page_title?: string;
  course_title?: string;
  chapter_title?: string;
  subchapter_title?: string;
  score: number;
  has_image: boolean;
  code_languages: string[];
}

/**
 * Error response
 */
export interface AgentErrorResponse {
  ok: false;
  error: string;
  message: string;
  details?: any;
}

// ============================================================================
// Progress Tracking (Course Instructor)
// ============================================================================

/**
 * Progress record for a completed topic
 */
export interface ProgressRecord {
  id: string;                                // UUID
  user_id?: string;                          // UUID or null
  realm_id: string;                          // e.g., 'fantasy', 'sci-fi'
  topic: string;                             // e.g., 'js_closure', 'react_hooks'
  status: string;                            // 'finished'
  finished_at: Date;
}

/**
 * Input for creating progress record
 */
export interface CreateProgressInput {
  user_id?: string;
  realm_id: string;
  topic: string;
  status: string;
}
