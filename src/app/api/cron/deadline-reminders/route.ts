/**
 * Deadline Reminders Cron Job
 *
 * Runs daily to check for upcoming deadlines and send reminders
 *
 * Schedule: Once per day at 9 AM Brazil time
 *
 * Sends reminders:
 * - 7 days before deadline
 * - 3 days before deadline
 * - 1 day before deadline
 */

import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

/**
 * GET - Run deadline reminder cycle
 *
 * Protected by Vercel Cron Secret
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret (security)
    const authHeader = request.headers.get('authorization')
    const expectedAuth = `Bearer ${process.env.CRON_SECRET}`

    if (process.env.NODE_ENV === 'production' && authHeader !== expectedAuth) {
      logger.error('[Deadline Reminders] Unauthorized access attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    logger.info('[Deadline Reminders] Starting reminder cycle...')

    // TODO: Implement sendDeadlineReminders in notification-service
    const result = { success: true, remindersSent: 0 }

    logger.info('[Deadline Reminders] Cycle complete:', result)

    return NextResponse.json(
      {
        success: result.success,
        remindersSent: result.remindersSent,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    )
  } catch (error) {
    logger.error('[Deadline Reminders] Error:', error instanceof Error ? error.message : String(error))
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : String(error),
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
    logger.info('[Deadline Reminders] Manual trigger')

    // TODO: Implement sendDeadlineReminders in notification-service
    const result = { success: true, remindersSent: 0 }

    return NextResponse.json(
      {
        success: result.success,
        remindersSent: result.remindersSent,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    )
  } catch (error) {
    logger.error('[Deadline Reminders] Error:', error instanceof Error ? error.message : String(error))
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
