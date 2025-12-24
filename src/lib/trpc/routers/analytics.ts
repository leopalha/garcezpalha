import { z } from 'zod'
import { router, protectedProcedure } from '../init'
import { TRPCError } from '@trpc/server'

export const analyticsRouter = router({
  // Get dashboard KPIs
  getKPIs: protectedProcedure.query(async ({ ctx }) => {
    try {
      // Get total leads this month
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)

      const startOfLastMonth = new Date(startOfMonth)
      startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1)

      const { count: currentMonthLeads } = await ctx.supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfMonth.toISOString())

      const { count: lastMonthLeads } = await ctx.supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfLastMonth.toISOString())
        .lt('created_at', startOfMonth.toISOString())

      // Get conversion rate
      const { count: totalLeads } = await ctx.supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })

      const { count: convertedLeads } = await ctx.supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'converted')

      const conversionRate = totalLeads ? ((convertedLeads || 0) / totalLeads) * 100 : 0

      // Get active clients
      const { count: activeClients } = await ctx.supabase
        .from('clients')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')

      // Get today's appointments
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)

      const { count: todayAppointments } = await ctx.supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .gte('scheduled_at', today.toISOString())
        .lt('scheduled_at', tomorrow.toISOString())

      // Get monthly revenue (sum of paid invoices)
      const { data: invoiceData } = await ctx.supabase
        .from('invoices')
        .select('amount')
        .eq('status', 'paid')
        .gte('paid_at', startOfMonth.toISOString())

      const monthlyRevenue = invoiceData?.reduce((sum, inv) => sum + inv.amount, 0) || 0

      return {
        totalLeads: currentMonthLeads || 0,
        leadsChange: lastMonthLeads
          ? (((currentMonthLeads || 0) - lastMonthLeads) / lastMonthLeads) * 100
          : 0,
        conversionRate: Math.round(conversionRate * 10) / 10,
        activeClients: activeClients || 0,
        todayAppointments: todayAppointments || 0,
        monthlyRevenue,
      }
    } catch {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erro ao carregar KPIs',
      })
    }
  }),

  // Get lead sources distribution
  getLeadSources: protectedProcedure.query(async ({ ctx }) => {
    try {
      const { data } = await ctx.supabase.from('leads').select('source')

      if (!data) return []

      const sourceCounts: Record<string, number> = {}
      data.forEach((lead) => {
        sourceCounts[lead.source] = (sourceCounts[lead.source] || 0) + 1
      })

      const total = data.length
      return Object.entries(sourceCounts).map(([source, count]) => ({
        source,
        count,
        percentage: Math.round((count / total) * 1000) / 10,
      }))
    } catch {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erro ao carregar fontes de leads',
      })
    }
  }),

  // Get conversion funnel
  getConversionFunnel: protectedProcedure.query(async ({ ctx }) => {
    try {
      const { data } = await ctx.supabase.from('leads').select('status')

      if (!data) return []

      const total = data.length
      const statusCounts: Record<string, number> = {
        new: 0,
        contacted: 0,
        qualified: 0,
        converted: 0,
      }

      data.forEach((lead) => {
        if (lead.status in statusCounts) {
          statusCounts[lead.status]++
        }
      })

      // Calculate funnel (cumulative)
      const funnel = [
        { stage: 'Leads Captados', count: total, percentage: 100 },
        {
          stage: 'Contactados',
          count: total - statusCounts.new,
          percentage: Math.round(((total - statusCounts.new) / total) * 100),
        },
        {
          stage: 'Qualificados',
          count: statusCounts.qualified + statusCounts.converted,
          percentage: Math.round(
            ((statusCounts.qualified + statusCounts.converted) / total) * 100
          ),
        },
        {
          stage: 'Convertidos',
          count: statusCounts.converted,
          percentage: Math.round((statusCounts.converted / total) * 100),
        },
      ]

      return funnel
    } catch {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erro ao carregar funil de conversão',
      })
    }
  }),

  // Get service popularity
  getServicePopularity: protectedProcedure.query(async ({ ctx }) => {
    try {
      const { data } = await ctx.supabase.from('leads').select('service_interest')

      if (!data) return []

      const serviceCounts: Record<string, number> = {}
      data.forEach((lead) => {
        serviceCounts[lead.service_interest] = (serviceCounts[lead.service_interest] || 0) + 1
      })

      return Object.entries(serviceCounts)
        .map(([service, leads]) => ({
          service,
          leads,
          revenue: leads * 2500, // Estimated average revenue per lead
        }))
        .sort((a, b) => b.leads - a.leads)
        .slice(0, 5)
    } catch {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erro ao carregar popularidade dos serviços',
      })
    }
  }),

  // Get recent activities
  getRecentActivities: protectedProcedure
    .input(z.object({ limit: z.number().min(1).max(20).default(10) }))
    .query(async ({ ctx, input }) => {
      try {
        const activities: Array<{
          type: string
          description: string
          time: string
          created_at: string
        }> = []

        // Get recent leads
        const { data: recentLeads } = await ctx.supabase
          .from('leads')
          .select('source, created_at')
          .order('created_at', { ascending: false })
          .limit(5)

        recentLeads?.forEach((lead) => {
          const sourceMap: Record<string, string> = {
            website: 'formulário',
            whatsapp: 'WhatsApp',
            chatbot: 'chatbot',
            referral: 'indicação',
          }
          activities.push({
            type: 'lead',
            description: `Novo lead via ${sourceMap[lead.source] || lead.source}`,
            time: getRelativeTime(new Date(lead.created_at)),
            created_at: lead.created_at,
          })
        })

        // Get recent appointments
        const { data: recentAppointments } = await ctx.supabase
          .from('appointments')
          .select('status, created_at')
          .order('created_at', { ascending: false })
          .limit(5)

        recentAppointments?.forEach((apt) => {
          activities.push({
            type: 'appointment',
            description: `Consulta ${apt.status === 'scheduled' ? 'agendada' : apt.status}`,
            time: getRelativeTime(new Date(apt.created_at)),
            created_at: apt.created_at,
          })
        })

        // Sort by time and return limited
        return activities
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, input.limit)
          .map(({ type, description, time }) => ({ type, description, time }))
      } catch {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro ao carregar atividades recentes',
        })
      }
    }),
})

function getRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'agora'
  if (diffMins < 60) return `${diffMins} min atrás`
  if (diffHours < 24) return `${diffHours}h atrás`
  if (diffDays < 7) return `${diffDays}d atrás`
  return date.toLocaleDateString('pt-BR')
}
