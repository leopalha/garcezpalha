/**
 * Real Estate Law Agent
 * Specializes in property law, contracts, transactions
 */

import { BaseAgent } from './base-agent'
import { REAL_ESTATE_SYSTEM_PROMPT, REAL_ESTATE_TASKS } from '../prompts'
import type { AgentConfig, AgentContext, AgentResponse } from './types'

export class RealEstateAgent extends BaseAgent {
  constructor(config?: Partial<AgentConfig>) {
    super(REAL_ESTATE_SYSTEM_PROMPT, config)
  }

  get name(): string {
    return 'Real Estate Agent'
  }

  isRelevant(input: string): boolean {
    const keywords = [
      // Property terms
      'imóvel', 'imovel', 'casa', 'apartamento', 'terreno', 'propriedade',
      // Transaction terms
      'compra', 'venda', 'locação', 'locacao', 'aluguel', 'arrendamento',
      // Legal terms
      'contrato', 'escritura', 'matrícula', 'matricula', 'registro',
      // Issues
      'usucapião', 'usucapiao', 'despejo', 'condomínio', 'condominio',
      // Taxes
      'itbi', 'iptu', 'itcmd',
      // Documents
      'certidão', 'certidao', 'ônus', 'onus', 'penhora',
    ]

    const lowerInput = input.toLowerCase()
    return keywords.some(keyword => lowerInput.includes(keyword))
  }

  /**
   * Analyze a real estate contract
   */
  async analyzeContract(
    contractText: string,
    context?: AgentContext
  ): Promise<AgentResponse> {
    return this.processTask(
      REAL_ESTATE_TASKS.analyzeContract,
      `Contrato:\n\n${contractText}`,
      context
    )
  }

  /**
   * Check property documentation
   */
  async checkProperty(
    propertyInfo: string,
    context?: AgentContext
  ): Promise<AgentResponse> {
    return this.processTask(
      REAL_ESTATE_TASKS.checkProperty,
      `Informações do imóvel:\n\n${propertyInfo}`,
      context
    )
  }

  /**
   * Calculate transaction costs
   */
  async calculateCosts(
    transactionDetails: string,
    context?: AgentContext
  ): Promise<AgentResponse> {
    return this.processTask(
      REAL_ESTATE_TASKS.calculateCosts,
      `Detalhes da transação:\n\n${transactionDetails}`,
      context
    )
  }

  /**
   * Draft lease contract
   */
  async draftLease(
    leaseDetails: string,
    context?: AgentContext
  ): Promise<AgentResponse> {
    return this.processTask(
      REAL_ESTATE_TASKS.draftLease,
      `Detalhes da locação:\n\n${leaseDetails}`,
      context
    )
  }

  /**
   * Analyze usucapião feasibility
   */
  async analyzeUsucapiao(
    possessionDetails: string,
    context?: AgentContext
  ): Promise<AgentResponse> {
    return this.processTask(
      REAL_ESTATE_TASKS.usucapiaoAnalysis,
      `Detalhes da posse:\n\n${possessionDetails}`,
      context
    )
  }
}
