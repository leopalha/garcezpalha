/**
 * Admin Conversations API
 * Get list of all conversations for Human Handoff UI
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Auth check for admin/lawyer roles
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check user role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || !['admin', 'lawyer'].includes(profile.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const state = searchParams.get('state')
    const channel = searchParams.get('channel')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build query
    let query = supabase
      .from('conversations')
      .select('*')
      .order('last_message_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply filters
    if (state) {
      query = query.eq('status->>state', state)
    }

    if (channel) {
      query = query.eq('channel', channel)
    }

    const { data: conversations, error } = await query

    if (error) {
      console.error('[Admin Conversations API] Error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch conversations', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      conversations: conversations || [],
      total: conversations?.length || 0,
    })
  } catch (error: any) {
    console.error('[Admin Conversations API] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
export const maxDuration = 30
