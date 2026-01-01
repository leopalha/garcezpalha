import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { processPendingFollowUps } from '@/lib/automation/follow-up-automation'
import { processFollowUpSchema } from '@/lib/validations/admin-schemas'
import { ZodError } from 'zod'
import { PerformanceTimer, trackApiCall, trackError } from '@/lib/monitoring/observability'

/**
 * POST /api/admin/follow-ups/process
 * Process pending follow-up tasks
 * This should be called by a cron job
 */
export async function POST(request: NextRequest) {
  const timer = new PerformanceTimer('POST /api/admin/follow-ups/process')

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

    // Parse and validate request body with Zod (optional body)
    const rawBody = await request.json().catch(() => ({}))
    const body = processFollowUpSchema.parse(rawBody)

    // Process pending follow-ups
    await processPendingFollowUps()

    const duration = timer.end()
    trackApiCall('/api/admin/follow-ups/process', duration, 200, { batchSize: body.batchSize })

    return NextResponse.json({
      success: true,
      message: 'Follow-ups processed successfully',
      timestamp: new Date().toISOString(),
      config: {
        batchSize: body.batchSize,
        type: body.type
      }
    })
  } catch (error) {
    timer.end()

    // Handle Zod validation errors
    if (error instanceof ZodError) {
      trackError(error as Error, { endpoint: '/api/admin/follow-ups/process', type: 'validation' })
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      )
    }

    trackError(error as Error, { endpoint: '/api/admin/follow-ups/process', method: 'POST' })
    console.error('[API /admin/follow-ups/process] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
