/**
 * Verify 2FA Code API
 * P1-001: MFA/2FA for Admin Users
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { withRateLimit } from '@/lib/rate-limit'
import { withValidation } from '@/lib/validations/api-middleware'
import { verify2FASchema } from '@/lib/validations/auth'
import { verify2FACode } from '@/lib/auth/two-factor'
import { logAuthEvent } from '@/lib/audit/logger'
import { createLogger } from '@/lib/logger'

const logger = createLogger('api:auth:2fa:verify')

async function handler(request: NextRequest) {
  try {
    const supabase = await createClient()

    logger.info('Processing 2FA verification request')

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      logger.warn('2FA verification failed - unauthorized')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { code } = (request as any).validatedData

    logger.info('Verifying 2FA code for user', { userId: user.id })

    // Verify code
    const valid = await verify2FACode(user.id, code)

    if (!valid) {
      // Log failed attempt
      logger.warn('2FA verification failed - invalid or expired code', { userId: user.id })
      await logAuthEvent('auth.2fa_failed', user.id, { code_length: code.length }, false)

      return NextResponse.json(
        { error: 'Código inválido ou expirado' },
        { status: 400 }
      )
    }

    // Update verified timestamp
    await supabase
      .from('users')
      .update({ two_factor_verified_at: new Date().toISOString() })
      .eq('id', user.id)

    // Log successful verification
    await logAuthEvent('auth.2fa_verified', user.id, {}, true)

    logger.info('2FA verification successful', { userId: user.id, status: 200 })

    return NextResponse.json({
      success: true,
      message: '2FA verificado com sucesso',
    })
  } catch (error: any) {
    logger.error('2FA verification request failed', error)
    return NextResponse.json(
      { error: error.message || 'Failed to verify 2FA' },
      { status: 500 }
    )
  }
}

// Apply validation, sanitization, and rate limiting (stricter for security)
export const POST = withRateLimit(
  withValidation(verify2FASchema, handler, { sanitize: true }),
  { type: 'auth', limit: 10 } // 10 attempts per window
)
