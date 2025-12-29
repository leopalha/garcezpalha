/**
 * Chat Qualification Database Persistence
 * Extends chat-qualification-integration with database persistence
 */

import {
  createLead,
  createQualificationSession,
  updateQualificationSession,
  getQualificationSession,
  createPaymentLinkRecord,
  createProposalRecord,
  createFollowUpMessages,
  logLeadInteraction,
} from '@/lib/leads/lead-database'
import type {
  QualificationResult,
  QuestionAnswer,
  QualificationQuestion,
} from './qualification/types'
import type { PaymentLink } from './qualification/payment-link-generator'
import type { Proposal } from './qualification/proposal-generator'
import type { FollowUpMessage } from './qualification/follow-up-scheduler'

/**
 * Save new qualification session to database
 */
export async function saveQualificationSession(params: {
  sessionId: string
  productId: string
  productName: string
  agentRole: string
  questions: QualificationQuestion[]
  clientInfo: {
    name?: string
    email?: string
    phone?: string
  }
  source: string
  userId?: string
}): Promise<void> {
  try {
    await createQualificationSession({
      sessionId: params.sessionId,
      productId: params.productId,
      productName: params.productName,
      agentRole: params.agentRole,
      questions: params.questions,
      clientInfo: params.clientInfo,
      source: params.source,
      userId: params.userId,
      expiresInHours: 24,
    })
  } catch (error) {
    console.error('[saveQualificationSession] Error:', error)
    // Don't throw - session saving shouldn't break the flow
  }
}

/**
 * Load qualification session from database
 */
export async function loadQualificationSession(sessionId: string): Promise<{
  sessionId: string
  productId: string
  agentRole: string
  questions: QualificationQuestion[]
  answers: QuestionAnswer[]
  currentQuestionIndex: number
  context: Record<string, unknown>
  clientInfo: { name?: string; email?: string; phone?: string }
} | null> {
  try {
    const session = await getQualificationSession(sessionId)
    if (!session) return null

    return {
      sessionId: session.sessionId,
      productId: session.productId,
      agentRole: session.agentRole,
      questions: session.questions,
      answers: session.answers,
      currentQuestionIndex: session.currentQuestionIndex,
      context: session.context,
      clientInfo: session.clientInfo,
    }
  } catch (error) {
    console.error('[loadQualificationSession] Error:', error)
    return null
  }
}

/**
 * Update qualification session in database
 */
export async function updateSessionProgress(
  sessionId: string,
  params: {
    answers: QuestionAnswer[]
    currentQuestionIndex: number
    context?: Record<string, unknown>
  }
): Promise<void> {
  try {
    await updateQualificationSession(sessionId, {
      answers: params.answers,
      currentQuestionIndex: params.currentQuestionIndex,
      context: params.context,
    })
  } catch (error) {
    console.error('[updateSessionProgress] Error:', error)
    // Don't throw
  }
}

/**
 * Save completed qualification to database
 */
export async function saveCompletedQualification(params: {
  sessionId: string
  result: QualificationResult
  clientInfo: {
    name: string
    email?: string
    phone?: string
  }
  source: string
  userId?: string
}): Promise<string | null> {
  try {
    // Create lead
    const lead = await createLead({
      result: params.result,
      clientInfo: params.clientInfo,
      source: params.source,
      userId: params.userId,
      sessionId: params.sessionId,
    })

    // Update session to completed and link to lead
    await updateQualificationSession(params.sessionId, {
      status: 'completed',
      leadId: lead.id,
    })

    // Log qualification completion
    await logLeadInteraction({
      leadId: lead.id,
      sessionId: params.sessionId,
      userId: params.userId,
      type: 'qualified',
      message: `Lead qualificado: ${params.clientInfo.name} - ${params.result.productName} (Score: ${params.result.score.total}, Categoria: ${params.result.score.category})`,
      metadata: {
        score: params.result.score,
        category: params.result.score.category,
      },
    })

    return lead.id
  } catch (error) {
    console.error('[saveCompletedQualification] Error:', error)
    return null
  }
}

/**
 * Save payment link to database
 */
export async function savePaymentLink(
  leadId: string,
  paymentLink: PaymentLink
): Promise<void> {
  try {
    await createPaymentLinkRecord({
      leadId,
      paymentLink,
    })

    await logLeadInteraction({
      leadId,
      type: 'payment',
      message: `Link de pagamento gerado: ${paymentLink.provider} - R$ ${(paymentLink.amount / 100).toFixed(2)}`,
      metadata: {
        provider: paymentLink.provider,
        amount: paymentLink.amount,
        url: paymentLink.url,
      },
    })
  } catch (error) {
    console.error('[savePaymentLink] Error:', error)
    // Don't throw
  }
}

/**
 * Save proposal to database
 */
export async function saveProposal(
  leadId: string,
  proposal: Proposal,
  paymentLinkId?: string
): Promise<void> {
  try {
    await createProposalRecord({
      leadId,
      proposal,
      paymentLinkId,
    })

    await logLeadInteraction({
      leadId,
      type: 'proposal',
      message: `Proposta gerada: ${proposal.productName} - R$ ${(proposal.pricing.adjustedPrice / 100).toFixed(2)}`,
      metadata: {
        proposalId: proposal.id,
        basePrice: proposal.pricing.basePrice,
        adjustedPrice: proposal.pricing.adjustedPrice,
      },
    })
  } catch (error) {
    console.error('[saveProposal] Error:', error)
    // Don't throw
  }
}

/**
 * Save follow-up messages to database
 */
export async function saveFollowUpMessages(
  leadId: string,
  messages: FollowUpMessage[]
): Promise<void> {
  try {
    await createFollowUpMessages(leadId, messages)

    await logLeadInteraction({
      leadId,
      type: 'follow_up',
      message: `${messages.length} mensagens de follow-up agendadas`,
      metadata: {
        count: messages.length,
        channels: messages.map((m) => m.channel),
      },
    })
  } catch (error) {
    console.error('[saveFollowUpMessages] Error:', error)
    // Don't throw
  }
}

/**
 * Log question interaction
 */
export async function logQuestionInteraction(params: {
  sessionId: string
  leadId?: string
  userId?: string
  questionId: string
  questionText: string
  answer: string | number | boolean | string[]
}): Promise<void> {
  try {
    await logLeadInteraction({
      sessionId: params.sessionId,
      leadId: params.leadId,
      userId: params.userId,
      type: 'answer',
      message: `Pergunta: ${params.questionText} | Resposta: ${JSON.stringify(params.answer)}`,
      metadata: {
        questionId: params.questionId,
        answer: params.answer,
      },
    })
  } catch (error) {
    console.error('[logQuestionInteraction] Error:', error)
    // Don't throw
  }
}

/**
 * Complete wrapper function for full qualification persistence
 */
export async function persistQualificationComplete(params: {
  sessionId: string
  result: QualificationResult
  clientInfo: { name: string; email?: string; phone?: string }
  paymentLink?: PaymentLink
  proposal?: Proposal
  followUpMessages?: FollowUpMessage[]
  source: string
  userId?: string
}): Promise<{ success: boolean; leadId?: string }> {
  try {
    // Save lead
    const leadId = await saveCompletedQualification({
      sessionId: params.sessionId,
      result: params.result,
      clientInfo: params.clientInfo,
      source: params.source,
      userId: params.userId,
    })

    if (!leadId) {
      return { success: false }
    }

    // Save payment link
    if (params.paymentLink) {
      await savePaymentLink(leadId, params.paymentLink)
    }

    // Save proposal
    if (params.proposal) {
      await saveProposal(leadId, params.proposal)
    }

    // Save follow-ups
    if (params.followUpMessages && params.followUpMessages.length > 0) {
      await saveFollowUpMessages(leadId, params.followUpMessages)
    }

    return { success: true, leadId }
  } catch (error) {
    console.error('[persistQualificationComplete] Error:', error)
    return { success: false }
  }
}
