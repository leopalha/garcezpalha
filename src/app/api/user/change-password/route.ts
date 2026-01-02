import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { createLogger } from '@/lib/logger'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { formatZodErrors } from '@/lib/zod-helpers'
import bcrypt from 'bcryptjs'
import { logSecurityEvent } from '@/lib/audit/audit-logger'

const logger = createLogger('api:user:change-password')

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Senha atual obrigatória'),
  newPassword: z.string()
    .min(8, 'Nova senha deve ter no mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Nova senha deve conter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'Nova senha deve conter pelo menos uma letra minúscula')
    .regex(/[0-9]/, 'Nova senha deve conter pelo menos um número')
    .regex(/[^A-Za-z0-9]/, 'Nova senha deve conter pelo menos um caractere especial'),
  confirmPassword: z.string().min(1, 'Confirmação de senha obrigatória')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword']
})

/**
 * POST /api/user/change-password
 * Change user password
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const supabase = await createClient()

    const body = await request.json()
    const validatedData = changePasswordSchema.parse(body)

    const ipAddress = request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    logger.info('Changing password', { userId: session.user.id })

    // Get current user with password
    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('id, email, password_hash')
      .eq('id', session.user.id)
      .single()

    if (userError || !user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    // Verify current password
    if (!user.password_hash) {
      return NextResponse.json({
        error: 'Senha não definida. Use recuperação de senha.'
      }, { status: 400 })
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      validatedData.currentPassword,
      user.password_hash
    )

    if (!isCurrentPasswordValid) {
      // Log failed attempt
      await logSecurityEvent({
        eventType: 'failed_login',
        severity: 'medium',
        description: 'Tentativa de alteração de senha com senha atual incorreta',
        userId: session.user.id,
        userEmail: user.email,
        ipAddress,
        userAgent
      })

      return NextResponse.json({
        error: 'Senha atual incorreta'
      }, { status: 401 })
    }

    // Check if new password is different from current
    const isSamePassword = await bcrypt.compare(
      validatedData.newPassword,
      user.password_hash
    )

    if (isSamePassword) {
      return NextResponse.json({
        error: 'A nova senha deve ser diferente da senha atual'
      }, { status: 400 })
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(validatedData.newPassword, 10)

    // Update password
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        password_hash: newPasswordHash,
        password_changed_at: new Date().toISOString()
      })
      .eq('id', session.user.id)

    if (updateError) {
      logger.error('Error updating password', updateError)
      throw updateError
    }

    // Log successful password change
    await logSecurityEvent({
      eventType: 'suspicious_activity',
      severity: 'low',
      description: 'Senha alterada com sucesso',
      userId: session.user.id,
      userEmail: user.email,
      ipAddress,
      userAgent,
      metadata: {
        action: 'password_changed'
      }
    })

    logger.info('Password changed successfully', { userId: session.user.id })

    return NextResponse.json({
      success: true,
      message: 'Senha alterada com sucesso'
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Dados inválidos',
        details: formatZodErrors(error),
      }, { status: 400 })
    }

    logger.error('Error changing password', error)
    return NextResponse.json({
      error: 'Erro ao alterar senha'
    }, { status: 500 })
  }
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
