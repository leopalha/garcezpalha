import { NextRequest, NextResponse } from 'next/server'
import { withRateLimit } from '@/lib/rate-limit'
import { gmailMonitor } from '@/lib/email/gmail-monitor'
import { logger } from '@/lib/logger'

/**
 * Email Monitor Cron Job
 *
 * Runs every 15 minutes to check for new emails and create leads
 *
 * Vercel Cron: 0,15,30,45 * * * * (every 15 minutes)
 */
async function handler(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!gmailMonitor.isConfigured()) {
      return NextResponse.json({
        success: false,
        message: 'Gmail API not configured',
      })
    }

    logger.info('[Cron] Email Monitor: Starting...')

    const emails = await gmailMonitor.fetchRecentEmails()
    let created = 0

    for (const email of emails) {
      const success = await gmailMonitor.createLeadFromEmail(email)
      if (success) created++
    }

    logger.info(`[Cron] Email Monitor: Processed ${emails.length} emails, created ${created} leads`)

    return NextResponse.json({
      success: true,
      emailsProcessed: emails.length,
      leadsCreated: created,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    logger.error('[Cron] Email Monitor Error:', error instanceof Error ? error instanceof Error ? error.message : String(error) : String(error))
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error instanceof Error ? error.message : String(error) : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// Apply rate limiting
export const GET = withRateLimit(handler, { type: 'cron', limit: 100 })
