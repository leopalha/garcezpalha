/**
 * Appointment Automation Cron Job
 *
 * Runs every 2 hours to send reminders and follow-ups
 *
 * Schedule: Every 2 hours (to catch both 24h and 2h reminders)
 *
 * Actions:
 * - 24h email reminders
 * - 2h WhatsApp reminders
 * - 3-day follow-ups
 * - 7-day NPS surveys
 * - 30-day upsell offers
 */

import { NextRequest, NextResponse } from 'next/server'
import { appointmentAutomation } from '@/lib/appointments/appointment-automation'

/**
 * GET - Run appointment automation cycle
 *
 * Protected by Vercel Cron Secret
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret (security)
    const authHeader = request.headers.get('authorization')
    const expectedAuth = `Bearer ${process.env.CRON_SECRET}`

    if (process.env.NODE_ENV === 'production' && authHeader !== expectedAuth) {
      console.error('[Appointment Automation] Unauthorized access attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('[Appointment Automation] Starting automation cycle...')

    // Process all automations
    const result = await appointmentAutomation.processAutomations()

    console.log('[Appointment Automation] Cycle complete:', result)

    return NextResponse.json(
      {
        success: result.success,
        stats: {
          reminders24h: result.reminders24h,
          reminders2h: result.reminders2h,
          followups3d: result.followups3d,
          nps7d: result.nps7d,
          upsell30d: result.upsell30d,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('[Appointment Automation] Error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error.message,
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
    console.log('[Appointment Automation] Manual trigger')

    const result = await appointmentAutomation.processAutomations()

    return NextResponse.json(
      {
        success: result.success,
        stats: {
          reminders24h: result.reminders24h,
          reminders2h: result.reminders2h,
          followups3d: result.followups3d,
          nps7d: result.nps7d,
          upsell30d: result.upsell30d,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('[Appointment Automation] Error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error.message,
      },
      { status: 500 }
    )
  }
}
