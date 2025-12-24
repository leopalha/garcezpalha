import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import crypto from 'crypto'

/**
 * GET - Verify email with token from URL
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.redirect(
        new URL('/login?error=Token inválido', process.env.NEXTAUTH_URL || '')
      )
    }

    const supabase = await createClient()

    // Hash the token to compare with stored hash
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex')

    // Find user with this token
    const { data: user, error: findError } = await supabase
      .from('users')
      .select('id, name, email, verification_token_expiry')
      .eq('verification_token', tokenHash)
      .single()

    if (findError || !user) {
      console.error('[Verify Email] Token not found or invalid')
      return NextResponse.redirect(
        new URL('/login?error=Token inválido ou expirado', process.env.NEXTAUTH_URL || '')
      )
    }

    // Check if token is expired
    if (user.verification_token_expiry) {
      const expiry = new Date(user.verification_token_expiry)
      if (expiry < new Date()) {
        console.error('[Verify Email] Token expired for user:', user.email)
        return NextResponse.redirect(
          new URL('/login?error=Token expirado. Faça login para reenviar o email de verificação.', process.env.NEXTAUTH_URL || '')
        )
      }
    }

    // Update user to mark email as verified
    const { error: updateError } = await supabase
      .from('users')
      .update({
        email_verified: true,
        verification_token: null,
        verification_token_expiry: null,
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('[Verify Email] Error updating user:', updateError)
      return NextResponse.redirect(
        new URL('/login?error=Erro ao verificar email', process.env.NEXTAUTH_URL || '')
      )
    }

    console.log('[Verify Email] Email verified successfully for:', user.email)

    // Redirect to login with success message
    return NextResponse.redirect(
      new URL('/login?verified=true', process.env.NEXTAUTH_URL || '')
    )
  } catch (error) {
    console.error('[Verify Email] Error:', error)
    return NextResponse.redirect(
      new URL('/login?error=Erro interno', process.env.NEXTAUTH_URL || '')
    )
  }
}

/**
 * POST - Resend verification email
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Find user
    const { data: user } = await supabase
      .from('users')
      .select('id, name, email, email_verified, is_active')
      .eq('email', email)
      .single()

    if (!user || !user.is_active) {
      // Don't reveal if email exists
      return NextResponse.json({
        success: true,
        message: 'Se o email existir e não estiver verificado, você receberá um novo link.',
      })
    }

    if (user.email_verified) {
      return NextResponse.json({
        success: true,
        message: 'Este email já está verificado. Você pode fazer login.',
      })
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex')
    const verificationTokenHash = crypto.createHash('sha256').update(verificationToken).digest('hex')
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

    // Update token in database
    await supabase
      .from('users')
      .update({
        verification_token: verificationTokenHash,
        verification_token_expiry: verificationTokenExpiry,
      })
      .eq('id', user.id)

    // Send verification email
    const { emailService } = await import('@/lib/email/email-service')
    const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${verificationToken}`

    await emailService.sendVerificationEmail({
      to: user.email,
      name: user.name,
      verificationUrl,
      userId: user.id,
    })

    console.log('[Verify Email] Resent verification email to:', email)

    return NextResponse.json({
      success: true,
      message: 'Email de verificação reenviado! Confira sua caixa de entrada.',
    })
  } catch (error) {
    console.error('[Verify Email] Resend error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
