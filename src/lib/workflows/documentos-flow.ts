/**
 * Fluxo de Documentos (Upload + AI Analysis)
 * Upload → AI analysis → Report generation → Alert lawyer
 */

import { createClient } from '@/lib/supabase/server'
import { openai } from '@/lib/ai/openai-client'

export interface DocumentosInput {
  file: File | { name: string; url: string; type: string }
  clientId?: string
  caseId?: string
  documentType: string // 'contrato', 'procuracao', 'sentenca', 'peticao', etc
  uploadedBy: string // User ID
}

export interface DocumentosOutput {
  documentId: string
  analysisId?: string
  summary?: string
  keyPoints?: string[]
  alerts?: string[]
  confidence: number
  success: boolean
}

/**
 * Executa fluxo completo de processamento de documentos
 */
export async function executeDocumentosFlow(
  input: DocumentosInput
): Promise<DocumentosOutput> {
  const supabase = await createClient()

  // 1. Upload para Supabase Storage
  const { url: documentUrl, storageError } = await uploadDocumentToStorage(input.file)

  if (storageError) {
    throw new Error('Failed to upload document')
  }

  // 2. Criar registro no banco
  const { data: document, error } = await supabase
    .from('documents')
    .insert({
      client_id: input.clientId || null,
      case_id: input.caseId || null,
      document_type: input.documentType,
      file_name: typeof input.file === 'object' && 'name' in input.file ? input.file.name : 'document.pdf',
      file_url: documentUrl,
      uploaded_by: input.uploadedBy,
      status: 'processing',
    })
    .select()
    .single()

  if (error || !document) {
    throw new Error('Failed to create document record')
  }

  // 3. Extrair texto do documento
  const extractedText = await extractTextFromDocument(documentUrl, input.file)

  if (!extractedText) {
    await supabase
      .from('documents')
      .update({ status: 'failed', error_message: 'Failed to extract text' })
      .eq('id', document.id)

    return {
      documentId: document.id,
      confidence: 0,
      success: false,
    }
  }

  // 4. Analisar com IA
  const analysis = await analyzeDocumentWithAI({
    documentType: input.documentType,
    extractedText,
    documentName: typeof input.file === 'object' && 'name' in input.file ? input.file.name : 'document',
  })

  // 5. Salvar análise no banco
  const { data: savedAnalysis } = await supabase
    .from('document_analyses')
    .insert({
      document_id: document.id,
      summary: analysis.summary,
      key_points: analysis.keyPoints,
      alerts: analysis.alerts,
      confidence: analysis.confidence,
      full_analysis: analysis.fullAnalysis,
    })
    .select()
    .single()

  // 6. Atualizar status do documento
  await supabase
    .from('documents')
    .update({
      status: 'completed',
      analyzed_at: new Date().toISOString(),
    })
    .eq('id', document.id)

  // 7. Notificar advogado se houver alertas críticos
  if (analysis.alerts && analysis.alerts.length > 0) {
    await notificarAdvogadoAlertas({
      documentId: document.id,
      documentName: typeof input.file === 'object' && 'name' in input.file ? input.file.name : 'document',
      alerts: analysis.alerts,
      uploadedBy: input.uploadedBy,
    })
  }

  return {
    documentId: document.id,
    analysisId: savedAnalysis?.id,
    summary: analysis.summary,
    keyPoints: analysis.keyPoints,
    alerts: analysis.alerts,
    confidence: analysis.confidence,
    success: true,
  }
}

/**
 * Upload de documento para Supabase Storage
 */
async function uploadDocumentToStorage(
  file: File | { name: string; url: string; type: string }
): Promise<{ url: string; storageError?: unknown }> {
  const supabase = await createClient()

  // Se já tem URL, retorna direto
  if (typeof file === 'object' && 'url' in file && file.url) {
    return { url: file.url }
  }

  // Upload real (File object)
  if (file instanceof File) {
    const fileName = `${Date.now()}-${file.name}`
    const { data, error } = await supabase.storage
      .from('client-documents')
      .upload(fileName, file, {
        contentType: file.type,
        upsert: false,
      })

    if (error) {
      return { url: '', storageError: error }
    }

    const { data: urlData } = supabase.storage
      .from('client-documents')
      .getPublicUrl(data.path)

    return { url: urlData.publicUrl }
  }

  return { url: '', storageError: 'Invalid file format' }
}

/**
 * Extrai texto do documento (PDF, DOCX, imagens)
 */
async function extractTextFromDocument(
  documentUrl: string,
  file: File | { name: string; url: string; type: string }
): Promise<string | null> {
  // TODO: Implementar extração de texto real
  // Opções:
  // 1. PDF: pdf-parse, pdfjs-dist
  // 2. DOCX: mammoth
  // 3. Imagens: Tesseract OCR ou Google Vision API

  console.log('[Documentos] 📄 Extraindo texto de:', documentUrl)

  // Mock: texto de exemplo
  const mockText = `
    CONTRATO DE PRESTAÇÃO DE SERVIÇOS JURÍDICOS

    CONTRATANTE: João Silva, CPF 123.456.789-00
    CONTRATADO: Garcez & Palha Advogados

    CLÁUSULA PRIMEIRA - DO OBJETO
    O presente contrato tem por objeto a prestação de serviços jurídicos...

    CLÁUSULA SEGUNDA - DOS HONORÁRIOS
    O valor total dos honorários é de R$ 5.000,00 (cinco mil reais)...

    CLÁUSULA TERCEIRA - DO PRAZO
    O prazo para conclusão é de 90 dias...

    Rio de Janeiro, 15 de dezembro de 2024.
  `

  return mockText
}

/**
 * Analisa documento com IA (GPT-4)
 */
async function analyzeDocumentWithAI(params: {
  documentType: string
  extractedText: string
  documentName: string
}): Promise<{
  summary: string
  keyPoints: string[]
  alerts: string[]
  confidence: number
  fullAnalysis: string
}> {
  console.log('[Documentos] 🤖 Analisando com IA:', params.documentName)

  const systemPrompt = `Você é um assistente jurídico especializado em análise de documentos legais.

Analise o documento fornecido e retorne:
1. Resumo executivo (2-3 parágrafos)
2. Pontos-chave (lista de itens importantes)
3. Alertas críticos (prazos, obrigações, riscos)
4. Nível de confiança da análise (0-100)

Seja objetivo, preciso e focado em informações jurídicas relevantes.`

  const userPrompt = `Tipo de documento: ${params.documentType}
Nome do arquivo: ${params.documentName}

Texto extraído:
${params.extractedText}

Forneça uma análise completa no seguinte formato JSON:
{
  "summary": "resumo executivo",
  "keyPoints": ["ponto 1", "ponto 2", ...],
  "alerts": ["alerta 1", "alerta 2", ...],
  "confidence": 85
}`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    })

    const result = JSON.parse(response.choices[0].message.content || '{}')

    return {
      summary: result.summary || 'Análise não disponível',
      keyPoints: result.keyPoints || [],
      alerts: result.alerts || [],
      confidence: result.confidence || 50,
      fullAnalysis: response.choices[0].message.content || '',
    }
  } catch (error) {
    console.error('[Documentos] Erro na análise IA:', error)

    // Fallback: análise básica
    return {
      summary: `Documento do tipo "${params.documentType}" foi processado. Análise automática não disponível.`,
      keyPoints: ['Documento carregado com sucesso', 'Texto extraído'],
      alerts: [],
      confidence: 30,
      fullAnalysis: params.extractedText.substring(0, 500),
    }
  }
}

/**
 * Notifica advogado sobre alertas críticos
 */
async function notificarAdvogadoAlertas(params: {
  documentId: string
  documentName: string
  alerts: string[]
  uploadedBy: string
}): Promise<void> {
  console.log('[Documentos] ⚠️ Alertas encontrados:', params.alerts)

  // TODO: Integrar com Resend para email
  // TODO: Integrar com WhatsApp para notificação push

  const emailTemplate = `
    Alertas Críticos em Documento

    Documento: ${params.documentName}
    ID: ${params.documentId}

    Alertas encontrados:
    ${params.alerts.map((alert, i) => `${i + 1}. ${alert}`).join('\n')}

    Recomendamos revisão imediata do documento.

    Acesse: https://garcezpalha.com.br/admin/documentos/${params.documentId}
  `

  console.log('[Documentos] Email template:', emailTemplate)
}

/**
 * Busca documentos por cliente ou caso
 */
export async function buscarDocumentos(filters: {
  clientId?: string
  caseId?: string
  documentType?: string
  status?: string
}): Promise<any[]> {
  const supabase = await createClient()

  let query = supabase.from('documents').select(`
    *,
    analysis:document_analyses (*)
  `)

  if (filters.clientId) {
    query = query.eq('client_id', filters.clientId)
  }

  if (filters.caseId) {
    query = query.eq('case_id', filters.caseId)
  }

  if (filters.documentType) {
    query = query.eq('document_type', filters.documentType)
  }

  if (filters.status) {
    query = query.eq('status', filters.status)
  }

  const { data: documents } = await query.order('created_at', {
    ascending: false,
  })

  return documents || []
}

/**
 * Gera relatório comparativo entre múltiplos documentos
 */
export async function compararDocumentos(
  documentIds: string[]
): Promise<{
  comparison: string
  differences: string[]
  similarities: string[]
}> {
  const supabase = await createClient()

  // Buscar documentos e análises
  const { data: documents } = await supabase
    .from('documents')
    .select('*, analysis:document_analyses (*)')
    .in('id', documentIds)

  if (!documents || documents.length < 2) {
    throw new Error('Need at least 2 documents to compare')
  }

  console.log('[Documentos] 🔍 Comparando documentos:', documentIds)

  // TODO: Implementar comparação com IA
  // Usar GPT-4 para comparar os textos extraídos

  return {
    comparison: 'Análise comparativa em desenvolvimento',
    differences: ['Cláusula de rescisão diferente', 'Valores divergentes'],
    similarities: ['Mesmas partes contratantes', 'Objeto similar'],
  }
}

/**
 * Atualiza status de documento manualmente
 */
export async function atualizarStatusDocumento(
  documentId: string,
  status: 'pending' | 'processing' | 'completed' | 'failed'
): Promise<boolean> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('documents')
    .update({ status })
    .eq('id', documentId)

  if (error) {
    console.error('[Documentos] Erro ao atualizar status:', error)
    return false
  }

  return true
}
