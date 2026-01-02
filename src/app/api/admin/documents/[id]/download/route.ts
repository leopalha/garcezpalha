import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z, ZodError } from 'zod'
import { logger } from '@/lib/logger'

export const dynamic = 'force-dynamic'

// ============================================================================
// GET /api/admin/documents/[id]/download - Download document (admin)
// ============================================================================

const paramsSchema = z.object({
  id: z.string().uuid('ID inválido'),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Validate params
    const validatedParams = paramsSchema.parse(params)

    // Get document
    const { data: document, error: fetchError } = await supabase
      .from('case_documents')
      .select('*')
      .eq('id', validatedParams.id)
      .single()

    if (fetchError || !document) {
      return NextResponse.json(
        { error: 'Documento não encontrado' },
        { status: 404 }
      )
    }

    // Extract file path from URL
    const fileUrl = new URL(document.file_url)
    const filePath = fileUrl.pathname.split('/documents/')[1]

    if (!filePath) {
      return NextResponse.json(
        { error: 'Caminho do arquivo inválido' },
        { status: 500 }
      )
    }

    // Download from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('documents')
      .download(filePath)

    if (downloadError || !fileData) {
      logger.error('[GET /api/admin/documents/[id]/download] Storage error:', downloadError)
      return NextResponse.json(
        { error: 'Erro ao baixar arquivo' },
        { status: 500 }
      )
    }

    // Convert blob to array buffer
    const buffer = await fileData.arrayBuffer()

    // Return file with proper headers
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': document.mime_type,
        'Content-Disposition': `attachment; filename="${encodeURIComponent(document.name)}"`,
        'Content-Length': document.file_size.toString(),
      },
    })
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: 'ID inválido', details: err.format() },
        { status: 400 }
      )
    }

    logger.error('[GET /api/admin/documents/[id]/download] Error:', err)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
