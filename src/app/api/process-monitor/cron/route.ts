import { NextRequest, NextResponse } from 'next/server'
import { processMonitor } from '@/lib/process-monitor/monitor-engine'

/**
 * P2-004: Process Monitor Cron Job
 * GET /api/process-monitor/cron
 *
 * Chamado por cron job (Vercel Cron ou serviço externo)
 * Verifica todos os processos monitorados
 *
 * Configurar em vercel.json:
 * {
 *   "crons": [
 *     {
 *       "path": "/api/process-monitor/cron",
 *       "schedule": "0 * * * *"
 *     }
 *   ]
 * }
 */
export async function GET(req: NextRequest) {
  try {
    // Validação de segurança (opcional): verificar token ou IP
    const authHeader = req.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('[CRON] Executando verificação de processos...')

    await processMonitor.runScheduledCheck()

    const sessions = processMonitor.getActiveSessions()

    return NextResponse.json({
      success: true,
      message: 'Verificação executada com sucesso',
      timestamp: new Date().toISOString(),
      activeSessions: sessions.length,
      stats: {
        totalChecks: sessions.reduce((sum, s) => sum + s.checksPerformed, 0),
        totalMovements: sessions.reduce((sum, s) => sum + s.movementsDetected, 0),
        totalAlerts: sessions.reduce((sum, s) => sum + s.alertsCreated, 0),
        totalErrors: sessions.reduce((sum, s) => sum + s.errorCount, 0),
      },
    })
  } catch (error) {
    console.error('[CRON] Erro ao executar verificação:', error)

    return NextResponse.json(
      {
        error: 'Erro ao executar verificação',
        message: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    )
  }
}
