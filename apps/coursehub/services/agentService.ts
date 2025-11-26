/**
 * Agent Service Client
 * Handles all API calls to the multi-agent backend service
 */

import type {
    AgentId,
    AgentChatRequest,
    AgentChatResponse,
    AgentErrorResponse,
    SessionMessage,
    SourceReference,
    AgentSession,
    AgentSessionsResponse,
} from '../types';
import { streamSSE, StreamEvent } from '../utils/sseParser';

// Base URL for agent service
const AGENT_SERVICE_URL = process.env.NEXT_PUBLIC_AGENT_SERVICE_URL || 'http://localhost:8787';

/**
 * Custom error class for agent service errors
 */
export class AgentServiceError extends Error {
    constructor(
        message: string,
        public status?: number,
        public code?: string
    ) {
        super(message);
        this.name = 'AgentServiceError';
    }
}

/**
 * Send chat message with streaming response
 * Primary method for sending messages
 *
 * @param agentId The agent to send message to
 * @param params Request parameters
 * @param signal Optional AbortSignal for cancellation
 * @returns Async generator of streaming events
 */
export async function* sendChatMessageStream(
    agentId: AgentId,
    params: {
        query: string;
        session_id?: string;
        user_id?: string;
        topic?: string;
        domain?: string;
        topK?: number;
        temperature?: number;
        maxTokens?: number;
    },
    signal?: AbortSignal
): AsyncGenerator<StreamEvent, void, unknown> {
    const url = `${AGENT_SERVICE_URL}/agents/${agentId}/chat/stream`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params),
            signal,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new AgentServiceError(
                errorData.message || `HTTP ${response.status}: ${response.statusText}`,
                response.status,
                errorData.error
            );
        }

        // Stream SSE events
        yield* streamSSE(response, signal);
    } catch (error) {
        if (error instanceof AgentServiceError) {
            throw error;
        }

        if (error instanceof DOMException && error.name === 'AbortError') {
            throw error; // Re-throw abort errors
        }

        throw new AgentServiceError(
            error instanceof Error ? error.message : 'Unknown error occurred',
            undefined,
            'network_error'
        );
    }
}

/**
 * Send chat message (non-streaming fallback)
 * Use only when streaming is not supported
 *
 * @param agentId The agent to send message to
 * @param params Request parameters
 * @returns Complete response with reply
 */
export async function sendChatMessage(
    agentId: AgentId,
    params: AgentChatRequest
): Promise<AgentChatResponse> {
    const url = `${AGENT_SERVICE_URL}/agents/${agentId}/chat`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params),
        });

        const data = await response.json();

        if (!response.ok) {
            const errorData = data as AgentErrorResponse;
            throw new AgentServiceError(errorData.message, response.status, errorData.error);
        }

        return data as AgentChatResponse;
    } catch (error) {
        if (error instanceof AgentServiceError) {
            throw error;
        }

        throw new AgentServiceError(
            error instanceof Error ? error.message : 'Unknown error occurred',
            undefined,
            'network_error'
        );
    }
}

/**
 * Get session history
 *
 * @param agentId The agent whose session to fetch
 * @param sessionId The session ID
 * @param limit Maximum number of messages to retrieve
 * @returns Array of session messages
 */
export async function getSessionHistory(
    agentId: AgentId,
    sessionId: string,
    limit: number = 50
): Promise<SessionMessage[]> {
    const url = `${AGENT_SERVICE_URL}/agents/${agentId}/session/${sessionId}/history?limit=${limit}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new AgentServiceError(
                errorData.message || `Failed to fetch session history`,
                response.status,
                errorData.error
            );
        }

        const data = await response.json();
        return data.messages || [];
    } catch (error) {
        if (error instanceof AgentServiceError) {
            throw error;
        }

        throw new AgentServiceError(
            error instanceof Error ? error.message : 'Unknown error occurred',
            undefined,
            'network_error'
        );
    }
}

/**
 * Get session details
 *
 * @param agentId The agent whose session to fetch
 * @param sessionId The session ID
 * @returns Session metadata
 */
export async function getSessionDetails(agentId: AgentId, sessionId: string): Promise<any> {
    const url = `${AGENT_SERVICE_URL}/agents/${agentId}/session/${sessionId}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new AgentServiceError(
                errorData.message || `Failed to fetch session details`,
                response.status,
                errorData.error
            );
        }

        const data = await response.json();
        return data.session;
    } catch (error) {
        if (error instanceof AgentServiceError) {
            throw error;
        }

        throw new AgentServiceError(
            error instanceof Error ? error.message : 'Unknown error occurred',
            undefined,
            'network_error'
        );
    }
}

/**
 * Helper to collect full response from streaming events
 * Useful for components that need the complete reply
 *
 * @param stream Async generator of stream events
 * @returns Object with session_id, full reply, sources, and metadata
 */
export async function collectStreamResponse(
    stream: AsyncGenerator<StreamEvent, void, unknown>
): Promise<{
    session_id: string;
    reply: string;
    sources: SourceReference[];
    metadata: any;
}> {
    let session_id = '';
    let reply = '';
    let sources: SourceReference[] = [];
    let metadata: any = null;

    for await (const event of stream) {
        switch (event.type) {
            case 'session':
                session_id = event.data.session_id;
                break;

            case 'sources':
                sources = event.data.sources;
                break;

            case 'token':
                reply += event.data.token;
                break;

            case 'done':
                metadata = event.data.metadata;
                break;

            case 'error':
                throw new AgentServiceError(event.data.message, undefined, event.data.error);
        }
    }

    return { session_id, reply, sources, metadata };
}

/**
 * Get all sessions for an agent
 *
 * @param agentId The agent whose sessions to fetch
 * @param userId Optional user ID to filter sessions
 * @param limit Maximum number of sessions to retrieve
 * @returns Array of agent sessions
 */
export async function getAgentSessions(
    agentId: AgentId,
    userId?: string,
    limit: number = 50
): Promise<AgentSession[]> {
    const url = new URL(`${AGENT_SERVICE_URL}/agents/${agentId}/sessions`);
    if (userId) {
        url.searchParams.set('user_id', userId);
    }
    url.searchParams.set('limit', limit.toString());

    try {
        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new AgentServiceError(
                errorData.message || `Failed to fetch sessions`,
                response.status,
                errorData.error
            );
        }

        const data: AgentSessionsResponse = await response.json();
        return data.sessions || [];
    } catch (error) {
        if (error instanceof AgentServiceError) {
            throw error;
        }

        throw new AgentServiceError(
            error instanceof Error ? error.message : 'Unknown error occurred',
            undefined,
            'network_error'
        );
    }
}
