'use client'

interface TriggerNodeProps {
  trigger: string
  isSelected: boolean
  onClick: () => void
  style?: React.CSSProperties
}

export function TriggerNode({ trigger, isSelected, onClick, style }: TriggerNodeProps) {
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
            ? 'bg-amber-500/20 border-2 border-amber-500 shadow-lg shadow-amber-500/30'
            : 'bg-surface-secondary border border-border group-hover:border-amber-500/50 group-hover:bg-amber-500/10 group-hover:shadow-md'
        }`}
      >
        {/* Lightning bolt icon */}
        <svg
          className={`w-7 h-7 transition-colors duration-200 ${
            isSelected ? 'text-amber-500' : 'text-amber-500/70 group-hover:text-amber-500'
          }`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M13 3L4 14h7l-2 7 9-11h-7l2-7z" />
        </svg>

        {/* Connection dot on right */}
        <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-border border-2 border-bg-surface" />
      </div>

      {/* Label */}
      <span
        className={`max-w-24 text-xs text-center leading-tight transition-colors duration-200 line-clamp-2 ${
          isSelected ? 'text-text-primary font-medium' : 'text-text-tertiary group-hover:text-text-secondary'
        }`}
        title={trigger}
      >
        Trigger
      </span>

      {/* Tooltip on hover showing full trigger text */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg bg-bg-surface border border-border shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 w-48">
        <p className="text-xs text-text-secondary leading-relaxed">{trigger}</p>
      </div>
    </button>
  )
}
