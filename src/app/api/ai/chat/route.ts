import { NextRequest, NextResponse } from 'next/server'
import { withRateLimit } from '@/lib/rate-limit'
import { withValidation } from '@/lib/validations/api-middleware'
import { z } from 'zod'
import { processQuery } from '@/lib/ai/agents/agent-orchestrator'

// AI chat schema
const aiChatSchema = z.object({
  message: z.string().min(1, 'Message é obrigatória').max(2000, 'Mensagem muito longa'),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string(),
  })).optional(),
})

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
async function postHandler(req: NextRequest) {
  try {
    const { message, history } = (req as any).validatedData

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
async function getHandler() {
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

// Apply validation, sanitization, and rate limiting
export const POST = withRateLimit(
  withValidation(aiChatSchema, postHandler, { sanitize: true }),
  { type: 'chat', limit: 20 }
)

export const GET = withRateLimit(getHandler, { type: 'api', limit: 100 })
