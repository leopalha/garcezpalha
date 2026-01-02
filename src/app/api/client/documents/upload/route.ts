import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z, ZodError } from 'zod'
import { logger } from '@/lib/logger'

export const dynamic = 'force-dynamic'

// ============================================================================
// POST /api/client/documents/upload - Upload document
// ============================================================================

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
]

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

const uploadSchema = z.object({
  type: z.string().min(1, 'Tipo de documento é obrigatório'),
  description: z.string().max(500).optional(),
  caseId: z.string().uuid().optional(),
})

export async function POST(request: NextRequest) {
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

    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const type = formData.get('type') as string
    const description = formData.get('description') as string | null
    const caseId = formData.get('caseId') as string | null

    // Validate file
    if (!file) {
      return NextResponse.json(
        { error: 'Arquivo é obrigatório' },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Arquivo muito grande. Tamanho máximo: 10MB' },
        { status: 400 }
      )
    }

    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de arquivo não permitido. Use PDF, JPG ou PNG' },
        { status: 400 }
      )
    }

    // Validate metadata
    const validatedData = uploadSchema.parse({
      type,
      description: description || undefined,
      caseId: caseId || undefined,
    })

    // If caseId provided, verify user owns the case
    if (validatedData.caseId) {
      const { data: caseData, error: caseError } = await supabase
        .from('cases')
        .select('client_id')
        .eq('id', validatedData.caseId)
        .single()

      if (caseError || !caseData) {
        return NextResponse.json(
          { error: 'Caso não encontrado' },
          { status: 404 }
        )
      }

      if (caseData.client_id !== user.id) {
        return NextResponse.json(
          { error: 'Acesso negado a este caso' },
          { status: 403 }
        )
      }
    }

    // Generate unique file name
    const fileExt = file.name.split('.').pop()
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 15)
    const fileName = `${user.id}/${timestamp}-${randomStr}.${fileExt}`

    // Upload to Supabase Storage
    const fileBuffer = await file.arrayBuffer()
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      logger.error('[POST /api/client/documents/upload] Storage error:', uploadError)
      return NextResponse.json(
        { error: 'Erro ao fazer upload do arquivo' },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('documents')
      .getPublicUrl(fileName)

    // Create document record
    const { data: documentData, error: documentError } = await supabase
      .from('case_documents')
      .insert({
        case_id: validatedData.caseId || null,
        name: file.name,
        type: validatedData.type,
        description: validatedData.description || null,
        file_url: urlData.publicUrl,
        file_size: file.size,
        mime_type: file.type,
        status: 'pending',
        uploaded_by: user.id,
      })
      .select()
      .single()

    if (documentError) {
      logger.error('[POST /api/client/documents/upload] DB error:', documentError)

      // Try to delete uploaded file
      await supabase.storage.from('documents').remove([fileName])

      return NextResponse.json(
        { error: 'Erro ao salvar documento' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      document: documentData,
      message: 'Documento enviado com sucesso',
    })
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: err.format() },
        { status: 400 }
      )
    }

    logger.error('[POST /api/client/documents/upload] Error:', err)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
