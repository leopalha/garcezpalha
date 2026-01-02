import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

export const runtime = 'edge'

/**
 * User tracking endpoint
 * Receives user behavior events from frontend tracker
 */

interface TrackingPayload {
  sessionId: string
  userId?: string
  events: Array<{
    type: string
    page: string
    timestamp: number
    data?: Record<string, any>
  }>
}

export async function POST(request: NextRequest) {
  try {
    const payload: TrackingPayload = await request.json()

    // Validate payload
    if (!payload.sessionId || !payload.events || !Array.isArray(payload.events)) {
      return NextResponse.json(
        { error: 'Invalid payload' },
        { status: 400 }
      )
    }

    // In production, store events in database or analytics service
    // For now, just log them
    logger.info(`[User Tracking] Session ${payload.sessionId}: ${payload.events.length} events`)

    // Could store in Supabase table `user_tracking_events`
    // await supabase.from('user_tracking_events').insert(...)

    return NextResponse.json({
      success: true,
      sessionId: payload.sessionId,
      eventsProcessed: payload.events.length,
    })
  } catch (error) {
    logger.error('Error processing tracking events:', error)
    return NextResponse.json(
      { error: 'Failed to process tracking events' },
      { status: 500 }
    )
  }
}
