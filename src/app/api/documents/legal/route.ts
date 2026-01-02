import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import {
  legalDocumentGenerator,
  type DocumentType,
  type DocumentData,
} from '@/lib/documents/legal-document-generator'

/**
 * P2-003: API endpoint para geração de documentos jurídicos (petições, recursos)
 * POST /api/documents/legal
 *
 * Body:
 * {
 *   "type": "peticao-inicial" | "contestacao" | "recurso-apelacao" | ...,
 *   "data": DocumentData
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, data } = body as { type: DocumentType; data: DocumentData }

    // Validação básica
    if (!type) {
      return NextResponse.json(
        { error: 'Tipo de documento não informado (type)' },
        { status: 400 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Dados do documento não informados (data)' },
        { status: 400 }
      )
    }

    // Validação de campos obrigatórios
    const requiredFields = ['autor', 'reu', 'advogado', 'comarca', 'fatos', 'fundamentacao', 'pedidos']
    const missingFields = requiredFields.filter((field) => !data[field as keyof DocumentData])

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: 'Campos obrigatórios faltando',
          missingFields,
        },
        { status: 400 }
      )
    }

    // Gera documento
    const document = legalDocumentGenerator.generate(type, data)

    // Retorna documento gerado
    return NextResponse.json({
      success: true,
      type,
      document,
      metadata: {
        generatedAt: new Date().toISOString(),
        comarca: data.comarca,
        categoria: data.categoria,
        numeroProcesso: data.numeroProcesso,
        valorCausa: data.valorCausa,
      },
    })
  } catch (error) {
    logger.error('Erro ao gerar documento:', error)

    return NextResponse.json(
      {
        error: 'Erro ao gerar documento',
        message: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/documents/legal?types=true
 * Retorna lista de tipos de documentos disponíveis
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const showTypes = searchParams.get('types') === 'true'

  if (showTypes) {
    return NextResponse.json({
      documentTypes: [
        { type: 'peticao-inicial', name: 'Petição Inicial' },
        { type: 'contestacao', name: 'Contestação' },
        { type: 'recurso-apelacao', name: 'Recurso de Apelação' },
        { type: 'recurso-agravo', name: 'Agravo de Instrumento' },
        { type: 'embargos-declaracao', name: 'Embargos de Declaração' },
        { type: 'mandado-seguranca', name: 'Mandado de Segurança' },
        { type: 'habeas-corpus', name: 'Habeas Corpus' },
        { type: 'acao-revisional', name: 'Ação Revisional' },
        { type: 'defesa-previa', name: 'Defesa Prévia' },
        { type: 'memoriais', name: 'Memoriais' },
      ],
    })
  }

  return NextResponse.json({
    message: 'API de Geração de Documentos Jurídicos',
    endpoints: {
      POST: '/api/documents/legal - Gera documento jurídico',
      GET: '/api/documents/legal?types=true - Lista tipos disponíveis',
    },
  })
}
