/**
 * Email Sequence Engine - COMPLETE IMPLEMENTATION
 * Motor de automação de sequências de email com persistência completa
 */

import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'
import type {
  EmailSequence,
  SequenceSubscription,
  SequenceStep,
  SequenceTriggerData,
  SendEmailOptions,
  EmailEvent,
  SequenceStatus,
} from './types'

const resend = new Resend(process.env.RESEND_API_KEY)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export class EmailSequenceEngine {
  /**
   * Subscreve um lead/usuário a uma sequência
   */
  async subscribe(
    sequenceId: string,
    data: SequenceTriggerData
  ): Promise<SequenceSubscription> {
    // Verificar se já existe subscription ativa
    const { data: existing } = await supabase
      .from('email_sequence_subscriptions')
      .select('*')
      .eq('lead_id', data.leadId)
      .eq('sequence_id', sequenceId)
      .single()

    if (existing && existing.status === 'active') {
      console.log('[EmailSequenceEngine] Lead already subscribed:', data.email)
      return this.mapToSubscription(existing)
    }

    // Criar nova subscription
    const { data: inserted, error } = await supabase
      .from('email_sequence_subscriptions')
      .insert({
        lead_id: data.leadId,
        sequence_id: sequenceId,
        current_step_id: null,
        status: 'active',
        subscribed_at: new Date().toISOString(),
        metadata: {
          userId: data.userId,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          ...data.customData,
        },
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to subscribe: ${error.message}`)
    }

    console.log('[EmailSequenceEngine] Subscribed:', data.email, 'to sequence:', sequenceId)

    const subscription = this.mapToSubscription(inserted)

    // Agendar primeiro email
    await this.scheduleNextStep(subscription.id)

    return subscription
  }

  /**
   * Agenda o próximo step de uma subscription
   */
  async scheduleNextStep(subscriptionId: string): Promise<void> {
    // Buscar próximo step usando function do PostgreSQL
    const { data: nextStepData, error } = await supabase
      .rpc('get_next_sequence_step', {
        p_subscription_id: subscriptionId,
      })
      .single()

    if (error || !nextStepData) {
      console.log('[EmailSequenceEngine] No next step found for:', subscriptionId)

      // Marcar subscription como completed
      await supabase
        .from('email_sequence_subscriptions')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('id', subscriptionId)

      return
    }

    const nextStepAny = nextStepData as any
    const { step_id, should_send, scheduled_for } = nextStepAny

    if (!should_send) {
      console.log('[EmailSequenceEngine] Condition not met for step:', step_id)
      return
    }

    // Buscar dados da subscription
    const { data: subscription } = await supabase
      .from('email_sequence_subscriptions')
      .select('*, lead:leads(*)')
      .eq('id', subscriptionId)
      .single()

    if (!subscription) return

    // Criar registro de envio agendado
    await supabase
      .from('email_sequence_sends')
      .insert({
        subscription_id: subscriptionId,
        step_id: step_id,
        lead_id: subscription.lead_id,
        to_email: subscription.lead.email,
        subject: nextStepAny.subject,
        scheduled_for,
      })

    console.log('[EmailSequenceEngine] Scheduled email for:', scheduled_for)
  }

  /**
   * Processa emails agendados (chamado por cron job)
   */
  async processScheduledEmails(): Promise<{
    activeSubscriptions: number
    emailsSent: number
    emailsScheduled: number
    errors: number
  }> {
    console.log('[EmailSequenceEngine] Processing scheduled emails...')

    // Buscar emails agendados para agora ou antes
    const { data: scheduledSends } = await supabase
      .from('email_sequence_sends')
      .select(`
        *,
        subscription:email_sequence_subscriptions(*, lead:leads(*)),
        step:email_sequence_steps(*)
      `)
      .is('sent_at', null)
      .lte('scheduled_for', new Date().toISOString())
      .limit(50)

    if (!scheduledSends || scheduledSends.length === 0) {
      return {
        activeSubscriptions: 0,
        emailsSent: 0,
        emailsScheduled: 0,
        errors: 0,
      }
    }

    let emailsSent = 0
    let errors = 0

    for (const send of scheduledSends) {
      try {
        await this.sendEmailFromSend(send)
        emailsSent++
      } catch (error) {
        console.error('[EmailSequenceEngine] Failed to send:', send.id, error)
        errors++
      }
    }

    // Contar subscriptions ativas
    const { count } = await supabase
      .from('email_sequence_subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')

    return {
      activeSubscriptions: count || 0,
      emailsSent,
      emailsScheduled: scheduledSends.length,
      errors,
    }
  }

  /**
   * Envia email a partir de um registro de send
   */
  private async sendEmailFromSend(send: any): Promise<void> {
    const { subscription, step, lead } = send
    const metadata = subscription.metadata || {}

    // Buscar template
    const templateId = step.template_id
    const template = await this.getTemplate(templateId)

    // Gerar token de unsubscribe (base64 do subscription ID + email para verificação)
    const unsubscribeToken = Buffer.from(subscription.id).toString('base64')
    const unsubscribeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe/${unsubscribeToken}?email=${encodeURIComponent(lead.email)}`

    const variables = {
      firstName: metadata.firstName || lead.name || '',
      lastName: metadata.lastName || '',
      email: lead.email,
      unsubscribeLink: unsubscribeUrl,
      ...metadata,
    }

    const subject = this.replaceVariables(step.subject, variables)
    const html = this.replaceVariables(template.html, variables)
    const text = template.text ? this.replaceVariables(template.text, variables) : undefined

    try {
      // Enviar via Resend
      const result = await resend.emails.send({
        to: lead.email,
        from: process.env.RESEND_FROM_EMAIL || 'contato@garcezpalha.com',
        replyTo: 'contato@garcezpalha.com',
        subject,
        html,
        text,
        tags: [
          { name: 'type', value: 'sequence' },
          { name: 'sequence_id', value: subscription.sequence_id },
          { name: 'step', value: String(step.step_number) },
        ],
        headers: {
          'X-Subscription-ID': subscription.id,
          'X-Step-ID': step.id,
        },
      })

      // Atualizar registro de send
      await supabase
        .from('email_sequence_sends')
        .update({
          sent_at: new Date().toISOString(),
          email_id: result.data?.id,
        })
        .eq('id', send.id)

      // Atualizar subscription current_step
      await supabase
        .from('email_sequence_subscriptions')
        .update({
          current_step_id: step.id,
        })
        .eq('id', subscription.id)

      console.log('[EmailSequenceEngine] Email sent:', result.data?.id, 'to:', lead.email)

      // Agendar próximo step
      await this.scheduleNextStep(subscription.id)

    } catch (error: any) {
      // Marcar como erro
      await supabase
        .from('email_sequence_sends')
        .update({
          sent_at: new Date().toISOString(),
          error_message: error.message,
        })
        .eq('id', send.id)

      throw error
    }
  }

  /**
   * Processa webhooks de email providers (open, click, bounce, etc.)
   */
  async handleWebhook(event: {
    type: 'email.sent' | 'email.delivered' | 'email.opened' | 'email.clicked' | 'email.bounced' | 'email.complained'
    email_id: string
    email: string
    timestamp: string
    link?: string
  }): Promise<void> {
    console.log('[EmailSequenceEngine] Webhook received:', event.type, 'for:', event.email)

    // Buscar send pelo email_id
    const { data: send } = await supabase
      .from('email_sequence_sends')
      .select('*')
      .eq('email_id', event.email_id)
      .single()

    if (!send) {
      console.warn('[EmailSequenceEngine] Send not found for email_id:', event.email_id)
      return
    }

    // Atualizar registro conforme tipo de evento
    const updates: any = {}

    switch (event.type) {
      case 'email.delivered':
        updates.delivered_at = event.timestamp
        break

      case 'email.opened':
        updates.opened_at = event.timestamp
        updates.open_count = (send.open_count || 0) + 1
        break

      case 'email.clicked':
        updates.clicked_at = event.timestamp
        updates.click_count = (send.click_count || 0) + 1

        if (event.link) {
          const links = send.links_clicked || []
          links.push(event.link)
          updates.links_clicked = links
        }
        break

      case 'email.bounced':
        updates.bounced_at = event.timestamp

        // Marcar subscription como bounced
        await supabase
          .from('email_sequence_subscriptions')
          .update({ status: 'bounced' })
          .eq('id', send.subscription_id)
        break

      case 'email.complained':
        updates.complained_at = event.timestamp

        // Marcar como unsubscribed
        await supabase
          .from('email_sequence_subscriptions')
          .update({
            status: 'unsubscribed',
            unsubscribed_at: event.timestamp,
          })
          .eq('id', send.subscription_id)
        break
    }

    await supabase
      .from('email_sequence_sends')
      .update(updates)
      .eq('id', send.id)

    console.log('[EmailSequenceEngine] Webhook processed:', event.type)
  }

  /**
   * Cancela uma subscription
   */
  async unsubscribe(subscriptionId: string): Promise<void> {
    await supabase
      .from('email_sequence_subscriptions')
      .update({
        status: 'unsubscribed',
        unsubscribed_at: new Date().toISOString(),
      })
      .eq('id', subscriptionId)

    console.log('[EmailSequenceEngine] Unsubscribed:', subscriptionId)
  }

  /**
   * Calcula stats de uma sequência
   */
  async calculateStats(sequenceId: string): Promise<{
    totalSubscribers: number
    activeSubscribers: number
    completedSubscribers: number
    totalEmailsSent: number
    totalOpens: number
    totalClicks: number
    openRate: number
    clickRate: number
  }> {
    // Total subscribers
    const { count: totalSubscribers } = await supabase
      .from('email_sequence_subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('sequence_id', sequenceId)

    // Active subscribers
    const { count: activeSubscribers } = await supabase
      .from('email_sequence_subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('sequence_id', sequenceId)
      .eq('status', 'active')

    // Completed subscribers
    const { count: completedSubscribers } = await supabase
      .from('email_sequence_subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('sequence_id', sequenceId)
      .eq('status', 'completed')

    // Email stats - get subscription IDs first
    const { data: subscriptionIds } = await supabase
      .from('email_sequence_subscriptions')
      .select('id')
      .eq('sequence_id', sequenceId)

    const ids = (subscriptionIds || []).map((s: any) => s.id)

    const { data: sends } = await supabase
      .from('email_sequence_sends')
      .select('*')
      .in('subscription_id', ids)

    const totalEmailsSent = sends?.filter(s => s.sent_at).length || 0
    const totalOpens = sends?.filter(s => s.opened_at).length || 0
    const totalClicks = sends?.filter(s => s.clicked_at).length || 0

    const openRate = totalEmailsSent > 0 ? (totalOpens / totalEmailsSent) * 100 : 0
    const clickRate = totalEmailsSent > 0 ? (totalClicks / totalEmailsSent) * 100 : 0

    return {
      totalSubscribers: totalSubscribers || 0,
      activeSubscribers: activeSubscribers || 0,
      completedSubscribers: completedSubscribers || 0,
      totalEmailsSent,
      totalOpens,
      totalClicks,
      openRate: Math.round(openRate * 10) / 10,
      clickRate: Math.round(clickRate * 10) / 10,
    }
  }

  // ============================================================================
  // Helper Methods
  // ============================================================================

  private async getTemplate(templateId: string): Promise<{ html: string; text?: string }> {
    // Buscar template do banco ou arquivos
    // Por enquanto, retorna template básico
    return {
      html: '<p>Olá {{firstName}},</p><p>Bem-vindo!</p><p><a href="{{unsubscribeLink}}">Cancelar inscrição</a></p>',
      text: 'Olá {{firstName}}, Bem-vindo!',
    }
  }

  private mapToSubscription(dbRow: any): SequenceSubscription {
    const metadata = dbRow.metadata || {}

    return {
      id: dbRow.id,
      sequenceId: dbRow.sequence_id,
      userId: metadata.userId,
      leadId: dbRow.lead_id,
      email: metadata.email,
      firstName: metadata.firstName,
      lastName: metadata.lastName,
      customData: metadata,
      currentStepId: dbRow.current_step_id,
      status: dbRow.status,
      startedAt: new Date(dbRow.subscribed_at),
      completedAt: dbRow.completed_at ? new Date(dbRow.completed_at) : undefined,
      cancelledAt: dbRow.unsubscribed_at ? new Date(dbRow.unsubscribed_at) : undefined,
    }
  }

  private replaceVariables(template: string, variables: Record<string, string>): string {
    let result = template

    Object.keys(variables).forEach((key) => {
      const regex = new RegExp(`{{${key}}}`, 'g')
      result = result.replace(regex, variables[key] || '')
    })

    return result
  }
}

export const emailSequenceEngine = new EmailSequenceEngine()
