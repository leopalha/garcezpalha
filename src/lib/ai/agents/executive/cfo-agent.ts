/**
 * CFO Agent
 * Responsible for financial management, analysis, and reporting
 */

import { EnhancedBaseAgent } from '../core/enhanced-base-agent'
import type { AgentRole, AgentContext, EnhancedAgentConfig } from '../core/agent-types'
import {
  CFO_AGENT_SYSTEM_PROMPT,
  CASH_FLOW_ANALYSIS_PROMPT,
  RECEIVABLES_ANALYSIS_PROMPT,
  DRE_ANALYSIS_PROMPT,
  BUDGET_VS_ACTUAL_PROMPT,
  REVENUE_ANALYSIS_PROMPT,
  PROFITABILITY_ANALYSIS_PROMPT,
  FINANCIAL_FORECAST_PROMPT,
  WEEKLY_FINANCIAL_REPORT_PROMPT,
  MONTHLY_FINANCIAL_REPORT_PROMPT,
  calculateFinancialHealth,
  getExpenseCategories,
  getRevenueCategories,
  formatCurrency,
} from '../../prompts/executive/cfo-prompts'

// =============================================================================
// TYPES
// =============================================================================

export interface CashFlowData {
  bankBalance: number
  accountsReceivable: number
  accountsPayable: number
  expectedInflows: Array<{ source: string; amount: number; date: string }>
  expectedOutflows: Array<{ destination: string; amount: number; date: string }>
}

export interface CashFlowAnalysis {
  period: { start: string; end: string }
  currentPosition: {
    bankBalance: number
    accountsReceivable: number
    accountsPayable: number
    netPosition: number
  }
  cashFlow: {
    inflows: Array<{
      source: string
      amount: number
      date: string
      probability: number
      category: 'honorarios' | 'exito' | 'consultoria' | 'outros'
    }>
    outflows: Array<{
      destination: string
      amount: number
      date: string
      type: 'fixed' | 'variable'
      category: 'salarios' | 'aluguel' | 'software' | 'marketing' | 'impostos' | 'outros'
    }>
  }
  projection: Array<{
    week: number
    startingBalance: number
    totalInflows: number
    totalOutflows: number
    endingBalance: number
    alerts: string[]
  }>
  healthIndicators: {
    runwayMonths: number
    liquidityRatio: number
    burnRate: number
    cashConversionCycle: number
  }
  recommendations: Array<{
    priority: 'critical' | 'high' | 'medium' | 'low'
    action: string
    impact: string
    deadline: string
  }>
  alerts: Array<{
    type: 'cash_shortage' | 'overdue_payment' | 'unusual_expense' | 'opportunity'
    severity: 'critical' | 'warning' | 'info'
    message: string
    suggestedAction: string
  }>
}

export interface ReceivablesAnalysis {
  summary: {
    totalReceivables: number
    current: number
    overdue1to30: number
    overdue31to60: number
    overdue61to90: number
    overdue90plus: number
    defaultRate: number
  }
  agingAnalysis: Array<{
    clientId: string
    clientName: string
    invoiceId: string
    amount: number
    dueDate: string
    daysOverdue: number
    riskLevel: 'low' | 'medium' | 'high' | 'critical'
    lastContact: string
    paymentHistory: 'good' | 'irregular' | 'poor'
  }>
  collectionPriority: Array<{
    clientId: string
    amount: number
    priority: number
    recommendedAction: string
    contactMethod: 'email' | 'phone' | 'whatsapp' | 'letter'
    suggestedMessage: string
  }>
  riskAssessment: {
    expectedCollections: number
    doubtfulDebts: number
    provisionNeeded: number
    writeOffCandidates: Array<{
      clientId: string
      amount: number
      reason: string
    }>
  }
  trends: {
    defaultRateTrend: 'increasing' | 'stable' | 'decreasing'
    avgDaysToPayTrend: 'increasing' | 'stable' | 'decreasing'
    currentDSO: number
    targetDSO: number
  }
  recommendations: Array<{
    action: string
    expectedRecovery: number
    effort: 'low' | 'medium' | 'high'
  }>
}

export interface DREAnalysis {
  period: { month: string; year: number }
  dre: {
    grossRevenue: {
      total: number
      byArea: Array<{ area: string; amount: number; percentage: number }>
      byType: Array<{
        type: 'honorarios' | 'exito' | 'consultoria' | 'retainer'
        amount: number
        percentage: number
      }>
    }
    deductions: {
      taxes: number
      discounts: number
      returns: number
      total: number
    }
    netRevenue: number
    costOfServices: {
      directLabor: number
      thirdPartyServices: number
      courtFees: number
      other: number
      total: number
    }
    grossProfit: number
    grossMargin: number
    operatingExpenses: {
      personnel: number
      rent: number
      utilities: number
      software: number
      marketing: number
      professional: number
      administrative: number
      depreciation: number
      other: number
      total: number
    }
    operatingProfit: number
    operatingMargin: number
    financialResult: {
      income: number
      expenses: number
      net: number
    }
    netProfit: number
    netMargin: number
  }
  comparison: {
    previousMonth: {
      netRevenue: number
      netProfit: number
      revenueChange: number
      profitChange: number
    }
    yearToDate: {
      netRevenue: number
      netProfit: number
      avgMonthlyRevenue: number
      avgMonthlyProfit: number
    }
    vsTarget: {
      revenueTarget: number
      revenueActual: number
      variance: number
      onTrack: boolean
    }
  }
  insights: Array<{
    type: 'positive' | 'negative' | 'neutral'
    metric: string
    observation: string
    recommendation: string
  }>
  keyRatios: {
    grossMargin: number
    operatingMargin: number
    netMargin: number
    revenuePerEmployee: number
    profitPerEmployee: number
  }
}

export interface BudgetVsActual {
  period: { month: string; year: number }
  summary: {
    budgetedRevenue: number
    actualRevenue: number
    revenueVariance: number
    revenueVariancePercent: number
    budgetedExpenses: number
    actualExpenses: number
    expenseVariance: number
    expenseVariancePercent: number
    budgetedProfit: number
    actualProfit: number
    profitVariance: number
  }
  revenueVariances: Array<{
    category: string
    budgeted: number
    actual: number
    variance: number
    variancePercent: number
    explanation: string
    actionRequired: boolean
  }>
  expenseVariances: Array<{
    category: string
    budgeted: number
    actual: number
    variance: number
    variancePercent: number
    explanation: string
    actionRequired: boolean
  }>
  significantVariances: Array<{
    item: string
    type: 'revenue' | 'expense'
    variance: number
    impact: 'favorable' | 'unfavorable'
    rootCause: string
    correctiveAction: string
  }>
  forecastAdjustment: {
    originalYearForecast: number
    adjustedYearForecast: number
    adjustment: number
    reason: string
  }
}

export interface RevenueAnalysis {
  period: { start: string; end: string }
  totalRevenue: number
  mrr: {
    current: number
    previous: number
    growth: number
    target: number
    gapToTarget: number
  }
  byLegalArea: Array<{
    area: string
    revenue: number
    percentage: number
    cases: number
    avgTicket: number
    margin: number
    trend: 'growing' | 'stable' | 'declining'
  }>
  byClient: Array<{
    clientId: string
    clientName: string
    revenue: number
    percentage: number
    ltv: number
    tenure: number
    riskOfChurn: 'low' | 'medium' | 'high'
  }>
  byChannel: Array<{
    channel: string
    revenue: number
    cac: number
    ltv: number
    ltvCacRatio: number
    paybackMonths: number
  }>
  revenueQuality: {
    recurring: number
    recurringPercent: number
    oneTime: number
    successFees: number
    concentration: {
      top5Clients: number
      top10Clients: number
      concentrationRisk: 'low' | 'medium' | 'high'
    }
  }
  projections: Array<{
    month: string
    projectedRevenue: number
    confidence: number
    assumptions: string[]
  }>
}

export interface ProfitabilityAnalysis {
  period: { start: string; end: string }
  overallProfitability: {
    grossMargin: number
    operatingMargin: number
    netMargin: number
    targetMargin: number
    gapToTarget: number
  }
  byLegalArea: Array<{
    area: string
    revenue: number
    directCosts: number
    allocatedOverhead: number
    grossProfit: number
    grossMargin: number
    netProfit: number
    netMargin: number
    hoursWorked: number
    effectiveHourlyRate: number
    status: 'profitable' | 'break_even' | 'loss'
  }>
  byService: Array<{
    service: string
    revenue: number
    cost: number
    margin: number
    volume: number
    avgPrice: number
    recommendation: 'increase_price' | 'reduce_cost' | 'promote' | 'discontinue' | 'maintain'
  }>
  byClient: Array<{
    clientId: string
    clientName: string
    revenue: number
    cost: number
    profit: number
    margin: number
    tier: 'platinum' | 'gold' | 'silver' | 'bronze' | 'unprofitable'
  }>
  costDrivers: Array<{
    driver: string
    currentCost: number
    benchmarkCost: number
    variance: number
    optimizationPotential: number
    recommendation: string
  }>
  recommendations: Array<{
    priority: number
    action: string
    expectedImpact: number
    timeline: string
  }>
}

export interface FinancialForecast {
  forecastPeriod: { start: string; end: string; months: number }
  assumptions: Array<{
    category: string
    assumption: string
    value: number
    basis: string
  }>
  revenueProjection: Array<{
    month: string
    projectedRevenue: number
    byArea: Array<{ area: string; projected: number }>
    confidence: 'high' | 'medium' | 'low'
    keyDrivers: string[]
  }>
  expenseProjection: Array<{
    month: string
    projectedExpenses: number
    fixed: number
    variable: number
    byCategory: Array<{ category: string; projected: number }>
  }>
  profitProjection: Array<{
    month: string
    projectedRevenue: number
    projectedExpenses: number
    projectedProfit: number
    projectedMargin: number
  }>
  cashFlowProjection: Array<{
    month: string
    startingCash: number
    operatingCashFlow: number
    investingCashFlow: number
    financingCashFlow: number
    endingCash: number
  }>
  scenarios: {
    base: { totalRevenue: number; totalProfit: number; probability: number }
    optimistic: { totalRevenue: number; totalProfit: number; probability: number; triggers: string[] }
    pessimistic: { totalRevenue: number; totalProfit: number; probability: number; triggers: string[] }
  }
  keyMilestones: Array<{
    milestone: string
    expectedDate: string
    financialImpact: number
    status: 'on_track' | 'at_risk' | 'delayed'
  }>
  risks: Array<{
    risk: string
    probability: 'high' | 'medium' | 'low'
    financialImpact: number
    mitigation: string
  }>
}

export interface WeeklyFinancialReport {
  period: { weekNumber: number; start: string; end: string }
  executiveSummary: string
  cashPosition: {
    opening: number
    closing: number
    change: number
    runway: number
  }
  revenue: {
    thisWeek: number
    mtd: number
    target: number
    variance: number
    newClients: number
    newContracts: number
  }
  collections: {
    collected: number
    outstanding: number
    overdue: number
    overduePercent: number
  }
  expenses: {
    thisWeek: number
    mtd: number
    budget: number
    variance: number
    significantExpenses: Array<{ item: string; amount: number }>
  }
  keyMetrics: {
    mrr: number
    mrrChange: number
    avgDaysToCollect: number
    burnRate: number
  }
  alerts: Array<{
    severity: 'critical' | 'warning' | 'info'
    message: string
    action: string
  }>
  nextWeekFocus: string[]
}

export interface MonthlyFinancialReport {
  period: { month: string; year: number }
  executiveSummary: string
  financialHighlights: Array<{
    metric: string
    value: number
    change: number
    status: 'above_target' | 'on_target' | 'below_target'
  }>
  incomeStatement: {
    revenue: number
    costOfServices: number
    grossProfit: number
    operatingExpenses: number
    operatingProfit: number
    netProfit: number
  }
  balanceSheetHighlights: {
    cash: number
    receivables: number
    payables: number
    workingCapital: number
  }
  keyRatios: Array<{
    ratio: string
    value: number
    target: number
    status: 'good' | 'warning' | 'critical'
  }>
  areaPerformance: Array<{
    area: string
    revenue: number
    margin: number
    trend: 'up' | 'stable' | 'down'
  }>
  clientMetrics: {
    totalClients: number
    newClients: number
    churnedClients: number
    netClientGrowth: number
    avgRevenuePerClient: number
  }
  cashFlowSummary: {
    operatingCashFlow: number
    investingCashFlow: number
    financingCashFlow: number
    netCashFlow: number
  }
  yearToDateSummary: {
    totalRevenue: number
    totalProfit: number
    avgMonthlyRevenue: number
    projectedYearEndRevenue: number
  }
  recommendations: Array<{
    priority: 'high' | 'medium' | 'low'
    area: string
    recommendation: string
    expectedImpact: string
  }>
  nextMonthOutlook: {
    projectedRevenue: number
    projectedProfit: number
    keyInitiatives: string[]
    risks: string[]
  }
}

// =============================================================================
// CFO AGENT CLASS
// =============================================================================

export class CFOAgent extends EnhancedBaseAgent {
  constructor(config?: Partial<EnhancedAgentConfig>) {
    super(CFO_AGENT_SYSTEM_PROMPT, 'cfo', {
      timeout: 120000, // Financial analysis can take longer
      ...config,
    })
  }

  get name(): string {
    return 'CFO Agent'
  }

  get role(): AgentRole {
    return 'cfo'
  }

  isRelevant(input: string): boolean {
    const keywords = [
      'financeiro', 'financeira', 'finanças', 'dinheiro', 'caixa',
      'receita', 'despesa', 'custo', 'lucro', 'margem', 'resultado',
      'faturação', 'faturamento', 'cobrança', 'inadimplência',
      'dre', 'balanço', 'orçamento', 'previsão', 'forecast',
      'mrr', 'cac', 'ltv', 'roi', 'runway', 'burn rate',
      'fluxo de caixa', 'cash flow', 'relatório financeiro',
    ]
    const lowerInput = input.toLowerCase()
    return keywords.some(keyword => lowerInput.includes(keyword))
  }

  // Override to require approval for financial recommendations
  protected shouldRequireApproval(content: string): boolean {
    const sensitivePatterns = [
      'recomend',
      'suger',
      'ação imediata',
      'critical',
      'decisão',
    ]
    const lowerContent = content.toLowerCase()
    return sensitivePatterns.some(pattern => lowerContent.includes(pattern))
  }

  // ===========================================================================
  // CASH FLOW ANALYSIS
  // ===========================================================================

  /**
   * Analyze cash flow and project future weeks
   */
  async analyzeCashFlow(
    data: CashFlowData,
    weeksToProject: number = 4,
    context?: AgentContext
  ): Promise<CashFlowAnalysis> {
    const prompt = `
${CASH_FLOW_ANALYSIS_PROMPT}

DADOS FINANCEIROS:
- Saldo bancário: ${formatCurrency(data.bankBalance)}
- Contas a receber: ${formatCurrency(data.accountsReceivable)}
- Contas a pagar: ${formatCurrency(data.accountsPayable)}

ENTRADAS ESPERADAS:
${data.expectedInflows.map(i => `- ${i.source}: ${formatCurrency(i.amount)} em ${i.date}`).join('\n')}

SAÍDAS ESPERADAS:
${data.expectedOutflows.map(o => `- ${o.destination}: ${formatCurrency(o.amount)} em ${o.date}`).join('\n')}

PERÍODO DE PROJEÇÃO: ${weeksToProject} semanas

Analise o fluxo de caixa e forneça projeções detalhadas no formato JSON especificado.
`

    const response = await this.processStructured<CashFlowAnalysis>(prompt, context)
    return response
  }

  /**
   * Analyze receivables and delinquency
   */
  async analyzeReceivables(
    receivablesData: Array<{
      clientId: string
      clientName: string
      invoiceId: string
      amount: number
      dueDate: string
      lastContact?: string
    }>,
    context?: AgentContext
  ): Promise<ReceivablesAnalysis> {
    const prompt = `
${RECEIVABLES_ANALYSIS_PROMPT}

CONTAS A RECEBER:
${receivablesData.map(r =>
  `- Cliente: ${r.clientName} (${r.clientId})
   Fatura: ${r.invoiceId}
   Valor: ${formatCurrency(r.amount)}
   Vencimento: ${r.dueDate}
   ${r.lastContact ? `Último contacto: ${r.lastContact}` : ''}`
).join('\n\n')}

DATA DE REFERÊNCIA: ${new Date().toISOString().split('T')[0]}

Analise as contas a receber e forneça estratégia de cobrança no formato JSON especificado.
`

    const response = await this.processStructured<ReceivablesAnalysis>(prompt, context)
    return response
  }

  // ===========================================================================
  // FINANCIAL STATEMENTS
  // ===========================================================================

  /**
   * Generate and analyze DRE (Income Statement)
   */
  async analyzeDRE(
    financialData: {
      month: string
      year: number
      revenue: Array<{ area: string; type: string; amount: number }>
      expenses: Array<{ category: string; amount: number }>
      previousMonthData?: { revenue: number; profit: number }
      targetRevenue?: number
      employeeCount?: number
    },
    context?: AgentContext
  ): Promise<DREAnalysis> {
    const totalRevenue = financialData.revenue.reduce((sum, r) => sum + r.amount, 0)
    const totalExpenses = financialData.expenses.reduce((sum, e) => sum + e.amount, 0)

    const prompt = `
${DRE_ANALYSIS_PROMPT}

PERÍODO: ${financialData.month}/${financialData.year}

RECEITAS:
${financialData.revenue.map(r => `- ${r.area} (${r.type}): ${formatCurrency(r.amount)}`).join('\n')}
Total: ${formatCurrency(totalRevenue)}

DESPESAS:
${financialData.expenses.map(e => `- ${e.category}: ${formatCurrency(e.amount)}`).join('\n')}
Total: ${formatCurrency(totalExpenses)}

${financialData.previousMonthData ? `
MÊS ANTERIOR:
- Receita: ${formatCurrency(financialData.previousMonthData.revenue)}
- Lucro: ${formatCurrency(financialData.previousMonthData.profit)}
` : ''}

${financialData.targetRevenue ? `META DE RECEITA: ${formatCurrency(financialData.targetRevenue)}` : ''}
${financialData.employeeCount ? `NÚMERO DE FUNCIONÁRIOS: ${financialData.employeeCount}` : ''}

Gere a DRE completa e análise no formato JSON especificado.
`

    const response = await this.processStructured<DREAnalysis>(prompt, context)
    return response
  }

  /**
   * Compare budget vs actual
   */
  async analyzeBudgetVsActual(
    budgetData: {
      month: string
      year: number
      budget: {
        revenue: Array<{ category: string; amount: number }>
        expenses: Array<{ category: string; amount: number }>
      }
      actual: {
        revenue: Array<{ category: string; amount: number }>
        expenses: Array<{ category: string; amount: number }>
      }
      yearForecast?: number
    },
    context?: AgentContext
  ): Promise<BudgetVsActual> {
    const prompt = `
${BUDGET_VS_ACTUAL_PROMPT}

PERÍODO: ${budgetData.month}/${budgetData.year}

RECEITAS ORÇADAS:
${budgetData.budget.revenue.map(r => `- ${r.category}: ${formatCurrency(r.amount)}`).join('\n')}

RECEITAS REALIZADAS:
${budgetData.actual.revenue.map(r => `- ${r.category}: ${formatCurrency(r.amount)}`).join('\n')}

DESPESAS ORÇADAS:
${budgetData.budget.expenses.map(e => `- ${e.category}: ${formatCurrency(e.amount)}`).join('\n')}

DESPESAS REALIZADAS:
${budgetData.actual.expenses.map(e => `- ${e.category}: ${formatCurrency(e.amount)}`).join('\n')}

${budgetData.yearForecast ? `PREVISÃO ANUAL ORIGINAL: ${formatCurrency(budgetData.yearForecast)}` : ''}

Compare orçado vs realizado e analise variações no formato JSON especificado.
`

    const response = await this.processStructured<BudgetVsActual>(prompt, context)
    return response
  }

  // ===========================================================================
  // REVENUE ANALYSIS
  // ===========================================================================

  /**
   * Analyze revenue from multiple dimensions
   */
  async analyzeRevenue(
    revenueData: {
      period: { start: string; end: string }
      transactions: Array<{
        clientId: string
        clientName: string
        legalArea: string
        channel: string
        amount: number
        type: 'recurring' | 'one_time' | 'success_fee'
        date: string
      }>
      mrrTarget?: number
      previousPeriodMRR?: number
    },
    context?: AgentContext
  ): Promise<RevenueAnalysis> {
    const totalRevenue = revenueData.transactions.reduce((sum, t) => sum + t.amount, 0)

    const prompt = `
${REVENUE_ANALYSIS_PROMPT}

PERÍODO: ${revenueData.period.start} a ${revenueData.period.end}

TRANSAÇÕES:
${revenueData.transactions.map(t =>
  `- ${t.clientName}: ${formatCurrency(t.amount)} (${t.legalArea}, ${t.type}, ${t.channel})`
).join('\n')}

TOTAL: ${formatCurrency(totalRevenue)}
${revenueData.mrrTarget ? `META MRR: ${formatCurrency(revenueData.mrrTarget)}` : ''}
${revenueData.previousPeriodMRR ? `MRR PERÍODO ANTERIOR: ${formatCurrency(revenueData.previousPeriodMRR)}` : ''}

Analise a receita por múltiplas dimensões no formato JSON especificado.
`

    const response = await this.processStructured<RevenueAnalysis>(prompt, context)
    return response
  }

  /**
   * Analyze profitability by area, service, and client
   */
  async analyzeProfitability(
    profitabilityData: {
      period: { start: string; end: string }
      byArea: Array<{
        area: string
        revenue: number
        directCosts: number
        hoursWorked: number
      }>
      byService: Array<{
        service: string
        revenue: number
        cost: number
        volume: number
      }>
      byClient: Array<{
        clientId: string
        clientName: string
        revenue: number
        cost: number
      }>
      overhead: number
      targetMargin?: number
    },
    context?: AgentContext
  ): Promise<ProfitabilityAnalysis> {
    const prompt = `
${PROFITABILITY_ANALYSIS_PROMPT}

PERÍODO: ${profitabilityData.period.start} a ${profitabilityData.period.end}

POR ÁREA JURÍDICA:
${profitabilityData.byArea.map(a =>
  `- ${a.area}: Receita ${formatCurrency(a.revenue)}, Custos ${formatCurrency(a.directCosts)}, ${a.hoursWorked}h trabalhadas`
).join('\n')}

POR SERVIÇO:
${profitabilityData.byService.map(s =>
  `- ${s.service}: Receita ${formatCurrency(s.revenue)}, Custo ${formatCurrency(s.cost)}, Volume ${s.volume}`
).join('\n')}

POR CLIENTE:
${profitabilityData.byClient.map(c =>
  `- ${c.clientName}: Receita ${formatCurrency(c.revenue)}, Custo ${formatCurrency(c.cost)}`
).join('\n')}

OVERHEAD: ${formatCurrency(profitabilityData.overhead)}
${profitabilityData.targetMargin ? `MARGEM ALVO: ${(profitabilityData.targetMargin * 100).toFixed(1)}%` : ''}

Analise a rentabilidade no formato JSON especificado.
`

    const response = await this.processStructured<ProfitabilityAnalysis>(prompt, context)
    return response
  }

  // ===========================================================================
  // FORECASTING
  // ===========================================================================

  /**
   * Create financial forecast
   */
  async createForecast(
    forecastData: {
      monthsToForecast: number
      historicalData: Array<{
        month: string
        revenue: number
        expenses: number
        profit: number
      }>
      assumptions?: Array<{ category: string; assumption: string; value: number }>
      knownCommitments?: Array<{ description: string; amount: number; date: string }>
    },
    context?: AgentContext
  ): Promise<FinancialForecast> {
    const prompt = `
${FINANCIAL_FORECAST_PROMPT}

PERÍODO DE PREVISÃO: ${forecastData.monthsToForecast} meses

DADOS HISTÓRICOS:
${forecastData.historicalData.map(h =>
  `- ${h.month}: Receita ${formatCurrency(h.revenue)}, Despesas ${formatCurrency(h.expenses)}, Lucro ${formatCurrency(h.profit)}`
).join('\n')}

${forecastData.assumptions ? `
PREMISSAS:
${forecastData.assumptions.map(a => `- ${a.category}: ${a.assumption} (${a.value})`).join('\n')}
` : ''}

${forecastData.knownCommitments ? `
COMPROMISSOS CONHECIDOS:
${forecastData.knownCommitments.map(c => `- ${c.description}: ${formatCurrency(c.amount)} em ${c.date}`).join('\n')}
` : ''}

Crie projeção financeira detalhada no formato JSON especificado.
`

    const response = await this.processStructured<FinancialForecast>(prompt, context)
    return response
  }

  // ===========================================================================
  // REPORTING
  // ===========================================================================

  /**
   * Generate weekly financial report
   */
  async generateWeeklyReport(
    weekData: {
      weekNumber: number
      startDate: string
      endDate: string
      openingCash: number
      closingCash: number
      revenue: number
      revenueMTD: number
      revenueTarget: number
      newClients: number
      newContracts: number
      collected: number
      outstanding: number
      overdue: number
      expenses: number
      expensesMTD: number
      expensesBudget: number
      significantExpenses: Array<{ item: string; amount: number }>
      mrr: number
      previousMRR: number
    },
    context?: AgentContext
  ): Promise<WeeklyFinancialReport> {
    const prompt = `
${WEEKLY_FINANCIAL_REPORT_PROMPT}

SEMANA: ${weekData.weekNumber} (${weekData.startDate} a ${weekData.endDate})

POSIÇÃO DE CAIXA:
- Abertura: ${formatCurrency(weekData.openingCash)}
- Fecho: ${formatCurrency(weekData.closingCash)}
- Variação: ${formatCurrency(weekData.closingCash - weekData.openingCash)}

RECEITAS:
- Esta semana: ${formatCurrency(weekData.revenue)}
- MTD: ${formatCurrency(weekData.revenueMTD)}
- Meta mensal: ${formatCurrency(weekData.revenueTarget)}
- Novos clientes: ${weekData.newClients}
- Novos contratos: ${weekData.newContracts}

COBRANÇAS:
- Recebido: ${formatCurrency(weekData.collected)}
- A receber: ${formatCurrency(weekData.outstanding)}
- Em atraso: ${formatCurrency(weekData.overdue)}

DESPESAS:
- Esta semana: ${formatCurrency(weekData.expenses)}
- MTD: ${formatCurrency(weekData.expensesMTD)}
- Orçamento: ${formatCurrency(weekData.expensesBudget)}
- Despesas significativas: ${weekData.significantExpenses.map(e => `${e.item}: ${formatCurrency(e.amount)}`).join(', ')}

MRR:
- Atual: ${formatCurrency(weekData.mrr)}
- Anterior: ${formatCurrency(weekData.previousMRR)}
- Variação: ${formatCurrency(weekData.mrr - weekData.previousMRR)}

Gere relatório semanal completo no formato JSON especificado.
`

    const response = await this.processStructured<WeeklyFinancialReport>(prompt, context)
    return response
  }

  /**
   * Generate monthly financial report
   */
  async generateMonthlyReport(
    monthData: {
      month: string
      year: number
      revenue: number
      costOfServices: number
      operatingExpenses: number
      financialResult: number
      cash: number
      receivables: number
      payables: number
      totalClients: number
      newClients: number
      churnedClients: number
      operatingCashFlow: number
      investingCashFlow: number
      financingCashFlow: number
      ytdRevenue: number
      ytdProfit: number
      areaPerformance: Array<{ area: string; revenue: number; margin: number }>
    },
    context?: AgentContext
  ): Promise<MonthlyFinancialReport> {
    const grossProfit = monthData.revenue - monthData.costOfServices
    const operatingProfit = grossProfit - monthData.operatingExpenses
    const netProfit = operatingProfit + monthData.financialResult

    const prompt = `
${MONTHLY_FINANCIAL_REPORT_PROMPT}

PERÍODO: ${monthData.month}/${monthData.year}

DEMONSTRAÇÃO DE RESULTADOS:
- Receita: ${formatCurrency(monthData.revenue)}
- Custo dos Serviços: ${formatCurrency(monthData.costOfServices)}
- Lucro Bruto: ${formatCurrency(grossProfit)}
- Despesas Operacionais: ${formatCurrency(monthData.operatingExpenses)}
- Lucro Operacional: ${formatCurrency(operatingProfit)}
- Resultado Financeiro: ${formatCurrency(monthData.financialResult)}
- Lucro Líquido: ${formatCurrency(netProfit)}

BALANÇO (DESTAQUES):
- Caixa: ${formatCurrency(monthData.cash)}
- Contas a Receber: ${formatCurrency(monthData.receivables)}
- Contas a Pagar: ${formatCurrency(monthData.payables)}
- Capital de Giro: ${formatCurrency(monthData.cash + monthData.receivables - monthData.payables)}

CLIENTES:
- Total: ${monthData.totalClients}
- Novos: ${monthData.newClients}
- Churn: ${monthData.churnedClients}
- Crescimento líquido: ${monthData.newClients - monthData.churnedClients}

FLUXO DE CAIXA:
- Operacional: ${formatCurrency(monthData.operatingCashFlow)}
- Investimentos: ${formatCurrency(monthData.investingCashFlow)}
- Financiamentos: ${formatCurrency(monthData.financingCashFlow)}
- Total: ${formatCurrency(monthData.operatingCashFlow + monthData.investingCashFlow + monthData.financingCashFlow)}

ACUMULADO ANO:
- Receita: ${formatCurrency(monthData.ytdRevenue)}
- Lucro: ${formatCurrency(monthData.ytdProfit)}

DESEMPENHO POR ÁREA:
${monthData.areaPerformance.map(a => `- ${a.area}: Receita ${formatCurrency(a.revenue)}, Margem ${(a.margin * 100).toFixed(1)}%`).join('\n')}

Gere relatório mensal completo no formato JSON especificado.
`

    const response = await this.processStructured<MonthlyFinancialReport>(prompt, context)
    return response
  }

  // ===========================================================================
  // HELPER METHODS
  // ===========================================================================

  /**
   * Calculate financial health score
   */
  calculateFinancialHealth(metrics: {
    liquidityRatio: number
    profitMargin: number
    debtRatio: number
    revenueGrowth: number
    cashRunway: number
  }) {
    return calculateFinancialHealth(metrics)
  }

  /**
   * Get expense categories
   */
  getExpenseCategories(): string[] {
    return getExpenseCategories()
  }

  /**
   * Get revenue categories
   */
  getRevenueCategories(): string[] {
    return getRevenueCategories()
  }

  /**
   * Format currency
   */
  formatCurrency(value: number, currency: string = 'EUR'): string {
    return formatCurrency(value, currency)
  }
}

// =============================================================================
// FACTORY FUNCTION
// =============================================================================

/**
 * Create a new CFO Agent instance
 */
export function createCFOAgent(config?: Partial<EnhancedAgentConfig>): CFOAgent {
  return new CFOAgent(config)
}

// Singleton instance
let cfoAgentInstance: CFOAgent | null = null

/**
 * Get singleton CFO Agent instance
 */
export function getCFOAgent(): CFOAgent {
  if (!cfoAgentInstance) {
    cfoAgentInstance = createCFOAgent()
  }
  return cfoAgentInstance
}

// =============================================================================
// EXPORTS
// =============================================================================

export { calculateFinancialHealth, getExpenseCategories, getRevenueCategories, formatCurrency }
