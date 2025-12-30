import { NextRequest, NextResponse } from 'next/server'
import { reportGenerator } from '@/lib/reports/report-generator'
import type { ReportConfig, ReportType, ReportFormat } from '@/lib/reports/types'

/**
 * P2-005: Reports API
 * POST /api/reports/generate - Gera relatório sob demanda
 * GET /api/reports/generate?config=true - Lista configurações
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Gerar relatório sob demanda (sem config salva)
    if (body.type && !body.configId) {
      const config: ReportConfig = {
        id: `temp_${Date.now()}`,
        type: body.type as ReportType,
        name: body.name || `Relatório ${body.type}`,
        description: body.description || '',
        frequency: 'on-demand',
        format: (body.format as ReportFormat) || 'json',
        enabled: true,
        timezone: 'America/Sao_Paulo',
        recipients: body.recipients || [],
        filters: body.filters,
        dateRange: body.dateRange,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      reportGenerator.registerReport(config)
      const report = await reportGenerator.generateReport(config.id)

      // Exportar no formato solicitado
      const exported = await reportGenerator.exportReport(report, config.format)

      return NextResponse.json({
        success: true,
        report: {
          id: report.id,
          type: report.type,
          name: report.name,
          generatedAt: report.generatedAt,
          period: report.period,
          summary: report.summary,
        },
        data: config.format === 'json' ? JSON.parse(exported) : null,
        export: config.format !== 'json' ? exported : null,
      })
    }

    // Gerar relatório a partir de config existente
    if (body.configId) {
      const report = await reportGenerator.generateReport(body.configId)

      return NextResponse.json({
        success: true,
        report: {
          id: report.id,
          type: report.type,
          name: report.name,
          generatedAt: report.generatedAt,
          period: report.period,
          summary: report.summary,
        },
      })
    }

    return NextResponse.json({ error: 'type ou configId é obrigatório' }, { status: 400 })
  } catch (error) {
    console.error('Erro ao gerar relatório:', error)

    return NextResponse.json(
      {
        error: 'Erro ao gerar relatório',
        message: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const showTypes = searchParams.get('types') === 'true'

    if (showTypes) {
      return NextResponse.json({
        reportTypes: [
          {
            type: 'leads-conversion',
            name: 'Conversão de Leads',
            description: 'Análise de taxa de conversão e performance de funil',
          },
          {
            type: 'revenue-monthly',
            name: 'Receita Mensal',
            description: 'Análise de receita e crescimento mensal',
          },
          {
            type: 'cases-status',
            name: 'Status dos Casos',
            description: 'Acompanhamento de casos ativos e finalizados',
          },
          {
            type: 'product-performance',
            name: 'Performance por Produto',
            description: 'Análise de performance de cada produto/serviço',
          },
          {
            type: 'agent-performance',
            name: 'Performance dos Agentes IA',
            description: 'Análise de eficiência dos agentes de IA',
          },
          {
            type: 'compliance-oab',
            name: 'Compliance OAB',
            description: 'Verificação de compliance com normas da OAB',
          },
          {
            type: 'payment-analysis',
            name: 'Análise de Pagamentos',
            description: 'Análise de pagamentos e inadimplência',
          },
          {
            type: 'operational-metrics',
            name: 'Métricas Operacionais',
            description: 'KPIs operacionais e custos do sistema',
          },
        ],
        formats: ['json', 'csv', 'html', 'pdf', 'excel'],
        frequencies: ['daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'on-demand'],
      })
    }

    return NextResponse.json({
      message: 'API de Geração de Relatórios',
      endpoints: {
        POST: '/api/reports/generate - Gera relatório sob demanda',
        GET: '/api/reports/generate?types=true - Lista tipos de relatórios',
      },
    })
  } catch (error) {
    console.error('Erro ao listar tipos de relatórios:', error)

    return NextResponse.json(
      {
        error: 'Erro ao listar tipos',
        message: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    )
  }
}
