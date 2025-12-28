import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'
import { processMercadoPagoPaymentWebhook } from '@/lib/workflows/financeiro-flow'

// Supabase admin client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// MercadoPago webhook event types
type MPEventType =
  | 'payment'
  | 'plan'
  | 'subscription'
  | 'invoice'
  | 'point_integration_wh'

interface MPWebhookPayload {
  id: number
  live_mode: boolean
  type: MPEventType
  date_created: string
  user_id: number
  api_version: string
  action: string
  data: {
    id: string
  }
}

// Verify webhook signature
function verifySignature(
  body: string,
  xSignature: string,
  xRequestId: string,
  secret: string
): boolean {
  // Extract ts and v1 from x-signature header
  const parts = xSignature.split(',')
  let ts = ''
  let v1 = ''

  for (const part of parts) {
    const [key, value] = part.split('=')
    if (key.trim() === 'ts') {
      ts = value.trim()
    } else if (key.trim() === 'v1') {
      v1 = value.trim()
    }
  }

  if (!ts || !v1) {
    return false
  }

  // Create manifest string
  const manifest = `id:${JSON.parse(body).data.id};request-id:${xRequestId};ts:${ts};`

  // Calculate HMAC
  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(manifest)
  const calculatedSignature = hmac.digest('hex')

  return calculatedSignature === v1
}

export async function POST(request: NextRequest) {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN
  const webhookSecret = process.env.MERCADOPAGO_WEBHOOK_SECRET

  if (!accessToken || accessToken === 'your-mercadopago-access-token') {
    console.log('MercadoPago not configured, webhook disabled')
    return NextResponse.json(
      { error: 'MercadoPago not configured' },
      { status: 503 }
    )
  }

  const body = await request.text()
  const xSignature = request.headers.get('x-signature')
  const xRequestId = request.headers.get('x-request-id')

  // Verify signature if webhook secret is configured
  if (webhookSecret && xSignature && xRequestId) {
    const isValid = verifySignature(body, xSignature, xRequestId, webhookSecret)
    if (!isValid) {
      console.error('Webhook signature verification failed')
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }
  }

  let payload: MPWebhookPayload

  try {
    payload = JSON.parse(body)
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON payload' },
      { status: 400 }
    )
  }

  // Handle the event
  try {
    switch (payload.type) {
      case 'payment':
        await handlePaymentEvent(payload, accessToken)
        break

      case 'subscription':
        await handleSubscriptionEvent(payload, accessToken)
        break

      case 'invoice':
        await handleInvoiceEvent(payload, accessToken)
        break

      case 'plan':
        await handlePlanEvent(payload, accessToken)
        break

      default:
        console.log(`Unhandled event type: ${payload.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

// Fetch payment details from MercadoPago API
async function fetchPaymentDetails(paymentId: string, accessToken: string) {
  const response = await fetch(
    `https://api.mercadopago.com/v1/payments/${paymentId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch payment: ${response.statusText}`)
  }

  return response.json()
}

async function handlePaymentEvent(payload: MPWebhookPayload, accessToken: string) {
  console.log('Payment event:', payload.action, payload.data.id)

  const payment = await fetchPaymentDetails(payload.data.id, accessToken)

  switch (payload.action) {
    case 'payment.created':
      await handlePaymentCreated(payment)
      break

    case 'payment.updated':
      await handlePaymentUpdated(payment)
      break

    default:
      console.log(`Unhandled payment action: ${payload.action}`)
  }
}

async function handlePaymentCreated(payment: Record<string, unknown>) {
  console.log('Payment created:', payment.id)

  const metadata = payment.metadata as Record<string, string> | undefined
  const clientId = metadata?.clientId
  const invoiceId = metadata?.invoiceId
  const partnerId = metadata?.partnerId

  if (payment.status === 'approved') {
    // Payment was already approved (instant approval)
    await handleApprovedPayment(payment, clientId, invoiceId, partnerId)
  } else if (payment.status === 'pending') {
    // PIX payment waiting for customer
    console.log(`Payment pending for client ${clientId}`)

    // Send PIX QR code to client
    // await sendPixQRCode(clientId, payment.point_of_interaction?.transaction_data)
  }
}

async function handlePaymentUpdated(payment: Record<string, unknown>) {
  console.log('Payment updated:', payment.id, payment.status)

  const metadata = payment.metadata as Record<string, string> | undefined
  const clientId = metadata?.clientId
  const invoiceId = metadata?.invoiceId
  const partnerId = metadata?.partnerId

  const orderId = metadata?.orderId

  switch (payment.status) {
    case 'approved':
      await handleApprovedPayment(payment, clientId, invoiceId, partnerId)
      break

    case 'rejected':
    case 'cancelled':
      console.log(`Payment ${payment.status} for client ${clientId}`)
      if (orderId) {
        await supabaseAdmin
          .from('checkout_orders')
          .update({
            status: 'failed',
            mercadopago_payment_id: payment.id as string,
          })
          .eq('id', orderId)
      }
      break

    case 'refunded':
      console.log(`Payment refunded for client ${clientId}`)
      if (orderId) {
        await supabaseAdmin
          .from('checkout_orders')
          .update({
            status: 'refunded',
            mercadopago_payment_id: payment.id as string,
          })
          .eq('id', orderId)
      }
      break

    default:
      console.log(`Unhandled payment status: ${payment.status}`)
  }
}

async function handleApprovedPayment(
  payment: Record<string, unknown>,
  clientId?: string,
  invoiceId?: string,
  partnerId?: string
) {
  console.log(`Payment approved for client ${clientId}`)

  const metadata = payment.metadata as Record<string, string> | undefined
  const orderId = metadata?.orderId
  const leadId = metadata?.leadId
  const conversationId = metadata?.conversation_id

  // Processar fluxo financeiro completo
  try {
    await processMercadoPagoPaymentWebhook(payment)
  } catch (error) {
    console.error('Error processing financeiro flow:', error)
  }

  // Update checkout order status
  if (orderId) {
    const { error } = await supabaseAdmin
      .from('checkout_orders')
      .update({
        status: 'paid',
        paid_at: new Date().toISOString(),
        mercadopago_payment_id: payment.id as string,
        payment_id: payment.id as string,
        payment_provider: 'mercadopago',
      })
      .eq('id', orderId)

    if (error) {
      console.error('Error updating checkout order:', error)
      throw error
    }

    console.log(`Checkout order ${orderId} marked as paid`)
  }

  // Update lead status if linked
  if (leadId) {
    const { error } = await supabaseAdmin
      .from('leads')
      .update({
        status: 'converted',
        converted_at: new Date().toISOString(),
        payment_status: 'paid',
        payment_provider: 'mercadopago',
        payment_id: payment.id as string,
      })
      .eq('id', leadId)

    if (error) {
      console.error('Error updating lead:', error)
    } else {
      console.log(`Lead ${leadId} marked as converted`)
    }
  }

  // Update conversation state to 'paid' → 'contract_pending'
  if (conversationId) {
    const { error: convError } = await supabaseAdmin
      .from('conversations')
      .update({
        status: {
          state: 'paid',
          updated_at: new Date().toISOString(),
        },
        proposal: {
          payment_status: 'paid',
          payment_provider: 'mercadopago',
          payment_id: payment.id as string,
          paid_at: new Date().toISOString(),
          paid_amount: payment.transaction_amount,
        },
      })
      .eq('conversation_id', conversationId)

    if (convError) {
      console.error('[MercadoPago] Error updating conversation:', convError)
    } else {
      console.log(`[MercadoPago] Conversation ${conversationId} moved to paid state`)

      // Transition to contract_pending and trigger ClickSign after 1 second
      setTimeout(async () => {
        // First, get the full conversation data
        const { data: conversation, error: fetchError } = await supabaseAdmin
          .from('conversations')
          .select('*')
          .eq('conversation_id', conversationId)
          .single()

        if (fetchError || !conversation) {
          console.error('[MercadoPago] Error fetching conversation:', fetchError)
          return
        }

        const { error: transitionError } = await supabaseAdmin
          .from('conversations')
          .update({
            status: {
              state: 'contract_pending',
              updated_at: new Date().toISOString(),
            },
          })
          .eq('conversation_id', conversationId)

        if (transitionError) {
          console.error('[MercadoPago] Error transitioning to contract_pending:', transitionError)
        } else {
          console.log(`[MercadoPago] Conversation ${conversationId} moved to contract_pending`)

          // Trigger ClickSign contract generation
          try {
            const { generateContractForConversation } = await import('@/lib/integrations/clicksign')

            const result = await generateContractForConversation({
              conversationId,
              clientName: conversation.client?.name || 'Cliente',
              clientEmail: conversation.client?.email || conversation.email || '',
              clientPhone: conversation.client?.phone || conversation.phone_number,
              clientCPF: conversation.client?.cpf,
              productName: conversation.classification?.product || 'Serviço Jurídico',
              amount: (payment.transaction_amount as number) * 100, // Convert to cents
              paymentProvider: 'mercadopago',
            })

            // Update conversation with ClickSign document key
            await supabaseAdmin
              .from('conversations')
              .update({
                proposal: {
                  ...conversation.proposal,
                  clicksign_document_key: result.documentKey,
                  clicksign_sign_url: result.signUrl,
                },
              })
              .eq('conversation_id', conversationId)

            console.log(`[ClickSign] Contract generated for conversation ${conversationId}`)
          } catch (clicksignError) {
            console.error('[ClickSign] Error generating contract:', clicksignError)
            // Don't fail the webhook, just log the error
          }
        }
      }, 1000)
    }
  }

  // If referred by partner, create commission
  if (partnerId) {
    const amount = payment.transaction_amount as number
    const commissionRate = 0.1 // 10%
    const commissionAmount = amount * commissionRate

    console.log(`Creating commission of ${commissionAmount} for partner ${partnerId}`)
  }
}

async function handleSubscriptionEvent(payload: MPWebhookPayload, accessToken: string) {
  console.log('Subscription event:', payload.action, payload.data.id)

  // Fetch subscription details
  const response = await fetch(
    `https://api.mercadopago.com/preapproval/${payload.data.id}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch subscription: ${response.statusText}`)
  }

  const subscription = await response.json()

  switch (payload.action) {
    case 'created':
      console.log('Subscription created:', subscription.id)
      // await createSubscriptionRecord(subscription)
      break

    case 'updated':
      console.log('Subscription updated:', subscription.id, subscription.status)
      // await updateSubscriptionRecord(subscription)
      break

    default:
      console.log(`Unhandled subscription action: ${payload.action}`)
  }
}

async function handleInvoiceEvent(payload: MPWebhookPayload, accessToken: string) {
  console.log('Invoice event:', payload.action, payload.data.id)

  // Fetch invoice details
  const response = await fetch(
    `https://api.mercadopago.com/authorized_payments/${payload.data.id}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch invoice: ${response.statusText}`)
  }

  const invoice = await response.json()
  console.log('Invoice details:', invoice)

  // Handle invoice status changes
}

async function handlePlanEvent(payload: MPWebhookPayload, accessToken: string) {
  console.log('Plan event:', payload.action, payload.data.id)

  // Fetch plan details
  const response = await fetch(
    `https://api.mercadopago.com/preapproval_plan/${payload.data.id}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch plan: ${response.statusText}`)
  }

  const plan = await response.json()
  console.log('Plan details:', plan)

  // Handle plan changes
}
