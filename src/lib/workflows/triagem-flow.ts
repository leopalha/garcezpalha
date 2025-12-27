/**
 * Fluxo de Triagem
 * Lead → WhatsApp/Chatbot → Agent qualifica → Score → CRM → Notificação
 */

import { processQuery } from '@/lib/ai/agents'
import { createClient } from '@/lib/supabase/server'

export interface TriagemInput {
  leadName: string
  leadEmail?: string
  leadPhone?: string
  message: string
  source: 'whatsapp' | 'chatbot' | 'email' | 'telegram'
}

export interface TriagemOutput {
  leadId: string
  conversationId: string
  agentResponse: string
  agentUsed: string
  qualificationScore: number
  shouldNotifyAdmin: boolean
  serviceInterest: string
}

/**
 * Executa fluxo completo de triagem
 */
export async function executeTriagemFlow(input: TriagemInput): Promise<TriagemOutput> {
  const supabase = await createClient()

  // 1. Processar mensagem com AI Agent
  const agentResult = await processQuery(input.message, [])

  // 2. Calcular score de qualificação (0-100)
  const qualificationScore = calculateQualificationScore({
    message: input.message,
    confidence: agentResult.confidence,
    agentUsed: agentResult.agentUsed,
    hasEmail: !!input.leadEmail,
    hasPhone: !!input.leadPhone,
  })

  // 3. Detectar serviço de interesse
  const serviceInterest = detectServiceInterest(agentResult.agentUsed, input.message)

  // 4. Criar/Atualizar lead no CRM
  const { data: existingLead } = await supabase
    .from('leads')
    .select('id')
    .eq('email', input.leadEmail || '')
    .single()

  let leadId: string

  if (existingLead) {
    // Update existing lead
    leadId = existingLead.id
    await supabase
      .from('leads')
      .update({
        full_name: input.leadName,
        phone: input.leadPhone,
        service_interest: serviceInterest,
        source: input.source,
        message: input.message,
        qualification_score: qualificationScore,
        updated_at: new Date().toISOString(),
      })
      .eq('id', leadId)
  } else {
    // Create new lead
    const { data: newLead, error } = await supabase
      .from('leads')
      .insert({
        full_name: input.leadName,
        email: input.leadEmail || null,
        phone: input.leadPhone || null,
        company: null,
        service_interest: serviceInterest,
        source: input.source,
        status: qualificationScore >= 80 ? 'qualified' : qualificationScore >= 50 ? 'contacted' : 'new',
        message: input.message,
        qualification_score: qualificationScore,
        assigned_to: null,
      })
      .select('id')
      .single()

    if (error || !newLead) {
      console.error('Error creating lead:', error)
      throw new Error('Failed to create lead')
    }

    leadId = newLead.id
  }

  // 5. Criar conversa
  const { data: conversation, error: convError } = await supabase
    .from('conversations')
    .insert({
      lead_id: leadId,
      status: 'bot',
      agent_used: agentResult.agentUsed,
      qualification_score: qualificationScore,
      last_message_at: new Date().toISOString(),
    })
    .select('id')
    .single()

  if (convError || !conversation) {
    console.error('Error creating conversation:', convError)
    throw new Error('Failed to create conversation')
  }

  // 6. Salvar mensagens
  await supabase.from('messages').insert([
    {
      conversation_id: conversation.id,
      sender_type: 'client',
      content: input.message,
    },
    {
      conversation_id: conversation.id,
      sender_type: 'ai',
      content: agentResult.content,
    },
  ])

  // 7. Notificar admin se score alto
  const shouldNotifyAdmin = qualificationScore >= 80

  if (shouldNotifyAdmin) {
    await notifyAdmin({
      leadName: input.leadName,
      leadEmail: input.leadEmail,
      score: qualificationScore,
      serviceInterest,
      message: input.message,
    })
  }

  return {
    leadId,
    conversationId: conversation.id,
    agentResponse: agentResult.content,
    agentUsed: agentResult.agentUsed,
    qualificationScore,
    shouldNotifyAdmin,
    serviceInterest,
  }
}

/**
 * Calcula score de qualificação do lead (0-100)
 */
function calculateQualificationScore(params: {
  message: string
  confidence: number
  agentUsed: string
  hasEmail: boolean
  hasPhone: boolean
}): number {
  let score = 0

  // Base score from agent confidence (0-50 points)
  score += params.confidence * 50

  // Has contact info (0-20 points)
  if (params.hasEmail) score += 10
  if (params.hasPhone) score += 10

  // Message quality (0-20 points)
  const messageLength = params.message.length
  if (messageLength > 50) score += 10 // Detailed message
  if (messageLength > 100) score += 10 // Very detailed

  // Specific agent (0-10 points)
  if (params.agentUsed !== 'general') score += 10

  return Math.min(Math.round(score), 100)
}

/**
 * Detecta serviço de interesse baseado no agent usado
 */
function detectServiceInterest(agentUsed: string, message: string): string {
  const agentToService: Record<string, string> = {
    'real-estate': 'Direito Imobiliário',
    'document-forensics': 'Perícia Documental',
    'property-valuation': 'Avaliação de Imóveis',
    'criminal-law': 'Direito Criminal',
    'medical-expertise': 'Perícia Médica',
    'financial-protection': 'Proteção Financeira',
    'health-insurance': 'Plano de Saúde',
    'social-security': 'Previdenciário / INSS',
  }

  return agentToService[agentUsed] || 'Consulta Geral'
}

/**
 * Notifica admin sobre lead qualificado
 */
async function notifyAdmin(params: {
  leadName: string
  leadEmail?: string
  score: number
  serviceInterest: string
  message: string
}) {
  // TODO: Implementar notificação real via email ou webhook
  console.log('[Triagem] 🔔 LEAD QUALIFICADO!', {
    name: params.leadName,
    email: params.leadEmail,
    score: params.score,
    service: params.serviceInterest,
  })

  // Poderia enviar email via Resend ou criar notificação no dashboard
}
