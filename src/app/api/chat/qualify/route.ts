/**
 * Chat Qualification API Route
 * Handles qualification flow within chat conversations
 */

import { NextRequest, NextResponse } from 'next/server'
import { getChatQualificationManager, handleChatWithQualification } from '@/lib/ai/chat-qualification-integration'
import { createClient } from '@/lib/supabase/server'

/**
 * POST /api/chat/qualify
 * Start or continue a qualification session
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, message, source, clientInfo } = body

    // Validate required fields
    if (!sessionId || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: sessionId, message' },
        { status: 400 }
      )
    }

    // Get user from session (if authenticated)
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Handle qualification
    const response = await handleChatWithQualification({
      sessionId,
      userId: user?.id,
      message,
      source: source || 'website',
      clientInfo: clientInfo || {},
    })

    // Log interaction to database
    await logQualificationInteraction({
      sessionId,
      userId: user?.id,
      message,
      response: response.message,
      type: response.type,
    })

    return NextResponse.json(response)
  } catch (error: any) {
    console.error('[API /chat/qualify] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}

/**
 * GET /api/chat/qualify/:sessionId
 * Get qualification session status
 */
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const sessionId = url.searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Missing sessionId parameter' },
        { status: 400 }
      )
    }

    const manager = getChatQualificationManager()
    const session = manager.getSession(sessionId)

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      sessionId: session.sessionId,
      productId: session.productId,
      agentRole: session.agentRole,
      startedAt: session.startedAt,
      lastInteractionAt: session.lastInteractionAt,
      clientInfo: session.clientInfo,
    })
  } catch (error: any) {
    console.error('[API /chat/qualify GET] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/chat/qualify/:sessionId
 * Cancel qualification session
 */
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const sessionId = url.searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Missing sessionId parameter' },
        { status: 400 }
      )
    }

    const manager = getChatQualificationManager()
    const cancelled = manager.cancelSession(sessionId)

    if (!cancelled) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('[API /chat/qualify DELETE] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Log qualification interaction to database
 */
async function logQualificationInteraction(params: {
  sessionId: string
  userId?: string
  message: string
  response: string
  type: string
}): Promise<void> {
  try {
    const supabase = await createClient()

    await supabase.from('lead_interactions').insert({
      session_id: params.sessionId,
      user_id: params.userId || null,
      type: params.type,
      message: `User: ${params.message} | Bot: ${params.response}`,
      metadata: {
        userMessage: params.message,
        botResponse: params.response,
      },
    })
  } catch (error) {
    // Don't throw - logging failure shouldn't break the flow
    console.error('[logQualificationInteraction] Error:', error)
  }
}
