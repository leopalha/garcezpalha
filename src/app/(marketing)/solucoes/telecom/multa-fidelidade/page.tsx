import { Metadata } from 'next'
import Link from 'next/link'
import {
  ShieldOff, CheckCircle2, XCircle, FileText, Clock, AlertTriangle,
  Shield, DollarSign, AlertCircle, MessageCircle, Wifi
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Multa de Fidelidade Abusiva - Cancelamento Sem Multa | Garcez Palha',
  description: 'Operadora cobrando multa para cancelar mas o serviço é ruim? Internet lenta, quedas constantes? Anatel proíbe multa quando há falha no serviço. Advogado especialista em telecomunicações.',
  keywords: [
    'multa fidelidade abusiva',
    'cancelar sem multa',
    'internet lenta quer cancelar',
    'serviço ruim operadora',
    'anatel multa fidelidade',
    'restituição multa telefonia'
  ],
  openGraph: {
    title: 'Multa de Fidelidade Abusiva - Cancelar Sem Pagar',
    description: 'Se o serviço é ruim, você não deve pagar multa. A Anatel proíbe.',
    type: 'website',
  }
}

export default function MultaFidelidadePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-orange-900 via-red-800 to-orange-900 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-orange-700/50 px-4 py-2 rounded-full mb-6">
                <Wifi className="w-4 h-4" />
                <span className="text-sm font-medium">Direito do Consumidor | Telecomunicações</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Operadora Cobrando Multa Para Você Cancelar?<br/>
                <span className="text-orange-300">Se o Serviço É Ruim, Você Não Deve Pagar.</span>
              </h1>

              <p className="text-xl text-orange-100 mb-8 leading-relaxed">
                Advogado especialista em telecomunicações.<br/>
                Cancelamento sem multa quando serviço não funciona.<br/>
                Restituição se já pagou + danos morais.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="#contato"
                  className="inline-flex items-center justify-center gap-2 bg-white text-orange-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-orange-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
                >
                  <MessageCircle className="w-5 h-5" />
                  NÃO QUERO PAGAR MULTA ABUSIVA
                </Link>
              </div>

              <div className="mt-8 flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span className="text-sm">Sem custas iniciais</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span className="text-sm">Resposta em 2h</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <div className="space-y-4">
                  <div className="flex items-start gap-4 bg-white/5 p-4 rounded-lg">
                    <ShieldOff className="w-8 h-8 text-red-400 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-lg">Cancelamento SEM Multa</div>
                      <div className="text-orange-200 text-sm">Quando serviço falha</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 bg-white/5 p-4 rounded-lg">
                    <DollarSign className="w-8 h-8 text-green-400 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-lg">Restituição</div>
                      <div className="text-orange-200 text-sm">Se já pagou a multa</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 bg-white/5 p-4 rounded-lg">
                    <Clock className="w-8 h-8 text-yellow-400 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-lg">Prazo: 2-3 meses</div>
                      <div className="text-orange-200 text-sm">Processo rápido</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problema Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            A Operadora Quer Te Prender Num Serviço Ruim?
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {[
              'Internet NUNCA chega na velocidade contratada',
              'Quedas constantes de sinal',
              'Técnico não aparece quando marca',
              'Mudou de endereço e não tem cobertura',
              'Atendimento telefônico não resolve',
              'Querem cobrar multa para você cancelar'
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <span className="text-gray-800 font-medium">{item}</span>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-orange-900 to-red-900 text-white p-8 rounded-xl">
            <h3 className="text-2xl font-bold mb-4">A Anatel É Clara:</h3>
            <p className="text-lg text-orange-100 mb-4">
              "Quando há falha na prestação do serviço, a operadora NÃO PODE cobrar multa de fidelidade."
            </p>
            <div className="bg-white/10 p-4 rounded-lg">
              <p className="text-sm text-orange-200">
                Resolução Anatel nº 632/2014 - Art. 34, §5º
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solução Section */}
      <section className="py-20 bg-orange-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-6 text-gray-900">
            Como Funciona
          </h2>
          <p className="text-xl text-center text-gray-600 mb-12">
            Você tem direito de cancelar SEM pagar multa
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-orange-900">Quando NÃO Paga Multa</h3>
              <div className="space-y-4">
                {[
                  { title: 'Velocidade Inferior', desc: 'Internet não chega no contratado' },
                  { title: 'Quedas Frequentes', desc: 'Sinal cai constantemente' },
                  { title: 'Sem Reparo', desc: 'Técnico não resolve o problema' },
                  { title: 'Atendimento Deficiente', desc: 'Não respondem/resolvem reclamações' }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3 bg-white p-4 rounded-lg border border-orange-200">
                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-semibold text-gray-900">{item.title}</div>
                      <div className="text-sm text-gray-600">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-6 text-orange-900">O Que Fazer</h3>
              <div className="space-y-3">
                {[
                  { step: '1', text: 'Documente as falhas (prints, speed tests)' },
                  { step: '2', text: 'Registre reclamação na Anatel' },
                  { step: '3', text: 'Se cobrarem multa: NÃO pague' },
                  { step: '4', text: 'Entramos com ação para:' }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3 bg-white p-3 rounded-lg border border-orange-100">
                    <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                      {item.step}
                    </div>
                    <span className="text-gray-700 pt-1">{item.text}</span>
                  </div>
                ))}
                <div className="ml-11 space-y-2 text-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    <span>Declarar multa indevida</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    <span>Se já pagou: restituição</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    <span>Danos morais se negativaram</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">Importante</h4>
                <p className="text-blue-800">
                  Mesmo se você assinou contrato de fidelidade, quando a operadora não cumpre o combinado (internet lenta, quedas, etc.), ela PERDE o direito de cobrar multa.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pacote/Oferta Section */}
      <section className="py-20 bg-gradient-to-b from-white to-orange-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Pacote Multa Fidelidade</h2>
            <p className="text-xl text-gray-600">Cancelamento sem multa garantido</p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl border-2 border-orange-200 overflow-hidden max-w-2xl mx-auto">
            <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6 text-center">
              <div className="text-sm font-semibold uppercase tracking-wide mb-2">Telecomunicações</div>
              <div className="text-3xl font-bold">Pacote Completo</div>
            </div>

            <div className="p-8">
              <div className="space-y-4 mb-8">
                {[
                  'Análise do contrato e situação',
                  'Documentação das falhas no serviço',
                  'Notificação à operadora',
                  'Reclamação formal na Anatel',
                  'Ação judicial se necessário',
                  'Cancelamento da multa',
                  'Restituição se já pagou'
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>

              <div className="border-t-2 border-gray-200 pt-6 mb-6">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-2">Investimento</div>
                  <div className="text-5xl font-bold text-orange-900 mb-2">R$ 1.500</div>
                  <div className="text-gray-600">ou 3x de R$ 500 sem juros</div>
                </div>
              </div>

              <div className="space-y-3">
                <Link
                  href="#contato"
                  className="block w-full bg-orange-600 hover:bg-orange-700 text-white text-center py-4 rounded-lg font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
                >
                  CANCELAR SEM MULTA
                </Link>
                <p className="text-sm text-center text-gray-500">
                  Atendimento imediato via WhatsApp
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-4xl font-bold text-orange-600 mb-2">90%</div>
              <div className="text-gray-600">Automação IA</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-4xl font-bold text-orange-600 mb-2">2-3</div>
              <div className="text-gray-600">Meses</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-4xl font-bold text-orange-600 mb-2">80%+</div>
              <div className="text-gray-600">Taxa de Sucesso</div>
            </div>
          </div>
        </div>
      </section>

      {/* Documentos Necessários */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Documentos Necessários
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              'Contrato de fidelidade',
              'Protocolos de reclamação',
              'Testes de velocidade (speed test)',
              'Prints de conversas/emails',
              'Boleto/cobrança da multa',
              'RG e CPF'
            ].map((doc, index) => (
              <div key={index} className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
                <FileText className="w-5 h-5 text-orange-600 flex-shrink-0" />
                <span className="text-gray-700">{doc}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-green-50 border-l-4 border-green-600 p-6 rounded-r-lg">
            <p className="text-green-800">
              <strong>Não tem tudo?</strong> Começamos com o que você tem. A própria tentativa de cobrança de multa já é evidência suficiente.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-orange-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Perguntas Frequentes
          </h2>

          <div className="space-y-6">
            {[
              {
                q: 'Eu assinei contrato de 12 meses. Tenho que pagar?',
                a: 'NÃO, se o serviço não funciona direito. A Anatel é clara: quando há falha na prestação do serviço, a operadora perde o direito de cobrar multa.'
              },
              {
                q: 'Já paguei a multa. Posso receber de volta?',
                a: 'SIM! Você tem direito à restituição integral do valor pago indevidamente.'
              },
              {
                q: 'Preciso provar que o serviço é ruim?',
                a: 'Ajudamos você a reunir provas: testes de velocidade, prints de protocolos, histórico de reclamações. Tudo isso é fácil de conseguir.'
              },
              {
                q: 'A operadora pode me negativar se eu não pagar?',
                a: 'Se você não pagar multa indevida, eles podem ameaçar, mas se negativarem, você ganha danos morais também (R$ 5.000+).'
              },
              {
                q: 'Quanto tempo demora?',
                a: '2 a 3 meses em média. É um processo relativamente rápido.'
              },
              {
                q: 'Vale a pena se a multa é de R$ 300?',
                a: 'Sim! Além de não pagar, se eles te negativaram, você pode ganhar R$ 5.000+ de danos morais.'
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-orange-100">
                <h3 className="font-semibold text-lg text-gray-900 mb-3">{faq.q}</h3>
                <p className="text-gray-700">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section id="contato" className="py-20 bg-gradient-to-r from-orange-900 via-red-800 to-orange-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ShieldOff className="w-16 h-16 mx-auto mb-6 text-orange-300" />
          <h2 className="text-4xl font-bold mb-6">
            Não Aceite Ser Refém de Um Serviço Ruim
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Internet lenta? Quedas constantes?<br/>
            Você tem TODO O DIREITO de cancelar sem pagar multa.<br/><br/>
            Me manda mensagem no WhatsApp agora.<br/>
            Me conta o que está acontecendo.<br/><br/>
            Em 2 horas eu te respondo com a solução.
          </p>

          <Link
            href="https://wa.me/5511999999999?text=Olá, quero cancelar meu plano sem pagar multa de fidelidade"
            target="_blank"
            className="inline-flex items-center justify-center gap-2 bg-white text-orange-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-orange-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
          >
            <MessageCircle className="w-5 h-5" />
            CANCELAR SEM MULTA - WHATSAPP
          </Link>

          <p className="mt-6 text-orange-200">
            📶 Internet Banda Larga • Telefonia Móvel • TV por Assinatura
          </p>
        </div>
      </section>

    </div>
  )
}
