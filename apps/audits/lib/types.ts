export type BusinessArea = 'Acquisition' | 'Onboarding' | 'Delivery & Retention' | 'Content'

export type TimeCostLevel = 'low' | 'medium' | 'high'

export type RevenueImpact = 'low' | 'medium' | 'high'

export interface CalculatedTimeCost {
  hours: string
  confidence: number
}

export interface AutomationPotential {
  score: number
  reason: string
  AIApproach: string[]
  timeCostPerMonth: TimeCostLevel
  calculatedTimeCostPerMonth: CalculatedTimeCost
  revenueImpact: RevenueImpact
  expectedErrorReduction: string
}

export interface Evidence {
  fromSpokenExplanation: string[]
  fromOnScreenActions: string[]
}

export interface Workflow {
  name: string
  businessArea: BusinessArea
  trigger: string
  steps: string[]
  toolsInvolved: string[]
  manualPainPoints: string[]
  timeCostEstimate: string
  dependencies: string[]
  peopleInvolved: string[]
  automationPotential: AutomationPotential
  evidence: Evidence
}

export interface CalculatedTimeSavings {
  hours: string
  confidence: number
}

export interface TopAutomationOpportunity {
  workflowName: string
  businessArea: BusinessArea
  description: string
  impact: string
  whyHighROI: string
  recommendedAIImplementation: string
  calculatedTimeSavingsPerMonth: CalculatedTimeSavings
}

export interface AuditData {
  clientName: string
  summary: string
  loomVideoUrl?: string
  workflows: Workflow[]
  topAutomationOpportunities: TopAutomationOpportunity[]
}

// UI State types
export interface SelectedNode {
  workflowIndex: number
  stepIndex: number | 'trigger'
}

export type FilterValue = BusinessArea | 'all'

// Color mapping utilities
export const BUSINESS_AREA_COLORS: Record<BusinessArea, { light: string; dark: string }> = {
  'Acquisition': { light: '#3B82F6', dark: '#60A5FA' },
  'Onboarding': { light: '#8B5CF6', dark: '#A78BFA' },
  'Delivery & Retention': { light: '#10B981', dark: '#34D399' },
  'Content': { light: '#F59E0B', dark: '#FBBF24' },
}

export function getScoreColor(score: number): { light: string; dark: string } {
  if (score <= 2) return { light: '#6B7280', dark: '#9CA3AF' }
  if (score === 3) return { light: '#F59E0B', dark: '#FBBF24' }
  return { light: '#10B981', dark: '#34D399' }
}

export function getScoreLabel(score: number): string {
  if (score <= 2) return 'Manual preferred'
  if (score === 3) return 'Good candidate'
  return 'AI-ready'
}
