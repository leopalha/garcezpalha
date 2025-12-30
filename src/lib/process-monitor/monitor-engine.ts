/**
 * P2-004: Process Monitoring Engine
 * Motor de monitoramento de processos judiciais
 */

import type {
  ProcessData,
  ProcessMovement,
  ProcessAlert,
  MonitoringSession,
  TribunalCredentials,
  ProcessSearchQuery,
  ProcessSearchResult,
  MovementType,
} from './types'

export class ProcessMonitorEngine {
  private sessions: Map<string, MonitoringSession> = new Map()
  private credentials: Map<string, TribunalCredentials> = new Map()

  /**
   * Inicia monitoramento de um processo
   */
  async startMonitoring(processData: ProcessData): Promise<MonitoringSession> {
    const session: MonitoringSession = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      numeroProcesso: processData.numeroProcesso,
      startedAt: new Date().toISOString(),
      lastCheckAt: new Date().toISOString(),
      nextCheckAt: this.calculateNextCheck(processData.checkIntervalMinutes || 60),
      checksPerformed: 0,
      movementsDetected: 0,
      alertsCreated: 0,
      status: 'active',
      errorCount: 0,
    }

    this.sessions.set(processData.numeroProcesso, session)

    // Primeira verificação
    await this.checkProcess(processData.numeroProcesso)

    return session
  }

  /**
   * Para monitoramento de um processo
   */
  stopMonitoring(numeroProcesso: string): void {
    const session = this.sessions.get(numeroProcesso)
    if (session) {
      session.status = 'stopped'
      this.sessions.delete(numeroProcesso)
    }
  }

  /**
   * Verifica atualizações de um processo
   */
  async checkProcess(numeroProcesso: string): Promise<ProcessMovement[]> {
    const session = this.sessions.get(numeroProcesso)
    if (!session) {
      throw new Error(`Processo ${numeroProcesso} não está sendo monitorado`)
    }

    try {
      // Busca movimentações do processo no tribunal
      const movements = await this.fetchProcessMovements(numeroProcesso)

      // Atualiza session
      session.checksPerformed++
      session.lastCheckAt = new Date().toISOString()
      session.nextCheckAt = this.calculateNextCheck(60) // 60 min padrão
      session.movementsDetected += movements.length

      // Analisa movimentos para criar alertas
      const alerts = await this.analyzeMovements(movements)
      session.alertsCreated += alerts.length

      // Notifica sobre novos movimentos
      for (const movement of movements) {
        await this.notifyMovement(numeroProcesso, movement)
      }

      // Notifica sobre alertas
      for (const alert of alerts) {
        await this.notifyAlert(numeroProcesso, alert)
      }

      return movements
    } catch (error) {
      session.errorCount++
      session.lastError = error instanceof Error ? error.message : 'Erro desconhecido'
      console.error(`Erro ao verificar processo ${numeroProcesso}:`, error)
      return []
    }
  }

  /**
   * Busca movimentações de um processo no tribunal
   * IMPORTANTE: Implementação real deve usar APIs dos tribunais
   */
  private async fetchProcessMovements(numeroProcesso: string): Promise<ProcessMovement[]> {
    // TODO: Integrar com APIs dos tribunais
    // - PJe: https://www.pje.jus.br/wiki/index.php/API_PJe
    // - CNJ: https://www.cnj.jus.br/sistemas/datajud/
    // - TJ-RJ: https://www3.tjrj.jus.br/consultaprocessual/
    // - E-SAJ: Cada tribunal tem sua própria API

    // Por enquanto, retorna simulação
    return []
  }

  /**
   * Analisa movimentos e cria alertas automáticos
   */
  private async analyzeMovements(movements: ProcessMovement[]): Promise<ProcessAlert[]> {
    const alerts: ProcessAlert[] = []

    for (const movement of movements) {
      // Detecta prazos fatais
      if (this.hasPrazoFatal(movement)) {
        alerts.push({
          id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          numeroProcesso: movement.numeroProcesso,
          tipo: 'prazo-fatal',
          titulo: `Prazo Fatal: ${movement.tipo}`,
          mensagem: `Atenção! ${movement.descricao}. Prazo: ${movement.prazoFatal}`,
          prioridade: 'urgente',
          prazo: movement.prazoFatal,
          createdAt: new Date().toISOString(),
          resolved: false,
          remindersSent: 0,
        })
      }

      // Detecta audiências
      if (movement.tipo === 'audiencia') {
        alerts.push({
          id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          numeroProcesso: movement.numeroProcesso,
          tipo: 'audiencia-proxima',
          titulo: 'Audiência Agendada',
          mensagem: movement.descricao,
          prioridade: 'alta',
          createdAt: new Date().toISOString(),
          resolved: false,
          remindersSent: 0,
        })
      }

      // Detecta sentenças
      if (movement.tipo === 'sentenca') {
        alerts.push({
          id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          numeroProcesso: movement.numeroProcesso,
          tipo: 'sentenca',
          titulo: 'Sentença Proferida',
          mensagem: movement.descricao,
          prioridade: 'alta',
          createdAt: new Date().toISOString(),
          resolved: false,
          remindersSent: 0,
        })
      }

      // Detecta intimações
      if (movement.tipo === 'intimacao') {
        alerts.push({
          id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          numeroProcesso: movement.numeroProcesso,
          tipo: 'intimacao',
          titulo: 'Intimação Recebida',
          mensagem: movement.descricao,
          prioridade: movement.requiresAction ? 'alta' : 'media',
          prazo: movement.prazoFatal,
          createdAt: new Date().toISOString(),
          resolved: false,
          remindersSent: 0,
        })
      }
    }

    return alerts
  }

  /**
   * Verifica se movimento tem prazo fatal
   */
  private hasPrazoFatal(movement: ProcessMovement): boolean {
    if (movement.prazoFatal) return true

    // Palavras-chave que indicam prazo
    const keywords = [
      'intimação',
      'prazo',
      'manifestação',
      'contestação',
      'recurso',
      'impugnação',
      'embargos',
      'defesa',
      'alegações',
    ]

    return keywords.some((keyword) =>
      movement.descricao.toLowerCase().includes(keyword.toLowerCase())
    )
  }

  /**
   * Notifica sobre novo movimento
   */
  private async notifyMovement(numeroProcesso: string, movement: ProcessMovement): Promise<void> {
    if (movement.notified) return

    // TODO: Implementar notificações via email, WhatsApp, SMS
    console.log(
      `[NOTIFICAÇÃO] Processo ${numeroProcesso}: ${movement.tipo} - ${movement.descricao}`
    )

    // Marcar como notificado
    movement.notified = true
    movement.notifiedAt = new Date().toISOString()
  }

  /**
   * Notifica sobre alerta
   */
  private async notifyAlert(numeroProcesso: string, alert: ProcessAlert): Promise<void> {
    // TODO: Implementar notificações via email, WhatsApp, SMS
    console.log(`[ALERTA] Processo ${numeroProcesso}: ${alert.titulo} - ${alert.mensagem}`)
  }

  /**
   * Calcula próximo horário de verificação
   */
  private calculateNextCheck(intervalMinutes: number): string {
    const next = new Date()
    next.setMinutes(next.getMinutes() + intervalMinutes)
    return next.toISOString()
  }

  /**
   * Busca processos em tribunais
   */
  async searchProcess(query: ProcessSearchQuery): Promise<ProcessSearchResult[]> {
    // TODO: Implementar busca em tribunais
    // - PJe
    // - E-SAJ
    // - CNJ
    // - TJ-RJ

    return []
  }

  /**
   * Registra credenciais de acesso a tribunal
   */
  registerCredentials(credentials: TribunalCredentials): void {
    this.credentials.set(credentials.tribunal, credentials)
  }

  /**
   * Obtém credenciais de tribunal
   */
  getCredentials(tribunal: string): TribunalCredentials | undefined {
    return this.credentials.get(tribunal as any)
  }

  /**
   * Lista sessões de monitoramento ativas
   */
  getActiveSessions(): MonitoringSession[] {
    return Array.from(this.sessions.values()).filter((s) => s.status === 'active')
  }

  /**
   * Obtém sessão de monitoramento
   */
  getSession(numeroProcesso: string): MonitoringSession | undefined {
    return this.sessions.get(numeroProcesso)
  }

  /**
   * Executa verificação de todos os processos monitorados
   * Chamado por cron job (ex: a cada 30 minutos)
   */
  async runScheduledCheck(): Promise<void> {
    const sessions = this.getActiveSessions()
    const now = new Date()

    for (const session of sessions) {
      const nextCheck = new Date(session.nextCheckAt)

      if (now >= nextCheck) {
        await this.checkProcess(session.numeroProcesso)
      }
    }
  }
}

/**
 * Singleton instance
 */
export const processMonitor = new ProcessMonitorEngine()
