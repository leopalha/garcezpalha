import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import crypto from 'crypto'

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

    // TODO: Send email with reset link
    // For now, we'll just return the token (in production, this should be sent via email)
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`
    
    console.log('Password reset requested for:', email)
    console.log('Reset URL:', resetUrl)
    console.log('⚠️  In production, this should be sent via email using Resend')

    return NextResponse.json({
      success: true,
      message: 'Se o email existir, você receberá instruções para redefinir sua senha.',
      // TODO: Remove this in production - only for development
      ...(process.env.NODE_ENV === 'development' && {
        resetUrl,
        token: resetToken,
      }),
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
