/**
 * PJe (Processo Judicial Eletrônico) Integration
 * Real integration with Brazilian electronic court system
 * Docs: https://www.pje.jus.br/wiki/
 */

import { logger } from '@/lib/logger'
import * as cheerio from 'cheerio' // For HTML parsing
import { XMLParser } from 'fast-xml-parser'

const PJE_BASE_URL = process.env.PJE_BASE_URL || ''
const PJE_USERNAME = process.env.PJE_USERNAME || ''
const PJE_PASSWORD = process.env.PJE_PASSWORD || ''
const PJE_CERTIFICATE_PATH = process.env.PJE_CERTIFICATE_PATH || ''
const PJE_CERTIFICATE_PASSWORD = process.env.PJE_CERTIFICATE_PASSWORD || ''

type PJeProcess = {
  processNumber: string
  tribunal: string
  court: string
  judge: string
  parties: Array<{
    type: 'plaintiff' | 'defendant' | 'lawyer' | 'other'
    name: string
    document?: string
  }>
  movements: Array<{
    date: string
    description: string
    type: string
    hasDocument: boolean
  }>
  status: string
  class: string
  subject: string
  distributionDate: string
  value?: number
}

type PJeMovement = {
  codigo: number
  dataHora: string
  descricao: string
  complemento?: string
  documento?: {
    id: string
    nome: string
    tipo: string
  }
}

export class PJeClient {
  private baseUrl: string
  private username: string
  private password: string
  private sessionCookie?: string
  private xmlParser: XMLParser

  constructor() {
    this.baseUrl = PJE_BASE_URL
    this.username = PJE_USERNAME
    this.password = PJE_PASSWORD
    this.xmlParser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
    })

    if (!this.isConfigured()) {
      logger.warn('[PJe] Integration not configured - missing credentials or base URL')
    }
  }

  /**
   * Check if PJe is configured
   */
  isConfigured(): boolean {
    return !!(this.baseUrl && this.username && this.password)
  }

  /**
   * Authenticate with PJe system
   */
  async authenticate(): Promise<void> {
    if (!this.isConfigured()) {
      throw new Error('PJe not configured')
    }

    try {
      // Most PJe instances use digital certificate authentication
      // For development/testing, we use username/password
      const response = await fetch(`${this.baseUrl}/login.seam`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'loginForm:username': this.username,
          'loginForm:password': this.password,
          'loginForm:login': 'Entrar',
        }),
      })

      if (!response.ok) {
        throw new Error(`PJe authentication failed: ${response.status}`)
      }

      // Extract session cookie
      const cookies = response.headers.get('set-cookie')
      if (cookies) {
        const match = cookies.match(/JSESSIONID=([^;]+)/)
        if (match) {
          this.sessionCookie = match[1]
          logger.info('[PJe] Authentication successful')
        }
      }

      if (!this.sessionCookie) {
        throw new Error('Failed to obtain session cookie')
      }
    } catch (error) {
      logger.error('[PJe] Authentication error:', error)
      throw error
    }
  }

  /**
   * Search process by number (CNJ unified format)
   */
  async searchProcess(processNumber: string): Promise<PJeProcess> {
    if (!this.sessionCookie) {
      await this.authenticate()
    }

    try {
      // Clean process number (remove separators)
      const cleanNumber = processNumber.replace(/[.-]/g, '')

      const response = await fetch(
        `${this.baseUrl}/consultaprocessual/detalhe-processo/${cleanNumber}`,
        {
          headers: {
            Cookie: `JSESSIONID=${this.sessionCookie}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error(`PJe search failed: ${response.status}`)
      }

      const html = await response.text()
      const process = this.parseProcessHTML(html)

      logger.info('[PJe] Process found:', cleanNumber)
      return process
    } catch (error) {
      logger.error('[PJe] Search error:', error)
      throw error
    }
  }

  /**
   * Get process movements (movimentações processuais)
   */
  async getMovements(processNumber: string): Promise<PJeMovement[]> {
    if (!this.sessionCookie) {
      await this.authenticate()
    }

    try {
      const cleanNumber = processNumber.replace(/[.-]/g, '')

      const response = await fetch(
        `${this.baseUrl}/consultaprocessual/movimentacoes/${cleanNumber}`,
        {
          headers: {
            Cookie: `JSESSIONID=${this.sessionCookie}`,
            Accept: 'application/json',
          },
        }
      )

      if (!response.ok) {
        throw new Error(`PJe movements query failed: ${response.status}`)
      }

      const data = await response.json()
      return data.movimentacoes || []
    } catch (error) {
      logger.error('[PJe] Get movements error:', error)
      throw error
    }
  }

  /**
   * Download process document
   */
  async downloadDocument(params: {
    processNumber: string
    documentId: string
  }): Promise<Buffer> {
    if (!this.sessionCookie) {
      await this.authenticate()
    }

    try {
      const response = await fetch(`${this.baseUrl}/download/${params.documentId}`, {
        headers: {
          Cookie: `JSESSIONID=${this.sessionCookie}`,
        },
      })

      if (!response.ok) {
        throw new Error(`PJe download failed: ${response.status}`)
      }

      const arrayBuffer = await response.arrayBuffer()
      logger.info('[PJe] Document downloaded:', params.documentId)

      return Buffer.from(arrayBuffer)
    } catch (error) {
      logger.error('[PJe] Download error:', error)
      throw error
    }
  }

  /**
   * File petition (peticionar)
   */
  async filePetition(params: {
    processNumber: string
    petitionType: string
    content: Buffer
    filename: string
    description: string
    attachments?: Array<{
      file: Buffer
      filename: string
      description: string
    }>
  }): Promise<{ protocol: string; timestamp: string }> {
    if (!this.sessionCookie) {
      await this.authenticate()
    }

    try {
      const formData = new FormData()
      const cleanNumber = params.processNumber.replace(/[.-]/g, '')

      formData.append('numeroProcesso', cleanNumber)
      formData.append('tipoPeticao', params.petitionType)
      formData.append('descricao', params.description)

      // Main petition
      const blob = new Blob([new Uint8Array(params.content)], { type: 'application/pdf' })
      formData.append('peticao', blob, params.filename)

      // Attachments
      if (params.attachments) {
        params.attachments.forEach((attachment, index) => {
          const attachmentBlob = new Blob([new Uint8Array(attachment.file)], { type: 'application/pdf' })
          formData.append(`anexo_${index}`, attachmentBlob, attachment.filename)
          formData.append(`anexo_${index}_descricao`, attachment.description)
        })
      }

      const response = await fetch(`${this.baseUrl}/peticionar/enviar`, {
        method: 'POST',
        headers: {
          Cookie: `JSESSIONID=${this.sessionCookie}`,
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`PJe petition filing failed: ${response.status}`)
      }

      const result = await response.json()

      logger.info('[PJe] Petition filed successfully:', result.protocolo)

      return {
        protocol: result.protocolo,
        timestamp: result.dataHora,
      }
    } catch (error) {
      logger.error('[PJe] File petition error:', error)
      throw error
    }
  }

  /**
   * Check for new movements (for monitoring/alerting)
   */
  async checkNewMovements(params: {
    processNumber: string
    lastCheck: Date
  }): Promise<PJeMovement[]> {
    const movements = await this.getMovements(params.processNumber)

    // Filter movements newer than last check
    return movements.filter((mov) => new Date(mov.dataHora) > params.lastCheck)
  }

  /**
   * Get process deadlines (prazos processuais)
   */
  async getDeadlines(processNumber: string): Promise<
    Array<{
      type: string
      dueDate: string
      description: string
      status: 'pending' | 'met' | 'expired'
    }>
  > {
    if (!this.sessionCookie) {
      await this.authenticate()
    }

    try {
      const cleanNumber = processNumber.replace(/[.-]/g, '')

      const response = await fetch(`${this.baseUrl}/prazos/${cleanNumber}`, {
        headers: {
          Cookie: `JSESSIONID=${this.sessionCookie}`,
          Accept: 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`PJe deadlines query failed: ${response.status}`)
      }

      const data = await response.json()
      return data.prazos || []
    } catch (error) {
      logger.error('[PJe] Get deadlines error:', error)
      throw error
    }
  }

  /**
   * Helper: Parse process HTML page
   */
  private parseProcessHTML(html: string): PJeProcess {
    const $ = cheerio.load(html)

    // Extract basic info
    const processNumber = $('#numeroProcesso').text().trim()
    const tribunal = $('#tribunal').text().trim()
    const court = $('#vara').text().trim()
    const judge = $('#juiz').text().trim()
    const status = $('#situacao').text().trim()
    const processClass = $('#classe').text().trim()
    const subject = $('#assunto').text().trim()
    const distributionDate = $('#dataDistribuicao').text().trim()

    // Extract parties
    const parties: PJeProcess['parties'] = []
    $('.parte').each((_, element) => {
      const type = $(element).find('.tipo-parte').text().trim().toLowerCase()
      const name = $(element).find('.nome-parte').text().trim()
      const document = $(element).find('.documento-parte').text().trim()

      let partyType: 'plaintiff' | 'defendant' | 'lawyer' | 'other' = 'other'
      if (type.includes('autor') || type.includes('requerente')) partyType = 'plaintiff'
      else if (type.includes('réu') || type.includes('requerido')) partyType = 'defendant'
      else if (type.includes('advogado')) partyType = 'lawyer'

      parties.push({
        type: partyType,
        name,
        document: document || undefined,
      })
    })

    // Extract movements
    const movements: PJeProcess['movements'] = []
    $('.movimentacao').each((_, element) => {
      movements.push({
        date: $(element).find('.data-movimentacao').text().trim(),
        description: $(element).find('.descricao-movimentacao').text().trim(),
        type: $(element).find('.tipo-movimentacao').text().trim(),
        hasDocument: $(element).find('.link-documento').length > 0,
      })
    })

    return {
      processNumber,
      tribunal,
      court,
      judge,
      parties,
      movements,
      status,
      class: processClass,
      subject,
      distributionDate,
    }
  }

  /**
   * Logout from PJe
   */
  async logout(): Promise<void> {
    if (this.sessionCookie) {
      try {
        await fetch(`${this.baseUrl}/logout.seam`, {
          headers: {
            Cookie: `JSESSIONID=${this.sessionCookie}`,
          },
        })
        this.sessionCookie = undefined
        logger.info('[PJe] Logged out successfully')
      } catch (error) {
        logger.error('[PJe] Logout error:', error)
      }
    }
  }
}

// Export singleton instance
export const pje = new PJeClient()
