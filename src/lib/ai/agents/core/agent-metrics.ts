/**
 * Agent Metrics - Performance tracking for AI agents
 * Tracks response times, token usage, success rates, and more
 */

import type { AgentRole, AgentCategory } from './agent-types'

// =============================================================================
// METRIC TYPES
// =============================================================================

export interface AgentMetric {
  timestamp: Date
  agent: AgentRole
  category: AgentCategory
  metricType: MetricType
  value: number
  metadata?: Record<string, unknown>
}

export type MetricType =
  | 'response_time'      // ms
  | 'tokens_used'        // count
  | 'tokens_prompt'      // count
  | 'tokens_completion'  // count
  | 'request_count'      // count
  | 'success_count'      // count
  | 'error_count'        // count
  | 'confidence_score'   // 0-1
  | 'content_length'     // characters
  | 'api_latency'        // ms
  | 'queue_wait_time'    // ms
  | 'cost_estimate'      // cents

export interface MetricsSummary {
  agent: AgentRole
  period: 'hour' | 'day' | 'week' | 'month'
  startTime: Date
  endTime: Date
  totalRequests: number
  successRate: number
  avgResponseTime: number
  p95ResponseTime: number
  p99ResponseTime: number
  totalTokensUsed: number
  avgTokensPerRequest: number
  totalErrors: number
  avgConfidence: number
  estimatedCost: number
}

// =============================================================================
// METRICS COLLECTOR
// =============================================================================

class MetricsCollector {
  private metrics: AgentMetric[] = []
  private maxSize: number
  private enabled: boolean

  constructor(maxSize = 10000, enabled = true) {
    this.maxSize = maxSize
    this.enabled = enabled
  }

  /**
   * Record a metric
   */
  record(
    agent: AgentRole,
    category: AgentCategory,
    metricType: MetricType,
    value: number,
    metadata?: Record<string, unknown>
  ): void {
    if (!this.enabled) return

    this.metrics.push({
      timestamp: new Date(),
      agent,
      category,
      metricType,
      value,
      metadata,
    })

    // Trim old metrics if necessary
    if (this.metrics.length > this.maxSize) {
      this.metrics = this.metrics.slice(-this.maxSize)
    }
  }

  /**
   * Record response time
   */
  recordResponseTime(agent: AgentRole, category: AgentCategory, durationMs: number): void {
    this.record(agent, category, 'response_time', durationMs)
  }

  /**
   * Record token usage
   */
  recordTokens(
    agent: AgentRole,
    category: AgentCategory,
    promptTokens: number,
    completionTokens: number
  ): void {
    this.record(agent, category, 'tokens_prompt', promptTokens)
    this.record(agent, category, 'tokens_completion', completionTokens)
    this.record(agent, category, 'tokens_used', promptTokens + completionTokens)
  }

  /**
   * Record request success
   */
  recordSuccess(agent: AgentRole, category: AgentCategory): void {
    this.record(agent, category, 'request_count', 1)
    this.record(agent, category, 'success_count', 1)
  }

  /**
   * Record request error
   */
  recordError(agent: AgentRole, category: AgentCategory, errorType?: string): void {
    this.record(agent, category, 'request_count', 1)
    this.record(agent, category, 'error_count', 1, { errorType })
  }

  /**
   * Record confidence score
   */
  recordConfidence(agent: AgentRole, category: AgentCategory, confidence: number): void {
    this.record(agent, category, 'confidence_score', confidence)
  }

  /**
   * Get metrics for a specific agent within a time range
   */
  getMetrics(
    agent?: AgentRole,
    metricType?: MetricType,
    since?: Date
  ): AgentMetric[] {
    let filtered = this.metrics

    if (agent) {
      filtered = filtered.filter(m => m.agent === agent)
    }

    if (metricType) {
      filtered = filtered.filter(m => m.metricType === metricType)
    }

    if (since) {
      filtered = filtered.filter(m => m.timestamp >= since)
    }

    return filtered
  }

  /**
   * Get summary for an agent
   */
  getSummary(
    agent: AgentRole,
    period: 'hour' | 'day' | 'week' | 'month' = 'day'
  ): MetricsSummary {
    const now = new Date()
    const periodMs = {
      hour: 60 * 60 * 1000,
      day: 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000,
    }

    const since = new Date(now.getTime() - periodMs[period])
    const metrics = this.getMetrics(agent, undefined, since)

    // Calculate statistics
    const responseTimes = metrics
      .filter(m => m.metricType === 'response_time')
      .map(m => m.value)
      .sort((a, b) => a - b)

    const totalRequests = metrics
      .filter(m => m.metricType === 'request_count')
      .reduce((sum, m) => sum + m.value, 0)

    const successCount = metrics
      .filter(m => m.metricType === 'success_count')
      .reduce((sum, m) => sum + m.value, 0)

    const errorCount = metrics
      .filter(m => m.metricType === 'error_count')
      .reduce((sum, m) => sum + m.value, 0)

    const totalTokens = metrics
      .filter(m => m.metricType === 'tokens_used')
      .reduce((sum, m) => sum + m.value, 0)

    const confidenceScores = metrics
      .filter(m => m.metricType === 'confidence_score')
      .map(m => m.value)

    // Get category for the agent
    const agentCategory = metrics.length > 0 ? metrics[0].category : 'operations'

    return {
      agent,
      period,
      startTime: since,
      endTime: now,
      totalRequests,
      successRate: totalRequests > 0 ? successCount / totalRequests : 0,
      avgResponseTime: responseTimes.length > 0
        ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
        : 0,
      p95ResponseTime: percentile(responseTimes, 95),
      p99ResponseTime: percentile(responseTimes, 99),
      totalTokensUsed: totalTokens,
      avgTokensPerRequest: totalRequests > 0 ? totalTokens / totalRequests : 0,
      totalErrors: errorCount,
      avgConfidence: confidenceScores.length > 0
        ? confidenceScores.reduce((a, b) => a + b, 0) / confidenceScores.length
        : 0,
      estimatedCost: estimateCost(totalTokens),
    }
  }

  /**
   * Get summary for all agents
   */
  getAllSummaries(period: 'hour' | 'day' | 'week' | 'month' = 'day'): MetricsSummary[] {
    const agents = [...new Set(this.metrics.map(m => m.agent))]
    return agents.map(agent => this.getSummary(agent, period))
  }

  /**
   * Get aggregated metrics by category
   */
  getByCategory(category: AgentCategory, since?: Date): AgentMetric[] {
    let filtered = this.metrics.filter(m => m.category === category)
    if (since) {
      filtered = filtered.filter(m => m.timestamp >= since)
    }
    return filtered
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics = []
  }

  /**
   * Export metrics for analytics
   */
  export(): AgentMetric[] {
    return [...this.metrics]
  }
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function percentile(values: number[], p: number): number {
  if (values.length === 0) return 0
  const index = Math.ceil((p / 100) * values.length) - 1
  return values[Math.max(0, index)]
}

function estimateCost(tokens: number): number {
  // Rough estimate based on GPT-4 pricing ($0.03/1K input, $0.06/1K output)
  // Assuming 60% prompt, 40% completion
  const promptTokens = tokens * 0.6
  const completionTokens = tokens * 0.4
  const cost = (promptTokens / 1000 * 0.03) + (completionTokens / 1000 * 0.06)
  return Math.round(cost * 100) // Return in cents
}

// =============================================================================
// SINGLETON INSTANCE
// =============================================================================

let metricsCollector: MetricsCollector | null = null

export function getMetricsCollector(): MetricsCollector {
  if (!metricsCollector) {
    metricsCollector = new MetricsCollector()
  }
  return metricsCollector
}

// =============================================================================
// CONVENIENCE FUNCTIONS
// =============================================================================

/**
 * Create a metrics tracker for an agent
 */
export function createMetricsTracker(agent: AgentRole, category: AgentCategory) {
  const collector = getMetricsCollector()

  return {
    recordResponseTime: (durationMs: number) =>
      collector.recordResponseTime(agent, category, durationMs),

    recordTokens: (promptTokens: number, completionTokens: number) =>
      collector.recordTokens(agent, category, promptTokens, completionTokens),

    recordSuccess: () =>
      collector.recordSuccess(agent, category),

    recordError: (errorType?: string) =>
      collector.recordError(agent, category, errorType),

    recordConfidence: (confidence: number) =>
      collector.recordConfidence(agent, category, confidence),

    getSummary: (period: 'hour' | 'day' | 'week' | 'month' = 'day') =>
      collector.getSummary(agent, period),
  }
}

/**
 * Track operation duration and record metrics
 */
export function trackOperation<T>(
  agent: AgentRole,
  category: AgentCategory,
  operation: () => Promise<T>
): Promise<T> {
  const collector = getMetricsCollector()
  const startTime = Date.now()

  return operation()
    .then(result => {
      const duration = Date.now() - startTime
      collector.recordResponseTime(agent, category, duration)
      collector.recordSuccess(agent, category)
      return result
    })
    .catch(error => {
      const duration = Date.now() - startTime
      collector.recordResponseTime(agent, category, duration)
      collector.recordError(agent, category, error.name)
      throw error
    })
}

// =============================================================================
// DASHBOARD DATA
// =============================================================================

export interface DashboardMetrics {
  overview: {
    totalRequests24h: number
    successRate24h: number
    avgResponseTime24h: number
    totalTokens24h: number
    estimatedCost24h: number
  }
  byAgent: MetricsSummary[]
  byCategory: Record<AgentCategory, {
    requests: number
    avgResponseTime: number
    errorRate: number
  }>
  trends: {
    hour: TrendPoint[]
    day: TrendPoint[]
  }
}

export interface TrendPoint {
  timestamp: Date
  requests: number
  avgResponseTime: number
  errors: number
}

/**
 * Get metrics for dashboard display
 */
export function getDashboardMetrics(): DashboardMetrics {
  const collector = getMetricsCollector()
  const now = new Date()
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)

  // Get all summaries for the last 24 hours
  const summaries = collector.getAllSummaries('day')

  // Calculate overview
  const overview = {
    totalRequests24h: summaries.reduce((sum, s) => sum + s.totalRequests, 0),
    successRate24h: summaries.length > 0
      ? summaries.reduce((sum, s) => sum + s.successRate, 0) / summaries.length
      : 0,
    avgResponseTime24h: summaries.length > 0
      ? summaries.reduce((sum, s) => sum + s.avgResponseTime, 0) / summaries.length
      : 0,
    totalTokens24h: summaries.reduce((sum, s) => sum + s.totalTokensUsed, 0),
    estimatedCost24h: summaries.reduce((sum, s) => sum + s.estimatedCost, 0),
  }

  // Get metrics by category
  const categories: AgentCategory[] = ['legal', 'executive', 'marketing', 'operations', 'intelligence']
  const byCategory: Record<AgentCategory, { requests: number; avgResponseTime: number; errorRate: number }> =
    {} as Record<AgentCategory, { requests: number; avgResponseTime: number; errorRate: number }>

  for (const category of categories) {
    const categoryMetrics = collector.getByCategory(category, oneDayAgo)
    const requests = categoryMetrics.filter(m => m.metricType === 'request_count').reduce((sum, m) => sum + m.value, 0)
    const errors = categoryMetrics.filter(m => m.metricType === 'error_count').reduce((sum, m) => sum + m.value, 0)
    const responseTimes = categoryMetrics.filter(m => m.metricType === 'response_time').map(m => m.value)

    byCategory[category] = {
      requests,
      avgResponseTime: responseTimes.length > 0
        ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
        : 0,
      errorRate: requests > 0 ? errors / requests : 0,
    }
  }

  // Calculate trends (simplified - would need aggregation in production)
  const hourTrends: TrendPoint[] = []
  const dayTrends: TrendPoint[] = []

  // Generate hourly trend points for last 24 hours
  for (let i = 23; i >= 0; i--) {
    const hourStart = new Date(now.getTime() - (i + 1) * 60 * 60 * 1000)
    const hourEnd = new Date(now.getTime() - i * 60 * 60 * 1000)
    const hourMetrics = collector.export().filter(
      m => m.timestamp >= hourStart && m.timestamp < hourEnd
    )

    dayTrends.push({
      timestamp: hourStart,
      requests: hourMetrics.filter(m => m.metricType === 'request_count').reduce((sum, m) => sum + m.value, 0),
      avgResponseTime: calculateAvg(hourMetrics.filter(m => m.metricType === 'response_time').map(m => m.value)),
      errors: hourMetrics.filter(m => m.metricType === 'error_count').reduce((sum, m) => sum + m.value, 0),
    })
  }

  // Generate 5-minute trend points for last hour
  for (let i = 11; i >= 0; i--) {
    const periodStart = new Date(now.getTime() - (i + 1) * 5 * 60 * 1000)
    const periodEnd = new Date(now.getTime() - i * 5 * 60 * 1000)
    const periodMetrics = collector.export().filter(
      m => m.timestamp >= periodStart && m.timestamp < periodEnd
    )

    hourTrends.push({
      timestamp: periodStart,
      requests: periodMetrics.filter(m => m.metricType === 'request_count').reduce((sum, m) => sum + m.value, 0),
      avgResponseTime: calculateAvg(periodMetrics.filter(m => m.metricType === 'response_time').map(m => m.value)),
      errors: periodMetrics.filter(m => m.metricType === 'error_count').reduce((sum, m) => sum + m.value, 0),
    })
  }

  return {
    overview,
    byAgent: summaries,
    byCategory,
    trends: {
      hour: hourTrends,
      day: dayTrends,
    },
  }
}

function calculateAvg(values: number[]): number {
  if (values.length === 0) return 0
  return values.reduce((a, b) => a + b, 0) / values.length
}
