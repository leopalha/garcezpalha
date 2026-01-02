import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()

    // Mark notification as read (only if it belongs to the user)
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', params.id)
      .eq('user_id', token.sub)

    if (error) {
      logger.error('Error marking notification as read:', error)
      return NextResponse.json(
        { error: 'Failed to mark notification as read' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Mark as read error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
