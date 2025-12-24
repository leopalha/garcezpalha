/**
 * Document Generator
 * AI-powered legal document generation using OpenAI/Claude
 *
 * Flow:
 * 1. Select template based on case type
 * 2. Fill variables from lead qualification data
 * 3. Generate document with AI assistance
 * 4. Add to review queue
 */

import { createClient } from '@supabase/supabase-js'
import { getTemplate, type DocumentTemplate } from './template-engine'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export type DocumentType =
  | 'peticao-desbloqueio-conta'
  | 'peticao-golpe-pix'
  | 'peticao-negativacao'
  | 'peticao-usucapiao'
  | 'peticao-plano-saude'
  | 'peticao-auxilio-doenca'
  | 'peticao-aposentadoria'
  | 'contrato-honorarios'
  | 'procuracao'
  | 'notificacao-extrajudicial'

export interface DocumentGenerationRequest {
  leadId: string
  documentType: DocumentType
  caseData: Record<string, any>
  clientData: {
    name: string
    cpf?: string
    rg?: string
    address?: string
    email?: string
    phone?: string
  }
  lawyerData?: {
    name: string
    oab: string
  }
}

export interface GeneratedDocument {
  id: string
  leadId: string
  documentType: DocumentType
  title: string
  content: string
  variables: Record<string, any>
  status: 'draft' | 'pending_review' | 'approved' | 'rejected' | 'sent'
  createdAt: Date
  reviewedAt?: Date
  reviewedBy?: string
  reviewNotes?: string
}

/**
 * Document Generator Class
 */
export class DocumentGenerator {
  private openaiApiKey: string

  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY || ''
  }

  /**
   * Generate a legal document
   */
  async generateDocument(request: DocumentGenerationRequest): Promise<GeneratedDocument> {
    console.log(`[DocumentGenerator] Generating ${request.documentType} for lead ${request.leadId}`)

    // 1. Get template
    const template = getTemplate(request.documentType)
    if (!template) {
      throw new Error(`Template not found: ${request.documentType}`)
    }

    // 2. Prepare variables
    const variables = this.prepareVariables(request, template)

    // 3. Fill template
    let content = this.fillTemplate(template.content, variables)

    // 4. Enhance with AI if needed
    if (template.requiresAI) {
      content = await this.enhanceWithAI(content, request.caseData, template)
    }

    // 5. Create document record
    const document: GeneratedDocument = {
      id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      leadId: request.leadId,
      documentType: request.documentType,
      title: this.generateTitle(template, request.clientData.name),
      content,
      variables,
      status: 'pending_review',
      createdAt: new Date()
    }

    // 6. Save to database
    await this.saveDocument(document)

    // 7. Add to review queue
    await this.addToReviewQueue(document)

    console.log(`[DocumentGenerator] Document ${document.id} created and added to review queue`)

    return document
  }

  /**
   * Prepare variables for template
   */
  private prepareVariables(
    request: DocumentGenerationRequest,
    template: DocumentTemplate
  ): Record<string, any> {
    const today = new Date()
    const defaultLawyer = {
      name: 'Dr. Eduardo Garcez Palha',
      oab: 'OAB/RJ 219.390'
    }

    return {
      // Client data
      CLIENTE_NOME: request.clientData.name,
      CLIENTE_CPF: request.clientData.cpf || '[CPF]',
      CLIENTE_RG: request.clientData.rg || '[RG]',
      CLIENTE_ENDERECO: request.clientData.address || '[ENDEREÇO]',
      CLIENTE_EMAIL: request.clientData.email || '[EMAIL]',
      CLIENTE_TELEFONE: request.clientData.phone || '[TELEFONE]',

      // Lawyer data
      ADVOGADO_NOME: request.lawyerData?.name || defaultLawyer.name,
      ADVOGADO_OAB: request.lawyerData?.oab || defaultLawyer.oab,

      // Date formatting
      DATA_EXTENSO: this.formatDateExtensive(today),
      DATA_CURTA: this.formatDateShort(today),
      ANO: today.getFullYear().toString(),

      // Case specific data
      ...request.caseData
    }
  }

  /**
   * Fill template with variables
   */
  private fillTemplate(content: string, variables: Record<string, any>): string {
    let filled = content

    // Replace simple variables {{VARIABLE}}
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g')
      filled = filled.replace(regex, String(value || `[${key}]`))
    }

    // Handle conditionals {{#IF CONDITION}}...{{/IF}}
    filled = this.processConditionals(filled, variables)

    return filled
  }

  /**
   * Process conditional blocks
   */
  private processConditionals(content: string, variables: Record<string, any>): string {
    // Pattern: {{#IF VARIABLE}}content{{/IF}}
    const conditionalRegex = /\{\{#IF\s+(\w+)\}\}([\s\S]*?)\{\{\/IF\}\}/g

    return content.replace(conditionalRegex, (match, variable, innerContent) => {
      const value = variables[variable]
      if (value && value !== '' && value !== '[' + variable + ']') {
        return innerContent
      }
      return ''
    })
  }

  /**
   * Enhance document with AI
   */
  private async enhanceWithAI(
    content: string,
    caseData: Record<string, any>,
    template: DocumentTemplate
  ): Promise<string> {
    if (!this.openaiApiKey) {
      console.warn('[DocumentGenerator] OpenAI API key not configured, skipping AI enhancement')
      return content
    }

    try {
      const prompt = `Você é um advogado especializado em ${template.category}.

Revise e aprimore o seguinte documento jurídico, mantendo a estrutura mas melhorando:
1. Argumentação jurídica
2. Citações de leis e jurisprudência relevantes
3. Clareza e formalidade

Dados do caso:
${JSON.stringify(caseData, null, 2)}

Documento atual:
${content}

Retorne APENAS o documento revisado, sem comentários adicionais.`

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo-preview',
          messages: [
            {
              role: 'system',
              content: 'Você é um advogado experiente especializado em produção de documentos jurídicos no Brasil. Mantenha formalidade, cite legislação brasileira pertinente e jurisprudência quando relevante.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 4000,
          temperature: 0.3
        })
      })

      if (!response.ok) {
        console.error('[DocumentGenerator] AI enhancement failed')
        return content
      }

      const data = await response.json()
      return data.choices[0]?.message?.content || content

    } catch (error) {
      console.error('[DocumentGenerator] AI enhancement error:', error)
      return content
    }
  }

  /**
   * Generate document title
   */
  private generateTitle(template: DocumentTemplate, clientName: string): string {
    return `${template.title} - ${clientName} - ${this.formatDateShort(new Date())}`
  }

  /**
   * Format date in extensive format (Portuguese)
   */
  private formatDateExtensive(date: Date): string {
    const months = [
      'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
      'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ]
    const day = date.getDate()
    const month = months[date.getMonth()]
    const year = date.getFullYear()
    return `${day} de ${month} de ${year}`
  }

  /**
   * Format date in short format
   */
  private formatDateShort(date: Date): string {
    return date.toLocaleDateString('pt-BR')
  }

  /**
   * Save document to database
   */
  private async saveDocument(document: GeneratedDocument): Promise<void> {
    const { error } = await supabase.from('generated_documents').insert({
      id: document.id,
      lead_id: document.leadId,
      document_type: document.documentType,
      title: document.title,
      content: document.content,
      variables: document.variables,
      status: document.status,
      created_at: document.createdAt.toISOString()
    })

    if (error) {
      console.error('[DocumentGenerator] Error saving document:', error)
      throw new Error('Failed to save document')
    }
  }

  /**
   * Add document to review queue
   */
  private async addToReviewQueue(document: GeneratedDocument): Promise<void> {
    const { error } = await supabase.from('review_queue').insert({
      document_id: document.id,
      lead_id: document.leadId,
      document_type: document.documentType,
      title: document.title,
      priority: this.calculatePriority(document),
      status: 'pending',
      created_at: new Date().toISOString()
    })

    if (error) {
      console.error('[DocumentGenerator] Error adding to review queue:', error)
    }
  }

  /**
   * Calculate review priority based on document type and lead data
   */
  private calculatePriority(document: GeneratedDocument): 'high' | 'medium' | 'low' {
    // High priority for urgent case types
    const highPriorityTypes: DocumentType[] = [
      'peticao-desbloqueio-conta',
      'peticao-golpe-pix'
    ]

    if (highPriorityTypes.includes(document.documentType)) {
      return 'high'
    }

    return 'medium'
  }

  /**
   * Get document by ID
   */
  async getDocument(documentId: string): Promise<GeneratedDocument | null> {
    const { data, error } = await supabase
      .from('generated_documents')
      .select('*')
      .eq('id', documentId)
      .single()

    if (error || !data) {
      return null
    }

    return {
      id: data.id,
      leadId: data.lead_id,
      documentType: data.document_type,
      title: data.title,
      content: data.content,
      variables: data.variables,
      status: data.status,
      createdAt: new Date(data.created_at),
      reviewedAt: data.reviewed_at ? new Date(data.reviewed_at) : undefined,
      reviewedBy: data.reviewed_by,
      reviewNotes: data.review_notes
    }
  }

  /**
   * Update document status
   */
  async updateDocumentStatus(
    documentId: string,
    status: GeneratedDocument['status'],
    reviewedBy?: string,
    reviewNotes?: string
  ): Promise<void> {
    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    }

    if (status === 'approved' || status === 'rejected') {
      updateData.reviewed_at = new Date().toISOString()
      updateData.reviewed_by = reviewedBy
      updateData.review_notes = reviewNotes
    }

    const { error } = await supabase
      .from('generated_documents')
      .update(updateData)
      .eq('id', documentId)

    if (error) {
      throw new Error('Failed to update document status')
    }

    // Update review queue
    await supabase
      .from('review_queue')
      .update({
        status: status === 'approved' ? 'approved' : status === 'rejected' ? 'rejected' : 'pending',
        reviewed_at: new Date().toISOString(),
        reviewed_by: reviewedBy
      })
      .eq('document_id', documentId)
  }
}

// Export singleton
export const documentGenerator = new DocumentGenerator()
