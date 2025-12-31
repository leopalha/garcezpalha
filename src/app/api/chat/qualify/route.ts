/**
 * Chat Qualification API Route
 * Handles qualification flow within chat conversations with comprehensive logging and error handling
 */

import { NextRequest, NextResponse } from 'next/server'
import { withRateLimit } from '@/lib/rate-limit'
import { getChatQualificationManager, handleChatWithQualification } from '@/lib/ai/chat-qualification-integration'
import { createClient } from '@/lib/supabase/server'
import { loggers, createTimer } from '@/lib/utils/logger'

const logger = loggers.qualification

/**
 * POST /api/chat/qualify
 * Start or continue a qualification session
 *
 * Request body:
 * - sessionId: Unique session identifier
 * - message: User's message content
 * - source: Message source (whatsapp, telegram, website, phone)
 * - clientInfo: Optional client information (name, phone, email, etc.)
 */
async function postHandler(request: NextRequest) {
  const timer = createTimer('POST /api/chat/qualify')

  try {
    // Parse request body
    const body = await request.json()
    const { sessionId, message, source, clientInfo } = body

    logger.info('Qualification request received', {
      sessionId,
      source: source || 'website',
      messageLength: message?.length || 0,
    })

    // Validate required fields
    if (!sessionId || !message) {
      logger.warn('Missing required fields', {
        hasSessionId: !!sessionId,
        hasMessage: !!message,
      })

      return NextResponse.json(
        { error: 'Missing required fields: sessionId, message' },
        { status: 400 }
      )
    }

    // Validate message length
    if (typeof message !== 'string' || message.trim().length === 0) {
      logger.warn('Invalid message format', { sessionId })

      return NextResponse.json(
        { error: 'Message must be a non-empty string' },
        { status: 400 }
      )
    }

    if (message.length > 10000) {
      logger.warn('Message too long', {
        sessionId,
        messageLength: message.length,
      })

      return NextResponse.json(
        { error: 'Message exceeds maximum length of 10000 characters' },
        { status: 400 }
      )
    }

    // Get authenticated user (if any)
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    logger.debug('Processing qualification', {
      sessionId,
      userId: user?.id || 'anonymous',
      source: source || 'website',
    })

    // Handle qualification through AI system
    const response = await handleChatWithQualification({
      sessionId,
      userId: user?.id,
      message,
      source: source || 'website',
      clientInfo: clientInfo || {},
    })

    // Log interaction to database (async, non-blocking)
    logQualificationInteraction({
      sessionId,
      userId: user?.id,
      message,
      response: response.message,
      type: response.type,
    }).catch((error) => {
      logger.error('Failed to log interaction', error)
    })

    const duration = timer.getDuration()

    logger.info('Qualification completed', {
      sessionId,
      responseType: response.type,
      duration: `${duration}ms`,
    })

    return NextResponse.json(response)

  } catch (error) {
    const duration = timer.getDuration()

    logger.error('Qualification failed', error instanceof Error ? error : new Error(String(error)), {
      duration: `${duration}ms`,
    })

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error instanceof Error ? error.message : String(error) : String(error)) : 'An error occurred',
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/chat/qualify?sessionId=xxx
 * Get qualification session status
 */
async function getHandler(request: NextRequest) {
  const timer = createTimer('GET /api/chat/qualify')

  try {
    const url = new URL(request.url)
    const sessionId = url.searchParams.get('sessionId')

    logger.info('Session status request', { sessionId })

    if (!sessionId) {
      logger.warn('Missing sessionId parameter')

      return NextResponse.json(
        { error: 'Missing sessionId parameter' },
        { status: 400 }
      )
    }

    const manager = getChatQualificationManager()
    const session = manager.getSession(sessionId)

    if (!session) {
      logger.warn('Session not found', { sessionId })

      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    const duration = timer.getDuration()

    logger.info('Session retrieved', {
      sessionId,
      duration: `${duration}ms`,
    })

    return NextResponse.json({
      sessionId: session.sessionId,
      productId: session.productId,
      agentRole: session.agentRole,
      startedAt: session.startedAt,
      lastInteractionAt: session.lastInteractionAt,
      clientInfo: session.clientInfo,
    })

  } catch (error) {
    const duration = timer.getDuration()

    logger.error('Failed to retrieve session', error instanceof Error ? error : new Error(String(error)), {
      duration: `${duration}ms`,
    })

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/chat/qualify?sessionId=xxx
 * Cancel qualification session
 */
async function deleteHandler(request: NextRequest) {
  const timer = createTimer('DELETE /api/chat/qualify')

  try {
    const url = new URL(request.url)
    const sessionId = url.searchParams.get('sessionId')

    logger.info('Session cancellation request', { sessionId })

    if (!sessionId) {
      logger.warn('Missing sessionId parameter')

      return NextResponse.json(
        { error: 'Missing sessionId parameter' },
        { status: 400 }
      )
    }

    const manager = getChatQualificationManager()
    const cancelled = manager.cancelSession(sessionId)

    if (!cancelled) {
      logger.warn('Session not found for cancellation', { sessionId })

      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    const duration = timer.getDuration()

    logger.info('Session cancelled successfully', {
      sessionId,
      duration: `${duration}ms`,
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    const duration = timer.getDuration()

    logger.error('Failed to cancel session', error instanceof Error ? error : new Error(String(error)), {
      duration: `${duration}ms`,
    })

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

// Apply rate limiting to all endpoints
export const POST = withRateLimit(postHandler, { type: 'chat', limit: 20 })
export const GET = withRateLimit(getHandler, { type: 'api', limit: 50 })
export const DELETE = withRateLimit(deleteHandler, { type: 'api', limit: 10 })
