/**
 * Health Insurance Agent
 * Specializes in health plan denials, bariatric surgery, TEA treatment, and medical coverage
 */

import { BaseAgent } from './base-agent'
import { HEALTH_INSURANCE_SYSTEM_PROMPT, HEALTH_INSURANCE_TASKS } from '../prompts/health-insurance-prompts'
import type { AgentConfig, AgentContext, AgentResponse } from './types'

export class HealthInsuranceAgent extends BaseAgent {
  constructor(config?: Partial<AgentConfig>) {
    super(HEALTH_INSURANCE_SYSTEM_PROMPT, config)
  }

  get name(): string {
    return 'Health Insurance Agent'
  }

  isRelevant(input: string): boolean {
    const keywords = [
      // Health plan terms
      'plano de saude', 'plano de saúde', 'plano', 'operadora',
      'convênio', 'convenio', 'convênio médico', 'convenio medico',
      'unimed', 'amil', 'bradesco saúde', 'bradesco saude',
      'sulamerica', 'sul america', 'notredame', 'notre dame',
      'ans', 'agência nacional', 'agencia nacional',

      // Denial/coverage terms
      'negou', 'negativa', 'recusou', 'recusa', 'não autorizou', 'nao autorizou',
      'não cobriu', 'nao cobriu', 'cobertura', 'autorização', 'autorizacao',
      'carta de negativa', 'negou o procedimento',

      // Procedures
      'cirurgia', 'procedimento', 'internação', 'internacao', 'uti',
      'quimioterapia', 'radioterapia', 'quimio', 'radio',
      'exame', 'consulta especialista',

      // Bariatric surgery
      'bariatrica', 'bariátrica', 'gastroplastia', 'redução de estomago', 'reducao de estomago',
      'cirurgia obesidade', 'bypass gástrico', 'bypass gastrico',
      'imc', 'obesidade', 'obesidade mórbida', 'obesidade morbida',

      // TEA (Autism)
      'tea', 'autismo', 'autista', 'espectro autista',
      'aba', 'terapia aba', 'fonoaudiologia', 'fono',
      'terapia ocupacional', 'to', 'psicopedagogia',
      'atraso no desenvolvimento', 'sessões', 'sessoes',

      // Medical urgency
      'urgência', 'urgencia', 'emergência', 'emergencia',
      'risco de vida', 'grave', 'preciso operar',

      // Insurance issues
      'carência', 'carencia', 'doença preexistente', 'doenca preexistente',
      'rol ans', 'não está no rol', 'nao esta no rol',
    ]

    const lowerInput = input.toLowerCase()
    return keywords.some(keyword => lowerInput.includes(keyword))
  }

  /**
   * Analyze health plan denial
   */
  async analyzeDenial(
    denialDetails: string,
    context?: AgentContext
  ): Promise<AgentResponse> {
    return this.processTask(
      HEALTH_INSURANCE_TASKS.analyzeDenial,
      `Detalhes da negativa:\n\n${denialDetails}`,
      context
    )
  }

  /**
   * Analyze bariatric surgery case
   */
  async analyzeBariatric(
    patientDetails: string,
    context?: AgentContext
  ): Promise<AgentResponse> {
    return this.processTask(
      HEALTH_INSURANCE_TASKS.analyzeBariatric,
      `Dados do paciente:\n\n${patientDetails}`,
      context
    )
  }

  /**
   * Analyze TEA treatment case
   */
  async analyzeTEA(
    teaDetails: string,
    context?: AgentContext
  ): Promise<AgentResponse> {
    return this.processTask(
      HEALTH_INSURANCE_TASKS.analyzeTEA,
      `Detalhes do tratamento TEA:\n\n${teaDetails}`,
      context
    )
  }

  /**
   * Analyze medical urgency/emergency
   */
  async analyzeUrgency(
    urgencyDetails: string,
    context?: AgentContext
  ): Promise<AgentResponse> {
    return this.processTask(
      HEALTH_INSURANCE_TASKS.analyzeUrgency,
      `Detalhes da urgência/emergência:\n\n${urgencyDetails}`,
      context
    )
  }

  /**
   * Calculate potential damages and recovery values
   */
  async calculateDamages(
    caseDetails: string,
    context?: AgentContext
  ): Promise<AgentResponse> {
    return this.processTask(
      HEALTH_INSURANCE_TASKS.calculateDamages,
      `Detalhes do caso:\n\n${caseDetails}`,
      context
    )
  }
}
