'use client'

import { Evidence } from '@/lib/types'

interface EvidenceSectionProps {
  evidence: Evidence
}

export function EvidenceSection({ evidence }: EvidenceSectionProps) {
  const hasSpokenEvidence = evidence.fromSpokenExplanation.length > 0 &&
    evidence.fromSpokenExplanation[0] !== 'No on-screen actions available from provided input.'

  const hasScreenEvidence = evidence.fromOnScreenActions.length > 0 &&
    evidence.fromOnScreenActions[0] !== 'No on-screen actions available from provided input.'

  if (!hasSpokenEvidence && !hasScreenEvidence) return null

  return (
    <div className="p-6 border-t border-border">
      <details className="group">
        <summary className="flex items-center gap-2 cursor-pointer">
          <svg className="w-4 h-4 text-text-tertiary transition-transform group-open:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
              Evidence from Audit
            </h3>
          </div>
        </summary>

        <div className="mt-4 space-y-4 ml-6">
          {/* From spoken explanation */}
          {hasSpokenEvidence && (
            <div>
              <h4 className="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-2">
                From Interview
              </h4>
              <ul className="space-y-2">
                {evidence.fromSpokenExplanation.map((quote, index) => (
                  <li
                    key={index}
                    className="text-sm text-text-secondary italic pl-3 border-l-2 border-primary/30"
                  >
                    "{quote}"
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* From on-screen actions */}
          {hasScreenEvidence && (
            <div>
              <h4 className="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-2">
                From Screen Recording
              </h4>
              <ul className="space-y-2">
                {evidence.fromOnScreenActions.map((action, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-text-tertiary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm text-text-secondary">{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </details>
    </div>
  )
}
