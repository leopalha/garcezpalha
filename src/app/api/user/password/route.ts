import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { logger } from '@/lib/logger'

export const dynamic = 'force-dynamic'

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
  newPassword: z.string().min(8, 'Nova senha deve ter pelo menos 8 caracteres'),
})

/**
 * POST /api/user/password
 * Change user password
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Auth check
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    // Parse and validate body
    const body = await request.json()
    const validatedData = changePasswordSchema.parse(body)

    // Verify current password by attempting to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: validatedData.currentPassword,
    })

    if (signInError) {
      return NextResponse.json({ error: 'Senha atual incorreta' }, { status: 400 })
    }

    // Update password
    const { error: updateError } = await supabase.auth.updateUser({
      password: validatedData.newPassword,
    })

    if (updateError) {
      logger.error('[POST /api/user/password] Update error:', updateError)
      return NextResponse.json({ error: 'Erro ao alterar senha' }, { status: 500 })
    }

    // Update last password change in user metadata
    await supabase.auth.updateUser({
      data: {
        last_password_change: new Date().toISOString(),
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Senha alterada com sucesso',
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: err.format() },
        { status: 400 }
      )
    }

    logger.error('[POST /api/user/password] Error:', err)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
