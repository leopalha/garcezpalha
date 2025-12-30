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

    const { searchParams } = new URL(request.url)
    const leadId = searchParams.get('leadId')

    const supabase = getSupabaseAdmin()

    let query = supabase.from('client_documents').select('*').order('created_at', { ascending: false })

    // Filter by leadId if provided (for admin viewing lead's documents)
    if (leadId) {
      query = query.eq('process_id', leadId)
    } else {
      // Otherwise, filter by user_id (for client viewing own documents)
      query = query.eq('user_id', token.id)
    }

    const { data: documents, error } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar documentos' },
        { status: 500 }
      )
    }

    return NextResponse.json({ documents: documents || [] })
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

    // TODO: Create client_documents table in Supabase
    // Temporarily return not found until table is created
    // const { data: document, error: fetchError } = await supabase
    //   .from('client_documents')
    //   .select('*')
    //   .eq('id', documentId)
    //   .eq('user_id', token.id)
    //   .single()

    // if (fetchError || !document) {
    //   return NextResponse.json({ error: 'Documento não encontrado' }, { status: 404 })
    // }

    // // Delete from storage
    // const doc = document as { storage_path?: string }
    // if (doc.storage_path) {
    //   await supabase.storage.from('client-documents').remove([doc.storage_path])
    // }

    // // Delete from database
    // const { error: deleteError } = await supabase
    //   .from('client_documents')
    //   .delete()
    //   .eq('id', documentId)

    // if (deleteError) {
    //   console.error('Delete error:', deleteError)
    //   return NextResponse.json(
    //     { error: 'Erro ao excluir documento' },
    //     { status: 500 }
    //   )
    // }

    return NextResponse.json({ error: 'Funcionalidade temporariamente indisponível' }, { status: 503 })
  } catch (error) {
    console.error('Document delete error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
