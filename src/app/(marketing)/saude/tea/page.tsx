'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Check, Shield, Clock, Award, ArrowRight, AlertTriangle,
  TrendingUp, Users, Star, Zap, FileText, Brain, Scale
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

export default function TeaPage() {
  const router = useRouter()

  const handleCTA = () => {
    router.push('/checkout?product=tea')
  }

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Tratamento TEA (Autismo) - Obrigue Plano a Cobrir"
        description="Plano negou tratamento para autismo (TEA)? Obrigue-o a fornecer ABA, fonoaudiologia, terapia ocupacional e psicologia. Especialistas em direito à saúde."
        keywords={['TEA', 'autismo', 'tratamento autismo', 'ABA', 'plano de saúde', 'direito à saúde']}
        productName="Tratamento TEA"
        price={400000}
        category="saude"
        canonicalUrl="https://garcezpalha.com.br/tea"
      />

      <UrgencyBanner
        countdown={true}
        countdownMinutes={60}
        message="🧠 ANÁLISE GRATUITA - Garanta o tratamento completo para seu filho"
        discount="ANÁLISE GRÁTIS"
        onCTA={handleCTA}
        ctaText="Solicitar Análise"
      />

      <WhatsAppFloat
        phoneNumber="5511999999999"
        message="Olá! Meu plano negou tratamento para TEA e preciso de ajuda urgente."
        position="bottom-right"
        showTooltip={true}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-rose-600 text-white px-4 py-2 rounded-full mb-6">
              <Brain className="h-5 w-5" />
              <span className="font-semibold">Tratamento TEA (Autismo)</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Plano Negou TEA?<br />
              <span className="text-rose-600">Garanta o Tratamento</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8">
              Seu plano é OBRIGADO a cobrir ABA, fonoaudiologia, terapia ocupacional e psicologia.<br />
              Conseguimos autorização rápida ou liminar judicial em 15 dias.
            </p>

            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mb-8 border-l-4 border-rose-600">
              <div className="flex items-start gap-3 text-left">
                <Brain className="h-6 w-6 text-rose-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2">Você Sabia?</h3>
                  <p className="text-muted-foreground">
                    A Lei 12.764/2012 (Lei Berenice Piana) garante tratamento completo e ilimitado para TEA.
                    Negar cobertura é crime e você tem direito a indenização por danos morais.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-rose-200">
                <div className="text-3xl font-bold text-rose-600">R$ 4.000</div>
                <div className="text-sm">Preço fixo</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-rose-200">
                <div className="text-3xl font-bold text-rose-600">9+</div>
                <div className="text-sm">Anos Experiência</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-rose-200">
                <div className="text-3xl font-bold text-rose-600">400+</div>
                <div className="text-sm">Tratamentos Garantidos</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-xl px-10 py-8 font-bold shadow-xl bg-rose-600 hover:bg-rose-700"
                onClick={handleCTA}
              >
                <Brain className="h-6 w-6 mr-2" />
                GARANTIR TRATAMENTO
                <ArrowRight className="h-6 w-6 ml-2" />
              </Button>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              ⚡ Análise gratuita • Liminar urgente • Resultado garantido
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
                <Brain className="h-10 w-10 mx-auto mb-2 text-rose-600" />
                <div className="text-2xl font-bold">400+</div>
                <div className="text-sm text-muted-foreground">Tratamentos Garantidos</div>
              </div>
              <div>
                <Users className="h-10 w-10 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold">500+</div>
                <div className="text-sm text-muted-foreground">Famílias Ajudadas</div>
              </div>
              <div>
                <Clock className="h-10 w-10 mx-auto mb-2 text-pink-600" />
                <div className="text-2xl font-bold">15 dias</div>
                <div className="text-sm text-muted-foreground">Média p/ Liminar</div>
              </div>
              <div>
                <Award className="h-10 w-10 mx-auto mb-2 text-orange-600" />
                <div className="text-2xl font-bold">96%</div>
                <div className="text-sm text-muted-foreground">Taxa de Sucesso</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AgitationSection
        problem="Cada dia sem tratamento adequado é um dia perdido no desenvolvimento do seu filho. A intervenção precoce é fundamental, e o plano está roubando o futuro da sua criança ao negar cobertura."
        agitationPoints={[
          'Intervenção precoce é crucial - cada dia perdido é irreversível',
          'Sem ABA e terapias, o desenvolvimento fica comprometido',
          'Planos negam ilegalmente mesmo com lei específica protegendo TEA',
          'Você paga caro pelo plano e ainda tem que pagar as terapias',
        ]}
      />

      <SolutionSection
        title="Como Garantimos o Tratamento TEA Para Seu Filho"
        subtitle="Processo rápido com liminar urgente e tratamento ilimitado"
        solutionSteps={[
          'Análise GRATUITA do caso - Verificamos laudo e plano de saúde',
          'Documentação completa - Laudos médicos e prescrições',
          'Notificação extrajudicial - Tentamos acordo rápido com o plano',
          'Ação judicial com liminar - Em 15 dias o tratamento é liberado',
          'Cobertura ilimitada - ABA, fono, TO, psicologia sem limite',
          'Danos morais - Você recebe indenização pela negativa ilegal',
        ]}
        onCTA={handleCTA}
      />

      {/* Services Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Nossos Serviços</h2>
            <p className="text-center text-muted-foreground mb-12">
              Garanta tratamento completo e ilimitado para TEA
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Análise */}
              <Card>
                <CardContent className="pt-6">
                  <FileText className="h-12 w-12 text-rose-600 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Análise</h3>
                  <p className="text-muted-foreground mb-4">
                    Verificação gratuita do caso
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Análise gratuita do laudo</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Verificação do plano</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Orientação completa</span>
                    </li>
                  </ul>
                  <div className="text-2xl font-bold text-rose-600 mb-2">GRÁTIS</div>
                  <Button variant="outline" className="w-full" onClick={handleCTA}>
                    Solicitar Análise
                  </Button>
                </CardContent>
              </Card>

              {/* Completo */}
              <Card className="border-rose-600 border-2 shadow-lg relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                    ⭐ MAIS COMPLETO
                  </span>
                </div>
                <CardContent className="pt-6">
                  <Brain className="h-12 w-12 text-green-600 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Completo</h3>
                  <p className="text-muted-foreground mb-4">
                    Liminar + Tratamento ilimitado
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Tentativa de acordo</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Liminar em 15 dias</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Cobertura ilimitada (ABA, fono, TO, psi)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Pedido de danos morais</span>
                    </li>
                  </ul>
                  <div className="text-3xl font-bold text-rose-600 mb-4">R$ 4.000</div>
                  <Button className="w-full text-lg bg-rose-600 hover:bg-rose-700" onClick={handleCTA}>
                    <Zap className="h-5 w-5 mr-2" />
                    Contratar Agora
                  </Button>
                </CardContent>
              </Card>

              {/* Urgente */}
              <Card>
                <CardContent className="pt-6">
                  <Zap className="h-12 w-12 text-pink-600 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Urgente</h3>
                  <p className="text-muted-foreground mb-4">
                    Tratamento em 10 dias
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Prioridade máxima</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Liminar em 10 dias</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Atendimento 24h</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Resultado garantido</span>
                    </li>
                  </ul>
                  <div className="text-3xl font-bold text-rose-600 mb-4">R$ 5.500</div>
                  <Button variant="outline" className="w-full" onClick={handleCTA}>
                    Saber Mais
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 p-4 bg-rose-50 dark:bg-rose-900/20 rounded-lg border-l-4 border-rose-500">
              <p className="text-sm">
                💡 <strong>Prazos:</strong> Acordo: 15 dias • Liminar: 10-15 dias • Tratamento ilimitado garantido por lei
              </p>
            </div>
          </div>
        </div>
      </section>

      <CredentialsSection
        lawyerName="Equipe Garcez Palha"
        experience="9+ anos em Direito à Saúde e TEA"
        specialization="Especialistas em Autismo (TEA) e Direito à Saúde"
        stats={{
          years: 9,
          cases: 400,
          successRate: 96,
          clients: 500,
        }}
      />

      <TestimonialsSection />

      <GuaranteeSection
        guaranteeTitle="Análise Gratuita do Laudo"
        guaranteeDescription="Analisamos gratuitamente o laudo do seu filho e o contrato do plano. Só contrata se tivermos certeza de vitória."
        guaranteePeriod="gratuito"
      />

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-rose-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Garanta o Tratamento do Seu Filho Agora
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Seu filho tem direito a tratamento completo e ilimitado. Não deixe o plano roubar o futuro dele.
            <strong className="block mt-2">Análise Gratuita • Liminar Urgente • Cobertura Ilimitada</strong>
          </p>
          <Button
            size="lg"
            className="bg-white text-rose-900 hover:bg-gray-100 text-xl px-12 py-8 font-bold shadow-2xl"
            onClick={handleCTA}
          >
            <Brain className="h-6 w-6 mr-2" />
            GARANTIR TRATAMENTO
            <ArrowRight className="h-6 w-6 ml-2" />
          </Button>
          <p className="mt-4 text-sm">
            Mais de 400 tratamentos TEA garantidos com sucesso
          </p>
        </div>
      </section>
    </div>
  )
}
