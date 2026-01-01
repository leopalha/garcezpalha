/**
 * API Route: Subscribe to Email Sequence
 * POST /api/email/sequences/subscribe
 */

import { NextRequest, NextResponse } from 'next/server'
import { withRateLimit } from '@/lib/rate-limit'
import { emailSequenceEngine } from '@/lib/email/sequences/engine'
import type { SequenceTriggerData } from '@/lib/email/sequences/types'

// Force dynamic rendering - required for API routes
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

async function postHandler(req: NextRequest) {
  try {
    const body = await req.json()
    const { sequenceId, email, firstName, lastName, customData, userId, leadId, conversationId } =
      body

    if (!sequenceId || !email || !firstName) {
      return NextResponse.json(
        { error: 'Missing required fields: sequenceId, email, firstName' },
        { status: 400 }
      )
    }

    const triggerData: SequenceTriggerData = {
      event: 'manual_subscription',
      userId,
      leadId,
      conversationId,
      email,
      firstName,
      lastName,
      customData: customData || {},
    }

    const subscription = await emailSequenceEngine.subscribe(sequenceId, triggerData)

    return NextResponse.json({
      success: true,
      subscription,
    })
  } catch (error) {
    console.error('[API] Email sequence subscribe error:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe to sequence', details: (error as Error).message },
      { status: 500 }
    )
  }
}

// Apply rate limiting
export const POST = withRateLimit(postHandler, { type: 'api', limit: 20 })
