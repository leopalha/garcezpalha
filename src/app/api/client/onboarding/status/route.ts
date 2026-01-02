import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { createClient } from '@/lib/supabase/server'
import { createLogger } from '@/lib/logger'

const logger = createLogger('api:client:onboarding:status')

/**
 * GET /api/client/onboarding/status
 * Check if the client has completed onboarding
 */
export async function GET(request: NextRequest) {
  try {
    // Auth check
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      logger.warn('Unauthorized onboarding status check attempt')
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const userId = session.user.id

    logger.info('Checking onboarding status', { userId })

    const supabase = await createClient()

    // Check if user has completed onboarding
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('onboarding_completed, onboarding_step, onboarding_data')
      .eq('id', userId)
      .single()

    if (error) {
      logger.error('Error fetching profile', { error, userId })
      throw new Error('Failed to fetch profile')
    }

    logger.info('Onboarding status retrieved', {
      userId,
      completed: profile?.onboarding_completed || false,
      step: profile?.onboarding_step || 1
    })

    return NextResponse.json({
      completed: profile?.onboarding_completed || false,
      currentStep: profile?.onboarding_step || 1,
      data: profile?.onboarding_data || {}
    })

  } catch (error) {
    logger.error('Error in onboarding status GET', error)
    return NextResponse.json(
      { error: 'Erro ao verificar status do onboarding' },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
