/**
 * CMO Agent
 * Responsible for marketing strategy and coordination
 */

import { EnhancedBaseAgent } from '../core/enhanced-base-agent'
import type { AgentRole, AgentContext, EnhancedAgentConfig } from '../core/agent-types'
import {
  CMO_AGENT_SYSTEM_PROMPT,
  MARKETING_STRATEGY_PROMPT,
  BUDGET_ALLOCATION_PROMPT,
  CONTENT_CALENDAR_COORDINATION_PROMPT,
  CAMPAIGN_COORDINATION_PROMPT,
  CHANNEL_PERFORMANCE_PROMPT,
  MARKETING_ROI_PROMPT,
  WEEKLY_MARKETING_REPORT_PROMPT,
  calculateChannelEfficiency,
  getChannelsByObjective,
  getRecommendedContentMix,
} from '../../prompts/executive/cmo-prompts'

// =============================================================================
// TYPES
// =============================================================================

export interface MarketingStrategy {
  period: { start: string; end: string }
  objectives: Array<{
    objective: string
    metric: string
    target: number
    baseline: number
  }>
  targetAudience: Array<{
    segment: string
    description: string
    size: number
    priority: 'primary' | 'secondary' | 'tertiary'
    channels: string[]
    messaging: string
  }>
  channelStrategy: Array<{
    channel: string
    role: 'awareness' | 'consideration' | 'conversion' | 'retention'
    budget: number
    budgetPercent: number
    kpis: Array<{ metric: string; target: number }>
    tactics: string[]
  }>
  contentPillars: Array<{
    pillar: string
    topics: string[]
    formats: string[]
    frequency: string
  }>
  campaigns: Array<{
    name: string
    objective: string
    startDate: string
    endDate: string
    budget: number
    channels: string[]
    targetAudience: string
    expectedResults: { leads: number; conversions: number; roi: number }
  }>
  budgetAllocation: {
    total: number
    byChannel: Array<{ channel: string; amount: number; percent: number }>
    byObjective: Array<{ objective: string; amount: number }>
  }
}

export interface BudgetAllocation {
  totalBudget: number
  period: { start: string; end: string }
  currentPerformance: Array<{
    channel: string
    spend: number
    leads: number
    conversions: number
    revenue: number
    cpl: number
    cac: number
    roas: number
  }>
  recommendation: {
    allocation: Array<{
      channel: string
      currentBudget: number
      recommendedBudget: number
      change: number
      changePercent: number
      rationale: string
      expectedLeads: number
      expectedROAS: number
    }>
    newChannels: Array<{
      channel: string
      recommendedBudget: number
      rationale: string
      expectedResults: string
    }>
    discontinue: Array<{
      channel: string
      currentBudget: number
      reason: string
    }>
  }
  projectedResults: {
    totalLeads: number
    totalConversions: number
    totalRevenue: number
    overallROAS: number
    avgCPL: number
    avgCAC: number
  }
}

export interface ContentCalendarCoordination {
  period: { month: string; year: number }
  theme: string
  goals: string[]
  weeks: Array<{
    weekNumber: number
    focus: string
    content: Array<{
      day: string
      channel: string
      type: string
      topic: string
      responsibleAgent: string
      status: 'planned' | 'in_progress' | 'ready' | 'published'
      dependencies: string[]
    }>
  }>
  agentAssignments: Array<{
    agent: string
    tasks: number
    contentTypes: string[]
    deadline: string
  }>
}

export interface CampaignCoordination {
  campaign: {
    name: string
    objective: string
    startDate: string
    endDate: string
    budget: number
  }
  phases: Array<{
    phase: 'teaser' | 'launch' | 'sustain' | 'close'
    startDate: string
    endDate: string
    activities: Array<{
      activity: string
      channel: string
      responsibleAgent: string
      deadline: string
      deliverables: string[]
      dependencies: string[]
    }>
  }>
  agentTasks: Array<{
    agent: string
    tasks: Array<{
      task: string
      deadline: string
      priority: 'critical' | 'high' | 'medium' | 'low'
    }>
  }>
  monitoring: {
    kpis: Array<{ metric: string; target: number }>
    checkpoints: string[]
    escalationTriggers: string[]
  }
}

export interface ChannelPerformance {
  period: { start: string; end: string }
  summary: {
    totalSpend: number
    totalLeads: number
    totalConversions: number
    totalRevenue: number
    overallROAS: number
    avgCPL: number
    avgCAC: number
  }
  byChannel: Array<{
    channel: string
    metrics: {
      spend: number
      impressions: number
      clicks: number
      ctr: number
      leads: number
      conversions: number
      revenue: number
      cpl: number
      cac: number
      roas: number
      ltv: number
      ltvCacRatio: number
    }
    trend: 'improving' | 'stable' | 'declining'
    insights: string[]
    recommendations: string[]
  }>
  recommendations: Array<{
    priority: 'high' | 'medium' | 'low'
    recommendation: string
    expectedImpact: string
  }>
}

export interface MarketingROI {
  period: { start: string; end: string }
  overview: {
    totalInvestment: number
    totalRevenue: number
    grossROI: number
    netROI: number
    paybackPeriod: string
  }
  byChannel: Array<{
    channel: string
    investment: number
    revenue: number
    roi: number
    efficiency: 'high' | 'medium' | 'low'
    recommendation: 'increase' | 'maintain' | 'decrease' | 'stop'
  }>
  customerAcquisition: {
    totalNewCustomers: number
    avgCAC: number
    avgLTV: number
    ltvCacRatio: number
    breakEvenPoint: string
  }
  optimization: Array<{
    opportunity: string
    currentState: string
    proposedAction: string
    expectedImprovement: string
  }>
}

export interface WeeklyMarketingReport {
  period: { weekNumber: number; start: string; end: string }
  executiveSummary: string
  keyMetrics: {
    spend: { value: number; vsBudget: number }
    leads: { value: number; vsTarget: number }
    cpl: { value: number; vsTarget: number }
    conversions: { value: number; rate: number }
    roas: { value: number; vsTarget: number }
  }
  channelPerformance: Array<{
    channel: string
    spend: number
    leads: number
    trend: 'up' | 'stable' | 'down'
  }>
  contentPerformance: {
    published: number
    topPosts: Array<{
      platform: string
      engagement: number
      reach: number
    }>
    insights: string[]
  }
  nextWeekPriorities: string[]
}

// =============================================================================
// CMO AGENT CLASS
// =============================================================================

export class CMOAgent extends EnhancedBaseAgent {
  constructor(config?: Partial<EnhancedAgentConfig>) {
    super(CMO_AGENT_SYSTEM_PROMPT, 'cmo', {
      timeout: 120000,
      ...config,
    })
  }

  get name(): string {
    return 'CMO Agent'
  }

  get role(): AgentRole {
    return 'cmo'
  }

  isRelevant(input: string): boolean {
    const keywords = [
      'marketing', 'campanha', 'campaign', 'ads', 'conteúdo', 'content',
      'social', 'seo', 'branding', 'brand', 'roas', 'cpl', 'cac',
      'lead', 'conversão', 'awareness', 'engagement', 'orçamento marketing',
    ]
    const lowerInput = input.toLowerCase()
    return keywords.some(keyword => lowerInput.includes(keyword))
  }

  // ===========================================================================
  // STRATEGY
  // ===========================================================================

  /**
   * Develop integrated marketing strategy
   */
  async developMarketingStrategy(
    period: { start: string; end: string },
    totalBudget: number,
    objectives: Array<{ objective: string; metric: string; target: number }>,
    targetAudiences?: string[],
    context?: AgentContext
  ): Promise<MarketingStrategy> {
    const prompt = `
${MARKETING_STRATEGY_PROMPT}

PERÍODO: ${period.start} a ${period.end}
ORÇAMENTO TOTAL: €${totalBudget}

OBJETIVOS:
${objectives.map(o => `- ${o.objective}: ${o.metric} = ${o.target}`).join('\n')}

${targetAudiences ? `
PÚBLICOS-ALVO:
${targetAudiences.map(a => `- ${a}`).join('\n')}
` : ''}

Desenvolva estratégia de marketing integrada no formato JSON especificado.
`

    const response = await this.processStructured<MarketingStrategy>(prompt, context)
    return response
  }

  /**
   * Optimize budget allocation across channels
   */
  async optimizeBudgetAllocation(
    totalBudget: number,
    period: { start: string; end: string },
    channelPerformance: Array<{
      channel: string
      spend: number
      leads: number
      conversions: number
      revenue: number
    }>,
    context?: AgentContext
  ): Promise<BudgetAllocation> {
    const enrichedPerformance = channelPerformance.map(cp => ({
      ...cp,
      cpl: cp.leads > 0 ? cp.spend / cp.leads : 0,
      cac: cp.conversions > 0 ? cp.spend / cp.conversions : 0,
      roas: cp.spend > 0 ? cp.revenue / cp.spend : 0,
    }))

    const prompt = `
${BUDGET_ALLOCATION_PROMPT}

ORÇAMENTO TOTAL: €${totalBudget}
PERÍODO: ${period.start} a ${period.end}

PERFORMANCE POR CANAL:
${enrichedPerformance.map(cp => `
- ${cp.channel}:
  Gasto: €${cp.spend}
  Leads: ${cp.leads}
  Conversões: ${cp.conversions}
  Receita: €${cp.revenue}
  CPL: €${cp.cpl.toFixed(2)}
  CAC: €${cp.cac.toFixed(2)}
  ROAS: ${cp.roas.toFixed(2)}x
`).join('\n')}

Otimize a alocação de budget no formato JSON especificado.
`

    const response = await this.processStructured<BudgetAllocation>(prompt, context)
    return response
  }

  // ===========================================================================
  // COORDINATION
  // ===========================================================================

  /**
   * Coordinate content calendar across channels
   */
  async coordinateContentCalendar(
    month: string,
    year: number,
    theme: string,
    goals: string[],
    context?: AgentContext
  ): Promise<ContentCalendarCoordination> {
    const contentMix = getRecommendedContentMix()

    const prompt = `
${CONTENT_CALENDAR_COORDINATION_PROMPT}

MÊS: ${month}/${year}
TEMA: ${theme}
OBJETIVOS:
${goals.map(g => `- ${g}`).join('\n')}

MIX DE CONTEÚDO RECOMENDADO:
${contentMix.map(c => `- ${c.type}: ${c.percent}% (${c.channels.join(', ')})`).join('\n')}

Coordene o calendário de conteúdo no formato JSON especificado.
`

    const response = await this.processStructured<ContentCalendarCoordination>(prompt, context)
    return response
  }

  /**
   * Coordinate campaign launch across agents
   */
  async coordinateCampaign(
    campaignName: string,
    objective: string,
    startDate: string,
    endDate: string,
    budget: number,
    channels: string[],
    context?: AgentContext
  ): Promise<CampaignCoordination> {
    const prompt = `
${CAMPAIGN_COORDINATION_PROMPT}

CAMPANHA: ${campaignName}
OBJETIVO: ${objective}
PERÍODO: ${startDate} a ${endDate}
ORÇAMENTO: €${budget}
CANAIS: ${channels.join(', ')}

Coordene o lançamento da campanha no formato JSON especificado.
`

    const response = await this.processStructured<CampaignCoordination>(prompt, context)
    return response
  }

  // ===========================================================================
  // ANALYSIS
  // ===========================================================================

  /**
   * Analyze channel performance
   */
  async analyzeChannelPerformance(
    period: { start: string; end: string },
    channelData: Array<{
      channel: string
      spend: number
      impressions: number
      clicks: number
      leads: number
      conversions: number
      revenue: number
    }>,
    context?: AgentContext
  ): Promise<ChannelPerformance> {
    const prompt = `
${CHANNEL_PERFORMANCE_PROMPT}

PERÍODO: ${period.start} a ${period.end}

DADOS POR CANAL:
${channelData.map(c => `
- ${c.channel}:
  Gasto: €${c.spend}
  Impressões: ${c.impressions}
  Cliques: ${c.clicks}
  CTR: ${c.impressions > 0 ? ((c.clicks / c.impressions) * 100).toFixed(2) : 0}%
  Leads: ${c.leads}
  Conversões: ${c.conversions}
  Receita: €${c.revenue}
`).join('\n')}

Analise a performance por canal no formato JSON especificado.
`

    const response = await this.processStructured<ChannelPerformance>(prompt, context)
    return response
  }

  /**
   * Analyze marketing ROI
   */
  async analyzeMarketingROI(
    period: { start: string; end: string },
    investment: number,
    revenue: number,
    channelBreakdown: Array<{
      channel: string
      investment: number
      revenue: number
    }>,
    newCustomers: number,
    avgLTV?: number,
    context?: AgentContext
  ): Promise<MarketingROI> {
    const prompt = `
${MARKETING_ROI_PROMPT}

PERÍODO: ${period.start} a ${period.end}

RESUMO:
- Investimento total: €${investment}
- Receita total: €${revenue}
- ROI bruto: ${((revenue / investment - 1) * 100).toFixed(1)}%
- Novos clientes: ${newCustomers}
${avgLTV ? `- LTV médio: €${avgLTV}` : ''}

POR CANAL:
${channelBreakdown.map(c => `
- ${c.channel}: €${c.investment} investido, €${c.revenue} receita, ROI ${((c.revenue / c.investment - 1) * 100).toFixed(1)}%
`).join('\n')}

Analise o ROI de marketing no formato JSON especificado.
`

    const response = await this.processStructured<MarketingROI>(prompt, context)
    return response
  }

  // ===========================================================================
  // REPORTING
  // ===========================================================================

  /**
   * Generate weekly marketing report
   */
  async generateWeeklyReport(
    weekNumber: number,
    weekStart: string,
    weekEnd: string,
    metrics: {
      spend: number
      spendBudget: number
      leads: number
      leadsTarget: number
      conversions: number
      cpl: number
      cplTarget: number
      roas: number
      roasTarget: number
    },
    channelData: Array<{
      channel: string
      spend: number
      leads: number
    }>,
    contentData: {
      published: number
      topPosts: Array<{ platform: string; engagement: number; reach: number }>
    },
    context?: AgentContext
  ): Promise<WeeklyMarketingReport> {
    const prompt = `
${WEEKLY_MARKETING_REPORT_PROMPT}

SEMANA: ${weekNumber} (${weekStart} a ${weekEnd})

MÉTRICAS:
- Gasto: €${metrics.spend} (orçamento €${metrics.spendBudget})
- Leads: ${metrics.leads} (meta ${metrics.leadsTarget})
- CPL: €${metrics.cpl} (meta €${metrics.cplTarget})
- Conversões: ${metrics.conversions}
- ROAS: ${metrics.roas}x (meta ${metrics.roasTarget}x)

PERFORMANCE POR CANAL:
${channelData.map(c => `- ${c.channel}: €${c.spend} gasto, ${c.leads} leads`).join('\n')}

CONTEÚDO:
- Publicados: ${contentData.published}
- Top posts:
${contentData.topPosts.map(p => `  - ${p.platform}: ${p.engagement} engajamento, ${p.reach} alcance`).join('\n')}

Gere o relatório de marketing semanal no formato JSON especificado.
`

    const response = await this.processStructured<WeeklyMarketingReport>(prompt, context)
    return response
  }

  // ===========================================================================
  // HELPER METHODS
  // ===========================================================================

  calculateChannelEfficiency(metrics: {
    cpl: number
    cac: number
    roas: number
    ltvCacRatio: number
  }) {
    return calculateChannelEfficiency(metrics)
  }

  getChannelsByObjective(objective: 'awareness' | 'consideration' | 'conversion' | 'retention') {
    return getChannelsByObjective(objective)
  }

  getRecommendedContentMix() {
    return getRecommendedContentMix()
  }
}

// =============================================================================
// FACTORY FUNCTION
// =============================================================================

export function createCMOAgent(config?: Partial<EnhancedAgentConfig>): CMOAgent {
  return new CMOAgent(config)
}

let cmoAgentInstance: CMOAgent | null = null

export function getCMOAgent(): CMOAgent {
  if (!cmoAgentInstance) {
    cmoAgentInstance = createCMOAgent()
  }
  return cmoAgentInstance
}

// =============================================================================
// EXPORTS
// =============================================================================

export { calculateChannelEfficiency, getChannelsByObjective, getRecommendedContentMix }
