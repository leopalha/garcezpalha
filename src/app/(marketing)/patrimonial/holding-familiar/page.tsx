'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Check, Shield, Clock, Award, ArrowRight, AlertTriangle,
  TrendingUp, Users, Star, Zap, FileText, Building2, Scale
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

export default function HoldingFamiliarPage() {
  const router = useRouter()

  const handleCTA = () => {
    router.push('/checkout?product=holding-familiar')
  }

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Holding Familiar - Direito Imobiliário"
        description="Proteja seu patrimônio familiar com holding. Planejamento sucessório, redução de impostos e blindagem patrimonial. Especialistas em holdings familiares."
        keywords={['holding familiar', 'proteção patrimonial', 'planejamento sucessório', 'blindagem patrimonial', 'advogado sucessão']}
        productName="Holding Familiar"
        price={1000000}
        category="patrimonial"
        canonicalUrl="https://garcezpalha.com.br/holding-familiar"
      />

      <UrgencyBanner
        countdown={true}
        countdownMinutes={60}
        message="🏢 CONSULTORIA GRATUITA - Descubra como proteger seu patrimônio com holding familiar"
        discount="CONSULTORIA GRÁTIS"
        onCTA={handleCTA}
        ctaText="Solicitar Consultoria"
      />

      <WhatsAppFloat
        phoneNumber="5511999999999"
        message="Olá! Gostaria de saber mais sobre holding familiar e proteção patrimonial."
        position="bottom-right"
        showTooltip={true}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-full mb-6">
              <Building2 className="h-5 w-5" />
              <span className="font-semibold">Direito Imobiliário</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Proteja Seu Patrimônio<br />
              <span className="text-emerald-600">Com Holding Familiar</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8">
              Planejamento sucessório, redução de impostos e blindagem patrimonial.<br />
              Estruturação completa da sua holding familiar com segurança jurídica total.
            </p>

            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mb-8 border-l-4 border-emerald-600">
              <div className="flex items-start gap-3 text-left">
                <Building2 className="h-6 w-6 text-emerald-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2">Você Sabia?</h3>
                  <p className="text-muted-foreground">
                    Sem planejamento sucessório, seu patrimônio pode ficar bloqueado por anos em inventário,
                    seus herdeiros podem pagar até 8% de ITCMD, e você pode perder tudo em processos judiciais.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-emerald-200">
                <div className="text-3xl font-bold text-emerald-600">10.000+</div>
                <div className="text-sm">A partir de R$</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-emerald-200">
                <div className="text-3xl font-bold text-emerald-600">12+</div>
                <div className="text-sm">Anos Experiência</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-emerald-200">
                <div className="text-3xl font-bold text-emerald-600">150+</div>
                <div className="text-sm">Holdings Estruturadas</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-xl px-10 py-8 font-bold shadow-xl bg-emerald-600 hover:bg-emerald-700"
                onClick={handleCTA}
              >
                <Building2 className="h-6 w-6 mr-2" />
                PROTEGER MEU PATRIMÔNIO
                <ArrowRight className="h-6 w-6 ml-2" />
              </Button>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              ⚡ Consultoria gratuita • Parcelamento disponível • Atendimento personalizado
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
                <Building2 className="h-10 w-10 mx-auto mb-2 text-emerald-600" />
                <div className="text-2xl font-bold">150+</div>
                <div className="text-sm text-muted-foreground">Holdings Estruturadas</div>
              </div>
              <div>
                <Users className="h-10 w-10 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold">200+</div>
                <div className="text-sm text-muted-foreground">Famílias Atendidas</div>
              </div>
              <div>
                <TrendingUp className="h-10 w-10 mx-auto mb-2 text-teal-600" />
                <div className="text-2xl font-bold">R$ 5M+</div>
                <div className="text-sm text-muted-foreground">Patrimônio Médio</div>
              </div>
              <div>
                <Award className="h-10 w-10 mx-auto mb-2 text-orange-600" />
                <div className="text-2xl font-bold">98%</div>
                <div className="text-sm text-muted-foreground">Taxa de Sucesso</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AgitationSection
        problem="Sem planejamento sucessório, seu patrimônio fica vulnerável: inventário pode durar anos, impostos podem chegar a 8%, processos judiciais podem penhorar seus bens, e brigas familiares podem destruir tudo que você construiu."
        agitationPoints={[
          'Inventário pode levar 5-10 anos e custar até 10% do patrimônio',
          'ITCMD de até 8% sobre todo o valor transmitido aos herdeiros',
          'Seus bens podem ser penhorados em processos judiciais',
          'Brigas familiares podem destruir o patrimônio da família',
        ]}
      />

      <SolutionSection
        title="Como Estruturamos Sua Holding Familiar"
        subtitle="Proteção completa do seu patrimônio com segurança jurídica"
        solutionSteps={[
          'Consultoria GRATUITA - Analisamos seu patrimônio e objetivos',
          'Planejamento estratégico - Definimos a melhor estrutura para sua família',
          'Constituição da holding - Criamos a empresa e transferimos os bens',
          'Blindagem patrimonial - Protegemos contra penhoras e credores',
          'Planejamento sucessório - Evitamos inventário e reduzimos impostos',
          'Governança familiar - Estabelecemos regras claras para gestão',
        ]}
        onCTA={handleCTA}
      />

      {/* Services Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Nossos Serviços</h2>
            <p className="text-center text-muted-foreground mb-12">
              Estruturação completa da sua holding familiar
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Consultoria */}
              <Card>
                <CardContent className="pt-6">
                  <FileText className="h-12 w-12 text-emerald-600 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Consultoria</h3>
                  <p className="text-muted-foreground mb-4">
                    Análise completa do seu patrimônio
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Análise patrimonial gratuita</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Diagnóstico de riscos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Orientação estratégica</span>
                    </li>
                  </ul>
                  <div className="text-2xl font-bold text-emerald-600 mb-2">GRÁTIS</div>
                  <Button variant="outline" className="w-full" onClick={handleCTA}>
                    Solicitar Consultoria
                  </Button>
                </CardContent>
              </Card>

              {/* Holding Completa */}
              <Card className="border-emerald-600 border-2 shadow-lg relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                    ⭐ MAIS COMPLETO
                  </span>
                </div>
                <CardContent className="pt-6">
                  <Building2 className="h-12 w-12 text-green-600 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Holding Completa</h3>
                  <p className="text-muted-foreground mb-4">
                    Estruturação completa com blindagem
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Constituição da holding</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Transferência de bens</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Blindagem patrimonial</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Planejamento sucessório</span>
                    </li>
                  </ul>
                  <div className="text-2xl font-bold text-emerald-600 mb-1">A partir de</div>
                  <div className="text-3xl font-bold text-emerald-600 mb-4">R$ 10.000</div>
                  <Button className="w-full text-lg bg-emerald-600 hover:bg-emerald-700" onClick={handleCTA}>
                    <Zap className="h-5 w-5 mr-2" />
                    Contratar Agora
                  </Button>
                </CardContent>
              </Card>

              {/* Governança */}
              <Card>
                <CardContent className="pt-6">
                  <Scale className="h-12 w-12 text-teal-600 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Governança</h3>
                  <p className="text-muted-foreground mb-4">
                    Acordo de sócios e regras claras
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Acordo de quotistas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Regras de administração</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Protocolo familiar</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Prevenção de conflitos</span>
                    </li>
                  </ul>
                  <div className="text-2xl font-bold text-emerald-600 mb-1">A partir de</div>
                  <div className="text-3xl font-bold text-emerald-600 mb-4">R$ 5.000</div>
                  <Button variant="outline" className="w-full" onClick={handleCTA}>
                    Saber Mais
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border-l-4 border-emerald-500">
              <p className="text-sm">
                💡 <strong>Prazos:</strong> Constituição: 30 a 60 dias • Transferência de bens: 3 a 6 meses (dependendo da complexidade)
              </p>
            </div>
          </div>
        </div>
      </section>

      <CredentialsSection
        lawyerName="Equipe Garcez Palha"
        experience="12+ anos em Direito Sucessório"
        specialization="Especialistas em Holdings Familiares e Planejamento Patrimonial"
        stats={{
          years: 12,
          cases: 150,
          successRate: 98,
          clients: 200,
        }}
      />

      <TestimonialsSection />

      <GuaranteeSection
        guaranteeTitle="Consultoria Gratuita do Seu Patrimônio"
        guaranteeDescription="Analisamos gratuitamente seu patrimônio e mostramos como proteger sua família. Só contrata se quiser prosseguir."
        guaranteePeriod="gratuito"
      />

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Proteja Seu Patrimônio Agora
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Estruture sua holding familiar e garanta o futuro da sua família.
            <strong className="block mt-2">Consultoria Gratuita • Parcelamento • Segurança Total</strong>
          </p>
          <Button
            size="lg"
            className="bg-white text-emerald-900 hover:bg-gray-100 text-xl px-12 py-8 font-bold shadow-2xl"
            onClick={handleCTA}
          >
            <Building2 className="h-6 w-6 mr-2" />
            PROTEGER MEU PATRIMÔNIO
            <ArrowRight className="h-6 w-6 ml-2" />
          </Button>
          <p className="mt-4 text-sm">
            Mais de 150 holdings estruturadas com sucesso
          </p>
        </div>
      </section>
    </div>
  )
}
