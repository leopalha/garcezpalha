import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { getToken } from 'next-auth/jwt'

/**
 * POST /api/conversations/[id]/takeover
 * Admin assume conversa do bot (Human Handoff)
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

    const conversationId = params.id
    const supabase = getSupabaseAdmin()

    // Update conversation status to human
    const { error } = await supabase
      .from('realtime_conversations')
      .update({
        status: 'human_takeover',
        metadata: {
          assigned_admin_id: token.id as string,
          taken_over_at: new Date().toISOString(),
        },
      })
      .eq('id', conversationId)

    if (error) {
      console.error('Takeover error:', error)
      return NextResponse.json({ error: 'Erro ao assumir conversa' }, { status: 500 })
    }

    // Add system message
    await supabase.from('realtime_messages').insert({
      conversation_id: conversationId,
      role: 'system',
      content: `Conversa assumida por ${token.name || 'Admin'}. Um atendente humano irá responder agora.`,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Takeover error:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
