'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  CreditCard,
  Bell,
  Shield,
  Save,
  CheckCircle,
} from 'lucide-react'
import { Switch } from '@/components/ui/switch'

const mockPartnerProfile = {
  name: 'João Parceiro',
  email: 'parceiro@example.com',
  phone: '(21) 99999-0000',
  document: '123.456.789-00',
  company: 'João Indicações LTDA',
  address: 'Rua das Indicações, 123',
  city: 'Rio de Janeiro',
  state: 'RJ',
  zipCode: '20000-000',
  bio: 'Especialista em indicações para serviços jurídicos com mais de 5 anos de experiência.',
  bankInfo: {
    pixKey: 'parceiro@example.com',
    pixType: 'email',
    bankName: 'Nubank',
    accountType: 'Conta Corrente',
  },
  notifications: {
    newReferralStatus: true,
    commissionPaid: true,
    marketingUpdates: false,
    monthlyReport: true,
  },
}

export default function ConfiguracoesPage() {
  const [saved, setSaved] = useState(false)
  const [profile, setProfile] = useState(mockPartnerProfile)
  const [notifications, setNotifications] = useState(mockPartnerProfile.notifications)

  const handleSave = () => {
    // In real app, this would save to database
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
          <p className="text-muted-foreground">
            Gerencie seu perfil e preferências
          </p>
        </div>
        <Button onClick={handleSave}>
          {saved ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
              Salvo!
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Salvar Alterações
            </>
          )}
        </Button>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informações Pessoais
          </CardTitle>
          <CardDescription>Seus dados de contato e identificação</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="document">CPF/CNPJ</Label>
              <Input
                id="document"
                value={profile.document}
                onChange={(e) => setProfile({ ...profile, document: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Empresa (opcional)</Label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="company"
                value={profile.company}
                onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                className="pl-9"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio / Descrição</Label>
            <Textarea
              id="bio"
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              rows={3}
              placeholder="Conte um pouco sobre você e sua experiência..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Address */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Endereço
          </CardTitle>
          <CardDescription>Seu endereço para correspondência</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Input
              id="address"
              value={profile.address}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                value={profile.city}
                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">Estado</Label>
              <Input
                id="state"
                value={profile.state}
                onChange={(e) => setProfile({ ...profile, state: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">CEP</Label>
              <Input
                id="zipCode"
                value={profile.zipCode}
                onChange={(e) => setProfile({ ...profile, zipCode: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Dados Bancários
          </CardTitle>
          <CardDescription>Configure como deseja receber suas comissões</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="pixKey">Chave PIX</Label>
              <Input
                id="pixKey"
                value={profile.bankInfo.pixKey}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    bankInfo: { ...profile.bankInfo, pixKey: e.target.value },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pixType">Tipo da Chave</Label>
              <Input
                id="pixType"
                value={profile.bankInfo.pixType}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    bankInfo: { ...profile.bankInfo, pixType: e.target.value },
                  })
                }
                placeholder="CPF, Email, Telefone ou Aleatória"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bankName">Banco</Label>
              <Input
                id="bankName"
                value={profile.bankInfo.bankName}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    bankInfo: { ...profile.bankInfo, bankName: e.target.value },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountType">Tipo de Conta</Label>
              <Input
                id="accountType"
                value={profile.bankInfo.accountType}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    bankInfo: { ...profile.bankInfo, accountType: e.target.value },
                  })
                }
              />
            </div>
          </div>
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Importante:</strong> Certifique-se de que os dados bancários estão corretos.
              Pagamentos incorretos podem demorar para serem estornados.
            </p>
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
          <CardDescription>Configure suas preferências de comunicação</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Atualização de Status</Label>
              <p className="text-sm text-muted-foreground">
                Receber email quando uma indicação mudar de status
              </p>
            </div>
            <Switch
              checked={notifications.newReferralStatus}
              onCheckedChange={(checked: boolean) =>
                setNotifications({ ...notifications, newReferralStatus: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Comissão Paga</Label>
              <p className="text-sm text-muted-foreground">
                Notificar quando uma comissão for processada
              </p>
            </div>
            <Switch
              checked={notifications.commissionPaid}
              onCheckedChange={(checked: boolean) =>
                setNotifications({ ...notifications, commissionPaid: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Atualizações de Marketing</Label>
              <p className="text-sm text-muted-foreground">
                Novidades sobre materiais e campanhas
              </p>
            </div>
            <Switch
              checked={notifications.marketingUpdates}
              onCheckedChange={(checked: boolean) =>
                setNotifications({ ...notifications, marketingUpdates: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Relatório Mensal</Label>
              <p className="text-sm text-muted-foreground">
                Resumo mensal das suas indicações e comissões
              </p>
            </div>
            <Switch
              checked={notifications.monthlyReport}
              onCheckedChange={(checked: boolean) =>
                setNotifications({ ...notifications, monthlyReport: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Segurança
          </CardTitle>
          <CardDescription>Gerencie a segurança da sua conta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full">
            Alterar Senha
          </Button>
          <Button variant="outline" className="w-full">
            Ativar Autenticação em Dois Fatores
          </Button>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              Última atividade: Hoje às 14:35 - Rio de Janeiro, RJ
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Partner Agreement */}
      <Card>
        <CardHeader>
          <CardTitle>Contrato de Parceria</CardTitle>
          <CardDescription>Documentos e termos do programa</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm">
              Você está vinculado ao contrato de parceria desde{' '}
              <strong>15 de Janeiro de 2024</strong>.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">
              Ver Contrato
            </Button>
            <Button variant="outline" className="flex-1">
              Termos de Uso
            </Button>
            <Button variant="outline" className="flex-1">
              Política de Privacidade
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg">
          {saved ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
              Salvo!
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Salvar Todas as Alterações
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
