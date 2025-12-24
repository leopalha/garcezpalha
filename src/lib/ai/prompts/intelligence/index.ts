/**
 * Intelligence Prompts Module
 * Exports all intelligence-related prompts
 */

// Pricing Prompts
export {
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
} from './pricing-prompts'

// Market Intel Prompts
export {
  MARKET_INTEL_AGENT_SYSTEM_PROMPT,
  MARKET_OVERVIEW_PROMPT,
  COMPETITIVE_ANALYSIS_PROMPT,
  TREND_ANALYSIS_PROMPT,
  NICHE_ANALYSIS_PROMPT,
  OPPORTUNITY_SCANNER_PROMPT,
  BENCHMARKING_PROMPT,
  WEEKLY_INTEL_REPORT_PROMPT,
  QUARTERLY_MARKET_REPORT_PROMPT,
  getPortugalEconomicIndicators,
  getMarketSegments,
  getIntelSources,
  calculateMarketAttractiveness,
} from './market-intel-prompts'
