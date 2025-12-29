/**
 * Google Calendar Sync Cron Job
 *
 * Runs daily to sync pending deadlines to Google Calendar
 *
 * Schedule: Once per day at 10 AM Brazil time
 */

import { NextRequest, NextResponse } from 'next/server'
import { googleCalendar } from '@/lib/calendar/google-calendar-service'

/**
 * GET - Run calendar sync cycle
 *
 * Protected by Vercel Cron Secret
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret (security)
    const authHeader = request.headers.get('authorization')
    const expectedAuth = `Bearer ${process.env.CRON_SECRET}`

    if (process.env.NODE_ENV === 'production' && authHeader !== expectedAuth) {
      console.error('[Calendar Sync] Unauthorized access attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('[Calendar Sync] Starting sync cycle...')

    // Sync all pending deadlines
    const result = await googleCalendar.syncAllDeadlines()

    console.log('[Calendar Sync] Cycle complete:', result)

    return NextResponse.json(
      {
        success: result.success,
        synced: result.synced,
        errors: result.errors,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[Calendar Sync] Error:', error instanceof Error ? error.message : String(error))
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
    console.log('[Calendar Sync] Manual trigger')

    const result = await googleCalendar.syncAllDeadlines()

    return NextResponse.json(
      {
        success: result.success,
        synced: result.synced,
        errors: result.errors,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[Calendar Sync] Error:', error instanceof Error ? error.message : String(error))
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
