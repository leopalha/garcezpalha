import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { createLogger } from '@/lib/logger'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { formatZodErrors } from '@/lib/zod-helpers'

const logger = createLogger('api:admin:processes')

const createProcessSchema = z.object({
  client_id: z.string().uuid(),
  service_type: z.string().min(1),
  description: z.string().optional(),
  case_number: z.string().optional(),
  court: z.string().optional(),
  value: z.number().optional(),
  current_phase: z.string().optional(),
  next_step: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
})

/**
 * GET /api/admin/processes
 * List all processes (admin only)
 */
export async function GET(request: NextRequest) {
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

    // Check if user is admin or lawyer
    const supabase = await createClient()
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!profile || !['admin', 'lawyer'].includes(profile.role)) {
      logger.warn('Non-admin user tried to access admin API', {
        userId: session.user.id,
        role: profile?.role
      })
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    // Query params
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const clientId = searchParams.get('client_id')
    const lawyerId = searchParams.get('lawyer_id')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    logger.info('Fetching processes', {
      userId: session.user.id,
      status,
      clientId,
      limit,
      offset
    })

    // Build query
    let query = supabase
      .from('cases')
      .select(`
        *,
        client:profiles!cases_client_id_fkey(id, full_name, email),
        lawyer:profiles!cases_lawyer_id_fkey(id, full_name)
      `, { count: 'exact' })
      .order('updated_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status) {
      query = query.eq('status', status)
    }

    if (clientId) {
      query = query.eq('client_id', clientId)
    }

    if (lawyerId) {
      query = query.eq('lawyer_id', lawyerId)
    } else if (profile.role === 'lawyer') {
      // Lawyers only see their own cases
      query = query.eq('lawyer_id', session.user.id)
    }

    const { data: processes, error, count } = await query

    if (error) {
      logger.error('Error fetching processes', error)
      throw new Error('Failed to fetch processes')
    }

    logger.info('Processes retrieved successfully', {
      userId: session.user.id,
      count: processes?.length || 0,
      total: count || 0
    })

    return NextResponse.json({
      processes: processes || [],
      total: count || 0,
      limit,
      offset,
    })

  } catch (error) {
    logger.error('Error in processes GET', error)
    return NextResponse.json(
      { error: 'Erro ao carregar processos' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/processes
 * Create a new process (admin/lawyer only)
 */
export async function POST(request: NextRequest) {
  try {
    // Auth check
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      logger.warn('Unauthorized process creation attempt')
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Check if user is admin or lawyer
    const supabase = await createClient()
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!profile || !['admin', 'lawyer'].includes(profile.role)) {
      logger.warn('Non-admin user tried to create process', {
        userId: session.user.id,
        role: profile?.role
      })
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validatedData = createProcessSchema.parse(body)

    logger.info('Creating new process', {
      userId: session.user.id,
      clientId: validatedData.client_id,
      serviceType: validatedData.service_type
    })

    // Create process
    const { data: process, error } = await supabase
      .from('cases')
      .insert({
        ...validatedData,
        lawyer_id: session.user.id, // Assign to current user
        status: 'aguardando_documentos',
        progress: 0,
      })
      .select()
      .single()

    if (error) {
      logger.error('Error creating process', error)
      throw new Error('Failed to create process')
    }

    logger.info('Process created successfully', {
      userId: session.user.id,
      processId: process.id
    })

    return NextResponse.json(process, { status: 201 })

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

    logger.error('Error in processes POST', error)
    return NextResponse.json(
      { error: 'Erro ao criar processo' },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
