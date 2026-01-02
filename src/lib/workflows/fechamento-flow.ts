/**
 * Fluxo de Fechamento
 * Proposta → Pagamento → ClickSign → Onboarding
 */

import { createClient } from '@/lib/supabase/server'
import { generatePDF } from '@/lib/pdf/pdf-generator'
import * as MercadoPago from '@/lib/integrations/mercadopago'
import * as StripeIntegration from '@/lib/integrations/stripe'
import { sendEmail, sendWhatsApp } from '@/lib/notifications/notification-service'

export interface FechamentoInput {
  leadId: string
  serviceName: string
  serviceDescription: string
  valorTotal: number
  paymentMethod: 'pix' | 'credit_card' | 'boleto'
  contractTemplate: 'pericia-documental' | 'avaliacao-imoveis' | 'pericia-medica' | 'imobiliario'
}

export interface FechamentoOutput {
  propostaId: string
  paymentLink: string
  contractId?: string
  success: boolean
}

/**
 * Executa fluxo completo de fechamento
 */
export async function executeFechamentoFlow(input: FechamentoInput): Promise<FechamentoOutput> {
  const supabase = await createClient()

  // 1. Buscar dados do lead
  const { data: lead, error: leadError } = await supabase
    .from('leads')
    .select('*')
    .eq('id', input.leadId)
    .single()

  if (leadError || !lead) {
    throw new Error('Lead not found')
  }

  // 2. Gerar proposta
  const proposta = await gerarProposta({
    leadName: lead.full_name,
    leadEmail: lead.email,
    serviceName: input.serviceName,
    serviceDescription: input.serviceDescription,
    valorTotal: input.valorTotal,
  })

  // 3. Salvar proposta no banco
  const { data: savedProposta, error: propostaError } = await supabase
    .from('proposals')
    .insert({
      lead_id: input.leadId,
      service_name: input.serviceName,
      service_description: input.serviceDescription,
      valor_total: input.valorTotal,
      payment_method: input.paymentMethod,
      status: 'pending',
      proposal_content: proposta,
    })
    .select('id')
    .single()

  if (propostaError || !savedProposta) {
    throw new Error('Failed to save proposal')
  }

  // 4. Criar link de pagamento
  const paymentLink = await criarLinkPagamento({
    propostaId: savedProposta.id,
    leadEmail: lead.email,
    valorTotal: input.valorTotal,
    paymentMethod: input.paymentMethod,
    description: input.serviceName,
  })

  // 5. Enviar proposta + payment link via WhatsApp/Email
  await enviarProposta({
    leadName: lead.full_name,
    leadEmail: lead.email,
    leadPhone: lead.phone,
    serviceName: input.serviceName,
    valorTotal: input.valorTotal,
    paymentLink,
    propostaContent: proposta,
  })

  // 6. Contract será enviado via webhook após confirmação de pagamento
  // Ver: /api/webhooks/stripe ou /api/webhooks/mercadopago

  return {
    propostaId: savedProposta.id,
    paymentLink,
    success: true,
  }
}

/**
 * Gera conteúdo da proposta em PDF/HTML
 */
async function gerarProposta(params: {
  leadName: string
  leadEmail: string
  serviceName: string
  serviceDescription: string
  valorTotal: number
}): Promise<string> {
  // Generate PDF using pdf-generator
  const pdfBuffer = await generatePDF({
    type: 'proposal',
    data: {
      clientName: params.leadName,
      email: params.leadEmail,
      productName: params.serviceName,
      description: params.serviceDescription,
      price: params.valorTotal,
      estimatedValue: params.valorTotal,
      paymentTerms: 'Pagamento via PIX, cartão de crédito ou boleto',
      validityDays: 30,
    },
    branding: {
      companyName: 'Garcez Palha Advocacia',
      primaryColor: '#2563eb',
    },
  })

  // Convert buffer to base64 for storage/sending
  const pdfBase64 = pdfBuffer.toString('base64')

  // Return base64 string for storage
  return pdfBase64
}

/**
 * Cria link de pagamento (Stripe ou MercadoPago)
 */
async function criarLinkPagamento(params: {
  propostaId: string
  leadEmail: string
  valorTotal: number
  paymentMethod: string
  description: string
}): Promise<string> {
  if (params.paymentMethod === 'pix') {
    // MercadoPago PIX
    const pixPayment = await MercadoPago.createPixPayment({
      amount: params.valorTotal,
      email: params.leadEmail,
      description: params.description,
      externalReference: params.propostaId,
    })

    // Return PIX ticket URL (customer can scan QR code)
    return pixPayment.ticketUrl || `https://mpago.la/${pixPayment.paymentId}`
  } else if (params.paymentMethod === 'credit_card') {
    // Stripe Payment Link for Credit Card
    const paymentLink = await StripeIntegration.createPaymentLink({
      amount: params.valorTotal,
      productName: params.description,
      description: 'Serviço Jurídico - Garcez Palha',
      customerEmail: params.leadEmail,
      metadata: {
        proposalId: params.propostaId,
        type: 'service_payment',
      },
    })

    return paymentLink.url || ''
  } else {
    // Boleto via MercadoPago
    const paymentLink = await MercadoPago.createPaymentLink({
      amount: params.valorTotal,
      title: params.description,
      description: 'Pagamento de serviço jurídico',
      email: params.leadEmail,
      externalReference: params.propostaId,
    })

    return paymentLink.initPoint || ''
  }
}

/**
 * Envia proposta via WhatsApp e Email
 */
async function enviarProposta(params: {
  leadName: string
  leadEmail: string
  leadPhone: string | null
  serviceName: string
  valorTotal: number
  paymentLink: string
  propostaContent: string
}): Promise<void> {
  const valorFormatado = (params.valorTotal / 100).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  // Enviar via Email (Resend)
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Proposta Comercial - Garcez Palha</h2>
      <p>Olá <strong>${params.leadName}</strong>,</p>
      <p>Segue sua proposta para o serviço:</p>
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">${params.serviceName}</h3>
        <p style="font-size: 24px; color: #10b981; margin: 10px 0;">
          <strong>R$ ${valorFormatado}</strong>
        </p>
      </div>
      <p>Para realizar o pagamento, clique no botão abaixo:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${params.paymentLink}"
           style="background-color: #2563eb; color: white; padding: 14px 28px;
                  text-decoration: none; border-radius: 6px; display: inline-block;
                  font-weight: bold;">
          Realizar Pagamento
        </a>
      </div>
      <p style="color: #6b7280; font-size: 14px;">
        Esta proposta é válida por 30 dias a partir da data de envio.
      </p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
      <p style="color: #9ca3af; font-size: 12px;">
        Atenciosamente,<br/>
        <strong>Equipe Garcez Palha Advocacia</strong>
      </p>
    </div>
  `

  const emailSent = await sendEmail({
    to: params.leadEmail,
    subject: `Proposta - ${params.serviceName}`,
    html: emailHtml,
  })

  if (emailSent) {
    console.log('[Fechamento] ✅ Email enviado para:', params.leadEmail)
  } else {
    console.error('[Fechamento] ❌ Falha ao enviar email para:', params.leadEmail)
  }

  // Enviar via WhatsApp Cloud API (se telefone disponível)
  if (params.leadPhone) {
    const whatsappMessage = `Olá ${params.leadName}! 👋

Sua proposta para *${params.serviceName}* está pronta!

💰 *Valor:* R$ ${valorFormatado}

Para realizar o pagamento, acesse:
${params.paymentLink}

A proposta é válida por 30 dias.

Qualquer dúvida, estamos à disposição!

_Equipe Garcez Palha Advocacia_`

    const whatsappSent = await sendWhatsApp({
      to: params.leadPhone,
      message: whatsappMessage,
    })

    if (whatsappSent) {
      console.log('[Fechamento] ✅ WhatsApp enviado para:', params.leadPhone)
    } else {
      console.error('[Fechamento] ❌ Falha ao enviar WhatsApp para:', params.leadPhone)
    }
  }

  console.log('[Fechamento] ✅ Proposta enviada com sucesso!')
  console.log('[Fechamento] Payment Link:', params.paymentLink)
}

/**
 * Função chamada pelo webhook após pagamento confirmado
 * Ver: /api/webhooks/stripe ou /api/webhooks/mercadopago
 */
export async function onPaymentConfirmed(propostaId: string): Promise<void> {
  const supabase = await createClient()

  // 1. Atualizar status da proposta
  await supabase
    .from('proposals')
    .update({ status: 'paid', paid_at: new Date().toISOString() })
    .eq('id', propostaId)

  // 2. Buscar dados da proposta
  const { data: proposta } = await supabase
    .from('proposals')
    .select('*, lead:leads(*)')
    .eq('id', propostaId)
    .single()

  if (!proposta) return

  // 3. Enviar email de confirmação de pagamento
  const valorFormatado = (proposta.valor_total / 100).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #10b981; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h2 style="margin: 0;">✅ Pagamento Confirmado!</h2>
      </div>
      <div style="padding: 30px; background-color: #f9fafb;">
        <p>Olá <strong>${proposta.lead?.full_name || 'Cliente'}</strong>,</p>
        <p>Seu pagamento foi confirmado com sucesso! 🎉</p>
        <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
          <p style="margin: 5px 0;"><strong>Serviço:</strong> ${proposta.service_name}</p>
          <p style="margin: 5px 0;"><strong>Valor:</strong> R$ ${valorFormatado}</p>
          <p style="margin: 5px 0; color: #10b981;"><strong>Status:</strong> Pago ✅</p>
        </div>
        <h3>Próximos Passos:</h3>
        <ol style="line-height: 1.8;">
          <li>Em breve você receberá o contrato para assinatura digital</li>
          <li>Após a assinatura, entraremos em contato para agendar o início do serviço</li>
          <li>Nossa equipe já está preparando tudo para atendê-lo</li>
        </ol>
        <p style="margin-top: 30px;">Seja bem-vindo à <strong>Garcez Palha Advocacia</strong>!</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="color: #9ca3af; font-size: 12px;">
          Atenciosamente,<br/>
          <strong>Equipe Garcez Palha Advocacia</strong>
        </p>
      </div>
    </div>
  `

  await sendEmail({
    to: proposta.lead?.email || '',
    subject: '✅ Pagamento Confirmado - Garcez Palha',
    html: emailHtml,
  })

  // 4. Enviar WhatsApp de confirmação (se telefone disponível)
  if (proposta.lead?.phone) {
    const whatsappMessage = `✅ *PAGAMENTO CONFIRMADO!*

Olá ${proposta.lead?.full_name || 'Cliente'}! 🎉

Seu pagamento foi confirmado com sucesso!

📋 *Serviço:* ${proposta.service_name}
💰 *Valor:* R$ ${valorFormatado}
✅ *Status:* Pago

*Próximos Passos:*
1️⃣ Você receberá o contrato para assinatura digital
2️⃣ Após assinatura, agendaremos o início do serviço
3️⃣ Nossa equipe já está preparando tudo!

Seja bem-vindo à *Garcez Palha Advocacia*! 🏛️

_Qualquer dúvida, estamos à disposição!_`

    await sendWhatsApp({
      to: proposta.lead.phone,
      message: whatsappMessage,
    })
  }

  console.log('[Fechamento] ✅ Notificações de pagamento confirmado enviadas')

  // 5. Enviar contrato para assinatura via ClickSign
  // Já implementado no webhook do MercadoPago (generateContractForConversation)
  console.log('[Fechamento] 📄 Contrato será enviado via ClickSign (webhook MercadoPago)')

  // 6. Atualizar lead para status "cliente"
  await supabase
    .from('leads')
    .update({ status: 'converted' })
    .eq('id', proposta.lead_id)

  console.log('[Fechamento] ✅ Fluxo de fechamento completo!')
}
