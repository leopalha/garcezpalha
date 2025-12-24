'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  Download,
  Calendar,
  Wallet,
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type CommissionStatus = 'pending' | 'processing' | 'paid'

type Commission = {
  id: string
  referralName: string
  amount: number
  status: CommissionStatus
  createdAt: string
  processedAt: string | null
  paidAt: string | null
  paymentMethod: string | null
}

const mockCommissions: Commission[] = [
  {
    id: '1',
    referralName: 'Maria Silva',
    amount: 2500,
    status: 'pending',
    createdAt: '2024-01-20T09:00:00Z',
    processedAt: null,
    paidAt: null,
    paymentMethod: null,
  },
  {
    id: '2',
    referralName: 'Pedro Oliveira',
    amount: 3200,
    status: 'paid',
    createdAt: '2024-01-12T15:00:00Z',
    processedAt: '2024-01-14T10:00:00Z',
    paidAt: '2024-01-15T12:00:00Z',
    paymentMethod: 'PIX',
  },
  {
    id: '3',
    referralName: 'Lucas Mendes',
    amount: 1800,
    status: 'pending',
    createdAt: '2024-01-08T16:00:00Z',
    processedAt: null,
    paidAt: null,
    paymentMethod: null,
  },
  {
    id: '4',
    referralName: 'Fernanda Lima',
    amount: 4100,
    status: 'paid',
    createdAt: '2023-12-20T11:00:00Z',
    processedAt: '2023-12-22T14:00:00Z',
    paidAt: '2023-12-23T09:00:00Z',
    paymentMethod: 'Transferência Bancária',
  },
  {
    id: '5',
    referralName: 'Ricardo Alves',
    amount: 2900,
    status: 'processing',
    createdAt: '2024-01-18T10:00:00Z',
    processedAt: '2024-01-19T08:00:00Z',
    paidAt: null,
    paymentMethod: 'PIX',
  },
]

const statusConfig: Record<CommissionStatus, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  processing: { label: 'Processando', color: 'bg-blue-100 text-blue-800', icon: Wallet },
  paid: { label: 'Pago', color: 'bg-green-100 text-green-800', icon: CheckCircle },
}

export default function ComissoesPage() {
  const [periodFilter, setPeriodFilter] = useState('all')

  const totalEarnings = mockCommissions
    .filter((c) => c.status === 'paid')
    .reduce((acc, c) => acc + c.amount, 0)

  const pendingEarnings = mockCommissions
    .filter((c) => c.status === 'pending' || c.status === 'processing')
    .reduce((acc, c) => acc + c.amount, 0)

  const processingEarnings = mockCommissions
    .filter((c) => c.status === 'processing')
    .reduce((acc, c) => acc + c.amount, 0)

  const averageCommission = totalEarnings / mockCommissions.filter((c) => c.status === 'paid').length || 0

  const filteredCommissions = mockCommissions.filter(() => {
    // In a real app, filter by period
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Comissões</h2>
          <p className="text-muted-foreground">
            Acompanhe seus ganhos e solicite saques
          </p>
        </div>
        <Button>
          <DollarSign className="h-4 w-4 mr-2" />
          Solicitar Saque
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recebido</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {totalEarnings.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground">
              Total de comissões pagas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Disponível</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              R$ {pendingEarnings.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground">
              Disponível para saque
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Processamento</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              R$ {processingEarnings.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground">
              Pagamento em andamento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média por Comissão</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {averageCommission.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Valor médio recebido
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Commission History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Histórico de Comissões</CardTitle>
              <CardDescription>Todas as suas comissões e pagamentos</CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={periodFilter} onValueChange={setPeriodFilter}>
                <SelectTrigger className="w-[180px]">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todo o período</SelectItem>
                  <SelectItem value="month">Este mês</SelectItem>
                  <SelectItem value="quarter">Este trimestre</SelectItem>
                  <SelectItem value="year">Este ano</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCommissions.map((commission) => {
              const StatusIcon = statusConfig[commission.status].icon
              return (
                <div
                  key={commission.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{commission.referralName}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(commission.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                        statusConfig[commission.status].color
                      }`}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {statusConfig[commission.status].label}
                    </span>
                    <div className="text-right">
                      <p className="font-bold text-lg">
                        R$ {commission.amount.toLocaleString('pt-BR')}
                      </p>
                      {commission.paidAt && (
                        <p className="text-xs text-muted-foreground">
                          Pago em {new Date(commission.paidAt).toLocaleDateString('pt-BR')}
                        </p>
                      )}
                      {commission.paymentMethod && (
                        <p className="text-xs text-muted-foreground">
                          via {commission.paymentMethod}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Payment Information */}
      <Card>
        <CardHeader>
          <CardTitle>Informações de Pagamento</CardTitle>
          <CardDescription>Configure como deseja receber suas comissões</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-medium mb-2">Método de Pagamento Preferido</p>
              <p className="text-sm text-muted-foreground">PIX - Chave: email@exemplo.com</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-medium mb-2">Próximo Pagamento</p>
              <p className="text-sm text-muted-foreground">
                Dia 15 do próximo mês - R$ {pendingEarnings.toLocaleString('pt-BR')}
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-medium mb-2">Valor Mínimo para Saque</p>
              <p className="text-sm text-muted-foreground">R$ 100,00</p>
            </div>
            <Button variant="outline" className="w-full">
              Atualizar Dados Bancários
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
