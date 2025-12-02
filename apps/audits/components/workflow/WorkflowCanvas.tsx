'use client'

import { Workflow, BusinessArea, BUSINESS_AREA_COLORS } from '@/lib/types'
import { TriggerNode } from './TriggerNode'
import { StepNode } from './StepNode'
import { ConnectionLine } from './ConnectionLine'

interface WorkflowCanvasProps {
  workflow: Workflow
  selectedStepIndex: number | 'trigger' | null
  onNodeClick: (stepIndex: number | 'trigger') => void
}

// Layout constants
const NODE_WIDTH = 72  // w-16 + padding
const NODE_HEIGHT = 100 // node + label
const NODE_GAP = 60
const PADDING_X = 20
const PADDING_Y = 20
const NODE_CENTER_Y = PADDING_Y + 32 // Center of the node icon

export function WorkflowCanvas({ workflow, selectedStepIndex, onNodeClick }: WorkflowCanvasProps) {
  const totalNodes = 1 + workflow.steps.length // trigger + steps
  const canvasWidth = PADDING_X * 2 + totalNodes * NODE_WIDTH + (totalNodes - 1) * NODE_GAP
  const canvasHeight = NODE_HEIGHT + PADDING_Y * 2

  // Get business area color
  const areaColor = BUSINESS_AREA_COLORS[workflow.businessArea]?.light || '#3B82F6'

  // Calculate node positions
  const getNodeX = (index: number) => PADDING_X + index * (NODE_WIDTH + NODE_GAP)

  // Build connection points
  const connections: { startX: number; startY: number; endX: number; endY: number }[] = []

  // Trigger to first step
  if (workflow.steps.length > 0) {
    connections.push({
      startX: getNodeX(0) + NODE_WIDTH - 6,
      startY: NODE_CENTER_Y,
      endX: getNodeX(1) + 6,
      endY: NODE_CENTER_Y,
    })
  }

  // Step to step connections
  for (let i = 0; i < workflow.steps.length - 1; i++) {
    connections.push({
      startX: getNodeX(i + 1) + NODE_WIDTH - 6,
      startY: NODE_CENTER_Y,
      endX: getNodeX(i + 2) + 6,
      endY: NODE_CENTER_Y,
    })
  }

  return (
    <div className="relative overflow-x-auto pb-2">
      <div
        className="relative"
        style={{ width: canvasWidth, height: canvasHeight, minWidth: '100%' }}
      >
        {/* SVG layer for connection lines */}
        <svg
          className="absolute inset-0 pointer-events-none"
          width={canvasWidth}
          height={canvasHeight}
        >
          {connections.map((conn, i) => (
            <ConnectionLine
              key={i}
              startX={conn.startX}
              startY={conn.startY}
              endX={conn.endX}
              endY={conn.endY}
            />
          ))}
        </svg>

        {/* Trigger node */}
        <TriggerNode
          trigger={workflow.trigger}
          isSelected={selectedStepIndex === 'trigger'}
          onClick={() => onNodeClick('trigger')}
          style={{
            left: getNodeX(0),
            top: PADDING_Y,
          }}
        />

        {/* Step nodes */}
        {workflow.steps.map((step, index) => (
          <StepNode
            key={index}
            step={step}
            stepNumber={index + 1}
            isSelected={selectedStepIndex === index}
            isLast={index === workflow.steps.length - 1}
            onClick={() => onNodeClick(index)}
            areaColor={areaColor}
            style={{
              left: getNodeX(index + 1),
              top: PADDING_Y,
            }}
          />
        ))}
      </div>
    </div>
  )
}
