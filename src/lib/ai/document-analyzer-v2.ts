import { createLogger } from '@/lib/logger'
import OpenAI from 'openai'

const logger = createLogger('document-analyzer-v2')

// Lazy-loaded OpenAI client to avoid build-time initialization errors
let openaiClient: OpenAI | null = null
function getOpenAI(): OpenAI {
  if (!openaiClient) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not configured')
    }
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }
  return openaiClient
}

export interface OCRResult {
  text: string
  confidence: number
  language: string
  pageCount?: number
}

export interface DocumentClassification {
  type: string
  confidence: number
  possibleTypes: Array<{ type: string; confidence: number }>
}

export interface ExtractedEntity {
  type: 'person' | 'cpf' | 'cnpj' | 'date' | 'amount' | 'address' | 'phone' | 'email' | 'oab'
  value: string
  label: string
  confidence: number
  isValid?: boolean
}

export interface DocumentSummary {
  summary: string
  keyPoints: string[]
  wordCount: number
}

/**
 * Perform OCR on document using OpenAI Vision
 * For production, consider using specialized OCR services like:
 * - Google Cloud Vision
 * - AWS Textract
 * - Azure Document Intelligence
 */
export async function performOCR(imageUrl: string): Promise<OCRResult> {
  try {
    logger.info('Starting OCR', { imageUrl })

    const response = await getOpenAI().chat.completions.create({
      model: 'gpt-4o', // GPT-4 with vision
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Extract ALL text from this document. Return ONLY the extracted text, nothing else. Maintain the original formatting and structure as much as possible.'
            },
            {
              type: 'image_url',
              image_url: {
                url: imageUrl,
                detail: 'high'
              }
            }
          ]
        }
      ],
      max_tokens: 4000
    })

    const extractedText = response.choices[0]?.message?.content || ''

    logger.info('OCR completed', { textLength: extractedText.length })

    return {
      text: extractedText,
      confidence: 95, // OpenAI doesn't provide confidence, using high default
      language: detectLanguage(extractedText),
      pageCount: 1
    }

  } catch (error) {
    logger.error('Error in OCR', error)
    throw new Error('Failed to perform OCR')
  }
}

/**
 * Classify document type
 */
export async function classifyDocument(text: string): Promise<DocumentClassification> {
  try {
    logger.info('Classifying document', { textLength: text.length })

    const response = await getOpenAI().chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a document classifier for a Brazilian law firm. Classify documents into one of these types:
- rg: RG (Identity Document)
- cpf: CPF document
- cnpj: CNPJ document
- comprovante_residencia: Proof of residence
- contrato: Contract
- procuracao: Power of Attorney
- peticao: Legal petition
- sentenca: Court sentence/ruling
- certidao: Certificate
- declaracao: Declaration
- outros: Other

Respond ONLY with a JSON object in this format:
{
  "type": "document_type",
  "confidence": 0-100,
  "reasoning": "brief explanation"
}`
        },
        {
          role: 'user',
          content: `Classify this document:\n\n${text.substring(0, 2000)}`
        }
      ],
      response_format: { type: 'json_object' }
    })

    const result = JSON.parse(response.choices[0]?.message?.content || '{}')

    logger.info('Classification completed', { type: result.type, confidence: result.confidence })

    return {
      type: result.type || 'outros',
      confidence: result.confidence || 50,
      possibleTypes: [
        { type: result.type || 'outros', confidence: result.confidence || 50 }
      ]
    }

  } catch (error) {
    logger.error('Error in classification', error)
    return {
      type: 'outros',
      confidence: 0,
      possibleTypes: []
    }
  }
}

/**
 * Extract structured entities from document
 */
export async function extractEntities(text: string): Promise<ExtractedEntity[]> {
  try {
    logger.info('Extracting entities', { textLength: text.length })

    const response = await getOpenAI().chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a data extraction specialist for legal documents in Brazil. Extract ALL entities from the text.

Entity types:
- person: Names of people
- cpf: CPF numbers (format: XXX.XXX.XXX-XX)
- cnpj: CNPJ numbers (format: XX.XXX.XXX/XXXX-XX)
- date: Dates in any format
- amount: Monetary amounts
- address: Full addresses
- phone: Phone numbers
- email: Email addresses
- oab: OAB registration numbers

Respond ONLY with a JSON array of objects in this format:
{
  "entities": [
    {
      "type": "entity_type",
      "value": "extracted value",
      "label": "user-friendly description"
    }
  ]
}`
        },
        {
          role: 'user',
          content: `Extract entities from this document:\n\n${text.substring(0, 3000)}`
        }
      ],
      response_format: { type: 'json_object' }
    })

    const content = response.choices[0]?.message?.content || '{}'
    let result: any

    try {
      result = JSON.parse(content)
      // Handle both array and object with entities array
      if (Array.isArray(result)) {
        result = { entities: result }
      }
    } catch {
      result = { entities: [] }
    }

    const entities: ExtractedEntity[] = (result.entities || []).map((entity: any) => ({
      type: entity.type,
      value: entity.value,
      label: entity.label || entity.value,
      confidence: 85,
      isValid: entity.type === 'cpf' || entity.type === 'cnpj' ? undefined : true
    }))

    logger.info('Extraction completed', { entityCount: entities.length })

    return entities

  } catch (error) {
    logger.error('Error in entity extraction', error)
    return []
  }
}

/**
 * Generate document summary
 */
export async function summarizeDocument(text: string): Promise<DocumentSummary> {
  try {
    logger.info('Summarizing document', { textLength: text.length })

    const response = await getOpenAI().chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a legal document summarizer. Create a concise summary in Portuguese.

Respond ONLY with a JSON object in this format:
{
  "summary": "2-3 sentence summary of the document",
  "keyPoints": ["key point 1", "key point 2", "key point 3"]
}`
        },
        {
          role: 'user',
          content: `Summarize this document:\n\n${text}`
        }
      ],
      response_format: { type: 'json_object' }
    })

    const result = JSON.parse(response.choices[0]?.message?.content || '{}')

    logger.info('Summarization completed')

    return {
      summary: result.summary || 'Resumo não disponível',
      keyPoints: result.keyPoints || [],
      wordCount: text.split(/\s+/).length
    }

  } catch (error) {
    logger.error('Error in summarization', error)
    return {
      summary: 'Erro ao gerar resumo',
      keyPoints: [],
      wordCount: text.split(/\s+/).length
    }
  }
}

/**
 * Validate document (check if extracted data is valid)
 */
export function validateDocument(entities: ExtractedEntity[]): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  for (const entity of entities) {
    if (entity.type === 'cpf') {
      // CPF validation will be done by PostgreSQL function
      // This is just a placeholder
      if (!entity.value.match(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)) {
        errors.push(`CPF inválido: ${entity.value}`)
      }
    } else if (entity.type === 'cnpj') {
      if (!entity.value.match(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/)) {
        errors.push(`CNPJ inválido: ${entity.value}`)
      }
    } else if (entity.type === 'email') {
      if (!entity.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        errors.push(`Email inválido: ${entity.value}`)
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Compare two documents for similarity
 */
export async function compareDocuments(
  textA: string,
  textB: string
): Promise<{
  similarityScore: number
  differences: string[]
  matchingSections: string[]
}> {
  try {
    logger.info('Comparing documents', {
      lengthA: textA.length,
      lengthB: textB.length
    })

    const response = await getOpenAI().chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a document comparison specialist. Compare two documents and identify similarities and differences.

Respond ONLY with a JSON object in this format:
{
  "similarityScore": 0-100,
  "differences": ["difference 1", "difference 2"],
  "matchingSections": ["matching section 1", "matching section 2"]
}`
        },
        {
          role: 'user',
          content: `Compare these documents:

DOCUMENT A:
${textA.substring(0, 2000)}

DOCUMENT B:
${textB.substring(0, 2000)}`
        }
      ],
      response_format: { type: 'json_object' }
    })

    const result = JSON.parse(response.choices[0]?.message?.content || '{}')

    logger.info('Comparison completed', { similarity: result.similarityScore })

    return {
      similarityScore: result.similarityScore || 0,
      differences: result.differences || [],
      matchingSections: result.matchingSections || []
    }

  } catch (error) {
    logger.error('Error in document comparison', error)
    return {
      similarityScore: 0,
      differences: [],
      matchingSections: []
    }
  }
}

/**
 * Detect language (simple heuristic)
 */
function detectLanguage(text: string): string {
  const portugueseWords = ['de', 'da', 'do', 'que', 'para', 'com', 'não', 'uma', 'os', 'as']
  const words = text.toLowerCase().split(/\s+/)
  const portugueseCount = words.filter(word => portugueseWords.includes(word)).length

  return portugueseCount > 5 ? 'pt' : 'unknown'
}

/**
 * Document analyzer facade
 */
export const DocumentAnalyzer = {
  performOCR,
  classifyDocument,
  extractEntities,
  summarizeDocument,
  validateDocument,
  compareDocuments
}

export default DocumentAnalyzer
