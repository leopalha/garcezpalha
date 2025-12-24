/**
 * Advanced Analytics Metrics Service
 *
 * Calculates business metrics:
 * - CAC (Customer Acquisition Cost)
 * - LTV (Lifetime Value)
 * - Conversion rates
 * - ROI by channel
 * - Sales funnel metrics
 *
 * For Sprint 5.6 - Analytics & BI
 */

import { createClient } from '@/lib/supabase/server'

export interface MetricsPeriod {
  startDate: Date
  endDate: Date
}

export interface AdvancedMetrics {
  // Acquisition Metrics
  cac: number // Customer Acquisition Cost
  ltv: number // Lifetime Value
  ltvCacRatio: number // LTV:CAC ratio (should be > 3)

  // Conversion Metrics
  conversionRates: {
    leadToQualified: number // % leads → qualified
    qualifiedToConverted: number // % qualified → converted
    overallConversion: number // % leads → converted
  }

  // Channel Performance
  channelMetrics: ChannelMetric[]

  // Revenue Metrics
  revenue: {
    total: number
    recurring: number
    oneTime: number
    averageTicket: number
  }

  // Funnel Metrics
  funnel: {
    leads: number
    qualified: number
    converted: number
    lost: number
  }
}

export interface ChannelMetric {
  channel: string // 'website', 'whatsapp', 'chatbot', 'referral', 'partner'
  leads: number
  qualified: number
  converted: number
  revenue: number
  cost: number // Marketing cost for this channel
  roi: number // Return on Investment
  cac: number // CAC for this channel
  conversionRate: number
}

export interface PartnerPerformance {
  partnerId: string
  partnerName: string
  leadsGenerated: number
  conversionRate: number
  totalRevenue: number
  commissionsOwed: number
  commissionsPaid: number
  avgLeadQuality: number // Score 0-100
}

class AdvancedMetricsService {
  /**
   * Calculate all advanced metrics for a period
   */
  async calculateMetrics(period: MetricsPeriod): Promise<AdvancedMetrics> {
    const supabase = await createClient()

    try {
      // Get all leads in period
      const { data: leads } = await supabase
        .from('leads')
        .select('*')
        .gte('created_at', period.startDate.toISOString())
        .lte('created_at', period.endDate.toISOString())

      // Get all converted clients (payments) in period
      const { data: payments } = await supabase
        .from('payments')
        .select('*')
        .eq('status', 'paid')
        .gte('created_at', period.startDate.toISOString())
        .lte('created_at', period.endDate.toISOString())

      // Calculate funnel metrics
      const totalLeads = leads?.length || 0
      const qualifiedLeads = leads?.filter((l) => l.status === 'qualified').length || 0
      const convertedLeads = leads?.filter((l) => l.status === 'converted').length || 0
      const lostLeads = leads?.filter((l) => l.status === 'lost').length || 0

      // Calculate revenue
      const totalRevenue = payments?.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0) || 0
      const clientCount = new Set(payments?.map((p) => p.client_id)).size

      // Calculate CAC (simplified - total marketing cost / clients acquired)
      // TODO: Get actual marketing costs from database
      const estimatedMarketingCost = totalRevenue * 0.15 // Assume 15% of revenue goes to marketing
      const cac = clientCount > 0 ? estimatedMarketingCost / clientCount : 0

      // Calculate LTV (simplified - average revenue per client)
      const ltv = clientCount > 0 ? totalRevenue / clientCount : 0

      // Calculate conversion rates
      const leadToQualified = totalLeads > 0 ? (qualifiedLeads / totalLeads) * 100 : 0
      const qualifiedToConverted =
        qualifiedLeads > 0 ? (convertedLeads / qualifiedLeads) * 100 : 0
      const overallConversion = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0

      // Calculate channel metrics
      const channelMetrics = await this.calculateChannelMetrics(period, leads || [], payments || [])

      return {
        cac,
        ltv,
        ltvCacRatio: cac > 0 ? ltv / cac : 0,
        conversionRates: {
          leadToQualified,
          qualifiedToConverted,
          overallConversion,
        },
        channelMetrics,
        revenue: {
          total: totalRevenue,
          recurring: 0, // TODO: Implement recurring revenue tracking
          oneTime: totalRevenue,
          averageTicket: clientCount > 0 ? totalRevenue / clientCount : 0,
        },
        funnel: {
          leads: totalLeads,
          qualified: qualifiedLeads,
          converted: convertedLeads,
          lost: lostLeads,
        },
      }
    } catch (error) {
      console.error('[Advanced Metrics] Error calculating metrics:', error)
      throw error
    }
  }

  /**
   * Calculate metrics per channel
   */
  private async calculateChannelMetrics(
    period: MetricsPeriod,
    leads: any[],
    payments: any[]
  ): Promise<ChannelMetric[]> {
    const channels = ['website', 'whatsapp', 'chatbot', 'referral', 'partner']

    const metrics: ChannelMetric[] = []

    for (const channel of channels) {
      const channelLeads = leads.filter((l) => l.source === channel)
      const qualified = channelLeads.filter((l) => l.status === 'qualified')
      const converted = channelLeads.filter((l) => l.status === 'converted')

      // Calculate revenue for this channel
      const channelRevenue = payments
        .filter((p) => {
          // Find the lead that generated this payment
          const lead = leads.find((l) => l.id === p.lead_id)
          return lead?.source === channel
        })
        .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)

      // Estimated marketing cost per channel (simplified)
      const cost = channelRevenue * 0.1 // Assume 10% cost

      const roi = cost > 0 ? ((channelRevenue - cost) / cost) * 100 : 0
      const cac = converted.length > 0 ? cost / converted.length : 0
      const conversionRate =
        channelLeads.length > 0 ? (converted.length / channelLeads.length) * 100 : 0

      metrics.push({
        channel,
        leads: channelLeads.length,
        qualified: qualified.length,
        converted: converted.length,
        revenue: channelRevenue,
        cost,
        roi,
        cac,
        conversionRate,
      })
    }

    return metrics.sort((a, b) => b.revenue - a.revenue)
  }

  /**
   * Get partner performance report
   */
  async getPartnerPerformance(period: MetricsPeriod): Promise<PartnerPerformance[]> {
    const supabase = await createClient()

    try {
      // Get all partners
      const { data: partners } = await supabase
        .from('users')
        .select('id, full_name')
        .eq('role', 'partner')

      if (!partners) return []

      const performance: PartnerPerformance[] = []

      for (const partner of partners) {
        // Get leads referred by this partner
        const { data: partnerLeads } = await supabase
          .from('leads')
          .select('*')
          .eq('referred_by', partner.id)
          .gte('created_at', period.startDate.toISOString())
          .lte('created_at', period.endDate.toISOString())

        const leadsGenerated = partnerLeads?.length || 0
        const converted = partnerLeads?.filter((l) => l.status === 'converted').length || 0
        const conversionRate = leadsGenerated > 0 ? (converted / leadsGenerated) * 100 : 0

        // Get commissions for this partner
        const { data: commissions } = await supabase
          .from('commissions')
          .select('*')
          .eq('partner_id', partner.id)
          .gte('created_at', period.startDate.toISOString())
          .lte('created_at', period.endDate.toISOString())

        const commissionsOwed = commissions
          ?.filter((c) => c.status !== 'paid')
          .reduce((sum, c) => sum + parseFloat(c.amount || 0), 0) || 0

        const commissionsPaid = commissions
          ?.filter((c) => c.status === 'paid')
          .reduce((sum, c) => sum + parseFloat(c.amount || 0), 0) || 0

        const totalRevenue = commissions
          ?.reduce((sum, c) => sum + parseFloat(c.transaction_amount || 0), 0) || 0

        // Calculate lead quality score (0-100)
        const avgLeadQuality = this.calculateLeadQuality(partnerLeads || [])

        performance.push({
          partnerId: partner.id,
          partnerName: partner.full_name,
          leadsGenerated,
          conversionRate,
          totalRevenue,
          commissionsOwed,
          commissionsPaid,
          avgLeadQuality,
        })
      }

      // Sort by total revenue (best performers first)
      return performance.sort((a, b) => b.totalRevenue - a.totalRevenue)
    } catch (error) {
      console.error('[Advanced Metrics] Error calculating partner performance:', error)
      return []
    }
  }

  /**
   * Calculate lead quality score based on various factors
   */
  private calculateLeadQuality(leads: any[]): number {
    if (leads.length === 0) return 0

    let totalScore = 0

    for (const lead of leads) {
      let score = 50 // Base score

      // Add points for complete information
      if (lead.phone) score += 10
      if (lead.email) score += 10
      if (lead.company) score += 10

      // Add points for engagement
      if (lead.message && lead.message.length > 50) score += 10

      // Add major points for conversion
      if (lead.status === 'converted') score += 20
      else if (lead.status === 'qualified') score += 10

      totalScore += score
    }

    return Math.round(totalScore / leads.length)
  }

  /**
   * Get sales funnel visualization data
   */
  async getSalesFunnel(period: MetricsPeriod): Promise<{
    stages: Array<{ name: string; count: number; percentage: number }>
  }> {
    const supabase = await createClient()

    const { data: leads } = await supabase
      .from('leads')
      .select('status')
      .gte('created_at', period.startDate.toISOString())
      .lte('created_at', period.endDate.toISOString())

    const total = leads?.length || 0

    const funnel = [
      {
        name: 'Total Leads',
        count: total,
        percentage: 100,
      },
      {
        name: 'Contacted',
        count: leads?.filter((l) => ['contacted', 'qualified', 'converted'].includes(l.status)).length || 0,
        percentage: 0,
      },
      {
        name: 'Qualified',
        count: leads?.filter((l) => ['qualified', 'converted'].includes(l.status)).length || 0,
        percentage: 0,
      },
      {
        name: 'Converted',
        count: leads?.filter((l) => l.status === 'converted').length || 0,
        percentage: 0,
      },
    ]

    // Calculate percentages
    funnel.forEach((stage) => {
      stage.percentage = total > 0 ? (stage.count / total) * 100 : 0
    })

    return { stages: funnel }
  }
}

// Export singleton
export const advancedMetrics = new AdvancedMetricsService()

/**
 * USAGE EXAMPLES:
 *
 * 1. Get metrics for last 30 days:
 *    const endDate = new Date()
 *    const startDate = new Date()
 *    startDate.setDate(startDate.getDate() - 30)
 *    const metrics = await advancedMetrics.calculateMetrics({ startDate, endDate })
 *
 * 2. Get partner performance:
 *    const performance = await advancedMetrics.getPartnerPerformance({ startDate, endDate })
 *
 * 3. Get sales funnel:
 *    const funnel = await advancedMetrics.getSalesFunnel({ startDate, endDate })
 */
