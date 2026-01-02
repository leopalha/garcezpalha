'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

type Message = {
  id: string
  content: string
  sender_type: string
  created_at: string
}

type Conversation = {
  id: string
  status: string
  channel: string
  last_message_at: string | null
  created_at: string
  messages: Message[]
}

type ConversationListProps = {
  conversations: Conversation[]
  selectedId?: string
  onSelect: (conversationId: string) => void
}

export function ConversationList({ conversations, selectedId, onSelect }: ConversationListProps) {
  const getLastMessage = (conversation: Conversation) => {
    if (!conversation.messages || conversation.messages.length === 0) {
      return 'Nenhuma mensagem'
    }
    const lastMessage = conversation.messages[conversation.messages.length - 1]
    return lastMessage.content.substring(0, 50) + (lastMessage.content.length > 50 ? '...' : '')
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      active: { label: 'Ativo', variant: 'default' },
      bot: { label: 'Bot', variant: 'secondary' },
      waiting_human: { label: 'Aguardando', variant: 'outline' },
      human: { label: 'Com Advogado', variant: 'default' },
      resolved: { label: 'Resolvido', variant: 'secondary' },
      closed: { label: 'Fechado', variant: 'destructive' },
    }
    const config = variants[status] || { label: status, variant: 'outline' as const }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Recente'
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: ptBR })
    } catch {
      return 'Recente'
    }
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-2 p-4">
        {conversations.map((conversation) => (
          <button
            key={conversation.id}
            onClick={() => onSelect(conversation.id)}
            className={cn(
              'w-full text-left p-4 rounded-lg border transition-colors',
              'hover:bg-accent hover:border-accent-foreground/20',
              selectedId === conversation.id && 'bg-accent border-accent-foreground/20'
            )}
          >
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="" />
                <AvatarFallback>
                  {conversation.channel === 'whatsapp' ? '📱' : '💬'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm">
                    {conversation.channel === 'whatsapp' ? 'WhatsApp' : 'Chat Web'}
                  </span>
                  {getStatusBadge(conversation.status)}
                </div>
                <p className="text-sm text-muted-foreground truncate mb-1">
                  {getLastMessage(conversation)}
                </p>
                <span className="text-xs text-muted-foreground">
                  {formatDate(conversation.last_message_at || conversation.created_at)}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </ScrollArea>
  )
}
