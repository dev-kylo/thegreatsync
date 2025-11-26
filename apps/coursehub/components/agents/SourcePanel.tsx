/**
 * SourcePanel Component
 * Collapsible panel showing RAG sources
 */

import React, { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import SourceCard from './SourceCard';
import type { SourceReference } from '../../types';

interface SourcePanelProps {
    sources: SourceReference[];
    visible: boolean;
}

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

export default function SourcePanel({ sources, visible }: SourcePanelProps) {
    const [expanded, setExpanded] = useState(false);

    if (!visible || sources.length === 0) {
        return null;
    }

    return (
        <div className="mt-4 border-t border-white/10 pt-4 animate-fadeIn">
            <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center justify-between w-full text-white/80
                           hover:text-white transition mb-2 focus:outline-none"
            >
                <span className="text-sm font-medium flex items-center">
                    <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                    Sources ({sources.length})
                </span>
                <ChevronDownIcon
                    className={classNames(
                        'h-5 w-5 transition-transform duration-200',
                        expanded ? 'rotate-180' : ''
                    )}
                />
            </button>

            {expanded && (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                    {sources.map((source, idx) => (
                        <SourceCard key={source.chunk_uid} source={source} index={idx} />
                    ))}
                </div>
            )}
        </div>
    );
}
