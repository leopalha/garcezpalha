'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Plus, Edit, Trash2, Star, X } from 'lucide-react'
import { trpc } from '@/lib/trpc/client'
import { toast } from '@/components/ui/use-toast'

interface PackagesDialogProps {
  product: any | null
  open: boolean
  onClose: () => void
  onSuccess?: () => void
}

interface PackageFormData {
  id?: string
  name: string
  description: string
  price: number
  features: string[]
  is_recommended: boolean
  order_index: number
  is_active: boolean
}

export function PackagesDialog({ product, open, onClose, onSuccess }: PackagesDialogProps) {
  const [editingPackage, setEditingPackage] = useState<PackageFormData | null>(null)
  const [formData, setFormData] = useState<PackageFormData>({
    name: '',
    description: '',
    price: 0,
    features: [],
    is_recommended: false,
    order_index: 0,
    is_active: true,
  })
  const [newFeature, setNewFeature] = useState('')

  const utils = trpc.useUtils()
  const { data: packages, isLoading } = trpc.products.getPackages.useQuery(
    { productId: product?.id || '' },
    { enabled: !!product?.id }
  )

  const createMutation = trpc.products.createPackage.useMutation({
    onSuccess: () => {
      toast({
        title: 'Pacote criado',
        description: 'O pacote foi criado com sucesso.',
      })
      utils.products.getPackages.invalidate()
      utils.products.adminList.invalidate()
      resetForm()
      onSuccess?.()
    },
    onError: (error) => {
      toast({
        title: 'Erro ao criar pacote',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  const updateMutation = trpc.products.updatePackage.useMutation({
    onSuccess: () => {
      toast({
        title: 'Pacote atualizado',
        description: 'O pacote foi atualizado com sucesso.',
      })
      utils.products.getPackages.invalidate()
      utils.products.adminList.invalidate()
      resetForm()
      onSuccess?.()
    },
    onError: (error) => {
      toast({
        title: 'Erro ao atualizar pacote',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  const deleteMutation = trpc.products.deletePackage.useMutation({
    onSuccess: () => {
      toast({
        title: 'Pacote deletado',
        description: 'O pacote foi removido com sucesso.',
      })
      utils.products.getPackages.invalidate()
      utils.products.adminList.invalidate()
      onSuccess?.()
    },
    onError: (error) => {
      toast({
        title: 'Erro ao deletar pacote',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      features: [],
      is_recommended: false,
      order_index: packages?.length || 0,
      is_active: true,
    })
    setNewFeature('')
    setEditingPackage(null)
  }

  const handleEdit = (pkg: any) => {
    setEditingPackage(pkg)
    setFormData({
      id: pkg.id,
      name: pkg.name,
      description: pkg.description || '',
      price: pkg.price,
      features: pkg.features || [],
      is_recommended: pkg.is_recommended || false,
      order_index: pkg.order_index || 0,
      is_active: pkg.is_active !== undefined ? pkg.is_active : true,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || formData.price <= 0) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Nome e preço são obrigatórios.',
        variant: 'destructive',
      })
      return
    }

    if (editingPackage) {
      updateMutation.mutate({
        id: editingPackage.id!,
        data: {
          name: formData.name,
          description: formData.description || undefined,
          price: formData.price,
          features: formData.features,
          is_recommended: formData.is_recommended,
          order_index: formData.order_index,
          is_active: formData.is_active,
        },
      })
    } else {
      createMutation.mutate({
        product_id: product?.id || '',
        package: {
          name: formData.name,
          description: formData.description || undefined,
          price: formData.price,
          features: formData.features,
          is_recommended: formData.is_recommended,
          order_index: packages?.length || 0,
          is_active: formData.is_active,
        },
      })
    }
  }

  const handleDelete = (packageId: string) => {
    if (confirm('Tem certeza que deseja excluir este pacote?')) {
      deleteMutation.mutate({ id: packageId })
    }
  }

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({ ...formData, features: [...formData.features, newFeature.trim()] })
      setNewFeature('')
    }
  }

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price / 100)
  }

  const isPending = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gerenciar Pacotes - {product?.name}</DialogTitle>
          <DialogDescription>
            Crie e gerencie os pacotes de preços deste produto
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Form Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {editingPackage ? 'Editar Pacote' : 'Novo Pacote'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="package_name">Nome do Pacote *</Label>
                <Input
                  id="package_name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Básico, Premium, etc."
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="package_description">Descrição</Label>
                <Textarea
                  id="package_description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Breve descrição do pacote"
                  rows={2}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="package_price">Preço (R$) *</Label>
                <Input
                  id="package_price"
                  type="number"
                  value={formData.price / 100}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: Math.round(parseFloat(e.target.value || '0') * 100),
                    })
                  }
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div>
                <Label>Características do Pacote</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Nova característica"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  />
                  <Button type="button" onClick={addFeature} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <span className="flex-1">{feature}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFeature(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_recommended"
                  checked={formData.is_recommended}
                  onChange={(e) =>
                    setFormData({ ...formData, is_recommended: e.target.checked })
                  }
                  className="rounded"
                />
                <Label htmlFor="is_recommended" className="cursor-pointer">
                  Marcar como recomendado
                </Label>
              </div>

              <div className="flex gap-2">
                {editingPackage && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    disabled={isPending}
                  >
                    Cancelar Edição
                  </Button>
                )}
                <Button type="submit" disabled={isPending} className="flex-1">
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingPackage ? 'Atualizar' : 'Criar'} Pacote
                </Button>
              </div>
            </form>
          </div>

          {/* Packages List Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Pacotes Cadastrados</h3>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : packages && packages.length > 0 ? (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {packages
                  .sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0))
                  .map((pkg: any) => (
                    <Card key={pkg.id} className={editingPackage?.id === pkg.id ? 'border-primary' : ''}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-base flex items-center gap-2">
                              {pkg.name}
                              {pkg.is_recommended && (
                                <Badge variant="default" className="ml-2">
                                  <Star className="h-3 w-3 mr-1" />
                                  Recomendado
                                </Badge>
                              )}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                              {pkg.description}
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <p className="text-2xl font-bold text-primary">
                            {formatPrice(pkg.price)}
                          </p>
                          {pkg.features && pkg.features.length > 0 && (
                            <div className="space-y-1">
                              <p className="text-xs font-medium text-muted-foreground">
                                Características:
                              </p>
                              <ul className="text-sm space-y-1">
                                {pkg.features.slice(0, 3).map((feature: string, idx: number) => (
                                  <li key={idx} className="text-muted-foreground">
                                    • {feature}
                                  </li>
                                ))}
                                {pkg.features.length > 3 && (
                                  <li className="text-xs text-muted-foreground">
                                    +{pkg.features.length - 3} mais...
                                  </li>
                                )}
                              </ul>
                            </div>
                          )}
                          <div className="flex gap-2 pt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(pkg)}
                              disabled={isPending}
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Editar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(pkg.id)}
                              disabled={isPending}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Excluir
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nenhum pacote cadastrado</p>
                <p className="text-sm">Crie o primeiro pacote ao lado</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
