import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@/lib/supabase/route-handler'
import { sendEmail } from '@/lib/email/send'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { withRateLimit } from '@/lib/rate-limit'
import { withValidation } from '@/lib/validations/api-middleware'
import { z } from 'zod'
import { createLogger } from '@/lib/logger'

const logger = createLogger('api:admin:proposals:send-payment')

const mercadopago = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
})

const sendPaymentSchema = z.object({
  proposalId: z.string().uuid('proposalId deve ser um UUID válido'),
  leadId: z.string().uuid('leadId deve ser um UUID válido'),
})

async function handler(request: NextRequest) {
  try {
    const { proposalId, leadId } = (request as any).validatedData

    logger.info('Processing payment and proposal send request', { proposalId, leadId })

    const supabase = createRouteHandlerClient()

    // 1. Fetch proposal and lead data
    const { data: proposal, error: proposalError } = await supabase
      .from('proposals')
      .select('*')
      .eq('id', proposalId)
      .single()

    if (proposalError || !proposal) {
      logger.error('Error fetching proposal from database', proposalError, { proposalId })
      return NextResponse.json({ error: 'Proposta não encontrada' }, { status: 404 })
    }

    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single()

    if (leadError || !lead) {
      logger.error('Error fetching lead from database', leadError, { leadId })
      return NextResponse.json({ error: 'Lead não encontrado' }, { status: 404 })
    }

    logger.info('Found proposal and lead data', { proposalId, leadId, leadEmail: (lead as any).email })

    // Cast to any for missing schema fields
    const leadAny = lead as any
    const proposalAny = proposal as any

    // 2. Send email with proposal
    logger.info('Sending proposal email', { proposalId, leadId, email: leadAny.email })
    await sendEmail({
      to: leadAny.email || '',
      subject: `Proposta Comercial - ${leadAny.service_interest}`,
      html: generateProposalEmailHTML({
        clientName: leadAny.full_name,
        proposalText: proposalAny.proposal_text,
        pricing: {
          fixed: proposalAny.pricing_fixed,
          successFee: proposalAny.pricing_success_fee,
        },
      }),
    })
    logger.info('Proposal email sent', { proposalId, leadId })

    // 3. Create MercadoPago payment link (PIX)
    logger.info('Creating MercadoPago payment', { proposalId, leadId, amount: proposalAny.pricing_fixed })
    const payment = new Payment(mercadopago)

    const paymentData: any = {
      transaction_amount: proposalAny.pricing_fixed,
      description: `${leadAny.service_interest} - ${leadAny.full_name}`,
      payment_method_id: 'pix',
      payer: {
        email: leadAny.email,
        first_name: leadAny.full_name.split(' ')[0],
        last_name: leadAny.full_name.split(' ').slice(1).join(' ') || leadAny.full_name,
      },
      external_reference: proposalId,
      notification_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhooks/mercadopago`,
    }

    const paymentResponse = await payment.create({ body: paymentData })

    const pixQrCode = paymentResponse.point_of_interaction?.transaction_data?.qr_code
    const pixQrCodeBase64 = paymentResponse.point_of_interaction?.transaction_data?.qr_code_base64
    const paymentLink = paymentResponse.point_of_interaction?.transaction_data?.ticket_url

    if (!pixQrCode || !paymentLink) {
      logger.error('Failed to generate PIX payment from MercadoPago', new Error('Missing payment data'), { proposalId, leadId })
      return NextResponse.json(
        { error: 'Erro ao gerar pagamento PIX' },
        { status: 500 }
      )
    }

    logger.info('MercadoPago payment created successfully', { proposalId, leadId, mpPaymentId: paymentResponse.id })

    // 4. Save payment info to database
    logger.info('Saving payment to database', { proposalId, leadId })
    const { error: paymentDbError } = await supabase.from('payments').insert({
      proposal_id: proposalId,
      lead_id: leadId,
      amount: proposalAny.pricing_fixed,
      payment_method: 'pix',
      payment_provider: 'mercadopago',
      payment_provider_id: paymentResponse.id?.toString() || '',
      pix_qr_code: pixQrCode,
      pix_qr_code_base64: pixQrCodeBase64,
      payment_url: paymentLink,
      status: 'pending',
      created_at: new Date().toISOString(),
    })

    if (paymentDbError) {
      logger.error('Error saving payment to database', paymentDbError, { proposalId, leadId })
    } else {
      logger.info('Payment saved to database', { proposalId, leadId })
    }

    // 5. Send email with payment link
    logger.info('Sending payment link email', { proposalId, leadId, email: leadAny.email })
    await sendEmail({
      to: leadAny.email || '',
      subject: 'Link para Pagamento - Garcez Palha Advocacia',
      html: generatePaymentEmailHTML({
        clientName: leadAny.full_name,
        amount: proposalAny.pricing_fixed,
        pixQrCode,
        pixQrCodeBase64: pixQrCodeBase64 || '',
        paymentLink,
      }),
    })
    logger.info('Payment link email sent', { proposalId, leadId })

    // 6. Update proposal status
    logger.info('Updating proposal status to sent', { proposalId })
    await supabase
      .from('proposals')
      .update({
        status: 'sent',
        sent_at: new Date().toISOString(),
      })
      .eq('id', proposalId)

    // 7. Update conversation state to payment_pending
    const { data: conversation } = await supabase
      .from('conversations')
      .select('id')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (conversation) {
      logger.info('Updating conversation state to payment_pending', { conversationId: conversation.id, leadId })
      await supabase
        .from('conversations')
        .update({
          state: 'payment_pending',
          updated_at: new Date().toISOString(),
        })
        .eq('id', conversation.id)
    }

    logger.info('Payment and proposal send completed successfully', { proposalId, leadId, amount: proposalAny.pricing_fixed, status: 200 })

    return NextResponse.json({
      success: true,
      paymentLink,
      pixQrCode,
      message: 'Proposta e pagamento enviados com sucesso',
    })
  } catch (error) {
    logger.error('Payment and proposal send request failed', error)
    return NextResponse.json(
      { error: 'Erro ao enviar proposta e pagamento' },
      { status: 500 }
    )
  }
}

// Apply validation and rate limiting (admin endpoint, critical payment operation)
export const POST = withRateLimit(
  withValidation(sendPaymentSchema, handler, { sanitize: true }),
  { type: 'api', limit: 5 }
)

function generateProposalEmailHTML(data: {
  clientName: string
  proposalText: string
  pricing: { fixed: number; successFee: number | null }
}) {
  const successFeeText = data.pricing.successFee
    ? `<p><strong>Taxa de Êxito:</strong> ${data.pricing.successFee}% sobre valores recuperados</p>`
    : ''

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #1a1a1a; color: white; padding: 20px; text-align: center; }
    .content { padding: 30px 20px; background: #f9f9f9; }
    .proposal { background: white; padding: 20px; border-left: 4px solid #d4af37; margin: 20px 0; }
    .pricing { background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Garcez Palha Advocacia</h1>
    </div>
    <div class="content">
      <h2>Olá, ${data.clientName}!</h2>
      <p>É com grande satisfação que apresentamos nossa proposta comercial para atendê-lo(a).</p>

      <div class="proposal">
        ${data.proposalText.replace(/\n/g, '<br>')}
      </div>

      <div class="pricing">
        <h3>💰 Investimento</h3>
        <p><strong>Honorários Fixos:</strong> ${data.pricing.fixed.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })}</p>
        ${successFeeText}
      </div>

      <p>Em breve você receberá um segundo email com o link para pagamento via PIX.</p>

      <p>Qualquer dúvida, estamos à disposição!</p>

      <p>Atenciosamente,<br><strong>Equipe Garcez Palha</strong></p>
    </div>
    <div class="footer">
      <p>Garcez Palha Advocacia | OAB/SP XXXXX</p>
      <p>contato@garcezpalha.com.br | (11) 9999-9999</p>
    </div>
  </div>
</body>
</html>
  `
}

function generatePaymentEmailHTML(data: {
  clientName: string
  amount: number
  pixQrCode: string
  pixQrCodeBase64: string
  paymentLink: string
}) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #1a1a1a; color: white; padding: 20px; text-align: center; }
    .content { padding: 30px 20px; background: #f9f9f9; }
    .payment-box { background: white; padding: 20px; border: 2px solid #d4af37; text-align: center; margin: 20px 0; }
    .qr-code { margin: 20px 0; }
    .button { display: inline-block; background: #d4af37; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
    .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Pagamento via PIX</h1>
    </div>
    <div class="content">
      <h2>Olá, ${data.clientName}!</h2>
      <p>Segue o link para pagamento dos honorários advocatícios.</p>

      <div class="payment-box">
        <h3>💳 Valor a pagar</h3>
        <h2 style="color: #d4af37; font-size: 32px; margin: 10px 0;">
          ${data.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </h2>

        <div class="qr-code">
          <p><strong>Escaneie o QR Code:</strong></p>
          <img src="data:image/png;base64,${data.pixQrCodeBase64}" alt="QR Code PIX" style="max-width: 250px;" />
        </div>

        <p><strong>Ou copie o código PIX:</strong></p>
        <p style="background: #f0f0f0; padding: 10px; word-break: break-all; font-size: 12px; font-family: monospace;">
          ${data.pixQrCode}
        </p>

        <a href="${data.paymentLink}" class="button" target="_blank">
          Abrir Link de Pagamento
        </a>
      </div>

      <p><strong>⏰ Após o pagamento:</strong></p>
      <ul>
        <li>Você receberá confirmação automática por email</li>
        <li>Entraremos em contato para iniciar o processo</li>
        <li>O pagamento via PIX é processado instantaneamente</li>
      </ul>

      <p>Qualquer dúvida, estamos à disposição!</p>

      <p>Atenciosamente,<br><strong>Equipe Garcez Palha</strong></p>
    </div>
    <div class="footer">
      <p>Garcez Palha Advocacia | OAB/SP XXXXX</p>
      <p>contato@garcezpalha.com.br | (11) 9999-9999</p>
    </div>
  </div>
</body>
</html>
  `
}
