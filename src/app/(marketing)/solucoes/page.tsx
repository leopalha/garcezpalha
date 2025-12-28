'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Banknote, Home, Heart, FileCheck, Scale, Plane,
  Bot, Clock, ArrowRight, Sparkles, Phone, Zap,
  Lightbulb, ShoppingCart, Briefcase, GraduationCap, Building, Users
} from 'lucide-react'
import { ALL_PRODUCTS } from '@/lib/products/catalog'
import type { LucideIcon } from 'lucide-react'

// Mapeamento de categorias para ícones e metadados
const categoryMetadata: Record<string, { name: string; icon: LucideIcon; color: string; href: string }> = {
  bancario: {
    name: 'Bancário',
    icon: Banknote,
    color: 'from-blue-500 to-indigo-500',
    href: '/solucoes#bancario',
  },
  telecom: {
    name: 'Telecomunicações',
    icon: Phone,
    color: 'from-purple-500 to-pink-500',
    href: '/solucoes#telecom',
  },
  energia: {
    name: 'Energia',
    icon: Zap,
    color: 'from-yellow-500 to-orange-500',
    href: '/solucoes#energia',
  },
  consumidor: {
    name: 'Consumidor',
    icon: ShoppingCart,
    color: 'from-green-500 to-emerald-500',
    href: '/solucoes#consumidor',
  },
  digital: {
    name: 'Digital',
    icon: Lightbulb,
    color: 'from-fuchsia-500 to-violet-500',
    href: '/solucoes#digital',
  },
  aereo: {
    name: 'Aéreo',
    icon: Plane,
    color: 'from-sky-500 to-blue-500',
    href: '/solucoes#aereo',
  },
  previdenciario: {
    name: 'Previdenciário',
    icon: Users,
    color: 'from-cyan-500 to-teal-500',
    href: '/solucoes#previdenciario',
  },
  trabalhista: {
    name: 'Trabalhista',
    icon: Briefcase,
    color: 'from-orange-500 to-red-500',
    href: '/solucoes#trabalhista',
  },
  servidor: {
    name: 'Servidor Público',
    icon: Scale,
    color: 'from-indigo-500 to-purple-500',
    href: '/solucoes#servidor',
  },
  educacional: {
    name: 'Educacional',
    icon: GraduationCap,
    color: 'from-rose-500 to-pink-500',
    href: '/solucoes#educacional',
  },
  condominial: {
    name: 'Condominial',
    icon: Building,
    color: 'from-slate-500 to-gray-500',
    href: '/solucoes#condominial',
  },
  // Categorias legadas
  financeiro: {
    name: 'Proteção Financeira',
    icon: Banknote,
    color: 'from-blue-500 to-indigo-500',
    href: '/financeiro',
  },
  patrimonial: {
    name: 'Proteção Patrimonial',
    icon: Home,
    color: 'from-emerald-500 to-teal-500',
    href: '/patrimonial',
  },
  saude: {
    name: 'Proteção de Saúde',
    icon: Heart,
    color: 'from-rose-500 to-pink-500',
    href: '/saude',
  },
  pericia: {
    name: 'Perícia e Documentos',
    icon: FileCheck,
    color: 'from-amber-500 to-orange-500',
    href: '/pericia',
  },
  criminal: {
    name: 'Defesa Criminal',
    icon: Scale,
    color: 'from-violet-500 to-purple-500',
    href: '/criminal',
  },
  aeronautico: {
    name: 'Direito Aeronáutico',
    icon: Plane,
    color: 'from-sky-500 to-blue-500',
    href: '/aeronautico',
  },
  automacao: {
    name: 'Automação Jurídica',
    icon: Bot,
    color: 'from-fuchsia-500 to-pink-500',
    href: '/automacao',
  },
}

// Mapeamento de categorias antigas para novas
const categoryMapping: Record<string, string> = {
  'financeiro': 'bancario',
  'patrimonial': 'patrimonial',
  'saude': 'saude',
  'pericia': 'pericia',
  'criminal': 'criminal',
  'aeronautico': 'aeronautico',
  'automacao': 'automacao',
  'previdenciario': 'previdenciario',
}

export default function SolucoesPage() {
  // Gerar categorias dinamicamente
  const allSolutions = useMemo(() => {
    // Converter TODOS os produtos do catalog.ts para o formato da página
    const allProductsFormatted = ALL_PRODUCTS.map(product => {
      // Determinar a URL correta (legacy usa categoria antiga, novos usam nova estrutura)
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
        // Novos produtos
        href = `/solucoes/${product.category}/${product.slug}`
      }

      return {
        name: product.name,
        href,
        category: product.category,
        price: product.price.basic ? `R$ ${product.price.basic.toLocaleString('pt-BR')}` : 'Consulte',
        description: product.description,
        featured: product.priority >= 5,
      }
    })

    // Agrupar produtos por categoria
    const allProducts = allProductsFormatted

    const productsByCategory = allProducts.reduce((acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = []
      }
      acc[product.category].push(product)
      return acc
    }, {} as Record<string, typeof allProducts>)

    // Montar array final de categorias
    return Object.entries(productsByCategory)
      .map(([categoryKey, products]) => {
        const meta = categoryMetadata[categoryKey]
        if (!meta) return null

        return {
          category: meta.name,
          icon: meta.icon,
          color: meta.color,
          href: meta.href,
          products,
        }
      })
      .filter((cat): cat is NonNullable<typeof cat> => cat !== null)
      .sort((a, b) => a.category.localeCompare(b.category))
  }, [])

  // Contar totais
  const totalProducts = allSolutions.reduce((sum, cat) => sum + cat.products.length, 0)
  const totalCategories = allSolutions.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-slate-900">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 bg-grid-16 [mask-image:radial-gradient(white,transparent_85%)]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
              <Sparkles className="h-4 w-4" />
              <span className="font-semibold text-sm">{totalProducts} Soluções Jurídicas Especializadas</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Todas as Nossas Soluções
            </h1>

            <p className="text-xl text-muted-foreground mb-8">
              Escolha a solução ideal para o seu caso. Atendimento especializado
              em {totalCategories} áreas do Direito com garantia de resultado.
            </p>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="space-y-16">
            {allSolutions.map((category) => {
              const Icon = category.icon
              return (
                <div key={category.category} id={category.href.split('#')[1]}>
                  {/* Category Header */}
                  <div className="flex items-center gap-4 mb-8">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold">{category.category}</h2>
                      <p className="text-sm text-muted-foreground">
                        {category.products.length} produto{category.products.length > 1 ? 's' : ''} disponível{category.products.length > 1 ? 'is' : ''}
                      </p>
                    </div>
                  </div>

                  {/* Products Grid */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {category.products.map((product) => (
                      <Card
                        key={product.name}
                        className={`group hover:shadow-xl transition-all ${product.featured ? 'border-primary border-2 ring-2 ring-primary/20' : ''}`}
                      >
                        <CardHeader>
                          {product.featured && (
                            <div className="absolute -top-3 -right-3">
                              <span className="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                ⭐ DESTAQUE
                              </span>
                            </div>
                          )}
                          <CardTitle className="text-xl group-hover:text-primary transition-colors">
                            {product.name}
                          </CardTitle>
                          <CardDescription>{product.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-primary">
                              {product.price}
                            </span>
                          </div>
                          <Link href={product.href}>
                            <Button className="w-full group-hover:scale-105 transition-transform">
                              Ver Detalhes
                              <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Não encontrou o que procurava?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Entre em contato conosco e teremos prazer em ajudá-lo
          </p>
          <Link href="/contato">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              Falar com Especialista
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
