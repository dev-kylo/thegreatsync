'use client'

import { TopAutomationOpportunity } from '@/lib/types'
import { OpportunityCard } from './OpportunityCard'

interface TopOpportunitiesProps {
  opportunities: TopAutomationOpportunity[]
  onOpportunityClick?: (workflowName: string) => void
}

export function TopOpportunities({ opportunities, onOpportunityClick }: TopOpportunitiesProps) {
  if (opportunities.length === 0) return null

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">
            Top Automation Opportunities
          </h2>
          <p className="text-sm text-text-tertiary">
            Highest ROI workflows to automate first
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-text-tertiary">
          <span>Scroll</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>

      {/* Horizontal scroll container */}
      <div className="relative -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin">
          {opportunities.map((opp, index) => (
            <div key={index} className="snap-start">
              <OpportunityCard
                opportunity={opp}
                onClick={() => onOpportunityClick?.(opp.workflowName)}
              />
            </div>
          ))}
        </div>

        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-bg-primary to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-bg-primary to-transparent" />
      </div>
    </section>
  )
}
