import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { createLogger } from '@/lib/logger'
import { createClient } from '@/lib/supabase/server'

const logger = createLogger('api:admin:reports:export')

/**
 * POST /api/admin/reports/export
 * Export reports to CSV/Excel format
 */
export async function POST(request: NextRequest) {
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
      logger.warn('Unauthorized role tried to export reports', {
        userId: session.user.id,
        role: profile?.role
      })
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { reportType, format, startDate, endDate, filters } = body

    // Validate format
    if (!['csv', 'excel'].includes(format)) {
      return NextResponse.json(
        { error: 'Formato inválido. Use "csv" ou "excel"' },
        { status: 400 }
      )
    }

    logger.info('Exporting report', {
      userId: session.user.id,
      reportType,
      format,
      startDate,
      endDate
    })

    let data: any[] = []
    let filename = ''
    let headers: string[] = []

    // Get data based on report type
    if (reportType === 'cases') {
      const { data: cases } = await supabase
        .from('cases')
        .select(`
          case_number,
          service_type,
          status,
          progress,
          created_at,
          completed_at,
          expected_value,
          actual_value,
          lawyer:profiles!cases_lawyer_id_fkey(full_name),
          client:profiles!cases_client_id_fkey(full_name, email)
        `)
        .gte('created_at', startDate || '2020-01-01')
        .lte('created_at', endDate || new Date().toISOString())
        .order('created_at', { ascending: false })

      headers = [
        'Número do Caso',
        'Tipo de Serviço',
        'Status',
        'Progresso (%)',
        'Cliente',
        'Email do Cliente',
        'Advogado',
        'Data de Criação',
        'Data de Conclusão',
        'Valor Esperado',
        'Valor Real'
      ]

      data = (cases || []).map(c => [
        c.case_number,
        c.service_type,
        c.status,
        c.progress,
        (c.client as any)?.full_name || 'N/A',
        (c.client as any)?.email || 'N/A',
        (c.lawyer as any)?.full_name || 'Não atribuído',
        new Date(c.created_at).toLocaleDateString('pt-BR'),
        c.completed_at ? new Date(c.completed_at).toLocaleDateString('pt-BR') : 'Em andamento',
        c.expected_value || 0,
        c.actual_value || 0
      ])

      filename = `casos_${new Date().toISOString().split('T')[0]}`

    } else if (reportType === 'financial') {
      const { data: expenses } = await supabase
        .from('expenses')
        .select(`
          type,
          category,
          description,
          amount,
          payment_status,
          expense_date,
          payment_date,
          case:cases(case_number),
          responsible:profiles!expenses_responsible_id_fkey(full_name)
        `)
        .gte('expense_date', startDate || '2020-01-01')
        .lte('expense_date', endDate || new Date().toISOString())
        .order('expense_date', { ascending: false })

      headers = [
        'Data',
        'Tipo',
        'Categoria',
        'Descrição',
        'Valor',
        'Status',
        'Data de Pagamento',
        'Caso',
        'Responsável'
      ]

      data = (expenses || []).map(e => [
        new Date(e.expense_date).toLocaleDateString('pt-BR'),
        e.type,
        e.category,
        e.description,
        e.amount,
        e.payment_status,
        e.payment_date ? new Date(e.payment_date).toLocaleDateString('pt-BR') : 'N/A',
        (e.case as any)?.case_number || 'N/A',
        (e.responsible as any)?.full_name || 'N/A'
      ])

      filename = `despesas_${new Date().toISOString().split('T')[0]}`

    } else if (reportType === 'invoices') {
      const { data: invoices } = await supabase
        .from('invoices')
        .select(`
          invoice_number,
          status,
          total_amount,
          due_date,
          paid_at,
          client:profiles!invoices_client_id_fkey(full_name, email)
        `)
        .gte('created_at', startDate || '2020-01-01')
        .lte('created_at', endDate || new Date().toISOString())
        .order('created_at', { ascending: false })

      headers = [
        'Número da Fatura',
        'Cliente',
        'Email',
        'Valor',
        'Status',
        'Data de Vencimento',
        'Data de Pagamento'
      ]

      data = (invoices || []).map(i => [
        i.invoice_number,
        (i.client as any)?.full_name || 'N/A',
        (i.client as any)?.email || 'N/A',
        i.total_amount,
        i.status,
        new Date(i.due_date).toLocaleDateString('pt-BR'),
        i.paid_at ? new Date(i.paid_at).toLocaleDateString('pt-BR') : 'Não pago'
      ])

      filename = `faturas_${new Date().toISOString().split('T')[0]}`

    } else if (reportType === 'clients') {
      const { data: clients } = await supabase
        .from('profiles')
        .select(`
          full_name,
          email,
          phone,
          cpf_cnpj,
          created_at,
          cases:cases(count)
        `)
        .eq('role', 'client')
        .gte('created_at', startDate || '2020-01-01')
        .lte('created_at', endDate || new Date().toISOString())
        .order('created_at', { ascending: false })

      headers = [
        'Nome Completo',
        'Email',
        'Telefone',
        'CPF/CNPJ',
        'Data de Cadastro',
        'Número de Casos'
      ]

      data = (clients || []).map(c => [
        c.full_name,
        c.email,
        c.phone || 'N/A',
        c.cpf_cnpj || 'N/A',
        new Date(c.created_at).toLocaleDateString('pt-BR'),
        (c.cases as any)?.[0]?.count || 0
      ])

      filename = `clientes_${new Date().toISOString().split('T')[0]}`

    } else {
      return NextResponse.json(
        { error: 'Tipo de relatório inválido' },
        { status: 400 }
      )
    }

    // Generate CSV
    if (format === 'csv') {
      const csv = generateCSV(headers, data)

      logger.info('Report exported successfully', {
        userId: session.user.id,
        reportType,
        format,
        rows: data.length
      })

      return new NextResponse(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="${filename}.csv"`
        }
      })
    }

    // For Excel, return JSON data that frontend can process
    // (Using a library like SheetJS/xlsx on frontend is more reliable than server-side)
    return NextResponse.json({
      success: true,
      data: {
        headers,
        rows: data,
        filename
      }
    })

  } catch (error) {
    logger.error('Error in report export', error)
    return NextResponse.json(
      { error: 'Erro ao exportar relatório' },
      { status: 500 }
    )
  }
}

/**
 * Generate CSV from headers and data
 */
function generateCSV(headers: string[], rows: any[][]): string {
  // Escape CSV values
  const escape = (value: any): string => {
    if (value === null || value === undefined) return ''
    const str = String(value)
    // Escape quotes and wrap in quotes if contains comma, quote, or newline
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`
    }
    return str
  }

  // Build CSV
  const csvRows = [
    headers.map(escape).join(','),
    ...rows.map(row => row.map(escape).join(','))
  ]

  // Add BOM for Excel UTF-8 support
  return '\uFEFF' + csvRows.join('\n')
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
