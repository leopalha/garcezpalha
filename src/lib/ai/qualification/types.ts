/**
 * Types for Lead Qualification System
 */

import type { AgentRole } from '../agents/types'

/**
 * Question types for lead qualification
 */
export type QuestionType =
  | 'text'           // Free text input
  | 'number'         // Numeric input
  | 'currency'       // Money value
  | 'date'           // Date picker
  | 'single-choice'  // Radio buttons (one option)
  | 'multi-choice'   // Checkboxes (multiple options)
  | 'yes-no'         // Boolean question
  | 'file-upload'    // Document upload

/**
 * Priority level of a question
 */
export type QuestionPriority = 'required' | 'important' | 'optional'

/**
 * Single qualification question
 */
export interface QualificationQuestion {
  id: string
  text: string
  type: QuestionType
  priority: QuestionPriority

  // For choice-based questions
  options?: Array<{
    value: string
    label: string
    scoreModifier?: number  // Affects lead score
  }>

  // Validation
  validation?: {
    min?: number
    max?: number
    pattern?: string
    required?: boolean
  }

  // Conditional display
  conditionalOn?: {
    questionId: string
    expectedValue: string | string[]
  }

  // Help text
  helpText?: string
  placeholder?: string
}

/**
 * User's answer to a question
 */
export interface QuestionAnswer {
  questionId: string
  value: string | number | boolean | string[]
  timestamp: Date
}

/**
 * Lead score calculation
 */
export interface LeadScore {
  total: number           // 0-100
  urgency: number         // 0-100 (how urgent is the case)
  probability: number     // 0-100 (likelihood of conversion)
  complexity: number      // 0-100 (case complexity)
  category: LeadCategory
  reasoning: string[]     // Factors that influenced the score
}

/**
 * Lead categories based on score
 */
export type LeadCategory = 'hot' | 'warm' | 'cold' | 'unqualified'

/**
 * Lead qualification result
 */
export interface QualificationResult {
  leadId: string
  productId: string
  productName?: string
  agentRole: AgentRole

  // Questions and answers
  questions: QualificationQuestion[]
  answers: QuestionAnswer[]

  // Score
  score: LeadScore

  // Metadata
  startedAt: Date
  completedAt?: Date
  isComplete: boolean

  // Next steps
  recommendedAction: RecommendedAction
}

/**
 * Recommended action after qualification
 */
export interface RecommendedAction {
  type: 'schedule-consultation' | 'send-proposal' | 'request-documents' | 'follow-up' | 'disqualify'
  priority: 'immediate' | 'high' | 'medium' | 'low'
  message: string
  estimatedValue?: number  // Estimated case value
  estimatedFee?: number    // Estimated legal fee
}

/**
 * Mapping of agents to products
 */
export interface AgentProductMapping {
  agentRole: AgentRole
  productIds: string[]
}

/**
 * Product qualification configuration
 */
export interface ProductQualificationConfig {
  productId: string
  agentRole: AgentRole
  questions: QualificationQuestion[]
  scoringRules: ScoringRule[]
}

/**
 * Rule for score calculation
 */
export interface ScoringRule {
  id: string
  description: string
  condition: (answers: QuestionAnswer[]) => boolean
  impact: {
    urgency?: number
    probability?: number
    complexity?: number
  }
}

/**
 * Qualification context
 */
export interface QualificationContext {
  userId?: string
  sessionId: string
  source: 'website' | 'whatsapp' | 'phone' | 'email'
  initialMessage?: string
  metadata?: Record<string, unknown>
}
