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

async function handler(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { code } = (request as any).validatedData

    // Verify code
    const valid = await verify2FACode(user.id, code)

    if (!valid) {
      // Log failed attempt
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

    return NextResponse.json({
      success: true,
      message: '2FA verificado com sucesso',
    })
  } catch (error: any) {
    console.error('Verify 2FA error:', error)
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
