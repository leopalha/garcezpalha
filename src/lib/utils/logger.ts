/**
 * Centralized Logging Utility
 * Provides consistent, structured logging across the application
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface LogContext {
  [key: string]: any
}

export interface LoggerConfig {
  service: string
  enableDebug?: boolean
  enableTimestamps?: boolean
}

/**
 * Structured logger for consistent application logging
 */
export class Logger {
  private service: string
  private enableDebug: boolean
  private enableTimestamps: boolean

  constructor(config: LoggerConfig) {
    this.service = config.service
    this.enableDebug = config.enableDebug ?? process.env.NODE_ENV === 'development'
    this.enableTimestamps = config.enableTimestamps ?? true
  }

  /**
   * Format log message with context
   */
  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const parts: string[] = []

    if (this.enableTimestamps) {
      parts.push(`[${new Date().toISOString()}]`)
    }

    parts.push(`[${this.service}]`)
    parts.push(`[${level.toUpperCase()}]`)
    parts.push(message)

    return parts.join(' ')
  }

  /**
   * Log debug message (only in development or if explicitly enabled)
   */
  debug(message: string, context?: LogContext): void {
    if (!this.enableDebug) return

    console.debug(this.formatMessage('debug', message), context || '')
  }

  /**
   * Log info message
   */
  info(message: string, context?: LogContext): void {
    console.log(this.formatMessage('info', message), context || '')
  }

  /**
   * Log warning message
   */
  warn(message: string, context?: LogContext): void {
    console.warn(this.formatMessage('warn', message), context || '')
  }

  /**
   * Log error message
   */
  error(message: string, error?: Error | LogContext, context?: LogContext): void {
    const logMessage = this.formatMessage('error', message)

    if (error instanceof Error) {
      console.error(logMessage, {
        error: error.message,
        stack: error.stack,
        ...(context || {}),
      })
    } else {
      console.error(logMessage, error || '')
    }
  }

  /**
   * Create child logger with additional service prefix
   */
  child(subService: string): Logger {
    return new Logger({
      service: `${this.service}:${subService}`,
      enableDebug: this.enableDebug,
      enableTimestamps: this.enableTimestamps,
    })
  }

  /**
   * Log performance timing
   */
  timing(operation: string, durationMs: number, context?: LogContext): void {
    this.info(`${operation} completed in ${durationMs}ms`, context)
  }

  /**
   * Log API request
   */
  request(method: string, path: string, context?: LogContext): void {
    this.info(`${method} ${path}`, context)
  }

  /**
   * Log API response
   */
  response(method: string, path: string, status: number, durationMs: number): void {
    const level: LogLevel = status >= 500 ? 'error' : status >= 400 ? 'warn' : 'info'
    const message = `${method} ${path} - ${status} (${durationMs}ms)`

    if (level === 'error') {
      this.error(message)
    } else if (level === 'warn') {
      this.warn(message)
    } else {
      this.info(message)
    }
  }
}

/**
 * Create logger instance
 */
export function createLogger(config: LoggerConfig): Logger {
  return new Logger(config)
}

/**
 * Default application logger
 */
export const logger = createLogger({
  service: 'garcezpalha',
  enableDebug: process.env.NODE_ENV === 'development',
})

/**
 * Pre-configured loggers for common services
 */
export const loggers = {
  whatsapp: createLogger({ service: 'WhatsApp' }),
  twilio: createLogger({ service: 'Twilio' }),
  telegram: createLogger({ service: 'Telegram' }),
  ai: createLogger({ service: 'AI' }),
  qualification: createLogger({ service: 'Qualification' }),
  api: createLogger({ service: 'API' }),
  cron: createLogger({ service: 'Cron' }),
  email: createLogger({ service: 'Email' }),
  database: createLogger({ service: 'Database' }),
}

/**
 * Performance timing utility
 *
 * @example
 * ```ts
 * const timer = createTimer('processMessage')
 * // ... do work ...
 * timer.end(logger)
 * ```
 */
export function createTimer(operation: string) {
  const startTime = Date.now()

  return {
    end(logger: Logger, context?: LogContext): number {
      const duration = Date.now() - startTime
      logger.timing(operation, duration, context)
      return duration
    },
    getDuration(): number {
      return Date.now() - startTime
    },
  }
}

/**
 * Async function wrapper with automatic timing and error logging
 *
 * @example
 * ```ts
 * const result = await withLogging(
 *   logger,
 *   'processMessage',
 *   async () => {
 *     // ... async work ...
 *     return result
 *   }
 * )
 * ```
 */
export async function withLogging<T>(
  logger: Logger,
  operation: string,
  fn: () => Promise<T>,
  context?: LogContext
): Promise<T> {
  const timer = createTimer(operation)

  try {
    logger.debug(`Starting ${operation}`, context)
    const result = await fn()
    const duration = timer.getDuration()
    logger.debug(`Completed ${operation} in ${duration}ms`, context)
    return result
  } catch (error) {
    const duration = timer.getDuration()
    logger.error(`Failed ${operation} after ${duration}ms`, error as Error, context)
    throw error
  }
}

/**
 * Sanitize sensitive data from logs
 */
export function sanitizeLogData(data: any): any {
  if (typeof data !== 'object' || data === null) {
    return data
  }

  const sanitized = { ...data }
  const sensitiveKeys = [
    'password',
    'token',
    'apiKey',
    'secret',
    'authorization',
    'authToken',
    'accountSid',
    'accessToken',
  ]

  for (const key in sanitized) {
    const lowerKey = key.toLowerCase()

    if (sensitiveKeys.some(k => lowerKey.includes(k.toLowerCase()))) {
      sanitized[key] = '***REDACTED***'
    } else if (typeof sanitized[key] === 'object') {
      sanitized[key] = sanitizeLogData(sanitized[key])
    }
  }

  return sanitized
}
