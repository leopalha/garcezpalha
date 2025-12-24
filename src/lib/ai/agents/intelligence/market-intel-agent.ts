/**
 * Market Intelligence Agent
 * Responsible for market research, competitive analysis, and trend detection
 */

import { EnhancedBaseAgent } from '../core/enhanced-base-agent'
import type { AgentRole, AgentContext, EnhancedAgentConfig } from '../core/agent-types'
import {
  MARKET_INTEL_AGENT_SYSTEM_PROMPT,
  MARKET_OVERVIEW_PROMPT,
  COMPETITIVE_ANALYSIS_PROMPT,
  TREND_ANALYSIS_PROMPT,
  NICHE_ANALYSIS_PROMPT,
  OPPORTUNITY_SCANNER_PROMPT,
  BENCHMARKING_PROMPT,
  WEEKLY_INTEL_REPORT_PROMPT,
  QUARTERLY_MARKET_REPORT_PROMPT,
  getPortugalEconomicIndicators,
  getMarketSegments,
  getIntelSources,
  calculateMarketAttractiveness,
} from '../../prompts/intelligence/market-intel-prompts'

// =============================================================================
// TYPES
// =============================================================================

export interface MarketOverview {
  period: { start: string; end: string }
  marketSize: {
    totalValue: number
    growth: number
    segments: Array<{
      name: string
      value: number
      growth: number
      share: number
    }>
  }
  keyPlayers: Array<{
    name: string
    type: 'large_firm' | 'boutique' | 'solo' | 'big_four'
    marketShare: number
    specialties: string[]
    recentActivity: string
  }>
  demandIndicators: Array<{
    indicator: string
    value: number
    trend: 'increasing' | 'stable' | 'decreasing'
    implication: string
  }>
  supplyIndicators: {
    totalLawyers: number
    newAdmissions: number
    firmDensity: number
    avgRatesChange: number
  }
  economicFactors: Array<{
    factor: string
    impact: 'positive' | 'negative' | 'neutral'
    affectedAreas: string[]
    outlook: string
  }>
  opportunities: Array<{
    opportunity: string
    potential: 'high' | 'medium' | 'low'
    timeframe: string
    requiredAction: string
  }>
  threats: Array<{
    threat: string
    severity: 'high' | 'medium' | 'low'
    probability: number
    mitigation: string
  }>
  outlook: {
    shortTerm: string
    mediumTerm: string
    longTerm: string
  }
}

export interface CompetitiveAnalysis {
  analysisDate: string
  ourPosition: {
    strengths: string[]
    weaknesses: string[]
    marketPosition: 'leader' | 'challenger' | 'follower' | 'nicher'
    uniqueSellingPoints: string[]
  }
  competitors: Array<{
    name: string
    type: 'direct' | 'indirect' | 'potential'
    size: 'large' | 'medium' | 'small'
    profile: {
      founded: number
      headcount: number
      offices: string[]
      specialties: string[]
    }
    strategy: {
      positioning: string
      targetMarket: string
      pricingStrategy: 'premium' | 'value' | 'budget'
      growthStrategy: string
    }
    onlinePresence: {
      website: { quality: number; seo: number }
      socialMedia: { platforms: string[]; engagement: number }
      contentStrategy: string
      reviews: { avgRating: number; count: number }
    }
    strengths: string[]
    weaknesses: string[]
    recentMoves: string[]
    threatLevel: 'high' | 'medium' | 'low'
  }>
  competitiveMap: {
    axes: { x: string; y: string }
    positions: Array<{ competitor: string; x: number; y: number }>
    whiteSpaces: string[]
  }
  battleCards: Array<{
    competitor: string
    whenToCompete: string[]
    whenToAvoid: string[]
    ourAdvantages: string[]
    theirAdvantages: string[]
    neutralizeScript: string
  }>
  recommendations: Array<{
    area: string
    action: string
    priority: 'high' | 'medium' | 'low'
    expectedOutcome: string
  }>
}

export interface TrendAnalysis {
  analysisDate: string
  macroTrends: Array<{
    trend: string
    category: 'technology' | 'regulation' | 'social' | 'economic' | 'demographic'
    status: 'emerging' | 'growing' | 'mature' | 'declining'
    timeframe: string
    impact: {
      magnitude: 'high' | 'medium' | 'low'
      areas: string[]
      description: string
    }
    opportunities: string[]
    threats: string[]
  }>
  industryTrends: Array<{
    trend: string
    relevantAreas: string[]
    adoptionRate: number
    leaders: string[]
    barriers: string[]
    ourPosition: 'ahead' | 'on_par' | 'behind'
  }>
  clientBehaviorTrends: Array<{
    trend: string
    segment: string
    driver: string
    implication: string
    adaptationNeeded: string
  }>
  regulatoryTrends: Array<{
    development: string
    expectedDate: string
    impact: string
    preparationNeeded: string
  }>
  technologyTrends: Array<{
    technology: string
    maturity: 'nascent' | 'emerging' | 'mainstream' | 'commoditized'
    relevanceToLaw: 'high' | 'medium' | 'low'
    adoptionRecommendation: string
    investmentLevel: 'high' | 'medium' | 'low' | 'none'
  }>
  trendImpactMatrix: Array<{
    trend: string
    probability: number
    impact: number
    urgency: 'immediate' | 'short_term' | 'medium_term' | 'long_term'
    response: string
  }>
  strategicImplications: {
    serviceOffering: string[]
    targetMarket: string[]
    capabilities: string[]
    investments: string[]
  }
}

export interface NicheAnalysis {
  analysisDate: string
  evaluatedNiches: Array<{
    niche: string
    description: string
    marketSize: {
      current: number
      projected: number
      cagr: number
    }
    characteristics: {
      complexity: 'low' | 'medium' | 'high'
      profitability: 'low' | 'medium' | 'high'
      competition: 'low' | 'medium' | 'high'
      barrierToEntry: 'low' | 'medium' | 'high'
    }
    targetClients: {
      profile: string
      estimatedNumber: number
      avgCaseValue: number
      acquisitionChannels: string[]
    }
    requiredCapabilities: {
      expertise: string[]
      technology: string[]
      partnerships: string[]
      certifications: string[]
    }
    competitiveAnalysis: {
      existingPlayers: number
      mainCompetitors: string[]
      ourAdvantage: string
    }
    financialProjection: {
      investmentNeeded: number
      timeToBreakeven: number
      yearOneRevenue: number
      yearThreeRevenue: number
      margin: number
    }
    risks: Array<{
      risk: string
      probability: 'high' | 'medium' | 'low'
      impact: 'high' | 'medium' | 'low'
      mitigation: string
    }>
    score: number
    recommendation: 'pursue' | 'monitor' | 'avoid'
  }>
  prioritization: Array<{
    rank: number
    niche: string
    rationale: string
    nextSteps: string[]
  }>
}

export interface OpportunityScanner {
  scanDate: string
  opportunities: Array<{
    id: string
    type: 'regulatory_change' | 'market_event' | 'competitor_move' | 'technology' | 'economic' | 'client_need'
    title: string
    description: string
    source: string
    urgency: 'immediate' | 'short_term' | 'medium_term'
    relevantAreas: string[]
    potentialRevenue: {
      estimate: number
      confidence: 'high' | 'medium' | 'low'
    }
    actionRequired: {
      actions: string[]
      resources: string[]
      timeline: string
      investment: number
    }
    risks: string[]
    score: number
  }>
  immediateActions: Array<{
    opportunity: string
    action: string
    owner: string
    deadline: string
  }>
  watchList: Array<{
    item: string
    trigger: string
    potentialAction: string
  }>
  missedOpportunities: Array<{
    opportunity: string
    reason: string
    lesson: string
  }>
}

export interface Benchmarking {
  period: { start: string; end: string }
  benchmarkGroup: {
    description: string
    firms: string[]
    selectionCriteria: string
  }
  financialMetrics: Array<{
    metric: string
    ourValue: number
    marketAvg: number
    topQuartile: number
    ourPosition: 'top' | 'above_avg' | 'average' | 'below_avg' | 'bottom'
    gap: number
    improvement: string
  }>
  operationalMetrics: Array<{
    metric: string
    ourValue: number
    marketAvg: number
    topQuartile: number
    ourPosition: 'top' | 'above_avg' | 'average' | 'below_avg' | 'bottom'
  }>
  marketingMetrics: Array<{
    metric: string
    ourValue: number
    marketAvg: number
    topQuartile: number
    ourPosition: 'top' | 'above_avg' | 'average' | 'below_avg' | 'bottom'
  }>
  clientMetrics: Array<{
    metric: string
    ourValue: number
    marketAvg: number
    topQuartile: number
  }>
  gapAnalysis: Array<{
    area: string
    currentGap: number
    targetGap: number
    priority: 'high' | 'medium' | 'low'
    actionPlan: string
  }>
  bestPractices: Array<{
    practice: string
    source: string
    benefit: string
    applicability: 'high' | 'medium' | 'low'
    implementation: string
  }>
  recommendations: Array<{
    area: string
    recommendation: string
    expectedImprovement: string
    effort: 'low' | 'medium' | 'high'
  }>
}

export interface WeeklyIntelReport {
  period: { weekNumber: number; start: string; end: string }
  executiveSummary: string
  marketPulse: {
    sentiment: 'bullish' | 'neutral' | 'bearish'
    keyDevelopments: string[]
    marketMoverEvents: Array<{
      event: string
      impact: string
      ourAction: string
    }>
  }
  competitorWatch: Array<{
    competitor: string
    activity: string
    significance: 'high' | 'medium' | 'low'
    ourResponse: string
  }>
  opportunityAlerts: Array<{
    opportunity: string
    source: string
    urgency: 'high' | 'medium' | 'low'
    recommendedAction: string
  }>
  regulatoryUpdates: Array<{
    update: string
    area: string
    effectiveDate: string
    impact: string
  }>
  economicIndicators: Array<{
    indicator: string
    value: number
    change: number
    relevance: string
  }>
  mediaMonitoring: {
    mentions: Array<{
      outlet: string
      headline: string
      sentiment: 'positive' | 'neutral' | 'negative'
    }>
    competitorMentions: Array<{
      competitor: string
      mentions: number
      notable: string
    }>
  }
  nextWeekOutlook: {
    eventsToWatch: string[]
    anticipatedOpportunities: string[]
    potentialThreats: string[]
  }
}

export interface QuarterlyMarketReport {
  period: { quarter: number; year: number }
  executiveSummary: string
  marketPerformance: {
    overallGrowth: number
    sectorPerformance: Array<{
      sector: string
      growth: number
      outlook: string
    }>
    demandTrends: string[]
  }
  competitiveLandscape: {
    majorMoves: Array<{
      firm: string
      move: string
      impact: string
    }>
    marketShareChanges: Array<{
      firm: string
      change: number
    }>
    newEntrants: string[]
    exits: string[]
  }
  clientInsights: {
    behaviorChanges: string[]
    emergingNeeds: string[]
    satisfactionTrends: string
  }
  technologyAdoption: {
    adoptionRates: Array<{
      technology: string
      adoption: number
      trend: 'accelerating' | 'stable' | 'slowing'
    }>
    emergingTools: string[]
  }
  regulatoryEnvironment: {
    majorChanges: string[]
    upcomingChanges: string[]
    compliance: string
  }
  strategicRecommendations: Array<{
    area: string
    recommendation: string
    priority: 'high' | 'medium' | 'low'
    timeline: string
  }>
  outlook: {
    nextQuarter: string
    year: string
    keyRisks: string[]
    keyOpportunities: string[]
  }
}

// =============================================================================
// MARKET INTEL AGENT CLASS
// =============================================================================

export class MarketIntelAgent extends EnhancedBaseAgent {
  constructor(config?: Partial<EnhancedAgentConfig>) {
    super(MARKET_INTEL_AGENT_SYSTEM_PROMPT, 'market_intel', {
      timeout: 120000, // Market analysis can take longer
      ...config,
    })
  }

  get name(): string {
    return 'Market Intel Agent'
  }

  get role(): AgentRole {
    return 'market_intel'
  }

  isRelevant(input: string): boolean {
    const keywords = [
      'mercado', 'market', 'concorrência', 'competitor', 'tendência', 'trend',
      'benchmark', 'análise', 'oportunidade', 'nicho', 'segmento',
      'inteligência', 'intelligence', 'pesquisa', 'research',
      'competidor', 'setor', 'indústria', 'demanda',
    ]
    const lowerInput = input.toLowerCase()
    return keywords.some(keyword => lowerInput.includes(keyword))
  }

  // ===========================================================================
  // MARKET ANALYSIS
  // ===========================================================================

  /**
   * Generate market overview
   */
  async generateMarketOverview(
    marketArea: string,
    period: { start: string; end: string },
    context?: AgentContext
  ): Promise<MarketOverview> {
    const indicators = getPortugalEconomicIndicators()
    const segments = getMarketSegments()

    const prompt = `
${MARKET_OVERVIEW_PROMPT}

ÁREA DE MERCADO: ${marketArea}
PERÍODO: ${period.start} a ${period.end}

INDICADORES ECONÓMICOS RELEVANTES:
${indicators.map(i => `- ${i.indicator}: ${i.relevance}`).join('\n')}

SEGMENTOS DE MERCADO:
${segments.map(s => `- ${s.segment}: ${s.description} (${s.growthOutlook})`).join('\n')}

Gere uma visão geral completa do mercado no formato JSON especificado.
`

    const response = await this.processStructured<MarketOverview>(prompt, context)
    return response
  }

  /**
   * Analyze competitors
   */
  async analyzeCompetitors(
    competitors: Array<{
      name: string
      services: string[]
      website?: string
    }>,
    ourStrengths: string[],
    ourWeaknesses: string[],
    context?: AgentContext
  ): Promise<CompetitiveAnalysis> {
    const prompt = `
${COMPETITIVE_ANALYSIS_PROMPT}

NOSSOS PONTOS FORTES:
${ourStrengths.map(s => `- ${s}`).join('\n')}

NOSSOS PONTOS FRACOS:
${ourWeaknesses.map(w => `- ${w}`).join('\n')}

CONCORRENTES A ANALISAR:
${competitors.map(c => `
- ${c.name}
  Serviços: ${c.services.join(', ')}
  ${c.website ? `Website: ${c.website}` : ''}
`).join('\n')}

Analise a concorrência detalhadamente no formato JSON especificado.
`

    const response = await this.processStructured<CompetitiveAnalysis>(prompt, context)
    return response
  }

  /**
   * Analyze market trends
   */
  async analyzeTrends(
    legalAreas: string[],
    timeHorizon: 'short' | 'medium' | 'long' = 'medium',
    context?: AgentContext
  ): Promise<TrendAnalysis> {
    const prompt = `
${TREND_ANALYSIS_PROMPT}

ÁREAS JURÍDICAS DE FOCO:
${legalAreas.map(a => `- ${a}`).join('\n')}

HORIZONTE TEMPORAL: ${
  timeHorizon === 'short' ? '6 meses' :
  timeHorizon === 'medium' ? '1-2 anos' :
  '3-5 anos'
}

Identifique e analise tendências de mercado no formato JSON especificado.
`

    const response = await this.processStructured<TrendAnalysis>(prompt, context)
    return response
  }

  // ===========================================================================
  // OPPORTUNITY IDENTIFICATION
  // ===========================================================================

  /**
   * Analyze potential niches
   */
  async analyzeNiches(
    potentialNiches: string[],
    currentCapabilities: string[],
    investmentBudget: number,
    context?: AgentContext
  ): Promise<NicheAnalysis> {
    const prompt = `
${NICHE_ANALYSIS_PROMPT}

NICHOS A AVALIAR:
${potentialNiches.map(n => `- ${n}`).join('\n')}

CAPACIDADES ATUAIS:
${currentCapabilities.map(c => `- ${c}`).join('\n')}

ORÇAMENTO DE INVESTIMENTO: €${investmentBudget}

Analise os potenciais nichos de mercado no formato JSON especificado.
`

    const response = await this.processStructured<NicheAnalysis>(prompt, context)
    return response
  }

  /**
   * Scan for current opportunities
   */
  async scanOpportunities(
    legalAreas: string[],
    recentEvents?: string[],
    context?: AgentContext
  ): Promise<OpportunityScanner> {
    const sources = getIntelSources()

    const prompt = `
${OPPORTUNITY_SCANNER_PROMPT}

ÁREAS DE INTERESSE:
${legalAreas.map(a => `- ${a}`).join('\n')}

${recentEvents ? `
EVENTOS RECENTES:
${recentEvents.map(e => `- ${e}`).join('\n')}
` : ''}

FONTES DE INTELIGÊNCIA:
${sources.map(s => `- ${s.source} (${s.type}, ${s.frequency})`).join('\n')}

DATA DO SCAN: ${new Date().toISOString().split('T')[0]}

Identifique oportunidades de mercado atuais no formato JSON especificado.
`

    const response = await this.processStructured<OpportunityScanner>(prompt, context)
    return response
  }

  // ===========================================================================
  // BENCHMARKING
  // ===========================================================================

  /**
   * Benchmark against market
   */
  async benchmarkPerformance(
    ourMetrics: {
      financial: Array<{ metric: string; value: number }>
      operational: Array<{ metric: string; value: number }>
      marketing: Array<{ metric: string; value: number }>
      client: Array<{ metric: string; value: number }>
    },
    benchmarkGroup: string,
    period: { start: string; end: string },
    context?: AgentContext
  ): Promise<Benchmarking> {
    const prompt = `
${BENCHMARKING_PROMPT}

PERÍODO: ${period.start} a ${period.end}
GRUPO DE BENCHMARK: ${benchmarkGroup}

NOSSAS MÉTRICAS FINANCEIRAS:
${ourMetrics.financial.map(m => `- ${m.metric}: ${m.value}`).join('\n')}

NOSSAS MÉTRICAS OPERACIONAIS:
${ourMetrics.operational.map(m => `- ${m.metric}: ${m.value}`).join('\n')}

NOSSAS MÉTRICAS DE MARKETING:
${ourMetrics.marketing.map(m => `- ${m.metric}: ${m.value}`).join('\n')}

NOSSAS MÉTRICAS DE CLIENTE:
${ourMetrics.client.map(m => `- ${m.metric}: ${m.value}`).join('\n')}

Compare nossa performance com o mercado no formato JSON especificado.
`

    const response = await this.processStructured<Benchmarking>(prompt, context)
    return response
  }

  // ===========================================================================
  // REPORTING
  // ===========================================================================

  /**
   * Generate weekly intel report
   */
  async generateWeeklyReport(
    weekNumber: number,
    weekStart: string,
    weekEnd: string,
    events?: string[],
    competitorActivities?: Array<{ competitor: string; activity: string }>,
    context?: AgentContext
  ): Promise<WeeklyIntelReport> {
    const prompt = `
${WEEKLY_INTEL_REPORT_PROMPT}

SEMANA: ${weekNumber} (${weekStart} a ${weekEnd})

${events ? `
EVENTOS DA SEMANA:
${events.map(e => `- ${e}`).join('\n')}
` : ''}

${competitorActivities ? `
ATIVIDADE DE CONCORRENTES:
${competitorActivities.map(a => `- ${a.competitor}: ${a.activity}`).join('\n')}
` : ''}

Gere relatório semanal de inteligência de mercado no formato JSON especificado.
`

    const response = await this.processStructured<WeeklyIntelReport>(prompt, context)
    return response
  }

  /**
   * Generate quarterly market report
   */
  async generateQuarterlyReport(
    quarter: number,
    year: number,
    marketData: {
      growth?: number
      majorEvents?: string[]
      competitorMoves?: Array<{ firm: string; move: string }>
    },
    context?: AgentContext
  ): Promise<QuarterlyMarketReport> {
    const prompt = `
${QUARTERLY_MARKET_REPORT_PROMPT}

PERÍODO: Q${quarter} ${year}

${marketData.growth ? `CRESCIMENTO DO MERCADO: ${(marketData.growth * 100).toFixed(1)}%` : ''}

${marketData.majorEvents ? `
EVENTOS IMPORTANTES:
${marketData.majorEvents.map(e => `- ${e}`).join('\n')}
` : ''}

${marketData.competitorMoves ? `
MOVIMENTOS DE CONCORRENTES:
${marketData.competitorMoves.map(m => `- ${m.firm}: ${m.move}`).join('\n')}
` : ''}

Gere relatório trimestral de mercado no formato JSON especificado.
`

    const response = await this.processStructured<QuarterlyMarketReport>(prompt, context)
    return response
  }

  // ===========================================================================
  // HELPER METHODS
  // ===========================================================================

  /**
   * Get Portugal economic indicators
   */
  getEconomicIndicators() {
    return getPortugalEconomicIndicators()
  }

  /**
   * Get market segments
   */
  getMarketSegments() {
    return getMarketSegments()
  }

  /**
   * Get intelligence sources
   */
  getIntelSources() {
    return getIntelSources()
  }

  /**
   * Calculate market attractiveness score
   */
  calculateMarketAttractiveness(factors: {
    size: number
    growth: number
    profitability: number
    competition: number
    barrierToEntry: number
    ourFit: number
  }) {
    return calculateMarketAttractiveness(factors)
  }
}

// =============================================================================
// FACTORY FUNCTION
// =============================================================================

/**
 * Create a new Market Intel Agent instance
 */
export function createMarketIntelAgent(config?: Partial<EnhancedAgentConfig>): MarketIntelAgent {
  return new MarketIntelAgent(config)
}

// Singleton instance
let marketIntelAgentInstance: MarketIntelAgent | null = null

/**
 * Get singleton Market Intel Agent instance
 */
export function getMarketIntelAgent(): MarketIntelAgent {
  if (!marketIntelAgentInstance) {
    marketIntelAgentInstance = createMarketIntelAgent()
  }
  return marketIntelAgentInstance
}

// =============================================================================
// EXPORTS
// =============================================================================

export {
  getPortugalEconomicIndicators,
  getMarketSegments,
  getIntelSources,
  calculateMarketAttractiveness,
}
