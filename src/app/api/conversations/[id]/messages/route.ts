import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@/lib/supabase/route-handler'
import { cookies } from 'next/headers'

/**
 * POST /api/conversations/[id]/messages
 *
 * Send admin message in conversation
 *
 * Body:
 * {
 *   content: string
 * }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const conversationId = params.id
    const body = await request.json()
    const { content } = body

    if (!content || typeof content !== 'string') {
      return NextResponse.json({ error: 'Mensagem inválida' }, { status: 400 })
    }

    // Verify conversation exists
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('id, status')
      .eq('id', conversationId)
      .single()

    if (convError || !conversation) {
      return NextResponse.json(
        { error: 'Conversa não encontrada' },
        { status: 404 }
      )
    }

    // Insert admin message
    const { data: message, error: messageError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_type: 'agent',
        sender_id: user.id,
        content,
      })
      .select()
      .single()

    if (messageError) {
      console.error('Error inserting message:', messageError)
      return NextResponse.json(
        { error: 'Erro ao enviar mensagem' },
        { status: 500 }
      )
    }

    // Update conversation last_message_at
    await supabase
      .from('conversations')
      .update({
        last_message_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', conversationId)

    // Transform message to expected format
    const transformedMessage = {
      id: message.id,
      role: 'admin',
      content: message.content,
      created_at: message.created_at,
      sender_type: message.sender_type,
    }

    // TODO: Send message via WhatsApp/Email to lead
    // This would integrate with WhatsApp Business API or email service
    // For now, message is only stored in database

    return NextResponse.json({
      success: true,
      message: transformedMessage,
    })
  } catch (error) {
    console.error('Error in POST /api/conversations/[id]/messages:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
