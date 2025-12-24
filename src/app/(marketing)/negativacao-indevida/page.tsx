'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Check, Shield, Clock, Award, ArrowRight, AlertTriangle,
  TrendingUp, DollarSign, Users, Star, Zap, Ban, FileWarning
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

export default function NegativacaoIndevidaPage() {
  const router = useRouter()

  const handleCTA = () => {
    router.push('/checkout?product=negativacao-indevida')
  }

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Negativação Indevida - Indenização até R$ 15.000"
        description="Nome sujo sem dever nada? Você tem direito a indenização de até R$ 15.000. Retiramos seu nome do SPC/Serasa e ainda processamos a empresa."
        keywords={['negativação indevida', 'nome sujo', 'SPC Serasa', 'indenização negativação', 'limpar nome']}
        productName="Negativação Indevida"
        price={180000}
        category="financeiro"
        canonicalUrl="https://garcezpalha.com.br/negativacao-indevida"
      />

      <UrgencyBanner
        countdown={true}
        countdownMinutes={45}
        message="🔥 Oferta Limitada: Análise gratuita + honorários facilitados"
        discount="ANÁLISE GRÁTIS"
        onCTA={handleCTA}
        ctaText="Verificar Meu Direito Agora"
      />

      <WhatsAppFloat
        phoneNumber="5511999999999"
        message="Olá! Meu nome está negativado indevidamente e quero saber meus direitos."
        position="bottom-right"
        showTooltip={true}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full mb-6">
              <Ban className="h-5 w-5" />
              <span className="font-semibold">URGENTE: Negativação Indevida</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Nome Sujo Sem Dever Nada?<br />
              <span className="text-primary">Direito a Indenização de até R$ 15.000</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8">
              Cartão negado? Financiamento recusado? Cobrança que você não fez?<br />
              Negativação indevida gera DANO MORAL. Você pode processar e receber!
            </p>

            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mb-8 border-l-4 border-red-600">
              <div className="flex items-start gap-3 text-left">
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2">Você Está Nesta Situação?</h3>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>❌ Cartão negado na hora de comprar</li>
                    <li>❌ Financiamento recusado sem explicação</li>
                    <li>❌ Cobrança de dívida que você não fez</li>
                    <li>❌ Nome no SPC/Serasa sem ter sido avisado</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-red-200">
                <div className="text-3xl font-bold text-red-600">R$ 15k</div>
                <div className="text-sm">Indenização Máxima</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-red-200">
                <div className="text-3xl font-bold text-red-600">24-72h</div>
                <div className="text-sm">Liminar Retirar Nome</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-red-200">
                <div className="text-3xl font-bold text-red-600">3-6m</div>
                <div className="text-sm">Prazo Sentença</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-xl px-10 py-8 font-bold shadow-xl"
                onClick={handleCTA}
              >
                <FileWarning className="h-6 w-6 mr-2" />
                PROCESSAR AGORA - R$ 1.800
                <ArrowRight className="h-6 w-6 ml-2" />
              </Button>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              ⚡ + 30% da indenização no êxito • Liminar em 24-72h • Análise gratuita
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
                <DollarSign className="h-10 w-10 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold">R$ 8.5k</div>
                <div className="text-sm text-muted-foreground">Indenização Média</div>
              </div>
              <div>
                <Users className="h-10 w-10 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold">500+</div>
                <div className="text-sm text-muted-foreground">Casos Ganhos</div>
              </div>
              <div>
                <Clock className="h-10 w-10 mx-auto mb-2 text-orange-600" />
                <div className="text-2xl font-bold">48h</div>
                <div className="text-sm text-muted-foreground">Tempo Médio Liminar</div>
              </div>
              <div>
                <Award className="h-10 w-10 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold">95%</div>
                <div className="text-sm text-muted-foreground">Taxa de Sucesso</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AgitationSection
        problem="Enquanto seu nome está sujo indevidamente, você está sendo humilhado publicamente, perdendo oportunidades e a empresa que te negativou está impune. Você merece justiça E compensação!"
        agitationPoints={[
          'Cada dia com nome sujo é mais vergonha na fila do mercado quando o cartão é negado',
          'Você perde oportunidades de emprego porque empresas fazem consulta de crédito',
          'Financiamento de casa/carro negado por uma dívida que nem é sua',
          'Empresa que te negativou não liga, não resolve, te trata como devedor',
        ]}
      />

      <SolutionSection
        title="Como Retiramos Seu Nome E Garantimos Indenização"
        subtitle="Processo judicial comprovado com 95% de sucesso"
        solutionSteps={[
          'Análise gratuita - Verificamos se a negativação é indevida (consulta SPC/Serasa)',
          'Petição urgente - Protocolo com pedido de liminar para retirar nome em 24-72h',
          'Liminar concedida - Seu nome sai do SPC/Serasa imediatamente',
          'Ação de danos morais - Processamos a empresa que te negativou indevidamente',
          'Sentença e indenização - R$ 3.000 a R$ 15.000 + retirada definitiva do nome',
          'Execução - Garantimos que você receba cada centavo',
        ]}
        onCTA={handleCTA}
      />

      {/* When You Have Right */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Quando Você Tem Direito?</h2>
            <p className="text-center text-muted-foreground mb-12">
              Situações mais comuns de negativação indevida
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600" />
                    Dívida Já Paga
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Você pagou a dívida mas empresa não retirou seu nome do SPC/Serasa.
                    Prazo legal: 5 dias após pagamento.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600" />
                    Dívida Prescrita
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Dívida com mais de 5 anos não pode estar em cadastro de inadimplentes.
                    É ilegal manter após prescrição.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600" />
                    Sem Notificação Prévia
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Empresa negativou sem te avisar antes (carta AR ou outro meio comprovável).
                    É obrigatório notificar.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600" />
                    Dívida Inexistente
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Você nunca teve relação com a empresa ou nunca comprou aquilo.
                    Fraude ou erro cadastral.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600" />
                    Valor Errado
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    O valor negativado é muito maior do que a dívida real.
                    Juros abusivos ou taxas indevidas.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600" />
                    Fraude/Identidade
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Alguém usou seus dados para fazer compras/contratos.
                    Você é vítima de fraude.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Investimento</h2>
            <p className="text-center text-muted-foreground mb-12">
              Você só paga o restante quando receber a indenização
            </p>

            <div className="max-w-xl mx-auto">
              <Card className="border-primary border-2 shadow-lg relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                    ⭐ PACOTE COMPLETO
                  </span>
                </div>
                <CardContent className="pt-6">
                  <h3 className="text-2xl font-bold mb-2">Liminar + Indenização</h3>
                  <p className="text-muted-foreground mb-4">Retira nome E processa empresa</p>
                  <div className="flex items-baseline gap-2 mb-2">
                    <div className="text-4xl font-bold text-primary">R$ 1.800</div>
                    <div className="text-muted-foreground">entrada</div>
                  </div>
                  <div className="text-lg text-muted-foreground mb-6">+ 30% da indenização no êxito</div>

                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mb-6">
                    <p className="text-sm font-semibold text-green-700 dark:text-green-300 mb-2">
                      Exemplo de Ganho:
                    </p>
                    <ul className="text-sm space-y-1">
                      <li>• Indenização: R$ 10.000</li>
                      <li>• Você recebe: R$ 7.000</li>
                      <li>• Honorários êxito: R$ 3.000</li>
                      <li className="font-bold text-green-600 dark:text-green-400">
                        = Lucro líquido: R$ 5.200
                      </li>
                    </ul>
                  </div>

                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Análise gratuita do caso</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Liminar para retirar nome (24-72h)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Ação de danos morais completa</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Acompanhamento até receber indenização</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Execução se empresa não pagar</span>
                    </li>
                  </ul>

                  <Button className="w-full text-lg py-6" onClick={handleCTA}>
                    <Zap className="h-5 w-5 mr-2" />
                    Contratar Agora - R$ 1.800
                  </Button>
                </CardContent>
              </Card>

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                <p className="text-sm">
                  ⚡ <strong>Prazo real:</strong> Liminar em 24-72h • Sentença em 3-6 meses •
                  Indenizações variam de R$ 3.000 a R$ 15.000 conforme gravidade do caso.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CredentialsSection
        lawyerName="Equipe Garcez Palha"
        experience="15+ anos em Direito do Consumidor"
        specialization="Especialistas em Negativação Indevida e Danos Morais"
        stats={{
          years: 15,
          cases: 500,
          successRate: 95,
          clients: 400,
        }}
      />

      <TestimonialsSection />

      <GuaranteeSection
        guaranteeTitle="Análise Gratuita + Garantia de Liminar"
        guaranteeDescription="Analisamos seu caso gratuitamente. Se for indevida, garantimos liminar em 72h ou devolvemos o valor."
        guaranteePeriod="72 horas"
      />

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-rose-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Chega de Ser Humilhado Injustamente!
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Retiramos seu nome do SPC/Serasa em 72h E processamos a empresa.
            <strong className="block mt-2">Você merece justiça E compensação financeira!</strong>
          </p>
          <Button
            size="lg"
            className="bg-white text-red-900 hover:bg-gray-100 text-xl px-12 py-8 font-bold shadow-2xl"
            onClick={handleCTA}
          >
            <FileWarning className="h-6 w-6 mr-2" />
            LIMPAR NOME E PROCESSAR AGORA
            <ArrowRight className="h-6 w-6 ml-2" />
          </Button>
          <p className="mt-4 text-sm">
            Análise gratuita • Liminar em 72h • 95% de sucesso
          </p>
        </div>
      </section>
    </div>
  )
}
