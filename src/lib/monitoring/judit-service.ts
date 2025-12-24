/**
 * Judit.io Integration Service
 *
 * Monitors legal processes and notifies about movements
 *
 * Features:
 * - Sync processes from Judit.io API
 * - Receive webhook notifications for movements
 * - Create alerts for new movements
 * - Track process status changes
 *
 * Judit.io API Setup:
 * 1. Create account at https://judit.io
 * 2. Get API key from dashboard
 * 3. Configure webhook URL
 * 4. Add to .env:
 *    JUDIT_API_KEY=your_api_key
 *    JUDIT_WEBHOOK_SECRET=your_webhook_secret
 *
 * Docs: https://judit.io/api/docs
 */

import { createClient } from '@/lib/supabase/server'
import crypto from 'crypto'

const JUDIT_API_BASE = 'https://api.judit.io/v1'

export interface JuditProcess {
  id: string
  numero: string
  tribunal: string
  vara: string
  classe: string
  assunto: string
  status: string
  partes: {
    polo: 'ativo' | 'passivo'
    nome: string
    cpf_cnpj?: string
  }[]
  movimentacoes: JuditMovement[]
  created_at: string
  updated_at: string
}

export interface JuditMovement {
  id: string
  data: string
  tipo: string
  descricao: string
  documento_url?: string
}

export interface JuditWebhookPayload {
  event: 'process.movement' | 'process.status_change' | 'process.deadline'
  process_id: string
  process_number: string
  data: {
    movement?: JuditMovement
    old_status?: string
    new_status?: string
    deadline?: {
      type: string
      date: string
      description: string
    }
  }
  timestamp: string
}

class JuditService {
  private readonly apiKey: string | undefined
  private readonly webhookSecret: string | undefined

  constructor() {
    this.apiKey = process.env.JUDIT_API_KEY
    this.webhookSecret = process.env.JUDIT_WEBHOOK_SECRET
  }

  /**
   * Check if Judit.io API is configured
   */
  isConfigured(): boolean {
    return !!this.apiKey
  }

  /**
   * Make authenticated request to Judit.io API
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T | null> {
    if (!this.isConfigured()) {
      console.warn('[Judit] API not configured')
      return null
    }

    try {
      const response = await fetch(`${JUDIT_API_BASE}${endpoint}`, {
        ...options,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          ...options.headers,
        },
      })

      if (!response.ok) {
        const error = await response.text()
        console.error('[Judit] API error:', error)
        return null
      }

      return await response.json()
    } catch (error) {
      console.error('[Judit] Request error:', error)
      return null
    }
  }

  /**
   * Add process to monitoring
   */
  async addProcess(processNumber: string): Promise<JuditProcess | null> {
    return this.request<JuditProcess>('/processes', {
      method: 'POST',
      body: JSON.stringify({
        numero: processNumber,
      }),
    })
  }

  /**
   * Get process details
   */
  async getProcess(processId: string): Promise<JuditProcess | null> {
    return this.request<JuditProcess>(`/processes/${processId}`)
  }

  /**
   * Get process by number
   */
  async getProcessByNumber(processNumber: string): Promise<JuditProcess | null> {
    const processes = await this.request<{ data: JuditProcess[] }>(
      `/processes?numero=${encodeURIComponent(processNumber)}`
    )
    return processes?.data?.[0] || null
  }

  /**
   * List all monitored processes
   */
  async listProcesses(page = 1, limit = 50): Promise<{
    data: JuditProcess[]
    total: number
    page: number
    pages: number
  } | null> {
    return this.request(`/processes?page=${page}&limit=${limit}`)
  }

  /**
   * Remove process from monitoring
   */
  async removeProcess(processId: string): Promise<boolean> {
    const result = await this.request(`/processes/${processId}`, {
      method: 'DELETE',
    })
    return result !== null
  }

  /**
   * Get recent movements for a process
   */
  async getMovements(
    processId: string,
    since?: Date
  ): Promise<JuditMovement[] | null> {
    let endpoint = `/processes/${processId}/movements`
    if (since) {
      endpoint += `?since=${since.toISOString()}`
    }
    const result = await this.request<{ data: JuditMovement[] }>(endpoint)
    return result?.data || null
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(signature: string, body: string): boolean {
    if (!this.webhookSecret) {
      console.warn('[Judit] Webhook secret not configured')
      return false
    }

    const expectedSignature = crypto
      .createHmac('sha256', this.webhookSecret)
      .update(body)
      .digest('hex')

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    )
  }

  /**
   * Handle webhook payload
   */
  async handleWebhook(payload: JuditWebhookPayload): Promise<void> {
    const supabase = await createClient()

    console.log('[Judit] Webhook received:', payload.event, payload.process_number)

    // Find process in our database
    const { data: processAlert } = await supabase
      .from('process_alerts')
      .select('id, client_id, user_id')
      .eq('process_number', payload.process_number)
      .single()

    if (!processAlert) {
      console.warn('[Judit] Process not found in database:', payload.process_number)
      return
    }

    switch (payload.event) {
      case 'process.movement':
        await this.handleMovement(supabase, processAlert, payload)
        break

      case 'process.status_change':
        await this.handleStatusChange(supabase, processAlert, payload)
        break

      case 'process.deadline':
        await this.handleDeadline(supabase, processAlert, payload)
        break
    }
  }

  /**
   * Handle new movement
   */
  private async handleMovement(
    supabase: any,
    processAlert: { id: string; client_id: string; user_id: string },
    payload: JuditWebhookPayload
  ): Promise<void> {
    const movement = payload.data.movement
    if (!movement) return

    // Create notification in database
    await supabase.from('process_movements').insert({
      process_alert_id: processAlert.id,
      judit_movement_id: movement.id,
      date: movement.data,
      type: movement.tipo,
      description: movement.descricao,
      document_url: movement.documento_url,
      created_at: new Date().toISOString(),
    })

    // Create alert notification
    await supabase.from('notifications').insert({
      user_id: processAlert.user_id,
      type: 'process_movement',
      title: `📋 Movimentação Processual`,
      message: `Processo ${payload.process_number}: ${movement.tipo}`,
      data: {
        process_number: payload.process_number,
        movement_type: movement.tipo,
        movement_description: movement.descricao,
      },
      read: false,
      created_at: new Date().toISOString(),
    })

    // TODO: Send WhatsApp/Email notification to client
    console.log('[Judit] Movement recorded:', movement.tipo)
  }

  /**
   * Handle status change
   */
  private async handleStatusChange(
    supabase: any,
    processAlert: { id: string; client_id: string; user_id: string },
    payload: JuditWebhookPayload
  ): Promise<void> {
    const { old_status, new_status } = payload.data

    // Update process status
    await supabase
      .from('process_alerts')
      .update({
        status: new_status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', processAlert.id)

    // Create notification
    await supabase.from('notifications').insert({
      user_id: processAlert.user_id,
      type: 'process_status',
      title: `📋 Mudança de Status`,
      message: `Processo ${payload.process_number} alterou de "${old_status}" para "${new_status}"`,
      data: {
        process_number: payload.process_number,
        old_status,
        new_status,
      },
      read: false,
      created_at: new Date().toISOString(),
    })

    console.log('[Judit] Status changed:', old_status, '->', new_status)
  }

  /**
   * Handle new deadline
   */
  private async handleDeadline(
    supabase: any,
    processAlert: { id: string; client_id: string; user_id: string },
    payload: JuditWebhookPayload
  ): Promise<void> {
    const deadline = payload.data.deadline
    if (!deadline) return

    // Create deadline in database
    await supabase.from('process_deadlines').insert({
      process_alert_id: processAlert.id,
      deadline_type: deadline.type,
      due_date: deadline.date,
      description: deadline.description,
      status: 'pending',
      created_at: new Date().toISOString(),
    })

    // Create urgent notification
    await supabase.from('notifications').insert({
      user_id: processAlert.user_id,
      type: 'process_deadline',
      title: `⚠️ Novo Prazo Processual`,
      message: `Processo ${payload.process_number}: ${deadline.type} até ${new Date(deadline.date).toLocaleDateString('pt-BR')}`,
      data: {
        process_number: payload.process_number,
        deadline_type: deadline.type,
        deadline_date: deadline.date,
        description: deadline.description,
      },
      read: false,
      created_at: new Date().toISOString(),
    })

    console.log('[Judit] Deadline created:', deadline.type, deadline.date)
  }

  /**
   * Sync processes from Judit.io to local database
   */
  async syncProcesses(): Promise<{
    success: boolean
    synced: number
    errors: number
  }> {
    if (!this.isConfigured()) {
      console.warn('[Judit] Not configured, skipping sync')
      return { success: false, synced: 0, errors: 0 }
    }

    const supabase = await createClient()
    let synced = 0
    let errors = 0
    let page = 1

    console.log('[Judit] Starting process sync...')

    while (true) {
      const result = await this.listProcesses(page, 50)
      if (!result || result.data.length === 0) break

      for (const process of result.data) {
        try {
          // Check if process exists in our database
          const { data: existing } = await supabase
            .from('process_alerts')
            .select('id, judit_process_id')
            .eq('process_number', process.numero)
            .single()

          if (existing && !existing.judit_process_id) {
            // Update with Judit ID
            await supabase
              .from('process_alerts')
              .update({
                judit_process_id: process.id,
                tribunal: process.tribunal,
                vara: process.vara,
                classe: process.classe,
                status: process.status,
                updated_at: new Date().toISOString(),
              })
              .eq('id', existing.id)

            synced++
          }
        } catch (error) {
          console.error('[Judit] Sync error for process:', process.numero, error)
          errors++
        }
      }

      if (page >= result.pages) break
      page++
    }

    console.log(`[Judit] Sync complete: ${synced} synced, ${errors} errors`)

    return { success: true, synced, errors }
  }

  /**
   * Get monitoring summary
   */
  async getMonitoringSummary(): Promise<{
    totalProcesses: number
    pendingDeadlines: number
    recentMovements: number
  } | null> {
    const supabase = await createClient()

    try {
      const [processesResult, deadlinesResult, movementsResult] = await Promise.all([
        supabase.from('process_alerts').select('id', { count: 'exact' }),
        supabase
          .from('process_deadlines')
          .select('id', { count: 'exact' })
          .eq('status', 'pending')
          .gte('due_date', new Date().toISOString()),
        supabase
          .from('process_movements')
          .select('id', { count: 'exact' })
          .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
      ])

      return {
        totalProcesses: processesResult.count || 0,
        pendingDeadlines: deadlinesResult.count || 0,
        recentMovements: movementsResult.count || 0,
      }
    } catch (error) {
      console.error('[Judit] Error getting summary:', error)
      return null
    }
  }
}

// Export singleton
export const juditService = new JuditService()

/**
 * JUDIT.IO SETUP GUIDE:
 *
 * 1. Create account at https://judit.io
 *
 * 2. Get API credentials:
 *    - Go to Settings → API
 *    - Copy API Key
 *    - Generate Webhook Secret
 *
 * 3. Configure webhook:
 *    - URL: https://garcezpalha.com/api/judit/webhook
 *    - Events: process.movement, process.status_change, process.deadline
 *
 * 4. Add to .env.local:
 *    JUDIT_API_KEY=your_api_key
 *    JUDIT_WEBHOOK_SECRET=your_webhook_secret
 *
 * 5. Database tables needed:
 *    - process_alerts (with judit_process_id column)
 *    - process_movements
 *    - process_deadlines
 *    - notifications
 *
 * NOTE: Judit.io pricing is per-process monitored.
 * Recommended to start monitoring when client count > 50 processes.
 */
