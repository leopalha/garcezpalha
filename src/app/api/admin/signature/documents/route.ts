import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { createLogger } from '@/lib/logger'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { formatZodErrors } from '@/lib/zod-helpers'

const logger = createLogger('api:admin:signature:documents')

const createDocumentSchema = z.object({
  title: z.string().min(3).max(255),
  description: z.string().optional(),
  file_url: z.string().url('URL do arquivo inválida'),
  provider: z.enum(['clicksign', 'docusign', 'manual']).default('clicksign'),
  case_id: z.string().uuid().optional(),
  expires_in_days: z.number().min(1).max(90).default(30),
  signers: z.array(z.object({
    name: z.string().min(3),
    email: z.string().email(),
    cpf_cnpj: z.string().optional(),
    phone: z.string().optional(),
    signer_type: z.enum(['signer', 'witness', 'approver']).default('signer'),
    signing_order: z.number().min(1).default(1)
  })).min(1, 'Pelo menos um signatário é obrigatório')
})

/**
 * GET /api/admin/signature/documents
 * List signature documents
 */
export async function GET(request: NextRequest) {
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

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const provider = searchParams.get('provider')
    const caseId = searchParams.get('case_id')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    logger.info('Fetching signature documents', { userId: session.user.id })

    // Build query
    let query = supabase
      .from('signature_documents')
      .select(`
        *,
        case:cases(id, case_number, service_type),
        creator:profiles!signature_documents_created_by_fkey(full_name),
        signers:signature_signers(*)
      `, { count: 'exact' })

    if (status) query = query.eq('status', status)
    if (provider) query = query.eq('provider', provider)
    if (caseId) query = query.eq('case_id', caseId)

    const { data: documents, error: documentsError, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (documentsError) {
      throw new Error('Failed to fetch documents')
    }

    return NextResponse.json({
      documents: documents || [],
      pagination: {
        total: count || 0,
        limit,
        offset,
        hasMore: (count || 0) > offset + limit
      }
    })

  } catch (error) {
    logger.error('Error in signature documents GET', error)
    return NextResponse.json({ error: 'Erro ao carregar documentos' }, { status: 500 })
  }
}

/**
 * POST /api/admin/signature/documents
 * Create a new signature document
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
    const validatedData = createDocumentSchema.parse(body)

    logger.info('Creating signature document', {
      userId: session.user.id,
      provider: validatedData.provider
    })

    // Calculate expiration date
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + validatedData.expires_in_days)

    // Create document
    const { data: document, error: createError } = await supabase
      .from('signature_documents')
      .insert({
        title: validatedData.title,
        description: validatedData.description,
        file_url: validatedData.file_url,
        provider: validatedData.provider,
        case_id: validatedData.case_id,
        created_by: session.user.id,
        expires_at: expiresAt.toISOString(),
        status: 'pending'
      })
      .select()
      .single()

    if (createError) {
      logger.error('Error creating document', { error: createError })
      throw new Error('Failed to create document')
    }

    // Create signers
    const signersToInsert = validatedData.signers.map(signer => ({
      document_id: document.id,
      name: signer.name,
      email: signer.email,
      cpf_cnpj: signer.cpf_cnpj,
      phone: signer.phone,
      signer_type: signer.signer_type,
      signing_order: signer.signing_order,
      status: 'pending'
    }))

    const { error: signersError } = await supabase
      .from('signature_signers')
      .insert(signersToInsert)

    if (signersError) {
      logger.error('Error creating signers', { error: signersError })
      // Rollback document creation
      await supabase
        .from('signature_documents')
        .delete()
        .eq('id', document.id)
      throw new Error('Failed to create signers')
    }

    // If provider is clicksign or docusign, send to provider
    if (validatedData.provider !== 'manual') {
      try {
        if (validatedData.provider === 'clicksign') {
          await sendToClickSign(document.id, validatedData)
        } else if (validatedData.provider === 'docusign') {
          await sendToDocuSign(document.id, validatedData)
        }

        // Update status to sent
        await supabase
          .from('signature_documents')
          .update({
            status: 'sent',
            sent_at: new Date().toISOString()
          })
          .eq('id', document.id)
      } catch (providerError) {
        logger.error('Error sending to provider', { error: providerError })
        // Don't fail the whole operation, just log it
      }
    }

    logger.info('Signature document created successfully', { documentId: document.id })

    // Fetch complete document with signers
    const { data: completeDocument } = await supabase
      .from('signature_documents')
      .select(`
        *,
        signers:signature_signers(*)
      `)
      .eq('id', document.id)
      .single()

    return NextResponse.json(completeDocument, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Dados inválidos',
        details: formatZodErrors(error),
      }, { status: 400 })
    }

    logger.error('Error in signature documents POST', error)
    return NextResponse.json({ error: 'Erro ao criar documento' }, { status: 500 })
  }
}

/**
 * Send document to ClickSign
 */
async function sendToClickSign(documentId: string, data: any): Promise<void> {
  const clickSignApiKey = process.env.CLICKSIGN_API_KEY
  if (!clickSignApiKey) {
    throw new Error('ClickSign API key not configured')
  }

  // TODO: Implement ClickSign API integration
  // This is a placeholder implementation
  logger.info('Sending document to ClickSign', { documentId })

  // Example ClickSign API call structure:
  // 1. Upload document: POST /api/v1/documents
  // 2. Create signers: POST /api/v1/lists
  // 3. Create signatures: POST /api/v1/batches

  // For now, just log that it would be sent
  logger.warn('ClickSign integration not yet implemented', { documentId })
}

/**
 * Send document to DocuSign
 */
async function sendToDocuSign(documentId: string, data: any): Promise<void> {
  const docuSignApiKey = process.env.DOCUSIGN_API_KEY
  if (!docuSignApiKey) {
    throw new Error('DocuSign API key not configured')
  }

  // TODO: Implement DocuSign API integration
  logger.info('Sending document to DocuSign', { documentId })

  // Example DocuSign API call structure:
  // 1. Create envelope with document
  // 2. Add recipients (signers)
  // 3. Send envelope

  logger.warn('DocuSign integration not yet implemented', { documentId })
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
