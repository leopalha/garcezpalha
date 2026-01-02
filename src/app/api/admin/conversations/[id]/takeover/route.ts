/**
 * Admin Conversation Takeover
 * POST /api/admin/conversations/[id]/takeover
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createLogger } from '@/lib/logger'

const logger = createLogger('api:admin:conversations:takeover')

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get admin profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, full_name')
      .eq('id', user.id)
      .single()

    if (!profile || !['admin', 'lawyer'].includes(profile.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Update conversation to admin_active
    const { error } = await supabase
      .from('conversations')
      .update({
        status: {
          state: 'admin_active',
          updated_at: new Date().toISOString(),
        },
        assigned_admin_id: user.id,
      })
      .eq('conversation_id', params.id)

    if (error) {
      logger.error('Error taking over conversation', error)
      return NextResponse.json({ error: 'Failed to takeover' }, { status: 400 })
    }

    // Add system message
    await supabase.from('messages').insert({
      conversation_id: params.id,
      sender: 'system',
      content: `${profile.full_name} assumiu a conversa`,
      metadata: { type: 'takeover', admin_id: user.id },
    })

    logger.info('Conversation taken over', { conversationId: params.id })

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Error in takeover', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
