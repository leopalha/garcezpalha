
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Check, Shield, Clock, Award, ArrowRight, AlertTriangle,
  TrendingUp, Users, Star, Zap, FileText, Home, Scale
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
  const product = getProductBySlug('usucapiao')
  if (!product) return {}

  return {
    title: `${product.name} | Garcez Palha Advogados`,
    description: product.description,
  }
}


export default function UsucapiaoPage() {
  const router = useRouter()

  const handleCTA = () => {
    router.push('/checkout?product=usucapiao')
  }

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Usucapião - Regularização de Imóveis"
        description="Regularize seu imóvel por usucapião. Conquiste a escritura definitiva do imóvel que você ocupa há anos. Especialistas em regularização fundiária."
        keywords={['usucapião', 'regularização de imóveis', 'escritura definitiva', 'advogado imobiliário', 'direito patrimonial']}
        productName="Usucapião"
        price={500000}
        category="patrimonial"
        canonicalUrl="https://garcezpalha.com.br/usucapiao"
      />

      <UrgencyBanner
        countdown={true}
        countdownMinutes={60}
        message="🏠 ANÁLISE GRATUITA - Descubra se você tem direito à escritura do seu imóvel"
        discount="ANÁLISE GRÁTIS"
        onCTA={handleCTA}
        ctaText="Solicitar Análise Gratuita"
      />


      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-full mb-6">
              <Home className="h-5 w-5" />
              <span className="font-semibold">Regularização de Imóveis</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Regularize Seu Imóvel<br />
              <span className="text-emerald-600">Por Usucapião</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8">
              Conquiste a escritura definitiva do imóvel que você ocupa há anos.<br />
              Processo completo, judicial ou extrajudicial, com segurança jurídica total.
            </p>

            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mb-8 border-l-4 border-emerald-600">
              <div className="flex items-start gap-3 text-left">
                <Home className="h-6 w-6 text-emerald-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2">Você Sabia?</h3>
                  <p className="text-muted-foreground">
                    Se você mora em um imóvel há mais de 5 anos de forma pacífica e sem interrupção,
                    você pode ter direito à escritura definitiva mesmo sem ter comprado o imóvel.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-emerald-200">
                <div className="text-3xl font-bold text-emerald-600">5.000+</div>
                <div className="text-sm">A partir de R$</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-emerald-200">
                <div className="text-3xl font-bold text-emerald-600">10+</div>
                <div className="text-sm">Anos Experiência</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-emerald-200">
                <div className="text-3xl font-bold text-emerald-600">200+</div>
                <div className="text-sm">Imóveis Regularizados</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-xl px-10 py-8 font-bold shadow-xl bg-emerald-600 hover:bg-emerald-700"
                onClick={handleCTA}
              >
                <Home className="h-6 w-6 mr-2" />
                REGULARIZAR MEU IMÓVEL
                <ArrowRight className="h-6 w-6 ml-2" />
              </Button>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              ⚡ Análise gratuita • Parcelamento disponível • Atendimento personalizado
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
                <Home className="h-10 w-10 mx-auto mb-2 text-emerald-600" />
                <div className="text-2xl font-bold">200+</div>
                <div className="text-sm text-muted-foreground">Imóveis Regularizados</div>
              </div>
              <div>
                <Users className="h-10 w-10 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold">300+</div>
                <div className="text-sm text-muted-foreground">Famílias Atendidas</div>
              </div>
              <div>
                <TrendingUp className="h-10 w-10 mx-auto mb-2 text-teal-600" />
                <div className="text-2xl font-bold">R$ 150k+</div>
                <div className="text-sm text-muted-foreground">Valor Médio/Imóvel</div>
              </div>
              <div>
                <Award className="h-10 w-10 mx-auto mb-2 text-orange-600" />
                <div className="text-2xl font-bold">95%</div>
                <div className="text-sm text-muted-foreground">Taxa de Sucesso</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AgitationSection
        problem="Morar em um imóvel sem escritura traz riscos enormes: você não pode vender, não pode financiar, não pode deixar de herança legalmente, e corre o risco de perder tudo a qualquer momento."
        agitationPoints={[
          'Sem escritura, você não tem segurança jurídica sobre o imóvel',
          'Impossível vender, alugar ou financiar legalmente o imóvel',
          'Risco de perder tudo se os verdadeiros donos aparecerem',
          'Seus herdeiros podem ficar sem nada após sua morte',
        ]}
      />

      <SolutionSection
        title="Como Regularizamos Seu Imóvel por Usucapião"
        subtitle="Processo completo e seguro para você ter a escritura definitiva"
        solutionSteps={[
          'Análise GRATUITA do caso - Verificamos se você preenche os requisitos',
          'Levantamento documental - Reunimos todas as provas necessárias',
          'Escolha da melhor modalidade - Urbano, rural, familiar ou especial',
          'Protocolo judicial ou extrajudicial - Optamos pela via mais rápida',
          'Acompanhamento de todo o processo - Até a escritura definitiva',
          'Registro em cartório - Garantimos que o imóvel fique em seu nome',
        ]}
        onCTA={handleCTA}
      />

      {/* Services Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Nossos Serviços</h2>
            <p className="text-center text-muted-foreground mb-12">
              Regularização completa do seu imóvel por usucapião
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Análise */}
              <Card>
                <CardContent className="pt-6">
                  <FileText className="h-12 w-12 text-emerald-600 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Análise</h3>
                  <p className="text-muted-foreground mb-4">
                    Verificação completa dos requisitos para usucapião
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Análise gratuita do caso</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Verificação de requisitos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Orientação estratégica</span>
                    </li>
                  </ul>
                  <div className="text-2xl font-bold text-emerald-600 mb-2">GRÁTIS</div>
                  <Button variant="outline" className="w-full" onClick={handleCTA}>
                    Solicitar Análise
                  </Button>
                </CardContent>
              </Card>

              {/* Usucapião Extrajudicial */}
              <Card className="border-emerald-600 border-2 shadow-lg relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                    ⭐ MAIS RÁPIDO
                  </span>
                </div>
                <CardContent className="pt-6">
                  <Zap className="h-12 w-12 text-green-600 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Extrajudicial</h3>
                  <p className="text-muted-foreground mb-4">
                    Regularização via cartório (mais rápido)
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Processo em cartório</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Muito mais rápido</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Toda documentação incluída</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Acompanhamento completo</span>
                    </li>
                  </ul>
                  <div className="text-2xl font-bold text-emerald-600 mb-1">A partir de</div>
                  <div className="text-3xl font-bold text-emerald-600 mb-4">R$ 5.000</div>
                  <Button className="w-full text-lg bg-emerald-600 hover:bg-emerald-700" onClick={handleCTA}>
                    <Zap className="h-5 w-5 mr-2" />
                    Contratar Agora
                  </Button>
                </CardContent>
              </Card>

              {/* Usucapião Judicial */}
              <Card>
                <CardContent className="pt-6">
                  <Scale className="h-12 w-12 text-teal-600 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Judicial</h3>
                  <p className="text-muted-foreground mb-4">
                    Regularização via processo judicial
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Processo na justiça</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Para casos complexos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Sentença judicial</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Registro definitivo</span>
                    </li>
                  </ul>
                  <div className="text-2xl font-bold text-emerald-600 mb-1">A partir de</div>
                  <div className="text-3xl font-bold text-emerald-600 mb-4">R$ 7.000</div>
                  <Button variant="outline" className="w-full" onClick={handleCTA}>
                    Saber Mais
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border-l-4 border-emerald-500">
              <p className="text-sm">
                💡 <strong>Prazos:</strong> Extrajudicial: 6 a 12 meses • Judicial: 1 a 3 anos (dependendo da complexidade)
              </p>
            </div>
          </div>
        </div>
      </section>

      <CredentialsSection
        lawyerName="Equipe Garcez Palha"
        experience="10+ anos em Direito Imobiliário"
        specialization="Especialistas em Usucapião e Regularização Fundiária"
        stats={{
          years: 10,
          cases: 200,
          successRate: 95,
          clients: 300,
        }}
      />

      <TestimonialsSection />

      <GuaranteeSection
        guaranteeTitle="Análise Gratuita do Seu Caso"
        guaranteeDescription="Verificamos gratuitamente se você tem direito à usucapião. Só contrata se quiser prosseguir."
        guaranteePeriod="gratuito"
      />

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Regularize Seu Imóvel Agora
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Conquiste a escritura definitiva do seu imóvel por usucapião.
            <strong className="block mt-2">Análise Gratuita • Parcelamento • Resultado Garantido</strong>
          </p>
          <Button
            size="lg"
            className="bg-white text-emerald-900 hover:bg-gray-100 text-xl px-12 py-8 font-bold shadow-2xl"
            onClick={handleCTA}
          >
            <Home className="h-6 w-6 mr-2" />
            REGULARIZAR MEU IMÓVEL
            <ArrowRight className="h-6 w-6 ml-2" />
          </Button>
          <p className="mt-4 text-sm">
            Mais de 200 imóveis regularizados com sucesso
          </p>
        </div>
      </section>
    </div>
  )
}
