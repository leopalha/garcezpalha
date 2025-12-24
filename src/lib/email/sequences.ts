/**
 * Email Sequences Configuration
 *
 * Manages automated email sequences for lead nurturing
 *
 * Sequences:
 * 1. New Lead Welcome Sequence (4 emails over 14 days)
 * 2. Appointment Sequence (reminders + follow-up)
 * 3. Post-Consultation Sequence (feedback + upsell)
 */

import { createClient } from '@/lib/supabase/server'
import { emailService } from './email-service'

export interface EmailSequenceStep {
  step: number
  delayHours: number // Hours after trigger
  emailType: string
  subject: string
}

export interface LeadSequenceData {
  leadId: string
  leadName: string
  leadEmail: string
  serviceInterest: string
  createdAt: Date
}

class EmailSequencesService {
  /**
   * New Lead Welcome Sequence
   *
   * Day 1 (0h): Welcome email with next steps
   * Day 3 (72h): "How can we help?" follow-up
   * Day 7 (168h): Service overview + case studies
   * Day 14 (336h): Final "Are you still interested?"
   */
  private readonly WELCOME_SEQUENCE: EmailSequenceStep[] = [
    {
      step: 1,
      delayHours: 0, // Immediate
      emailType: 'welcome-1',
      subject: 'Bem-vindo(a) à Garcez Palha!',
    },
    {
      step: 2,
      delayHours: 72, // Day 3
      emailType: 'welcome-2',
      subject: 'Como podemos ajudá-lo?',
    },
    {
      step: 3,
      delayHours: 168, // Day 7
      emailType: 'welcome-3',
      subject: 'Conheça nossos serviços',
    },
    {
      step: 4,
      delayHours: 336, // Day 14
      emailType: 'welcome-4',
      subject: 'Última oportunidade - Ainda precisa de ajuda?',
    },
  ]

  /**
   * Enroll a lead in the welcome sequence
   */
  async enrollLeadInWelcomeSequence(data: LeadSequenceData): Promise<boolean> {
    const supabase = await createClient()

    try {
      console.log('[Email Sequences] Enrolling lead in welcome sequence:', data.leadId)

      // Create sequence enrollment record
      const { error } = await supabase.from('email_sequences').insert({
        lead_id: data.leadId,
        sequence_type: 'welcome',
        current_step: 0,
        total_steps: this.WELCOME_SEQUENCE.length,
        status: 'active',
        started_at: new Date().toISOString(),
        metadata: {
          leadName: data.leadName,
          leadEmail: data.leadEmail,
          serviceInterest: data.serviceInterest,
        },
      })

      if (error) throw error

      // Send first email immediately
      await this.processWelcomeSequenceStep(data, 1)

      return true
    } catch (error) {
      console.error('[Email Sequences] Error enrolling lead:', error)
      return false
    }
  }

  /**
   * Process all pending sequence emails
   */
  async processPendingSequences(): Promise<{
    success: boolean
    emailsSent: number
    errors: number
  }> {
    const supabase = await createClient()

    try {
      console.log('[Email Sequences] Processing pending sequences...')

      // Get all active sequences
      const { data: sequences, error } = await supabase
        .from('email_sequences')
        .select('*')
        .eq('status', 'active')

      if (error) throw error
      if (!sequences || sequences.length === 0) {
        return { success: true, emailsSent: 0, errors: 0 }
      }

      let emailsSent = 0
      let errors = 0
      const now = new Date()

      for (const sequence of sequences) {
        try {
          // Determine which step should be sent
          const startedAt = new Date(sequence.started_at)
          const hoursSinceStart =
            (now.getTime() - startedAt.getTime()) / (1000 * 60 * 60)

          // Check each step
          for (const step of this.WELCOME_SEQUENCE) {
            // Skip if this step was already sent
            if (step.step <= sequence.current_step) continue

            // Check if it's time to send this step
            if (hoursSinceStart >= step.delayHours) {
              const sent = await this.processWelcomeSequenceStep(
                {
                  leadId: sequence.lead_id,
                  leadName: sequence.metadata.leadName,
                  leadEmail: sequence.metadata.leadEmail,
                  serviceInterest: sequence.metadata.serviceInterest,
                  createdAt: startedAt,
                },
                step.step
              )

              if (sent) {
                emailsSent++

                // Update sequence progress
                await supabase
                  .from('email_sequences')
                  .update({
                    current_step: step.step,
                    last_sent_at: now.toISOString(),
                    // Mark as completed if this was the last step
                    status:
                      step.step === this.WELCOME_SEQUENCE.length
                        ? 'completed'
                        : 'active',
                    completed_at:
                      step.step === this.WELCOME_SEQUENCE.length
                        ? now.toISOString()
                        : null,
                  })
                  .eq('id', sequence.id)
              } else {
                errors++
              }
            }
          }
        } catch (error) {
          console.error(
            `[Email Sequences] Error processing sequence ${sequence.id}:`,
            error
          )
          errors++
        }
      }

      console.log(
        `[Email Sequences] Processing complete: ${emailsSent} sent, ${errors} errors`
      )

      return {
        success: true,
        emailsSent,
        errors,
      }
    } catch (error) {
      console.error('[Email Sequences] Error processing sequences:', error)
      return {
        success: false,
        emailsSent: 0,
        errors: 0,
      }
    }
  }

  /**
   * Process a specific welcome sequence step
   */
  private async processWelcomeSequenceStep(
    data: LeadSequenceData,
    step: number
  ): Promise<boolean> {
    try {
      switch (step) {
        case 1:
          // Welcome email 1
          return await emailService.sendWelcomeEmail1({
            to: data.leadEmail,
            name: data.leadName,
            serviceInterest: data.serviceInterest,
            leadId: data.leadId,
          })

        case 2:
          // Welcome email 2 - Follow-up
          return await emailService.sendWelcomeEmail2({
            to: data.leadEmail,
            name: data.leadName,
            leadId: data.leadId,
          })

        case 3:
          // Welcome email 3 - Services overview
          return await emailService.sendCustomEmail({
            to: data.leadEmail,
            subject: `${data.leadName}, conheça nossos serviços`,
            html: this.getServicesOverviewHTML(data.leadName),
            text: this.getServicesOverviewText(data.leadName),
            tags: ['welcome-3', 'sequence'],
            metadata: { leadId: data.leadId },
          })

        case 4:
          // Welcome email 4 - Last chance
          return await emailService.sendCustomEmail({
            to: data.leadEmail,
            subject: `Última oportunidade - Ainda precisa de ajuda jurídica?`,
            html: this.getLastChanceHTML(data.leadName),
            text: this.getLastChanceText(data.leadName),
            tags: ['welcome-4', 'sequence'],
            metadata: { leadId: data.leadId },
          })

        default:
          console.error('[Email Sequences] Unknown step:', step)
          return false
      }
    } catch (error) {
      console.error('[Email Sequences] Error sending step email:', error)
      return false
    }
  }

  /**
   * Pause a sequence (when lead converts or responds)
   */
  async pauseSequence(leadId: string): Promise<boolean> {
    const supabase = await createClient()

    try {
      await supabase
        .from('email_sequences')
        .update({ status: 'paused' })
        .eq('lead_id', leadId)
        .eq('status', 'active')

      console.log('[Email Sequences] Sequence paused for lead:', leadId)
      return true
    } catch (error) {
      console.error('[Email Sequences] Error pausing sequence:', error)
      return false
    }
  }

  /**
   * Cancel a sequence (when lead unsubscribes)
   */
  async cancelSequence(leadId: string): Promise<boolean> {
    const supabase = await createClient()

    try {
      await supabase
        .from('email_sequences')
        .update({ status: 'cancelled' })
        .eq('lead_id', leadId)
        .in('status', ['active', 'paused'])

      console.log('[Email Sequences] Sequence cancelled for lead:', leadId)
      return true
    } catch (error) {
      console.error('[Email Sequences] Error cancelling sequence:', error)
      return false
    }
  }

  /**
   * Get services overview HTML
   */
  private getServicesOverviewHTML(name: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #7c2d12 0%, #991b1b 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Nossos Serviços</h1>
          <p style="color: #fef3c7; margin-top: 10px; font-size: 16px;">Tradição desde 1661</p>
        </div>

        <div style="padding: 40px 20px;">
          <p style="font-size: 16px; line-height: 1.6; color: #374151;">
            Olá <strong>${name}</strong>,
          </p>

          <p style="font-size: 16px; line-height: 1.6; color: #374151;">
            Ao longo de mais de 3 séculos, a família Garcez Palha se especializou em diversas áreas do Direito. Conheça nossos principais serviços:
          </p>

          <div style="margin: 30px 0;">
            <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #92400e; margin-top: 0;">🏠 Direito Imobiliário</h3>
              <p style="color: #78350f; margin: 10px 0;">Compra, venda, regularização de imóveis, usucapião, desapropriação, e análise de documentação.</p>
            </div>

            <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #1e40af; margin-top: 0;">⚖️ Direito Criminal</h3>
              <p style="color: #1e3a8a; margin: 10px 0;">Defesa criminal, habeas corpus, recursos, audiências, e acompanhamento processual completo.</p>
            </div>

            <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #065f46; margin-top: 0;">🔍 Perícia Documental</h3>
              <p style="color: #064e3b; margin: 10px 0;">Análise de autenticidade de documentos, perícia grafotécnica, e laudos técnicos para processos judiciais.</p>
            </div>

            <div style="background: #fef2f2; padding: 20px; border-radius: 8px;">
              <h3 style="color: #991b1b; margin-top: 0;">📊 Avaliação de Imóveis</h3>
              <p style="color: #7f1d1d; margin: 10px 0;">Laudos de avaliação para compra, venda, partilha, inventário, e processos judiciais.</p>
            </div>
          </div>

          <div style="text-align: center; margin-top: 40px;">
            <a href="https://garcezpalha.com/agendar" style="background: #991b1b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
              Agendar Consulta Grátis
            </a>
          </div>

          <p style="font-size: 14px; color: #6b7280; margin-top: 30px; text-align: center;">
            Dúvidas? Responda este email ou ligue: <strong>(21) 99535-4010</strong>
          </p>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
          <p><strong>⚠️ Aviso Legal:</strong> Este email contém informações gerais e não constitui consulta jurídica formal.</p>
          <p style="margin-top: 10px;">
            <strong>Garcez Palha - Consultoria Jurídica & Pericial</strong><br/>
            Tradição desde 1661 | Excelência desde sempre<br/>
            📍 Av. das Américas 13685, Barra da Tijuca, Rio de Janeiro/RJ<br/>
            📞 (21) 99535-4010 | 📧 contato@garcezpalha.com<br/>
            🌐 <a href="https://garcezpalha.com">garcezpalha.com</a>
          </p>
        </div>
      </div>
    `
  }

  /**
   * Get services overview plain text
   */
  private getServicesOverviewText(name: string): string {
    return `Olá ${name},

Ao longo de mais de 3 séculos, a família Garcez Palha se especializou em diversas áreas do Direito.

NOSSOS SERVIÇOS:

🏠 Direito Imobiliário
Compra, venda, regularização de imóveis, usucapião, desapropriação, e análise de documentação.

⚖️ Direito Criminal
Defesa criminal, habeas corpus, recursos, audiências, e acompanhamento processual completo.

🔍 Perícia Documental
Análise de autenticidade de documentos, perícia grafotécnica, e laudos técnicos.

📊 Avaliação de Imóveis
Laudos de avaliação para compra, venda, partilha, inventário, e processos judiciais.

Agende uma consulta grátis: https://garcezpalha.com/agendar
Ou ligue: (21) 99535-4010

Garcez Palha - Consultoria Jurídica
Tradição desde 1661`
  }

  /**
   * Get last chance HTML
   */
  private getLastChanceHTML(name: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #991b1b; padding: 40px 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Última Oportunidade</h1>
        </div>

        <div style="padding: 40px 20px;">
          <p style="font-size: 16px; line-height: 1.6; color: #374151;">
            Olá <strong>${name}</strong>,
          </p>

          <p style="font-size: 16px; line-height: 1.6; color: #374151;">
            Entramos em contato há algumas semanas sobre seus interesses jurídicos, mas ainda não tivemos retorno.
          </p>

          <p style="font-size: 16px; line-height: 1.6; color: #374151;">
            Se ainda precisa de assistência jurídica, estamos à disposição. Caso contrário, este será nosso último email sobre o assunto.
          </p>

          <div style="background: #fef3c7; border-left: 4px solid #d97706; padding: 20px; margin: 30px 0;">
            <p style="margin: 0; color: #92400e;">
              <strong>💡 Consulta inicial gratuita:</strong> Agende uma conversa de 30 minutos sem compromisso para entendermos seu caso.
            </p>
          </div>

          <div style="text-align: center; margin-top: 40px;">
            <a href="https://garcezpalha.com/agendar" style="background: #991b1b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
              Sim, quero agendar!
            </a>
          </div>

          <p style="font-size: 14px; color: #6b7280; margin-top: 30px; text-align: center;">
            Ou responda este email com "NÃO TENHO INTERESSE" para não receber mais contatos.
          </p>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; text-align: center;">
          <p>Garcez Palha - Consultoria Jurídica</p>
          <p>(21) 99535-4010 | contato@garcezpalha.com</p>
        </div>
      </div>
    `
  }

  /**
   * Get last chance plain text
   */
  private getLastChanceText(name: string): string {
    return `Olá ${name},

Entramos em contato há algumas semanas sobre seus interesses jurídicos, mas ainda não tivemos retorno.

Se ainda precisa de assistência jurídica, estamos à disposição. Caso contrário, este será nosso último email.

💡 Consulta inicial gratuita: Agende uma conversa de 30 minutos sem compromisso.

Agende: https://garcezpalha.com/agendar
Ou responda "NÃO TENHO INTERESSE" para não receber mais contatos.

Garcez Palha
(21) 99535-4010 | contato@garcezpalha.com`
  }
}

// Export singleton
export const emailSequences = new EmailSequencesService()
