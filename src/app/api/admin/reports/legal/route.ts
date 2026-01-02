import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { createLogger } from '@/lib/logger'
import { createClient } from '@/lib/supabase/server'

const logger = createLogger('api:admin:reports:legal')

/**
 * GET /api/admin/reports/legal
 * Get comprehensive legal reports and BI metrics
 */
export async function GET(request: NextRequest) {
  try {
    // Auth check
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      logger.warn('Unauthorized access attempt')
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const supabase = await createClient()

    // Check if user is admin or lawyer
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!profile || !['admin', 'lawyer'].includes(profile.role)) {
      logger.warn('Unauthorized role tried to access reports', {
        userId: session.user.id,
        role: profile?.role
      })
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')

    // Default to last 12 months if not specified
    const end = endDate ? new Date(endDate) : new Date()
    const start = startDate ? new Date(startDate) : new Date(end.getFullYear() - 1, end.getMonth(), end.getDate())

    logger.info('Fetching legal reports', {
      userId: session.user.id,
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0]
    })

    // Get all cases for the period
    const { data: cases } = await supabase
      .from('cases')
      .select(`
        id,
        service_type,
        status,
        progress,
        created_at,
        updated_at,
        completed_at,
        lawyer_id,
        client_id,
        expected_value,
        actual_value,
        lawyer:profiles!cases_lawyer_id_fkey(full_name),
        client:profiles!cases_client_id_fkey(full_name)
      `)
      .gte('created_at', start.toISOString())
      .lte('created_at', end.toISOString())

    // Calculate success rate by service type
    const successByServiceType: Record<string, any> = {}
    const revenueByServiceType: Record<string, any> = {}
    const casesByLawyer: Record<string, any> = {}
    const casesByStatus: Record<string, any> = {}
    const monthlyMetrics: Record<string, any> = {}

    cases?.forEach(caseItem => {
      const serviceType = caseItem.service_type || 'unknown'
      const status = caseItem.status
      const lawyerId = caseItem.lawyer_id
      const month = new Date(caseItem.created_at).toISOString().slice(0, 7) // YYYY-MM

      // Success by service type
      if (!successByServiceType[serviceType]) {
        successByServiceType[serviceType] = {
          total: 0,
          completed: 0,
          cancelled: 0,
          active: 0,
          successRate: 0
        }
      }
      successByServiceType[serviceType].total++
      if (status === 'concluido') successByServiceType[serviceType].completed++
      if (status === 'cancelado') successByServiceType[serviceType].cancelled++
      if (['aguardando_documentos', 'em_analise', 'em_andamento'].includes(status)) {
        successByServiceType[serviceType].active++
      }

      // Revenue by service type
      if (!revenueByServiceType[serviceType]) {
        revenueByServiceType[serviceType] = {
          expected: 0,
          actual: 0,
          count: 0
        }
      }
      revenueByServiceType[serviceType].expected += parseFloat(caseItem.expected_value?.toString() || '0')
      revenueByServiceType[serviceType].actual += parseFloat(caseItem.actual_value?.toString() || '0')
      revenueByServiceType[serviceType].count++

      // Cases by lawyer
      if (lawyerId) {
        const lawyerName = (caseItem.lawyer as any)?.full_name || 'Não atribuído'
        if (!casesByLawyer[lawyerId]) {
          casesByLawyer[lawyerId] = {
            lawyerId,
            lawyerName,
            total: 0,
            completed: 0,
            active: 0,
            successRate: 0
          }
        }
        casesByLawyer[lawyerId].total++
        if (status === 'concluido') casesByLawyer[lawyerId].completed++
        if (['aguardando_documentos', 'em_analise', 'em_andamento'].includes(status)) {
          casesByLawyer[lawyerId].active++
        }
      }

      // Cases by status
      if (!casesByStatus[status]) {
        casesByStatus[status] = 0
      }
      casesByStatus[status]++

      // Monthly metrics
      if (!monthlyMetrics[month]) {
        monthlyMetrics[month] = {
          month,
          newCases: 0,
          completed: 0,
          revenue: 0
        }
      }
      monthlyMetrics[month].newCases++
      if (status === 'concluido') monthlyMetrics[month].completed++
      monthlyMetrics[month].revenue += parseFloat(caseItem.actual_value?.toString() || '0')
    })

    // Calculate success rates
    Object.keys(successByServiceType).forEach(type => {
      const data = successByServiceType[type]
      data.successRate = data.total > 0
        ? ((data.completed / data.total) * 100).toFixed(1)
        : '0'
    })

    Object.keys(casesByLawyer).forEach(lawyerId => {
      const data = casesByLawyer[lawyerId]
      data.successRate = data.total > 0
        ? ((data.completed / data.total) * 100).toFixed(1)
        : '0'
    })

    // Calculate average resolution time
    const completedCases = cases?.filter(c => c.status === 'concluido' && c.completed_at) || []
    const resolutionTimes = completedCases.map(c => {
      const created = new Date(c.created_at).getTime()
      const completed = new Date(c.completed_at!).getTime()
      return (completed - created) / (1000 * 60 * 60 * 24) // days
    })
    const avgResolutionTime = resolutionTimes.length > 0
      ? resolutionTimes.reduce((sum, time) => sum + time, 0) / resolutionTimes.length
      : 0

    // Get payment data (invoices)
    const { data: invoices } = await supabase
      .from('invoices')
      .select('status, total_amount, due_date, paid_at')
      .gte('created_at', start.toISOString())
      .lte('created_at', end.toISOString())

    // Calculate payment metrics
    const totalInvoiced = invoices?.reduce((sum, inv) => sum + parseFloat(inv.total_amount.toString()), 0) || 0
    const totalPaid = invoices?.filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + parseFloat(inv.total_amount.toString()), 0) || 0
    const totalOverdue = invoices?.filter(inv => {
      return inv.status === 'pending' && inv.due_date && new Date(inv.due_date) < new Date()
    }).reduce((sum, inv) => sum + parseFloat(inv.total_amount.toString()), 0) || 0

    const defaultRate = totalInvoiced > 0
      ? ((totalOverdue / totalInvoiced) * 100).toFixed(1)
      : '0'

    // Format response
    const response = {
      period: {
        startDate: start.toISOString().split('T')[0],
        endDate: end.toISOString().split('T')[0]
      },
      summary: {
        totalCases: cases?.length || 0,
        completedCases: completedCases.length,
        activeCases: cases?.filter(c =>
          ['aguardando_documentos', 'em_analise', 'em_andamento'].includes(c.status)
        ).length || 0,
        cancelledCases: cases?.filter(c => c.status === 'cancelado').length || 0,
        overallSuccessRate: cases && cases.length > 0
          ? ((completedCases.length / cases.length) * 100).toFixed(1)
          : '0',
        avgResolutionTime: Math.round(avgResolutionTime),
        totalRevenue: totalPaid,
        expectedRevenue: totalInvoiced,
        revenueRealization: totalInvoiced > 0
          ? ((totalPaid / totalInvoiced) * 100).toFixed(1)
          : '0'
      },
      successByServiceType: Object.entries(successByServiceType).map(([type, data]) => ({
        serviceType: type,
        ...data
      })).sort((a, b) => b.total - a.total),
      revenueByServiceType: Object.entries(revenueByServiceType).map(([type, data]) => ({
        serviceType: type,
        ...data,
        realization: data.expected > 0
          ? ((data.actual / data.expected) * 100).toFixed(1)
          : '0'
      })).sort((a, b) => b.actual - a.actual),
      performanceByLawyer: Object.values(casesByLawyer).sort((a: any, b: any) => b.total - a.total),
      casesByStatus: Object.entries(casesByStatus).map(([status, count]) => ({
        status,
        count
      })),
      monthlyTrend: Object.values(monthlyMetrics).sort((a: any, b: any) =>
        a.month.localeCompare(b.month)
      ),
      paymentMetrics: {
        totalInvoiced,
        totalPaid,
        totalPending: totalInvoiced - totalPaid,
        totalOverdue,
        defaultRate,
        paymentRate: totalInvoiced > 0
          ? ((totalPaid / totalInvoiced) * 100).toFixed(1)
          : '0'
      }
    }

    logger.info('Legal reports retrieved successfully', {
      userId: session.user.id,
      totalCases: response.summary.totalCases
    })

    return NextResponse.json(response)

  } catch (error) {
    logger.error('Error in legal reports GET', error)
    return NextResponse.json(
      { error: 'Erro ao gerar relatórios' },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
