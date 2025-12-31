/**
 * Enable 2FA API
 * P1-001: MFA/2FA for Admin Users
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { withRateLimit } from '@/lib/rate-limit'
import { withValidation } from '@/lib/validations/api-middleware'
import { enable2FASchema } from '@/lib/validations/auth'
import { enable2FA } from '@/lib/auth/two-factor'
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

    const { method, phone } = (request as any).validatedData

    // Enable 2FA
    const result = await enable2FA(user.id, method, undefined, phone)

    // Log audit event
    await logAuthEvent('auth.2fa_enabled', user.id, { method }, true)

    return NextResponse.json({
      success: true,
      secret: result.secret,
      qrCodeURL: result.qrCodeURL,
      backupCodes: result.backupCodes,
    })
  } catch (error: any) {
    console.error('Enable 2FA error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to enable 2FA' },
      { status: 500 }
    )
  }
}

// Apply validation, sanitization, and rate limiting
export const POST = withRateLimit(
  withValidation(enable2FASchema, handler, { sanitize: true }),
  { type: 'auth', limit: 5 }
)
