import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ZodError } from 'zod'
import { updateTaskSchema, taskParamsSchema } from '@/lib/validations/task-schemas'
import { logger } from '@/lib/logger'

export const dynamic = 'force-dynamic'

// ============================================================================
// GET /api/tasks/[id] - Get single task
// ============================================================================

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Validate params
    const validatedParams = taskParamsSchema.parse(params)

    // Get task with all relations
    const { data: task, error } = await supabase
      .from('tasks')
      .select(`
        *,
        assigned_user:assigned_to (
          id,
          full_name,
          email,
          avatar_url
        ),
        creator:created_by (
          id,
          full_name,
          email,
          avatar_url
        ),
        case:case_id (
          id,
          case_number,
          service_type,
          status
        ),
        parent_task:parent_task_id (
          id,
          title,
          status
        ),
        subtasks:tasks!parent_task_id (
          id,
          title,
          status,
          priority,
          assigned_to,
          due_date
        ),
        comments:task_comments (
          id,
          content,
          created_at,
          user:user_id (
            id,
            full_name,
            avatar_url
          )
        ),
        attachments:task_attachments (
          id,
          file_name,
          file_url,
          file_size,
          mime_type,
          created_at
        )
      `)
      .eq('id', validatedParams.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Tarefa não encontrada' },
          { status: 404 }
        )
      }
      logger.error('[GET /api/tasks/[id]] Supabase error:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar tarefa' },
        { status: 500 }
      )
    }

    return NextResponse.json({ task })
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: 'ID inválido', details: err.format() },
        { status: 400 }
      )
    }

    logger.error('[GET /api/tasks/[id]] Error:', err)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// ============================================================================
// PATCH /api/tasks/[id] - Update task
// ============================================================================

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Validate params and body
    const validatedParams = taskParamsSchema.parse(params)
    const body = await request.json()
    const validatedData = updateTaskSchema.parse(body)

    // Verify task exists and user has permission
    const { data: existingTask, error: fetchError } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', validatedParams.id)
      .single()

    if (fetchError || !existingTask) {
      return NextResponse.json(
        { error: 'Tarefa não encontrada' },
        { status: 404 }
      )
    }

    // Build update object
    const updates: any = {}

    if (validatedData.title !== undefined) updates.title = validatedData.title
    if (validatedData.description !== undefined) updates.description = validatedData.description
    if (validatedData.status !== undefined) updates.status = validatedData.status
    if (validatedData.priority !== undefined) updates.priority = validatedData.priority
    if (validatedData.caseId !== undefined) updates.case_id = validatedData.caseId
    if (validatedData.assignedTo !== undefined) updates.assigned_to = validatedData.assignedTo
    if (validatedData.dueDate !== undefined) updates.due_date = validatedData.dueDate
    if (validatedData.tags !== undefined) updates.tags = validatedData.tags
    if (validatedData.estimatedHours !== undefined) updates.estimated_hours = validatedData.estimatedHours
    if (validatedData.actualHours !== undefined) updates.actual_hours = validatedData.actualHours

    // Update task
    const { data: updatedTask, error: updateError } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', validatedParams.id)
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

    if (updateError) {
      logger.error('[PATCH /api/tasks/[id]] Update error:', updateError)
      return NextResponse.json(
        { error: 'Erro ao atualizar tarefa' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      task: updatedTask,
      message: 'Tarefa atualizada com sucesso',
    })
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: err.format() },
        { status: 400 }
      )
    }

    logger.error('[PATCH /api/tasks/[id]] Error:', err)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// ============================================================================
// DELETE /api/tasks/[id] - Delete task
// ============================================================================

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Validate params
    const validatedParams = taskParamsSchema.parse(params)

    // Verify task exists
    const { data: task, error: fetchError } = await supabase
      .from('tasks')
      .select('id, created_by')
      .eq('id', validatedParams.id)
      .single()

    if (fetchError || !task) {
      return NextResponse.json(
        { error: 'Tarefa não encontrada' },
        { status: 404 }
      )
    }

    // Delete task (will cascade to subtasks, comments, attachments)
    const { error: deleteError } = await supabase
      .from('tasks')
      .delete()
      .eq('id', validatedParams.id)

    if (deleteError) {
      logger.error('[DELETE /api/tasks/[id]] Delete error:', deleteError)
      return NextResponse.json(
        { error: 'Erro ao deletar tarefa' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Tarefa deletada com sucesso',
    })
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: 'ID inválido', details: err.format() },
        { status: 400 }
      )
    }

    logger.error('[DELETE /api/tasks/[id]] Error:', err)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
