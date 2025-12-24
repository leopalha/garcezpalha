/**
 * Executive Agents Module
 * Exports all executive-level agents (C-Suite)
 */

// CEO Agent
export {
  CEOAgent,
  createCEOAgent,
  getCEOAgent,
  type DailyBriefing,
  type StrategicDecision,
  type ResourceAllocation,
  type PriorityMatrix,
  type AgentCoordination,
  type EscalationResolution,
  type WeeklyExecutiveReport,
  type MonthlyStrategicReview,
} from './ceo-agent'

// CMO Agent
export {
  CMOAgent,
  createCMOAgent,
  getCMOAgent,
  type MarketingStrategy,
  type BudgetAllocation,
  type ContentCalendarCoordination,
  type CampaignCoordination,
  type ChannelPerformance,
  type MarketingROI,
  type WeeklyMarketingReport,
} from './cmo-agent'

// COO Agent
export {
  COOAgent,
  createCOOAgent,
  getCOOAgent,
  type OperationsDashboard,
  type CapacityPlanning,
  type ProcessOptimization,
  type AgentWorkload,
  type QualityMetrics,
  type IncidentAnalysis,
  type DailyOperationsReport,
  type WeeklyOperationsReport,
} from './coo-agent'

// CFO Agent
export {
  CFOAgent,
  createCFOAgent,
  getCFOAgent,
  calculateFinancialHealth,
  getExpenseCategories,
  getRevenueCategories,
  formatCurrency,
  type CashFlowData,
  type CashFlowAnalysis,
  type ReceivablesAnalysis,
  type DREAnalysis,
  type BudgetVsActual,
  type RevenueAnalysis,
  type ProfitabilityAnalysis,
  type FinancialForecast,
  type WeeklyFinancialReport,
  type MonthlyFinancialReport,
} from './cfo-agent'
