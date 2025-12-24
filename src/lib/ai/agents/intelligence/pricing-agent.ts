/**
 * Pricing Agent
 * Responsible for dynamic pricing, value optimization, and quote generation
 */

import { EnhancedBaseAgent } from '../core/enhanced-base-agent'
import type { AgentRole, AgentContext, EnhancedAgentConfig } from '../core/agent-types'
import {
  PRICING_AGENT_SYSTEM_PROMPT,
  SERVICE_PRICING_PROMPT,
  CLIENT_WILLINGNESS_PROMPT,
  PRICING_OPTIMIZATION_PROMPT,
  COMPETITOR_PRICING_PROMPT,
  QUOTE_GENERATOR_PROMPT,
  RETAINER_PROPOSAL_PROMPT,
  DISCOUNT_ANALYSIS_PROMPT,
  getOABMinimumFees,
  calculateSuccessFee,
  getRecommendedPricingModel,
  calculateElasticityImpact,
} from '../../prompts/intelligence/pricing-prompts'

// =============================================================================
// TYPES
// =============================================================================

export type PricingModel = 'fixed' | 'hourly' | 'success_fee' | 'retainer' | 'hybrid'
export type PriceTier = 'essencial' | 'standard' | 'premium'
export type ClientSegment = 'individual' | 'sme' | 'corporate' | 'startup'

export interface ServicePricingInput {
  serviceName: string
  legalArea: string
  description: string
  estimatedHours: number
  lawyerHourlyRate: number
  thirdPartyCosts?: number
  courtFees?: number
  competitorPrices?: Array<{ competitor: string; price: number }>
  valueToClient?: string
}

export interface ServicePricing {
  service: {
    name: string
    legalArea: string
    description: string
    complexity: 'low' | 'medium' | 'high' | 'very_high'
    estimatedHours: number
    valueToClient: string
  }
  costAnalysis: {
    directCosts: {
      lawyerHours: number
      hourlyRate: number
      totalLaborCost: number
      thirdPartyCosts: number
      courtFees: number
      otherCosts: number
    }
    indirectCosts: {
      overheadAllocation: number
      riskAllocation: number
    }
    totalCost: number
    breakEvenPrice: number
  }
  marketAnalysis: {
    competitorPrices: Array<{
      competitor: string
      price: number
      positioning: 'budget' | 'mid' | 'premium'
    }>
    marketAverage: number
    priceRange: { min: number; max: number }
    ourPositioning: 'below_market' | 'at_market' | 'above_market'
  }
  valueAnalysis: {
    clientBenefit: string
    monetaryValue: number
    emotionalValue: 'low' | 'medium' | 'high'
    urgencyFactor: number
    uniqueValue: string[]
  }
  recommendedPricing: {
    model: PricingModel
    basePrice: number
    priceRange: { min: number; standard: number; premium: number }
    successFeePercent: number | null
    retainerMonthly: number | null
    justification: string
  }
  pricingTiers: Array<{
    tier: PriceTier
    price: number
    includes: string[]
    excludes: string[]
    targetClient: string
  }>
  discountPolicy: {
    earlyPayment: { percent: number; condition: string }
    bundleDiscount: { percent: number; condition: string }
    loyaltyDiscount: { percent: number; condition: string }
  }
  upsellOpportunities: Array<{
    service: string
    price: number
    conversionLikelihood: number
  }>
}

export interface ClientWillingness {
  client: {
    id: string
    segment: ClientSegment
    industry: string
    size: 'small' | 'medium' | 'large'
  }
  financialIndicators: {
    estimatedBudget: number
    previousSpend: number
    paymentHistory: 'excellent' | 'good' | 'fair' | 'poor'
    priceElasticity: 'low' | 'medium' | 'high'
  }
  valuePerception: {
    brandAwareness: 'low' | 'medium' | 'high'
    qualityExpectation: 'low' | 'medium' | 'high'
    urgency: 'low' | 'medium' | 'high'
    alternatives: number
    switchingCost: 'low' | 'medium' | 'high'
  }
  behavioralSignals: Array<{
    signal: string
    interpretation: string
    wtpImpact: 'positive' | 'negative' | 'neutral'
  }>
  wtpEstimate: {
    low: number
    medium: number
    high: number
    confidence: number
    factors: string[]
  }
  pricingStrategy: {
    recommendedApproach: string
    anchorPrice: number
    targetPrice: number
    walkAwayPrice: number
    negotiationRoom: number
  }
  riskAssessment: {
    overpricing: { risk: 'low' | 'medium' | 'high'; consequence: string }
    underpricing: { risk: 'low' | 'medium' | 'high'; consequence: string }
  }
}

export interface PricingOptimization {
  currentState: {
    avgTicket: number
    conversionRate: number
    monthlyRevenue: number
    priceDispersion: number
  }
  priceElasticityAnalysis: {
    estimatedElasticity: number
    interpretation: string
    optimalPricePoint: number
    demandAtOptimal: number
  }
  segmentAnalysis: Array<{
    segment: string
    currentPrice: number
    recommendedPrice: number
    priceChange: number
    expectedVolumeChange: number
    expectedRevenueChange: number
    justification: string
  }>
  bundlingStrategy: {
    currentBundles: Array<{
      name: string
      components: string[]
      price: number
      uptake: number
    }>
    recommendedBundles: Array<{
      name: string
      components: string[]
      individualTotal: number
      bundlePrice: number
      discount: number
      targetSegment: string
      expectedUptake: number
    }>
  }
  dynamicPricingOpportunities: Array<{
    service: string
    trigger: string
    priceAdjustment: number
    conditions: string[]
    expectedImpact: number
  }>
  revenueImpact: {
    baselineRevenue: number
    projectedRevenue: number
    incrementalRevenue: number
    incrementalPercent: number
    implementationCost: number
    netBenefit: number
    paybackPeriod: string
  }
  implementationPlan: Array<{
    phase: number
    action: string
    timeline: string
    risk: 'low' | 'medium' | 'high'
    mitigation: string
  }>
}

export interface CompetitorPricing {
  market: string
  serviceCategory: string
  competitors: Array<{
    name: string
    positioning: 'budget' | 'mid-market' | 'premium' | 'luxury'
    marketShare: number
    services: Array<{
      service: string
      price: number
      pricingModel: PricingModel
      includes: string[]
    }>
    strengths: string[]
    weaknesses: string[]
    recentChanges: string
  }>
  pricePositioning: {
    ourPosition: string
    relativeToMarket: number
    competitiveAdvantages: string[]
    vulnerabilities: string[]
  }
  marketTrends: Array<{
    trend: string
    direction: 'increasing' | 'stable' | 'decreasing'
    impact: string
    ourResponse: string
  }>
  priceGaps: Array<{
    opportunity: string
    currentGap: string
    potentialRevenue: number
    feasibility: 'high' | 'medium' | 'low'
  }>
  recommendations: Array<{
    action: string
    rationale: string
    expectedOutcome: string
    priority: 'high' | 'medium' | 'low'
  }>
}

export interface Quote {
  proposal: {
    id: string
    date: string
    validUntil: string
    clientName: string
  }
  matterDescription: {
    title: string
    summary: string
    objectives: string[]
    scope: string
    exclusions: string[]
  }
  pricingOptions: Array<{
    option: 'A' | 'B' | 'C'
    name: string
    model: PricingModel
    totalFee: number
    breakdown: Array<{
      item: string
      description: string
      amount: number
    }>
    paymentSchedule: Array<{
      milestone: string
      percentage: number
      amount: number
      dueDate: string
    }>
    includes: string[]
    additionalCosts: Array<{
      item: string
      estimated: number
      notes: string
    }>
  }>
  recommendedOption: 'A' | 'B' | 'C'
  recommendationReason: string
  termsAndConditions: string[]
  nextSteps: string[]
  callToAction: string
}

export interface RetainerProposal {
  proposal: {
    title: string
    clientName: string
    startDate: string
    duration: string
  }
  executiveSummary: string
  retainerPackages: Array<{
    name: string
    tier: 'starter' | 'professional' | 'enterprise'
    monthlyFee: number
    annualFee: number
    annualDiscount: number
    includedHours: number
    additionalHourRate: number
    includedServices: Array<{
      service: string
      quantity: number | 'unlimited'
      value: number
    }>
    excludedServices: string[]
    responseTime: {
      standard: string
      urgent: string
    }
    dedicatedContact: boolean
    quarterlyReview: boolean
    bestFor: string
  }>
  valueProposition: {
    totalAnnualValue: number
    effectiveDiscount: number
    additionalBenefits: string[]
    riskMitigation: string
  }
  comparisonToAdHoc: {
    estimatedAdHocCost: number
    retainerCost: number
    savings: number
    savingsPercent: number
  }
  implementation: {
    onboarding: string
    communication: string
    reporting: string
  }
  terms: {
    paymentTerms: string
    cancellation: string
    rollover: string
  }
}

export interface DiscountAnalysis {
  originalPrice: number
  requestedDiscount: number
  discountedPrice: number
  discountPercent: number
  marginAnalysis: {
    originalMargin: number
    newMargin: number
    marginErosion: number
    breakEvenVolume: number
  }
  clientValue: {
    currentLTV: number
    projectedLTV: number
    strategicValue: 'low' | 'medium' | 'high'
    referralPotential: 'low' | 'medium' | 'high'
  }
  recommendation: {
    approve: boolean
    maxDiscount: number
    conditions: string[]
    alternatives: Array<{
      option: string
      description: string
      clientBenefit: string
      ourBenefit: string
    }>
  }
  negotiationScript: {
    opening: string
    valueReinforcement: string[]
    counterOffer: string
    walkAwayPoint: string
    closingTechniques: string[]
  }
  precedentWarning: {
    risk: 'low' | 'medium' | 'high'
    potentialImpact: string
    mitigation: string
  }
}

// =============================================================================
// PRICING AGENT CLASS
// =============================================================================

export class PricingAgent extends EnhancedBaseAgent {
  constructor(config?: Partial<EnhancedAgentConfig>) {
    super(PRICING_AGENT_SYSTEM_PROMPT, 'pricing', {
      timeout: 90000,
      ...config,
    })
  }

  get name(): string {
    return 'Pricing Agent'
  }

  get role(): AgentRole {
    return 'pricing'
  }

  isRelevant(input: string): boolean {
    const keywords = [
      'preço', 'pricing', 'honorário', 'orçamento', 'proposta',
      'cotação', 'valor', 'custo', 'desconto', 'negociação',
      'retainer', 'avença', 'fee', 'tarifa', 'tabela',
      'willingness', 'elasticidade', 'bundle', 'pacote',
    ]
    const lowerInput = input.toLowerCase()
    return keywords.some(keyword => lowerInput.includes(keyword))
  }

  // ===========================================================================
  // PRICING ANALYSIS
  // ===========================================================================

  /**
   * Analyze and recommend pricing for a service
   */
  async analyzeServicePricing(
    input: ServicePricingInput,
    context?: AgentContext
  ): Promise<ServicePricing> {
    const oabFees = getOABMinimumFees()

    const prompt = `
${SERVICE_PRICING_PROMPT}

DADOS DO SERVIÇO:
- Nome: ${input.serviceName}
- Área Jurídica: ${input.legalArea}
- Descrição: ${input.description}
- Horas Estimadas: ${input.estimatedHours}h
- Taxa Horária Advogado: €${input.lawyerHourlyRate}
- Custos de Terceiros: €${input.thirdPartyCosts || 0}
- Custas Judiciais: €${input.courtFees || 0}
${input.valueToClient ? `- Valor para o Cliente: ${input.valueToClient}` : ''}

${input.competitorPrices ? `
PREÇOS DA CONCORRÊNCIA:
${input.competitorPrices.map(c => `- ${c.competitor}: €${c.price}`).join('\n')}
` : ''}

REFERÊNCIA OAB:
${Object.entries(oabFees).map(([k, v]) => `- ${k}: €${v.min} - €${v.typical}`).join('\n')}

Analise e recomende precificação no formato JSON especificado.
`

    const response = await this.processStructured<ServicePricing>(prompt, context)
    return response
  }

  /**
   * Analyze client willingness to pay
   */
  async analyzeClientWillingness(
    clientData: {
      id: string
      segment: ClientSegment
      industry: string
      size: 'small' | 'medium' | 'large'
      previousSpend?: number
      paymentHistory?: string
      urgency?: string
      alternatives?: number
    },
    serviceValue: number,
    context?: AgentContext
  ): Promise<ClientWillingness> {
    const prompt = `
${CLIENT_WILLINGNESS_PROMPT}

DADOS DO CLIENTE:
- ID: ${clientData.id}
- Segmento: ${clientData.segment}
- Indústria: ${clientData.industry}
- Tamanho: ${clientData.size}
${clientData.previousSpend ? `- Gastos Anteriores: €${clientData.previousSpend}` : ''}
${clientData.paymentHistory ? `- Histórico de Pagamento: ${clientData.paymentHistory}` : ''}
${clientData.urgency ? `- Urgência: ${clientData.urgency}` : ''}
${clientData.alternatives ? `- Alternativas Conhecidas: ${clientData.alternatives}` : ''}

VALOR DO SERVIÇO PROPOSTO: €${serviceValue}

Analise a disposição de pagamento no formato JSON especificado.
`

    const response = await this.processStructured<ClientWillingness>(prompt, context)
    return response
  }

  /**
   * Optimize overall pricing strategy
   */
  async optimizePricing(
    currentData: {
      avgTicket: number
      conversionRate: number
      monthlyRevenue: number
      services: Array<{
        name: string
        price: number
        volume: number
        margin: number
      }>
      segments: Array<{
        name: string
        avgTicket: number
        volume: number
      }>
    },
    context?: AgentContext
  ): Promise<PricingOptimization> {
    const prompt = `
${PRICING_OPTIMIZATION_PROMPT}

ESTADO ATUAL:
- Ticket Médio: €${currentData.avgTicket}
- Taxa de Conversão: ${(currentData.conversionRate * 100).toFixed(1)}%
- Receita Mensal: €${currentData.monthlyRevenue}

SERVIÇOS:
${currentData.services.map(s =>
  `- ${s.name}: €${s.price} (${s.volume} unidades, margem ${(s.margin * 100).toFixed(1)}%)`
).join('\n')}

SEGMENTOS:
${currentData.segments.map(s =>
  `- ${s.name}: Ticket médio €${s.avgTicket}, Volume ${s.volume}`
).join('\n')}

Otimize a estratégia de pricing no formato JSON especificado.
`

    const response = await this.processStructured<PricingOptimization>(prompt, context)
    return response
  }

  /**
   * Analyze competitor pricing
   */
  async analyzeCompetitorPricing(
    market: string,
    serviceCategory: string,
    competitors: Array<{
      name: string
      services: Array<{ service: string; price: number }>
    }>,
    context?: AgentContext
  ): Promise<CompetitorPricing> {
    const prompt = `
${COMPETITOR_PRICING_PROMPT}

MERCADO: ${market}
CATEGORIA: ${serviceCategory}

CONCORRENTES:
${competitors.map(c => `
${c.name}:
${c.services.map(s => `  - ${s.service}: €${s.price}`).join('\n')}
`).join('\n')}

Analise o pricing da concorrência no formato JSON especificado.
`

    const response = await this.processStructured<CompetitorPricing>(prompt, context)
    return response
  }

  // ===========================================================================
  // QUOTE GENERATION
  // ===========================================================================

  /**
   * Generate a customized quote
   */
  async generateQuote(
    clientName: string,
    matterTitle: string,
    matterSummary: string,
    objectives: string[],
    estimatedValue: number,
    legalArea: string,
    context?: AgentContext
  ): Promise<Quote> {
    const modelRec = getRecommendedPricingModel(legalArea)

    const prompt = `
${QUOTE_GENERATOR_PROMPT}

CLIENTE: ${clientName}
TÍTULO DO CASO: ${matterTitle}
RESUMO: ${matterSummary}
OBJETIVOS:
${objectives.map(o => `- ${o}`).join('\n')}

VALOR ESTIMADO: €${estimatedValue}
ÁREA JURÍDICA: ${legalArea}

MODELO RECOMENDADO: ${modelRec.model} (${modelRec.reason})

Gere uma proposta de honorários personalizada no formato JSON especificado.
`

    const response = await this.processStructured<Quote>(prompt, context)
    return response
  }

  /**
   * Create a retainer proposal
   */
  async createRetainerProposal(
    clientName: string,
    expectedUsage: {
      consultationsPerMonth: number
      contractsPerMonth: number
      meetingsPerMonth: number
    },
    currentSpend?: number,
    context?: AgentContext
  ): Promise<RetainerProposal> {
    const prompt = `
${RETAINER_PROPOSAL_PROMPT}

CLIENTE: ${clientName}

USO ESPERADO:
- Consultas por mês: ${expectedUsage.consultationsPerMonth}
- Contratos por mês: ${expectedUsage.contractsPerMonth}
- Reuniões por mês: ${expectedUsage.meetingsPerMonth}

${currentSpend ? `GASTO ATUAL (AD-HOC): €${currentSpend}/mês` : ''}

Crie proposta de retainer no formato JSON especificado.
`

    const response = await this.processStructured<RetainerProposal>(prompt, context)
    return response
  }

  // ===========================================================================
  // NEGOTIATION
  // ===========================================================================

  /**
   * Analyze discount request
   */
  async analyzeDiscount(
    originalPrice: number,
    requestedDiscount: number,
    clientData: {
      ltv?: number
      strategicValue?: 'low' | 'medium' | 'high'
      referralPotential?: 'low' | 'medium' | 'high'
    },
    serviceCost: number,
    context?: AgentContext
  ): Promise<DiscountAnalysis> {
    const discountedPrice = originalPrice * (1 - requestedDiscount / 100)
    const originalMargin = (originalPrice - serviceCost) / originalPrice
    const newMargin = (discountedPrice - serviceCost) / discountedPrice

    const prompt = `
${DISCOUNT_ANALYSIS_PROMPT}

PREÇO ORIGINAL: €${originalPrice}
DESCONTO SOLICITADO: ${requestedDiscount}%
PREÇO COM DESCONTO: €${discountedPrice.toFixed(2)}

CUSTO DO SERVIÇO: €${serviceCost}
MARGEM ORIGINAL: ${(originalMargin * 100).toFixed(1)}%
NOVA MARGEM: ${(newMargin * 100).toFixed(1)}%

DADOS DO CLIENTE:
${clientData.ltv ? `- LTV Estimado: €${clientData.ltv}` : ''}
${clientData.strategicValue ? `- Valor Estratégico: ${clientData.strategicValue}` : ''}
${clientData.referralPotential ? `- Potencial de Indicação: ${clientData.referralPotential}` : ''}

Analise o pedido de desconto no formato JSON especificado.
`

    const response = await this.processStructured<DiscountAnalysis>(prompt, context)
    return response
  }

  // ===========================================================================
  // HELPER METHODS
  // ===========================================================================

  /**
   * Get OAB minimum fees reference
   */
  getOABMinimumFees() {
    return getOABMinimumFees()
  }

  /**
   * Calculate success fee
   */
  calculateSuccessFee(valueRecovered: number, tier: 'standard' | 'premium' | 'complex') {
    return calculateSuccessFee(valueRecovered, tier)
  }

  /**
   * Get recommended pricing model
   */
  getRecommendedPricingModel(caseType: string) {
    return getRecommendedPricingModel(caseType)
  }

  /**
   * Calculate price elasticity impact
   */
  calculateElasticityImpact(currentPrice: number, newPrice: number, elasticity: number) {
    return calculateElasticityImpact(currentPrice, newPrice, elasticity)
  }
}

// =============================================================================
// FACTORY FUNCTION
// =============================================================================

/**
 * Create a new Pricing Agent instance
 */
export function createPricingAgent(config?: Partial<EnhancedAgentConfig>): PricingAgent {
  return new PricingAgent(config)
}

// Singleton instance
let pricingAgentInstance: PricingAgent | null = null

/**
 * Get singleton Pricing Agent instance
 */
export function getPricingAgent(): PricingAgent {
  if (!pricingAgentInstance) {
    pricingAgentInstance = createPricingAgent()
  }
  return pricingAgentInstance
}

// =============================================================================
// EXPORTS
// =============================================================================

export {
  getOABMinimumFees,
  calculateSuccessFee,
  getRecommendedPricingModel,
  calculateElasticityImpact,
}
