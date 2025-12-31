/**
 * Beta Signup API
 * Handles beta tester applications
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { withRateLimit } from '@/lib/rate-limit'
import { z } from 'zod'

const betaSignupSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  phone: z.string().min(10),
  profession: z.string(),
  oab: z.string().optional(),
  company: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  interests: z.array(z.string()),
  techFamiliarity: z.string(),
  weeklyHours: z.string().optional(),
  usedOtherPlatforms: z.string(),
  otherPlatforms: z.string().optional(),
  canDedicateTime: z.string(),
  motivation: z.string().min(50),
})

async function handler(request: NextRequest) {
  try {
    const body = await request.json()
    const validation = betaSignupSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      )
    }

    const data = validation.data
    const supabase = await createClient()

    // Check if already applied
    const { data: existing } = await supabase
      .from('beta_applications')
      .select('id')
      .eq('email', data.email)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'Você já se inscreveu! Analisaremos em breve.' },
        { status: 409 }
      )
    }

    // Auto-approve lawyers with OAB
    const isLawyer = data.profession === 'advogado' && data.oab
    const status = isLawyer ? 'approved' : 'pending'

    // Insert application
    const { error } = await supabase.from('beta_applications').insert({
      ...data,
      status,
      applied_at: new Date().toISOString(),
    })

    if (error) {
      console.error('Error creating beta application:', error)
      return NextResponse.json(
        { error: 'Erro ao processar inscrição' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: isLawyer
        ? 'Parabéns! Você foi aprovado automaticamente.'
        : 'Inscrição recebida! Analisaremos em até 48h.',
      autoApproved: isLawyer,
    })
  } catch (error) {
    console.error('Beta signup error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Rate limit: 3 applications per hour
export const POST = withRateLimit(handler, { type: 'contact', limit: 3 })
