/**
 * SEO Agent
 * Responsible for search engine optimization management
 */

import { EnhancedBaseAgent } from '../core/enhanced-base-agent'
import type { AgentRole, AgentContext, EnhancedAgentConfig } from '../core/agent-types'
import {
  SEO_AGENT_SYSTEM_PROMPT,
  KEYWORD_RESEARCH_PROMPT,
  CONTENT_GAP_ANALYSIS_PROMPT,
  PAGE_OPTIMIZATION_PROMPT,
  CONTENT_BRIEF_PROMPT,
  TECHNICAL_AUDIT_PROMPT,
  SITE_ARCHITECTURE_PROMPT,
  LOCAL_SEO_AUDIT_PROMPT,
  BACKLINK_ANALYSIS_PROMPT,
  LINK_BUILDING_STRATEGY_PROMPT,
  SEO_MONTHLY_REPORT_PROMPT,
  getSEOBenchmarks,
  getPrimaryKeywords,
  getLegalSchemaTypes,
  calculateContentScore,
} from '../../prompts/marketing/seo-prompts'

// =============================================================================
// TYPES
// =============================================================================

export type SearchIntent = 'informational' | 'navigational' | 'transactional' | 'commercial'
export type ContentType = 'pillar' | 'blog' | 'guide' | 'faq' | 'page'
export type Priority = 'high' | 'medium' | 'low'

export interface KeywordData {
  keyword: string
  searchVolume: number
  difficulty: 'low' | 'medium' | 'high'
  intent: SearchIntent
  currentPosition?: number | null
  priority: Priority
  targetPage?: string
}

export interface KeywordResearch {
  legalArea: string
  primaryKeywords: KeywordData[]
  longTailKeywords: Array<{
    keyword: string
    parentKeyword: string
    searchVolume: number
    difficulty: 'low' | 'medium' | 'high'
    contentType: ContentType
  }>
  questionKeywords: Array<{
    question: string
    relatedKeyword: string
    featuredSnippetOpportunity: boolean
    suggestedFormat: 'paragraph' | 'list' | 'table' | 'video'
  }>
  localKeywords: Array<{
    keyword: string
    location: string
    volume: number
    localPackOpportunity: boolean
  }>
  competitorKeywords: Array<{
    keyword: string
    competitor: string
    theirPosition: number
    opportunity: string
  }>
  seasonalTrends: Array<{
    keyword: string
    peakMonths: string[]
    recommendation: string
  }>
}

export interface ContentGapAnalysis {
  currentCoverage: {
    totalPages: number
    indexedPages: number
    topRankingPages: Array<{
      url: string
      keyword: string
      position: number
    }>
  }
  competitorAnalysis: Array<{
    competitor: string
    domain: string
    estimatedTraffic: number
    topContent: Array<{
      topic: string
      url: string
      estimatedTraffic: number
    }>
  }>
  contentGaps: Array<{
    topic: string
    keyword: string
    searchVolume: number
    competitorsCovering: string[]
    priority: Priority
    contentType: ContentType
    estimatedEffort: 'low' | 'medium' | 'high'
  }>
  recommendations: Array<{
    action: string
    topic: string
    expectedImpact: string
    timeline: string
  }>
}

export interface PageOptimization {
  url: string
  targetKeyword: string
  currentScore: number
  optimizedScore: number
  titleTag: {
    current: string
    suggested: string
    length: number
    includesKeyword: boolean
  }
  metaDescription: {
    current: string
    suggested: string
    length: number
    includesCTA: boolean
  }
  headings: {
    h1: { current: string; suggested: string }
    h2s: Array<{ current: string; suggested: string }>
    h3s: Array<{ current: string; suggested: string }>
  }
  content: {
    wordCount: number
    recommendedWordCount: number
    keywordDensity: number
    readabilityScore: number
    suggestions: string[]
  }
  technicalIssues: Array<{
    issue: string
    severity: 'high' | 'medium' | 'low'
    fix: string
  }>
  internalLinks: {
    current: number
    suggested: Array<{
      anchorText: string
      targetUrl: string
      context: string
    }>
  }
  schemaMarkup: {
    current: string[]
    suggested: Array<{
      type: string
      properties: Record<string, unknown>
    }>
  }
}

export interface ContentBrief {
  title: string
  targetKeyword: string
  secondaryKeywords: string[]
  searchIntent: SearchIntent
  targetWordCount: { min: number; max: number }
  outline: Array<{
    heading: string
    type: 'H2' | 'H3'
    keyPoints: string[]
    suggestedWordCount: number
  }>
  competitorAnalysis: Array<{
    url: string
    wordCount: number
    mainTopics: string[]
    uniqueAngle: string
  }>
  suggestedTitle: string
  suggestedMetaDescription: string
  internalLinksToInclude: Array<{
    anchorText: string
    targetUrl: string
  }>
  externalSources: Array<{
    type: 'legislation' | 'jurisprudence' | 'doctrine' | 'official'
    description: string
    suggestedUsage: string
  }>
  callsToAction: Array<{
    placement: string
    type: 'consultation' | 'download' | 'contact'
    suggestedText: string
  }>
  featuredSnippetOptimization: {
    opportunity: boolean
    format: 'paragraph' | 'list' | 'table'
    targetQuestion: string
    suggestedAnswer: string
  }
}

export interface TechnicalAudit {
  overallScore: number
  criticalIssues: Array<{
    issue: string
    impact: string
    affectedUrls: number
    fix: string
    priority: number
  }>
  warnings: Array<{
    issue: string
    impact: string
    recommendation: string
  }>
  indexation: {
    totalPages: number
    indexedPages: number
    blockedPages: number
    orphanPages: number
    duplicateContent: Array<{
      urls: string[]
      resolution: string
    }>
  }
  performance: {
    mobileScore: number
    desktopScore: number
    lcp: number
    fid: number
    cls: number
    recommendations: string[]
  }
  mobileUsability: {
    score: number
    issues: string[]
  }
  security: {
    https: boolean
    mixedContent: boolean
    issues: string[]
  }
  structuredData: {
    implemented: string[]
    missing: string[]
    errors: string[]
  }
  actionPlan: Array<{
    priority: number
    action: string
    expectedImpact: string
    effort: 'low' | 'medium' | 'high'
  }>
}

export interface LocalSEOAudit {
  googleBusinessProfile: {
    claimed: boolean
    verified: boolean
    completeness: number
    categories: string[]
    missingInfo: string[]
    reviews: {
      count: number
      averageRating: number
      recentReviews: number
      responseRate: number
    }
    recommendations: string[]
  }
  localCitations: {
    consistent: number
    inconsistent: number
    missing: Array<{
      directory: string
      importance: Priority
      url: string
    }>
  }
  napConsistency: {
    name: { consistent: boolean; variations: string[] }
    address: { consistent: boolean; variations: string[] }
    phone: { consistent: boolean; variations: string[] }
  }
  localContent: {
    locationPages: number
    localBlogPosts: number
    recommendations: string[]
  }
  localKeywords: Array<{
    keyword: string
    localPackPosition: number | null
    organicPosition: number | null
    recommendation: string
  }>
  competitorLocalPresence: Array<{
    competitor: string
    gbpRating: number
    reviewCount: number
    localPackAppearance: number
  }>
  actionPlan: Array<{
    priority: number
    action: string
    expectedImpact: string
  }>
}

export interface BacklinkAnalysis {
  overview: {
    totalBacklinks: number
    referringDomains: number
    domainAuthority: number
    newBacklinksMonth: number
    lostBacklinksMonth: number
  }
  qualityDistribution: {
    highQuality: number
    mediumQuality: number
    lowQuality: number
    toxic: number
  }
  topBacklinks: Array<{
    domain: string
    domainAuthority: number
    anchorText: string
    targetUrl: string
    type: 'dofollow' | 'nofollow'
    traffic: number
  }>
  anchorTextDistribution: Array<{
    type: 'branded' | 'exact' | 'partial' | 'generic' | 'naked'
    percentage: number
    examples: string[]
  }>
  toxicLinks: Array<{
    domain: string
    reason: string
    action: 'disavow' | 'remove' | 'monitor'
  }>
  competitorComparison: Array<{
    competitor: string
    referringDomains: number
    domainAuthority: number
    gapOpportunities: number
  }>
  recommendations: Array<{
    priority: Priority
    action: string
    expectedImpact: string
  }>
}

export interface SEOMonthlyReport {
  period: { month: string; year: number }
  executiveSummary: string
  trafficOverview: {
    organicSessions: number
    previousMonth: number
    changePercent: number
    yearOverYear: number
  }
  rankings: {
    keywordsTracked: number
    top3: number
    top10: number
    improved: number
    declined: number
    newRankings: number
    topMovers: Array<{
      keyword: string
      previousPosition: number
      currentPosition: number
      change: number
    }>
  }
  contentPerformance: Array<{
    url: string
    sessions: number
    change: number
    topKeywords: string[]
  }>
  technicalHealth: {
    score: number
    issuesResolved: number
    newIssues: number
    criticalIssues: number
  }
  backlinks: {
    newLinks: number
    lostLinks: number
    referringDomains: number
    domainAuthority: number
  }
  conversions: {
    organicLeads: number
    previousMonth: number
    conversionRate: number
    topConvertingPages: Array<{
      url: string
      leads: number
      conversionRate: number
    }>
  }
  competitorUpdate: Array<{
    competitor: string
    visibilityChange: number
    notableChanges: string
  }>
  activitiesCompleted: Array<{
    activity: string
    result: string
  }>
  nextMonthPlan: Array<{
    priority: Priority
    activity: string
    expectedImpact: string
  }>
}

// =============================================================================
// SEO AGENT CLASS
// =============================================================================

export class SEOAgent extends EnhancedBaseAgent {
  constructor(config?: Partial<EnhancedAgentConfig>) {
    super(SEO_AGENT_SYSTEM_PROMPT, 'seo', {
      timeout: 90000,
      ...config,
    })
  }

  get name(): string {
    return 'SEO Agent'
  }

  get role(): AgentRole {
    return 'seo'
  }

  isRelevant(input: string): boolean {
    const keywords = [
      'seo', 'ranking', 'google', 'pesquisa', 'search',
      'keyword', 'palavra-chave', 'orgânico', 'organic',
      'backlink', 'link building', 'conteúdo', 'content',
      'otimização', 'optimization', 'meta', 'title',
      'posição', 'position', 'tráfego', 'traffic',
    ]
    const lowerInput = input.toLowerCase()
    return keywords.some(keyword => lowerInput.includes(keyword))
  }

  // ===========================================================================
  // KEYWORD RESEARCH
  // ===========================================================================

  /**
   * Perform keyword research for a legal area
   */
  async researchKeywords(
    legalArea: string,
    competitors?: string[],
    context?: AgentContext
  ): Promise<KeywordResearch> {
    const benchmarks = getSEOBenchmarks(legalArea)
    const seedKeywords = getPrimaryKeywords(legalArea)

    const prompt = `
${KEYWORD_RESEARCH_PROMPT}

ÁREA JURÍDICA: ${legalArea}

KEYWORDS SEED:
${seedKeywords.join(', ')}

BENCHMARKS:
- Posição média no setor: ${benchmarks.averagePosition}
- Posição alvo: ${benchmarks.targetPosition}
- Tráfego típico: ${benchmarks.typicalTraffic}/mês
- Taxa de conversão: ${benchmarks.conversionRate}%

${competitors ? `
CONCORRENTES A ANALISAR:
${competitors.join(', ')}
` : ''}

Realize pesquisa de keywords completa no formato JSON especificado.
`

    const response = await this.processStructured<KeywordResearch>(prompt, context)
    return response
  }

  /**
   * Analyze content gaps
   */
  async analyzeContentGaps(
    currentPages: Array<{ url: string; keyword?: string; position?: number }>,
    competitors: string[],
    legalArea: string,
    context?: AgentContext
  ): Promise<ContentGapAnalysis> {
    const pagesInfo = currentPages
      .map(p => `- ${p.url} ${p.keyword ? `(${p.keyword}: #${p.position || 'N/A'})` : ''}`)
      .join('\n')

    const prompt = `
${CONTENT_GAP_ANALYSIS_PROMPT}

ÁREA JURÍDICA: ${legalArea}

PÁGINAS ATUAIS:
${pagesInfo}

CONCORRENTES:
${competitors.join(', ')}

Analise os gaps de conteúdo no formato JSON especificado.
`

    const response = await this.processStructured<ContentGapAnalysis>(prompt, context)
    return response
  }

  // ===========================================================================
  // ON-PAGE OPTIMIZATION
  // ===========================================================================

  /**
   * Optimize a page for SEO
   */
  async optimizePage(
    pageData: {
      url: string
      targetKeyword: string
      currentTitle: string
      currentDescription: string
      h1: string
      h2s: string[]
      wordCount: number
      internalLinks: number
    },
    context?: AgentContext
  ): Promise<PageOptimization> {
    const prompt = `
${PAGE_OPTIMIZATION_PROMPT}

DADOS DA PÁGINA:
- URL: ${pageData.url}
- Keyword alvo: ${pageData.targetKeyword}
- Title atual: "${pageData.currentTitle}"
- Meta description atual: "${pageData.currentDescription}"
- H1: "${pageData.h1}"
- H2s: ${pageData.h2s.map(h => `"${h}"`).join(', ')}
- Contagem de palavras: ${pageData.wordCount}
- Links internos: ${pageData.internalLinks}

SCHEMA TYPES RECOMENDADOS PARA LEGAL:
${getLegalSchemaTypes().join(', ')}

Analise e otimize a página no formato JSON especificado.
`

    const response = await this.processStructured<PageOptimization>(prompt, context)
    return response
  }

  /**
   * Create content brief
   */
  async createContentBrief(
    topic: string,
    targetKeyword: string,
    legalArea: string,
    competitors?: Array<{ url: string; wordCount: number }>,
    context?: AgentContext
  ): Promise<ContentBrief> {
    const competitorsInfo = competitors
      ?.map(c => `- ${c.url} (${c.wordCount} palavras)`)
      .join('\n') || 'A pesquisar'

    const prompt = `
${CONTENT_BRIEF_PROMPT}

TÓPICO: ${topic}
KEYWORD PRINCIPAL: ${targetKeyword}
ÁREA JURÍDICA: ${legalArea}

ANÁLISE DE CONCORRENTES:
${competitorsInfo}

Crie um brief de conteúdo completo no formato JSON especificado.
`

    const response = await this.processStructured<ContentBrief>(prompt, context)
    return response
  }

  // ===========================================================================
  // TECHNICAL SEO
  // ===========================================================================

  /**
   * Perform technical SEO audit
   */
  async performTechnicalAudit(
    siteData: {
      totalPages: number
      indexedPages: number
      mobileScore?: number
      desktopScore?: number
      coreWebVitals?: { lcp: number; fid: number; cls: number }
      httpsEnabled: boolean
      structuredDataTypes?: string[]
    },
    context?: AgentContext
  ): Promise<TechnicalAudit> {
    const prompt = `
${TECHNICAL_AUDIT_PROMPT}

DADOS DO SITE:
- Páginas totais: ${siteData.totalPages}
- Páginas indexadas: ${siteData.indexedPages}
- Score mobile: ${siteData.mobileScore || 'A verificar'}
- Score desktop: ${siteData.desktopScore || 'A verificar'}
${siteData.coreWebVitals ? `
- Core Web Vitals:
  - LCP: ${siteData.coreWebVitals.lcp}s
  - FID: ${siteData.coreWebVitals.fid}ms
  - CLS: ${siteData.coreWebVitals.cls}
` : ''}
- HTTPS: ${siteData.httpsEnabled ? 'Sim' : 'Não'}
- Structured Data: ${siteData.structuredDataTypes?.join(', ') || 'Nenhum detectado'}

Realize auditoria técnica no formato JSON especificado.
`

    const response = await this.processStructured<TechnicalAudit>(prompt, context)
    return response
  }

  /**
   * Analyze site architecture
   */
  async analyzeSiteArchitecture(
    pages: Array<{
      url: string
      depth: number
      internalLinks: number
      category?: string
    }>,
    context?: AgentContext
  ): Promise<{
    currentStructure: {
      depth: number
      totalPages: number
      orphanPages: number
      clickDepth: Record<string, number>
    }
    recommendations: Array<{
      action: string
      impact: Priority
      effort: 'high' | 'medium' | 'low'
    }>
  }> {
    const pagesInfo = pages
      .map(p => `- ${p.url} (profundidade: ${p.depth}, links: ${p.internalLinks}${p.category ? `, categoria: ${p.category}` : ''})`)
      .join('\n')

    const prompt = `
${SITE_ARCHITECTURE_PROMPT}

PÁGINAS DO SITE:
${pagesInfo}

Analise a arquitetura no formato JSON especificado.
`

    const response = await this.processStructured<{
      currentStructure: {
        depth: number
        totalPages: number
        orphanPages: number
        clickDepth: Record<string, number>
      }
      recommendations: Array<{
        action: string
        impact: Priority
        effort: 'high' | 'medium' | 'low'
      }>
    }>(prompt, context)

    return response
  }

  // ===========================================================================
  // LOCAL SEO
  // ===========================================================================

  /**
   * Perform local SEO audit
   */
  async performLocalSEOAudit(
    data: {
      gbpClaimed: boolean
      gbpVerified: boolean
      reviews: { count: number; rating: number }
      citations: { consistent: number; inconsistent: number }
      localKeywords: Array<{ keyword: string; position?: number }>
    },
    context?: AgentContext
  ): Promise<LocalSEOAudit> {
    const keywordsInfo = data.localKeywords
      .map(k => `- "${k.keyword}": ${k.position ? `#${k.position}` : 'Não rankeado'}`)
      .join('\n')

    const prompt = `
${LOCAL_SEO_AUDIT_PROMPT}

GOOGLE BUSINESS PROFILE:
- Reivindicado: ${data.gbpClaimed ? 'Sim' : 'Não'}
- Verificado: ${data.gbpVerified ? 'Sim' : 'Não'}
- Reviews: ${data.reviews.count} (${data.reviews.rating}/5)

CITAÇÕES:
- Consistentes: ${data.citations.consistent}
- Inconsistentes: ${data.citations.inconsistent}

KEYWORDS LOCAIS:
${keywordsInfo}

Realize auditoria de SEO local no formato JSON especificado.
`

    const response = await this.processStructured<LocalSEOAudit>(prompt, context)
    return response
  }

  // ===========================================================================
  // LINK BUILDING
  // ===========================================================================

  /**
   * Analyze backlink profile
   */
  async analyzeBacklinks(
    data: {
      totalBacklinks: number
      referringDomains: number
      domainAuthority: number
      topLinks: Array<{
        domain: string
        da: number
        anchorText: string
      }>
    },
    competitors?: Array<{ domain: string; referringDomains: number; da: number }>,
    context?: AgentContext
  ): Promise<BacklinkAnalysis> {
    const topLinksInfo = data.topLinks
      .map(l => `- ${l.domain} (DA: ${l.da}) - "${l.anchorText}"`)
      .join('\n')

    const competitorsInfo = competitors
      ?.map(c => `- ${c.domain}: ${c.referringDomains} RDs, DA ${c.da}`)
      .join('\n') || 'Não disponível'

    const prompt = `
${BACKLINK_ANALYSIS_PROMPT}

PERFIL ATUAL:
- Total de backlinks: ${data.totalBacklinks}
- Domínios referenciadores: ${data.referringDomains}
- Domain Authority: ${data.domainAuthority}

TOP BACKLINKS:
${topLinksInfo}

CONCORRENTES:
${competitorsInfo}

Analise o perfil de backlinks no formato JSON especificado.
`

    const response = await this.processStructured<BacklinkAnalysis>(prompt, context)
    return response
  }

  /**
   * Create link building strategy
   */
  async createLinkBuildingStrategy(
    currentState: {
      referringDomains: number
      domainAuthority: number
      monthlyNewLinks: number
    },
    targetDA: number,
    context?: AgentContext
  ): Promise<{
    goals: { targetDA: number; monthlyLinkTarget: number; timeline: string }
    tactics: Array<{
      tactic: string
      description: string
      expectedLinksMonth: number
      effort: 'low' | 'medium' | 'high'
      steps: string[]
    }>
    outreachTargets: Array<{
      type: string
      name: string
      domainAuthority: number
      contactApproach: string
    }>
  }> {
    const prompt = `
${LINK_BUILDING_STRATEGY_PROMPT}

ESTADO ATUAL:
- Domínios referenciadores: ${currentState.referringDomains}
- Domain Authority: ${currentState.domainAuthority}
- Novos links/mês: ${currentState.monthlyNewLinks}

OBJETIVO:
- DA alvo: ${targetDA}

Crie estratégia de link building no formato JSON especificado.
`

    const response = await this.processStructured<{
      goals: { targetDA: number; monthlyLinkTarget: number; timeline: string }
      tactics: Array<{
        tactic: string
        description: string
        expectedLinksMonth: number
        effort: 'low' | 'medium' | 'high'
        steps: string[]
      }>
      outreachTargets: Array<{
        type: string
        name: string
        domainAuthority: number
        contactApproach: string
      }>
    }>(prompt, context)

    return response
  }

  // ===========================================================================
  // REPORTING
  // ===========================================================================

  /**
   * Generate monthly SEO report
   */
  async generateMonthlyReport(
    data: {
      month: string
      year: number
      organicSessions: number
      previousMonthSessions: number
      rankings: {
        tracked: number
        top3: number
        top10: number
        improved: number
        declined: number
      }
      backlinks: {
        new: number
        lost: number
        totalRDs: number
        da: number
      }
      leads: {
        current: number
        previous: number
      }
      activities: Array<{ activity: string; result: string }>
    },
    context?: AgentContext
  ): Promise<SEOMonthlyReport> {
    const prompt = `
${SEO_MONTHLY_REPORT_PROMPT}

PERÍODO: ${data.month} ${data.year}

TRÁFEGO:
- Sessões orgânicas: ${data.organicSessions}
- Mês anterior: ${data.previousMonthSessions}
- Variação: ${((data.organicSessions - data.previousMonthSessions) / data.previousMonthSessions * 100).toFixed(1)}%

RANKINGS:
- Keywords rastreadas: ${data.rankings.tracked}
- Top 3: ${data.rankings.top3}
- Top 10: ${data.rankings.top10}
- Melhoraram: ${data.rankings.improved}
- Pioraram: ${data.rankings.declined}

BACKLINKS:
- Novos: ${data.backlinks.new}
- Perdidos: ${data.backlinks.lost}
- Total RDs: ${data.backlinks.totalRDs}
- DA: ${data.backlinks.da}

CONVERSÕES:
- Leads orgânicos: ${data.leads.current}
- Mês anterior: ${data.leads.previous}

ATIVIDADES:
${data.activities.map(a => `- ${a.activity}: ${a.result}`).join('\n')}

Gere o relatório mensal no formato JSON especificado.
`

    const response = await this.processStructured<SEOMonthlyReport>(prompt, context)
    return response
  }

  // ===========================================================================
  // HELPER METHODS
  // ===========================================================================

  /**
   * Get SEO benchmarks for legal area
   */
  getBenchmarks(legalArea: string) {
    return getSEOBenchmarks(legalArea)
  }

  /**
   * Get primary keywords for legal area
   */
  getPrimaryKeywords(legalArea: string): string[] {
    return getPrimaryKeywords(legalArea)
  }

  /**
   * Get schema types for legal pages
   */
  getSchemaTypes(): string[] {
    return getLegalSchemaTypes()
  }

  /**
   * Calculate content SEO score
   */
  calculateContentScore(metrics: {
    wordCount: number
    keywordDensity: number
    headingsCount: number
    internalLinks: number
    externalLinks: number
    images: number
    readabilityScore: number
  }): number {
    return calculateContentScore(metrics)
  }
}

// =============================================================================
// FACTORY FUNCTION
// =============================================================================

/**
 * Create a new SEO Agent instance
 */
export function createSEOAgent(config?: Partial<EnhancedAgentConfig>): SEOAgent {
  return new SEOAgent(config)
}

// Singleton instance
let seoAgentInstance: SEOAgent | null = null

/**
 * Get singleton SEO Agent instance
 */
export function getSEOAgent(): SEOAgent {
  if (!seoAgentInstance) {
    seoAgentInstance = createSEOAgent()
  }
  return seoAgentInstance
}

// =============================================================================
// EXPORTS
// =============================================================================

export { getSEOBenchmarks, getPrimaryKeywords, getLegalSchemaTypes, calculateContentScore }
