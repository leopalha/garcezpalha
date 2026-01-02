/**
 * Partner Monthly Reports Cron Job
 *
 * Runs on the 1st day of each month to send performance reports
 *
 * Schedule: 1st day of month at 8 AM
 */

import { NextRequest, NextResponse } from 'next/server'
import { partnerReports } from '@/lib/reports/partner-reports'
import { logger } from '@/lib/logger'

/**
 * GET - Send monthly partner reports
 *
 * Protected by Vercel Cron Secret
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret (security)
    const authHeader = request.headers.get('authorization')
    const expectedAuth = `Bearer ${process.env.CRON_SECRET}`

    if (process.env.NODE_ENV === 'production' && authHeader !== expectedAuth) {
      logger.error('[Partner Reports] Unauthorized access attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    logger.info('[Partner Reports] Starting monthly reports...')

    // Send all reports
    const result = await partnerReports.sendMonthlyReports()

    logger.info('[Partner Reports] Reports complete:', result)

    return NextResponse.json(
      {
        success: result.success,
        reportsSent: result.reportsSent,
        errors: result.errors,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    )
  } catch (error) {
    logger.error('[Partner Reports] Error:', error instanceof Error ? error instanceof Error ? error.message : String(error) : String(error))
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error instanceof Error ? error.message : String(error) : String(error),
      },
      { status: 500 }
    )
  }
}

/**
 * POST - Manual trigger (for testing)
 */
export async function POST(request: NextRequest) {
  try {
    logger.info('[Partner Reports] Manual trigger')

    const result = await partnerReports.sendMonthlyReports()

    return NextResponse.json(
      {
        success: result.success,
        reportsSent: result.reportsSent,
        errors: result.errors,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    )
  } catch (error) {
    logger.error('[Partner Reports] Error:', error instanceof Error ? error instanceof Error ? error.message : String(error) : String(error))
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error instanceof Error ? error.message : String(error) : String(error),
      },
      { status: 500 }
    )
  }
}
