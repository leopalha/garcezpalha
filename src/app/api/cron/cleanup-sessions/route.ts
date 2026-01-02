/**
 * Cleanup Sessions Cron Job
 *
 * Runs daily to clean up expired sessions and temporary data
 *
 * Schedule: Daily at 3 AM Brazil time
 *
 * Cleans up:
 * - Expired user sessions
 * - Expired verification tokens
 * - Old temporary files
 * - Stale lead qualification sessions
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'

/**
 * GET - Run cleanup cycle
 *
 * Protected by Vercel Cron Secret
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret (security)
    const authHeader = request.headers.get('authorization')
    const expectedAuth = `Bearer ${process.env.CRON_SECRET}`

    if (process.env.NODE_ENV === 'production' && authHeader !== expectedAuth) {
      logger.error('[Cleanup Sessions] Unauthorized access attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    logger.info('[Cleanup Sessions] Starting cleanup cycle...')

    const supabase = await createClient()
    const results = {
      expiredSessions: 0,
      expiredTokens: 0,
      staleQualifications: 0,
      expiredPaymentLinks: 0,
    }

    // 1. Clean up expired sessions (older than 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { count: sessionsDeleted } = await supabase
      .from('user_sessions')
      .delete({ count: 'exact' })
      .lt('last_activity', thirtyDaysAgo.toISOString())

    results.expiredSessions = sessionsDeleted || 0

    // 2. Clean up expired verification tokens (older than 24 hours)
    const oneDayAgo = new Date()
    oneDayAgo.setDate(oneDayAgo.getDate() - 1)

    const { count: tokensDeleted } = await supabase
      .from('verification_tokens')
      .delete({ count: 'exact' })
      .lt('expires_at', new Date().toISOString())

    results.expiredTokens = tokensDeleted || 0

    // 3. Clean up stale lead qualification sessions (incomplete, older than 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const { count: qualificationsDeleted } = await supabase
      .from('lead_qualification_sessions')
      .delete({ count: 'exact' })
      .eq('status', 'incomplete')
      .lt('created_at', sevenDaysAgo.toISOString())

    results.staleQualifications = qualificationsDeleted || 0

    // 4. Mark expired payment links
    const { count: linksExpired } = await supabase
      .from('payment_links')
      .update({ status: 'expired' })
      .eq('status', 'pending')
      .lt('expires_at', new Date().toISOString())

    results.expiredPaymentLinks = linksExpired || 0

    logger.info('[Cleanup Sessions] Cycle complete:', results)

    return NextResponse.json(
      {
        success: true,
        cleaned: results,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    )
  } catch (error) {
    logger.error('[Cleanup Sessions] Error:', error instanceof Error ? error instanceof Error ? error.message : String(error) : String(error))
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
  // Reuse GET logic for manual trigger
  return GET(request)
}
