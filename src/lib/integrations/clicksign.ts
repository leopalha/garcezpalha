/**
 * ClickSign Integration
 * Automated contract generation and signing flow
 * Triggered when conversation reaches 'contract_pending' state
 */

interface ClickSignConfig {
  apiKey: string
  baseUrl: string
}

interface ClickSignDocument {
  document: {
    path: string
    template?: {
      data: Record<string, any>
    }
  }
}

interface ClickSignSigner {
  email: string
  phone_number?: string
  auths: string[] // ['email', 'sms', 'whatsapp']
  name: string
  documentation?: string // CPF
  has_documentation?: boolean
}

interface ClickSignResponse {
  document: {
    key: string
    path: string
    filename: string
    uploaded_at: string
    updated_at: string
    finished_at: string | null
    deadline_at: string | null
    status: 'draft' | 'running' | 'closed' | 'canceled'
    auto_close: boolean
    locale: string
    signatures: any[]
    downloads: {
      original_file_url: string
      signed_file_url: string | null
      zip_file_url: string | null
    }
  }
}

export class ClickSignClient {
  private config: ClickSignConfig

  constructor() {
    this.config = {
      apiKey: process.env.CLICKSIGN_API_KEY || '',
      baseUrl: process.env.CLICKSIGN_BASE_URL || 'https://api.clicksign.com',
    }

    if (!this.config.apiKey || this.config.apiKey === 'your-clicksign-api-key') {
      console.warn('[ClickSign] API key not configured')
    }
  }

  /**
   * Check if ClickSign is configured
   */
  isConfigured(): boolean {
    return !!this.config.apiKey && this.config.apiKey !== 'your-clicksign-api-key'
  }

  /**
   * Create document from template
   */
  async createDocumentFromTemplate(params: {
    templateKey: string
    templateData: Record<string, any>
    filename: string
  }): Promise<ClickSignResponse> {
    if (!this.isConfigured()) {
      throw new Error('ClickSign not configured')
    }

    const response = await fetch(`${this.config.baseUrl}/v1/documents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        document: {
          path: `/${params.filename}`,
          template: {
            key: params.templateKey,
            data: params.templateData,
          },
        },
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`ClickSign API error: ${response.status} - ${error}`)
    }

    return response.json()
  }

  /**
   * Upload document (PDF)
   */
  async uploadDocument(params: {
    file: Blob
    filename: string
  }): Promise<ClickSignResponse> {
    if (!this.isConfigured()) {
      throw new Error('ClickSign not configured')
    }

    const formData = new FormData()
    formData.append('document[archive][original]', params.file, params.filename)

    const response = await fetch(`${this.config.baseUrl}/v1/documents`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: formData,
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`ClickSign API error: ${response.status} - ${error}`)
    }

    return response.json()
  }

  /**
   * Add signer to document
   */
  async addSigner(params: {
    documentKey: string
    signer: ClickSignSigner
    message?: string
  }): Promise<any> {
    if (!this.isConfigured()) {
      throw new Error('ClickSign not configured')
    }

    const response = await fetch(`${this.config.baseUrl}/v1/lists`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        list: {
          document_key: params.documentKey,
          signer_key: await this.getOrCreateSigner(params.signer),
          sign_as: 'sign',
          message: params.message || 'Por favor, assine o contrato.',
        },
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`ClickSign API error: ${response.status} - ${error}`)
    }

    return response.json()
  }

  /**
   * Get or create signer
   */
  private async getOrCreateSigner(signer: ClickSignSigner): Promise<string> {
    // First try to get existing signer by email
    const searchResponse = await fetch(
      `${this.config.baseUrl}/v1/signers?email=${encodeURIComponent(signer.email)}`,
      {
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
        },
      }
    )

    if (searchResponse.ok) {
      const data = await searchResponse.json()
      if (data.signers && data.signers.length > 0) {
        return data.signers[0].key
      }
    }

    // Create new signer
    const createResponse = await fetch(`${this.config.baseUrl}/v1/signers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        signer: {
          email: signer.email,
          phone_number: signer.phone_number,
          auths: signer.auths,
          name: signer.name,
          documentation: signer.documentation,
          has_documentation: signer.has_documentation || false,
        },
      }),
    })

    if (!createResponse.ok) {
      const error = await createResponse.text()
      throw new Error(`ClickSign API error creating signer: ${createResponse.status} - ${error}`)
    }

    const data = await createResponse.json()
    return data.signer.key
  }

  /**
   * Send document for signature
   */
  async sendDocument(documentKey: string): Promise<any> {
    if (!this.isConfigured()) {
      throw new Error('ClickSign not configured')
    }

    const response = await fetch(
      `${this.config.baseUrl}/v1/documents/${documentKey}/notify_signers`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          request_signature_key: documentKey,
          message: 'Seu contrato está pronto para assinatura!',
        }),
      }
    )

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`ClickSign API error: ${response.status} - ${error}`)
    }

    return response.json()
  }

  /**
   * Get document status
   */
  async getDocument(documentKey: string): Promise<ClickSignResponse> {
    if (!this.isConfigured()) {
      throw new Error('ClickSign not configured')
    }

    const response = await fetch(`${this.config.baseUrl}/v1/documents/${documentKey}`, {
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`ClickSign API error: ${response.status} - ${error}`)
    }

    return response.json()
  }

  /**
   * Cancel document
   */
  async cancelDocument(documentKey: string): Promise<any> {
    if (!this.isConfigured()) {
      throw new Error('ClickSign not configured')
    }

    const response = await fetch(`${this.config.baseUrl}/v1/documents/${documentKey}/cancel`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`ClickSign API error: ${response.status} - ${error}`)
    }

    return response.json()
  }
}

/**
 * Singleton instance
 */
let globalClickSignClient: ClickSignClient | null = null

export function getClickSignClient(): ClickSignClient {
  if (!globalClickSignClient) {
    globalClickSignClient = new ClickSignClient()
  }
  return globalClickSignClient
}

/**
 * Generate contract for conversation
 * Called when payment is confirmed and state transitions to 'contract_pending'
 */
export async function generateContractForConversation(params: {
  conversationId: string
  clientName: string
  clientEmail: string
  clientPhone?: string
  clientCPF?: string
  productName: string
  amount: number
  paymentProvider: string
}): Promise<{ documentKey: string; signUrl: string }> {
  const clicksign = getClickSignClient()

  if (!clicksign.isConfigured()) {
    console.warn('[ClickSign] Not configured, skipping contract generation')
    throw new Error('ClickSign not configured')
  }

  console.log('[ClickSign] Generating contract for conversation:', params.conversationId)

  try {
    // 1. Create document from template
    const document = await clicksign.createDocumentFromTemplate({
      templateKey: process.env.CLICKSIGN_CONTRACT_TEMPLATE_KEY || 'default-template',
      templateData: {
        client_name: params.clientName,
        client_email: params.clientEmail,
        client_phone: params.clientPhone || '',
        client_cpf: params.clientCPF || '',
        product_name: params.productName,
        amount: (params.amount / 100).toFixed(2), // Convert cents to reais
        date: new Date().toLocaleDateString('pt-BR'),
        payment_provider: params.paymentProvider,
      },
      filename: `contrato-${params.conversationId}-${Date.now()}.pdf`,
    })

    console.log('[ClickSign] Document created:', document.document.key)

    // 2. Add client as signer
    await clicksign.addSigner({
      documentKey: document.document.key,
      signer: {
        email: params.clientEmail,
        phone_number: params.clientPhone,
        auths: params.clientPhone ? ['email', 'sms'] : ['email'],
        name: params.clientName,
        documentation: params.clientCPF,
        has_documentation: !!params.clientCPF,
      },
      message: `Olá ${params.clientName}! Seu pagamento foi confirmado. Por favor, assine o contrato para iniciarmos seu caso.`,
    })

    console.log('[ClickSign] Signer added')

    // 3. Send document for signature
    await clicksign.sendDocument(document.document.key)

    console.log('[ClickSign] Document sent for signature')

    // 4. Generate sign URL
    const signUrl = `https://app.clicksign.com/sign/${document.document.key}`

    return {
      documentKey: document.document.key,
      signUrl,
    }
  } catch (error: any) {
    console.error('[ClickSign] Error generating contract:', error)
    throw error
  }
}

/**
 * Check contract status
 */
export async function checkContractStatus(documentKey: string): Promise<{
  status: 'draft' | 'running' | 'closed' | 'canceled'
  signedFileUrl: string | null
}> {
  const clicksign = getClickSignClient()

  const document = await clicksign.getDocument(documentKey)

  return {
    status: document.document.status,
    signedFileUrl: document.document.downloads.signed_file_url,
  }
}
