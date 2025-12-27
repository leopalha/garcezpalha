import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { getToken } from 'next-auth/jwt'

/**
 * POST /api/conversations/[id]/messages
 * Admin envia mensagem na conversa
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    if (!token || token.role !== 'admin') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { content } = await request.json()
    if (!content || typeof content !== 'string') {
      return NextResponse.json({ error: 'Mensagem inv\u00e1lida' }, { status: 400 })
    }

    const conversationId = params.id
    const supabase = getSupabaseAdmin()

    // Insert message
    const { data: message, error: messageError } = await supabase
      .from('realtime_messages')
      .insert({
        conversation_id: conversationId,
        role: 'agent',
        content,
        metadata: { sender_id: token.id as string },
      })
      .select()
      .single()

    if (messageError) {
      console.error('Message insert error:', messageError)
      return NextResponse.json({ error: 'Erro ao enviar mensagem' }, { status: 500 })
    }

    // Update conversation updated_at
    await supabase
      .from('realtime_conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId)

    // TODO: Send message via WhatsApp/Email to lead
    // This would integrate with WhatsApp API or email service

    return NextResponse.json({ success: true, message })
  } catch (error) {
    console.error('Send message error:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
