import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { processPendingFollowUps } from '@/lib/automation/follow-up-automation'

/**
 * POST /api/admin/follow-ups/process
 * Process pending follow-up tasks
 * This should be called by a cron job
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify API key for cron jobs
    const apiKey = request.headers.get('x-api-key')
    const validApiKey = process.env.CRON_API_KEY

    if (validApiKey && apiKey !== validApiKey) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 })
    }

    // Process pending follow-ups
    await processPendingFollowUps()

    return NextResponse.json({
      success: true,
      message: 'Follow-ups processed successfully',
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('[API /admin/follow-ups/process] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}
