/**
 * Social Security Agent
 * Specializes in INSS benefits, retirement, BPC/LOAS, disability, and pension reviews
 */

import { BaseAgent } from './base-agent'
import { SOCIAL_SECURITY_SYSTEM_PROMPT, SOCIAL_SECURITY_TASKS } from '../prompts/social-security-prompts'
import type { AgentConfig, AgentContext, AgentResponse } from './types'

export class SocialSecurityAgent extends BaseAgent {
  constructor(config?: Partial<AgentConfig>) {
    super(SOCIAL_SECURITY_SYSTEM_PROMPT, config)
  }

  get name(): string {
    return 'Social Security Agent'
  }

  isRelevant(input: string): boolean {
    const keywords = [
      // INSS general
      'inss', 'previdência', 'previdencia', 'previdenciário', 'previdenciario',
      'benefício', 'beneficio', 'segurado',

      // BPC/LOAS
      'bpc', 'loas', 'benefício assistencial', 'beneficio assistencial',
      'idoso', 'deficiente', 'pessoa com deficiência', 'pessoa com deficiencia',
      'assistência social', 'assistencia social',

      // Retirement
      'aposentadoria', 'aposentar', 'aposentado', 'aposentada',
      'aposentadoria por idade', 'aposentadoria por tempo',
      'aposentadoria especial', 'aposentadoria rural',
      'aposentadoria por invalidez', 'reforma da previdência', 'reforma da previdencia',

      // Contribution and time
      'tempo de contribuição', 'tempo de contribuicao',
      'carência', 'carencia', 'tempo de serviço', 'tempo de servico',
      'carnê', 'carne', 'carteira de trabalho',
      'cnis', 'cadastro nacional',

      // Benefits
      'auxílio-doença', 'auxilio-doenca', 'auxílio doença', 'auxilio doenca',
      'auxílio acidente', 'auxilio acidente',
      'pensão por morte', 'pensao por morte',
      'salário-maternidade', 'salario-maternidade',

      // Review
      'revisão', 'revisao', 'revisão da vida toda', 'revisao da vida toda',
      'revisão do teto', 'revisao do teto',
      'revisão de benefício', 'revisao de beneficio',
      'buraco negro', 'buraco verde',

      // Medical
      'perícia médica', 'pericia medica', 'perícia', 'pericia',
      'laudo médico', 'laudo medico', 'incapacidade',
      'doença grave', 'doenca grave', 'invalidez',

      // Special activity
      'atividade especial', 'trabalho insalubre', 'ppp',
      'perfil profissiográfico', 'perfil profissiografico',
      'agente nocivo', 'conversão de tempo', 'conversao de tempo',

      // Administrative
      'negado pelo inss', 'inss negou', 'inss recusou',
      'recurso inss', 'indeferido', 'cessado',
    ]

    const lowerInput = input.toLowerCase()
    return keywords.some(keyword => lowerInput.includes(keyword))
  }

  /**
   * Analyze BPC/LOAS case
   */
  async analyzeBPC(
    bpcDetails: string,
    context?: AgentContext
  ): Promise<AgentResponse> {
    return this.processTask(
      SOCIAL_SECURITY_TASKS.analyzeBPC,
      `Detalhes do caso BPC/LOAS:\n\n${bpcDetails}`,
      context
    )
  }

  /**
   * Analyze retirement case
   */
  async analyzeRetirement(
    retirementDetails: string,
    context?: AgentContext
  ): Promise<AgentResponse> {
    return this.processTask(
      SOCIAL_SECURITY_TASKS.analyzeRetirement,
      `Detalhes da aposentadoria:\n\n${retirementDetails}`,
      context
    )
  }

  /**
   * Analyze benefit revision
   */
  async analyzeRevision(
    revisionDetails: string,
    context?: AgentContext
  ): Promise<AgentResponse> {
    return this.processTask(
      SOCIAL_SECURITY_TASKS.analyzeRevision,
      `Detalhes da revisão:\n\n${revisionDetails}`,
      context
    )
  }

  /**
   * Analyze disability benefit
   */
  async analyzeDisability(
    disabilityDetails: string,
    context?: AgentContext
  ): Promise<AgentResponse> {
    return this.processTask(
      SOCIAL_SECURITY_TASKS.analyzeDisability,
      `Detalhes do auxílio-doença/invalidez:\n\n${disabilityDetails}`,
      context
    )
  }

  /**
   * Calculate benefit values
   */
  async calculateBenefits(
    benefitDetails: string,
    context?: AgentContext
  ): Promise<AgentResponse> {
    return this.processTask(
      SOCIAL_SECURITY_TASKS.calculateBenefits,
      `Dados do benefício:\n\n${benefitDetails}`,
      context
    )
  }
}
