'use client'

import { TopAutomationOpportunity } from '@/lib/types'
import { Badge, getBusinessAreaVariant } from '../ui/Badge'

interface OpportunityCardProps {
  opportunity: TopAutomationOpportunity
  onClick?: () => void
}

export function OpportunityCard({ opportunity, onClick }: OpportunityCardProps) {
  return (
    <button
      onClick={onClick}
      className="flex-shrink-0 w-80 text-left rounded-xl border border-border bg-bg-surface p-5 shadow-sm transition-all duration-200 hover:border-border-hover hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-bg-primary"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-sm font-semibold text-text-primary leading-tight line-clamp-2">
          {opportunity.workflowName}
        </h3>
        <Badge variant={getBusinessAreaVariant(opportunity.businessArea)} size="sm">
          {opportunity.businessArea === 'Delivery & Retention' ? 'D&R' : opportunity.businessArea}
        </Badge>
      </div>

      {/* Description */}
      <p className="text-sm text-text-secondary leading-relaxed line-clamp-3 mb-4">
        {opportunity.description}
      </p>

      {/* Time savings highlight */}
      <div className="flex items-center gap-2 p-3 rounded-lg bg-score-high/10 border border-score-high/20">
        <svg className="w-5 h-5 text-score-high flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="flex flex-col">
          <span className="text-lg font-bold text-score-high font-mono">
            {opportunity.calculatedTimeSavingsPerMonth.hours}
          </span>
          <span className="text-xs text-text-tertiary">hours saved/month</span>
        </div>
      </div>

      {/* View details link */}
      <div className="mt-4 flex items-center gap-1 text-xs font-medium text-primary">
        <span>View details</span>
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  )
}
