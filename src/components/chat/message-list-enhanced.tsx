'use client'

import { useEffect, useRef, useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Bot, User, AlertCircle, Search, X, FileText, Download, Image as ImageIcon } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

type Attachment = {
  id: string
  file_url: string
  file_name: string
  file_size: number
  mime_type: string
}

type Message = {
  id: string
  content: string
  sender_type: 'client' | 'agent' | 'bot' | 'system'
  created_at: string
  sender_id?: string
  attachments?: Attachment[]
}

type MessageListEnhancedProps = {
  messages: Message[]
  currentUserId: string
  typingUsers?: string[] // IDs of users currently typing
  enableSearch?: boolean
  enableMarkdown?: boolean
}

export function MessageListEnhanced({
  messages,
  currentUserId,
  typingUsers = [],
  enableSearch = true,
  enableMarkdown = true,
}: MessageListEnhancedProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [filteredMessages, setFilteredMessages] = useState(messages)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = messages.filter((msg) =>
        msg.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredMessages(filtered)
    } else {
      setFilteredMessages(messages)
    }
  }, [searchQuery, messages])

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: ptBR })
    } catch {
      return 'Agora'
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const handleDownload = async (attachment: Attachment) => {
    try {
      const response = await fetch(attachment.file_url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = attachment.file_name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading file:', error)
    }
  }

  const renderAttachment = (attachment: Attachment) => {
    const isImage = attachment.mime_type.startsWith('image/')

    return (
      <div key={attachment.id} className="mt-2">
        {isImage ? (
          <div className="relative group">
            <img
              src={attachment.file_url}
              alt={attachment.file_name}
              className="max-w-[300px] max-h-[300px] rounded-lg object-cover cursor-pointer"
              onClick={() => window.open(attachment.file_url, '_blank')}
            />
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleDownload(attachment)}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-3 max-w-[300px]">
            <FileText className="h-8 w-8 text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{attachment.file_name}</p>
              <p className="text-xs text-muted-foreground">{formatFileSize(attachment.file_size)}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDownload(attachment)}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    )
  }

  const renderMessage = (message: Message, isHighlighted: boolean) => {
    const isClient = message.sender_type === 'client'
    const isBot = message.sender_type === 'bot'
    const isSystem = message.sender_type === 'system'
    const isCurrentUser = message.sender_id === currentUserId

    if (isSystem) {
      return (
        <div
          key={message.id}
          className={cn(
            'flex justify-center my-4',
            isHighlighted && 'bg-yellow-100 dark:bg-yellow-900/20 rounded-lg py-2'
          )}
        >
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
          isCurrentUser && 'flex-row-reverse',
          isHighlighted && 'bg-yellow-100 dark:bg-yellow-900/20 rounded-lg p-2 -mx-2'
        )}
      >
        <Avatar className="h-8 w-8 shrink-0">
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
            {enableMarkdown ? (
              <div className="text-sm prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                    a: ({ href, children }) => (
                      <a href={href} target="_blank" rel="noopener noreferrer" className="underline">
                        {children}
                      </a>
                    ),
                    code: ({ inline, children, ...props }: any) =>
                      inline ? (
                        <code className="bg-black/10 dark:bg-white/10 px-1 py-0.5 rounded text-xs" {...props}>
                          {children}
                        </code>
                      ) : (
                        <code className="block bg-black/10 dark:bg-white/10 p-2 rounded my-2 text-xs" {...props}>
                          {children}
                        </code>
                      ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
            )}
            {message.attachments?.map(renderAttachment)}
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
    <div className="flex flex-col h-full">
      {/* Search Bar */}
      {enableSearch && (
        <div className="border-b p-3 bg-background">
          {showSearch ? (
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar mensagens..."
                  className="pl-9"
                  autoFocus
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowSearch(false)
                  setSearchQuery('')
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSearch(true)}
              className="w-full justify-start"
            >
              <Search className="h-4 w-4 mr-2" />
              Buscar mensagens
            </Button>
          )}
          {searchQuery && (
            <p className="text-xs text-muted-foreground mt-2">
              {filteredMessages.length} resultado{filteredMessages.length !== 1 ? 's' : ''} encontrado
              {filteredMessages.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1" ref={scrollRef}>
        <div className="p-4">
          {filteredMessages.map((msg) =>
            renderMessage(msg, searchQuery.trim().length > 0 && msg.content.toLowerCase().includes(searchQuery.toLowerCase()))
          )}

          {/* Typing Indicator */}
          {typingUsers.length > 0 && (
            <div className="flex gap-3 mb-4">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-lg px-4 py-3 flex items-center gap-1">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" />
                </div>
                <span className="text-xs text-muted-foreground ml-2">digitando...</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
