import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createLogger } from '@/lib/logger'

const logger = createLogger('api:auth:2fa:setup')

export const dynamic = 'force-dynamic'

// Simplified TOTP implementation (for demonstration - in production use a library)
function generateSecret(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  let secret = ''
  for (let i = 0; i < 32; i++) {
    secret += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return secret
}

function createQRCodeDataURL(email: string, secret: string): string {
  // Simple QR code generation using Google Charts API
  const otpAuthUrl = `otpauth://totp/Garcez%20Palha:${encodeURIComponent(email)}?secret=${secret}&issuer=Garcez%20Palha`
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(otpAuthUrl)}`
  return qrCodeUrl
}

// ============================================================================
// POST /api/auth/2fa/setup - Generate QR code and secret for 2FA setup
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    logger.info('[2FA] Setup initiated', { userId: user.id })

    // Check if 2FA is already enabled in profiles table
    const { data: profile } = await supabase
      .from('profiles')
      .select('two_factor_enabled, two_factor_secret')
      .eq('id', user.id)
      .single()

    if (profile?.two_factor_enabled) {
      return NextResponse.json(
        { error: '2FA já está ativado. Desative primeiro para reconfigurar.' },
        { status: 400 }
      )
    }

    // Generate new secret
    const secret = generateSecret()

    // Generate QR code URL
    const qrCodeDataUrl = createQRCodeDataURL(user.email || 'user@garcezpalha.com', secret)

    // Save secret temporarily (not enabled yet - will be enabled after verification)
    await supabase
      .from('profiles')
      .update({
        two_factor_secret: secret,
        two_factor_enabled: false, // Still false until verified
      })
      .eq('id', user.id)

    logger.info('[2FA] Secret generated and saved', { userId: user.id })

    return NextResponse.json({
      success: true,
      secret,
      qrCode: qrCodeDataUrl,
    })
  } catch (error) {
    logger.error('[2FA Setup] Error:', error)

    return NextResponse.json(
      {
        error: 'Erro ao configurar 2FA',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
