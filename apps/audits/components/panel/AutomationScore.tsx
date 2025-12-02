'use client'

import { AutomationPotential } from '@/lib/types'
import { ScoreBadge } from '../ui/ScoreBadge'
import { Badge, TimeCostIcon, getTimeCostVariant } from '../ui/Badge'

interface AutomationScoreProps {
  automationPotential: AutomationPotential
}

export function AutomationScoreSection({ automationPotential }: AutomationScoreProps) {
  const {
    score,
    reason,
    AIApproach,
    timeCostPerMonth,
    calculatedTimeCostPerMonth,
    revenueImpact,
    expectedErrorReduction,
  } = automationPotential

  return (
    <div className="p-6 space-y-6">
      {/* Section title */}
      <div className="flex items-center gap-2">
        <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
          Automation Potential
        </h3>
      </div>

      {/* Score and key metrics */}
      <div className="flex items-start gap-6">
        <ScoreBadge score={score} size="lg" showLabel />

        <div className="flex-1 space-y-3">
          {/* Time savings */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-score-high/10 border border-score-high/20">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-score-high" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs text-text-tertiary">Time savings</span>
            </div>
            <span className="text-lg font-bold text-score-high font-mono">
              {calculatedTimeCostPerMonth.hours}h/mo
            </span>
          </div>

          {/* Impact badges */}
          <div className="flex gap-2">
            <Badge variant={getTimeCostVariant(timeCostPerMonth)} size="md">
              <TimeCostIcon level={timeCostPerMonth} />
              <span className="capitalize">{timeCostPerMonth} effort</span>
            </Badge>
            <Badge variant={revenueImpact === 'high' ? 'high' : revenueImpact === 'medium' ? 'medium' : 'low'} size="md">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
              </svg>
              <span className="capitalize">{revenueImpact} revenue</span>
            </Badge>
          </div>
        </div>
      </div>

      {/* Reason */}
      <div>
        <h4 className="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-2">
          Why This Score
        </h4>
        <p className="text-sm text-text-secondary leading-relaxed">
          {reason}
        </p>
      </div>

      {/* AI Approach recommendations */}
      <div>
        <h4 className="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-3">
          Recommended AI Approaches
        </h4>
        <ul className="space-y-2">
          {AIApproach.map((approach, index) => (
            <li key={index} className="flex items-start gap-2">
              <svg className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span className="text-sm text-text-secondary">{approach}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Error reduction */}
      {expectedErrorReduction && (
        <div className="p-3 rounded-lg bg-surface-secondary border border-border">
          <h4 className="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-1">
            Expected Error Reduction
          </h4>
          <p className="text-sm text-text-secondary">
            {expectedErrorReduction}
          </p>
        </div>
      )}
    </div>
  )
}
