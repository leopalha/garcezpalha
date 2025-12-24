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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { trpc } from '@/lib/trpc/client'
import { Loader2 } from 'lucide-react'

interface Invoice {
  id: string
  invoice_number: string
  amount: number
  client_name?: string
}

interface MarkAsPaidDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  invoice: Invoice | null
  onSuccess?: () => void
}

export function MarkAsPaidDialog({ open, onOpenChange, invoice, onSuccess }: MarkAsPaidDialogProps) {
  const [paymentMethod, setPaymentMethod] = useState('')
  const [paidDate, setPaidDate] = useState(new Date().toISOString().split('T')[0])

  const markAsPaidMutation = trpc.invoices.markAsPaid.useMutation()

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setPaymentMethod('')
      setPaidDate(new Date().toISOString().split('T')[0])
    }
  }, [open])

  const handleSubmit = async () => {
    if (!invoice || !paymentMethod || !paidDate) {
      return
    }

    try {
      await markAsPaidMutation.mutateAsync({
        id: invoice.id,
        payment_method: paymentMethod,
        paid_date: paidDate,
      })

      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      console.error('Error marking invoice as paid:', error)
    }
  }

  if (!invoice) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Marcar como Paga</DialogTitle>
          <DialogDescription>
            Confirme o pagamento da fatura {invoice.invoice_number}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="p-4 bg-primary/5 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Valor da Fatura</p>
            <p className="text-2xl font-bold">R$ {invoice.amount.toLocaleString('pt-BR')}</p>
            {invoice.client_name && (
              <p className="text-sm text-muted-foreground mt-2">{invoice.client_name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment-method">Método de Pagamento *</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger id="payment-method">
                <SelectValue placeholder="Selecione o método" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PIX">PIX</SelectItem>
                <SelectItem value="Transferência Bancária">Transferência Bancária</SelectItem>
                <SelectItem value="Cartão de Crédito">Cartão de Crédito</SelectItem>
                <SelectItem value="Cartão de Débito">Cartão de Débito</SelectItem>
                <SelectItem value="Boleto">Boleto</SelectItem>
                <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                <SelectItem value="Outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="paid-date">Data do Pagamento *</Label>
            <Input
              id="paid-date"
              type="date"
              value={paidDate}
              onChange={(e) => setPaidDate(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={markAsPaidMutation.isPending}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={markAsPaidMutation.isPending || !paymentMethod || !paidDate}
          >
            {markAsPaidMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Confirmando...
              </>
            ) : (
              'Confirmar Pagamento'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
