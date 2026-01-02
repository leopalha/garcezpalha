import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { createLogger } from '@/lib/logger'
import { ZodError } from 'zod'
import { formatZodErrors } from '@/lib/zod-helpers'
import { clientCasesQuerySchema } from '@/lib/validations/client-schemas'
import { createClient } from '@/lib/supabase/server'

const logger = createLogger('api:client:cases')

/**
 * GET /api/client/cases
 * Get all cases for the authenticated client
 * Query params: status, search, limit, offset
 */
export async function GET(request: NextRequest) {
  try {
    // Auth check
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      logger.warn('Unauthorized cases access attempt')
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // Parse query params
    const searchParams = request.nextUrl.searchParams
    const query = clientCasesQuerySchema.parse({
      status: searchParams.get('status') || undefined,
      search: searchParams.get('search') || undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0,
    })

    logger.info('Fetching cases', { userId, query })

    const supabase = await createClient()

    // Build query
    let dbQuery = supabase
      .from('cases')
      .select('*, lawyer:profiles!cases_lawyer_id_fkey(id, full_name, avatar_url)', { count: 'exact' })
      .eq('client_id', userId)
      .order('updated_at', { ascending: false })

    // Apply filters
    if (query.status) {
      dbQuery = dbQuery.eq('status', query.status)
    }

    if (query.search) {
      dbQuery = dbQuery.or(`service_type.ilike.%${query.search}%`)
    }

    // Apply pagination
    dbQuery = dbQuery.range(query.offset, query.offset + query.limit - 1)

    const { data: cases, error: casesError, count } = await dbQuery

    if (casesError) {
      logger.error('Error fetching cases', casesError)
      throw new Error('Failed to fetch cases')
    }

    // Format response
    const formattedCases = (cases || []).map(c => ({
      id: c.id,
      serviceType: c.service_type,
      status: c.status,
      lawyer: {
        name: (c.lawyer as any)?.full_name || 'Advogado não atribuído',
        photo: (c.lawyer as any)?.avatar_url || null,
        oab: c.metadata?.oab || 'N/A',
      },
      createdAt: c.created_at,
      updatedAt: c.updated_at,
      currentPhase: c.current_phase,
      progress: c.progress,
      nextStep: c.next_step,
    }))

    logger.info('Cases retrieved successfully', {
      userId,
      total: count,
      returned: formattedCases.length,
    })

    return NextResponse.json({
      cases: formattedCases,
      pagination: {
        total: count || 0,
        limit: query.limit,
        offset: query.offset,
        hasMore: (query.offset + query.limit) < (count || 0),
      },
    })

  } catch (error) {
    if (error instanceof ZodError) {
      logger.warn('Validation error', { errors: formatZodErrors(error) })
      return NextResponse.json(
        {
          error: 'Parâmetros inválidos',
          details: formatZodErrors(error),
        },
        { status: 400 }
      )
    }

    logger.error('Error fetching cases', error)
    return NextResponse.json(
      { error: 'Erro ao carregar casos' },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
