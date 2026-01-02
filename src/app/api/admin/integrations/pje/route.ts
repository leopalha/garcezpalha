import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { pje } from '@/lib/integrations/pje'
import { logger } from '@/lib/logger'

export const dynamic = 'force-dynamic'

// ============================================================================
// GET /api/admin/integrations/pje - Monitor processes
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Auth check
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const processNumber = searchParams.get('processNumber')
    const action = searchParams.get('action') // 'search', 'movements', 'deadlines'

    if (!pje.isConfigured()) {
      return NextResponse.json(
        {
          error: 'PJe não configurado',
          configured: false,
          message: 'Configure as credenciais PJe nas variáveis de ambiente',
        },
        { status: 503 }
      )
    }

    if (!processNumber) {
      return NextResponse.json({ error: 'Número do processo é obrigatório' }, { status: 400 })
    }

    // Search process
    if (action === 'search') {
      const process = await pje.searchProcess(processNumber)
      return NextResponse.json({ process })
    }

    // Get movements
    if (action === 'movements') {
      const movements = await pje.getMovements(processNumber)
      return NextResponse.json({ movements })
    }

    // Get deadlines
    if (action === 'deadlines') {
      const deadlines = await pje.getDeadlines(processNumber)
      return NextResponse.json({ deadlines })
    }

    return NextResponse.json({ error: 'Ação inválida' }, { status: 400 })
  } catch (err) {
    logger.error('[GET /api/admin/integrations/pje] Error:', err)
    return NextResponse.json(
      {
        error: 'Erro ao consultar PJe',
        message: err instanceof Error ? err.message : 'Erro desconhecido',
      },
      { status: 500 }
    )
  }
}

// ============================================================================
// POST /api/admin/integrations/pje - File petition or download document
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Auth check
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    // Verify lawyer role
    const { data: userRole } = await supabase
      .from('user_roles')
      .select('role_name')
      .eq('user_id', user.id)
      .single()

    if (!userRole || !['ADMIN', 'MANAGER', 'LAWYER'].includes(userRole.role_name)) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    if (!pje.isConfigured()) {
      return NextResponse.json({ error: 'PJe não configurado' }, { status: 503 })
    }

    const body = await request.json()
    const { action, processNumber, ...params } = body

    // File petition
    if (action === 'file_petition') {
      if (!params.petitionType || !params.content || !params.filename || !params.description) {
        return NextResponse.json({ error: 'Parâmetros incompletos' }, { status: 400 })
      }

      // Convert base64 content to Buffer
      const content = Buffer.from(params.content, 'base64')

      const attachments = params.attachments?.map((att: any) => ({
        file: Buffer.from(att.content, 'base64'),
        filename: att.filename,
        description: att.description,
      }))

      const result = await pje.filePetition({
        processNumber,
        petitionType: params.petitionType,
        content,
        filename: params.filename,
        description: params.description,
        attachments,
      })

      // Log petition in database
      await supabase.from('pje_petitions').insert({
        process_number: processNumber,
        petition_type: params.petitionType,
        protocol: result.protocol,
        filed_at: result.timestamp,
        filed_by: user.id,
        description: params.description,
      })

      return NextResponse.json({
        message: 'Petição protocolada com sucesso',
        protocol: result.protocol,
        timestamp: result.timestamp,
      })
    }

    // Download document
    if (action === 'download_document') {
      if (!params.documentId) {
        return NextResponse.json({ error: 'documentId é obrigatório' }, { status: 400 })
      }

      const document = await pje.downloadDocument({
        processNumber,
        documentId: params.documentId,
      })

      // Return as base64
      const base64 = document.toString('base64')

      return NextResponse.json({
        document: base64,
        contentType: 'application/pdf',
      })
    }

    return NextResponse.json({ error: 'Ação inválida' }, { status: 400 })
  } catch (err) {
    logger.error('[POST /api/admin/integrations/pje] Error:', err)
    return NextResponse.json(
      {
        error: 'Erro na operação PJe',
        message: err instanceof Error ? err.message : 'Erro desconhecido',
      },
      { status: 500 }
    )
  }
}
