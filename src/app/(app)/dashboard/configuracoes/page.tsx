'use client'

import { useState } from 'react'
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
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSession } from 'next-auth/react'

interface UserSettings {
  name: string
  email: string
  phone: string
  timezone: string
  language: string
}

interface NotificationSettings {
  emailNewLead: boolean
  emailQualifiedLead: boolean
  emailPaymentReceived: boolean
  emailDeadline: boolean
  pushNewLead: boolean
  pushQualifiedLead: boolean
  dailyDigest: boolean
}

interface IntegrationStatus {
  name: string
  icon: React.ElementType
  connected: boolean
  description: string
}

export default function ConfiguracoesPage() {
  const { data: session } = useSession()
  const [hasChanges, setHasChanges] = useState(false)

  const [userSettings, setUserSettings] = useState<UserSettings>({
    name: session?.user?.name || 'Dr. Silva',
    email: session?.user?.email || 'silva@email.com',
    phone: '(11) 98765-4321',
    timezone: 'America/Sao_Paulo',
    language: 'pt-BR',
  })

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNewLead: true,
    emailQualifiedLead: true,
    emailPaymentReceived: true,
    emailDeadline: true,
    pushNewLead: false,
    pushQualifiedLead: true,
    dailyDigest: true,
  })

  const integrations: IntegrationStatus[] = [
    {
      name: 'Google Calendar',
      icon: Database,
      connected: true,
      description: 'Sincronização de agendamentos',
    },
    {
      name: 'MercadoPago',
      icon: CreditCard,
      connected: true,
      description: 'Processamento de pagamentos',
    },
    {
      name: 'WhatsApp Business',
      icon: Mail,
      connected: false,
      description: 'Envio de mensagens automáticas',
    },
    {
      name: 'Supabase',
      icon: Cloud,
      connected: true,
      description: 'Banco de dados e storage',
    },
  ]

  const updateUserSettings = (key: keyof UserSettings, value: string) => {
    setUserSettings((prev) => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const updateNotification = (key: keyof NotificationSettings, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const handleSave = () => {
    // Here you would save to your backend
    console.log('Saving settings:', { userSettings, notifications })
    setHasChanges(false)
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
        <Button onClick={handleSave} disabled={!hasChanges}>
          <Save className="h-4 w-4 mr-2" />
          Salvar Alterações
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
                value={userSettings.name}
                onChange={(e) => updateUserSettings('name', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={userSettings.email}
                onChange={(e) => updateUserSettings('email', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={userSettings.phone}
                onChange={(e) => updateUserSettings('phone', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Fuso Horário</Label>
              <select
                id="timezone"
                value={userSettings.timezone}
                onChange={(e) => updateUserSettings('timezone', e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="America/Sao_Paulo">Brasília (GMT-3)</option>
                <option value="America/Manaus">Manaus (GMT-4)</option>
                <option value="America/Rio_Branco">Rio Branco (GMT-5)</option>
              </select>
            </div>
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
                  <Label htmlFor="email-new-lead" className="text-base cursor-pointer">
                    Email - Novo Lead
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Receba email sempre que um novo lead entrar
                </p>
              </div>
              <Switch
                id="email-new-lead"
                checked={notifications.emailNewLead}
                onCheckedChange={(v) => updateNotification('emailNewLead', v)}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="email-qualified" className="text-base cursor-pointer">
                    Email - Lead Qualificado
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Notificação quando um lead atinge score alto (≥80%)
                </p>
              </div>
              <Switch
                id="email-qualified"
                checked={notifications.emailQualifiedLead}
                onCheckedChange={(v) => updateNotification('emailQualifiedLead', v)}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="email-payment" className="text-base cursor-pointer">
                    Email - Pagamento Recebido
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Confirmação quando um pagamento for aprovado
                </p>
              </div>
              <Switch
                id="email-payment"
                checked={notifications.emailPaymentReceived}
                onCheckedChange={(v) => updateNotification('emailPaymentReceived', v)}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="email-deadline" className="text-base cursor-pointer">
                    Email - Prazos Vencendo
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Alertas de prazos processuais próximos
                </p>
              </div>
              <Switch
                id="email-deadline"
                checked={notifications.emailDeadline}
                onCheckedChange={(v) => updateNotification('emailDeadline', v)}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="push-qualified" className="text-base cursor-pointer">
                    Push - Lead Qualificado
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Notificação push no navegador para leads quentes
                </p>
              </div>
              <Switch
                id="push-qualified"
                checked={notifications.pushQualifiedLead}
                onCheckedChange={(v) => updateNotification('pushQualifiedLead', v)}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="daily-digest" className="text-base cursor-pointer">
                    Resumo Diário
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Receba um email com o resumo do dia às 18h
                </p>
              </div>
              <Switch
                id="daily-digest"
                checked={notifications.dailyDigest}
                onCheckedChange={(v) => updateNotification('dailyDigest', v)}
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
                  Última alteração: 30 dias atrás
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
                  Adicione uma camada extra de segurança
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Ativar
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
