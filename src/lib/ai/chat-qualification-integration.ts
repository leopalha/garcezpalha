/**
 * Chat-Qualification Integration
 * Integrates the chat system with the lead qualification pipeline
 */

import { AgentOrchestrator } from './orchestrator'
import {
  createLeadQualifier,
  type QualificationResult,
  type ProductQualificationConfig,
  type QualificationContext,
  generatePaymentLink,
  generateProposal,
  scheduleQualificationFollowUp,
  formatPaymentLinkForWhatsApp,
  generateProposalMessage,
  ACCOUNT_UNBLOCKING_QUESTIONS,
  ACCOUNT_UNBLOCKING_RULES,
  PIX_FRAUD_QUESTIONS,
  PIX_FRAUD_RULES,
  CREDIT_NEGATIVATION_QUESTIONS,
  CREDIT_NEGATIVATION_RULES,
} from './qualification'
import type { AgentRole } from './agents/types'
import {
  saveQualificationSession,
  loadQualificationSession,
  updateSessionProgress,
  persistQualificationComplete,
} from './chat-qualification-persistence'

/**
 * Session state for qualification
 */
interface QualificationSession {
  sessionId: string
  userId?: string
  productId: string
  agentRole: AgentRole
  qualifierState: any
  startedAt: Date
  lastInteractionAt: Date
  clientInfo?: {
    name?: string
    phone?: string
    email?: string
  }
}

/**
 * Chat qualification response
 */
export interface ChatQualificationResponse {
  message: string
  type: 'question' | 'completion' | 'error'
  question?: {
    id: string
    text: string
    type: string
    options?: Array<{ value: string; label: string }>
    priority: string
  }
  progress?: {
    answered: number
    total: number
    percentage: number
  }
  result?: QualificationResult
  paymentLink?: string
  proposalText?: string
}

/**
 * Product configuration mapping
 */
const PRODUCT_CONFIGS: Record<string, { config: ProductQualificationConfig; basePrice: number }> = {
  'desbloqueio-conta': {
    config: {
      productId: 'desbloqueio-conta',
      agentRole: 'financial-protection',
      questions: ACCOUNT_UNBLOCKING_QUESTIONS,
      scoringRules: ACCOUNT_UNBLOCKING_RULES,
    },
    basePrice: 150000, // R$ 1.500
  },
  'golpe-pix': {
    config: {
      productId: 'golpe-pix',
      agentRole: 'financial-protection',
      questions: PIX_FRAUD_QUESTIONS,
      scoringRules: PIX_FRAUD_RULES,
    },
    basePrice: 200000, // R$ 2.000
  },
  'negativacao-indevida': {
    config: {
      productId: 'negativacao-indevida',
      agentRole: 'financial-protection',
      questions: CREDIT_NEGATIVATION_QUESTIONS,
      scoringRules: CREDIT_NEGATIVATION_RULES,
    },
    basePrice: 120000, // R$ 1.200
  },
}

/**
 * In-memory session storage (should be replaced with database in production)
 */
const activeSessions = new Map<string, QualificationSession>()

/**
 * Chat Qualification Manager
 */
export class ChatQualificationManager {
  private orchestrator: AgentOrchestrator

  constructor() {
    this.orchestrator = new AgentOrchestrator()
  }

  /**
   * Start qualification from chat message
   */
  async startQualification(params: {
    sessionId: string
    userId?: string
    message: string
    source: 'website' | 'whatsapp' | 'email'
    clientInfo?: {
      name?: string
      phone?: string
      email?: string
    }
  }): Promise<ChatQualificationResponse> {
    try {
      // Use orchestrator to determine the right agent and product
      const suggestion = this.orchestrator.suggestAgent(params.message)

      // Map agent to product (for now, use first product for the agent)
      const productId = this.getProductIdForAgent(suggestion.role, params.message)

      if (!productId || !PRODUCT_CONFIGS[productId]) {
        return {
          message: 'Desculpe, não consegui identificar um produto específico para sua solicitação. Pode detalhar melhor sua necessidade?',
          type: 'error',
        }
      }

      // Get product configuration
      const { config, basePrice } = PRODUCT_CONFIGS[productId]

      // Create qualification context
      const context: QualificationContext = {
        sessionId: params.sessionId,
        source: params.source,
        userId: params.userId,
        initialMessage: params.message,
      }

      // Create qualifier
      const qualifier = createLeadQualifier(config, context, basePrice)

      // Get first question
      const firstQuestion = qualifier.getNextQuestion()

      if (!firstQuestion) {
        return {
          message: 'Erro ao iniciar qualificação. Tente novamente.',
          type: 'error',
        }
      }

      // Save session to memory
      const session: QualificationSession = {
        sessionId: params.sessionId,
        userId: params.userId,
        productId,
        agentRole: suggestion.role,
        qualifierState: qualifier.exportState(),
        startedAt: new Date(),
        lastInteractionAt: new Date(),
        clientInfo: params.clientInfo,
      }
      activeSessions.set(params.sessionId, session)

      // Save session to database
      await saveQualificationSession({
        sessionId: params.sessionId,
        productId,
        productName: this.getProductName(productId),
        agentRole: suggestion.role,
        questions: config.questions,
        clientInfo: params.clientInfo || {},
        source: params.source,
        userId: params.userId,
      })

      // Format question for chat
      return {
        message: this.formatQuestionMessage(firstQuestion, config.productId),
        type: 'question',
        question: {
          id: firstQuestion.id,
          text: firstQuestion.text,
          type: firstQuestion.type,
          options: firstQuestion.options,
          priority: firstQuestion.priority,
        },
        progress: qualifier.getProgress(),
      }
    } catch (error: any) {
      console.error('[ChatQualification] Error starting qualification:', error)
      return {
        message: 'Desculpe, ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.',
        type: 'error',
      }
    }
  }

  /**
   * Submit answer to current question
   */
  async submitAnswer(params: {
    sessionId: string
    questionId: string
    answer: string | number | boolean | string[]
  }): Promise<ChatQualificationResponse> {
    try {
      // Get session
      const session = activeSessions.get(params.sessionId)
      if (!session) {
        return {
          message: 'Sessão expirada. Por favor, inicie novamente.',
          type: 'error',
        }
      }

      // Get product configuration
      const productConfig = PRODUCT_CONFIGS[session.productId]
      if (!productConfig) {
        return {
          message: 'Configuração de produto não encontrada.',
          type: 'error',
        }
      }

      // Restore qualifier from state
      const qualifier = createLeadQualifier(
        productConfig.config,
        session.qualifierState.engineState.context,
        productConfig.basePrice
      )

      // Import state
      const restoredQualifier = (qualifier.constructor as any).importState(
        session.qualifierState,
        productConfig.config
      )

      // Submit answer
      const result = await restoredQualifier.submitAnswer(params.questionId, params.answer)

      if (!result.success) {
        return {
          message: `Resposta inválida: ${result.error}. Por favor, tente novamente.`,
          type: 'error',
        }
      }

      // Update session in memory
      session.qualifierState = restoredQualifier.exportState()
      session.lastInteractionAt = new Date()
      activeSessions.set(params.sessionId, session)

      // Update session in database
      const engineState = restoredQualifier.exportState().engineState
      await updateSessionProgress(params.sessionId, {
        answers: engineState.answers,
        currentQuestionIndex: engineState.currentQuestionIndex || 0,
        context: engineState.context,
      })

      // Check if qualification is complete
      if (restoredQualifier.isComplete()) {
        return await this.handleQualificationComplete(session, restoredQualifier)
      }

      // Get next question
      const nextQuestion = result.nextQuestion
      if (!nextQuestion) {
        return {
          message: 'Erro ao obter próxima pergunta.',
          type: 'error',
        }
      }

      return {
        message: this.formatQuestionMessage(nextQuestion, session.productId),
        type: 'question',
        question: {
          id: nextQuestion.id,
          text: nextQuestion.text,
          type: nextQuestion.type,
          options: nextQuestion.options,
          priority: nextQuestion.priority,
        },
        progress: restoredQualifier.getProgress(),
      }
    } catch (error: any) {
      console.error('[ChatQualification] Error submitting answer:', error)
      return {
        message: 'Erro ao processar resposta. Tente novamente.',
        type: 'error',
      }
    }
  }

  /**
   * Handle qualification completion
   */
  private async handleQualificationComplete(
    session: QualificationSession,
    qualifier: any
  ): Promise<ChatQualificationResponse> {
    try {
      // Get qualification result
      const result: QualificationResult = qualifier.getResult()

      // Generate payment link
      const paymentLink = await generatePaymentLink(result)

      // Generate proposal
      const clientName = session.clientInfo?.name || 'Cliente'
      const proposal = generateProposal(result, clientName, paymentLink)

      // Get follow-up messages (but don't send yet)
      let followUpMessages
      if (session.clientInfo?.phone || session.clientInfo?.email) {
        followUpMessages = scheduleQualificationFollowUp(
          result,
          {
            name: clientName,
            phone: session.clientInfo.phone,
            email: session.clientInfo.email,
          },
          {
            startImmediately: true,
            channels: session.clientInfo.phone ? ['whatsapp', 'email'] : ['email'],
          }
        )
      }

      // Persist complete qualification to database
      await persistQualificationComplete({
        sessionId: session.sessionId,
        result,
        clientInfo: {
          name: clientName,
          email: session.clientInfo?.email,
          phone: session.clientInfo?.phone,
        },
        paymentLink,
        proposal,
        followUpMessages,
        source: qualifier.exportState().context.source || 'website',
        userId: session.userId,
      })

      // Format completion message
      const completionMessage = this.formatCompletionMessage(
        result,
        paymentLink,
        clientName
      )

      // Clean up session
      activeSessions.delete(session.sessionId)

      return {
        message: completionMessage,
        type: 'completion',
        result,
        paymentLink: paymentLink.url,
        proposalText: generateProposalMessage(
          clientName,
          this.getProductName(session.productId),
          paymentLink
        ),
      }
    } catch (error: any) {
      console.error('[ChatQualification] Error handling completion:', error)
      return {
        message: 'Erro ao finalizar qualificação. Nossa equipe entrará em contato.',
        type: 'error',
      }
    }
  }

  /**
   * Format question as chat message
   */
  private formatQuestionMessage(question: any, productId: string): string {
    let message = `${question.text}\n\n`

    if (question.helpText) {
      message += `💡 ${question.helpText}\n\n`
    }

    if (question.options && question.options.length > 0) {
      message += '*Opções:*\n'
      question.options.forEach((option: any, index: number) => {
        message += `${index + 1}. ${option.label}\n`
      })
    }

    if (question.priority === 'required') {
      message += '\n_Esta pergunta é obrigatória._'
    }

    return message
  }

  /**
   * Format completion message
   */
  private formatCompletionMessage(
    result: QualificationResult,
    paymentLink: any,
    clientName: string
  ): string {
    const categoryMessages: Record<string, string> = {
      hot: '🔥 *Excelente!* Seu caso tem alta prioridade.',
      warm: '✅ *Ótimo!* Seu caso está qualificado.',
      cold: '📋 Obrigado pelas informações.',
      unqualified: '📝 Obrigado pelo seu contato.',
    }

    let message = `${categoryMessages[result.score.category] || 'Obrigado!'}\n\n`

    message += `*Análise Completa:*\n`
    message += `Score: ${result.score.total}/100\n`
    message += `Categoria: ${result.score.category.toUpperCase()}\n\n`

    if (result.score.category === 'hot' || result.score.category === 'warm') {
      message += `*Próximos Passos:*\n`
      message += `1️⃣ Revise a proposta personalizada que vou enviar\n`
      message += `2️⃣ Finalize o pagamento através do link seguro\n`
      message += `3️⃣ Agende sua consulta imediata\n\n`

      const expiresIn = Math.round(
        (paymentLink.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60)
      )
      message += `⏰ *Proposta válida por ${expiresIn} horas*\n\n`
    }

    message += `Vou enviar todos os detalhes agora! 😊`

    return message
  }

  /**
   * Get product ID from agent role and message
   */
  private getProductIdForAgent(agentRole: AgentRole, message: string): string | null {
    const lowerMessage = message.toLowerCase()

    // Financial Protection products
    if (agentRole === 'financial-protection') {
      if (lowerMessage.includes('bloqueio') || lowerMessage.includes('conta bloqueada')) {
        return 'desbloqueio-conta'
      }
      if (lowerMessage.includes('pix') || lowerMessage.includes('golpe')) {
        return 'golpe-pix'
      }
      if (lowerMessage.includes('negativ') || lowerMessage.includes('serasa')) {
        return 'negativacao-indevida'
      }
      // Default to first product
      return 'desbloqueio-conta'
    }

    // Add more agent-to-product mappings here
    // For now, return null for other agents
    return null
  }

  /**
   * Get product display name
   */
  private getProductName(productId: string): string {
    const names: Record<string, string> = {
      'desbloqueio-conta': 'Desbloqueio de Conta Bancária',
      'golpe-pix': 'Recuperação de Valores - Golpe PIX',
      'negativacao-indevida': 'Remoção de Negativação Indevida',
    }
    return names[productId] || 'Serviço Jurídico'
  }

  /**
   * Get active session
   */
  getSession(sessionId: string): QualificationSession | undefined {
    return activeSessions.get(sessionId)
  }

  /**
   * Update client info in session
   */
  updateClientInfo(
    sessionId: string,
    clientInfo: { name?: string; phone?: string; email?: string }
  ): boolean {
    const session = activeSessions.get(sessionId)
    if (!session) return false

    session.clientInfo = { ...session.clientInfo, ...clientInfo }
    session.lastInteractionAt = new Date()
    activeSessions.set(sessionId, session)
    return true
  }

  /**
   * Cancel qualification session
   */
  cancelSession(sessionId: string): boolean {
    return activeSessions.delete(sessionId)
  }

  /**
   * Get all active sessions
   */
  getAllSessions(): QualificationSession[] {
    return Array.from(activeSessions.values())
  }

  /**
   * Clean up expired sessions (older than 24 hours)
   */
  cleanupExpiredSessions(): number {
    const now = Date.now()
    const expirationTime = 24 * 60 * 60 * 1000 // 24 hours
    let cleaned = 0

    for (const [sessionId, session] of activeSessions.entries()) {
      if (now - session.lastInteractionAt.getTime() > expirationTime) {
        activeSessions.delete(sessionId)
        cleaned++
      }
    }

    return cleaned
  }
}

/**
 * Global instance
 */
let globalManager: ChatQualificationManager | null = null

/**
 * Get or create global chat qualification manager
 */
export function getChatQualificationManager(): ChatQualificationManager {
  if (!globalManager) {
    globalManager = new ChatQualificationManager()
  }
  return globalManager
}

/**
 * Helper function to integrate with existing chat handler
 */
export async function handleChatWithQualification(params: {
  sessionId: string
  userId?: string
  message: string
  source: 'website' | 'whatsapp' | 'email'
  clientInfo?: {
    name?: string
    phone?: string
    email?: string
  }
}): Promise<ChatQualificationResponse> {
  const manager = getChatQualificationManager()

  // Check if there's an active qualification session
  const existingSession = manager.getSession(params.sessionId)

  if (existingSession) {
    // This is a follow-up message - treat as answer to current question
    // Extract the answer from the message
    const answer = extractAnswerFromMessage(params.message, existingSession)

    if (answer !== null) {
      // Get current question ID from session state
      const currentQuestionId = getCurrentQuestionId(existingSession)

      if (currentQuestionId) {
        return await manager.submitAnswer({
          sessionId: params.sessionId,
          questionId: currentQuestionId,
          answer,
        })
      }
    }
  }

  // No active session - start new qualification
  return await manager.startQualification(params)
}

/**
 * Extract answer from user message
 */
function extractAnswerFromMessage(message: string, session: QualificationSession): any {
  // Simple extraction - can be enhanced with NLP
  const trimmed = message.trim()

  // Check if it's a number (option selection)
  const num = parseInt(trimmed)
  if (!isNaN(num)) {
    return num - 1 // Convert to 0-based index
  }

  // Check if it's yes/no
  const lower = trimmed.toLowerCase()
  if (lower === 'sim' || lower === 'yes' || lower === 's') return true
  if (lower === 'não' || lower === 'nao' || lower === 'no' || lower === 'n') return false

  // Return as-is (text/number input)
  return trimmed
}

/**
 * Get current question ID from session
 */
function getCurrentQuestionId(session: QualificationSession): string | null {
  // Get the next unanswered question from the qualifier state
  const productConfig = PRODUCT_CONFIGS[session.productId]
  if (!productConfig) return null

  const qualifier = createLeadQualifier(
    productConfig.config,
    session.qualifierState.engineState.context,
    productConfig.basePrice
  )

  const restoredQualifier = (qualifier.constructor as any).importState(
    session.qualifierState,
    productConfig.config
  )

  const nextQuestion = restoredQualifier.getNextQuestion()
  return nextQuestion?.id || null
}
