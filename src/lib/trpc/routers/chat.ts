import { z } from 'zod'
import { router, publicProcedure, protectedProcedure } from '../init'
import { TRPCError } from '@trpc/server'
import { AILegalChatbot } from '@/lib/ai/chatbot'
import { EnhancedLegalChatbot } from '@/lib/ai/chatbot-with-agents'

export const chatRouter = router({
  // Public - Create new conversation
  createConversation: publicProcedure
    .input(
      z.object({
        channel: z.enum(['whatsapp', 'chatbot', 'email', 'phone']).default('chatbot'),
        external_id: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from('conversations')
        .insert({
          channel: input.channel,
          external_id: input.external_id,
          status: 'active',
        })
        .select()
        .single()

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro ao criar conversa',
          cause: error,
        })
      }

      return data
    }),

  // Public - Send message to chatbot
  sendMessage: publicProcedure
    .input(
      z.object({
        conversation_id: z.string().uuid(),
        message: z.string().min(1, 'Mensagem não pode estar vazia'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Verificar se conversa existe
        const { data: conversation, error: convError } = await ctx.supabase
          .from('conversations')
          .select('*')
          .eq('id', input.conversation_id)
          .single()

        if (convError || !conversation) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Conversa não encontrada',
          })
        }

        // Obter thread_id se existir
        const threadId = conversation.metadata?.openai_thread_id

        // Criar instância do chatbot
        const chatbot = new AILegalChatbot(input.conversation_id, threadId)

        // Enviar mensagem e obter resposta
        const response = await chatbot.sendMessage(input.message)

        return {
          response,
          conversation_id: input.conversation_id,
        }
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Erro ao processar mensagem',
          cause: error,
        })
      }
    }),

  // Public - Get conversation history
  getHistory: publicProcedure
    .input(
      z.object({
        conversation_id: z.string().uuid(),
        limit: z.number().min(1).max(100).default(50),
      })
    )
    .query(async ({ ctx, input }) => {
      const { data: messages, error } = await ctx.supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', input.conversation_id)
        .order('created_at', { ascending: true })
        .limit(input.limit)

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro ao buscar histórico',
          cause: error,
        })
      }

      return messages
    }),

  // Protected - Get messages for a specific conversation
  getMessages: protectedProcedure
    .input(
      z.object({
        conversationId: z.string().uuid(),
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      // Verificar se conversa existe
      const { data: conversation } = await ctx.supabase
        .from('conversations')
        .select('*')
        .eq('id', input.conversationId)
        .single()

      if (!conversation) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Conversa não encontrada',
        })
      }

      // Verificar permissão (conversation pertence ao usuário)
      if (ctx.user && conversation.client_id !== ctx.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Você não tem permissão para acessar esta conversa',
        })
      }

      // Buscar mensagens
      const { data: messages, error } = await ctx.supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', input.conversationId)
        .order('created_at', { ascending: true })
        .range(input.offset, input.offset + input.limit - 1)

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro ao buscar mensagens',
          cause: error,
        })
      }

      return {
        messages: messages || [],
        conversation,
      }
    }),

  // Protected - List all conversations (admin/lawyer)
  listConversations: protectedProcedure
    .input(
      z.object({
        channel: z.enum(['whatsapp', 'chatbot', 'email', 'phone']).optional(),
        status: z.enum(['active', 'closed', 'archived']).optional(),
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      let query = ctx.supabase
        .from('conversations')
        .select('*', { count: 'exact' })
        .order('last_message_at', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false })
        .range(input.offset, input.offset + input.limit - 1)

      if (input.channel) {
        query = query.eq('channel', input.channel)
      }

      if (input.status) {
        query = query.eq('status', input.status)
      }

      const { data, error, count } = await query

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro ao listar conversas',
          cause: error,
        })
      }

      return {
        conversations: data,
        total: count ?? 0,
      }
    }),

  // Protected - Close conversation
  closeConversation: protectedProcedure
    .input(z.object({ conversation_id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from('conversations')
        .update({ status: 'closed' })
        .eq('id', input.conversation_id)
        .select()
        .single()

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro ao fechar conversa',
          cause: error,
        })
      }

      return data
    }),

  // Public - Send message with specialized agents (enhanced version)
  sendMessageWithAgents: publicProcedure
    .input(
      z.object({
        conversation_id: z.string().uuid(),
        message: z.string().min(1, 'Mensagem não pode estar vazia'),
        useSpecializedAgents: z.boolean().default(true),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Verificar se conversa existe
        const { data: conversation, error: convError } = await ctx.supabase
          .from('conversations')
          .select('*')
          .eq('id', input.conversation_id)
          .single()

        if (convError || !conversation) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Conversa não encontrada',
          })
        }

        // Criar instância do chatbot aprimorado
        const chatbot = new EnhancedLegalChatbot(input.conversation_id, {
          useSpecializedAgents: input.useSpecializedAgents,
        })

        // Enviar mensagem e obter resposta
        const response = await chatbot.sendMessage(input.message)

        return {
          ...response,
          conversation_id: input.conversation_id,
        }
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Erro ao processar mensagem',
          cause: error,
        })
      }
    }),

  // Public - Suggest which agent to use for a query
  suggestAgent: publicProcedure
    .input(
      z.object({
        query: z.string().min(1),
      })
    )
    .query(async ({ input }) => {
      const { getOrchestrator } = await import('@/lib/ai/agents')
      const orchestrator = getOrchestrator()
      const suggestion = await orchestrator.suggestAgent(input.query)

      return {
        agent: suggestion.role,
        confidence: suggestion.confidence,
        agentName: getAgentDisplayName(suggestion.role),
      }
    }),

  // Protected - Get my conversations as a client
  getMyConversations: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const { data, error, count } = await ctx.supabase
        .from('conversations')
        .select('*, messages(id, content, sender_type, created_at)', { count: 'exact' })
        .or(`client_id.eq.${ctx.user.id}`)
        .order('last_message_at', { ascending: false })
        .range(input.offset, input.offset + input.limit - 1)

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro ao buscar conversas',
          cause: error,
        })
      }

      return {
        conversations: data || [],
        total: count || 0,
      }
    }),

  // Protected - Send message as client to human lawyer
  sendClientMessage: protectedProcedure
    .input(
      z.object({
        conversationId: z.string().uuid(),
        content: z.string().min(1, 'Mensagem não pode estar vazia').max(5000),
        messageType: z.enum(['text', 'image', 'document', 'audio', 'video']).default('text'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verificar se conversa pertence ao cliente
      const { data: conversation } = await ctx.supabase
        .from('conversations')
        .select('*')
        .eq('id', input.conversationId)
        .eq('client_id', ctx.user.id)
        .single()

      if (!conversation) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Conversa não encontrada',
        })
      }

      const { data: message, error } = await ctx.supabase
        .from('messages')
        .insert({
          conversation_id: input.conversationId,
          sender_type: 'client',
          sender_id: ctx.user.id,
          content: input.content,
          message_type: input.messageType,
          channel: conversation.channel,
        })
        .select()
        .single()

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro ao enviar mensagem',
          cause: error,
        })
      }

      return {
        success: true,
        message,
      }
    }),

  // Protected - Send message as admin/lawyer to client
  sendLawyerMessage: protectedProcedure
    .input(
      z.object({
        conversationId: z.string().uuid(),
        content: z.string().min(1, 'Mensagem não pode estar vazia').max(5000),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { data: message, error } = await ctx.supabase
        .from('messages')
        .insert({
          conversation_id: input.conversationId,
          sender_type: 'agent',
          sender_id: ctx.user.id,
          content: input.content,
          message_type: 'text',
        })
        .select()
        .single()

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro ao enviar mensagem',
          cause: error,
        })
      }

      return {
        success: true,
        message,
      }
    }),

  // Protected - Takeover conversation (lawyer assumes control from bot)
  takeoverConversation: protectedProcedure
    .input(z.object({ conversationId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from('conversations')
        .update({
          status: 'human',
          assigned_admin_id: ctx.user.id,
          taken_over_at: new Date().toISOString(),
          needs_attention: false,
        })
        .eq('id', input.conversationId)
        .select()
        .single()

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro ao assumir conversa',
          cause: error,
        })
      }

      // Enviar mensagem de sistema
      await ctx.supabase.from('messages').insert({
        conversation_id: input.conversationId,
        sender_type: 'system',
        content: 'Um advogado assumiu o atendimento.',
        message_type: 'system',
      })

      return {
        success: true,
        conversation: data,
      }
    }),

  // Protected - Create conversation for client
  startClientConversation: protectedProcedure
    .input(
      z.object({
        channel: z.enum(['whatsapp', 'chatbot', 'email', 'phone', 'web_chat']).default('web_chat'),
        metadata: z.record(z.string(), z.any()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from('conversations')
        .insert({
          client_id: ctx.user.id,
          channel: input.channel,
          status: 'active',
          metadata: input.metadata || {},
        })
        .select()
        .single()

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro ao criar conversa',
          cause: error,
        })
      }

      return {
        success: true,
        conversation: data,
      }
    }),
})

// Helper function to get display names for agents
function getAgentDisplayName(role: string): string {
  const names: Record<string, string> = {
    'real-estate': 'Direito Imobiliário',
    'forensics': 'Perícia Grafotécnica',
    'valuation': 'Avaliação de Imóveis',
    'medical': 'Perícia Médica',
    'criminal': 'Direito Criminal',
    'general': 'Consulta Geral',
  }
  return names[role] || 'Desconhecido'
}
