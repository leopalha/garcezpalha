'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Search,
  MessageSquare,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCw,
  Send,
} from 'lucide-react'

type Conversation = {
  id: string
  contact_name: string
  contact_email: string
  contact_phone: string
  channel: 'whatsapp' | 'email' | 'telegram' | 'website'
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  last_message: string
  last_message_at: string
  assigned_to: string | null
  created_at: string
}

type Message = {
  id: string
  sender: string
  text: string
  timestamp: string
  is_user: boolean
}

const channelConfig = {
  whatsapp: { label: 'WhatsApp', color: 'bg-green-100 text-green-800' },
  email: { label: 'Email', color: 'bg-blue-100 text-blue-800' },
  telegram: { label: 'Telegram', color: 'bg-sky-100 text-sky-800' },
  website: { label: 'Website', color: 'bg-slate-200 text-slate-800' },
}

const statusConfig = {
  open: { label: 'Aberta', color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle },
  in_progress: { label: 'Em Andamento', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock },
  resolved: { label: 'Resolvida', color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle2 },
  closed: { label: 'Fechada', color: 'bg-slate-200 text-slate-800 border-slate-300', icon: CheckCircle2 },
}

// Mock data
const mockConversations: Conversation[] = [
  {
    id: '1',
    contact_name: 'Maria Silva',
    contact_email: 'maria@email.com',
    contact_phone: '(21) 99999-1111',
    channel: 'whatsapp',
    status: 'open',
    last_message: 'Preciso de ajuda com meu processo',
    last_message_at: new Date(Date.now() - 600000).toISOString(),
    assigned_to: null,
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '2',
    contact_name: 'João Santos',
    contact_email: 'joao@email.com',
    contact_phone: '(21) 98888-2222',
    channel: 'email',
    status: 'in_progress',
    last_message: 'Quando podemos agendar a consulta?',
    last_message_at: new Date(Date.now() - 1800000).toISOString(),
    assigned_to: 'Dr. Garcez',
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: '3',
    contact_name: 'Ana Costa',
    contact_email: 'ana@email.com',
    contact_phone: '(21) 97777-3333',
    channel: 'telegram',
    status: 'resolved',
    last_message: 'Obrigada pela ajuda!',
    last_message_at: new Date(Date.now() - 86400000).toISOString(),
    assigned_to: 'Dr. Palha',
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
]

const mockMessages: Record<string, Message[]> = {
  '1': [
    { id: '1', sender: 'Maria Silva', text: 'Olá, preciso de ajuda', timestamp: new Date(Date.now() - 3600000).toISOString(), is_user: true },
    { id: '2', sender: 'Garcez Palha', text: 'Olá! Como podemos ajudar?', timestamp: new Date(Date.now() - 3000000).toISOString(), is_user: false },
    { id: '3', sender: 'Maria Silva', text: 'Preciso de ajuda com meu processo', timestamp: new Date(Date.now() - 600000).toISOString(), is_user: true },
  ],
  '2': [
    { id: '1', sender: 'João Santos', text: 'Bom dia', timestamp: new Date(Date.now() - 7200000).toISOString(), is_user: true },
    { id: '2', sender: 'Garcez Palha', text: 'Bom dia! Em que posso ajudar?', timestamp: new Date(Date.now() - 7000000).toISOString(), is_user: false },
    { id: '3', sender: 'João Santos', text: 'Quando podemos agendar a consulta?', timestamp: new Date(Date.now() - 1800000).toISOString(), is_user: true },
  ],
  '3': [
    { id: '1', sender: 'Ana Costa', text: 'Preciso de informações sobre perícia', timestamp: new Date(Date.now() - 172800000).toISOString(), is_user: true },
    { id: '2', sender: 'Garcez Palha', text: 'Claro, posso te explicar', timestamp: new Date(Date.now() - 172000000).toISOString(), is_user: false },
    { id: '3', sender: 'Ana Costa', text: 'Obrigada pela ajuda!', timestamp: new Date(Date.now() - 86400000).toISOString(), is_user: true },
  ],
}

export default function ConversasPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messageText, setMessageText] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const conversations = mockConversations

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch =
      conv.contact_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.contact_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.last_message.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === 'all' || conv.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedConversation) return

    // In production, this would send via API
    console.log('Sending message:', messageText)
    setMessageText('')
  }

  const statusCounts = {
    open: conversations.filter((c) => c.status === 'open').length,
    in_progress: conversations.filter((c) => c.status === 'in_progress').length,
    resolved: conversations.filter((c) => c.status === 'resolved').length,
    closed: conversations.filter((c) => c.status === 'closed').length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Conversas</h2>
          <p className="text-muted-foreground">
            Gerencie todas as conversas com clientes
            <span className="ml-2 text-xs bg-amber-200 text-amber-900 px-2 py-0.5 rounded">
              Modo Demo
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {Object.entries(statusConfig).map(([key, config]) => {
          const Icon = config.icon
          return (
            <Card
              key={key}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setStatusFilter(key)}
            >
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">{statusCounts[key as keyof typeof statusCounts]}</div>
                    <p className="text-xs text-muted-foreground">{config.label}</p>
                  </div>
                  <Icon className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, email ou mensagem..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="all">Todos os Status</option>
              <option value="open">Aberta</option>
              <option value="in_progress">Em Andamento</option>
              <option value="resolved">Resolvida</option>
              <option value="closed">Fechada</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Conversations List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Conversas ({filteredConversations.length})</CardTitle>
              <CardDescription>Clique para ver detalhes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredConversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedConversation?.id === conv.id
                        ? 'border-primary bg-primary/5'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium">{conv.contact_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(conv.last_message_at).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium ${
                          statusConfig[conv.status].color
                        }`}
                      >
                        {statusConfig[conv.status].label}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{conv.last_message}</p>
                    <div className="mt-2">
                      <span className={`px-2 py-0.5 rounded text-xs ${channelConfig[conv.channel].color}`}>
                        {channelConfig[conv.channel].label}
                      </span>
                    </div>
                  </div>
                ))}

                {filteredConversations.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Nenhuma conversa encontrada</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Conversation Detail */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>
                    {selectedConversation ? selectedConversation.contact_name : 'Selecione uma conversa'}
                  </CardTitle>
                  <CardDescription>
                    {selectedConversation && (
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 rounded text-xs ${channelConfig[selectedConversation.channel].color}`}>
                          {channelConfig[selectedConversation.channel].label}
                        </span>
                        <span className="text-xs">{selectedConversation.contact_email}</span>
                      </div>
                    )}
                  </CardDescription>
                </div>
                {selectedConversation && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4 mr-2" />
                      Ligar
                    </Button>
                    <Button variant="outline" size="sm">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                    {(mockMessages[selectedConversation.id] || []).map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.is_user ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            msg.is_user
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm">{msg.text}</p>
                          <p className={`text-xs mt-1 ${msg.is_user ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                            {new Date(msg.timestamp).toLocaleTimeString('pt-BR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Digite sua mensagem..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                    />
                    <Button onClick={handleSendMessage} disabled={!messageText.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Selecione uma conversa para visualizar</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
