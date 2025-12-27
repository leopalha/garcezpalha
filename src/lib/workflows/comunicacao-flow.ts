/**
 * Fluxo de Comunicação (Omnichannel)
 * WhatsApp → Agent → CRM → Human Handoff
 */

import { createClient } from '@/lib/supabase/server'
import { processQuery } from '@/lib/ai/agents/agent-orchestrator'

export interface ComunicacaoInput {
  channel: 'whatsapp' | 'email' | 'web_chat' | 'phone'
  fromNumber?: string // WhatsApp/Phone
  fromEmail?: string // Email
  fromName?: string
  message: string
  messageId?: string // ID externo da mensagem
  metadata?: Record<string, any>
}

export interface ComunicacaoOutput {
  conversationId: string
  messageId: string
  response: string
  agentUsed: string
  needsHumanHandoff: boolean
  leadCreated: boolean
  leadId?: string
}

/**
 * Executa fluxo completo de comunicação omnichannel
 */
export async function executeComunicacaoFlow(
  input: ComunicacaoInput
): Promise<ComunicacaoOutput> {
  const supabase = await createClient()

  // 1. Identificar ou criar lead
  const lead = await identificarOuCriarLead({
    channel: input.channel,
    fromNumber: input.fromNumber,
    fromEmail: input.fromEmail,
    fromName: input.fromName,
  })

  // 2. Buscar ou criar conversa
  const conversation = await buscarOuCriarConversa({
    leadId: lead.id,
    channel: input.channel,
  })

  // 3. Salvar mensagem recebida
  const { data: incomingMessage } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversation.id,
      sender_type: 'lead',
      content: input.message,
      channel: input.channel,
      external_message_id: input.messageId,
      metadata: input.metadata || {},
    })
    .select()
    .single()

  // 4. Processar com AI Agent
  const agentResult = await processQuery(input.message, [])

  // 5. Verificar se precisa de Human Handoff
  const needsHandoff = verificarNecessidadeHandoff({
    message: input.message,
    confidence: agentResult.confidence,
    agentUsed: agentResult.agentUsed,
    conversationHistory: await buscarHistoricoConversa(conversation.id),
  })

  // 6. Se precisa de handoff, notificar admin
  if (needsHandoff) {
    await notificarAdminHandoff({
      conversationId: conversation.id,
      leadName: lead.full_name || input.fromName || 'Lead',
      message: input.message,
      channel: input.channel,
    })

    // Atualizar status da conversa
    await supabase
      .from('conversations')
      .update({
        status: 'waiting_human',
        needs_attention: true,
      })
      .eq('id', conversation.id)
  }

  // 7. Salvar resposta do bot
  const { data: botMessage } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversation.id,
      sender_type: 'bot',
      content: needsHandoff
        ? 'Vou transferir você para um de nossos advogados. Em breve retornaremos o contato.'
        : agentResult.content,
      channel: input.channel,
      metadata: {
        agent_used: agentResult.agentUsed,
        confidence: agentResult.confidence,
      },
    })
    .select()
    .single()

  // 8. Atualizar last_message_at
  await supabase
    .from('conversations')
    .update({ last_message_at: new Date().toISOString() })
    .eq('id', conversation.id)

  // 9. Enviar resposta pelo canal original
  await enviarMensagemPeloCanal({
    channel: input.channel,
    to: input.fromNumber || input.fromEmail,
    message: needsHandoff
      ? 'Vou transferir você para um de nossos advogados. Em breve retornaremos o contato.'
      : agentResult.content,
  })

  return {
    conversationId: conversation.id,
    messageId: botMessage?.id || '',
    response: agentResult.content,
    agentUsed: agentResult.agentUsed,
    needsHumanHandoff: needsHandoff,
    leadCreated: !lead.existed,
    leadId: lead.id,
  }
}

/**
 * Identifica lead existente ou cria novo
 */
async function identificarOuCriarLead(params: {
  channel: string
  fromNumber?: string
  fromEmail?: string
  fromName?: string
}): Promise<any & { existed: boolean }> {
  const supabase = await createClient()

  // Tentar encontrar por telefone ou email
  let query = supabase.from('leads').select('*')

  if (params.fromNumber) {
    query = query.eq('phone', params.fromNumber)
  } else if (params.fromEmail) {
    query = query.eq('email', params.fromEmail)
  }

  const { data: existingLead } = await query.single()

  if (existingLead) {
    return { ...existingLead, existed: true }
  }

  // Criar novo lead
  const { data: newLead } = await supabase
    .from('leads')
    .insert({
      full_name: params.fromName || 'Lead',
      phone: params.fromNumber || null,
      email: params.fromEmail || null,
      source: params.channel,
      status: 'new',
    })
    .select()
    .single()

  return { ...newLead, existed: false }
}

/**
 * Busca conversa existente ou cria nova
 */
async function buscarOuCriarConversa(params: {
  leadId: string
  channel: string
}): Promise<any> {
  const supabase = await createClient()

  // Buscar conversa ativa
  const { data: existingConversation } = await supabase
    .from('conversations')
    .select('*')
    .eq('lead_id', params.leadId)
    .in('status', ['bot', 'waiting_human', 'human'])
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (existingConversation) {
    return existingConversation
  }

  // Criar nova conversa
  const { data: newConversation } = await supabase
    .from('conversations')
    .insert({
      lead_id: params.leadId,
      channel: params.channel,
      status: 'bot',
      started_at: new Date().toISOString(),
      last_message_at: new Date().toISOString(),
    })
    .select()
    .single()

  return newConversation
}

/**
 * Busca histórico de mensagens da conversa
 */
async function buscarHistoricoConversa(conversationId: string): Promise<any[]> {
  const supabase = await createClient()

  const { data: messages } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
    .limit(50)

  return messages || []
}

/**
 * Verifica se precisa de handoff humano
 */
function verificarNecessidadeHandoff(params: {
  message: string
  confidence: number
  agentUsed: string
  conversationHistory: any[]
}): boolean {
  // Regras de handoff:

  // 1. Baixa confiança do agent (< 0.6)
  if (params.confidence < 0.6) {
    console.log('[Comunicação] 🚨 Handoff: baixa confiança', params.confidence)
    return true
  }

  // 2. Solicitação explícita de falar com advogado
  const handoffKeywords = [
    'falar com advogado',
    'quero falar com alguém',
    'atendimento humano',
    'não entendi',
    'preciso de ajuda',
    'advogado de verdade',
  ]

  const messageLower = params.message.toLowerCase()
  if (handoffKeywords.some((keyword) => messageLower.includes(keyword))) {
    console.log('[Comunicação] 🚨 Handoff: solicitação explícita')
    return true
  }

  // 3. Conversa muito longa sem resolução (> 10 mensagens)
  if (params.conversationHistory.length > 10) {
    const recentMessages = params.conversationHistory.slice(-10)
    const botMessages = recentMessages.filter((m) => m.sender_type === 'bot')
    const avgConfidence =
      botMessages.reduce((sum, m) => sum + (m.metadata?.confidence || 0.5), 0) /
      botMessages.length

    if (avgConfidence < 0.7) {
      console.log('[Comunicação] 🚨 Handoff: conversa longa com baixa confiança')
      return true
    }
  }

  // 4. Assunto complexo ou urgente
  const complexKeywords = [
    'urgente',
    'prazo',
    'audiência',
    'sentença',
    'recurso',
    'processo judicial',
  ]

  if (complexKeywords.some((keyword) => messageLower.includes(keyword))) {
    console.log('[Comunicação] 🚨 Handoff: assunto complexo/urgente')
    return true
  }

  return false
}

/**
 * Notifica admin sobre necessidade de handoff
 */
async function notificarAdminHandoff(params: {
  conversationId: string
  leadName: string
  message: string
  channel: string
}): Promise<void> {
  console.log('[Comunicação] 🔔 Notificando admin sobre handoff:', {
    conversationId: params.conversationId,
    leadName: params.leadName,
  })

  // TODO: Integrar com sistema de notificações
  // Opções:
  // 1. Email via Resend
  // 2. WhatsApp para advogado
  // 3. Notificação push no admin dashboard
  // 4. Slack/Discord webhook

  const emailTemplate = `
    Nova Solicitação de Atendimento Humano

    Lead: ${params.leadName}
    Canal: ${params.channel}
    Mensagem: ${params.message}

    Acesse: https://garcezpalha.com.br/admin/conversas/${params.conversationId}
  `

  console.log('[Comunicação] Email template:', emailTemplate)
}

/**
 * Envia mensagem pelo canal original
 */
async function enviarMensagemPeloCanal(params: {
  channel: string
  to?: string
  message: string
}): Promise<void> {
  console.log('[Comunicação] 📤 Enviando resposta:', {
    channel: params.channel,
    to: params.to,
  })

  switch (params.channel) {
    case 'whatsapp':
      await enviarWhatsApp(params.to!, params.message)
      break

    case 'email':
      await enviarEmail(params.to!, params.message)
      break

    case 'web_chat':
      // Mensagem já foi salva no banco, será exibida via real-time
      console.log('[Comunicação] Web chat - mensagem salva no banco')
      break

    case 'phone':
      // Não precisa enviar resposta automática por telefone
      console.log('[Comunicação] Phone - sem resposta automática')
      break

    default:
      console.warn('[Comunicação] Canal desconhecido:', params.channel)
  }
}

/**
 * Envia mensagem via WhatsApp
 */
async function enviarWhatsApp(to: string, message: string): Promise<void> {
  // TODO: Integrar com WhatsApp Cloud API
  console.log('[Comunicação] 📱 WhatsApp enviado para:', to)
  console.log('[Comunicação] Mensagem:', message)

  // await whatsappApi.sendMessage({
  //   to,
  //   message,
  // })
}

/**
 * Envia mensagem via Email
 */
async function enviarEmail(to: string, message: string): Promise<void> {
  // TODO: Integrar com Resend
  console.log('[Comunicação] 📧 Email enviado para:', to)
  console.log('[Comunicação] Mensagem:', message)

  // await resend.emails.send({
  //   to,
  //   subject: 'Garcez & Palha - Resposta',
  //   html: message,
  // })
}

/**
 * Webhook: Recebe mensagem do WhatsApp Cloud API
 */
export async function processWhatsAppWebhook(webhookData: any): Promise<void> {
  console.log('[Comunicação] 📲 WhatsApp webhook recebido')

  // Extrair dados do webhook
  const entry = webhookData.entry?.[0]
  const change = entry?.changes?.[0]
  const message = change?.value?.messages?.[0]

  if (!message) {
    console.log('[Comunicação] Webhook sem mensagem')
    return
  }

  const from = message.from // Número do WhatsApp
  const text = message.text?.body || ''
  const messageId = message.id

  // Processar mensagem no fluxo de comunicação
  await executeComunicacaoFlow({
    channel: 'whatsapp',
    fromNumber: from,
    message: text,
    messageId,
    metadata: { webhook_data: webhookData },
  })
}

/**
 * Marca conversa como resolvida
 */
export async function marcarConversaResolvida(
  conversationId: string
): Promise<boolean> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('conversations')
    .update({
      status: 'resolved',
      resolved_at: new Date().toISOString(),
    })
    .eq('id', conversationId)

  if (error) {
    console.error('[Comunicação] Erro ao resolver conversa:', error)
    return false
  }

  console.log('[Comunicação] ✅ Conversa resolvida:', conversationId)
  return true
}

/**
 * Lista conversas aguardando atendimento humano
 */
export async function listarConversasAguardandoHumano(): Promise<any[]> {
  const supabase = await createClient()

  const { data: conversations } = await supabase
    .from('conversations')
    .select('*, lead:leads!conversations_lead_id_fkey (*)')
    .eq('status', 'waiting_human')
    .order('last_message_at', { ascending: false })

  return conversations || []
}
