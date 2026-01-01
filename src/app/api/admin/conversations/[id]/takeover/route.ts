/**
 * Conversation Takeover API
 * Allows admin to manually take over a conversation from the agent
 */

import { NextRequest, NextResponse } from 'next/server'
import { withRateLimit } from '@/lib/rate-limit'
import { createClient } from '@/lib/supabase/server'
import { conversationTakeoverSchema } from '@/lib/validations/admin-schemas'
import { ZodError } from 'zod'

async function postHandler(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const conversationId = params.id
    const rawBody = await request.json()

    // Validate request body with Zod
    const body = conversationTakeoverSchema.parse(rawBody)

    const supabase = await createClient()

    // Auth check for admin/lawyer roles
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check user role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || !['admin', 'lawyer'].includes(profile.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get conversation
    const { data: conversation, error: fetchError } = await supabase
      .from('conversations')
      .select('*')
      .eq('conversation_id', conversationId)
      .single()

    if (fetchError || !conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    // Transition to 'escalated' state
    const { error: updateError } = await supabase
      .from('conversations')
      .update({
        status: {
          state: 'escalated',
          updated_at: new Date().toISOString(),
          escalation_reason: body.reason,
        },
        metadata: {
          ...conversation.metadata,
          human_takeover: true,
          taken_over_at: new Date().toISOString(),
          taken_over_by: user.id,
          notify_user: body.notify,
        },
      })
      .eq('conversation_id', conversationId)

    if (updateError) {
      console.error('[Takeover API] Error:', updateError)
      return NextResponse.json(
        { error: 'Failed to take over conversation', details: updateError.message },
        { status: 500 }
      )
    }

    console.log(`[Takeover] Admin took over conversation: ${conversationId}`)

    return NextResponse.json({
      success: true,
      message: 'Conversation taken over successfully',
    })
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof ZodError) {
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

    console.error('[Takeover API] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

// Apply rate limiting
export const POST = withRateLimit(  async (request: NextRequest) => {    const id = request.url.split("/")[5]    return postHandler(request, { params: { id } })  },  { type: "api", limit: 10 })

export const runtime = 'nodejs'
export const maxDuration = 30
