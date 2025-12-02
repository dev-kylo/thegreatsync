'use client'

import { Workflow } from '@/lib/types'
import { WorkflowHeader } from './WorkflowHeader'
import { WorkflowCanvas } from './WorkflowCanvas'

// Configuration constant - easy to change later
export const DEFAULT_EXPANDED = true

interface WorkflowCardProps {
  workflow: Workflow
  workflowIndex: number
  selectedStepIndex: number | 'trigger' | null
  onNodeClick: (workflowIndex: number, stepIndex: number | 'trigger') => void
  isExpanded?: boolean
}

export function WorkflowCard({
  workflow,
  workflowIndex,
  selectedStepIndex,
  onNodeClick,
  isExpanded = DEFAULT_EXPANDED,
}: WorkflowCardProps) {
  return (
    <div className="rounded-xl border border-border bg-bg-surface shadow-sm overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="p-5 border-b border-border">
        <WorkflowHeader workflow={workflow} />
      </div>

      {/* Canvas (node visualization) */}
      {isExpanded && (
        <div className="p-4 bg-surface-secondary/50">
          <WorkflowCanvas
            workflow={workflow}
            selectedStepIndex={selectedStepIndex}
            onNodeClick={(stepIndex) => onNodeClick(workflowIndex, stepIndex)}
          />
        </div>
      )}
    </div>
  )
}
