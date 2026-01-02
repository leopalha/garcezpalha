/**
 * Circuit Breaker Pattern Implementation
 * Provides resilience for external API calls with automatic fallback
 */

// @ts-expect-error - opossum has no types
import CircuitBreaker from 'opossum'
import { logger } from '@/lib/logger'

// Circuit Breaker Options
interface CircuitBreakerConfig {
  timeout: number // Max time for function execution (ms)
  errorThresholdPercentage: number // % of errors to trigger OPEN state
  resetTimeout: number // Time before trying HALF_OPEN (ms)
  rollingCountTimeout: number // Time window for error counting (ms)
  rollingCountBuckets: number // Number of buckets in window
  volumeThreshold: number // Minimum calls before checking error rate
  name: string // Identifier for logging
}

const defaultConfig: Partial<CircuitBreakerConfig> = {
  timeout: 10000, // 10s
  errorThresholdPercentage: 50, // 50% errors
  resetTimeout: 30000, // 30s
  rollingCountTimeout: 10000, // 10s window
  rollingCountBuckets: 10,
  volumeThreshold: 5, // Min 5 calls
}

/**
 * Create a Circuit Breaker with fallback strategy
 */
export function createCircuitBreaker<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  config: Partial<CircuitBreakerConfig> & { name: string },
  fallback?: (...args: T) => Promise<R>
): CircuitBreaker<T, R> {
  const options = { ...defaultConfig, ...config }

  const breaker = new CircuitBreaker<T, R>(fn, {
    timeout: options.timeout!,
    errorThresholdPercentage: options.errorThresholdPercentage!,
    resetTimeout: options.resetTimeout!,
    rollingCountTimeout: options.rollingCountTimeout!,
    rollingCountBuckets: options.rollingCountBuckets!,
    volumeThreshold: options.volumeThreshold!,
    name: options.name,
  })

  // Event listeners for observability
  breaker.on('open', () => {
    logger.error(`Circuit breaker OPEN: ${options.name}`, {
      breaker: options.name,
      state: 'OPEN',
    })
  })

  breaker.on('halfOpen', () => {
    logger.warn(`Circuit breaker HALF_OPEN: ${options.name}`, {
      breaker: options.name,
      state: 'HALF_OPEN',
    })
  })

  breaker.on('close', () => {
    logger.info(`Circuit breaker CLOSED: ${options.name}`, {
      breaker: options.name,
      state: 'CLOSED',
    })
  })

  breaker.on('success', (_result: unknown) => {
    logger.info(`Circuit breaker success: ${options.name}`, {
      breaker: options.name,
      state: breaker.status.state,
    })
  })

  breaker.on('failure', (error: Error) => {
    logger.error(`Circuit breaker failure: ${options.name}`, {
      breaker: options.name,
      state: breaker.status.state,
      error: error.message,
    })
  })

  breaker.on('timeout', () => {
    logger.error(`Circuit breaker timeout: ${options.name}`, {
      breaker: options.name,
      timeout: options.timeout,
    })
  })

  // Set fallback if provided
  if (fallback) {
    breaker.fallback(fallback)
  }

  return breaker
}

/**
 * Get circuit breaker stats for monitoring
 */
export function getCircuitBreakerStats(breaker: CircuitBreaker<any, any>) {
  const stats = breaker.status.stats

  return {
    state: breaker.status.state,
    failures: stats.failures,
    successes: stats.successes,
    timeouts: stats.timeouts,
    fallbacks: stats.fallbacks,
    rejects: stats.rejects,
    fires: stats.fires,
    latencyMean: stats.latencyMean,
    latencyTotal: stats.latencyTimes.reduce((a: number, b: number) => a + b, 0),
    errorRate:
      stats.fires > 0 ? ((stats.failures + stats.timeouts) / stats.fires) * 100 : 0,
  }
}

/**
 * Circuit Breaker Metrics for Dashboard
 */
export function getAllCircuitBreakerMetrics(
  breakers: Record<string, CircuitBreaker<any, any>>
) {
  const metrics: Record<
    string,
    ReturnType<typeof getCircuitBreakerStats>
  > = {}

  for (const [name, breaker] of Object.entries(breakers)) {
    metrics[name] = getCircuitBreakerStats(breaker)
  }

  return metrics
}
