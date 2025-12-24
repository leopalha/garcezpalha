'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RefreshCw, CheckCircle, XCircle, Smartphone, QrCode, Loader2 } from 'lucide-react'

interface ConnectionState {
  instance: {
    instanceName: string
    state: string
  }
}

export default function WhatsAppConfigPage() {
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [instanceStatus, setInstanceStatus] = useState<string>('unknown')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [pollingActive, setPollingActive] = useState(false)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const API_URL = process.env.NEXT_PUBLIC_EVOLUTION_API_URL || 'https://unique-delight-production-affb.up.railway.app'
  const API_KEY = process.env.NEXT_PUBLIC_EVOLUTION_API_KEY || 'garcezpalha-evolution-api-key-2025'
  const INSTANCE_NAME = 'garcezpalha-session'

  const fetchInstanceStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/instance/connectionState/${INSTANCE_NAME}`, {
        headers: {
          'apikey': API_KEY,
        },
      })

      if (response.ok) {
        const data: ConnectionState = await response.json()
        const state = data.instance?.state || 'unknown'
        setInstanceStatus(state)

        // Stop polling if connected
        if (state === 'open' && pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current)
          setPollingActive(false)
          setQrCode(null)
        }

        return state
      }
    } catch (err) {
      console.error('Error fetching instance status:', err)
    }
    return 'unknown'
  }

  const pollForQRCode = async () => {
    try {
      const response = await fetch(`${API_URL}/instance/connect/${INSTANCE_NAME}`, {
        method: 'GET',
        headers: {
          'apikey': API_KEY,
        },
      })

      if (response.ok) {
        const data = await response.json()

        if (data.base64) {
          const base64String = data.base64.startsWith('data:') ? data.base64 : `data:image/png;base64,${data.base64}`
          setQrCode(base64String)
          setLastUpdate(new Date())
          setError(null)
        } else if (data.code) {
          // Generate QR from code
          const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(data.code)}`
          setQrCode(qrUrl)
          setLastUpdate(new Date())
          setError(null)
        } else if (data.pairingCode) {
          setError(`Código de pareamento: ${data.pairingCode}`)
        }
      }
    } catch (err) {
      console.error('Error polling QR code:', err)
    }
  }

  const startQRCodeGeneration = async () => {
    setLoading(true)
    setError(null)
    setQrCode(null)

    try {
      // First, check if instance exists and its state
      const status = await fetchInstanceStatus()

      if (status === 'open') {
        setError('WhatsApp já está conectado!')
        setLoading(false)
        return
      }

      // If instance is closed, we need to connect it
      if (status === 'close') {
        // Try to connect
        const connectResponse = await fetch(`${API_URL}/instance/connect/${INSTANCE_NAME}`, {
          method: 'GET',
          headers: {
            'apikey': API_KEY,
          },
        })

        if (connectResponse.ok) {
          const data = await connectResponse.json()
          console.log('Connect response:', data)
        }
      }

      // Start polling for QR code
      setPollingActive(true)

      // Poll immediately
      await pollForQRCode()

      // Then poll every 3 seconds
      pollingIntervalRef.current = setInterval(async () => {
        await pollForQRCode()
        await fetchInstanceStatus()
      }, 3000)

    } catch (err) {
      console.error('Error starting QR generation:', err)
      setError('Erro ao conectar com a API Evolution. Verifique os logs.')
    } finally {
      setLoading(false)
    }
  }

  const stopQRCodeGeneration = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
      pollingIntervalRef.current = null
    }
    setPollingActive(false)
    setQrCode(null)
    setError(null)
  }

  const disconnectInstance = async () => {
    setLoading(true)
    stopQRCodeGeneration()

    try {
      await fetch(`${API_URL}/instance/logout/${INSTANCE_NAME}`, {
        method: 'DELETE',
        headers: {
          'apikey': API_KEY,
        },
      })
      setInstanceStatus('close')
      await fetchInstanceStatus()
    } catch (err) {
      console.error('Error disconnecting:', err)
      setError('Erro ao desconectar')
    } finally {
      setLoading(false)
    }
  }

  const deleteAndRecreateInstance = async () => {
    setLoading(true)
    stopQRCodeGeneration()
    setError(null)

    try {
      // Delete instance
      await fetch(`${API_URL}/instance/delete/${INSTANCE_NAME}`, {
        method: 'DELETE',
        headers: {
          'apikey': API_KEY,
        },
      })

      // Wait a moment
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Recreate instance
      const createResponse = await fetch(`${API_URL}/instance/create`, {
        method: 'POST',
        headers: {
          'apikey': API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          instanceName: INSTANCE_NAME,
          qrcode: true,
          integration: 'WHATSAPP-BAILEYS',
        }),
      })

      if (createResponse.ok) {
        const data = await createResponse.json()
        console.log('Instance created:', data)
        setError('Instância recriada com sucesso! Clique em "Gerar QR Code"')
        await fetchInstanceStatus()
      } else {
        const errorData = await createResponse.json()
        setError(`Erro ao recriar instância: ${JSON.stringify(errorData)}`)
      }
    } catch (err) {
      console.error('Error recreating instance:', err)
      setError('Erro ao recriar instância')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInstanceStatus()
    const interval = setInterval(fetchInstanceStatus, 10000)

    return () => {
      clearInterval(interval)
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }
    }
  }, [])

  const getStatusBadge = () => {
    switch (instanceStatus) {
      case 'open':
        return <Badge className="bg-green-500"><CheckCircle className="w-4 h-4 mr-1" /> Conectado</Badge>
      case 'connecting':
        return <Badge className="bg-yellow-500"><RefreshCw className="w-4 h-4 mr-1 animate-spin" /> Conectando</Badge>
      case 'close':
        return <Badge className="bg-red-500"><XCircle className="w-4 h-4 mr-1" /> Desconectado</Badge>
      default:
        return <Badge className="bg-gray-500">Status Desconhecido</Badge>
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Configuração WhatsApp</h1>
        <p className="text-muted-foreground">
          Configure a integração do WhatsApp Business com a Evolution API
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
              Instância: {INSTANCE_NAME}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Status:</span>
              {getStatusBadge()}
            </div>

            <div className="flex items-center justify-between">
              <span className="font-medium">API:</span>
              <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                Evolution v2.2.3
              </span>
            </div>

            <div className="flex flex-col gap-2 pt-4">
              <Button
                onClick={fetchInstanceStatus}
                variant="outline"
                size="sm"
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Atualizar Status
              </Button>

              {instanceStatus === 'open' && (
                <Button
                  onClick={disconnectInstance}
                  variant="destructive"
                  size="sm"
                  disabled={loading}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Desconectar
                </Button>
              )}

              <Button
                onClick={deleteAndRecreateInstance}
                variant="secondary"
                size="sm"
                disabled={loading}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reiniciar Instância
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* QR Code Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5" />
              QR Code para Conexão
            </CardTitle>
            <CardDescription>
              Escaneie com o WhatsApp para conectar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {instanceStatus === 'open' ? (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <p className="font-medium text-green-600">WhatsApp Conectado!</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Sua instância está ativa e pronta para uso.
                </p>
              </div>
            ) : (
              <>
                {qrCode ? (
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
                    {pollingActive && (
                      <div className="flex items-center justify-center gap-2 mt-3 text-sm text-blue-600">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Atualizando QR Code automaticamente...
                      </div>
                    )}
                    <p className="text-sm mt-4 px-4">
                      Abra o WhatsApp no seu celular, vá em <strong>Configurações → Dispositivos Conectados</strong> e escaneie este QR Code.
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    {pollingActive ? (
                      <>
                        <Loader2 className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-spin" />
                        <p className="text-blue-600 font-medium">Gerando QR Code...</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Aguarde alguns segundos
                        </p>
                      </>
                    ) : (
                      <>
                        <QrCode className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">
                          Clique no botão abaixo para gerar o QR Code
                        </p>
                      </>
                    )}
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md text-sm">
                    {error}
                  </div>
                )}

                <div className="flex gap-2">
                  {!pollingActive ? (
                    <Button
                      onClick={startQRCodeGeneration}
                      className="flex-1"
                      disabled={loading || instanceStatus === 'open'}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Iniciando...
                        </>
                      ) : (
                        <>
                          <QrCode className="w-4 h-4 mr-2" />
                          Gerar QR Code
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      onClick={stopQRCodeGeneration}
                      variant="outline"
                      className="flex-1"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Parar
                    </Button>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Instructions Card */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Como Conectar</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
            <li>Certifique-se de que a instância está com status <strong>Desconectado</strong></li>
            <li>Clique em <strong>Gerar QR Code</strong> e aguarde o QR aparecer</li>
            <li>Abra o WhatsApp no seu celular</li>
            <li>Toque em <strong>Menu (⋮)</strong> ou <strong>Configurações</strong></li>
            <li>Selecione <strong>Dispositivos Conectados</strong></li>
            <li>Toque em <strong>Conectar um Dispositivo</strong></li>
            <li>Aponte a câmera para o QR Code na tela</li>
            <li>Aguarde a conexão ser estabelecida (o status mudará para <strong>Conectado</strong>)</li>
          </ol>

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Dica:</strong> O QR Code é atualizado automaticamente a cada 3 segundos. Se não aparecer, tente clicar em "Reiniciar Instância" primeiro.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
