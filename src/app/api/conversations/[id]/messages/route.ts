import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@/lib/supabase/route-handler'
import { createLogger } from '@/lib/logger'

const logger = createLogger('api:conversations:messages')

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
    const supabase = createRouteHandlerClient()

    const conversationId = params.id
    logger.info('Processing message send request', { conversationId })

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      logger.warn('Message send failed - unauthorized')
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { content } = body

    if (!content || typeof content !== 'string') {
      logger.warn('Message send failed - invalid content', { userId: user.id, conversationId })
      return NextResponse.json({ error: 'Mensagem inválida' }, { status: 400 })
    }

    logger.info('Validating conversation', { userId: user.id, conversationId, contentLength: content.length })

    // Verify conversation exists
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('id, status')
      .eq('id', conversationId)
      .single()

    if (convError || !conversation) {
      logger.warn('Message send failed - conversation not found', { userId: user.id, conversationId })
      return NextResponse.json(
        { error: 'Conversa não encontrada' },
        { status: 404 }
      )
    }

    logger.info('Inserting message in database', { userId: user.id, conversationId })

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
      logger.error('Error inserting message in database', messageError, { userId: user.id, conversationId })
      return NextResponse.json(
        { error: 'Erro ao enviar mensagem' },
        { status: 500 }
      )
    }

    logger.info('Message inserted successfully', { userId: user.id, conversationId, messageId: message.id })

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

    logger.info('Message send completed successfully', { userId: user.id, conversationId, messageId: message.id, status: 200 })

    return NextResponse.json({
      success: true,
      message: transformedMessage,
    })
  } catch (error) {
    logger.error('Message send request failed', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
