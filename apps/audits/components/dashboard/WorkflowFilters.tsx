'use client'

import { BusinessArea, FilterValue } from '@/lib/types'

interface WorkflowFiltersProps {
  activeFilter: FilterValue
  onFilterChange: (filter: FilterValue) => void
  workflowCounts: Record<FilterValue, number>
}

const filters: { value: FilterValue; label: string; shortLabel?: string }[] = [
  { value: 'all', label: 'All Workflows' },
  { value: 'Acquisition', label: 'Acquisition' },
  { value: 'Onboarding', label: 'Onboarding' },
  { value: 'Delivery & Retention', label: 'Delivery & Retention', shortLabel: 'D&R' },
  { value: 'Content', label: 'Content' },
]

const filterColors: Record<FilterValue, string> = {
  'all': 'text-primary border-primary bg-primary/10',
  'Acquisition': 'text-area-acquisition border-area-acquisition bg-area-acquisition/10',
  'Onboarding': 'text-area-onboarding border-area-onboarding bg-area-onboarding/10',
  'Delivery & Retention': 'text-area-delivery border-area-delivery bg-area-delivery/10',
  'Content': 'text-area-content border-area-content bg-area-content/10',
}

export function WorkflowFilters({ activeFilter, onFilterChange, workflowCounts }: WorkflowFiltersProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      {filters.map(filter => {
        const isActive = activeFilter === filter.value
        const count = workflowCounts[filter.value]

        return (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 whitespace-nowrap ${
              isActive
                ? filterColors[filter.value]
                : 'text-text-secondary border-border bg-bg-surface hover:border-border-hover hover:bg-surface-secondary'
            }`}
          >
            <span className="hidden sm:inline">{filter.label}</span>
            <span className="sm:hidden">{filter.shortLabel || filter.label}</span>
            <span
              className={`inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full text-xs font-bold ${
                isActive
                  ? 'bg-white/20 text-inherit'
                  : 'bg-surface-secondary text-text-tertiary'
              }`}
            >
              {count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
