import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@/lib/supabase/route-handler'

/**
 * GET /api/conversations
 *
 * List conversations with filters
 *
 * Query params:
 * - status: 'active' | 'bot' | 'waiting_human' | 'human' | 'resolved' | 'closed'
 * - needsAttention: boolean
 * - limit: number (default: 50, max: 100)
 * - offset: number (default: 0)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient()

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Parse query params
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const needsAttention = searchParams.get('needsAttention')
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build query
    let query = supabase
      .from('conversations')
      .select(
        `
        id,
        lead_id,
        status,
        qualification_score,
        needs_attention,
        last_message_at,
        created_at,
        channel,
        leads (
          id,
          full_name,
          email,
          phone,
          service_interest
        )
      `,
        { count: 'exact' }
      )
      .order('last_message_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply filters
    if (status) {
      query = query.eq('status', status)
    }

    if (needsAttention === 'true') {
      query = query.eq('needs_attention', true)
    }

    const { data: conversations, error, count } = await query

    if (error) {
      console.error('Error fetching conversations:', error)
      return NextResponse.json({ error: 'Erro ao buscar conversas' }, { status: 500 })
    }

    // Fetch last message for each conversation
    const conversationsWithMessages = await Promise.all(
      (conversations || []).map(async (conv: any) => {
        const { data: lastMessage } = await supabase
          .from('messages')
          .select('content, created_at')
          .eq('conversation_id', conv.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        const { data: messageCount, count: msgCount } = await supabase
          .from('messages')
          .select('id', { count: 'exact', head: true })
          .eq('conversation_id', conv.id)

        // Map status to state for frontend compatibility
        let state = conv.status
        if (conv.status === 'waiting_human') {
          state = 'escalated'
        } else if (conv.status === 'human') {
          state = 'admin_active'
        } else if (conv.status === 'bot') {
          state = conv.qualification_score >= 80 ? 'qualified' : 'classifying'
        }

        return {
          id: conv.id,
          lead_id: conv.lead_id,
          lead_name: conv.leads?.full_name || 'Lead sem nome',
          lead_email: conv.leads?.email || '',
          lead_phone: conv.leads?.phone || '',
          state,
          qualification_score: conv.qualification_score || 0,
          last_message: lastMessage?.content || '',
          last_message_at: lastMessage?.created_at || conv.created_at,
          created_at: conv.created_at,
          message_count: msgCount || 0,
          channel: conv.channel,
          needs_attention: conv.needs_attention,
        }
      })
    )

    return NextResponse.json({
      conversations: conversationsWithMessages,
      total: count || 0,
    })
  } catch (error) {
    console.error('Error in GET /api/conversations:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
