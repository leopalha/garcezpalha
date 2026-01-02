/**
 * Inngest Function: Process MercadoPago Webhooks
 * Handles all MercadoPago payment notifications
 */

import { inngest } from '../inngest-client'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import { MercadoPagoConfig, Payment } from 'mercadopago'

// Lazy-loaded MercadoPago clients to avoid build-time initialization errors
let mpClient: MercadoPagoConfig | null = null
let paymentAPI: Payment | null = null

function getMercadoPagoPayment(): Payment {
  if (!mpClient) {
    if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
      throw new Error('MERCADOPAGO_ACCESS_TOKEN not configured')
    }
    mpClient = new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
    })
  }
  if (!paymentAPI) {
    paymentAPI = new Payment(mpClient)
  }
  return paymentAPI
}

export const mercadoPagoWebhookHandler = inngest.createFunction(
  {
    id: 'mercadopago-webhook-processor',
    name: 'Process MercadoPago Webhook',
    retries: 3,
  },
  { event: 'mercadopago/webhook.received' },
  async ({ event, step }) => {
    const { eventId, type, payload } = event.data

    logger.info('Processing MercadoPago webhook', { eventId, type })

    // Step 1: Validate and fetch payment details
    const paymentDetails = await step.run('fetch-payment', async () => {
      if (type === 'payment') {
        try {
          const paymentApi = getMercadoPagoPayment()
          const payment = await paymentApi.get({ id: payload.id })
          return payment
        } catch (error) {
          logger.error('Failed to fetch MercadoPago payment', { paymentId: payload.id, error })
          throw error
        }
      }
      return null
    })

    if (!paymentDetails) {
      logger.warn('Non-payment event or failed to fetch', { type })
      return { success: true, type: 'skipped' }
    }

    // Step 2: Process payment status
    const result = await step.run('process-payment', async () => {
      const supabase = await createClient()

      switch (paymentDetails.status) {
        case 'approved': {
          // Update payment record
          const { error: updateError } = await supabase
            .from('payments')
            .update({
              status: 'completed',
              mp_payment_id: paymentDetails.id?.toString(),
              mp_status: paymentDetails.status,
              updated_at: new Date().toISOString(),
            })
            .eq('mp_payment_id', paymentDetails.id?.toString())

          if (updateError) {
            logger.error('Failed to update payment', { paymentId: paymentDetails.id, error: updateError })
            throw updateError
          }

          // Get payment data
          const { data: payment } = await supabase
            .from('payments')
            .select('user_id, product_id, amount')
            .eq('mp_payment_id', paymentDetails.id?.toString())
            .single()

          if (payment) {
            // Create service
            await supabase
              .from('client_services')
              .insert({
                user_id: payment.user_id,
                product_id: payment.product_id,
                status: 'active',
                payment_amount: payment.amount,
                payment_method: 'mercadopago',
                start_date: new Date().toISOString(),
              })

            // Send confirmation email
            await inngest.send({
              name: 'email/send',
              data: {
                to: paymentDetails.payer?.email!,
                subject: 'Pagamento Aprovado - Garcez Palha Advogados',
                template: 'payment-confirmation',
                variables: {
                  amount: payment.amount,
                  productId: payment.product_id,
                  paymentMethod: 'MercadoPago',
                },
              },
            })

            // Send notification
            await inngest.send({
              name: 'notification/send',
              data: {
                userId: payment.user_id,
                type: 'payment',
                title: 'Pagamento Aprovado',
                message: 'Seu pagamento foi aprovado com sucesso!',
                link: '/dashboard/pagamentos',
                sendEmail: false,
              },
            })
          }

          return { success: true, status: 'approved' }
        }

        case 'pending': {
          await supabase
            .from('payments')
            .update({
              status: 'pending',
              mp_status: paymentDetails.status,
              updated_at: new Date().toISOString(),
            })
            .eq('mp_payment_id', paymentDetails.id?.toString())

          return { success: true, status: 'pending' }
        }

        case 'rejected': {
          await supabase
            .from('payments')
            .update({
              status: 'failed',
              mp_status: paymentDetails.status,
              error_message: paymentDetails.status_detail || 'Payment rejected',
              updated_at: new Date().toISOString(),
            })
            .eq('mp_payment_id', paymentDetails.id?.toString())

          // Schedule retry
          await inngest.send({
            name: 'payment/retry',
            data: {
              paymentId: paymentDetails.id?.toString()!,
              attempt: 1,
            },
          })

          return { success: true, status: 'rejected' }
        }

        default:
          logger.warn('Unhandled MercadoPago status', { status: paymentDetails.status })
          return { success: true, status: 'unhandled' }
      }
    })

    // Step 3: Log completion
    await step.run('log-completion', async () => {
      logger.info('MercadoPago webhook processed successfully', {
        eventId,
        paymentId: paymentDetails.id,
        result
      })
    })

    return result
  }
)
