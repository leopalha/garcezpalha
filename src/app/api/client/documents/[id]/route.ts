import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z, ZodError } from 'zod'
import { logger } from '@/lib/logger'

export const dynamic = 'force-dynamic'

// ============================================================================
// DELETE /api/client/documents/[id] - Delete document
// ============================================================================

const paramsSchema = z.object({
  id: z.string().uuid('ID inválido'),
})

export async function DELETE(
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

    // Validate params
    const validatedParams = paramsSchema.parse(params)

    // Get document to verify ownership and get file path
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

    // Verify ownership
    if (document.uploaded_by !== user.id) {
      return NextResponse.json(
        { error: 'Acesso negado a este documento' },
        { status: 403 }
      )
    }

    // Cannot delete approved documents
    if (document.status === 'approved') {
      return NextResponse.json(
        { error: 'Não é possível excluir documentos aprovados' },
        { status: 400 }
      )
    }

    // Extract file path from URL
    const fileUrl = new URL(document.file_url)
    const filePath = fileUrl.pathname.split('/documents/')[1]

    // Delete from storage
    if (filePath) {
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([filePath])

      if (storageError) {
        logger.error('[DELETE /api/client/documents/[id]] Storage error:', storageError)
        // Continue anyway - better to delete the record
      }
    }

    // Delete record
    const { error: deleteError } = await supabase
      .from('case_documents')
      .delete()
      .eq('id', validatedParams.id)

    if (deleteError) {
      logger.error('[DELETE /api/client/documents/[id]] DB error:', deleteError)
      return NextResponse.json(
        { error: 'Erro ao excluir documento' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Documento excluído com sucesso',
    })
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: 'ID inválido', details: err.format() },
        { status: 400 }
      )
    }

    logger.error('[DELETE /api/client/documents/[id]] Error:', err)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
