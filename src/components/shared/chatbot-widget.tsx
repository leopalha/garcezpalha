'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageCircle, X, Send, Loader2 } from 'lucide-react'
import { trpc } from '@/lib/trpc/client'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const createConversation = trpc.chat.createConversation.useMutation({
    onSuccess: (data) => {
      setConversationId(data.id)
      // Adicionar mensagem de boas-vindas
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content:
            'Olá! Seja bem-vindo(a) ao Garcez Palha. Sou seu assistente virtual e estou aqui para ajudá-lo(a). Como posso auxiliar você hoje?',
          created_at: new Date().toISOString(),
        },
      ])
    },
    onError: () => {
      // Show demo message when database is not configured
      setMessages([
        {
          id: 'demo',
          role: 'assistant',
          content:
            'Olá! Seja bem-vindo(a) ao Garcez Palha. Este é um modo de demonstração. Para ativar o chatbot completo com IA, configure as variáveis de ambiente do Supabase e OpenAI no arquivo .env.local',
          created_at: new Date().toISOString(),
        },
      ])
    },
  })

  const sendMessage = trpc.chat.sendMessage.useMutation({
    onSuccess: (data) => {
      // Adicionar resposta do assistente
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + '-assistant',
          role: 'assistant',
          content: data.response,
          created_at: new Date().toISOString(),
        },
      ])
    },
    onError: (error) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + '-error',
          role: 'assistant',
          content: 'Desculpe, ocorreu um erro. Por favor, tente novamente.',
          created_at: new Date().toISOString(),
        },
      ])
    },
  })

  useEffect(() => {
    if (isOpen && !conversationId) {
      createConversation.mutate({ channel: 'chatbot' })
    }
  }, [isOpen])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!inputMessage.trim() || !conversationId) return

    // Adicionar mensagem do usuário imediatamente
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      created_at: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage('')

    // Enviar para o backend
    sendMessage.mutate({
      conversation_id: conversationId,
      message: inputMessage,
    })
  }

  if (!isOpen) {
    return (
      <Button
        size="lg"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[600px] shadow-2xl z-50 flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between border-b bg-primary text-primary-foreground py-4">
        <CardTitle className="text-lg font-heading">Assistente Garcez Palha</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
          className="hover:bg-primary-foreground/10"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {new Date(message.created_at).toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        ))}

        {sendMessage.isPending && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg p-3">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </CardContent>

      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            disabled={sendMessage.isPending || !conversationId}
          />
          <Button
            type="submit"
            size="icon"
            disabled={sendMessage.isPending || !conversationId || !inputMessage.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </Card>
  )
}
