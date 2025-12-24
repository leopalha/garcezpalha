/**
 * Lead Database Operations
 * Helper functions for CRUD operations on leads in Supabase
 */

import { createClient } from '@/lib/supabase/server'
import type {
  QualificationResult,
  LeadCategory,
  QuestionAnswer,
} from '@/lib/ai/qualification/types'
import type { PaymentLink } from '@/lib/ai/qualification/payment-link-generator'
import type { Proposal } from '@/lib/ai/qualification/proposal-generator'
import type { FollowUpMessage } from '@/lib/ai/qualification/follow-up-scheduler'

// =====================================================
// TYPES
// =====================================================

export type LeadStatus = 'active' | 'nurturing' | 'converted' | 'lost' | 'paused'

export interface Lead {
  id: string
  clientName: string
  email: string | null
  phone: string | null
  productId: string
  productName: string
  agentRole: string
  scoreTotal: number
  scoreUrgency: number
  scoreProbability: number
  scoreComplexity: number
  category: LeadCategory
  scoreReasoning: string[]
  status: LeadStatus
  estimatedValue: number | null // centavos
  estimatedFee: number | null // centavos
  recommendedActionType: string | null
  recommendedActionPriority: string | null
  recommendedActionMessage: string | null
  source: string
  sessionId: string | null
  userId: string | null
  createdAt: string
  updatedAt: string
  lastContactAt: string | null
  convertedAt: string | null
  metadata: Record<string, any>
}

export interface QualificationSession {
  id: string
  sessionId: string
  leadId: string | null
  productId: string
  productName: string
  agentRole: string
  status: 'in_progress' | 'completed' | 'abandoned'
  questions: any[]
  answers: QuestionAnswer[]
  currentQuestionIndex: number
  context: Record<string, any>
  clientInfo: {
    name?: string
    email?: string
    phone?: string
  }
  source: string
  userId: string | null
  createdAt: string
  updatedAt: string
  completedAt: string | null
  expiresAt: string | null
  metadata: Record<string, any>
}

export interface LeadStatistics {
  totalLeads: number
  hotLeads: number
  warmLeads: number
  coldLeads: number
  unqualifiedLeads: number
  activeLeads: number
  convertedLeads: number
  conversionRate: number
}

export interface ConversionFunnel {
  started: number
  qualified: number
  proposal: number
  payment: number
  converted: number
}

// =====================================================
// LEAD OPERATIONS
// =====================================================

/**
 * Create a new lead from qualification result
 */
export async function createLead(params: {
  result: QualificationResult
  clientInfo: {
    name: string
    email?: string
    phone?: string
  }
  source?: string
  userId?: string
  sessionId?: string
}): Promise<Lead> {
  const supabase = await createClient()

  const { result, clientInfo, source = 'website', userId, sessionId } = params

  const leadData = {
    client_name: clientInfo.name,
    email: clientInfo.email || null,
    phone: clientInfo.phone || null,
    product_id: result.productId,
    product_name: result.productName || result.productId,
    agent_role: result.agentRole || 'general',
    score_total: result.score.total,
    score_urgency: result.score.urgency,
    score_probability: result.score.probability,
    score_complexity: result.score.complexity,
    category: result.score.category,
    score_reasoning: result.score.reasoning,
    status: 'active' as LeadStatus,
    estimated_value: result.recommendedAction.estimatedValue || null,
    estimated_fee: result.recommendedAction.estimatedFee || null,
    recommended_action_type: result.recommendedAction.type,
    recommended_action_priority: result.recommendedAction.priority,
    recommended_action_message: result.recommendedAction.message,
    source,
    session_id: sessionId || null,
    user_id: userId || null,
    last_contact_at: new Date().toISOString(),
    metadata: {
      answers: result.answers,
    },
  }

  const { data, error } = await supabase
    .from('leads')
    .insert(leadData)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create lead: ${error.message}`)
  }

  return formatLead(data)
}

/**
 * Get lead by ID
 */
export async function getLead(leadId: string): Promise<Lead | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('id', leadId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // Not found
    throw new Error(`Failed to get lead: ${error.message}`)
  }

  return formatLead(data)
}

/**
 * Update lead
 */
export async function updateLead(
  leadId: string,
  updates: Partial<Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<Lead> {
  const supabase = await createClient()

  const updateData: Record<string, any> = {}

  if (updates.clientName !== undefined)
    updateData.client_name = updates.clientName
  if (updates.email !== undefined) updateData.email = updates.email
  if (updates.phone !== undefined) updateData.phone = updates.phone
  if (updates.status !== undefined) updateData.status = updates.status
  if (updates.lastContactAt !== undefined)
    updateData.last_contact_at = updates.lastContactAt
  if (updates.convertedAt !== undefined)
    updateData.converted_at = updates.convertedAt
  if (updates.metadata !== undefined) updateData.metadata = updates.metadata

  const { data, error } = await supabase
    .from('leads')
    .update(updateData)
    .eq('id', leadId)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update lead: ${error.message}`)
  }

  return formatLead(data)
}

/**
 * List leads with filters and pagination
 */
export async function listLeads(params?: {
  page?: number
  limit?: number
  category?: LeadCategory
  status?: LeadStatus
  search?: string
  productId?: string
}): Promise<{
  leads: Lead[]
  total: number
  page: number
  limit: number
  totalPages: number
}> {
  const supabase = await createClient()

  const page = params?.page || 1
  const limit = params?.limit || 10
  const offset = (page - 1) * limit

  let query = supabase.from('leads').select('*', { count: 'exact' })

  // Filters
  if (params?.category) {
    query = query.eq('category', params.category)
  }
  if (params?.status) {
    query = query.eq('status', params.status)
  }
  if (params?.productId) {
    query = query.eq('product_id', params.productId)
  }
  if (params?.search) {
    query = query.or(
      `client_name.ilike.%${params.search}%,email.ilike.%${params.search}%,phone.ilike.%${params.search}%`
    )
  }

  // Pagination
  query = query.range(offset, offset + limit - 1).order('created_at', {
    ascending: false,
  })

  const { data, error, count } = await query

  if (error) {
    throw new Error(`Failed to list leads: ${error.message}`)
  }

  const leads = data.map(formatLead)
  const total = count || 0
  const totalPages = Math.ceil(total / limit)

  return { leads, total, page, limit, totalPages }
}

/**
 * Get lead statistics
 */
export async function getLeadStatistics(): Promise<LeadStatistics> {
  const supabase = await createClient()

  const { data, error } = await supabase.rpc('get_lead_statistics')

  if (error) {
    throw new Error(`Failed to get lead statistics: ${error.message}`)
  }

  return {
    totalLeads: Number(data[0]?.total_leads || 0),
    hotLeads: Number(data[0]?.hot_leads || 0),
    warmLeads: Number(data[0]?.warm_leads || 0),
    coldLeads: Number(data[0]?.cold_leads || 0),
    unqualifiedLeads: Number(data[0]?.unqualified_leads || 0),
    activeLeads: Number(data[0]?.active_leads || 0),
    convertedLeads: Number(data[0]?.converted_leads || 0),
    conversionRate: Number(data[0]?.conversion_rate || 0),
  }
}

/**
 * Get conversion funnel
 */
export async function getConversionFunnel(): Promise<ConversionFunnel> {
  const supabase = await createClient()

  const { data, error } = await supabase.rpc('get_conversion_funnel')

  if (error) {
    throw new Error(`Failed to get conversion funnel: ${error.message}`)
  }

  return {
    started: Number(data[0]?.started || 0),
    qualified: Number(data[0]?.qualified || 0),
    proposal: Number(data[0]?.proposal || 0),
    payment: Number(data[0]?.payment || 0),
    converted: Number(data[0]?.converted || 0),
  }
}

/**
 * Mark lead as converted
 */
export async function convertLead(leadId: string): Promise<Lead> {
  return updateLead(leadId, {
    status: 'converted',
    convertedAt: new Date().toISOString(),
  })
}

// =====================================================
// QUALIFICATION SESSION OPERATIONS
// =====================================================

/**
 * Create qualification session
 */
export async function createQualificationSession(params: {
  sessionId: string
  productId: string
  productName: string
  agentRole: string
  questions: any[]
  clientInfo: { name?: string; email?: string; phone?: string }
  source?: string
  userId?: string
  expiresInHours?: number
}): Promise<QualificationSession> {
  const supabase = await createClient()

  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + (params.expiresInHours || 24))

  const sessionData = {
    session_id: params.sessionId,
    product_id: params.productId,
    product_name: params.productName,
    agent_role: params.agentRole,
    questions: params.questions,
    answers: [],
    current_question_index: 0,
    context: {},
    client_info: params.clientInfo,
    source: params.source || 'website',
    user_id: params.userId || null,
    expires_at: expiresAt.toISOString(),
    status: 'in_progress',
  }

  const { data, error } = await supabase
    .from('qualification_sessions')
    .insert(sessionData)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create qualification session: ${error.message}`)
  }

  return formatQualificationSession(data)
}

/**
 * Get qualification session
 */
export async function getQualificationSession(
  sessionId: string
): Promise<QualificationSession | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('qualification_sessions')
    .select('*')
    .eq('session_id', sessionId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw new Error(`Failed to get qualification session: ${error.message}`)
  }

  return formatQualificationSession(data)
}

/**
 * Update qualification session
 */
export async function updateQualificationSession(
  sessionId: string,
  updates: {
    answers?: QuestionAnswer[]
    currentQuestionIndex?: number
    context?: Record<string, any>
    status?: 'in_progress' | 'completed' | 'abandoned'
    leadId?: string
  }
): Promise<QualificationSession> {
  const supabase = await createClient()

  const updateData: Record<string, any> = {}

  if (updates.answers !== undefined) updateData.answers = updates.answers
  if (updates.currentQuestionIndex !== undefined)
    updateData.current_question_index = updates.currentQuestionIndex
  if (updates.context !== undefined) updateData.context = updates.context
  if (updates.status !== undefined) {
    updateData.status = updates.status
    if (updates.status === 'completed') {
      updateData.completed_at = new Date().toISOString()
    }
  }
  if (updates.leadId !== undefined) updateData.lead_id = updates.leadId

  const { data, error } = await supabase
    .from('qualification_sessions')
    .update(updateData)
    .eq('session_id', sessionId)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update qualification session: ${error.message}`)
  }

  return formatQualificationSession(data)
}

/**
 * Delete expired sessions
 */
export async function deleteExpiredSessions(): Promise<number> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('qualification_sessions')
    .delete()
    .lt('expires_at', new Date().toISOString())
    .select()

  if (error) {
    throw new Error(`Failed to delete expired sessions: ${error.message}`)
  }

  return data.length
}

// =====================================================
// PAYMENT LINK OPERATIONS
// =====================================================

/**
 * Create payment link
 */
export async function createPaymentLinkRecord(params: {
  leadId: string
  paymentLink: PaymentLink
}): Promise<void> {
  const supabase = await createClient()

  const { leadId, paymentLink } = params

  const paymentData = {
    lead_id: leadId,
    provider: paymentLink.provider,
    provider_id: paymentLink.id,
    url: paymentLink.url,
    amount: paymentLink.amount,
    original_amount: paymentLink.originalAmount,
    discount_applied: paymentLink.discountApplied,
    discount_percentage: paymentLink.discountPercentage,
    installments: paymentLink.installments,
    expires_at: paymentLink.expiresAt.toISOString(),
    status: 'pending',
    metadata: paymentLink.metadata || {},
  }

  const { error } = await supabase.from('payment_links').insert(paymentData)

  if (error) {
    throw new Error(`Failed to create payment link: ${error.message}`)
  }
}

/**
 * Update payment link status
 */
export async function updatePaymentLinkStatus(
  providerId: string,
  status: 'pending' | 'paid' | 'expired' | 'cancelled'
): Promise<void> {
  const supabase = await createClient()

  const updateData: Record<string, any> = { status }
  if (status === 'paid') {
    updateData.paid_at = new Date().toISOString()
  }

  const { error } = await supabase
    .from('payment_links')
    .update(updateData)
    .eq('provider_id', providerId)

  if (error) {
    throw new Error(`Failed to update payment link: ${error.message}`)
  }
}

// =====================================================
// PROPOSAL OPERATIONS
// =====================================================

/**
 * Create proposal
 */
export async function createProposalRecord(params: {
  leadId: string
  proposal: Proposal
  paymentLinkId?: string
}): Promise<void> {
  const supabase = await createClient()

  const { leadId, proposal, paymentLinkId } = params

  const proposalData = {
    lead_id: leadId,
    payment_link_id: paymentLinkId || null,
    proposal_id: proposal.id,
    product_id: proposal.productId,
    product_name: proposal.productName,
    client_name: proposal.clientName,
    sections: proposal.sections,
    base_price: proposal.pricing.basePrice,
    adjusted_price: proposal.pricing.adjustedPrice,
    discount: proposal.pricing.discount,
    installments: proposal.pricing.installments,
    estimated_case_value: proposal.pricing.estimatedCaseValue,
    valid_until: proposal.validUntil.toISOString(),
    status: 'sent',
    metadata: proposal.metadata || {},
  }

  const { error } = await supabase.from('proposals').insert(proposalData)

  if (error) {
    throw new Error(`Failed to create proposal: ${error.message}`)
  }
}

// =====================================================
// FOLLOW-UP MESSAGE OPERATIONS
// =====================================================

/**
 * Create follow-up messages
 */
export async function createFollowUpMessages(
  leadId: string,
  messages: FollowUpMessage[]
): Promise<void> {
  const supabase = await createClient()

  const messageData = messages.map((msg) => ({
    lead_id: leadId,
    message_id: msg.id,
    message: msg.message,
    channel: msg.channel,
    recipient_name: null, // Will be filled from lead info
    recipient_phone: msg.recipientPhone || null,
    recipient_email: msg.recipientEmail || null,
    scheduled_for: msg.scheduledFor.toISOString(),
    status: msg.status,
    metadata: msg.metadata || {},
  }))

  const { error } = await supabase.from('follow_up_messages').insert(messageData)

  if (error) {
    throw new Error(`Failed to create follow-up messages: ${error.message}`)
  }
}

/**
 * Get pending follow-up messages
 */
export async function getPendingFollowUpMessages(): Promise<any[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('follow_up_messages')
    .select('*')
    .eq('status', 'scheduled')
    .lte('scheduled_for', new Date().toISOString())
    .order('scheduled_for', { ascending: true })

  if (error) {
    throw new Error(`Failed to get pending follow-up messages: ${error.message}`)
  }

  return data
}

/**
 * Update follow-up message status
 */
export async function updateFollowUpMessageStatus(
  messageId: string,
  status:
    | 'scheduled'
    | 'sent'
    | 'delivered'
    | 'read'
    | 'replied'
    | 'failed'
    | 'cancelled',
  errorMessage?: string
): Promise<void> {
  const supabase = await createClient()

  const updateData: Record<string, any> = { status }

  if (status === 'sent') updateData.sent_at = new Date().toISOString()
  if (status === 'delivered') updateData.delivered_at = new Date().toISOString()
  if (status === 'read') updateData.read_at = new Date().toISOString()
  if (status === 'replied') updateData.replied_at = new Date().toISOString()
  if (errorMessage) updateData.error_message = errorMessage

  const { error } = await supabase
    .from('follow_up_messages')
    .update(updateData)
    .eq('message_id', messageId)

  if (error) {
    throw new Error(`Failed to update follow-up message: ${error.message}`)
  }
}

/**
 * Cancel lead follow-ups
 */
export async function cancelLeadFollowUps(leadId: string): Promise<void> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('follow_up_messages')
    .update({ status: 'cancelled' })
    .eq('lead_id', leadId)
    .in('status', ['scheduled', 'sent'])

  if (error) {
    throw new Error(`Failed to cancel lead follow-ups: ${error.message}`)
  }
}

// =====================================================
// LEAD INTERACTION OPERATIONS
// =====================================================

/**
 * Log lead interaction
 */
export async function logLeadInteraction(params: {
  leadId?: string
  sessionId?: string
  userId?: string
  type: string
  message: string
  metadata?: Record<string, any>
}): Promise<void> {
  const supabase = await createClient()

  const interactionData = {
    lead_id: params.leadId || null,
    session_id: params.sessionId || null,
    user_id: params.userId || null,
    type: params.type,
    message: params.message,
    metadata: params.metadata || {},
  }

  const { error } = await supabase
    .from('lead_interactions')
    .insert(interactionData)

  if (error) {
    console.error('Failed to log lead interaction:', error)
    // Don't throw - logging should be non-blocking
  }
}

/**
 * Get lead interactions
 */
export async function getLeadInteractions(
  leadId: string,
  limit = 50
): Promise<any[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('lead_interactions')
    .select('*')
    .eq('lead_id', leadId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    throw new Error(`Failed to get lead interactions: ${error.message}`)
  }

  return data
}

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

/**
 * Format database lead to TypeScript Lead type
 */
function formatLead(data: any): Lead {
  return {
    id: data.id,
    clientName: data.client_name,
    email: data.email,
    phone: data.phone,
    productId: data.product_id,
    productName: data.product_name,
    agentRole: data.agent_role,
    scoreTotal: data.score_total,
    scoreUrgency: data.score_urgency,
    scoreProbability: data.score_probability,
    scoreComplexity: data.score_complexity,
    category: data.category,
    scoreReasoning: data.score_reasoning || [],
    status: data.status,
    estimatedValue: data.estimated_value,
    estimatedFee: data.estimated_fee,
    recommendedActionType: data.recommended_action_type,
    recommendedActionPriority: data.recommended_action_priority,
    recommendedActionMessage: data.recommended_action_message,
    source: data.source,
    sessionId: data.session_id,
    userId: data.user_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    lastContactAt: data.last_contact_at,
    convertedAt: data.converted_at,
    metadata: data.metadata || {},
  }
}

/**
 * Format database qualification session to TypeScript type
 */
function formatQualificationSession(data: any): QualificationSession {
  return {
    id: data.id,
    sessionId: data.session_id,
    leadId: data.lead_id,
    productId: data.product_id,
    productName: data.product_name,
    agentRole: data.agent_role,
    status: data.status,
    questions: data.questions || [],
    answers: data.answers || [],
    currentQuestionIndex: data.current_question_index || 0,
    context: data.context || {},
    clientInfo: data.client_info || {},
    source: data.source,
    userId: data.user_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    completedAt: data.completed_at,
    expiresAt: data.expires_at,
    metadata: data.metadata || {},
  }
}
