import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { getToken } from 'next-auth/jwt'

/**
 * GET /api/conversations
 * Lista todas as conversas ativas com leads
 */
export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    if (!token || token.role !== 'admin') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const supabase = getSupabaseAdmin()

    // Fetch conversations with messages
    const { data: conversations, error } = await supabase
      .from('realtime_conversations')
      .select('*')
      .in('status', ['active', 'human_takeover'])
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Erro ao buscar conversas' }, { status: 500 })
    }

    // Fetch messages for each conversation
    const conversationsWithMessages = await Promise.all(
      (conversations || []).map(async (conv: any) => {
        const { data: messages } = await supabase
          .from('realtime_messages')
          .select('*')
          .eq('conversation_id', conv.id)
          .order('created_at', { ascending: true })

        return {
          id: conv.id,
          user_id: conv.user_id,
          product_id: conv.product_id,
          session_id: conv.session_id,
          status: conv.status,
          mode: conv.mode,
          started_at: conv.started_at,
          updated_at: conv.updated_at,
          total_messages: conv.total_messages || 0,
          messages: messages || [],
        }
      })
    )

    return NextResponse.json({ conversations: conversationsWithMessages })
  } catch (error) {
    console.error('Conversations fetch error:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
