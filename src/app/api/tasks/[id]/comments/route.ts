import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ZodError } from 'zod'
import { createTaskCommentSchema, taskParamsSchema } from '@/lib/validations/task-schemas'
import { logger } from '@/lib/logger'

export const dynamic = 'force-dynamic'

// ============================================================================
// GET /api/tasks/[id]/comments - List task comments
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

    // Get comments
    const { data, error } = await supabase
      .from('task_comments')
      .select(`
        *,
        user:user_id (
          id,
          full_name,
          email,
          avatar_url
        )
      `)
      .eq('task_id', validatedParams.id)
      .order('created_at', { ascending: true })

    if (error) {
      logger.error('[GET /api/tasks/[id]/comments] Error:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar comentários' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      comments: data || [],
      total: data?.length || 0,
    })
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: 'ID inválido', details: err.format() },
        { status: 400 }
      )
    }

    logger.error('[GET /api/tasks/[id]/comments] Error:', err)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// ============================================================================
// POST /api/tasks/[id]/comments - Create comment
// ============================================================================

export async function POST(
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
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .select('id')
      .eq('id', validatedParams.id)
      .single()

    if (taskError || !task) {
      return NextResponse.json(
        { error: 'Tarefa não encontrada' },
        { status: 404 }
      )
    }

    // Parse body
    const body = await request.json()
    const validatedData = createTaskCommentSchema.parse({
      ...body,
      taskId: validatedParams.id,
    })

    // Create comment
    const { data: comment, error: createError } = await supabase
      .from('task_comments')
      .insert({
        task_id: validatedData.taskId,
        user_id: user.id,
        content: validatedData.content,
      })
      .select(`
        *,
        user:user_id (
          id,
          full_name,
          email,
          avatar_url
        )
      `)
      .single()

    if (createError) {
      logger.error('[POST /api/tasks/[id]/comments] Create error:', createError)
      return NextResponse.json(
        { error: 'Erro ao criar comentário' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      comment,
      message: 'Comentário adicionado com sucesso',
    }, { status: 201 })
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: err.format() },
        { status: 400 }
      )
    }

    logger.error('[POST /api/tasks/[id]/comments] Error:', err)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
