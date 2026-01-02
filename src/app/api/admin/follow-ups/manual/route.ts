import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { triggerManualFollowUp } from '@/lib/automation/follow-up-automation'
import { manualFollowUpSchema } from '@/lib/validations/admin-schemas'
import { ZodError } from 'zod'
import { logger } from '@/lib/logger'

/**
 * POST /api/admin/follow-ups/manual
 * Trigger a manual follow-up message
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

    // Check admin/lawyer role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || !['admin', 'lawyer'].includes(profile.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Parse and validate request body with Zod
    const rawBody = await request.json()
    const body = manualFollowUpSchema.parse(rawBody)

    // Trigger follow-up
    const result = await triggerManualFollowUp(body.leadId, body.message)

    return NextResponse.json(result)
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      )
    }

    logger.error('[API /admin/follow-ups/manual] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
