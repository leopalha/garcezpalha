/**
 * Conversation Messages API
 * Get and send messages in a conversation
 */

import { NextRequest, NextResponse } from 'next/server'
import { withRateLimit } from '@/lib/rate-limit'
import { createClient } from '@/lib/supabase/server'
import { conversationMessageSchema } from '@/lib/validations/admin-schemas'
import { ZodError } from 'zod'
import { logger } from '@/lib/logger'

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

    // Get messages from database
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })

    if (messagesError) {
      logger.error('[Messages API] Error fetching messages:', messagesError)

      // Fallback: return empty array if table doesn't exist yet
      if (messagesError.code === '42P01') {
        return NextResponse.json({
          messages: [],
          warning: 'Messages table not created yet. Run migration: 20251227_messages_table.sql'
        })
      }

      throw messagesError
    }

    return NextResponse.json({ messages: messages || [] })
  } catch (error) {
    logger.error('[Messages API] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages', details: error instanceof Error ? error instanceof Error ? error.message : String(error) : String(error) },
      { status: 500 }
    )
  }
}

async function postHandler(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const conversationId = params.id
    const rawBody = await request.json()

    // Validate request body with Zod
    const validatedData = conversationMessageSchema.parse({
      content: rawBody.message,
      role: 'user',
      metadata: { humanTakeover: rawBody.humanTakeover }
    })

    const supabase = await createClient()

    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Save user message to database
    await supabase.from('messages').insert({
      conversation_id: conversationId,
      role: validatedData.role,
      content: validatedData.content,
      metadata: { ...validatedData.metadata, user_id: user.id },
    })

    // If human takeover, don't route through agent-flow
    if (rawBody.humanTakeover) {
      logger.info('[Human Message]:', validatedData.content)

      return NextResponse.json({
        success: true,
        message: 'Message sent by human',
      })
    }

    // Route through agent-flow API
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/chat/agent-flow`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        conversationId,
        message: validatedData.content,
        channel: 'admin',
      }),
    })

    if (!response.ok) {
      throw new Error('Agent flow API error')
    }

    const data = await response.json()

    // Save assistant response to database
    if (data.response) {
      await supabase.from('messages').insert({
        conversation_id: conversationId,
        role: 'assistant',
        content: data.response,
        metadata: { state: data.state, classification: data.classification },
      })
    }

    return NextResponse.json({
      success: true,
      response: data.response,
      state: data.state,
    })
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      )
    }

    logger.error('[Messages API] Error sending message:', error)
    return NextResponse.json(
      { error: 'Failed to send message', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

// Apply rate limiting - wrappers extract params from URL
export const GET = withRateLimit(
  async (request: NextRequest) => {
    const id = request.url.split("/")[5]
    return getHandler(request, { params: { id } })
  },
  { type: "api", limit: 100 }
)

export const POST = withRateLimit(
  async (request: NextRequest) => {
    const id = request.url.split("/")[5]
    return postHandler(request, { params: { id } })
  },
  { type: "chat", limit: 20 }
)

export const runtime = 'nodejs'
export const maxDuration = 30
