'use client'

import { useState } from 'react'
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
import { Loader2 } from 'lucide-react'
import { trpc } from '@/lib/trpc/client'
import { toast } from '@/components/ui/use-toast'

interface NewClientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

const estadosBR = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
]

export function NewClientDialog({ open, onOpenChange, onSuccess }: NewClientDialogProps) {
  // NOTE: full_name, email, phone are stored in the profiles table
  // This form collects them but they need to be handled separately
  // For now, we're only creating the client record with company info
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    company_name: '',
    cpf_cnpj: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
  })

  const utils = trpc.useUtils()
  const createClient = trpc.clients.create.useMutation({
    onSuccess: () => {
      toast({
        title: 'Cliente criado com sucesso',
        description: 'O cliente foi adicionado ao sistema.',
      })
      utils.clients.list.invalidate()
      onSuccess?.()
      handleClose()
    },
    onError: (error) => {
      toast({
        title: 'Erro ao criar cliente',
        description: error.message || 'Ocorreu um erro ao criar o cliente.',
        variant: 'destructive',
      })
    },
  })

  const handleClose = () => {
    setFormData({
      full_name: '',
      email: '',
      phone: '',
      company_name: '',
      cpf_cnpj: '',
      address: '',
      city: '',
      state: '',
      zip_code: '',
    })
    onOpenChange(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validação básica - nome é usado como company_name se não informado
    if (!formData.full_name.trim() && !formData.company_name.trim()) {
      toast({
        title: 'Nome ou empresa obrigatório',
        description: 'Por favor, informe o nome completo ou o nome da empresa.',
        variant: 'destructive',
      })
      return
    }

    // Use full_name as company_name if company_name is not provided
    const finalCompanyName = formData.company_name.trim() || formData.full_name.trim()

    createClient.mutate({
      company_name: finalCompanyName || undefined,
      cpf_cnpj: formData.cpf_cnpj || undefined,
      address: formData.address || undefined,
      city: formData.city || undefined,
      state: formData.state || undefined,
      zip_code: formData.zip_code || undefined,
    })
  }

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length <= 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3')
    }
    return cleaned.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3')
  }

  const formatCpfCnpj = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length <= 11) {
      // CPF
      return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4')
    }
    // CNPJ
    return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, '$1.$2.$3/$4-$5')
  }

  const formatCep = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    return cleaned.replace(/(\d{5})(\d{0,3})/, '$1-$2')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Cliente</DialogTitle>
          <DialogDescription>
            Preencha os dados do novo cliente. Informe pelo menos o nome ou empresa.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="full_name">Nome Completo</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
                placeholder="João Silva"
              />
              <p className="text-xs text-muted-foreground">
                Usado como nome da empresa se não informado abaixo
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="joao@email.com"
              />
              <p className="text-xs text-muted-foreground">Para referência futura</p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => {
                  const formatted = formatPhone(e.target.value)
                  setFormData({ ...formData, phone: formatted })
                }}
                placeholder="(21) 99999-9999"
                maxLength={15}
              />
              <p className="text-xs text-muted-foreground">Para referência futura</p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="company_name">Empresa/Nome da Empresa</Label>
              <Input
                id="company_name"
                value={formData.company_name}
                onChange={(e) =>
                  setFormData({ ...formData, company_name: e.target.value })
                }
                placeholder="Empresa LTDA"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="cpf_cnpj">CPF/CNPJ</Label>
              <Input
                id="cpf_cnpj"
                value={formData.cpf_cnpj}
                onChange={(e) => {
                  const formatted = formatCpfCnpj(e.target.value)
                  setFormData({ ...formData, cpf_cnpj: formatted })
                }}
                placeholder="000.000.000-00 ou 00.000.000/0000-00"
                maxLength={18}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="Rua Exemplo, 123"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  placeholder="Rio de Janeiro"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="state">Estado</Label>
                <Select
                  value={formData.state}
                  onValueChange={(value) =>
                    setFormData({ ...formData, state: value })
                  }
                >
                  <SelectTrigger id="state">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {estadosBR.map((estado) => (
                      <SelectItem key={estado} value={estado}>
                        {estado}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="zip_code">CEP</Label>
              <Input
                id="zip_code"
                value={formData.zip_code}
                onChange={(e) => {
                  const formatted = formatCep(e.target.value)
                  setFormData({ ...formData, zip_code: formatted })
                }}
                placeholder="00000-000"
                maxLength={9}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={createClient.isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={createClient.isPending}>
              {createClient.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Criar Cliente
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
