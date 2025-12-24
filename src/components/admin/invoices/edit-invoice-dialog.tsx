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
import { trpc } from '@/lib/trpc/client'
import { Loader2 } from 'lucide-react'

interface Invoice {
  id: string
  invoice_number: string
  client_id?: string
  amount: number
  description: string
  issue_date: string
  due_date: string
  status: string
}

interface EditInvoiceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  invoice: Invoice | null
  onSuccess?: () => void
}

export function EditInvoiceDialog({ open, onOpenChange, invoice, onSuccess }: EditInvoiceDialogProps) {
  const [invoiceNumber, setInvoiceNumber] = useState('')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [issueDate, setIssueDate] = useState('')
  const [dueDate, setDueDate] = useState('')

  const updateMutation = trpc.invoices.update.useMutation()

  // Load invoice data when dialog opens
  useEffect(() => {
    if (open && invoice) {
      setInvoiceNumber(invoice.invoice_number)
      setAmount(invoice.amount.toString())
      setDescription(invoice.description)
      setIssueDate(invoice.issue_date.split('T')[0])
      setDueDate(invoice.due_date.split('T')[0])
    }
  }, [open, invoice])

  const handleSubmit = async () => {
    if (!invoice || !invoiceNumber || !amount || !description || !issueDate || !dueDate) {
      return
    }

    try {
      await updateMutation.mutateAsync({
        id: invoice.id,
        invoice_number: invoiceNumber,
        amount: parseFloat(amount),
        description,
        issue_date: issueDate,
        due_date: dueDate,
      })

      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      console.error('Error updating invoice:', error)
    }
  }

  if (!invoice) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Fatura</DialogTitle>
          <DialogDescription>
            Atualize os dados da fatura {invoice.invoice_number}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-invoice-number">Número da Fatura *</Label>
            <Input
              id="edit-invoice-number"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              placeholder="INV-2024-001"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-amount">Valor (R$) *</Label>
            <Input
              id="edit-amount"
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Descrição *</Label>
            <Textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição dos serviços prestados..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-issue-date">Data de Emissão *</Label>
              <Input
                id="edit-issue-date"
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-due-date">Data de Vencimento *</Label>
              <Input
                id="edit-due-date"
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
            disabled={updateMutation.isPending}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              updateMutation.isPending ||
              !invoiceNumber ||
              !amount ||
              !description ||
              !issueDate ||
              !dueDate
            }
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar Alterações'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
