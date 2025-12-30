import { NextRequest, NextResponse } from 'next/server'
import { emailSequenceEngine } from '@/lib/email/sequences/engine'

// Force dynamic rendering - required for API routes
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * P2-001: Email Sequences Cron Job
 * GET /api/email/sequences/cron
 *
 * Chamado por Vercel Cron a cada 15 minutos
 * Processa todas as sequências ativas e envia emails agendados
 */
export async function GET(req: NextRequest) {
  try {
    // Validação de segurança: verificar token ou IP
    const authHeader = req.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('[CRON] Processando sequências de email...')

    // Processar todas as sequências ativas
    const stats = await emailSequenceEngine.processScheduledEmails()

    return NextResponse.json({
      success: true,
      message: 'Sequências processadas com sucesso',
      timestamp: new Date().toISOString(),
      stats: {
        activeSubscriptions: stats.activeSubscriptions,
        emailsSent: stats.emailsSent,
        emailsScheduled: stats.emailsScheduled,
        errors: stats.errors,
      },
    })
  } catch (error) {
    console.error('[CRON] Erro ao processar sequências:', error)

    return NextResponse.json(
      {
        error: 'Erro ao processar sequências',
        message: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    )
  }
}
