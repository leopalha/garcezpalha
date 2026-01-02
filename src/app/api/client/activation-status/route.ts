import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { createClient } from '@/lib/supabase/server'
import { createLogger } from '@/lib/logger'

const logger = createLogger('api:client:activation-status')

/**
 * GET /api/client/activation-status
 * Get the client's activation checklist status
 */
export async function GET(request: NextRequest) {
  try {
    // Auth check
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      logger.warn('Unauthorized activation status check')
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const userId = session.user.id

    logger.info('Checking activation status', { userId })

    const supabase = await createClient()

    // Get profile data
    const { data: profile } = await supabase
      .from('profiles')
      .select('phone, address, city, state, cep, onboarding_completed')
      .eq('id', userId)
      .single()

    // Check if profile is complete
    const profileComplete = !!(
      profile?.phone &&
      profile?.address &&
      profile?.city &&
      profile?.state &&
      profile?.cep
    )

    // Check if documents have been uploaded
    const { count: docsCount } = await supabase
      .from('case_documents')
      .select('*', { count: 'exact', head: true })
      .eq('uploaded_by', userId)

    const documentsUploaded = (docsCount || 0) >= 3 // At least 3 documents

    // Check if meeting has been scheduled
    const { count: meetingCount } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('client_id', userId)

    const meetingScheduled = (meetingCount || 0) > 0

    // Check if user has sent a message
    const { count: messageCount } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('sender_id', userId)

    const messageSent = (messageCount || 0) > 0

    // Check if guide/tour was viewed (from user preferences)
    const { data: preferences } = await supabase
      .from('user_preferences')
      .select('platform_tour_completed')
      .eq('user_id', userId)
      .single()

    const guideViewed = preferences?.platform_tour_completed || false

    const status = {
      profileComplete,
      documentsUploaded,
      meetingScheduled,
      messageSent,
      guideViewed,
      onboardingCompleted: profile?.onboarding_completed || false
    }

    logger.info('Activation status retrieved', { userId, status })

    return NextResponse.json(status)

  } catch (error) {
    logger.error('Error in activation status GET', error)
    // Return default values on error
    return NextResponse.json({
      profileComplete: false,
      documentsUploaded: false,
      meetingScheduled: false,
      messageSent: false,
      guideViewed: false,
      onboardingCompleted: false
    })
  }
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
