import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { analyzeDocument } from '@/lib/ai/document-analyzer'

/**
 * API: POST /api/documents/analyze
 *
 * Analyzes a document using AI (GPT-4 Vision)
 *
 * Body:
 * {
 *   documentId: "uuid"
 * }
 *
 * Response:
 * {
 *   success: true,
 *   analysis: {
 *     type: "rg_cpf" | "contract" | ...,
 *     extractedData: {...},
 *     summary: "...",
 *     confidence: 0.85
 *   }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { documentId } = body

    if (!documentId) {
      return NextResponse.json(
        { error: 'documentId é obrigatório' },
        { status: 400 }
      )
    }

    const supabase = getSupabaseAdmin()

    // 1. Fetch document from database
    const { data: document, error: docError } = await supabase
      .from('client_documents')
      .select('*')
      .eq('id', documentId)
      .single()

    if (docError || !document) {
      console.error('Error fetching document:', docError)
      return NextResponse.json(
        { error: 'Documento não encontrado' },
        { status: 404 }
      )
    }

    // 2. Check if already analyzed
    if (document.ai_analyzed) {
      return NextResponse.json({
        success: true,
        analysis: document.ai_analysis,
        cached: true,
      })
    }

    // 3. Analyze document with AI
    console.log(`[AI] Analyzing document: ${document.file_name}`)

    const analysis = await analyzeDocument(
      document.public_url,
      document.file_type,
      document.file_name
    )

    // 4. Save analysis to database
    const { error: updateError } = await supabase
      .from('client_documents')
      .update({
        ai_analyzed: true,
        ai_analysis: analysis,
        ai_analyzed_at: new Date().toISOString(),
      })
      .eq('id', documentId)

    if (updateError) {
      console.error('Error updating document with analysis:', updateError)
      // Don't fail the request, analysis was successful
    }

    console.log(`[AI] Document analyzed successfully: ${document.file_name}`)

    return NextResponse.json({
      success: true,
      analysis,
    })
  } catch (error) {
    console.error('Error analyzing document:', error)
    return NextResponse.json(
      { error: 'Erro ao analisar documento' },
      { status: 500 }
    )
  }
}
