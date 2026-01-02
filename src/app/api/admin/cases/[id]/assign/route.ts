import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { createLogger } from '@/lib/logger'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { formatZodErrors } from '@/lib/zod-helpers'
import { createNotification } from '@/lib/notifications/client-notifications'

const logger = createLogger('api:admin:cases:assign')

const assignCaseSchema = z.object({
  lawyer_id: z.string().uuid('ID do advogado inválido'),
  reason: z.string().optional()
})

/**
 * POST /api/admin/cases/[id]/assign
 * Assign or reassign a case to a lawyer
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Auth check
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      logger.warn('Unauthorized assign attempt')
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const caseId = params.id

    const supabase = await createClient()

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (profile?.role !== 'admin') {
      logger.warn('Non-admin tried to assign case', {
        userId: session.user.id,
        role: profile?.role
      })
      return NextResponse.json(
        { error: 'Acesso negado. Apenas administradores podem atribuir casos.' },
        { status: 403 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validatedData = assignCaseSchema.parse(body)

    logger.info('Assigning case to lawyer', {
      userId: session.user.id,
      caseId,
      lawyerId: validatedData.lawyer_id
    })

    // Get current case data
    const { data: existingCase, error: caseError } = await supabase
      .from('cases')
      .select('lawyer_id, client_id, service_type')
      .eq('id', caseId)
      .single()

    if (caseError || !existingCase) {
      logger.warn('Case not found', { caseId })
      return NextResponse.json(
        { error: 'Caso não encontrado' },
        { status: 404 }
      )
    }

    // Verify target lawyer exists and is active
    const { data: targetLawyer, error: lawyerError } = await supabase
      .from('profiles')
      .select('id, full_name, status, role')
      .eq('id', validatedData.lawyer_id)
      .single()

    if (lawyerError || !targetLawyer) {
      logger.warn('Target lawyer not found', { lawyerId: validatedData.lawyer_id })
      return NextResponse.json(
        { error: 'Advogado não encontrado' },
        { status: 404 }
      )
    }

    if (!['admin', 'lawyer'].includes(targetLawyer.role)) {
      return NextResponse.json(
        { error: 'Usuário selecionado não é um advogado' },
        { status: 400 }
      )
    }

    if (targetLawyer.status !== 'active') {
      return NextResponse.json(
        { error: 'Advogado não está ativo no momento' },
        { status: 400 }
      )
    }

    // Check if lawyer already has this case
    if (existingCase.lawyer_id === validatedData.lawyer_id) {
      return NextResponse.json(
        { error: 'Este caso já está atribuído a este advogado' },
        { status: 400 }
      )
    }

    const fromLawyerId = existingCase.lawyer_id
    const isReassignment = fromLawyerId !== null

    // Update case with new lawyer
    const { error: updateError } = await supabase
      .from('cases')
      .update({
        lawyer_id: validatedData.lawyer_id,
        updated_at: new Date().toISOString()
      })
      .eq('id', caseId)

    if (updateError) {
      logger.error('Error updating case', { error: updateError, caseId })
      throw new Error('Failed to assign case')
    }

    // Record assignment in case_assignments table
    await supabase
      .from('case_assignments')
      .insert({
        case_id: caseId,
        from_lawyer_id: fromLawyerId,
        to_lawyer_id: validatedData.lawyer_id,
        assigned_by: session.user.id,
        reason: validatedData.reason || (isReassignment ? 'Reatribuição' : 'Atribuição inicial')
      })

    // Create notification for the new lawyer
    try {
      await createNotification({
        userId: validatedData.lawyer_id,
        type: 'case_update',
        title: isReassignment ? 'Novo caso atribuído a você' : 'Caso atribuído',
        description: `O caso "${existingCase.service_type}" foi ${isReassignment ? 'reatribuído' : 'atribuído'} a você.`,
        link: `/admin/processos/gestao/${caseId}`,
        sendEmail: true
      })
    } catch (notifError) {
      logger.error('Error creating notification for lawyer', notifError)
      // Don't fail the request
    }

    // Create notification for client if it's a reassignment
    if (isReassignment && existingCase.client_id) {
      try {
        await createNotification({
          userId: existingCase.client_id,
          type: 'case_update',
          title: 'Advogado do seu caso foi alterado',
          description: `Seu caso "${existingCase.service_type}" foi atribuído a ${targetLawyer.full_name}.`,
          link: `/cliente/casos/${caseId}`,
          sendEmail: true
        })
      } catch (notifError) {
        logger.error('Error creating notification for client', notifError)
      }
    }

    // Create timeline event
    try {
      await supabase
        .from('case_timeline')
        .insert({
          case_id: caseId,
          title: isReassignment ? 'Caso reatribuído' : 'Caso atribuído',
          description: `${isReassignment ? 'Reatribuído' : 'Atribuído'} para ${targetLawyer.full_name}${validatedData.reason ? `. Motivo: ${validatedData.reason}` : ''}`,
          event_type: 'assignment',
          created_by: session.user.id
        })
    } catch (timelineError) {
      logger.error('Error creating timeline event', timelineError)
      // Don't fail the request
    }

    logger.info('Case assigned successfully', {
      userId: session.user.id,
      caseId,
      lawyerId: validatedData.lawyer_id,
      isReassignment
    })

    return NextResponse.json({
      success: true,
      message: isReassignment
        ? 'Caso reatribuído com sucesso'
        : 'Caso atribuído com sucesso',
      lawyer: {
        id: targetLawyer.id,
        name: targetLawyer.full_name
      }
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Dados inválidos',
          details: formatZodErrors(error),
        },
        { status: 400 }
      )
    }

    logger.error('Error in case assign POST', error)
    return NextResponse.json(
      { error: 'Erro ao atribuir caso' },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
