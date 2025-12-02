'use client'

interface ConnectionLineProps {
  startX: number
  startY: number
  endX: number
  endY: number
}

export function ConnectionLine({ startX, startY, endX, endY }: ConnectionLineProps) {
  // Calculate control points for bezier curve
  const midX = (startX + endX) / 2
  const controlPoint1X = startX + (midX - startX) * 0.5
  const controlPoint2X = endX - (endX - midX) * 0.5

  const d = `M ${startX} ${startY} C ${controlPoint1X} ${startY}, ${controlPoint2X} ${endY}, ${endX} ${endY}`

  return (
    <path
      d={d}
      className="connection-line"
      strokeLinecap="round"
    />
  )
}
