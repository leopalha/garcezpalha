/**
 * ClickSign Webhook Endpoint
 *
 * Receives notifications when documents are signed, closed, or cancelled
 *
 * URL: https://garcezpalha.com/api/clicksign/webhook
 * Method: POST
 *
 * Events:
 * - document.signed - Document was signed by all parties
 * - document.closed - Document signing process completed
 * - document.cancelled - Document was cancelled
 *
 * Setup in ClickSign Dashboard:
 * 1. Go to Webhooks
 * 2. Add new webhook
 * 3. URL: https://garcezpalha.com/api/clicksign/webhook
 * 4. Events: document.signed, document.closed
 * 5. Add secret to .env: CLICKSIGN_WEBHOOK_SECRET
 */

import { NextRequest, NextResponse } from 'next/server'
import { clickSign } from '@/lib/signature/clicksign-service'
import { createClient } from '@/lib/supabase/server'

interface ClickSignWebhookPayload {
  event: string
  data: {
    document: {
      key: string
      status: 'running' | 'closed' | 'deleted'
      filename: string
    }
    signer?: {
      key: string
      email: string
      name: string
      signed_at: string
    }
  }
}

/**
 * POST - Receive webhook from ClickSign
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-clicksign-signature') || ''

    // Verify webhook signature (security)
    if (!clickSign.verifyWebhookSignature(signature, body)) {
      console.error('Invalid ClickSign webhook signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const payload: ClickSignWebhookPayload = JSON.parse(body)

    // Handle different events
    switch (payload.event) {
      case 'document.signed':
        await handleDocumentSigned(payload)
        break

      case 'document.closed':
        await handleDocumentClosed(payload)
        break

      case 'document.cancelled':
        await handleDocumentCancelled(payload)
        break

      default:
        console.log('Unknown ClickSign event:', payload.event)
    }

    return NextResponse.json({ status: 'ok' }, { status: 200 })
  } catch (error) {
    console.error('ClickSign webhook error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * Handle document signed event (all parties signed)
 */
async function handleDocumentSigned(payload: ClickSignWebhookPayload) {
  const supabase = await createClient()
  const documentKey = payload.data.document.key

  console.log('Document signed:', documentKey)

  // Find contract in database by ClickSign key
  const { data: contract } = await supabase
    .from('contracts')
    .select('*')
    .eq('clicksign_document_key', documentKey)
    .single()

  if (!contract) {
    console.error('Contract not found for document:', documentKey)
    return
  }

  // Download signed PDF
  const signedPDF = await clickSign.downloadSignedDocument(documentKey)

  if (signedPDF) {
    // Upload to Supabase Storage
    const filename = `${contract.id}_signed.pdf`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('contracts')
      .upload(filename, signedPDF, {
        contentType: 'application/pdf',
        upsert: true
      })

    if (uploadError) {
      console.error('Failed to upload signed contract:', uploadError)
      return
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('contracts')
      .getPublicUrl(filename)

    // Update contract status
    await supabase
      .from('contracts')
      .update({
        status: 'signed',
        signed_at: new Date().toISOString(),
        signed_document_url: urlData.publicUrl
      })
      .eq('id', contract.id)

    // Update lead status to 'converted'
    if (contract.lead_id) {
      await supabase
        .from('leads')
        .update({
          status: 'converted',
          converted_at: new Date().toISOString()
        })
        .eq('id', contract.lead_id)
    }

    // Trigger: Send payment link
    // TODO: Create payment link and send to client (Sprint 5.5)
    console.log('TODO: Send payment link to client')

    // Send confirmation email
    // TODO: Send email with signed contract attached (Sprint 5.5)
    console.log('TODO: Send confirmation email with contract')
  }
}

/**
 * Handle document closed event (signing process completed)
 */
async function handleDocumentClosed(payload: ClickSignWebhookPayload) {
  const supabase = await createClient()
  const documentKey = payload.data.document.key

  console.log('Document closed:', documentKey)

  // Update contract status
  await supabase
    .from('contracts')
    .update({
      status: 'closed',
      closed_at: new Date().toISOString()
    })
    .eq('clicksign_document_key', documentKey)
}

/**
 * Handle document cancelled event
 */
async function handleDocumentCancelled(payload: ClickSignWebhookPayload) {
  const supabase = await createClient()
  const documentKey = payload.data.document.key

  console.log('Document cancelled:', documentKey)

  // Update contract status
  await supabase
    .from('contracts')
    .update({
      status: 'cancelled',
      cancelled_at: new Date().toISOString()
    })
    .eq('clicksign_document_key', documentKey)

  // Update lead status back to 'qualified'
  const { data: contract } = await supabase
    .from('contracts')
    .select('lead_id')
    .eq('clicksign_document_key', documentKey)
    .single()

  if (contract?.lead_id) {
    await supabase
      .from('leads')
      .update({ status: 'qualified' })
      .eq('id', contract.lead_id)
  }
}

/**
 * IMPORTANT NOTES:
 *
 * 1. SECURITY:
 *    - Webhook signature verification required
 *    - HTTPS only (SSL certificate required)
 *
 * 2. AUTOMATION FLOW:
 *    - Document signed → Download PDF → Store in Supabase
 *    - Update contract status → Update lead to 'converted'
 *    - Trigger payment link creation (TODO Sprint 5.5)
 *    - Send confirmation email (TODO Sprint 5.5)
 *
 * 3. DATABASE TABLES:
 *    - contracts table must have:
 *      - clicksign_document_key (to match webhook)
 *      - signed_document_url (public URL after upload)
 *      - status (running, signed, closed, cancelled)
 *      - signed_at, closed_at, cancelled_at timestamps
 *
 * 4. SUPABASE STORAGE:
 *    - Bucket: 'contracts' (create in Supabase dashboard)
 *    - Public access for signed documents
 *    - RLS policy: Clients can only read their own contracts
 */
