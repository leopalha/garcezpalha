/**
 * Agent State Machine Types
 * Defines all types for the 17-state agent behavior system
 */

export type StateType =
  | 'greeting'
  | 'identifying'
  | 'classifying'
  | 'qualifying'
  | 'qualified'
  | 'rejected'
  | 'proposing'
  | 'objection_handling'
  | 'closing'
  | 'payment_pending'
  | 'paid'
  | 'contract_pending'
  | 'onboarding'
  | 'active_case'
  | 'completed'
  | 'escalated'
  | 'abandoned'

export interface ClientInfo {
  name?: string
  cpf?: string
  email?: string
  phone?: string
  state?: string
  city?: string
}

export interface Classification {
  area: string // 'real-estate', 'criminal', 'medical', etc.
  product?: string // specific product ID
  agent_assigned: string
  confidence: number
}

export interface QualificationData {
  status: 'in_progress' | 'complete' | 'rejected'
  questions_answered: number
  total_questions: number
  score: number
  flags: string[] // warnings or important notes
}

export interface ProposalData {
  package?: string
  value?: number
  discount?: number
  payment_link?: string
  proposal_text?: string
  sent_at?: Date
}

export interface StatusData {
  state: StateType
  updated_at: Date
  escalation_reason?: string
  abandoned_reason?: string
  rejection_reason?: string
}

export interface ConversationData {
  conversation_id: string
  phone_number?: string
  email?: string
  channel: 'website' | 'whatsapp' | 'telegram' | 'email'
  client: ClientInfo
  classification: Classification
  qualification: QualificationData
  proposal: ProposalData
  status: StatusData
  created_at: Date
  last_message_at: Date
  metadata?: Record<string, any>
}

export interface StateTransition {
  from: StateType
  to: StateType
  trigger: string
  condition?: (data: ConversationData) => boolean
  action?: (data: ConversationData) => Promise<void>
}

export interface StateBehavior {
  state: StateType
  onEnter?: (data: ConversationData) => Promise<ConversationData>
  onExit?: (data: ConversationData) => Promise<ConversationData>
  handleMessage: (message: string, data: ConversationData) => Promise<{
    response: string
    nextState?: StateType
    data: ConversationData
  }>
}

export interface AutomatedAction {
  trigger: 'state_change' | 'time_based' | 'external_event'
  condition: (data: ConversationData) => boolean
  action: (data: ConversationData) => Promise<void>
  priority: 'high' | 'medium' | 'low'
}

// State transition rules
export const TRANSITIONS: Record<StateType, StateType[]> = {
  greeting: ['identifying', 'escalated', 'abandoned'],
  identifying: ['classifying', 'escalated', 'abandoned'],
  classifying: ['qualifying', 'escalated', 'abandoned'],
  qualifying: ['qualified', 'rejected', 'escalated', 'abandoned'],
  qualified: ['proposing', 'escalated'],
  rejected: ['qualifying', 'abandoned'], // can retry qualification
  proposing: ['objection_handling', 'closing', 'escalated', 'abandoned'],
  objection_handling: ['proposing', 'closing', 'escalated', 'abandoned'],
  closing: ['payment_pending', 'escalated', 'abandoned'],
  payment_pending: ['paid', 'escalated', 'abandoned'],
  paid: ['contract_pending'],
  contract_pending: ['onboarding', 'escalated'],
  onboarding: ['active_case'],
  active_case: ['completed', 'escalated'],
  completed: [], // terminal state
  escalated: ['identifying', 'qualifying', 'active_case'], // human can resume
  abandoned: ['greeting'], // can restart
}

// Escalation triggers
export interface EscalationRule {
  condition: (data: ConversationData) => boolean
  reason: string
  priority: 'critical' | 'high' | 'medium'
}

export const ESCALATION_RULES: EscalationRule[] = [
  {
    condition: (data) => data.qualification.flags.includes('complex_case'),
    reason: 'Caso muito complexo, requer análise humana',
    priority: 'high',
  },
  {
    condition: (data) => data.qualification.flags.includes('high_value'),
    reason: 'Valor alto, aprovação humana necessária',
    priority: 'high',
  },
  {
    condition: (data) => Boolean(data.proposal.value && data.proposal.value > 500000), // > R$ 5.000
    reason: 'Proposta acima de R$ 5.000',
    priority: 'high',
  },
  {
    condition: (data) => {
      const timeSinceLastMessage = Date.now() - new Date(data.last_message_at).getTime()
      return timeSinceLastMessage > 24 * 60 * 60 * 1000 // 24 hours
    },
    reason: 'Cliente sem resposta há 24h',
    priority: 'medium',
  },
  {
    condition: (data) => data.qualification.flags.includes('angry_customer'),
    reason: 'Cliente insatisfeito ou irritado',
    priority: 'critical',
  },
]
