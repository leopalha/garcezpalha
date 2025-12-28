'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useMemo } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Banknote,
  Home,
  Heart,
  Shield,
  ArrowRight,
  ShoppingCart,
  Briefcase,
  Scale,
  FileCheck,
  Plane,
  Bot,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { ALL_PRODUCTS } from '@/lib/products/catalog'
import { CATEGORY_LABELS } from '@/lib/products/types'

// Mapeamento de categorias para ícones
const categoryIcons: Record<string, LucideIcon> = {
  bancario: Banknote,
  consumidor: ShoppingCart,
  previdenciario: Users,
  trabalhista: Briefcase,
  administrativo: Scale,
  saude: Heart,
  imobiliario: Home,
  pericia: FileCheck,
  criminal: Shield,
  aeronautico: Plane,
  automacao: Bot,
  // Legacy mappings
  financeiro: Banknote,
  patrimonial: Home,
}

// Descrições de categorias
const categoryDescriptions: Record<string, string> = {
  bancario: 'Recupere seu dinheiro e proteja suas finanças',
  consumidor: 'Defesa dos seus direitos como consumidor',
  previdenciario: 'Aposentadoria e benefícios do INSS',
  trabalhista: 'Defesa dos seus direitos trabalhistas',
  administrativo: 'Servidores públicos e questões administrativas',
  saude: 'Garanta seus direitos de saúde',
  imobiliario: 'Regularize e proteja seu patrimônio',
  pericia: 'Laudos técnicos e análise documental',
  criminal: 'Proteja seus direitos em processos criminais',
  aeronautico: 'Consultoria e compliance para empresas de aviação',
  automacao: 'Tecnologia para seu escritório',
  // Legacy
  financeiro: 'Recupere seu dinheiro e proteja suas finanças',
  patrimonial: 'Regularize e proteja seu patrimônio',
}

export function ProductsCatalog() {
  // Gerar categorias dinamicamente do catalog.ts
  const productsByCategory = useMemo(() => {
    // Filtrar TODOS os produtos ativos (sem filtro de prioridade)
    const activeProducts = ALL_PRODUCTS.filter(p => p.isActive)

    // Mapeamento de categorias legadas para novas
    const categoryMapping: Record<string, string> = {
      financeiro: 'bancario',
      patrimonial: 'imobiliario',
      telecom: 'consumidor',
      energia: 'consumidor',
      digital: 'consumidor',
      aereo: 'consumidor',
      servidor: 'administrativo',
      educacional: 'administrativo',
      condominial: 'imobiliario',
    }

    // Agrupar por categoria (normalizando legadas)
    const grouped = activeProducts.reduce((acc, product) => {
      // Normalizar categoria (converter legacy para novo padrão)
      const normalizedCategory = categoryMapping[product.category] || product.category

      if (!acc[normalizedCategory]) {
        acc[normalizedCategory] = []
      }
      acc[normalizedCategory].push(product)
      return acc
    }, {} as Record<string, typeof activeProducts>)

    // Ordenar produtos dentro de cada categoria por prioridade (maior primeiro)
    Object.values(grouped).forEach(products => {
      products.sort((a, b) => b.priority - a.priority)
    })

    // Ordem preferencial de categorias
    const categoryOrder = [
      'bancario',
      'consumidor',
      'imobiliario',
      'saude',
      'previdenciario',
      'trabalhista',
      'criminal',
      'administrativo',
      'pericia',
      'aeronautico',
      'automacao',
    ]

    // Converter para array e ordenar pela ordem preferencial
    return categoryOrder
      .filter(cat => grouped[cat] && grouped[cat].length > 0)
      .map(categoryKey => ({
        category: CATEGORY_LABELS[categoryKey as keyof typeof CATEGORY_LABELS] || categoryKey,
        categoryKey,
        icon: categoryIcons[categoryKey] || FileCheck,
        description: categoryDescriptions[categoryKey] || '',
        items: grouped[categoryKey].map(p => ({
          name: p.name,
          href: `/checkout?product=${p.slug}`,
          price: `a partir de R$ ${p.price.basic?.toLocaleString('pt-BR')}`,
        })),
      }))
  }, [])

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Qual é o seu problema?
          </h2>
          <p className="text-xl text-muted-foreground">
            Selecione a área mais próxima da sua situação para uma solução especializada
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productsByCategory.map((categoryGroup, index) => {
            const CategoryIcon = categoryGroup.icon

            return (
              <motion.div
                key={categoryGroup.categoryKey}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <CategoryIcon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="font-heading text-lg">
                      {categoryGroup.category}
                    </CardTitle>
                    <CardDescription>
                      {categoryGroup.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-[280px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent hover:scrollbar-thumb-primary/40">
                      <ul className="space-y-3">
                        {categoryGroup.items.map((item) => (
                          <li key={item.name}>
                            <Link
                              href={item.href}
                              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
                            >
                              <ArrowRight className="w-4 h-4 opacity-60 group-hover:opacity-100 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <span className="block">{item.name}</span>
                                <span className="text-xs text-primary/70 group-hover:text-primary">
                                  {item.price}
                                </span>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* CTA para ver todos os produtos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link
            href="/solucoes"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
          >
            Ver Todas as Soluções ({ALL_PRODUCTS.filter(p => p.isActive).length} produtos)
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
