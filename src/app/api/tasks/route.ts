import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ZodError } from 'zod'
import { createTaskSchema, listTasksQuerySchema } from '@/lib/validations/task-schemas'
import { logger } from '@/lib/logger'

export const dynamic = 'force-dynamic'

// ============================================================================
// GET /api/tasks - List tasks with filters
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

    // Parse and validate query params
    const { searchParams } = new URL(request.url)
    const queryParams = {
      caseId: searchParams.get('caseId') || undefined,
      assignedTo: searchParams.get('assignedTo') || undefined,
      createdBy: searchParams.get('createdBy') || undefined,
      status: searchParams.get('status') || undefined,
      priority: searchParams.get('priority') || undefined,
      parentTaskId: searchParams.get('parentTaskId') || undefined,
      includeSubtasks: searchParams.get('includeSubtasks') || undefined,
      tags: searchParams.get('tags') || undefined,
      dueBefore: searchParams.get('dueBefore') || undefined,
      dueAfter: searchParams.get('dueAfter') || undefined,
      search: searchParams.get('search') || undefined,
      sortBy: searchParams.get('sortBy') || undefined,
      sortOrder: searchParams.get('sortOrder') || undefined,
      limit: searchParams.get('limit') || undefined,
      offset: searchParams.get('offset') || undefined,
    }

    const validatedQuery = listTasksQuerySchema.parse(queryParams)

    // Build query
    let query = supabase
      .from('tasks')
      .select(`
        *,
        assigned_user:assigned_to (
          id,
          full_name,
          email
        ),
        creator:created_by (
          id,
          full_name,
          email
        ),
        case:case_id (
          id,
          case_number,
          service_type
        ),
        subtasks:tasks!parent_task_id (
          id,
          title,
          status,
          priority
        )
      `, { count: 'exact' })

    // Apply filters
    if (validatedQuery.caseId) {
      query = query.eq('case_id', validatedQuery.caseId)
    }

    if (validatedQuery.assignedTo) {
      query = query.eq('assigned_to', validatedQuery.assignedTo)
    }

    if (validatedQuery.createdBy) {
      query = query.eq('created_by', validatedQuery.createdBy)
    }

    if (validatedQuery.status) {
      query = query.eq('status', validatedQuery.status)
    }

    if (validatedQuery.priority) {
      query = query.eq('priority', validatedQuery.priority)
    }

    if (validatedQuery.parentTaskId) {
      query = query.eq('parent_task_id', validatedQuery.parentTaskId)
    } else if (!validatedQuery.includeSubtasks) {
      // Only top-level tasks
      query = query.is('parent_task_id', null)
    }

    if (validatedQuery.tags) {
      const tagsArray = validatedQuery.tags.split(',')
      query = query.contains('tags', tagsArray)
    }

    if (validatedQuery.dueBefore) {
      query = query.lte('due_date', validatedQuery.dueBefore)
    }

    if (validatedQuery.dueAfter) {
      query = query.gte('due_date', validatedQuery.dueAfter)
    }

    if (validatedQuery.search) {
      query = query.or(`title.ilike.%${validatedQuery.search}%,description.ilike.%${validatedQuery.search}%`)
    }

    // Sorting
    query = query.order(validatedQuery.sortBy, { ascending: validatedQuery.sortOrder === 'asc' })

    // Pagination
    query = query.range(validatedQuery.offset, validatedQuery.offset + validatedQuery.limit - 1)

    const { data, error, count } = await query

    if (error) {
      logger.error('[GET /api/tasks] Supabase error:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar tarefas' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      tasks: data || [],
      total: count || 0,
      limit: validatedQuery.limit,
      offset: validatedQuery.offset,
    })
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: 'Parâmetros inválidos', details: err.format() },
        { status: 400 }
      )
    }

    logger.error('[GET /api/tasks] Error:', err)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// ============================================================================
// POST /api/tasks - Create task
// ============================================================================

export async function POST(request: NextRequest) {
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

    // Parse and validate body
    const body = await request.json()
    const validatedData = createTaskSchema.parse(body)

    // Verify case access if caseId provided
    if (validatedData.caseId) {
      const { data: caseData, error: caseError } = await supabase
        .from('cases')
        .select('id')
        .eq('id', validatedData.caseId)
        .single()

      if (caseError || !caseData) {
        return NextResponse.json(
          { error: 'Caso não encontrado' },
          { status: 404 }
        )
      }
    }

    // Verify parent task if parentTaskId provided
    if (validatedData.parentTaskId) {
      const { data: parentTask, error: parentError } = await supabase
        .from('tasks')
        .select('id')
        .eq('id', validatedData.parentTaskId)
        .single()

      if (parentError || !parentTask) {
        return NextResponse.json(
          { error: 'Tarefa pai não encontrada' },
          { status: 404 }
        )
      }
    }

    // Create task
    const { data: task, error: createError } = await supabase
      .from('tasks')
      .insert({
        title: validatedData.title,
        description: validatedData.description || null,
        status: validatedData.status,
        priority: validatedData.priority,
        case_id: validatedData.caseId || null,
        parent_task_id: validatedData.parentTaskId || null,
        assigned_to: validatedData.assignedTo || null,
        created_by: user.id,
        due_date: validatedData.dueDate || null,
        tags: validatedData.tags || null,
        estimated_hours: validatedData.estimatedHours || null,
      })
      .select(`
        *,
        assigned_user:assigned_to (
          id,
          full_name,
          email
        ),
        creator:created_by (
          id,
          full_name,
          email
        ),
        case:case_id (
          id,
          case_number,
          service_type
        )
      `)
      .single()

    if (createError) {
      logger.error('[POST /api/tasks] Create error:', createError)
      return NextResponse.json(
        { error: 'Erro ao criar tarefa' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      task,
      message: 'Tarefa criada com sucesso',
    }, { status: 201 })
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: err.format() },
        { status: 400 }
      )
    }

    logger.error('[POST /api/tasks] Error:', err)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
