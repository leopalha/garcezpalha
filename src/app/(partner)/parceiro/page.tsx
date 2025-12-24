'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Users,
  DollarSign,
  TrendingUp,
  Copy,
  ExternalLink,
  CheckCircle,
  Clock,
} from 'lucide-react'
import { useState } from 'react'

// Mock partner data
const mockPartnerData = {
  partnerCode: 'PARCEIRO123',
  totalReferrals: 15,
  pendingReferrals: 3,
  convertedReferrals: 10,
  totalEarnings: 12500,
  pendingEarnings: 2500,
  commissionRate: 10,
  recentReferrals: [
    {
      id: '1',
      name: 'Maria Silva',
      status: 'converted',
      date: '2024-01-15',
      commission: 2500,
    },
    {
      id: '2',
      name: 'João Santos',
      status: 'qualified',
      date: '2024-01-14',
      commission: null,
    },
    {
      id: '3',
      name: 'Ana Costa',
      status: 'pending',
      date: '2024-01-13',
      commission: null,
    },
  ],
}

const statusConfig = {
  pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  qualified: { label: 'Qualificado', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
  converted: { label: 'Convertido', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  paid: { label: 'Pago', color: 'bg-purple-100 text-purple-800', icon: DollarSign },
}

export default function PartnerDashboard() {
  const [copied, setCopied] = useState(false)

  const referralLink = `https://garcezpalha.com?ref=${mockPartnerData.partnerCode}`

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Acompanhe suas indicações e comissões
        </p>
      </div>

      {/* Referral Link Card */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-primary">Seu Link de Indicação</CardTitle>
          <CardDescription>Compartilhe este link para ganhar comissões</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-background border rounded-lg p-3 font-mono text-sm truncate">
              {referralLink}
            </div>
            <Button onClick={copyLink} variant="outline" size="icon">
              {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="icon" asChild>
              <a href={referralLink} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Código do parceiro: <span className="font-mono font-bold">{mockPartnerData.partnerCode}</span>
          </p>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Indicações</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockPartnerData.totalReferrals}</div>
            <p className="text-xs text-muted-foreground">
              {mockPartnerData.pendingReferrals} pendentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Convertidos</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockPartnerData.convertedReferrals}</div>
            <p className="text-xs text-muted-foreground">
              Taxa: {Math.round((mockPartnerData.convertedReferrals / mockPartnerData.totalReferrals) * 100)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ganhos Totais</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {mockPartnerData.totalEarnings.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-green-600">
              +{mockPartnerData.commissionRate}% por conversão
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendente de Pagamento</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              R$ {mockPartnerData.pendingEarnings.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground">Próximo pagamento: dia 15</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Referrals */}
      <Card>
        <CardHeader>
          <CardTitle>Indicações Recentes</CardTitle>
          <CardDescription>Últimas pessoas que você indicou</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockPartnerData.recentReferrals.map((referral) => {
              const StatusIcon = statusConfig[referral.status as keyof typeof statusConfig].icon
              return (
                <div
                  key={referral.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{referral.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(referral.date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                        statusConfig[referral.status as keyof typeof statusConfig].color
                      }`}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {statusConfig[referral.status as keyof typeof statusConfig].label}
                    </span>
                    {referral.commission && (
                      <span className="font-semibold text-green-600">
                        R$ {referral.commission.toLocaleString('pt-BR')}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-4">
            <Button variant="outline" className="w-full">
              Ver Todas as Indicações
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="pt-6 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="font-medium">Nova Indicação</p>
            <p className="text-xs text-muted-foreground">Registrar manualmente</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="pt-6 text-center">
            <DollarSign className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="font-medium">Solicitar Saque</p>
            <p className="text-xs text-muted-foreground">
              R$ {mockPartnerData.pendingEarnings.toLocaleString('pt-BR')} disponível
            </p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="pt-6 text-center">
            <Copy className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="font-medium">Materiais de Marketing</p>
            <p className="text-xs text-muted-foreground">Banners e textos</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
