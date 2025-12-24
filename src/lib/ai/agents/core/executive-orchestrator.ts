/**
 * Executive Orchestrator
 * Multi-level agent orchestration with executive hierarchy
 * Routes queries through CEO -> C-Level -> Specialized agents
 */

import type {
  AgentRole,
  AgentCategory,
  Message,
  AgentContext,
  ExecutiveContext,
  EnhancedAgentConfig,
  EnhancedAgentResponse,
  OrchestratorResponse,
  BusinessMetrics,
  Decision,
  Alert,
  SuggestedAction,
} from './agent-types'
import { EnhancedBaseAgent } from './enhanced-base-agent'
import { createAgentLogger, getCategoryForAgent } from './agent-logger'
import { getMetricsCollector } from './agent-metrics'

// =============================================================================
// ROUTING CONFIGURATION
// =============================================================================

interface RoutingConfig {
  /** Keywords that trigger this agent */
  keywords: string[]
  /** Minimum confidence for this agent to be selected */
  minConfidence: number
  /** Priority (higher = checked first) */
  priority: number
}

const ROUTING_CONFIG: Record<AgentRole, RoutingConfig> = {
  // Executive Level
  'ceo': {
    keywords: ['estratégia', 'strategy', 'decisão', 'decision', 'prioridade', 'priority', 'visão', 'vision'],
    minConfidence: 0.8,
    priority: 100,
  },
  'cmo': {
    keywords: ['marketing', 'campanha', 'campaign', 'ads', 'conteúdo', 'content', 'social', 'seo'],
    minConfidence: 0.6,
    priority: 90,
  },
  'coo': {
    keywords: ['operação', 'operation', 'processo', 'process', 'produção', 'production', 'sla'],
    minConfidence: 0.6,
    priority: 90,
  },
  'cfo': {
    keywords: ['financeiro', 'financial', 'receita', 'revenue', 'custo', 'cost', 'orçamento', 'budget'],
    minConfidence: 0.6,
    priority: 90,
  },

  // Marketing Level
  'content': {
    keywords: ['post', 'artigo', 'article', 'blog', 'newsletter', 'texto', 'copy'],
    minConfidence: 0.5,
    priority: 70,
  },
  'social': {
    keywords: ['instagram', 'linkedin', 'facebook', 'twitter', 'redes sociais', 'social media', 'publicar'],
    minConfidence: 0.5,
    priority: 70,
  },
  'ads': {
    keywords: ['google ads', 'meta ads', 'facebook ads', 'anúncio', 'campanha paga', 'cpc', 'ctr'],
    minConfidence: 0.5,
    priority: 70,
  },
  'seo': {
    keywords: ['seo', 'ranking', 'google', 'busca', 'search', 'keyword', 'orgânico'],
    minConfidence: 0.5,
    priority: 70,
  },
  'video': {
    keywords: ['vídeo', 'video', 'reels', 'shorts', 'youtube', 'tiktok'],
    minConfidence: 0.5,
    priority: 60,
  },
  'design': {
    keywords: ['design', 'imagem', 'image', 'visual', 'banner', 'thumbnail', 'criativo'],
    minConfidence: 0.5,
    priority: 60,
  },

  // Operations Level
  'qa': {
    keywords: ['qualidade', 'quality', 'revisão', 'review', 'erro', 'error', 'correção', 'oab'],
    minConfidence: 0.5,
    priority: 70,
  },
  'admin': {
    keywords: ['sistema', 'system', 'servidor', 'server', 'backup', 'monitoramento', 'uptime'],
    minConfidence: 0.5,
    priority: 70,
  },
  'triagem': {
    keywords: ['lead', 'qualificação', 'qualification', 'triagem', 'atendimento'],
    minConfidence: 0.5,
    priority: 70,
  },
  'production': {
    keywords: ['documento', 'document', 'petição', 'contrato', 'gerar', 'generate'],
    minConfidence: 0.5,
    priority: 70,
  },

  // Intelligence Level
  'pricing': {
    keywords: ['preço', 'price', 'valor', 'custo', 'desconto', 'discount', 'tabela'],
    minConfidence: 0.5,
    priority: 70,
  },
  'market-intel': {
    keywords: ['mercado', 'market', 'concorrente', 'competitor', 'tendência', 'trend', 'oportunidade'],
    minConfidence: 0.5,
    priority: 70,
  },
  'market_intel': {
    keywords: ['mercado', 'market', 'concorrente', 'competitor', 'tendência', 'trend', 'oportunidade'],
    minConfidence: 0.5,
    priority: 70,
  },

  // Legal Level (existing agents)
  'real-estate': {
    keywords: ['imóvel', 'imovel', 'casa', 'apartamento', 'compra', 'venda', 'usucapião', 'locação'],
    minConfidence: 0.5,
    priority: 80,
  },
  'forensics': {
    keywords: ['assinatura', 'falsificação', 'grafotécnica', 'autenticidade', 'perícia documental'],
    minConfidence: 0.5,
    priority: 80,
  },
  'valuation': {
    keywords: ['avaliação', 'avaliar', 'valor de mercado', 'nbr 14653', 'laudo de avaliação'],
    minConfidence: 0.5,
    priority: 80,
  },
  'medical': {
    keywords: ['médico', 'medico', 'acidente de trabalho', 'lesão', 'erro médico', 'perícia médica'],
    minConfidence: 0.5,
    priority: 80,
  },
  'criminal': {
    keywords: ['criminal', 'penal', 'crime', 'prisão', 'habeas corpus', 'defesa criminal'],
    minConfidence: 0.5,
    priority: 80,
  },
  'financial-protection': {
    keywords: ['conta bloqueada', 'sisbajud', 'penhora', 'golpe do pix', 'negativação', 'serasa'],
    minConfidence: 0.5,
    priority: 80,
  },
  'health-insurance': {
    keywords: ['plano de saúde', 'operadora', 'convenio', 'negativa', 'cobertura', 'bariatrica', 'tea'],
    minConfidence: 0.5,
    priority: 80,
  },
  'social-security': {
    keywords: ['inss', 'aposentadoria', 'bpc', 'loas', 'previdência', 'auxílio-doença'],
    minConfidence: 0.5,
    priority: 80,
  },

  // General fallback
  'general': {
    keywords: [],
    minConfidence: 0.3,
    priority: 0,
  },
}

// =============================================================================
// EXECUTIVE ORCHESTRATOR
// =============================================================================

export class ExecutiveOrchestrator {
  private agents: Map<AgentRole, EnhancedBaseAgent>
  private config: Partial<EnhancedAgentConfig>
  private logger = createAgentLogger('ceo', 'executive')
  private businessMetrics?: BusinessMetrics
  private pendingDecisions: Decision[] = []
  private activeAlerts: Alert[] = []

  constructor(config?: Partial<EnhancedAgentConfig>) {
    this.config = config || {}
    this.agents = new Map()
  }

  /**
   * Register an agent
   */
  registerAgent(role: AgentRole, agent: EnhancedBaseAgent): void {
    this.agents.set(role, agent)
    this.logger.info('register', `Registered agent: ${role}`)
  }

  /**
   * Register multiple agents
   */
  registerAgents(agents: Array<{ role: AgentRole; agent: EnhancedBaseAgent }>): void {
    for (const { role, agent } of agents) {
      this.registerAgent(role, agent)
    }
  }

  /**
   * Update business metrics
   */
  updateMetrics(metrics: BusinessMetrics): void {
    this.businessMetrics = metrics
  }

  /**
   * Add an alert
   */
  addAlert(alert: Omit<Alert, 'id' | 'createdAt'>): void {
    const fullAlert: Alert = {
      ...alert,
      id: `alert_${Date.now()}`,
      createdAt: new Date(),
    }
    this.activeAlerts.push(fullAlert)
    this.logger.warn('alert', alert.title, { priority: alert.priority, category: alert.category })
  }

  /**
   * Resolve an alert
   */
  resolveAlert(alertId: string): void {
    const alert = this.activeAlerts.find(a => a.id === alertId)
    if (alert) {
      alert.resolvedAt = new Date()
      this.logger.info('alert-resolved', `Alert resolved: ${alert.title}`)
    }
  }

  /**
   * Add a pending decision
   */
  addDecision(decision: Omit<Decision, 'id' | 'proposedAt' | 'status'>): void {
    const fullDecision: Decision = {
      ...decision,
      id: `decision_${Date.now()}`,
      proposedAt: new Date(),
      status: 'pending',
    }
    this.pendingDecisions.push(fullDecision)
    this.logger.info('decision-pending', decision.title, { proposedBy: decision.proposedBy })
  }

  // =============================================================================
  // MAIN ROUTING
  // =============================================================================

  /**
   * Process query with intelligent routing
   */
  async process(
    userMessage: string,
    conversationHistory: Message[] = [],
    context?: AgentContext
  ): Promise<OrchestratorResponse> {
    const startTime = Date.now()

    // Select the best agent
    const { role, confidence, alternatives } = this.selectAgent(userMessage)

    this.logger.logRouting('ceo', role, confidence, `Auto-selected based on content analysis`)

    // Get the agent
    const agent = this.agents.get(role)
    if (!agent) {
      // Fallback to general agent
      this.logger.warn('routing', `Agent ${role} not found, falling back to general`)
      const generalAgent = this.agents.get('general')
      if (!generalAgent) {
        throw new Error('No agents registered')
      }
      const response = await generalAgent.chat(userMessage, conversationHistory, context)
      return {
        ...response,
        agentUsed: 'general',
        confidence: 0.3,
        alternativeAgents: alternatives,
      }
    }

    // Build executive context
    const executiveContext: ExecutiveContext = {
      ...context,
      metrics: this.businessMetrics,
      alerts: this.activeAlerts.filter(a => !a.resolvedAt),
      pendingDecisions: this.pendingDecisions.filter(d => d.status === 'pending'),
    }

    // Process with selected agent
    const response = await agent.chat(userMessage, conversationHistory, executiveContext)

    return {
      ...response,
      agentUsed: role,
      alternativeAgents: alternatives,
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

    this.logger.logRouting(agentRole, agentRole, 1.0, 'Manual routing')

    const response = await agent.chat(userMessage, conversationHistory, context)

    return {
      ...response,
      agentUsed: agentRole,
      confidence: 1.0,
    }
  }

  // =============================================================================
  // AGENT SELECTION
  // =============================================================================

  private selectAgent(input: string): {
    role: AgentRole
    confidence: number
    alternatives: Array<{ role: AgentRole; confidence: number; reason: string }>
  } {
    const scores: Array<{ role: AgentRole; score: number; matchedKeywords: string[] }> = []
    const lowerInput = input.toLowerCase()

    // Calculate scores for each agent
    for (const [role, config] of Object.entries(ROUTING_CONFIG)) {
      const matchedKeywords = config.keywords.filter(keyword =>
        lowerInput.includes(keyword.toLowerCase())
      )

      if (matchedKeywords.length > 0 || role === 'general') {
        const baseScore = matchedKeywords.length
        const priorityBonus = config.priority / 100
        const score = baseScore + priorityBonus

        // Only include if agent is registered
        if (this.agents.has(role as AgentRole) || role === 'general') {
          scores.push({
            role: role as AgentRole,
            score,
            matchedKeywords,
          })
        }
      }
    }

    // Sort by score
    scores.sort((a, b) => b.score - a.score)

    // Get top result
    const top = scores[0]
    if (!top || top.score === 0) {
      return {
        role: 'general',
        confidence: 0.3,
        alternatives: [],
      }
    }

    // Calculate confidence based on keyword matches and score difference
    const maxPossibleScore = 5 // Assume max 5 keyword matches is excellent
    const normalizedScore = Math.min(top.score / maxPossibleScore, 1)
    const confidence = 0.3 + (normalizedScore * 0.7)

    // Get alternatives
    const alternatives = scores.slice(1, 4).map(s => ({
      role: s.role,
      confidence: 0.3 + (Math.min(s.score / maxPossibleScore, 1) * 0.7),
      reason: s.matchedKeywords.length > 0
        ? `Matched: ${s.matchedKeywords.join(', ')}`
        : 'Fallback option',
    }))

    return {
      role: top.role,
      confidence,
      alternatives,
    }
  }

  // =============================================================================
  // HELPER METHODS
  // =============================================================================

  /**
   * Get all registered agents
   */
  getRegisteredAgents(): AgentRole[] {
    return Array.from(this.agents.keys())
  }

  /**
   * Get agent by role
   */
  getAgent<T extends EnhancedBaseAgent>(role: AgentRole): T | undefined {
    return this.agents.get(role) as T | undefined
  }

  /**
   * Get suggested agent without processing
   */
  suggestAgent(input: string): { role: AgentRole; confidence: number } {
    const { role, confidence } = this.selectAgent(input)
    return { role, confidence }
  }

  /**
   * Get active alerts
   */
  getActiveAlerts(): Alert[] {
    return this.activeAlerts.filter(a => !a.resolvedAt)
  }

  /**
   * Get pending decisions
   */
  getPendingDecisions(): Decision[] {
    return this.pendingDecisions.filter(d => d.status === 'pending')
  }

  /**
   * Get orchestrator status
   */
  getStatus() {
    const metrics = getMetricsCollector()

    return {
      registeredAgents: this.getRegisteredAgents(),
      agentCount: this.agents.size,
      activeAlerts: this.getActiveAlerts().length,
      pendingDecisions: this.getPendingDecisions().length,
      hasMetrics: !!this.businessMetrics,
      metricsOverview: metrics.getAllSummaries('day'),
    }
  }
}

// =============================================================================
// SINGLETON INSTANCE
// =============================================================================

let orchestratorInstance: ExecutiveOrchestrator | null = null

export function getExecutiveOrchestrator(config?: Partial<EnhancedAgentConfig>): ExecutiveOrchestrator {
  if (!orchestratorInstance) {
    orchestratorInstance = new ExecutiveOrchestrator(config)
  }
  return orchestratorInstance
}

/**
 * Reset orchestrator instance (for testing)
 */
export function resetOrchestrator(): void {
  orchestratorInstance = null
}

// =============================================================================
// QUICK HELPERS
// =============================================================================

/**
 * Quick process query
 */
export async function processExecutiveQuery(
  query: string,
  conversationHistory?: Message[],
  context?: AgentContext
): Promise<OrchestratorResponse> {
  const orchestrator = getExecutiveOrchestrator()
  return orchestrator.process(query, conversationHistory, context)
}
