import { openai, ASSISTANT_ID } from './openai-client'
import { createClient } from '../supabase/server'

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface LeadQualification {
  full_name?: string
  email?: string
  phone?: string
  service_interest?: string
  urgency?: 'low' | 'medium' | 'high'
  budget_range?: string
  qualified: boolean
}

/**
 * Sistema de qualificação de leads via IA
 * O assistente OpenAI conversa com o usuário e extrai informações importantes
 */
export class AILegalChatbot {
  private conversationId: string
  private threadId?: string

  constructor(conversationId: string, threadId?: string) {
    this.conversationId = conversationId
    this.threadId = threadId
  }

  /**
   * Cria ou recupera uma thread do OpenAI
   */
  async getOrCreateThread(): Promise<string> {
    if (this.threadId) {
      return this.threadId
    }

    const thread = await openai.beta.threads.create()
    this.threadId = thread.id

    // Salvar thread ID na conversa
    const supabase = await createClient()
    await supabase
      .from('conversations')
      .update({
        metadata: { openai_thread_id: thread.id },
      })
      .eq('id', this.conversationId)

    return thread.id
  }

  /**
   * Envia mensagem do usuário e obtém resposta do assistente
   */
  async sendMessage(userMessage: string): Promise<string> {
    const threadId = await this.getOrCreateThread()

    // Adiciona mensagem do usuário à thread
    await openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: userMessage,
    })

    // Salva mensagem do usuário no banco
    await this.saveMessage('user', userMessage)

    // Executa o assistente
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: ASSISTANT_ID,
    })

    // Aguarda conclusão
    // OpenAI SDK v6+ uses (threadId, runId) signature
    const retrieveFn = openai.beta.threads.runs.retrieve as unknown as (threadId: string, runId: string) => Promise<typeof run>
    let runStatus = await retrieveFn(threadId, run.id)

    while (runStatus.status !== 'completed') {
      if (runStatus.status === 'failed' || runStatus.status === 'cancelled' || runStatus.status === 'expired') {
        throw new Error(`Run failed with status: ${runStatus.status}`)
      }

      // Aguarda 1 segundo antes de verificar novamente
      await new Promise((resolve) => setTimeout(resolve, 1000))
      runStatus = await retrieveFn(threadId, run.id)

      // Se precisar de function calling (para salvar lead qualificado)
      if (runStatus.status === 'requires_action' && runStatus.required_action?.type === 'submit_tool_outputs') {
        const toolCalls = runStatus.required_action.submit_tool_outputs.tool_calls
        const toolOutputs = await this.handleToolCalls(toolCalls)

        // Cast to bypass TypeScript strict checking for OpenAI SDK version mismatch
        const submitFn = openai.beta.threads.runs.submitToolOutputs as unknown as (
          threadId: string,
          runId: string,
          params: { tool_outputs: typeof toolOutputs }
        ) => Promise<unknown>
        await submitFn(threadId, run.id, { tool_outputs: toolOutputs })
      }
    }

    // Obtém última mensagem do assistente
    const messages = await openai.beta.threads.messages.list(threadId, {
      limit: 1,
      order: 'desc',
    })

    const lastMessage = messages.data[0]
    if (lastMessage.role !== 'assistant') {
      throw new Error('Expected assistant message')
    }

    const content = lastMessage.content[0]
    if (content.type !== 'text') {
      throw new Error('Expected text content')
    }

    const assistantResponse = content.text.value

    // Salva resposta do assistente no banco
    await this.saveMessage('assistant', assistantResponse)

    return assistantResponse
  }

  /**
   * Processa chamadas de função (function calling)
   */
  private async handleToolCalls(toolCalls: any[]): Promise<any[]> {
    const outputs = []

    for (const toolCall of toolCalls) {
      if (toolCall.function.name === 'save_qualified_lead') {
        const args = JSON.parse(toolCall.function.arguments)
        const leadData: LeadQualification = args

        // Salvar lead qualificado no banco
        const supabase = await createClient()

        const { data: conversation } = await supabase
          .from('conversations')
          .select('lead_id')
          .eq('id', this.conversationId)
          .single()

        if (conversation?.lead_id) {
          // Atualizar lead existente
          await supabase
            .from('leads')
            .update({
              status: leadData.qualified ? 'qualified' : 'contacted',
              metadata: {
                urgency: leadData.urgency,
                budget_range: leadData.budget_range,
                ai_qualified: leadData.qualified,
              },
            })
            .eq('id', conversation.lead_id)
        } else {
          // Criar novo lead
          const { data: newLead } = await supabase
            .from('leads')
            .insert({
              full_name: leadData.full_name || 'Lead via Chatbot',
              email: leadData.email || '',
              phone: leadData.phone || '',
              service_interest: leadData.service_interest || 'Não especificado',
              source: 'chatbot',
              status: leadData.qualified ? 'qualified' : 'new',
              metadata: {
                urgency: leadData.urgency,
                budget_range: leadData.budget_range,
                ai_qualified: leadData.qualified,
              },
            })
            .select()
            .single()

          if (newLead) {
            // Vincular lead à conversa
            await supabase
              .from('conversations')
              .update({ lead_id: newLead.id })
              .eq('id', this.conversationId)
          }
        }

        outputs.push({
          tool_call_id: toolCall.id,
          output: JSON.stringify({ success: true, lead_saved: true }),
        })
      }
    }

    return outputs
  }

  /**
   * Salva mensagem no banco de dados
   */
  private async saveMessage(role: 'user' | 'assistant' | 'ai', content: string) {
    const supabase = await createClient()

    await supabase.from('messages').insert({
      conversation_id: this.conversationId,
      sender_type: role === 'user' ? 'client' : 'ai',
      content,
      message_type: 'text',
    })

    // Atualizar last_message_at na conversa
    await supabase
      .from('conversations')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', this.conversationId)
  }

  /**
   * Obtém histórico de mensagens
   */
  async getMessageHistory(limit: number = 50): Promise<ChatMessage[]> {
    const supabase = await createClient()

    const { data: messages } = await supabase
      .from('messages')
      .select('sender_type, content')
      .eq('conversation_id', this.conversationId)
      .order('created_at', { ascending: true })
      .limit(limit)

    if (!messages) return []

    return messages.map((msg) => ({
      role: msg.sender_type === 'client' ? 'user' : 'assistant',
      content: msg.content,
    }))
  }
}

/**
 * Instruções para criar o Assistant no OpenAI
 *
 * 1. Acesse https://platform.openai.com/assistants
 * 2. Crie um novo Assistant com:
 *
 * Nome: Garcez Palha - Assistente Jurídico
 * Model: gpt-4-turbo-preview
 *
 * Instructions:
 * ```
 * Você é o assistente virtual do escritório Garcez Palha, um escritório com 364 anos de tradição em direito e perícia.
 *
 * ⚠️ DISCLAIMER OBRIGATÓRIO OAB (SEMPRE INCLUIR NA PRIMEIRA MENSAGEM):
 * "⚠️ Este chatbot fornece informações gerais. Não substitui consulta jurídica formal. Análise do caso será feita por advogado habilitado (OAB/RJ 219.390)."
 *
 * IMPORTANTE - COMPLIANCE OAB:
 * - NÃO dê orientações jurídicas específicas ou aconselhamento legal
 * - NÃO informe preços fixos (apenas "valor de referência sujeito a análise do caso")
 * - SEMPRE direcione casos complexos para consulta com advogado
 * - Lembre o usuário periodicamente (a cada 5 mensagens) que esta é uma conversa preliminar
 *
 * Sua função é:
 * 1. Recepcionar visitantes com cordialidade e profissionalismo
 * 2. Entender as necessidades jurídicas do cliente
 * 3. Qualificar leads perguntando sobre:
 *    - Nome completo
 *    - Email
 *    - Telefone/WhatsApp
 *    - Serviço de interesse (direito imobiliário, perícia documental, avaliação de imóveis, perícia médica)
 *    - Urgência do caso
 *    - Orçamento aproximado (NUNCA dê preço fixo, apenas "valor de referência")
 * 4. Quando tiver informações suficientes, use a função save_qualified_lead
 *
 * Seja educado, profissional e transmita confiança. Caso a pessoa pergunte sobre os serviços, explique brevemente e sugira agendar uma consulta.
 * ```
 *
 * Functions:
 * ```json
 * {
 *   "name": "save_qualified_lead",
 *   "description": "Salva um lead qualificado após coletar informações suficientes",
 *   "parameters": {
 *     "type": "object",
 *     "properties": {
 *       "full_name": {
 *         "type": "string",
 *         "description": "Nome completo do lead"
 *       },
 *       "email": {
 *         "type": "string",
 *         "description": "Email do lead"
 *       },
 *       "phone": {
 *         "type": "string",
 *         "description": "Telefone/WhatsApp do lead"
 *       },
 *       "service_interest": {
 *         "type": "string",
 *         "description": "Serviço de interesse"
 *       },
 *       "urgency": {
 *         "type": "string",
 *         "enum": ["low", "medium", "high"],
 *         "description": "Nível de urgência"
 *       },
 *       "budget_range": {
 *         "type": "string",
 *         "description": "Faixa de orçamento aproximada"
 *       },
 *       "qualified": {
 *         "type": "boolean",
 *         "description": "Se o lead está qualificado (tem potencial real de conversão)"
 *       }
 *     },
 *     "required": ["qualified"]
 *   }
 * }
 * ```
 *
 * 3. Copie o Assistant ID e adicione ao .env:
 *    OPENAI_ASSISTANT_ID=asst_xxxxxxxxxxxxx
 */
