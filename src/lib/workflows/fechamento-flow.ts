/**
 * Fluxo de Fechamento
 * Proposta → Pagamento → ClickSign → Onboarding
 */

import { createClient } from '@/lib/supabase/server'

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
  // TODO: Gerar PDF real com biblioteca como puppeteer ou PDFKit
  return `
**PROPOSTA COMERCIAL**

Prezado(a) ${params.leadName},

Apresentamos proposta para prestação de serviços:

**Serviço**: ${params.serviceName}
**Descrição**: ${params.serviceDescription}

**Valor Total**: R$ ${params.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}

**Forma de Pagamento**: Conforme link de pagamento anexo

**Validade da Proposta**: 7 dias

Atenciosamente,
Garcez Palha Advogados
`.trim()
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
    // TODO: Integrar com MercadoPago API real
    return `https://mpago.la/${params.propostaId}` // Mock
  } else {
    // Stripe Credit Card
    // TODO: Integrar com Stripe Payment Links API
    return `https://buy.stripe.com/${params.propostaId}` // Mock
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
  // TODO: Enviar via Resend (email)
  console.log('[Fechamento] 📧 Enviando proposta para:', params.leadEmail)

  // TODO: Enviar via WhatsApp Cloud API
  if (params.leadPhone) {
    console.log('[Fechamento] 📱 Enviando proposta via WhatsApp:', params.leadPhone)
  }

  // Mock implementation
  console.log('[Fechamento] ✅ Proposta enviada com sucesso!')
  console.log('Payment Link:', params.paymentLink)
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

  // 3. Enviar contrato para assinatura via ClickSign
  // TODO: Integrar com ClickSign API
  console.log('[Fechamento] 📄 Enviando contrato para assinatura via ClickSign')

  // 4. Enviar email de onboarding
  // TODO: Enviar via Resend com credenciais de acesso
  console.log('[Fechamento] 👋 Enviando email de onboarding')

  // 5. Atualizar lead para status "cliente"
  await supabase
    .from('leads')
    .update({ status: 'converted' })
    .eq('id', proposta.lead_id)

  console.log('[Fechamento] ✅ Fluxo de fechamento completo!')
}
