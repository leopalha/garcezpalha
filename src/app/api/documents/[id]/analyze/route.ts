import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { createLogger } from '@/lib/logger'
import { createClient } from '@/lib/supabase/server'
import DocumentAnalyzer from '@/lib/ai/document-analyzer-v2'

const logger = createLogger('api:documents:analyze')

/**
 * POST /api/documents/[id]/analyze
 * Analyze document with AI (OCR, classification, entity extraction, summary)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const supabase = await createClient()
    const documentId = params.id

    logger.info('Starting document analysis', { documentId, userId: session.user.id })

    // Get document
    const { data: document, error: docError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single()

    if (docError || !document) {
      return NextResponse.json({ error: 'Documento não encontrado' }, { status: 404 })
    }

    // Check permission
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    const isOwner = document.user_id === session.user.id
    const isAdminOrLawyer = profile && ['admin', 'lawyer'].includes(profile.role)

    if (!isOwner && !isAdminOrLawyer) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    // Check if already analyzed
    const { data: existingAnalysis } = await supabase
      .from('document_analysis')
      .select('*')
      .eq('document_id', documentId)
      .single()

    if (existingAnalysis && existingAnalysis.status === 'completed') {
      logger.info('Document already analyzed', { analysisId: existingAnalysis.id })
      return NextResponse.json({
        message: 'Documento já foi analisado',
        analysis: existingAnalysis
      })
    }

    // Create or update analysis record
    let analysisId: string

    if (existingAnalysis) {
      analysisId = existingAnalysis.id
      await supabase
        .from('document_analysis')
        .update({ status: 'processing' })
        .eq('id', analysisId)
    } else {
      const { data: newAnalysis, error: createError } = await supabase
        .from('document_analysis')
        .insert({
          document_id: documentId,
          status: 'processing'
        })
        .select()
        .single()

      if (createError) throw createError
      analysisId = newAnalysis.id
    }

    const startTime = Date.now()

    try {
      // Perform OCR
      const ocrResult = await DocumentAnalyzer.performOCR(document.url)

      // Classify document
      const classification = await DocumentAnalyzer.classifyDocument(ocrResult.text)

      // Extract entities
      const entities = await DocumentAnalyzer.extractEntities(ocrResult.text)

      // Generate summary
      const summary = await DocumentAnalyzer.summarizeDocument(ocrResult.text)

      // Validate document
      const validation = DocumentAnalyzer.validateDocument(entities)

      const processingTime = Date.now() - startTime

      // Update analysis with results
      const { data: updatedAnalysis, error: updateError } = await supabase
        .from('document_analysis')
        .update({
          status: 'completed',
          ocr_text: ocrResult.text,
          ocr_confidence: ocrResult.confidence,
          ocr_language: ocrResult.language,
          document_type: classification.type,
          classification_confidence: classification.confidence,
          extracted_data: {
            entities: entities.map(e => ({ type: e.type, value: e.value, label: e.label })),
            validation: validation
          },
          is_valid: validation.isValid,
          validation_errors: validation.errors,
          summary: summary.summary,
          key_points: summary.keyPoints,
          processing_time_ms: processingTime,
          ai_provider: 'openai',
          model_version: 'gpt-4o',
          completed_at: new Date().toISOString()
        })
        .eq('id', analysisId)
        .select()
        .single()

      if (updateError) throw updateError

      // Insert entities
      if (entities.length > 0) {
        const entitiesToInsert = entities.map(entity => ({
          analysis_id: analysisId,
          entity_type: entity.type,
          entity_value: entity.value,
          entity_label: entity.label,
          confidence: entity.confidence,
          is_valid: entity.isValid ?? true
        }))

        await supabase
          .from('document_entities')
          .insert(entitiesToInsert)
      }

      logger.info('Analysis completed successfully', {
        analysisId,
        processingTime,
        entityCount: entities.length
      })

      return NextResponse.json({
        success: true,
        analysis: updatedAnalysis,
        entities,
        processingTime
      })

    } catch (analysisError) {
      logger.error('Error during analysis', analysisError)

      // Update analysis with error
      await supabase
        .from('document_analysis')
        .update({
          status: 'failed',
          error_message: analysisError instanceof Error ? analysisError.message : 'Unknown error'
        })
        .eq('id', analysisId)

      throw analysisError
    }

  } catch (error) {
    logger.error('Error in document analysis', error)
    return NextResponse.json({
      error: 'Erro ao analisar documento',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

/**
 * GET /api/documents/[id]/analyze
 * Get analysis results for document
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const supabase = await createClient()
    const documentId = params.id

    // Get analysis with entities
    const { data: analysis, error } = await supabase
      .from('document_analysis')
      .select(`
        *,
        entities:document_entities(*)
      `)
      .eq('document_id', documentId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') { // Not found
        return NextResponse.json({
          message: 'Documento ainda não foi analisado',
          analyzed: false
        })
      }
      throw error
    }

    return NextResponse.json({
      analysis,
      analyzed: true
    })

  } catch (error) {
    logger.error('Error fetching analysis', error)
    return NextResponse.json({
      error: 'Erro ao buscar análise'
    }, { status: 500 })
  }
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
