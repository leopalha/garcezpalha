'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Send, Loader2, Phone } from 'lucide-react'

export default function WhatsAppCloudTestPage() {
  const [status, setStatus] = useState<'checking' | 'active' | 'error' | 'unconfigured'>('checking')
  const [profileData, setProfileData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const [phoneNumber, setPhoneNumber] = useState('+15551802754') // Meta test number
  const [message, setMessage] = useState('Olá! Esta é uma mensagem de teste da API WhatsApp Cloud.')
  const [sending, setSending] = useState(false)
  const [sendResult, setSendResult] = useState<any>(null)

  useEffect(() => {
    checkStatus()
  }, [])

  const checkStatus = async () => {
    setStatus('checking')
    setError(null)

    try {
      const response = await fetch('/api/whatsapp-cloud/send')
      const data = await response.json()

      if (data.configured && data.status === 'active') {
        setStatus('active')
        setProfileData(data.profile)
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

  const sendTestMessage = async () => {
    setSending(true)
    setSendResult(null)
    setError(null)

    try {
      const response = await fetch('/api/whatsapp-cloud/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: phoneNumber,
          message,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSendResult(data)
      } else {
        // Show detailed error message
        let errorMsg = data.error || data.details || 'Erro ao enviar mensagem'

        // Check for specific error codes
        if (errorMsg.includes('#131030') || errorMsg.includes('not in allowed list')) {
          errorMsg = `❌ Número não está na lista permitida!\n\nO número ${phoneNumber} precisa ser adicionado na lista de números permitidos no Meta Business Manager.\n\nAcesse: https://business.facebook.com/wa/manage/phone-numbers/\nClique no seu número > Phone numbers > Add phone number`
        }

        setError(errorMsg)
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
        <h1 className="text-3xl font-bold mb-2">WhatsApp Cloud API - Teste</h1>
        <p className="text-muted-foreground">
          API oficial do Meta/Facebook WhatsApp Business
        </p>
      </div>

      <div className="grid gap-6">
        {/* Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Status da API
            </CardTitle>
            <CardDescription>
              Conexão com WhatsApp Cloud API
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Status:</span>
              {getStatusBadge()}
            </div>

            {profileData && (
              <div className="border rounded-lg p-4 bg-muted/50">
                <p className="text-sm font-medium mb-2">Perfil do Negócio:</p>
                <div className="space-y-1 text-sm">
                  {profileData.about && (
                    <p><span className="text-muted-foreground">Sobre:</span> {profileData.about}</p>
                  )}
                  {profileData.messaging_product && (
                    <p><span className="text-muted-foreground">Produto:</span> {profileData.messaging_product}</p>
                  )}
                </div>
              </div>
            )}

            {error && status === 'error' && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <Button
              onClick={checkStatus}
              variant="outline"
              size="sm"
              disabled={status === 'checking'}
            >
              <Loader2 className={`w-4 h-4 mr-2 ${status === 'checking' ? 'animate-spin' : ''}`} />
              Verificar Status
            </Button>
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
              Envie uma mensagem de teste para verificar a integração
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Número de Telefone</label>
              <Input
                type="tel"
                placeholder="+5521995354010"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={sending}
              />
              <p className="text-xs text-muted-foreground">
                Formato: +[código do país][DDD][número] (ex: +5521995354010)
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
              disabled={sending || status !== 'active' || !phoneNumber || !message}
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
                  <p><span className="font-medium">ID da Mensagem:</span> {sendResult.data?.messages?.[0]?.id}</p>
                  <p><span className="font-medium">WhatsApp ID:</span> {sendResult.data?.contacts?.[0]?.wa_id}</p>
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
            <CardTitle>Configuração no Meta Business</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <h3 className="font-medium mb-2">1. Configure o Webhook</h3>
                <p className="text-muted-foreground mb-2">
                  Para receber mensagens, configure o webhook no Meta Business Manager:
                </p>
                <div className="bg-muted p-3 rounded-md space-y-1">
                  <p><span className="font-medium">URL do Webhook:</span></p>
                  <code className="text-xs bg-background px-2 py-1 rounded">
                    https://seu-dominio.com/api/whatsapp-cloud/webhook
                  </code>
                  <p className="mt-2"><span className="font-medium">Token de Verificação:</span></p>
                  <code className="text-xs bg-background px-2 py-1 rounded">
                    garcezpalha-webhook-verify-token-2025
                  </code>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">2. Números para Teste</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Número de teste oficial: <code>+1 555 180 2754</code></li>
                  <li>Seu número pessoal: <code>+55 21 99535-4010</code> (se desconectar do WhatsApp pessoal)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium mb-2">3. Limitações do Modo Teste</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Máximo de 5 números para envio</li>
                  <li>Necessário adicionar números na interface do Meta Business</li>
                  <li>Para produção, precisa verificar o negócio no Meta</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <p className="text-sm text-blue-800">
                  <strong>Nota:</strong> Esta é a API oficial do WhatsApp Business Cloud. Mais estável e confiável que Evolution API ou Baileys.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
