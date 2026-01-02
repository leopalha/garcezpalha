import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { documentGenerator, type DocumentType, type DocumentGenerationRequest } from '@/lib/ai/production/document-generator'
import { getTemplate, getAllTemplates, getAvailableDocumentTypes } from '@/lib/ai/production/template-engine'
import { PerformanceTimer, trackApiCall, trackError } from '@/lib/monitoring/observability'
import { formatZodErrors } from '@/lib/zod-helpers'
import { logger } from '@/lib/logger'

// Document generation schema
const clientDataSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  cpf: z.string().optional(),
  rg: z.string().optional(),
  address: z.string().optional(),
  email: z.string().email('Email inválido').optional(),
  phone: z.string().optional(),
})

const documentGenerationSchema = z.object({
  leadId: z.string().uuid('ID do lead inválido'),
  documentType: z.string().min(1, 'Tipo de documento é obrigatório'),
  clientData: clientDataSchema,
  caseData: z.record(z.string(), z.any()).optional(),
  lawyerData: z.object({
    name: z.string(),
    oab: z.string(),
  }).optional(),
})

/**
 * POST /api/documents/generate
 * Generate a new legal document
 */
export async function POST(request: NextRequest) {
  const timer = new PerformanceTimer('POST /api/documents/generate')

  try {
    const body = await request.json()

    // Validate with Zod
    const validatedData = documentGenerationSchema.parse(body)

    // Validate document type against available types
    const availableTypes = getAvailableDocumentTypes()
    if (!availableTypes.includes(validatedData.documentType)) {
      return NextResponse.json(
        {
          error: `Invalid document type: ${validatedData.documentType}`,
          availableTypes
        },
        { status: 400 }
      )
    }

    // Build generation request
    const generationRequest: DocumentGenerationRequest = {
      leadId: validatedData.leadId,
      documentType: validatedData.documentType as DocumentType,
      caseData: validatedData.caseData || {},
      clientData: {
        name: validatedData.clientData.name,
        cpf: validatedData.clientData.cpf,
        rg: validatedData.clientData.rg,
        address: validatedData.clientData.address,
        email: validatedData.clientData.email,
        phone: validatedData.clientData.phone
      },
      lawyerData: validatedData.lawyerData
    }

    // Generate document
    const document = await documentGenerator.generateDocument(generationRequest)

    const duration = timer.end()
    trackApiCall('/api/documents/generate', duration, 200, { documentId: document.id, type: document.documentType })

    return NextResponse.json({
      success: true,
      document: {
        id: document.id,
        title: document.title,
        type: document.documentType,
        status: document.status,
        createdAt: document.createdAt.toISOString()
      },
      message: 'Document generated and added to review queue'
    })

  } catch (error) {
    timer.end()

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Dados inválidos',
          details: formatZodErrors(error),
        },
        { status: 400 }
      )
    }

    trackError(error as Error, { endpoint: '/api/documents/generate', method: 'POST' })
    logger.error('[API] Error generating document:', error)
    return NextResponse.json(
      { error: 'Failed to generate document', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

/**
 * GET /api/documents/generate
 * Get available templates and document types
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type')

    // If type specified, return that template
    if (type) {
      const template = getTemplate(type)
      if (!template) {
        return NextResponse.json(
          { error: `Template not found: ${type}` },
          { status: 404 }
        )
      }

      return NextResponse.json({
        template: {
          id: template.id,
          title: template.title,
          category: template.category,
          description: template.description,
          requiredVariables: template.requiredVariables,
          optionalVariables: template.optionalVariables,
          estimatedPages: template.estimatedPages,
          requiresAI: template.requiresAI
        }
      })
    }

    // Return all templates
    const templates = getAllTemplates()

    return NextResponse.json({
      templates: templates.map(t => ({
        id: t.id,
        title: t.title,
        category: t.category,
        description: t.description,
        requiredVariables: t.requiredVariables,
        estimatedPages: t.estimatedPages
      })),
      categories: ['financeiro', 'imobiliario', 'previdenciario', 'criminal', 'trabalhista', 'consumidor', 'geral']
    })

  } catch (error) {
    logger.error('[API] Error fetching templates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    )
  }
}
