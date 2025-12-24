/**
 * CMO Agent Prompts
 * Prompts for marketing strategy and coordination
 */

// =============================================================================
// SYSTEM PROMPT
// =============================================================================

export const CMO_AGENT_SYSTEM_PROMPT = `Você é o CMO IA do escritório Garcez Palha Advogados, responsável por:
- Coordenar todos os agentes de marketing (Content, Social, Ads, SEO, Video, Design)
- Estratégia de marketing integrada
- Alocação de budget de marketing
- Análise de performance de canais
- Branding e posicionamento

CONTEXTO DO ESCRITÓRIO:
- Áreas: Imobiliário, Família, Empresarial, Trabalhista, Consumidor
- Mercado: Lisboa, Portugal
- Meta: €75.000 MRR em 6 meses
- Diferencial: Tecnologia + atendimento personalizado

AGENTES SOB COORDENAÇÃO:
1. Content Agent - Produção de conteúdo
2. Social Agent - Gestão de redes sociais
3. Ads Agent - Campanhas pagas (Google/Meta)
4. SEO Agent - Otimização orgânica
5. Video Agent - Produção de vídeo
6. Design Agent - Criação visual

CANAIS DE MARKETING:
1. Website (SEO orgânico)
2. Instagram (awareness + leads)
3. LinkedIn (B2B + autoridade)
4. Google Ads (intenção de compra)
5. Meta Ads (awareness + retargeting)
6. YouTube (educação + autoridade)
7. Email Marketing (nurturing)

MÉTRICAS CHAVE:
- CAC por canal
- LTV:CAC ratio
- ROAS por campanha
- Custo por lead
- Taxa de conversão por canal
- Engagement rate
- Brand awareness

ESTRATÉGIAS:
1. Inbound Marketing - Conteúdo educativo
2. Performance Marketing - Ads segmentados
3. Account-Based Marketing - Empresas específicas
4. Referral Marketing - Indicações de clientes

Responda sempre em português de Portugal.
Use dados para justificar decisões.`

// =============================================================================
// STRATEGY PROMPTS
// =============================================================================

export const MARKETING_STRATEGY_PROMPT = `Desenvolva estratégia de marketing integrada.

FORMATO JSON:
{
  "period": { "start": "string", "end": "string" },
  "objectives": [{
    "objective": "string",
    "metric": "string",
    "target": number,
    "baseline": number
  }],
  "targetAudience": [{
    "segment": "string",
    "description": "string",
    "size": number,
    "priority": "primary" | "secondary" | "tertiary",
    "channels": ["string"],
    "messaging": "string"
  }],
  "channelStrategy": [{
    "channel": "string",
    "role": "awareness" | "consideration" | "conversion" | "retention",
    "budget": number,
    "budgetPercent": number,
    "kpis": [{ "metric": "string", "target": number }],
    "tactics": ["string"]
  }],
  "contentPillars": [{
    "pillar": "string",
    "topics": ["string"],
    "formats": ["string"],
    "frequency": "string"
  }],
  "campaigns": [{
    "name": "string",
    "objective": "string",
    "startDate": "string",
    "endDate": "string",
    "budget": number,
    "channels": ["string"],
    "targetAudience": "string",
    "expectedResults": { "leads": number, "conversions": number, "roi": number }
  }],
  "budgetAllocation": {
    "total": number,
    "byChannel": [{ "channel": "string", "amount": number, "percent": number }],
    "byObjective": [{ "objective": "string", "amount": number }]
  },
  "timeline": [{
    "week": number,
    "focus": "string",
    "deliverables": ["string"]
  }],
  "risks": [{
    "risk": "string",
    "mitigation": "string"
  }]
}`

export const BUDGET_ALLOCATION_PROMPT = `Otimize alocação de budget de marketing.

FORMATO JSON:
{
  "totalBudget": number,
  "period": { "start": "string", "end": "string" },
  "currentPerformance": [{
    "channel": "string",
    "spend": number,
    "leads": number,
    "conversions": number,
    "revenue": number,
    "cpl": number,
    "cac": number,
    "roas": number
  }],
  "recommendation": {
    "allocation": [{
      "channel": "string",
      "currentBudget": number,
      "recommendedBudget": number,
      "change": number,
      "changePercent": number,
      "rationale": "string",
      "expectedLeads": number,
      "expectedROAS": number
    }],
    "newChannels": [{
      "channel": "string",
      "recommendedBudget": number,
      "rationale": "string",
      "expectedResults": "string"
    }],
    "discontinue": [{
      "channel": "string",
      "currentBudget": number,
      "reason": "string"
    }]
  },
  "projectedResults": {
    "totalLeads": number,
    "totalConversions": number,
    "totalRevenue": number,
    "overallROAS": number,
    "avgCPL": number,
    "avgCAC": number
  },
  "scenarios": {
    "conservative": {
      "budget": number,
      "expectedLeads": number,
      "expectedROAS": number
    },
    "moderate": {
      "budget": number,
      "expectedLeads": number,
      "expectedROAS": number
    },
    "aggressive": {
      "budget": number,
      "expectedLeads": number,
      "expectedROAS": number
    }
  }
}`

// =============================================================================
// COORDINATION PROMPTS
// =============================================================================

export const CONTENT_CALENDAR_COORDINATION_PROMPT = `Coordene calendário de conteúdo entre canais.

FORMATO JSON:
{
  "period": { "month": "string", "year": number },
  "theme": "string",
  "goals": ["string"],
  "weeks": [{
    "weekNumber": number,
    "focus": "string",
    "content": [{
      "day": "string",
      "channel": "string",
      "type": "string",
      "topic": "string",
      "responsibleAgent": "string",
      "status": "planned" | "in_progress" | "ready" | "published",
      "dependencies": ["string"]
    }]
  }],
  "campaigns": [{
    "name": "string",
    "channels": ["string"],
    "contentPieces": number,
    "timeline": "string"
  }],
  "agentAssignments": [{
    "agent": "string",
    "tasks": number,
    "contentTypes": ["string"],
    "deadline": "string"
  }],
  "crossPromotion": [{
    "contentPiece": "string",
    "primaryChannel": "string",
    "repurposeFor": ["string"]
  }]
}`

export const CAMPAIGN_COORDINATION_PROMPT = `Coordene lançamento de campanha entre agentes.

FORMATO JSON:
{
  "campaign": {
    "name": "string",
    "objective": "string",
    "startDate": "string",
    "endDate": "string",
    "budget": number
  },
  "phases": [{
    "phase": "teaser" | "launch" | "sustain" | "close",
    "startDate": "string",
    "endDate": "string",
    "activities": [{
      "activity": "string",
      "channel": "string",
      "responsibleAgent": "string",
      "deadline": "string",
      "deliverables": ["string"],
      "dependencies": ["string"]
    }]
  }],
  "agentTasks": [{
    "agent": "string",
    "tasks": [{
      "task": "string",
      "deadline": "string",
      "priority": "critical" | "high" | "medium" | "low"
    }]
  }],
  "assets": [{
    "asset": "string",
    "type": "string",
    "createdBy": "string",
    "usedBy": ["string"],
    "deadline": "string"
  }],
  "monitoring": {
    "kpis": [{ "metric": "string", "target": number }],
    "checkpoints": ["string"],
    "escalationTriggers": ["string"]
  }
}`

// =============================================================================
// ANALYSIS PROMPTS
// =============================================================================

export const CHANNEL_PERFORMANCE_PROMPT = `Analise performance por canal de marketing.

FORMATO JSON:
{
  "period": { "start": "string", "end": "string" },
  "summary": {
    "totalSpend": number,
    "totalLeads": number,
    "totalConversions": number,
    "totalRevenue": number,
    "overallROAS": number,
    "avgCPL": number,
    "avgCAC": number
  },
  "byChannel": [{
    "channel": "string",
    "metrics": {
      "spend": number,
      "impressions": number,
      "clicks": number,
      "ctr": number,
      "leads": number,
      "conversions": number,
      "revenue": number,
      "cpl": number,
      "cac": number,
      "roas": number,
      "ltv": number,
      "ltvCacRatio": number
    },
    "trend": "improving" | "stable" | "declining",
    "vsLastPeriod": {
      "leads": number,
      "conversions": number,
      "roas": number
    },
    "insights": ["string"],
    "recommendations": ["string"]
  }],
  "topPerformers": [{
    "channel": "string",
    "metric": "string",
    "value": number
  }],
  "underperformers": [{
    "channel": "string",
    "issue": "string",
    "action": "string"
  }],
  "attribution": {
    "model": "string",
    "findings": ["string"]
  },
  "recommendations": [{
    "priority": "high" | "medium" | "low",
    "recommendation": "string",
    "expectedImpact": "string"
  }]
}`

export const MARKETING_ROI_PROMPT = `Analise ROI de marketing detalhado.

FORMATO JSON:
{
  "period": { "start": "string", "end": "string" },
  "overview": {
    "totalInvestment": number,
    "totalRevenue": number,
    "grossROI": number,
    "netROI": number,
    "paybackPeriod": "string"
  },
  "byChannel": [{
    "channel": "string",
    "investment": number,
    "revenue": number,
    "roi": number,
    "efficiency": "high" | "medium" | "low",
    "recommendation": "increase" | "maintain" | "decrease" | "stop"
  }],
  "byCampaign": [{
    "campaign": "string",
    "investment": number,
    "revenue": number,
    "roi": number,
    "learnings": ["string"]
  }],
  "customerAcquisition": {
    "totalNewCustomers": number,
    "avgCAC": number,
    "avgLTV": number,
    "ltvCacRatio": number,
    "breakEvenPoint": "string"
  },
  "incrementalRevenue": {
    "directlyAttributed": number,
    "influenced": number,
    "organic": number
  },
  "optimization": [{
    "opportunity": "string",
    "currentState": "string",
    "proposedAction": "string",
    "expectedImprovement": "string"
  }]
}`

// =============================================================================
// REPORTING PROMPTS
// =============================================================================

export const WEEKLY_MARKETING_REPORT_PROMPT = `Gere relatório de marketing semanal.

FORMATO JSON:
{
  "period": { "weekNumber": number, "start": "string", "end": "string" },
  "executiveSummary": "string",
  "keyMetrics": {
    "spend": { "value": number, "vsBudget": number },
    "leads": { "value": number, "vsTarget": number },
    "cpl": { "value": number, "vsTarget": number },
    "conversions": { "value": number, "rate": number },
    "roas": { "value": number, "vsTarget": number }
  },
  "channelPerformance": [{
    "channel": "string",
    "spend": number,
    "leads": number,
    "trend": "up" | "stable" | "down"
  }],
  "contentPerformance": {
    "published": number,
    "topPosts": [{
      "platform": "string",
      "engagement": number,
      "reach": number
    }],
    "insights": ["string"]
  },
  "campaignsStatus": [{
    "campaign": "string",
    "status": "active" | "paused" | "completed",
    "performance": "above_target" | "on_target" | "below_target",
    "action": "string"
  }],
  "issues": [{
    "issue": "string",
    "severity": "high" | "medium" | "low",
    "action": "string"
  }],
  "nextWeekPriorities": ["string"],
  "agentPerformance": [{
    "agent": "string",
    "tasksCompleted": number,
    "quality": "high" | "medium" | "low"
  }]
}`

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Calculate channel efficiency score
 */
export function calculateChannelEfficiency(metrics: {
  cpl: number
  cac: number
  roas: number
  ltvCacRatio: number
}): { score: number; rating: 'excellent' | 'good' | 'fair' | 'poor' } {
  let score = 0

  // CPL scoring (lower is better)
  if (metrics.cpl <= 20) score += 25
  else if (metrics.cpl <= 50) score += 20
  else if (metrics.cpl <= 100) score += 10
  else score += 5

  // ROAS scoring (higher is better)
  if (metrics.roas >= 4) score += 25
  else if (metrics.roas >= 3) score += 20
  else if (metrics.roas >= 2) score += 10
  else score += 5

  // LTV:CAC ratio scoring
  if (metrics.ltvCacRatio >= 3) score += 25
  else if (metrics.ltvCacRatio >= 2) score += 20
  else if (metrics.ltvCacRatio >= 1) score += 10
  else score += 5

  // CAC scoring (lower is better, relative to LTV)
  if (metrics.cac <= 100) score += 25
  else if (metrics.cac <= 200) score += 20
  else if (metrics.cac <= 400) score += 10
  else score += 5

  const rating = score >= 80 ? 'excellent' : score >= 60 ? 'good' : score >= 40 ? 'fair' : 'poor'

  return { score, rating }
}

/**
 * Get marketing channels by objective
 */
export function getChannelsByObjective(objective: 'awareness' | 'consideration' | 'conversion' | 'retention'): string[] {
  const channels = {
    awareness: ['Instagram', 'YouTube', 'Meta Ads (Awareness)', 'LinkedIn'],
    consideration: ['Blog/SEO', 'LinkedIn', 'YouTube', 'Google Ads (Search)'],
    conversion: ['Google Ads', 'Meta Ads (Retargeting)', 'Email Marketing', 'WhatsApp'],
    retention: ['Email Marketing', 'WhatsApp', 'Community', 'LinkedIn'],
  }
  return channels[objective]
}

/**
 * Get recommended content mix
 */
export function getRecommendedContentMix(): Array<{
  type: string
  percent: number
  channels: string[]
}> {
  return [
    { type: 'Educativo', percent: 40, channels: ['Blog', 'YouTube', 'LinkedIn'] },
    { type: 'Casos/Depoimentos', percent: 20, channels: ['Instagram', 'LinkedIn', 'Website'] },
    { type: 'Institucional', percent: 15, channels: ['Instagram', 'LinkedIn'] },
    { type: 'Promocional', percent: 15, channels: ['Google Ads', 'Meta Ads', 'Email'] },
    { type: 'Interativo', percent: 10, channels: ['Instagram Stories', 'LinkedIn'] },
  ]
}
