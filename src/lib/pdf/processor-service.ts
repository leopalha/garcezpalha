/**
 * PDF Processor Service
 *
 * Processes legal documents (PDF → TXT extraction)
 *
 * Features:
 * - Extract text from PDF while preserving formatting
 * - Extract deadlines (prazos processuais) automatically
 * - Store in Supabase Storage for searchability
 * - Link to process alerts
 *
 * Uses: pdf-parse library (free, no API costs)
 *
 * Note: For scanned PDFs without selectable text, consider using a separate
 * OCR service like Google Cloud Vision API or AWS Textract
 */

const pdfParse = require('pdf-parse')
import { createClient } from '@/lib/supabase/client'

interface PDFExtractionResult {
  text: string
  numPages: number
  metadata: {
    title?: string
    author?: string
    subject?: string
    creationDate?: Date
  }
  deadlines: ProcessDeadline[]
}

interface ProcessDeadline {
  type: string // "Apresentar contrarrazões", "Recurso", "Manifestação", etc.
  dueDate: Date
  daysRemaining: number
  description: string
}

class PDFProcessorService {
  /**
   * Extract text from PDF buffer
   */
  async extractTextFromPDF(pdfBuffer: Buffer): Promise<PDFExtractionResult> {
    try {
      const data = await pdfParse(pdfBuffer)
      const extractedText = data.text.trim()

      // Check if text extraction was successful
      if (extractedText.length < 100) {
        console.warn('[PDF Processor] Very little text extracted. This may be a scanned PDF.')
        console.warn('[PDF Processor] Consider using Google Cloud Vision API or AWS Textract for OCR.')
      }

      const deadlines = this.extractDeadlines(extractedText)

      return {
        text: extractedText,
        numPages: data.numpages,
        metadata: {
          title: data.info?.Title,
          author: data.info?.Author,
          subject: data.info?.Subject,
          creationDate: data.info?.CreationDate
            ? new Date(data.info.CreationDate)
            : undefined,
        },
        deadlines,
      }
    } catch (error: any) {
      console.error('PDF extraction error:', error)
      throw new Error(`Failed to extract PDF: ${error.message}`)
    }
  }

  /**
   * Extract deadlines from legal text
   *
   * Common patterns:
   * - "prazo de X dias"
   * - "no prazo de X dias"
   * - "fica intimado para [ação] no prazo de X dias"
   * - "apresentar [documento] em X dias"
   */
  private extractDeadlines(text: string): ProcessDeadline[] {
    const deadlines: ProcessDeadline[] = []

    // Pattern 1: "prazo de X dias"
    const prazoPattern = /prazo de (\d+) dias?/gi
    let match

    while ((match = prazoPattern.exec(text)) !== null) {
      const days = parseInt(match[1])
      const contextStart = Math.max(0, match.index - 100)
      const contextEnd = Math.min(text.length, match.index + 200)
      const context = text.substring(contextStart, contextEnd)

      // Try to identify what the deadline is for
      const type = this.identifyDeadlineType(context)

      const dueDate = new Date()
      dueDate.setDate(dueDate.getDate() + days)

      deadlines.push({
        type,
        dueDate,
        daysRemaining: days,
        description: context.trim(),
      })
    }

    // Pattern 2: "intimado para [ação]"
    const intimadoPattern =
      /intimad[oa]s? para ([\w\s]+) (?:no prazo de )?(\d+) dias?/gi

    while ((match = intimadoPattern.exec(text)) !== null) {
      const action = match[1].trim()
      const days = parseInt(match[2])

      const dueDate = new Date()
      dueDate.setDate(dueDate.getDate() + days)

      deadlines.push({
        type: action,
        dueDate,
        daysRemaining: days,
        description: match[0],
      })
    }

    // Pattern 3: "apresentar [documento] em X dias"
    const apresentarPattern = /apresentar ([\w\s]+) em (\d+) dias?/gi

    while ((match = apresentarPattern.exec(text)) !== null) {
      const document = match[1].trim()
      const days = parseInt(match[2])

      const dueDate = new Date()
      dueDate.setDate(dueDate.getDate() + days)

      deadlines.push({
        type: `Apresentar ${document}`,
        dueDate,
        daysRemaining: days,
        description: match[0],
      })
    }

    // Remove duplicates based on similar due dates and types
    const uniqueDeadlines = deadlines.filter(
      (deadline, index, self) =>
        index ===
        self.findIndex(
          (d) =>
            Math.abs(d.dueDate.getTime() - deadline.dueDate.getTime()) <
              24 * 60 * 60 * 1000 && // Same day
            d.type === deadline.type
        )
    )

    // Sort by due date (earliest first)
    uniqueDeadlines.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())

    return uniqueDeadlines
  }

  /**
   * Identify what type of action the deadline is for
   */
  private identifyDeadlineType(context: string): string {
    const lowerContext = context.toLowerCase()

    if (lowerContext.includes('contrarrazões') || lowerContext.includes('contrarazoes')) {
      return 'Apresentar Contrarrazões'
    }
    if (lowerContext.includes('recurso')) {
      return 'Interpor Recurso'
    }
    if (lowerContext.includes('manifestação') || lowerContext.includes('manifestacao')) {
      return 'Apresentar Manifestação'
    }
    if (lowerContext.includes('contestação') || lowerContext.includes('contestacao')) {
      return 'Apresentar Contestação'
    }
    if (lowerContext.includes('réplica') || lowerContext.includes('replica')) {
      return 'Apresentar Réplica'
    }
    if (lowerContext.includes('agravo')) {
      return 'Interpor Agravo'
    }
    if (lowerContext.includes('apelação') || lowerContext.includes('apelacao')) {
      return 'Interpor Apelação'
    }
    if (lowerContext.includes('embargos')) {
      return 'Opor Embargos'
    }
    if (lowerContext.includes('cumprimento')) {
      return 'Cumprimento de Sentença'
    }
    if (lowerContext.includes('especificação') || lowerContext.includes('especificacao')) {
      return 'Especificar Provas'
    }

    return 'Prazo Processual'
  }

  /**
   * Process and store PDF from process alert
   *
   * @param alertId - Process alert UUID
   * @param pdfBuffer - PDF file buffer
   * @param filename - Original filename
   */
  async processAlertPDF(
    alertId: string,
    pdfBuffer: Buffer,
    filename: string
  ): Promise<boolean> {
    const supabase = createClient()

    try {
      // 1. Extract text from PDF
      console.log(`[PDF Processor] Extracting text from ${filename}...`)
      const extraction = await this.extractTextFromPDF(pdfBuffer)

      // 2. Upload original PDF to Supabase Storage
      const pdfFilename = `${alertId}_${Date.now()}.pdf`
      const { data: pdfUpload, error: pdfError } = await supabase.storage
        .from('process-docs')
        .upload(pdfFilename, pdfBuffer, {
          contentType: 'application/pdf',
          upsert: true,
        })

      if (pdfError) {
        console.error('Failed to upload PDF:', pdfError)
        return false
      }

      // 3. Upload extracted text to Supabase Storage
      const txtFilename = `${alertId}_${Date.now()}.txt`
      const txtBuffer = Buffer.from(extraction.text, 'utf-8')
      const { data: txtUpload, error: txtError } = await supabase.storage
        .from('process-docs')
        .upload(txtFilename, txtBuffer, {
          contentType: 'text/plain',
          upsert: true,
        })

      if (txtError) {
        console.error('Failed to upload TXT:', txtError)
        return false
      }

      // 4. Get public URLs
      const { data: pdfUrl } = supabase.storage
        .from('process-docs')
        .getPublicUrl(pdfFilename)

      const { data: txtUrl } = supabase.storage
        .from('process-docs')
        .getPublicUrl(txtFilename)

      // 5. Create document record in database
      const { error: docError } = await supabase.from('process_documents').insert({
        alert_id: alertId,
        pdf_url: pdfUrl.publicUrl,
        text_url: txtUrl.publicUrl,
        extracted_text: extraction.text,
        num_pages: extraction.numPages,
        metadata: extraction.metadata,
      })

      if (docError) {
        console.error('Failed to create document record:', docError)
        return false
      }

      // 6. Save deadlines to database
      for (const deadline of extraction.deadlines) {
        await supabase.from('process_deadlines').insert({
          alert_id: alertId,
          deadline_type: deadline.type,
          due_date: deadline.dueDate.toISOString(),
          description: deadline.description,
          status: 'pending',
        })
      }

      // 7. Update alert status to 'processed'
      await supabase
        .from('process_alerts')
        .update({
          status: 'processed',
          uploaded_pdf_url: pdfUrl.publicUrl,
          processed_text_url: txtUrl.publicUrl,
        })
        .eq('id', alertId)

      console.log(
        `[PDF Processor] Successfully processed ${filename} - Found ${extraction.deadlines.length} deadlines`
      )

      return true
    } catch (error: any) {
      console.error('[PDF Processor] Error:', error)
      return false
    }
  }

  /**
   * Search within processed documents
   *
   * @param searchTerm - Term to search for
   * @param processNumber - Optional: filter by process number
   */
  async searchDocuments(
    searchTerm: string,
    processNumber?: string
  ): Promise<any[]> {
    const supabase = createClient()

    let query = supabase
      .from('process_documents')
      .select(
        `
        *,
        alert:process_alerts(process_number, tribunal, update_type)
      `
      )
      .ilike('extracted_text', `%${searchTerm}%`)

    if (processNumber) {
      query = query.eq('alert.process_number', processNumber)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('Search error:', error)
      return []
    }

    return data || []
  }
}

// Export singleton
export const pdfProcessor = new PDFProcessorService()

/**
 * USAGE EXAMPLES:
 *
 * 1. Process PDF from alert:
 *    const success = await pdfProcessor.processAlertPDF(
 *      alertId,
 *      pdfBuffer,
 *      'sentença.pdf'
 *    )
 *
 * 2. Search within documents:
 *    const results = await pdfProcessor.searchDocuments(
 *      'prazo',
 *      '0123456-78.2023.8.19.0001'
 *    )
 *
 * 3. Extract deadlines from existing PDF:
 *    const extraction = await pdfProcessor.extractTextFromPDF(pdfBuffer)
 *    console.log(extraction.deadlines)
 */
