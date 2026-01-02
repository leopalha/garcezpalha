/**
 * Disable 2FA API
 * P1-001: MFA/2FA for Admin Users
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { withRateLimit } from '@/lib/rate-limit'
import { disable2FA } from '@/lib/auth/two-factor'
import { logAuthEvent } from '@/lib/audit/logger'
import { createLogger } from '@/lib/logger'

const logger = createLogger('api:auth:2fa:disable')

async function handler(request: NextRequest) {
  try {
    const supabase = await createClient()

    logger.info('Processing 2FA disable request')

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      logger.warn('2FA disable failed - unauthorized')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin - admins should not be able to disable 2FA easily
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userData?.role === 'admin') {
      logger.warn('2FA disable failed - admin cannot disable 2FA', { userId: user.id })
      return NextResponse.json(
        {
          error: 'Admins não podem desativar 2FA. Entre em contato com o suporte.',
        },
        { status: 403 }
      )
    }

    logger.info('Disabling 2FA for user', { userId: user.id, role: userData?.role })

    // Disable 2FA
    await disable2FA(user.id)

    // Log audit event
    await logAuthEvent('auth.2fa_disabled', user.id, {}, true)

    logger.info('2FA disabled successfully', { userId: user.id, status: 200 })

    return NextResponse.json({
      success: true,
      message: '2FA desativado com sucesso',
    })
  } catch (error: any) {
    logger.error('2FA disable request failed', error)
    return NextResponse.json(
      { error: error.message || 'Failed to disable 2FA' },
      { status: 500 }
    )
  }
}

// Apply rate limiting
export const POST = withRateLimit(handler, { type: 'auth', limit: 3 })
