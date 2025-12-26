'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Check, Shield, Clock, Award, ArrowRight, AlertTriangle,
  TrendingUp, Users, Star, Zap, FileText, Banknote, DollarSign
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

export default function DesbloqueioContaPage() {
  const router = useRouter()

  const handleCTA = () => {
    router.push('/checkout?product=desbloqueio-conta')
  }

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Desbloqueio de Conta Bancária em 3-7 Dias | Garcez Palha"
        description="Conta bloqueada? Desbloqueie em 3-7 dias com ação judicial especializada. 95% de taxa de sucesso. Mais de 500 contas desbloqueadas. Garantia de satisfação."
        keywords={['desbloqueio conta bancária', 'conta bloqueada', 'poupança bloqueada', 'bloqueio judicial', 'desbloquear conta banco']}
        productName="Desbloqueio de Conta Bancária"
        price={250000}
        category="financeiro"
        canonicalUrl="https://garcezpalha.com.br/financeiro/desbloqueio-conta"
      />

      <UrgencyBanner
        countdown={true}
        countdownMinutes={60}
        message="⚠️ CONTA BLOQUEADA? Desbloqueio em 3-7 dias - Consulta Gratuita"
        discount="ANÁLISE GRÁTIS"
        onCTA={handleCTA}
        ctaText="Desbloquear Minha Conta"
      />

      <WhatsAppFloat
        phoneNumber="5521995354010"
        message="Olá! Minha conta bancária está bloqueada e preciso de ajuda urgente."
        position="bottom-right"
        showTooltip={true}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full mb-6">
              <Banknote className="h-5 w-5" />
              <span className="font-semibold">Desbloqueio Urgente</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Conta Bancária Bloqueada?<br />
              <span className="text-primary">Desbloqueie em 3-7 Dias</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8">
              Ação judicial especializada para recuperar o acesso à sua conta bancária ou poupança.<br />
              95% de taxa de sucesso. Mais de 500 contas desbloqueadas.
            </p>

            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mb-8 border-l-4 border-blue-600">
              <div className="flex items-start gap-3 text-left">
                <AlertTriangle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2">Situação Urgente?</h3>
                  <p className="text-muted-foreground">
                    Conta bloqueada impede pagamentos, recebimento de salário e movimentações essenciais.
                    Cada dia sem solução aumenta o prejuízo. Agimos com urgência para proteger seus direitos.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-blue-200">
                <div className="text-3xl font-bold text-blue-600">500+</div>
                <div className="text-sm">Contas Desbloqueadas</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-blue-200">
                <div className="text-3xl font-bold text-blue-600">3-7</div>
                <div className="text-sm">Dias para Desbloquear</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-blue-200">
                <div className="text-3xl font-bold text-blue-600">95%</div>
                <div className="text-sm">Taxa de Sucesso</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-blue-200">
                <div className="text-3xl font-bold text-blue-600">24h</div>
                <div className="text-sm">Resposta Inicial</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-xl px-10 py-8 font-bold shadow-xl"
                onClick={handleCTA}
              >
                <Banknote className="h-6 w-6 mr-2" />
                DESBLOQUEAR MINHA CONTA
                <ArrowRight className="h-6 w-6 ml-2" />
              </Button>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              ⚡ Consulta gratuita • Atendimento 24/7 • 100% online
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
                <Banknote className="h-10 w-10 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold">500+</div>
                <div className="text-sm text-muted-foreground">Contas Desbloqueadas</div>
              </div>
              <div>
                <Clock className="h-10 w-10 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold">3-7 dias</div>
                <div className="text-sm text-muted-foreground">Prazo Médio</div>
              </div>
              <div>
                <TrendingUp className="h-10 w-10 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold">95%</div>
                <div className="text-sm text-muted-foreground">Taxa de Sucesso</div>
              </div>
              <div>
                <Award className="h-10 w-10 mx-auto mb-2 text-orange-600" />
                <div className="text-2xl font-bold">R$ 10k+</div>
                <div className="text-sm text-muted-foreground">Indenizações Obtidas</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AgitationSection
        problem="Conta bancária bloqueada impede sua vida financeira e causa prejuízos diários crescentes. Sem acesso ao seu dinheiro, você não consegue pagar contas, receber salário ou fazer movimentações essenciais."
        agitationPoints={[
          'Não consegue pagar contas e boletos essenciais',
          'Salário bloqueado e inacessível na conta',
          'Impossível fazer transferências ou pagamentos urgentes',
          'Cartões de débito e crédito também bloqueados',
          'Prejuízo financeiro diário crescente e multas acumulando',
          'Risco de perder emprego ou oportunidades importantes',
        ]}
      />

      <SolutionSection
        title="Como Desbloqueamos Sua Conta em 3-7 Dias"
        subtitle="Processo judicial especializado e comprovadamente eficaz"
        solutionSteps={[
          'Análise GRATUITA do motivo do bloqueio - Identificamos a causa e estratégia',
          'Petição de urgência com liminar - Solicitamos desbloqueio imediato ao juiz',
          'Acompanhamento diário - Monitoramos o processo 24/7',
          'Comunicação com banco e vara judicial - Agilizamos a execução',
          'Desbloqueio efetivo em 3-7 dias - Recuperação do acesso total',
          'Indenização por danos morais - Se bloqueio foi indevido (R$ 5-15 mil)',
        ]}
        onCTA={handleCTA}
      />

      {/* Services Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Planos de Desbloqueio</h2>
            <p className="text-center text-muted-foreground mb-12">
              Soluções para diferentes situações de bloqueio bancário
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Básico */}
              <Card>
                <CardContent className="pt-6">
                  <FileText className="h-12 w-12 text-blue-600 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Análise Gratuita</h3>
                  <p className="text-muted-foreground mb-4">
                    Avaliação completa do seu caso sem custo
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Análise do bloqueio</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Orientação jurídica</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Estratégia sugerida</span>
                    </li>
                  </ul>
                  <div className="text-2xl font-bold text-primary mb-2">GRÁTIS</div>
                  <Button variant="outline" className="w-full" onClick={handleCTA}>
                    Solicitar Análise
                  </Button>
                </CardContent>
              </Card>

              {/* Desbloqueio Urgente */}
              <Card className="border-primary border-2 shadow-lg relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                    ⭐ MAIS PROCURADO
                  </span>
                </div>
                <CardContent className="pt-6">
                  <Zap className="h-12 w-12 text-green-600 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Desbloqueio Urgente</h3>
                  <p className="text-muted-foreground mb-4">
                    Ação judicial completa com liminar
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Tudo da Análise Gratuita</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Petição com pedido de liminar</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Desbloqueio em 3-7 dias</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Acompanhamento 24/7</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">100% online</span>
                    </li>
                  </ul>
                  <div className="text-2xl font-bold text-primary mb-1">R$ 2.500</div>
                  <div className="text-sm text-muted-foreground mb-4">ou 12x sem juros</div>
                  <Button className="w-full text-lg" onClick={handleCTA}>
                    <Zap className="h-5 w-5 mr-2" />
                    Desbloquear Agora
                  </Button>
                </CardContent>
              </Card>

              {/* Completo */}
              <Card>
                <CardContent className="pt-6">
                  <DollarSign className="h-12 w-12 text-purple-600 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Desbloqueio + Indenização</h3>
                  <p className="text-muted-foreground mb-4">
                    Desbloqueio + danos morais por bloqueio indevido
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Tudo do Desbloqueio Urgente</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Pedido de danos morais</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Indenização R$ 5-15 mil</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Custas pagas pelo banco</span>
                    </li>
                  </ul>
                  <div className="text-2xl font-bold text-primary mb-1">R$ 3.500</div>
                  <div className="text-sm text-muted-foreground mb-4">+ 20% da indenização</div>
                  <Button variant="outline" className="w-full" onClick={handleCTA}>
                    Solicitar Indenização
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
              <p className="text-sm">
                💡 <strong>Garantia Total:</strong> Se não conseguirmos desbloquear sua conta, devolvemos 100% do valor pago.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CredentialsSection
        lawyerName="Equipe Garcez Palha"
        experience="10+ anos em Direito Bancário"
        specialization="Especialistas em Bloqueios e Disputas Bancárias"
        stats={{
          years: 10,
          cases: 500,
          successRate: 95,
          clients: 600,
        }}
      />

      <TestimonialsSection />

      <GuaranteeSection
        guaranteeTitle="Garantia de Desbloqueio ou Dinheiro de Volta"
        guaranteeDescription="Se não conseguirmos desbloquear sua conta bancária, devolvemos 100% do valor pago. Sem perguntas. Confiamos totalmente no nosso trabalho."
        guaranteePeriod="total"
      />

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Recupere o Acesso à Sua Conta Agora
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Não deixe sua conta bloqueada causar mais prejuízos. Desbloqueio em 3-7 dias.
            <strong className="block mt-2">500+ contas desbloqueadas • 95% de sucesso • 100% online</strong>
          </p>
          <Button
            size="lg"
            className="bg-white text-blue-900 hover:bg-gray-100 text-xl px-12 py-8 font-bold shadow-2xl"
            onClick={handleCTA}
          >
            <Banknote className="h-6 w-6 mr-2" />
            DESBLOQUEAR MINHA CONTA
            <ArrowRight className="h-6 w-6 ml-2" />
          </Button>
          <p className="mt-4 text-sm">
            Consulta gratuita sem compromisso • Resposta em 24h
          </p>
        </div>
      </section>
    </div>
  )
}
