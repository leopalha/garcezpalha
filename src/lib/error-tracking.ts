// Error tracking utility for Garcez Palha
// Supports Sentry integration and custom error logging

interface ErrorContext {
  userId?: string
  userEmail?: string
  userRole?: string
  page?: string
  action?: string
  component?: string
  metadata?: Record<string, unknown>
}

interface ErrorReport {
  message: string
  stack?: string
  context: ErrorContext
  severity: 'low' | 'medium' | 'high' | 'critical'
  timestamp: string
  url: string
  userAgent: string
}

class ErrorTracker {
  private isProduction: boolean
  private sentryDsn: string | null
  private errorQueue: ErrorReport[] = []
  private maxQueueSize = 50

  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production'
    this.sentryDsn = process.env.NEXT_PUBLIC_SENTRY_DSN || null
  }

  // Initialize error tracking
  init() {
    if (typeof window === 'undefined') return

    // Global error handler
    window.onerror = (message, source, lineno, colno, error) => {
      this.captureException(error || new Error(String(message)), {
        component: 'global',
        metadata: {
          source,
          lineno,
          colno,
        },
      })
      return false // Don't prevent default handling
    }

    // Unhandled promise rejection handler
    window.onunhandledrejection = (event) => {
      this.captureException(event.reason, {
        component: 'promise',
        action: 'unhandled_rejection',
      })
    }

    // Console error interceptor (optional)
    if (!this.isProduction) {
      const originalError = console.error
      console.error = (...args) => {
        this.captureMessage(args.map(String).join(' '), 'medium', {
          component: 'console',
        })
        originalError.apply(console, args)
      }
    }

    this.log('Error tracking initialized')
  }

  // Capture exception with context
  captureException(
    error: Error | unknown,
    context: ErrorContext = {},
    severity: 'low' | 'medium' | 'high' | 'critical' = 'high'
  ) {
    const errorObj = error instanceof Error ? error : new Error(String(error))

    const report: ErrorReport = {
      message: errorObj.message,
      stack: errorObj.stack,
      context: this.enrichContext(context),
      severity,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : 'server',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
    }

    this.processError(report)
  }

  // Capture message (non-exception error)
  captureMessage(
    message: string,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium',
    context: ErrorContext = {}
  ) {
    const report: ErrorReport = {
      message,
      context: this.enrichContext(context),
      severity,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : 'server',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
    }

    this.processError(report)
  }

  // Set user context for error reports
  setUser(user: { id: string; email?: string; role?: string }) {
    if (typeof window !== 'undefined') {
      ;(window as unknown as { __errorTrackingUser?: typeof user }).__errorTrackingUser = user
    }
    this.log('User context set:', user)
  }

  // Clear user context
  clearUser() {
    if (typeof window !== 'undefined') {
      delete (window as unknown as { __errorTrackingUser?: unknown }).__errorTrackingUser
    }
  }

  // Add breadcrumb for debugging
  addBreadcrumb(
    category: string,
    message: string,
    data?: Record<string, unknown>
  ) {
    const breadcrumb = {
      category,
      message,
      data,
      timestamp: new Date().toISOString(),
    }

    if (typeof window !== 'undefined') {
      const breadcrumbs = ((window as unknown as { __errorTrackingBreadcrumbs?: unknown[] }).__errorTrackingBreadcrumbs =
        (window as unknown as { __errorTrackingBreadcrumbs?: unknown[] }).__errorTrackingBreadcrumbs || [])
      breadcrumbs.push(breadcrumb)

      // Keep only last 50 breadcrumbs
      if (breadcrumbs.length > 50) {
        breadcrumbs.shift()
      }
    }

    this.log('Breadcrumb added:', breadcrumb)
  }

  // Wrap async function with error handling
  wrap<T>(fn: () => Promise<T>, context: ErrorContext = {}): Promise<T> {
    return fn().catch((error) => {
      this.captureException(error, context)
      throw error
    })
  }

  // Create error boundary wrapper for React components
  createBoundary(fallback?: React.ReactNode) {
    const self = this

    return class ErrorBoundary extends (
      require('react')
    ).Component<{ children: React.ReactNode }, { hasError: boolean; error?: Error }> {
      state = { hasError: false, error: undefined as Error | undefined }

      static getDerivedStateFromError(error: Error) {
        return { hasError: true, error }
      }

      componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        self.captureException(error, {
          component: 'ErrorBoundary',
          metadata: {
            componentStack: errorInfo.componentStack,
          },
        })
      }

      render() {
        if (this.state.hasError) {
          if (fallback) {
            return fallback
          }
          // Create fallback UI using React.createElement to avoid JSX in .ts file
          const React = require('react')
          return React.createElement(
            'div',
            { className: 'p-4 bg-red-50 border border-red-200 rounded' },
            React.createElement(
              'h3',
              { className: 'text-red-800 font-semibold' },
              'Algo deu errado'
            ),
            React.createElement(
              'p',
              { className: 'text-red-600 text-sm' },
              this.state.error?.message || 'Erro desconhecido'
            )
          )
        }

        return this.props.children
      }
    }
  }

  // Private: Enrich context with user and breadcrumbs
  private enrichContext(context: ErrorContext): ErrorContext {
    if (typeof window === 'undefined') return context

    const user = (window as unknown as { __errorTrackingUser?: { id: string; email?: string; role?: string } }).__errorTrackingUser
    const breadcrumbs = (window as unknown as { __errorTrackingBreadcrumbs?: unknown[] }).__errorTrackingBreadcrumbs

    return {
      ...context,
      userId: context.userId || user?.id,
      userEmail: context.userEmail || user?.email,
      userRole: context.userRole || user?.role,
      page: context.page || window.location.pathname,
      metadata: {
        ...context.metadata,
        breadcrumbs: breadcrumbs?.slice(-10), // Include last 10 breadcrumbs
      },
    }
  }

  // Private: Process error report
  private processError(report: ErrorReport) {
    this.log('Error captured:', report)

    // Add to queue
    this.errorQueue.push(report)
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue.shift()
    }

    // In production, send to backend
    if (this.isProduction && typeof window !== 'undefined') {
      this.sendToServer(report).catch((err) => {
        this.log('Failed to send error to server:', err)
      })
    }

    // If Sentry is configured, would send there too
    if (this.sentryDsn) {
      this.log('Would send to Sentry:', this.sentryDsn)
    }
  }

  // Private: Send error to server
  private async sendToServer(report: ErrorReport): Promise<void> {
    try {
      await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(report),
      })
    } catch (error) {
      // Silently fail to avoid infinite loops
      console.warn('Error tracking: Failed to send to server', error)
    }
  }

  // Private: Debug logging
  private log(...args: unknown[]) {
    if (!this.isProduction) {
      console.log('[ErrorTracker]', ...args)
    }
  }

  // Get recent errors (for debugging)
  getRecentErrors(): ErrorReport[] {
    return [...this.errorQueue]
  }

  // Clear error queue
  clearErrors() {
    this.errorQueue = []
  }
}

// Export singleton instance
export const errorTracker = new ErrorTracker()

// Convenience functions
export function captureException(
  error: Error | unknown,
  context?: ErrorContext
) {
  errorTracker.captureException(error, context)
}

export function captureMessage(message: string, context?: ErrorContext) {
  errorTracker.captureMessage(message, 'medium', context)
}

export function setUserContext(user: {
  id: string
  email?: string
  role?: string
}) {
  errorTracker.setUser(user)
}

export function addBreadcrumb(
  category: string,
  message: string,
  data?: Record<string, unknown>
) {
  errorTracker.addBreadcrumb(category, message, data)
}

// React hook for error tracking
export function useErrorTracking() {
  return {
    captureException: (error: Error | unknown, context?: ErrorContext) =>
      errorTracker.captureException(error, context),
    captureMessage: (message: string, context?: ErrorContext) =>
      errorTracker.captureMessage(message, 'medium', context),
    addBreadcrumb: (
      category: string,
      message: string,
      data?: Record<string, unknown>
    ) => errorTracker.addBreadcrumb(category, message, data),
    setUser: (user: { id: string; email?: string; role?: string }) =>
      errorTracker.setUser(user),
  }
}
