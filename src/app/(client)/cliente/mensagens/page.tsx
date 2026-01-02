'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { createClient } from '@/lib/supabase/client'
import { trpc } from '@/lib/trpc/client'
import { ConversationList } from '@/components/chat/conversation-list'
import { MessageList } from '@/components/chat/message-list'
import { MessageInput } from '@/components/chat/message-input'
import { Button } from '@/components/ui/button'
import { ErrorAlert } from '@/components/ui/error-alert'
import { EmptyState } from '@/components/ui/empty-state'
import { Loader2, MessageSquare, Plus } from 'lucide-react'
import type { RealtimeChannel } from '@supabase/supabase-js'

type Message = {
  id: string
  content: string
  sender_type: 'client' | 'agent' | 'bot' | 'system'
  created_at: string
  sender_id?: string
  conversation_id: string
}

export default function MensagensPage() {
  const { data: session } = useSession()
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [realtimeChannel, setRealtimeChannel] = useState<RealtimeChannel | null>(null)
  const supabase = createClient()

  // Fetch conversations
  const {
    data: conversationsData,
    isLoading: conversationsLoading,
    error: conversationsError,
    refetch: refetchConversations,
  } = trpc.chat.getMyConversations.useQuery({
    limit: 50,
    offset: 0,
  })

  // Fetch messages for selected conversation
  const {
    data: messagesData,
    isLoading: messagesLoading,
    error: messagesError,
    refetch: refetchMessages,
  } = trpc.chat.getMessages.useQuery(
    {
      conversationId: selectedConversationId || '',
      limit: 100,
      offset: 0,
    },
    {
      enabled: !!selectedConversationId,
    }
  )

  // Send message mutation
  const sendMessageMutation = trpc.chat.sendClientMessage.useMutation({
    onSuccess: () => {
      refetchMessages()
    },
  })

  // Create conversation mutation
  const createConversationMutation = trpc.chat.startClientConversation.useMutation({
    onSuccess: (data) => {
      refetchConversations()
      setSelectedConversationId(data.conversation.id)
    },
  })

  // Update messages when data changes
  useEffect(() => {
    if (messagesData?.messages) {
      setMessages(messagesData.messages as Message[])
    }
  }, [messagesData])

  // Setup Realtime subscription
  useEffect(() => {
    if (!selectedConversationId) return

    // Unsubscribe from previous channel
    if (realtimeChannel) {
      supabase.removeChannel(realtimeChannel)
    }

    // Subscribe to new messages in this conversation
    const channel = supabase
      .channel(`conversation:${selectedConversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${selectedConversationId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message
          setMessages((prev) => [...prev, newMessage])
        }
      )
      .subscribe()

    setRealtimeChannel(channel)

    return () => {
      supabase.removeChannel(channel)
    }
  }, [selectedConversationId, supabase])

  const handleSendMessage = async (content: string) => {
    if (!selectedConversationId) return

    await sendMessageMutation.mutateAsync({
      conversationId: selectedConversationId,
      content,
      messageType: 'text',
    })
  }

  const handleCreateConversation = async () => {
    await createConversationMutation.mutateAsync({
      channel: 'web_chat',
    })
  }

  // Loading state
  if (conversationsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Error state
  if (conversationsError) {
    return (
      <div className="p-6">
        <ErrorAlert
          error={conversationsError.message}
          retry={() => refetchConversations()}
          title="Erro ao carregar conversas"
        />
      </div>
    )
  }

  const conversations = conversationsData?.conversations || []

  // Empty state - no conversations
  if (conversations.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen p-6">
        <EmptyState
          icon={MessageSquare}
          title="Nenhuma conversa ainda"
          description="Inicie uma conversa com nossos advogados para receber atendimento personalizado"
          action={
            <Button onClick={handleCreateConversation} disabled={createConversationMutation.isPending}>
              {createConversationMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Criando...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Iniciar Conversa
                </>
              )}
            </Button>
          }
        />
      </div>
    )
  }

  // Auto-select first conversation if none selected
  if (!selectedConversationId && conversations.length > 0) {
    setSelectedConversationId(conversations[0].id)
  }

  return (
    <div className="h-screen flex">
      {/* Sidebar - Conversation List */}
      <div className="w-80 border-r bg-background flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <h1 className="text-lg font-semibold">Mensagens</h1>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCreateConversation}
            disabled={createConversationMutation.isPending}
          >
            {createConversationMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </Button>
        </div>
        <ConversationList
          conversations={conversations}
          selectedId={selectedConversationId || undefined}
          onSelect={setSelectedConversationId}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversationId ? (
          <>
            {/* Chat Header */}
            <div className="border-b p-4 bg-background">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold">
                    {conversations.find((c) => c.id === selectedConversationId)?.channel === 'whatsapp'
                      ? 'Conversa via WhatsApp'
                      : 'Conversa via Chat Web'}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {conversations.find((c) => c.id === selectedConversationId)?.status === 'human'
                      ? 'Atendimento com advogado'
                      : 'Atendimento automatizado'}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-hidden">
              {messagesLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : messagesError ? (
                <div className="p-6">
                  <ErrorAlert
                    error={messagesError.message}
                    retry={() => refetchMessages()}
                    title="Erro ao carregar mensagens"
                  />
                </div>
              ) : (
                <MessageList messages={messages} currentUserId={session?.user?.id || ''} />
              )}
            </div>

            {/* Message Input */}
            <MessageInput
              onSend={handleSendMessage}
              disabled={sendMessageMutation.isPending}
              placeholder="Digite sua mensagem..."
            />
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">Selecione uma conversa para começar</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
