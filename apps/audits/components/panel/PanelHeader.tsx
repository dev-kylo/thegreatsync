'use client'

import { Workflow } from '@/lib/types'
import { Badge, getBusinessAreaVariant } from '../ui/Badge'

interface PanelHeaderProps {
  workflow: Workflow
  selectedStepIndex: number | 'trigger'
}

export function PanelHeader({ workflow, selectedStepIndex }: PanelHeaderProps) {
  const stepText = selectedStepIndex === 'trigger'
    ? workflow.trigger
    : workflow.steps[selectedStepIndex]

  const stepLabel = selectedStepIndex === 'trigger'
    ? 'Trigger'
    : `Step ${selectedStepIndex + 1} of ${workflow.steps.length}`

  return (
    <div className="p-6 border-b border-border bg-surface-secondary/30">
      {/* Workflow name and badge */}
      <div className="flex items-center gap-2 mb-3">
        <Badge variant={getBusinessAreaVariant(workflow.businessArea)} size="sm">
          {workflow.businessArea}
        </Badge>
        <span className="text-xs text-text-tertiary">·</span>
        <span className="text-xs font-medium text-text-tertiary">{stepLabel}</span>
      </div>

      {/* Workflow title */}
      <h2 className="text-lg font-semibold text-text-primary mb-2">
        {workflow.name}
      </h2>

      {/* Current step text */}
      <div className="p-3 rounded-lg bg-bg-surface border border-border">
        <div className="flex items-start gap-2">
          {selectedStepIndex === 'trigger' ? (
            <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 3L4 14h7l-2 7 9-11h-7l2-7z" />
            </svg>
          ) : (
            <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">
              {selectedStepIndex + 1}
            </span>
          )}
          <p className="text-sm text-text-secondary leading-relaxed">
            {stepText}
          </p>
        </div>
      </div>
    </div>
  )
}
