/**
 * Fluxo Financeiro (Payment → Invoice)
 * Payment confirmed → Generate invoice → Email receipt → Update books
 */

import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/payments/stripe'
import Stripe from 'stripe'

/**
 * Database type definitions
 */
interface Invoice {
  id: string
  invoice_number: string
  issue_date: string
  amount: number
  tax_amount: number
  net_amount: number
  service_description: string
  pdf_url?: string
}

interface Client {
  id: string
  full_name: string
  email: string
  cpf?: string
  cnpj?: string
}

interface Payment {
  id: string
  amount: number
  payment_method: string
}

interface MercadoPagoPayment {
  id: number | string
  transaction_amount: number
  description?: string
  metadata?: Record<string, unknown>
}

export interface FinanceiroInput {
  paymentId: string // ID do pagamento (Stripe ou MercadoPago)
  paymentMethod: 'stripe' | 'mercadopago'
  amount: number
  clientId: string
  serviceType: string
  description: string
  metadata?: Record<string, unknown>
}

export interface FinanceiroOutput {
  invoiceId: string
  invoiceNumber: string
  invoiceUrl?: string
  receiptSent: boolean
  success: boolean
}

/**
 * Executa fluxo completo de processamento financeiro
 * Chamado por webhook após confirmação de pagamento
 */
export async function executeFinanceiroFlow(
  input: FinanceiroInput
): Promise<FinanceiroOutput> {
  const supabase = await createClient()

  // 1. Buscar dados do cliente
  const { data: client } = await supabase
    .from('clients')
    .select('*')
    .eq('id', input.clientId)
    .single()

  if (!client) {
    throw new Error('Client not found')
  }

  // 2. Registrar pagamento no banco
  const { data: payment } = await supabase
    .from('payments')
    .insert({
      client_id: input.clientId,
      amount: input.amount,
      payment_method: input.paymentMethod,
      external_payment_id: input.paymentId,
      status: 'paid',
      paid_at: new Date().toISOString(),
      description: input.description,
      metadata: input.metadata || {},
    })
    .select()
    .single()

  if (!payment) {
    throw new Error('Failed to create payment record')
  }

  // 3. Gerar número da NF (sequencial)
  const invoiceNumber = await gerarNumeroNF()

  // 4. Criar nota fiscal no banco
  const { data: invoice, error: invoiceError } = await supabase
    .from('invoices')
    .insert({
      client_id: input.clientId,
      payment_id: payment.id,
      invoice_number: invoiceNumber,
      issue_date: new Date().toISOString(),
      due_date: new Date().toISOString(), // Já pago
      amount: input.amount,
      status: 'paid',
      service_description: input.description,
      service_type: input.serviceType,
      tax_amount: calcularImpostos(input.amount),
      net_amount: input.amount - calcularImpostos(input.amount),
    })
    .select()
    .single()

  if (invoiceError || !invoice) {
    throw new Error('Failed to create invoice')
  }

  // 5. Gerar PDF da nota fiscal
  const invoiceUrl = await gerarPDFNotaFiscal({
    invoice,
    client,
    payment,
  })

  // Atualizar URL do PDF
  if (invoiceUrl) {
    await supabase
      .from('invoices')
      .update({ pdf_url: invoiceUrl })
      .eq('id', invoice.id)
  }

  // 6. Enviar comprovante por email
  await enviarComprovanteEmail({
    clientName: client.full_name,
    clientEmail: client.email,
    invoiceNumber,
    amount: input.amount,
    serviceDescription: input.description,
    invoiceUrl,
  })

  // 7. Atualizar livro caixa
  await atualizarLivroCaixa({
    invoiceId: invoice.id,
    clientId: input.clientId,
    amount: input.amount,
    description: input.description,
    date: new Date().toISOString(),
  })

  // 8. Notificar contador (se valor > R$ 10.000)
  if (input.amount > 10000) {
    await notificarContador({
      invoiceNumber,
      amount: input.amount,
      clientName: client.full_name,
    })
  }

  return {
    invoiceId: invoice.id,
    invoiceNumber,
    invoiceUrl,
    receiptSent: true,
    success: true,
  }
}

/**
 * Gera número sequencial de NF
 */
async function gerarNumeroNF(): Promise<string> {
  const supabase = await createClient()

  // Buscar último número de NF do ano corrente
  const currentYear = new Date().getFullYear()

  const { data: lastInvoice } = await supabase
    .from('invoices')
    .select('invoice_number')
    .like('invoice_number', `${currentYear}%`)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  let nextNumber = 1

  if (lastInvoice?.invoice_number) {
    // Extract number from format: 2025-0001
    const match = lastInvoice.invoice_number.match(/(\d{4})-(\d{4})/)
    if (match) {
      nextNumber = parseInt(match[2]) + 1
    }
  }

  // Format: 2025-0001, 2025-0002, etc
  return `${currentYear}-${String(nextNumber).padStart(4, '0')}`
}

/**
 * Calcula impostos (simplificado)
 * TODO: Integrar com sistema fiscal real
 */
function calcularImpostos(amount: number): number {
  // Simples Nacional: ~6% para serviços jurídicos
  const taxRate = 0.06
  return Math.round(amount * taxRate * 100) / 100
}

/**
 * Gera PDF da nota fiscal
 */
async function gerarPDFNotaFiscal(params: {
  invoice: Invoice
  client: Client
  payment: Payment
}): Promise<string | undefined> {
  // TODO: Integrar com biblioteca de PDF (PDFKit, Puppeteer, etc)
  // TODO: Upload PDF para Supabase Storage

  console.log('[Financeiro] 📄 Gerando PDF da NF:', params.invoice.invoice_number)

  // Mock: retorna URL fictícia
  const mockUrl = `https://storage.garcezpalha.com/invoices/${params.invoice.invoice_number}.pdf`

  // Conteúdo do PDF (simplificado):
  const pdfContent = `
    NOTA FISCAL DE SERVIÇOS
    Nº: ${params.invoice.invoice_number}

    PRESTADOR:
    Garcez & Palha Advogados Associados
    CNPJ: XX.XXX.XXX/0001-XX
    Endereço: Rio de Janeiro - RJ

    TOMADOR:
    ${params.client.full_name}
    CPF/CNPJ: ${params.client.cpf || params.client.cnpj || 'N/A'}
    Email: ${params.client.email}

    DISCRIMINAÇÃO DOS SERVIÇOS:
    ${params.invoice.service_description}

    VALOR DOS SERVIÇOS: R$ ${params.invoice.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
    IMPOSTOS: R$ ${params.invoice.tax_amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
    VALOR LÍQUIDO: R$ ${params.invoice.net_amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}

    Data de Emissão: ${formatDate(params.invoice.issue_date)}
    Status: PAGA
  `

  console.log('[Financeiro] PDF content preview:', pdfContent)

  return mockUrl
}

/**
 * Envia comprovante por email
 */
async function enviarComprovanteEmail(params: {
  clientName: string
  clientEmail: string
  invoiceNumber: string
  amount: number
  serviceDescription: string
  invoiceUrl?: string
}): Promise<void> {
  const { emailService } = await import('@/lib/email/email-service')

  console.log('[Financeiro] 📧 Enviando comprovante para:', params.clientEmail)

  const formattedAmount = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(params.amount)

  await emailService.sendPaymentConfirmation({
    to: params.clientEmail,
    name: params.clientName,
    amount: formattedAmount,
    service: params.serviceDescription,
    paymentMethod: 'Stripe/MercadoPago',
    transactionId: params.invoiceNumber,
  })

  console.log('[Financeiro] ✅ Comprovante enviado com sucesso')
}

/**
 * Atualiza livro caixa (fluxo de caixa)
 */
async function atualizarLivroCaixa(params: {
  invoiceId: string
  clientId: string
  amount: number
  description: string
  date: string
}): Promise<void> {
  const supabase = await createClient()

  await supabase.from('cash_flow').insert({
    invoice_id: params.invoiceId,
    client_id: params.clientId,
    type: 'income', // receita
    category: 'servicos_juridicos',
    amount: params.amount,
    description: params.description,
    transaction_date: params.date,
    payment_method: 'online',
    status: 'confirmed',
  })

  console.log('[Financeiro] 💰 Livro caixa atualizado:', {
    amount: params.amount,
    type: 'income',
  })
}

/**
 * Notifica contador sobre valor alto
 */
async function notificarContador(params: {
  invoiceNumber: string
  amount: number
  clientName: string
}): Promise<void> {
  console.log('[Financeiro] 📊 Notificando contador sobre NF de alto valor:', {
    invoice: params.invoiceNumber,
    amount: params.amount,
  })

  // TODO: Enviar email para contador
  // await resend.emails.send({
  //   to: 'contador@garcezpalha.com.br',
  //   subject: `⚠️ NF Alto Valor: ${params.invoiceNumber}`,
  //   html: `NF ${params.invoiceNumber} emitida para ${params.clientName} no valor de R$ ${params.amount.toLocaleString('pt-BR')}`
  // })
}

/**
 * Webhook Stripe: Processa payment_intent.succeeded
 */
export async function processStripePaymentWebhook(
  paymentIntent: Stripe.PaymentIntent
): Promise<void> {
  console.log('[Financeiro] 💳 Stripe payment received:', paymentIntent.id)

  const metadata = paymentIntent.metadata

  await executeFinanceiroFlow({
    paymentId: paymentIntent.id,
    paymentMethod: 'stripe',
    amount: paymentIntent.amount / 100, // Stripe usa centavos
    clientId: metadata.client_id,
    serviceType: metadata.service_type || 'Serviços Jurídicos',
    description: paymentIntent.description || 'Pagamento de serviços',
    metadata,
  })
}

/**
 * Webhook MercadoPago: Processa payment approved
 */
export async function processMercadoPagoPaymentWebhook(
  payment: MercadoPagoPayment
): Promise<void> {
  console.log('[Financeiro] 💰 MercadoPago payment received:', payment.id)

  const metadata = payment.metadata || {}

  await executeFinanceiroFlow({
    paymentId: String(payment.id),
    paymentMethod: 'mercadopago',
    amount: payment.transaction_amount,
    clientId: typeof metadata.client_id === 'string' ? metadata.client_id : '',
    serviceType: typeof metadata.service_type === 'string' ? metadata.service_type : 'Serviços Jurídicos',
    description: payment.description || 'Pagamento de serviços',
    metadata,
  })
}

/**
 * Gera relatório financeiro mensal
 */
export async function gerarRelatorioFinanceiroMensal(
  month: number,
  year: number
): Promise<{
  totalIncome: number
  totalExpenses: number
  netProfit: number
  invoicesIssued: number
  averageTicket: number
}> {
  const supabase = await createClient()

  const startDate = new Date(year, month - 1, 1).toISOString()
  const endDate = new Date(year, month, 0, 23, 59, 59).toISOString()

  // Receitas
  const { data: invoices } = await supabase
    .from('invoices')
    .select('amount')
    .eq('status', 'paid')
    .gte('issue_date', startDate)
    .lte('issue_date', endDate)

  const totalIncome = invoices?.reduce((sum, inv) => sum + inv.amount, 0) || 0
  const invoicesIssued = invoices?.length || 0
  const averageTicket = invoicesIssued > 0 ? totalIncome / invoicesIssued : 0

  // Despesas (mock)
  const totalExpenses = 0 // TODO: implementar gestão de despesas

  return {
    totalIncome,
    totalExpenses,
    netProfit: totalIncome - totalExpenses,
    invoicesIssued,
    averageTicket: Math.round(averageTicket * 100) / 100,
  }
}

/**
 * Função helper
 */
function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
