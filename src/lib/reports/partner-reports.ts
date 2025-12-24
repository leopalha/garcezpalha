/**
 * Automated Partner Reports Service
 *
 * Sends monthly performance reports to partners
 *
 * Features:
 * - Monthly performance summary
 * - Leads generated and conversion rates
 * - Commissions earned and paid
 * - Tips for improvement
 * - Gamification (badges, rankings)
 */

import { createClient } from '@/lib/supabase/server'
import { advancedMetrics, PartnerPerformance } from '@/lib/analytics/advanced-metrics'

interface PartnerReport {
  partnerId: string
  partnerName: string
  partnerEmail: string
  period: {
    startDate: Date
    endDate: Date
  }
  performance: PartnerPerformance
  ranking: number // Position among all partners
  totalPartners: number
  badges: string[] // Achievement badges
  tips: string[] // Personalized improvement tips
}

class PartnerReportsService {
  /**
   * Generate report for a single partner
   */
  async generatePartnerReport(
    partnerId: string,
    startDate: Date,
    endDate: Date
  ): Promise<PartnerReport | null> {
    const supabase = await createClient()

    try {
      // Get partner info
      const { data: partner } = await supabase
        .from('users')
        .select('id, full_name, email')
        .eq('id', partnerId)
        .single()

      if (!partner) return null

      // Get performance metrics
      const allPerformance = await advancedMetrics.getPartnerPerformance({
        startDate,
        endDate,
      })

      const performance = allPerformance.find((p) => p.partnerId === partnerId)
      if (!performance) return null

      // Calculate ranking
      const ranking = allPerformance.findIndex((p) => p.partnerId === partnerId) + 1

      // Award badges
      const badges = this.awardBadges(performance, allPerformance)

      // Generate personalized tips
      const tips = this.generateTips(performance)

      return {
        partnerId: partner.id,
        partnerName: partner.full_name,
        partnerEmail: partner.email,
        period: { startDate, endDate },
        performance,
        ranking,
        totalPartners: allPerformance.length,
        badges,
        tips,
      }
    } catch (error) {
      console.error('[Partner Reports] Error generating report:', error)
      return null
    }
  }

  /**
   * Award achievement badges based on performance
   */
  private awardBadges(
    performance: PartnerPerformance,
    allPerformance: PartnerPerformance[]
  ): string[] {
    const badges: string[] = []

    // Top performer badge
    const topRevenue = Math.max(...allPerformance.map((p) => p.totalRevenue))
    if (performance.totalRevenue === topRevenue && topRevenue > 0) {
      badges.push('🏆 Top Performer')
    }

    // High conversion badge
    if (performance.conversionRate >= 30) {
      badges.push('🎯 Conversion Master')
    }

    // Volume badge
    if (performance.leadsGenerated >= 20) {
      badges.push('📊 Volume Leader')
    }

    // Quality badge
    if (performance.avgLeadQuality >= 80) {
      badges.push('⭐ Quality Champion')
    }

    // Consistent performer badge
    if (performance.leadsGenerated >= 5 && performance.conversionRate >= 20) {
      badges.push('🔄 Consistent Star')
    }

    return badges
  }

  /**
   * Generate personalized improvement tips
   */
  private generateTips(performance: PartnerPerformance): string[] {
    const tips: string[] = []

    // Conversion rate tips
    if (performance.conversionRate < 15) {
      tips.push(
        '📈 Foque em qualificar melhor os leads antes de enviar. Pergunte sobre orçamento e urgência.'
      )
    }

    // Lead quality tips
    if (performance.avgLeadQuality < 60) {
      tips.push(
        '✅ Inclua mais informações ao enviar leads: telefone, email, contexto do caso.'
      )
    }

    // Volume tips
    if (performance.leadsGenerated < 5) {
      tips.push(
        '🚀 Aumente sua geração de leads! Compartilhe seu link de indicação nas redes sociais.'
      )
    }

    // Revenue tips
    if (performance.totalRevenue < 5000) {
      tips.push(
        '💰 Foque em casos de maior valor: Direito Imobiliário e Perícia costumam ter tickets maiores.'
      )
    }

    // Generic encouragement if doing well
    if (tips.length === 0) {
      tips.push('🎉 Excelente trabalho! Continue assim!')
      tips.push(
        '📚 Explore nossos novos serviços para oferecer mais opções aos clientes.'
      )
    }

    return tips
  }

  /**
   * Send monthly reports to all partners
   */
  async sendMonthlyReports(): Promise<{
    success: boolean
    reportsSent: number
    errors: number
  }> {
    const supabase = await createClient()

    try {
      console.log('[Partner Reports] Generating monthly reports...')

      // Get all active partners
      const { data: partners } = await supabase
        .from('users')
        .select('id')
        .eq('role', 'partner')

      if (!partners || partners.length === 0) {
        return { success: true, reportsSent: 0, errors: 0 }
      }

      // Calculate last month's date range
      const endDate = new Date()
      endDate.setDate(1) // First day of current month
      endDate.setDate(0) // Last day of previous month

      const startDate = new Date(endDate)
      startDate.setDate(1) // First day of previous month

      let reportsSent = 0
      let errors = 0

      for (const partner of partners) {
        try {
          const report = await this.generatePartnerReport(
            partner.id,
            startDate,
            endDate
          )

          if (report) {
            await this.sendReportEmail(report)
            reportsSent++
          }
        } catch (error) {
          console.error(
            `[Partner Reports] Error sending report to ${partner.id}:`,
            error
          )
          errors++
        }
      }

      console.log(
        `[Partner Reports] Reports complete: ${reportsSent} sent, ${errors} errors`
      )

      return {
        success: true,
        reportsSent,
        errors,
      }
    } catch (error) {
      console.error('[Partner Reports] Error sending monthly reports:', error)
      return {
        success: false,
        reportsSent: 0,
        errors: 0,
      }
    }
  }

  /**
   * Send report email to partner
   */
  private async sendReportEmail(report: PartnerReport): Promise<boolean> {
    try {
      const monthYear = report.period.endDate.toLocaleDateString('pt-BR', {
        month: 'long',
        year: 'numeric',
      })

      // TODO: Implement email service (Resend or SendGrid)
      console.log('[Email] Partner monthly report:', {
        to: report.partnerEmail,
        subject: `📊 Relatório de Performance - ${monthYear}`,
        body: `
          Olá ${report.partnerName}!

          Aqui está seu relatório de performance de ${monthYear}:

          📈 RESULTADOS:
          - Leads gerados: ${report.performance.leadsGenerated}
          - Taxa de conversão: ${report.performance.conversionRate.toFixed(1)}%
          - Receita gerada: R$ ${report.performance.totalRevenue.toFixed(2)}
          - Comissões recebidas: R$ ${report.performance.commissionsPaid.toFixed(2)}
          - Comissões pendentes: R$ ${report.performance.commissionsOwed.toFixed(2)}

          🏅 RANKING:
          Você está em #${report.ranking} de ${report.totalPartners} parceiros!

          ${report.badges.length > 0 ? `\n🎖️ CONQUISTAS:\n${report.badges.join('\n')}` : ''}

          💡 DICAS PARA MELHORAR:
          ${report.tips.join('\n')}

          Continue com o ótimo trabalho!

          Atenciosamente,
          Equipe Garcez Palha
        `,
      })

      return true
    } catch (error) {
      console.error('[Partner Reports] Error sending email:', error)
      return false
    }
  }
}

// Export singleton
export const partnerReports = new PartnerReportsService()
