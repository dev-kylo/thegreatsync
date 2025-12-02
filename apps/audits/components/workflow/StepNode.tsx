'use client'

interface StepNodeProps {
  step: string
  stepNumber: number
  isSelected: boolean
  isLast: boolean
  onClick: () => void
  style?: React.CSSProperties
  areaColor?: string
}

export function StepNode({ step, stepNumber, isSelected, isLast, onClick, style, areaColor = 'var(--primary)' }: StepNodeProps) {
  return (
    <button
      onClick={onClick}
      style={style}
      className={`absolute flex flex-col items-center gap-2 p-1 group focus:outline-none transition-transform duration-200 hover:scale-105 ${
        isSelected ? 'scale-105' : ''
      }`}
    >
      {/* Node container */}
      <div
        className={`relative w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-200 ${
          isSelected
            ? 'bg-primary/20 border-2 shadow-lg'
            : 'bg-surface-secondary border border-border group-hover:border-primary/50 group-hover:bg-primary/10 group-hover:shadow-md'
        }`}
        style={{
          borderColor: isSelected ? areaColor : undefined,
          boxShadow: isSelected ? `0 10px 25px -5px ${areaColor}40` : undefined,
        }}
      >
        {/* Step icon */}
        <div className="flex flex-col items-center gap-0.5">
          <svg
            className={`w-5 h-5 transition-colors duration-200 ${
              isSelected ? 'text-primary' : 'text-text-tertiary group-hover:text-text-secondary'
            }`}
            style={{ color: isSelected ? areaColor : undefined }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span
            className={`text-xs font-mono font-bold ${
              isSelected ? 'text-primary' : 'text-text-tertiary'
            }`}
            style={{ color: isSelected ? areaColor : undefined }}
          >
            {stepNumber}
          </span>
        </div>

        {/* Connection dots */}
        <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-border border-2 border-bg-surface" />
        {!isLast && (
          <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-border border-2 border-bg-surface" />
        )}
      </div>

      {/* Label */}
      <span
        className={`max-w-20 text-xs text-center leading-tight transition-colors duration-200 line-clamp-2 ${
          isSelected ? 'text-text-primary font-medium' : 'text-text-tertiary group-hover:text-text-secondary'
        }`}
        title={step}
      >
        {truncateText(step, 30)}
      </span>

      {/* Tooltip on hover showing full step text */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg bg-bg-surface border border-border shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 w-56">
        <p className="text-xs text-text-secondary leading-relaxed">{step}</p>
      </div>
    </button>
  )
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + '...'
}
