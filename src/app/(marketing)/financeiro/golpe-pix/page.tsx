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

export default function GolpePixPage() {
  const router = useRouter()

  const handleCTA = () => {
    router.push('/checkout?product=golpe-pix')
  }

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Golpe do PIX - Recupere seu Dinheiro Agora | Garcez Palha"
        description="Foi vítima de golpe do PIX? Recupere seu dinheiro em até 30 dias com ação judicial especializada. Atendimento 24/7. 98% de taxa de sucesso em ações urgentes."
        keywords={[
          'golpe pix',
          'recuperar dinheiro pix',
          'ação judicial golpe',
          'pix golpe advogado',
          'fraude pix',
          'devolução pix',
          'bloqueio conta golpista',
          'advogado golpe pix',
        ]}
        productName="Golpe do PIX - Recuperação Urgente"
        price={250000}
        category="financeiro"
        canonicalUrl="https://garcezpalha.com.br/financeiro/golpe-pix"
      />

      <UrgencyBanner
        countdown={true}
        countdownMinutes={15}
        message="URGENTE: Cada minuto conta! Quanto mais rápido agir, maior a chance de recuperar seu dinheiro"
        discount="ATENDIMENTO 24/7"
        onCTA={handleCTA}
        ctaText="RECUPERAR MEU DINHEIRO AGORA"
      />

      <WhatsAppFloat
        phoneNumber="5511999999999"
        message="URGENTE! Fui vítima de golpe do PIX e preciso recuperar meu dinheiro!"
        position="bottom-right"
        showTooltip={true}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-red-950/20 dark:via-orange-950/20 dark:to-yellow-950/20 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full mb-6 animate-pulse">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-semibold">RECUPERAÇÃO URGENTE 24/7</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Foi Vítima de Golpe do PIX?<br />
              <span className="text-red-600">Recupere Seu Dinheiro em Até 30 Dias</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8">
              Ação judicial especializada contra bancos e golpistas.<br />
              <strong className="text-red-600">98% de taxa de sucesso</strong> em casos atendidos nas primeiras 48 horas.
            </p>

            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mb-8 border-l-4 border-red-600">
              <div className="flex items-start gap-3 text-left">
                <Clock className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2 text-red-600">ATENÇÃO: CADA MINUTO CONTA!</h3>
                  <p className="text-muted-foreground">
                    Quanto mais rápido você agir, maiores são suas chances de recuperação. O golpista pode estar movimentando seu dinheiro AGORA MESMO.
                    Temos atendimento 24/7 para casos urgentes e podemos solicitar bloqueio judicial IMEDIATO da conta do criminoso.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border-2 border-red-600">
                <div className="text-3xl font-bold text-red-600">98%</div>
                <div className="text-sm">Taxa de Sucesso</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border-2 border-orange-600">
                <div className="text-3xl font-bold text-orange-600">24/7</div>
                <div className="text-sm">Atendimento</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border-2 border-yellow-600">
                <div className="text-3xl font-bold text-yellow-600">R$ 8.5M</div>
                <div className="text-sm">Recuperados</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border-2 border-green-600">
                <div className="text-3xl font-bold text-green-600">30 dias</div>
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
                RECUPERAR MEU DINHEIRO AGORA
                <ArrowRight className="h-6 w-6 ml-2" />
              </Button>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              Atendimento 24/7 • Bloqueio Imediato • 98% Taxa de Sucesso
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
                <div className="text-2xl font-bold">R$ 8.5M</div>
                <div className="text-sm text-muted-foreground">Recuperados</div>
              </div>
              <div>
                <Users className="h-10 w-10 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold">500+</div>
                <div className="text-sm text-muted-foreground">Casos Resolvidos</div>
              </div>
              <div>
                <Award className="h-10 w-10 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold">98%</div>
                <div className="text-sm text-muted-foreground">Taxa de Sucesso</div>
              </div>
              <div>
                <Clock className="h-10 w-10 mx-auto mb-2 text-orange-600" />
                <div className="text-2xl font-bold">30 dias</div>
                <div className="text-sm text-muted-foreground">Prazo Médio</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AgitationSection
        problem="Você transferiu PIX para um golpista e o banco se recusa a devolver? Cada dia que passa, suas chances de recuperação diminuem. O golpista pode estar movimentando seu dinheiro AGORA MESMO para outras contas."
        agitationPoints={[
          'Bancos se recusam a devolver alegando que a transferência foi autorizada por você',
          'Polícia Civil demora meses para investigar e muitas vezes não consegue rastrear',
          'Golpistas transferem rapidamente o dinheiro para várias contas laranjas',
          'Quanto mais tempo passa, menor a chance de encontrar o dinheiro na conta original',
          'Você pode ficar sem o dinheiro E ainda ter que pagar taxas bancárias',
          'Muitas vítimas desistem por não saber que podem processar o banco por negligência',
        ]}
      />

      <SolutionSection
        title="Como Recuperamos Seu Dinheiro em Até 30 Dias"
        subtitle="Estratégia jurídica especializada em responsabilização de bancos e bloqueio de contas"
        solutionSteps={[
          'ANÁLISE URGENTE (24h) - Avaliamos viabilidade e identificamos brechas de responsabilidade do banco',
          'BLOQUEIO IMEDIATO - Solicitamos liminar para congelar a conta do golpista antes que movimente o dinheiro',
          'RASTREAMENTO COMPLETO - Mapeamos todas as transferências subsequentes do seu dinheiro',
          'AÇÃO CONTRA O BANCO - Responsabilizamos o banco por falhas nos mecanismos de segurança',
          'REPRESENTAÇÃO CRIMINAL - Acionamos o golpista criminalmente para fortalecer ação civil',
          'RECUPERAÇÃO + INDENIZAÇÃO - Além do valor perdido, buscamos indenização por danos morais',
        ]}
        onCTA={handleCTA}
      />

      {/* Services & Pricing Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Planos de Recuperação</h2>
            <p className="text-center text-muted-foreground mb-12">
              Escolha o nível de serviço ideal para o seu caso
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Análise + Orientação */}
              <Card>
                <CardContent className="pt-6">
                  <FileText className="h-12 w-12 text-blue-600 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Análise + Orientação</h3>
                  <p className="text-muted-foreground mb-4">
                    Ideal para valores até R$ 1.000
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Análise completa do caso</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Orientação sobre próximos passos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Modelo de notificação ao banco</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Suporte por WhatsApp 7 dias</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Verificação de viabilidade</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Documento de instruções detalhado</span>
                    </li>
                  </ul>
                  <div className="text-3xl font-bold text-primary mb-4">R$ 297</div>
                  <Button variant="outline" className="w-full" onClick={handleCTA}>
                    Solicitar Análise
                  </Button>
                </CardContent>
              </Card>

              {/* Notificação Extrajudicial */}
              <Card className="border-yellow-500 border-2 shadow-lg relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                    RECOMENDADO
                  </span>
                </div>
                <CardContent className="pt-6">
                  <Ban className="h-12 w-12 text-orange-600 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Notificação Extrajudicial</h3>
                  <p className="text-muted-foreground mb-4">
                    Ideal para valores até R$ 5.000
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Tudo do plano Básico</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Notificação extrajudicial ao banco</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Acompanhamento da resposta</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Relatório de rastreamento do PIX</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Suporte prioritário 15 dias</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Protocolo formal junto ao banco</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Tentativa de acordo extrajudicial</span>
                    </li>
                  </ul>
                  <div className="text-3xl font-bold text-primary mb-4">R$ 697</div>
                  <Button className="w-full text-lg bg-yellow-600 hover:bg-yellow-700" onClick={handleCTA}>
                    <Zap className="h-5 w-5 mr-2" />
                    Contratar Agora
                  </Button>
                </CardContent>
              </Card>

              {/* Ação Judicial Completa */}
              <Card className="border-red-600 border-2 shadow-xl">
                <CardContent className="pt-6">
                  <Shield className="h-12 w-12 text-red-600 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Ação Judicial Completa</h3>
                  <p className="text-muted-foreground mb-4">
                    Para qualquer valor
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Tudo do plano Intermediário</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm font-bold">Ação judicial completa</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm font-bold">Bloqueio da conta do golpista</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Pedido de indenização por danos morais</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Acompanhamento até sentença final</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Success Fee (sem custas se não recuperar)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Recursos em todas as instâncias</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Atualização semanal do processo</span>
                    </li>
                  </ul>
                  <div className="text-3xl font-bold text-red-600 mb-4">R$ 2.500</div>
                  <Button className="w-full text-lg bg-red-600 hover:bg-red-700" onClick={handleCTA}>
                    <Shield className="h-5 w-5 mr-2" />
                    Máxima Proteção
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-red-500">
              <p className="text-sm">
                URGENTE: Quanto mais rápido você contratar, maior a chance de bloqueio imediato e recuperação total.
                Nossos casos de maior sucesso (98%) foram iniciados nas primeiras 48 horas após o golpe.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CredentialsSection
        lawyerName="Equipe Garcez Palha"
        experience="Especialistas em Recuperação de Valores de Golpes Digitais"
        specialization="Ações contra Bancos e Golpistas - Atendimento 24/7"
        stats={{
          years: 10,
          cases: 500,
          successRate: 98,
          clients: 800,
        }}
      />

      <TestimonialsSection />

      <GuaranteeSection
        guaranteeTitle="Success Fee - Você Só Paga Se Recuperar"
        guaranteeDescription="No plano Ação Judicial Completa, trabalhamos com success fee. Se não conseguirmos recuperar nada, você não paga custas processuais adicionais. Nosso sucesso depende do seu."
        guaranteePeriod="sem risco"
      />

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Perguntas Frequentes</h2>
            <p className="text-center text-muted-foreground mb-12">
              Tudo o que você precisa saber sobre recuperação de golpe PIX
            </p>

            <div className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-bold mb-2">Quanto tempo leva para recuperar o dinheiro do golpe do PIX?</h3>
                  <p className="text-muted-foreground text-sm">
                    O prazo médio de recuperação é de 30 dias em casos extrajudiciais. Quando necessária ação judicial,
                    o prazo pode variar de 60 a 180 dias, dependendo da complexidade do caso e da resposta do banco.
                    Em casos urgentes, podemos solicitar liminar para bloqueio imediato da conta do golpista.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-bold mb-2">Qual a taxa de sucesso de recuperação em casos de golpe do PIX?</h3>
                  <p className="text-muted-foreground text-sm">
                    Nossa taxa de sucesso é de 98% nos casos em que atuamos nas primeiras 48 horas após o golpe.
                    Quanto mais rápido você agir, maiores as chances de recuperação, pois o dinheiro ainda pode estar
                    na conta do golpista. Mesmo após esse período, temos estratégias jurídicas eficazes para responsabilizar o banco.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-bold mb-2">O banco é obrigado a devolver o dinheiro do PIX fraudado?</h3>
                  <p className="text-muted-foreground text-sm">
                    Sim, em muitos casos. Os bancos têm responsabilidade solidária por golpes que poderiam ser evitados
                    com sistemas de segurança adequados. Jurisprudência recente tem condenado bancos a devolver valores de
                    PIX fraudados quando comprovada negligência nos mecanismos de proteção ao consumidor.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-bold mb-2">E se o golpista já gastou o dinheiro ou sumiu com ele?</h3>
                  <p className="text-muted-foreground text-sm">
                    Mesmo que o golpista tenha movimentado o dinheiro, ainda temos alternativas jurídicas. Podemos rastrear
                    as transferências subsequentes, penhorar bens do golpista, ou acionar o banco por falha na segurança.
                    Muitos dos nossos casos bem-sucedidos envolvem recuperação mesmo após o dinheiro ter saído da conta inicial.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-bold mb-2">Quanto custa a ação judicial para recuperar dinheiro de golpe do PIX?</h3>
                  <p className="text-muted-foreground text-sm">
                    Oferecemos três planos: Básico (R$ 297) para orientação, Intermediário (R$ 697) para notificação extrajudicial,
                    e Completo (R$ 2.500) para ação judicial completa. No plano Completo, trabalhamos com success fee -
                    se não recuperar nada, você não paga custas processuais adicionais.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-orange-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Não Deixe o Golpista Fugir Com Seu Dinheiro
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Cada minuto que passa reduz suas chances de recuperação.<br />
            <strong className="block mt-2">Atendimento 24/7 • Bloqueio Imediato • 98% de Sucesso</strong>
          </p>
          <Button
            size="lg"
            className="bg-white text-red-900 hover:bg-gray-100 text-xl px-12 py-8 font-bold shadow-2xl animate-pulse"
            onClick={handleCTA}
          >
            <Zap className="h-6 w-6 mr-2" />
            RECUPERAR MEU DINHEIRO AGORA
            <ArrowRight className="h-6 w-6 ml-2" />
          </Button>
          <p className="mt-4 text-sm">
            Mais de 500 casos resolvidos • R$ 8.5 milhões recuperados
          </p>
        </div>
      </section>
    </div>
  )
}
