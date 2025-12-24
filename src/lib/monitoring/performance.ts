/**
 * Performance Monitoring Utilities
 *
 * Track and report performance metrics for optimization
 */

interface PerformanceMetric {
  name: string
  duration: number
  timestamp: number
  metadata?: Record<string, unknown>
}

interface PerformanceStats {
  count: number
  total: number
  min: number
  max: number
  avg: number
  p95: number
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric[]> = new Map()
  private readonly maxEntriesPerMetric = 1000

  /**
   * Start timing an operation
   */
  startTimer(name: string): () => number {
    const start = performance.now()

    return () => {
      const duration = performance.now() - start
      this.record(name, duration)
      return duration
    }
  }

  /**
   * Record a metric
   */
  record(name: string, duration: number, metadata?: Record<string, unknown>): void {
    const metric: PerformanceMetric = {
      name,
      duration,
      timestamp: Date.now(),
      metadata,
    }

    const existing = this.metrics.get(name) || []

    // Keep only recent entries
    if (existing.length >= this.maxEntriesPerMetric) {
      existing.shift()
    }

    existing.push(metric)
    this.metrics.set(name, existing)
  }

  /**
   * Get statistics for a metric
   */
  getStats(name: string): PerformanceStats | null {
    const entries = this.metrics.get(name)
    if (!entries || entries.length === 0) return null

    const durations = entries.map((e) => e.duration).sort((a, b) => a - b)
    const total = durations.reduce((sum, d) => sum + d, 0)

    return {
      count: durations.length,
      total,
      min: durations[0],
      max: durations[durations.length - 1],
      avg: total / durations.length,
      p95: durations[Math.floor(durations.length * 0.95)],
    }
  }

  /**
   * Get all stats
   */
  getAllStats(): Record<string, PerformanceStats> {
    const result: Record<string, PerformanceStats> = {}

    for (const name of this.metrics.keys()) {
      const stats = this.getStats(name)
      if (stats) result[name] = stats
    }

    return result
  }

  /**
   * Clear metrics for a specific name
   */
  clear(name: string): void {
    this.metrics.delete(name)
  }

  /**
   * Clear all metrics
   */
  clearAll(): void {
    this.metrics.clear()
  }

  /**
   * Get recent slow operations
   */
  getSlowOperations(thresholdMs: number = 1000): PerformanceMetric[] {
    const slow: PerformanceMetric[] = []

    for (const entries of this.metrics.values()) {
      for (const entry of entries) {
        if (entry.duration >= thresholdMs) {
          slow.push(entry)
        }
      }
    }

    return slow.sort((a, b) => b.duration - a.duration)
  }

  /**
   * Format stats for logging
   */
  formatStats(stats: PerformanceStats): string {
    return `count=${stats.count} avg=${stats.avg.toFixed(2)}ms p95=${stats.p95.toFixed(2)}ms min=${stats.min.toFixed(2)}ms max=${stats.max.toFixed(2)}ms`
  }

  /**
   * Log all stats
   */
  logStats(): void {
    const allStats = this.getAllStats()

    console.log('=== Performance Stats ===')
    for (const [name, stats] of Object.entries(allStats)) {
      console.log(`${name}: ${this.formatStats(stats)}`)
    }
    console.log('=========================')
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor()

/**
 * Decorator for tracking method performance
 */
export function trackPerformance(name?: string) {
  return function (
    _target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value
    const metricName = name || propertyKey

    descriptor.value = async function (...args: any[]) {
      const stop = performanceMonitor.startTimer(metricName)
      try {
        return await originalMethod.apply(this, args)
      } finally {
        stop()
      }
    }

    return descriptor
  }
}

/**
 * Measure async function performance
 */
export async function measure<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  const stop = performanceMonitor.startTimer(name)
  try {
    return await fn()
  } finally {
    stop()
  }
}

/**
 * Log performance warning if operation exceeds threshold
 */
export function warnSlow(
  name: string,
  duration: number,
  thresholdMs: number = 1000
): void {
  if (duration >= thresholdMs) {
    console.warn(
      `[Performance] Slow operation: ${name} took ${duration.toFixed(2)}ms (threshold: ${thresholdMs}ms)`
    )
  }
}

/**
 * Common metric names
 */
export const metricNames = {
  // Database operations
  dbQuery: 'db.query',
  dbInsert: 'db.insert',
  dbUpdate: 'db.update',
  dbDelete: 'db.delete',

  // API calls
  apiRequest: 'api.request',
  apiResponse: 'api.response',

  // AI operations
  aiCompletion: 'ai.completion',
  aiEmbedding: 'ai.embedding',

  // Cache operations
  cacheGet: 'cache.get',
  cacheSet: 'cache.set',

  // External services
  emailSend: 'email.send',
  smsSend: 'sms.send',
  whatsappSend: 'whatsapp.send',

  // Document operations
  documentGenerate: 'document.generate',
  documentSign: 'document.sign',
}
