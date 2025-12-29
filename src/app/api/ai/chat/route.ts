import { NextRequest, NextResponse } from 'next/server'
import { processQuery } from '@/lib/ai/agents/agent-orchestrator'

/**
 * Universal AI Chat Endpoint
 *
 * Routes messages to appropriate specialized agents using the orchestrator
 *
 * POST /api/ai/chat
 * {
 *   "message": "Preciso avaliar um imóvel",
 *   "history": [] // optional conversation history
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      )
    }

    // Process query through orchestrator
    const response = await processQuery(message, history || [])

    return NextResponse.json({
      success: true,
      response: response.content,
      agent: response.agentUsed,
      confidence: response.confidence,
    })
  } catch (error) {
    console.error('[AI Chat] Error processing message:', error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error instanceof Error ? error.message : String(error) : 'Unknown error occurred',
      },
      { status: 500 }
    )
  }
}

/**
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'AI Chat API',
    agents: [
      'real-estate',
      'document-forensics',
      'property-valuation',
      'medical-expertise',
      'criminal-law',
      'financial-protection',
      'health-insurance',
      'social-security',
    ],
  })
}
