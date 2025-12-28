'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Check, Shield, Clock, Award, ArrowRight, AlertTriangle,
  TrendingUp, Users, Star, Zap, FileText, Briefcase, Scale
} from 'lucide-react'
import {
  AgitationSection,
  SolutionSection,
  CredentialsSection,
  GuaranteeSection,
  TestimonialsSection,
  UrgencyBanner,
  SEOHead,
} from '@/components/vsl'

export default function InventarioPage() {
  const router = useRouter()

  const handleCTA = () => {
    router.push('/checkout?product=inventario')
  }

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Inventário - Judicial e Extrajudicial"
        description="Inventário rápido e descomplicado. Judicial ou extrajudicial. Partilha de bens com segurança e agilidade. Especialistas em sucessões."
        keywords={['inventário', 'inventário extrajudicial', 'partilha de bens', 'sucessão', 'advogado inventário']}
        productName="Inventário"
        price={500000}
        category="patrimonial"
        canonicalUrl="https://garcezpalha.com.br/inventario"
      />

      <UrgencyBanner
        countdown={true}
        countdownMinutes={60}
        message="📋 CONSULTORIA GRATUITA - Descubra a forma mais rápida de fazer seu inventário"
        discount="CONSULTORIA GRÁTIS"
        onCTA={handleCTA}
        ctaText="Solicitar Consultoria"
      />


      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-full mb-6">
              <Briefcase className="h-5 w-5" />
              <span className="font-semibold">Inventário Judicial e Extrajudicial</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Inventário Rápido<br />
              <span className="text-emerald-600">E Descomplicado</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8">
              Judicial ou extrajudicial. Partilha de bens com segurança e agilidade.<br />
              Regularize a herança e finalize tudo o mais rápido possível.
            </p>

            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mb-8 border-l-4 border-emerald-600">
              <div className="flex items-start gap-3 text-left">
                <Briefcase className="h-6 w-6 text-emerald-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2">Você Sabia?</h3>
                  <p className="text-muted-foreground">
                    O inventário extrajudicial pode ser concluído em 30 a 60 dias, enquanto o judicial
                    pode levar anos. Se todos os herdeiros concordam e não há menores, escolha o extrajudicial.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-emerald-200">
                <div className="text-3xl font-bold text-emerald-600">R$ 5-6k</div>
                <div className="text-sm">Preço fixo</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-emerald-200">
                <div className="text-3xl font-bold text-emerald-600">11+</div>
                <div className="text-sm">Anos Experiência</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-emerald-200">
                <div className="text-3xl font-bold text-emerald-600">250+</div>
                <div className="text-sm">Inventários Concluídos</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-xl px-10 py-8 font-bold shadow-xl bg-emerald-600 hover:bg-emerald-700"
                onClick={handleCTA}
              >
                <Briefcase className="h-6 w-6 mr-2" />
                INICIAR INVENTÁRIO
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
                <Briefcase className="h-10 w-10 mx-auto mb-2 text-emerald-600" />
                <div className="text-2xl font-bold">250+</div>
                <div className="text-sm text-muted-foreground">Inventários Concluídos</div>
              </div>
              <div>
                <Users className="h-10 w-10 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold">400+</div>
                <div className="text-sm text-muted-foreground">Famílias Atendidas</div>
              </div>
              <div>
                <Clock className="h-10 w-10 mx-auto mb-2 text-teal-600" />
                <div className="text-2xl font-bold">60 dias</div>
                <div className="text-sm text-muted-foreground">Média Extrajudicial</div>
              </div>
              <div>
                <Award className="h-10 w-10 mx-auto mb-2 text-orange-600" />
                <div className="text-2xl font-bold">97%</div>
                <div className="text-sm text-muted-foreground">Taxa de Sucesso</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AgitationSection
        problem="Inventário demorado significa patrimônio bloqueado: você não pode vender, não pode usar, não pode acessar contas bancárias. E cada mês de atraso são custos acumulando."
        agitationPoints={[
          'Patrimônio completamente bloqueado até o fim do inventário',
          'Custos mensais (IPTU, condomínio, impostos) sem poder usar os bens',
          'Impossível vender, alugar ou usar o patrimônio herdado',
          'Multas e juros acumulam se demorar mais de 60 dias após o falecimento',
        ]}
      />

      <SolutionSection
        title="Como Fazemos Seu Inventário Rápido"
        subtitle="Processo ágil e descomplicado, judicial ou extrajudicial"
        solutionSteps={[
          'Consultoria GRATUITA - Analisamos o caso e definimos a melhor via',
          'Levantamento patrimonial - Identificamos todos os bens e dívidas',
          'Documentação completa - Reunimos certidões e documentos necessários',
          'Protocolo judicial ou cartorial - Escolhemos a via mais rápida',
          'Partilha e pagamento de impostos - ITCMD com possível parcelamento',
          'Conclusão e registro - Bens liberados e regularizados',
        ]}
        onCTA={handleCTA}
      />

      {/* Services Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Nossos Serviços</h2>
            <p className="text-center text-muted-foreground mb-12">
              Inventário completo, judicial ou extrajudicial
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Consultoria */}
              <Card>
                <CardContent className="pt-6">
                  <FileText className="h-12 w-12 text-emerald-600 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Consultoria</h3>
                  <p className="text-muted-foreground mb-4">
                    Análise do caso e melhor estratégia
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Análise gratuita do caso</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Judicial ou extrajudicial?</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Estimativa de prazos e custos</span>
                    </li>
                  </ul>
                  <div className="text-2xl font-bold text-emerald-600 mb-2">GRÁTIS</div>
                  <Button variant="outline" className="w-full" onClick={handleCTA}>
                    Solicitar Consultoria
                  </Button>
                </CardContent>
              </Card>

              {/* Extrajudicial */}
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
                    Em cartório - 30 a 60 dias
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Muito mais rápido</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Menos burocrático</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Processo em cartório</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Todos os documentos incluídos</span>
                    </li>
                  </ul>
                  <div className="text-2xl font-bold text-emerald-600 mb-1">R$ 5.000</div>
                  <div className="text-sm text-muted-foreground mb-4">a R$ 6.000</div>
                  <Button className="w-full text-lg bg-emerald-600 hover:bg-emerald-700" onClick={handleCTA}>
                    <Zap className="h-5 w-5 mr-2" />
                    Contratar Agora
                  </Button>
                </CardContent>
              </Card>

              {/* Judicial */}
              <Card>
                <CardContent className="pt-6">
                  <Scale className="h-12 w-12 text-teal-600 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Judicial</h3>
                  <p className="text-muted-foreground mb-4">
                    Na justiça - casos complexos
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Para casos com litígio</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Herdeiros menores</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Discordância entre herdeiros</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Acompanhamento completo</span>
                    </li>
                  </ul>
                  <div className="text-2xl font-bold text-emerald-600 mb-1">R$ 5.000</div>
                  <div className="text-sm text-muted-foreground mb-4">a R$ 6.000</div>
                  <Button variant="outline" className="w-full" onClick={handleCTA}>
                    Saber Mais
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border-l-4 border-emerald-500">
              <p className="text-sm">
                💡 <strong>Prazos:</strong> Extrajudicial: 30 a 60 dias • Judicial: 1 a 3 anos (dependendo da complexidade)
              </p>
            </div>
          </div>
        </div>
      </section>

      <CredentialsSection
        lawyerName="Equipe Garcez Palha"
        experience="11+ anos em Direito Sucessório"
        specialization="Especialistas em Inventário e Sucessões"
        stats={{
          years: 11,
          cases: 250,
          successRate: 97,
          clients: 400,
        }}
      />

      <TestimonialsSection />

      <GuaranteeSection
        guaranteeTitle="Consultoria Gratuita do Seu Caso"
        guaranteeDescription="Analisamos gratuitamente seu caso e indicamos a melhor via. Só contrata se quiser prosseguir."
        guaranteePeriod="gratuito"
      />

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Faça Seu Inventário Agora
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Libere o patrimônio da sua família de forma rápida e segura.
            <strong className="block mt-2">Consultoria Gratuita • Parcelamento • Agilidade Garantida</strong>
          </p>
          <Button
            size="lg"
            className="bg-white text-emerald-900 hover:bg-gray-100 text-xl px-12 py-8 font-bold shadow-2xl"
            onClick={handleCTA}
          >
            <Briefcase className="h-6 w-6 mr-2" />
            INICIAR INVENTÁRIO
            <ArrowRight className="h-6 w-6 ml-2" />
          </Button>
          <p className="mt-4 text-sm">
            Mais de 250 inventários concluídos com sucesso
          </p>
        </div>
      </section>
    </div>
  )
}
