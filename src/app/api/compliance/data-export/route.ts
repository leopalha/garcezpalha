import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { createLogger } from '@/lib/logger'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { formatZodErrors } from '@/lib/zod-helpers'

const logger = createLogger('api:compliance:data-export')

const createExportSchema = z.object({
  request_type: z.enum(['full', 'cases', 'documents', 'financial']).default('full'),
  export_format: z.enum(['json', 'csv', 'pdf']).default('json')
})

/**
 * POST /api/compliance/data-export
 * Request data export (LGPD data portability right)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const supabase = await createClient()

    const body = await request.json()
    const validatedData = createExportSchema.parse(body)

    const ipAddress = request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    logger.info('Creating data export request', {
      userId: session.user.id,
      requestType: validatedData.request_type,
      format: validatedData.export_format
    })

    // Create export request
    const { data: exportRequest, error: createError } = await supabase
      .from('data_export_requests')
      .insert({
        user_id: session.user.id,
        request_type: validatedData.request_type,
        export_format: validatedData.export_format,
        status: 'pending',
        ip_address: ipAddress,
        user_agent: userAgent,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
      })
      .select()
      .single()

    if (createError) {
      logger.error('Error creating export request', createError)
      throw createError
    }

    // Log audit event
    await supabase.rpc('log_audit_event', {
      p_user_id: session.user.id,
      p_action: 'create',
      p_resource_type: 'data_export',
      p_resource_id: exportRequest.id,
      p_new_values: exportRequest,
      p_ip_address: ipAddress,
      p_user_agent: userAgent
    })

    // In production, trigger background job to process export
    // For now, process immediately for small datasets
    try {
      await processExport(exportRequest.id, session.user.id, validatedData.request_type, validatedData.export_format)
    } catch (processError) {
      logger.error('Error processing export', processError)
      // Update status to failed
      await supabase
        .from('data_export_requests')
        .update({ status: 'failed' })
        .eq('id', exportRequest.id)
    }

    logger.info('Export request created', { requestId: exportRequest.id })

    return NextResponse.json({ exportRequest }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Dados inválidos',
        details: formatZodErrors(error),
      }, { status: 400 })
    }

    logger.error('Error in data export', error)
    return NextResponse.json({ error: 'Erro ao solicitar exportação de dados' }, { status: 500 })
  }
}

/**
 * GET /api/compliance/data-export
 * List user's export requests
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const supabase = await createClient()

    const { data: exports, error } = await supabase
      .from('data_export_requests')
      .select('*')
      .eq('user_id', session.user.id)
      .order('requested_at', { ascending: false })
      .limit(50)

    if (error) throw error

    return NextResponse.json({ exports: exports || [] })

  } catch (error) {
    logger.error('Error fetching exports', error)
    return NextResponse.json({ error: 'Erro ao buscar exportações' }, { status: 500 })
  }
}

/**
 * Process export request
 * In production, this should be a background job
 */
async function processExport(
  exportId: string,
  userId: string,
  requestType: string,
  format: string
): Promise<void> {
  const supabase = await createClient()

  // Update status to processing
  await supabase
    .from('data_export_requests')
    .update({ status: 'processing' })
    .eq('id', exportId)

  // Gather data based on request type
  const exportData: any = {
    user: null,
    cases: [],
    documents: [],
    financial: [],
    consents: [],
    audit_logs: []
  }

  try {
    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    exportData.user = profile

    if (requestType === 'full' || requestType === 'cases') {
      // Get cases
      const { data: cases } = await supabase
        .from('cases')
        .select(`
          *,
          lawyer:profiles!cases_lawyer_id_fkey(full_name, email),
          deadlines(*)
        `)
        .eq('client_id', userId)

      exportData.cases = cases || []
    }

    if (requestType === 'full' || requestType === 'documents') {
      // Get documents
      const { data: documents } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', userId)

      exportData.documents = documents || []
    }

    if (requestType === 'full' || requestType === 'financial') {
      // Get invoices
      const { data: invoices } = await supabase
        .from('invoices')
        .select('*')
        .eq('client_id', userId)

      exportData.financial = invoices || []
    }

    if (requestType === 'full') {
      // Get consents
      const { data: consents } = await supabase
        .from('user_consent')
        .select('*')
        .eq('user_id', userId)

      exportData.consents = consents || []

      // Get audit logs (last 90 days)
      const { data: auditLogs } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(1000)

      exportData.audit_logs = auditLogs || []
    }

    // Convert to requested format
    let exportContent: string
    let contentType: string
    let fileExtension: string

    if (format === 'json') {
      exportContent = JSON.stringify(exportData, null, 2)
      contentType = 'application/json'
      fileExtension = 'json'
    } else if (format === 'csv') {
      exportContent = convertToCSV(exportData)
      contentType = 'text/csv'
      fileExtension = 'csv'
    } else {
      // PDF not implemented yet
      throw new Error('PDF export not implemented')
    }

    // In production, upload to Supabase Storage and generate signed URL
    // For now, store in database (not recommended for large files)
    const exportSize = new Blob([exportContent]).size

    // Update export request with completion
    await supabase
      .from('data_export_requests')
      .update({
        status: 'completed',
        export_size_bytes: exportSize,
        processed_at: new Date().toISOString(),
        // In production, store export_url as signed URL from Supabase Storage
        export_url: `data:${contentType};base64,${Buffer.from(exportContent).toString('base64')}`
      })
      .eq('id', exportId)

    logger.info('Export processed successfully', { exportId, size: exportSize })

  } catch (error) {
    logger.error('Error processing export', error)
    throw error
  }
}

/**
 * Convert export data to CSV
 */
function convertToCSV(data: any): string {
  const sections: string[] = []

  // User profile
  if (data.user) {
    sections.push('=== PERFIL DO USUÁRIO ===')
    sections.push(objectToCSV([data.user]))
    sections.push('')
  }

  // Cases
  if (data.cases && data.cases.length > 0) {
    sections.push('=== CASOS ===')
    sections.push(objectToCSV(data.cases))
    sections.push('')
  }

  // Documents
  if (data.documents && data.documents.length > 0) {
    sections.push('=== DOCUMENTOS ===')
    sections.push(objectToCSV(data.documents))
    sections.push('')
  }

  // Financial
  if (data.financial && data.financial.length > 0) {
    sections.push('=== FINANCEIRO ===')
    sections.push(objectToCSV(data.financial))
    sections.push('')
  }

  return sections.join('\n')
}

/**
 * Convert array of objects to CSV
 */
function objectToCSV(items: any[]): string {
  if (!items || items.length === 0) return ''

  const headers = Object.keys(items[0])
  const rows = items.map(item =>
    headers.map(header => {
      const value = item[header]
      if (value === null || value === undefined) return ''
      const str = String(value)
      return str.includes(',') || str.includes('"') ? `"${str.replace(/"/g, '""')}"` : str
    }).join(',')
  )

  return [headers.join(','), ...rows].join('\n')
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
