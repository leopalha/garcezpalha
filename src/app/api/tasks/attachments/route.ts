import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'

export const dynamic = 'force-dynamic'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
]

// ============================================================================
// POST /api/tasks/attachments - Upload attachments for a task
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

    // Parse form data
    const formData = await request.formData()
    const taskId = formData.get('taskId') as string
    const files = formData.getAll('files') as File[]

    if (!taskId) {
      return NextResponse.json({ error: 'taskId é obrigatório' }, { status: 400 })
    }

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 })
    }

    // Verify task exists and user has access
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .select('id, case_id')
      .eq('id', taskId)
      .single()

    if (taskError || !task) {
      return NextResponse.json({ error: 'Tarefa não encontrada' }, { status: 404 })
    }

    const uploadedAttachments = []

    for (const file of files) {
      // Validate file
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `Arquivo ${file.name} excede 10MB` },
          { status: 400 }
        )
      }

      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `Tipo de arquivo ${file.type} não permitido` },
          { status: 400 }
        )
      }

      // Upload to Supabase Storage
      const fileName = `${Date.now()}-${file.name}`
      const storagePath = `task-attachments/${taskId}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(storagePath, file, {
          contentType: file.type,
          upsert: false,
        })

      if (uploadError) {
        logger.error('[POST /api/tasks/attachments] Upload error:', uploadError)
        return NextResponse.json({ error: 'Erro ao fazer upload do arquivo' }, { status: 500 })
      }

      // Create attachment record
      const { data: attachment, error: attachmentError } = await supabase
        .from('task_attachments')
        .insert({
          task_id: taskId,
          file_name: file.name,
          file_size: file.size,
          file_type: file.type,
          storage_path: storagePath,
          uploaded_by: user.id,
        })
        .select()
        .single()

      if (attachmentError) {
        logger.error('[POST /api/tasks/attachments] DB error:', attachmentError)
        // Cleanup uploaded file
        await supabase.storage.from('documents').remove([storagePath])
        return NextResponse.json({ error: 'Erro ao salvar anexo' }, { status: 500 })
      }

      uploadedAttachments.push(attachment)
    }

    return NextResponse.json(
      {
        message: 'Arquivos enviados com sucesso',
        attachments: uploadedAttachments,
      },
      { status: 201 }
    )
  } catch (err) {
    logger.error('[POST /api/tasks/attachments] Error:', err)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
