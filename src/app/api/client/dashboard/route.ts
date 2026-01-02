import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { createLogger } from '@/lib/logger'
import { ZodError } from 'zod'
import { formatZodErrors } from '@/lib/zod-helpers'
import { clientDashboardQuerySchema } from '@/lib/validations/client-schemas'
import { createClient } from '@/lib/supabase/server'

const logger = createLogger('api:client:dashboard')

/**
 * GET /api/client/dashboard
 * Get client dashboard data including stats and recent activity
 */
export async function GET(request: NextRequest) {
  try {
    // Auth check
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      logger.warn('Unauthorized dashboard access attempt')
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const userId = session.user.id
    logger.info('Fetching dashboard data', { userId })

    const supabase = await createClient()

    // Fetch active cases for stats
    const { data: allCases, error: casesError } = await supabase
      .from('cases')
      .select('id, status, service_type, progress, next_step, updated_at, lawyer_id')
      .eq('client_id', userId)
      .in('status', ['aguardando_documentos', 'em_analise', 'em_andamento'])

    if (casesError) {
      logger.error('Error fetching cases', casesError)
      throw new Error('Failed to fetch cases')
    }

    // Fetch pending documents count
    const { count: pendingDocsCount, error: docsError } = await supabase
      .from('case_documents')
      .select('*', { count: 'exact', head: true })
      .in('case_id', allCases?.map(c => c.id) || [])
      .eq('status', 'pending')

    if (docsError) {
      logger.error('Error fetching documents count', docsError)
    }

    // Fetch unread notifications
    const { data: unreadNotifs, count: unreadCount, error: notifsError } = await supabase
      .from('notifications')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .eq('read', false)
      .order('created_at', { ascending: false })
      .limit(5)

    if (notifsError) {
      logger.error('Error fetching notifications', notifsError)
    }

    // Get lawyer info for recent cases
    const lawyerIds = [...new Set(allCases?.map(c => c.lawyer_id) || [])]
    const { data: lawyers, error: lawyersError } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url')
      .in('id', lawyerIds)

    if (lawyersError) {
      logger.error('Error fetching lawyers', lawyersError)
    }

    // Map lawyer data
    const lawyerMap = new Map(lawyers?.map(l => [l.id, l]) || [])

    // Format recent cases
    const recentCases = (allCases || []).slice(0, 5).map(c => {
      const lawyer = lawyerMap.get(c.lawyer_id)
      return {
        id: c.id,
        serviceType: c.service_type,
        status: c.status,
        lawyer: {
          name: lawyer?.full_name || 'Advogado não atribuído',
          photo: lawyer?.avatar_url || null,
        },
        progress: c.progress,
        updatedAt: c.updated_at,
        nextStep: c.next_step || 'Sem próximos passos definidos',
      }
    })

    // Fetch recent timeline events for activity
    const { data: recentTimeline, error: timelineError } = await supabase
      .from('case_timeline')
      .select('id, type, title, description, created_at')
      .in('case_id', allCases?.map(c => c.id) || [])
      .order('created_at', { ascending: false })
      .limit(10)

    if (timelineError) {
      logger.error('Error fetching timeline', timelineError)
    }

    const dashboardData = {
      stats: {
        activeCases: allCases?.length || 0,
        pendingDocuments: pendingDocsCount || 0,
        unreadMessages: unreadCount || 0,
        upcomingDeadlines: 0, // TODO: Implement when we have deadlines table
      },
      cases: recentCases,
      notifications: (unreadNotifs || []).map(n => ({
        id: n.id,
        type: n.type,
        title: n.title,
        description: n.description,
        read: n.read,
        createdAt: n.created_at,
      })),
      recentActivity: (recentTimeline || []).map(t => ({
        id: t.id,
        type: t.type,
        title: t.title,
        description: t.description,
        timestamp: t.created_at,
      })),
    }

    logger.info('Dashboard data retrieved successfully', {
      userId,
      activeCases: dashboardData.stats.activeCases,
    })

    return NextResponse.json(dashboardData)

  } catch (error) {
    if (error instanceof ZodError) {
      logger.warn('Validation error', { errors: formatZodErrors(error) })
      return NextResponse.json(
        {
          error: 'Dados inválidos',
          details: formatZodErrors(error),
        },
        { status: 400 }
      )
    }

    logger.error('Error fetching dashboard', error)
    return NextResponse.json(
      { error: 'Erro ao carregar dashboard' },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
