import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { withRateLimit } from '@/lib/rate-limit'
import { withValidation } from '@/lib/validations/api-middleware'
import { z } from 'zod'
import crypto from 'crypto'
import { createLogger } from '@/lib/logger'

const logger = createLogger('api:auth:verify-email')

const resendVerificationSchema = z.object({
  email: z.string().email('Email inválido').toLowerCase(),
})

/**
 * GET - Verify email with token from URL
 */
async function getHandler(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    logger.info('Email verification request received')

    if (!token) {
      logger.warn('Email verification failed - no token provided')
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
      logger.warn('Email verification failed - token not found or invalid')
      return NextResponse.redirect(
        new URL('/login?error=Token inválido ou expirado', process.env.NEXTAUTH_URL || '')
      )
    }

    // Check if token is expired
    if (user.verification_token_expiry) {
      const expiry = new Date(user.verification_token_expiry)
      if (expiry < new Date()) {
        logger.warn('Email verification failed - token expired', { email: user.email })
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
      logger.error('Email verification failed - database update error', updateError, { userId: user.id })
      return NextResponse.redirect(
        new URL('/login?error=Erro ao verificar email', process.env.NEXTAUTH_URL || '')
      )
    }

    logger.info('Email verified successfully', { userId: user.id, email: user.email, status: 200 })

    // Redirect to login with success message
    return NextResponse.redirect(
      new URL('/login?verified=true', process.env.NEXTAUTH_URL || '')
    )
  } catch (error) {
    logger.error('Email verification request failed', error)
    return NextResponse.redirect(
      new URL('/login?error=Erro interno', process.env.NEXTAUTH_URL || '')
    )
  }
}

/**
 * POST - Resend verification email
 */
async function postHandler(request: NextRequest) {
  try {
    const { email } = (request as any).validatedData

    logger.info('Resend verification email request', { email })

    const supabase = await createClient()

    // Find user
    const { data: user } = await supabase
      .from('users')
      .select('id, name, email, email_verified, is_active')
      .eq('email', email)
      .single()

    if (!user || !user.is_active) {
      // Don't reveal if email exists
      logger.warn('Resend verification requested for inactive or non-existent user', { email })
      return NextResponse.json({
        success: true,
        message: 'Se o email existir e não estiver verificado, você receberá um novo link.',
      })
    }

    if (user.email_verified) {
      logger.warn('Resend verification requested for already verified email', { email, userId: user.id })
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

    logger.info('Verification email resent successfully', { userId: user.id, email, status: 200 })

    return NextResponse.json({
      success: true,
      message: 'Email de verificação reenviado! Confira sua caixa de entrada.',
    })
  } catch (error) {
    logger.error('Resend verification email failed', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Apply rate limiting to both endpoints
export const GET = withRateLimit(getHandler, { type: 'auth', limit: 10 })
export const POST = withRateLimit(
  withValidation(resendVerificationSchema, postHandler, { sanitize: true }),
  { type: 'auth', limit: 3 }
)
