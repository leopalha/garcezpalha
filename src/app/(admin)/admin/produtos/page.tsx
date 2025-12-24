'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  Plus,
  Package,
  Edit,
  Trash2,
  DollarSign,
  Tag,
  ToggleLeft,
  ToggleRight,
  Loader2,
  Eye,
  Copy,
} from 'lucide-react'
import { trpc } from '@/lib/trpc/client'
import { toast } from '@/components/ui/use-toast'
import { ProductDialog } from '@/components/admin/products/product-dialog'
import { PackagesDialog } from '@/components/admin/products/packages-dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

type Product = {
  id: string
  name: string
  slug: string
  category: string
  description?: string
  hero_title?: string
  hero_subtitle?: string
  hero_problem?: string
  base_price: number
  features: string[]
  benefits: string[]
  documents_required: string[]
  faq_items: Array<{ question: string; answer: string }>
  is_active: boolean
  created_at: string
  updated_at: string
  product_packages?: Array<{
    id: string
    name: string
    price: number
    is_recommended: boolean
  }>
}

const categoryColors: Record<string, string> = {
  'previdenciario': 'bg-blue-100 text-blue-800',
  'saude': 'bg-green-100 text-green-800',
  'patrimonial': 'bg-purple-100 text-purple-800',
  'criminal': 'bg-red-100 text-red-800',
  'financeiro': 'bg-yellow-100 text-yellow-800',
  'pericia': 'bg-orange-100 text-orange-800',
  'automacao': 'bg-indigo-100 text-indigo-800',
}

export default function ProdutosPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false)
  const [isPackagesDialogOpen, setIsPackagesDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<string | null>(null)

  const { data: products, isLoading, refetch } = trpc.products.adminList.useQuery()
  const deleteMutation = trpc.products.delete.useMutation()
  const updateMutation = trpc.products.update.useMutation()

  const filteredProducts = products?.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.slug.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  const handleNewProduct = () => {
    setSelectedProduct(null)
    setIsProductDialogOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setIsProductDialogOpen(true)
  }

  const handleManagePackages = (product: Product) => {
    setSelectedProduct(product)
    setIsPackagesDialogOpen(true)
  }

  const handleDeleteProduct = (productId: string) => {
    setProductToDelete(productId)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!productToDelete) return

    try {
      await deleteMutation.mutateAsync({ id: productToDelete })
      toast({
        title: 'Produto deletado',
        description: 'O produto foi removido com sucesso.',
      })
      refetch()
    } catch (error) {
      toast({
        title: 'Erro ao deletar',
        description: 'Não foi possível deletar o produto.',
        variant: 'destructive',
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setProductToDelete(null)
    }
  }

  const toggleProductStatus = async (product: Product) => {
    try {
      await updateMutation.mutateAsync({
        id: product.id,
        data: { is_active: !product.is_active },
      })
      toast({
        title: product.is_active ? 'Produto desativado' : 'Produto ativado',
        description: `O produto foi ${product.is_active ? 'desativado' : 'ativado'} com sucesso.`,
      })
      refetch()
    } catch (error) {
      toast({
        title: 'Erro ao atualizar',
        description: 'Não foi possível atualizar o status do produto.',
        variant: 'destructive',
      })
    }
  }

  const copySlugUrl = (slug: string) => {
    const url = `${window.location.origin}/${slug}`
    navigator.clipboard.writeText(url)
    toast({
      title: 'URL copiada',
      description: 'A URL da página foi copiada para a área de transferência.',
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price / 100)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Gestão de Produtos</h1>
        <p className="text-muted-foreground">
          Gerencie seus produtos e serviços jurídicos com pacotes de preços
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Produtos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Produtos Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {products?.filter((p) => p.is_active).length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Produtos Inativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {products?.filter((p) => !p.is_active).length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Pacotes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {products?.reduce((acc, p) => acc + (p.product_packages?.length || 0), 0) || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar produtos por nome, categoria ou slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={handleNewProduct} className="whitespace-nowrap">
          <Plus className="h-4 w-4 mr-2" />
          Novo Produto
        </Button>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {searchTerm ? 'Nenhum produto encontrado' : 'Nenhum produto cadastrado'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm
                ? 'Tente ajustar sua busca'
                : 'Comece criando seu primeiro produto'}
            </p>
            {!searchTerm && (
              <Button onClick={handleNewProduct}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Produto
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{product.name}</CardTitle>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge
                        variant="secondary"
                        className={categoryColors[product.category] || 'bg-gray-100 text-gray-800'}
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {product.category}
                      </Badge>
                      <Badge variant={product.is_active ? 'default' : 'secondary'}>
                        {product.is_active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleProductStatus(product)}
                    title={product.is_active ? 'Desativar' : 'Ativar'}
                  >
                    {product.is_active ? (
                      <ToggleRight className="h-5 w-5 text-green-600" />
                    ) : (
                      <ToggleLeft className="h-5 w-5 text-gray-400" />
                    )}
                  </Button>
                </div>
                <CardDescription className="line-clamp-2">
                  {product.description || 'Sem descrição'}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  {/* Slug URL */}
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground font-mono">/{product.slug}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => copySlugUrl(product.slug)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Pricing */}
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Base: <span className="font-semibold">{formatPrice(product.base_price)}</span>
                    </span>
                  </div>

                  {/* Packages Count */}
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {product.product_packages?.length || 0} pacote(s) cadastrado(s)
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditProduct(product)}
                      className="w-full"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleManagePackages(product)}
                      className="w-full"
                    >
                      <Package className="h-3 w-3 mr-1" />
                      Pacotes
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteProduct(product.id)}
                      className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
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
      )}

      {/* Dialogs */}
      <ProductDialog
        product={selectedProduct}
        open={isProductDialogOpen}
        onClose={() => {
          setIsProductDialogOpen(false)
          setSelectedProduct(null)
        }}
        onSuccess={() => {
          refetch()
          setIsProductDialogOpen(false)
          setSelectedProduct(null)
        }}
      />

      <PackagesDialog
        product={selectedProduct}
        open={isPackagesDialogOpen}
        onClose={() => {
          setIsPackagesDialogOpen(false)
          setSelectedProduct(null)
        }}
        onSuccess={() => {
          refetch()
        }}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita e todos
              os pacotes associados também serão removidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setProductToDelete(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Excluindo...
                </>
              ) : (
                'Excluir'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
