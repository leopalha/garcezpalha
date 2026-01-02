import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'

export const dynamic = 'force-dynamic'

// ============================================================================
// GET /api/tasks/attachments/[id] - Download attachment
// ============================================================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params

    // Auth check
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    // Get attachment
    const { data: attachment, error: attachmentError } = await supabase
      .from('task_attachments')
      .select('*')
      .eq('id', id)
      .single()

    if (attachmentError || !attachment) {
      return NextResponse.json({ error: 'Anexo não encontrado' }, { status: 404 })
    }

    // Download from storage
    const { data: file, error: downloadError } = await supabase.storage
      .from('documents')
      .download(attachment.storage_path)

    if (downloadError) {
      logger.error('[GET /api/tasks/attachments/:id] Download error:', downloadError)
      return NextResponse.json({ error: 'Erro ao baixar arquivo' }, { status: 500 })
    }

    return new NextResponse(file, {
      headers: {
        'Content-Type': attachment.file_type,
        'Content-Disposition': `attachment; filename="${attachment.file_name}"`,
      },
    })
  } catch (err) {
    logger.error('[GET /api/tasks/attachments/:id] Error:', err)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

// ============================================================================
// DELETE /api/tasks/attachments/[id] - Delete attachment
// ============================================================================

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params

    // Auth check
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    // Get attachment
    const { data: attachment, error: attachmentError } = await supabase
      .from('task_attachments')
      .select('*')
      .eq('id', id)
      .single()

    if (attachmentError || !attachment) {
      return NextResponse.json({ error: 'Anexo não encontrado' }, { status: 404 })
    }

    // Delete from storage
    const { error: deleteStorageError } = await supabase.storage
      .from('documents')
      .remove([attachment.storage_path])

    if (deleteStorageError) {
      logger.error('[DELETE /api/tasks/attachments/:id] Storage error:', deleteStorageError)
    }

    // Delete from database
    const { error: deleteDbError } = await supabase
      .from('task_attachments')
      .delete()
      .eq('id', id)

    if (deleteDbError) {
      logger.error('[DELETE /api/tasks/attachments/:id] DB error:', deleteDbError)
      return NextResponse.json({ error: 'Erro ao excluir anexo' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Anexo excluído com sucesso' })
  } catch (err) {
    logger.error('[DELETE /api/tasks/attachments/:id] Error:', err)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
