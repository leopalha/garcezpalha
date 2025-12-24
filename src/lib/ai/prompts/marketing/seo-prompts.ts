/**
 * SEO Agent Prompts
 * Prompts for search engine optimization management
 */

// =============================================================================
// SYSTEM PROMPT
// =============================================================================

export const SEO_AGENT_SYSTEM_PROMPT = `Você é o Agente de SEO do escritório Garcez Palha Advogados, especializado em:
- Otimização on-page e off-page para sites jurídicos
- Estratégia de conteúdo SEO para advogados
- Análise de keywords e pesquisa de mercado
- Link building ético e autoridade de domínio
- SEO local para Lisboa e Portugal

CONTEXTO DO ESCRITÓRIO:
- Áreas: Imobiliário, Família, Empresarial, Trabalhista, Consumidor
- Público: Pessoas físicas e empresas em Lisboa/Portugal
- Site: garcezpalha.pt
- Objetivo: Ranking top 3 para keywords principais de cada área

PRINCÍPIOS SEO JURÍDICO:
1. E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness)
2. Conteúdo que demonstra expertise legal real
3. Citação de fontes legais (códigos, jurisprudência)
4. Perfil de autoria dos advogados
5. Schema markup para advogados e escritórios
6. SEO local com Google Business Profile

ESTRATÉGIA DE CONTEÚDO:
1. Pillar pages para cada área jurídica
2. Blog posts respondendo dúvidas comuns
3. FAQs otimizadas para featured snippets
4. Guias práticos com download (lead magnets)
5. Casos de sucesso (sem violar confidencialidade)
6. Atualização regular sobre mudanças legais

MÉTRICAS CHAVE:
- Posições no ranking
- Tráfego orgânico
- Taxa de clique (CTR)
- Tempo na página
- Conversão orgânica para leads
- Backlinks de qualidade

Responda sempre em português de Portugal.
Forneça recomendações práticas e específicas.
Priorize qualidade de conteúdo sobre táticas de curto prazo.`

// =============================================================================
// KEYWORD RESEARCH PROMPTS
// =============================================================================

export const KEYWORD_RESEARCH_PROMPT = `Realize pesquisa de keywords para o escritório Garcez Palha.

CRITÉRIOS DE SELEÇÃO:
1. Intenção de busca (informacional vs transacional)
2. Volume de pesquisa estimado
3. Dificuldade/competição
4. Relevância para serviços oferecidos
5. Potencial de conversão

FORMATO JSON:
{
  "legalArea": "string",
  "primaryKeywords": [{
    "keyword": "string",
    "searchVolume": number,
    "difficulty": "low" | "medium" | "high",
    "intent": "informational" | "navigational" | "transactional" | "commercial",
    "currentPosition": number | null,
    "priority": "high" | "medium" | "low",
    "targetPage": "string"
  }],
  "longTailKeywords": [{
    "keyword": "string",
    "parentKeyword": "string",
    "searchVolume": number,
    "difficulty": "low" | "medium" | "high",
    "contentType": "blog" | "faq" | "guide" | "page"
  }],
  "questionKeywords": [{
    "question": "string",
    "relatedKeyword": "string",
    "featuredSnippetOpportunity": boolean,
    "suggestedFormat": "paragraph" | "list" | "table" | "video"
  }],
  "localKeywords": [{
    "keyword": "string",
    "location": "string",
    "volume": number,
    "localPackOpportunity": boolean
  }],
  "competitorKeywords": [{
    "keyword": "string",
    "competitor": "string",
    "theirPosition": number,
    "opportunity": "string"
  }],
  "seasonalTrends": [{
    "keyword": "string",
    "peakMonths": ["string"],
    "recommendation": "string"
  }]
}`

export const CONTENT_GAP_ANALYSIS_PROMPT = `Analise gaps de conteúdo comparando com concorrentes.

FORMATO JSON:
{
  "currentCoverage": {
    "totalPages": number,
    "indexedPages": number,
    "topRankingPages": [{
      "url": "string",
      "keyword": "string",
      "position": number
    }]
  },
  "competitorAnalysis": [{
    "competitor": "string",
    "domain": "string",
    "estimatedTraffic": number,
    "topContent": [{
      "topic": "string",
      "url": "string",
      "estimatedTraffic": number
    }]
  }],
  "contentGaps": [{
    "topic": "string",
    "keyword": "string",
    "searchVolume": number,
    "competitorsCovering": ["string"],
    "priority": "high" | "medium" | "low",
    "contentType": "pillar" | "blog" | "guide" | "faq",
    "estimatedEffort": "low" | "medium" | "high"
  }],
  "recommendations": [{
    "action": "string",
    "topic": "string",
    "expectedImpact": "string",
    "timeline": "string"
  }]
}`

// =============================================================================
// ON-PAGE SEO PROMPTS
// =============================================================================

export const PAGE_OPTIMIZATION_PROMPT = `Analise e otimize uma página para SEO.

CHECKLIST ON-PAGE:
1. Title tag (55-60 caracteres)
2. Meta description (150-160 caracteres)
3. H1 único e otimizado
4. Hierarquia de headings (H2, H3)
5. Keyword density natural
6. URLs amigáveis
7. Alt text em imagens
8. Internal linking
9. Schema markup
10. Core Web Vitals

FORMATO JSON:
{
  "url": "string",
  "targetKeyword": "string",
  "currentScore": number,
  "optimizedScore": number,
  "titleTag": {
    "current": "string",
    "suggested": "string",
    "length": number,
    "includesKeyword": boolean
  },
  "metaDescription": {
    "current": "string",
    "suggested": "string",
    "length": number,
    "includesCTA": boolean
  },
  "headings": {
    "h1": { "current": "string", "suggested": "string" },
    "h2s": [{ "current": "string", "suggested": "string" }],
    "h3s": [{ "current": "string", "suggested": "string" }]
  },
  "content": {
    "wordCount": number,
    "recommendedWordCount": number,
    "keywordDensity": number,
    "readabilityScore": number,
    "suggestions": ["string"]
  },
  "technicalIssues": [{
    "issue": "string",
    "severity": "high" | "medium" | "low",
    "fix": "string"
  }],
  "internalLinks": {
    "current": number,
    "suggested": [{
      "anchorText": "string",
      "targetUrl": "string",
      "context": "string"
    }]
  },
  "schemaMarkup": {
    "current": ["string"],
    "suggested": [{
      "type": "string",
      "properties": object
    }]
  }
}`

export const CONTENT_BRIEF_PROMPT = `Crie um brief de conteúdo SEO-otimizado.

FORMATO JSON:
{
  "title": "string",
  "targetKeyword": "string",
  "secondaryKeywords": ["string"],
  "searchIntent": "informational" | "transactional" | "navigational",
  "targetWordCount": { "min": number, "max": number },
  "outline": [{
    "heading": "string",
    "type": "H2" | "H3",
    "keyPoints": ["string"],
    "suggestedWordCount": number
  }],
  "competitorAnalysis": [{
    "url": "string",
    "wordCount": number,
    "mainTopics": ["string"],
    "uniqueAngle": "string"
  }],
  "suggestedTitle": "string",
  "suggestedMetaDescription": "string",
  "internalLinksToInclude": [{
    "anchorText": "string",
    "targetUrl": "string"
  }],
  "externalSources": [{
    "type": "legislation" | "jurisprudence" | "doctrine" | "official",
    "description": "string",
    "suggestedUsage": "string"
  }],
  "callsToAction": [{
    "placement": "string",
    "type": "consultation" | "download" | "contact",
    "suggestedText": "string"
  }],
  "featuredSnippetOptimization": {
    "opportunity": boolean,
    "format": "paragraph" | "list" | "table",
    "targetQuestion": "string",
    "suggestedAnswer": "string"
  }
}`

// =============================================================================
// TECHNICAL SEO PROMPTS
// =============================================================================

export const TECHNICAL_AUDIT_PROMPT = `Realize uma auditoria técnica de SEO.

ÁREAS DE ANÁLISE:
1. Crawlability e indexação
2. Velocidade e Core Web Vitals
3. Mobile-friendliness
4. Segurança (HTTPS)
5. Estrutura de URLs
6. Sitemap e robots.txt
7. Canonical tags
8. Hreflang (se aplicável)

FORMATO JSON:
{
  "overallScore": number,
  "criticalIssues": [{
    "issue": "string",
    "impact": "string",
    "affectedUrls": number,
    "fix": "string",
    "priority": 1-5
  }],
  "warnings": [{
    "issue": "string",
    "impact": "string",
    "recommendation": "string"
  }],
  "indexation": {
    "totalPages": number,
    "indexedPages": number,
    "blockedPages": number,
    "orphanPages": number,
    "duplicateContent": [{
      "urls": ["string"],
      "resolution": "string"
    }]
  },
  "performance": {
    "mobileScore": number,
    "desktopScore": number,
    "lcp": number,
    "fid": number,
    "cls": number,
    "recommendations": ["string"]
  },
  "mobileUsability": {
    "score": number,
    "issues": ["string"]
  },
  "security": {
    "https": boolean,
    "mixedContent": boolean,
    "issues": ["string"]
  },
  "structuredData": {
    "implemented": ["string"],
    "missing": ["string"],
    "errors": ["string"]
  },
  "actionPlan": [{
    "priority": 1-5,
    "action": "string",
    "expectedImpact": "string",
    "effort": "low" | "medium" | "high"
  }]
}`

export const SITE_ARCHITECTURE_PROMPT = `Analise e otimize a arquitetura do site.

FORMATO JSON:
{
  "currentStructure": {
    "depth": number,
    "totalPages": number,
    "orphanPages": number,
    "clickDepth": {
      "1click": number,
      "2clicks": number,
      "3clicks": number,
      "4plusClicks": number
    }
  },
  "categoryStructure": [{
    "category": "string",
    "url": "string",
    "childPages": number,
    "internalLinks": number,
    "recommendations": ["string"]
  }],
  "internalLinking": {
    "averageLinksPerPage": number,
    "pageRankDistribution": "balanced" | "top_heavy" | "bottom_heavy",
    "opportunities": [{
      "fromPage": "string",
      "toPage": "string",
      "anchorText": "string",
      "context": "string"
    }]
  },
  "pillarClusterStrategy": [{
    "pillarPage": "string",
    "topic": "string",
    "clusterContent": [{
      "url": "string",
      "keyword": "string",
      "status": "exists" | "to_create"
    }]
  }],
  "urlOptimization": [{
    "currentUrl": "string",
    "suggestedUrl": "string",
    "reason": "string"
  }],
  "recommendations": [{
    "action": "string",
    "impact": "high" | "medium" | "low",
    "effort": "high" | "medium" | "low"
  }]
}`

// =============================================================================
// LOCAL SEO PROMPTS
// =============================================================================

export const LOCAL_SEO_AUDIT_PROMPT = `Realize auditoria de SEO local.

FORMATO JSON:
{
  "googleBusinessProfile": {
    "claimed": boolean,
    "verified": boolean,
    "completeness": number,
    "categories": ["string"],
    "missingInfo": ["string"],
    "reviews": {
      "count": number,
      "averageRating": number,
      "recentReviews": number,
      "responseRate": number
    },
    "recommendations": ["string"]
  },
  "localCitations": {
    "consistent": number,
    "inconsistent": number,
    "missing": [{
      "directory": "string",
      "importance": "high" | "medium" | "low",
      "url": "string"
    }]
  },
  "napConsistency": {
    "name": { "consistent": boolean, "variations": ["string"] },
    "address": { "consistent": boolean, "variations": ["string"] },
    "phone": { "consistent": boolean, "variations": ["string"] }
  },
  "localContent": {
    "locationPages": number,
    "localBlogPosts": number,
    "recommendations": ["string"]
  },
  "localKeywords": [{
    "keyword": "string",
    "localPackPosition": number | null,
    "organicPosition": number | null,
    "recommendation": "string"
  }],
  "competitorLocalPresence": [{
    "competitor": "string",
    "gbpRating": number,
    "reviewCount": number,
    "localPackAppearance": number
  }],
  "actionPlan": [{
    "priority": 1-5,
    "action": "string",
    "expectedImpact": "string"
  }]
}`

// =============================================================================
// LINK BUILDING PROMPTS
// =============================================================================

export const BACKLINK_ANALYSIS_PROMPT = `Analise o perfil de backlinks.

FORMATO JSON:
{
  "overview": {
    "totalBacklinks": number,
    "referringDomains": number,
    "domainAuthority": number,
    "newBacklinksMonth": number,
    "lostBacklinksMonth": number
  },
  "qualityDistribution": {
    "highQuality": number,
    "mediumQuality": number,
    "lowQuality": number,
    "toxic": number
  },
  "topBacklinks": [{
    "domain": "string",
    "domainAuthority": number,
    "anchorText": "string",
    "targetUrl": "string",
    "type": "dofollow" | "nofollow",
    "traffic": number
  }],
  "anchorTextDistribution": [{
    "type": "branded" | "exact" | "partial" | "generic" | "naked",
    "percentage": number,
    "examples": ["string"]
  }],
  "toxicLinks": [{
    "domain": "string",
    "reason": "string",
    "action": "disavow" | "remove" | "monitor"
  }],
  "competitorComparison": [{
    "competitor": "string",
    "referringDomains": number,
    "domainAuthority": number,
    "gapOpportunities": number
  }],
  "recommendations": [{
    "priority": "high" | "medium" | "low",
    "action": "string",
    "expectedImpact": "string"
  }]
}`

export const LINK_BUILDING_STRATEGY_PROMPT = `Crie estratégia de link building para escritório de advocacia.

TÁTICAS ÉTICAS:
1. Guest posting em blogs jurídicos
2. Diretórios de advogados
3. Associações profissionais
4. Parcerias com outros escritórios
5. Citações em mídia
6. Conteúdo linkável (estudos, guias)

FORMATO JSON:
{
  "currentState": {
    "referringDomains": number,
    "domainAuthority": number,
    "monthlyNewLinks": number
  },
  "goals": {
    "targetDA": number,
    "monthlyLinkTarget": number,
    "timeline": "string"
  },
  "tactics": [{
    "tactic": "string",
    "description": "string",
    "expectedLinksMonth": number,
    "effort": "low" | "medium" | "high",
    "qualityExpected": "high" | "medium",
    "steps": ["string"]
  }],
  "contentForLinks": [{
    "type": "guide" | "study" | "tool" | "infographic",
    "topic": "string",
    "linkPotential": "high" | "medium" | "low",
    "targetAudience": "string",
    "promotionStrategy": "string"
  }],
  "outreachTargets": [{
    "type": "blog" | "directory" | "news" | "association",
    "name": "string",
    "domain": "string",
    "domainAuthority": number,
    "contactApproach": "string"
  }],
  "monthlyPlan": [{
    "month": number,
    "focus": "string",
    "activities": ["string"],
    "expectedLinks": number
  }]
}`

// =============================================================================
// REPORTING PROMPTS
// =============================================================================

export const SEO_MONTHLY_REPORT_PROMPT = `Gere relatório mensal de SEO.

FORMATO JSON:
{
  "period": { "month": "string", "year": number },
  "executiveSummary": "string",
  "trafficOverview": {
    "organicSessions": number,
    "previousMonth": number,
    "changePercent": number,
    "yearOverYear": number
  },
  "rankings": {
    "keywordsTracked": number,
    "top3": number,
    "top10": number,
    "improved": number,
    "declined": number,
    "newRankings": number,
    "topMovers": [{
      "keyword": "string",
      "previousPosition": number,
      "currentPosition": number,
      "change": number
    }]
  },
  "contentPerformance": [{
    "url": "string",
    "sessions": number,
    "change": number,
    "topKeywords": ["string"]
  }],
  "technicalHealth": {
    "score": number,
    "issuesResolved": number,
    "newIssues": number,
    "criticalIssues": number
  },
  "backlinks": {
    "newLinks": number,
    "lostLinks": number,
    "referringDomains": number,
    "domainAuthority": number
  },
  "conversions": {
    "organicLeads": number,
    "previousMonth": number,
    "conversionRate": number,
    "topConvertingPages": [{
      "url": "string",
      "leads": number,
      "conversionRate": number
    }]
  },
  "competitorUpdate": [{
    "competitor": "string",
    "visibilityChange": number,
    "notableChanges": "string"
  }],
  "activitiesCompleted": [{
    "activity": "string",
    "result": "string"
  }],
  "nextMonthPlan": [{
    "priority": "high" | "medium" | "low",
    "activity": "string",
    "expectedImpact": "string"
  }]
}`

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get SEO benchmarks by legal area
 */
export function getSEOBenchmarks(legalArea: string): {
  averagePosition: number
  targetPosition: number
  typicalTraffic: number
  conversionRate: number
} {
  const benchmarks: Record<string, {
    averagePosition: number
    targetPosition: number
    typicalTraffic: number
    conversionRate: number
  }> = {
    imobiliario: {
      averagePosition: 8,
      targetPosition: 3,
      typicalTraffic: 2000,
      conversionRate: 2.5,
    },
    familia: {
      averagePosition: 10,
      targetPosition: 3,
      typicalTraffic: 3000,
      conversionRate: 3.0,
    },
    empresarial: {
      averagePosition: 12,
      targetPosition: 5,
      typicalTraffic: 1000,
      conversionRate: 1.5,
    },
    trabalhista: {
      averagePosition: 7,
      targetPosition: 3,
      typicalTraffic: 4000,
      conversionRate: 3.5,
    },
    consumidor: {
      averagePosition: 6,
      targetPosition: 3,
      typicalTraffic: 5000,
      conversionRate: 2.0,
    },
  }

  return benchmarks[legalArea.toLowerCase()] || {
    averagePosition: 10,
    targetPosition: 5,
    typicalTraffic: 2000,
    conversionRate: 2.0,
  }
}

/**
 * Get primary keywords by legal area
 */
export function getPrimaryKeywords(legalArea: string): string[] {
  const keywords: Record<string, string[]> = {
    imobiliario: [
      'advogado imobiliário',
      'advogado direito imobiliário lisboa',
      'contrato compra e venda imóvel',
      'advogado arrendamento',
      'despejo judicial',
      'advogado condomínio',
      'usucapião advogado',
    ],
    familia: [
      'advogado divórcio',
      'advogado família lisboa',
      'processo divórcio portugal',
      'regulação poder paternal',
      'pensão alimentos',
      'advogado guarda filhos',
    ],
    empresarial: [
      'advogado empresarial',
      'advogado direito comercial',
      'constituição sociedade',
      'advogado contratos comerciais',
      'fusões e aquisições advogado',
    ],
    trabalhista: [
      'advogado trabalho',
      'advogado trabalhador',
      'despedimento ilegal',
      'indemnização despedimento',
      'assédio laboral advogado',
    ],
    consumidor: [
      'advogado consumidor',
      'direitos consumidor advogado',
      'reclamação banco advogado',
      'garantia produto defeito',
    ],
  }

  return keywords[legalArea.toLowerCase()] || []
}

/**
 * Get schema types for legal pages
 */
export function getLegalSchemaTypes(): string[] {
  return [
    'LegalService',
    'Attorney',
    'Organization',
    'LocalBusiness',
    'FAQPage',
    'Article',
    'BreadcrumbList',
    'WebPage',
  ]
}

/**
 * Calculate content score
 */
export function calculateContentScore(metrics: {
  wordCount: number
  keywordDensity: number
  headingsCount: number
  internalLinks: number
  externalLinks: number
  images: number
  readabilityScore: number
}): number {
  let score = 0

  // Word count (max 25 points)
  if (metrics.wordCount >= 2000) score += 25
  else if (metrics.wordCount >= 1500) score += 20
  else if (metrics.wordCount >= 1000) score += 15
  else if (metrics.wordCount >= 500) score += 10
  else score += 5

  // Keyword density (max 15 points)
  if (metrics.keywordDensity >= 1 && metrics.keywordDensity <= 2.5) score += 15
  else if (metrics.keywordDensity >= 0.5 && metrics.keywordDensity <= 3) score += 10
  else score += 5

  // Headings (max 15 points)
  if (metrics.headingsCount >= 5) score += 15
  else if (metrics.headingsCount >= 3) score += 10
  else score += 5

  // Internal links (max 15 points)
  if (metrics.internalLinks >= 5) score += 15
  else if (metrics.internalLinks >= 3) score += 10
  else if (metrics.internalLinks >= 1) score += 5

  // External links (max 10 points)
  if (metrics.externalLinks >= 2) score += 10
  else if (metrics.externalLinks >= 1) score += 5

  // Images (max 10 points)
  if (metrics.images >= 3) score += 10
  else if (metrics.images >= 1) score += 5

  // Readability (max 10 points)
  if (metrics.readabilityScore >= 60) score += 10
  else if (metrics.readabilityScore >= 40) score += 5

  return score
}
