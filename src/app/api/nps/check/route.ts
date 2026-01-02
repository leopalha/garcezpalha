/**
 * NPS Check API
 * Checks if NPS has already been submitted for a conversation
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get('conversationId')

    if (!conversationId) {
      return NextResponse.json(
        { error: 'conversationId is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Check if NPS has been submitted
    const { data: conversation, error } = await supabase
      .from('conversations')
      .select('nps_score, nps_submitted_at')
      .eq('conversation_id', conversationId)
      .single()

    if (error) {
      logger.error('[NPS Check] Error:', error)
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      )
    }

    const submitted = conversation.nps_score !== null && conversation.nps_score !== undefined

    return NextResponse.json({
      submitted,
      submittedAt: conversation.nps_submitted_at || null,
    })
  } catch (error) {
    logger.error('[NPS Check] Error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
