'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Banknote, Home, Heart, Shield, ArrowRight,
  Phone, Zap, ShoppingCart, Briefcase, GraduationCap,
  Building, Users, Scale, FileCheck, Plane, Bot,
} from 'lucide-react'
import { ALL_PRODUCTS } from '@/lib/products/catalog'
import type { LucideIcon } from 'lucide-react'

export default function SolucoesPage() {
  // Mapeamento de categorias para ícones e metadados (dentro do componente para evitar serialização)
  const categoryMetadata: Record<string, { name: string; icon: LucideIcon }> = {
    // Categorias principais
    bancario: { name: 'Direito Bancário', icon: Banknote },
    consumidor: { name: 'Direito do Consumidor', icon: ShoppingCart },
    previdenciario: { name: 'Direito Previdenciário', icon: Users },
    trabalhista: { name: 'Direito Trabalhista', icon: Briefcase },
    administrativo: { name: 'Direito Administrativo', icon: Scale },
    saude: { name: 'Direito da Saúde', icon: Heart },
    imobiliario: { name: 'Direito Imobiliário', icon: Home },
    pericia: { name: 'Perícia e Documentos', icon: FileCheck },
    criminal: { name: 'Direito Criminal', icon: Shield },
    aeronautico: { name: 'Direito Aeronáutico', icon: Plane },
    automacao: { name: 'Automação Jurídica', icon: Bot },
    // Categorias legadas (mapeamento)
    financeiro: { name: 'Direito Bancário', icon: Banknote },
    patrimonial: { name: 'Direito Imobiliário', icon: Home },
    telecom: { name: 'Direito do Consumidor', icon: ShoppingCart },
    energia: { name: 'Direito do Consumidor', icon: ShoppingCart },
    digital: { name: 'Direito do Consumidor', icon: ShoppingCart },
    aereo: { name: 'Direito do Consumidor', icon: ShoppingCart },
    servidor: { name: 'Direito Administrativo', icon: Scale },
    educacional: { name: 'Direito Administrativo', icon: Scale },
    condominial: { name: 'Direito Imobiliário', icon: Home },
  }

  // Gerar categorias dinamicamente a partir do catálogo
  const allSolutions = useMemo(() => {
    // Converter TODOS os produtos do catalog.ts
    const allProductsFormatted = ALL_PRODUCTS.map(product => {
      // Determinar a URL correta
      const isLegacy = ['financeiro', 'patrimonial', 'saude', 'pericia', 'criminal', 'aeronautico', 'automacao', 'previdenciario'].includes(product.category)

      let href = ''
      if (isLegacy && product.category === 'financeiro') {
        href = `/financeiro/${product.slug}`
      } else if (isLegacy && product.category === 'patrimonial') {
        href = `/patrimonial/${product.slug}`
      } else if (isLegacy && product.category === 'saude') {
        href = `/saude/${product.slug}`
      } else if (isLegacy && product.category === 'pericia') {
        href = `/pericia/${product.slug}`
      } else if (isLegacy && product.category === 'criminal') {
        href = `/criminal/${product.slug}`
      } else if (isLegacy && product.category === 'aeronautico') {
        href = `/aeronautico/${product.slug}`
      } else if (isLegacy && product.category === 'automacao') {
        href = `/automacao/${product.slug}`
      } else if (isLegacy && product.category === 'previdenciario') {
        href = `/previdenciario/${product.slug}`
      } else {
        href = `/solucoes/${product.category}/${product.slug}`
      }

      return {
        name: product.name,
        href,
        category: product.category,
        price: product.price.basic ? `R$ ${product.price.basic.toLocaleString('pt-BR')}` : 'Consulte',
        description: product.description,
        featured: product.priority >= 5,
        timeline: product.timeline,
      }
    })

    // Agrupar por categoria
    const productsByCategory = allProductsFormatted.reduce((acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = []
      }
      acc[product.category].push(product)
      return acc
    }, {} as Record<string, typeof allProductsFormatted>)

    // Montar array final
    return Object.entries(productsByCategory)
      .map(([categoryKey, products]) => {
        const meta = categoryMetadata[categoryKey]
        if (!meta) return null

        return {
          category: meta.name,
          icon: meta.icon,
          products,
        }
      })
      .filter((cat): cat is NonNullable<typeof cat> => cat !== null)
      .sort((a, b) => a.category.localeCompare(b.category))
  }, [])

  const totalProducts = allSolutions.reduce((sum, cat) => sum + cat.products.length, 0)

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">
            Todas as Nossas Soluções
          </h1>
          <p className="text-xl text-muted-foreground">
            Escolha a solução ideal para o seu caso. {totalProducts} produtos especializados em todas as áreas do Direito.
          </p>
        </div>

        {/* Categories */}
        <div className="space-y-16">
          {allSolutions.map((categoryGroup) => {
            const Icon = categoryGroup.icon

            return (
              <div key={categoryGroup.category} className="max-w-6xl mx-auto">
                {/* Category Header */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-display text-3xl font-bold">{categoryGroup.category}</h2>
                    <p className="text-sm text-muted-foreground">
                      {categoryGroup.products.length} solução{categoryGroup.products.length > 1 ? 'ões' : ''} disponível{categoryGroup.products.length > 1 ? 'is' : ''}
                    </p>
                  </div>
                </div>

                {/* Products Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryGroup.products.map((product) => (
                    <Card key={product.name} className="hover:shadow-lg transition-shadow group">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <CardTitle className="font-heading text-xl group-hover:text-primary transition-colors">
                            {product.name}
                          </CardTitle>
                          {product.featured && (
                            <Badge variant="secondary" className="text-xs">
                              Destaque
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="text-base">
                          {product.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-baseline justify-between">
                          <span className="text-sm text-muted-foreground">A partir de</span>
                          <span className="text-2xl font-bold text-primary">{product.price}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>Prazo: {product.timeline}</span>
                        </div>
                        <Button asChild className="w-full group-hover:scale-105 transition-transform">
                          <Link href={product.href}>
                            Ver Detalhes
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA Final */}
        <div className="max-w-2xl mx-auto text-center bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8 mt-16">
          <h3 className="font-display text-3xl font-bold mb-4">Não encontrou o que procura?</h3>
          <p className="text-muted-foreground mb-6">
            Entre em contato conosco e teremos prazer em ajudá-lo com uma solução personalizada.
          </p>
          <Button size="lg" asChild>
            <Link href="/contato">Falar com Especialista</Link>
          </Button>
          <p className="text-sm text-muted-foreground mt-4 italic">
            Atendimento especializado em todas as áreas do Direito
          </p>
        </div>
      </div>
    </div>
  )
}
