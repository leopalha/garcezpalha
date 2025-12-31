'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Settings,
  User,
  Bell,
  Lock,
  CreditCard,
  Zap,
  Mail,
  Shield,
  Key,
  Save,
  AlertCircle,
  Check,
  ExternalLink,
  Database,
  Cloud,
  Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import { useToast } from '@/components/ui/use-toast'

interface APISettings {
  profile: {
    name: string
    email: string
    phone: string
    avatar: string
    bio: string
    oab: string
    specialization: string
  }
  notifications: {
    emailNewLeads: boolean
    emailConversations: boolean
    emailPayments: boolean
    whatsappNotifications: boolean
    desktopNotifications: boolean
    weeklyReport: boolean
  }
  integrations: {
    googleCalendarConnected: boolean
    gmailConnected: boolean
    whatsappConnected: boolean
    stripeConnected: boolean
  }
  security: {
    twoFactorEnabled: boolean
    lastPasswordChange: string
  }
}

interface IntegrationStatus {
  name: string
  icon: React.ElementType
  connected: boolean
  description: string
  key: keyof APISettings['integrations']
}

export default function ConfiguracoesPage() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [settings, setSettings] = useState<APISettings | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  async function fetchSettings() {
    try {
      setLoading(true)
      const res = await fetch('/api/app/settings')
      if (!res.ok) throw new Error('Failed to fetch settings')
      const data = await res.json()
      setSettings(data)
    } catch (error) {
      console.error('Error fetching settings:', error)
      toast({
        title: 'Erro ao carregar configurações',
        description: 'Não foi possível carregar suas configurações.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const integrations: IntegrationStatus[] = [
    {
      name: 'Google Calendar',
      icon: Database,
      connected: settings?.integrations.googleCalendarConnected || false,
      description: 'Sincronização de agendamentos',
      key: 'googleCalendarConnected',
    },
    {
      name: 'Gmail',
      icon: Mail,
      connected: settings?.integrations.gmailConnected || false,
      description: 'Envio de emails',
      key: 'gmailConnected',
    },
    {
      name: 'WhatsApp Business',
      icon: Mail,
      connected: settings?.integrations.whatsappConnected || false,
      description: 'Envio de mensagens automáticas',
      key: 'whatsappConnected',
    },
    {
      name: 'Stripe/MercadoPago',
      icon: CreditCard,
      connected: settings?.integrations.stripeConnected || false,
      description: 'Processamento de pagamentos',
      key: 'stripeConnected',
    },
  ]

  const updateProfile = (key: keyof APISettings['profile'], value: string) => {
    if (!settings) return
    setSettings({
      ...settings,
      profile: { ...settings.profile, [key]: value },
    })
    setHasChanges(true)
  }

  const updateNotification = (key: keyof APISettings['notifications'], value: boolean) => {
    if (!settings) return
    setSettings({
      ...settings,
      notifications: { ...settings.notifications, [key]: value },
    })
    setHasChanges(true)
  }

  const handleSave = async () => {
    if (!settings) return

    try {
      setSaving(true)
      const res = await fetch('/api/app/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      if (!res.ok) throw new Error('Failed to save settings')

      const updated = await res.json()
      setSettings(updated)
      setHasChanges(false)

      toast({
        title: 'Configurações salvas',
        description: 'Suas configurações foram atualizadas com sucesso.',
      })
    } catch (error) {
      console.error('Error saving settings:', error)
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar as configurações.',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Não foi possível carregar as configurações</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings className="h-8 w-8 text-primary" />
            Configurações
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie suas preferências e integrações
          </p>
        </div>
        <Button onClick={handleSave} disabled={!hasChanges || saving}>
          {saving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </div>

      {hasChanges && (
        <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-600" />
          <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
            Você tem alterações não salvas
          </p>
        </div>
      )}

      {/* User Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Perfil do Usuário
          </CardTitle>
          <CardDescription>Suas informações pessoais e preferências</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                value={settings.profile.name}
                onChange={(e) => updateProfile('name', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={settings.profile.email}
                disabled
                className="bg-muted"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={settings.profile.phone}
                onChange={(e) => updateProfile('phone', e.target.value)}
                placeholder="(11) 98765-4321"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="oab">OAB</Label>
              <Input
                id="oab"
                value={settings.profile.oab}
                onChange={(e) => updateProfile('oab', e.target.value)}
                placeholder="OAB/SP 123456"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialization">Especialização</Label>
            <Input
              id="specialization"
              value={settings.profile.specialization}
              onChange={(e) => updateProfile('specialization', e.target.value)}
              placeholder="Direito Civil, Família, Trabalhista..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notificações
          </CardTitle>
          <CardDescription>Configure quando você quer ser notificado</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="email-new-leads" className="text-base cursor-pointer">
                    Email - Novos Leads
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Receba email sempre que um novo lead entrar
                </p>
              </div>
              <Switch
                id="email-new-leads"
                checked={settings.notifications.emailNewLeads}
                onCheckedChange={(v) => updateNotification('emailNewLeads', v)}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="email-conversations" className="text-base cursor-pointer">
                    Email - Conversas
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Notificações de novas conversas com leads
                </p>
              </div>
              <Switch
                id="email-conversations"
                checked={settings.notifications.emailConversations}
                onCheckedChange={(v) => updateNotification('emailConversations', v)}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="email-payments" className="text-base cursor-pointer">
                    Email - Pagamentos
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Confirmação quando um pagamento for aprovado
                </p>
              </div>
              <Switch
                id="email-payments"
                checked={settings.notifications.emailPayments}
                onCheckedChange={(v) => updateNotification('emailPayments', v)}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="whatsapp-notifications" className="text-base cursor-pointer">
                    WhatsApp - Notificações
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Receber notificações via WhatsApp
                </p>
              </div>
              <Switch
                id="whatsapp-notifications"
                checked={settings.notifications.whatsappNotifications}
                onCheckedChange={(v) => updateNotification('whatsappNotifications', v)}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="desktop-notifications" className="text-base cursor-pointer">
                    Desktop - Notificações Push
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Notificação push no navegador
                </p>
              </div>
              <Switch
                id="desktop-notifications"
                checked={settings.notifications.desktopNotifications}
                onCheckedChange={(v) => updateNotification('desktopNotifications', v)}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="weekly-report" className="text-base cursor-pointer">
                    Relatório Semanal
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Receba um email com o resumo semanal
                </p>
              </div>
              <Switch
                id="weekly-report"
                checked={settings.notifications.weeklyReport}
                onCheckedChange={(v) => updateNotification('weeklyReport', v)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Integrations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Integrações
          </CardTitle>
          <CardDescription>Conecte serviços externos à sua plataforma</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {integrations.map((integration) => {
              const Icon = integration.icon
              return (
                <div
                  key={integration.name}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'h-10 w-10 rounded-lg flex items-center justify-center',
                        integration.connected
                          ? 'bg-green-100 dark:bg-green-900/30'
                          : 'bg-gray-100 dark:bg-gray-900/30'
                      )}
                    >
                      <Icon
                        className={cn(
                          'h-5 w-5',
                          integration.connected ? 'text-green-600' : 'text-gray-600'
                        )}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{integration.name}</p>
                        {integration.connected ? (
                          <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                            <Check className="h-3 w-3 mr-1" />
                            Conectado
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            Desconectado
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{integration.description}</p>
                    </div>
                  </div>
                  <Button
                    variant={integration.connected ? 'outline' : 'default'}
                    size="sm"
                  >
                    {integration.connected ? 'Configurar' : 'Conectar'}
                  </Button>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Segurança
          </CardTitle>
          <CardDescription>Proteja sua conta e dados</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Key className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Alterar Senha</p>
                <p className="text-sm text-muted-foreground">
                  Última alteração: {settings.security.lastPasswordChange
                    ? new Date(settings.security.lastPasswordChange).toLocaleDateString('pt-BR')
                    : 'Nunca'}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Alterar
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Shield className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium">Autenticação em Dois Fatores (2FA)</p>
                <p className="text-sm text-muted-foreground">
                  {settings.security.twoFactorEnabled
                    ? 'Ativado - Sua conta está protegida'
                    : 'Adicione uma camada extra de segurança'}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              {settings.security.twoFactorEnabled ? 'Desativar' : 'Ativar'}
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Database className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Exportar Dados</p>
                <p className="text-sm text-muted-foreground">
                  Download de todos os seus dados em JSON
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="text-red-600 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Zona de Perigo
          </CardTitle>
          <CardDescription>Ações irreversíveis relacionadas à sua conta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-800 rounded-lg">
            <div>
              <p className="font-medium">Excluir Conta</p>
              <p className="text-sm text-muted-foreground">
                Exclua permanentemente sua conta e todos os dados
              </p>
            </div>
            <Button variant="destructive" size="sm">
              Excluir
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
