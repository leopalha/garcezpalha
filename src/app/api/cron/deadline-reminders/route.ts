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
import { notificationService } from '@/lib/notifications/notification-service'

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
      console.error('[Deadline Reminders] Unauthorized access attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('[Deadline Reminders] Starting reminder cycle...')

    // Send deadline reminders
    const result = await notificationService.sendDeadlineReminders()

    console.log('[Deadline Reminders] Cycle complete:', result)

    return NextResponse.json(
      {
        success: result.success,
        remindersSent: result.remindersSent,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[Deadline Reminders] Error:', error instanceof Error ? error instanceof Error ? error.message : String(error) : String(error))
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
    console.log('[Deadline Reminders] Manual trigger')

    const result = await notificationService.sendDeadlineReminders()

    return NextResponse.json(
      {
        success: result.success,
        remindersSent: result.remindersSent,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[Deadline Reminders] Error:', error instanceof Error ? error instanceof Error ? error.message : String(error) : String(error))
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error instanceof Error ? error.message : String(error) : String(error),
      },
      { status: 500 }
    )
  }
}
