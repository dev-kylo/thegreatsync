/**
 * AgentChatPanel Component
 * Main chat interface with streaming support
 */

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import ChatMessageList from './ChatMessageList';
import ChatInput from './ChatInput';
import SourcePanel from './SourcePanel';
import { sendChatMessageStream, AgentServiceError } from '../../services/agentService';
import { getSessionHistory } from '../../services/agentService';
import type { AgentId, ChatMessage, SourceReference } from '../../types';

interface AgentChatPanelProps {
    agentId: AgentId;
    sessionId: string | null;
    onSessionCreated: (sessionId: string) => void;
}

export default function AgentChatPanel({ agentId, sessionId, onSessionCreated }: AgentChatPanelProps) {
    const { data: session } = useSession();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [currentSources, setCurrentSources] = useState<SourceReference[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [showSources, setShowSources] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isStreaming, setIsStreaming] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [historyLoaded, setHistoryLoaded] = useState(false);

    const abortControllerRef = useRef<AbortController | null>(null);

    // Load session history when session ID changes
    useEffect(() => {
        if (sessionId && agentId && !historyLoaded) {
            loadHistory(agentId, sessionId);
        } else if (!sessionId) {
            setMessages([]);
            setHistoryLoaded(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionId, agentId]);

    // Reset state when agent changes
    useEffect(() => {
        setMessages([]);
        setCurrentSources([]);
        setError(null);
        setHistoryLoaded(false);
        setIsLoading(false);
        setIsStreaming(false);
    }, [agentId]);

    const loadHistory = async (agentId: AgentId, sessionId: string) => {
        try {
            const history = await getSessionHistory(agentId, sessionId, 50);
            const chatMessages: ChatMessage[] = history.map((msg) => ({
                id: msg.id,
                role: msg.role,
                content: msg.content,
                timestamp: new Date(msg.created_at),
                sources: msg.metadata?.sources,
            }));
            setMessages(chatMessages);
            setHistoryLoaded(true);
        } catch (err) {
            console.error('Failed to load history:', err);
            setHistoryLoaded(true); // Continue anyway
        }
    };

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessageId = `user-${Date.now()}`;
        const userMessage: ChatMessage = {
            id: userMessageId,
            role: 'user',
            content: inputValue.trim(),
            timestamp: new Date(),
        };

        // Add user message immediately
        setMessages((prev) => [...prev, userMessage]);
        setInputValue('');
        setError(null);
        setIsLoading(true);

        // Create abort controller for cancellation
        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        try {
            // Prepare assistant message
            const assistantMessageId = `assistant-${Date.now()}`;
            let assistantContent = '';
            let retrievedSources: SourceReference[] = [];
            let receivedSessionId = sessionId || '';

            // Start streaming
            setIsStreaming(true);
            const stream = sendChatMessageStream(
                agentId,
                {
                    query: userMessage.content,
                    session_id: sessionId || undefined,
                    user_id: session?.id ? String(session.id) : undefined,
                },
                abortController.signal
            );

            // Process stream events
            for await (const event of stream) {
                switch (event.type) {
                    case 'session':
                        // Session ID received
                        receivedSessionId = event.data.session_id;
                        if (!sessionId) {
                            onSessionCreated(receivedSessionId);
                        }
                        break;

                    case 'sources':
                        // Sources received before tokens
                        retrievedSources = event.data.sources;
                        setCurrentSources(retrievedSources);
                        break;

                    case 'token':
                        // Token received - update streaming message
                        assistantContent += event.data.token;
                        setMessages((prev) => {
                            const existing = prev.find((m) => m.id === assistantMessageId);
                            if (existing) {
                                return prev.map((m) =>
                                    m.id === assistantMessageId
                                        ? { ...m, content: assistantContent }
                                        : m
                                );
                            } else {
                                return [
                                    ...prev,
                                    {
                                        id: assistantMessageId,
                                        role: 'assistant' as const,
                                        content: assistantContent,
                                        timestamp: new Date(),
                                        sources: retrievedSources,
                                    },
                                ];
                            }
                        });
                        break;

                    case 'done':
                        // Stream completed
                        console.log('Stream completed:', event.data.metadata);
                        break;

                    case 'error':
                        // Error event
                        throw new Error(event.data.message);
                }
            }

            setIsStreaming(false);
            setIsLoading(false);
        } catch (err) {
            setIsStreaming(false);
            setIsLoading(false);

            if (err instanceof DOMException && err.name === 'AbortError') {
                // User cancelled
                console.log('Stream cancelled by user');
                return;
            }

            const errorMessage =
                err instanceof AgentServiceError
                    ? err.message
                    : err instanceof Error
                    ? err.message
                    : 'Failed to send message';
            setError(errorMessage);

            // Remove incomplete assistant message on error
            setMessages((prev) => prev.filter((m) => m.role !== 'assistant' || m.content.length > 0));
        } finally {
            abortControllerRef.current = null;
        }
    };

    const handleCancel = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
    };

    const handleKeySubmit = () => {
        handleSendMessage();
    };

    return (
        <div className="flex flex-col h-full">
            {/* Message List - Takes most space */}
            <div className="flex-1 overflow-hidden">
                <ChatMessageList
                    messages={messages}
                    agentId={agentId}
                    isLoading={isLoading && !isStreaming}
                    error={error}
                    isStreamingMessage={isStreaming}
                />
            </div>

            {/* Source Panel */}
            {currentSources.length > 0 && (
                <div className="px-4 pb-2">
                    <SourcePanel sources={currentSources} visible={showSources} />
                </div>
            )}

            {/* Input Area - Pinned to bottom */}
            <div className="flex-shrink-0">
                <ChatInput
                    value={inputValue}
                    onChange={setInputValue}
                    onSubmit={handleKeySubmit}
                    onCancel={isStreaming ? handleCancel : undefined}
                    isLoading={isLoading}
                    showSources={showSources}
                    onToggleSources={() => setShowSources(!showSources)}
                    disabled={!agentId}
                />
            </div>
        </div>
    );
}
