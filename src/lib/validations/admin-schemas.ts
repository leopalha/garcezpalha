/**
 * Zod Validation Schemas - Admin APIs
 *
 * Centralizes all validation schemas for admin endpoints
 * Ensures type safety and runtime validation
 */

import { z } from 'zod'

// ============================================================================
// AGENT CONFIGURATION SCHEMAS
// ============================================================================

export const agentConfigUpdateSchema = z.object({
  role: z.string().min(1, 'Role is required'),
  category: z.string().min(1, 'Category is required'),
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().min(1, 'Description is required').max(500),
  systemPrompt: z.string().min(1, 'System prompt is required'),
  userPrompt: z.string().optional(),
  model: z.enum(['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'], {
    message: 'Invalid model'
  }),
  temperature: z.number().min(0).max(2).default(0.7),
  maxTokens: z.number().min(1).max(4000).default(1000),
  topP: z.number().min(0).max(1).default(1),
  frequencyPenalty: z.number().min(-2).max(2).default(0),
  presencePenalty: z.number().min(-2).max(2).default(0),
  enabled: z.boolean().default(true),
  requiresApproval: z.boolean().default(false),
  tools: z.array(z.string()).optional().default([])
})

export const agentTestSchema = z.object({
  input: z.string().min(1, 'Test input is required'),
  context: z.object({}).passthrough().optional()
})

// ============================================================================
// ANALYTICS SCHEMAS
// ============================================================================

export const analyticsDateRangeSchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)')
}).refine(data => new Date(data.startDate) <= new Date(data.endDate), {
  message: 'Start date must be before or equal to end date'
})

export const analyticsQuerySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  groupBy: z.enum(['day', 'week', 'month']).optional().default('day'),
  metric: z.string().optional()
})

export const analyticsLeadsQuerySchema = z.object({
  period: z.string().optional().default('30'),
  groupBy: z.enum(['day', 'week', 'month']).optional().default('day')
})

export const analyticsRevenueQuerySchema = z.object({
  months: z.string().optional().default('12')
})

export const analyticsSourceQuerySchema = z.object({
  days: z.string().optional().default('30')
})

export const analyticsTopProductsQuerySchema = z.object({
  days: z.string().optional().default('30'),
  limit: z.string().optional().default('10')
})

// ============================================================================
// CONVERSATION SCHEMAS
// ============================================================================

export const conversationUpdateSchema = z.object({
  status: z.enum(['active', 'closed', 'archived']).optional(),
  assignedTo: z.string().uuid().optional(),
  tags: z.array(z.string()).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  notes: z.string().max(1000).optional()
})

export const conversationMessageSchema = z.object({
  content: z.string().min(1, 'Message content is required').max(5000),
  role: z.enum(['user', 'assistant', 'system']),
  metadata: z.object({}).passthrough().optional()
})

export const conversationTakeoverSchema = z.object({
  reason: z.string().min(1, 'Takeover reason is required').max(500),
  notify: z.boolean().default(true)
})

// ============================================================================
// LEAD MANAGEMENT SCHEMAS
// ============================================================================

export const leadUpdateSchema = z.object({
  status: z.enum([
    'new',
    'contacted',
    'qualified',
    'proposal_sent',
    'negotiating',
    'won',
    'lost'
  ]).optional(),
  assignedTo: z.string().uuid().optional(),
  score: z.number().min(0).max(100).optional(),
  tags: z.array(z.string()).optional(),
  notes: z.string().max(2000).optional(),
  nextFollowUp: z.string().datetime().optional()
})

export const leadFilterSchema = z.object({
  status: z.string().optional(),
  assignedTo: z.string().uuid().optional(),
  minScore: z.number().min(0).max(100).optional(),
  maxScore: z.number().min(0).max(100).optional(),
  tags: z.array(z.string()).optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional()
})

export const qualifiedLeadCreateSchema = z.object({
  clientName: z.string().optional(),
  phone: z.string().min(1, 'Phone is required'),
  email: z.string().email().optional(),
  productId: z.string().min(1, 'Product ID is required'),
  productName: z.string().min(1, 'Product name is required'),
  score: z.object({
    total: z.number().min(0).max(100),
    urgency: z.number().min(0).max(100),
    probability: z.number().min(0).max(100),
    complexity: z.number().min(0).max(100),
    category: z.enum(['hot', 'warm', 'cold', 'very-cold']),
    reasoning: z.array(z.string()).optional()
  }),
  answers: z.array(z.any()).optional(),
  source: z.string().optional(),
  sessionId: z.string().min(1, 'Session ID is required'),
  metadata: z.object({}).passthrough().optional()
})

// ============================================================================
// FOLLOW-UP SCHEMAS
// ============================================================================

export const manualFollowUpSchema = z.object({
  leadId: z.string().uuid('Invalid lead ID'),
  type: z.enum(['email', 'whatsapp', 'sms', 'call']),
  message: z.string().min(1, 'Message is required').max(5000),
  scheduledFor: z.string().datetime().optional()
})

export const processFollowUpSchema = z.object({
  batchSize: z.number().min(1).max(100).default(10),
  type: z.enum(['email', 'whatsapp', 'sms', 'all']).optional()
})

// ============================================================================
// CERTIFICATE SCHEMAS
// ============================================================================

export const certificateGenerateSchema = z.object({
  domain: z.string().min(1, 'Domain is required'),
  email: z.string().email('Invalid email'),
  renewBefore: z.number().min(1).max(90).default(30)
})

// ============================================================================
// PROPOSAL SCHEMAS
// ============================================================================

export const sendPaymentSchema = z.object({
  proposalId: z.string().uuid('Invalid proposal ID'),
  amount: z.number().positive('Amount must be positive'),
  currency: z.enum(['BRL', 'USD']).default('BRL'),
  description: z.string().min(1).max(500),
  dueDate: z.string().datetime().optional(),
  paymentMethods: z.array(z.enum(['pix', 'credit_card', 'boleto'])).min(1)
})

// ============================================================================
// EXPORT TYPE INFERENCE
// ============================================================================

export type AgentConfigUpdate = z.infer<typeof agentConfigUpdateSchema>
export type AgentTest = z.infer<typeof agentTestSchema>
export type AnalyticsDateRange = z.infer<typeof analyticsDateRangeSchema>
export type AnalyticsQuery = z.infer<typeof analyticsQuerySchema>
export type ConversationUpdate = z.infer<typeof conversationUpdateSchema>
export type ConversationMessage = z.infer<typeof conversationMessageSchema>
export type ConversationTakeover = z.infer<typeof conversationTakeoverSchema>
export type LeadUpdate = z.infer<typeof leadUpdateSchema>
export type LeadFilter = z.infer<typeof leadFilterSchema>
export type QualifiedLeadCreate = z.infer<typeof qualifiedLeadCreateSchema>
export type ManualFollowUp = z.infer<typeof manualFollowUpSchema>
export type ProcessFollowUp = z.infer<typeof processFollowUpSchema>
export type CertificateGenerate = z.infer<typeof certificateGenerateSchema>
export type SendPayment = z.infer<typeof sendPaymentSchema>
