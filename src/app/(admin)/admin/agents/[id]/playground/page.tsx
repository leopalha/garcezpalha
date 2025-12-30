'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Loader2, Send, Trash2, Settings } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  tokensUsed?: number
  durationMs?: number
}

const AGENT_NAMES: Record<string, string> = {
  'real-estate': 'Especialista em Imóveis',
  'forensics': 'Perícia Grafotécnica',
  'valuation': 'Avaliação de Imóveis',
  'medical': 'Perícia Médica',
  'criminal': 'Direito Criminal',
  'financial-protection': 'Proteção Financeira',
  'health-insurance': 'Planos de Saúde',
  'social-security': 'Previdenciário',
  'ceo': 'CEO Agent',
  'cmo': 'CMO Agent',
  'coo': 'COO Agent',
  'cfo': 'CFO Agent',
  'content': 'Content Agent',
  'social': 'Social Media Agent',
  'ads': 'Ads Agent',
  'seo': 'SEO Agent',
  'video': 'Video Agent',
  'design': 'Design Agent',
  'qa': 'Quality Assurance Agent',
  'admin': 'Admin Agent',
  'pricing': 'Pricing Agent',
  'market-intel': 'Market Intelligence Agent',
}

const EXAMPLE_PROMPTS: Record<string, string[]> = {
  'real-estate': [
    'Estou comprando um apartamento usado. Quais documentos devo exigir do vendedor?',
    'Meu vizinho está construindo e invadiu meu terreno. O que fazer?',
    'Posso pedir usucapião de um imóvel que ocupo há 10 anos?',
  ],
  'criminal': [
    'Fui acusado de furto mas sou inocente. Como me defender?',
    'Qual a diferença entre furto e roubo? As penas são diferentes?',
    'Meu filho foi preso em flagrante. Quais são os próximos passos?',
  ],
  'ceo': [
    'Nossa conversão caiu 15% este mês. Quais ações tomar?',
    'Devemos investir R$ 50k em marketing ou contratar mais advogados?',
    'Recebemos proposta de investimento de R$ 2M. Vale a pena?',
  ],
  'content': [
    'Crie um artigo de blog sobre "Direitos do Consumidor em Compras Online"',
    'Escreva um guia prático sobre "Como Entrar com Ação Contra Plano de Saúde"',
    'Faça um post educativo sobre usucapião para leigos',
  ],
  'social': [
    'Crie 3 posts para Instagram sobre direito do consumidor',
    'Escreva um carrossel educativo sobre aposentadoria',
    'Faça um post viral sobre um caso jurídico interessante',
  ],
}

export default function AgentPlaygroundPage() {
  const params = useParams()
  const { toast } = useToast()
  const agentId = params.id as string
  const agentName = AGENT_NAMES[agentId] || 'Agente Desconhecido'
  const examples = EXAMPLE_PROMPTS[agentId] || []

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const startTime = Date.now()

      const response = await fetch(`/api/admin/agents/${agentId}/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          history: messages,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      const durationMs = Date.now() - startTime

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.content,
        timestamp: new Date(),
        tokensUsed: data.tokensUsed,
        durationMs,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      toast({
        title: 'Erro ao enviar mensagem',
        description: 'Não foi possível obter resposta do agente.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setMessages([])
    setInput('')
  }

  const handleUseExample = (example: string) => {
    setInput(example)
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={`Playground: ${agentName}`}
        description="Teste o agente com diferentes prompts e veja as respostas em tempo real"
        breadcrumbs={[
          { label: 'Agentes', href: '/admin/agents' },
          { label: agentName, href: `/admin/agents/${agentId}` },
          { label: 'Playground', href: `/admin/agents/${agentId}/playground` },
        ]}
        action={
          <Button asChild variant="outline">
            <Link href={`/admin/agents/${agentId}`}>
              <Settings className="h-4 w-4 mr-2" />
              Configurar
            </Link>
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Sidebar - Examples */}
        {examples.length > 0 && (
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Exemplos de Prompts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {examples.map((example, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="w-full text-left justify-start h-auto py-2 px-3"
                  onClick={() => handleUseExample(example)}
                >
                  <span className="text-xs line-clamp-3">{example}</span>
                </Button>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Main Chat */}
        <Card className={examples.length > 0 ? 'lg:col-span-3' : 'lg:col-span-4'}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Conversa</CardTitle>
            <Button variant="ghost" size="sm" onClick={handleClear} disabled={messages.length === 0}>
              <Trash2 className="h-4 w-4 mr-2" />
              Limpar
            </Button>
          </CardHeader>
          <CardContent>
            {/* Messages */}
            <div className="space-y-4 mb-4 max-h-[500px] overflow-y-auto">
              {messages.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Nenhuma mensagem ainda.</p>
                  <p className="text-sm mt-2">
                    {examples.length > 0
                      ? 'Use um dos exemplos ao lado ou digite sua própria pergunta abaixo.'
                      : 'Digite sua pergunta abaixo para começar.'}
                  </p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <Badge variant={message.role === 'user' ? 'secondary' : 'default'}>
                          {message.role === 'user' ? 'Você' : agentName}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {message.timestamp.toLocaleTimeString('pt-BR')}
                        </span>
                      </div>
                      <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                      {message.role === 'assistant' && (
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          {message.tokensUsed && <span>{message.tokensUsed} tokens</span>}
                          {message.durationMs && <span>•</span>}
                          {message.durationMs && <span>{(message.durationMs / 1000).toFixed(2)}s</span>}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}

              {loading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg p-4 bg-muted">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">
                        {agentName} está pensando...
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                placeholder="Digite sua mensagem... (Shift+Enter para nova linha, Enter para enviar)"
                rows={3}
                disabled={loading}
                className="flex-1"
              />
              <Button onClick={handleSend} disabled={loading || !input.trim()} className="self-end">
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Stats */}
            {messages.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{messages.length} mensagens</span>
                  <span>
                    Total de tokens:{' '}
                    {messages.reduce((acc, m) => acc + (m.tokensUsed || 0), 0)}
                  </span>
                  <span>
                    Tempo médio:{' '}
                    {(
                      messages
                        .filter((m) => m.role === 'assistant' && m.durationMs)
                        .reduce((acc, m) => acc + (m.durationMs || 0), 0) /
                      messages.filter((m) => m.role === 'assistant').length /
                      1000
                    ).toFixed(2)}
                    s
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
