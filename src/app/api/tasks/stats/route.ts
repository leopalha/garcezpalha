import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ZodError } from 'zod'
import { taskStatsQuerySchema } from '@/lib/validations/task-schemas'
import { logger } from '@/lib/logger'

export const dynamic = 'force-dynamic'

// ============================================================================
// GET /api/tasks/stats - Get task statistics
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    // Parse query params
    const { searchParams } = new URL(request.url)
    const queryParams = {
      caseId: searchParams.get('caseId') || undefined,
      assignedTo: searchParams.get('assignedTo') || undefined,
      dateFrom: searchParams.get('dateFrom') || undefined,
      dateTo: searchParams.get('dateTo') || undefined,
    }

    const validatedQuery = taskStatsQuerySchema.parse(queryParams)

    // Build base query
    let baseQuery = supabase.from('tasks').select('*', { count: 'exact', head: true })

    if (validatedQuery.caseId) {
      baseQuery = baseQuery.eq('case_id', validatedQuery.caseId)
    }

    if (validatedQuery.assignedTo) {
      baseQuery = baseQuery.eq('assigned_to', validatedQuery.assignedTo)
    }

    if (validatedQuery.dateFrom) {
      baseQuery = baseQuery.gte('created_at', validatedQuery.dateFrom)
    }

    if (validatedQuery.dateTo) {
      baseQuery = baseQuery.lte('created_at', validatedQuery.dateTo)
    }

    // Get counts by status
    const [totalResult, todoResult, inProgressResult, completedResult, blockedResult] = await Promise.all([
      baseQuery,
      supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('status', 'todo'),
      supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('status', 'in_progress'),
      supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
      supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('status', 'blocked'),
    ])

    // Get counts by priority
    const [lowResult, mediumResult, highResult, urgentResult] = await Promise.all([
      baseQuery.eq('priority', 'low'),
      baseQuery.eq('priority', 'medium'),
      baseQuery.eq('priority', 'high'),
      baseQuery.eq('priority', 'urgent'),
    ])

    // Get overdue tasks
    const now = new Date().toISOString()
    const { count: overdueCount } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .lt('due_date', now)
      .neq('status', 'completed')
      .neq('status', 'cancelled')

    // Get completion rate
    const completedCount = completedResult.count || 0
    const totalCount = totalResult.count || 0
    const completionRate = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

    return NextResponse.json({
      total: totalCount,
      byStatus: {
        todo: todoResult.count || 0,
        in_progress: inProgressResult.count || 0,
        completed: completedCount,
        blocked: blockedResult.count || 0,
      },
      byPriority: {
        low: lowResult.count || 0,
        medium: mediumResult.count || 0,
        high: highResult.count || 0,
        urgent: urgentResult.count || 0,
      },
      overdue: overdueCount || 0,
      completionRate: Math.round(completionRate),
    })
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: 'Parâmetros inválidos', details: err.format() },
        { status: 400 }
      )
    }

    logger.error('[GET /api/tasks/stats] Error:', err)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
