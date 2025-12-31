/**
 * Bug Report API
 * Handles bug reports from beta testers
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { withRateLimit } from '@/lib/rate-limit'
import { z } from 'zod'

const bugReportSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(20),
  steps: z.string().min(10),
  severity: z.enum(['critical', 'high', 'medium', 'low']),
  page: z.string().optional(),
  screenshot: z.string().optional(), // base64 or URL
})

async function handler(request: NextRequest) {
  try {
    const body = await request.json()
    const validation = bugReportSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      )
    }

    const data = validation.data
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Você precisa estar autenticado para reportar bugs' },
        { status: 401 }
      )
    }

    // Insert bug report
    const { error } = await supabase.from('bug_reports').insert({
      user_id: user.id,
      title: data.title,
      description: data.description,
      steps_to_reproduce: data.steps,
      severity: data.severity,
      page_url: data.page,
      screenshot_url: data.screenshot,
      status: 'open',
      reported_at: new Date().toISOString(),
    })

    if (error) {
      console.error('Error creating bug report:', error)
      return NextResponse.json(
        { error: 'Erro ao processar bug report' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Bug reportado com sucesso! Analisaremos em breve.',
    })
  } catch (error) {
    console.error('Bug report error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Rate limit: 10 bug reports per hour
export const POST = withRateLimit(handler, { type: 'contact', limit: 10 })
