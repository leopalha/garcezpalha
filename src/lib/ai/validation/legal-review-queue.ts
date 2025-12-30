/**
 * Legal Review Queue - Fila de revisão humana para documentos jurídicos
 * Implementa Human-in-the-Loop para conformidade OAB
 */

export interface ReviewQueueItem {
  id: string
  tipo: 'peticao' | 'contrato' | 'parecer' | 'procuracao' | 'outro'
  titulo: string
  conteudo: string
  leadId: string
  agenteCriador: string
  dataGeracao: string
  prioridade: 'alta' | 'media' | 'baixa'
  status: 'pendente' | 'em-revisao' | 'aprovado' | 'rejeitado' | 'corrigido'
  complianceCheck: {
    score: number
    violacoes: number
    requerRevisao: boolean
  }
  revisor?: {
    id: string
    nome: string
    oab: string
    dataRevisao?: string
  }
  observacoesRevisor?: string
  correcoesSolicitadas?: {
    item: string
    descricao: string
    prioridade: 'obrigatoria' | 'sugerida'
  }[]
}

export class LegalReviewQueue {
  /**
   * Adiciona documento à fila de revisão
   */
  async addToQueue(params: {
    tipo: ReviewQueueItem['tipo']
    titulo: string
    conteudo: string
    leadId: string
    agenteCriador: string
    complianceCheck: ReviewQueueItem['complianceCheck']
  }): Promise<ReviewQueueItem> {
    const id = this.generateId()

    // Determinar prioridade baseada no compliance score
    let prioridade: ReviewQueueItem['prioridade'] = 'baixa'
    if (params.complianceCheck.score < 50) prioridade = 'alta'
    else if (params.complianceCheck.score < 70) prioridade = 'media'

    const item: ReviewQueueItem = {
      id,
      tipo: params.tipo,
      titulo: params.titulo,
      conteudo: params.conteudo,
      leadId: params.leadId,
      agenteCriador: params.agenteCriador,
      dataGeracao: new Date().toISOString(),
      prioridade,
      status: 'pendente',
      complianceCheck: params.complianceCheck,
    }

    // Em produção, salvar no banco de dados (Supabase)
    await this.saveToDatabase(item)

    // Notificar revisores
    await this.notifyReviewers(item)

    return item
  }

  /**
   * Busca itens pendentes de revisão
   */
  async getPendingReviews(params?: {
    prioridade?: ReviewQueueItem['prioridade']
    tipo?: ReviewQueueItem['tipo']
    revisorId?: string
  }): Promise<ReviewQueueItem[]> {
    // Simulação - em produção, consultar banco de dados
    const items: ReviewQueueItem[] = []

    // Retornar itens filtrados
    return items.filter((item) => {
      if (params?.prioridade && item.prioridade !== params.prioridade) return false
      if (params?.tipo && item.tipo !== params.tipo) return false
      if (params?.revisorId && item.revisor?.id !== params.revisorId) return false
      return true
    })
  }

  /**
   * Atribui revisor a um documento
   */
  async assignReviewer(params: {
    itemId: string
    revisorId: string
    revisorNome: string
    revisorOAB: string
  }): Promise<ReviewQueueItem> {
    // Em produção, atualizar no banco de dados
    const item = await this.getItemById(params.itemId)

    item.status = 'em-revisao'
    item.revisor = {
      id: params.revisorId,
      nome: params.revisorNome,
      oab: params.revisorOAB,
    }

    await this.saveToDatabase(item)

    return item
  }

  /**
   * Aprovar documento após revisão
   */
  async approveDocument(params: {
    itemId: string
    revisorId: string
    observacoes?: string
  }): Promise<ReviewQueueItem> {
    const item = await this.getItemById(params.itemId)

    if (item.revisor?.id !== params.revisorId) {
      throw new Error('Apenas o revisor atribuído pode aprovar o documento')
    }

    item.status = 'aprovado'
    item.observacoesRevisor = params.observacoes
    if (item.revisor) {
      item.revisor.dataRevisao = new Date().toISOString()
    }

    await this.saveToDatabase(item)

    // Notificar sistema para enviar documento ao cliente
    await this.notifyApproval(item)

    return item
  }

  /**
   * Rejeitar documento e solicitar correções
   */
  async rejectDocument(params: {
    itemId: string
    revisorId: string
    observacoes: string
    correcoes: {
      item: string
      descricao: string
      prioridade: 'obrigatoria' | 'sugerida'
    }[]
  }): Promise<ReviewQueueItem> {
    const item = await this.getItemById(params.itemId)

    if (item.revisor?.id !== params.revisorId) {
      throw new Error('Apenas o revisor atribuído pode rejeitar o documento')
    }

    item.status = 'rejeitado'
    item.observacoesRevisor = params.observacoes
    item.correcoesSolicitadas = params.correcoes
    if (item.revisor) {
      item.revisor.dataRevisao = new Date().toISOString()
    }

    await this.saveToDatabase(item)

    // Notificar sistema para reprocessar documento
    await this.notifyRejection(item)

    return item
  }

  /**
   * Marcar documento como corrigido (retorna para revisão)
   */
  async markAsCorrected(params: {
    itemId: string
    conteudoCorrigido: string
    observacoesCorrecao: string
  }): Promise<ReviewQueueItem> {
    const item = await this.getItemById(params.itemId)

    item.status = 'corrigido'
    item.conteudo = params.conteudoCorrigido

    // Adicionar observações às correções
    if (!item.observacoesRevisor) {
      item.observacoesRevisor = ''
    }
    item.observacoesRevisor += `\n\n[Correção aplicada]: ${params.observacoesCorrecao}`

    await this.saveToDatabase(item)

    // Notificar revisor que documento foi corrigido
    await this.notifyReviewer(item, 'corrigido')

    return item
  }

  /**
   * Estatísticas da fila de revisão
   */
  async getQueueStats(): Promise<{
    total: number
    pendente: number
    emRevisao: number
    aprovado: number
    rejeitado: number
    tempoMedioRevisao: number // em horas
    porPrioridade: {
      alta: number
      media: number
      baixa: number
    }
  }> {
    // Simulação - em produção, consultar banco de dados
    return {
      total: 45,
      pendente: 12,
      emRevisao: 8,
      aprovado: 20,
      rejeitado: 5,
      tempoMedioRevisao: 4.5,
      porPrioridade: {
        alta: 3,
        media: 6,
        baixa: 3,
      },
    }
  }

  // Métodos auxiliares privados

  private generateId(): string {
    return `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private async saveToDatabase(item: ReviewQueueItem): Promise<void> {
    // Em produção, salvar no Supabase
    console.log('[LegalReviewQueue] Salvando item:', item.id)
  }

  private async getItemById(id: string): Promise<ReviewQueueItem> {
    // Em produção, buscar do Supabase
    // Simulação:
    return {
      id,
      tipo: 'peticao',
      titulo: 'Petição de exemplo',
      conteudo: 'Conteúdo exemplo',
      leadId: 'lead_123',
      agenteCriador: 'real-estate-agent',
      dataGeracao: new Date().toISOString(),
      prioridade: 'media',
      status: 'em-revisao',
      complianceCheck: {
        score: 65,
        violacoes: 2,
        requerRevisao: true,
      },
      revisor: {
        id: 'revisor_1',
        nome: 'Dr. João Silva',
        oab: 'SP 123.456',
      },
    }
  }

  private async notifyReviewers(item: ReviewQueueItem): Promise<void> {
    // Em produção, enviar email/notificação para revisores
    console.log('[LegalReviewQueue] Notificando revisores sobre novo documento:', item.titulo)
  }

  private async notifyReviewer(item: ReviewQueueItem, evento: string): Promise<void> {
    console.log(`[LegalReviewQueue] Notificando revisor sobre ${evento}:`, item.titulo)
  }

  private async notifyApproval(item: ReviewQueueItem): Promise<void> {
    console.log('[LegalReviewQueue] Documento aprovado:', item.id)
    // Em produção, trigger workflow de envio ao cliente
  }

  private async notifyRejection(item: ReviewQueueItem): Promise<void> {
    console.log('[LegalReviewQueue] Documento rejeitado:', item.id)
    // Em produção, trigger reprocessamento pelo agente
  }
}

// Singleton instance
export const legalReviewQueue = new LegalReviewQueue()
