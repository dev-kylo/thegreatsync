'use client'

import { BusinessArea, TimeCostLevel } from '@/lib/types'

type BadgeVariant = 'default' | 'acquisition' | 'onboarding' | 'delivery' | 'content' | 'low' | 'medium' | 'high'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-surface-secondary text-text-secondary',
  acquisition: 'bg-area-acquisition/15 text-area-acquisition border-area-acquisition/30',
  onboarding: 'bg-area-onboarding/15 text-area-onboarding border-area-onboarding/30',
  delivery: 'bg-area-delivery/15 text-area-delivery border-area-delivery/30',
  content: 'bg-area-content/15 text-area-content border-area-content/30',
  low: 'bg-score-low/15 text-score-low border-score-low/30',
  medium: 'bg-score-medium/15 text-score-medium border-score-medium/30',
  high: 'bg-score-high/15 text-score-high border-score-high/30',
}

const sizeStyles: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
}

export function Badge({ children, variant = 'default', size = 'md', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-medium ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  )
}

// Helper to map business area to badge variant
export function getBusinessAreaVariant(area: BusinessArea): BadgeVariant {
  const mapping: Record<BusinessArea, BadgeVariant> = {
    'Acquisition': 'acquisition',
    'Onboarding': 'onboarding',
    'Delivery & Retention': 'delivery',
    'Content': 'content',
  }
  return mapping[area]
}

// Helper to map time cost level to badge variant
export function getTimeCostVariant(level: TimeCostLevel): BadgeVariant {
  return level
}

// Time cost icon component
export function TimeCostIcon({ level }: { level: TimeCostLevel }) {
  if (level === 'low') {
    return (
      <svg className="w-3 h-3" viewBox="0 0 12 12" fill="currentColor">
        <circle cx="6" cy="6" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    )
  }
  if (level === 'medium') {
    return (
      <svg className="w-3 h-3" viewBox="0 0 12 12" fill="currentColor">
        <circle cx="6" cy="6" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6 6 L6 1 A5 5 0 0 1 11 6 Z" fill="currentColor" />
      </svg>
    )
  }
  return (
    <svg className="w-3 h-3" viewBox="0 0 12 12" fill="currentColor">
      <circle cx="6" cy="6" r="5" />
    </svg>
  )
}
