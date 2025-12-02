'use client'

import { getScoreColor, getScoreLabel } from '@/lib/types'

interface ScoreBadgeProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

const sizeConfig = {
  sm: {
    container: 'w-10 h-10',
    text: 'text-sm',
    label: 'text-[10px]',
  },
  md: {
    container: 'w-14 h-14',
    text: 'text-xl',
    label: 'text-xs',
  },
  lg: {
    container: 'w-20 h-20',
    text: 'text-2xl',
    label: 'text-sm',
  },
}

export function ScoreBadge({ score, size = 'md', showLabel = false, className = '' }: ScoreBadgeProps) {
  const colors = getScoreColor(score)
  const label = getScoreLabel(score)
  const config = sizeConfig[size]

  // Create gradient based on score
  const getGradient = () => {
    if (score <= 2) {
      return 'from-gray-400 to-gray-600'
    }
    if (score === 3) {
      return 'from-amber-400 to-orange-500'
    }
    if (score === 4) {
      return 'from-emerald-400 to-green-600'
    }
    return 'from-emerald-400 via-green-500 to-teal-600'
  }

  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      <div
        className={`${config.container} rounded-full bg-gradient-to-br ${getGradient()} flex items-center justify-center shadow-lg`}
        style={{
          boxShadow: `0 4px 14px -3px ${colors.light}40`,
        }}
      >
        <span className={`${config.text} font-bold text-white font-mono drop-shadow-sm`}>
          {score}
        </span>
      </div>
      {showLabel && (
        <span className={`${config.label} font-medium text-text-tertiary uppercase tracking-wider`}>
          {label}
        </span>
      )}
    </div>
  )
}

// Inline score badge for use in headers/cards
export function InlineScoreBadge({ score, className = '' }: { score: number; className?: string }) {
  const getGradient = () => {
    if (score <= 2) return 'from-gray-400 to-gray-600'
    if (score === 3) return 'from-amber-400 to-orange-500'
    return 'from-emerald-400 to-green-600'
  }

  return (
    <span
      className={`inline-flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br ${getGradient()} text-white text-sm font-bold font-mono shadow-md ${className}`}
    >
      {score}
    </span>
  )
}
