'use client'

import { Workflow } from '@/lib/types'
import { Badge, getBusinessAreaVariant, TimeCostIcon, getTimeCostVariant } from '../ui/Badge'
import { InlineScoreBadge } from '../ui/ScoreBadge'

interface WorkflowHeaderProps {
  workflow: Workflow
}

export function WorkflowHeader({ workflow }: WorkflowHeaderProps) {
  const { automationPotential } = workflow

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Left side: Name and tags */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-semibold text-text-primary">
            {workflow.name}
          </h3>
          <Badge variant={getBusinessAreaVariant(workflow.businessArea)} size="sm">
            {workflow.businessArea === 'Delivery & Retention' ? 'D&R' : workflow.businessArea}
          </Badge>
        </div>
        <p className="text-sm text-text-tertiary">
          {workflow.steps.length} steps · {workflow.toolsInvolved.length} tools
        </p>
      </div>

      {/* Right side: Key metrics */}
      <div className="flex items-center gap-4">
        {/* Automation Score */}
        <div className="flex items-center gap-2">
          <InlineScoreBadge score={automationPotential.score} />
          <span className="text-xs text-text-tertiary hidden sm:inline">Score</span>
        </div>

        {/* Time Cost */}
        <Badge variant={getTimeCostVariant(automationPotential.timeCostPerMonth)} size="md">
          <TimeCostIcon level={automationPotential.timeCostPerMonth} />
          <span className="capitalize">{automationPotential.timeCostPerMonth}</span>
        </Badge>

        {/* Hours estimate */}
        <div className="flex flex-col items-end">
          <span className="text-sm font-bold text-text-primary font-mono">
            {automationPotential.calculatedTimeCostPerMonth.hours}h
          </span>
          <span className="text-xs text-text-tertiary">/month</span>
        </div>
      </div>
    </div>
  )
}
