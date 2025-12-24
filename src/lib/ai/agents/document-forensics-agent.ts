/**
 * Document Forensics Agent
 * Specializes in graphological analysis and document authentication
 */

import { BaseAgent } from './base-agent'
import { FORENSICS_SYSTEM_PROMPT, FORENSICS_TASKS } from '../prompts'
import type { AgentConfig, AgentContext, AgentResponse } from './types'

export class DocumentForensicsAgent extends BaseAgent {
  constructor(config?: Partial<AgentConfig>) {
    super(FORENSICS_SYSTEM_PROMPT, config)
  }

  get name(): string {
    return 'Document Forensics Agent'
  }

  isRelevant(input: string): boolean {
    const keywords = [
      // Forensics terms
      'assinatura', 'grafotécnica', 'grafotecnica', 'perícia', 'pericia',
      // Document issues
      'falsificação', 'falsificacao', 'falsa', 'falso', 'adulteração', 'adulteracao',
      // Analysis methods
      'autenticidade', 'reconhecimento de firma', 'laudo',
      // Document types
      'documento', 'contrato', 'procuração', 'procuracao', 'cheque',
      // Indicators
      'rasura', 'emenda', 'alteração', 'alteracao', 'fraude',
    ]

    const lowerInput = input.toLowerCase()
    return keywords.some(keyword => lowerInput.includes(keyword))
  }

  /**
   * Analyze signature authenticity
   */
  async analyzeSignature(
    signatureInfo: string,
    context?: AgentContext
  ): Promise<AgentResponse> {
    return this.processTask(
      FORENSICS_TASKS.analyzeSignature,
      `Informações sobre a assinatura:\n\n${signatureInfo}`,
      context
    )
  }

  /**
   * Detect document alterations
   */
  async detectAlterations(
    documentInfo: string,
    context?: AgentContext
  ): Promise<AgentResponse> {
    return this.processTask(
      FORENSICS_TASKS.detectAlterations,
      `Informações sobre o documento:\n\n${documentInfo}`,
      context
    )
  }

  /**
   * Assess document authenticity
   */
  async assessAuthenticity(
    documentDetails: string,
    context?: AgentContext
  ): Promise<AgentResponse> {
    return this.processTask(
      FORENSICS_TASKS.documentAuthenticity,
      `Detalhes do documento:\n\n${documentDetails}`,
      context
    )
  }

  /**
   * Prepare for forensic case
   */
  async prepareForensicCase(
    caseDetails: string,
    context?: AgentContext
  ): Promise<AgentResponse> {
    return this.processTask(
      FORENSICS_TASKS.prepareForensicCase,
      `Detalhes do caso:\n\n${caseDetails}`,
      context
    )
  }
}
