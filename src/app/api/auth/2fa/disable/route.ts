/**
 * Disable 2FA API
 * P1-001: MFA/2FA for Admin Users
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { withRateLimit } from '@/lib/rate-limit'
import { disable2FA } from '@/lib/auth/two-factor'
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

    // Check if user is admin - admins should not be able to disable 2FA easily
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userData?.role === 'admin') {
      return NextResponse.json(
        {
          error: 'Admins não podem desativar 2FA. Entre em contato com o suporte.',
        },
        { status: 403 }
      )
    }

    // Disable 2FA
    await disable2FA(user.id)

    // Log audit event
    await logAuthEvent('auth.2fa_disabled', user.id, {}, true)

    return NextResponse.json({
      success: true,
      message: '2FA desativado com sucesso',
    })
  } catch (error: any) {
    console.error('Disable 2FA error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to disable 2FA' },
      { status: 500 }
    )
  }
}

// Apply rate limiting
export const POST = withRateLimit(handler, { type: 'auth', limit: 3 })
