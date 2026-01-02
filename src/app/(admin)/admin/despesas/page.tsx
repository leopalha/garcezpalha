'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Filter, Download, MoreVertical, Eye, Edit, Trash2, Loader2, DollarSign, Calendar, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ErrorAlert } from '@/components/ui/error-alert'
import { EmptyState } from '@/components/ui/empty-state'
import { formatCurrency } from '@/lib/utils'

interface Expense {
  id: string
  type: string
  category: string
  description: string
  amount: number
  payment_method: string | null
  payment_status: 'pending' | 'paid' | 'cancelled'
  expense_date: string
  payment_date: string | null
  due_date: string | null
  case: { id: string; case_number: string; service_type: string } | null
  client: { id: string; full_name: string } | null
  responsible: { id: string; full_name: string } | null
  receipt_url: string | null
  notes: string | null
  is_reimbursable: boolean
  reimbursed: boolean
  created_at: string
}

const typeOptions = [
  { value: 'court_costs', label: 'Custas Processuais' },
  { value: 'travel', label: 'Viagens' },
  { value: 'office', label: 'Escritório' },
  { value: 'professional_fees', label: 'Honorários Profissionais' },
  { value: 'other', label: 'Outros' },
]

const paymentMethodOptions = [
  { value: 'cash', label: 'Dinheiro' },
  { value: 'credit_card', label: 'Cartão de Crédito' },
  { value: 'debit_card', label: 'Cartão de Débito' },
  { value: 'bank_transfer', label: 'Transferência Bancária' },
  { value: 'pix', label: 'PIX' },
]

const statusConfig = {
  pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' },
  paid: { label: 'Pago', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Cancelado', color: 'bg-gray-100 text-gray-800' },
}

export default function DespesasPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    type: '',
    category: '',
    description: '',
    amount: '',
    payment_method: '',
    payment_status: 'pending',
    expense_date: new Date().toISOString().split('T')[0],
    due_date: '',
    notes: '',
    is_reimbursable: false,
  })

  useEffect(() => {
    loadExpenses()
  }, [])

  useEffect(() => {
    filterExpenses()
  }, [searchTerm, typeFilter, statusFilter, expenses])

  async function loadExpenses() {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/admin/expenses?limit=100')

      if (!response.ok) {
        throw new Error('Erro ao carregar despesas')
      }

      const data = await response.json()
      setExpenses(data.expenses || [])
    } catch (err) {
      console.error('Error loading expenses:', err)
      setError(err instanceof Error ? err : new Error('Erro desconhecido'))
    } finally {
      setIsLoading(false)
    }
  }

  function filterExpenses() {
    let filtered = expenses

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(
        exp =>
          exp.description.toLowerCase().includes(search) ||
          exp.category.toLowerCase().includes(search) ||
          exp.case?.case_number.toLowerCase().includes(search) ||
          exp.client?.full_name.toLowerCase().includes(search)
      )
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(exp => exp.type === typeFilter)
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(exp => exp.payment_status === statusFilter)
    }

    setFilteredExpenses(filtered)
  }

  async function handleCreateExpense(e: React.FormEvent) {
    e.preventDefault()

    try {
      setIsCreating(true)

      const response = await fetch('/api/admin/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao criar despesa')
      }

      // Reset form
      setFormData({
        type: '',
        category: '',
        description: '',
        amount: '',
        payment_method: '',
        payment_status: 'pending',
        expense_date: new Date().toISOString().split('T')[0],
        due_date: '',
        notes: '',
        is_reimbursable: false,
      })

      setCreateDialogOpen(false)
      await loadExpenses()
    } catch (err) {
      console.error('Error creating expense:', err)
      setError(err instanceof Error ? err : new Error('Erro ao criar despesa'))
    } finally {
      setIsCreating(false)
    }
  }

  async function handleDeleteExpense(expenseId: string) {
    if (!confirm('Tem certeza que deseja excluir esta despesa?')) return

    try {
      const response = await fetch(`/api/admin/expenses/${expenseId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao excluir despesa')
      }

      await loadExpenses()
    } catch (err) {
      console.error('Error deleting expense:', err)
      setError(err instanceof Error ? err : new Error('Erro ao excluir despesa'))
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  // Calculate totals
  const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0)
  const totalPaid = filteredExpenses.filter(exp => exp.payment_status === 'paid').reduce((sum, exp) => sum + exp.amount, 0)
  const totalPending = filteredExpenses.filter(exp => exp.payment_status === 'pending').reduce((sum, exp) => sum + exp.amount, 0)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestão de Despesas</h1>
          <p className="text-muted-foreground mt-1">
            Controle e gerencie todas as despesas do escritório
          </p>
        </div>

        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Despesa
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Registrar Nova Despesa</DialogTitle>
              <DialogDescription>
                Preencha os dados da despesa para registro
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateExpense} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {typeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categoria *</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Ex: Combustível, Alimentação"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição *</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva a despesa"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Valor (R$) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment_method">Forma de Pagamento</Label>
                  <Select
                    value={formData.payment_method}
                    onValueChange={(value) => setFormData({ ...formData, payment_method: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethodOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expense_date">Data da Despesa *</Label>
                  <Input
                    id="expense_date"
                    type="date"
                    value={formData.expense_date}
                    onChange={(e) => setFormData({ ...formData, expense_date: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="due_date">Data de Vencimento</Label>
                  <Input
                    id="due_date"
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Informações adicionais (opcional)"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_reimbursable"
                  checked={formData.is_reimbursable}
                  onChange={(e) => setFormData({ ...formData, is_reimbursable: e.target.checked })}
                  className="h-4 w-4"
                />
                <Label htmlFor="is_reimbursable" className="text-sm font-normal">
                  Esta despesa é reembolsável (cliente pagará)
                </Label>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCreateDialogOpen(false)}
                  disabled={isCreating}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Criando...
                    </>
                  ) : (
                    'Criar Despesa'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Error Alert */}
      {error && (
        <ErrorAlert error={error.message} retry={loadExpenses} />
      )}

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
            <p className="text-xs text-muted-foreground">
              {filteredExpenses.length} {filteredExpenses.length === 1 ? 'despesa' : 'despesas'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pago</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalPaid)}</div>
            <p className="text-xs text-muted-foreground">
              Despesas já quitadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendente</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{formatCurrency(totalPending)}</div>
            <p className="text-xs text-muted-foreground">
              Aguardando pagamento
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por descrição, categoria, caso ou cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Tipos</SelectItem>
                {typeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="paid">Pago</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Expenses Table */}
      {filteredExpenses.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Nenhuma despesa encontrada"
          description="Não há despesas registradas com os filtros selecionados"
          action={
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Registrar Primeira Despesa
            </Button>
          }
        />
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Caso</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="whitespace-nowrap">
                    {formatDate(expense.expense_date)}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{expense.description}</p>
                      {expense.responsible && (
                        <p className="text-xs text-muted-foreground">
                          Por: {expense.responsible.full_name}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {typeOptions.find(t => t.value === expense.type)?.label}
                  </TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell>
                    {expense.case ? (
                      <span className="text-sm">{expense.case.case_number}</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="font-semibold">
                    {formatCurrency(expense.amount)}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusConfig[expense.payment_status].color}>
                      {statusConfig[expense.payment_status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  )
}
