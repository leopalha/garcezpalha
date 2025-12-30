/**
 * P2-004: Process Monitoring System
 * Sistema de monitoramento automático de processos judiciais
 * Integra com APIs de tribunais (PJe, E-SAJ, CNJ, etc.)
 */

export type TribunalType = 'PJe' | 'E-SAJ' | 'PROJUDI' | 'CNJ' | 'TJ-RJ' | 'OUTRO'

export type ProcessStatus =
  | 'aguardando-julgamento'
  | 'em-andamento'
  | 'sentenciado'
  | 'arquivado'
  | 'recurso-pendente'
  | 'transito-julgado'
  | 'suspenso'
  | 'extinto'

export type MovementType =
  | 'citacao'
  | 'audiencia'
  | 'sentenca'
  | 'despacho'
  | 'recurso'
  | 'julgamento'
  | 'intimacao'
  | 'publicacao'
  | 'decisao'
  | 'arquivamento'

export interface ProcessData {
  numeroProcesso: string // Formato: 0000000-00.0000.0.00.0000
  tribunal: TribunalType
  comarca: string
  vara: string
  status: ProcessStatus
  dataDistribuicao: string
  ultimaAtualizacao: string
  valorCausa?: number
  assunto: string
  classe: string // Ex: Procedimento Comum, Apelação, etc.

  // Partes
  autor: string
  reu: string
  advogadoAutor?: string
  advogadoReu?: string

  // Monitoramento
  monitoringEnabled: boolean
  notificationChannels: ('email' | 'whatsapp' | 'sms' | 'push')[]
  checkIntervalMinutes: number // Intervalo de verificação (padrão: 60min)

  // Metadados
  leadId?: string
  conversationId?: string
  productId?: string
}

export interface ProcessMovement {
  id: string
  numeroProcesso: string
  data: string
  tipo: MovementType
  descricao: string
  conteudo?: string // Texto completo do movimento
  documentos?: ProcessDocument[]

  // Classificação automática
  requiresAction: boolean // Se exige ação do advogado
  prazoFatal?: string // Prazo fatal para manifestação
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente'

  // Notificação
  notified: boolean
  notifiedAt?: string
  notificationChannels?: string[]
}

export interface ProcessDocument {
  id: string
  nome: string
  tipo: string
  dataJuntada: string
  url?: string
  downloadUrl?: string
  paginacao?: { inicio: number; fim: number }
}

export interface ProcessAlert {
  id: string
  numeroProcesso: string
  tipo: 'prazo-fatal' | 'audiencia-proxima' | 'sentenca' | 'intimacao' | 'movimento-critico'
  titulo: string
  mensagem: string
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente'
  prazo?: string
  createdAt: string
  resolved: boolean
  resolvedAt?: string

  // Automação
  autoActions?: string[] // Ações automáticas tomadas
  remindersSent: number
  lastReminderAt?: string
}

export interface MonitoringSession {
  id: string
  numeroProcesso: string
  startedAt: string
  lastCheckAt: string
  nextCheckAt: string
  checksPerformed: number
  movementsDetected: number
  alertsCreated: number
  status: 'active' | 'paused' | 'stopped'
  errorCount: number
  lastError?: string
}

export interface TribunalCredentials {
  tribunal: TribunalType
  apiUrl: string
  username?: string
  password?: string
  certificadoDigital?: string
  certificadoSenha?: string
  token?: string
}

export interface ProcessSearchQuery {
  numeroProcesso?: string
  comarca?: string
  vara?: string
  partido?: string // Nome da parte
  advogado?: string
  dataInicio?: string
  dataFim?: string
  classe?: string
  assunto?: string
}

export interface ProcessSearchResult {
  numeroProcesso: string
  tribunal: TribunalType
  comarca: string
  vara: string
  status: ProcessStatus
  dataDistribuicao: string
  autor: string
  reu: string
  assunto: string
  classe: string
}

/**
 * Webhook payload de tribunais
 * Alguns tribunais enviam webhooks quando há movimentações
 */
export interface TribunalWebhookPayload {
  tribunal: TribunalType
  numeroProcesso: string
  tipoEvento: string
  dados: Record<string, unknown>
  timestamp: string
  assinatura?: string // Verificação HMAC
}
