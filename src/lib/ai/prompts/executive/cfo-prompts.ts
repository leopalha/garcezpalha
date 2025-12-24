/**
 * CFO Agent Prompts
 * Prompts for financial management and analysis
 */

// =============================================================================
// SYSTEM PROMPT
// =============================================================================

export const CFO_AGENT_SYSTEM_PROMPT = `Você é o CFO IA do escritório Garcez Palha Advogados, responsável por:
- Análise e projeção financeira
- Gestão de fluxo de caixa
- Controle de inadimplência
- Relatórios financeiros (DRE, balanço)
- Otimização de custos e receitas
- Análise de rentabilidade por área/serviço

CONTEXTO DO ESCRITÓRIO:
- Áreas: Imobiliário, Família, Empresarial, Trabalhista, Consumidor
- Modelo: Honorários fixos + % êxito em alguns casos
- Estrutura: Sócios + advogados associados + admin
- Meta: R$ 75.000 MRR em 6 meses

MÉTRICAS FINANCEIRAS CHAVE:
1. MRR (Monthly Recurring Revenue)
2. CAC (Customer Acquisition Cost)
3. LTV (Lifetime Value)
4. Taxa de inadimplência
5. Margem por tipo de serviço
6. ROI por canal de aquisição
7. Burn rate mensal
8. Runway

PRINCÍPIOS FINANCEIROS:
1. Cash is king - foco em fluxo de caixa
2. Previsibilidade de receita
3. Controle rigoroso de custos
4. Diversificação de receitas
5. Reserva de emergência (6 meses)

RELATÓRIOS GERADOS:
- Diário: Posição de caixa
- Semanal: Fluxo de caixa, inadimplência
- Mensal: DRE, análise de margem
- Trimestral: Projeções, análise estratégica

Responda sempre em português de Portugal.
Use valores em EUR (€).
Forneça análises práticas e acionáveis.`

// =============================================================================
// CASH FLOW PROMPTS
// =============================================================================

export const CASH_FLOW_ANALYSIS_PROMPT = `Analise o fluxo de caixa e projete próximas semanas.

FORMATO JSON:
{
  "period": { "start": "string", "end": "string" },
  "currentPosition": {
    "bankBalance": number,
    "accountsReceivable": number,
    "accountsPayable": number,
    "netPosition": number
  },
  "cashFlow": {
    "inflows": [{
      "source": "string",
      "amount": number,
      "date": "string",
      "probability": number,
      "category": "honorarios" | "exito" | "consultoria" | "outros"
    }],
    "outflows": [{
      "destination": "string",
      "amount": number,
      "date": "string",
      "type": "fixed" | "variable",
      "category": "salarios" | "aluguel" | "software" | "marketing" | "impostos" | "outros"
    }]
  },
  "projection": [{
    "week": number,
    "startingBalance": number,
    "totalInflows": number,
    "totalOutflows": number,
    "endingBalance": number,
    "alerts": ["string"]
  }],
  "healthIndicators": {
    "runwayMonths": number,
    "liquidityRatio": number,
    "burnRate": number,
    "cashConversionCycle": number
  },
  "recommendations": [{
    "priority": "critical" | "high" | "medium" | "low",
    "action": "string",
    "impact": "string",
    "deadline": "string"
  }],
  "alerts": [{
    "type": "cash_shortage" | "overdue_payment" | "unusual_expense" | "opportunity",
    "severity": "critical" | "warning" | "info",
    "message": "string",
    "suggestedAction": "string"
  }]
}`

export const RECEIVABLES_ANALYSIS_PROMPT = `Analise as contas a receber e inadimplência.

FORMATO JSON:
{
  "summary": {
    "totalReceivables": number,
    "current": number,
    "overdue1to30": number,
    "overdue31to60": number,
    "overdue61to90": number,
    "overdue90plus": number,
    "defaultRate": number
  },
  "agingAnalysis": [{
    "clientId": "string",
    "clientName": "string",
    "invoiceId": "string",
    "amount": number,
    "dueDate": "string",
    "daysOverdue": number,
    "riskLevel": "low" | "medium" | "high" | "critical",
    "lastContact": "string",
    "paymentHistory": "good" | "irregular" | "poor"
  }],
  "collectionPriority": [{
    "clientId": "string",
    "amount": number,
    "priority": number,
    "recommendedAction": "string",
    "contactMethod": "email" | "phone" | "whatsapp" | "letter",
    "suggestedMessage": "string"
  }],
  "riskAssessment": {
    "expectedCollections": number,
    "doubtfulDebts": number,
    "provisionNeeded": number,
    "writeOffCandidates": [{
      "clientId": "string",
      "amount": number,
      "reason": "string"
    }]
  },
  "trends": {
    "defaultRateTrend": "increasing" | "stable" | "decreasing",
    "avgDaysToPayTrend": "increasing" | "stable" | "decreasing",
    "currentDSO": number,
    "targetDSO": number
  },
  "recommendations": [{
    "action": "string",
    "expectedRecovery": number,
    "effort": "low" | "medium" | "high"
  }]
}`

// =============================================================================
// FINANCIAL STATEMENTS PROMPTS
// =============================================================================

export const DRE_ANALYSIS_PROMPT = `Gere e analise a Demonstração de Resultado do Exercício (DRE).

FORMATO JSON:
{
  "period": { "month": "string", "year": number },
  "dre": {
    "grossRevenue": {
      "total": number,
      "byArea": [{
        "area": "string",
        "amount": number,
        "percentage": number
      }],
      "byType": [{
        "type": "honorarios" | "exito" | "consultoria" | "retainer",
        "amount": number,
        "percentage": number
      }]
    },
    "deductions": {
      "taxes": number,
      "discounts": number,
      "returns": number,
      "total": number
    },
    "netRevenue": number,
    "costOfServices": {
      "directLabor": number,
      "thirdPartyServices": number,
      "courtFees": number,
      "other": number,
      "total": number
    },
    "grossProfit": number,
    "grossMargin": number,
    "operatingExpenses": {
      "personnel": number,
      "rent": number,
      "utilities": number,
      "software": number,
      "marketing": number,
      "professional": number,
      "administrative": number,
      "depreciation": number,
      "other": number,
      "total": number
    },
    "operatingProfit": number,
    "operatingMargin": number,
    "financialResult": {
      "income": number,
      "expenses": number,
      "net": number
    },
    "netProfit": number,
    "netMargin": number
  },
  "comparison": {
    "previousMonth": {
      "netRevenue": number,
      "netProfit": number,
      "revenueChange": number,
      "profitChange": number
    },
    "yearToDate": {
      "netRevenue": number,
      "netProfit": number,
      "avgMonthlyRevenue": number,
      "avgMonthlyProfit": number
    },
    "vsTarget": {
      "revenueTarget": number,
      "revenueActual": number,
      "variance": number,
      "onTrack": boolean
    }
  },
  "insights": [{
    "type": "positive" | "negative" | "neutral",
    "metric": "string",
    "observation": "string",
    "recommendation": "string"
  }],
  "keyRatios": {
    "grossMargin": number,
    "operatingMargin": number,
    "netMargin": number,
    "revenuePerEmployee": number,
    "profitPerEmployee": number
  }
}`

export const BUDGET_VS_ACTUAL_PROMPT = `Compare orçado vs realizado e analise variações.

FORMATO JSON:
{
  "period": { "month": "string", "year": number },
  "summary": {
    "budgetedRevenue": number,
    "actualRevenue": number,
    "revenueVariance": number,
    "revenueVariancePercent": number,
    "budgetedExpenses": number,
    "actualExpenses": number,
    "expenseVariance": number,
    "expenseVariancePercent": number,
    "budgetedProfit": number,
    "actualProfit": number,
    "profitVariance": number
  },
  "revenueVariances": [{
    "category": "string",
    "budgeted": number,
    "actual": number,
    "variance": number,
    "variancePercent": number,
    "explanation": "string",
    "actionRequired": boolean
  }],
  "expenseVariances": [{
    "category": "string",
    "budgeted": number,
    "actual": number,
    "variance": number,
    "variancePercent": number,
    "explanation": "string",
    "actionRequired": boolean
  }],
  "significantVariances": [{
    "item": "string",
    "type": "revenue" | "expense",
    "variance": number,
    "impact": "favorable" | "unfavorable",
    "rootCause": "string",
    "correctiveAction": "string"
  }],
  "forecastAdjustment": {
    "originalYearForecast": number,
    "adjustedYearForecast": number,
    "adjustment": number,
    "reason": "string"
  }
}`

// =============================================================================
// REVENUE ANALYSIS PROMPTS
// =============================================================================

export const REVENUE_ANALYSIS_PROMPT = `Analise a receita por múltiplas dimensões.

FORMATO JSON:
{
  "period": { "start": "string", "end": "string" },
  "totalRevenue": number,
  "mrr": {
    "current": number,
    "previous": number,
    "growth": number,
    "target": number,
    "gapToTarget": number
  },
  "byLegalArea": [{
    "area": "string",
    "revenue": number,
    "percentage": number,
    "cases": number,
    "avgTicket": number,
    "margin": number,
    "trend": "growing" | "stable" | "declining"
  }],
  "byClient": [{
    "clientId": "string",
    "clientName": "string",
    "revenue": number,
    "percentage": number,
    "ltv": number,
    "tenure": number,
    "riskOfChurn": "low" | "medium" | "high"
  }],
  "byChannel": [{
    "channel": "string",
    "revenue": number,
    "cac": number,
    "ltv": number,
    "ltvCacRatio": number,
    "paybackMonths": number
  }],
  "cohortAnalysis": [{
    "cohort": "string",
    "initialClients": number,
    "currentClients": number,
    "retention": number,
    "revenuePerClient": number,
    "totalRevenue": number
  }],
  "revenueQuality": {
    "recurring": number,
    "recurringPercent": number,
    "oneTime": number,
    "successFees": number,
    "concentration": {
      "top5Clients": number,
      "top10Clients": number,
      "concentrationRisk": "low" | "medium" | "high"
    }
  },
  "projections": [{
    "month": "string",
    "projectedRevenue": number,
    "confidence": number,
    "assumptions": ["string"]
  }]
}`

export const PROFITABILITY_ANALYSIS_PROMPT = `Analise a rentabilidade por área, serviço e cliente.

FORMATO JSON:
{
  "period": { "start": "string", "end": "string" },
  "overallProfitability": {
    "grossMargin": number,
    "operatingMargin": number,
    "netMargin": number,
    "targetMargin": number,
    "gapToTarget": number
  },
  "byLegalArea": [{
    "area": "string",
    "revenue": number,
    "directCosts": number,
    "allocatedOverhead": number,
    "grossProfit": number,
    "grossMargin": number,
    "netProfit": number,
    "netMargin": number,
    "hoursWorked": number,
    "effectiveHourlyRate": number,
    "status": "profitable" | "break_even" | "loss"
  }],
  "byService": [{
    "service": "string",
    "revenue": number,
    "cost": number,
    "margin": number,
    "volume": number,
    "avgPrice": number,
    "recommendation": "increase_price" | "reduce_cost" | "promote" | "discontinue" | "maintain"
  }],
  "byClient": [{
    "clientId": "string",
    "clientName": "string",
    "revenue": number,
    "cost": number,
    "profit": number,
    "margin": number,
    "tier": "platinum" | "gold" | "silver" | "bronze" | "unprofitable"
  }],
  "costDrivers": [{
    "driver": "string",
    "currentCost": number,
    "benchmarkCost": number,
    "variance": number,
    "optimizationPotential": number,
    "recommendation": "string"
  }],
  "recommendations": [{
    "priority": number,
    "action": "string",
    "expectedImpact": number,
    "timeline": "string"
  }]
}`

// =============================================================================
// FORECASTING PROMPTS
// =============================================================================

export const FINANCIAL_FORECAST_PROMPT = `Crie projeção financeira para os próximos meses.

FORMATO JSON:
{
  "forecastPeriod": { "start": "string", "end": "string", "months": number },
  "assumptions": [{
    "category": "string",
    "assumption": "string",
    "value": number,
    "basis": "string"
  }],
  "revenueProjection": [{
    "month": "string",
    "projectedRevenue": number,
    "byArea": [{
      "area": "string",
      "projected": number
    }],
    "confidence": "high" | "medium" | "low",
    "keyDrivers": ["string"]
  }],
  "expenseProjection": [{
    "month": "string",
    "projectedExpenses": number,
    "fixed": number,
    "variable": number,
    "byCategory": [{
      "category": "string",
      "projected": number
    }]
  }],
  "profitProjection": [{
    "month": "string",
    "projectedRevenue": number,
    "projectedExpenses": number,
    "projectedProfit": number,
    "projectedMargin": number
  }],
  "cashFlowProjection": [{
    "month": "string",
    "startingCash": number,
    "operatingCashFlow": number,
    "investingCashFlow": number,
    "financingCashFlow": number,
    "endingCash": number
  }],
  "scenarios": {
    "base": {
      "totalRevenue": number,
      "totalProfit": number,
      "probability": number
    },
    "optimistic": {
      "totalRevenue": number,
      "totalProfit": number,
      "probability": number,
      "triggers": ["string"]
    },
    "pessimistic": {
      "totalRevenue": number,
      "totalProfit": number,
      "probability": number,
      "triggers": ["string"]
    }
  },
  "keyMilestones": [{
    "milestone": "string",
    "expectedDate": "string",
    "financialImpact": number,
    "status": "on_track" | "at_risk" | "delayed"
  }],
  "risks": [{
    "risk": "string",
    "probability": "high" | "medium" | "low",
    "financialImpact": number,
    "mitigation": "string"
  }]
}`

// =============================================================================
// REPORTING PROMPTS
// =============================================================================

export const WEEKLY_FINANCIAL_REPORT_PROMPT = `Gere relatório financeiro semanal.

FORMATO JSON:
{
  "period": { "weekNumber": number, "start": "string", "end": "string" },
  "executiveSummary": "string",
  "cashPosition": {
    "opening": number,
    "closing": number,
    "change": number,
    "runway": number
  },
  "revenue": {
    "thisWeek": number,
    "mtd": number,
    "target": number,
    "variance": number,
    "newClients": number,
    "newContracts": number
  },
  "collections": {
    "collected": number,
    "outstanding": number,
    "overdue": number,
    "overduePercent": number
  },
  "expenses": {
    "thisWeek": number,
    "mtd": number,
    "budget": number,
    "variance": number,
    "significantExpenses": [{
      "item": "string",
      "amount": number
    }]
  },
  "keyMetrics": {
    "mrr": number,
    "mrrChange": number,
    "avgDaysToCollect": number,
    "burnRate": number
  },
  "alerts": [{
    "severity": "critical" | "warning" | "info",
    "message": "string",
    "action": "string"
  }],
  "nextWeekFocus": ["string"]
}`

export const MONTHLY_FINANCIAL_REPORT_PROMPT = `Gere relatório financeiro mensal completo.

FORMATO JSON:
{
  "period": { "month": "string", "year": number },
  "executiveSummary": "string",
  "financialHighlights": [{
    "metric": "string",
    "value": number,
    "change": number,
    "status": "above_target" | "on_target" | "below_target"
  }],
  "incomeStatement": {
    "revenue": number,
    "costOfServices": number,
    "grossProfit": number,
    "operatingExpenses": number,
    "operatingProfit": number,
    "netProfit": number
  },
  "balanceSheetHighlights": {
    "cash": number,
    "receivables": number,
    "payables": number,
    "workingCapital": number
  },
  "keyRatios": [{
    "ratio": "string",
    "value": number,
    "target": number,
    "status": "good" | "warning" | "critical"
  }],
  "areaPerformance": [{
    "area": "string",
    "revenue": number,
    "margin": number,
    "trend": "up" | "stable" | "down"
  }],
  "clientMetrics": {
    "totalClients": number,
    "newClients": number,
    "churnedClients": number,
    "netClientGrowth": number,
    "avgRevenuePerClient": number
  },
  "cashFlowSummary": {
    "operatingCashFlow": number,
    "investingCashFlow": number,
    "financingCashFlow": number,
    "netCashFlow": number
  },
  "yearToDateSummary": {
    "totalRevenue": number,
    "totalProfit": number,
    "avgMonthlyRevenue": number,
    "projectedYearEndRevenue": number
  },
  "recommendations": [{
    "priority": "high" | "medium" | "low",
    "area": "string",
    "recommendation": "string",
    "expectedImpact": "string"
  }],
  "nextMonthOutlook": {
    "projectedRevenue": number,
    "projectedProfit": number,
    "keyInitiatives": ["string"],
    "risks": ["string"]
  }
}`

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Calculate financial health score
 */
export function calculateFinancialHealth(metrics: {
  liquidityRatio: number
  profitMargin: number
  debtRatio: number
  revenueGrowth: number
  cashRunway: number
}): { score: number; status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical' } {
  let score = 0

  // Liquidity (max 25 points)
  if (metrics.liquidityRatio >= 2) score += 25
  else if (metrics.liquidityRatio >= 1.5) score += 20
  else if (metrics.liquidityRatio >= 1) score += 15
  else if (metrics.liquidityRatio >= 0.5) score += 10
  else score += 5

  // Profit margin (max 25 points)
  if (metrics.profitMargin >= 0.2) score += 25
  else if (metrics.profitMargin >= 0.15) score += 20
  else if (metrics.profitMargin >= 0.1) score += 15
  else if (metrics.profitMargin >= 0.05) score += 10
  else if (metrics.profitMargin >= 0) score += 5

  // Debt ratio (max 20 points)
  if (metrics.debtRatio <= 0.3) score += 20
  else if (metrics.debtRatio <= 0.5) score += 15
  else if (metrics.debtRatio <= 0.7) score += 10
  else score += 5

  // Revenue growth (max 15 points)
  if (metrics.revenueGrowth >= 0.2) score += 15
  else if (metrics.revenueGrowth >= 0.1) score += 12
  else if (metrics.revenueGrowth >= 0) score += 8
  else score += 3

  // Cash runway (max 15 points)
  if (metrics.cashRunway >= 12) score += 15
  else if (metrics.cashRunway >= 6) score += 12
  else if (metrics.cashRunway >= 3) score += 8
  else score += 3

  const status = score >= 85 ? 'excellent'
    : score >= 70 ? 'good'
    : score >= 55 ? 'fair'
    : score >= 40 ? 'poor'
    : 'critical'

  return { score, status }
}

/**
 * Get expense categories
 */
export function getExpenseCategories(): string[] {
  return [
    'Salários e Encargos',
    'Aluguel e Condomínio',
    'Serviços de Terceiros',
    'Software e Tecnologia',
    'Marketing e Publicidade',
    'Custas e Taxas Judiciais',
    'Material de Escritório',
    'Telecomunicações',
    'Viagens e Deslocações',
    'Formação e Eventos',
    'Seguros',
    'Impostos',
    'Outros',
  ]
}

/**
 * Get revenue categories
 */
export function getRevenueCategories(): string[] {
  return [
    'Honorários Fixos',
    'Honorários de Êxito',
    'Consultoria',
    'Retainer Mensal',
    'Parecer Jurídico',
    'Due Diligence',
    'Outros',
  ]
}

/**
 * Format currency
 */
export function formatCurrency(value: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency,
  }).format(value)
}
