import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { withRateLimit } from '@/lib/rate-limit'
import { withValidation } from '@/lib/validations/api-middleware'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token é obrigatório'),
  password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
})

async function handler(request: NextRequest) {
  try {
    const { token, password } = (request as any).validatedData

    // Hash the token to compare with database
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex')

    const supabase = await createClient()

    // Find user with valid token
    const { data: user } = await supabase
      .from('users')
      .select('id, email, reset_token, reset_token_expiry')
      .eq('reset_token', tokenHash)
      .single()

    if (!user) {
      return NextResponse.json(
        { error: 'Token inválido ou expirado' },
        { status: 400 }
      )
    }

    // Check if token is expired
    if (!user.reset_token_expiry || new Date(user.reset_token_expiry) < new Date()) {
      return NextResponse.json(
        { error: 'Token expirado. Solicite um novo reset de senha.' },
        { status: 400 }
      )
    }

    // Hash new password
    const password_hash = await bcrypt.hash(password, 10)

    // Update password and clear reset token
    const { error: updateError } = await supabase
      .from('users')
      .update({
        password_hash,
        reset_token: null,
        reset_token_expiry: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('Error updating password:', updateError)
      return NextResponse.json(
        { error: 'Erro ao atualizar senha' },
        { status: 500 }
      )
    }

    console.log('Password successfully reset for:', user.email)

    return NextResponse.json({
      success: true,
      message: 'Senha redefinida com sucesso! Você já pode fazer login.',
    })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Apply validation and rate limiting: 5 reset password attempts per 15 minutes
export const POST = withRateLimit(
  withValidation(resetPasswordSchema, handler, { sanitize: true }),
  { type: 'auth', limit: 5 }
)
