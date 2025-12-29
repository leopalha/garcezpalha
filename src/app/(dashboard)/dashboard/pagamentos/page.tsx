import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  CreditCard,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  DollarSign,
} from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

interface InvoiceDB {
  id: string
  notes?: string | null
  amount: number
  due_date?: string | null
  paid_at?: string | null
  status: string
  payment_method?: string | null
}

export default async function PagamentosPage() {
  const session = await getServerSession(authOptions)
  const supabase = await createClient()

  // Fetch real payments from database
  const { data: paymentsData } = await supabase
    .from('invoices')
    .select('*')
    .order('created_at', { ascending: false })

  const payments = (paymentsData || []).map((p: InvoiceDB) => ({
    id: p.id,
    description: p.notes || 'Pagamento',
    amount: p.amount,
    dueDate: p.due_date ? new Date(p.due_date).toLocaleDateString('pt-BR') : '',
    paidDate: p.paid_at ? new Date(p.paid_at).toLocaleDateString('pt-BR') : null,
    status: p.status,
    process: {
      number: 'N/A',
      title: 'Processo',
    },
    installment: null,
    method: p.payment_method,
  }))

  const summary = {
    total: payments.reduce((sum, p) => sum + p.amount, 0),
    paid: payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0),
    pending: payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
    overdue: payments.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0),
  }

  const getStatusBadge = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'paid':
        return 'default'
      case 'pending':
        return 'outline'
      case 'overdue':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4" />
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'overdue':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Pago'
      case 'pending':
        return 'Pendente'
      case 'overdue':
        return 'Vencido'
      default:
        return status
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Pagamentos
          </h2>
          <p className="text-gray-600 mt-1">
            Histórico de pagamentos e honorários
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(summary.total)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-gray-900" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pago</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {formatCurrency(summary.paid)}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendente</p>
                <p className="text-2xl font-bold text-orange-600 mt-1">
                  {formatCurrency(summary.pending)}
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Vencido</p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {formatCurrency(summary.overdue)}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payments List */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Pagamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="flex flex-col lg:flex-row lg:items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <CreditCard className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-gray-900">
                            {payment.description}
                          </h4>
                          {payment.installment && (
                            <Badge variant="outline" className="text-xs">
                              Parcela {payment.installment}
                            </Badge>
                          )}
                        </div>
                        <Link
                          href={`/dashboard/processos/${payment.process.number.split('-')[0]}`}
                          className="text-sm text-primary-600 hover:text-primary-700 mt-1 inline-block"
                        >
                          {payment.process.number} - {payment.process.title}
                        </Link>

                        <div className="flex flex-wrap gap-4 mt-2">
                          <div>
                            <p className="text-xs text-gray-500">Vencimento</p>
                            <p className="text-sm font-medium text-gray-900">
                              {payment.dueDate}
                            </p>
                          </div>
                          {payment.paidDate && (
                            <div>
                              <p className="text-xs text-gray-500">Pago em</p>
                              <p className="text-sm font-medium text-green-600">
                                {payment.paidDate}
                              </p>
                            </div>
                          )}
                          {payment.method && (
                            <div>
                              <p className="text-xs text-gray-500">Método</p>
                              <p className="text-sm font-medium text-gray-900">
                                {payment.method}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3 lg:min-w-[200px] mt-4 lg:mt-0">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(payment.amount)}
                    </p>
                  </div>

                  <Badge variant={getStatusBadge(payment.status)}>
                    {getStatusIcon(payment.status)}
                    <span className="ml-1">{getStatusText(payment.status)}</span>
                  </Badge>

                  <div className="flex gap-2">
                    {payment.status === 'pending' && (
                      <Link href={`/checkout?payment=${payment.id}`}>
                        <Button size="sm">
                          Pagar Agora
                        </Button>
                      </Link>
                    )}
                    {payment.status === 'paid' && (
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Recibo
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Formas de Pagamento Aceitas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg">
              <CreditCard className="h-6 w-6 text-primary-600" />
              <div>
                <p className="font-medium text-gray-900">Cartão de Crédito</p>
                <p className="text-sm text-gray-600">Visa, Mastercard, Elo</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg">
              <DollarSign className="h-6 w-6 text-primary-600" />
              <div>
                <p className="font-medium text-gray-900">PIX</p>
                <p className="text-sm text-gray-600">Pagamento instantâneo</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg">
              <FileText className="h-6 w-6 text-primary-600" />
              <div>
                <p className="font-medium text-gray-900">Transferência</p>
                <p className="text-sm text-gray-600">TED/DOC</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
