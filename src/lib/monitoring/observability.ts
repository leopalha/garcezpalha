/**
 * Monitoring & Observability Layer
 * Garcez Palha - MANUS v7.0
 *
 * Tracks: Errors, Performance, API Calls, User Actions
 */

interface MonitoringEvent {
  type: 'error' | 'performance' | 'api' | 'user_action'
  message: string
  data?: any
  timestamp: string
  environment: string
}

class Monitor {
  private events: MonitoringEvent[] = []
  private maxEvents = 100

  track(event: Omit<MonitoringEvent, 'timestamp' | 'environment'>) {
    const fullEvent: MonitoringEvent = {
      ...event,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    }

    this.events.push(fullEvent)

    // Keep only recent events
    if (this.events.length > this.maxEvents) {
      this.events.shift()
    }

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      const emoji = this.getEmoji(event.type)
      console.log(`${emoji} [${event.type.toUpperCase()}]`, event.message, event.data || '')
    }

    // In production, send to external service
    if (process.env.NODE_ENV === 'production') {
      this.sendToExternalService(fullEvent)
    }
  }

  private getEmoji(type: MonitoringEvent['type']): string {
    const emojis = {
      error: '🔴',
      performance: '⚡',
      api: '📡',
      user_action: '👤',
    }
    return emojis[type] || '📊'
  }

  private sendToExternalService(event: MonitoringEvent) {
    // Placeholder for Sentry, LogRocket, DataDog, etc.
    // In production, send to your monitoring service:
    /*
    fetch('/api/monitoring/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    }).catch(console.error)
    */
  }

  getRecentEvents(type?: MonitoringEvent['type'], limit = 50) {
    const filtered = type ? this.events.filter(e => e.type === type) : this.events
    return filtered.slice(-limit)
  }

  getEventStats() {
    const stats = {
      total: this.events.length,
      byType: {} as Record<string, number>,
      recentErrors: this.getRecentEvents('error', 10).length,
    }

    this.events.forEach(event => {
      stats.byType[event.type] = (stats.byType[event.type] || 0) + 1
    })

    return stats
  }
}

export const monitor = new Monitor()

// ============================================================================
// ERROR TRACKING
// ============================================================================

export function trackError(error: Error, context?: any) {
  monitor.track({
    type: 'error',
    message: error.message,
    data: {
      name: error.name,
      stack: error.stack,
      ...context,
    },
  })
}

export function trackValidationError(endpoint: string, errors: any[], userId?: string) {
  monitor.track({
    type: 'error',
    message: `Validation failed: ${endpoint}`,
    data: {
      endpoint,
      errors,
      userId,
      errorCount: errors.length,
    },
  })
}

// ============================================================================
// PERFORMANCE TRACKING
// ============================================================================

export function trackPerformance(metric: string, value: number, context?: any) {
  monitor.track({
    type: 'performance',
    message: metric,
    data: {
      value,
      unit: 'ms',
      ...context,
    },
  })

  // Alert on slow operations
  if (value > 2000) {
    console.warn(`⚠️  SLOW OPERATION: ${metric} took ${value}ms`)
  }
}

export class PerformanceTimer {
  private startTime: number
  private metric: string

  constructor(metric: string) {
    this.metric = metric
    this.startTime = Date.now()
  }

  end(context?: any) {
    const duration = Date.now() - this.startTime
    trackPerformance(this.metric, duration, context)
    return duration
  }
}

// ============================================================================
// API MONITORING
// ============================================================================

export function trackApiCall(
  endpoint: string,
  duration: number,
  status: number,
  context?: any
) {
  monitor.track({
    type: 'api',
    message: endpoint,
    data: {
      duration,
      status,
      success: status >= 200 && status < 300,
      ...context,
    },
  })

  // Alert on errors
  if (status >= 500) {
    console.error(`🚨 API ERROR: ${endpoint} returned ${status}`)
  }

  // Alert on slow APIs
  if (duration > 1000) {
    console.warn(`🐌 SLOW API: ${endpoint} took ${duration}ms`)
  }
}

export function trackApiError(endpoint: string, error: Error, userId?: string) {
  monitor.track({
    type: 'api',
    message: `API Error: ${endpoint}`,
    data: {
      error: error.message,
      endpoint,
      userId,
    },
  })
}

// ============================================================================
// USER ACTION TRACKING
// ============================================================================

export function trackUserAction(action: string, data?: any) {
  monitor.track({
    type: 'user_action',
    message: action,
    data,
  })
}

export function trackConversion(conversionType: string, value?: number, metadata?: any) {
  monitor.track({
    type: 'user_action',
    message: `Conversion: ${conversionType}`,
    data: {
      conversionType,
      value,
      ...metadata,
    },
  })
}

// ============================================================================
// HEALTH CHECKS
// ============================================================================

export function getSystemHealth() {
  const stats = monitor.getEventStats()
  const recentErrors = monitor.getRecentEvents('error', 10)

  return {
    status: recentErrors.length > 5 ? 'degraded' : 'healthy',
    timestamp: new Date().toISOString(),
    stats,
    recentErrors: recentErrors.map(e => ({
      message: e.message,
      timestamp: e.timestamp,
    })),
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export type { MonitoringEvent }
