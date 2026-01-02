/**
 * Fluxo de Documentos (Upload + AI Analysis)
 * Upload → AI analysis → Report generation → Alert lawyer
 */

import { createClient } from '@/lib/supabase/server'
import { openai } from '@/lib/ai/openai-client'
import { sendEmail, sendWhatsApp } from '@/lib/notifications/notification-service'

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
  const supabase = await createClient()

  console.log('[Documentos] ⚠️ Alertas encontrados:', params.alerts)

  // Buscar dados do usuário que fez upload
  const { data: user } = await supabase
    .from('profiles')
    .select('email, phone, full_name')
    .eq('id', params.uploadedBy)
    .single()

  if (!user?.email) {
    console.warn('[Documentos] User not found:', params.uploadedBy)
    return
  }

  const alertsHtml = params.alerts
    .map((alert, i) => `
      <div style="background-color: #fef2f2; padding: 12px; border-left: 3px solid #dc2626; margin: 8px 0;">
        <strong>${i + 1}.</strong> ${alert}
      </div>
    `)
    .join('')

  // Enviar Email
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h2 style="margin: 0;">⚠️ Alertas Críticos em Documento</h2>
      </div>
      <div style="padding: 30px; background-color: #f9fafb;">
        <p>Olá <strong>${user.full_name || 'Advogado'}</strong>,</p>
        <p>A análise automática identificou <strong>${params.alerts.length} alerta(s) crítico(s)</strong> que requerem sua atenção imediata:</p>

        <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>📄 Documento:</strong> ${params.documentName}</p>
          <p style="margin: 5px 0;"><strong>🆔 ID:</strong> ${params.documentId}</p>
        </div>

        <h3 style="color: #dc2626; margin-top: 20px;">Alertas Encontrados:</h3>
        ${alertsHtml}

        <div style="background-color: #fef2f2; padding: 15px; border-radius: 6px; margin: 20px 0; border: 2px solid #dc2626;">
          <p style="margin: 0; color: #991b1b; font-weight: bold;">
            🚨 Recomendamos revisão imediata do documento para verificar os alertas acima.
          </p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/documentos/${params.documentId}"
             style="background-color: #2563eb; color: white; padding: 14px 28px;
                    text-decoration: none; border-radius: 6px; display: inline-block;
                    font-weight: bold;">
            Visualizar Documento
          </a>
        </div>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="color: #9ca3af; font-size: 12px;">
          <strong>Garcez Palha Advocacia</strong><br/>
          Sistema de Análise Automática de Documentos
        </p>
      </div>
    </div>
  `

  const emailSent = await sendEmail({
    to: user.email,
    subject: `⚠️ Alertas Críticos: ${params.documentName}`,
    html: emailHtml,
  })

  if (emailSent) {
    console.log('[Documentos] ✅ Email de alerta enviado para:', user.email)
  } else {
    console.error('[Documentos] ❌ Falha ao enviar email para:', user.email)
  }

  // Enviar WhatsApp (se telefone disponível)
  if (user.phone) {
    const alertsList = params.alerts
      .map((alert, i) => `${i + 1}. ${alert}`)
      .join('\n')

    const whatsappMessage = `⚠️ *ALERTAS CRÍTICOS EM DOCUMENTO*

Olá ${user.full_name || 'Advogado'}! 👋

A análise automática identificou *${params.alerts.length} alerta(s) crítico(s)*:

📄 *Documento:* ${params.documentName}

*🚨 Alertas:*
${alertsList}

*Recomendação:*
Revise o documento IMEDIATAMENTE para verificar os alertas acima.

🔗 Acesse: ${process.env.NEXT_PUBLIC_APP_URL}/admin/documentos/${params.documentId}

_Garcez Palha - Sistema de Análise de Documentos_`

    const whatsappSent = await sendWhatsApp({
      to: user.phone,
      message: whatsappMessage,
    })

    if (whatsappSent) {
      console.log('[Documentos] ✅ WhatsApp de alerta enviado para:', user.phone)
    } else {
      console.error('[Documentos] ❌ Falha ao enviar WhatsApp para:', user.phone)
    }
  }

  console.log('[Documentos] ✅ Notificação de alertas enviada')
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
