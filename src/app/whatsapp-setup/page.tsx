'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RefreshCw, CheckCircle, XCircle, Smartphone, QrCode, Loader2 } from 'lucide-react'

export default function WhatsAppBaileysPage() {
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [status, setStatus] = useState<string>('disconnected')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const SESSION_ID = 'default'

  const fetchStatus = async () => {
    try {
      const response = await fetch(`/api/whatsapp/session?sessionId=${SESSION_ID}`)

      if (response.status === 404) {
        setStatus('not-created')
        return 'not-created'
      }

      if (response.ok) {
        const data = await response.json()
        setStatus(data.status)

        if (data.qrCode) {
          setQrCode(data.qrCode)
          setLastUpdate(new Date())
        } else if (data.status === 'connected') {
          setQrCode(null)
          stopPolling()
        }

        return data.status
      }
    } catch (err) {
      console.error('Error fetching status:', err)
    }
    return 'unknown'
  }

  const createSession = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/whatsapp/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId: SESSION_ID }),
      })

      if (response.ok) {
        setStatus('connecting')
        startPolling()
      } else {
        const data = await response.json()
        setError(data.error || 'Erro ao criar sessão')
      }
    } catch (err) {
      console.error('Error creating session:', err)
      setError('Erro ao criar sessão')
    } finally {
      setLoading(false)
    }
  }

  const deleteSession = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/whatsapp/session?sessionId=${SESSION_ID}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setStatus('not-created')
        setQrCode(null)
        stopPolling()
      } else {
        const data = await response.json()
        setError(data.error || 'Erro ao deletar sessão')
      }
    } catch (err) {
      console.error('Error deleting session:', err)
      setError('Erro ao deletar sessão')
    } finally {
      setLoading(false)
    }
  }

  const startPolling = () => {
    stopPolling()
    pollingIntervalRef.current = setInterval(fetchStatus, 2000)
  }

  const stopPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
      pollingIntervalRef.current = null
    }
  }

  useEffect(() => {
    fetchStatus()
    const interval = setInterval(fetchStatus, 10000)

    return () => {
      clearInterval(interval)
      stopPolling()
    }
  }, [])

  const getStatusBadge = () => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-500"><CheckCircle className="w-4 h-4 mr-1" /> Conectado</Badge>
      case 'connecting':
        return <Badge className="bg-yellow-500"><RefreshCw className="w-4 h-4 mr-1 animate-spin" /> Conectando</Badge>
      case 'disconnected':
        return <Badge className="bg-red-500"><XCircle className="w-4 h-4 mr-1" /> Desconectado</Badge>
      case 'not-created':
        return <Badge className="bg-gray-500">Não Criado</Badge>
      default:
        return <Badge className="bg-gray-500">Desconhecido</Badge>
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">WhatsApp - Baileys</h1>
        <p className="text-muted-foreground">
          Integração direta com Baileys (sem Evolution API)
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              Status da Conexão
            </CardTitle>
            <CardDescription>
              Sessão: {SESSION_ID}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Status:</span>
              {getStatusBadge()}
            </div>

            <div className="flex flex-col gap-2 pt-4">
              <Button
                onClick={fetchStatus}
                variant="outline"
                size="sm"
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Atualizar Status
              </Button>

              {status === 'not-created' && (
                <Button
                  onClick={createSession}
                  size="sm"
                  disabled={loading}
                >
                  <Smartphone className="w-4 h-4 mr-2" />
                  Criar Sessão
                </Button>
              )}

              {(status === 'connected' || status === 'disconnected' || status === 'connecting') && (
                <Button
                  onClick={deleteSession}
                  variant="destructive"
                  size="sm"
                  disabled={loading}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Deletar Sessão
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* QR Code Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5" />
              QR Code
            </CardTitle>
            <CardDescription>
              Escaneie com o WhatsApp
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {status === 'connected' ? (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <p className="font-medium text-green-600">WhatsApp Conectado!</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Pronto para enviar e receber mensagens
                </p>
              </div>
            ) : status === 'not-created' ? (
              <div className="text-center py-8">
                <Smartphone className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Clique em "Criar Sessão" para começar
                </p>
              </div>
            ) : qrCode ? (
              <div className="text-center">
                <div className="bg-white p-4 rounded-lg inline-block border-2 border-green-500">
                  <img
                    src={qrCode}
                    alt="QR Code WhatsApp"
                    className="w-64 h-64 mx-auto"
                  />
                </div>
                {lastUpdate && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Atualizado: {lastUpdate.toLocaleTimeString('pt-BR')}
                  </p>
                )}
                <p className="text-sm mt-4 px-4">
                  1. Abra o WhatsApp no celular<br />
                  2. Vá em Configurações → Dispositivos Conectados<br />
                  3. Escaneie este QR Code
                </p>
              </div>
            ) : (
              <div className="text-center py-8">
                <Loader2 className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-spin" />
                <p className="text-blue-600 font-medium">Gerando QR Code...</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Aguarde alguns segundos
                </p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md text-sm">
                {error}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Como Funciona</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
            <li>Clique em "Criar Sessão" para iniciar</li>
            <li>Aguarde o QR Code aparecer (5-10 segundos)</li>
            <li>Abra o WhatsApp no seu celular</li>
            <li>Vá em Menu → Dispositivos Conectados</li>
            <li>Escaneie o QR Code</li>
            <li>Aguarde a conexão ser estabelecida</li>
          </ol>

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Nota:</strong> Esta é uma integração direta com Baileys, sem depender da Evolution API. O QR Code é gerado localmente e funciona 100%.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
