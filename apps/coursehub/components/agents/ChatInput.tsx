/**
 * ChatInput Component
 * Multi-line textarea with send button and source toggle
 */

import React from 'react';
import { PaperAirplaneIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface ChatInputProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
    onCancel?: () => void;
    isLoading: boolean;
    showSources: boolean;
    onToggleSources: () => void;
    disabled?: boolean;
}

export default function ChatInput({
    value,
    onChange,
    onSubmit,
    onCancel,
    isLoading,
    showSources,
    onToggleSources,
    disabled = false,
}: ChatInputProps) {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // Enter without shift = send
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (value.trim() && !isLoading) {
                onSubmit();
            }
        }
        // Shift+Enter = new line (default behavior)
    };

    const canSend = value.trim().length > 0 && !isLoading && !disabled;

    return (
        <div className="border-t border-white/10 bg-[#0f1f3d] p-3">
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={disabled ? 'Select an agent to start chatting...' : 'Ask a question... (Shift+Enter for new line)'}
                className="w-full bg-[#1a2942] text-white rounded-xl px-4 py-2.5 text-base
                           resize-none focus:outline-none focus:ring-2
                           focus:ring-[#00D9A5] min-h-[45px] max-h-[150px]
                           placeholder-white/40"
                disabled={isLoading || disabled}
                rows={2}
            />
            <div className="flex justify-between items-center mt-2">
                <label className="flex items-center text-white/80 cursor-pointer select-none">
                    <input
                        type="checkbox"
                        checked={showSources}
                        onChange={onToggleSources}
                        className="mr-2 h-3.5 w-3.5 rounded border-white/30 bg-white/10 text-[#00D9A5]
                                   focus:ring-2 focus:ring-[#00D9A5] focus:ring-offset-0"
                        disabled={disabled}
                    />
                    <span className="text-sm">Show Sources</span>
                </label>
                <div className="flex space-x-2">
                    {isLoading && onCancel && (
                        <button
                            onClick={onCancel}
                            className="bg-red-500/80 text-white px-3 py-1.5 rounded-lg text-sm
                                     hover:bg-red-600 transition flex items-center space-x-1.5 font-medium"
                        >
                            <XCircleIcon className="h-4 w-4" />
                            <span>Cancel</span>
                        </button>
                    )}
                    <button
                        onClick={onSubmit}
                        disabled={!canSend}
                        className="bg-[#00D9A5] text-gray-900 px-4 py-1.5 rounded-lg text-sm font-medium
                                 disabled:opacity-50 disabled:cursor-not-allowed
                                 hover:bg-[#00E9B5] transition flex items-center space-x-1.5
                                 enabled:shadow-lg"
                    >
                        {isLoading ? (
                            <>
                                <svg
                                    className="animate-spin h-4 w-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                                <span>Sending...</span>
                            </>
                        ) : (
                            <>
                                <PaperAirplaneIcon className="h-4 w-4" />
                                <span>Send</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
