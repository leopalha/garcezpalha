import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z, ZodError } from 'zod'
import { logger } from '@/lib/logger'

export const dynamic = 'force-dynamic'

// ============================================================================
// GET /api/admin/documents/review - List all documents for review
// ============================================================================

const querySchema = z.object({
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

    // Check admin role
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userError || !userData || !['admin', 'superadmin'].includes(userData.role)) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    // Parse query params
    const { searchParams } = new URL(request.url)
    const queryParams = {
      status: searchParams.get('status') || undefined,
      type: searchParams.get('type') || undefined,
      limit: searchParams.get('limit') || undefined,
      offset: searchParams.get('offset') || undefined,
    }

    const validatedQuery = querySchema.parse(queryParams)

    // Build query with relations
    let query = supabase
      .from('case_documents')
      .select(`
        *,
        uploader:uploaded_by (
          full_name,
          email
        ),
        case:case_id (
          case_number,
          service_type
        )
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(validatedQuery.offset, validatedQuery.offset + validatedQuery.limit - 1)

    // Apply filters
    if (validatedQuery.status) {
      query = query.eq('status', validatedQuery.status)
    }

    if (validatedQuery.type) {
      query = query.eq('type', validatedQuery.type)
    }

    const { data, error, count } = await query

    if (error) {
      logger.error('[GET /api/admin/documents/review] Supabase error:', error)
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

    logger.error('[GET /api/admin/documents/review] Error:', err)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
