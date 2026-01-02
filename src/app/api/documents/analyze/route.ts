import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { analyzeDocument } from '@/lib/ai/document-analyzer'
import { z } from 'zod'
import { formatZodErrors } from '@/lib/zod-helpers'
import { logger } from '@/lib/logger'

const analyzeDocumentSchema = z.object({
  documentId: z.string().uuid('documentId deve ser um UUID válido'),
})

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

    // Validate with Zod
    const validatedData = analyzeDocumentSchema.parse(body)
    const { documentId } = validatedData

    const supabase = getSupabaseAdmin()

    // 1. Fetch document from database
    const { data: document, error: docError } = await (supabase as any)
      .from('client_documents')
      .select('*')
      .eq('id', documentId)
      .single()

    if (docError || !document) {
      logger.error('Error fetching document:', docError)
      return NextResponse.json(
        { error: 'Documento não encontrado' },
        { status: 404 }
      )
    }

    const docAny = document as any

    // 2. Check if already analyzed
    if (docAny.ai_analyzed) {
      return NextResponse.json({
        success: true,
        analysis: docAny.ai_analysis,
        cached: true,
      })
    }

    // 3. Analyze document with AI
    logger.info(`[AI] Analyzing document: ${docAny.file_name}`)

    const analysis = await analyzeDocument(
      docAny.public_url,
      docAny.file_type,
      docAny.file_name
    )

    // 4. Save analysis to database
    const { error: updateError } = await (supabase as any)
      .from('client_documents')
      .update({
        ai_analyzed: true,
        ai_analysis: analysis,
        ai_analyzed_at: new Date().toISOString(),
      } as any)
      .eq('id', documentId)

    if (updateError) {
      logger.error('Error updating document with analysis:', updateError)
      // Don't fail the request, analysis was successful
    }

    logger.info(`[AI] Document analyzed successfully: ${docAny.file_name}`)

    return NextResponse.json({
      success: true,
      analysis,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: formatZodErrors(error) },
        { status: 400 }
      )
    }

    logger.error('Error analyzing document:', error)
    return NextResponse.json(
      { error: 'Erro ao analisar documento' },
      { status: 500 }
    )
  }
}
