/**
 * Email Sequences Cron Job
 *
 * Processes pending email sequences
 *
 * Schedule: Every 2 hours
 */

import { NextRequest, NextResponse } from 'next/server'
import { emailSequences } from '@/lib/email/sequences'

/**
 * GET - Process pending email sequences
 *
 * Protected by Vercel Cron Secret
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret (security)
    const authHeader = request.headers.get('authorization')
    const expectedAuth = `Bearer ${process.env.CRON_SECRET}`

    if (process.env.NODE_ENV === 'production' && authHeader !== expectedAuth) {
      console.error('[Email Sequences] Unauthorized access attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('[Email Sequences] Starting sequence processing...')

    // Process all pending sequences
    const result = await emailSequences.processPendingSequences()

    console.log('[Email Sequences] Processing complete:', result)

    return NextResponse.json(
      {
        success: result.success,
        emailsSent: result.emailsSent,
        errors: result.errors,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('[Email Sequences] Error:', error)
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
    console.log('[Email Sequences] Manual trigger')

    const result = await emailSequences.processPendingSequences()

    return NextResponse.json(
      {
        success: result.success,
        emailsSent: result.emailsSent,
        errors: result.errors,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('[Email Sequences] Error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error.message,
      },
      { status: 500 }
    )
  }
}
