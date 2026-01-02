import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { getToken } from 'next-auth/jwt'
import { logger } from '@/lib/logger'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
]

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    if (!token) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const category = formData.get('category') as string
    const processId = formData.get('processId') as string | null
    const description = formData.get('description') as string | null

    if (!file) {
      return NextResponse.json({ error: 'Arquivo não fornecido' }, { status: 400 })
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de arquivo não permitido. Use PDF, DOC, DOCX, JPG ou PNG.' },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Arquivo muito grande. O tamanho máximo é 10MB.' },
        { status: 400 }
      )
    }

    const supabase = getSupabaseAdmin()

    // Generate unique file name
    const timestamp = Date.now()
    const extension = file.name.split('.').pop()
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const storagePath = `${token.id}/${timestamp}-${sanitizedName}`

    // Convert File to ArrayBuffer then to Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('client-documents')
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      logger.error('Upload error:', uploadError)
      return NextResponse.json(
        { error: 'Erro ao fazer upload do arquivo' },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('client-documents')
      .getPublicUrl(storagePath)

    // Save document metadata to database
    const documentData = {
      user_id: token.id as string,
      file_name: file.name,
      file_type: file.type,
      file_size: file.size,
      storage_path: storagePath,
      public_url: urlData.publicUrl,
      category: category || 'Pessoal',
      process_id: processId || null,
      description: description || null,
    }

    const { data: docData, error: dbError } = await (supabase as any)
      .from('client_documents')
      .insert(documentData)
      .select()
      .single()

    if (dbError) {
      logger.error('Database error:', dbError)
      // Try to delete the uploaded file if DB insert fails
      await supabase.storage.from('client-documents').remove([storagePath])
      return NextResponse.json(
        { error: 'Erro ao salvar documento no banco de dados' },
        { status: 500 }
      )
    }

    // Trigger AI analysis asynchronously (don't wait for it)
    if (file.type.includes('image') || file.type === 'application/pdf') {
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/documents/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: docData.id }),
      }).catch((error) => logger.error('Error triggering AI analysis:', error))
    }

    return NextResponse.json({
      success: true,
      document: docData,
    })
  } catch (error) {
    logger.error('Document upload error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
