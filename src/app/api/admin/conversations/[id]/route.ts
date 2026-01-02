/**
 * Single Conversation API
 * Get details of a specific conversation
 */

import { NextRequest, NextResponse } from 'next/server'
import { withRateLimit } from '@/lib/rate-limit'
import { createClient } from '@/lib/supabase/server'
import { ZodError } from 'zod'
import { logger } from '@/lib/logger'

async function getHandler(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const conversationId = params.id
    const supabase = await createClient()

    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch conversation with all related data (messages, lead, proposals)
    const { data: conversation, error } = await supabase
      .from('conversations')
      .select(`
        *,
        lead:leads(*),
        messages:messages(
          id,
          content,
          sender,
          sender_id,
          created_at,
          metadata,
          attachments
        )
      `)
      .eq('conversation_id', conversationId)
      .single()

    if (error || !conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    // Sort messages by created_at
    if (conversation.messages) {
      conversation.messages.sort((a: any, b: any) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      )
    }

    // Fetch proposals if exists
    if (conversation.lead) {
      const { data: proposals } = await supabase
        .from('proposals')
        .select('*')
        .eq('lead_id', conversation.lead.id)
        .order('created_at', { ascending: false })

      conversation.proposals = proposals || []
    }

    return NextResponse.json({ conversation })
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

    logger.error('[Conversation Detail API] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

// Apply rate limiting - wrapper extracts params from URL
export const GET = withRateLimit(
  async (request: NextRequest) => {
    const id = request.url.split("/").slice(-1)[0].split("?")[0]
    return getHandler(request, { params: { id } })
  },
  { type: "api", limit: 100 }
)

export const runtime = 'nodejs'
export const maxDuration = 30
