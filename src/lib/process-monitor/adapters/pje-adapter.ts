/**
 * PJe (Processo Judicial Eletrônico) Adapter
 * Integração com API do PJe dos tribunais brasileiros
 * https://www.pje.jus.br/wiki/index.php/API_PJe
 */

import type { ProcessMovement, ProcessData, ProcessSearchQuery, ProcessSearchResult } from '../types'

export class PJeAdapter {
  private apiUrl: string
  private token: string

  constructor(config: { apiUrl: string; token: string }) {
    this.apiUrl = config.apiUrl
    this.token = config.token
  }

  /**
   * Busca movimentações de um processo
   */
  async fetchMovements(numeroProcesso: string): Promise<ProcessMovement[]> {
    try {
      const url = `${this.apiUrl}/processos/${numeroProcesso}/movimentos`

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`PJe API error: ${response.statusText}`)
      }

      const data = await response.json()

      return data.movimentos.map((mov: any) => ({
        id: mov.id || `mov_${Date.now()}`,
        numeroProcesso,
        data: mov.dataHora,
        tipo: this.mapMovementType(mov.tipoMovimento),
        descricao: mov.descricao,
        conteudo: mov.textoIntegral,
        requiresAction: this.detectRequiresAction(mov.descricao),
        prazoFatal: this.extractPrazo(mov.descricao),
        prioridade: this.calculatePriority(mov),
        notified: false,
      }))
    } catch (error) {
      console.error('Erro ao buscar movimentos PJe:', error)
      return []
    }
  }

  /**
   * Busca dados completos de um processo
   */
  async fetchProcessData(numeroProcesso: string): Promise<ProcessData | null> {
    try {
      const url = `${this.apiUrl}/processos/${numeroProcesso}`

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`PJe API error: ${response.statusText}`)
      }

      const data = await response.json()

      return {
        numeroProcesso: data.numero,
        tribunal: 'PJe',
        comarca: data.orgaoJulgador?.comarca || '',
        vara: data.orgaoJulgador?.nome || '',
        status: this.mapStatus(data.situacao),
        dataDistribuicao: data.dataAjuizamento,
        ultimaAtualizacao: data.dataUltimaMovimentacao,
        valorCausa: data.valorCausa,
        assunto: data.assuntos?.[0]?.nome || '',
        classe: data.classe?.nome || '',
        autor: data.poloAtivo?.[0]?.nome || '',
        reu: data.poloPassivo?.[0]?.nome || '',
        advogadoAutor: data.poloAtivo?.[0]?.advogados?.[0]?.nome,
        advogadoReu: data.poloPassivo?.[0]?.advogados?.[0]?.nome,
        monitoringEnabled: false,
        notificationChannels: [],
        checkIntervalMinutes: 60,
      }
    } catch (error) {
      console.error('Erro ao buscar processo PJe:', error)
      return null
    }
  }

  /**
   * Busca processos por filtros
   */
  async searchProcesses(query: ProcessSearchQuery): Promise<ProcessSearchResult[]> {
    try {
      const params = new URLSearchParams()

      if (query.numeroProcesso) params.append('numero', query.numeroProcesso)
      if (query.partido) params.append('parte', query.partido)
      if (query.advogado) params.append('advogado', query.advogado)
      if (query.dataInicio) params.append('dataInicio', query.dataInicio)
      if (query.dataFim) params.append('dataFim', query.dataFim)

      const url = `${this.apiUrl}/processos/consulta?${params.toString()}`

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`PJe API error: ${response.statusText}`)
      }

      const data = await response.json()

      return data.processos.map((p: any) => ({
        numeroProcesso: p.numero,
        tribunal: 'PJe',
        comarca: p.orgaoJulgador?.comarca || '',
        vara: p.orgaoJulgador?.nome || '',
        status: this.mapStatus(p.situacao),
        dataDistribuicao: p.dataAjuizamento,
        autor: p.poloAtivo?.[0]?.nome || '',
        reu: p.poloPassivo?.[0]?.nome || '',
        assunto: p.assuntos?.[0]?.nome || '',
        classe: p.classe?.nome || '',
      }))
    } catch (error) {
      console.error('Erro ao buscar processos PJe:', error)
      return []
    }
  }

  /**
   * Mapeia tipo de movimento
   */
  private mapMovementType(tipo: string): any {
    const map: Record<string, any> = {
      'Citação': 'citacao',
      'Audiência': 'audiencia',
      'Sentença': 'sentenca',
      'Despacho': 'despacho',
      'Recurso': 'recurso',
      'Julgamento': 'julgamento',
      'Intimação': 'intimacao',
      'Publicação': 'publicacao',
      'Decisão': 'decisao',
      'Arquivamento': 'arquivamento',
    }

    return map[tipo] || 'despacho'
  }

  /**
   * Mapeia status do processo
   */
  private mapStatus(situacao: string): any {
    const map: Record<string, any> = {
      'Em andamento': 'em-andamento',
      'Sentenciado': 'sentenciado',
      'Arquivado': 'arquivado',
      'Suspenso': 'suspenso',
      'Extinto': 'extinto',
    }

    return map[situacao] || 'em-andamento'
  }

  /**
   * Detecta se movimento requer ação do advogado
   */
  private detectRequiresAction(descricao: string): boolean {
    const keywords = [
      'intimação',
      'manifestação',
      'contestação',
      'recurso',
      'impugnação',
      'embargos',
      'defesa',
      'alegações',
      'apresentar',
      'requerer',
    ]

    return keywords.some((keyword) => descricao.toLowerCase().includes(keyword))
  }

  /**
   * Extrai prazo da descrição
   */
  private extractPrazo(descricao: string): string | undefined {
    // Regex para detectar prazos: "prazo de X dias", "até XX/XX/XXXX"
    const patterns = [
      /prazo\s+de\s+(\d+)\s+dias?/i,
      /até\s+(\d{2}\/\d{2}\/\d{4})/i,
      /em\s+(\d+)\s+dias?/i,
    ]

    for (const pattern of patterns) {
      const match = descricao.match(pattern)
      if (match) {
        return match[1]
      }
    }

    return undefined
  }

  /**
   * Calcula prioridade do movimento
   */
  private calculatePriority(movimento: any): 'baixa' | 'media' | 'alta' | 'urgente' {
    if (this.detectRequiresAction(movimento.descricao)) {
      if (this.extractPrazo(movimento.descricao)) {
        return 'urgente'
      }
      return 'alta'
    }

    if (['sentenca', 'decisao', 'intimacao'].includes(this.mapMovementType(movimento.tipoMovimento))) {
      return 'alta'
    }

    return 'media'
  }
}
