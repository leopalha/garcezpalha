/**
 * Fluxo de Triagem
 * Lead → WhatsApp/Chatbot → Agent qualifica → Score → CRM → Notificação
 */

import { processQuery } from '@/lib/ai/agents'
import { createClient } from '@/lib/supabase/server'
import { sendEmail, sendWhatsApp } from '@/lib/notifications/notification-service'

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
  const supabase = await createClient()

  console.log('[Triagem] 🔔 LEAD QUALIFICADO!', {
    name: params.leadName,
    email: params.leadEmail,
    score: params.score,
    service: params.serviceInterest,
  })

  // Buscar admin/advogados para notificar
  const { data: admins } = await supabase
    .from('profiles')
    .select('email, phone, full_name')
    .in('role', ['admin', 'lawyer'])
    .limit(5)

  if (!admins || admins.length === 0) {
    console.warn('[Triagem] No admins found to notify')
    return
  }

  // Qualificação visual baseada no score
  const scoreColor = params.score >= 90 ? '#10b981' : params.score >= 80 ? '#f59e0b' : '#3b82f6'
  const scoreLabel = params.score >= 90 ? 'EXCELENTE' : params.score >= 80 ? 'BOA' : 'MÉDIA'

  // Enviar email para cada admin
  for (const admin of admins) {
    if (!admin.email) continue

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: ${scoreColor}; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h2 style="margin: 0;">🎯 Novo Lead Qualificado!</h2>
        </div>
        <div style="padding: 30px; background-color: #f9fafb;">
          <p>Olá <strong>${admin.full_name || 'Admin'}</strong>,</p>
          <p>Um novo lead de <strong>alta qualidade</strong> foi identificado pelo sistema:</p>

          <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${scoreColor};">
            <p style="margin: 5px 0;"><strong>👤 Nome:</strong> ${params.leadName}</p>
            <p style="margin: 5px 0;"><strong>📧 Email:</strong> ${params.leadEmail || 'Não informado'}</p>
            <p style="margin: 5px 0;"><strong>🎯 Interesse:</strong> ${params.serviceInterest}</p>
            <p style="margin: 15px 0 5px 0;">
              <strong>📊 Score de Qualificação:</strong>
              <span style="font-size: 24px; color: ${scoreColor}; font-weight: bold;">
                ${params.score}/100
              </span>
              <span style="color: ${scoreColor}; font-weight: bold; margin-left: 10px;">
                (${scoreLabel})
              </span>
            </p>
          </div>

          <div style="background-color: white; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <h4 style="margin: 0 0 10px 0; color: #374151;">💬 Mensagem Inicial:</h4>
            <p style="margin: 0; color: #6b7280; font-style: italic; border-left: 3px solid #e5e7eb; padding-left: 12px;">
              "${params.message}"
            </p>
          </div>

          <div style="background-color: #ecfdf5; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0; color: #065f46; font-weight: bold;">
              ⚡ Ação Recomendada: Entre em contato IMEDIATAMENTE para aumentar chances de conversão!
            </p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/leads"
               style="background-color: ${scoreColor}; color: white; padding: 14px 28px;
                      text-decoration: none; border-radius: 6px; display: inline-block;
                      font-weight: bold;">
              Ver Detalhes do Lead
            </a>
          </div>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          <p style="color: #9ca3af; font-size: 12px;">
            <strong>Garcez Palha Advocacia</strong><br/>
            Sistema de Triagem Automática - Notificação de Lead Qualificado
          </p>
        </div>
      </div>
    `

    const emailSent = await sendEmail({
      to: admin.email,
      subject: `🎯 Lead Qualificado (${params.score}/100): ${params.leadName} - ${params.serviceInterest}`,
      html: emailHtml,
    })

    if (emailSent) {
      console.log('[Triagem] ✅ Email enviado para admin:', admin.email)
    } else {
      console.error('[Triagem] ❌ Falha ao enviar email para:', admin.email)
    }

    // Enviar WhatsApp (se telefone disponível)
    if (admin.phone) {
      const whatsappMessage = `🎯 *NOVO LEAD QUALIFICADO!*

Olá ${admin.full_name || 'Admin'}! 👋

Um lead de *alta qualidade* foi identificado:

👤 *Nome:* ${params.leadName}
📧 *Email:* ${params.leadEmail || 'Não informado'}
🎯 *Interesse:* ${params.serviceInterest}
📊 *Score:* *${params.score}/100* (${scoreLabel})

💬 *Mensagem inicial:*
"${params.message.substring(0, 150)}${params.message.length > 150 ? '...' : ''}"

⚡ *Ação Recomendada:*
Entre em contato IMEDIATAMENTE para aumentar chances de conversão!

🔗 ${process.env.NEXT_PUBLIC_APP_URL}/admin/leads

_Garcez Palha - Sistema de Triagem Automática_`

      const whatsappSent = await sendWhatsApp({
        to: admin.phone,
        message: whatsappMessage,
      })

      if (whatsappSent) {
        console.log('[Triagem] ✅ WhatsApp enviado para admin:', admin.phone)
      } else {
        console.error('[Triagem] ❌ Falha ao enviar WhatsApp para:', admin.phone)
      }
    }
  }

  console.log('[Triagem] ✅ Notificações de lead qualificado enviadas')
}
