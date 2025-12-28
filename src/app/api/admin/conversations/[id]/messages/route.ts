/**
 * Conversation Messages API
 * Get and send messages in a conversation
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
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
      .order('timestamp', { ascending: true })

    if (messagesError) {
      console.error('[Messages API] Error fetching messages:', messagesError)

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
  } catch (error: any) {
    console.error('[Messages API] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages', details: error.message },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const conversationId = params.id
    const { message, humanTakeover } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const supabase = await createClient()

    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Save user message to database
    await supabase.from('messages').insert({
      conversation_id: conversationId,
      role: 'user',
      content: message,
      metadata: { human_takeover: humanTakeover, user_id: user.id },
    })

    // If human takeover, don't route through agent-flow
    if (humanTakeover) {
      console.log('[Human Message]:', message)

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
        message,
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
  } catch (error: any) {
    console.error('[Messages API] Error sending message:', error)
    return NextResponse.json(
      { error: 'Failed to send message', details: error.message },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
export const maxDuration = 30
