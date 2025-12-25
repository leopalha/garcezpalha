'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Banknote, Home, Heart, FileCheck, Scale, Plane,
  Bot, Clock, ArrowRight, Sparkles
} from 'lucide-react'

// Todas as soluções organizadas por categoria
const allSolutions = [
  {
    category: 'Proteção Financeira',
    icon: Banknote,
    color: 'from-blue-500 to-indigo-500',
    href: '/financeiro',
    products: [
      {
        name: 'Desbloqueio de Conta',
        href: '/financeiro/desbloqueio-conta',
        price: 'R$ 2.500',
        description: 'Desbloqueio judicial urgente de conta bancária'
      },
      {
        name: 'Golpe do PIX',
        href: '/financeiro/golpe-pix',
        price: 'R$ 2.500',
        description: 'Recuperação de valores perdidos em golpes',
        featured: true
      },
      {
        name: 'Negativação Indevida',
        href: '/financeiro/negativacao-indevida',
        price: 'R$ 1.800 + êxito',
        description: 'Limpar nome + indenização por danos morais'
      },
      {
        name: 'Defesa em Execução',
        href: '/financeiro/defesa-execucao',
        price: 'R$ 3.000',
        description: 'Embargos e defesa em cobranças judiciais'
      },
    ]
  },
  {
    category: 'Proteção Patrimonial',
    icon: Home,
    color: 'from-emerald-500 to-teal-500',
    href: '/patrimonial',
    products: [
      {
        name: 'Direito Imobiliário',
        href: '/patrimonial/direito-imobiliario',
        price: 'Consulta R$ 500',
        description: 'Compra, venda, regularização de imóveis'
      },
      {
        name: 'Usucapião',
        href: '/patrimonial/usucapiao',
        price: 'A partir de R$ 5.000',
        description: 'Regularização de imóveis por usucapião'
      },
      {
        name: 'Holding Familiar',
        href: '/patrimonial/holding-familiar',
        price: 'A partir de R$ 10.000',
        description: 'Proteção patrimonial e sucessão'
      },
      {
        name: 'Inventário',
        href: '/patrimonial/inventario',
        price: 'R$ 5.000 a 6.000',
        description: 'Inventário judicial ou extrajudicial'
      },
    ]
  },
  {
    category: 'Proteção de Saúde',
    icon: Heart,
    color: 'from-rose-500 to-pink-500',
    href: '/saude',
    products: [
      {
        name: 'Plano de Saúde Negou',
        href: '/saude/plano-saude-negou',
        price: 'R$ 3.500',
        description: 'Liminar em 24-72h + danos morais'
      },
      {
        name: 'Cirurgia Bariátrica',
        href: '/saude/cirurgia-bariatrica',
        price: 'R$ 3.500',
        description: 'Obrigar plano a cobrir bariátrica'
      },
      {
        name: 'Tratamento TEA',
        href: '/saude/tea',
        price: 'R$ 4.000',
        description: 'Garantir tratamento para autismo'
      },
      {
        name: 'BPC / LOAS',
        href: '/saude/bpc-loas',
        price: 'R$ 2.000 + êxito',
        description: 'Benefício assistencial (1 salário/mês)'
      },
    ]
  },
  {
    category: 'Perícia e Documentos',
    icon: FileCheck,
    color: 'from-amber-500 to-orange-500',
    href: '/pericia',
    products: [
      {
        name: 'Perícia Documental',
        href: '/pericia/pericia-documental',
        price: 'A partir de R$ 2.500',
        description: 'Análise de autenticidade de documentos'
      },
      {
        name: 'Grafotecnia',
        href: '/pericia/grafotecnia',
        price: 'A partir de R$ 3.000',
        description: 'Exame de autenticidade de assinaturas'
      },
      {
        name: 'Laudo Técnico',
        href: '/pericia/laudo-tecnico',
        price: 'A partir de R$ 2.000',
        description: 'Laudos periciais com validade judicial'
      },
    ]
  },
  {
    category: 'Defesa Criminal',
    icon: Scale,
    color: 'from-violet-500 to-purple-500',
    href: '/criminal',
    products: [
      {
        name: 'Direito Criminal',
        href: '/criminal/direito-criminal',
        price: 'A partir de R$ 5.000',
        description: 'Defesa técnica 24 horas'
      },
    ]
  },
  {
    category: 'Direito Aeronáutico',
    icon: Plane,
    color: 'from-sky-500 to-blue-500',
    href: '/aeronautico',
    products: [
      {
        name: 'Direito Aeronáutico',
        href: '/aeronautico/direito-aeronautico',
        price: 'R$ 2.000 + êxito',
        description: 'Problemas com companhias aéreas'
      },
    ]
  },
  {
    category: 'Automação Jurídica',
    icon: Bot,
    color: 'from-fuchsia-500 to-pink-500',
    href: '/automacao',
    products: [
      {
        name: 'Secretária Virtual IA',
        href: '/automacao/secretaria-remota',
        price: 'R$ 3.000 + R$ 500/mês',
        description: 'Atendimento automatizado 24/7'
      },
    ]
  },
  {
    category: 'Previdenciário',
    icon: Clock,
    color: 'from-cyan-500 to-teal-500',
    href: '/previdenciario',
    products: [
      {
        name: 'Aposentadoria',
        href: '/previdenciario/aposentadoria',
        price: 'Análise GRATUITA',
        description: 'Planejamento, concessão e revisão INSS'
      },
    ]
  },
]

export default function SolucoesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-slate-900">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 bg-grid-16 [mask-image:radial-gradient(white,transparent_85%)]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
              <Sparkles className="h-4 w-4" />
              <span className="font-semibold text-sm">19 Soluções Jurídicas Especializadas</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Todas as Nossas Soluções
            </h1>

            <p className="text-xl text-muted-foreground mb-8">
              Escolha a solução ideal para o seu caso. Atendimento especializado
              em 8 áreas do Direito com garantia de resultado.
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
                <div key={category.category}>
                  {/* Category Header */}
                  <div className="flex items-center gap-4 mb-8">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold">{category.category}</h2>
                      <Link
                        href={category.href}
                        className="text-sm text-primary hover:underline"
                      >
                        Ver todos os produtos desta categoria →
                      </Link>
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
