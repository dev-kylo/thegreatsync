/**
 * ChatMessageList Component
 * Scrollable container for chat messages with auto-scroll
 */

import React, { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import type { ChatMessage as ChatMessageType, AgentId } from '../../types';
import { getAgentName, AGENT_EXAMPLE_QUESTIONS } from '../../constants/agents';

interface ChatMessageListProps {
    messages: ChatMessageType[];
    agentId: AgentId | null;
    isLoading: boolean;
    error: string | null;
    isStreamingMessage?: boolean;
}

export default function ChatMessageList({
    messages,
    agentId,
    isLoading,
    error,
    isStreamingMessage = false,
}: ChatMessageListProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isStreamingMessage]);

    // Empty state - no agent selected
    if (!agentId) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8">
                <div className="text-white/40 mb-6">
                    <svg className="h-32 w-32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                        />
                    </svg>
                </div>
                <h3 className="text-white text-2xl font-medium mb-3">Choose an AI Agent</h3>
                <p className="text-white/60 text-center max-w-md text-lg">
                    Select an agent from the menu to start a conversation. Each agent specializes in different aspects of
                    learning.
                </p>
            </div>
        );
    }

    // Empty state - new session
    if (messages.length === 0 && !isLoading && !error) {
        const agentName = getAgentName(agentId);
        const examples = AGENT_EXAMPLE_QUESTIONS[agentId] || [];

        return (
            <div className="flex flex-col items-center justify-center h-full p-8">
                <h3 className="text-white text-2xl font-medium mb-3">Start chatting with {agentName}</h3>
                <p className="text-white/60 text-center max-w-md mb-8 text-lg">{agentName} is ready to help you.</p>
                {examples.length > 0 && (
                    <div className="w-full max-w-md">
                        <p className="text-white/80 text-base mb-3">Example questions:</p>
                        <ul className="text-white/60 text-base space-y-3">
                            {examples.map((example, idx) => (
                                <li key={idx} className="flex items-start">
                                    <span className="text-[#00D9A5] mr-3">•</span>
                                    <span>{example}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex items-center justify-center h-full p-8">
                <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 max-w-md">
                    <div className="flex items-start">
                        <svg className="h-6 w-6 text-red-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                        <div>
                            <h4 className="text-red-400 font-medium">Error loading messages</h4>
                            <p className="text-white/80 text-sm mt-1">{error}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Message list
    return (
        <div className="h-full overflow-y-auto py-8 px-6">
            {messages.map((message) => (
                <ChatMessage
                    key={message.id}
                    role={message.role}
                    content={message.content}
                    timestamp={message.timestamp}
                    isStreaming={isStreamingMessage && message.id === messages[messages.length - 1]?.id}
                />
            ))}

            {/* Loading indicator */}
            {isLoading && (
                <div className="flex justify-start mb-6">
                    <div className="bg-[#1a2942] border border-white/10 text-white rounded-lg px-5 py-3">
                        <div className="flex space-x-2">
                            <div className="w-2.5 h-2.5 bg-[#00D9A5] rounded-full animate-bounce" />
                            <div className="w-2.5 h-2.5 bg-[#00D9A5] rounded-full animate-bounce delay-100" style={{ animationDelay: '0.1s' }} />
                            <div className="w-2.5 h-2.5 bg-[#00D9A5] rounded-full animate-bounce delay-200" style={{ animationDelay: '0.2s' }} />
                        </div>
                    </div>
                </div>
            )}

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
        </div>
    );
}
