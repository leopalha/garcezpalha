import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { logger } from '@/lib/logger'

// Error report schema
const errorReportSchema = z.object({
  message: z.string(),
  stack: z.string().optional(),
  context: z.object({
    userId: z.string().optional(),
    userEmail: z.string().optional(),
    userRole: z.string().optional(),
    page: z.string().optional(),
    action: z.string().optional(),
    component: z.string().optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
  }),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  timestamp: z.string(),
  url: z.string(),
  userAgent: z.string(),
})

// Store errors in memory (in production, this would go to a database or service like Sentry)
const errorStore: Array<z.infer<typeof errorReportSchema> & { id: string; ip: string }> = []

// Simple ID generator
function generateId(): string {
  return 'err-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate the error report
    const errorReport = errorReportSchema.parse(body)

    // Get client IP
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown'

    // Store error with unique ID
    const storedError = {
      id: generateId(),
      ...errorReport,
      ip,
    }

    errorStore.push(storedError)

    // Keep only last 500 errors in memory
    if (errorStore.length > 500) {
      errorStore.shift()
    }

    // Log critical and high severity errors immediately
    if (errorReport.severity === 'critical' || errorReport.severity === 'high') {
      logger.error(`[ERROR REPORT - ${errorReport.severity.toUpperCase()}]`, {
        id: storedError.id,
        message: errorReport.message,
        page: errorReport.context.page,
        component: errorReport.context.component,
        userId: errorReport.context.userId,
        timestamp: errorReport.timestamp,
      })

      // In production, you would:
      // 1. Send to Sentry/Bugsnag/etc.
      // 2. Send alert to Slack/Discord
      // 3. Store in database
      // 4. Trigger incident management
    }

    return NextResponse.json({
      success: true,
      errorId: storedError.id,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid error report format',
          details: error.issues,
        },
        { status: 400 }
      )
    }

    logger.error('Error API error:', error)
    return NextResponse.json(
      { error: 'Failed to process error report' },
      { status: 500 }
    )
  }
}

// Get error summary (admin only in production)
export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const severity = url.searchParams.get('severity')
  const hours = parseInt(url.searchParams.get('hours') || '24')

  const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000)

  let filteredErrors = errorStore.filter(
    (err) => new Date(err.timestamp) >= cutoff
  )

  if (severity) {
    filteredErrors = filteredErrors.filter((err) => err.severity === severity)
  }

  // Calculate statistics
  const stats = {
    total: filteredErrors.length,
    bySeverity: {
      critical: filteredErrors.filter((e) => e.severity === 'critical').length,
      high: filteredErrors.filter((e) => e.severity === 'high').length,
      medium: filteredErrors.filter((e) => e.severity === 'medium').length,
      low: filteredErrors.filter((e) => e.severity === 'low').length,
    },
    byComponent: {} as Record<string, number>,
    byPage: {} as Record<string, number>,
    uniqueUsers: new Set(filteredErrors.map((e) => e.context.userId).filter(Boolean)).size,
  }

  filteredErrors.forEach((err) => {
    if (err.context.component) {
      stats.byComponent[err.context.component] =
        (stats.byComponent[err.context.component] || 0) + 1
    }
    if (err.context.page) {
      stats.byPage[err.context.page] = (stats.byPage[err.context.page] || 0) + 1
    }
  })

  return NextResponse.json({
    timeframe: `Last ${hours} hours`,
    stats,
    recentErrors: filteredErrors.slice(-20).map((err) => ({
      id: err.id,
      message: err.message,
      severity: err.severity,
      component: err.context.component,
      page: err.context.page,
      timestamp: err.timestamp,
    })),
  })
}
