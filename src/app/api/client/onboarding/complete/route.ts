import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { createClient } from '@/lib/supabase/server'
import { createLogger } from '@/lib/logger'
import { z } from 'zod'
import { formatZodErrors } from '@/lib/zod-helpers'
import { createNotification } from '@/lib/notifications/client-notifications'

const logger = createLogger('api:client:onboarding:complete')

const completeSchema = z.object({
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

/**
 * POST /api/client/onboarding/complete
 * Mark onboarding as complete and create initial case/notification
 */
export async function POST(request: NextRequest) {
  try {
    // Auth check
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      logger.warn('Unauthorized onboarding complete attempt')
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // Parse and validate request body
    const body = await request.json()
    const validatedData = completeSchema.parse(body)

    logger.info('Completing onboarding', { userId })

    const supabase = await createClient()

    // Get user's purchased service from checkout
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', userId)
      .single()

    // Update profile with final data
    const profileUpdates: any = {
      onboarding_completed: true,
      onboarding_step: 6,
      onboarding_data: validatedData,
      onboarding_completed_at: new Date().toISOString()
    }

    if (validatedData.phone) profileUpdates.phone = validatedData.phone
    if (validatedData.address) profileUpdates.address = validatedData.address
    if (validatedData.city) profileUpdates.city = validatedData.city
    if (validatedData.state) profileUpdates.state = validatedData.state
    if (validatedData.cep) profileUpdates.cep = validatedData.cep

    const { error: profileError } = await supabase
      .from('profiles')
      .update(profileUpdates)
      .eq('id', userId)

    if (profileError) {
      logger.error('Error updating profile', { error: profileError, userId })
      throw new Error('Failed to complete onboarding')
    }

    // Create a welcome notification
    try {
      await createNotification({
        userId,
        type: 'message',
        title: 'Bem-vindo ao Garcez Palha!',
        description: 'Seu onboarding foi concluído com sucesso. Agora você pode acompanhar seu caso, conversar com seu advogado e enviar documentos.',
        link: '/cliente/dashboard',
        sendEmail: false
      })
    } catch (notifError) {
      logger.error('Error creating welcome notification', notifError)
      // Don't fail the request if notification fails
    }

    // If case description was provided, create an initial note/case
    if (validatedData.caseDescription) {
      try {
        // This could create an initial case or note for the lawyer
        // For now, we'll just log it
        logger.info('Client provided case description', {
          userId,
          urgency: validatedData.urgencyLevel,
          description: validatedData.caseDescription.substring(0, 100)
        })
      } catch (error) {
        logger.error('Error processing case description', error)
      }
    }

    // If meeting was scheduled, create a pending appointment
    if (validatedData.preferredDate && validatedData.preferredTime) {
      try {
        const meetingDateTime = `${validatedData.preferredDate}T${validatedData.preferredTime}:00`

        await supabase
          .from('appointments')
          .insert({
            client_id: userId,
            title: 'Primeira Conversa - Onboarding',
            description: validatedData.meetingNotes || 'Primeira reunião com o cliente para discutir o caso',
            start_time: meetingDateTime,
            duration: 30, // 30 minutes
            type: 'video_call',
            status: 'pending',
            metadata: {
              isOnboarding: true,
              urgencyLevel: validatedData.urgencyLevel
            }
          })

        logger.info('Created onboarding appointment', {
          userId,
          dateTime: meetingDateTime
        })

        // Notify client about scheduled meeting
        await createNotification({
          userId,
          type: 'case_update',
          title: 'Reunião agendada!',
          description: `Sua primeira conversa foi agendada para ${new Date(meetingDateTime).toLocaleDateString('pt-BR')} às ${validatedData.preferredTime}. Você receberá um email de confirmação em breve.`,
          link: '/cliente/dashboard',
          sendEmail: true
        })
      } catch (apptError) {
        logger.error('Error creating appointment', apptError)
        // Don't fail the request
      }
    }

    logger.info('Onboarding completed successfully', { userId })

    return NextResponse.json({
      success: true,
      message: 'Onboarding concluído com sucesso!'
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

    logger.error('Error in onboarding complete POST', error)
    return NextResponse.json(
      { error: 'Erro ao finalizar onboarding' },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
