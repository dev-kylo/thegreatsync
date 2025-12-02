'use client'

import { Workflow } from '@/lib/types'
import { PanelHeader } from './PanelHeader'
import { AutomationScoreSection } from './AutomationScore'
import { CurrentOperations } from './CurrentOperations'
import { EvidenceSection } from './EvidenceSection'

interface WorkflowDetailPanelProps {
  workflow: Workflow
  selectedStepIndex: number | 'trigger'
}

export function WorkflowDetailPanel({ workflow, selectedStepIndex }: WorkflowDetailPanelProps) {
  return (
    <div className="flex flex-col">
      <PanelHeader workflow={workflow} selectedStepIndex={selectedStepIndex} />
      <AutomationScoreSection automationPotential={workflow.automationPotential} />
      <CurrentOperations workflow={workflow} />
      <EvidenceSection evidence={workflow.evidence} />
    </div>
  )
}
