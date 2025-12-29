/**
 * Agent Orchestrator
 * Intelligently routes user queries to the appropriate specialized agent
 */

import { RealEstateAgent } from './real-estate-agent'
import { DocumentForensicsAgent } from './document-forensics-agent'
import { PropertyValuationAgent } from './property-valuation-agent'
import { MedicalExpertiseAgent } from './medical-expertise-agent'
import { CriminalLawAgent } from './criminal-law-agent'
import { FinancialProtectionAgent } from './financial-protection-agent'
import { HealthInsuranceAgent } from './health-insurance-agent'
import { SocialSecurityAgent } from './social-security-agent'
import { BaseAgent } from './base-agent'
import { createBaseSystemMessage } from '../prompts'
import type { AgentRole, AgentConfig, AgentContext, AgentResponse, Message } from './types'

export interface OrchestratorResponse extends AgentResponse {
  agentUsed: AgentRole
  confidence: number
}

export class AgentOrchestrator {
  private agents: Map<AgentRole, any>  // Changed to any - wrappers don't extend BaseAgent
  private config: Partial<AgentConfig>

  constructor(config?: Partial<AgentConfig>) {
    this.config = config || {}
    this.agents = new Map()

    // Initialize all specialized agents
    // Note: These now use factory-based wrappers
    this.agents.set('real-estate', new RealEstateAgent(this.config))
    this.agents.set('forensics', new DocumentForensicsAgent(this.config))
    this.agents.set('valuation', new PropertyValuationAgent(this.config))
    this.agents.set('medical', new MedicalExpertiseAgent(this.config))
    this.agents.set('criminal', new CriminalLawAgent(this.config))
    this.agents.set('financial-protection', new FinancialProtectionAgent(this.config))
    this.agents.set('health-insurance', new HealthInsuranceAgent(this.config))
    this.agents.set('social-security', new SocialSecurityAgent(this.config))

    // General agent for fallback (uses base prompt)
    const generalAgent = new (class extends BaseAgent {
      get name() { return 'General Agent' }
      isRelevant() { return true }
    })(createBaseSystemMessage('Consulta Geral Jurídica'), this.config)

    this.agents.set('general', generalAgent)
  }

  /**
   * Determine which agent should handle the query
   */
  private async selectAgent(input: string): Promise<{ role: AgentRole; confidence: number }> {
    const scores: Array<{ role: AgentRole; score: number }> = []

    // Check relevance for each specialized agent
    for (const [role, agent] of Array.from(this.agents.entries())) {
      if (role === 'general') continue // Skip general agent in scoring

      const isRelevant = await agent.isRelevant(input)
      if (isRelevant) {
        // Count keyword matches for confidence score
        const lowerInput = input.toLowerCase()
        let matchCount = 0

        // Get keywords based on agent type
        const keywords = this.getKeywordsForAgent(role)
        for (const keyword of keywords) {
          if (lowerInput.includes(keyword)) matchCount++
        }

        scores.push({ role, score: matchCount })
      }
    }

    // Sort by score and select highest
    scores.sort((a, b) => b.score - a.score)

    // If we have a clear winner (score > 0), use it
    if (scores.length > 0 && scores[0].score > 0) {
      const confidence = Math.min(scores[0].score / 5, 1) // Normalize to 0-1
      return { role: scores[0].role, confidence }
    }

    // Fallback to general agent
    return { role: 'general', confidence: 0.5 }
  }

  /**
   * Get keywords for confidence scoring
   */
  private getKeywordsForAgent(role: AgentRole): string[] {
    const keywordMap: Record<AgentRole, string[]> = {
      'real-estate': [
        'imóvel', 'imovel', 'casa', 'apartamento', 'compra', 'venda',
        'contrato', 'locação', 'locacao', 'usucapião', 'usucapiao',
        'itbi', 'iptu', 'matrícula', 'matricula', 'despejo'
      ],
      'forensics': [
        'assinatura', 'falsificação', 'falsificacao', 'grafotécnica', 'grafotecnica',
        'autenticidade', 'perícia', 'pericia', 'laudo', 'documento',
        'reconhecimento de firma', 'adulteração', 'adulteracao'
      ],
      'valuation': [
        'avaliação', 'avaliacao', 'avaliar', 'valor de mercado',
        'quanto vale', 'nbr', '14653', 'mercado imobiliário',
        'depreciação', 'depreciacão', 'comparativo de mercado',
        'avaliar propriedade', 'avaliar imovel', 'avaliar imóvel',
        'laudo de avaliação', 'laudo de avaliacao'
      ],
      'medical': [
        'médico', 'medico', 'acidente de trabalho', 'lesão', 'lesao',
        'dpvat', 'sequela', 'laudo médico', 'laudo medico',
        'erro médico', 'erro medico', 'perícia médica trabalhista'
      ],
      'criminal': [
        'criminal', 'penal', 'crime', 'prisão', 'prisao',
        'flagrante', 'habeas corpus', 'habeas', 'delegacia',
        'furto', 'roubo', 'homicídio', 'homicidio', 'tráfico', 'trafico',
        'defesa criminal', 'advogado criminal', 'denúncia', 'denuncia'
      ],
      'financial-protection': [
        'conta bloqueada', 'conta foi bloqueada', 'bloqueio de conta', 'minha conta',
        'sisbajud', 'penhora', 'bloqueio', 'bloqueou', 'bloqueada',
        'pix', 'golpe', 'golpe do pix', 'transferência', 'transferencia', 'estorno',
        'negativação', 'negativacao', 'serasa', 'spc',
        'execução', 'execucao', 'divida', 'dívida',
        'protesto', 'nome sujo', 'cobrança', 'cobranca',
        'banco', 'bancária', 'bancaria', 'consumidor', 'cdc'
      ],
      'health-insurance': [
        'plano de saude', 'plano de saúde', 'plano', 'operadora',
        'convenio', 'convênio', 'unimed', 'amil', 'ans',
        'negou', 'negativa', 'recusou', 'cobertura',
        'cirurgia', 'procedimento', 'internação', 'internacao',
        'bariatrica', 'bariátrica', 'tea', 'autismo',
        'quimioterapia', 'radioterapia', 'urgência', 'urgencia'
      ],
      'social-security': [
        'inss', 'aposentadoria', 'aposentar', 'bpc', 'loas',
        'previdência', 'previdencia', 'beneficio previdenciário', 'benefício previdenciario',
        'revisao', 'revisão', 'auxílio-doença', 'auxilio-doenca',
        'perícia do inss', 'pericia do inss', 'carência', 'carencia',
        'tempo de contribuição', 'tempo de contribuicao',
        'pensão por morte', 'pensao por morte', 'vida toda',
        'negado pelo inss', 'inss negou', 'invalidez',
        'incapacidade permanente', 'incapacidade temporária'
      ],
      'general': []
    }

    return keywordMap[role] || []
  }

  /**
   * Process user query with appropriate agent
   */
  async process(
    userMessage: string,
    conversationHistory: Message[] = [],
    context?: AgentContext
  ): Promise<OrchestratorResponse> {
    // Select the best agent
    const { role, confidence } = await this.selectAgent(userMessage)
    const agent = this.agents.get(role)!

    console.log(`[Orchestrator] Routing to ${role} agent (confidence: ${(confidence * 100).toFixed(0)}%)`)

    // Get response from selected agent
    const response = await agent.chat(userMessage, conversationHistory, context)

    return {
      ...response,
      agentUsed: role,
      confidence,
    }
  }

  /**
   * Process with a specific agent (manual routing)
   */
  async processWithAgent(
    agentRole: AgentRole,
    userMessage: string,
    conversationHistory: Message[] = [],
    context?: AgentContext
  ): Promise<OrchestratorResponse> {
    const agent = this.agents.get(agentRole)

    if (!agent) {
      throw new Error(`Agent ${agentRole} not found`)
    }

    const response = await agent.chat(userMessage, conversationHistory, context)

    return {
      ...response,
      agentUsed: agentRole,
      confidence: 1.0, // Manual routing = 100% confidence
    }
  }

  /**
   * Get agent instance for direct method calls
   */
  getAgent<T extends BaseAgent>(role: AgentRole): T {
    const agent = this.agents.get(role)
    if (!agent) {
      throw new Error(`Agent ${role} not found`)
    }
    return agent as T
  }

  /**
   * Check which agents are available
   */
  getAvailableAgents(): AgentRole[] {
    return Array.from(this.agents.keys())
  }

  /**
   * Get suggested agent for query (without processing)
   */
  async suggestAgent(input: string): Promise<{ role: AgentRole; confidence: number }> {
    return await this.selectAgent(input)
  }
}

/**
 * Singleton instance for easy access
 */
let orchestratorInstance: AgentOrchestrator | null = null

export function getOrchestrator(config?: Partial<AgentConfig>): AgentOrchestrator {
  if (!orchestratorInstance) {
    orchestratorInstance = new AgentOrchestrator(config)
  }
  return orchestratorInstance
}

/**
 * Quick helper to process a query
 */
export async function processQuery(
  query: string,
  conversationHistory?: Message[],
  context?: AgentContext
): Promise<OrchestratorResponse> {
  const orchestrator = getOrchestrator()
  return orchestrator.process(query, conversationHistory, context)
}
