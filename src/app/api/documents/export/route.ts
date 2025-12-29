import { NextRequest, NextResponse } from 'next/server'
import { reviewQueueManager } from '@/lib/ai/production/review-queue'
import { documentGenerator } from '@/lib/ai/production/document-generator'
import { docxExporter } from '@/lib/ai/production/docx-exporter'

/**
 * GET /api/documents/export
 * Export document to DOCX format
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const documentId = searchParams.get('documentId')
    const format = searchParams.get('format') || 'docx'

    if (!documentId) {
      return NextResponse.json(
        { error: 'documentId is required' },
        { status: 400 }
      )
    }

    // Get document
    const document = await documentGenerator.getDocument(documentId)
    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }

    // Check if document is approved (optional - can remove for drafts)
    // if (document.status !== 'approved') {
    //   return NextResponse.json(
    //     { error: 'Only approved documents can be exported' },
    //     { status: 403 }
    //   )
    // }

    if (format === 'docx') {
      // Export to DOCX
      const result = await docxExporter.exportToDocx({
        title: document.title,
        content: document.content,
        author: 'Garcez Palha - Inteligencia Juridica',
        lawyerName: document.variables.ADVOGADO_NOME,
        lawyerOab: document.variables.ADVOGADO_OAB,
        clientName: document.variables.CLIENTE_NOME,
        includeHeader: true,
        includeFooter: true,
        includePageNumbers: true
      })

      if (!result.success || !result.buffer) {
        return NextResponse.json(
          { error: 'Export failed', details: result.error },
          { status: 500 }
        )
      }

      // Return file as download
      return new NextResponse(new Uint8Array(result.buffer), {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'Content-Disposition': `attachment; filename="${result.filename}"`,
          'Content-Length': result.buffer.length.toString()
        }
      })

    } else if (format === 'text' || format === 'txt') {
      // Return plain text
      return new NextResponse(document.content, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Content-Disposition': `attachment; filename="${document.title.replace(/[^a-z0-9]/gi, '_')}.txt"`
        }
      })

    } else if (format === 'json') {
      // Return full document data
      return NextResponse.json({
        document: {
          id: document.id,
          title: document.title,
          type: document.documentType,
          content: document.content,
          variables: document.variables,
          status: document.status,
          createdAt: document.createdAt.toISOString(),
          reviewedAt: document.reviewedAt?.toISOString(),
          reviewedBy: document.reviewedBy,
          reviewNotes: document.reviewNotes
        }
      })

    } else {
      return NextResponse.json(
        { error: `Unsupported format: ${format}. Supported: docx, text, json` },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('[API] Error exporting document:', error)
    return NextResponse.json(
      { error: 'Failed to export document', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/documents/export
 * Export document and return base64 (for API integrations)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { documentId, format = 'docx' } = body

    if (!documentId) {
      return NextResponse.json(
        { error: 'documentId is required' },
        { status: 400 }
      )
    }

    // Get document
    const document = await documentGenerator.getDocument(documentId)
    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }

    if (format === 'docx') {
      // Export to base64
      const result = await docxExporter.exportToBase64({
        title: document.title,
        content: document.content,
        author: 'Garcez Palha - Inteligencia Juridica',
        lawyerName: document.variables.ADVOGADO_NOME,
        lawyerOab: document.variables.ADVOGADO_OAB,
        clientName: document.variables.CLIENTE_NOME,
        includeHeader: true,
        includeFooter: true,
        includePageNumbers: true
      })

      if (!result.success) {
        return NextResponse.json(
          { error: 'Export failed', details: result.error },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        format: 'docx',
        encoding: 'base64',
        data: result.data,
        documentTitle: document.title,
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      })

    } else {
      return NextResponse.json(
        { error: `Unsupported format for POST: ${format}. Use GET for text/json` },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('[API] Error exporting document:', error)
    return NextResponse.json(
      { error: 'Failed to export document', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
