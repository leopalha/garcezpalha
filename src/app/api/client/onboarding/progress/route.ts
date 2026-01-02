import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { createClient } from '@/lib/supabase/server'
import { createLogger } from '@/lib/logger'
import { z } from 'zod'
import { formatZodErrors } from '@/lib/zod-helpers'

const logger = createLogger('api:client:onboarding:progress')

const progressSchema = z.object({
  step: z.number().int().min(1).max(6),
  data: z.object({
    // Step 2: Profile
    phone: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    cep: z.string().optional(),

    // Step 3: Case info
    caseDescription: z.string().optional(),
    urgencyLevel: z.enum(['low', 'medium', 'high']).optional(),

    // Step 4: Documents
    uploadedDocs: z.array(z.string()).default([]),

    // Step 5: Meeting
    preferredDate: z.string().optional(),
    preferredTime: z.string().optional(),
    meetingNotes: z.string().optional(),
  })
})

/**
 * POST /api/client/onboarding/progress
 * Save onboarding progress
 */
export async function POST(request: NextRequest) {
  try {
    // Auth check
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      logger.warn('Unauthorized onboarding progress save attempt')
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // Parse and validate request body
    const body = await request.json()
    const validatedData = progressSchema.parse(body)

    logger.info('Saving onboarding progress', {
      userId,
      step: validatedData.step
    })

    const supabase = await createClient()

    // Update onboarding progress in profile
    const { error } = await supabase
      .from('profiles')
      .update({
        onboarding_step: validatedData.step,
        onboarding_data: validatedData.data,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)

    if (error) {
      logger.error('Error saving onboarding progress', { error, userId })
      throw new Error('Failed to save progress')
    }

    // Also update profile fields if provided
    const profileUpdates: any = {}
    if (validatedData.data.phone) profileUpdates.phone = validatedData.data.phone
    if (validatedData.data.address) profileUpdates.address = validatedData.data.address
    if (validatedData.data.city) profileUpdates.city = validatedData.data.city
    if (validatedData.data.state) profileUpdates.state = validatedData.data.state
    if (validatedData.data.cep) profileUpdates.cep = validatedData.data.cep

    if (Object.keys(profileUpdates).length > 0) {
      await supabase
        .from('profiles')
        .update(profileUpdates)
        .eq('id', userId)
    }

    logger.info('Onboarding progress saved successfully', {
      userId,
      step: validatedData.step
    })

    return NextResponse.json({
      success: true,
      step: validatedData.step
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Dados inválidos',
          details: formatZodErrors(error),
        },
        { status: 400 }
      )
    }

    logger.error('Error in onboarding progress POST', error)
    return NextResponse.json(
      { error: 'Erro ao salvar progresso' },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
