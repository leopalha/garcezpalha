import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { createLogger } from '@/lib/logger'
import { createClient } from '@/lib/supabase/server'

const logger = createLogger('api:notifications:mark-all-read')

/**
 * POST /api/notifications/mark-all-read
 * Mark all notifications as read for the current user
 */
export async function POST(request: NextRequest) {
  try {
    // Auth check
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      logger.warn('Unauthorized mark-all-read attempt')
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const userId = session.user.id

    logger.info('Marking all notifications as read', { userId })

    const supabase = await createClient()

    // Update all unread notifications
    const { data, error, count } = await supabase
      .from('notifications')
      .update({
        read: true,
        read_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('read', false)
      .select()

    if (error) {
      logger.error('Error marking all notifications as read', error)
      throw new Error('Failed to update notifications')
    }

    logger.info('All notifications marked as read', {
      userId,
      updatedCount: data?.length || 0
    })

    return NextResponse.json({
      success: true,
      updatedCount: data?.length || 0,
    })

  } catch (error) {
    logger.error('Error in mark-all-read POST', error)
    return NextResponse.json(
      { error: 'Erro ao marcar todas as notificações como lidas' },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
