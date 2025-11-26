/**
 * SourceCard Component
 * Displays individual RAG source with metadata
 */

import React from 'react';
import type { SourceReference } from '../../types';

interface SourceCardProps {
    source: SourceReference;
    index: number;
}

function formatSourceBreadcrumb(source: SourceReference): string {
    const parts = [source.course_title, source.chapter_title, source.subchapter_title, source.page_title].filter(Boolean);

    return parts.join(' › ');
}

function getCollectionColor(collection: string): string {
    const colors: Record<string, string> = {
        course_content: 'bg-blue-500/20 text-blue-300',
        meta_canon: 'bg-purple-500/20 text-purple-300',
        overviews: 'bg-green-500/20 text-green-300',
        user_sessions: 'bg-yellow-500/20 text-yellow-300',
        reflections: 'bg-pink-500/20 text-pink-300',
        reviews: 'bg-orange-500/20 text-orange-300',
        mnemonics: 'bg-indigo-500/20 text-indigo-300',
    };
    return colors[collection] || 'bg-gray-500/20 text-gray-300';
}

export default function SourceCard({ source, index }: SourceCardProps) {
    const breadcrumb = formatSourceBreadcrumb(source);
    const collectionColor = getCollectionColor(source.collection);

    return (
        <div className="bg-[#031b4352] rounded-lg p-3 text-sm border border-white/10 hover:border-white/20 transition">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    {/* Header with source number, collection, and score */}
                    <div className="flex items-center flex-wrap gap-2 mb-1">
                        <span className="text-primary_green font-medium text-xs">[Source {index + 1}]</span>
                        <span className={`${collectionColor} px-2 py-0.5 rounded text-xs`}>{source.collection}</span>
                        <span className="text-white/40 text-xs">Score: {(source.score * 100).toFixed(0)}%</span>
                    </div>

                    {/* Breadcrumb path */}
                    {breadcrumb && (
                        <div className="text-white/80 text-xs mb-2 leading-relaxed">{breadcrumb}</div>
                    )}

                    {/* Badges */}
                    <div className="flex flex-wrap gap-1.5">
                        {source.has_image && (
                            <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded text-xs flex items-center">
                                <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                                Image
                            </span>
                        )}
                        {source.code_languages.map((lang) => (
                            <span
                                key={lang}
                                className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded text-xs font-mono"
                            >
                                {lang}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
