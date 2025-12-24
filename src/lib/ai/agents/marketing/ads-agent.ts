/**
 * Ads Agent
 * Responsible for paid advertising campaign management (Google Ads, Meta Ads)
 */

import { EnhancedBaseAgent } from '../core/enhanced-base-agent'
import type { AgentRole, AgentContext, EnhancedAgentConfig } from '../core/agent-types'
import {
  ADS_AGENT_SYSTEM_PROMPT,
  GOOGLE_ADS_CAMPAIGN_PROMPT,
  META_ADS_CAMPAIGN_PROMPT,
  CAMPAIGN_OPTIMIZATION_PROMPT,
  KEYWORD_ANALYSIS_PROMPT,
  AD_COPY_OPTIMIZATION_PROMPT,
  AUDIENCE_ANALYSIS_PROMPT,
  BUDGET_ALLOCATION_PROMPT,
  WEEKLY_ADS_REPORT_PROMPT,
  LEAD_QUALITY_ANALYSIS_PROMPT,
  getLegalAdsBenchmarks,
  getRecommendedKeywords,
  getNegativeKeywords,
  getAdCharacterLimits,
} from '../../prompts/marketing/ads-prompts'

// =============================================================================
// TYPES
// =============================================================================

export type AdPlatform = 'google' | 'meta'
export type CampaignObjective = 'leads' | 'traffic' | 'awareness' | 'engagement'
export type MatchType = 'exact' | 'phrase' | 'broad'
export type BidStrategy = 'lowest_cost' | 'cost_cap' | 'bid_cap'

export interface GoogleAdsCampaign {
  campaignName: string
  objective: CampaignObjective
  budget: { daily: number; monthly: number }
  targeting: {
    locations: string[]
    languages: string[]
    devices: ('all' | 'mobile' | 'desktop')[]
  }
  adGroups: Array<{
    name: string
    keywords: Array<{ keyword: string; matchType: MatchType }>
    negativeKeywords: string[]
    ads: Array<{
      headlines: string[]
      descriptions: string[]
      finalUrl: string
      displayPath: string[]
    }>
  }>
  extensions: {
    sitelinks: Array<{ text: string; url: string }>
    callouts: string[]
    structuredSnippets: { header: string; values: string[] }
    callExtension: string
  }
  expectedMetrics: {
    estimatedCPC: number
    estimatedCTR: number
    estimatedConversionRate: number
  }
}

export interface MetaAdsCampaign {
  campaignName: string
  objective: CampaignObjective
  budget: { daily: number; monthly: number }
  adSets: Array<{
    name: string
    targeting: {
      ageRange: { min: number; max: number }
      genders: ('all' | 'male' | 'female')[]
      locations: Array<{
        type: 'city' | 'region'
        name: string
        radius?: number
      }>
      interests: string[]
      behaviors: string[]
      customAudiences: string[]
      lookalike?: { source: string; percentage: number }
    }
    placements: ('feed' | 'stories' | 'reels' | 'messenger' | 'automatic')[]
    ads: Array<{
      name: string
      format: 'image' | 'video' | 'carousel' | 'collection'
      primaryText: string
      headline: string
      description: string
      callToAction: 'LEARN_MORE' | 'CONTACT_US' | 'GET_QUOTE' | 'SEND_MESSAGE'
      visualGuidelines: string
      landingPage: string
    }>
  }>
  optimization: {
    bidStrategy: BidStrategy
    targetCPA?: number
    conversionWindow: '1_day' | '7_day'
  }
  expectedMetrics: {
    estimatedCPM: number
    estimatedCTR: number
    estimatedCPL: number
  }
}

export interface CampaignOptimization {
  overallScore: number
  healthStatus: 'excellent' | 'good' | 'needs_attention' | 'critical'
  keyFindings: Array<{
    type: 'issue' | 'opportunity'
    severity: 'high' | 'medium' | 'low'
    description: string
    metric: string
    currentValue: number
    benchmarkValue: number
  }>
  recommendations: Array<{
    priority: number
    action: string
    rationale: string
    expectedImpact: { metric: string; improvement: string }
    effort: 'low' | 'medium' | 'high'
    implementation: string[]
  }>
  budgetRecommendations: {
    currentSpend: number
    recommendedSpend: number
    reallocation: Array<{
      from: string
      to: string
      amount: number
      reason: string
    }>
  }
  nextReviewDate: string
}

export interface KeywordAnalysis {
  summary: {
    totalKeywords: number
    performingWell: number
    needsAttention: number
    toRemove: number
  }
  keywordAnalysis: Array<{
    keyword: string
    matchType: string
    impressions: number
    clicks: number
    ctr: number
    cpc: number
    conversions: number
    conversionRate: number
    qualityScore: number
    status: 'keep' | 'optimize' | 'pause' | 'remove'
    recommendation: string
  }>
  newKeywords: Array<{
    keyword: string
    matchType: MatchType
    rationale: string
    estimatedVolume: number
    estimatedCPC: number
  }>
  negativeKeywords: Array<{
    keyword: string
    level: 'campaign' | 'adgroup'
    reason: string
  }>
  matchTypeChanges: Array<{
    keyword: string
    currentMatchType: string
    suggestedMatchType: string
    reason: string
  }>
}

export interface AudienceAnalysis {
  demographicPerformance: Array<{
    segment: string
    impressions: number
    conversions: number
    conversionRate: number
    cpl: number
    recommendation: 'increase' | 'maintain' | 'decrease' | 'exclude'
  }>
  interestPerformance: Array<{
    interest: string
    relevanceScore: number
    conversions: number
    cpl: number
    recommendation: string
  }>
  expansionOpportunities: Array<{
    audienceType: 'interest' | 'lookalike' | 'custom'
    description: string
    estimatedReach: number
    expectedCPL: number
    priority: 'high' | 'medium' | 'low'
  }>
  exclusions: Array<{
    segment: string
    reason: string
    expectedSavings: number
  }>
  remarketing: {
    segments: Array<{
      name: string
      definition: string
      estimatedSize: number
      strategy: string
    }>
    recommendations: string[]
  }
}

export interface BudgetAllocation {
  totalBudget: number
  currentAllocation: Array<{
    campaign: string
    platform: AdPlatform
    budget: number
    percentage: number
    roas: number
    cpl: number
  }>
  recommendedAllocation: Array<{
    campaign: string
    currentBudget: number
    recommendedBudget: number
    change: number
    changePercent: number
    rationale: string
    expectedImpact: string
  }>
  newCampaignsBudget: Array<{
    proposedCampaign: string
    suggestedBudget: number
    expectedROAS: number
    rationale: string
  }>
  scalingOpportunities: Array<{
    campaign: string
    currentSpend: number
    headroom: number
    confidence: 'high' | 'medium' | 'low'
    constraints: string[]
  }>
  seasonalAdjustments: Array<{
    period: string
    recommendation: 'increase' | 'decrease' | 'maintain'
    adjustment: number
    reason: string
  }>
}

export interface WeeklyAdsReport {
  period: { start: string; end: string }
  executiveSummary: string
  overallMetrics: {
    totalSpend: number
    totalImpressions: number
    totalClicks: number
    totalConversions: number
    averageCPC: number
    averageCPL: number
    overallROAS: number
    weekOverWeek: {
      spend: number
      conversions: number
      cpl: number
    }
  }
  platformBreakdown: Array<{
    platform: AdPlatform
    spend: number
    conversions: number
    cpl: number
    roas: number
    highlights: string[]
    concerns: string[]
  }>
  topPerformers: Array<{
    type: 'campaign' | 'adgroup' | 'ad' | 'keyword'
    name: string
    metric: string
    value: number
    insight: string
  }>
  areasOfConcern: Array<{
    issue: string
    impact: string
    recommendedAction: string
  }>
  actionsThisWeek: Array<{
    action: string
    result: string
  }>
  plannedActions: Array<{
    action: string
    priority: 'high' | 'medium' | 'low'
    expectedImpact: string
  }>
}

export interface LeadQualityAnalysis {
  period: { start: string; end: string }
  totalLeads: number
  qualityDistribution: {
    highQuality: { count: number; percentage: number }
    mediumQuality: { count: number; percentage: number }
    lowQuality: { count: number; percentage: number }
  }
  bySource: Array<{
    source: string
    campaign: string
    leads: number
    qualityScore: number
    conversionToClient: number
    averageValue: number
    recommendation: string
  }>
  qualityFactors: Array<{
    factor: string
    correlation: 'positive' | 'negative'
    strength: 'strong' | 'moderate' | 'weak'
    actionable: boolean
    recommendation: string
  }>
  improvements: Array<{
    area: string
    currentState: string
    recommendation: string
    expectedImprovement: string
  }>
  landingPageInsights: Array<{
    page: string
    bounceRate: number
    conversionRate: number
    qualityScore: number
    recommendations: string[]
  }>
}

export interface CampaignPerformanceData {
  campaignName: string
  platform: AdPlatform
  spend: number
  impressions: number
  clicks: number
  conversions: number
  cpc: number
  cpl: number
  ctr: number
  conversionRate: number
  roas?: number
}

// =============================================================================
// ADS AGENT CLASS
// =============================================================================

export class AdsAgent extends EnhancedBaseAgent {
  constructor(config?: Partial<EnhancedAgentConfig>) {
    super(ADS_AGENT_SYSTEM_PROMPT, 'ads', {
      timeout: 90000,
      ...config,
    })
  }

  get name(): string {
    return 'Ads Agent'
  }

  get role(): AgentRole {
    return 'ads'
  }

  isRelevant(input: string): boolean {
    const keywords = [
      'ads', 'anúncio', 'anuncio', 'campanha', 'campaign',
      'google ads', 'meta ads', 'facebook ads', 'instagram ads',
      'publicidade', 'pago', 'paid', 'ppc', 'cpc', 'cpl',
      'orçamento', 'budget', 'roi', 'roas', 'conversão',
      'keyword', 'palavra-chave', 'segmentação', 'targeting',
    ]
    const lowerInput = input.toLowerCase()
    return keywords.some(keyword => lowerInput.includes(keyword))
  }

  // ===========================================================================
  // CAMPAIGN CREATION
  // ===========================================================================

  /**
   * Create a Google Ads campaign
   */
  async createGoogleAdsCampaign(
    legalArea: string,
    objective: CampaignObjective = 'leads',
    budget: { daily: number; monthly: number },
    context?: AgentContext
  ): Promise<GoogleAdsCampaign> {
    const benchmarks = getLegalAdsBenchmarks(legalArea)
    const recommendedKeywords = getRecommendedKeywords(legalArea)
    const negativeKeywords = getNegativeKeywords()

    const prompt = `
${GOOGLE_ADS_CAMPAIGN_PROMPT}

ÁREA JURÍDICA: ${legalArea}
OBJETIVO: ${objective}
ORÇAMENTO: €${budget.daily}/dia (€${budget.monthly}/mês)

BENCHMARKS DO SETOR:
- CPC médio: €${benchmarks.averageCPC}
- CPL médio: €${benchmarks.averageCPL}
- CTR esperado: ${benchmarks.averageCTR}%
- Taxa de conversão: ${benchmarks.conversionRate}%

KEYWORDS RECOMENDADAS:
${recommendedKeywords.join(', ')}

NEGATIVE KEYWORDS BASE:
${negativeKeywords.join(', ')}

Crie uma campanha Google Ads completa no formato JSON especificado.
`

    const response = await this.processStructured<GoogleAdsCampaign>(prompt, context)
    return response
  }

  /**
   * Create a Meta Ads campaign
   */
  async createMetaAdsCampaign(
    legalArea: string,
    objective: CampaignObjective = 'leads',
    budget: { daily: number; monthly: number },
    context?: AgentContext
  ): Promise<MetaAdsCampaign> {
    const benchmarks = getLegalAdsBenchmarks(legalArea)

    const prompt = `
${META_ADS_CAMPAIGN_PROMPT}

ÁREA JURÍDICA: ${legalArea}
OBJETIVO: ${objective}
ORÇAMENTO: €${budget.daily}/dia (€${budget.monthly}/mês)

BENCHMARKS DO SETOR:
- CPL médio: €${benchmarks.averageCPL}
- CTR esperado: ${benchmarks.averageCTR}%
- Taxa de conversão: ${benchmarks.conversionRate}%

LOCALIZAÇÃO: Lisboa e região (50km)
IDIOMA: Português

Crie uma campanha Meta Ads completa no formato JSON especificado.
`

    const response = await this.processStructured<MetaAdsCampaign>(prompt, context)
    return response
  }

  // ===========================================================================
  // CAMPAIGN OPTIMIZATION
  // ===========================================================================

  /**
   * Analyze and optimize campaign performance
   */
  async optimizeCampaign(
    performanceData: CampaignPerformanceData,
    legalArea: string,
    context?: AgentContext
  ): Promise<CampaignOptimization> {
    const benchmarks = getLegalAdsBenchmarks(legalArea)

    const prompt = `
${CAMPAIGN_OPTIMIZATION_PROMPT}

DADOS DA CAMPANHA:
- Nome: ${performanceData.campaignName}
- Plataforma: ${performanceData.platform}
- Gasto: €${performanceData.spend}
- Impressões: ${performanceData.impressions}
- Cliques: ${performanceData.clicks}
- Conversões: ${performanceData.conversions}
- CPC: €${performanceData.cpc}
- CPL: €${performanceData.cpl}
- CTR: ${performanceData.ctr}%
- Taxa de Conversão: ${performanceData.conversionRate}%
${performanceData.roas ? `- ROAS: ${performanceData.roas}x` : ''}

BENCHMARKS (${legalArea}):
- CPC benchmark: €${benchmarks.averageCPC}
- CPL benchmark: €${benchmarks.averageCPL}
- CTR benchmark: ${benchmarks.averageCTR}%
- Conversão benchmark: ${benchmarks.conversionRate}%

Analise e forneça recomendações no formato JSON especificado.
`

    const response = await this.processStructured<CampaignOptimization>(prompt, context)
    return response
  }

  /**
   * Analyze keywords performance
   */
  async analyzeKeywords(
    keywords: Array<{
      keyword: string
      matchType: string
      impressions: number
      clicks: number
      conversions: number
      cpc: number
      qualityScore?: number
    }>,
    legalArea: string,
    context?: AgentContext
  ): Promise<KeywordAnalysis> {
    const recommendedKeywords = getRecommendedKeywords(legalArea)
    const negativeKeywords = getNegativeKeywords()

    const keywordsList = keywords.map(k => `
- "${k.keyword}" [${k.matchType}]
  Impressões: ${k.impressions} | Cliques: ${k.clicks} | Conversões: ${k.conversions}
  CPC: €${k.cpc} | QS: ${k.qualityScore || 'N/A'}
`).join('')

    const prompt = `
${KEYWORD_ANALYSIS_PROMPT}

KEYWORDS ATUAIS:
${keywordsList}

ÁREA JURÍDICA: ${legalArea}

KEYWORDS RECOMENDADAS PARA A ÁREA:
${recommendedKeywords.join(', ')}

NEGATIVE KEYWORDS SUGERIDAS:
${negativeKeywords.join(', ')}

Analise as keywords no formato JSON especificado.
`

    const response = await this.processStructured<KeywordAnalysis>(prompt, context)
    return response
  }

  /**
   * Optimize ad copy
   */
  async optimizeAdCopy(
    ads: Array<{
      id: string
      headline: string
      description: string
      ctr: number
      conversionRate: number
      qualityScore?: number
    }>,
    legalArea: string,
    platform: AdPlatform,
    context?: AgentContext
  ): Promise<{
    currentAdsAnalysis: Array<{
      adId: string
      headline: string
      description: string
      ctr: number
      conversionRate: number
      qualityScore: number
      status: 'top_performer' | 'average' | 'underperforming'
      insights: string[]
    }>
    newAds: Array<{
      platform: AdPlatform
      headlines: string[]
      descriptions: string[]
      rationale: string
      testingPlan: string
    }>
    bestPractices: Array<{
      practice: string
      currentStatus: 'applied' | 'missing' | 'partial'
      recommendation: string
    }>
  }> {
    const limits = getAdCharacterLimits(platform)

    const adsList = ads.map(a => `
[${a.id}]
Headline: "${a.headline}"
Description: "${a.description}"
CTR: ${a.ctr}% | Conversão: ${a.conversionRate}% | QS: ${a.qualityScore || 'N/A'}
`).join('')

    const prompt = `
${AD_COPY_OPTIMIZATION_PROMPT}

PLATAFORMA: ${platform}
ÁREA JURÍDICA: ${legalArea}

LIMITES DE CARACTERES:
- Headline: ${limits.headline} caracteres
- Description: ${limits.description} caracteres

ANÚNCIOS ATUAIS:
${adsList}

Analise e sugira novos anúncios no formato JSON especificado.
`

    const response = await this.processStructured<{
      currentAdsAnalysis: Array<{
        adId: string
        headline: string
        description: string
        ctr: number
        conversionRate: number
        qualityScore: number
        status: 'top_performer' | 'average' | 'underperforming'
        insights: string[]
      }>
      newAds: Array<{
        platform: AdPlatform
        headlines: string[]
        descriptions: string[]
        rationale: string
        testingPlan: string
      }>
      bestPractices: Array<{
        practice: string
        currentStatus: 'applied' | 'missing' | 'partial'
        recommendation: string
      }>
    }>(prompt, context)

    return response
  }

  // ===========================================================================
  // AUDIENCE MANAGEMENT
  // ===========================================================================

  /**
   * Analyze audience performance
   */
  async analyzeAudience(
    audienceData: {
      demographics: Array<{
        segment: string
        impressions: number
        conversions: number
        cpl: number
      }>
      interests: Array<{
        interest: string
        conversions: number
        cpl: number
      }>
    },
    context?: AgentContext
  ): Promise<AudienceAnalysis> {
    const demographicsInfo = audienceData.demographics
      .map(d => `- ${d.segment}: ${d.impressions} imp | ${d.conversions} conv | €${d.cpl} CPL`)
      .join('\n')

    const interestsInfo = audienceData.interests
      .map(i => `- ${i.interest}: ${i.conversions} conv | €${i.cpl} CPL`)
      .join('\n')

    const prompt = `
${AUDIENCE_ANALYSIS_PROMPT}

PERFORMANCE DEMOGRÁFICA:
${demographicsInfo}

PERFORMANCE POR INTERESSE:
${interestsInfo}

Analise o público no formato JSON especificado.
`

    const response = await this.processStructured<AudienceAnalysis>(prompt, context)
    return response
  }

  // ===========================================================================
  // BUDGET MANAGEMENT
  // ===========================================================================

  /**
   * Optimize budget allocation
   */
  async optimizeBudget(
    campaigns: Array<{
      name: string
      platform: AdPlatform
      budget: number
      spend: number
      conversions: number
      roas?: number
    }>,
    totalBudget: number,
    context?: AgentContext
  ): Promise<BudgetAllocation> {
    const campaignsList = campaigns
      .map(c => `
- ${c.name} (${c.platform})
  Orçamento: €${c.budget} | Gasto: €${c.spend}
  Conversões: ${c.conversions} | ROAS: ${c.roas || 'N/A'}
`).join('')

    const prompt = `
${BUDGET_ALLOCATION_PROMPT}

ORÇAMENTO TOTAL: €${totalBudget}/mês

CAMPANHAS ATUAIS:
${campaignsList}

Otimize a alocação de orçamento no formato JSON especificado.
`

    const response = await this.processStructured<BudgetAllocation>(prompt, context)
    return response
  }

  // ===========================================================================
  // REPORTING
  // ===========================================================================

  /**
   * Generate weekly ads report
   */
  async generateWeeklyReport(
    data: {
      campaigns: CampaignPerformanceData[]
      previousWeek: {
        spend: number
        conversions: number
        cpl: number
      }
      actionsThisWeek?: Array<{ action: string; result: string }>
    },
    context?: AgentContext
  ): Promise<WeeklyAdsReport> {
    const campaignsSummary = data.campaigns
      .map(c => `
- ${c.campaignName} (${c.platform})
  Gasto: €${c.spend} | Conversões: ${c.conversions} | CPL: €${c.cpl}
  CTR: ${c.ctr}% | CPC: €${c.cpc}
`).join('')

    const totalSpend = data.campaigns.reduce((sum, c) => sum + c.spend, 0)
    const totalConversions = data.campaigns.reduce((sum, c) => sum + c.conversions, 0)

    const prompt = `
${WEEKLY_ADS_REPORT_PROMPT}

PERÍODO: ${new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} a ${new Date().toISOString().split('T')[0]}

RESUMO GERAL:
- Gasto total: €${totalSpend}
- Conversões totais: ${totalConversions}
- CPL médio: €${totalConversions > 0 ? (totalSpend / totalConversions).toFixed(2) : 'N/A'}

SEMANA ANTERIOR:
- Gasto: €${data.previousWeek.spend}
- Conversões: ${data.previousWeek.conversions}
- CPL: €${data.previousWeek.cpl}

CAMPANHAS:
${campaignsSummary}

${data.actionsThisWeek ? `
AÇÕES ESTA SEMANA:
${data.actionsThisWeek.map(a => `- ${a.action}: ${a.result}`).join('\n')}
` : ''}

Gere o relatório semanal no formato JSON especificado.
`

    const response = await this.processStructured<WeeklyAdsReport>(prompt, context)
    return response
  }

  /**
   * Analyze lead quality from ads
   */
  async analyzeLeadQuality(
    leads: Array<{
      source: string
      campaign: string
      count: number
      qualityScore: number
      convertedToClient: number
      averageValue?: number
    }>,
    landingPages?: Array<{
      url: string
      bounceRate: number
      conversionRate: number
    }>,
    context?: AgentContext
  ): Promise<LeadQualityAnalysis> {
    const leadsInfo = leads
      .map(l => `
- ${l.source} (${l.campaign})
  Leads: ${l.count} | Qualidade: ${l.qualityScore}/10
  Convertidos: ${l.convertedToClient} | Valor médio: €${l.averageValue || 'N/A'}
`).join('')

    const landingPagesInfo = landingPages
      ?.map(lp => `- ${lp.url}: Bounce ${lp.bounceRate}% | Conversão ${lp.conversionRate}%`)
      .join('\n') || 'Não disponível'

    const prompt = `
${LEAD_QUALITY_ANALYSIS_PROMPT}

PERÍODO: Últimos 30 dias

LEADS POR FONTE:
${leadsInfo}

LANDING PAGES:
${landingPagesInfo}

Analise a qualidade dos leads no formato JSON especificado.
`

    const response = await this.processStructured<LeadQualityAnalysis>(prompt, context)
    return response
  }

  // ===========================================================================
  // HELPER METHODS
  // ===========================================================================

  /**
   * Get benchmarks for legal area
   */
  getBenchmarks(legalArea: string) {
    return getLegalAdsBenchmarks(legalArea)
  }

  /**
   * Get recommended keywords for legal area
   */
  getRecommendedKeywords(legalArea: string): string[] {
    return getRecommendedKeywords(legalArea)
  }

  /**
   * Get negative keywords
   */
  getNegativeKeywords(): string[] {
    return getNegativeKeywords()
  }

  /**
   * Get character limits for platform
   */
  getCharacterLimits(platform: AdPlatform) {
    return getAdCharacterLimits(platform)
  }
}

// =============================================================================
// FACTORY FUNCTION
// =============================================================================

/**
 * Create a new Ads Agent instance
 */
export function createAdsAgent(config?: Partial<EnhancedAgentConfig>): AdsAgent {
  return new AdsAgent(config)
}

// Singleton instance
let adsAgentInstance: AdsAgent | null = null

/**
 * Get singleton Ads Agent instance
 */
export function getAdsAgent(): AdsAgent {
  if (!adsAgentInstance) {
    adsAgentInstance = createAdsAgent()
  }
  return adsAgentInstance
}

// =============================================================================
// EXPORTS
// =============================================================================

export { getLegalAdsBenchmarks, getRecommendedKeywords, getNegativeKeywords, getAdCharacterLimits }
