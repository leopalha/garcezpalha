/**
 * Agent Types - Core type definitions for the AI Vertical system
 * Defines all types for executive, marketing, operations, and intelligence agents
 */

// =============================================================================
// AGENT ROLES AND CATEGORIES
// =============================================================================

/** Legal agent roles (existing) */
export type LegalAgentRole =
  | 'real-estate'
  | 'forensics'
  | 'valuation'
  | 'medical'
  | 'criminal'
  | 'financial-protection'
  | 'health-insurance'
  | 'social-security'

/** Executive agent roles */
export type ExecutiveAgentRole = 'ceo' | 'cmo' | 'coo' | 'cfo'

/** Marketing agent roles */
export type MarketingAgentRole = 'content' | 'social' | 'ads' | 'seo' | 'video' | 'design'

/** Operations agent roles */
export type OperationsAgentRole = 'qa' | 'admin' | 'triagem' | 'production'

/** Intelligence agent roles */
export type IntelligenceAgentRole = 'pricing' | 'market_intel' | 'market-intel'

/** All agent roles */
export type AgentRole =
  | LegalAgentRole
  | ExecutiveAgentRole
  | MarketingAgentRole
  | OperationsAgentRole
  | IntelligenceAgentRole
  | 'general'

/** Agent categories */
export type AgentCategory = 'legal' | 'executive' | 'marketing' | 'operations' | 'intelligence'

// =============================================================================
// AGENT CONFIGURATION
// =============================================================================

/** Base agent configuration */
export interface AgentConfig {
  model?: string
  temperature?: number
  maxTokens?: number
  stream?: boolean
}

/** Enhanced agent configuration with additional options */
export interface EnhancedAgentConfig extends AgentConfig {
  /** Enable detailed logging */
  enableLogging?: boolean
  /** Enable performance metrics */
  enableMetrics?: boolean
  /** Retry configuration */
  retry?: {
    maxAttempts: number
    delayMs: number
    backoffMultiplier: number
  }
  /** Timeout in milliseconds */
  timeout?: number
  /** Tags for categorization */
  tags?: string[]
}

// =============================================================================
// MESSAGES AND CONTEXT
// =============================================================================

/** Chat message */
export interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}

/** Agent context for processing */
export interface AgentContext {
  conversationId?: string
  userId?: string
  sessionData?: Record<string, unknown>
  /** Additional metadata */
  metadata?: Record<string, unknown>
}

/** Extended context for executive agents */
export interface ExecutiveContext extends AgentContext {
  /** Current business metrics */
  metrics?: BusinessMetrics
  /** Active alerts */
  alerts?: Alert[]
  /** Pending decisions */
  pendingDecisions?: Decision[]
}

// =============================================================================
// AGENT RESPONSES
// =============================================================================

/** Base agent response */
export interface AgentResponse {
  content: string
  tokensUsed?: number
  model?: string
  finishReason?: string
}

/** Enhanced response with metadata */
export interface EnhancedAgentResponse extends AgentResponse {
  /** Agent that processed the request */
  agentRole: AgentRole
  /** Processing duration in ms */
  durationMs: number
  /** Confidence score (0-1) */
  confidence: number
  /** Suggested actions */
  suggestedActions?: SuggestedAction[]
  /** Warnings or notes */
  warnings?: string[]
  /** Requires human approval */
  requiresApproval?: boolean
}

/** Orchestrator response with routing info */
export interface OrchestratorResponse extends EnhancedAgentResponse {
  /** Agent that was selected */
  agentUsed: AgentRole
  /** Alternative agents considered */
  alternativeAgents?: Array<{
    role: AgentRole
    confidence: number
    reason: string
  }>
}

// =============================================================================
// BUSINESS ENTITIES
// =============================================================================

/** Business metrics for executive decisions */
export interface BusinessMetrics {
  /** Daily active leads */
  dailyLeads: number
  /** Conversion rate */
  conversionRate: number
  /** Average ticket value */
  averageTicket: number
  /** Monthly recurring revenue */
  mrr: number
  /** Customer acquisition cost */
  cac: number
  /** Marketing spend */
  marketingSpend: number
  /** Content published this week */
  contentPublished: number
  /** Ad performance */
  adPerformance?: {
    impressions: number
    clicks: number
    ctr: number
    conversions: number
    spend: number
    roas: number
  }
}

/** Alert for monitoring */
export interface Alert {
  id: string
  type: 'error' | 'warning' | 'info' | 'success'
  category: AgentCategory
  title: string
  message: string
  createdAt: Date
  resolvedAt?: Date
  priority: 'critical' | 'high' | 'medium' | 'low'
}

/** Decision requiring approval */
export interface Decision {
  id: string
  type: DecisionType
  title: string
  description: string
  proposedBy: AgentRole
  proposedAt: Date
  status: 'pending' | 'approved' | 'rejected' | 'expired'
  impact: 'high' | 'medium' | 'low'
  estimatedValue?: number
  options?: DecisionOption[]
  selectedOption?: string
  approvedBy?: string
  approvedAt?: Date
}

export type DecisionType =
  | 'pricing-change'
  | 'budget-allocation'
  | 'content-approval'
  | 'campaign-launch'
  | 'client-discount'
  | 'escalation'
  | 'strategy-change'

export interface DecisionOption {
  id: string
  label: string
  description: string
  pros: string[]
  cons: string[]
  estimatedImpact: string
}

/** Suggested action from agent */
export interface SuggestedAction {
  id: string
  type: ActionType
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  estimatedImpact?: string
  requiresApproval: boolean
  deadline?: Date
}

export type ActionType =
  | 'follow-up'
  | 'publish-content'
  | 'adjust-campaign'
  | 'contact-lead'
  | 'review-document'
  | 'escalate'
  | 'schedule-meeting'
  | 'send-notification'

// =============================================================================
// CONTENT AND MARKETING
// =============================================================================

/** Social media platforms */
export type SocialPlatform = 'instagram' | 'linkedin' | 'facebook' | 'twitter' | 'tiktok' | 'youtube'

/** Content types */
export type ContentType =
  | 'social-post'
  | 'blog-article'
  | 'newsletter'
  | 'video-script'
  | 'ad-copy'
  | 'email'
  | 'legal-document'

/** Content generation request */
export interface ContentRequest {
  type: ContentType
  platform?: SocialPlatform
  topic: string
  tone?: 'professional' | 'casual' | 'educational' | 'promotional'
  targetAudience?: string
  keywords?: string[]
  maxLength?: number
  includeHashtags?: boolean
  includeCTA?: boolean
  legalArea?: string
}

/** Generated content */
export interface GeneratedContent {
  id: string
  type: ContentType
  platform?: SocialPlatform
  title?: string
  content: string
  hashtags?: string[]
  cta?: string
  mediaUrl?: string
  scheduledFor?: Date
  status: 'draft' | 'scheduled' | 'published' | 'failed'
  createdAt: Date
  publishedAt?: Date
  metrics?: ContentMetrics
}

/** Content performance metrics */
export interface ContentMetrics {
  impressions: number
  reach: number
  engagements: number
  likes: number
  comments: number
  shares: number
  clicks: number
  conversions: number
}

/** Ad campaign */
export interface AdCampaign {
  id: string
  platform: 'google' | 'meta' | 'linkedin'
  name: string
  status: 'active' | 'paused' | 'completed' | 'draft'
  budget: number
  spend: number
  startDate: Date
  endDate?: Date
  targeting?: AdTargeting
  metrics?: AdMetrics
}

export interface AdTargeting {
  locations?: string[]
  ageRange?: { min: number; max: number }
  interests?: string[]
  keywords?: string[]
  audiences?: string[]
}

export interface AdMetrics {
  impressions: number
  clicks: number
  ctr: number
  cpc: number
  conversions: number
  conversionRate: number
  cost: number
  roas: number
}

// =============================================================================
// OPERATIONS AND QA
// =============================================================================

/** Quality review result */
export interface QualityReview {
  id: string
  documentId: string
  documentType: string
  reviewedAt: Date
  reviewedBy: AgentRole
  score: number
  issues: QualityIssue[]
  suggestions: string[]
  approved: boolean
  comments?: string
}

export interface QualityIssue {
  type: 'formatting' | 'legal-citation' | 'grammar' | 'compliance' | 'accuracy'
  severity: 'critical' | 'major' | 'minor'
  location?: string
  description: string
  suggestion?: string
}

/** System health status */
export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: Date
  services: ServiceStatus[]
  alerts: Alert[]
}

export interface ServiceStatus {
  name: string
  status: 'up' | 'down' | 'degraded'
  latency?: number
  lastCheck: Date
  errorRate?: number
}

// =============================================================================
// PRICING AND INTELLIGENCE
// =============================================================================

/** Pricing recommendation */
export interface PricingRecommendation {
  productId: string
  currentPrice: number
  recommendedPrice: number
  confidence: number
  factors: PricingFactor[]
  effectiveDate?: Date
  validUntil?: Date
}

export interface PricingFactor {
  name: string
  impact: number
  description: string
}

/** Market insight */
export interface MarketInsight {
  id: string
  type: 'trend' | 'opportunity' | 'threat' | 'competitor'
  title: string
  description: string
  source?: string
  confidence: number
  relevance: number
  createdAt: Date
  actionable: boolean
  suggestedActions?: string[]
}

// =============================================================================
// WORKFLOW TYPES
// =============================================================================

/** Workflow definition */
export interface Workflow {
  id: string
  name: string
  type: 'daily' | 'weekly' | 'trigger'
  description: string
  steps: WorkflowStep[]
  schedule?: string
  triggerEvent?: string
  enabled: boolean
  lastRun?: Date
  nextRun?: Date
}

export interface WorkflowStep {
  id: string
  name: string
  agent: AgentRole
  action: string
  inputs?: Record<string, unknown>
  dependsOn?: string[]
  timeout?: number
}

/** Workflow execution result */
export interface WorkflowResult {
  workflowId: string
  executionId: string
  status: 'success' | 'partial' | 'failed'
  startedAt: Date
  completedAt?: Date
  stepResults: StepResult[]
  output?: unknown
  error?: string
}

export interface StepResult {
  stepId: string
  status: 'success' | 'failed' | 'skipped'
  durationMs: number
  output?: unknown
  error?: string
}

// =============================================================================
// CONSTANTS
// =============================================================================

/** Default model configurations */
export const DEFAULT_MODEL = 'gpt-4-turbo'
export const GROQ_DEFAULT_MODEL = 'llama-3.3-70b-versatile'
export const DEFAULT_TEMPERATURE = 0.7
export const DEFAULT_MAX_TOKENS = 4000

/** Agent temperature presets by category */
export const TEMPERATURE_PRESETS: Record<AgentCategory, number> = {
  legal: 0.3,      // More deterministic for legal accuracy
  executive: 0.5,  // Balanced for strategic decisions
  marketing: 0.8,  // More creative for content
  operations: 0.4, // Moderate for operational tasks
  intelligence: 0.6, // Balanced for analysis
}

/** Compliance disclaimers */
export const OAB_DISCLAIMER = `
AVISO LEGAL: Este conteúdo é de caráter informativo e educacional, não constituindo aconselhamento jurídico específico.
Para análise do seu caso particular, consulte um advogado.
Garcez Palha Advocacia - OAB/XX nº XXXXX.
`.trim()

export const LGPD_NOTICE = `
Seus dados são tratados conforme a Lei Geral de Proteção de Dados (LGPD).
Para mais informações, acesse nossa Política de Privacidade.
`.trim()
