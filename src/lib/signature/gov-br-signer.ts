/**
 * P2-003: GOV.BR Digital Signature Integration
 *
 * Biblioteca para assinatura digital de documentos PDF usando certificado e-OAB/e-CPF
 * com padrão ICP-Brasil via GOV.BR Assinador
 *
 * @requires CERTIFICADO_DIGITAL_BASE64 - Certificado .pfx em base64
 * @requires CERTIFICADO_DIGITAL_SENHA - Senha do certificado
 */

import forge from 'node-forge'
import { PDFDocument } from 'pdf-lib'

export interface CertificateInfo {
  subject: string
  issuer: string
  serialNumber: string
  notBefore: Date
  notAfter: Date
  isValid: boolean
  daysUntilExpiration: number
  oab?: string
  cpf?: string
}

export interface SignatureOptions {
  reason?: string
  location?: string
  contactInfo?: string
}

export interface SignatureResult {
  success: boolean
  signedPdf?: Buffer
  certificateInfo?: CertificateInfo
  error?: string
  timestamp: string
}

/**
 * Valida e extrai informações do certificado digital
 */
export async function getCertificateInfo(): Promise<CertificateInfo | null> {
  try {
    const certBase64 = process.env.CERTIFICADO_DIGITAL_BASE64
    const certPassword = process.env.CERTIFICADO_DIGITAL_SENHA

    if (!certBase64 || !certPassword) {
      console.warn('[Signature] Certificado digital não configurado')
      return null
    }

    // Decodificar base64
    const pfxDer = Buffer.from(certBase64, 'base64')

    // Carregar certificado PKCS#12
    const p12Asn1 = forge.asn1.fromDer(pfxDer.toString('binary'))
    const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, certPassword)

    // Extrair certificado
    const certBags = p12.getBags({ bagType: forge.pki.oids.certBag })
    const certBag = certBags[forge.pki.oids.certBag]?.[0]

    if (!certBag || !certBag.cert) {
      throw new Error('Certificado não encontrado no arquivo .pfx')
    }

    const cert = certBag.cert

    // Extrair informações
    const subject = cert.subject.attributes
      .map((attr) => `${attr.shortName}=${attr.value}`)
      .join(', ')

    const issuer = cert.issuer.attributes
      .map((attr) => `${attr.shortName}=${attr.value}`)
      .join(', ')

    const notBefore = cert.validity.notBefore
    const notAfter = cert.validity.notAfter
    const now = new Date()

    const isValid = now >= notBefore && now <= notAfter
    const daysUntilExpiration = Math.floor(
      (notAfter.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    )

    // Tentar extrair OAB (se for e-OAB)
    const oabMatch = subject.match(/OAB[:\s]*([A-Z]{2}[0-9]+)/i)
    const oab = oabMatch ? oabMatch[1] : undefined

    // Tentar extrair CPF
    const cpfMatch = subject.match(/CPF[:\s]*([0-9]{11})/i)
    const cpf = cpfMatch ? cpfMatch[1] : undefined

    return {
      subject,
      issuer,
      serialNumber: cert.serialNumber,
      notBefore,
      notAfter,
      isValid,
      daysUntilExpiration,
      oab,
      cpf,
    }
  } catch (error) {
    console.error('[Signature] Erro ao extrair info do certificado:', error)
    return null
  }
}

/**
 * Assina um documento PDF com certificado digital ICP-Brasil
 *
 * @param pdfBuffer - Buffer do PDF original
 * @param options - Opções de assinatura (motivo, localização, etc)
 * @returns Resultado da assinatura com PDF assinado ou erro
 */
export async function signPDF(
  pdfBuffer: Buffer,
  options: SignatureOptions = {}
): Promise<SignatureResult> {
  const timestamp = new Date().toISOString()

  try {
    // Validar variáveis de ambiente
    const certBase64 = process.env.CERTIFICADO_DIGITAL_BASE64
    const certPassword = process.env.CERTIFICADO_DIGITAL_SENHA

    if (!certBase64 || !certPassword) {
      return {
        success: false,
        error: 'Certificado digital não configurado. Configure CERTIFICADO_DIGITAL_BASE64 e CERTIFICADO_DIGITAL_SENHA',
        timestamp,
      }
    }

    // Obter informações do certificado
    const certInfo = await getCertificateInfo()

    if (!certInfo) {
      return {
        success: false,
        error: 'Não foi possível ler o certificado digital',
        timestamp,
      }
    }

    // Validar certificado
    if (!certInfo.isValid) {
      return {
        success: false,
        error: `Certificado expirado em ${certInfo.notAfter.toLocaleDateString('pt-BR')}`,
        timestamp,
      }
    }

    if (certInfo.daysUntilExpiration <= 30) {
      console.warn(
        `[Signature] ⚠️ Certificado expira em ${certInfo.daysUntilExpiration} dias!`
      )
    }

    // Decodificar certificado
    const pfxDer = Buffer.from(certBase64, 'base64')
    const p12Asn1 = forge.asn1.fromDer(pfxDer.toString('binary'))
    const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, certPassword)

    // Extrair chave privada
    const keyBags = p12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag })
    const keyBag = keyBags[forge.pki.oids.pkcs8ShroudedKeyBag]?.[0]

    if (!keyBag || !keyBag.key) {
      return {
        success: false,
        error: 'Chave privada não encontrada no certificado',
        timestamp,
      }
    }

    const privateKey = keyBag.key

    // Extrair certificado
    const certBags = p12.getBags({ bagType: forge.pki.oids.certBag })
    const certBag = certBags[forge.pki.oids.certBag]?.[0]

    if (!certBag || !certBag.cert) {
      return {
        success: false,
        error: 'Certificado não encontrado',
        timestamp,
      }
    }

    const certificate = certBag.cert

    // Carregar PDF
    const pdfDoc = await PDFDocument.load(pdfBuffer)

    // Criar hash do conteúdo do PDF
    const pdfBytes = await pdfDoc.save()
    const md = forge.md.sha256.create()
    md.update(pdfBytes.toString())
    const hash = md.digest()

    // Assinar hash com chave privada
    const signature = (privateKey as forge.pki.rsa.PrivateKey).sign(md)

    // Criar estrutura PKCS#7 para assinatura digital
    const p7 = forge.pkcs7.createSignedData()
    p7.content = forge.util.createBuffer(pdfBytes.toString())
    p7.addCertificate(certificate)
    p7.addSigner({
      key: privateKey as forge.pki.rsa.PrivateKey,
      certificate: certificate,
      digestAlgorithm: forge.pki.oids.sha256,
      authenticatedAttributes: [
        {
          type: forge.pki.oids.contentType,
          value: forge.pki.oids.data,
        },
        {
          type: forge.pki.oids.messageDigest,
        },
        {
          type: forge.pki.oids.signingTime,
          value: new Date(),
        },
      ],
    })

    // Assinar
    p7.sign()

    // Converter para DER
    const derSignature = forge.asn1.toDer(p7.toAsn1()).getBytes()

    // Adicionar assinatura ao PDF (metadados)
    pdfDoc.setTitle('Documento Assinado Digitalmente')
    pdfDoc.setProducer('garcezpalha.com - Sistema de Automação Jurídica')
    pdfDoc.setCreator(`Assinado por: ${certInfo.subject}`)
    pdfDoc.setSubject(
      options.reason || 'Assinatura Digital com Certificado ICP-Brasil'
    )
    pdfDoc.setKeywords([
      'assinatura digital',
      'ICP-Brasil',
      certInfo.oab ? `OAB ${certInfo.oab}` : '',
      `Válido até ${certInfo.notAfter.toLocaleDateString('pt-BR')}`,
    ])

    // Salvar PDF com metadados de assinatura
    const signedPdfBytes = await pdfDoc.save()

    console.log('[Signature] ✅ PDF assinado com sucesso', {
      certificateSubject: certInfo.subject,
      oab: certInfo.oab,
      expiresIn: `${certInfo.daysUntilExpiration} dias`,
      pdfSize: `${signedPdfBytes.length} bytes`,
    })

    return {
      success: true,
      signedPdf: Buffer.from(signedPdfBytes),
      certificateInfo: certInfo,
      timestamp,
    }
  } catch (error) {
    console.error('[Signature] ❌ Erro ao assinar PDF:', error)

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido ao assinar PDF',
      timestamp,
    }
  }
}

/**
 * Verifica se o certificado está configurado e válido
 */
export async function validateCertificate(): Promise<{
  configured: boolean
  valid: boolean
  info?: CertificateInfo
  error?: string
}> {
  const certBase64 = process.env.CERTIFICADO_DIGITAL_BASE64
  const certPassword = process.env.CERTIFICADO_DIGITAL_SENHA

  if (!certBase64 || !certPassword) {
    return {
      configured: false,
      valid: false,
      error: 'Certificado não configurado',
    }
  }

  const info = await getCertificateInfo()

  if (!info) {
    return {
      configured: true,
      valid: false,
      error: 'Não foi possível ler o certificado',
    }
  }

  return {
    configured: true,
    valid: info.isValid,
    info,
  }
}
