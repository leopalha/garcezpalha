/**
 * ClickSign Digital Signature Service
 *
 * Official ClickSign API integration for digital contract signing
 *
 * Pricing: R$ 79/month (10 signatures included)
 * Additional: R$ 7.90 per signature after 10
 * Cheaper than DocuSign (R$ 25 per signature)
 *
 * Setup Instructions:
 * 1. Create account: https://app.clicksign.com
 * 2. Get API Access Token from Dashboard → API
 * 3. Add to .env:
 *    CLICKSIGN_API_TOKEN=your_api_token
 *    CLICKSIGN_WEBHOOK_SECRET=your_webhook_secret
 *
 * Docs: https://developers.clicksign.com
 */

const CLICKSIGN_API_URL = 'https://app.clicksign.com/api/v1'
const API_TOKEN = process.env.CLICKSIGN_API_TOKEN

interface ClickSignDocument {
  document: {
    key: string
    path: string
    filename: string
    status: 'running' | 'closed' | 'deleted'
    deadline_at: string | null
    created_at: string
    updated_at: string
    auto_close: boolean
    locale: string
  }
}

interface ClickSignSigner {
  signer: {
    key: string
    email: string
    name: string
    documentation: string
    birthday: string | null
    phone_number: string | null
    has_documentation: boolean
    auths: string[]
    delivery: 'email' | 'sms' | 'whatsapp'
    created_at: string
    updated_at: string
  }
}

interface CreateDocumentRequest {
  path: string // File path (will be uploaded separately)
  template?: {
    key: string
    data?: Record<string, string> // Variables for template
  }
}

interface CreateSignerRequest {
  email: string
  name: string
  documentation?: string // CPF
  phone_number?: string
  birthday?: string // YYYY-MM-DD
  auths: ('email' | 'sms' | 'whatsapp')[] // Authentication methods
  delivery: 'email' | 'sms' | 'whatsapp' // How to send signing link
}

export class ClickSignService {
  /**
   * Check if ClickSign is configured
   */
  isConfigured(): boolean {
    return !!API_TOKEN
  }

  /**
   * Upload contract document
   */
  async uploadDocument(filePath: string, filename: string): Promise<string | null> {
    if (!this.isConfigured()) {
      throw new Error('ClickSign not configured')
    }

    try {
      const FormData = require('form-data')
      const fs = require('fs')

      const form = new FormData()
      form.append('document[archive]', fs.createReadStream(filePath))
      form.append('document[path]', `/${filename}`)

      const response = await fetch(`${CLICKSIGN_API_URL}/documents`, {
        method: 'POST',
        headers: {
          ...form.getHeaders(),
          'Authorization': API_TOKEN!
        },
        body: form
      })

      if (!response.ok) {
        const error = await response.json()
        console.error('ClickSign upload error:', error)
        return null
      }

      const data: ClickSignDocument = await response.json()
      return data.document.key
    } catch (error) {
      console.error('Failed to upload document to ClickSign:', error)
      return null
    }
  }

  /**
   * Create document from template (recommended for contracts)
   */
  async createFromTemplate(
    templateKey: string,
    variables: Record<string, string>,
    outputPath: string
  ): Promise<string | null> {
    if (!this.isConfigured()) {
      throw new Error('ClickSign not configured')
    }

    try {
      const response = await fetch(`${CLICKSIGN_API_URL}/documents`, {
        method: 'POST',
        headers: {
          'Authorization': API_TOKEN!,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          document: {
            path: outputPath,
            template: {
              key: templateKey,
              data: variables
            }
          }
        })
      })

      if (!response.ok) {
        const error = await response.json()
        console.error('ClickSign template error:', error)
        return null
      }

      const data: ClickSignDocument = await response.json()
      return data.document.key
    } catch (error) {
      console.error('Failed to create document from template:', error)
      return null
    }
  }

  /**
   * Add signer to document
   */
  async addSigner(
    documentKey: string,
    signer: CreateSignerRequest
  ): Promise<boolean> {
    if (!this.isConfigured()) {
      return false
    }

    try {
      // Create signer first
      const signerResponse = await fetch(`${CLICKSIGN_API_URL}/signers`, {
        method: 'POST',
        headers: {
          'Authorization': API_TOKEN!,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ signer })
      })

      if (!signerResponse.ok) {
        console.error('Failed to create signer')
        return false
      }

      const signerData: ClickSignSigner = await signerResponse.json()
      const signerKey = signerData.signer.key

      // Add signer to document
      const addResponse = await fetch(`${CLICKSIGN_API_URL}/lists`, {
        method: 'POST',
        headers: {
          'Authorization': API_TOKEN!,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          list: {
            document_key: documentKey,
            signer_key: signerKey,
            sign_as: 'sign' // Options: 'sign', 'approve', 'party'
          }
        })
      })

      return addResponse.ok
    } catch (error) {
      console.error('Failed to add signer:', error)
      return false
    }
  }

  /**
   * Send document for signature (notifies all signers)
   */
  async sendDocument(
    documentKey: string,
    message?: string
  ): Promise<boolean> {
    if (!this.isConfigured()) {
      return false
    }

    try {
      const response = await fetch(
        `${CLICKSIGN_API_URL}/documents/${documentKey}/notify`,
        {
          method: 'POST',
          headers: {
            'Authorization': API_TOKEN!,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            request_signature_key: documentKey,
            message: message || 'Por favor, assine o documento digitalmente.'
          })
        }
      )

      return response.ok
    } catch (error) {
      console.error('Failed to send document:', error)
      return false
    }
  }

  /**
   * Get document status
   */
  async getDocumentStatus(documentKey: string): Promise<string | null> {
    if (!this.isConfigured()) {
      return null
    }

    try {
      const response = await fetch(
        `${CLICKSIGN_API_URL}/documents/${documentKey}`,
        {
          headers: {
            'Authorization': API_TOKEN!
          }
        }
      )

      if (!response.ok) {
        return null
      }

      const data: ClickSignDocument = await response.json()
      return data.document.status
    } catch (error) {
      console.error('Failed to get document status:', error)
      return null
    }
  }

  /**
   * Download signed document
   */
  async downloadSignedDocument(documentKey: string): Promise<Buffer | null> {
    if (!this.isConfigured()) {
      return null
    }

    try {
      const response = await fetch(
        `${CLICKSIGN_API_URL}/documents/${documentKey}/download`,
        {
          headers: {
            'Authorization': API_TOKEN!
          }
        }
      )

      if (!response.ok) {
        return null
      }

      const arrayBuffer = await response.arrayBuffer()
      return Buffer.from(arrayBuffer)
    } catch (error) {
      console.error('Failed to download document:', error)
      return null
    }
  }

  /**
   * Create contract workflow (complete automation)
   *
   * @param templateKey - ClickSign template ID
   * @param clientData - Client information for template variables
   * @param serviceType - Type of legal service
   * @param referenceValue - Reference value (OAB compliant, not fixed price)
   */
  async createContractWorkflow(
    templateKey: string,
    clientData: {
      name: string
      email: string
      cpf: string
      phone: string
    },
    serviceType: string,
    referenceValue: number
  ): Promise<{ documentKey: string; signingUrl: string } | null> {
    try {
      // Step 1: Create document from template with variables
      const variables = {
        cliente_nome: clientData.name,
        cliente_cpf: clientData.cpf,
        cliente_email: clientData.email,
        cliente_telefone: clientData.phone,
        servico: serviceType,
        valor_referencia: `R$ ${referenceValue.toFixed(2).replace('.', ',')}`,
        data: new Date().toLocaleDateString('pt-BR'),
        advogado_nome: 'Leonardo Mendonça Palha da Silva',
        advogado_oab: 'OAB/RJ 219.390',
        // OAB Compliance disclaimer
        disclaimer: 'Valor de referência sujeito a análise do caso. Orçamento personalizado após avaliação.'
      }

      const documentKey = await this.createFromTemplate(
        templateKey,
        variables,
        `/contracts/${Date.now()}_${clientData.name}.pdf`
      )

      if (!documentKey) {
        throw new Error('Failed to create document from template')
      }

      // Step 2: Add client as signer
      const signerAdded = await this.addSigner(documentKey, {
        email: clientData.email,
        name: clientData.name,
        documentation: clientData.cpf,
        phone_number: clientData.phone,
        auths: ['email'], // Can add 'sms' or 'whatsapp' for extra security
        delivery: 'email'
      })

      if (!signerAdded) {
        throw new Error('Failed to add signer')
      }

      // Step 3: Send document for signature
      const sent = await this.sendDocument(
        documentKey,
        `Olá ${clientData.name},\n\nSegue o contrato de ${serviceType} para assinatura digital.\n\nAtenciosamente,\nGarcez Palha - Consultoria Jurídica & Pericial`
      )

      if (!sent) {
        throw new Error('Failed to send document')
      }

      // Return document key and signing URL
      return {
        documentKey,
        signingUrl: `https://app.clicksign.com/sign/${documentKey}`
      }
    } catch (error) {
      console.error('Contract workflow error:', error)
      return null
    }
  }

  /**
   * Verify webhook signature (security)
   */
  verifyWebhookSignature(signature: string, payload: string): boolean {
    const webhookSecret = process.env.CLICKSIGN_WEBHOOK_SECRET
    if (!webhookSecret) {
      console.warn('CLICKSIGN_WEBHOOK_SECRET not configured')
      return false
    }

    try {
      const crypto = require('crypto')
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(payload)
        .digest('hex')

      return signature === expectedSignature
    } catch (error) {
      console.error('Failed to verify webhook signature:', error)
      return false
    }
  }
}

// Export singleton
export const clickSign = new ClickSignService()

/**
 * CLICKSIGN SETUP GUIDE:
 *
 * 1. Create Account:
 *    - Visit: https://app.clicksign.com
 *    - Choose plan: R$ 79/month (10 signatures)
 *
 * 2. Get API Token:
 *    - Go to Dashboard → Configurações → API
 *    - Copy Access Token
 *    - Add to .env: CLICKSIGN_API_TOKEN=your_token
 *
 * 3. Create Templates:
 *    - Go to Modelos de Documentos
 *    - Upload contract templates (.docx or .pdf)
 *    - Add variables: {{cliente_nome}}, {{servico}}, etc.
 *    - Save template key for use in code
 *
 * 4. Configure Webhook:
 *    - Go to Webhooks
 *    - URL: https://garcezpalha.com/api/clicksign/webhook
 *    - Events: document.signed, document.closed
 *    - Add secret to .env: CLICKSIGN_WEBHOOK_SECRET
 *
 * 5. Template Variables:
 *    - {{cliente_nome}} - Client name
 *    - {{cliente_cpf}} - Client CPF
 *    - {{cliente_email}} - Client email
 *    - {{cliente_telefone}} - Client phone
 *    - {{servico}} - Service type
 *    - {{valor_referencia}} - Reference value (OAB compliant)
 *    - {{data}} - Contract date
 *    - {{advogado_nome}} - Lawyer name
 *    - {{advogado_oab}} - OAB number
 *    - {{disclaimer}} - OAB pricing disclaimer
 */
