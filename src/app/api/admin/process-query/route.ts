import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { createLogger } from '@/lib/logger'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { formatZodErrors } from '@/lib/zod-helpers'

const logger = createLogger('api:admin:process-query')

const queryProcessSchema = z.object({
  process_number: z.string().min(20, 'Número de processo inválido'),
  court_code: z.string().min(2, 'Código do tribunal obrigatório'),
  query_type: z.enum(['full', 'movements', 'deadlines', 'parties']).default('full'),
  case_id: z.string().uuid().optional()
})

/**
 * POST /api/admin/process-query
 * Query process information from courts (PJe, e-SAJ)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const supabase = await createClient()

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!profile || !['admin', 'lawyer'].includes(profile.role)) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = queryProcessSchema.parse(body)

    logger.info('Querying process', {
      userId: session.user.id,
      processNumber: validatedData.process_number,
      courtCode: validatedData.court_code
    })

    // Check if court integration is configured
    const { data: courtIntegration } = await supabase
      .from('court_integrations')
      .select('*')
      .eq('court_code', validatedData.court_code)
      .eq('status', 'active')
      .single()

    if (!courtIntegration) {
      return NextResponse.json({
        error: 'Integração com este tribunal não está configurada'
      }, { status: 400 })
    }

    // Create query record
    const { data: query, error: queryError } = await supabase
      .from('process_queries')
      .insert({
        process_number: validatedData.process_number,
        court_code: validatedData.court_code,
        query_type: validatedData.query_type,
        case_id: validatedData.case_id,
        requested_by: session.user.id,
        status: 'pending'
      })
      .select()
      .single()

    if (queryError) {
      logger.error('Error creating query', { error: queryError })
      throw new Error('Failed to create query')
    }

    // Perform query based on court type
    try {
      let result: any

      if (courtIntegration.court_type === 'pje') {
        result = await queryPJe(validatedData.process_number, courtIntegration, validatedData.query_type)
      } else if (courtIntegration.court_type === 'esaj') {
        result = await queryESAJ(validatedData.process_number, courtIntegration, validatedData.query_type)
      } else {
        throw new Error(`Court type ${courtIntegration.court_type} not supported`)
      }

      // Update query with results
      await supabase
        .from('process_queries')
        .update({
          status: 'success',
          raw_response: result.raw,
          parsed_data: result.parsed,
          process_status: result.parsed?.status,
          process_class: result.parsed?.class,
          process_subject: result.parsed?.subject,
          distribution_date: result.parsed?.distributionDate,
          last_movement_date: result.parsed?.lastMovementDate,
          completed_at: new Date().toISOString()
        })
        .eq('id', query.id)

      // Store movements
      if (result.parsed?.movements) {
        const movementsToInsert = result.parsed.movements.map((mov: any, idx: number) => ({
          query_id: query.id,
          movement_date: mov.date,
          movement_code: mov.code,
          movement_description: mov.description,
          movement_type: mov.type,
          sequence_number: idx + 1,
          is_decision: mov.isDecision || false
        }))

        await supabase
          .from('process_movements')
          .insert(movementsToInsert)
      }

      // Store parties
      if (result.parsed?.parties) {
        const partiesToInsert = result.parsed.parties.map((party: any) => ({
          query_id: query.id,
          party_type: party.type,
          party_role: party.role,
          party_name: party.name,
          party_document: party.document,
          oab_number: party.oabNumber,
          oab_state: party.oabState
        }))

        await supabase
          .from('process_parties')
          .insert(partiesToInsert)
      }

      // Extract deadlines automatically
      if (validatedData.query_type === 'full' || validatedData.query_type === 'deadlines') {
        await supabase.rpc('extract_deadlines_from_query', {
          p_query_id: query.id
        })
      }

      // Update court integration last sync
      await supabase
        .from('court_integrations')
        .update({ last_sync_at: new Date().toISOString() })
        .eq('id', courtIntegration.id)

      logger.info('Process query completed successfully', {
        queryId: query.id,
        processNumber: validatedData.process_number
      })

      // Fetch complete query with all data
      const { data: completeQuery } = await supabase
        .from('process_queries')
        .select(`
          *,
          movements:process_movements(*),
          parties:process_parties(*),
          deadlines:process_deadlines_extracted(*)
        `)
        .eq('id', query.id)
        .single()

      return NextResponse.json(completeQuery, { status: 200 })

    } catch (queryErr) {
      // Update query with error
      await supabase
        .from('process_queries')
        .update({
          status: 'error',
          error_message: queryErr instanceof Error ? queryErr.message : 'Unknown error',
          completed_at: new Date().toISOString()
        })
        .eq('id', query.id)

      throw queryErr
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Dados inválidos',
        details: formatZodErrors(error),
      }, { status: 400 })
    }

    logger.error('Error in process query', error)
    return NextResponse.json({
      error: 'Erro ao consultar processo'
    }, { status: 500 })
  }
}

/**
 * GET /api/admin/process-query
 * List process queries
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const supabase = await createClient()

    const { searchParams } = new URL(request.url)
    const caseId = searchParams.get('case_id')
    const limit = parseInt(searchParams.get('limit') || '50')

    let query = supabase
      .from('process_queries')
      .select(`
        *,
        movements:process_movements(count),
        deadlines:process_deadlines_extracted(count)
      `)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (caseId) {
      query = query.eq('case_id', caseId)
    }

    const { data: queries, error } = await query

    if (error) {
      throw error
    }

    return NextResponse.json({ queries: queries || [] })

  } catch (error) {
    logger.error('Error listing queries', error)
    return NextResponse.json({ error: 'Erro ao listar consultas' }, { status: 500 })
  }
}

/**
 * Query PJe system
 */
async function queryPJe(processNumber: string, integration: any, queryType: string): Promise<any> {
  // TODO: Implement real PJe API integration
  // This is a mock implementation

  logger.warn('PJe query is mocked - real integration not yet implemented', {
    processNumber,
    endpoint: integration.api_endpoint
  })

  // Simulate API response
  const mockResponse = {
    raw: {
      numeroProcesso: processNumber,
      classe: 'Procedimento Comum Cível',
      assunto: 'Indenização por Dano Moral',
      status: 'Em andamento'
    },
    parsed: {
      processNumber,
      class: 'Procedimento Comum Cível',
      subject: 'Indenização por Dano Moral',
      status: 'Em andamento',
      distributionDate: '2024-01-15',
      lastMovementDate: '2025-12-20',
      movements: [
        {
          date: '2025-12-20T10:00:00Z',
          code: '123',
          description: 'Juntada de petição',
          type: 'Petição',
          isDecision: false
        }
      ],
      parties: [
        {
          type: 'author',
          role: 'Polo Ativo',
          name: 'João da Silva',
          document: '123.456.789-00'
        }
      ]
    }
  }

  return mockResponse
}

/**
 * Query e-SAJ system
 */
async function queryESAJ(processNumber: string, integration: any, queryType: string): Promise<any> {
  // TODO: Implement real e-SAJ integration
  logger.warn('e-SAJ query is mocked - real integration not yet implemented', {
    processNumber
  })

  return {
    raw: {},
    parsed: {
      processNumber,
      movements: [],
      parties: []
    }
  }
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
