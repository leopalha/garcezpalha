'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Key,
  Webhook,
  Link as LinkIcon,
  ExternalLink,
  Copy,
  RefreshCw,
  Loader2,
  Shield,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import Link from 'next/link'

interface IntegrationConfig {
  id: string
  name: string
  description: string
  status: 'connected' | 'disconnected' | 'error' | 'warning'
  authMethod: 'oauth' | 'api_key' | 'both'
  oauthProvider?: 'google' | 'microsoft' | 'github'
  config: {
    apiKey?: string
    webhookUrl?: string
    oauthConnected?: boolean
    oauthEmail?: string
  }
}

const INTEGRATION_CONFIGS: Record<string, Partial<IntegrationConfig>> = {
  'google-calendar': {
    name: 'Google Calendar',
    description: 'Sincronize seus agendamentos com o Google Calendar',
    authMethod: 'oauth',
    oauthProvider: 'google',
  },
  'google-gmail': {
    name: 'Gmail API',
    description: 'Envie e receba emails através do Gmail',
    authMethod: 'oauth',
    oauthProvider: 'google',
  },
  'resend': {
    name: 'Resend',
    description: 'Envio de emails transacionais',
    authMethod: 'api_key',
  },
  'whatsapp': {
    name: 'WhatsApp Business API',
    description: 'Mensagens WhatsApp via Meta Cloud API',
    authMethod: 'api_key',
  },
  'mercadopago': {
    name: 'Mercado Pago',
    description: 'Processamento de pagamentos',
    authMethod: 'api_key',
  },
  'clicksign': {
    name: 'ClickSign',
    description: 'Assinatura digital de contratos',
    authMethod: 'api_key',
  },
  'groq': {
    name: 'Groq API',
    description: 'Inferência rápida com Llama 3.3',
    authMethod: 'api_key',
  },
  'openai': {
    name: 'OpenAI API',
    description: 'GPT-4 Turbo para agentes',
    authMethod: 'api_key',
  },
}

export default function IntegrationConfigPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [config, setConfig] = useState<IntegrationConfig | null>(null)
  const [apiKey, setApiKey] = useState('')
  const [webhookUrl, setWebhookUrl] = useState('')
  const [showApiKey, setShowApiKey] = useState(false)
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null)

  useEffect(() => {
    loadConfig()
  }, [params.id])

  const loadConfig = async () => {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      const baseConfig = INTEGRATION_CONFIGS[params.id]
      if (!baseConfig) {
        toast({
          title: 'Integração não encontrada',
          variant: 'destructive',
        })
        router.push('/admin/integrations')
        return
      }

      setConfig({
        id: params.id,
        ...baseConfig,
        status: 'disconnected',
        config: {},
      } as IntegrationConfig)
    } catch (error) {
      toast({
        title: 'Erro ao carregar configuração',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthConnect = async () => {
    if (!config?.oauthProvider) return

    setSaving(true)
    try {
      // Build OAuth URL
      const callbackUrl = `${window.location.origin}/api/integrations/oauth/callback`
      const state = JSON.stringify({ integrationId: params.id, returnTo: window.location.pathname })

      let authUrl = ''
      if (config.oauthProvider === 'google') {
        const scope = encodeURIComponent([
          'https://www.googleapis.com/auth/calendar.events',
          'https://www.googleapis.com/auth/gmail.send',
          'https://www.googleapis.com/auth/userinfo.email',
        ].join(' '))

        authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
          `client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&` +
          `redirect_uri=${encodeURIComponent(callbackUrl)}&` +
          `response_type=code&` +
          `scope=${scope}&` +
          `access_type=offline&` +
          `prompt=consent&` +
          `state=${encodeURIComponent(state)}`
      }

      if (authUrl) {
        window.location.href = authUrl
      } else {
        throw new Error('Provider não suportado')
      }
    } catch (error) {
      toast({
        title: 'Erro ao iniciar OAuth',
        description: error instanceof Error ? error.message : 'Tente novamente',
        variant: 'destructive',
      })
      setSaving(false)
    }
  }

  const handleSaveApiKey = async () => {
    setSaving(true)
    try {
      await fetch(`/api/integrations/${params.id}/config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey,
          webhookUrl: webhookUrl || undefined,
        }),
      })

      toast({
        title: 'Configuração salva!',
        description: 'API Key foi configurada com sucesso.',
      })

      setConfig((prev) =>
        prev
          ? {
              ...prev,
              status: 'connected',
              config: { ...prev.config, apiKey: apiKey.substring(0, 10) + '...' },
            }
          : null
      )
    } catch (error) {
      toast({
        title: 'Erro ao salvar',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleTestConnection = async () => {
    setTesting(true)
    setTestResult(null)

    try {
      const response = await fetch(`/api/integrations/${params.id}/test`, {
        method: 'POST',
      })

      if (response.ok) {
        setTestResult('success')
        toast({
          title: 'Conexão bem-sucedida!',
          description: 'A integração está funcionando corretamente.',
        })
      } else {
        setTestResult('error')
        toast({
          title: 'Falha no teste',
          description: 'Verifique suas credenciais e tente novamente.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      setTestResult('error')
      toast({
        title: 'Erro ao testar',
        variant: 'destructive',
      })
    } finally {
      setTesting(false)
    }
  }

  const handleDisconnect = async () => {
    if (!confirm('Tem certeza que deseja desconectar esta integração?')) return

    setSaving(true)
    try {
      await fetch(`/api/integrations/${params.id}/disconnect`, {
        method: 'POST',
      })

      toast({
        title: 'Integração desconectada',
      })

      setConfig((prev) =>
        prev
          ? {
              ...prev,
              status: 'disconnected',
              config: {},
            }
          : null
      )
      setApiKey('')
      setWebhookUrl('')
    } catch (error) {
      toast({
        title: 'Erro ao desconectar',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const copyWebhookUrl = () => {
    if (webhookUrl) {
      navigator.clipboard.writeText(webhookUrl)
      toast({
        title: 'URL copiada!',
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!config) {
    return null
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/admin/integrations">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Integrações
          </Link>
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{config.name}</h1>
            <p className="text-muted-foreground mt-1">{config.description}</p>
          </div>
          <Badge
            variant={
              config.status === 'connected'
                ? 'default'
                : config.status === 'warning'
                ? 'secondary'
                : 'destructive'
            }
            className="text-sm px-3 py-1"
          >
            {config.status === 'connected' && <CheckCircle2 className="h-4 w-4 mr-1" />}
            {config.status === 'disconnected' && <XCircle className="h-4 w-4 mr-1" />}
            {config.status === 'warning' && <AlertTriangle className="h-4 w-4 mr-1" />}
            {config.status === 'connected'
              ? 'Conectado'
              : config.status === 'warning'
              ? 'Aviso'
              : 'Desconectado'}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="config" className="space-y-6">
        <TabsList>
          <TabsTrigger value="config">Configuração</TabsTrigger>
          <TabsTrigger value="test">Testar</TabsTrigger>
          <TabsTrigger value="docs">Documentação</TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="space-y-6">
          {/* OAuth Configuration */}
          {(config.authMethod === 'oauth' || config.authMethod === 'both') && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Autenticação OAuth
                </CardTitle>
                <CardDescription>
                  Conecte sua conta {config.oauthProvider === 'google' ? 'Google' : config.oauthProvider} de forma segura
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {config.config.oauthConnected ? (
                  <Alert>
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-900 dark:text-green-100">
                      <strong>Conectado</strong> - {config.config.oauthEmail}
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Button onClick={handleOAuthConnect} disabled={saving} className="w-full">
                    {saving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <LinkIcon className="h-4 w-4 mr-2" />
                    )}
                    Conectar com {config.oauthProvider === 'google' ? 'Google' : config.oauthProvider}
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* API Key Configuration */}
          {(config.authMethod === 'api_key' || config.authMethod === 'both') && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  API Key
                </CardTitle>
                <CardDescription>
                  Configure a chave de API para autenticação
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="api-key">API Key</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="api-key"
                      type={showApiKey ? 'text' : 'password'}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="sk_..."
                    />
                    <Button
                      variant="outline"
                      onClick={() => setShowApiKey(!showApiKey)}
                      size="icon"
                    >
                      {showApiKey ? '🙈' : '👁️'}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Mantenha sua API key segura. Ela nunca será exibida novamente após salvar.
                  </p>
                </div>

                <Button onClick={handleSaveApiKey} disabled={saving || !apiKey}>
                  {saving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4 mr-2" />
                  )}
                  Salvar API Key
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Webhook Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Webhook className="h-5 w-5" />
                Webhook (Opcional)
              </CardTitle>
              <CardDescription>
                Configure webhooks para receber notificações em tempo real
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="webhook-url">URL do Webhook</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="webhook-url"
                    type="url"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder={`${window.location.origin}/api/webhooks/${params.id}`}
                  />
                  <Button variant="outline" onClick={copyWebhookUrl} size="icon">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  URL sugerida: {window.location.origin}/api/webhooks/{params.id}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Disconnect */}
          {config.status === 'connected' && (
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle>Zona de Perigo</CardTitle>
                <CardDescription>
                  Ações irreversíveis relacionadas a esta integração
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleDisconnect} variant="destructive" disabled={saving}>
                  {saving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <XCircle className="h-4 w-4 mr-2" />
                  )}
                  Desconectar Integração
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="test" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Testar Conexão</CardTitle>
              <CardDescription>
                Verifique se a integração está funcionando corretamente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={handleTestConnection} disabled={testing || config.status === 'disconnected'} className="w-full">
                {testing ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Testar Conexão
              </Button>

              {testResult === 'success' && (
                <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-900 dark:text-green-100">
                    Teste bem-sucedido! A integração está funcionando corretamente.
                  </AlertDescription>
                </Alert>
              )}

              {testResult === 'error' && (
                <Alert className="border-red-500 bg-red-50 dark:bg-red-950">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-900 dark:text-red-100">
                    Falha no teste. Verifique suas credenciais e configurações.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="docs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Documentação</CardTitle>
              <CardDescription>
                Como configurar e usar esta integração
              </CardDescription>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <h3>Passo a Passo</h3>
              <ol>
                <li>
                  {config.authMethod === 'oauth'
                    ? `Clique em "Conectar com ${config.oauthProvider}" e autorize o acesso`
                    : 'Obtenha sua API key no painel do provedor'}
                </li>
                <li>Configure a API key ou autorize via OAuth</li>
                <li>Configure o webhook (opcional) para receber notificações</li>
                <li>Teste a conexão para validar a configuração</li>
              </ol>

              <h3>Links Úteis</h3>
              <ul>
                <li>
                  <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                    Documentação Oficial
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
                <li>
                  <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                    API Reference
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
