/**
 * Market Intelligence Agent Prompts
 * Prompts for market research, competitive analysis, and trend detection
 */

// =============================================================================
// SYSTEM PROMPT
// =============================================================================

export const MARKET_INTEL_AGENT_SYSTEM_PROMPT = `Você é o Agente de Market Intelligence do escritório Garcez Palha Advogados, especializado em:
- Análise de mercado jurídico português
- Monitorização da concorrência
- Identificação de tendências e oportunidades
- Benchmarking de performance
- Análise de novos nichos de mercado

CONTEXTO DO ESCRITÓRIO:
- Áreas: Imobiliário, Família, Empresarial, Trabalhista, Consumidor
- Mercado: Lisboa, Portugal
- Tamanho: Boutique law firm
- Diferencial: Tecnologia + atendimento personalizado

FONTES DE INTELIGÊNCIA:
1. Dados públicos (registos, tribunais)
2. Notícias do setor jurídico
3. Redes sociais e presença online
4. Dados de mercado imobiliário
5. Indicadores económicos
6. Legislação e jurisprudência

ÁREAS DE FOCO:
1. Mercado imobiliário Lisboa
2. M&A e startups
3. Direito do consumidor digital
4. Direito do trabalho remoto
5. Família e sucessões internacionais

ENTREGÁVEIS:
- Relatórios de mercado semanais
- Alertas de oportunidade
- Análises competitivas
- Previsões de demanda
- Mapeamento de nichos

Responda sempre em português de Portugal.
Use dados factuais quando disponíveis.
Forneça insights acionáveis.`

// =============================================================================
// MARKET ANALYSIS PROMPTS
// =============================================================================

export const MARKET_OVERVIEW_PROMPT = `Gere uma visão geral do mercado jurídico.

FORMATO JSON:
{
  "period": { "start": "string", "end": "string" },
  "marketSize": {
    "totalValue": number,
    "growth": number,
    "segments": [{
      "name": "string",
      "value": number,
      "growth": number,
      "share": number
    }]
  },
  "keyPlayers": [{
    "name": "string",
    "type": "large_firm" | "boutique" | "solo" | "big_four",
    "marketShare": number,
    "specialties": ["string"],
    "recentActivity": "string"
  }],
  "demandIndicators": [{
    "indicator": "string",
    "value": number,
    "trend": "increasing" | "stable" | "decreasing",
    "implication": "string"
  }],
  "supplyIndicators": {
    "totalLawyers": number,
    "newAdmissions": number,
    "firmDensity": number,
    "avgRatesChange": number
  },
  "economicFactors": [{
    "factor": "string",
    "impact": "positive" | "negative" | "neutral",
    "affectedAreas": ["string"],
    "outlook": "string"
  }],
  "opportunities": [{
    "opportunity": "string",
    "potential": "high" | "medium" | "low",
    "timeframe": "string",
    "requiredAction": "string"
  }],
  "threats": [{
    "threat": "string",
    "severity": "high" | "medium" | "low",
    "probability": number,
    "mitigation": "string"
  }],
  "outlook": {
    "shortTerm": "string",
    "mediumTerm": "string",
    "longTerm": "string"
  }
}`

export const COMPETITIVE_ANALYSIS_PROMPT = `Analise a concorrência detalhadamente.

FORMATO JSON:
{
  "analysisDate": "string",
  "ourPosition": {
    "strengths": ["string"],
    "weaknesses": ["string"],
    "marketPosition": "leader" | "challenger" | "follower" | "nicher",
    "uniqueSellingPoints": ["string"]
  },
  "competitors": [{
    "name": "string",
    "type": "direct" | "indirect" | "potential",
    "size": "large" | "medium" | "small",
    "profile": {
      "founded": number,
      "headcount": number,
      "offices": ["string"],
      "specialties": ["string"]
    },
    "strategy": {
      "positioning": "string",
      "targetMarket": "string",
      "pricingStrategy": "premium" | "value" | "budget",
      "growthStrategy": "string"
    },
    "onlinePresence": {
      "website": { "quality": number, "seo": number },
      "socialMedia": { "platforms": ["string"], "engagement": number },
      "contentStrategy": "string",
      "reviews": { "avgRating": number, "count": number }
    },
    "strengths": ["string"],
    "weaknesses": ["string"],
    "recentMoves": ["string"],
    "threatLevel": "high" | "medium" | "low"
  }],
  "competitiveMap": {
    "axes": { "x": "string", "y": "string" },
    "positions": [{
      "competitor": "string",
      "x": number,
      "y": number
    }],
    "whiteSpaces": ["string"]
  },
  "battleCards": [{
    "competitor": "string",
    "whenToCompete": ["string"],
    "whenToAvoid": ["string"],
    "ourAdvantages": ["string"],
    "theirAdvantages": ["string"],
    "neutralizeScript": "string"
  }],
  "recommendations": [{
    "area": "string",
    "action": "string",
    "priority": "high" | "medium" | "low",
    "expectedOutcome": "string"
  }]
}`

export const TREND_ANALYSIS_PROMPT = `Identifique e analise tendências de mercado.

FORMATO JSON:
{
  "analysisDate": "string",
  "macroTrends": [{
    "trend": "string",
    "category": "technology" | "regulation" | "social" | "economic" | "demographic",
    "status": "emerging" | "growing" | "mature" | "declining",
    "timeframe": "string",
    "impact": {
      "magnitude": "high" | "medium" | "low",
      "areas": ["string"],
      "description": "string"
    },
    "opportunities": ["string"],
    "threats": ["string"]
  }],
  "industryTrends": [{
    "trend": "string",
    "relevantAreas": ["string"],
    "adoptionRate": number,
    "leaders": ["string"],
    "barriers": ["string"],
    "ourPosition": "ahead" | "on_par" | "behind"
  }],
  "clientBehaviorTrends": [{
    "trend": "string",
    "segment": "string",
    "driver": "string",
    "implication": "string",
    "adaptationNeeded": "string"
  }],
  "regulatoryTrends": [{
    "development": "string",
    "expectedDate": "string",
    "impact": "string",
    "preparationNeeded": "string"
  }],
  "technologyTrends": [{
    "technology": "string",
    "maturity": "nascent" | "emerging" | "mainstream" | "commoditized",
    "relevanceToLaw": "high" | "medium" | "low",
    "adoptionRecommendation": "string",
    "investmentLevel": "high" | "medium" | "low" | "none"
  }],
  "trendImpactMatrix": [{
    "trend": "string",
    "probability": number,
    "impact": number,
    "urgency": "immediate" | "short_term" | "medium_term" | "long_term",
    "response": "string"
  }],
  "strategicImplications": {
    "serviceOffering": ["string"],
    "targetMarket": ["string"],
    "capabilities": ["string"],
    "investments": ["string"]
  }
}`

// =============================================================================
// OPPORTUNITY IDENTIFICATION PROMPTS
// =============================================================================

export const NICHE_ANALYSIS_PROMPT = `Analise potenciais nichos de mercado.

FORMATO JSON:
{
  "analysisDate": "string",
  "evaluatedNiches": [{
    "niche": "string",
    "description": "string",
    "marketSize": {
      "current": number,
      "projected": number,
      "cagr": number
    },
    "characteristics": {
      "complexity": "low" | "medium" | "high",
      "profitability": "low" | "medium" | "high",
      "competition": "low" | "medium" | "high",
      "barrierToEntry": "low" | "medium" | "high"
    },
    "targetClients": {
      "profile": "string",
      "estimatedNumber": number,
      "avgCaseValue": number,
      "acquisitionChannels": ["string"]
    },
    "requiredCapabilities": {
      "expertise": ["string"],
      "technology": ["string"],
      "partnerships": ["string"],
      "certifications": ["string"]
    },
    "competitiveAnalysis": {
      "existingPlayers": number,
      "mainCompetitors": ["string"],
      "ourAdvantage": "string"
    },
    "financialProjection": {
      "investmentNeeded": number,
      "timeToBreakeven": number,
      "yearOneRevenue": number,
      "yearThreeRevenue": number,
      "margin": number
    },
    "risks": [{
      "risk": "string",
      "probability": "high" | "medium" | "low",
      "impact": "high" | "medium" | "low",
      "mitigation": "string"
    }],
    "score": number,
    "recommendation": "pursue" | "monitor" | "avoid"
  }],
  "prioritization": [{
    "rank": number,
    "niche": "string",
    "rationale": "string",
    "nextSteps": ["string"]
  }]
}`

export const OPPORTUNITY_SCANNER_PROMPT = `Identifique oportunidades de mercado atuais.

FORMATO JSON:
{
  "scanDate": "string",
  "opportunities": [{
    "id": "string",
    "type": "regulatory_change" | "market_event" | "competitor_move" | "technology" | "economic" | "client_need",
    "title": "string",
    "description": "string",
    "source": "string",
    "urgency": "immediate" | "short_term" | "medium_term",
    "relevantAreas": ["string"],
    "potentialRevenue": {
      "estimate": number,
      "confidence": "high" | "medium" | "low"
    },
    "actionRequired": {
      "actions": ["string"],
      "resources": ["string"],
      "timeline": "string",
      "investment": number
    },
    "risks": ["string"],
    "score": number
  }],
  "immediateActions": [{
    "opportunity": "string",
    "action": "string",
    "owner": "string",
    "deadline": "string"
  }],
  "watchList": [{
    "item": "string",
    "trigger": "string",
    "potentialAction": "string"
  }],
  "missedOpportunities": [{
    "opportunity": "string",
    "reason": "string",
    "lesson": "string"
  }]
}`

// =============================================================================
// BENCHMARKING PROMPTS
// =============================================================================

export const BENCHMARKING_PROMPT = `Compare nossa performance com o mercado.

FORMATO JSON:
{
  "period": { "start": "string", "end": "string" },
  "benchmarkGroup": {
    "description": "string",
    "firms": ["string"],
    "selectionCriteria": "string"
  },
  "financialMetrics": [{
    "metric": "string",
    "ourValue": number,
    "marketAvg": number,
    "topQuartile": number,
    "ourPosition": "top" | "above_avg" | "average" | "below_avg" | "bottom",
    "gap": number,
    "improvement": "string"
  }],
  "operationalMetrics": [{
    "metric": "string",
    "ourValue": number,
    "marketAvg": number,
    "topQuartile": number,
    "ourPosition": "top" | "above_avg" | "average" | "below_avg" | "bottom"
  }],
  "marketingMetrics": [{
    "metric": "string",
    "ourValue": number,
    "marketAvg": number,
    "topQuartile": number,
    "ourPosition": "top" | "above_avg" | "average" | "below_avg" | "bottom"
  }],
  "clientMetrics": [{
    "metric": "string",
    "ourValue": number,
    "marketAvg": number,
    "topQuartile": number
  }],
  "gapAnalysis": [{
    "area": "string",
    "currentGap": number,
    "targetGap": number,
    "priority": "high" | "medium" | "low",
    "actionPlan": "string"
  }],
  "bestPractices": [{
    "practice": "string",
    "source": "string",
    "benefit": "string",
    "applicability": "high" | "medium" | "low",
    "implementation": "string"
  }],
  "recommendations": [{
    "area": "string",
    "recommendation": "string",
    "expectedImprovement": "string",
    "effort": "low" | "medium" | "high"
  }]
}`

// =============================================================================
// REPORTING PROMPTS
// =============================================================================

export const WEEKLY_INTEL_REPORT_PROMPT = `Gere relatório semanal de inteligência de mercado.

FORMATO JSON:
{
  "period": { "weekNumber": number, "start": "string", "end": "string" },
  "executiveSummary": "string",
  "marketPulse": {
    "sentiment": "bullish" | "neutral" | "bearish",
    "keyDevelopments": ["string"],
    "marketMoverEvents": [{
      "event": "string",
      "impact": "string",
      "ourAction": "string"
    }]
  },
  "competitorWatch": [{
    "competitor": "string",
    "activity": "string",
    "significance": "high" | "medium" | "low",
    "ourResponse": "string"
  }],
  "opportunityAlerts": [{
    "opportunity": "string",
    "source": "string",
    "urgency": "high" | "medium" | "low",
    "recommendedAction": "string"
  }],
  "regulatoryUpdates": [{
    "update": "string",
    "area": "string",
    "effectiveDate": "string",
    "impact": "string"
  }],
  "economicIndicators": [{
    "indicator": "string",
    "value": number,
    "change": number,
    "relevance": "string"
  }],
  "mediaMonitoring": {
    "mentions": [{
      "outlet": "string",
      "headline": "string",
      "sentiment": "positive" | "neutral" | "negative"
    }],
    "competitorMentions": [{
      "competitor": "string",
      "mentions": number,
      "notable": "string"
    }]
  },
  "nextWeekOutlook": {
    "eventsToWatch": ["string"],
    "anticipatedOpportunities": ["string"],
    "potentialThreats": ["string"]
  }
}`

export const QUARTERLY_MARKET_REPORT_PROMPT = `Gere relatório trimestral de mercado.

FORMATO JSON:
{
  "period": { "quarter": number, "year": number },
  "executiveSummary": "string",
  "marketPerformance": {
    "overallGrowth": number,
    "sectorPerformance": [{
      "sector": "string",
      "growth": number,
      "outlook": "string"
    }],
    "demandTrends": ["string"]
  },
  "competitiveLandscape": {
    "majorMoves": [{
      "firm": "string",
      "move": "string",
      "impact": "string"
    }],
    "marketShareChanges": [{
      "firm": "string",
      "change": number
    }],
    "newEntrants": ["string"],
    "exits": ["string"]
  },
  "clientInsights": {
    "behaviorChanges": ["string"],
    "emergingNeeds": ["string"],
    "satisfactionTrends": "string"
  },
  "technologyAdoption": {
    "adoptionRates": [{
      "technology": "string",
      "adoption": number,
      "trend": "accelerating" | "stable" | "slowing"
    }],
    "emergingTools": ["string"]
  },
  "regulatoryEnvironment": {
    "majorChanges": ["string"],
    "upcomingChanges": ["string"],
    "compliance": "string"
  },
  "strategicRecommendations": [{
    "area": "string",
    "recommendation": "string",
    "priority": "high" | "medium" | "low",
    "timeline": "string"
  }],
  "outlook": {
    "nextQuarter": "string",
    "year": "string",
    "keyRisks": ["string"],
    "keyOpportunities": ["string"]
  }
}`

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get key economic indicators for Portugal
 */
export function getPortugalEconomicIndicators(): Array<{
  indicator: string
  relevance: string
}> {
  return [
    { indicator: 'PIB', relevance: 'Atividade económica geral' },
    { indicator: 'Taxa de desemprego', relevance: 'Direito do trabalho' },
    { indicator: 'Índice de preços imobiliários', relevance: 'Direito imobiliário' },
    { indicator: 'Taxa de juro Euribor', relevance: 'Crédito habitação' },
    { indicator: 'Inflação', relevance: 'Poder de compra' },
    { indicator: 'Número de empresas constituídas', relevance: 'Direito empresarial' },
    { indicator: 'Taxa de divórcios', relevance: 'Direito de família' },
    { indicator: 'Volume de transações imobiliárias', relevance: 'Direito imobiliário' },
    { indicator: 'Índice de confiança do consumidor', relevance: 'Direito do consumidor' },
    { indicator: 'Investimento estrangeiro', relevance: 'Golden Visa, M&A' },
  ]
}

/**
 * Get key market segments
 */
export function getMarketSegments(): Array<{
  segment: string
  description: string
  growthOutlook: string
}> {
  return [
    {
      segment: 'Imobiliário Residencial',
      description: 'Compra, venda, arrendamento de imóveis residenciais',
      growthOutlook: 'Estável com pressão de preços',
    },
    {
      segment: 'Imobiliário Comercial',
      description: 'Transações e contratos de imóveis comerciais',
      growthOutlook: 'Recuperação pós-pandemia',
    },
    {
      segment: 'Startups e Tecnologia',
      description: 'Constituição, investimento, propriedade intelectual',
      growthOutlook: 'Alto crescimento',
    },
    {
      segment: 'Família Internacional',
      description: 'Divórcios e sucessões com elemento internacional',
      growthOutlook: 'Crescente com expatriados',
    },
    {
      segment: 'Consumidor Digital',
      description: 'Proteção do consumidor em transações online',
      growthOutlook: 'Alto crescimento',
    },
    {
      segment: 'Trabalho Remoto',
      description: 'Contratos, compliance, fiscalidade do trabalho remoto',
      growthOutlook: 'Novo e em expansão',
    },
  ]
}

/**
 * Get competitive intelligence sources
 */
export function getIntelSources(): Array<{
  source: string
  type: string
  frequency: string
}> {
  return [
    { source: 'Ordem dos Advogados', type: 'Oficial', frequency: 'Mensal' },
    { source: 'Jornal de Negócios', type: 'Imprensa', frequency: 'Diário' },
    { source: 'ECO', type: 'Imprensa', frequency: 'Diário' },
    { source: 'LinkedIn', type: 'Social', frequency: 'Semanal' },
    { source: 'CITIUS', type: 'Oficial', frequency: 'Contínuo' },
    { source: 'INE', type: 'Estatísticas', frequency: 'Mensal' },
    { source: 'Banco de Portugal', type: 'Financeiro', frequency: 'Mensal' },
    { source: 'Google Trends', type: 'Digital', frequency: 'Semanal' },
    { source: 'Clutch/Legal 500', type: 'Rankings', frequency: 'Anual' },
    { source: 'Diário da República', type: 'Oficial', frequency: 'Diário' },
  ]
}

/**
 * Calculate market attractiveness score
 */
export function calculateMarketAttractiveness(factors: {
  size: number // 1-10
  growth: number // 1-10
  profitability: number // 1-10
  competition: number // 1-10 (lower is better)
  barrierToEntry: number // 1-10 (lower is easier)
  ourFit: number // 1-10
}): { score: number; recommendation: string } {
  const weights = {
    size: 0.15,
    growth: 0.20,
    profitability: 0.20,
    competition: 0.15,
    barrierToEntry: 0.10,
    ourFit: 0.20,
  }

  const normalizedCompetition = 11 - factors.competition
  const normalizedBarrier = 11 - factors.barrierToEntry

  const score =
    factors.size * weights.size +
    factors.growth * weights.growth +
    factors.profitability * weights.profitability +
    normalizedCompetition * weights.competition +
    normalizedBarrier * weights.barrierToEntry +
    factors.ourFit * weights.ourFit

  const recommendation =
    score >= 8 ? 'Investir fortemente' :
    score >= 6 ? 'Desenvolver gradualmente' :
    score >= 4 ? 'Monitorar' :
    'Evitar'

  return { score: Math.round(score * 10) / 10, recommendation }
}
