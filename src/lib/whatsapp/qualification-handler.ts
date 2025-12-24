/**
 * WhatsApp Qualification Handler
 * Specialized handler for lead qualification through WhatsApp
 */

import { whatsappCloudAPI } from './cloud-api'
import {
  QuestionEngine,
  calculateLeadScore,
  categorizeScore,
  getAgentForProduct,
  type QualificationQuestion,
  type QuestionAnswer,
  type LeadScore,
} from '@/lib/ai/qualification'
import {
  DEFESA_CRIMINAL_QUESTIONS,
  DEFESA_CRIMINAL_RULES,
  HABEAS_CORPUS_QUESTIONS,
  HABEAS_CORPUS_RULES,
  GRAFOTECNICA_QUESTIONS,
  GRAFOTECNICA_RULES,
  AVALIACAO_IMOVEIS_QUESTIONS,
  AVALIACAO_IMOVEIS_RULES,
  PERICIA_MEDICA_QUESTIONS,
  PERICIA_MEDICA_RULES,
  BPC_LOAS_QUESTIONS,
  BPC_LOAS_RULES,
  APOSENTADORIA_INVALIDEZ_QUESTIONS,
  APOSENTADORIA_INVALIDEZ_RULES,
  AUXILIO_DOENCA_QUESTIONS,
  AUXILIO_DOENCA_RULES,
  PLANO_SAUDE_QUESTIONS,
  PLANO_SAUDE_RULES,
  BARIATRICA_QUESTIONS,
  BARIATRICA_RULES,
  TEA_QUESTIONS,
  TEA_RULES,
  USUCAPIAO_QUESTIONS,
  USUCAPIAO_RULES,
  HOLDING_FAMILIAR_QUESTIONS,
  HOLDING_FAMILIAR_RULES,
  INVENTARIO_QUESTIONS,
  INVENTARIO_RULES,
  REGULARIZACAO_IMOVEL_QUESTIONS,
  REGULARIZACAO_IMOVEL_RULES,
  ACCOUNT_UNBLOCKING_QUESTIONS,
  ACCOUNT_UNBLOCKING_RULES,
  PIX_FRAUD_QUESTIONS,
  PIX_FRAUD_RULES,
  CREDIT_NEGATIVATION_QUESTIONS,
  CREDIT_NEGATIVATION_RULES,
} from '@/lib/ai/qualification'

// Product configuration
const PRODUCT_CONFIG = {
  'defesa-criminal': {
    name: 'Defesa Criminal',
    questions: DEFESA_CRIMINAL_QUESTIONS,
    rules: DEFESA_CRIMINAL_RULES,
    emoji: '⚖️',
  },
  'habeas-corpus': {
    name: 'Habeas Corpus',
    questions: HABEAS_CORPUS_QUESTIONS,
    rules: HABEAS_CORPUS_RULES,
    emoji: '🔓',
  },
  'grafotecnica': {
    name: 'Perícia Grafotécnica',
    questions: GRAFOTECNICA_QUESTIONS,
    rules: GRAFOTECNICA_RULES,
    emoji: '🔍',
  },
  'avaliacao-imoveis': {
    name: 'Avaliação de Imóveis',
    questions: AVALIACAO_IMOVEIS_QUESTIONS,
    rules: AVALIACAO_IMOVEIS_RULES,
    emoji: '🏠',
  },
  'pericia-medica': {
    name: 'Perícia Médica',
    questions: PERICIA_MEDICA_QUESTIONS,
    rules: PERICIA_MEDICA_RULES,
    emoji: '🏥',
  },
  'bpc-loas': {
    name: 'BPC LOAS',
    questions: BPC_LOAS_QUESTIONS,
    rules: BPC_LOAS_RULES,
    emoji: '💰',
  },
  'aposentadoria-invalidez': {
    name: 'Aposentadoria por Invalidez',
    questions: APOSENTADORIA_INVALIDEZ_QUESTIONS,
    rules: APOSENTADORIA_INVALIDEZ_RULES,
    emoji: '👴',
  },
  'auxilio-doenca': {
    name: 'Auxílio-Doença',
    questions: AUXILIO_DOENCA_QUESTIONS,
    rules: AUXILIO_DOENCA_RULES,
    emoji: '🏥',
  },
  'plano-saude': {
    name: 'Plano de Saúde',
    questions: PLANO_SAUDE_QUESTIONS,
    rules: PLANO_SAUDE_RULES,
    emoji: '🏥',
  },
  'bariatrica': {
    name: 'Cirurgia Bariátrica',
    questions: BARIATRICA_QUESTIONS,
    rules: BARIATRICA_RULES,
    emoji: '⚕️',
  },
  'tratamento-tea': {
    name: 'Tratamento TEA',
    questions: TEA_QUESTIONS,
    rules: TEA_RULES,
    emoji: '🧩',
  },
  'usucapiao': {
    name: 'Usucapião',
    questions: USUCAPIAO_QUESTIONS,
    rules: USUCAPIAO_RULES,
    emoji: '🏡',
  },
  'holding-familiar': {
    name: 'Holding Familiar',
    questions: HOLDING_FAMILIAR_QUESTIONS,
    rules: HOLDING_FAMILIAR_RULES,
    emoji: '👨‍👩‍👧‍👦',
  },
  'inventario': {
    name: 'Inventário',
    questions: INVENTARIO_QUESTIONS,
    rules: INVENTARIO_RULES,
    emoji: '📜',
  },
  'regularizacao-imovel': {
    name: 'Regularização de Imóvel',
    questions: REGULARIZACAO_IMOVEL_QUESTIONS,
    rules: REGULARIZACAO_IMOVEL_RULES,
    emoji: '📋',
  },
  'desbloqueio-conta': {
    name: 'Desbloqueio de Conta',
    questions: ACCOUNT_UNBLOCKING_QUESTIONS,
    rules: ACCOUNT_UNBLOCKING_RULES,
    emoji: '🔐',
  },
  'fraude-pix': {
    name: 'Fraude PIX',
    questions: PIX_FRAUD_QUESTIONS,
    rules: PIX_FRAUD_RULES,
    emoji: '💸',
  },
  'negativacao': {
    name: 'Negativação Indevida',
    questions: CREDIT_NEGATIVATION_QUESTIONS,
    rules: CREDIT_NEGATIVATION_RULES,
    emoji: '📊',
  },
} as const

export type ProductId = keyof typeof PRODUCT_CONFIG

interface QualificationSession {
  phoneNumber: string
  sessionId: string
  productId: ProductId
  engine: QuestionEngine
  startedAt: Date
  lastInteractionAt: Date
  clientName?: string
}

// Active qualification sessions
const activeSessions = new Map<string, QualificationSession>()

export class WhatsAppQualificationHandler {
  /**
   * Start a new qualification session
   */
  async startQualification(
    phoneNumber: string,
    productId: ProductId,
    clientName?: string
  ): Promise<void> {
    const config = PRODUCT_CONFIG[productId]
    if (!config) {
      throw new Error(`Unknown product: ${productId}`)
    }

    // Create session
    const sessionId = `whatsapp-${phoneNumber}-${Date.now()}`
    const engine = new QuestionEngine(
      config.questions,
      {
        sessionId,
        source: 'whatsapp',
        userId: phoneNumber,
      },
      []
    )

    const session: QualificationSession = {
      phoneNumber,
      sessionId,
      productId,
      engine,
      startedAt: new Date(),
      lastInteractionAt: new Date(),
      clientName,
    }

    activeSessions.set(phoneNumber, session)

    // Send welcome message
    await this.sendWelcomeMessage(phoneNumber, config.name, config.emoji)

    // Send first question
    await this.sendNextQuestion(phoneNumber)
  }

  /**
   * Process an answer from the user
   */
  async processAnswer(phoneNumber: string, answer: string): Promise<void> {
    const session = activeSessions.get(phoneNumber)
    if (!session) {
      await whatsappCloudAPI.sendMessage(
        phoneNumber,
        'Sessão não encontrada. Digite /inicio para começar.'
      )
      return
    }

    session.lastInteractionAt = new Date()

    // Get current question
    const currentQuestion = session.engine.getNextQuestion()
    if (!currentQuestion) {
      await whatsappCloudAPI.sendMessage(
        phoneNumber,
        '✅ Qualificação já completa!'
      )
      return
    }

    // Parse answer based on question type
    const parsedAnswer = this.parseAnswer(answer, currentQuestion)
    if (!parsedAnswer) {
      await whatsappCloudAPI.sendMessage(
        phoneNumber,
        '❌ Resposta inválida. Por favor, escolha uma das opções disponíveis.'
      )
      await this.sendQuestion(phoneNumber, currentQuestion)
      return
    }

    // Add answer
    session.engine.addAnswer({
      questionId: currentQuestion.id,
      value: parsedAnswer,
      timestamp: new Date(),
    })

    // Check if qualification is complete
    const nextQuestion = session.engine.getNextQuestion()
    if (!nextQuestion) {
      await this.completeQualification(phoneNumber)
    } else {
      // Send progress
      const progress = session.engine.getProgress()
      await whatsappCloudAPI.sendMessage(
        phoneNumber,
        `✅ Resposta registrada! (${progress.answered}/${progress.total})`
      )

      // Send next question
      await this.sendQuestion(phoneNumber, nextQuestion)
    }
  }

  /**
   * Complete qualification and calculate score
   */
  private async completeQualification(phoneNumber: string): Promise<void> {
    const session = activeSessions.get(phoneNumber)
    if (!session) return

    const config = PRODUCT_CONFIG[session.productId]
    const answers = session.engine.getAnswers()
    const score = calculateLeadScore(answers, config.rules)

    // Format result message
    let message = `\n✅ *QUALIFICAÇÃO COMPLETA*\n\n`
    message += `${config.emoji} *Produto:* ${config.name}\n\n`
    message += `📊 *Análise do Caso:*\n`
    message += `• Urgência: ${this.getScoreBar(score.urgency)} ${score.urgency}/100\n`
    message += `• Probabilidade: ${this.getScoreBar(score.probability)} ${score.probability}/100\n`
    message += `• Complexidade: ${this.getScoreBar(score.complexity)} ${score.complexity}/100\n\n`
    message += `🎯 *Score Total:* ${score.total}/100\n`
    message += `📈 *Categoria:* ${this.getCategoryEmoji(score.category)} ${this.getCategoryName(score.category)}\n\n`

    if (score.reasoning.length > 0) {
      message += `💡 *Principais Pontos:*\n`
      score.reasoning.slice(0, 3).forEach((reason, i) => {
        message += `${i + 1}. ${reason}\n`
      })
      message += `\n`
    }

    message += this.getNextStepsMessage(score.category)

    await whatsappCloudAPI.sendMessage(phoneNumber, message)

    // Save to database (async)
    this.saveQualificationResult(session, score).catch(console.error)

    // Clean up session
    activeSessions.delete(phoneNumber)
  }

  /**
   * Send next question to user
   */
  private async sendNextQuestion(phoneNumber: string): Promise<void> {
    const session = activeSessions.get(phoneNumber)
    if (!session) return

    const question = session.engine.getNextQuestion()
    if (!question) return

    await this.sendQuestion(phoneNumber, question)
  }

  /**
   * Send a question with options
   */
  private async sendQuestion(
    phoneNumber: string,
    question: QualificationQuestion
  ): Promise<void> {
    let message = `\n❓ *${question.text}*\n\n`

    if (question.helpText) {
      message += `ℹ️ ${question.helpText}\n\n`
    }

    if (question.options && question.options.length > 0) {
      message += `📋 *Opções:*\n`
      question.options.forEach((option, index) => {
        message += `${index + 1}. ${option.label}\n`
      })
      message += `\n💬 Responda com o número da opção escolhida.`
    }

    await whatsappCloudAPI.sendMessage(phoneNumber, message)
  }

  /**
   * Send welcome message
   */
  private async sendWelcomeMessage(
    phoneNumber: string,
    productName: string,
    emoji: string
  ): Promise<void> {
    const message = `
${emoji} *Qualificação: ${productName}*

Olá! Vou fazer algumas perguntas para entender melhor o seu caso e oferecer a melhor solução jurídica.

📝 O processo leva cerca de 2-3 minutos.
✅ Suas respostas são confidenciais.
🎯 No final, você receberá uma análise completa.

Vamos começar? 👇
    `.trim()

    await whatsappCloudAPI.sendMessage(phoneNumber, message)
  }

  /**
   * Parse user answer based on question type
   */
  private parseAnswer(
    answer: string,
    question: QualificationQuestion
  ): string | string[] | null {
    const normalizedAnswer = answer.trim().toLowerCase()

    if (question.type === 'single-choice' && question.options) {
      // Try to parse as number (option index)
      const optionIndex = parseInt(normalizedAnswer) - 1
      if (optionIndex >= 0 && optionIndex < question.options.length) {
        return question.options[optionIndex].value
      }

      // Try to match option label or value
      const matchedOption = question.options.find(
        (opt) =>
          opt.label.toLowerCase().includes(normalizedAnswer) ||
          opt.value.toLowerCase() === normalizedAnswer
      )

      return matchedOption ? matchedOption.value : null
    }

    if (question.type === 'multi-choice' && question.options) {
      // Parse comma-separated numbers
      const selectedIndexes = normalizedAnswer
        .split(/[,\s]+/)
        .map((s) => parseInt(s.trim()) - 1)
        .filter((i) => i >= 0 && i < question.options!.length)

      if (selectedIndexes.length > 0) {
        return selectedIndexes.map((i) => question.options![i].value)
      }

      return null
    }

    // For other types, return as-is
    return answer
  }

  /**
   * Get score visualization bar
   */
  private getScoreBar(score: number): string {
    const bars = Math.round(score / 10)
    const filled = '█'.repeat(bars)
    const empty = '░'.repeat(10 - bars)
    return filled + empty
  }

  /**
   * Get category emoji
   */
  private getCategoryEmoji(category: string): string {
    switch (category) {
      case 'hot':
        return '🔥'
      case 'warm':
        return '☀️'
      case 'cold':
        return '❄️'
      case 'very-cold':
        return '🧊'
      default:
        return '📊'
    }
  }

  /**
   * Get category name
   */
  private getCategoryName(category: string): string {
    switch (category) {
      case 'hot':
        return 'ALTA PRIORIDADE'
      case 'warm':
        return 'MÉDIA PRIORIDADE'
      case 'cold':
        return 'BAIXA PRIORIDADE'
      case 'very-cold':
        return 'NURTURING'
      default:
        return 'INDEFINIDA'
    }
  }

  /**
   * Get next steps message based on category
   */
  private getNextStepsMessage(category: string): string {
    switch (category) {
      case 'hot':
        return `
🚀 *Próximos Passos:*

Seu caso tem ALTA PRIORIDADE! Nossa equipe entrará em contato em até 2 horas.

📞 Para atendimento imediato, ligue:
   (21) 3852-0000

💬 Ou aguarde nosso contato.
        `.trim()

      case 'warm':
        return `
📋 *Próximos Passos:*

Nossa equipe analisará seu caso e entrará em contato ainda hoje.

📞 Dúvidas urgentes:
   (21) 3852-0000

✉️ Email: contato@garcezpalha.com.br
        `.trim()

      case 'cold':
        return `
📬 *Próximos Passos:*

Recebemos sua qualificação! Entraremos em contato em até 48h úteis para agendar uma consulta.

📞 Contato: (21) 3852-0000
✉️ Email: contato@garcezpalha.com.br
        `.trim()

      default:
        return `
📝 *Próximos Passos:*

Obrigado pelas informações! Nossa equipe avaliará seu caso e retornará em breve.

📞 Contato: (21) 3852-0000
✉️ Email: contato@garcezpalha.com.br
        `.trim()
    }
  }

  /**
   * Save qualification result to database
   */
  private async saveQualificationResult(
    session: QualificationSession,
    score: LeadScore
  ): Promise<void> {
    try {
      const config = PRODUCT_CONFIG[session.productId]
      const answers = session.engine.getAnswers()

      const leadData = {
        client_name: session.clientName,
        phone: session.phoneNumber,
        product_id: session.productId,
        product_name: config.name,
        score_total: score.total,
        score_urgency: score.urgency,
        score_probability: score.probability,
        score_complexity: score.complexity,
        category: score.category,
        answers: answers,
        reasoning: score.reasoning,
        source: 'whatsapp',
        session_id: session.sessionId,
        status: 'new',
        metadata: {
          emoji: config.emoji,
          started_at: session.startedAt.toISOString(),
          completed_at: new Date().toISOString(),
        },
      }

      const response = await fetch('/api/admin/leads/qualified', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData),
      })

      if (!response.ok) {
        throw new Error(`Failed to save lead: ${response.statusText}`)
      }

      const { lead } = await response.json()

      console.log('[WhatsApp Qualification] Lead saved successfully:', {
        phoneNumber: session.phoneNumber,
        productId: session.productId,
        score: score.total,
        category: score.category,
        leadId: lead?.id,
      })

      // Schedule automated follow-ups
      if (lead?.id && score.category !== 'unqualified') {
        try {
          const { scheduleFollowUps } = await import('@/lib/automation/follow-up-automation')
          await scheduleFollowUps(lead.id, score.category as 'hot' | 'warm' | 'cold' | 'very-cold')
          console.log('[WhatsApp Qualification] Follow-ups scheduled for lead:', lead.id)
        } catch (error) {
          console.error('[WhatsApp Qualification] Error scheduling follow-ups:', error)
        }
      }
    } catch (error) {
      console.error('[WhatsApp Qualification] Error saving result:', error)
    }
  }

  /**
   * Get active session for phone number
   */
  getSession(phoneNumber: string): QualificationSession | undefined {
    return activeSessions.get(phoneNumber)
  }

  /**
   * Cancel qualification session
   */
  async cancelSession(phoneNumber: string): Promise<void> {
    const session = activeSessions.get(phoneNumber)
    if (session) {
      activeSessions.delete(phoneNumber)
      await whatsappCloudAPI.sendMessage(
        phoneNumber,
        '❌ Qualificação cancelada. Digite /inicio para começar novamente.'
      )
    }
  }

  /**
   * List available products
   */
  static getAvailableProducts(): Array<{ id: ProductId; name: string; emoji: string }> {
    return Object.entries(PRODUCT_CONFIG).map(([id, config]) => ({
      id: id as ProductId,
      name: config.name,
      emoji: config.emoji,
    }))
  }
}

// Export singleton instance
export const whatsappQualificationHandler = new WhatsAppQualificationHandler()
