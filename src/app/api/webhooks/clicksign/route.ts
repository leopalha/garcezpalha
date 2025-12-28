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
  } catch (error: any) {
    console.error('[ClickSign Webhook] Error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed', details: error.message },
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

  // TODO: Trigger next steps
  // - Send welcome email with case details
  // - Schedule onboarding call
  // - Assign case to lawyer
  // - Create case in CRM

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
      // TODO: Notify assigned lawyer
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

  // TODO: Notify admin
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

  // TODO: Notify admin for follow-up
}

export const runtime = 'nodejs'
export const maxDuration = 30
