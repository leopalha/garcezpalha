import { NextRequest, NextResponse } from 'next/server'
import { documentGenerator, type DocumentType, type DocumentGenerationRequest } from '@/lib/ai/production/document-generator'
import { getTemplate, getAllTemplates, getAvailableDocumentTypes } from '@/lib/ai/production/template-engine'
import { PerformanceTimer, trackApiCall, trackError } from '@/lib/monitoring/observability'

/**
 * POST /api/documents/generate
 * Generate a new legal document
 */
export async function POST(request: NextRequest) {
  const timer = new PerformanceTimer('POST /api/documents/generate')

  try {
    const body = await request.json()

    // Validate required fields
    if (!body.leadId || !body.documentType || !body.clientData) {
      return NextResponse.json(
        { error: 'Missing required fields: leadId, documentType, clientData' },
        { status: 400 }
      )
    }

    // Validate document type
    const availableTypes = getAvailableDocumentTypes()
    if (!availableTypes.includes(body.documentType)) {
      return NextResponse.json(
        {
          error: `Invalid document type: ${body.documentType}`,
          availableTypes
        },
        { status: 400 }
      )
    }

    // Validate client data
    if (!body.clientData.name) {
      return NextResponse.json(
        { error: 'Client name is required' },
        { status: 400 }
      )
    }

    // Build generation request
    const generationRequest: DocumentGenerationRequest = {
      leadId: body.leadId,
      documentType: body.documentType as DocumentType,
      caseData: body.caseData || {},
      clientData: {
        name: body.clientData.name,
        cpf: body.clientData.cpf,
        rg: body.clientData.rg,
        address: body.clientData.address,
        email: body.clientData.email,
        phone: body.clientData.phone
      },
      lawyerData: body.lawyerData
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
    trackError(error as Error, { endpoint: '/api/documents/generate', method: 'POST' })
    console.error('[API] Error generating document:', error)
    return NextResponse.json(
      { error: 'Failed to generate document', details: error instanceof Error ? error instanceof Error ? error.message : String(error) : 'Unknown error' },
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
    console.error('[API] Error fetching templates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    )
  }
}
