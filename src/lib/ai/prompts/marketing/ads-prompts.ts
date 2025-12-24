/**
 * Ads Agent Prompts
 * Prompts for paid advertising campaign management
 */

// =============================================================================
// SYSTEM PROMPT
// =============================================================================

export const ADS_AGENT_SYSTEM_PROMPT = `Você é o Agente de Ads do escritório Garcez Palha Advogados, especializado em:
- Gestão de campanhas Google Ads e Meta Ads (Facebook/Instagram)
- Otimização de ROI e custo por lead
- Segmentação de público para serviços jurídicos
- Análise de performance e recomendações

CONTEXTO DO ESCRITÓRIO:
- Áreas: Imobiliário, Família, Empresarial, Trabalhista, Consumidor
- Público: Pessoas físicas e empresas em Lisboa
- Objetivo: Geração de leads qualificados com custo otimizado
- Compliance: Regulamentação OAB sobre publicidade advocatícia

REGRAS DE PUBLICIDADE JURÍDICA (OAB):
1. Proibido mercantilização da profissão
2. Proibido captação de clientela (ambulância chasing)
3. Permitido informar especialidades e qualificações
4. Tom deve ser informativo, não comercial agressivo
5. Proibido garantir resultados de processos
6. Proibido usar expressões sensacionalistas

PRINCÍPIOS DE OTIMIZAÇÃO:
1. Foco em palavras-chave de alta intenção (advogado + área + cidade)
2. Negative keywords para eliminar tráfego não qualificado
3. Segmentação geográfica precisa (Lisboa e região)
4. Remarketing para visitantes do site
5. A/B testing contínuo de anúncios
6. Quality Score como métrica chave

Responda sempre em português de Portugal.
Forneça análises baseadas em dados quando disponíveis.
Priorize ROI e qualidade dos leads sobre volume.`

// =============================================================================
// CAMPAIGN CREATION PROMPTS
// =============================================================================

export const GOOGLE_ADS_CAMPAIGN_PROMPT = `Crie uma campanha Google Ads para o escritório Garcez Palha Advogados.

ESTRUTURA DA CAMPANHA:
1. Nome da campanha (descritivo e organizado)
2. Objetivo (leads, tráfego, awareness)
3. Grupos de anúncios (organizados por tema/área)
4. Keywords por grupo (incluindo match types)
5. Negative keywords
6. Anúncios (headlines, descriptions, CTAs)
7. Extensões recomendadas

FORMATO JSON:
{
  "campaignName": "string",
  "objective": "leads" | "traffic" | "awareness",
  "budget": { "daily": number, "monthly": number },
  "targeting": {
    "locations": ["string"],
    "languages": ["string"],
    "devices": ["all" | "mobile" | "desktop"]
  },
  "adGroups": [{
    "name": "string",
    "keywords": [{
      "keyword": "string",
      "matchType": "exact" | "phrase" | "broad"
    }],
    "negativeKeywords": ["string"],
    "ads": [{
      "headlines": ["string"] (max 30 chars each, 3-15 headlines),
      "descriptions": ["string"] (max 90 chars each, 2-4 descriptions),
      "finalUrl": "string",
      "displayPath": ["string", "string"]
    }]
  }],
  "extensions": {
    "sitelinks": [{ "text": "string", "url": "string" }],
    "callouts": ["string"],
    "structuredSnippets": { "header": "string", "values": ["string"] },
    "callExtension": "string"
  },
  "expectedMetrics": {
    "estimatedCPC": number,
    "estimatedCTR": number,
    "estimatedConversionRate": number
  }
}`

export const META_ADS_CAMPAIGN_PROMPT = `Crie uma campanha Meta Ads (Facebook/Instagram) para o escritório Garcez Palha Advogados.

ESTRUTURA DA CAMPANHA:
1. Nome da campanha
2. Objetivo (leads, tráfego, awareness, engagement)
3. Conjuntos de anúncios com segmentação
4. Criativos (copy, visual guidelines)
5. Orçamento e lances

FORMATO JSON:
{
  "campaignName": "string",
  "objective": "leads" | "traffic" | "awareness" | "engagement",
  "budget": { "daily": number, "monthly": number },
  "adSets": [{
    "name": "string",
    "targeting": {
      "ageRange": { "min": number, "max": number },
      "genders": ["all" | "male" | "female"],
      "locations": [{
        "type": "city" | "region",
        "name": "string",
        "radius": number
      }],
      "interests": ["string"],
      "behaviors": ["string"],
      "customAudiences": ["string"],
      "lookalike": { "source": "string", "percentage": number }
    },
    "placements": ["feed" | "stories" | "reels" | "messenger" | "automatic"],
    "ads": [{
      "name": "string",
      "format": "image" | "video" | "carousel" | "collection",
      "primaryText": "string" (max 125 chars visible),
      "headline": "string" (max 40 chars),
      "description": "string",
      "callToAction": "LEARN_MORE" | "CONTACT_US" | "GET_QUOTE" | "SEND_MESSAGE",
      "visualGuidelines": "string",
      "landingPage": "string"
    }]
  }],
  "optimization": {
    "bidStrategy": "lowest_cost" | "cost_cap" | "bid_cap",
    "targetCPA": number,
    "conversionWindow": "1_day" | "7_day"
  },
  "expectedMetrics": {
    "estimatedCPM": number,
    "estimatedCTR": number,
    "estimatedCPL": number
  }
}`

// =============================================================================
// OPTIMIZATION PROMPTS
// =============================================================================

export const CAMPAIGN_OPTIMIZATION_PROMPT = `Analise a performance da campanha e forneça recomendações de otimização.

ANÁLISE REQUERIDA:
1. Avaliação de métricas atuais vs benchmarks
2. Identificação de problemas e oportunidades
3. Recomendações prioritizadas
4. Impacto esperado de cada otimização

FORMATO JSON:
{
  "overallScore": number (1-100),
  "healthStatus": "excellent" | "good" | "needs_attention" | "critical",
  "keyFindings": [{
    "type": "issue" | "opportunity",
    "severity": "high" | "medium" | "low",
    "description": "string",
    "metric": "string",
    "currentValue": number,
    "benchmarkValue": number
  }],
  "recommendations": [{
    "priority": 1-5,
    "action": "string",
    "rationale": "string",
    "expectedImpact": {
      "metric": "string",
      "improvement": "string"
    },
    "effort": "low" | "medium" | "high",
    "implementation": ["string"]
  }],
  "budgetRecommendations": {
    "currentSpend": number,
    "recommendedSpend": number,
    "reallocation": [{
      "from": "string",
      "to": "string",
      "amount": number,
      "reason": "string"
    }]
  },
  "nextReviewDate": "string"
}`

export const KEYWORD_ANALYSIS_PROMPT = `Analise as keywords da campanha e sugira otimizações.

ANÁLISE REQUERIDA:
1. Performance por keyword
2. Keywords a adicionar
3. Keywords a pausar/remover
4. Negative keywords a adicionar
5. Match type optimization

FORMATO JSON:
{
  "summary": {
    "totalKeywords": number,
    "performingWell": number,
    "needsAttention": number,
    "toRemove": number
  },
  "keywordAnalysis": [{
    "keyword": "string",
    "matchType": "string",
    "impressions": number,
    "clicks": number,
    "ctr": number,
    "cpc": number,
    "conversions": number,
    "conversionRate": number,
    "qualityScore": number,
    "status": "keep" | "optimize" | "pause" | "remove",
    "recommendation": "string"
  }],
  "newKeywords": [{
    "keyword": "string",
    "matchType": "exact" | "phrase" | "broad",
    "rationale": "string",
    "estimatedVolume": number,
    "estimatedCPC": number
  }],
  "negativeKeywords": [{
    "keyword": "string",
    "level": "campaign" | "adgroup",
    "reason": "string"
  }],
  "matchTypeChanges": [{
    "keyword": "string",
    "currentMatchType": "string",
    "suggestedMatchType": "string",
    "reason": "string"
  }]
}`

export const AD_COPY_OPTIMIZATION_PROMPT = `Analise e otimize os textos dos anúncios.

ANÁLISE REQUERIDA:
1. Performance atual dos anúncios
2. A/B test insights
3. Novos anúncios sugeridos
4. Best practices aplicadas

FORMATO JSON:
{
  "currentAdsAnalysis": [{
    "adId": "string",
    "headline": "string",
    "description": "string",
    "ctr": number,
    "conversionRate": number,
    "qualityScore": number,
    "status": "top_performer" | "average" | "underperforming",
    "insights": ["string"]
  }],
  "abTestResults": [{
    "testName": "string",
    "winner": "string",
    "loser": "string",
    "metric": "string",
    "improvement": number,
    "confidence": number
  }],
  "newAds": [{
    "platform": "google" | "meta",
    "headlines": ["string"],
    "descriptions": ["string"],
    "rationale": "string",
    "testingPlan": "string"
  }],
  "bestPractices": [{
    "practice": "string",
    "currentStatus": "applied" | "missing" | "partial",
    "recommendation": "string"
  }]
}`

// =============================================================================
// AUDIENCE PROMPTS
// =============================================================================

export const AUDIENCE_ANALYSIS_PROMPT = `Analise o público das campanhas e sugira melhorias de segmentação.

ANÁLISE REQUERIDA:
1. Performance por segmento demográfico
2. Performance por interesse/comportamento
3. Oportunidades de expansão
4. Segmentos a excluir

FORMATO JSON:
{
  "demographicPerformance": [{
    "segment": "string",
    "impressions": number,
    "conversions": number,
    "conversionRate": number,
    "cpl": number,
    "recommendation": "increase" | "maintain" | "decrease" | "exclude"
  }],
  "interestPerformance": [{
    "interest": "string",
    "relevanceScore": number,
    "conversions": number,
    "cpl": number,
    "recommendation": "string"
  }],
  "expansionOpportunities": [{
    "audienceType": "interest" | "lookalike" | "custom",
    "description": "string",
    "estimatedReach": number,
    "expectedCPL": number,
    "priority": "high" | "medium" | "low"
  }],
  "exclusions": [{
    "segment": "string",
    "reason": "string",
    "expectedSavings": number
  }],
  "remarketing": {
    "segments": [{
      "name": "string",
      "definition": "string",
      "estimatedSize": number,
      "strategy": "string"
    }],
    "recommendations": ["string"]
  }
}`

// =============================================================================
// BUDGET PROMPTS
// =============================================================================

export const BUDGET_ALLOCATION_PROMPT = `Analise e otimize a alocação de orçamento entre campanhas.

FORMATO JSON:
{
  "totalBudget": number,
  "currentAllocation": [{
    "campaign": "string",
    "platform": "google" | "meta",
    "budget": number,
    "percentage": number,
    "roas": number,
    "cpl": number
  }],
  "recommendedAllocation": [{
    "campaign": "string",
    "currentBudget": number,
    "recommendedBudget": number,
    "change": number,
    "changePercent": number,
    "rationale": "string",
    "expectedImpact": "string"
  }],
  "newCampaignsBudget": [{
    "proposedCampaign": "string",
    "suggestedBudget": number,
    "expectedROAS": number,
    "rationale": "string"
  }],
  "scalingOpportunities": [{
    "campaign": "string",
    "currentSpend": number,
    "headroom": number,
    "confidence": "high" | "medium" | "low",
    "constraints": ["string"]
  }],
  "seasonalAdjustments": [{
    "period": "string",
    "recommendation": "increase" | "decrease" | "maintain",
    "adjustment": number,
    "reason": "string"
  }]
}`

// =============================================================================
// REPORTING PROMPTS
// =============================================================================

export const WEEKLY_ADS_REPORT_PROMPT = `Gere um relatório semanal de performance das campanhas pagas.

FORMATO JSON:
{
  "period": { "start": "string", "end": "string" },
  "executiveSummary": "string",
  "overallMetrics": {
    "totalSpend": number,
    "totalImpressions": number,
    "totalClicks": number,
    "totalConversions": number,
    "averageCPC": number,
    "averageCPL": number,
    "overallROAS": number,
    "weekOverWeek": {
      "spend": number,
      "conversions": number,
      "cpl": number
    }
  },
  "platformBreakdown": [{
    "platform": "google" | "meta",
    "spend": number,
    "conversions": number,
    "cpl": number,
    "roas": number,
    "highlights": ["string"],
    "concerns": ["string"]
  }],
  "topPerformers": [{
    "type": "campaign" | "adgroup" | "ad" | "keyword",
    "name": "string",
    "metric": "string",
    "value": number,
    "insight": "string"
  }],
  "areasOfConcern": [{
    "issue": "string",
    "impact": "string",
    "recommendedAction": "string"
  }],
  "actionsThisWeek": [{
    "action": "string",
    "result": "string"
  }],
  "plannedActions": [{
    "action": "string",
    "priority": "high" | "medium" | "low",
    "expectedImpact": "string"
  }]
}`

export const LEAD_QUALITY_ANALYSIS_PROMPT = `Analise a qualidade dos leads gerados pelas campanhas pagas.

FORMATO JSON:
{
  "period": { "start": "string", "end": "string" },
  "totalLeads": number,
  "qualityDistribution": {
    "highQuality": { "count": number, "percentage": number },
    "mediumQuality": { "count": number, "percentage": number },
    "lowQuality": { "count": number, "percentage": number }
  },
  "bySource": [{
    "source": "string",
    "campaign": "string",
    "leads": number,
    "qualityScore": number,
    "conversionToClient": number,
    "averageValue": number,
    "recommendation": "string"
  }],
  "qualityFactors": [{
    "factor": "string",
    "correlation": "positive" | "negative",
    "strength": "strong" | "moderate" | "weak",
    "actionable": boolean,
    "recommendation": "string"
  }],
  "improvements": [{
    "area": "string",
    "currentState": "string",
    "recommendation": "string",
    "expectedImprovement": "string"
  }],
  "landingPageInsights": [{
    "page": "string",
    "bounceRate": number,
    "conversionRate": number,
    "qualityScore": number,
    "recommendations": ["string"]
  }]
}`

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get benchmark metrics by legal area
 */
export function getLegalAdsBenchmarks(legalArea: string): {
  averageCPC: number
  averageCPL: number
  averageCTR: number
  conversionRate: number
} {
  const benchmarks: Record<string, {
    averageCPC: number
    averageCPL: number
    averageCTR: number
    conversionRate: number
  }> = {
    imobiliario: {
      averageCPC: 2.50,
      averageCPL: 45,
      averageCTR: 3.5,
      conversionRate: 5.5,
    },
    familia: {
      averageCPC: 3.00,
      averageCPL: 55,
      averageCTR: 4.0,
      conversionRate: 5.5,
    },
    empresarial: {
      averageCPC: 4.00,
      averageCPL: 80,
      averageCTR: 2.5,
      conversionRate: 3.0,
    },
    trabalhista: {
      averageCPC: 2.00,
      averageCPL: 35,
      averageCTR: 4.5,
      conversionRate: 6.0,
    },
    consumidor: {
      averageCPC: 1.50,
      averageCPL: 30,
      averageCTR: 5.0,
      conversionRate: 5.0,
    },
  }

  return benchmarks[legalArea.toLowerCase()] || {
    averageCPC: 2.50,
    averageCPL: 50,
    averageCTR: 3.5,
    conversionRate: 5.0,
  }
}

/**
 * Get recommended keywords by legal area
 */
export function getRecommendedKeywords(legalArea: string): string[] {
  const keywords: Record<string, string[]> = {
    imobiliario: [
      'advogado imobiliário lisboa',
      'advogado compra casa',
      'contrato arrendamento advogado',
      'despejo inquilino',
      'advogado propriedade',
      'escritura compra venda',
      'usucapião advogado',
      'condomínio advogado',
    ],
    familia: [
      'advogado divórcio lisboa',
      'advogado família',
      'regulação responsabilidades parentais',
      'pensão alimentos',
      'advogado guarda filhos',
      'processo divórcio',
      'partilha bens divórcio',
    ],
    empresarial: [
      'advogado empresas lisboa',
      'advogado societário',
      'constituição empresa',
      'contrato comercial advogado',
      'fusões aquisições',
      'advogado startups',
    ],
    trabalhista: [
      'advogado trabalho lisboa',
      'despedimento ilegal',
      'advogado trabalhador',
      'assédio trabalho',
      'rescisão contrato trabalho',
      'indemnização despedimento',
    ],
    consumidor: [
      'advogado consumidor',
      'reclamação consumidor',
      'direitos consumidor',
      'garantia produto',
      'advogado contra banco',
    ],
  }

  return keywords[legalArea.toLowerCase()] || []
}

/**
 * Get negative keywords for legal campaigns
 */
export function getNegativeKeywords(): string[] {
  return [
    'grátis',
    'gratuito',
    'free',
    'emprego advogado',
    'trabalho advogado',
    'vaga advogado',
    'curso direito',
    'faculdade direito',
    'estágio',
    'trainee',
    'modelo contrato',
    'template',
    'como fazer',
    'diy',
    'barato',
    'preço baixo',
    'desconto',
  ]
}

/**
 * Get platform-specific character limits
 */
export function getAdCharacterLimits(platform: 'google' | 'meta'): {
  headline: number
  description: number
  primaryText: number
} {
  if (platform === 'google') {
    return {
      headline: 30,
      description: 90,
      primaryText: 0, // N/A for Google
    }
  }
  return {
    headline: 40,
    description: 125,
    primaryText: 125, // Visible part
  }
}
