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
import { createPreference, isMercadoPagoConfigured } from '@/lib/payments/mercadopago'
import { emailService } from '@/lib/email/email-service'
import { whatsappCloudAPI } from '@/lib/whatsapp/cloud-api'
import { withRateLimit } from '@/lib/rate-limit'
import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Database type definitions
 */
interface Contract {
  id: string
  amount: number
  contract_type?: string
  clicksign_document_key?: string
}

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
async function handler(request: NextRequest) {
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
    let lead = null
    if (contract.lead_id) {
      const { data: leadData } = await supabase
        .from('leads')
        .update({
          status: 'converted',
          converted_at: new Date().toISOString()
        })
        .eq('id', contract.lead_id)
        .select('id, name, email, phone')
        .single()

      lead = leadData
    }

    // Create payment link if contract has amount
    if (contract.amount && contract.amount > 0 && lead) {
      await createPaymentLinkForContract(supabase, contract, lead, urlData.publicUrl)
    }

    // Send confirmation email with signed contract
    if (lead?.email) {
      await sendContractConfirmationEmail(lead, contract, urlData.publicUrl)
    }

    console.log('[ClickSign] Contract signed and processed:', contract.id)
  }
}

/**
 * Create payment link and send to client
 */
async function createPaymentLinkForContract(
  supabase: SupabaseClient,
  contract: Contract,
  lead: { id: string; name: string; email: string; phone?: string },
  signedDocumentUrl: string
) {
  try {
    if (!isMercadoPagoConfigured()) {
      console.warn('[ClickSign] MercadoPago not configured, skipping payment link')
      return
    }

    const baseUrl = process.env.NEXTAUTH_URL || 'https://garcezpalha.com'

    // Create MercadoPago preference (payment link)
    const preference = await createPreference({
      clientId: lead.id,
      invoiceId: contract.id,
      amount: contract.amount / 100, // Convert cents to BRL
      description: `Contrato: ${contract.contract_type || 'Serviço Jurídico'} - Garcez Palha`,
      payerEmail: lead.email,
      successUrl: `${baseUrl}/pagamento/sucesso?contract=${contract.id}`,
      failureUrl: `${baseUrl}/pagamento/erro?contract=${contract.id}`,
      pendingUrl: `${baseUrl}/pagamento/pendente?contract=${contract.id}`,
    })

    // Store payment link in database
    await supabase.from('payment_links').insert({
      lead_id: lead.id,
      contract_id: contract.id,
      amount: contract.amount,
      description: contract.contract_type || 'Serviço Jurídico',
      payment_url: preference.initPoint,
      mercadopago_preference_id: preference.id,
      status: 'pending',
      created_at: new Date().toISOString(),
    })

    const formattedAmount = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(contract.amount / 100)

    // Send payment link via WhatsApp
    if (lead.phone && whatsappCloudAPI.isConfigured()) {
      const message = `✅ *Contrato Assinado com Sucesso!*

Olá ${lead.name},

Seu contrato foi assinado digitalmente. Para dar continuidade ao seu processo, realize o pagamento:

💰 *Valor:* ${formattedAmount}
🔗 *Link de Pagamento:* ${preference.initPoint}

Após a confirmação do pagamento, daremos início aos trabalhos.

📄 Seu contrato assinado: ${signedDocumentUrl}

---
Garcez Palha - Consultoria Jurídica & Pericial
📞 (21) 99535-4010`

      await whatsappCloudAPI.sendMessage(lead.phone, message, true)
    }

    // Send payment link via Email
    if (lead.email) {
      await emailService.sendCustomEmail({
        to: lead.email,
        subject: `✅ Contrato Assinado - Link de Pagamento`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #10b981; color: white; padding: 30px; text-align: center;">
              <h1 style="margin: 0;">✅ Contrato Assinado!</h1>
            </div>
            <div style="padding: 30px; background: #f9fafb;">
              <p>Olá <strong>${lead.name}</strong>,</p>
              <p>Seu contrato foi assinado digitalmente com sucesso!</p>

              <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #c9a227;">
                <h3 style="margin-top: 0;">Próximo Passo: Pagamento</h3>
                <p><strong>Valor:</strong> ${formattedAmount}</p>
                <p style="text-align: center; margin: 20px 0;">
                  <a href="${preference.initPoint}" style="background: #c9a227; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                    Realizar Pagamento
                  </a>
                </p>
              </div>

              <p style="text-align: center;">
                <a href="${signedDocumentUrl}" style="color: #1a365d;">📄 Baixar Contrato Assinado</a>
              </p>
            </div>
            <div style="background: #1a365d; color: white; padding: 15px; text-align: center; font-size: 12px;">
              <p style="margin: 0;">Garcez Palha - Consultoria Jurídica & Pericial</p>
              <p style="margin: 5px 0 0;">📞 (21) 99535-4010 | contato@garcezpalha.com</p>
            </div>
          </div>
        `,
        text: `Contrato Assinado!\n\nOlá ${lead.name},\n\nSeu contrato foi assinado.\n\nValor: ${formattedAmount}\nLink de Pagamento: ${preference.initPoint}\n\nContrato: ${signedDocumentUrl}\n\nGarcez Palha - (21) 99535-4010`,
        tags: ['contract-signed', 'payment-link'],
      })
    }

    console.log('[ClickSign] Payment link created and sent:', preference.id)
  } catch (error) {
    console.error('[ClickSign] Error creating payment link:', error)
  }
}

/**
 * Send confirmation email with signed contract
 */
async function sendContractConfirmationEmail(
  lead: { name: string; email: string },
  contract: Contract,
  signedDocumentUrl: string
) {
  try {
    const signedDate = new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })

    await emailService.sendContractSigned({
      to: lead.email,
      name: lead.name,
      contractType: contract.contract_type || 'Contrato de Prestação de Serviços',
      signedDate,
      pdfUrl: signedDocumentUrl,
      contractId: contract.id,
    })

    console.log('[ClickSign] Contract confirmation email sent to:', lead.email)
  } catch (error) {
    console.error('[ClickSign] Error sending confirmation email:', error)
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
 * 2. AUTOMATION FLOW (IMPLEMENTED):
 *    - Document signed → Download PDF → Store in Supabase
 *    - Update contract status → Update lead to 'converted'
 *    - ✅ Create MercadoPago payment link
 *    - ✅ Send payment link via WhatsApp and Email
 *    - ✅ Send confirmation email with signed contract
 *
 * 3. DATABASE TABLES:
 *    - contracts table must have:
 *      - clicksign_document_key (to match webhook)
 *      - signed_document_url (public URL after upload)
 *      - status (running, signed, closed, cancelled)
 *      - signed_at, closed_at, cancelled_at timestamps
 *      - amount (in cents) for payment link creation
 *      - contract_type (for description)
 *    - payment_links table:
 *      - lead_id, contract_id, amount, payment_url
 *      - mercadopago_preference_id, status
 *
 * 4. SUPABASE STORAGE:
 *    - Bucket: 'contracts' (create in Supabase dashboard)
 *    - Public access for signed documents
 *    - RLS policy: Clients can only read their own contracts
 *
 * 5. REQUIRED ENV VARS:
 *    - CLICKSIGN_WEBHOOK_SECRET
 *    - MERCADOPAGO_ACCESS_TOKEN
 *    - RESEND_API_KEY
 *    - WHATSAPP_ACCESS_TOKEN (optional)
 */

// Apply rate limiting for webhook
export const POST = withRateLimit(handler, { type: 'webhook', limit: 100 })
