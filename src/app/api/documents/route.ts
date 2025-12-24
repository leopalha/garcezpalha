import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { getToken } from 'next-auth/jwt'

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    if (!token) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const supabase = getSupabaseAdmin()

    // Fetch user's documents
    const { data: documents, error } = await supabase
      .from('client_documents')
      .select('*')
      .eq('user_id', token.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar documentos' },
        { status: 500 }
      )
    }

    return NextResponse.json({ documents })
  } catch (error) {
    console.error('Documents fetch error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    if (!token) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const documentId = searchParams.get('id')

    if (!documentId) {
      return NextResponse.json({ error: 'ID do documento não fornecido' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()

    // Get document to verify ownership and get storage path
    const { data: document, error: fetchError } = await supabase
      .from('client_documents')
      .select('*')
      .eq('id', documentId)
      .eq('user_id', token.id)
      .single()

    if (fetchError || !document) {
      return NextResponse.json({ error: 'Documento não encontrado' }, { status: 404 })
    }

    // Delete from storage
    const doc = document as { storage_path?: string }
    if (doc.storage_path) {
      await supabase.storage.from('client-documents').remove([doc.storage_path])
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from('client_documents')
      .delete()
      .eq('id', documentId)

    if (deleteError) {
      console.error('Delete error:', deleteError)
      return NextResponse.json(
        { error: 'Erro ao excluir documento' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Document delete error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
