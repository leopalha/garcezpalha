'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Check, Shield, Clock, Award, ArrowRight, AlertTriangle,
  TrendingUp, Users, Star, Zap, FileText, Phone
} from 'lucide-react'
import {
  AgitationSection,
  SolutionSection,
  CredentialsSection,
  GuaranteeSection,
  TestimonialsSection,
  UrgencyBanner,
  WhatsAppFloat,
  SEOHead,
} from '@/components/vsl'
import type { Product } from '@/lib/products/types'
import type { LucideIcon } from 'lucide-react'

interface ProductVSLProps {
  product: Product
  heroColor?: string // Ex: 'violet', 'blue', 'green'
  heroIcon?: LucideIcon
  agitationPoints: string[]
  solutionSteps: string[]
  packages?: {
    name: string
    description: string
    price: string
    features: string[]
    highlighted?: boolean
    icon?: LucideIcon
  }[]
  stats?: {
    years?: number
    cases?: number
    successRate?: number
    clients?: number
  }
  urgencyMessage?: string
  guaranteeTitle?: string
  guaranteeDescription?: string
  customAlert?: {
    title: string
    description: string
  }
}

export function ProductVSL({
  product,
  heroColor = 'blue',
  heroIcon: HeroIcon = Shield,
  agitationPoints,
  solutionSteps,
  packages,
  stats = { years: 10, cases: 300, successRate: 85, clients: 250 },
  urgencyMessage,
  guaranteeTitle = 'Garantia de Atendimento',
  guaranteeDescription = 'Atendimento especializado com advogados experientes. Análise gratuita do seu caso.',
  customAlert,
}: ProductVSLProps) {
  const router = useRouter()

  const handleCTA = () => {
    router.push(`/checkout?product=${product.id}`)
  }

  // Default packages se não fornecidos
  const defaultPackages = packages || [
    {
      name: 'Pacote Básico',
      description: 'Atendimento completo',
      price: product.price.basic ? `R$ ${product.price.basic.toLocaleString('pt-BR')}` : 'Consulte',
      features: product.features || [
        'Análise do caso',
        'Peticionamento',
        'Acompanhamento processual',
        'Suporte jurídico',
      ],
      highlighted: true,
      icon: Shield,
    },
  ]

  return (
    <div className="min-h-screen">
      <SEOHead
        title={`${product.name} - Garcez Palha`}
        description={product.description}
        keywords={product.keywords}
        productName={product.name}
        price={product.price.basic || 0}
        category={product.category}
        canonicalUrl={`https://garcezpalha.com/${product.category}/${product.slug}`}
      />

      {urgencyMessage && (
        <UrgencyBanner
          countdown={false}
          message={urgencyMessage}
          discount={product.timeline}
          onCTA={handleCTA}
          ctaText="Falar com Advogado Agora"
        />
      )}

      <WhatsAppFloat
        phoneNumber="5511999999999"
        message={`Olá! Preciso de ajuda com: ${product.name}`}
        position="bottom-right"
        showTooltip={true}
      />

      {/* Hero Section */}
      <section className={`bg-gradient-to-br from-${heroColor}-50 to-${heroColor}-100 dark:from-${heroColor}-950/20 dark:to-${heroColor}-900/20 py-20`}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className={`inline-flex items-center gap-2 bg-${heroColor}-600 text-white px-4 py-2 rounded-full mb-6`}>
              <HeroIcon className="h-5 w-5" />
              <span className="font-semibold">{product.name}</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {product.name}<br />
              <span className={`text-${heroColor}-600`}>Solução Especializada</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8">
              {product.description}
            </p>

            {customAlert && (
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 mb-8 border-l-4 border-red-600">
                <div className="flex items-start gap-3 text-left">
                  <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold mb-2 text-red-900 dark:text-red-100">{customAlert.title}</h3>
                    <p className="text-red-800 dark:text-red-200">{customAlert.description}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className={`bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-${heroColor}-200`}>
                <div className={`text-3xl font-bold text-${heroColor}-600`}>{stats.years}+</div>
                <div className="text-sm">Anos de Experiência</div>
              </div>
              <div className={`bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-${heroColor}-200`}>
                <div className={`text-3xl font-bold text-${heroColor}-600`}>{stats.cases}+</div>
                <div className="text-sm">Casos Atendidos</div>
              </div>
              <div className={`bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-${heroColor}-200`}>
                <div className={`text-3xl font-bold text-${heroColor}-600`}>{stats.successRate}%</div>
                <div className="text-sm">Taxa de Sucesso</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className={`text-xl px-10 py-8 font-bold shadow-xl bg-${heroColor}-600 hover:bg-${heroColor}-700`}
                onClick={handleCTA}
              >
                <Phone className="h-6 w-6 mr-2" />
                FALAR COM ADVOGADO AGORA
                <ArrowRight className="h-6 w-6 ml-2" />
              </Button>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              ⚡ Atendimento especializado • Análise gratuita • {product.timeline}
            </p>
          </div>
        </div>
      </section>

      {/* Stats & Social Proof */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <Shield className={`h-10 w-10 mx-auto mb-2 text-${heroColor}-600`} />
                <div className="text-2xl font-bold">{stats.cases}+</div>
                <div className="text-sm text-muted-foreground">Casos Resolvidos</div>
              </div>
              <div>
                <Users className="h-10 w-10 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold">{stats.clients}+</div>
                <div className="text-sm text-muted-foreground">Clientes Atendidos</div>
              </div>
              <div>
                <TrendingUp className="h-10 w-10 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold">{Math.floor(stats.cases * 0.7)}+</div>
                <div className="text-sm text-muted-foreground">Vitórias</div>
              </div>
              <div>
                <Award className="h-10 w-10 mx-auto mb-2 text-orange-600" />
                <div className="text-2xl font-bold">{stats.successRate}%</div>
                <div className="text-sm text-muted-foreground">Taxa de Sucesso</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AgitationSection
        problem={`Lidar com ${product.name.toLowerCase()} pode trazer consequências sérias se não for tratado adequadamente.`}
        agitationPoints={agitationPoints}
      />

      <SolutionSection
        title={`Como Resolvemos: ${product.name}`}
        subtitle="Processo completo e estratégico"
        solutionSteps={solutionSteps}
        onCTA={handleCTA}
      />

      {/* Packages Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Nossos Pacotes</h2>
            <p className="text-center text-muted-foreground mb-12">
              Escolha o melhor pacote para o seu caso
            </p>

            <div className={`grid grid-cols-1 ${defaultPackages.length > 1 ? 'md:grid-cols-' + Math.min(defaultPackages.length, 3) : ''} gap-8`}>
              {defaultPackages.map((pkg, idx) => {
                const PackageIcon = pkg.icon || Shield
                return (
                  <Card key={idx} className={pkg.highlighted ? `border-${heroColor}-600 border-2 shadow-lg relative` : ''}>
                    {pkg.highlighted && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <span className="bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                          ⭐ RECOMENDADO
                        </span>
                      </div>
                    )}
                    <CardContent className="pt-6">
                      <PackageIcon className={`h-12 w-12 text-${heroColor}-600 mb-4`} />
                      <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                      <p className="text-muted-foreground mb-4">{pkg.description}</p>
                      <ul className="space-y-2 mb-6">
                        {pkg.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <div className={`text-2xl font-bold text-${heroColor}-600 mb-4`}>{pkg.price}</div>
                      <Button
                        className={pkg.highlighted ? `w-full text-lg bg-${heroColor}-600 hover:bg-${heroColor}-700` : 'w-full border-${heroColor}-600 text-${heroColor}-600 hover:bg-${heroColor}-50'}
                        variant={pkg.highlighted ? 'default' : 'outline'}
                        onClick={handleCTA}
                      >
                        {pkg.highlighted && <Zap className="h-5 w-5 mr-2" />}
                        Contratar Agora
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <CredentialsSection
        lawyerName="Equipe Garcez Palha"
        experience={`${stats.years}+ anos em ${product.category}`}
        specialization={`Especialistas em ${product.name}`}
        stats={stats}
      />

      <TestimonialsSection />

      <GuaranteeSection
        guaranteeTitle={guaranteeTitle}
        guaranteeDescription={guaranteeDescription}
        guaranteePeriod="30 dias"
      />

      {/* Final CTA */}
      <section className={`py-16 bg-gradient-to-r from-${heroColor}-600 to-${heroColor}-500 text-white`}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Resolva Seu Caso Hoje Mesmo
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Advogados especializados prontos para atender você.
            <strong className="block mt-2">Análise Gratuita • Atendimento Rápido • Resultados Garantidos</strong>
          </p>
          <Button
            size="lg"
            className="bg-white text-${heroColor}-900 hover:bg-gray-100 text-xl px-12 py-8 font-bold shadow-2xl"
            onClick={handleCTA}
          >
            <Phone className="h-6 w-6 mr-2" />
            FALAR COM ADVOGADO AGORA
            <ArrowRight className="h-6 w-6 ml-2" />
          </Button>
          <p className="mt-4 text-sm">
            Mais de {stats.clients} clientes já resolveram seus casos conosco
          </p>
        </div>
      </section>
    </div>
  )
}
