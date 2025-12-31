/**
 * Feature Request API
 * Handles feature requests from beta testers
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { withRateLimit } from '@/lib/rate-limit'
import { z } from 'zod'

const featureRequestSchema = z.object({
  title: z.string().min(5),
  problem: z.string().min(20),
  solution: z.string().min(20),
  priority: z.enum(['critical', 'high', 'medium', 'low']),
  useCase: z.string().optional(),
})

async function handler(request: NextRequest) {
  try {
    const body = await request.json()
    const validation = featureRequestSchema.safeParse(body)

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
        { error: 'Você precisa estar autenticado para sugerir features' },
        { status: 401 }
      )
    }

    // Insert feature request
    const { error } = await supabase.from('feature_requests').insert({
      user_id: user.id,
      title: data.title,
      problem_description: data.problem,
      proposed_solution: data.solution,
      priority: data.priority,
      use_cases: data.useCase,
      status: 'submitted',
      votes: 0,
      submitted_at: new Date().toISOString(),
    })

    if (error) {
      console.error('Error creating feature request:', error)
      return NextResponse.json(
        { error: 'Erro ao processar sugestão' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message:
        'Sugestão recebida com sucesso! Analisaremos em até 7 dias e você receberá feedback.',
    })
  } catch (error) {
    console.error('Feature request error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Rate limit: 5 feature requests per hour
export const POST = withRateLimit(handler, { type: 'contact', limit: 5 })
