'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Search,
  Download,
  Send,
  FileText,
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
} from 'lucide-react'
import { trpc } from '@/lib/trpc/client'
import { useToast } from '@/components/ui/use-toast'
import { NewInvoiceDialog } from '@/components/admin/invoices/new-invoice-dialog'
import { EditInvoiceDialog } from '@/components/admin/invoices/edit-invoice-dialog'
import { MarkAsPaidDialog } from '@/components/admin/invoices/mark-as-paid-dialog'

type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'

interface Invoice {
  id: string
  invoice_number: string
  client_id?: string
  amount: number
  status: InvoiceStatus
  issue_date: string
  due_date: string
  paid_date: string | null
  description: string
  payment_method: string | null
  created_at: string
  clients?: {
    company_name: string
  }
}

const statusConfig = {
  draft: { label: 'Rascunho', color: 'bg-slate-200 text-slate-800 border-slate-300', icon: FileText },
  sent: { label: 'Enviada', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Send },
  paid: { label: 'Paga', color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle2 },
  overdue: { label: 'Vencida', color: 'bg-red-100 text-red-800 border-red-200', icon: AlertCircle },
  cancelled: { label: 'Cancelada', color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle },
}

export default function FaturasPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [newInvoiceDialogOpen, setNewInvoiceDialogOpen] = useState(false)
  const [editInvoiceDialogOpen, setEditInvoiceDialogOpen] = useState(false)
  const [markAsPaidDialogOpen, setMarkAsPaidDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null)

  // Queries
  const { data: invoicesData, isLoading, refetch } = trpc.invoices.list.useQuery({
    status: statusFilter !== 'all' ? (statusFilter as InvoiceStatus) : undefined,
    limit: 100,
  })

  const { data: statsData } = trpc.invoices.stats.useQuery()

  // Mutations
  const sendMutation = trpc.invoices.send.useMutation({
    onSuccess: () => {
      toast({
        title: 'Fatura enviada',
        description: 'A fatura foi enviada com sucesso para o cliente.',
      })
      refetch()
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao enviar fatura',
        description: error.message,
      })
    },
  })

  const deleteMutation = trpc.invoices.delete.useMutation({
    onSuccess: () => {
      toast({
        title: 'Fatura excluída',
        description: 'A fatura foi excluída com sucesso.',
      })
      setDeleteDialogOpen(false)
      setInvoiceToDelete(null)
      if (selectedInvoice?.id === invoiceToDelete?.id) {
        setSelectedInvoice(null)
      }
      refetch()
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao excluir fatura',
        description: error.message,
      })
    },
  })

  const invoices = invoicesData?.invoices || []

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.clients?.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.description.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesSearch
  })

  const handleSendInvoice = async (invoiceId: string) => {
    await sendMutation.mutateAsync({ id: invoiceId })
  }

  const handleDeleteInvoice = async () => {
    if (!invoiceToDelete) return
    await deleteMutation.mutateAsync({ id: invoiceToDelete.id })
  }

  const handleSuccess = () => {
    refetch()
    toast({
      title: 'Sucesso',
      description: 'Operação realizada com sucesso.',
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Faturas</h2>
          <p className="text-muted-foreground">Gerencie todas as faturas e pagamentos</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <Button onClick={() => setNewInvoiceDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Fatura
          </Button>
        </div>
      </div>

      {/* Revenue Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Receita Total</p>
                <div className="text-2xl font-bold">
                  R$ {(statsData?.totalRevenue || 0).toLocaleString('pt-BR')}
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">A Receber</p>
                <div className="text-2xl font-bold">
                  R$ {(statsData?.pendingAmount || 0).toLocaleString('pt-BR')}
                </div>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Vencidas</p>
                <div className="text-2xl font-bold">
                  R$ {(statsData?.overdueAmount || 0).toLocaleString('pt-BR')}
                </div>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Total Faturas</p>
                <div className="text-2xl font-bold">{statsData?.totalInvoices || 0}</div>
              </div>
              <FileText className="h-8 w-8 text-slate-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por número, cliente ou descrição..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="all">Todos os Status</option>
              <option value="draft">Rascunho</option>
              <option value="sent">Enviada</option>
              <option value="paid">Paga</option>
              <option value="overdue">Vencida</option>
              <option value="cancelled">Cancelada</option>
            </select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Invoice List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Faturas ({filteredInvoices.length})</CardTitle>
              <CardDescription>Clique em uma fatura para ver detalhes</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredInvoices.map((invoice) => {
                    const statusInfo = statusConfig[invoice.status as keyof typeof statusConfig]
                    const Icon = statusInfo.icon
                    return (
                      <div
                        key={invoice.id}
                        onClick={() => setSelectedInvoice(invoice)}
                        className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                          selectedInvoice?.id === invoice.id
                            ? 'border-primary bg-primary/5'
                            : 'hover:bg-muted'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{invoice.invoice_number}</p>
                              <span
                                className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium ${
                                  statusInfo.color
                                }`}
                              >
                                <Icon className="h-3 w-3 mr-1" />
                                {statusInfo.label}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {invoice.clients?.company_name || 'Cliente não encontrado'}
                            </p>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {invoice.description}
                            </p>
                          </div>
                          <div className="text-right ml-4">
                            <p className="text-lg font-bold">R$ {invoice.amount.toLocaleString('pt-BR')}</p>
                            <p className="text-xs text-muted-foreground">
                              Venc: {new Date(invoice.due_date).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}

                  {filteredInvoices.length === 0 && !isLoading && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Nenhuma fatura encontrada</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Invoice Details */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Detalhes da Fatura</CardTitle>
              <CardDescription>
                {selectedInvoice ? selectedInvoice.invoice_number : 'Selecione uma fatura'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedInvoice ? (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg">{selectedInvoice.invoice_number}</h3>
                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium ${
                          statusConfig[selectedInvoice.status].color
                        }`}
                      >
                        {statusConfig[selectedInvoice.status].label}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {selectedInvoice.clients?.company_name || 'Cliente não encontrado'}
                    </p>
                  </div>

                  <div className="p-4 bg-primary/5 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Valor Total</p>
                    <p className="text-3xl font-bold">
                      R$ {selectedInvoice.amount.toLocaleString('pt-BR')}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium mb-1">Descrição</p>
                      <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                        {selectedInvoice.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Data de Emissão</p>
                        <p className="text-sm font-medium">
                          {new Date(selectedInvoice.issue_date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Vencimento</p>
                        <p className="text-sm font-medium">
                          {new Date(selectedInvoice.due_date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>

                    {selectedInvoice.paid_date && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Data de Pagamento</p>
                        <p className="text-sm font-medium text-green-600">
                          {new Date(selectedInvoice.paid_date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    )}

                    {selectedInvoice.payment_method && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Método de Pagamento</p>
                        <p className="text-sm font-medium">{selectedInvoice.payment_method}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 pt-4 border-t">
                    <Button className="w-full" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Baixar PDF
                    </Button>
                    {selectedInvoice.status === 'draft' && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleSendInvoice(selectedInvoice.id)}
                        disabled={sendMutation.isPending}
                      >
                        {sendMutation.isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Enviar para Cliente
                          </>
                        )}
                      </Button>
                    )}
                    {(selectedInvoice.status === 'sent' || selectedInvoice.status === 'overdue') && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setMarkAsPaidDialogOpen(true)}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Marcar como Paga
                      </Button>
                    )}
                    {selectedInvoice.status !== 'paid' && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setEditInvoiceDialogOpen(true)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={() => {
                        setInvoiceToDelete(selectedInvoice)
                        setDeleteDialogOpen(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Selecione uma fatura para ver os detalhes</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialogs */}
      <NewInvoiceDialog
        open={newInvoiceDialogOpen}
        onOpenChange={setNewInvoiceDialogOpen}
        onSuccess={handleSuccess}
      />

      <EditInvoiceDialog
        open={editInvoiceDialogOpen}
        onOpenChange={setEditInvoiceDialogOpen}
        invoice={selectedInvoice}
        onSuccess={handleSuccess}
      />

      <MarkAsPaidDialog
        open={markAsPaidDialogOpen}
        onOpenChange={setMarkAsPaidDialogOpen}
        invoice={
          selectedInvoice
            ? {
                id: selectedInvoice.id,
                invoice_number: selectedInvoice.invoice_number,
                amount: selectedInvoice.amount,
                client_name: selectedInvoice.clients?.company_name,
              }
            : null
        }
        onSuccess={handleSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir a fatura {invoiceToDelete?.invoice_number}? Esta ação
              não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteInvoice}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Excluindo...
                </>
              ) : (
                'Excluir'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
