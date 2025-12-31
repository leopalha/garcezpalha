import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { emailService } from '@/lib/email/email-service'
import { withRateLimit } from '@/lib/rate-limit'
import crypto from 'crypto'

async function handler(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Check if user exists
    const { data: user } = await supabase
      .from('users')
      .select('id, name, email, is_active')
      .eq('email', email)
      .single()

    // Don't reveal if email exists for security
    if (!user || !user.is_active) {
      return NextResponse.json({
        success: true,
        message: 'Se o email existir, você receberá instruções para redefinir sua senha.',
      })
    }

    // Generate reset token (valid for 1 hour)
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000).toISOString() // 1 hour

    // Store token in database
    const { error: updateError } = await supabase
      .from('users')
      .update({
        reset_token: resetTokenHash,
        reset_token_expiry: resetTokenExpiry,
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('Error storing reset token:', updateError)
      return NextResponse.json(
        { error: 'Erro ao processar solicitação' },
        { status: 500 }
      )
    }

    // Send password reset email
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`

    await emailService.sendPasswordResetEmail({
      to: user.email,
      name: user.name,
      resetUrl,
      userId: user.id,
    })

    console.log('[Forgot Password] Reset email sent to:', email)

    return NextResponse.json({
      success: true,
      message: 'Se o email existir, você receberá instruções para redefinir sua senha.',
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Apply rate limiting: 3 forgot password attempts per 15 minutes
export const POST = withRateLimit(handler, { type: 'auth', limit: 3 })
