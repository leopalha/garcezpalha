'use client'

import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import {
  Check,
  Star,
  FileText,
  Loader2,
  ArrowRight,
  Shield,
  Clock,
  Users,
  Award,
} from 'lucide-react'
import { trpc } from '@/lib/trpc/client'
import { toast } from '@/components/ui/use-toast'
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

export default function ProductVSLPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.product as string

  const { data: product, isLoading } = trpc.products.getBySlug.useQuery({ slug })
  const { data: packages } = trpc.products.getPackages.useQuery(
    { productId: product?.id || '' },
    { enabled: !!product?.id }
  )

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price / 100)
  }

  const handleSelectPackage = (packageId: string) => {
    router.push(`/checkout?package=${packageId}`)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Produto não encontrado</h1>
        <Button onClick={() => router.push('/')}>Voltar ao início</Button>
      </div>
    )
  }

  const sortedPackages = packages?.sort((a, b) => a.order_index - b.order_index) || []

  const handleCTA = () => {
    if (sortedPackages[0]) {
      handleSelectPackage(sortedPackages[0].id)
    }
  }

  return (
    <div className="min-h-screen">
      {/* SEO Head */}
      <SEOHead
        title={product.hero_title || product.name}
        description={product.description}
        productName={product.name}
        price={product.base_price}
        category={product.category}
        canonicalUrl={`https://garcezpalha.com.br/${slug}`}
      />

      {/* Urgency Banner */}
      <UrgencyBanner
        countdown={true}
        countdownMinutes={30}
        message="Oferta Especial por Tempo Limitado"
        discount="10% OFF"
        onCTA={handleCTA}
        ctaText="Garantir Desconto Agora"
      />

      {/* WhatsApp Float */}
      <WhatsAppFloat
        phoneNumber="5511999999999"
        message={`Olá! Gostaria de mais informações sobre ${product.name}.`}
        position="bottom-right"
        showTooltip={true}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {product.hero_title || product.name}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              {product.hero_subtitle || product.description}
            </p>
            {product.hero_problem && (
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 mb-8 text-left">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  O Problema que Resolvemos
                </h3>
                <p className="text-muted-foreground">{product.hero_problem}</p>
              </div>
            )}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span className="text-sm">Atendimento Rápido</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-sm">Equipe Especializada</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                <span className="text-sm">100% Seguro</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Agitation Section - VSL */}
      {product.hero_problem && (
        <AgitationSection
          problem={product.hero_problem}
          agitationPoints={[
            'Cada dia que passa, o problema se agrava e pode gerar mais prejuízos',
            'Você pode estar perdendo direitos importantes sem saber',
            'A situação pode afetar sua família, seu patrimônio e sua tranquilidade',
          ]}
        />
      )}

      {/* Solution Section - VSL */}
      <SolutionSection
        title="Nossa Solução Comprovada"
        subtitle={product.hero_subtitle || product.description}
        solutionSteps={product.features}
        onCTA={handleCTA}
      />

      {/* Features Section */}
      {product.features && product.features.length > 0 && (
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Como Funciona</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {product.features.map((feature: any, index: number) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <Check className="h-5 w-5 text-primary" />
                        </div>
                        <p className="flex-1">{feature}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Credentials Section - VSL */}
      <CredentialsSection
        lawyerName="Equipe Garcez Palha"
        experience="15+ anos de experiência"
        specialization={`Especialistas em ${product.category}`}
        stats={{
          years: 15,
          cases: 500,
          successRate: 95,
          clients: 1000,
        }}
      />

      {/* Benefits Section */}
      {product.benefits && product.benefits.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Benefícios</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {product.benefits.map((benefit: any, index: number) => (
                  <Card key={index} className="text-center">
                    <CardContent className="pt-6">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check className="h-6 w-6 text-green-600" />
                      </div>
                      <p className="font-medium">{benefit}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Pricing Section */}
      {sortedPackages.length > 0 && (
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-4">Escolha seu Pacote</h2>
              <p className="text-center text-muted-foreground mb-12">
                Selecione o plano ideal para suas necessidades
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {sortedPackages.map((pkg) => (
                  <Card
                    key={pkg.id}
                    className={`relative ${
                      pkg.is_recommended
                        ? 'border-primary shadow-lg scale-105'
                        : 'border-border'
                    }`}
                  >
                    {pkg.is_recommended && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-yellow-500 text-white">
                          <Star className="h-3 w-3 mr-1 fill-current" />
                          Recomendado
                        </Badge>
                      </div>
                    )}

                    <CardHeader>
                      <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                      {pkg.description && (
                        <CardDescription>{pkg.description}</CardDescription>
                      )}
                      <div className="pt-4">
                        <div className="text-4xl font-bold text-primary">
                          {formatPrice(pkg.price)}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {pkg.features && pkg.features.length > 0 && (
                        <ul className="space-y-2">
                          {pkg.features.map((feature: any, index: number) => (
                            <li key={index} className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      <Button
                        className="w-full"
                        size="lg"
                        variant={pkg.is_recommended ? 'default' : 'outline'}
                        onClick={() => handleSelectPackage(pkg.id)}
                      >
                        Contratar Agora
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Documents Required Section */}
      {product.documents_required && product.documents_required.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
                <h2 className="text-3xl font-bold mb-4">Documentos Necessários</h2>
                <p className="text-muted-foreground">
                  Tenha em mãos os seguintes documentos para agilizar o processo
                </p>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    {product.documents_required.map((doc: any, index: number) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                          <span className="text-xs font-medium text-primary">
                            {index + 1}
                          </span>
                        </div>
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section - VSL */}
      <TestimonialsSection />

      {/* Guarantee Section - VSL */}
      <GuaranteeSection
        guaranteeTitle="Garantia de 100% de Satisfação"
        guaranteeDescription="Estamos tão confiantes no nosso trabalho que oferecemos garantia total"
        guaranteePeriod="30 dias"
      />

      {/* FAQ Section */}
      {product.faq_items && product.faq_items.length > 0 && (
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">
                Perguntas Frequentes
              </h2>

              <Accordion type="single" collapsible className="space-y-4">
                {product.faq_items.map((faq: any, index: number) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto para Começar?</h2>
          <p className="text-xl mb-8 opacity-90">
            Entre em contato conosco e tire suas dúvidas
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="secondary" onClick={() => router.push('/contato')}>
              Falar com Especialista
            </Button>
            {sortedPackages[0] && (
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white hover:text-primary"
                onClick={() => handleSelectPackage(sortedPackages[0].id)}
              >
                Contratar Agora
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
