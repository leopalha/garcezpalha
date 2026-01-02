/**
 * Inngest Function: Analyze Documents with AI
 * Background processing for document OCR and analysis
 */

import { inngest } from '../inngest-client'
import { logger } from '@/lib/logger'
import { createClient } from '@/lib/supabase/server'
import { performOCR, classifyDocument, extractEntities } from '@/lib/ai/document-analyzer-v2'

export const documentAnalyzerHandler = inngest.createFunction(
  {
    id: 'document-analyzer',
    name: 'Analyze Document with AI',
    retries: 2,
  },
  { event: 'document/analyze' },
  async ({ event, step }) => {
    const { documentId, userId, fileUrl } = event.data

    logger.info('Starting document analysis', { documentId, userId })

    // Step 1: Perform OCR
    const ocrResult = await step.run('perform-ocr', async () => {
      try {
        const result = await performOCR(fileUrl)
        logger.info('OCR completed', { documentId, confidence: result.confidence })
        return result
      } catch (error) {
        logger.error('OCR failed', { documentId, error })
        throw error
      }
    })

    // Step 2: Classify document
    const classification = await step.run('classify-document', async () => {
      try {
        const result = await classifyDocument(ocrResult.text)
        logger.info('Classification completed', { documentId, type: result.type })
        return result
      } catch (error) {
        logger.error('Classification failed', { documentId, error })
        throw error
      }
    })

    // Step 3: Extract entities
    const entities = await step.run('extract-entities', async () => {
      try {
        const result = await extractEntities(ocrResult.text)
        logger.info('Entity extraction completed', { documentId, entitiesCount: result.length })
        return result
      } catch (error) {
        logger.error('Entity extraction failed', { documentId, error })
        throw error
      }
    })

    // Step 4: Save analysis to database
    const saved = await step.run('save-analysis', async () => {
      const supabase = await createClient()

      // Save main analysis
      const { error: analysisError } = await supabase
        .from('document_analysis')
        .upsert({
          document_id: documentId,
          ocr_text: ocrResult.text,
          ocr_confidence: ocrResult.confidence,
          document_type: classification.type,
          classification_confidence: classification.confidence,
          language: 'pt-BR',
          analyzed_at: new Date().toISOString(),
        })

      if (analysisError) {
        logger.error('Failed to save analysis', { documentId, error: analysisError })
        throw analysisError
      }

      // Save entities
      if (entities.length > 0) {
        const { error: entitiesError } = await supabase
          .from('document_entities')
          .insert(
            entities.map(entity => ({
              document_id: documentId,
              entity_type: entity.type,
              entity_value: entity.value,
              confidence: entity.confidence,
            }))
          )

        if (entitiesError) {
          logger.error('Failed to save entities', { documentId, error: entitiesError })
        }
      }

      // Update document status
      await supabase
        .from('case_documents')
        .update({ analysis_status: 'completed' })
        .eq('id', documentId)

      logger.info('Analysis saved successfully', { documentId })
      return { success: true }
    })

    // Step 5: Notify user
    await step.run('notify-user', async () => {
      await inngest.send({
        name: 'notification/send',
        data: {
          userId,
          type: 'document',
          title: 'Análise de Documento Concluída',
          message: `Documento analisado: ${classification.type}`,
          link: `/cliente/documentos/${documentId}`,
          sendEmail: false,
        },
      })
    })

    return {
      documentId,
      ocrConfidence: ocrResult.confidence,
      documentType: classification.type,
      entitiesCount: entities.length,
    }
  }
)
