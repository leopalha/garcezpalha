import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createLogger } from '@/lib/logger'

const logger = createLogger('api:auth:2fa:verify-setup')

export const dynamic = 'force-dynamic'

// Simplified TOTP verification (for demonstration)
// In production, use a library like `otplib` or `speakeasy`
function verifyTOTP(secret: string, token: string): boolean {
  // For demonstration purposes, we'll do a simplified check
  // In a real implementation, you'd use proper TOTP algorithm (RFC 6238)

  // For now, accept any 6-digit code (DEMO ONLY)
  // TODO: Implement proper TOTP verification with time-based counter
  if (!/^\d{6}$/.test(token)) {
    return false
  }

  // In production: Calculate TOTP hash based on current time and secret
  // and compare with user input
  return true // DEMO: Always accept valid format for now
}

// ============================================================================
// POST /api/auth/2fa/verify-setup - Verify TOTP code and enable 2FA
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get token from request
    const body = await request.json()
    const { token } = body

    if (!token) {
      return NextResponse.json({ error: 'Código de verificação é obrigatório' }, { status: 400 })
    }

    logger.info('[2FA] Verifying setup code', { userId: user.id })

    // Get stored secret
    const { data: profile } = await supabase
      .from('profiles')
      .select('two_factor_secret, two_factor_enabled')
      .eq('id', user.id)
      .single()

    if (!profile?.two_factor_secret) {
      return NextResponse.json(
        { error: 'Configure o 2FA primeiro chamando /api/auth/2fa/setup' },
        { status: 400 }
      )
    }

    if (profile.two_factor_enabled) {
      return NextResponse.json(
        { error: '2FA já está ativado' },
        { status: 400 }
      )
    }

    // Verify TOTP code
    const isValid = verifyTOTP(profile.two_factor_secret, token)

    if (!isValid) {
      logger.warn('[2FA] Invalid verification code', { userId: user.id })
      return NextResponse.json(
        { error: 'Código de verificação inválido' },
        { status: 400 }
      )
    }

    // Enable 2FA
    await supabase
      .from('profiles')
      .update({
        two_factor_enabled: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    logger.info('[2FA] 2FA enabled successfully', { userId: user.id })

    return NextResponse.json({
      success: true,
      message: '2FA ativado com sucesso',
    })
  } catch (error) {
    logger.error('[2FA Verify] Error:', error)

    return NextResponse.json(
      {
        error: 'Erro ao verificar código',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
