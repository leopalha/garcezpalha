/**
 * Send Time Optimizer
 *
 * Usa machine learning simples para determinar o melhor horário
 * de envio de emails para cada lead baseado em:
 * - Histórico de aberturas por hora do dia e dia da semana
 * - Padrões de engajamento individuais
 * - Média global da base
 *
 * Implementação: Weighted moving average sem dependências externas
 */

import { createClient } from '@/lib/supabase/client'

export interface SendTimeRecommendation {
  leadId: string
  recommendedHour: number // 0-23
  recommendedDayOfWeek: number // 0-6 (0 = Sunday)
  confidence: number // 0-100
  basedOn: 'individual' | 'segment' | 'global'
  stats: {
    totalEmails: number
    totalOpens: number
    bestHour: number
    bestDayOfWeek: number
  }
}

export interface HourlyStats {
  hour: number
  dayOfWeek: number
  sent: number
  opened: number
  openRate: number
  score: number
}

export class SendTimeOptimizer {
  private supabase = createClient()

  /**
   * Recomenda melhor horário para enviar email para um lead específico
   */
  async getRecommendation(leadId: string): Promise<SendTimeRecommendation> {
    // Tentar usar dados individuais
    const individualStats = await this.getIndividualStats(leadId)

    if (individualStats.totalEmails >= 10) {
      // Dados suficientes para recomendação individual
      return this.buildRecommendation(leadId, individualStats, 'individual')
    }

    // Tentar usar dados do segmento
    const segments = await this.getLeadSegments(leadId)
    if (segments.length > 0) {
      const segmentStats = await this.getSegmentStats(segments[0])
      if (segmentStats.totalEmails >= 50) {
        return this.buildRecommendation(leadId, segmentStats, 'segment')
      }
    }

    // Fallback: usar média global
    const globalStats = await this.getGlobalStats()
    return this.buildRecommendation(leadId, globalStats, 'global')
  }

  /**
   * Busca estatísticas individuais de um lead
   */
  private async getIndividualStats(leadId: string): Promise<any> {
    const { data: sends } = await this.supabase
      .from('email_sequence_sends')
      .select('sent_at, opened_at')
      .eq('subscription_id', leadId) // TODO: Join correto

    if (!sends || sends.length === 0) {
      return { totalEmails: 0, totalOpens: 0, hourlyStats: [] }
    }

    return this.calculateStats(sends)
  }

  /**
   * Busca estatísticas de um segmento
   */
  private async getSegmentStats(segmentId: string): Promise<any> {
    // Buscar leads do segmento
    const { data: leadSegments } = await this.supabase
      .from('lead_segments')
      .select('lead_id')
      .eq('segment_id', segmentId)

    const leadIds = leadSegments?.map(ls => ls.lead_id) || []

    if (leadIds.length === 0) {
      return { totalEmails: 0, totalOpens: 0, hourlyStats: [] }
    }

    const { data: sends } = await this.supabase
      .from('email_sequence_sends')
      .select('sent_at, opened_at')
      .in('subscription_id', leadIds) // TODO: Join correto

    if (!sends || sends.length === 0) {
      return { totalEmails: 0, totalOpens: 0, hourlyStats: [] }
    }

    return this.calculateStats(sends)
  }

  /**
   * Busca estatísticas globais de toda a base
   */
  private async getGlobalStats(): Promise<any> {
    const { data: sends } = await this.supabase
      .from('email_sequence_sends')
      .select('sent_at, opened_at')
      .limit(10000) // Últimos 10k emails

    if (!sends || sends.length === 0) {
      // Fallback: horários padrão baseados em estudos
      return {
        totalEmails: 0,
        totalOpens: 0,
        hourlyStats: this.getDefaultStats(),
      }
    }

    return this.calculateStats(sends)
  }

  /**
   * Calcula estatísticas de abertura por hora e dia da semana
   */
  private calculateStats(sends: any[]): any {
    const hourlyMap = new Map<string, HourlyStats>()

    sends.forEach(send => {
      const sentDate = new Date(send.sent_at)
      const hour = sentDate.getHours()
      const dayOfWeek = sentDate.getDay()
      const key = `${dayOfWeek}-${hour}`

      if (!hourlyMap.has(key)) {
        hourlyMap.set(key, {
          hour,
          dayOfWeek,
          sent: 0,
          opened: 0,
          openRate: 0,
          score: 0,
        })
      }

      const stats = hourlyMap.get(key)!
      stats.sent++
      if (send.opened_at) {
        stats.opened++
      }
    })

    // Calcular open rate e score
    const hourlyStats: HourlyStats[] = []
    hourlyMap.forEach(stats => {
      stats.openRate = stats.sent > 0 ? (stats.opened / stats.sent) * 100 : 0

      // Score considera open rate E volume (mais dados = mais confiança)
      const volumeWeight = Math.min(stats.sent / 100, 1) // Max 1.0 com 100+ emails
      stats.score = stats.openRate * volumeWeight

      hourlyStats.push(stats)
    })

    // Ordenar por score
    hourlyStats.sort((a, b) => b.score - a.score)

    return {
      totalEmails: sends.length,
      totalOpens: sends.filter(s => s.opened_at).length,
      hourlyStats,
    }
  }

  /**
   * Constrói recomendação final
   */
  private buildRecommendation(
    leadId: string,
    stats: any,
    basedOn: 'individual' | 'segment' | 'global'
  ): SendTimeRecommendation {
    const { hourlyStats } = stats

    if (hourlyStats.length === 0) {
      // Usar defaults
      return {
        leadId,
        recommendedHour: 10, // 10h da manhã
        recommendedDayOfWeek: 2, // Terça-feira
        confidence: 30,
        basedOn: 'global',
        stats: {
          totalEmails: 0,
          totalOpens: 0,
          bestHour: 10,
          bestDayOfWeek: 2,
        },
      }
    }

    // Pegar top resultado
    const best = hourlyStats[0]

    // Calcular confiança baseado em quantidade de dados
    let confidence = 50
    if (basedOn === 'individual' && stats.totalEmails >= 50) {
      confidence = 90
    } else if (basedOn === 'individual' && stats.totalEmails >= 20) {
      confidence = 75
    } else if (basedOn === 'segment' && stats.totalEmails >= 200) {
      confidence = 70
    } else if (basedOn === 'segment' && stats.totalEmails >= 100) {
      confidence = 60
    } else if (basedOn === 'global' && stats.totalEmails >= 1000) {
      confidence = 55
    }

    return {
      leadId,
      recommendedHour: best.hour,
      recommendedDayOfWeek: best.dayOfWeek,
      confidence,
      basedOn,
      stats: {
        totalEmails: stats.totalEmails,
        totalOpens: stats.totalOpens,
        bestHour: best.hour,
        bestDayOfWeek: best.dayOfWeek,
      },
    }
  }

  /**
   * Estatísticas padrão baseadas em estudos de email marketing
   */
  private getDefaultStats(): HourlyStats[] {
    // Baseado em estudos:
    // - Terça e Quinta são melhores dias
    // - 10h-11h e 14h-15h são melhores horários
    return [
      { hour: 10, dayOfWeek: 2, sent: 100, opened: 45, openRate: 45, score: 45 }, // Terça 10h
      { hour: 14, dayOfWeek: 4, sent: 100, opened: 42, openRate: 42, score: 42 }, // Quinta 14h
      { hour: 11, dayOfWeek: 2, sent: 100, opened: 40, openRate: 40, score: 40 }, // Terça 11h
      { hour: 15, dayOfWeek: 3, sent: 100, opened: 38, openRate: 38, score: 38 }, // Quarta 15h
      { hour: 9, dayOfWeek: 1, sent: 100, opened: 35, openRate: 35, score: 35 }, // Segunda 9h
    ]
  }

  /**
   * Busca segmentos de um lead
   */
  private async getLeadSegments(leadId: string): Promise<string[]> {
    const { data } = await this.supabase
      .from('lead_segments')
      .select('segment_id')
      .eq('lead_id', leadId)
      .is('removed_at', null)

    return data?.map(d => d.segment_id) || []
  }

  /**
   * Agenda email para melhor horário
   */
  async scheduleOptimalTime(leadId: string, emailData: any): Promise<Date> {
    const recommendation = await this.getRecommendation(leadId)

    // Calcular próxima ocorrência do dia/hora recomendado
    const now = new Date()
    const scheduledDate = new Date()

    // Ajustar para próximo dia da semana recomendado
    const daysUntilRecommended = (recommendation.recommendedDayOfWeek - now.getDay() + 7) % 7
    scheduledDate.setDate(now.getDate() + (daysUntilRecommended || 7)) // Se hoje, agendar para próxima semana

    // Ajustar hora
    scheduledDate.setHours(recommendation.recommendedHour, 0, 0, 0)

    // Se já passou a hora hoje, agendar para próxima semana
    if (daysUntilRecommended === 0 && scheduledDate < now) {
      scheduledDate.setDate(scheduledDate.getDate() + 7)
    }

    console.log(
      `[SendTimeOptimizer] Lead ${leadId} scheduled for ${scheduledDate.toLocaleString('pt-BR')} ` +
        `(${recommendation.basedOn} data, ${recommendation.confidence}% confidence)`
    )

    return scheduledDate
  }

  /**
   * Atualiza modelo com novo evento de abertura
   * (learning incremental - não precisa recalcular tudo)
   */
  async recordOpenEvent(leadId: string, openedAt: Date): Promise<void> {
    // Aqui poderíamos atualizar um cache/modelo pré-calculado
    // Por enquanto, os dados vão direto pro banco e recalculamos on-demand
    console.log(
      `[SendTimeOptimizer] Lead ${leadId} opened at ${openedAt.toLocaleString('pt-BR')} ` +
        `(${openedAt.getDay()} ${openedAt.getHours()}h)`
    )

    // TODO: Implementar cache Redis com agregações por hora/dia
    // para evitar recalcular toda vez
  }

  /**
   * Gera relatório de performance do modelo
   */
  async generatePerformanceReport(): Promise<any> {
    // Buscar todos os leads que receberam emails
    const { data: sends } = await this.supabase
      .from('email_sequence_sends')
      .select('subscription_id, sent_at, opened_at')
      .not('opened_at', 'is', null)
      .limit(1000)

    if (!sends || sends.length === 0) {
      return {
        totalEmails: 0,
        accuracy: 0,
        avgConfidence: 0,
      }
    }

    let correctPredictions = 0
    let totalPredictions = 0
    let sumConfidence = 0

    for (const send of sends) {
      const leadId = send.subscription_id
      const recommendation = await this.getRecommendation(leadId)

      const sentDate = new Date(send.sent_at)
      const sentHour = sentDate.getHours()
      const sentDay = sentDate.getDay()

      // Considerar "correto" se estiver dentro de ±2 horas
      const hourDiff = Math.abs(sentHour - recommendation.recommendedHour)
      const dayMatch = sentDay === recommendation.recommendedDayOfWeek

      if (dayMatch && hourDiff <= 2) {
        correctPredictions++
      }

      totalPredictions++
      sumConfidence += recommendation.confidence
    }

    const accuracy = totalPredictions > 0 ? (correctPredictions / totalPredictions) * 100 : 0
    const avgConfidence = totalPredictions > 0 ? sumConfidence / totalPredictions : 0

    return {
      totalEmails: totalPredictions,
      correctPredictions,
      accuracy: accuracy.toFixed(2),
      avgConfidence: avgConfidence.toFixed(2),
    }
  }
}

export const sendTimeOptimizer = new SendTimeOptimizer()
