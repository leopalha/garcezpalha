/**
 * NPS Submission API
 * Handles NPS score and feedback submission
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { conversationId, score, feedback } = body

    // Validate input
    if (!conversationId) {
      return NextResponse.json(
        { error: 'conversationId is required' },
        { status: 400 }
      )
    }

    if (score === undefined || score === null || score < 0 || score > 10) {
      return NextResponse.json(
        { error: 'score must be between 0 and 10' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Check if conversation exists
    const { data: conversation, error: fetchError } = await supabase
      .from('conversations')
      .select('conversation_id, nps_score')
      .eq('conversation_id', conversationId)
      .single()

    if (fetchError || !conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      )
    }

    // Check if already submitted
    if (conversation.nps_score !== null && conversation.nps_score !== undefined) {
      return NextResponse.json(
        { error: 'NPS already submitted for this conversation' },
        { status: 400 }
      )
    }

    // Determine NPS category
    let category: 'detractor' | 'passive' | 'promoter'
    if (score <= 6) category = 'detractor'
    else if (score <= 8) category = 'passive'
    else category = 'promoter'

    // Save NPS score
    const { error: updateError } = await supabase
      .from('conversations')
      .update({
        nps_score: score,
        nps_feedback: feedback || null,
        nps_category: category,
        nps_submitted_at: new Date().toISOString(),
      })
      .eq('conversation_id', conversationId)

    if (updateError) {
      console.error('[NPS] Error saving score:', updateError)
      throw updateError
    }

    // Log NPS submission
    await supabase.from('nps_responses').insert({
      conversation_id: conversationId,
      score,
      feedback: feedback || null,
      category,
      submitted_at: new Date().toISOString(),
    })

    console.log(`[NPS] Score ${score} (${category}) submitted for conversation ${conversationId}`)

    return NextResponse.json({
      success: true,
      score,
      category,
    })
  } catch (error) {
    console.error('[NPS] Submission error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
