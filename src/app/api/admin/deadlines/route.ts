import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { createLogger } from '@/lib/logger'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { formatZodErrors } from '@/lib/zod-helpers'

const logger = createLogger('api:admin:deadlines')

const createDeadlineSchema = z.object({
  title: z.string().min(3, 'Título muito curto').max(255),
  description: z.string().optional(),
  type: z.enum(['hearing', 'filing', 'payment', 'meeting', 'custom']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/, 'Data inválida (ISO 8601)'),
  due_time: z.string().regex(/^\d{2}:\d{2}/, 'Hora inválida (HH:MM)').optional(),
  reminder_date: z.string().optional(),
  case_id: z.string().uuid().optional(),
  assigned_to: z.string().uuid().optional(),
  is_recurring: z.boolean().default(false),
  recurrence_config: z.object({
    frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
    interval: z.number().min(1).default(1),
    endDate: z.string().optional()
  }).optional(),
})

/**
 * GET /api/admin/deadlines
 * List deadlines with filters
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const supabase = await createClient()

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!profile || !['admin', 'lawyer'].includes(profile.role)) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const caseId = searchParams.get('case_id')
    const assignedTo = searchParams.get('assigned_to')
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    logger.info('Fetching deadlines', { userId: session.user.id })

    // Build query
    let query = supabase
      .from('deadlines')
      .select(`
        *,
        case:cases(id, case_number, service_type),
        assigned:profiles!deadlines_assigned_to_fkey(id, full_name),
        creator:profiles!deadlines_created_by_fkey(id, full_name)
      `, { count: 'exact' })

    if (status) query = query.eq('status', status)
    if (priority) query = query.eq('priority', priority)
    if (caseId) query = query.eq('case_id', caseId)
    if (assignedTo) query = query.eq('assigned_to', assignedTo)
    if (startDate) query = query.gte('due_date', startDate)
    if (endDate) query = query.lte('due_date', endDate)

    // If lawyer, filter to their deadlines
    if (profile.role === 'lawyer') {
      query = query.or(`assigned_to.eq.${session.user.id},created_by.eq.${session.user.id}`)
    }

    const { data: deadlines, error: deadlinesError, count } = await query
      .order('due_date', { ascending: true })
      .range(offset, offset + limit - 1)

    if (deadlinesError) {
      throw new Error('Failed to fetch deadlines')
    }

    return NextResponse.json({
      deadlines: deadlines || [],
      pagination: {
        total: count || 0,
        limit,
        offset,
        hasMore: (count || 0) > offset + limit
      }
    })

  } catch (error) {
    logger.error('Error in deadlines GET', error)
    return NextResponse.json({ error: 'Erro ao carregar prazos' }, { status: 500 })
  }
}

/**
 * POST /api/admin/deadlines
 * Create a new deadline
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const supabase = await createClient()

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!profile || !['admin', 'lawyer'].includes(profile.role)) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = createDeadlineSchema.parse(body)

    logger.info('Creating deadline', { userId: session.user.id })

    // If case_id provided, verify access
    if (validatedData.case_id) {
      const { data: caseData } = await supabase
        .from('cases')
        .select('id, lawyer_id')
        .eq('id', validatedData.case_id)
        .single()

      if (!caseData) {
        return NextResponse.json({ error: 'Caso não encontrado' }, { status: 404 })
      }

      if (profile.role === 'lawyer' && caseData.lawyer_id !== session.user.id) {
        return NextResponse.json({ error: 'Acesso negado a este caso' }, { status: 403 })
      }
    }

    // Create deadline
    const { data: deadline, error: createError } = await supabase
      .from('deadlines')
      .insert({
        ...validatedData,
        created_by: session.user.id,
        assigned_to: validatedData.assigned_to || session.user.id
      })
      .select()
      .single()

    if (createError) {
      logger.error('Error creating deadline', { error: createError })
      throw new Error('Failed to create deadline')
    }

    logger.info('Deadline created successfully', { deadlineId: deadline.id })

    return NextResponse.json(deadline, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Dados inválidos',
        details: formatZodErrors(error),
      }, { status: 400 })
    }

    logger.error('Error in deadlines POST', error)
    return NextResponse.json({ error: 'Erro ao criar prazo' }, { status: 500 })
  }
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
