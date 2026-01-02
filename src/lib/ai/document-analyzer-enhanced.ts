/**
 * Enhanced AI Document Analyzer
 * FEAT-017: IA - Análise de Documentos
 *
 * Uses GPT-4 Vision for images and GPT-4 + pdf-parse for PDFs
 * Extracts structured data and identifies problematic clauses
 *
 * Supported document types:
 * - RG/CPF: Extract name, CPF, RG, date of birth, etc.
 * - Contracts: Analyze clauses, parties, values, dates, identify abusive clauses
 * - Court documents: Extract case numbers, parties, deadlines, decisions
 * - Bank statements: Extract transactions, balances
 * - Generic PDFs: Extract text and summarize
 */

import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface DocumentAnalysisResult {
  type: 'rg_cpf' | 'contract' | 'bank_statement' | 'court_document' | 'generic'
  extractedData: Record<string, any>
  summary: string
  confidence: number
  warnings?: string[]
  textExtracted?: boolean
}

/**
 * Analyze document using AI (GPT-4 Vision for images, GPT-4 + pdf-parse for PDFs)
 */
export async function analyzeDocumentEnhanced(
  publicUrl: string,
  fileType: string,
  fileName: string
): Promise<DocumentAnalysisResult> {
  try {
    // Determine analysis strategy based on file type
    if (fileType.includes('image')) {
      return await analyzeImageDocument(publicUrl, fileName)
    } else if (fileType === 'application/pdf') {
      return await analyzePDFDocumentEnhanced(publicUrl, fileName)
    } else {
      throw new Error(`Unsupported file type: ${fileType}`)
    }
  } catch (error) {
    console.error('Error analyzing document:', error)
    throw error
  }
}

/**
 * Analyze image documents (JPG/PNG) with GPT-4 Vision
 */
async function analyzeImageDocument(
  publicUrl: string,
  fileName: string
): Promise<DocumentAnalysisResult> {
  const lowerName = fileName.toLowerCase()

  // Determine document type from filename
  let documentType: DocumentAnalysisResult['type'] = 'generic'
  let prompt = ''

  if (lowerName.includes('rg') || lowerName.includes('cpf') || lowerName.includes('identidade')) {
    documentType = 'rg_cpf'
    prompt = `Analise este documento de identificação (RG/CPF) e extraia:

DADOS ESTRUTURADOS (retorne em JSON):
{
  "nome_completo": "string",
  "cpf": "string (formato: XXX.XXX.XXX-XX)",
  "rg": "string",
  "data_nascimento": "string (formato: DD/MM/YYYY)",
  "orgao_emissor": "string",
  "uf_emissao": "string",
  "data_emissao": "string",
  "nacionalidade": "string",
  "naturalidade": "string",
  "filiacao_pai": "string",
  "filiacao_mae": "string"
}

IMPORTANTE:
- Se algum campo não estiver visível, use null
- Mantenha formatação exata dos dados
- Verifique se há rasuras ou adulterações (campo "warnings")`
  } else if (lowerName.includes('contrato') || lowerName.includes('contract')) {
    documentType = 'contract'
    prompt = `Analise este contrato e extraia:

DADOS ESTRUTURADOS (retorne em JSON):
{
  "tipo_contrato": "string",
  "partes": ["string"],
  "objeto": "string",
  "valor": "number (em reais, apenas números)",
  "data_assinatura": "string (DD/MM/YYYY)",
  "vigencia_inicio": "string",
  "vigencia_fim": "string",
  "clausulas_principais": ["string"],
  "penalidades": "string",
  "rescisao": "string"
}

Identifique cláusulas abusivas ou problemáticas em "warnings".`
  } else {
    prompt = `Analise este documento e extraia:

1. Tipo de documento
2. Informações principais
3. Datas relevantes
4. Valores monetários (se houver)
5. Partes envolvidas

Retorne em formato JSON estruturado.`
  }

  const response = await openai.chat.completions.create({
    model: 'gpt-4-vision-preview',
    messages: [
      {
        role: 'system',
        content:
          'Você é um assistente especializado em análise de documentos jurídicos. Extraia dados com precisão e identifique possíveis irregularidades.',
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: prompt,
          },
          {
            type: 'image_url',
            image_url: {
              url: publicUrl,
              detail: 'high',
            },
          },
        ],
      },
    ],
    max_tokens: 1000,
    temperature: 0.1, // Low temperature for factual extraction
  })

  const content = response.choices[0].message.content || '{}'

  // Parse JSON from response
  let extractedData: Record<string, any> = {}
  let summary = content
  let warnings: string[] = []

  try {
    // Try to extract JSON from markdown code blocks
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/{[\s\S]*}/)

    if (jsonMatch) {
      const jsonStr = jsonMatch[1] || jsonMatch[0]
      const parsed = JSON.parse(jsonStr)

      extractedData = parsed
      summary = `Documento analisado: ${documentType}`

      // Extract warnings if present
      if (parsed.warnings && Array.isArray(parsed.warnings)) {
        warnings = parsed.warnings
        delete extractedData.warnings
      }
    }
  } catch (error) {
    console.error('Error parsing AI response:', error)
    extractedData = { raw_content: content }
  }

  return {
    type: documentType,
    extractedData,
    summary,
    confidence: 0.85,
    warnings: warnings.length > 0 ? warnings : undefined,
    textExtracted: false,
  }
}

/**
 * Analyze PDF documents with text extraction using pdf-parse
 */
async function analyzePDFDocumentEnhanced(
  publicUrl: string,
  fileName: string
): Promise<DocumentAnalysisResult> {
  const lowerName = fileName.toLowerCase()

  let documentType: DocumentAnalysisResult['type'] = 'generic'

  if (lowerName.includes('contrato')) {
    documentType = 'contract'
  } else if (lowerName.includes('sentenca') || lowerName.includes('acordao')) {
    documentType = 'court_document'
  } else if (lowerName.includes('extrato')) {
    documentType = 'bank_statement'
  }

  // Fetch PDF and extract text
  let extractedText = ''
  try {
    const pdfResponse = await fetch(publicUrl)
    const pdfBuffer = await pdfResponse.arrayBuffer()

    // Dynamic import to avoid build issues
    const pdfParse = await import('pdf-parse')
    // @ts-ignore - pdf-parse has complex type exports
    const pdfData = await pdfParse(Buffer.from(pdfBuffer))
    extractedText = pdfData.text

    console.log(`[PDF] Extracted ${extractedText.length} characters from ${fileName}`)
  } catch (error) {
    console.error('Error extracting PDF text:', error)
    // Fallback to filename-based analysis
    extractedText = ''
  }

  // If no text extracted, use simplified analysis
  if (!extractedText || extractedText.trim().length < 50) {
    return await analyzePDFWithoutText(fileName, documentType)
  }

  // Analyze extracted text with GPT-4
  const prompt = getAnalysisPromptForType(documentType, extractedText)

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content:
          'Você é um assistente jurídico especializado em análise de documentos. Extraia dados estruturados com precisão e identifique cláusulas problemáticas.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    max_tokens: 2000,
    temperature: 0.1,
  })

  const content = response.choices[0].message.content || '{}'

  let extractedData: Record<string, any> = {}
  let summary = content
  let warnings: string[] = []

  try {
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/{[\s\S]*}/)
    if (jsonMatch) {
      const jsonStr = jsonMatch[1] || jsonMatch[0]
      const parsed = JSON.parse(jsonStr)

      extractedData = parsed
      summary = parsed.summary || `Documento ${documentType} analisado com sucesso`

      if (parsed.warnings && Array.isArray(parsed.warnings)) {
        warnings = parsed.warnings
        delete extractedData.warnings
      }
      if (parsed.summary) {
        delete extractedData.summary
      }
    }
  } catch (error) {
    console.error('Error parsing AI response:', error)
    extractedData = { raw_content: content.substring(0, 500) }
  }

  return {
    type: documentType,
    extractedData,
    summary,
    confidence: 0.9,
    warnings: warnings.length > 0 ? warnings : undefined,
    textExtracted: true,
  }
}

/**
 * Fallback analysis without text extraction
 */
async function analyzePDFWithoutText(
  fileName: string,
  documentType: DocumentAnalysisResult['type']
): Promise<DocumentAnalysisResult> {
  return {
    type: documentType,
    extractedData: {
      nome_arquivo: fileName,
      tipo_identificado: documentType,
      observacao: 'Análise baseada no nome do arquivo (extração de texto falhou)',
    },
    summary: `Documento PDF: ${fileName} - Extração de texto não disponível`,
    confidence: 0.5,
    warnings: [
      'Não foi possível extrair texto do PDF. Análise limitada ao nome do arquivo.',
      'Para análise completa, certifique-se de que o PDF não está protegido ou corrompido.',
    ],
    textExtracted: false,
  }
}

/**
 * Get analysis prompt based on document type
 */
function getAnalysisPromptForType(documentType: string, text: string): string {
  const textPreview = text.substring(0, 4000) // Limit to avoid token limits

  switch (documentType) {
    case 'contract':
      return `Analise este CONTRATO e extraia dados estruturados em JSON:

TEXTO DO DOCUMENTO:
${textPreview}

EXTRAIA (retorne em JSON):
{
  "tipo_contrato": "string (ex: compra e venda, prestação de serviços, etc)",
  "partes": [
    {
      "tipo": "contratante|contratado",
      "nome": "string",
      "documento": "CPF/CNPJ",
      "endereco": "string"
    }
  ],
  "objeto": "string (descrição do objeto do contrato)",
  "valor_total": "number (apenas números, em reais)",
  "forma_pagamento": "string",
  "data_assinatura": "string (DD/MM/YYYY)",
  "vigencia": {
    "inicio": "string",
    "fim": "string",
    "prazo": "string"
  },
  "clausulas_principais": ["string"],
  "obrigacoes_contratante": ["string"],
  "obrigacoes_contratado": ["string"],
  "penalidades": "string",
  "multa_rescisao": "string",
  "foro": "string (cidade/comarca)",
  "summary": "string (resumo executivo do contrato em 2-3 frases)",
  "warnings": ["string (cláusulas abusivas, leoninas ou problemáticas identificadas)"]
}

IMPORTANTE:
- Se campo não estiver presente, use null
- Identifique cláusulas abusivas em "warnings"
- Verifique prazos de vigência
- Analise multas e penalidades`

    case 'court_document':
      return `Analise este DOCUMENTO JUDICIAL e extraia dados estruturados em JSON:

TEXTO DO DOCUMENTO:
${textPreview}

EXTRAIA (retorne em JSON):
{
  "tipo_documento": "string (sentença, acórdão, despacho, decisão interlocutória, etc)",
  "processo_numero": "string",
  "tribunal": "string",
  "vara_camara": "string",
  "comarca": "string",
  "juiz_relator": "string",
  "data_documento": "string (DD/MM/YYYY)",
  "partes": [
    {
      "tipo": "autor|réu|apelante|apelado|etc",
      "nome": "string"
    }
  ],
  "assunto": "string",
  "dispositivo": "string (parte decisória - procedente, improcedente, etc)",
  "fundamentacao_resumo": "string (resumo dos fundamentos)",
  "prazos_gerados": [
    {
      "tipo": "recurso|cumprimento|manifestação|etc",
      "prazo_dias": "number",
      "data_limite": "string (se mencionada)"
    }
  ],
  "valor_causa": "number (se mencionado)",
  "custas_honorarios": {
    "custas": "number",
    "honorarios": "number",
    "responsavel": "string"
  },
  "summary": "string (resumo da decisão em 2-3 frases)",
  "warnings": ["string (pontos críticos ou prazos urgentes)"]
}

IMPORTANTE:
- Identifique TODOS os prazos mencionados
- Extraia valores de condenações
- Identifique a parte vencedora
- Sinalize prazos críticos em "warnings"`

    case 'bank_statement':
      return `Analise este EXTRATO BANCÁRIO e extraia dados estruturados em JSON:

TEXTO DO DOCUMENTO:
${textPreview}

EXTRAIA (retorne em JSON):
{
  "banco": "string",
  "agencia": "string",
  "conta": "string",
  "titular": "string",
  "periodo": {
    "inicio": "string (DD/MM/YYYY)",
    "fim": "string (DD/MM/YYYY)"
  },
  "saldo_inicial": "number",
  "saldo_final": "number",
  "total_creditos": "number",
  "total_debitos": "number",
  "transacoes": [
    {
      "data": "string",
      "descricao": "string",
      "valor": "number",
      "tipo": "credito|debito"
    }
  ],
  "summary": "string (resumo do período)",
  "warnings": ["string (movimentações suspeitas ou importantes)"]
}

IMPORTANTE:
- Liste no máximo 20 transações (as mais relevantes)
- Identifique movimentações atípicas
- Calcule saldos médios`

    default:
      return `Analise este DOCUMENTO e extraia dados estruturados em JSON:

TEXTO DO DOCUMENTO:
${textPreview}

EXTRAIA (retorne em JSON):
{
  "tipo_documento": "string (identifique o tipo)",
  "data_documento": "string (DD/MM/YYYY)",
  "emissor": "string (quem emitiu)",
  "destinatario": "string (para quem é direcionado)",
  "assunto": "string",
  "informacoes_principais": {
    // Extraia os campos mais relevantes do documento
  },
  "datas_relevantes": ["string (datas importantes mencionadas)"],
  "valores_monetarios": ["string (valores mencionados)"],
  "partes_envolvidas": ["string"],
  "summary": "string (resumo do documento em 2-3 frases)",
  "warnings": ["string (pontos de atenção)"]
}

IMPORTANTE:
- Identifique o tipo de documento
- Extraia todas informações estruturadas possíveis
- Sinalize informações críticas em "warnings"`
  }
}

/**
 * Classify document type automatically
 */
export function classifyDocument(fileName: string, fileType: string): string {
  const lowerName = fileName.toLowerCase()

  if (lowerName.includes('rg') || lowerName.includes('cpf')) return 'Identidade'
  if (lowerName.includes('contrato')) return 'Contrato'
  if (lowerName.includes('sentenca') || lowerName.includes('acordao')) return 'Documento Judicial'
  if (lowerName.includes('extrato')) return 'Extrato Bancário'
  if (lowerName.includes('comprovante')) return 'Comprovante'
  if (lowerName.includes('procuracao')) return 'Procuração'

  if (fileType.includes('image')) return 'Imagem/Documento'
  if (fileType === 'application/pdf') return 'Documento PDF'

  return 'Documento Geral'
}
