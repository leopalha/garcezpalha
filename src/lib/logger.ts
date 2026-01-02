type LogLevel = 'info' | 'error' | 'warn' | 'debug'

interface LogData {
  context?: string
  [key: string]: any
}

// Allow string as second param for backward compatibility
export type LogContext = LogData | string

class Logger {
  private log(level: LogLevel, message: string, data?: LogData) {
    const timestamp = new Date().toISOString()
    const logEntry = {
      timestamp,
      level,
      message,
      ...data
    }

    // In production, you might want to send this to a logging service
    // For now, we'll use console with structured output
    if (process.env.NODE_ENV === 'production') {
      console.log(JSON.stringify(logEntry))
    } else {
      // Development: pretty print
      const prefix = `[${timestamp}] [${level.toUpperCase()}]${data?.context ? ` [${data.context}]` : ''}`

      switch (level) {
        case 'error':
          console.error(prefix, message, data)
          break
        case 'warn':
          console.warn(prefix, message, data)
          break
        default:
          console.log(prefix, message, data)
      }
    }
  }

  info(message: string, ...args: Array<LogData | string | unknown>) {
    // Combine all arguments into log data
    const combined: LogData = {}
    args.forEach((arg, index) => {
      if (typeof arg === 'string') {
        combined[`arg${index}`] = arg
      } else if (arg && typeof arg === 'object') {
        Object.assign(combined, arg)
      }
    })
    this.log('info', message, Object.keys(combined).length > 0 ? combined : undefined)
  }

  error(message: string, errorOrData?: Error | unknown | LogData | string, data?: LogData | string) {
    // Handle various call signatures for backward compatibility
    let error: Error | unknown | undefined
    let logData: LogData | undefined

    if (errorOrData instanceof Error || (errorOrData && typeof errorOrData === 'object' && 'message' in (errorOrData as any) && 'stack' in (errorOrData as any))) {
      error = errorOrData
      logData = typeof data === 'string' ? { context: data } : data
    } else if (typeof errorOrData === 'string') {
      logData = { context: errorOrData }
    } else if (errorOrData && typeof errorOrData === 'object') {
      logData = errorOrData as LogData
    }

    const errorData: LogData = {
      ...logData,
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name
      } : error ? String(error) : undefined
    }
    this.log('error', message, errorData)
  }

  warn(message: string, ...args: Array<LogData | string | unknown>) {
    // Combine all arguments into log data
    const combined: LogData = {}
    args.forEach((arg, index) => {
      if (typeof arg === 'string') {
        combined[`arg${index}`] = arg
      } else if (arg && typeof arg === 'object') {
        Object.assign(combined, arg)
      }
    })
    this.log('warn', message, Object.keys(combined).length > 0 ? combined : undefined)
  }

  debug(message: string, data?: LogData | string) {
    const logData = typeof data === 'string' ? { context: data } : data
    this.log('debug', message, logData)
  }
}

export function createLogger(context: string) {
  const logger = new Logger()

  return {
    info: (message: string, data?: object) => {
      logger.info(message, { context, ...data })
    },
    error: (message: string, error?: Error | unknown, data?: object) => {
      logger.error(message, error, { context, ...data })
    },
    warn: (message: string, data?: object) => {
      logger.warn(message, { context, ...data })
    },
    debug: (message: string, data?: object) => {
      logger.debug(message, { context, ...data })
    }
  }
}

// Global logger for quick use
export const logger = new Logger()
