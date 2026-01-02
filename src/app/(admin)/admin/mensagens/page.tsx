'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { trpc } from '@/lib/trpc/client'
import { ConversationList } from '@/components/chat/conversation-list'
import { MessageList } from '@/components/chat/message-list'
import { MessageInput } from '@/components/chat/message-input'
import { Button } from '@/components/ui/button'
import { ErrorAlert } from '@/components/ui/error-alert'
import { EmptyState } from '@/components/ui/empty-state'
import { Badge } from '@/components/ui/badge'
import { Loader2, MessageSquare, UserCheck, Bot } from 'lucide-react'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { useSession } from 'next-auth/react'

type Message = {
  id: string
  content: string
  sender_type: 'client' | 'agent' | 'bot' | 'system'
  created_at: string
  sender_id?: string
  conversation_id: string
}

type Conversation = {
  id: string
  status: string
  channel: string
  needs_attention: boolean
  client_id?: string
  assigned_admin_id?: string
  last_message_at: string | null
  created_at: string
  messages: Message[]
}

export default function AdminMessagesPage() {
  const { data: session } = useSession()
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [realtimeChannel, setRealtimeChannel] = useState<RealtimeChannel | null>(null)
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined)
  const [filterNeedsAttention, setFilterNeedsAttention] = useState(false)
  const supabase = createClient()

  // Fetch all conversations (admin)
  const {
    data: conversationsData,
    isLoading: conversationsLoading,
    error: conversationsError,
    refetch: refetchConversations,
  } = trpc.chat.listConversations.useQuery({
    status: filterStatus as any,
    limit: 100,
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
      limit: 200,
      offset: 0,
    },
    {
      enabled: !!selectedConversationId,
    }
  )

  // Send message as lawyer/admin
  const sendMessageMutation = trpc.chat.sendLawyerMessage.useMutation({
    onSuccess: () => {
      refetchMessages()
    },
  })

  // Takeover conversation from bot
  const takeoverMutation = trpc.chat.takeoverConversation.useMutation({
    onSuccess: () => {
      refetchConversations()
      refetchMessages()
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
      .channel(`admin-conversation:${selectedConversationId}`)
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
    })
  }

  const handleTakeover = async () => {
    if (!selectedConversationId) return

    await takeoverMutation.mutateAsync({
      conversationId: selectedConversationId,
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

  const allConversations = (conversationsData?.conversations || []) as Conversation[]

  // Apply client-side filters
  const conversations = allConversations.filter(conv => {
    if (filterNeedsAttention && !conv.needs_attention) return false
    return true
  })

  // Count conversations needing attention
  const needsAttentionCount = allConversations.filter(c => c.needs_attention).length

  // Empty state
  if (conversations.length === 0) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Mensagens de Clientes</h1>
            <p className="text-muted-foreground">
              Gerencie todas as conversas com clientes
            </p>
          </div>
        </div>

        <EmptyState
          icon={MessageSquare}
          title="Nenhuma conversa encontrada"
          description={filterNeedsAttention ? "Não há conversas precisando de atenção no momento" : "Quando clientes iniciarem conversas, elas aparecerão aqui"}
        />
      </div>
    )
  }

  // Auto-select first conversation if none selected
  if (!selectedConversationId && conversations.length > 0) {
    setSelectedConversationId(conversations[0].id)
  }

  const selectedConversation = conversations.find(c => c.id === selectedConversationId)
  const isBot = selectedConversation?.status === 'bot' || selectedConversation?.status === 'active'
  const isAssignedToMe = selectedConversation?.assigned_admin_id === session?.user?.id

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="border-b p-4 bg-background">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Mensagens de Clientes</h1>
            <p className="text-sm text-muted-foreground">
              {conversations.length} conversa{conversations.length !== 1 ? 's' : ''}
              {needsAttentionCount > 0 && (
                <> · <span className="text-orange-600 font-medium">{needsAttentionCount} precisando de atenção</span></>
              )}
            </p>
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <Button
              variant={filterNeedsAttention ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterNeedsAttention(!filterNeedsAttention)}
            >
              Atenção Necessária
              {needsAttentionCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {needsAttentionCount}
                </Badge>
              )}
            </Button>

            <select
              value={filterStatus || ''}
              onChange={(e) => setFilterStatus(e.target.value || undefined)}
              className="border rounded-md px-3 py-1 text-sm"
            >
              <option value="">Todos os status</option>
              <option value="active">Ativo</option>
              <option value="bot">Bot</option>
              <option value="waiting_human">Aguardando</option>
              <option value="human">Com Advogado</option>
              <option value="closed">Fechado</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Conversation List */}
        <div className="w-80 border-r bg-background flex flex-col">
          <ConversationList
            conversations={conversations}
            selectedId={selectedConversationId || undefined}
            onSelect={setSelectedConversationId}
          />
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversationId && selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="border-b p-4 bg-background">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className="font-semibold">
                        {selectedConversation.channel === 'whatsapp' ? 'WhatsApp' :
                         selectedConversation.channel === 'web_chat' ? 'Chat Web' :
                         selectedConversation.channel}
                      </h2>
                      <Badge variant={
                        selectedConversation.status === 'human' ? 'default' :
                        selectedConversation.status === 'bot' ? 'secondary' :
                        'outline'
                      }>
                        {selectedConversation.status === 'human' ? 'Com Advogado' :
                         selectedConversation.status === 'bot' ? 'Atendimento Bot' :
                         selectedConversation.status}
                      </Badge>
                      {selectedConversation.needs_attention && (
                        <Badge variant="destructive">Atenção Necessária</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {isAssignedToMe && 'Atribuído a você'}
                      {!isAssignedToMe && selectedConversation.assigned_admin_id && 'Atribuído a outro advogado'}
                      {!selectedConversation.assigned_admin_id && 'Não atribuído'}
                    </p>
                  </div>

                  {/* Takeover Button */}
                  {isBot && (
                    <Button
                      onClick={handleTakeover}
                      disabled={takeoverMutation.isPending}
                      variant="outline"
                      size="sm"
                    >
                      {takeoverMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Assumindo...
                        </>
                      ) : (
                        <>
                          <UserCheck className="h-4 w-4 mr-2" />
                          Assumir Conversa
                        </>
                      )}
                    </Button>
                  )}
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
                disabled={sendMessageMutation.isPending || isBot}
                placeholder={isBot ? "Assuma a conversa para responder..." : "Digite sua resposta..."}
              />

              {isBot && (
                <div className="p-3 bg-muted border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Bot className="h-4 w-4" />
                    Esta conversa está sendo gerenciada pelo bot. Clique em "Assumir Conversa" para responder.
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">Selecione uma conversa para visualizar</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
