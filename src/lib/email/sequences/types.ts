/**
 * Email Sequences - Types and Interfaces
 * Sistema de automação de email marketing
 */

export type SequenceType =
  | 'welcome' // Novo lead/signup
  | 'nurturing' // Lead qualificado mas não converteu
  | 'post-payment' // Pós-confirmação de pagamento
  | 'reactivation' // Leads inativos 30+ dias
  | 'nps' // Net Promoter Score pós-case
  | 'follow-up' // Follow-up geral
  | 'onboarding' // Onboarding novo cliente
  | 'abandoned-cart' // Carrinho abandonado

export type SequenceStatus = 'active' | 'paused' | 'completed' | 'cancelled'

export interface EmailTemplate {
  id: string
  name: string
  subject: string
  htmlContent: string
  textContent: string
  variables: string[] // Lista de variáveis usadas (ex: {{firstName}}, {{productName}})
  category: string // 'marketing', 'transactional', 'notification'
  tags: string[]
}

export interface SequenceStep {
  id: string
  sequenceId: string
  order: number // Ordem na sequência (1, 2, 3...)
  delayHours: number // Delay desde o step anterior (ou trigger)
  templateId: string
  template?: EmailTemplate
  conditions?: SequenceCondition[] // Condições para enviar este step
}

export interface SequenceCondition {
  type: 'opened' | 'clicked' | 'not_opened' | 'not_clicked' | 'score_above' | 'score_below'
  value?: string | number // Link clicado, score threshold, etc.
  previousStepId?: string // Referência ao step anterior
}

export interface EmailSequence {
  id: string
  name: string
  description: string
  type: SequenceType
  status: SequenceStatus
  steps: SequenceStep[]
  triggerEvent: string // 'lead_created', 'payment_confirmed', 'case_closed', etc.
  triggerConditions?: Record<string, any> // Ex: { score: { $gte: 80 } }
  stats: SequenceStats
  createdAt: Date
  updatedAt: Date
}

export interface SequenceStats {
  totalSubscribers: number
  activeSubscribers: number
  completedSubscribers: number
  totalEmailsSent: number
  totalOpens: number
  totalClicks: number
  openRate: number // Percentage
  clickRate: number // Percentage
  conversionRate: number // Percentage (se aplicável)
}

export interface SequenceSubscription {
  id: string
  sequenceId: string
  userId?: string // Se usuário autenticado
  leadId?: string // Se lead não autenticado
  email: string
  firstName: string
  lastName?: string
  customData: Record<string, any> // Dados específicos do lead/usuário
  currentStepId: string | null // Step atual na sequência
  status: SequenceStatus
  startedAt: Date
  completedAt?: Date
  cancelledAt?: Date
  lastEmailSentAt?: Date
}

export interface EmailEvent {
  id: string
  subscriptionId: string
  stepId: string
  type: 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'complained'
  emailProvider: 'resend' | 'sendgrid' | 'mailgun'
  providerId: string // ID do provider
  metadata?: Record<string, any>
  createdAt: Date
}

export interface SendEmailOptions {
  to: string
  from: string
  replyTo?: string
  subject: string
  html: string
  text?: string
  tags?: string[]
  headers?: Record<string, string>
  scheduledAt?: Date
}

export interface SequenceTriggerData {
  event: string
  userId?: string
  leadId?: string
  conversationId?: string
  email: string
  firstName: string
  lastName?: string
  customData: Record<string, any>
}
