import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { createLogger } from '@/lib/logger'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { formatZodErrors } from '@/lib/zod-helpers'

const logger = createLogger('api:compliance:data-deletion')

const createDeletionSchema = z.object({
  deletion_scope: z.enum(['complete', 'partial']).default('complete'),
  reason: z.string().optional()
})

/**
 * POST /api/compliance/data-deletion
 * Request data deletion (LGPD right to be forgotten)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const supabase = await createClient()

    const body = await request.json()
    const validatedData = createDeletionSchema.parse(body)

    const ipAddress = request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Get user email
    const { data: profile } = await supabase
      .from('profiles')
      .select('email, role')
      .eq('id', session.user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Perfil não encontrado' }, { status: 404 })
    }

    logger.info('Creating data deletion request', {
      userId: session.user.id,
      email: profile.email,
      scope: validatedData.deletion_scope
    })

    // Check if user has active cases
    const { data: activeCases } = await supabase
      .from('cases')
      .select('id, case_number, status')
      .eq('client_id', session.user.id)
      .in('status', ['pendente', 'em_andamento', 'aguardando_cliente'])

    const hasActiveCases = activeCases && activeCases.length > 0
    const requiresApproval = hasActiveCases || profile.role === 'lawyer' || profile.role === 'admin'

    // Check for legal hold reasons
    let legalHold = false
    let legalHoldReason = ''

    if (hasActiveCases) {
      legalHold = true
      legalHoldReason = `Usuário possui ${activeCases.length} caso(s) ativo(s). Dados não podem ser excluídos até conclusão dos casos.`
    }

    // Create deletion request
    const { data: deletionRequest, error: createError } = await supabase
      .from('data_deletion_requests')
      .insert({
        user_id: session.user.id,
        user_email: profile.email,
        deletion_scope: validatedData.deletion_scope,
        reason: validatedData.reason,
        status: legalHold ? 'rejected' : (requiresApproval ? 'pending' : 'approved'),
        approval_required: requiresApproval,
        legal_hold: legalHold,
        legal_hold_reason: legalHoldReason || null,
        rejection_reason: legalHold ? legalHoldReason : null,
        ip_address: ipAddress,
        user_agent: userAgent,
        // Auto-approve if no legal hold and no approval required
        approved_at: (!legalHold && !requiresApproval) ? new Date().toISOString() : null
      })
      .select()
      .single()

    if (createError) {
      logger.error('Error creating deletion request', createError)
      throw createError
    }

    // Log audit event
    await supabase.rpc('log_audit_event', {
      p_user_id: session.user.id,
      p_action: 'create',
      p_resource_type: 'data_deletion',
      p_resource_id: deletionRequest.id,
      p_new_values: deletionRequest,
      p_ip_address: ipAddress,
      p_user_agent: userAgent
    })

    // If auto-approved and no legal hold, execute deletion
    if (!legalHold && !requiresApproval) {
      try {
        await executeDeletion(deletionRequest.id, session.user.id, validatedData.deletion_scope)
      } catch (execError) {
        logger.error('Error executing deletion', execError)
      }
    }

    logger.info('Deletion request created', {
      requestId: deletionRequest.id,
      status: deletionRequest.status,
      requiresApproval,
      legalHold
    })

    return NextResponse.json({
      deletionRequest,
      message: legalHold
        ? 'Sua solicitação não pode ser processada devido a obrigações legais'
        : requiresApproval
          ? 'Sua solicitação será analisada por um administrador'
          : 'Sua solicitação foi aprovada e está sendo processada'
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Dados inválidos',
        details: formatZodErrors(error),
      }, { status: 400 })
    }

    logger.error('Error in data deletion', error)
    return NextResponse.json({ error: 'Erro ao solicitar exclusão de dados' }, { status: 500 })
  }
}

/**
 * GET /api/compliance/data-deletion
 * List user's deletion requests
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const supabase = await createClient()

    const { data: deletions, error } = await supabase
      .from('data_deletion_requests')
      .select('*')
      .eq('user_id', session.user.id)
      .order('requested_at', { ascending: false })
      .limit(50)

    if (error) throw error

    return NextResponse.json({ deletions: deletions || [] })

  } catch (error) {
    logger.error('Error fetching deletions', error)
    return NextResponse.json({ error: 'Erro ao buscar solicitações de exclusão' }, { status: 500 })
  }
}

/**
 * Execute data deletion
 * In production, this should be a background job with confirmation
 */
async function executeDeletion(
  deletionId: string,
  userId: string,
  scope: string
): Promise<void> {
  const supabase = await createClient()

  const itemsDeleted: any = {}
  const itemsAnonymized: any = {}

  try {
    if (scope === 'complete') {
      // Anonymize user data (keep for legal/accounting purposes)
      const { data: anonymizeResult } = await supabase.rpc('anonymize_user_data', {
        p_user_id: userId
      })

      itemsAnonymized.profile = anonymizeResult
      itemsAnonymized.cases = 'anonymized (kept for legal purposes)'

      // Delete optional data
      // Delete conversations (if not needed for legal purposes)
      await supabase
        .from('conversations')
        .delete()
        .eq('user_id', userId)

      itemsDeleted.conversations = 'deleted'

      // Delete notifications
      await supabase
        .from('notifications')
        .delete()
        .eq('user_id', userId)

      itemsDeleted.notifications = 'deleted'

      // Delete old audit logs (keep recent for compliance)
      await supabase
        .from('audit_logs')
        .delete()
        .eq('user_id', userId)
        .lt('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

      itemsDeleted.old_audit_logs = 'deleted (kept last 30 days)'

    } else if (scope === 'partial') {
      // Partial deletion - only non-essential data
      await supabase
        .from('notifications')
        .delete()
        .eq('user_id', userId)

      itemsDeleted.notifications = 'deleted'
    }

    // Update deletion request
    await supabase
      .from('data_deletion_requests')
      .update({
        status: 'completed',
        executed_at: new Date().toISOString(),
        items_deleted: itemsDeleted,
        items_anonymized: itemsAnonymized
      })
      .eq('id', deletionId)

    logger.info('Deletion executed successfully', { deletionId, scope })

  } catch (error) {
    logger.error('Error executing deletion', error)

    // Update status to error
    await supabase
      .from('data_deletion_requests')
      .update({ status: 'pending' })
      .eq('id', deletionId)

    throw error
  }
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
