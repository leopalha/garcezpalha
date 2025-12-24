/**
 * CEO Agent
 * Responsible for strategic orchestration and executive decisions
 */

import { EnhancedBaseAgent } from '../core/enhanced-base-agent'
import type { AgentRole, AgentContext, EnhancedAgentConfig, BusinessMetrics, Decision, Alert } from '../core/agent-types'
import {
  CEO_AGENT_SYSTEM_PROMPT,
  DAILY_BRIEFING_PROMPT,
  STRATEGIC_DECISION_PROMPT,
  RESOURCE_ALLOCATION_PROMPT,
  PRIORITY_MATRIX_PROMPT,
  AGENT_COORDINATION_PROMPT,
  ESCALATION_HANDLING_PROMPT,
  WEEKLY_EXECUTIVE_REPORT_PROMPT,
  MONTHLY_STRATEGIC_REVIEW_PROMPT,
  getApprovalLevel,
  calculatePriorityScore,
  getStrategicKPIs,
  determineEscalationSeverity,
} from '../../prompts/executive/ceo-prompts'

// =============================================================================
// TYPES
// =============================================================================

export interface DailyBriefing {
  date: string
  executiveSummary: string
  keyMetrics: {
    mrr: { value: number; change: number; status: 'on_track' | 'at_risk' | 'behind' }
    newLeads: { value: number; change: number }
    conversions: { value: number; rate: number }
    revenue: { value: number; change: number }
  }
  criticalAlerts: Array<{
    severity: 'critical' | 'high' | 'medium'
    area: string
    message: string
    action: string
    owner: string
  }>
  topPriorities: Array<{
    rank: number
    initiative: string
    status: 'on_track' | 'delayed' | 'blocked'
    nextAction: string
    deadline: string
  }>
  agentPerformance: Array<{
    agent: string
    tasksCompleted: number
    successRate: number
    avgResponseTime: number
    issues: string[]
  }>
  decisionsNeeded: Array<{
    id: string
    type: string
    description: string
    options: string[]
    recommendation: string
    deadline: string
    impact: 'high' | 'medium' | 'low'
  }>
  todaysFocus: Array<{
    area: string
    objective: string
    assignedTo: string
  }>
  risks: Array<{
    risk: string
    probability: 'high' | 'medium' | 'low'
    impact: 'high' | 'medium' | 'low'
    mitigation: string
  }>
}

export interface StrategicDecision {
  decisionContext: {
    title: string
    background: string
    urgency: 'immediate' | 'this_week' | 'this_month'
    impact: 'high' | 'medium' | 'low'
    reversibility: 'easily_reversible' | 'partially_reversible' | 'irreversible'
  }
  options: Array<{
    id: string
    name: string
    description: string
    pros: string[]
    cons: string[]
    estimatedCost: number
    estimatedBenefit: number
    riskLevel: 'high' | 'medium' | 'low'
    timeToImplement: string
    resourcesRequired: string[]
  }>
  analysis: {
    marketFactors: string[]
    internalFactors: string[]
    competitiveImplications: string
    financialImplications: string
  }
  recommendation: {
    chosenOption: string
    rationale: string
    confidence: number
    conditions: string[]
    fallbackPlan: string
  }
  implementation: {
    immediateSteps: string[]
    timeline: string
    successMetrics: string[]
    reviewDate: string
  }
  approvalLevel: 'auto' | 'notify' | 'approve' | 'escalate'
}

export interface ResourceAllocation {
  period: { start: string; end: string }
  totalBudget: number
  currentAllocation: Array<{
    area: string
    budget: number
    spent: number
    roi: number
    efficiency: number
  }>
  recommendedAllocation: Array<{
    area: string
    currentBudget: number
    recommendedBudget: number
    change: number
    changePercent: number
    rationale: string
    expectedROI: number
  }>
  reallocationPlan: Array<{
    from: string
    to: string
    amount: number
    reason: string
    expectedImpact: string
  }>
  priorityRanking: Array<{
    rank: number
    area: string
    priority: 'critical' | 'high' | 'medium' | 'low'
    justification: string
  }>
}

export interface PriorityMatrix {
  evaluationDate: string
  initiatives: Array<{
    id: string
    name: string
    description: string
    owner: string
    scores: {
      impact: number
      effort: number
      urgency: number
      strategicFit: number
      risk: number
    }
    weightedScore: number
    quadrant: 'do_first' | 'schedule' | 'delegate' | 'eliminate'
    timeline: string
    dependencies: string[]
    blockers: string[]
  }>
  priorityOrder: Array<{
    rank: number
    initiativeId: string
    rationale: string
  }>
  recommendations: {
    startImmediately: string[]
    scheduleForNextWeek: string[]
    delegateToTeam: string[]
    deprioritize: string[]
  }
}

export interface AgentCoordination {
  coordinationPlan: {
    objective: string
    timeframe: string
    involvedAgents: string[]
  }
  taskAssignments: Array<{
    taskId: string
    task: string
    assignedAgent: string
    priority: 'critical' | 'high' | 'medium' | 'low'
    deadline: string
    dependencies: Array<{ taskId: string; type: 'blocks' | 'depends_on' | 'related' }>
    expectedOutput: string
    successCriteria: string[]
  }>
  handoffs: Array<{
    fromAgent: string
    toAgent: string
    trigger: string
    data: string[]
    validation: string
  }>
  milestones: Array<{
    name: string
    date: string
    criteria: string[]
    responsibleAgents: string[]
  }>
  escalationRules: Array<{
    condition: string
    action: string
    notify: string[]
  }>
}

export interface EscalationResolution {
  escalation: {
    id: string
    type: 'customer_issue' | 'operational_failure' | 'decision_required' | 'resource_constraint' | 'compliance'
    source: string
    severity: 'critical' | 'high' | 'medium' | 'low'
    receivedAt: string
  }
  resolution: {
    decision: string
    rationale: string
    immediateActions: Array<{ action: string; owner: string; deadline: string }>
    followUpActions: Array<{ action: string; owner: string; deadline: string }>
    communicationPlan: { internal: string; external: string }
  }
  approvalRequired: boolean
  escalateToHuman: boolean
  humanEscalationReason?: string
}

export interface WeeklyExecutiveReport {
  period: { weekNumber: number; start: string; end: string }
  executiveSummary: string
  keyHighlights: Array<{
    type: 'achievement' | 'concern' | 'opportunity'
    description: string
    impact: string
  }>
  financialPerformance: {
    revenue: { actual: number; target: number; variance: number }
    mrr: { current: number; growth: number; target: number }
    expenses: { actual: number; budget: number; variance: number }
    cashPosition: number
    runway: number
  }
  operationalPerformance: {
    leadsGenerated: number
    conversions: number
    casesCompleted: number
    avgResponseTime: number
    customerSatisfaction: number
  }
  marketingPerformance: {
    contentPublished: number
    engagement: number
    websiteTraffic: number
    adSpend: number
    adROI: number
  }
  strategicProgress: Array<{
    initiative: string
    progress: number
    status: 'on_track' | 'delayed' | 'at_risk' | 'completed'
    nextMilestone: string
  }>
  nextWeekPriorities: Array<{
    priority: string
    owner: string
    expectedOutcome: string
  }>
}

export interface MonthlyStrategicReview {
  period: { month: string; year: number }
  executiveSummary: string
  strategicGoalsProgress: Array<{
    goal: string
    target: number
    actual: number
    progress: number
    status: 'exceeded' | 'on_track' | 'behind' | 'at_risk'
    actions: string[]
  }>
  financialReview: {
    monthlyRevenue: number
    mrr: number
    mrrGrowth: number
    grossMargin: number
    netMargin: number
    cashFlow: number
    runway: number
  }
  strategicRecommendations: Array<{
    area: string
    recommendation: string
    rationale: string
    investment: number
    expectedROI: number
    timeline: string
  }>
  nextMonthFocus: Array<{
    priority: number
    focus: string
    objectives: string[]
    resources: string[]
  }>
}

// =============================================================================
// CEO AGENT CLASS
// =============================================================================

export class CEOAgent extends EnhancedBaseAgent {
  constructor(config?: Partial<EnhancedAgentConfig>) {
    super(CEO_AGENT_SYSTEM_PROMPT, 'ceo', {
      timeout: 120000,
      ...config,
    })
  }

  get name(): string {
    return 'CEO Agent'
  }

  get role(): AgentRole {
    return 'ceo'
  }

  isRelevant(input: string): boolean {
    const keywords = [
      'estratégia', 'strategy', 'decisão', 'decision', 'prioridade', 'priority',
      'visão', 'vision', 'meta', 'goal', 'objetivo', 'objective',
      'coordenar', 'coordinate', 'alocar', 'allocate', 'recurso', 'resource',
      'briefing', 'relatório executivo', 'executive report', 'escalação',
    ]
    const lowerInput = input.toLowerCase()
    return keywords.some(keyword => lowerInput.includes(keyword))
  }

  protected shouldRequireApproval(content: string): boolean {
    const sensitivePatterns = [
      'escalat',
      'aprovaç',
      'decisão estratégica',
      'alocação de',
      'orçamento',
      'investimento',
    ]
    const lowerContent = content.toLowerCase()
    return sensitivePatterns.some(pattern => lowerContent.includes(pattern))
  }

  // ===========================================================================
  // DAILY OPERATIONS
  // ===========================================================================

  /**
   * Generate daily executive briefing
   */
  async generateDailyBriefing(
    metrics: BusinessMetrics,
    alerts: Alert[],
    pendingDecisions: Decision[],
    agentStats?: Array<{ agent: string; tasksCompleted: number; successRate: number }>,
    context?: AgentContext
  ): Promise<DailyBriefing> {
    const prompt = `
${DAILY_BRIEFING_PROMPT}

DATA: ${new Date().toISOString().split('T')[0]}

MÉTRICAS ATUAIS:
- MRR: €${metrics.mrr}
- Leads diários: ${metrics.dailyLeads}
- Taxa de conversão: ${(metrics.conversionRate * 100).toFixed(1)}%
- Ticket médio: €${metrics.averageTicket}
- CAC: €${metrics.cac}
- Gastos marketing: €${metrics.marketingSpend}

ALERTAS ATIVOS (${alerts.length}):
${alerts.map(a => `- [${a.priority.toUpperCase()}] ${a.title}: ${a.message}`).join('\n') || 'Nenhum alerta ativo'}

DECISÕES PENDENTES (${pendingDecisions.length}):
${pendingDecisions.map(d => `- ${d.title} (${d.type}, impacto ${d.impact})`).join('\n') || 'Nenhuma decisão pendente'}

${agentStats ? `
PERFORMANCE DOS AGENTES:
${agentStats.map(s => `- ${s.agent}: ${s.tasksCompleted} tarefas, ${(s.successRate * 100).toFixed(0)}% sucesso`).join('\n')}
` : ''}

Gere o briefing executivo diário no formato JSON especificado.
`

    const response = await this.processStructured<DailyBriefing>(prompt, context)
    return response
  }

  /**
   * Make strategic decision
   */
  async makeStrategicDecision(
    title: string,
    background: string,
    options: Array<{
      name: string
      description: string
      estimatedCost: number
      estimatedBenefit: number
    }>,
    urgency: 'immediate' | 'this_week' | 'this_month' = 'this_week',
    context?: AgentContext
  ): Promise<StrategicDecision> {
    const prompt = `
${STRATEGIC_DECISION_PROMPT}

DECISÃO: ${title}
CONTEXTO: ${background}
URGÊNCIA: ${urgency}

OPÇÕES:
${options.map((o, i) => `
${i + 1}. ${o.name}
   Descrição: ${o.description}
   Custo estimado: €${o.estimatedCost}
   Benefício estimado: €${o.estimatedBenefit}
`).join('\n')}

Analise e recomende a melhor decisão no formato JSON especificado.
`

    const response = await this.processStructured<StrategicDecision>(prompt, context)
    return response
  }

  /**
   * Optimize resource allocation
   */
  async optimizeResourceAllocation(
    totalBudget: number,
    currentAllocation: Array<{
      area: string
      budget: number
      spent: number
      roi?: number
    }>,
    period: { start: string; end: string },
    context?: AgentContext
  ): Promise<ResourceAllocation> {
    const prompt = `
${RESOURCE_ALLOCATION_PROMPT}

ORÇAMENTO TOTAL: €${totalBudget}
PERÍODO: ${period.start} a ${period.end}

ALOCAÇÃO ATUAL:
${currentAllocation.map(a =>
  `- ${a.area}: €${a.budget} orçado, €${a.spent} gasto${a.roi ? `, ROI ${(a.roi * 100).toFixed(0)}%` : ''}`
).join('\n')}

Otimize a alocação de recursos no formato JSON especificado.
`

    const response = await this.processStructured<ResourceAllocation>(prompt, context)
    return response
  }

  /**
   * Create priority matrix for initiatives
   */
  async createPriorityMatrix(
    initiatives: Array<{
      id: string
      name: string
      description: string
      owner: string
      estimatedImpact: number
      estimatedEffort: number
      urgency: number
      strategicFit: number
    }>,
    context?: AgentContext
  ): Promise<PriorityMatrix> {
    const prompt = `
${PRIORITY_MATRIX_PROMPT}

DATA: ${new Date().toISOString().split('T')[0]}

INICIATIVAS A PRIORIZAR:
${initiatives.map(i => `
- ${i.name} (ID: ${i.id})
  Descrição: ${i.description}
  Owner: ${i.owner}
  Impacto: ${i.estimatedImpact}/10
  Esforço: ${i.estimatedEffort}/10
  Urgência: ${i.urgency}/10
  Fit estratégico: ${i.strategicFit}/10
`).join('\n')}

Crie a matriz de priorização no formato JSON especificado.
`

    const response = await this.processStructured<PriorityMatrix>(prompt, context)
    return response
  }

  // ===========================================================================
  // AGENT COORDINATION
  // ===========================================================================

  /**
   * Coordinate activities between agents
   */
  async coordinateAgents(
    objective: string,
    involvedAgents: string[],
    tasks: Array<{
      task: string
      suggestedAgent: string
      priority: 'critical' | 'high' | 'medium' | 'low'
    }>,
    timeframe: string,
    context?: AgentContext
  ): Promise<AgentCoordination> {
    const prompt = `
${AGENT_COORDINATION_PROMPT}

OBJETIVO: ${objective}
PRAZO: ${timeframe}
AGENTES ENVOLVIDOS: ${involvedAgents.join(', ')}

TAREFAS A COORDENAR:
${tasks.map((t, i) => `${i + 1}. ${t.task} (${t.suggestedAgent}, ${t.priority})`).join('\n')}

Crie o plano de coordenação no formato JSON especificado.
`

    const response = await this.processStructured<AgentCoordination>(prompt, context)
    return response
  }

  /**
   * Handle escalation
   */
  async handleEscalation(
    escalationType: 'customer_issue' | 'operational_failure' | 'decision_required' | 'resource_constraint' | 'compliance',
    source: string,
    summary: string,
    history: string[],
    financialImpact?: number,
    customersAffected?: number,
    context?: AgentContext
  ): Promise<EscalationResolution> {
    const severity = determineEscalationSeverity(
      financialImpact || 0,
      customersAffected || 0,
      24 // default time to resolve
    )

    const prompt = `
${ESCALATION_HANDLING_PROMPT}

TIPO DE ESCALAÇÃO: ${escalationType}
ORIGEM: ${source}
SEVERIDADE: ${severity}
RECEBIDO: ${new Date().toISOString()}

RESUMO:
${summary}

HISTÓRICO:
${history.map((h, i) => `${i + 1}. ${h}`).join('\n')}

${financialImpact ? `IMPACTO FINANCEIRO: €${financialImpact}` : ''}
${customersAffected ? `CLIENTES AFETADOS: ${customersAffected}` : ''}

Processe a escalação e determine a ação no formato JSON especificado.
`

    const response = await this.processStructured<EscalationResolution>(prompt, context)
    return response
  }

  // ===========================================================================
  // REPORTING
  // ===========================================================================

  /**
   * Generate weekly executive report
   */
  async generateWeeklyReport(
    weekNumber: number,
    weekStart: string,
    weekEnd: string,
    financialData: {
      revenue: number
      revenueTarget: number
      mrr: number
      mrrGrowth: number
      expenses: number
      expensesBudget: number
      cashPosition: number
    },
    operationalData: {
      leadsGenerated: number
      conversions: number
      casesCompleted: number
      avgResponseTime: number
      nps?: number
    },
    marketingData: {
      contentPublished: number
      engagement: number
      websiteTraffic: number
      adSpend: number
      adROI: number
    },
    context?: AgentContext
  ): Promise<WeeklyExecutiveReport> {
    const prompt = `
${WEEKLY_EXECUTIVE_REPORT_PROMPT}

SEMANA: ${weekNumber} (${weekStart} a ${weekEnd})

PERFORMANCE FINANCEIRA:
- Receita: €${financialData.revenue} (meta €${financialData.revenueTarget})
- MRR: €${financialData.mrr} (${financialData.mrrGrowth > 0 ? '+' : ''}${(financialData.mrrGrowth * 100).toFixed(1)}%)
- Despesas: €${financialData.expenses} (orçamento €${financialData.expensesBudget})
- Posição de caixa: €${financialData.cashPosition}

PERFORMANCE OPERACIONAL:
- Leads gerados: ${operationalData.leadsGenerated}
- Conversões: ${operationalData.conversions}
- Casos concluídos: ${operationalData.casesCompleted}
- Tempo médio resposta: ${operationalData.avgResponseTime}min
${operationalData.nps ? `- NPS: ${operationalData.nps}` : ''}

PERFORMANCE MARKETING:
- Conteúdos publicados: ${marketingData.contentPublished}
- Engajamento: ${marketingData.engagement}
- Tráfego website: ${marketingData.websiteTraffic}
- Gastos ads: €${marketingData.adSpend}
- ROI ads: ${(marketingData.adROI * 100).toFixed(0)}%

Gere o relatório executivo semanal no formato JSON especificado.
`

    const response = await this.processStructured<WeeklyExecutiveReport>(prompt, context)
    return response
  }

  /**
   * Generate monthly strategic review
   */
  async generateMonthlyReview(
    month: string,
    year: number,
    financialData: {
      revenue: number
      mrr: number
      mrrGrowth: number
      grossMargin: number
      netMargin: number
      cashFlow: number
      runway: number
    },
    strategicGoals: Array<{
      goal: string
      target: number
      actual: number
    }>,
    context?: AgentContext
  ): Promise<MonthlyStrategicReview> {
    const prompt = `
${MONTHLY_STRATEGIC_REVIEW_PROMPT}

PERÍODO: ${month}/${year}

DADOS FINANCEIROS:
- Receita mensal: €${financialData.revenue}
- MRR: €${financialData.mrr} (${financialData.mrrGrowth > 0 ? '+' : ''}${(financialData.mrrGrowth * 100).toFixed(1)}%)
- Margem bruta: ${(financialData.grossMargin * 100).toFixed(1)}%
- Margem líquida: ${(financialData.netMargin * 100).toFixed(1)}%
- Cash flow: €${financialData.cashFlow}
- Runway: ${financialData.runway} meses

METAS ESTRATÉGICAS:
${strategicGoals.map(g =>
  `- ${g.goal}: ${g.actual}/${g.target} (${((g.actual / g.target) * 100).toFixed(0)}%)`
).join('\n')}

Gere a revisão estratégica mensal no formato JSON especificado.
`

    const response = await this.processStructured<MonthlyStrategicReview>(prompt, context)
    return response
  }

  // ===========================================================================
  // HELPER METHODS
  // ===========================================================================

  getApprovalLevel(
    financialImpact: number,
    riskLevel: 'high' | 'medium' | 'low',
    reversibility: 'easily_reversible' | 'partially_reversible' | 'irreversible'
  ) {
    return getApprovalLevel(financialImpact, riskLevel, reversibility)
  }

  calculatePriorityScore(impact: number, effort: number, urgency: number, strategicFit: number) {
    return calculatePriorityScore(impact, effort, urgency, strategicFit)
  }

  getStrategicKPIs() {
    return getStrategicKPIs()
  }

  determineEscalationSeverity(financialImpact: number, customersAffected: number, timeToResolve: number) {
    return determineEscalationSeverity(financialImpact, customersAffected, timeToResolve)
  }
}

// =============================================================================
// FACTORY FUNCTION
// =============================================================================

export function createCEOAgent(config?: Partial<EnhancedAgentConfig>): CEOAgent {
  return new CEOAgent(config)
}

let ceoAgentInstance: CEOAgent | null = null

export function getCEOAgent(): CEOAgent {
  if (!ceoAgentInstance) {
    ceoAgentInstance = createCEOAgent()
  }
  return ceoAgentInstance
}

// =============================================================================
// EXPORTS
// =============================================================================

export { getApprovalLevel, calculatePriorityScore, getStrategicKPIs, determineEscalationSeverity }
