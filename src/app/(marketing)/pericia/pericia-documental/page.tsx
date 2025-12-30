'use client'


import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Check, Shield, Clock, Award, ArrowRight, AlertTriangle,
  TrendingUp, Users, Star, Zap, FileText, Search, Microscope
} from 'lucide-react'
import { getProductBySlug } from '@/lib/products/catalog'
import {
  AgitationSection,
  SolutionSection,
  CredentialsSection,
  GuaranteeSection,
  TestimonialsSection,
  UrgencyBanner,
  SEOHead,
} from '@/components/vsl'

// ISR: Revalidate every 1 hour (product pages rarely change)
export const revalidate = 3600

// Generate metadata for SEO


export default function PericiaDocumentalPage() {
  const router = useRouter()

  const handleCTA = () => {
    router.push('/checkout?product=pericia-documental')
  }

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Perícia Documental - Análise de Autenticidade"
        description="Precisa comprovar autenticidade de documentos? Perícia técnica em documentos, falsificações e adulterações. Laudos aceitos judicialmente."
        keywords={['perícia documental', 'autenticidade documento', 'laudo pericial', 'falsificação documento', 'perito documentoscópico']}
        productName="Perícia Documental"
        price={250000}
        category="pericia"
        canonicalUrl="https://garcezpalha.com.br/pericia-documental"
      />

      <UrgencyBanner
        countdown={true}
        countdownMinutes={60}
        message="🔍 ANÁLISE PRELIMINAR - Avaliação inicial do documento"
        discount="ANÁLISE GRÁTIS"
        onCTA={handleCTA}
        ctaText="Solicitar Análise"
      />


      {/* Hero Section */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-full mb-6">
              <Microscope className="h-5 w-5" />
              <span className="font-semibold">Perícia Técnica Especializada</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Dúvidas Sobre a<br />
              <span className="text-amber-600">Autenticidade de Documentos?</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8">
              Perícia técnica em documentos, contratos, certidões e títulos.<br />
              Laudos periciais aceitos em processos judiciais e administrativos.
            </p>

            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mb-8 border-l-4 border-amber-600">
              <div className="flex items-start gap-3 text-left">
                <Search className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2">O Que Analisamos?</h3>
                  <p className="text-muted-foreground">
                    Documentos pessoais, contratos, certidões, títulos, escrituras, procurações, testamentos,
                    cheques, notas promissórias e qualquer documento que necessite verificação de autenticidade.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-amber-200">
                <div className="text-3xl font-bold text-amber-600">R$ 2.500+</div>
                <div className="text-sm">A partir de</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-amber-200">
                <div className="text-3xl font-bold text-amber-600">20+</div>
                <div className="text-sm">Anos Experiência</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-amber-200">
                <div className="text-3xl font-bold text-amber-600">500+</div>
                <div className="text-sm">Perícias Realizadas</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-xl px-10 py-8 font-bold shadow-xl bg-amber-600 hover:bg-amber-700"
                onClick={handleCTA}
              >
                <Microscope className="h-6 w-6 mr-2" />
                SOLICITAR PERÍCIA AGORA
                <ArrowRight className="h-6 w-6 ml-2" />
              </Button>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              ⚡ Análise preliminar gratuita • Laudo em 7-15 dias • Aceito judicialmente
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
                <Microscope className="h-10 w-10 mx-auto mb-2 text-amber-600" />
                <div className="text-2xl font-bold">500+</div>
                <div className="text-sm text-muted-foreground">Perícias Realizadas</div>
              </div>
              <div>
                <Users className="h-10 w-10 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold">400+</div>
                <div className="text-sm text-muted-foreground">Clientes Atendidos</div>
              </div>
              <div>
                <Shield className="h-10 w-10 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold">100%</div>
                <div className="text-sm text-muted-foreground">Laudos Aceitos</div>
              </div>
              <div>
                <Award className="h-10 w-10 mx-auto mb-2 text-orange-600" />
                <div className="text-2xl font-bold">98%</div>
                <div className="text-sm text-muted-foreground">Precisão Técnica</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AgitationSection
        problem="Documentos falsos ou adulterados podem causar prejuízos milionários, perda de processos judiciais e até mesmo responsabilização criminal. Sem uma perícia técnica adequada, você pode ser vítima de fraude."
        agitationPoints={[
          'Contratos falsificados geram negócios fraudulentos e prejuízos financeiros',
          'Documentos adulterados podem invalidar processos e causar perda de direitos',
          'Falsificações passam despercebidas sem análise técnica especializada',
          'Provas documentais questionadas enfraquecem sua posição judicial',
          'Fraudes documentais podem resultar em responsabilização criminal',
          'Certidões e títulos falsos comprometem negociações e transações'
        ]}
      />

      <SolutionSection
        title="Como Realizamos a Perícia Documental"
        subtitle="Metodologia científica com equipamentos de alta tecnologia"
        solutionSteps={[
          'Análise preliminar GRATUITA - Avaliamos viabilidade e escopo da perícia',
          'Exame visual e microscópico - Verificação de tintas, papéis e impressões',
          'Análise de alterações - Detecção de rasuras, emendas e adulterações',
          'Exame de autenticidade - Verificação de selos, carimbos e assinaturas',
          'Testes laboratoriais - Análise química e física quando necessário',
          'Laudo pericial completo - Documento técnico com conclusões fundamentadas'
        ]}
        onCTA={handleCTA}
      />

      {/* Services Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Tipos de Perícia Documental</h2>
            <p className="text-center text-muted-foreground mb-12">
              Análise técnica especializada para diversos tipos de documentos
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Básica */}
              <Card>
                <CardContent className="pt-6">
                  <FileText className="h-12 w-12 text-amber-600 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Perícia Básica</h3>
                  <p className="text-muted-foreground mb-4">
                    Análise de documento único simples
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Exame visual e microscópico</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Análise de alterações</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Laudo pericial técnico</span>
                    </li>
                  </ul>
                  <div className="text-2xl font-bold text-amber-600 mb-2">R$ 2.500</div>
                  <Button variant="outline" className="w-full border-amber-600 text-amber-600 hover:bg-amber-50" onClick={handleCTA}>
                    Solicitar Perícia
                  </Button>
                </CardContent>
              </Card>

              {/* Complexa */}
              <Card className="border-amber-600 border-2 shadow-lg relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                    ⭐ MAIS COMPLETA
                  </span>
                </div>
                <CardContent className="pt-6">
                  <Microscope className="h-12 w-12 text-green-600 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Perícia Complexa</h3>
                  <p className="text-muted-foreground mb-4">
                    Múltiplos documentos ou análise detalhada
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Tudo da Perícia Básica</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Análise de múltiplos documentos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Testes laboratoriais</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Fotografia especializada</span>
                    </li>
                  </ul>
                  <div className="text-2xl font-bold text-amber-600 mb-1">R$ 5.000+</div>
                  <div className="text-sm text-muted-foreground mb-4">Orçamento sob medida</div>
                  <Button className="w-full text-lg bg-amber-600 hover:bg-amber-700" onClick={handleCTA}>
                    <Zap className="h-5 w-5 mr-2" />
                    Solicitar Orçamento
                  </Button>
                </CardContent>
              </Card>

              {/* Judicial */}
              <Card>
                <CardContent className="pt-6">
                  <Shield className="h-12 w-12 text-purple-600 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Perícia Judicial</h3>
                  <p className="text-muted-foreground mb-4">
                    Assistente técnico em processo judicial
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Acompanhamento da perícia</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Quesitos técnicos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Parecer técnico divergente</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Sustentação oral se necessário</span>
                    </li>
                  </ul>
                  <div className="text-2xl font-bold text-amber-600 mb-1">R$ 4.000+</div>
                  <div className="text-sm text-muted-foreground mb-4">Depende da complexidade</div>
                  <Button variant="outline" className="w-full border-amber-600 text-amber-600 hover:bg-amber-50" onClick={handleCTA}>
                    Consultar Valores
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border-l-4 border-amber-500">
              <p className="text-sm">
                💡 <strong>Prazo de Entrega:</strong> Perícia Básica: 7-10 dias • Perícia Complexa: 15-30 dias • Casos urgentes sob consulta
              </p>
            </div>
          </div>
        </div>
      </section>

      <CredentialsSection
        lawyerName="Equipe de Peritos Garcez Palha"
        experience="20+ anos em Perícia Documental"
        specialization="Peritos Documentoscópicos Certificados"
        stats={{
          years: 20,
          cases: 500,
          successRate: 98,
          clients: 400,
        }}
      />

      <TestimonialsSection />

      <GuaranteeSection
        guaranteeTitle="Análise Preliminar Gratuita"
        guaranteeDescription="Envie o documento para análise preliminar sem custo. Avaliamos viabilidade e fornecemos orçamento detalhado."
        guaranteePeriod="gratuito"
      />

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-amber-600 to-orange-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Descubra a Verdade Sobre Seus Documentos
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Perícia técnica especializada com laudos aceitos judicialmente.
            <strong className="block mt-2">Análise Preliminar Grátis • Laudo em 7-15 dias • Metodologia Científica</strong>
          </p>
          <Button
            size="lg"
            className="bg-white text-amber-900 hover:bg-gray-100 text-xl px-12 py-8 font-bold shadow-2xl"
            onClick={handleCTA}
          >
            <Microscope className="h-6 w-6 mr-2" />
            SOLICITAR PERÍCIA AGORA
            <ArrowRight className="h-6 w-6 ml-2" />
          </Button>
          <p className="mt-4 text-sm">
            Mais de 400 clientes já comprovaram a autenticidade de seus documentos
          </p>
        </div>
      </section>
    </div>
  )
}
