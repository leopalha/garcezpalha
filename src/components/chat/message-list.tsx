'use client'

import { useEffect, useRef } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { Bot, User, AlertCircle } from 'lucide-react'

type Message = {
  id: string
  content: string
  sender_type: 'client' | 'agent' | 'bot' | 'system'
  created_at: string
  sender_id?: string
}

type MessageListProps = {
  messages: Message[]
  currentUserId: string
}

export function MessageList({ messages, currentUserId }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: ptBR })
    } catch {
      return 'Agora'
    }
  }

  const renderMessage = (message: Message) => {
    const isClient = message.sender_type === 'client'
    const isBot = message.sender_type === 'bot'
    const isSystem = message.sender_type === 'system'
    const isCurrentUser = message.sender_id === currentUserId

    if (isSystem) {
      return (
        <div key={message.id} className="flex justify-center my-4">
          <div className="bg-muted px-4 py-2 rounded-full text-xs text-muted-foreground flex items-center gap-2">
            <AlertCircle className="h-3 w-3" />
            {message.content}
          </div>
        </div>
      )
    }

    return (
      <div
        key={message.id}
        className={cn(
          'flex gap-3 mb-4',
          isCurrentUser && 'flex-row-reverse'
        )}
      >
        <Avatar className="h-8 w-8">
          <AvatarImage src="" />
          <AvatarFallback>
            {isBot ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
          </AvatarFallback>
        </Avatar>
        <div className={cn('flex flex-col max-w-[70%]', isCurrentUser && 'items-end')}>
          <div
            className={cn(
              'rounded-lg px-4 py-2',
              isCurrentUser
                ? 'bg-primary text-primary-foreground'
                : isBot
                ? 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100'
                : 'bg-muted'
            )}
          >
            <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
          </div>
          <span className="text-xs text-muted-foreground mt-1 px-1">
            {formatTime(message.created_at)}
          </span>
        </div>
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <div className="text-center">
          <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-sm">Nenhuma mensagem ainda</p>
          <p className="text-xs mt-1">Envie uma mensagem para começar a conversa</p>
        </div>
      </div>
    )
  }

  return (
    <ScrollArea className="h-full" ref={scrollRef}>
      <div className="p-4">
        {messages.map(renderMessage)}
      </div>
    </ScrollArea>
  )
}
