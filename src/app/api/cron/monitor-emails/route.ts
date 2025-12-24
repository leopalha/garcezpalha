/**
 * Email Monitor Cron Job
 *
 * Runs every 15 minutes to check Gmail for tribunal notifications
 *
 * Vercel Cron Configuration (vercel.json):
 * {
 *   "crons": [{
 *     "path": "/api/cron/monitor-emails",
 *     "schedule": "* /15 * * * *"
 *   }]
 * }
 *
 * Schedule format: "minute hour day month weekday"
 * "* /15 * * * *" = Every 15 minutes (without space after *)
 *
 * Docs: https://vercel.com/docs/cron-jobs
 */

import { NextRequest, NextResponse } from 'next/server'
import { emailMonitor } from '@/lib/email/monitor-service'

/**
 * GET - Run email monitoring cycle
 *
 * Protected by Vercel Cron Secret
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret (security)
    const authHeader = request.headers.get('authorization')
    const expectedAuth = `Bearer ${process.env.CRON_SECRET}`

    if (process.env.NODE_ENV === 'production' && authHeader !== expectedAuth) {
      console.error('[Email Monitor Cron] Unauthorized access attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('[Email Monitor Cron] Starting monitoring cycle...')

    // Run monitoring
    const result = await emailMonitor.monitorEmails()

    console.log('[Email Monitor Cron] Cycle complete:', result)

    return NextResponse.json(
      {
        success: result.success,
        emailsFound: result.emailsFound,
        alertsCreated: result.alertsCreated,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('[Email Monitor Cron] Error:', error)
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
    console.log('[Email Monitor] Manual trigger')

    const result = await emailMonitor.monitorEmails()

    return NextResponse.json(
      {
        success: result.success,
        emailsFound: result.emailsFound,
        alertsCreated: result.alertsCreated,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('[Email Monitor] Error:', error)
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
 * SETUP INSTRUCTIONS:
 *
 * 1. Add to vercel.json (project root):
 *    {
 *      "crons": [
 *        {
 *          "path": "/api/cron/monitor-emails",
 *          "schedule": "* /15 * * * *"
 *        }
 *      ]
 *    }
 *
 * 2. Generate Cron Secret:
 *    - Run: openssl rand -base64 32
 *    - Add to .env: CRON_SECRET=your_generated_secret
 *    - Add to Vercel Environment Variables
 *
 * 3. Deploy to Vercel:
 *    - Push changes to Git
 *    - Vercel will automatically detect cron jobs
 *    - View logs: Vercel Dashboard → Functions → Cron Jobs
 *
 * 4. Test Manually:
 *    - Local: POST http://localhost:3000/api/cron/monitor-emails
 *    - Production: POST https://garcezpalha.com/api/cron/monitor-emails
 *
 * 5. Monitor:
 *    - Vercel Dashboard → Functions → /api/cron/monitor-emails
 *    - Check logs for execution history
 *    - Verify process_alerts table is being populated
 */
