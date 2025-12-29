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
import { Loader2 } from 'lucide-react'
import { trpc } from '@/lib/trpc/client'
import { toast } from '@/components/ui/use-toast'
import { formatPhone, formatCpfCnpj, formatCep } from '@/lib/formatting/br-formats'

interface EditClientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  client: {
    id: string
    full_name: string
    email: string
    phone: string
    company_name: string | null
    cpf_cnpj: string | null
    address: string | null
    city: string | null
    state: string | null
    zip_code: string | null
    status: 'active' | 'inactive' | 'archived'
  } | null
  onSuccess?: () => void
}

const estadosBR = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
]

const statusOptions = [
  { value: 'active', label: 'Ativo' },
  { value: 'inactive', label: 'Inativo' },
  { value: 'archived', label: 'Arquivado' },
]

export function EditClientDialog({
  open,
  onOpenChange,
  client,
  onSuccess,
}: EditClientDialogProps) {
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
    status: 'active' as 'active' | 'inactive' | 'archived',
  })

  // Update form when client changes
  useEffect(() => {
    if (client) {
      setFormData({
        full_name: client.full_name || '',
        email: client.email || '',
        phone: client.phone || '',
        company_name: client.company_name || '',
        cpf_cnpj: client.cpf_cnpj || '',
        address: client.address || '',
        city: client.city || '',
        state: client.state || '',
        zip_code: client.zip_code || '',
        status: client.status,
      })
    }
  }, [client])

  const utils = trpc.useUtils()
  const updateClient = trpc.clients.update.useMutation({
    onSuccess: () => {
      toast({
        title: 'Cliente atualizado com sucesso',
        description: 'As alterações foram salvas.',
      })
      utils.clients.list.invalidate()
      onSuccess?.()
      onOpenChange(false)
    },
    onError: (error) => {
      toast({
        title: 'Erro ao atualizar cliente',
        description: error.message || 'Ocorreu um erro ao atualizar o cliente.',
        variant: 'destructive',
      })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!client) return

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

    updateClient.mutate({
      id: client.id,
      company_name: finalCompanyName || undefined,
      cpf_cnpj: formData.cpf_cnpj || undefined,
      address: formData.address || undefined,
      city: formData.city || undefined,
      state: formData.state || undefined,
      zip_code: formData.zip_code || undefined,
      status: formData.status,
    })
  }

  if (!client) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Cliente</DialogTitle>
          <DialogDescription>
            Atualize os dados do cliente. Informe pelo menos o nome ou empresa.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit_full_name">Nome Completo</Label>
              <Input
                id="edit_full_name"
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
              <Label htmlFor="edit_email">Email</Label>
              <Input
                id="edit_email"
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
              <Label htmlFor="edit_phone">Telefone</Label>
              <Input
                id="edit_phone"
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
              <Label htmlFor="edit_company_name">Empresa/Nome da Empresa</Label>
              <Input
                id="edit_company_name"
                value={formData.company_name}
                onChange={(e) =>
                  setFormData({ ...formData, company_name: e.target.value })
                }
                placeholder="Empresa LTDA"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit_cpf_cnpj">CPF/CNPJ</Label>
              <Input
                id="edit_cpf_cnpj"
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
              <Label htmlFor="edit_address">Endereço</Label>
              <Input
                id="edit_address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="Rua Exemplo, 123"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit_city">Cidade</Label>
                <Input
                  id="edit_city"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  placeholder="Rio de Janeiro"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit_state">Estado</Label>
                <Select
                  value={formData.state}
                  onValueChange={(value) =>
                    setFormData({ ...formData, state: value })
                  }
                >
                  <SelectTrigger id="edit_state">
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
              <Label htmlFor="edit_zip_code">CEP</Label>
              <Input
                id="edit_zip_code"
                value={formData.zip_code}
                onChange={(e) => {
                  const formatted = formatCep(e.target.value)
                  setFormData({ ...formData, zip_code: formatted })
                }}
                placeholder="00000-000"
                maxLength={9}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit_status">
                Status <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'active' | 'inactive' | 'archived') =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger id="edit_status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateClient.isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={updateClient.isPending}>
              {updateClient.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Salvar Alterações
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
