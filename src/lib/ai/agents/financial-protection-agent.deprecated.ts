/**
 * Financial Protection Agent
 * Specializes in bank account unblocking, PIX fraud, credit protection, and consumer rights
 */

import { BaseAgent } from './base-agent'
import { FINANCIAL_PROTECTION_SYSTEM_PROMPT, FINANCIAL_PROTECTION_TASKS } from '../prompts/financial-protection-prompts'
import type { AgentConfig, AgentContext, AgentResponse } from './types'

export class FinancialProtectionAgent extends BaseAgent {
  constructor(config?: Partial<AgentConfig>) {
    super(FINANCIAL_PROTECTION_SYSTEM_PROMPT, config)
  }

  get name(): string {
    return 'Financial Protection Agent'
  }

  isRelevant(input: string): boolean {
    const keywords = [
      // Account blocking
      'conta bloqueada', 'sisbajud', 'penhora', 'bloqueio judicial',
      'bloqueio de conta', 'desbloqueio', 'conta congelada',
      // PIX fraud
      'pix', 'golpe', 'golpe do pix', 'transferência indevida', 'transferencia indevida',
      'fraude', 'estorno', 'med', 'devolução pix', 'devolucao pix',
      'invasão de conta', 'invasao de conta', 'hackearam',
      // Credit protection (negativação)
      'negativação', 'negativacao', 'serasa', 'spc', 'boa vista',
      'protesto', 'nome sujo', 'negativado', 'negativada',
      'limpar nome', 'tirar do serasa', 'cadastro negativo',
      // Execution defense
      'execução', 'execucao', 'execução fiscal', 'execucao fiscal',
      'penhora', 'arresto', 'dívida', 'divida', 'cobrança', 'cobranca',
      'título executivo', 'titulo executivo', 'embargos',
      // Banking and consumer
      'banco', 'bancária', 'bancaria', 'instituição financeira', 'instituicao financeira',
      'consumidor', 'cdc', 'código de defesa', 'codigo de defesa',
      'salário bloqueado', 'salario bloqueado', 'conta salário', 'conta salario',
    ]

    const lowerInput = input.toLowerCase()
    return keywords.some(keyword => lowerInput.includes(keyword))
  }

  /**
   * Analyze account blocking case
   */
  async analyzeAccountBlock(
    blockDetails: string,
    context?: AgentContext
  ): Promise<AgentResponse> {
    return this.processTask(
      FINANCIAL_PROTECTION_TASKS.analyzeAccountBlock,
      `Detalhes do bloqueio:\n\n${blockDetails}`,
      context
    )
  }

  /**
   * Analyze PIX fraud case
   */
  async analyzePIXFraud(
    fraudDetails: string,
    context?: AgentContext
  ): Promise<AgentResponse> {
    return this.processTask(
      FINANCIAL_PROTECTION_TASKS.analyzePIXFraud,
      `Detalhes do golpe PIX:\n\n${fraudDetails}`,
      context
    )
  }

  /**
   * Analyze credit negativation case
   */
  async analyzeNegativacao(
    negativacaoDetails: string,
    context?: AgentContext
  ): Promise<AgentResponse> {
    return this.processTask(
      FINANCIAL_PROTECTION_TASKS.analyzeNegativacao,
      `Detalhes da negativação:\n\n${negativacaoDetails}`,
      context
    )
  }

  /**
   * Analyze execution defense
   */
  async analyzeExecution(
    executionDetails: string,
    context?: AgentContext
  ): Promise<AgentResponse> {
    return this.processTask(
      FINANCIAL_PROTECTION_TASKS.analyzeExecution,
      `Detalhes da execução:\n\n${executionDetails}`,
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
      FINANCIAL_PROTECTION_TASKS.calculateDamages,
      `Detalhes do caso:\n\n${caseDetails}`,
      context
    )
  }
}
