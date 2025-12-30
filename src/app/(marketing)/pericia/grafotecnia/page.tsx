'use client'


import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Check, Shield, Clock, Award, ArrowRight, AlertTriangle,
  TrendingUp, Users, Star, Zap, FileText, PenTool, Fingerprint
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

// Generate metadata for SEO


export default function GrafotecniaPage() {
  const router = useRouter()

  const handleCTA = () => {
    router.push('/checkout?product=grafotecnia')
  }

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Grafotecnia - Exame de Autenticidade de Assinaturas"
        description="Dúvidas sobre assinatura? Perícia grafotécnica para verificar autenticidade de assinaturas em contratos, cheques e documentos. Laudos aceitos judicialmente."
        keywords={['grafotecnia', 'perícia grafotécnica', 'autenticidade assinatura', 'exame grafotécnico', 'falsificação assinatura']}
        productName="Grafotecnia"
        price={300000}
        category="pericia"
        canonicalUrl="https://garcezpalha.com.br/grafotecnia"
      />

      <UrgencyBanner
        countdown={true}
        countdownMinutes={60}
        message="✍️ ANÁLISE PRELIMINAR - Avaliação inicial da assinatura"
        discount="ANÁLISE GRÁTIS"
        onCTA={handleCTA}
        ctaText="Solicitar Análise"
      />


      {/* Hero Section */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-full mb-6">
              <PenTool className="h-5 w-5" />
              <span className="font-semibold">Perícia Grafotécnica Especializada</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Essa Assinatura é<br />
              <span className="text-amber-600">Verdadeira ou Falsa?</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8">
              Perícia grafotécnica para verificar autenticidade de assinaturas.<br />
              Exame técnico de assinaturas em contratos, cheques, testamentos e documentos.
            </p>

            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mb-8 border-l-4 border-amber-600">
              <div className="flex items-start gap-3 text-left">
                <Fingerprint className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2">O Que é Grafotecnia?</h3>
                  <p className="text-muted-foreground">
                    Grafotecnia é a ciência que analisa características da escrita manuscrita para identificar
                    autoria e autenticidade de assinaturas. Cada pessoa tem características únicas na forma de assinar,
                    impossíveis de replicar perfeitamente.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-amber-200">
                <div className="text-3xl font-bold text-amber-600">R$ 3.000+</div>
                <div className="text-sm">A partir de</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-amber-200">
                <div className="text-3xl font-bold text-amber-600">25+</div>
                <div className="text-sm">Anos Experiência</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-amber-200">
                <div className="text-3xl font-bold text-amber-600">800+</div>
                <div className="text-sm">Perícias Realizadas</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-xl px-10 py-8 font-bold shadow-xl bg-amber-600 hover:bg-amber-700"
                onClick={handleCTA}
              >
                <PenTool className="h-6 w-6 mr-2" />
                SOLICITAR PERÍCIA AGORA
                <ArrowRight className="h-6 w-6 ml-2" />
              </Button>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              ⚡ Análise preliminar gratuita • Laudo em 10-20 dias • Aceito judicialmente
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
                <PenTool className="h-10 w-10 mx-auto mb-2 text-amber-600" />
                <div className="text-2xl font-bold">800+</div>
                <div className="text-sm text-muted-foreground">Perícias Realizadas</div>
              </div>
              <div>
                <Users className="h-10 w-10 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold">600+</div>
                <div className="text-sm text-muted-foreground">Clientes Atendidos</div>
              </div>
              <div>
                <Shield className="h-10 w-10 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold">100%</div>
                <div className="text-sm text-muted-foreground">Laudos Aceitos</div>
              </div>
              <div>
                <Award className="h-10 w-10 mx-auto mb-2 text-orange-600" />
                <div className="text-2xl font-bold">99%</div>
                <div className="text-sm text-muted-foreground">Precisão Técnica</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AgitationSection
        problem="Assinaturas falsas em contratos, cheques e testamentos podem causar prejuízos irreparáveis, anular negócios milionários e até mesmo resultar em responsabilização criminal. Sem perícia grafotécnica, a verdade nunca será descoberta."
        agitationPoints={[
          'Contratos assinados falsamente geram negócios fraudulentos e perdas milionárias',
          'Cheques com assinatura falsa podem comprometer sua conta bancária',
          'Testamentos fraudados causam disputas familiares e perdas patrimoniais',
          'Procurações falsas permitem fraudes e desvio de bens',
          'Documentos questionados sem perícia enfraquecem processos judiciais',
          'Falsificadores ficam impunes sem prova técnica pericial'
        ]}
      />

      <SolutionSection
        title="Como Realizamos o Exame Grafotécnico"
        subtitle="Metodologia científica reconhecida internacionalmente"
        solutionSteps={[
          'Análise preliminar GRATUITA - Avaliamos viabilidade e material necessário',
          'Coleta de padrões - Obtenção de assinaturas genuínas para comparação',
          'Exame microscópico - Análise detalhada de traços, pressão e dinâmica',
          'Estudo comparativo - Confronto entre assinaturas questionadas e genuínas',
          'Análise de convergências e divergências - Identificação de pontos característicos',
          'Laudo pericial conclusivo - Documento técnico fundamentado cientificamente'
        ]}
        onCTA={handleCTA}
      />

      {/* Services Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Tipos de Perícia Grafotécnica</h2>
            <p className="text-center text-muted-foreground mb-12">
              Exame técnico especializado para diferentes necessidades
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Básica */}
              <Card>
                <CardContent className="pt-6">
                  <FileText className="h-12 w-12 text-amber-600 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Perícia Básica</h3>
                  <p className="text-muted-foreground mb-4">
                    Exame de assinatura única
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Exame de 1 assinatura</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Análise microscópica</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Laudo técnico fundamentado</span>
                    </li>
                  </ul>
                  <div className="text-2xl font-bold text-amber-600 mb-2">R$ 3.000</div>
                  <Button variant="outline" className="w-full border-amber-600 text-amber-600 hover:bg-amber-50" onClick={handleCTA}>
                    Solicitar Perícia
                  </Button>
                </CardContent>
              </Card>

              {/* Múltiplas */}
              <Card className="border-amber-600 border-2 shadow-lg relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                    ⭐ MAIS PROCURADO
                  </span>
                </div>
                <CardContent className="pt-6">
                  <PenTool className="h-12 w-12 text-green-600 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Múltiplas Assinaturas</h3>
                  <p className="text-muted-foreground mb-4">
                    Exame de várias assinaturas
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Exame de até 5 assinaturas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Análise comparativa detalhada</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Documentação fotográfica</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Laudo completo ilustrado</span>
                    </li>
                  </ul>
                  <div className="text-2xl font-bold text-amber-600 mb-1">R$ 6.000</div>
                  <div className="text-sm text-muted-foreground mb-4">Até 5 assinaturas</div>
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
                  <h3 className="text-2xl font-bold mb-2">Assistência Judicial</h3>
                  <p className="text-muted-foreground mb-4">
                    Assistente técnico em processo
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Acompanhamento da perícia oficial</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Elaboração de quesitos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Parecer técnico divergente</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Sustentação em audiência</span>
                    </li>
                  </ul>
                  <div className="text-2xl font-bold text-amber-600 mb-1">R$ 5.000+</div>
                  <div className="text-sm text-muted-foreground mb-4">Conforme complexidade</div>
                  <Button variant="outline" className="w-full border-amber-600 text-amber-600 hover:bg-amber-50" onClick={handleCTA}>
                    Consultar Valores
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border-l-4 border-amber-500">
              <p className="text-sm">
                💡 <strong>Material Necessário:</strong> Documento questionado + 10-15 assinaturas genuínas do suposto autor para comparação
              </p>
            </div>
          </div>
        </div>
      </section>

      <CredentialsSection
        lawyerName="Perito Grafotécnico Garcez Palha"
        experience="25+ anos em Grafotecnia"
        specialization="Perito Grafotécnico Certificado e Registrado"
        stats={{
          years: 25,
          cases: 800,
          successRate: 99,
          clients: 600,
        }}
      />

      <TestimonialsSection />

      <GuaranteeSection
        guaranteeTitle="Análise Preliminar Gratuita"
        guaranteeDescription="Envie o documento para análise preliminar sem custo. Avaliamos viabilidade e informamos material necessário."
        guaranteePeriod="gratuito"
      />

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-amber-600 to-orange-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Descubra a Verdade Sobre Essa Assinatura
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Perícia grafotécnica com metodologia científica reconhecida.
            <strong className="block mt-2">Análise Preliminar Grátis • Laudo em 10-20 dias • 99% de Precisão</strong>
          </p>
          <Button
            size="lg"
            className="bg-white text-amber-900 hover:bg-gray-100 text-xl px-12 py-8 font-bold shadow-2xl"
            onClick={handleCTA}
          >
            <PenTool className="h-6 w-6 mr-2" />
            SOLICITAR PERÍCIA AGORA
            <ArrowRight className="h-6 w-6 ml-2" />
          </Button>
          <p className="mt-4 text-sm">
            Mais de 600 clientes já comprovaram a autenticidade de assinaturas
          </p>
        </div>
      </section>
    </div>
  )
}
