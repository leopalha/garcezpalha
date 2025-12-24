/**
 * Enhanced Chatbot with Specialized AI Agents
 * Combines lead qualification with expert legal consultation
 */

import { getOrchestrator, type Message as AgentMessage, type OrchestratorResponse } from './agents'
import { createClient } from '../supabase/server'
import type { ChatMessage, LeadQualification } from './chatbot'

export interface EnhancedChatResponse {
  message: string
  agentUsed?: string
  confidence?: number
  metadata?: Record<string, unknown>
}

/**
 * Enhanced chatbot using specialized AI agents
 * Provides expert consultation in real estate, forensics, valuation, and medical law
 */
export class EnhancedLegalChatbot {
  private conversationId: string
  private useSpecializedAgents: boolean

  constructor(conversationId: string, options?: { useSpecializedAgents?: boolean }) {
    this.conversationId = conversationId
    this.useSpecializedAgents = options?.useSpecializedAgents ?? true
  }

  /**
   * Send message and get response from appropriate agent
   */
  async sendMessage(userMessage: string): Promise<EnhancedChatResponse> {
    try {
      // Save user message
      await this.saveMessage('user', userMessage)

      // Get conversation history for context
      const history = await this.getMessageHistory(10)

      // Convert to agent message format
      const agentHistory: AgentMessage[] = history.map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      }))

      // Use orchestrator to route to appropriate agent
      const orchestrator = getOrchestrator({
        temperature: 0.7,
        maxTokens: 4000,
      })

      let response: OrchestratorResponse

      if (this.useSpecializedAgents) {
        // Auto-route to best agent
        response = await orchestrator.process(userMessage, agentHistory, {
          conversationId: this.conversationId,
        })

        console.log(`[EnhancedChatbot] Routed to ${response.agentUsed} agent (confidence: ${(response.confidence * 100).toFixed(0)}%)`)
      } else {
        // Use general agent
        response = await orchestrator.processWithAgent('general', userMessage, agentHistory, {
          conversationId: this.conversationId,
        })
      }

      // Save assistant response
      await this.saveMessage('assistant', response.content)

      // Check if we should attempt lead qualification
      await this.attemptLeadQualification(userMessage, response.content)

      return {
        message: response.content,
        agentUsed: response.agentUsed,
        confidence: response.confidence,
        metadata: {
          tokensUsed: response.tokensUsed,
          model: response.model,
        },
      }
    } catch (error) {
      console.error('[EnhancedChatbot] Error:', error)

      // Fallback error message
      const errorMessage = 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente ou entre em contato diretamente pelo telefone (21) 97503-0018.'

      await this.saveMessage('assistant', errorMessage)

      return {
        message: errorMessage,
        metadata: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      }
    }
  }

  /**
   * Attempt to qualify lead based on conversation
   * Uses simple heuristics to detect if user provided contact info
   */
  private async attemptLeadQualification(userMessage: string, assistantResponse: string): Promise<void> {
    try {
      const lowerMessage = userMessage.toLowerCase()

      // Check if message contains contact information indicators
      const hasEmail = /@/.test(userMessage)
      const hasPhone = /\(?[0-9]{2}\)?[\s-]?[0-9]{4,5}[\s-]?[0-9]{4}/.test(userMessage)
      const hasName = /(meu nome|me chamo|sou o|sou a)/i.test(lowerMessage)

      // Determine service interest based on conversation
      let serviceInterest = 'Não especificado'
      if (lowerMessage.includes('imóvel') || lowerMessage.includes('casa') || lowerMessage.includes('apartamento')) {
        serviceInterest = 'Direito Imobiliário'
      } else if (lowerMessage.includes('assinatura') || lowerMessage.includes('documento') || lowerMessage.includes('falsa')) {
        serviceInterest = 'Perícia Grafotécnica'
      } else if (lowerMessage.includes('valor') || lowerMessage.includes('quanto vale') || lowerMessage.includes('avaliação')) {
        serviceInterest = 'Avaliação de Imóveis'
      } else if (lowerMessage.includes('acidente') || lowerMessage.includes('médico') || lowerMessage.includes('inss')) {
        serviceInterest = 'Perícia Médica'
      }

      // Determine urgency
      let urgency: 'low' | 'medium' | 'high' = 'medium'
      if (lowerMessage.includes('urgente') || lowerMessage.includes('agora') || lowerMessage.includes('hoje')) {
        urgency = 'high'
      } else if (lowerMessage.includes('futuro') || lowerMessage.includes('depois') || lowerMessage.includes('sem pressa')) {
        urgency = 'low'
      }

      // If we detected contact info, create/update lead
      if (hasEmail || hasPhone || hasName) {
        const supabase = await createClient()

        // Get existing conversation lead
        const { data: conversation } = await supabase
          .from('conversations')
          .select('lead_id')
          .eq('id', this.conversationId)
          .single()

        const leadData: Partial<LeadQualification> = {
          service_interest: serviceInterest,
          urgency,
          qualified: hasEmail && hasPhone, // Qualified if has both email and phone
        }

        if (conversation?.lead_id) {
          // Update existing lead
          await supabase
            .from('leads')
            .update({
              status: leadData.qualified ? 'qualified' : 'contacted',
              service_interest: serviceInterest,
              metadata: {
                urgency,
                ai_qualified: true,
                last_interaction: new Date().toISOString(),
              },
            })
            .eq('id', conversation.lead_id)
        } else {
          // Create new lead
          const { data: newLead } = await supabase
            .from('leads')
            .insert({
              full_name: 'Lead via Chatbot Especializado',
              email: hasEmail ? 'via_chatbot@temp.com' : '',
              phone: hasPhone ? 'Fornecido no chat' : '',
              service_interest: serviceInterest,
              source: 'chatbot_agents',
              status: leadData.qualified ? 'qualified' : 'new',
              metadata: {
                urgency,
                ai_qualified: true,
                created_from_agents: true,
              },
            })
            .select()
            .single()

          if (newLead) {
            // Link lead to conversation
            await supabase
              .from('conversations')
              .update({ lead_id: newLead.id })
              .eq('id', this.conversationId)
          }
        }
      }
    } catch (error) {
      console.error('[EnhancedChatbot] Lead qualification error:', error)
      // Don't throw - lead qualification is optional
    }
  }

  /**
   * Save message to database
   */
  private async saveMessage(role: 'user' | 'assistant', content: string): Promise<void> {
    const supabase = await createClient()

    await supabase.from('messages').insert({
      conversation_id: this.conversationId,
      sender_type: role === 'user' ? 'client' : 'ai',
      content,
      message_type: 'text',
    })

    // Update last_message_at
    await supabase
      .from('conversations')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', this.conversationId)
  }

  /**
   * Get conversation history
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

  /**
   * Get suggested agent for a query (for UI display)
   */
  async suggestAgent(query: string): Promise<{ agent: string; confidence: number }> {
    const orchestrator = getOrchestrator()
    const suggestion = orchestrator.suggestAgent(query)

    return {
      agent: suggestion.role,
      confidence: suggestion.confidence,
    }
  }
}

/**
 * Quick helper function to process a message
 */
export async function processEnhancedChat(
  conversationId: string,
  message: string,
  options?: { useSpecializedAgents?: boolean }
): Promise<EnhancedChatResponse> {
  const chatbot = new EnhancedLegalChatbot(conversationId, options)
  return chatbot.sendMessage(message)
}
