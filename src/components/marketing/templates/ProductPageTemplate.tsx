'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  MessageCircle,
  Check,
  FileText,
  Clock,
  Shield,
  ArrowRight,
  ChevronRight,
  Banknote,
  Home,
  Heart,
  FileCheck,
  Scale,
  Users,
} from 'lucide-react'
import { Solution, SolutionCategory, formatCurrency } from '@/types/checkout'
import { generateProductPageSchemas } from '@/lib/seo/schema-generator'
import { ChatAssistant } from '@/components/chat/ChatAssistant'

// Mapeamento de icones por categoria
const categoryIcons: Record<SolutionCategory, typeof Shield> = {
  bancario: Banknote,
  imobiliario: Home,
  saude: Heart,
  pericia: FileCheck,
  criminal: Scale,
  automacao: Users,
  aeronautico: Shield,
  previdenciario: Shield,
}

interface ProductPackage {
  name: string
  price: number
  description: string
  features: string[]
  recommended?: boolean
  solutionId: string
}

interface FAQItem {
  question: string
  answer: string
}

interface ProductPageTemplateProps {
  // Hero Section
  heroTitle: string
  heroSubtitle: string
  heroProblem: string // O problema que o cliente enfrenta

  // Solution Section
  solution: Solution
  solutionBenefits: string[]

  // Packages (Value Ladder)
  packages?: ProductPackage[]

  // Documents Required
  documentsRequired: string[]

  // FAQ
  faqItems: FAQItem[]

  // Category Info
  categoryName: string

  // Optional: Related Products
  relatedProducts?: Solution[]
}

export function ProductPageTemplate({
  heroTitle,
  heroSubtitle,
  heroProblem,
  solution,
  solutionBenefits,
  packages,
  documentsRequired,
  faqItems,
  categoryName,
  relatedProducts,
}: ProductPageTemplateProps) {
  // Obtem o icone baseado na categoria da solucao
  const CategoryIcon = categoryIcons[solution.category]
  const whatsappNumber = '5521995354010'
  const whatsappMessage = encodeURIComponent(
    `Ola! Preciso de ajuda com ${solution.name}. Pode me ajudar?`
  )
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

  // Gera schemas para SEO
  const breadcrumbItems = [
    { name: 'Inicio', url: '/' },
    { name: categoryName, url: `/${solution.category}` },
    { name: solution.name, url: `/${solution.category}/${solution.id}` },
  ]

  const schemas = generateProductPageSchemas(solution, faqItems, breadcrumbItems)

  return (
    <div className="min-h-screen">
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.product) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.service) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.faq) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.breadcrumb) }}
      />
      {/* Hero Section - Problem Focus */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary/5 via-background to-muted/30 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 bg-grid-16 [mask-image:radial-gradient(white,transparent_85%)]" />

        <div className="container mx-auto px-4 relative z-10">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-muted-foreground mb-8"
          >
            <Link href="/" className="hover:text-primary transition-colors">
              Inicio
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href={`/${solution.category}`} className="hover:text-primary transition-colors">
              {categoryName}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">{solution.name}</span>
          </motion.div>

          <div className="max-w-4xl">
            {/* Category Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Badge variant="outline" className="mb-4 gap-2">
                <CategoryIcon className="w-4 h-4" />
                {categoryName}
              </Badge>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-display text-4xl md:text-6xl font-bold mb-6"
            >
              {heroTitle}
            </motion.h1>

            {/* Problem Statement */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6"
            >
              <p className="text-lg text-destructive font-medium">{heroProblem}</p>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-muted-foreground mb-8"
            >
              {heroSubtitle}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                size="lg"
                className="gap-2 text-lg px-8 py-6 bg-[#25D366] hover:bg-[#128C7E] text-white"
                asChild
              >
                <Link href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5" />
                  Resolver Agora
                </Link>
              </Button>

              <Button size="lg" variant="outline" className="gap-2 text-lg px-8 py-6" asChild>
                <Link href={`/checkout?service=${solution.id}`}>
                  Contratar Online
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap gap-6 mt-8 pt-8 border-t border-border/50"
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4 text-primary" />
                <span>{solution.estimatedDelivery}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-primary" />
                <span>OAB/RJ 219.390</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold">
                <span className="text-2xl text-primary">{formatCurrency(solution.price)}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Solution Benefits Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                Como Resolvemos Seu Problema
              </h2>
              <p className="text-lg text-muted-foreground mb-8">{solution.description}</p>

              <ul className="space-y-4">
                {solutionBenefits.map((benefit, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <span>{benefit}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              {/* Features from Solution */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">O que esta incluido</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {solution.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <Check className="w-4 h-4 text-green-600" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Packages Section (Value Ladder) */}
      {packages && packages.length > 0 && (
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Escolha o Plano Ideal
              </h2>
              <p className="text-lg text-muted-foreground">
                Opcoes para diferentes necessidades e orcamentos
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {packages.map((pkg, index) => (
                <motion.div
                  key={pkg.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className={`h-full ${pkg.recommended ? 'ring-2 ring-primary shadow-lg' : ''}`}
                  >
                    {pkg.recommended && (
                      <div className="bg-primary text-primary-foreground text-center py-2 text-sm font-semibold">
                        Mais Popular
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle>{pkg.name}</CardTitle>
                      <CardDescription>{pkg.description}</CardDescription>
                      <div className="pt-4">
                        <span className="text-3xl font-bold">{formatCurrency(pkg.price)}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ul className="space-y-2">
                        {pkg.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        className="w-full"
                        variant={pkg.recommended ? 'default' : 'outline'}
                        asChild
                      >
                        <Link href={`/checkout?service=${pkg.solutionId}`}>Contratar</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Documents Required Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Documentos Necessarios
              </h2>
              <p className="text-lg text-muted-foreground">
                Tenha em maos os seguintes documentos para agilizar seu atendimento
              </p>
            </motion.div>

            <Card>
              <CardContent className="pt-6">
                <ul className="grid md:grid-cols-2 gap-4">
                  {documentsRequired.map((doc, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-3"
                    >
                      <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                      <span>{doc}</span>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Duvidas Frequentes
              </h2>
              <p className="text-lg text-muted-foreground">
                Tire suas duvidas sobre {solution.name}
              </p>
            </motion.div>

            <Accordion type="single" collapsible className="space-y-4">
              {faqItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <AccordionItem value={`item-${index}`} className="bg-background rounded-lg px-6">
                    <AccordionTrigger className="text-left hover:no-underline">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
              Pronto para Resolver Seu Problema?
            </h2>
            <p className="text-xl opacity-90 mb-8">
              Fale agora com um especialista e resolva sua situacao em ate{' '}
              {solution.estimatedDelivery}.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="gap-2 text-lg px-8 py-6"
                asChild
              >
                <Link href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5" />
                  Falar no WhatsApp
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="gap-2 text-lg px-8 py-6 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                asChild
              >
                <Link href={`/checkout?service=${solution.id}`}>
                  Contratar Online por {formatCurrency(solution.price)}
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Solucoes Relacionadas
              </h2>
              <p className="text-lg text-muted-foreground">
                Outras opcoes que podem te interessar
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {relatedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <CardDescription>{product.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold">
                          {formatCurrency(product.price)}
                        </span>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/checkout?service=${product.id}`}>Ver mais</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Chat Widgets - Assistente IA + WhatsApp */}
      <ChatAssistant
        productId={solution.id}
        productName={solution.name}
        autoOpen={true}
        openDelay={3000}
      />

    </div>
  )
}
