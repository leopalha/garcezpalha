import { NextRequest, NextResponse } from 'next/server'
import { AgentStateMachine } from '@/lib/ai/agents/state-machine'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { conversationId, message, channel = 'website' } = body

    if (!conversationId || !message) {
      return NextResponse.json(
        { error: 'conversationId and message are required' },
        { status: 400 }
      )
    }

    // Initialize state machine
    const stateMachine = new AgentStateMachine()

    // Process message through state machine
    const result = await stateMachine.processMessage(conversationId, message)

    return NextResponse.json({
      response: result.response,
      state: result.data.status.state,
      classification: result.data.classification,
      qualification: result.data.qualification,
      proposal: result.data.proposal,
      conversationData: result.data,
    })

  } catch (error) {
    console.error('[Agent Flow API] Error:', error)

    return NextResponse.json(
      {
        error: 'Failed to process message',
        details: error instanceof Error ? error instanceof Error ? error.message : String(error) : String(error),
      },
      { status: 500 }
    )
  }
}

// GET method to retrieve conversation state
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

    const stateMachine = new AgentStateMachine()
    const state = await stateMachine.getState(conversationId)

    if (!state) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ state })

  } catch (error) {
    console.error('[Agent Flow API] Error:', error)

    return NextResponse.json(
      {
        error: 'Failed to get conversation state',
        details: error instanceof Error ? error instanceof Error ? error.message : String(error) : String(error),
      },
      { status: 500 }
    )
  }
}

// PUT method for manual state transitions (admin only)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { conversationId, newState, reason } = body

    if (!conversationId || !newState) {
      return NextResponse.json(
        { error: 'conversationId and newState are required' },
        { status: 400 }
      )
    }

    // TODO: Add authentication check for admin/lawyer roles

    const stateMachine = new AgentStateMachine()
    const updatedData = await stateMachine.manualTransition(
      conversationId,
      newState,
      reason
    )

    return NextResponse.json({
      message: 'State transition successful',
      data: updatedData,
    })

  } catch (error) {
    console.error('[Agent Flow API] Error:', error)

    return NextResponse.json(
      {
        error: 'Failed to transition state',
        details: error instanceof Error ? error instanceof Error ? error.message : String(error) : String(error),
      },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
export const maxDuration = 30
