'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Send, Loader2, MessageCircle, ExternalLink } from 'lucide-react'

export default function TelegramTestPage() {
  const [status, setStatus] = useState<'checking' | 'active' | 'error' | 'unconfigured'>('checking')
  const [botInfo, setBotInfo] = useState<any>(null)
  const [webhookInfo, setWebhookInfo] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const [chatId, setChatId] = useState('')
  const [message, setMessage] = useState('Olá! Esta é uma mensagem de teste do bot do Garcez Palha.')
  const [sending, setSending] = useState(false)
  const [sendResult, setSendResult] = useState<any>(null)

  const [settingWebhook, setSettingWebhook] = useState(false)

  useEffect(() => {
    checkStatus()
  }, [])

  const checkStatus = async () => {
    setStatus('checking')
    setError(null)

    try {
      const response = await fetch('/api/telegram/send')
      const data = await response.json()

      if (data.configured && data.status === 'active') {
        setStatus('active')
        setBotInfo(data.bot)
        setWebhookInfo(data.webhook)
      } else if (data.configured && data.status === 'error') {
        setStatus('error')
        setError(data.error)
      } else {
        setStatus('unconfigured')
      }
    } catch (err) {
      console.error('Error checking status:', err)
      setStatus('error')
      setError('Erro ao verificar status')
    }
  }

  const setupWebhook = async () => {
    setSettingWebhook(true)
    setError(null)

    try {
      const webhookUrl = `${window.location.origin}/api/telegram/webhook`

      const response = await fetch(`https://api.telegram.org/bot${process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN || ''}/setWebhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: webhookUrl }),
      })

      const data = await response.json()

      if (data.ok) {
        alert(`Webhook configurado com sucesso!\n\nURL: ${webhookUrl}`)
        checkStatus()
      } else {
        setError(`Erro ao configurar webhook: ${data.description}`)
      }
    } catch (err) {
      console.error('Error setting webhook:', err)
      setError('Erro ao configurar webhook')
    } finally {
      setSettingWebhook(false)
    }
  }

  const sendTestMessage = async () => {
    setSending(true)
    setSendResult(null)
    setError(null)

    try {
      const response = await fetch('/api/telegram/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatId,
          text: message,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSendResult(data)
      } else {
        setError(data.error || 'Erro ao enviar mensagem')
      }
    } catch (err) {
      console.error('Error sending message:', err)
      setError('Erro ao enviar mensagem')
    } finally {
      setSending(false)
    }
  }

  const getStatusBadge = () => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500"><CheckCircle className="w-4 h-4 mr-1" /> Ativo</Badge>
      case 'error':
        return <Badge className="bg-red-500"><XCircle className="w-4 h-4 mr-1" /> Erro</Badge>
      case 'unconfigured':
        return <Badge className="bg-gray-500">Não Configurado</Badge>
      case 'checking':
        return <Badge className="bg-blue-500"><Loader2 className="w-4 h-4 mr-1 animate-spin" /> Verificando</Badge>
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Telegram Bot - Teste</h1>
        <p className="text-muted-foreground">
          Gerenciamento e teste do bot do Telegram
        </p>
      </div>

      <div className="grid gap-6">
        {/* Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Status do Bot
            </CardTitle>
            <CardDescription>
              Informações sobre o bot do Telegram
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Status:</span>
              {getStatusBadge()}
            </div>

            {botInfo && (
              <div className="border rounded-lg p-4 bg-muted/50">
                <p className="text-sm font-medium mb-2">Informações do Bot:</p>
                <div className="space-y-1 text-sm">
                  <p><span className="text-muted-foreground">Nome:</span> {botInfo.first_name}</p>
                  <p><span className="text-muted-foreground">Username:</span> @{botInfo.username}</p>
                  <p><span className="text-muted-foreground">ID:</span> {botInfo.id}</p>
                  <a
                    href={`https://t.me/${botInfo.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:underline"
                  >
                    Abrir no Telegram <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
              </div>
            )}

            {webhookInfo && (
              <div className="border rounded-lg p-4 bg-muted/50">
                <p className="text-sm font-medium mb-2">Webhook:</p>
                <div className="space-y-1 text-sm">
                  <p><span className="text-muted-foreground">URL:</span> {webhookInfo.url || 'Não configurado'}</p>
                  <p><span className="text-muted-foreground">Pendentes:</span> {webhookInfo.pending_update_count || 0}</p>
                  {webhookInfo.last_error_message && (
                    <p className="text-red-600"><span className="text-muted-foreground">Último erro:</span> {webhookInfo.last_error_message}</p>
                  )}
                </div>
              </div>
            )}

            {error && status === 'error' && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={checkStatus}
                variant="outline"
                size="sm"
                disabled={status === 'checking'}
              >
                <Loader2 className={`w-4 h-4 mr-2 ${status === 'checking' ? 'animate-spin' : ''}`} />
                Verificar Status
              </Button>

              <Button
                onClick={setupWebhook}
                variant="outline"
                size="sm"
                disabled={status !== 'active' || settingWebhook}
              >
                {settingWebhook && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Configurar Webhook
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Send Test Message Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="w-5 h-5" />
              Enviar Mensagem de Teste
            </CardTitle>
            <CardDescription>
              Envie uma mensagem para testar o bot
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Chat ID</label>
              <Input
                type="text"
                placeholder="123456789"
                value={chatId}
                onChange={(e) => setChatId(e.target.value)}
                disabled={sending}
              />
              <p className="text-xs text-muted-foreground">
                Para descobrir seu Chat ID, envie uma mensagem para o bot e verifique os logs do servidor
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Mensagem</label>
              <Textarea
                placeholder="Digite sua mensagem..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                disabled={sending}
              />
            </div>

            <Button
              onClick={sendTestMessage}
              disabled={sending || status !== 'active' || !chatId || !message}
              className="w-full"
            >
              {sending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Mensagem
                </>
              )}
            </Button>

            {sendResult && (
              <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-md text-sm space-y-2">
                <p className="font-medium flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mensagem enviada com sucesso!
                </p>
                <div className="pl-6 space-y-1 text-xs">
                  <p><span className="font-medium">Message ID:</span> {sendResult.data?.message_id}</p>
                  <p><span className="font-medium">Chat ID:</span> {sendResult.data?.chat?.id}</p>
                </div>
              </div>
            )}

            {error && status === 'active' && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md text-sm whitespace-pre-line">
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Como Usar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <h3 className="font-medium mb-2">1. Acesse o bot</h3>
                <p className="text-muted-foreground mb-2">
                  Abra o Telegram e procure por: <strong>@garcezpalha_bot</strong>
                </p>
                <a
                  href="https://t.me/garcezpalha_bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:underline"
                >
                  Abrir no Telegram <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>

              <div>
                <h3 className="font-medium mb-2">2. Teste os comandos</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li><code>/start</code> - Iniciar conversa com o bot</li>
                  <li><code>/help</code> - Ver comandos disponíveis</li>
                  <li><code>/contato</code> - Informações de contato</li>
                  <li><code>/servicos</code> - Ver serviços oferecidos</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium mb-2">3. Configure o webhook (Produção)</h3>
                <p className="text-muted-foreground mb-2">
                  Para receber mensagens em produção, você precisa configurar o webhook:
                </p>
                <div className="bg-muted p-3 rounded-md space-y-1">
                  <p><span className="font-medium">URL do Webhook:</span></p>
                  <code className="text-xs bg-background px-2 py-1 rounded">
                    https://garcezpalha.com/api/telegram/webhook
                  </code>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <p className="text-sm text-blue-800">
                  <strong>Vantagens do Telegram:</strong> Token permanente, sem expiração, fácil configuração, totalmente gratuito!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
