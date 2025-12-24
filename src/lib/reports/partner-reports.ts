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
import { emailService } from '@/lib/email/email-service'

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

      const formattedRevenue = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(report.performance.totalRevenue)

      const formattedCommissionsPaid = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(report.performance.commissionsPaid)

      const formattedCommissionsOwed = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(report.performance.commissionsOwed)

      const badgesHtml = report.badges.length > 0
        ? `<div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4 style="margin: 0 0 10px; color: #92400e;">🎖️ Conquistas do Mês</h4>
            <ul style="margin: 0; padding-left: 20px; color: #78350f;">
              ${report.badges.map(b => `<li>${b}</li>`).join('')}
            </ul>
          </div>`
        : ''

      const tipsHtml = report.tips.length > 0
        ? `<div style="background: #eff6ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4 style="margin: 0 0 10px; color: #1e40af;">💡 Dicas para Melhorar</h4>
            <ul style="margin: 0; padding-left: 20px; color: #1e3a8a;">
              ${report.tips.map(t => `<li>${t}</li>`).join('')}
            </ul>
          </div>`
        : ''

      const sent = await emailService.sendCustomEmail({
        to: report.partnerEmail,
        subject: `📊 Relatório de Performance - ${monthYear}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #1a365d 0%, #2c5282 100%); padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Relatório Mensal</h1>
              <p style="color: #e2e8f0; margin: 10px 0 0;">${monthYear}</p>
            </div>

            <div style="padding: 30px; background: #f9fafb;">
              <p style="font-size: 16px; color: #374151;">Olá <strong>${report.partnerName}</strong>,</p>
              <p>Aqui está seu relatório de performance como parceiro Garcez Palha:</p>

              <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #e5e7eb;">
                <h3 style="margin: 0 0 15px; color: #1f2937;">📈 Resultados do Mês</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">Leads Gerados</td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: bold;">${report.performance.leadsGenerated}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">Taxa de Conversão</td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: bold;">${report.performance.conversionRate.toFixed(1)}%</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">Receita Gerada</td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: bold; color: #059669;">${formattedRevenue}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">Comissões Pagas</td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: bold;">${formattedCommissionsPaid}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;">Comissões Pendentes</td>
                    <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #c9a227;">${formattedCommissionsOwed}</td>
                  </tr>
                </table>
              </div>

              <div style="background: #ecfdf5; padding: 15px; border-radius: 8px; text-align: center; margin: 15px 0;">
                <p style="margin: 0; font-size: 14px; color: #065f46;">🏅 Ranking de Parceiros</p>
                <p style="margin: 5px 0 0; font-size: 24px; font-weight: bold; color: #047857;">
                  #${report.ranking} de ${report.totalPartners}
                </p>
              </div>

              ${badgesHtml}
              ${tipsHtml}

              <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
                Continue com o ótimo trabalho! Qualquer dúvida, estamos à disposição.
              </p>
            </div>

            <div style="background: #1a365d; color: white; padding: 15px; text-align: center; font-size: 12px;">
              <p style="margin: 0;">Garcez Palha - Programa de Parcerias</p>
              <p style="margin: 5px 0 0;">📞 (21) 99535-4010 | parcerias@garcezpalha.com</p>
            </div>
          </div>
        `,
        text: `Relatório de Performance - ${monthYear}

Olá ${report.partnerName}!

Aqui está seu relatório de performance de ${monthYear}:

📈 RESULTADOS:
- Leads gerados: ${report.performance.leadsGenerated}
- Taxa de conversão: ${report.performance.conversionRate.toFixed(1)}%
- Receita gerada: ${formattedRevenue}
- Comissões recebidas: ${formattedCommissionsPaid}
- Comissões pendentes: ${formattedCommissionsOwed}

🏅 RANKING:
Você está em #${report.ranking} de ${report.totalPartners} parceiros!

${report.badges.length > 0 ? `🎖️ CONQUISTAS:\n${report.badges.join('\n')}\n` : ''}
${report.tips.length > 0 ? `💡 DICAS:\n${report.tips.join('\n')}\n` : ''}

Continue com o ótimo trabalho!

Garcez Palha - Programa de Parcerias
(21) 99535-4010`,
        tags: ['partner-report', 'monthly'],
        metadata: { partnerId: report.partnerId },
      })

      console.log('[Partner Reports] Email sent to:', report.partnerEmail)
      return sent
    } catch (error) {
      console.error('[Partner Reports] Error sending email:', error)
      return false
    }
  }
}

// Export singleton
export const partnerReports = new PartnerReportsService()
