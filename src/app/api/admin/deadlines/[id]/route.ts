import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { createLogger } from '@/lib/logger'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { formatZodErrors } from '@/lib/zod-helpers'

const logger = createLogger('api:admin:deadlines:id')

const updateDeadlineSchema = z.object({
  title: z.string().min(3).max(255).optional(),
  description: z.string().optional(),
  type: z.enum(['hearing', 'filing', 'payment', 'meeting', 'custom']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/).optional(),
  status: z.enum(['pending', 'completed', 'overdue', 'cancelled']).optional(),
  assigned_to: z.string().uuid().optional(),
  completed_at: z.string().optional(),
  completion_notes: z.string().optional(),
})

/**
 * GET /api/admin/deadlines/[id]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const supabase = await createClient()
    const deadlineId = params.id

    const { data: deadline, error } = await supabase
      .from('deadlines')
      .select(`
        *,
        case:cases(id, case_number, service_type, status),
        assigned:profiles!deadlines_assigned_to_fkey(id, full_name, email),
        creator:profiles!deadlines_created_by_fkey(id, full_name),
        completed_by_user:profiles!deadlines_completed_by_fkey(id, full_name)
      `)
      .eq('id', deadlineId)
      .single()

    if (error || !deadline) {
      return NextResponse.json({ error: 'Prazo não encontrado' }, { status: 404 })
    }

    // Get history
    const { data: history } = await supabase
      .from('deadline_history')
      .select(`
        *,
        changed_by_user:profiles!deadline_history_changed_by_fkey(full_name)
      `)
      .eq('deadline_id', deadlineId)
      .order('created_at', { ascending: false })

    return NextResponse.json({
      ...deadline,
      history: history || []
    })

  } catch (error) {
    logger.error('Error in deadline GET', error)
    return NextResponse.json({ error: 'Erro ao carregar prazo' }, { status: 500 })
  }
}

/**
 * PATCH /api/admin/deadlines/[id]
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const supabase = await createClient()
    const deadlineId = params.id

    const body = await request.json()
    const validatedData = updateDeadlineSchema.parse(body)

    // Check access
    const { data: existingDeadline } = await supabase
      .from('deadlines')
      .select('id, assigned_to, created_by')
      .eq('id', deadlineId)
      .single()

    if (!existingDeadline) {
      return NextResponse.json({ error: 'Prazo não encontrado' }, { status: 404 })
    }

    // Update with completion tracking
    const updateData: any = { ...validatedData }

    if (validatedData.status === 'completed' && !validatedData.completed_at) {
      updateData.completed_at = new Date().toISOString()
      updateData.completed_by = session.user.id
    }

    const { data: deadline, error: updateError } = await supabase
      .from('deadlines')
      .update(updateData)
      .eq('id', deadlineId)
      .select()
      .single()

    if (updateError) {
      throw new Error('Failed to update deadline')
    }

    return NextResponse.json(deadline)

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Dados inválidos',
        details: formatZodErrors(error),
      }, { status: 400 })
    }

    logger.error('Error in deadline PATCH', error)
    return NextResponse.json({ error: 'Erro ao atualizar prazo' }, { status: 500 })
  }
}

/**
 * DELETE /api/admin/deadlines/[id]
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const supabase = await createClient()
    const deadlineId = params.id

    // Soft delete - mark as cancelled
    const { error } = await supabase
      .from('deadlines')
      .update({ status: 'cancelled' })
      .eq('id', deadlineId)

    if (error) {
      throw new Error('Failed to delete deadline')
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    logger.error('Error in deadline DELETE', error)
    return NextResponse.json({ error: 'Erro ao excluir prazo' }, { status: 500 })
  }
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
