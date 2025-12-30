import { NextRequest, NextResponse } from 'next/server'
import { signPDF, validateCertificate } from '@/lib/signature/gov-br-signer'

// Force dynamic rendering - required for API routes
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * P2-003: Digital Signature API Endpoint
 * POST /api/documents/sign
 *
 * Assina documentos PDF com certificado digital ICP-Brasil (e-OAB ou e-CPF)
 *
 * Body (multipart/form-data):
 * - file: PDF file to sign
 * - reason: (optional) Signature reason
 * - location: (optional) Signature location
 * - contactInfo: (optional) Contact information
 *
 * Returns:
 * - 200: Signed PDF file
 * - 400: Invalid request
 * - 500: Signature error
 */
export async function POST(req: NextRequest) {
  try {
    // Validar certificado antes de processar
    const certValidation = await validateCertificate()

    if (!certValidation.configured) {
      return NextResponse.json(
        {
          error: 'Certificado digital não configurado',
          message:
            'Configure as variáveis CERTIFICADO_DIGITAL_BASE64 e CERTIFICADO_DIGITAL_SENHA',
        },
        { status: 500 }
      )
    }

    if (!certValidation.valid) {
      return NextResponse.json(
        {
          error: 'Certificado inválido ou expirado',
          message: certValidation.error || 'Certificado não está válido',
          info: certValidation.info,
        },
        { status: 500 }
      )
    }

    // Parse multipart form data
    const formData = await req.formData()
    const file = formData.get('file') as File
    const reason = (formData.get('reason') as string) || 'Assinatura Digital'
    const location = (formData.get('location') as string) || 'Brasil'
    const contactInfo = formData.get('contactInfo') as string

    if (!file) {
      return NextResponse.json(
        {
          error: 'Arquivo não fornecido',
          message: 'Envie um arquivo PDF no campo "file"',
        },
        { status: 400 }
      )
    }

    // Validar tipo de arquivo
    if (!file.type.includes('pdf') && !file.name.endsWith('.pdf')) {
      return NextResponse.json(
        {
          error: 'Tipo de arquivo inválido',
          message: 'Apenas arquivos PDF são aceitos',
        },
        { status: 400 }
      )
    }

    // Converter File para Buffer
    const arrayBuffer = await file.arrayBuffer()
    const pdfBuffer = Buffer.from(arrayBuffer)

    console.log('[API] Assinando PDF:', {
      filename: file.name,
      size: `${pdfBuffer.length} bytes`,
      reason,
      location,
    })

    // Assinar PDF
    const result = await signPDF(pdfBuffer, {
      reason,
      location,
      contactInfo,
    })

    if (!result.success) {
      return NextResponse.json(
        {
          error: 'Erro ao assinar documento',
          message: result.error,
        },
        { status: 500 }
      )
    }

    // Retornar PDF assinado
    const filename = file.name.replace('.pdf', '_assinado.pdf')

    return new NextResponse(result.signedPdf, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'X-Certificate-Subject': result.certificateInfo?.subject || '',
        'X-Certificate-Valid-Until': result.certificateInfo?.notAfter.toISOString() || '',
        'X-Signature-Timestamp': result.timestamp,
      },
    })
  } catch (error) {
    console.error('[API] Erro ao processar assinatura:', error)

    return NextResponse.json(
      {
        error: 'Erro ao processar assinatura',
        message: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/documents/sign
 * Retorna status do certificado digital
 */
export async function GET() {
  try {
    const validation = await validateCertificate()

    return NextResponse.json({
      configured: validation.configured,
      valid: validation.valid,
      certificate: validation.info
        ? {
            subject: validation.info.subject,
            issuer: validation.info.issuer,
            notBefore: validation.info.notBefore,
            notAfter: validation.info.notAfter,
            isValid: validation.info.isValid,
            daysUntilExpiration: validation.info.daysUntilExpiration,
            oab: validation.info.oab,
            cpf: validation.info.cpf,
          }
        : null,
      error: validation.error,
    })
  } catch (error) {
    return NextResponse.json(
      {
        configured: false,
        valid: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    )
  }
}
