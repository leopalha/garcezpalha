import { NextResponse } from 'next/server'
import { validateCertificate, getCertificateInfo } from '@/lib/signature/gov-br-signer'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * GET /api/admin/certificate
 * Retorna informações detalhadas do certificado digital configurado
 *
 * Para administradores verificarem status do certificado
 */
export async function GET() {
  try {
    const validation = await validateCertificate()
    const info = await getCertificateInfo()

    // Status resumido
    let status: 'ok' | 'warning' | 'error' | 'not_configured'

    if (!validation.configured) {
      status = 'not_configured'
    } else if (!validation.valid) {
      status = 'error'
    } else if (info && info.daysUntilExpiration <= 30) {
      status = 'warning'
    } else {
      status = 'ok'
    }

    return NextResponse.json({
      status,
      configured: validation.configured,
      valid: validation.valid,
      certificate: info
        ? {
            subject: info.subject,
            issuer: info.issuer,
            serialNumber: info.serialNumber,
            notBefore: info.notBefore.toISOString(),
            notAfter: info.notAfter.toISOString(),
            isValid: info.isValid,
            daysUntilExpiration: info.daysUntilExpiration,
            oab: info.oab,
            cpf: info.cpf,
            // Alertas
            warnings: [
              info.daysUntilExpiration <= 30
                ? `⚠️ Certificado expira em ${info.daysUntilExpiration} dias`
                : null,
              info.daysUntilExpiration <= 7
                ? '🚨 URGENTE: Renovar certificado imediatamente!'
                : null,
            ].filter(Boolean),
          }
        : null,
      error: validation.error,
      instructions: !validation.configured
        ? {
            message: 'Certificado digital não configurado',
            steps: [
              '1. Adquira um certificado e-OAB A1 ou e-CPF A1',
              '2. Converta o arquivo .pfx para base64',
              '3. Configure as variáveis de ambiente:',
              '   - CERTIFICADO_DIGITAL_BASE64',
              '   - CERTIFICADO_DIGITAL_SENHA',
              '4. Faça redeploy da aplicação',
            ],
            documentation: '/docs/CONFIGURACAO_CERTIFICADO_DIGITAL.md',
          }
        : undefined,
    })
  } catch (error) {
    console.error('[Admin] Erro ao verificar certificado:', error)

    return NextResponse.json(
      {
        status: 'error',
        configured: false,
        valid: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    )
  }
}
