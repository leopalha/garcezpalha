/**
 * Lead Qualifier Orchestrator
 * Main coordinator for the lead qualification process
 */

import { QuestionEngine } from './question-engine'
import { calculateLeadScore, getScoreInterpretation, estimateCaseValue } from './score-calculator'
import { getAgentForProduct } from './agent-product-mapping'
import type {
  QualificationQuestion,
  QuestionAnswer,
  QualificationResult,
  QualificationContext,
  ScoringRule,
  RecommendedAction,
  ProductQualificationConfig,
} from './types'
import { v4 as uuidv4 } from 'uuid'

/**
 * Lead Qualifier manages the complete qualification process
 */
export class LeadQualifier {
  private engine: QuestionEngine
  private productId: string
  private scoringRules: ScoringRule[]
  private startedAt: Date
  private leadId: string
  private basePrice: number

  constructor(config: ProductQualificationConfig, context: QualificationContext, basePrice: number) {
    this.productId = config.productId
    this.scoringRules = config.scoringRules
    this.engine = new QuestionEngine(config.questions, context)
    this.startedAt = new Date()
    this.leadId = uuidv4()
    this.basePrice = basePrice
  }

  /**
   * Get the next question to ask
   */
  getNextQuestion(): QualificationQuestion | null {
    return this.engine.getNextQuestion()
  }

  /**
   * Submit an answer
   */
  async submitAnswer(
    questionId: string,
    value: string | number | boolean | string[]
  ): Promise<{ success: boolean; error?: string; nextQuestion?: QualificationQuestion }> {
    // Validate answer
    const validation = this.engine.validateAnswer(questionId, value)
    if (!validation.valid) {
      return { success: false, error: validation.error }
    }

    // Add answer
    const answer: QuestionAnswer = {
      questionId,
      value,
      timestamp: new Date(),
    }
    this.engine.addAnswer(answer)

    // Get next question
    const nextQuestion = this.engine.getNextQuestion()

    return {
      success: true,
      nextQuestion: nextQuestion || undefined,
    }
  }

  /**
   * Get current progress
   */
  getProgress() {
    return this.engine.getProgress()
  }

  /**
   * Check if qualification is complete
   */
  isComplete(): boolean {
    return this.engine.isComplete()
  }

  /**
   * Get the qualification result
   */
  getResult(): QualificationResult {
    const answers = this.engine.getAnswers()
    const score = calculateLeadScore(answers, this.scoringRules)
    const agentRole = getAgentForProduct(this.productId)
    const { estimatedValue, estimatedFee } = estimateCaseValue(score, this.basePrice)

    // Determine recommended action
    const recommendedAction = this.determineRecommendedAction(score, estimatedValue, estimatedFee)

    return {
      leadId: this.leadId,
      productId: this.productId,
      agentRole: agentRole || 'general',
      questions: this.engine.getAllQuestions(),
      answers,
      score,
      startedAt: this.startedAt,
      completedAt: this.isComplete() ? new Date() : undefined,
      isComplete: this.isComplete(),
      recommendedAction,
    }
  }

  /**
   * Determine recommended action based on score
   */
  private determineRecommendedAction(
    score: any,
    estimatedValue: number,
    estimatedFee: number
  ): RecommendedAction {
    switch (score.category) {
      case 'hot':
        return {
          type: score.urgency >= 80 ? 'schedule-consultation' : 'send-proposal',
          priority: 'immediate',
          message: score.urgency >= 80
            ? 'Cliente altamente qualificado com urgência extrema. Agendar consulta IMEDIATAMENTE (próximas 2-4 horas).'
            : 'Cliente hot! Enviar proposta personalizada e agendar consulta em até 24h.',
          estimatedValue,
          estimatedFee,
        }

      case 'warm':
        return {
          type: score.probability >= 70 ? 'send-proposal' : 'request-documents',
          priority: 'high',
          message:
            score.probability >= 70
              ? 'Cliente qualificado. Enviar proposta e agendar consulta em 24-48h.'
              : 'Cliente promissor. Solicitar documentação adicional e agendar consulta em 48-72h.',
          estimatedValue,
          estimatedFee,
        }

      case 'cold':
        return {
          type: 'follow-up',
          priority: 'medium',
          message:
            'Cliente com potencial limitado. Incluir em sequência de nutrição de leads (3 follow-ups em 2 semanas).',
          estimatedValue,
          estimatedFee,
        }

      case 'unqualified':
        return {
          type: 'disqualify',
          priority: 'low',
          message:
            score.probability < 30
              ? 'Cliente não qualificado - baixa probabilidade de conversão. Agradecer contato e oferecer consulta básica (sem desconto).'
              : 'Cliente não atende critérios mínimos. Direcionar para conteúdo educativo ou consulta paga.',
          estimatedValue: 0,
          estimatedFee: 0,
        }

      default:
        return {
          type: 'follow-up',
          priority: 'medium',
          message: 'Cliente necessita avaliação adicional.',
          estimatedValue,
          estimatedFee,
        }
    }
  }

  /**
   * Get a summary for the client
   */
  getClientSummary(): string {
    const progress = this.getProgress()
    const answers = this.engine.getAnswers()

    if (progress.percentage < 100) {
      return `Você respondeu ${progress.answered} de ${progress.total} perguntas (${progress.percentage}%). ${
        progress.required - progress.requiredAnswered > 0
          ? `Faltam ${progress.required - progress.requiredAnswered} perguntas obrigatórias.`
          : 'Perguntas obrigatórias completas! Pode pular as opcionais ou continuar para melhorar a análise.'
      }`
    }

    const score = calculateLeadScore(answers, this.scoringRules)
    return getScoreInterpretation(score)
  }

  /**
   * Export state for persistence
   */
  exportState() {
    return {
      leadId: this.leadId,
      productId: this.productId,
      scoringRules: this.scoringRules,
      startedAt: this.startedAt,
      basePrice: this.basePrice,
      engineState: this.engine.exportState(),
    }
  }

  /**
   * Import state from persistence
   */
  static importState(state: any, config: ProductQualificationConfig): LeadQualifier {
    const instance = new LeadQualifier(config, state.engineState.context, state.basePrice)
    instance.leadId = state.leadId
    instance.startedAt = new Date(state.startedAt)
    instance.engine = QuestionEngine.importState(state.engineState)
    return instance
  }
}

/**
 * Create a lead qualifier for a specific product
 */
export function createLeadQualifier(
  config: ProductQualificationConfig,
  context: QualificationContext,
  basePrice: number
): LeadQualifier {
  return new LeadQualifier(config, context, basePrice)
}

/**
 * Resume a lead qualification session
 */
export function resumeLeadQualification(
  state: any,
  config: ProductQualificationConfig
): LeadQualifier {
  return LeadQualifier.importState(state, config)
}
