'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Check, Shield, Clock, Award, ArrowRight, AlertTriangle,
  TrendingUp, Users, Star, Zap, DollarSign, Ban, FileText, PhoneCall
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

export default function SeguroPrestami staPage() {
  const router = useRouter()

  const handleCTA = () => {
    router.push('/checkout?product=seguro-prestamista')
  }

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Seguro Prestamista Obrigatório? Cancele e Recupere | Garcez Palha"
        description="Banco forçou você a contratar seguro prestamista? É venda casada e é ILEGAL! Cancele o seguro, recupere todo o valor pago + indenização. Sem riscos."
        keywords={[
          'seguro prestamista',
          'venda casada banco',
          'cancelar seguro prestamista',
          'seguro empréstimo obrigatório',
          'recuperar seguro prestamista',
          'ação seguro prestamista',
          'indenização venda casada',
          'advogado seguro banco',
        ]}
        productName="Seguro Prestamista - Cancelamento e Recuperação"
        price={150000}
        category="bancario"
        canonicalUrl="https://garcezpalha.com/solucoes/bancario/seguro-prestamista"
      />

      <UrgencyBanner
        countdown={true}
        countdownMinutes={15}
        message="ATENÇÃO: Você pode recuperar TODO o valor pago + indenização por danos morais"
        discount="ANÁLISE GRATUITA"
        onCTA={handleCTA}
        ctaText="CANCELAR SEGURO E RECUPERAR AGORA"
      />

      <WhatsAppFloat
        phoneNumber="5521995354010"
        message="Fui obrigado a contratar seguro prestamista no empréstimo! Quero cancelar e recuperar."
        position="bottom-right"
        showTooltip={true}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-red-950/20 dark:via-orange-950/20 dark:to-yellow-950/20 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full mb-6 animate-pulse">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-semibold">VENDA CASADA É ILEGAL</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Banco Te Obrigou a Contratar<br />
              <span className="text-red-600">Seguro Prestamista?</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8">
              Isso é <strong className="text-red-600">VENDA CASADA e é ILEGAL</strong>.<br />
              Cancele o seguro + Recupere TODO o valor pago + Indenização por danos morais.
            </p>

            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mb-8 border-l-4 border-red-600">
              <div className="flex items-start gap-3 text-left">
                <Ban className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2 text-red-600">VOCÊ FOI ENGANADO PELO BANCO!</h3>
                  <p className="text-muted-foreground">
                    O banco disse que o seguro era "obrigatório" para aprovar seu empréstimo? MENTIRA!
                    A lei proíbe condicionar a contratação de um produto (empréstimo) à compra de outro (seguro).
                    Você tem direito de cancelar E recuperar TUDO que pagou.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border-2 border-red-600">
                <div className="text-3xl font-bold text-red-600">95%</div>
                <div className="text-sm">Taxa de Sucesso</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border-2 border-orange-600">
                <div className="text-3xl font-bold text-orange-600">R$ 5.2M</div>
                <div className="text-sm">Recuperados</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border-2 border-yellow-600">
                <div className="text-3xl font-bold text-yellow-600">100%</div>
                <div className="text-sm">Sem Riscos</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border-2 border-green-600">
                <div className="text-3xl font-bold text-green-600">60 dias</div>
                <div className="text-sm">Prazo Médio</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-red-600 hover:bg-red-700 text-xl px-10 py-8 font-bold shadow-xl animate-pulse"
                onClick={handleCTA}
              >
                <Zap className="h-6 w-6 mr-2" />
                CANCELAR E RECUPERAR AGORA
                <ArrowRight className="h-6 w-6 ml-2" />
              </Button>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              Análise Gratuita • Sem Riscos • 95% Taxa de Sucesso
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
                <div className="text-2xl font-bold">R$ 5.2M</div>
                <div className="text-sm text-muted-foreground">Recuperados</div>
              </div>
              <div>
                <Users className="h-10 w-10 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold">380+</div>
                <div className="text-sm text-muted-foreground">Casos Resolvidos</div>
              </div>
              <div>
                <Award className="h-10 w-10 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold">95%</div>
                <div className="text-sm text-muted-foreground">Taxa de Sucesso</div>
              </div>
              <div>
                <Clock className="h-10 w-10 mx-auto mb-2 text-orange-600" />
                <div className="text-2xl font-bold">60 dias</div>
                <div className="text-sm text-muted-foreground">Prazo Médio</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AgitationSection
        problem="Você foi enganado pelo banco quando te disseram que o seguro prestamista era 'obrigatório' para aprovar seu empréstimo. Isso é VENDA CASADA e é crime previsto no Código de Defesa do Consumidor!"
        agitationPoints={[
          'Banco condicionou a aprovação do empréstimo à contratação do seguro (ILEGAL)',
          'Você está pagando parcelas abusivas do seguro TODO MÊS sem saber que pode cancelar',
          'Seguro prestamista é SEMPRE opcional - banco não pode exigir',
          'Você pode ter pago milhares de reais em um seguro que não precisava',
          'Banco lucrando sobre sua necessidade de crédito aproveitando-se da sua desinformação',
          'Muitas vítimas não sabem que podem recuperar 100% do valor + indenização',
        ]}
      />

      <SolutionSection
        title="Como Cancelamos o Seguro e Recuperamos Seu Dinheiro"
        subtitle="Estratégia jurídica especializada em venda casada bancária e recuperação de valores"
        solutionSteps={[
          'ANÁLISE GRATUITA - Avaliamos seu contrato e identificamos a venda casada',
          'CANCELAMENTO IMEDIATO - Notificamos o banco para cessar cobranças',
          'RECUPERAÇÃO DE VALORES - Ação para devolução de TODAS parcelas pagas',
          'INDENIZAÇÃO ADICIONAL - Buscamos danos morais pela prática abusiva',
          'PROTEÇÃO TOTAL - Garantimos que o cancelamento não afete seu empréstimo',
          'ACOMPANHAMENTO COMPLETO - Monitoramos até o último centavo ser devolvido',
        ]}
        onCTA={handleCTA}
      />

      {/* Pricing Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Investimento</h2>
            <p className="text-center text-muted-foreground mb-12">
              Modelo de cobrança: Você só paga se recuperarmos seu dinheiro
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Plano Básico */}
              <Card className="border-2">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4">Cancelamento</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">R$ 1.500</span>
                    <span className="text-muted-foreground"> fixo</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Cancelamento do seguro</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Cessação imediata de cobranças</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Notificação extrajudicial ao banco</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Acompanhamento por 30 dias</span>
                    </li>
                  </ul>
                  <Button
                    onClick={handleCTA}
                    className="w-full"
                    variant="outline"
                  >
                    CONTRATAR CANCELAMENTO
                  </Button>
                </CardContent>
              </Card>

              {/* Plano Completo */}
              <Card className="border-4 border-green-600 relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-green-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                    MAIS ESCOLHIDO
                  </span>
                </div>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4">Recuperação Total</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">R$ 1.500</span>
                    <span className="text-muted-foreground"> + 30% recuperado</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="font-semibold">TUDO do plano anterior +</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Ação judicial de recuperação</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Devolução de TODAS parcelas pagas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Indenização por danos morais</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Sem riscos - Só paga se ganhar</span>
                    </li>
                  </ul>
                  <Button
                    onClick={handleCTA}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    RECUPERAR TUDO AGORA
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Perguntas Frequentes</h2>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2">O banco pode me obrigar a contratar seguro prestamista?</h3>
                  <p className="text-muted-foreground">
                    NÃO! É ILEGAL. O Código de Defesa do Consumidor proíbe venda casada (Art. 39, I).
                    O banco não pode condicionar a aprovação do empréstimo à contratação de seguro.
                    Isso é crime e você tem direito a cancelar e recuperar tudo que pagou.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2">Se eu cancelar o seguro, o banco pode cancelar meu empréstimo?</h3>
                  <p className="text-muted-foreground">
                    NÃO! O empréstimo e o seguro são contratos independentes. O banco NÃO pode
                    cancelar seu empréstimo por você ter cancelado o seguro. Se tentarem fazer isso,
                    é mais uma prática abusiva que gera indenização adicional.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2">Quanto posso recuperar?</h3>
                  <p className="text-muted-foreground">
                    100% de TODAS as parcelas do seguro que você já pagou + indenização por danos morais
                    (geralmente entre R$ 3.000 e R$ 10.000). Se você paga R$ 50/mês há 2 anos, são
                    R$ 1.200 de parcelas + indenização = R$ 4.200 a R$ 11.200 recuperados.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2">Quanto tempo demora para recuperar?</h3>
                  <p className="text-muted-foreground">
                    Média de 60 dias. Alguns bancos devolvem extrajudicialmente em 30 dias.
                    Casos que vão para justiça levam 60-90 dias. Você acompanha tudo pelo app.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2">Preciso pagar antes de recuperar?</h3>
                  <p className="text-muted-foreground">
                    Sim, nosso modelo é: R$ 1.500 fixo + 30% do valor recuperado (pago após ganhar).
                    Mas você pode optar por cancelamento simples (R$ 1.500 fixo apenas) se preferir.
                    Analisamos seu caso gratuitamente e você decide qual plano escolher.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <CredentialsSection />
      <GuaranteeSection />
      <TestimonialsSection category="bancario" />

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-orange-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Pare de Pagar por um Seguro que Foi Empurrado para Você
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Cancele agora + Recupere TODO o dinheiro pago + Ganhe indenização.<br />
            Análise gratuita em 24 horas.
          </p>
          <Button
            size="lg"
            onClick={handleCTA}
            className="bg-white text-red-600 hover:bg-gray-100 text-xl px-12 py-8 font-bold"
          >
            <Zap className="h-6 w-6 mr-2" />
            CANCELAR E RECUPERAR AGORA
            <ArrowRight className="h-6 w-6 ml-2" />
          </Button>
          <p className="mt-4 text-sm">
            Atendimento Imediato • Sem Riscos • 95% Taxa de Sucesso
          </p>
        </div>
      </section>
    </div>
  )
}
