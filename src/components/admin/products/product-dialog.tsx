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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, Plus, X } from 'lucide-react'
import { trpc } from '@/lib/trpc/client'
import { toast } from '@/components/ui/use-toast'

interface ProductDialogProps {
  product?: any | null
  open: boolean
  onClose: () => void
  onSuccess?: () => void
}

const categories = [
  { value: 'previdenciario', label: 'Previdenciário' },
  { value: 'saude', label: 'Saúde' },
  { value: 'patrimonial', label: 'Patrimonial' },
  { value: 'criminal', label: 'Criminal' },
  { value: 'financeiro', label: 'Financeiro' },
  { value: 'pericia', label: 'Perícia' },
  { value: 'automacao', label: 'Automação' },
]

export function ProductDialog({ product, open, onClose, onSuccess }: ProductDialogProps) {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    slug: '',
    category: '',
    description: '',
    hero_title: '',
    hero_subtitle: '',
    hero_problem: '',
    base_price: 0,
    features: [] as string[],
    benefits: [] as string[],
    documents_required: [] as string[],
    faq_items: [] as Array<{ question: string; answer: string }>,
    is_active: true,
  })

  const [newFeature, setNewFeature] = useState('')
  const [newBenefit, setNewBenefit] = useState('')
  const [newDocument, setNewDocument] = useState('')
  const [newFaqQuestion, setNewFaqQuestion] = useState('')
  const [newFaqAnswer, setNewFaqAnswer] = useState('')

  const utils = trpc.useUtils()
  const createMutation = trpc.products.create.useMutation({
    onSuccess: () => {
      toast({
        title: 'Produto criado',
        description: 'O produto foi criado com sucesso.',
      })
      utils.products.adminList.invalidate()
      onSuccess?.()
      handleClose()
    },
    onError: (error) => {
      toast({
        title: 'Erro ao criar produto',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  const updateMutation = trpc.products.update.useMutation({
    onSuccess: () => {
      toast({
        title: 'Produto atualizado',
        description: 'O produto foi atualizado com sucesso.',
      })
      utils.products.adminList.invalidate()
      onSuccess?.()
      handleClose()
    },
    onError: (error) => {
      toast({
        title: 'Erro ao atualizar produto',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  useEffect(() => {
    if (product) {
      setFormData({
        id: product.id || '',
        name: product.name || '',
        slug: product.slug || '',
        category: product.category || '',
        description: product.description || '',
        hero_title: product.hero_title || '',
        hero_subtitle: product.hero_subtitle || '',
        hero_problem: product.hero_problem || '',
        base_price: product.base_price || 0,
        features: product.features || [],
        benefits: product.benefits || [],
        documents_required: product.documents_required || [],
        faq_items: product.faq_items || [],
        is_active: product.is_active !== undefined ? product.is_active : true,
      })
    } else {
      setFormData({
        id: '',
        name: '',
        slug: '',
        category: '',
        description: '',
        hero_title: '',
        hero_subtitle: '',
        hero_problem: '',
        base_price: 0,
        features: [],
        benefits: [],
        documents_required: [],
        faq_items: [],
        is_active: true,
      })
    }
  }, [product])

  const handleClose = () => {
    setFormData({
      id: '',
      name: '',
      slug: '',
      category: '',
      description: '',
      hero_title: '',
      hero_subtitle: '',
      hero_problem: '',
      base_price: 0,
      features: [],
      benefits: [],
      documents_required: [],
      faq_items: [],
      is_active: true,
    })
    setNewFeature('')
    setNewBenefit('')
    setNewDocument('')
    setNewFaqQuestion('')
    setNewFaqAnswer('')
    onClose()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.slug || !formData.category) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Nome, slug e categoria são obrigatórios.',
        variant: 'destructive',
      })
      return
    }

    if (product) {
      updateMutation.mutate({
        id: product.id,
        data: {
          name: formData.name,
          slug: formData.slug,
          category: formData.category,
          description: formData.description || undefined,
          hero_title: formData.hero_title || undefined,
          hero_subtitle: formData.hero_subtitle || undefined,
          hero_problem: formData.hero_problem || undefined,
          base_price: formData.base_price,
          features: formData.features,
          benefits: formData.benefits,
          documents_required: formData.documents_required,
          faq_items: formData.faq_items,
          is_active: formData.is_active,
        },
      })
    } else {
      const id = formData.slug
      createMutation.mutate({
        id,
        name: formData.name,
        slug: formData.slug,
        category: formData.category,
        description: formData.description || undefined,
        hero_title: formData.hero_title || undefined,
        hero_subtitle: formData.hero_subtitle || undefined,
        hero_problem: formData.hero_problem || undefined,
        base_price: formData.base_price,
        features: formData.features,
        benefits: formData.benefits,
        documents_required: formData.documents_required,
        faq_items: formData.faq_items,
        is_active: formData.is_active,
      })
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

  const addBenefit = () => {
    if (newBenefit.trim()) {
      setFormData({ ...formData, benefits: [...formData.benefits, newBenefit.trim()] })
      setNewBenefit('')
    }
  }

  const removeBenefit = (index: number) => {
    setFormData({
      ...formData,
      benefits: formData.benefits.filter((_, i) => i !== index),
    })
  }

  const addDocument = () => {
    if (newDocument.trim()) {
      setFormData({
        ...formData,
        documents_required: [...formData.documents_required, newDocument.trim()],
      })
      setNewDocument('')
    }
  }

  const removeDocument = (index: number) => {
    setFormData({
      ...formData,
      documents_required: formData.documents_required.filter((_, i) => i !== index),
    })
  }

  const addFaqItem = () => {
    if (newFaqQuestion.trim() && newFaqAnswer.trim()) {
      setFormData({
        ...formData,
        faq_items: [
          ...formData.faq_items,
          { question: newFaqQuestion.trim(), answer: newFaqAnswer.trim() },
        ],
      })
      setNewFaqQuestion('')
      setNewFaqAnswer('')
    }
  }

  const removeFaqItem = (index: number) => {
    setFormData({
      ...formData,
      faq_items: formData.faq_items.filter((_, i) => i !== index),
    })
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const isPending = createMutation.isPending || updateMutation.isPending

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? 'Editar Produto' : 'Novo Produto'}</DialogTitle>
          <DialogDescription>
            {product
              ? 'Atualize as informações do produto'
              : 'Preencha os dados do novo produto'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Básico</TabsTrigger>
              <TabsTrigger value="hero">Hero</TabsTrigger>
              <TabsTrigger value="details">Detalhes</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value
                    setFormData({
                      ...formData,
                      name,
                      slug: !product ? generateSlug(name) : formData.slug,
                    })
                  }}
                  placeholder="Nome do produto"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="slug">Slug * (URL)</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: generateSlug(e.target.value) })}
                  placeholder="slug-do-produto"
                  required
                  disabled={!!product}
                />
                <p className="text-xs text-muted-foreground">
                  Gerado automaticamente. URL: /{formData.slug}
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="category">Categoria *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Breve descrição do produto"
                  rows={3}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="base_price">Preço Base (R$)</Label>
                <Input
                  id="base_price"
                  type="number"
                  value={formData.base_price / 100}
                  onChange={(e) =>
                    setFormData({ ...formData, base_price: Math.round(parseFloat(e.target.value || '0') * 100) })
                  }
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
                <p className="text-xs text-muted-foreground">
                  Preço em reais. Use os pacotes para definir preços finais.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="hero" className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="hero_title">Título Hero</Label>
                <Input
                  id="hero_title"
                  value={formData.hero_title}
                  onChange={(e) => setFormData({ ...formData, hero_title: e.target.value })}
                  placeholder="Título principal da landing page"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="hero_subtitle">Subtítulo Hero</Label>
                <Input
                  id="hero_subtitle"
                  value={formData.hero_subtitle}
                  onChange={(e) => setFormData({ ...formData, hero_subtitle: e.target.value })}
                  placeholder="Subtítulo da landing page"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="hero_problem">Problema que Resolve</Label>
                <Textarea
                  id="hero_problem"
                  value={formData.hero_problem}
                  onChange={(e) => setFormData({ ...formData, hero_problem: e.target.value })}
                  placeholder="Descreva o problema que este produto resolve"
                  rows={4}
                />
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-6">
              {/* Features */}
              <div>
                <Label>Características</Label>
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
                <div className="mt-2 space-y-2">
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

              {/* Benefits */}
              <div>
                <Label>Benefícios</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={newBenefit}
                    onChange={(e) => setNewBenefit(e.target.value)}
                    placeholder="Novo benefício"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
                  />
                  <Button type="button" onClick={addBenefit} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-2 space-y-2">
                  {formData.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <span className="flex-1">{benefit}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeBenefit(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Documents */}
              <div>
                <Label>Documentos Necessários</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={newDocument}
                    onChange={(e) => setNewDocument(e.target.value)}
                    placeholder="Novo documento"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDocument())}
                  />
                  <Button type="button" onClick={addDocument} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-2 space-y-2">
                  {formData.documents_required.map((doc, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <span className="flex-1">{doc}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeDocument(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="faq" className="space-y-4">
              <div>
                <Label>Adicionar Item FAQ</Label>
                <div className="space-y-2 mt-2">
                  <Input
                    value={newFaqQuestion}
                    onChange={(e) => setNewFaqQuestion(e.target.value)}
                    placeholder="Pergunta"
                  />
                  <Textarea
                    value={newFaqAnswer}
                    onChange={(e) => setNewFaqAnswer(e.target.value)}
                    placeholder="Resposta"
                    rows={3}
                  />
                  <Button type="button" onClick={addFaqItem} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar FAQ
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                {formData.faq_items.map((item, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium text-sm">{item.question}</p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFaqItem(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.answer}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {product ? 'Atualizar' : 'Criar'} Produto
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
