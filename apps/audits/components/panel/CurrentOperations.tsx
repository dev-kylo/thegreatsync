'use client'

import { Workflow } from '@/lib/types'

interface CurrentOperationsProps {
  workflow: Workflow
}

export function CurrentOperations({ workflow }: CurrentOperationsProps) {
  const {
    toolsInvolved,
    manualPainPoints,
    timeCostEstimate,
    dependencies,
    peopleInvolved,
  } = workflow

  return (
    <div className="p-6 space-y-6 border-t border-border">
      {/* Section title */}
      <div className="flex items-center gap-2">
        <svg className="w-5 h-5 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
          Current Operations
        </h3>
      </div>

      {/* Tools involved */}
      <div>
        <h4 className="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-2">
          Tools Involved
        </h4>
        <div className="flex flex-wrap gap-2">
          {toolsInvolved.map((tool, index) => (
            <span
              key={index}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-surface-secondary text-text-secondary border border-border"
            >
              {tool}
            </span>
          ))}
        </div>
      </div>

      {/* Manual pain points */}
      <div>
        <h4 className="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-2">
          Manual Pain Points
        </h4>
        <ul className="space-y-2">
          {manualPainPoints.map((point, index) => (
            <li key={index} className="flex items-start gap-2">
              <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="text-sm text-text-secondary">{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Time cost estimate */}
      <div>
        <h4 className="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-2">
          Time Cost Estimate
        </h4>
        <p className="text-sm text-text-secondary">{timeCostEstimate}</p>
      </div>

      {/* People involved */}
      <div>
        <h4 className="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-2">
          People Involved
        </h4>
        <div className="flex flex-wrap gap-2">
          {peopleInvolved.map((person, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-surface-secondary text-text-secondary border border-border"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {person}
            </span>
          ))}
        </div>
      </div>

      {/* Dependencies (collapsible) */}
      {dependencies.length > 0 && (
        <details className="group">
          <summary className="flex items-center gap-2 cursor-pointer text-xs font-medium text-text-tertiary uppercase tracking-wider">
            <svg className="w-4 h-4 transition-transform group-open:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            Dependencies ({dependencies.length})
          </summary>
          <ul className="mt-2 ml-6 space-y-1">
            {dependencies.map((dep, index) => (
              <li key={index} className="text-sm text-text-secondary">
                • {dep}
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  )
}
