/**
 * Type definitions for realm-based learning sessions
 */

// ============================================================================
// Realm Types
// ============================================================================

/**
 * A realm defines the metaphorical universe for learning
 * (e.g., fantasy with wizards and portals, sci-fi with ships and circuits)
 */
export interface Realm {
  id: string;                    // e.g., 'fantasy', 'sci-fi'
  name: string;                  // e.g., 'Fantasy Realm'
  symbol_inventory: string[];    // Available symbols: ['wizard', 'portal', 'village', ...]
  hints: string[];               // Guidance for using symbols effectively
}

// ============================================================================
// Topic Pack Types
// ============================================================================

/**
 * An entity that needs to be mapped to a symbol in the metaphor
 */
export interface TopicEntity {
  id: string;                    // e.g., 'function', 'lexical_env'
  name: string;                  // Display name
  description: string;           // What this entity represents
}

/**
 * A topic pack contains all the teaching material for one concept
 */
export interface TopicPack {
  topic: string;                 // e.g., 'js_closure', 'react_state'
  domain?: string;               // e.g., 'javascript', 'react' (for vector indexing)
  entities: TopicEntity[];       // Concepts that need symbols
  truths: string[];              // Facts that must be captured in the metaphor
  misconceptions: string[];      // Common errors to avoid
  tests: string[];               // Questions the mental model must answer
}

/**
 * Defines the learning path order for a realm
 */
export type TopicOrder = string[];  // Array of topic IDs in sequence

// ============================================================================
// Session Types
// ============================================================================

/**
 * Session status
 */
export type SessionStatus = 'active' | 'finished';

/**
 * Chat message role
 */
export type MessageRole = 'user' | 'assistant' | 'system';

/**
 * A single chat message in a session
 */
export interface SessionEvent {
  id: number;
  session_id: number;
  ts: Date;
  role: MessageRole;
  content: string;
}

/**
 * The final artifact created when finishing a session
 */
export interface SessionArtifact {
  legend: Record<string, string>;   // entity_id -> chosen_symbol
  rules: string[];                   // 3-5 rules using the symbols
  script: string;                    // 60-90 second teaching narrative
  red_flags: string[];               // Misconceptions that were corrected
  score?: number;                    // Optional validator score (0..1)
}

/**
 * Complete session data from database
 */
export interface SessionData {
  id: number;
  user_id?: string;
  realm_id: string;
  topic: string;
  status: SessionStatus;
  started_at: Date;
  finished_at?: Date;
  // Artifact fields (populated when status='finished')
  legend?: Record<string, string>;
  rules?: string[];
  script?: string;
  red_flags?: string[];
  score?: number;
  // Immutable snapshots
  topic_pack: TopicPack;
  realm_snapshot: Realm;
}

/**
 * Input for creating a new session
 */
export interface CreateSessionInput {
  user_id?: string;
  realm_id: string;
  topic: string;
  topic_pack: TopicPack;
  realm_snapshot: Realm;
}

/**
 * Input for updating a session
 */
export interface UpdateSessionInput {
  status?: SessionStatus;
  finished_at?: Date;
  legend?: Record<string, string>;
  rules?: string[];
  script?: string;
  red_flags?: string[];
  score?: number;
}

// ============================================================================
// Progress Tracking Types
// ============================================================================

/**
 * Progress record for a completed topic
 */
export interface ProgressRecord {
  id: number;
  user_id?: string;
  realm_id: string;
  topic: string;
  status: string;
  finished_at: Date;
}

// ============================================================================
// API Request/Response Types
// ============================================================================

/**
 * POST /session/start request
 */
export interface StartSessionRequest {
  realm_id: string;
  user_id?: string;
}

/**
 * POST /session/start response
 */
export interface StartSessionResponse {
  session_id: number;
  realm: Realm;
  topic: string;
  topic_pack: TopicPack;
  message: string;
}

/**
 * POST /session/chat request
 */
export interface ChatRequest {
  session_id: number;
  message: string;
}

/**
 * POST /session/chat response
 */
export interface ChatResponse {
  reply: string;
}

/**
 * POST /session/finish request
 */
export interface FinishSessionRequest {
  session_id: number;
}

/**
 * POST /session/finish response
 */
export interface FinishSessionResponse {
  session_id: number;
  artifact: SessionArtifact;
  chunk_uids: string[];
}

// ============================================================================
// Internal Service Types
// ============================================================================

/**
 * Options for building conversation context
 */
export interface ConversationContext {
  realm: Realm;
  topic_pack: TopicPack;
  recent_events: SessionEvent[];
  system_prompt: string;
}
