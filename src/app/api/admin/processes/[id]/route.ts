import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { createLogger } from '@/lib/logger'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { formatZodErrors } from '@/lib/zod-helpers'

const logger = createLogger('api:admin:processes:id')

const updateProcessSchema = z.object({
  service_type: z.string().optional(),
  status: z.enum(['aguardando_documentos', 'em_analise', 'em_andamento', 'concluido', 'cancelado']).optional(),
  description: z.string().optional(),
  case_number: z.string().optional(),
  court: z.string().optional(),
  value: z.number().optional(),
  current_phase: z.string().optional(),
  progress: z.number().min(0).max(100).optional(),
  next_step: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
})

/**
 * GET /api/admin/processes/[id]
 * Get a single process by ID (admin/lawyer only)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Auth check
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      logger.warn('Unauthorized access attempt')
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const processId = params.id

    logger.info('Fetching process', {
      userId: session.user.id,
      processId
    })

    const supabase = await createClient()

    // Get process with related data
    const { data: process, error } = await supabase
      .from('cases')
      .select(`
        *,
        client:profiles!cases_client_id_fkey(id, full_name, email, phone, avatar_url),
        lawyer:profiles!cases_lawyer_id_fkey(id, full_name, email, avatar_url)
      `)
      .eq('id', processId)
      .single()

    if (error || !process) {
      logger.warn('Process not found', { processId })
      return NextResponse.json(
        { error: 'Processo não encontrado' },
        { status: 404 }
      )
    }

    // Check permission (admin can see all, lawyers only their own)
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (profile?.role === 'lawyer' && process.lawyer_id !== session.user.id) {
      logger.warn('Lawyer tried to access another lawyer\'s process', {
        userId: session.user.id,
        processId
      })
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    logger.info('Process retrieved successfully', {
      userId: session.user.id,
      processId
    })

    return NextResponse.json(process)

  } catch (error) {
    logger.error('Error in process GET', error)
    return NextResponse.json(
      { error: 'Erro ao carregar processo' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/admin/processes/[id]
 * Update a process (admin/assigned lawyer only)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Auth check
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      logger.warn('Unauthorized update attempt')
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const processId = params.id

    // Parse and validate request body
    const body = await request.json()
    const validatedData = updateProcessSchema.parse(body)

    logger.info('Updating process', {
      userId: session.user.id,
      processId,
      updates: Object.keys(validatedData)
    })

    const supabase = await createClient()

    // Check if process exists and user has permission
    const { data: existingProcess } = await supabase
      .from('cases')
      .select('lawyer_id')
      .eq('id', processId)
      .single()

    if (!existingProcess) {
      return NextResponse.json(
        { error: 'Processo não encontrado' },
        { status: 404 }
      )
    }

    // Check permission
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (profile?.role === 'lawyer' && existingProcess.lawyer_id !== session.user.id) {
      logger.warn('Lawyer tried to update another lawyer\'s process', {
        userId: session.user.id,
        processId
      })
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    // Update process
    const { data: process, error } = await supabase
      .from('cases')
      .update(validatedData)
      .eq('id', processId)
      .select()
      .single()

    if (error) {
      logger.error('Error updating process', error)
      throw new Error('Failed to update process')
    }

    logger.info('Process updated successfully', {
      userId: session.user.id,
      processId
    })

    return NextResponse.json(process)

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

    logger.error('Error in process PATCH', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar processo' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/processes/[id]
 * Delete a process (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Auth check
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      logger.warn('Unauthorized delete attempt')
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const processId = params.id

    const supabase = await createClient()

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (profile?.role !== 'admin') {
      logger.warn('Non-admin tried to delete process', {
        userId: session.user.id,
        role: profile?.role
      })
      return NextResponse.json(
        { error: 'Apenas administradores podem excluir processos' },
        { status: 403 }
      )
    }

    logger.info('Deleting process', {
      userId: session.user.id,
      processId
    })

    // Delete process (cascade will delete related records)
    const { error } = await supabase
      .from('cases')
      .delete()
      .eq('id', processId)

    if (error) {
      logger.error('Error deleting process', error)
      throw new Error('Failed to delete process')
    }

    logger.info('Process deleted successfully', {
      userId: session.user.id,
      processId
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    logger.error('Error in process DELETE', error)
    return NextResponse.json(
      { error: 'Erro ao excluir processo' },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
