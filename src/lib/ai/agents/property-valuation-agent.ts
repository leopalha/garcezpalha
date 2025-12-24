/**
 * Property Valuation Agent
 * Specializes in real estate appraisal per NBR 14653
 */

import { BaseAgent } from './base-agent'
import { VALUATION_SYSTEM_PROMPT, VALUATION_TASKS } from '../prompts'
import type { AgentConfig, AgentContext, AgentResponse } from './types'

export class PropertyValuationAgent extends BaseAgent {
  constructor(config?: Partial<AgentConfig>) {
    super(VALUATION_SYSTEM_PROMPT, config)
  }

  get name(): string {
    return 'Property Valuation Agent'
  }

  isRelevant(input: string): boolean {
    const keywords = [
      // Valuation terms
      'avaliação', 'avaliacao', 'avaliar', 'valor', 'preço', 'preco',
      // Market terms
      'mercado', 'venda', 'compra', 'custo',
      // Standards
      'nbr', '14653', 'abnt', 'laudo',
      // Property terms
      'imóvel', 'imovel', 'casa', 'apartamento', 'terreno',
      // Methods
      'comparativo', 'depreciação', 'depreciacão', 'homogeneização', 'homogeneizacao',
      // Questions
      'quanto vale', 'qual o valor', 'preço justo',
    ]

    const lowerInput = input.toLowerCase()
    return keywords.some(keyword => lowerInput.includes(keyword))
  }

  /**
   * Estimate property value
   */
  async estimateValue(
    propertyDetails: string,
    context?: AgentContext
  ): Promise<AgentResponse> {
    return this.processTask(
      VALUATION_TASKS.estimateValue,
      `Características do imóvel:\n\n${propertyDetails}`,
      context
    )
  }

  /**
   * Perform comparative market analysis
   */
  async comparativeAnalysis(
    propertyAndComparables: string,
    context?: AgentContext
  ): Promise<AgentResponse> {
    return this.processTask(
      VALUATION_TASKS.comparativeAnalysis,
      `Imóvel e comparáveis:\n\n${propertyAndComparables}`,
      context
    )
  }

  /**
   * Apply depreciation calculation
   */
  async applyDepreciation(
    propertyInfo: string,
    context?: AgentContext
  ): Promise<AgentResponse> {
    return this.processTask(
      VALUATION_TASKS.applyDepreciation,
      `Informações do imóvel:\n\n${propertyInfo}`,
      context
    )
  }

  /**
   * Generate valuation report
   */
  async generateReport(
    fullPropertyData: string,
    context?: AgentContext
  ): Promise<AgentResponse> {
    return this.processTask(
      VALUATION_TASKS.valuationReport,
      `Dados completos do imóvel:\n\n${fullPropertyData}`,
      context
    )
  }
}
