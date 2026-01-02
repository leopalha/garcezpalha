/**
 * Email Sequences Cron Job
 *
 * Processes pending email sequences
 *
 * Schedule: Every 2 hours
 */

import { NextRequest, NextResponse } from 'next/server'
import { withRateLimit } from '@/lib/rate-limit'
import { emailSequences } from '@/lib/email/sequences'
import { logger } from '@/lib/logger'

/**
 * GET - Process pending email sequences
 *
 * Protected by Vercel Cron Secret
 */
async function getHandler(request: NextRequest) {
  try {
    // Verify cron secret (security)
    const authHeader = request.headers.get('authorization')
    const expectedAuth = `Bearer ${process.env.CRON_SECRET}`

    if (process.env.NODE_ENV === 'production' && authHeader !== expectedAuth) {
      logger.error('[Email Sequences] Unauthorized access attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    logger.info('[Email Sequences] Starting sequence processing...')

    // Process all pending sequences
    const result = await emailSequences.processPendingSequences()

    logger.info('[Email Sequences] Processing complete:', result)

    return NextResponse.json(
      {
        success: result.success,
        emailsSent: result.emailsSent,
        errors: result.errors,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    )
  } catch (error) {
    logger.error('[Email Sequences] Error:', error instanceof Error ? error.message : String(error))
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
async function postHandler(request: NextRequest) {
  try {
    logger.info('[Email Sequences] Manual trigger')

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
  } catch (error) {
    logger.error('[Email Sequences] Error:', error instanceof Error ? error.message : String(error))
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}

// Apply rate limiting
export const GET = withRateLimit(getHandler, { type: 'cron', limit: 100 })
export const POST = withRateLimit(postHandler, { type: 'cron', limit: 10 })
