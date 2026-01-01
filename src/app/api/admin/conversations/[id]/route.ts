/**
 * Single Conversation API
 * Get details of a specific conversation
 */

import { NextRequest, NextResponse } from 'next/server'
import { withRateLimit } from '@/lib/rate-limit'
import { createClient } from '@/lib/supabase/server'

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

    const { data: conversation, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('conversation_id', conversationId)
      .single()

    if (error || !conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    return NextResponse.json({ conversation })
  } catch (error) {
    console.error('[Conversation Detail API] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error instanceof Error ? error.message : String(error) : String(error) },
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
