/**
 * Medical Expertise Agent
 * Specializes in medical-legal analysis and disability assessment
 */

import { BaseAgent } from './base-agent'
import { MEDICAL_SYSTEM_PROMPT, MEDICAL_TASKS } from '../prompts'
import type { AgentConfig, AgentContext, AgentResponse } from './types'

export class MedicalExpertiseAgent extends BaseAgent {
  constructor(config?: Partial<AgentConfig>) {
    super(MEDICAL_SYSTEM_PROMPT, config)
  }

  get name(): string {
    return 'Medical Expertise Agent'
  }

  isRelevant(input: string): boolean {
    const keywords = [
      // Medical terms
      'médico', 'medico', 'saúde', 'saude', 'lesão', 'lesao',
      // Work-related
      'acidente de trabalho', 'doença ocupacional', 'inss', 'auxílio', 'auxilio',
      // Incapacity
      'incapacidade', 'invalidez', 'sequela', 'deficiência', 'deficiencia',
      // Legal
      'laudo', 'perícia', 'pericia', 'indenização', 'indenizacao',
      // Insurance
      'dpvat', 'seguro', 'aposentadoria',
      // Conditions
      'fratura', 'cirurgia', 'tratamento', 'nexo causal',
      // Error
      'erro médico', 'erro medico', 'negligência', 'negligencia',
    ]

    const lowerInput = input.toLowerCase()
    return keywords.some(keyword => lowerInput.includes(keyword))
  }

  /**
   * Analyze medical report
   */
  async analyzeMedicalReport(
    reportContent: string,
    context?: AgentContext
  ): Promise<AgentResponse> {
    return this.processTask(
      MEDICAL_TASKS.analyzeMedicalReport,
      `Laudo médico:\n\n${reportContent}`,
      context
    )
  }

  /**
   * Calculate disability degree
   */
  async calculateDisability(
    injuryDetails: string,
    context?: AgentContext
  ): Promise<AgentResponse> {
    return this.processTask(
      MEDICAL_TASKS.calculateDisability,
      `Detalhes da lesão:\n\n${injuryDetails}`,
      context
    )
  }

  /**
   * Estimate indemnity value
   */
  async estimateIndemnity(
    caseDetails: string,
    context?: AgentContext
  ): Promise<AgentResponse> {
    return this.processTask(
      MEDICAL_TASKS.estimateIndemnity,
      `Detalhes do caso:\n\n${caseDetails}`,
      context
    )
  }

  /**
   * Analyze work accident
   */
  async analyzeWorkAccident(
    accidentDetails: string,
    context?: AgentContext
  ): Promise<AgentResponse> {
    return this.processTask(
      MEDICAL_TASKS.workAccidentAnalysis,
      `Detalhes do acidente:\n\n${accidentDetails}`,
      context
    )
  }

  /**
   * Assess medical error case
   */
  async assessMedicalError(
    errorDetails: string,
    context?: AgentContext
  ): Promise<AgentResponse> {
    return this.processTask(
      MEDICAL_TASKS.medicalErrorAssessment,
      `Detalhes do possível erro:\n\n${errorDetails}`,
      context
    )
  }
}
