/**
 * Workflow Types
 * Common types for all workflow implementations
 */

import type { AgentRole } from '../agents/core/agent-types'

// =============================================================================
// WORKFLOW BASE TYPES
// =============================================================================

export type WorkflowStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'
export type WorkflowPriority = 'low' | 'medium' | 'high' | 'critical'
export type WorkflowFrequency = 'once' | 'daily' | 'weekly' | 'monthly' | 'on_trigger'

export interface WorkflowStep {
  id: string
  name: string
  agent: AgentRole
  action: string
  status: WorkflowStatus
  startedAt?: Date
  completedAt?: Date
  result?: unknown
  error?: string
  retryCount?: number
}

export interface WorkflowConfig {
  id: string
  name: string
  description: string
  frequency: WorkflowFrequency
  priority: WorkflowPriority
  enabled: boolean
  schedule?: string // cron expression
  timeout?: number // ms
  retryOnFailure?: boolean
  maxRetries?: number
  notifyOnComplete?: boolean
  notifyOnFailure?: boolean
}

export interface WorkflowExecution {
  id: string
  workflowId: string
  status: WorkflowStatus
  steps: WorkflowStep[]
  startedAt: Date
  completedAt?: Date
  duration?: number
  triggeredBy: 'schedule' | 'manual' | 'trigger'
  triggerData?: Record<string, unknown>
  result?: WorkflowResult
  error?: string
}

export interface WorkflowResult {
  success: boolean
  summary: string
  outputs: Record<string, unknown>
  metrics?: WorkflowMetrics
  nextActions?: WorkflowAction[]
}

export interface WorkflowMetrics {
  stepsCompleted: number
  stepsFailed: number
  totalDuration: number
  agentsUsed: AgentRole[]
  tokensUsed?: number
}

export interface WorkflowAction {
  type: 'notify' | 'schedule' | 'escalate' | 'execute'
  target: string
  payload: Record<string, unknown>
  priority: WorkflowPriority
}

// =============================================================================
// TRIGGER TYPES
// =============================================================================

export type TriggerType =
  | 'new_lead'
  | 'payment_received'
  | 'process_movement'
  | 'deadline_approaching'
  | 'client_message'
  | 'document_signed'
  | 'appointment_scheduled'

export interface TriggerConfig {
  type: TriggerType
  enabled: boolean
  conditions?: TriggerCondition[]
  workflow: string
  priority: WorkflowPriority
  cooldown?: number // ms between triggers
}

export interface TriggerCondition {
  field: string
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'in' | 'not_in'
  value: unknown
}

export interface TriggerEvent {
  id: string
  type: TriggerType
  timestamp: Date
  data: Record<string, unknown>
  source: string
  processed: boolean
  workflowExecutionId?: string
}

// =============================================================================
// DAILY WORKFLOW TYPES
// =============================================================================

export interface MorningBriefingInput {
  date: Date
  includeMetrics: boolean
  includeTasks: boolean
  includeAlerts: boolean
  includeSchedule: boolean
}

export interface MorningBriefingOutput {
  date: string
  executiveSummary: string
  keyMetrics: {
    category: string
    value: number | string
    trend: 'up' | 'down' | 'stable'
    vsYesterday?: number
  }[]
  priorityTasks: {
    id: string
    title: string
    priority: WorkflowPriority
    deadline?: string
    assignedTo?: AgentRole
  }[]
  activeAlerts: {
    id: string
    title: string
    severity: 'info' | 'warning' | 'critical'
    action: string
  }[]
  todaySchedule: {
    time: string
    event: string
    type: string
  }[]
  recommendations: string[]
}

export interface ContentScheduleInput {
  date: Date
  channels: string[]
  contentTypes: string[]
}

export interface ContentScheduleOutput {
  date: string
  scheduledPosts: {
    id: string
    time: string
    channel: string
    contentType: string
    title: string
    status: 'ready' | 'pending_approval' | 'generating'
  }[]
  contentGaps: {
    channel: string
    reason: string
    suggestion: string
  }[]
  generationTasks: {
    contentType: string
    channel: string
    topic: string
    deadline: string
  }[]
}

export interface AdsOptimizationInput {
  date: Date
  campaigns: string[]
  budget: number
  targetROAS?: number
}

export interface AdsOptimizationOutput {
  date: string
  campaignAdjustments: {
    campaignId: string
    campaignName: string
    action: 'increase_budget' | 'decrease_budget' | 'pause' | 'reactivate' | 'adjust_bid'
    currentValue: number
    newValue: number
    reason: string
    expectedImpact: string
  }[]
  keywordOptimizations: {
    keyword: string
    action: 'add' | 'remove' | 'adjust_bid'
    reason: string
  }[]
  budgetAllocation: {
    platform: string
    currentBudget: number
    recommendedBudget: number
    reason: string
  }[]
  performanceSummary: {
    totalSpend: number
    totalConversions: number
    averageCPC: number
    roas: number
  }
}

// =============================================================================
// WEEKLY WORKFLOW TYPES
// =============================================================================

export interface PerformanceReviewInput {
  weekStart: Date
  weekEnd: Date
  departments: ('marketing' | 'operations' | 'finance' | 'legal')[]
}

export interface PerformanceReviewOutput {
  period: { start: string; end: string }
  overallScore: number
  departmentScores: {
    department: string
    score: number
    highlights: string[]
    concerns: string[]
    recommendations: string[]
  }[]
  keyAchievements: string[]
  areasForImprovement: string[]
  weeklyTrends: {
    metric: string
    thisWeek: number
    lastWeek: number
    change: number
    status: 'improved' | 'declined' | 'stable'
  }[]
  nextWeekPriorities: {
    priority: string
    owner: AgentRole
    deadline: string
  }[]
}

export interface ContentPlanningInput {
  weekStart: Date
  channels: string[]
  themes?: string[]
  specialDates?: { date: string; event: string }[]
}

export interface ContentPlanningOutput {
  period: { start: string; end: string }
  weeklyTheme: string
  contentCalendar: {
    day: string
    date: string
    posts: {
      channel: string
      time: string
      contentType: string
      topic: string
      brief: string
      status: 'planned' | 'generating' | 'ready'
    }[]
  }[]
  channelStrategy: {
    channel: string
    postsPlanned: number
    focusAreas: string[]
    targetMetrics: { metric: string; target: number }[]
  }[]
  resourceNeeds: {
    type: 'copy' | 'design' | 'video' | 'review'
    quantity: number
    deadline: string
  }[]
}

// =============================================================================
// TRIGGER WORKFLOW TYPES
// =============================================================================

export interface NewLeadTriggerData {
  leadId: string
  name: string
  email: string
  phone?: string
  source: string
  product?: string
  score?: number
  message?: string
  createdAt: Date
}

export interface NewLeadWorkflowOutput {
  leadId: string
  qualification: {
    score: number
    tier: 'hot' | 'warm' | 'cold'
    priority: WorkflowPriority
  }
  assignedTo?: AgentRole
  actions: {
    action: string
    status: 'completed' | 'scheduled' | 'pending'
    scheduledFor?: string
    result?: string
  }[]
  followUpScheduled?: {
    type: 'email' | 'whatsapp' | 'call'
    scheduledFor: string
    template: string
  }
  proposalGenerated?: boolean
}

export interface PaymentReceivedTriggerData {
  paymentId: string
  orderId: string
  clientId: string
  clientName: string
  amount: number
  currency: string
  paymentMethod: string
  product: string
  timestamp: Date
}

export interface PaymentReceivedWorkflowOutput {
  paymentId: string
  orderStatus: 'confirmed' | 'processing' | 'completed'
  actions: {
    action: string
    status: 'completed' | 'scheduled' | 'pending'
    result?: string
  }[]
  notifications: {
    type: 'email' | 'whatsapp' | 'internal'
    recipient: string
    sent: boolean
    template: string
  }[]
  onboardingStarted?: boolean
  documentsRequested?: string[]
}

export interface ProcessMovementTriggerData {
  processId: string
  processNumber: string
  clientId: string
  clientName: string
  movementType: string
  movementDate: Date
  description: string
  court?: string
  deadline?: Date
}

export interface ProcessMovementWorkflowOutput {
  processId: string
  classification: {
    type: 'routine' | 'important' | 'urgent' | 'critical'
    requiresAction: boolean
    deadline?: string
  }
  analysis: string
  recommendedActions: {
    action: string
    priority: WorkflowPriority
    deadline?: string
    assignedTo?: AgentRole
  }[]
  clientNotification?: {
    sent: boolean
    channel: 'email' | 'whatsapp'
    summary: string
  }
  tasksCreated: {
    id: string
    title: string
    dueDate: string
  }[]
}

// =============================================================================
// WORKFLOW RUNNER TYPES
// =============================================================================

export interface WorkflowRunner {
  execute(input: unknown): Promise<WorkflowResult>
  cancel(): Promise<void>
  getStatus(): WorkflowStatus
  getExecution(): WorkflowExecution | null
}

export interface WorkflowRegistry {
  register(config: WorkflowConfig, runner: WorkflowRunner): void
  unregister(workflowId: string): void
  get(workflowId: string): { config: WorkflowConfig; runner: WorkflowRunner } | undefined
  list(): WorkflowConfig[]
  getByFrequency(frequency: WorkflowFrequency): WorkflowConfig[]
}
