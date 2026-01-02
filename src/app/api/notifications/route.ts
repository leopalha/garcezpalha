import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { createClient } from '@/lib/supabase/server'
import { createLogger } from '@/lib/logger'

const logger = createLogger('api:notifications')

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

    if (!token) {
      logger.warn('Notifications fetch failed - unauthorized')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    logger.info('Fetching notifications for user', { userId: token.sub })

    const supabase = await createClient()

    // Fetch notifications for the user
    const { data: notifications, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', token.sub)
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) {
      logger.error('Error fetching notifications from database', error, { userId: token.sub })
      return NextResponse.json({ notifications: [] })
    }

    logger.info('Notifications fetched successfully', { userId: token.sub, count: notifications?.length, status: 200 })

    return NextResponse.json({ notifications: notifications || [] })
  } catch (error) {
    logger.error('Notifications fetch request failed', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

    if (!token) {
      logger.warn('Notification creation failed - unauthorized')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, message, type } = body

    logger.info('Notification creation request received', { userId: token.sub, type })

    if (!title || !message) {
      logger.warn('Notification creation failed - missing required fields', { userId: token.sub })
      return NextResponse.json(
        { error: 'Title and message are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: token.sub,
        title,
        message,
        type: type || 'general',
        read: false,
      })
      .select()
      .single()

    if (error) {
      logger.error('Error creating notification in database', error, { userId: token.sub, type })
      return NextResponse.json(
        { error: 'Failed to create notification' },
        { status: 500 }
      )
    }

    logger.info('Notification created successfully', { userId: token.sub, notificationId: data.id, type, status: 200 })

    return NextResponse.json({ notification: data })
  } catch (error) {
    logger.error('Notification creation request failed', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
