/**
 * Agent Logger - Structured logging for AI agents
 * Provides consistent logging format with context and metrics
 */

import type { AgentRole, AgentCategory } from './agent-types'

// =============================================================================
// LOG LEVELS AND TYPES
// =============================================================================

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface LogEntry {
  timestamp: string
  level: LogLevel
  agent: AgentRole
  category: AgentCategory
  action: string
  message: string
  duration?: number
  metadata?: Record<string, unknown>
  error?: {
    name: string
    message: string
    stack?: string
  }
}

export interface LogContext {
  conversationId?: string
  userId?: string
  sessionId?: string
  requestId?: string
}

// =============================================================================
// LOGGER CLASS
// =============================================================================

export class AgentLogger {
  private agent: AgentRole
  private category: AgentCategory
  private context: LogContext
  private enabled: boolean

  constructor(
    agent: AgentRole,
    category: AgentCategory,
    context: LogContext = {},
    enabled = true
  ) {
    this.agent = agent
    this.category = category
    this.context = context
    this.enabled = enabled
  }

  /**
   * Create a new logger with additional context
   */
  withContext(additionalContext: Partial<LogContext>): AgentLogger {
    return new AgentLogger(
      this.agent,
      this.category,
      { ...this.context, ...additionalContext },
      this.enabled
    )
  }

  /**
   * Log debug information
   */
  debug(action: string, message: string, metadata?: Record<string, unknown>): void {
    this.log('debug', action, message, metadata)
  }

  /**
   * Log informational message
   */
  info(action: string, message: string, metadata?: Record<string, unknown>): void {
    this.log('info', action, message, metadata)
  }

  /**
   * Log warning
   */
  warn(action: string, message: string, metadata?: Record<string, unknown>): void {
    this.log('warn', action, message, metadata)
  }

  /**
   * Log error with optional error object
   */
  error(action: string, message: string, error?: Error, metadata?: Record<string, unknown>): void {
    const entry = this.createEntry('error', action, message, metadata)
    if (error) {
      entry.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      }
    }
    this.emit(entry)
  }

  /**
   * Log with duration tracking
   */
  logWithDuration(
    level: LogLevel,
    action: string,
    message: string,
    durationMs: number,
    metadata?: Record<string, unknown>
  ): void {
    const entry = this.createEntry(level, action, message, metadata)
    entry.duration = durationMs
    this.emit(entry)
  }

  /**
   * Create a timer for tracking operation duration
   */
  startTimer(action: string): () => void {
    const startTime = performance.now()
    return () => {
      const duration = Math.round(performance.now() - startTime)
      this.logWithDuration('info', action, `${action} completed`, duration)
    }
  }

  /**
   * Log start of an operation
   */
  logStart(action: string, metadata?: Record<string, unknown>): number {
    this.info(action, `Starting ${action}`, metadata)
    return Date.now()
  }

  /**
   * Log end of an operation with duration
   */
  logEnd(action: string, startTime: number, metadata?: Record<string, unknown>): void {
    const duration = Date.now() - startTime
    this.logWithDuration('info', action, `Completed ${action}`, duration, metadata)
  }

  /**
   * Log an agent decision
   */
  logDecision(
    action: string,
    decision: string,
    reasoning: string,
    confidence: number,
    metadata?: Record<string, unknown>
  ): void {
    this.info(action, `Decision: ${decision}`, {
      ...metadata,
      reasoning,
      confidence,
      decisionType: action,
    })
  }

  /**
   * Log agent routing
   */
  logRouting(
    fromAgent: AgentRole,
    toAgent: AgentRole,
    confidence: number,
    reason: string
  ): void {
    this.info('routing', `Routing from ${fromAgent} to ${toAgent}`, {
      fromAgent,
      toAgent,
      confidence,
      reason,
    })
  }

  /**
   * Log API call
   */
  logApiCall(
    endpoint: string,
    method: string,
    status: number,
    durationMs: number,
    metadata?: Record<string, unknown>
  ): void {
    const level = status >= 400 ? 'error' : 'info'
    this.logWithDuration(level, 'api-call', `${method} ${endpoint} -> ${status}`, durationMs, {
      ...metadata,
      endpoint,
      method,
      status,
    })
  }

  /**
   * Log content generation
   */
  logContentGeneration(
    contentType: string,
    platform?: string,
    tokensUsed?: number,
    metadata?: Record<string, unknown>
  ): void {
    this.info('content-generation', `Generated ${contentType}${platform ? ` for ${platform}` : ''}`, {
      ...metadata,
      contentType,
      platform,
      tokensUsed,
    })
  }

  // =============================================================================
  // PRIVATE METHODS
  // =============================================================================

  private log(level: LogLevel, action: string, message: string, metadata?: Record<string, unknown>): void {
    const entry = this.createEntry(level, action, message, metadata)
    this.emit(entry)
  }

  private createEntry(
    level: LogLevel,
    action: string,
    message: string,
    metadata?: Record<string, unknown>
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      agent: this.agent,
      category: this.category,
      action,
      message,
      metadata: {
        ...this.context,
        ...metadata,
      },
    }
  }

  private emit(entry: LogEntry): void {
    if (!this.enabled) return

    const prefix = `[${entry.agent.toUpperCase()}]`
    const contextStr = entry.metadata?.requestId ? ` [${entry.metadata.requestId}]` : ''

    // Format for console
    const consoleMessage = `${prefix}${contextStr} ${entry.message}`

    switch (entry.level) {
      case 'debug':
        if (process.env.NODE_ENV === 'development') {
          console.debug(consoleMessage, entry.metadata)
        }
        break
      case 'info':
        console.log(consoleMessage, entry.duration ? `(${entry.duration}ms)` : '', entry.metadata || '')
        break
      case 'warn':
        console.warn(consoleMessage, entry.metadata)
        break
      case 'error':
        console.error(consoleMessage, entry.error || entry.metadata)
        break
    }

    // In production, you would also send to a logging service
    // Example: sendToLoggingService(entry)
  }
}

// =============================================================================
// FACTORY FUNCTION
// =============================================================================

/**
 * Create a logger for an agent
 */
export function createAgentLogger(
  agent: AgentRole,
  category: AgentCategory,
  context?: LogContext
): AgentLogger {
  return new AgentLogger(agent, category, context)
}

/**
 * Get category for an agent role
 */
export function getCategoryForAgent(agent: AgentRole): AgentCategory {
  const categoryMap: Record<string, AgentCategory> = {
    // Legal agents
    'real-estate': 'legal',
    'forensics': 'legal',
    'valuation': 'legal',
    'medical': 'legal',
    'criminal': 'legal',
    'financial-protection': 'legal',
    'health-insurance': 'legal',
    'social-security': 'legal',
    'general': 'legal',

    // Executive agents
    'ceo': 'executive',
    'cmo': 'executive',
    'coo': 'executive',
    'cfo': 'executive',

    // Marketing agents
    'content': 'marketing',
    'social': 'marketing',
    'ads': 'marketing',
    'seo': 'marketing',
    'video': 'marketing',
    'design': 'marketing',

    // Operations agents
    'qa': 'operations',
    'admin': 'operations',
    'triagem': 'operations',
    'production': 'operations',

    // Intelligence agents
    'pricing': 'intelligence',
    'market-intel': 'intelligence',
    'market_intel': 'intelligence',
  }

  return categoryMap[agent] || 'operations'
}

// =============================================================================
// LOG AGGREGATION (for future analytics)
// =============================================================================

interface LogStats {
  totalLogs: number
  byLevel: Record<LogLevel, number>
  byAgent: Record<string, number>
  byAction: Record<string, number>
  averageDuration: number
  errorRate: number
}

let logBuffer: LogEntry[] = []
const MAX_BUFFER_SIZE = 1000

/**
 * Add log to buffer (for future analytics)
 */
export function bufferLog(entry: LogEntry): void {
  logBuffer.push(entry)
  if (logBuffer.length > MAX_BUFFER_SIZE) {
    logBuffer = logBuffer.slice(-MAX_BUFFER_SIZE)
  }
}

/**
 * Get log statistics
 */
export function getLogStats(): LogStats {
  const stats: LogStats = {
    totalLogs: logBuffer.length,
    byLevel: { debug: 0, info: 0, warn: 0, error: 0 },
    byAgent: {},
    byAction: {},
    averageDuration: 0,
    errorRate: 0,
  }

  let totalDuration = 0
  let durationCount = 0
  let errorCount = 0

  for (const entry of logBuffer) {
    stats.byLevel[entry.level]++
    stats.byAgent[entry.agent] = (stats.byAgent[entry.agent] || 0) + 1
    stats.byAction[entry.action] = (stats.byAction[entry.action] || 0) + 1

    if (entry.duration !== undefined) {
      totalDuration += entry.duration
      durationCount++
    }

    if (entry.level === 'error') {
      errorCount++
    }
  }

  stats.averageDuration = durationCount > 0 ? totalDuration / durationCount : 0
  stats.errorRate = logBuffer.length > 0 ? errorCount / logBuffer.length : 0

  return stats
}

/**
 * Clear log buffer
 */
export function clearLogBuffer(): void {
  logBuffer = []
}
