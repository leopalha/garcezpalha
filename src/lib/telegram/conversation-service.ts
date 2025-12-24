/**
 * Telegram Conversation Service
 *
 * Manages Telegram conversations and messages in Supabase
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Use service role key for server-side operations (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export interface TelegramConversation {
  id: string
  chat_id: number
  user_id?: string
  lead_id?: string
  telegram_user_id: number
  first_name: string
  last_name?: string
  username?: string
  platform: 'telegram' | 'whatsapp' | 'web'
  status: 'active' | 'qualified' | 'converted' | 'closed'
  language_code?: string
  is_qualified: boolean
  qualification_score: number
  qualification_reason?: string
  qualified_at?: string
  assigned_to?: string
  handoff_at?: string
  handoff_reason?: string
  is_bot_active: boolean
  last_message_at: string
  created_at: string
  updated_at: string
}

export interface TelegramMessage {
  id: string
  conversation_id: string
  telegram_message_id: number
  chat_id: number
  direction: 'incoming' | 'outgoing'
  message_type: 'text' | 'photo' | 'video' | 'document' | 'location' | 'contact' | 'voice' | 'sticker'
  text?: string
  media_url?: string
  media_type?: string
  from_user_id: number
  from_first_name?: string
  from_username?: string
  is_bot: boolean
  ai_processed: boolean
  ai_response?: string
  ai_intent?: string
  ai_entities?: Record<string, any>
  ai_sentiment?: 'positive' | 'neutral' | 'negative'
  reply_to_message_id?: number
  forwarded_from?: number
  edit_date?: string
  telegram_date: string
  created_at: string
}

class TelegramConversationService {
  /**
   * Check if Supabase is configured
   */
  isConfigured(): boolean {
    return !!supabaseUrl && !!supabaseServiceKey && supabaseUrl !== '' && supabaseServiceKey !== ''
  }

  /**
   * Get or create a conversation for a chat
   */
  async getOrCreateConversation(
    chatId: number,
    telegramUserId: number,
    firstName: string,
    lastName?: string,
    username?: string,
    languageCode?: string
  ): Promise<TelegramConversation | null> {
    if (!this.isConfigured()) {
      console.warn('Supabase not configured, skipping conversation creation')
      return null
    }

    try {
      // Try to find existing conversation
      const { data: existing, error: findError } = await supabase
        .from('telegram_conversations')
        .select('*')
        .eq('chat_id', chatId)
        .single()

      if (existing && !findError) {
        return existing as TelegramConversation
      }

      // Create new conversation
      const { data, error } = await supabase
        .from('telegram_conversations')
        .insert({
          chat_id: chatId,
          telegram_user_id: telegramUserId,
          first_name: firstName,
          last_name: lastName,
          username: username,
          language_code: languageCode || 'pt',
          platform: 'telegram',
          status: 'active',
          is_qualified: false,
          qualification_score: 0,
          is_bot_active: true,
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating conversation:', error)
        return null
      }

      return data as TelegramConversation
    } catch (error) {
      console.error('Error in getOrCreateConversation:', error)
      return null
    }
  }

  /**
   * Save an incoming message
   */
  async saveIncomingMessage(
    conversationId: string,
    telegramMessageId: number,
    chatId: number,
    fromUserId: number,
    fromFirstName: string,
    fromUsername?: string,
    text?: string,
    messageType: string = 'text',
    telegramDate?: Date
  ): Promise<TelegramMessage | null> {
    if (!this.isConfigured()) {
      console.warn('Supabase not configured, skipping message save')
      return null
    }

    try {
      const { data, error } = await supabase
        .from('telegram_messages')
        .insert({
          conversation_id: conversationId,
          telegram_message_id: telegramMessageId,
          chat_id: chatId,
          direction: 'incoming',
          message_type: messageType,
          text: text,
          from_user_id: fromUserId,
          from_first_name: fromFirstName,
          from_username: fromUsername,
          is_bot: false,
          ai_processed: false,
          telegram_date: telegramDate ? telegramDate.toISOString() : new Date().toISOString(),
        })
        .select()
        .single()

      if (error) {
        console.error('Error saving incoming message:', error)
        return null
      }

      return data as TelegramMessage
    } catch (error) {
      console.error('Error in saveIncomingMessage:', error)
      return null
    }
  }

  /**
   * Save an outgoing message
   */
  async saveOutgoingMessage(
    conversationId: string,
    telegramMessageId: number,
    chatId: number,
    text: string,
    aiResponse?: string,
    aiIntent?: string
  ): Promise<TelegramMessage | null> {
    if (!this.isConfigured()) {
      console.warn('Supabase not configured, skipping message save')
      return null
    }

    try {
      const { data, error } = await supabase
        .from('telegram_messages')
        .insert({
          conversation_id: conversationId,
          telegram_message_id: telegramMessageId,
          chat_id: chatId,
          direction: 'outgoing',
          message_type: 'text',
          text: text,
          from_user_id: 0, // Bot
          is_bot: true,
          ai_processed: true,
          ai_response: aiResponse,
          ai_intent: aiIntent,
          telegram_date: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) {
        console.error('Error saving outgoing message:', error)
        return null
      }

      return data as TelegramMessage
    } catch (error) {
      console.error('Error in saveOutgoingMessage:', error)
      return null
    }
  }

  /**
   * Get conversation by chat ID
   */
  async getConversationByChatId(chatId: number): Promise<TelegramConversation | null> {
    if (!this.isConfigured()) {
      return null
    }

    try {
      const { data, error } = await supabase
        .from('telegram_conversations')
        .select('*')
        .eq('chat_id', chatId)
        .single()

      if (error) {
        console.error('Error getting conversation:', error)
        return null
      }

      return data as TelegramConversation
    } catch (error) {
      console.error('Error in getConversationByChatId:', error)
      return null
    }
  }

  /**
   * Get messages for a conversation
   */
  async getMessages(conversationId: string, limit: number = 50): Promise<TelegramMessage[]> {
    if (!this.isConfigured()) {
      return []
    }

    try {
      const { data, error } = await supabase
        .from('telegram_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('telegram_date', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error getting messages:', error)
        return []
      }

      return (data as TelegramMessage[]).reverse() // Return in chronological order
    } catch (error) {
      console.error('Error in getMessages:', error)
      return []
    }
  }

  /**
   * Update conversation qualification
   */
  async qualifyConversation(
    conversationId: string,
    score: number,
    reason?: string
  ): Promise<boolean> {
    if (!this.isConfigured()) {
      return false
    }

    try {
      const { error } = await supabase
        .from('telegram_conversations')
        .update({
          is_qualified: score >= 70, // Qualify if score is 70+
          qualification_score: score,
          qualification_reason: reason,
          qualified_at: score >= 70 ? new Date().toISOString() : null,
          status: score >= 70 ? 'qualified' : 'active',
        })
        .eq('id', conversationId)

      if (error) {
        console.error('Error qualifying conversation:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in qualifyConversation:', error)
      return false
    }
  }

  /**
   * Update message with AI processing results
   */
  async updateMessageAI(
    messageId: string,
    intent?: string,
    entities?: Record<string, any>,
    sentiment?: 'positive' | 'neutral' | 'negative'
  ): Promise<boolean> {
    if (!this.isConfigured()) {
      return false
    }

    try {
      const { error } = await supabase
        .from('telegram_messages')
        .update({
          ai_processed: true,
          ai_intent: intent,
          ai_entities: entities,
          ai_sentiment: sentiment,
        })
        .eq('id', messageId)

      if (error) {
        console.error('Error updating message AI:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in updateMessageAI:', error)
      return false
    }
  }

  /**
   * Assign conversation to admin (human handoff)
   */
  async assignToAdmin(
    conversationId: string,
    adminUserId: string,
    reason?: string
  ): Promise<boolean> {
    if (!this.isConfigured()) {
      return false
    }

    try {
      const { error } = await supabase
        .from('telegram_conversations')
        .update({
          assigned_to: adminUserId,
          handoff_at: new Date().toISOString(),
          handoff_reason: reason,
          is_bot_active: false,
        })
        .eq('id', conversationId)

      if (error) {
        console.error('Error assigning conversation:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in assignToAdmin:', error)
      return false
    }
  }
}

// Export singleton instance
const telegramConversationService = new TelegramConversationService()
export default telegramConversationService
