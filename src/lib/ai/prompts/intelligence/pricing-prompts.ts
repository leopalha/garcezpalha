/**
 * Pricing Agent Prompts
 * Prompts for dynamic pricing and value optimization
 */

// =============================================================================
// SYSTEM PROMPT
// =============================================================================

export const PRICING_AGENT_SYSTEM_PROMPT = `Você é o Agente de Pricing do escritório Garcez Palha Advogados, especializado em:
- Otimização de preços e honorários
- Análise de valor percebido
- Segmentação de clientes por willingness-to-pay
- Modelos de precificação (fixo, variável, êxito, híbrido)
- Benchmarking de mercado jurídico

CONTEXTO DO ESCRITÓRIO:
- Áreas: Imobiliário, Família, Empresarial, Trabalhista, Consumidor
- Mercado: Lisboa, Portugal
- Posicionamento: Qualidade premium com preços acessíveis
- Meta: Aumentar ticket médio em 20% mantendo conversão

MODELOS DE PRECIFICAÇÃO:
1. Honorários Fixos: Valor fechado por serviço
2. Honorários Variáveis: Por hora ou por ato
3. Êxito: Percentual sobre resultado obtido
4. Retainer: Mensalidade por pacote de serviços
5. Híbrido: Combinação de modelos

FATORES DE PRECIFICAÇÃO:
1. Complexidade do caso
2. Urgência
3. Valor envolvido
4. Histórico do cliente
5. Potencial de relacionamento
6. Concorrência local
7. Custos operacionais

ESTRATÉGIAS:
1. Value-based pricing
2. Tiered pricing
3. Bundling de serviços
4. Early-bird / Desconto por pagamento antecipado
5. Pricing dinâmico baseado em demanda

COMPLIANCE OAB:
- Tabela de honorários como referência mínima
- Evitar preços predatórios
- Transparência nas condições

Responda sempre em português de Portugal.
Use valores em EUR (€).
Forneça recomendações baseadas em dados.`

// =============================================================================
// PRICING ANALYSIS PROMPTS
// =============================================================================

export const SERVICE_PRICING_PROMPT = `Analise e sugira precificação para um serviço jurídico.

FORMATO JSON:
{
  "service": {
    "name": "string",
    "legalArea": "string",
    "description": "string",
    "complexity": "low" | "medium" | "high" | "very_high",
    "estimatedHours": number,
    "valueToClient": "string"
  },
  "costAnalysis": {
    "directCosts": {
      "lawyerHours": number,
      "hourlyRate": number,
      "totalLaborCost": number,
      "thirdPartyCosts": number,
      "courtFees": number,
      "otherCosts": number
    },
    "indirectCosts": {
      "overheadAllocation": number,
      "riskAllocation": number
    },
    "totalCost": number,
    "breakEvenPrice": number
  },
  "marketAnalysis": {
    "competitorPrices": [{
      "competitor": "string",
      "price": number,
      "positioning": "budget" | "mid" | "premium"
    }],
    "marketAverage": number,
    "priceRange": { "min": number, "max": number },
    "ourPositioning": "below_market" | "at_market" | "above_market"
  },
  "valueAnalysis": {
    "clientBenefit": "string",
    "monetaryValue": number,
    "emotionalValue": "low" | "medium" | "high",
    "urgencyFactor": number,
    "uniqueValue": ["string"]
  },
  "recommendedPricing": {
    "model": "fixed" | "hourly" | "success_fee" | "retainer" | "hybrid",
    "basePrice": number,
    "priceRange": { "min": number, "standard": number, "premium": number },
    "successFeePercent": number | null,
    "retainerMonthly": number | null,
    "justification": "string"
  },
  "pricingTiers": [{
    "tier": "essencial" | "standard" | "premium",
    "price": number,
    "includes": ["string"],
    "excludes": ["string"],
    "targetClient": "string"
  }],
  "discountPolicy": {
    "earlyPayment": { "percent": number, "condition": "string" },
    "bundleDiscount": { "percent": number, "condition": "string" },
    "loyaltyDiscount": { "percent": number, "condition": "string" }
  },
  "upsellOpportunities": [{
    "service": "string",
    "price": number,
    "conversionLikelihood": number
  }]
}`

export const CLIENT_WILLINGNESS_PROMPT = `Analise a disposição de pagamento (willingness-to-pay) de um cliente.

FORMATO JSON:
{
  "client": {
    "id": "string",
    "segment": "individual" | "sme" | "corporate" | "startup",
    "industry": "string",
    "size": "small" | "medium" | "large"
  },
  "financialIndicators": {
    "estimatedBudget": number,
    "previousSpend": number,
    "paymentHistory": "excellent" | "good" | "fair" | "poor",
    "priceElasticity": "low" | "medium" | "high"
  },
  "valuePerception": {
    "brandAwareness": "low" | "medium" | "high",
    "qualityExpectation": "low" | "medium" | "high",
    "urgency": "low" | "medium" | "high",
    "alternatives": number,
    "switchingCost": "low" | "medium" | "high"
  },
  "behavioralSignals": [{
    "signal": "string",
    "interpretation": "string",
    "wtpImpact": "positive" | "negative" | "neutral"
  }],
  "wtpEstimate": {
    "low": number,
    "medium": number,
    "high": number,
    "confidence": number,
    "factors": ["string"]
  },
  "pricingStrategy": {
    "recommendedApproach": "string",
    "anchorPrice": number,
    "targetPrice": number,
    "walkAwayPrice": number,
    "negotiationRoom": number
  },
  "riskAssessment": {
    "overpricing": { "risk": "low" | "medium" | "high", "consequence": "string" },
    "underpricing": { "risk": "low" | "medium" | "high", "consequence": "string" }
  }
}`

export const PRICING_OPTIMIZATION_PROMPT = `Otimize a estratégia de pricing para maximizar receita.

FORMATO JSON:
{
  "currentState": {
    "avgTicket": number,
    "conversionRate": number,
    "monthlyRevenue": number,
    "priceDispersion": number
  },
  "priceElasticityAnalysis": {
    "estimatedElasticity": number,
    "interpretation": "string",
    "optimalPricePoint": number,
    "demandAtOptimal": number
  },
  "segmentAnalysis": [{
    "segment": "string",
    "currentPrice": number,
    "recommendedPrice": number,
    "priceChange": number,
    "expectedVolumeChange": number,
    "expectedRevenueChange": number,
    "justification": "string"
  }],
  "bundlingStrategy": {
    "currentBundles": [{
      "name": "string",
      "components": ["string"],
      "price": number,
      "uptake": number
    }],
    "recommendedBundles": [{
      "name": "string",
      "components": ["string"],
      "individualTotal": number,
      "bundlePrice": number,
      "discount": number,
      "targetSegment": "string",
      "expectedUptake": number
    }]
  },
  "dynamicPricingOpportunities": [{
    "service": "string",
    "trigger": "string",
    "priceAdjustment": number,
    "conditions": ["string"],
    "expectedImpact": number
  }],
  "revenueImpact": {
    "baselineRevenue": number,
    "projectedRevenue": number,
    "incrementalRevenue": number,
    "incrementalPercent": number,
    "implementationCost": number,
    "netBenefit": number,
    "paybackPeriod": "string"
  },
  "implementationPlan": [{
    "phase": number,
    "action": "string",
    "timeline": "string",
    "risk": "low" | "medium" | "high",
    "mitigation": "string"
  }]
}`

export const COMPETITOR_PRICING_PROMPT = `Analise o pricing da concorrência.

FORMATO JSON:
{
  "market": "string",
  "serviceCategory": "string",
  "competitors": [{
    "name": "string",
    "positioning": "budget" | "mid-market" | "premium" | "luxury",
    "marketShare": number,
    "services": [{
      "service": "string",
      "price": number,
      "pricingModel": "fixed" | "hourly" | "success_fee" | "retainer",
      "includes": ["string"]
    }],
    "strengths": ["string"],
    "weaknesses": ["string"],
    "recentChanges": "string"
  }],
  "pricePositioning": {
    "ourPosition": "string",
    "relativeToMarket": number,
    "competitiveAdvantages": ["string"],
    "vulnerabilities": ["string"]
  },
  "marketTrends": [{
    "trend": "string",
    "direction": "increasing" | "stable" | "decreasing",
    "impact": "string",
    "ourResponse": "string"
  }],
  "priceGaps": [{
    "opportunity": "string",
    "currentGap": "string",
    "potentialRevenue": number,
    "feasibility": "high" | "medium" | "low"
  }],
  "recommendations": [{
    "action": "string",
    "rationale": "string",
    "expectedOutcome": "string",
    "priority": "high" | "medium" | "low"
  }]
}`

// =============================================================================
// QUOTE GENERATION PROMPTS
// =============================================================================

export const QUOTE_GENERATOR_PROMPT = `Gere uma proposta de honorários personalizada.

FORMATO JSON:
{
  "proposal": {
    "id": "string",
    "date": "string",
    "validUntil": "string",
    "clientName": "string"
  },
  "matterDescription": {
    "title": "string",
    "summary": "string",
    "objectives": ["string"],
    "scope": "string",
    "exclusions": ["string"]
  },
  "pricingOptions": [{
    "option": "A" | "B" | "C",
    "name": "string",
    "model": "fixed" | "hourly" | "success_fee" | "hybrid",
    "totalFee": number,
    "breakdown": [{
      "item": "string",
      "description": "string",
      "amount": number
    }],
    "paymentSchedule": [{
      "milestone": "string",
      "percentage": number,
      "amount": number,
      "dueDate": "string"
    }],
    "includes": ["string"],
    "additionalCosts": [{
      "item": "string",
      "estimated": number,
      "notes": "string"
    }]
  }],
  "recommendedOption": "A" | "B" | "C",
  "recommendationReason": "string",
  "termsAndConditions": ["string"],
  "nextSteps": ["string"],
  "callToAction": "string"
}`

export const RETAINER_PROPOSAL_PROMPT = `Crie proposta de retainer (avença) mensal.

FORMATO JSON:
{
  "proposal": {
    "title": "string",
    "clientName": "string",
    "startDate": "string",
    "duration": "string"
  },
  "executiveSummary": "string",
  "retainerPackages": [{
    "name": "string",
    "tier": "starter" | "professional" | "enterprise",
    "monthlyFee": number,
    "annualFee": number,
    "annualDiscount": number,
    "includedHours": number,
    "additionalHourRate": number,
    "includedServices": [{
      "service": "string",
      "quantity": number | "unlimited",
      "value": number
    }],
    "excludedServices": ["string"],
    "responseTime": {
      "standard": "string",
      "urgent": "string"
    },
    "dedicatedContact": boolean,
    "quarterlyReview": boolean,
    "bestFor": "string"
  }],
  "valueProposition": {
    "totalAnnualValue": number,
    "effectiveDiscount": number,
    "additionalBenefits": ["string"],
    "riskMitigation": "string"
  },
  "comparisonToAdHoc": {
    "estimatedAdHocCost": number,
    "retainerCost": number,
    "savings": number,
    "savingsPercent": number
  },
  "implementation": {
    "onboarding": "string",
    "communication": "string",
    "reporting": "string"
  },
  "terms": {
    "paymentTerms": "string",
    "cancellation": "string",
    "rollover": "string"
  }
}`

// =============================================================================
// DISCOUNT & NEGOTIATION PROMPTS
// =============================================================================

export const DISCOUNT_ANALYSIS_PROMPT = `Analise impacto de desconto e negocie strategicamente.

FORMATO JSON:
{
  "originalPrice": number,
  "requestedDiscount": number,
  "discountedPrice": number,
  "discountPercent": number,
  "marginAnalysis": {
    "originalMargin": number,
    "newMargin": number,
    "marginErosion": number,
    "breakEvenVolume": number
  },
  "clientValue": {
    "currentLTV": number,
    "projectedLTV": number,
    "strategicValue": "low" | "medium" | "high",
    "referralPotential": "low" | "medium" | "high"
  },
  "recommendation": {
    "approve": boolean,
    "maxDiscount": number,
    "conditions": ["string"],
    "alternatives": [{
      "option": "string",
      "description": "string",
      "clientBenefit": "string",
      "ourBenefit": "string"
    }]
  },
  "negotiationScript": {
    "opening": "string",
    "valueReinforcement": ["string"],
    "counterOffer": "string",
    "walkAwayPoint": "string",
    "closingTechniques": ["string"]
  },
  "precedentWarning": {
    "risk": "low" | "medium" | "high",
    "potentialImpact": "string",
    "mitigation": "string"
  }
}`

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get OAB minimum fee reference (Portugal)
 */
export function getOABMinimumFees(): Record<string, { min: number; typical: number }> {
  return {
    consulta_simples: { min: 50, typical: 100 },
    consulta_especializada: { min: 100, typical: 200 },
    parecer_simples: { min: 300, typical: 500 },
    parecer_complexo: { min: 500, typical: 1500 },
    contrato_simples: { min: 200, typical: 500 },
    contrato_complexo: { min: 500, typical: 2000 },
    acao_judicial_simples: { min: 1000, typical: 3000 },
    acao_judicial_complexa: { min: 3000, typical: 10000 },
    inventario: { min: 2000, typical: 5000 },
    divorcio_consensual: { min: 1000, typical: 2000 },
    divorcio_litigioso: { min: 2000, typical: 5000 },
    constituicao_empresa: { min: 500, typical: 1500 },
    due_diligence: { min: 2000, typical: 10000 },
  }
}

/**
 * Calculate success fee based on value recovered
 */
export function calculateSuccessFee(
  valueRecovered: number,
  tier: 'standard' | 'premium' | 'complex'
): { feePercent: number; estimatedFee: number } {
  const rates = {
    standard: 0.15, // 15%
    premium: 0.20,  // 20%
    complex: 0.25,  // 25%
  }

  const feePercent = rates[tier]
  const estimatedFee = valueRecovered * feePercent

  return { feePercent, estimatedFee }
}

/**
 * Get pricing model recommendations by case type
 */
export function getRecommendedPricingModel(
  caseType: string
): { model: string; reason: string } {
  const recommendations: Record<string, { model: string; reason: string }> = {
    consultoria: {
      model: 'fixed',
      reason: 'Previsibilidade para cliente e escritório',
    },
    contencioso: {
      model: 'hybrid',
      reason: 'Honorários fixos + êxito para alinhar interesses',
    },
    retainer: {
      model: 'retainer',
      reason: 'Receita recorrente previsível',
    },
    projeto: {
      model: 'fixed',
      reason: 'Escopo bem definido permite preço fechado',
    },
    urgencia: {
      model: 'hourly',
      reason: 'Dificuldade de prever escopo em casos urgentes',
    },
    transacional: {
      model: 'fixed',
      reason: 'Serviços padronizáveis com preço de mercado',
    },
  }

  return recommendations[caseType] || { model: 'fixed', reason: 'Modelo padrão para serviços jurídicos' }
}

/**
 * Calculate price elasticity impact
 */
export function calculateElasticityImpact(
  currentPrice: number,
  newPrice: number,
  elasticity: number
): { demandChange: number; revenueChange: number } {
  const priceChange = (newPrice - currentPrice) / currentPrice
  const demandChange = -elasticity * priceChange
  const revenueChange = (1 + priceChange) * (1 + demandChange) - 1

  return { demandChange, revenueChange }
}
