/**
 * AI Document Analyzer
 *
 * Uses GPT-4 Vision to analyze documents and extract structured data
 *
 * Supported document types:
 * - RG/CPF: Extract name, CPF, RG, date of birth, etc.
 * - Contracts: Analyze clauses, parties, values, dates
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
}

/**
 * Analyze document using GPT-4 Vision
 */
export async function analyzeDocument(
  publicUrl: string,
  fileType: string,
  fileName: string
): Promise<DocumentAnalysisResult> {
  try {
    // Determine analysis strategy based on file type
    if (fileType.includes('image')) {
      return await analyzeImageDocument(publicUrl, fileName)
    } else if (fileType === 'application/pdf') {
      return await analyzePDFDocument(publicUrl, fileName)
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
  }
}

/**
 * Analyze PDF documents
 * For now, uses simplified approach - in production, would extract text first
 */
async function analyzePDFDocument(
  publicUrl: string,
  fileName: string
): Promise<DocumentAnalysisResult> {
  // For PDFs, we'd ideally extract text first using pdf-parse or similar
  // Then send text to GPT-4 for analysis
  // For now, return placeholder

  const lowerName = fileName.toLowerCase()

  let documentType: DocumentAnalysisResult['type'] = 'generic'

  if (lowerName.includes('contrato')) {
    documentType = 'contract'
  } else if (lowerName.includes('sentenca') || lowerName.includes('acordao')) {
    documentType = 'court_document'
  } else if (lowerName.includes('extrato')) {
    documentType = 'bank_statement'
  }

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: 'Você é um assistente especializado em análise de documentos jurídicos.',
      },
      {
        role: 'user',
        content: `Baseado no nome do arquivo "${fileName}", que tipo de documento é este e quais informações devo esperar encontrar?

Retorne em formato JSON:
{
  "tipo_documento": "string",
  "informacoes_esperadas": ["string"],
  "campos_importantes": ["string"]
}`,
      },
    ],
    max_tokens: 500,
    temperature: 0.3,
  })

  const content = response.choices[0].message.content || '{}'

  let extractedData: Record<string, any> = {}

  try {
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/{[\s\S]*}/)
    if (jsonMatch) {
      extractedData = JSON.parse(jsonMatch[1] || jsonMatch[0])
    }
  } catch (error) {
    extractedData = { analysis: 'PDF analysis requires text extraction - pending implementation' }
  }

  return {
    type: documentType,
    extractedData,
    summary: `Documento PDF: ${fileName} (análise completa requer extração de texto)`,
    confidence: 0.6,
    warnings: [
      'Análise de PDF completa requer extração de texto. Esta é uma análise preliminar baseada no nome do arquivo.',
    ],
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
