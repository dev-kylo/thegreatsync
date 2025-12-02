'use client'

import { useState } from 'react'

interface SummaryCardProps {
  summary: string
  clientName: string
  workflowCount: number
  topOpportunityCount: number
  loomVideoUrl?: string
}

// Extract Loom video ID from various URL formats
function getLoomEmbedUrl(url: string): string | null {
  // Handle share URLs like https://www.loom.com/share/b311ae24ac9e4c588a08b1a5fdffd34b
  const shareMatch = url.match(/loom\.com\/share\/([a-zA-Z0-9]+)/)
  if (shareMatch) {
    return `https://www.loom.com/embed/${shareMatch[1]}`
  }
  // Handle embed URLs (already correct format)
  const embedMatch = url.match(/loom\.com\/embed\/([a-zA-Z0-9]+)/)
  if (embedMatch) {
    return url
  }
  return null
}

export function SummaryCard({ summary, clientName, workflowCount, topOpportunityCount, loomVideoUrl }: SummaryCardProps) {
  const [isVideoExpanded, setIsVideoExpanded] = useState(false)
  const embedUrl = loomVideoUrl ? getLoomEmbedUrl(loomVideoUrl) : null

  return (
    <>
      <div className="rounded-xl border border-border bg-bg-surface p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          {/* Left side: Summary and stats */}
          <div className="flex-1 flex flex-col gap-4">
            {/* Summary text */}
            <div>
              <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-text-tertiary">
                Executive Summary
              </h2>
              <p className="text-base leading-relaxed text-text-secondary">
                {summary}
              </p>
            </div>

            {/* Quick stats */}
            <div className="flex gap-6">
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-text-primary font-mono">
                  {workflowCount}
                </span>
                <span className="text-xs font-medium uppercase tracking-wider text-text-tertiary">
                  Workflows
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-score-high font-mono">
                  {topOpportunityCount}
                </span>
                <span className="text-xs font-medium uppercase tracking-wider text-text-tertiary">
                  Top Opportunities
                </span>
              </div>
            </div>
          </div>

          {/* Right side: Video thumbnail */}
          {embedUrl && (
            <div className="lg:flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium uppercase tracking-wider text-text-tertiary flex items-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  Audit Recording
                </h3>
                <button
                  onClick={() => setIsVideoExpanded(true)}
                  className="text-xs text-primary hover:text-primary-hover flex items-center gap-1 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                  Expand
                </button>
              </div>
              <div
                className="relative w-full rounded-lg overflow-hidden bg-black cursor-pointer group"
                style={{ paddingBottom: '56.25%' }}
                onClick={() => setIsVideoExpanded(true)}
              >
                <iframe
                  src={embedUrl}
                  frameBorder="0"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
                {/* Expand overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center pointer-events-none">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-3">
                    <svg className="w-6 h-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Video Modal */}
      {embedUrl && isVideoExpanded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setIsVideoExpanded(false)}
        >
          <div
            className="relative w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setIsVideoExpanded(false)}
              className="absolute -top-12 right-0 flex items-center gap-2 px-3 py-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <span className="text-sm">Close</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Video container */}
            <div className="relative w-full rounded-xl overflow-hidden bg-black shadow-2xl" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={embedUrl}
                frameBorder="0"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
