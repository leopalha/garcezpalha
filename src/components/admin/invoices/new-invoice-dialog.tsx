'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { trpc } from '@/lib/trpc/client'
import { Loader2 } from 'lucide-react'

interface NewInvoiceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function NewInvoiceDialog({ open, onOpenChange, onSuccess }: NewInvoiceDialogProps) {
  const [clientId, setClientId] = useState('')
  const [invoiceNumber, setInvoiceNumber] = useState('')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0])
  const [dueDate, setDueDate] = useState('')

  const { data: clientsData, isLoading: isLoadingClients } = trpc.clients.list.useQuery({
    status: 'active',
    limit: 100,
  })

  const createMutation = trpc.invoices.create.useMutation()

  // Auto-generate invoice number suggestion
  useEffect(() => {
    if (open) {
      const year = new Date().getFullYear()
      const randomNum = Math.floor(Math.random() * 9000) + 1000
      setInvoiceNumber(`INV-${year}-${randomNum}`)

      // Set default due date to 15 days from now
      const defaultDueDate = new Date()
      defaultDueDate.setDate(defaultDueDate.getDate() + 15)
      setDueDate(defaultDueDate.toISOString().split('T')[0])
    }
  }, [open])

  const resetForm = () => {
    setClientId('')
    setAmount('')
    setDescription('')
    setIssueDate(new Date().toISOString().split('T')[0])
    setDueDate('')
  }

  const handleSubmit = async (sendToClient: boolean) => {
    if (!clientId || !invoiceNumber || !amount || !description || !issueDate || !dueDate) {
      return
    }

    try {
      await createMutation.mutateAsync({
        client_id: clientId,
        invoice_number: invoiceNumber,
        amount: parseFloat(amount),
        description,
        issue_date: issueDate,
        due_date: dueDate,
        status: sendToClient ? 'sent' : 'draft',
      })

      resetForm()
      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      console.error('Error creating invoice:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Fatura</DialogTitle>
          <DialogDescription>
            Preencha os dados para criar uma nova fatura
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="client">Cliente *</Label>
            <Select value={clientId} onValueChange={setClientId}>
              <SelectTrigger id="client">
                <SelectValue placeholder="Selecione um cliente" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingClients ? (
                  <div className="p-2 text-center text-sm text-muted-foreground">
                    Carregando clientes...
                  </div>
                ) : clientsData?.clients && clientsData.clients.length > 0 ? (
                  clientsData.clients.map((client: any) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.company_name || 'Cliente sem nome'}
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-2 text-center text-sm text-muted-foreground">
                    Nenhum cliente encontrado
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="invoice-number">Número da Fatura *</Label>
            <Input
              id="invoice-number"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              placeholder="INV-2024-001"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Valor (R$) *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição dos serviços prestados..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="issue-date">Data de Emissão *</Label>
              <Input
                id="issue-date"
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="due-date">Data de Vencimento *</Label>
              <Input
                id="due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={createMutation.isPending}
          >
            Cancelar
          </Button>
          <Button
            variant="outline"
            onClick={() => handleSubmit(false)}
            disabled={
              createMutation.isPending ||
              !clientId ||
              !invoiceNumber ||
              !amount ||
              !description ||
              !issueDate ||
              !dueDate
            }
          >
            {createMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar como Rascunho'
            )}
          </Button>
          <Button
            onClick={() => handleSubmit(true)}
            disabled={
              createMutation.isPending ||
              !clientId ||
              !invoiceNumber ||
              !amount ||
              !description ||
              !issueDate ||
              !dueDate
            }
          >
            {createMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              'Criar e Enviar'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
