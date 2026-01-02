import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z, ZodError } from 'zod'
import { logger } from '@/lib/logger'

export const dynamic = 'force-dynamic'

// ============================================================================
// GET /api/client/documents - List user's documents
// ============================================================================

const querySchema = z.object({
  caseId: z.string().uuid().optional(),
  status: z.enum(['pending', 'approved', 'rejected', 'under_review']).optional(),
  type: z.string().optional(),
  limit: z.coerce.number().int().positive().max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
})

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
      status: searchParams.get('status') || undefined,
      type: searchParams.get('type') || undefined,
      limit: searchParams.get('limit') || undefined,
      offset: searchParams.get('offset') || undefined,
    }

    const validatedQuery = querySchema.parse(queryParams)

    // Build query
    let query = supabase
      .from('case_documents')
      .select('*', { count: 'exact' })
      .eq('uploaded_by', user.id)
      .order('created_at', { ascending: false })
      .range(validatedQuery.offset, validatedQuery.offset + validatedQuery.limit - 1)

    // Apply filters
    if (validatedQuery.caseId) {
      query = query.eq('case_id', validatedQuery.caseId)
    }

    if (validatedQuery.status) {
      query = query.eq('status', validatedQuery.status)
    }

    if (validatedQuery.type) {
      query = query.eq('type', validatedQuery.type)
    }

    const { data, error, count } = await query

    if (error) {
      logger.error('[GET /api/client/documents] Supabase error:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar documentos' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      documents: data || [],
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

    logger.error('[GET /api/client/documents] Error:', err)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
