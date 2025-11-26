/**
 * ChatMessage Component
 * Individual message bubble for user and assistant messages
 */

import React from 'react';
import ReactMarkdown from 'react-markdown';
import type { MessageRole } from '../../types';

interface ChatMessageProps {
    role: MessageRole;
    content: string;
    timestamp: Date;
    isStreaming?: boolean;
}

function formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
}

export default function ChatMessage({ role, content, timestamp, isStreaming = false }: ChatMessageProps) {
    if (role === 'system') {
        return null; // Don't render system messages
    }

    const isUser = role === 'user';

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
            <div
                className={`rounded-lg max-w-[80%] shadow-lg ${
                    isUser ? 'bg-[#00D9A5] text-gray-900 px-4 py-2' : 'bg-[#1a2942] border border-white/10 text-white px-5 py-4'
                }`}
            >
                {isUser ? (
                    <p className="text-base whitespace-pre-wrap">{content}</p>
                ) : (
                    <>
                        <div className="prose prose-invert prose-base max-w-none">
                            <ReactMarkdown
                                components={{
                                    // Customize markdown rendering
                                    p: ({ children }) => <p className="text-white mb-2 last:mb-0">{children}</p>,
                                    code: ({ inline, children, ...props }: any) => {
                                        return inline ? (
                                            <code
                                                className="bg-[#011627] text-[#00D9A5] px-1.5 py-0.5 rounded text-base"
                                                {...props}
                                            >
                                                {children}
                                            </code>
                                        ) : (
                                            <code
                                                className="block bg-[#011627] text-white p-3 rounded my-3 overflow-x-auto text-base"
                                                {...props}
                                            >
                                                {children}
                                            </code>
                                        );
                                    },
                                    ul: ({ children }) => <ul className="text-white list-disc list-inside mb-3">{children}</ul>,
                                    ol: ({ children }) => <ol className="text-white list-decimal list-inside mb-3">{children}</ol>,
                                    li: ({ children }) => <li className="text-white mb-2">{children}</li>,
                                    strong: ({ children }) => <strong className="text-[#00D9A5] font-semibold">{children}</strong>,
                                    em: ({ children }) => <em className="text-[#00D9A5]/80 italic">{children}</em>,
                                    h1: ({ children }) => <h1 className="text-white text-2xl font-bold mb-3">{children}</h1>,
                                    h2: ({ children }) => <h2 className="text-white text-xl font-bold mb-3">{children}</h2>,
                                    h3: ({ children }) => <h3 className="text-white text-lg font-bold mb-2">{children}</h3>,
                                }}
                            >
                                {content}
                            </ReactMarkdown>
                            {isStreaming && <span className="inline-block w-2 h-4 bg-[#00D9A5] animate-pulse ml-1" />}
                        </div>
                        <span className="text-xs text-white/60 mt-1 block">{formatTime(timestamp)}</span>
                    </>
                )}
            </div>
        </div>
    );
}
