
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Check, Shield, Clock, Award, ArrowRight, AlertTriangle,
  TrendingUp, Users, Star, Zap, FileText, ClipboardCheck, DollarSign
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
export async function generateMetadata() {
  const product = getProductBySlug('laudo-tecnico')
  if (!product) return {}

  return {
    title: `${product.name} | Garcez Palha Advogados`,
    description: product.description,
  }
}


export default function LaudoTecnicoPage() {
  const router = useRouter()

  const handleCTA = () => {
    router.push('/checkout?product=laudo-tecnico')
  }

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Laudo Técnico Especializado - Validade Judicial | Garcez Palha"
        description="Laudos técnicos periciais em engenharia, contabilidade, informática e mais. Prova técnica fundamentada para processos judiciais. A partir de R$ 2.000."
        keywords={['laudo técnico', 'perícia técnica', 'laudo engenharia', 'laudo contábil', 'perícia informática', 'prova pericial']}
        productName="Laudo Técnico"
        price={200000}
        category="pericia"
        canonicalUrl="https://garcezpalha.com.br/pericia/laudo-tecnico"
      />

      <UrgencyBanner
        countdown={true}
        countdownMinutes={60}
        message="📋 LAUDO TÉCNICO ESPECIALIZADO - Peritos Certificados com Validade Judicial"
        discount="ORÇAMENTO GRÁTIS"
        onCTA={handleCTA}
        ctaText="Solicitar Orçamento"
      />


      {/* Hero Section */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-full mb-6">
              <ClipboardCheck className="h-5 w-5" />
              <span className="font-semibold">Perícia Especializada</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Laudo Técnico Pericial<br />
              <span className="text-amber-600">Validade Judicial Garantida</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8">
              Laudos técnicos especializados em engenharia, contabilidade, informática e outras áreas.<br />
              Peritos certificados com experiência em processos judiciais.
            </p>

            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mb-8 border-l-4 border-amber-600">
              <div className="flex items-start gap-3 text-left">
                <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2">Prova Técnica é Essencial</h3>
                  <p className="text-muted-foreground">
                    Em muitos processos, a prova técnica especializada é decisiva para o resultado.
                    Laudo bem fundamentado com metodologia científica aumenta drasticamente suas chances de sucesso.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-amber-200">
                <div className="text-3xl font-bold text-amber-600">300+</div>
                <div className="text-sm">Laudos Elaborados</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-amber-200">
                <div className="text-3xl font-bold text-amber-600">15</div>
                <div className="text-sm">Especialidades</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-amber-200">
                <div className="text-3xl font-bold text-amber-600">96%</div>
                <div className="text-sm">Aceitos em Juízo</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-amber-200">
                <div className="text-3xl font-bold text-amber-600">20+</div>
                <div className="text-sm">Anos Experiência</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-xl px-10 py-8 font-bold shadow-xl bg-amber-600 hover:bg-amber-700"
                onClick={handleCTA}
              >
                <ClipboardCheck className="h-6 w-6 mr-2" />
                SOLICITAR ORÇAMENTO
                <ArrowRight className="h-6 w-6 ml-2" />
              </Button>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              ⚡ Orçamento gratuito • Peritos certificados • A partir de R$ 2.000
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
                <ClipboardCheck className="h-10 w-10 mx-auto mb-2 text-amber-600" />
                <div className="text-2xl font-bold">300+</div>
                <div className="text-sm text-muted-foreground">Laudos Elaborados</div>
              </div>
              <div>
                <Clock className="h-10 w-10 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold">15-60 dias</div>
                <div className="text-sm text-muted-foreground">Prazo Médio</div>
              </div>
              <div>
                <TrendingUp className="h-10 w-10 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold">96%</div>
                <div className="text-sm text-muted-foreground">Aceitos em Juízo</div>
              </div>
              <div>
                <Award className="h-10 w-10 mx-auto mb-2 text-orange-600" />
                <div className="text-2xl font-bold">15+</div>
                <div className="text-sm text-muted-foreground">Especialidades</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AgitationSection
        problem="Precisa de prova técnica especializada para seu processo? Sem laudo fundamentado com metodologia científica, suas chances de sucesso diminuem drasticamente. Tribunal confia em evidências técnicas."
        agitationPoints={[
          'Processo sem prova técnica adequada tem chances reduzidas',
          'Juiz pode desconsiderar argumentos sem fundamentação técnica',
          'Parte adversa pode apresentar laudo contrário mais robusto',
          'Perícia judicial demora meses e pode ter resultado desfavorável',
          'Custos processuais aumentam sem prova técnica antecipada',
          'Credibilidade do caso depende de documentação técnica sólida',
        ]}
      />

      <SolutionSection
        title="Como Elaboramos Seu Laudo Técnico Especializado"
        subtitle="Processo rigoroso com metodologia científica e validade judicial"
        solutionSteps={[
          'Análise GRATUITA do caso - Identificamos especialidade e escopo necessário',
          'Indicação de perito certificado - Profissional com registro em conselho de classe',
          'Vistoria técnica e coleta de provas - Fotos, medições, análises documentais',
          'Elaboração fundamentada - Metodologia científica, cálculos e conclusões',
          'Revisão jurídica - Adequação ao processo e exigências do tribunal',
          'Entrega completa - Laudo + esclarecimentos + disponibilidade para depor',
        ]}
        onCTA={handleCTA}
      />

      {/* Services Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Tipos de Laudo Técnico</h2>
            <p className="text-center text-muted-foreground mb-12">
              Especialidades técnicas para diferentes áreas
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Básico */}
              <Card>
                <CardContent className="pt-6">
                  <FileText className="h-12 w-12 text-amber-600 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Laudo Simples</h3>
                  <p className="text-muted-foreground mb-4">
                    Vistorias e análises objetivas
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Vistoria no local/objeto</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Fotos e documentação</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Relatório técnico básico</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Prazo: 15 dias</span>
                    </li>
                  </ul>
                  <div className="text-2xl font-bold text-amber-600 mb-1">R$ 2.000</div>
                  <div className="text-sm text-muted-foreground mb-4">a R$ 4.000</div>
                  <Button variant="outline" className="w-full" onClick={handleCTA}>
                    Solicitar Laudo
                  </Button>
                </CardContent>
              </Card>

              {/* Médio */}
              <Card className="border-amber-600 border-2 shadow-lg relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                    ⭐ MAIS PROCURADO
                  </span>
                </div>
                <CardContent className="pt-6">
                  <Zap className="h-12 w-12 text-green-600 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Laudo Completo</h3>
                  <p className="text-muted-foreground mb-4">
                    Análise aprofundada com cálculos
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Tudo do Laudo Simples</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Análise técnica detalhada</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Cálculos e simulações</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Fundamentação científica</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Prazo: 30 dias</span>
                    </li>
                  </ul>
                  <div className="text-2xl font-bold text-amber-600 mb-1">R$ 4.000</div>
                  <div className="text-sm text-muted-foreground mb-4">a R$ 8.000</div>
                  <Button className="w-full text-lg bg-amber-600 hover:bg-amber-700" onClick={handleCTA}>
                    <Zap className="h-5 w-5 mr-2" />
                    Solicitar Agora
                  </Button>
                </CardContent>
              </Card>

              {/* Complexo */}
              <Card>
                <CardContent className="pt-6">
                  <DollarSign className="h-12 w-12 text-purple-600 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Laudo Complexo</h3>
                  <p className="text-muted-foreground mb-4">
                    Casos complexos multidisciplinares
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Tudo do Laudo Completo</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Múltiplas especialidades</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Análise estrutural profunda</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Disponibilidade para depor</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Prazo: 45-60 dias</span>
                    </li>
                  </ul>
                  <div className="text-2xl font-bold text-amber-600 mb-1">R$ 8.000+</div>
                  <div className="text-sm text-muted-foreground mb-4">Orçamento sob medida</div>
                  <Button variant="outline" className="w-full" onClick={handleCTA}>
                    Consultar Orçamento
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border-l-4 border-amber-500">
              <p className="text-sm">
                💡 <strong>Especialidades:</strong> Engenharia Civil, Contabilidade, Informática, Ambiental, Agronomia, Mecânica, Elétrica, Segurança do Trabalho e mais.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CredentialsSection
        lawyerName="Equipe Garcez Palha + Rede de Peritos"
        experience="20+ anos em Perícias Técnicas"
        specialization="Rede de Peritos Certificados em 15+ Especialidades"
        stats={{
          years: 20,
          cases: 300,
          successRate: 96,
          clients: 400,
        }}
      />

      <TestimonialsSection />

      <GuaranteeSection
        guaranteeTitle="Garantia de Qualidade Técnica"
        guaranteeDescription="Se o laudo não for aceito pelo tribunal por falha técnica nossa, refazemos sem custo adicional ou devolvemos o valor. Todos os peritos são certificados e com experiência judicial."
        guaranteePeriod="total"
      />

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-amber-600 to-orange-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Fortaleça Seu Processo com Prova Técnica
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Laudo técnico especializado com validade judicial. Peritos certificados em 15+ áreas.
            <strong className="block mt-2">300+ laudos elaborados • 96% aceitos • A partir de R$ 2.000</strong>
          </p>
          <Button
            size="lg"
            className="bg-white text-amber-900 hover:bg-gray-100 text-xl px-12 py-8 font-bold shadow-2xl"
            onClick={handleCTA}
          >
            <ClipboardCheck className="h-6 w-6 mr-2" />
            SOLICITAR ORÇAMENTO
            <ArrowRight className="h-6 w-6 ml-2" />
          </Button>
          <p className="mt-4 text-sm">
            Orçamento gratuito • Peritos certificados • Resposta em 24h
          </p>
        </div>
      </section>
    </div>
  )
}
