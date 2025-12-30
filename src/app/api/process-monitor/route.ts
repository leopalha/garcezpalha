import { NextRequest, NextResponse } from 'next/server'
n// Force dynamic rendering - required for API routes
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
import { processMonitor } from '@/lib/process-monitor/monitor-engine'
import type { ProcessData } from '@/lib/process-monitor/types'

/**
 * P2-004: Process Monitoring API
 * POST /api/process-monitor - Inicia monitoramento
 * GET /api/process-monitor - Lista sessões ativas
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const processData = body as ProcessData

    // Validação básica
    if (!processData.numeroProcesso) {
      return NextResponse.json(
        { error: 'Número do processo não informado' },
        { status: 400 }
      )
    }

    if (!processData.tribunal) {
      return NextResponse.json({ error: 'Tribunal não informado' }, { status: 400 })
    }

    // Inicia monitoramento
    const session = await processMonitor.startMonitoring(processData)

    return NextResponse.json({
      success: true,
      message: 'Monitoramento iniciado com sucesso',
      session: {
        id: session.id,
        numeroProcesso: session.numeroProcesso,
        startedAt: session.startedAt,
        nextCheckAt: session.nextCheckAt,
        status: session.status,
      },
    })
  } catch (error) {
    console.error('Erro ao iniciar monitoramento:', error)

    return NextResponse.json(
      {
        error: 'Erro ao iniciar monitoramento',
        message: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const sessions = processMonitor.getActiveSessions()

    return NextResponse.json({
      success: true,
      count: sessions.length,
      sessions: sessions.map((s) => ({
        id: s.id,
        numeroProcesso: s.numeroProcesso,
        startedAt: s.startedAt,
        lastCheckAt: s.lastCheckAt,
        nextCheckAt: s.nextCheckAt,
        checksPerformed: s.checksPerformed,
        movementsDetected: s.movementsDetected,
        alertsCreated: s.alertsCreated,
        status: s.status,
        errorCount: s.errorCount,
      })),
    })
  } catch (error) {
    console.error('Erro ao listar sessões:', error)

    return NextResponse.json(
      {
        error: 'Erro ao listar sessões',
        message: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const numeroProcesso = searchParams.get('processo')

    if (!numeroProcesso) {
      return NextResponse.json(
        { error: 'Número do processo não informado' },
        { status: 400 }
      )
    }

    processMonitor.stopMonitoring(numeroProcesso)

    return NextResponse.json({
      success: true,
      message: 'Monitoramento interrompido com sucesso',
    })
  } catch (error) {
    console.error('Erro ao parar monitoramento:', error)

    return NextResponse.json(
      {
        error: 'Erro ao parar monitoramento',
        message: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    )
  }
}
