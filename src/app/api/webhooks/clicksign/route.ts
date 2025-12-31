/**
 * ClickSign Webhook Handler
 * Receives notifications when documents are signed
 * Transitions conversation from 'contract_pending' → 'onboarding'
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import crypto from 'crypto'

// ClickSign webhook event types
interface ClickSignWebhookPayload {
  event: {
    name: string // 'signer_signed', 'document_signed', 'document_canceled', etc.
    occurred_at: string
    data: {
      document: {
        key: string
        status: 'draft' | 'running' | 'closed' | 'canceled'
        filename: string
        downloads: {
          signed_file_url: string | null
          original_file_url: string
        }
      }
      signer?: {
        key: string
        email: string
        name: string
        signed_at: string
      }
    }
  }
}

/**
 * Verify webhook signature (ClickSign uses HMAC SHA256)
 */
function verifySignature(payload: string, signature: string, secret: string): boolean {
  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(payload)
  const calculatedSignature = hmac.digest('hex')
  return calculatedSignature === signature
}

export async function POST(request: NextRequest) {
  try {
    const webhookSecret = process.env.CLICKSIGN_WEBHOOK_SECRET

    if (!webhookSecret) {
      console.log('[ClickSign Webhook] Not configured, returning 503')
      return NextResponse.json({ error: 'ClickSign webhook not configured' }, { status: 503 })
    }

    const body = await request.text()
    const signature = request.headers.get('x-clicksign-signature')

    // Verify signature
    if (signature) {
      const isValid = verifySignature(body, signature, webhookSecret)
      if (!isValid) {
        console.error('[ClickSign Webhook] Invalid signature')
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }
    }

    const payload: ClickSignWebhookPayload = JSON.parse(body)
    console.log('[ClickSign Webhook] Event received:', payload.event.name)

    // Handle different event types
    switch (payload.event.name) {
      case 'document_signed':
        await handleDocumentSigned(payload)
        break

      case 'signer_signed':
        await handleSignerSigned(payload)
        break

      case 'document_canceled':
        await handleDocumentCanceled(payload)
        break

      case 'document_refused':
        await handleDocumentRefused(payload)
        break

      default:
        console.log('[ClickSign Webhook] Unhandled event type:', payload.event.name)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[ClickSign Webhook] Error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

/**
 * Handle document fully signed
 */
async function handleDocumentSigned(payload: ClickSignWebhookPayload) {
  const documentKey = payload.event.data.document.key
  const signedFileUrl = payload.event.data.document.downloads.signed_file_url

  console.log('[ClickSign] Document signed:', documentKey)

  const supabase = await createClient()

  // Find conversation by document key (stored in proposal metadata)
  const { data: conversations } = await supabase
    .from('conversations')
    .select('*')
    .contains('proposal', { clicksign_document_key: documentKey })
    .limit(1)

  if (!conversations || conversations.length === 0) {
    console.warn('[ClickSign] No conversation found for document:', documentKey)
    return
  }

  const conversation = conversations[0]

  // Transition to 'onboarding' state
  const { error } = await supabase
    .from('conversations')
    .update({
      status: {
        state: 'onboarding',
        updated_at: new Date().toISOString(),
      },
      proposal: {
        ...conversation.proposal,
        contract_status: 'signed',
        contract_signed_at: new Date().toISOString(),
        contract_file_url: signedFileUrl,
      },
    })
    .eq('conversation_id', conversation.conversation_id)

  if (error) {
    console.error('[ClickSign] Error updating conversation:', error)
    return
  }

  console.log(`[ClickSign] Conversation ${conversation.conversation_id} moved to onboarding`)

  // Trigger next steps after contract signature
  try {
    // Send welcome email with case details
    const lead = conversation.lead_data || {}
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/email/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: lead.email,
        template: 'contract-signed',
        data: {
          name: lead.name,
          caseType: conversation.case_type,
          lawyerName: 'Garcez Palha',
          nextSteps: [
            'Análise detalhada do seu caso pela nossa equipe jurídica',
            'Contato do advogado responsável em até 24h',
            'Coleta de documentação complementar, se necessário',
            'Desenvolvimento da estratégia jurídica personalizada'
          ]
        }
      })
    })

    // Notify admin about new signed contract
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/notifications/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'contract_signed',
        title: 'Novo Contrato Assinado',
        message: `${lead.name} assinou o contrato. Caso: ${conversation.case_type}`,
        conversation_id: conversation.conversation_id,
        priority: 'high'
      })
    })

    console.log('[ClickSign] Welcome email sent and admin notified')
  } catch (error) {
    console.error('[ClickSign] Error sending notifications:', error)
  }

  // After 1 hour, transition to 'active_case'
  setTimeout(async () => {
    const { error: transitionError } = await supabase
      .from('conversations')
      .update({
        status: {
          state: 'active_case',
          updated_at: new Date().toISOString(),
        },
      })
      .eq('conversation_id', conversation.conversation_id)

    if (transitionError) {
      console.error('[ClickSign] Error transitioning to active_case:', transitionError)
    } else {
      console.log(`[ClickSign] Conversation ${conversation.conversation_id} moved to active_case`)

      // Notify assigned lawyer
      try {
        const lead = conversation.lead_data || {}
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/notifications/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'case_activated',
            title: 'Novo Caso Ativo',
            message: `Caso de ${lead.name} está pronto para atendimento. Tipo: ${conversation.case_type}`,
            conversation_id: conversation.conversation_id,
            priority: 'high',
            assigned_to: 'lawyer' // Will be replaced with specific lawyer ID in the future
          })
        })
        console.log('[ClickSign] Lawyer notified about active case')
      } catch (error) {
        console.error('[ClickSign] Error notifying lawyer:', error)
      }
    }
  }, 3600000) // 1 hour
}

/**
 * Handle individual signer signed (partial signature)
 */
async function handleSignerSigned(payload: ClickSignWebhookPayload) {
  const documentKey = payload.event.data.document.key
  const signer = payload.event.data.signer

  console.log('[ClickSign] Signer signed:', signer?.email)

  const supabase = await createClient()

  // Update conversation metadata
  const { data: conversations } = await supabase
    .from('conversations')
    .select('*')
    .contains('proposal', { clicksign_document_key: documentKey })
    .limit(1)

  if (!conversations || conversations.length === 0) {
    return
  }

  const conversation = conversations[0]

  await supabase
    .from('conversations')
    .update({
      metadata: {
        ...conversation.metadata,
        clicksign_signers: [
          ...(conversation.metadata?.clicksign_signers || []),
          {
            email: signer?.email,
            name: signer?.name,
            signed_at: signer?.signed_at,
          },
        ],
      },
    })
    .eq('conversation_id', conversation.conversation_id)

  console.log('[ClickSign] Signer information updated')
}

/**
 * Handle document canceled
 */
async function handleDocumentCanceled(payload: ClickSignWebhookPayload) {
  const documentKey = payload.event.data.document.key

  console.log('[ClickSign] Document canceled:', documentKey)

  const supabase = await createClient()

  const { data: conversations } = await supabase
    .from('conversations')
    .select('*')
    .contains('proposal', { clicksign_document_key: documentKey })
    .limit(1)

  if (!conversations || conversations.length === 0) {
    return
  }

  const conversation = conversations[0]

  // Mark as escalated for manual review
  await supabase
    .from('conversations')
    .update({
      status: {
        state: 'escalated',
        updated_at: new Date().toISOString(),
        escalation_reason: 'Contrato cancelado pelo cliente',
      },
      proposal: {
        ...conversation.proposal,
        contract_status: 'canceled',
      },
    })
    .eq('conversation_id', conversation.conversation_id)

  console.log('[ClickSign] Conversation escalated due to contract cancellation')

  // Notify admin about contract cancellation
  try {
    const lead = conversation.lead_data || {}
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/notifications/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'contract_canceled',
        title: 'Contrato Cancelado - Requer Atenção',
        message: `Contrato de ${lead.name} foi cancelado. Caso: ${conversation.case_type}. Requer follow-up manual.`,
        conversation_id: conversation.conversation_id,
        priority: 'urgent'
      })
    })
    console.log('[ClickSign] Admin notified about contract cancellation')
  } catch (error) {
    console.error('[ClickSign] Error notifying admin about cancellation:', error)
  }
}

/**
 * Handle document refused
 */
async function handleDocumentRefused(payload: ClickSignWebhookPayload) {
  const documentKey = payload.event.data.document.key

  console.log('[ClickSign] Document refused:', documentKey)

  const supabase = await createClient()

  const { data: conversations } = await supabase
    .from('conversations')
    .select('*')
    .contains('proposal', { clicksign_document_key: documentKey })
    .limit(1)

  if (!conversations || conversations.length === 0) {
    return
  }

  const conversation = conversations[0]

  // Escalate for manual review
  await supabase
    .from('conversations')
    .update({
      status: {
        state: 'escalated',
        updated_at: new Date().toISOString(),
        escalation_reason: 'Cliente recusou o contrato',
      },
      proposal: {
        ...conversation.proposal,
        contract_status: 'refused',
      },
    })
    .eq('conversation_id', conversation.conversation_id)

  console.log('[ClickSign] Conversation escalated due to contract refusal')

  // Notify admin about contract refusal for follow-up
  try {
    const lead = conversation.lead_data || {}
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/notifications/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'contract_refused',
        title: 'Contrato Recusado - Follow-up Necessário',
        message: `${lead.name} recusou o contrato. Caso: ${conversation.case_type}. Entrar em contato para entender objeções.`,
        conversation_id: conversation.conversation_id,
        priority: 'urgent'
      })
    })
    console.log('[ClickSign] Admin notified about contract refusal')
  } catch (error) {
    console.error('[ClickSign] Error notifying admin about refusal:', error)
  }
}

export const runtime = 'nodejs'
export const maxDuration = 30
