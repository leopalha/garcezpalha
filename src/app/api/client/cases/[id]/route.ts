import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { createLogger } from '@/lib/logger'
import { ZodError } from 'zod'
import { formatZodErrors } from '@/lib/zod-helpers'
import { clientCaseParamsSchema } from '@/lib/validations/client-schemas'
import { createClient } from '@/lib/supabase/server'

const logger = createLogger('api:client:cases:detail')

/**
 * GET /api/client/cases/[id]
 * Get detailed information about a specific case
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Auth check
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      logger.warn('Unauthorized case detail access attempt')
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // Validate params
    const { id: caseId } = clientCaseParamsSchema.parse(params)

    logger.info('Fetching case details', { userId, caseId })

    const supabase = await createClient()

    // Fetch case with lawyer info
    const { data: caseData, error: caseError } = await supabase
      .from('cases')
      .select('*, lawyer:profiles!cases_lawyer_id_fkey(id, full_name, avatar_url, email, phone)')
      .eq('id', caseId)
      .eq('client_id', userId)
      .single()

    if (caseError || !caseData) {
      logger.warn('Case not found', { caseId, userId })
      return NextResponse.json(
        { error: 'Caso não encontrado' },
        { status: 404 }
      )
    }

    // Fetch timeline events
    const { data: timeline, error: timelineError } = await supabase
      .from('case_timeline')
      .select('*')
      .eq('case_id', caseId)
      .order('created_at', { ascending: false })

    if (timelineError) {
      logger.error('Error fetching timeline', timelineError)
    }

    // Fetch documents
    const { data: documents, error: docsError } = await supabase
      .from('case_documents')
      .select('*')
      .eq('case_id', caseId)
      .order('uploaded_at', { ascending: false })

    if (docsError) {
      logger.error('Error fetching documents', docsError)
    }

    // Format response
    const lawyer = caseData.lawyer as any
    const response = {
      id: caseData.id,
      serviceType: caseData.service_type,
      status: caseData.status,
      lawyer: {
        id: lawyer?.id || null,
        name: lawyer?.full_name || 'Advogado não atribuído',
        photo: lawyer?.avatar_url || null,
        oab: caseData.metadata?.oab || 'N/A',
        email: lawyer?.email || null,
        phone: lawyer?.phone || null,
      },
      createdAt: caseData.created_at,
      updatedAt: caseData.updated_at,
      currentPhase: caseData.current_phase,
      progress: caseData.progress,
      nextStep: caseData.next_step,
      description: caseData.description,
      timeline: (timeline || []).map(t => ({
        id: t.id,
        date: t.created_at,
        title: t.title,
        description: t.description,
        type: t.type,
      })),
      documents: (documents || []).map(d => ({
        id: d.id,
        name: d.name,
        type: d.type,
        uploadedAt: d.uploaded_at,
        status: d.status,
        fileUrl: d.file_url,
        fileSize: d.file_size,
      })),
      metadata: {
        caseNumber: caseData.case_number,
        court: caseData.court,
        value: caseData.value,
        ...caseData.metadata,
      },
    }

    logger.info('Case details retrieved successfully', { userId, caseId })

    return NextResponse.json(response)

  } catch (error) {
    if (error instanceof ZodError) {
      logger.warn('Validation error', { errors: formatZodErrors(error) })
      return NextResponse.json(
        {
          error: 'ID do caso inválido',
          details: formatZodErrors(error),
        },
        { status: 400 }
      )
    }

    logger.error('Error fetching case details', error)
    return NextResponse.json(
      { error: 'Erro ao carregar detalhes do caso' },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
