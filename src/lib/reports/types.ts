/**
 * P2-005: Automated Reports System
 * Sistema de relatórios automáticos (KPIs, Analytics, Compliance)
 */

export type ReportType =
  | 'leads-conversion' // Taxa de conversão de leads
  | 'revenue-monthly' // Receita mensal
  | 'cases-status' // Status dos casos
  | 'product-performance' // Performance por produto
  | 'agent-performance' // Performance dos agentes IA
  | 'compliance-oab' // Compliance OAB
  | 'payment-analysis' // Análise de pagamentos
  | 'process-tracking' // Acompanhamento de processos
  | 'customer-satisfaction' // Satisfação de clientes (NPS)
  | 'operational-metrics' // Métricas operacionais

export type ReportFormat = 'json' | 'pdf' | 'excel' | 'csv' | 'html'

export type ReportFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'on-demand'

export interface ReportConfig {
  id: string
  type: ReportType
  name: string
  description: string
  frequency: ReportFrequency
  format: ReportFormat
  enabled: boolean

  // Scheduling
  schedule?: string // Cron expression
  timezone: string
  lastRun?: string
  nextRun?: string

  // Recipients
  recipients: ReportRecipient[]

  // Filters
  filters?: ReportFilters
  dateRange?: { start: string; end: string }

  // Metadata
  createdAt: string
  updatedAt: string
}

export interface ReportRecipient {
  email: string
  name?: string
  role?: string
}

export interface ReportFilters {
  productIds?: string[]
  categories?: string[]
  agentIds?: string[]
  status?: string[]
  minRevenue?: number
  maxRevenue?: number
  dateField?: string
}

export interface ReportData {
  id: string
  configId: string
  type: ReportType
  name: string
  generatedAt: string
  period: { start: string; end: string }
  data: Record<string, unknown>
  summary: ReportSummary
  format: ReportFormat
  fileUrl?: string
  size?: number
  metadata: {
    configId: string
    format: ReportFormat
    generatedBy?: string
    executionTime?: number
    recordCount?: number
    filters?: ReportFilters
  }
}

export interface ReportSummary {
  totalRecords: number
  keyMetrics: KeyMetric[]
  insights: string[]
  recommendations?: string[]
}

export interface KeyMetric {
  name: string
  value: number | string
  unit?: string
  trend?: 'up' | 'down' | 'stable'
  change?: number // Percentual
  comparison?: string
}

/**
 * Specific report data structures
 */

export interface LeadsConversionReport {
  period: { start: string; end: string }
  totals: {
    leads: number
    qualified: number
    converted: number
    revenue: number
  }
  conversionRate: number
  averageTicket: number
  byProduct: Array<{
    productId: string
    productName: string
    leads: number
    conversions: number
    rate: number
    revenue: number
  }>
  bySource: Array<{
    source: string
    leads: number
    conversions: number
    rate: number
  }>
  timeline: Array<{
    date: string
    leads: number
    conversions: number
    revenue: number
  }>
}

export interface RevenueMonthlyReport {
  period: { start: string; end: string }
  totalRevenue: number
  projectedRevenue: number
  growth: number // Percentual vs. mês anterior
  byProduct: Array<{
    productId: string
    productName: string
    revenue: number
    count: number
    averageTicket: number
    share: number // Percentual do total
  }>
  byCategory: Array<{
    category: string
    revenue: number
    count: number
    share: number
  }>
  timeline: Array<{
    date: string
    revenue: number
    cumulative: number
  }>
  topPerformers: Array<{
    productId: string
    productName: string
    revenue: number
  }>
}

export interface CasesStatusReport {
  period: { start: string; end: string }
  totals: {
    active: number
    completed: number
    pending: number
    cancelled: number
  }
  averageResolutionTime: number // dias
  byStatus: Array<{
    status: string
    count: number
    percentage: number
  }>
  byProduct: Array<{
    productId: string
    productName: string
    active: number
    completed: number
    successRate: number
  }>
  aging: Array<{
    range: string // "0-7 days", "8-30 days", etc.
    count: number
    percentage: number
  }>
}

export interface ProductPerformanceReport {
  period: { start: string; end: string }
  products: Array<{
    productId: string
    productName: string
    category: string
    metrics: {
      leads: number
      conversions: number
      conversionRate: number
      revenue: number
      averageTicket: number
    }
    trends: {
      leadsGrowth: number
      revenueGrowth: number
      rateChange: number
    }
    ranking: number
  }>
  topPerformers: Array<{
    productId: string
    productName: string
    revenue: number
    growth: number
  }>
  underperformers: Array<{
    productId: string
    productName: string
    revenue: number
    issues: string[]
  }>
}

export interface AgentPerformanceReport {
  period: { start: string; end: string }
  agents: Array<{
    agentId: string
    agentName: string
    metrics: {
      conversations: number
      avgDuration: number
      qualificationRate: number
      conversionRate: number
      satisfactionScore: number
    }
    performance: 'excellent' | 'good' | 'average' | 'poor'
    insights: string[]
  }>
  topPerformers: Array<{
    agentId: string
    agentName: string
    conversionRate: number
  }>
}

export interface ComplianceOABReport {
  period: { start: string; end: string }
  violations: Array<{
    date: string
    type: string
    description: string
    severity: 'low' | 'medium' | 'high' | 'critical'
    resolved: boolean
  }>
  summary: {
    totalViolations: number
    resolved: number
    pending: number
    critical: number
  }
  byType: Array<{
    type: string
    count: number
    resolved: number
  }>
  recommendations: string[]
}

export interface PaymentAnalysisReport {
  period: { start: string; end: string }
  payments: {
    total: number
    successful: number
    failed: number
    pending: number
    refunded: number
  }
  revenue: {
    collected: number
    pending: number
    failed: number
    refunded: number
  }
  byMethod: Array<{
    method: string
    count: number
    amount: number
    successRate: number
  }>
  defaulters: Array<{
    leadId: string
    name: string
    amount: number
    daysOverdue: number
  }>
}

export interface OperationalMetricsReport {
  period: { start: string; end: string }
  systemHealth: {
    uptime: number // Percentual
    avgResponseTime: number // ms
    errorRate: number // Percentual
  }
  automation: {
    emailsSent: number
    whatsappSent: number
    documentsGenerated: number
    contractsSigned: number
  }
  costs: {
    openai: number
    anthropic: number
    resend: number
    supabase: number
    total: number
  }
  efficiency: {
    costPerLead: number
    costPerConversion: number
    roi: number
  }
}
