'use client'

import { useState, useMemo, useCallback } from 'react'
import { AuditData, FilterValue, Workflow, BusinessArea } from '@/lib/types'
import { Header } from './layout/Header'
import { SummaryCard } from './dashboard/SummaryCard'
import { TopOpportunities } from './dashboard/TopOpportunities'
import { WorkflowFilters } from './dashboard/WorkflowFilters'
import { WorkflowCard } from './workflow/WorkflowCard'
import { SidePanel } from './panel/SidePanel'
import { WorkflowDetailPanel } from './panel/WorkflowDetailPanel'

interface AuditDashboardProps {
  data: AuditData
}

interface SelectedNode {
  workflowIndex: number
  stepIndex: number | 'trigger'
}

export function AuditDashboard({ data }: AuditDashboardProps) {
  const [activeFilter, setActiveFilter] = useState<FilterValue>('all')
  const [selectedNode, setSelectedNode] = useState<SelectedNode | null>(null)

  // Calculate workflow counts for each filter
  const workflowCounts = useMemo(() => {
    const counts: Record<FilterValue, number> = {
      'all': data.workflows.length,
      'Acquisition': 0,
      'Onboarding': 0,
      'Delivery & Retention': 0,
      'Content': 0,
    }

    data.workflows.forEach(w => {
      counts[w.businessArea]++
    })

    return counts
  }, [data.workflows])

  // Filter workflows based on active filter
  const filteredWorkflows = useMemo(() => {
    if (activeFilter === 'all') return data.workflows
    return data.workflows.filter(w => w.businessArea === activeFilter)
  }, [data.workflows, activeFilter])

  // Get the original index of a workflow in the full array
  const getOriginalIndex = useCallback((workflow: Workflow) => {
    return data.workflows.indexOf(workflow)
  }, [data.workflows])

  // Handle node click
  const handleNodeClick = useCallback((workflowIndex: number, stepIndex: number | 'trigger') => {
    setSelectedNode({ workflowIndex, stepIndex })
  }, [])

  // Handle panel close
  const handlePanelClose = useCallback(() => {
    setSelectedNode(null)
  }, [])

  // Handle opportunity click - find workflow and scroll/highlight
  const handleOpportunityClick = useCallback((workflowName: string) => {
    const workflowIndex = data.workflows.findIndex(w => w.name === workflowName)
    if (workflowIndex !== -1) {
      const workflow = data.workflows[workflowIndex]
      // Set the filter to show this workflow's business area
      setActiveFilter(workflow.businessArea)
      // Open the panel for the trigger
      setSelectedNode({ workflowIndex, stepIndex: 'trigger' })
    }
  }, [data.workflows])

  // Get selected workflow
  const selectedWorkflow = selectedNode
    ? data.workflows[selectedNode.workflowIndex]
    : null

  return (
    <div className="min-h-screen bg-bg-primary">
      <Header clientName={data.clientName} />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary */}
        <div className="mb-8">
          <SummaryCard
            summary={data.summary}
            clientName={data.clientName}
            workflowCount={data.workflows.length}
            topOpportunityCount={data.topAutomationOpportunities.length}
            loomVideoUrl={data.loomVideoUrl}
          />
        </div>

        {/* Top Automation Opportunities */}
        <TopOpportunities
          opportunities={data.topAutomationOpportunities}
          onOpportunityClick={handleOpportunityClick}
        />

        {/* Workflows Section */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-semibold text-text-primary">
                Workflows
              </h2>
              <p className="text-sm text-text-tertiary">
                Click any step to view automation details
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6">
            <WorkflowFilters
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              workflowCounts={workflowCounts}
            />
          </div>

          {/* Workflow Cards */}
          <div className="space-y-6">
            {filteredWorkflows.map((workflow) => {
              const originalIndex = getOriginalIndex(workflow)
              const isSelected = selectedNode?.workflowIndex === originalIndex

              return (
                <WorkflowCard
                  key={originalIndex}
                  workflow={workflow}
                  workflowIndex={originalIndex}
                  selectedStepIndex={isSelected ? selectedNode.stepIndex : null}
                  onNodeClick={handleNodeClick}
                />
              )
            })}
          </div>

          {/* Empty state */}
          {filteredWorkflows.length === 0 && (
            <div className="text-center py-12">
              <p className="text-text-tertiary">
                No workflows in this category.
              </p>
            </div>
          )}
        </section>
      </main>

      {/* Side Panel */}
      <SidePanel isOpen={selectedNode !== null} onClose={handlePanelClose}>
        {selectedWorkflow && selectedNode && (
          <WorkflowDetailPanel
            workflow={selectedWorkflow}
            selectedStepIndex={selectedNode.stepIndex}
          />
        )}
      </SidePanel>
    </div>
  )
}
