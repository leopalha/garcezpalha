import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@/lib/supabase/route-handler'

/**
 * GET /api/conversations/[id]
 *
 * Get conversation details with full message history
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient()

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const conversationId = params.id

    // Fetch conversation with lead data
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select(
        `
        id,
        lead_id,
        status,
        qualification_score,
        needs_attention,
        channel,
        assigned_to,
        assigned_admin_id,
        taken_over_at,
        last_message_at,
        created_at,
        leads (
          id,
          full_name,
          email,
          phone,
          service_interest,
          message
        )
      `
      )
      .eq('id', conversationId)
      .single()

    if (convError || !conversation) {
      console.error('Error fetching conversation:', convError)
      return NextResponse.json(
        { error: 'Conversa não encontrada' },
        { status: 404 }
      )
    }

    // Fetch all messages
    const { data: messages, error: msgError } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })

    if (msgError) {
      console.error('Error fetching messages:', msgError)
      return NextResponse.json(
        { error: 'Erro ao buscar mensagens' },
        { status: 500 }
      )
    }

    // Map status to state for frontend compatibility
    let state = conversation.status
    if (conversation.status === 'waiting_human') {
      state = 'escalated'
    } else if (conversation.status === 'human') {
      state = 'admin_active'
    } else if (conversation.status === 'bot') {
      state = (conversation.qualification_score || 0) >= 80 ? 'qualified' : 'classifying'
    }

    // Transform messages to expected format
    const transformedMessages = (messages || []).map((msg: any) => ({
      id: msg.id,
      role: msg.sender_type === 'lead' || msg.sender_type === 'client' ? 'user' :
            msg.sender_type === 'agent' ? 'admin' : 'assistant',
      content: msg.content,
      created_at: msg.created_at,
      sender_type: msg.sender_type,
    }))

    const leads = (conversation as any).leads
    const response = {
      id: conversation.id,
      lead_id: conversation.lead_id,
      lead_name: leads?.full_name || 'Lead sem nome',
      lead_email: leads?.email || '',
      lead_phone: leads?.phone || '',
      state,
      qualification_score: conversation.qualification_score || 0,
      created_at: conversation.created_at,
      messages: transformedMessages,
      channel: conversation.channel,
      needs_attention: conversation.needs_attention,
      assigned_to: conversation.assigned_admin_id,
      taken_over: !!conversation.taken_over_at,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error in GET /api/conversations/[id]:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

/**
 * PATCH /api/conversations/[id]
 *
 * Update conversation (escalate, assign, resolve, etc.)
 *
 * Body:
 * {
 *   action: 'escalate' | 'takeover' | 'resolve' | 'close',
 *   adminId?: string
 * }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient()

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const conversationId = params.id
    const body = await request.json()
    const { action, adminId } = body

    let updateData: any = {
      updated_at: new Date().toISOString(),
    }

    switch (action) {
      case 'escalate':
        updateData.status = 'waiting_human'
        updateData.needs_attention = true
        break

      case 'takeover':
        updateData.status = 'human'
        updateData.assigned_admin_id = adminId || user.id
        updateData.taken_over_at = new Date().toISOString()
        updateData.needs_attention = false
        break

      case 'resolve':
        updateData.status = 'resolved'
        updateData.resolved_at = new Date().toISOString()
        updateData.needs_attention = false
        break

      case 'close':
        updateData.status = 'closed'
        updateData.needs_attention = false
        break

      case 'return_to_bot':
        updateData.status = 'bot'
        updateData.assigned_admin_id = null
        updateData.needs_attention = false
        break

      default:
        return NextResponse.json(
          { error: 'Ação inválida' },
          { status: 400 }
        )
    }

    const { data, error } = await supabase
      .from('conversations')
      .update(updateData)
      .eq('id', conversationId)
      .select()
      .single()

    if (error) {
      console.error('Error updating conversation:', error)
      return NextResponse.json(
        { error: 'Erro ao atualizar conversa' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, conversation: data })
  } catch (error) {
    console.error('Error in PATCH /api/conversations/[id]:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
