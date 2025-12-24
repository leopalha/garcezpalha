import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { triggerManualFollowUp } from '@/lib/automation/follow-up-automation'

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

    // Parse request body
    const body = await request.json()
    const { leadId, message } = body

    if (!leadId || !message) {
      return NextResponse.json({ error: 'Missing leadId or message' }, { status: 400 })
    }

    // Trigger follow-up
    const result = await triggerManualFollowUp(leadId, message)

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('[API /admin/follow-ups/manual] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}
