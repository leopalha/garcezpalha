/**
 * Intelligence Agents Module
 * Exports all intelligence-related agents
 */

// Pricing Agent
export {
  PricingAgent,
  createPricingAgent,
  getPricingAgent,
  getOABMinimumFees,
  calculateSuccessFee,
  getRecommendedPricingModel,
  calculateElasticityImpact,
  type PricingModel,
  type PriceTier,
  type ClientSegment,
  type ServicePricingInput,
  type ServicePricing,
  type ClientWillingness,
  type PricingOptimization,
  type CompetitorPricing,
  type Quote,
  type RetainerProposal,
  type DiscountAnalysis,
} from './pricing-agent'

// Market Intel Agent
export {
  MarketIntelAgent,
  createMarketIntelAgent,
  getMarketIntelAgent,
  getPortugalEconomicIndicators,
  getMarketSegments,
  getIntelSources,
  calculateMarketAttractiveness,
  type MarketOverview,
  type CompetitiveAnalysis,
  type TrendAnalysis,
  type NicheAnalysis,
  type OpportunityScanner,
  type Benchmarking,
  type WeeklyIntelReport,
  type QuarterlyMarketReport,
} from './market-intel-agent'
