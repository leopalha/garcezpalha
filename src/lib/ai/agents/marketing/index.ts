/**
 * Marketing Agents Module
 * Exports all marketing-related agents
 */

// Content Agent
export {
  ContentAgent,
  getContentAgent,
  type InstagramPost,
  type LinkedInPost,
  type SocialPost,
  type BlogArticle,
  type Newsletter,
  type VideoScript,
  type ContentCalendar,
  type TopicIdeas,
} from './content-agent'

// Social Agent
export {
  SocialAgent,
  createSocialAgent,
  getOptimalTimes,
  getHashtagLimits,
  isOptimalTime,
  type SocialPlatform,
  type Comment,
  type CommentResponse,
  type EngagementMetrics,
  type EngagementAnalysis,
  type ScheduledPost,
  type ScheduleOptimization,
  type HashtagStrategy,
  type PlatformOptimization,
} from './social-agent'

// Ads Agent
export {
  AdsAgent,
  createAdsAgent,
  getAdsAgent,
  getLegalAdsBenchmarks,
  getRecommendedKeywords,
  getNegativeKeywords,
  getAdCharacterLimits,
  type AdPlatform,
  type CampaignObjective,
  type MatchType,
  type BidStrategy,
  type GoogleAdsCampaign,
  type MetaAdsCampaign,
  type CampaignOptimization,
  type KeywordAnalysis,
  type AudienceAnalysis,
  type BudgetAllocation,
  type WeeklyAdsReport,
  type LeadQualityAnalysis,
  type CampaignPerformanceData,
} from './ads-agent'

// SEO Agent
export {
  SEOAgent,
  createSEOAgent,
  getSEOAgent,
  getSEOBenchmarks,
  getPrimaryKeywords,
  getLegalSchemaTypes,
  calculateContentScore,
  type SearchIntent,
  type KeywordData,
  type KeywordResearch,
  type ContentGapAnalysis,
  type PageOptimization,
  type ContentBrief,
  type TechnicalAudit,
  type LocalSEOAudit,
  type BacklinkAnalysis,
  type SEOMonthlyReport,
} from './seo-agent'

// Video Agent
export {
  VideoAgent,
  createVideoAgent,
  getVideoAgent,
  getOptimalDuration,
  getVideoSpecs,
  getHookTemplates,
  getCTATemplates,
  type VideoPlatform,
  type VideoType,
  type ReelsScript,
  type YouTubeScript,
  type WebinarStructure,
  type StoriesSeries,
  type TestimonialScript,
  type VideoSEO,
  type VideoSeries,
  type VideoCalendar,
} from './video-agent'

// Design Agent
export {
  DesignAgent,
  createDesignAgent,
  getDesignAgent,
  getBrandColors,
  getFontPairings,
  getPlatformDimensions,
  getLegalIcons,
  getImageStyleGuide,
  type DesignFormat,
  type LayoutType,
  type ElementType,
  type DesignElement,
  type InstagramPostDesign,
  type LinkedInPostDesign,
  type StoriesDesign,
  type ThumbnailDesign,
  type EbookCoverDesign,
  type InfographicDesign,
} from './design-agent'
