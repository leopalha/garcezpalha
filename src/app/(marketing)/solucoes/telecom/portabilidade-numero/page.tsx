import { Metadata } from 'next'
import Link from 'next/link'
import {
  PhoneForwarded, CheckCircle2, XCircle, FileText, Clock, AlertTriangle,
  Shield, DollarSign, AlertCircle, MessageCircle, Phone
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Portabilidade de Número Negada - Recupere Seu Número | Garcez Palha',
  description: 'Operadora não libera seu número? Perdeu número na portabilidade? Anatel garante: portabilidade em até 3 dias úteis. Advogado especialista em telecomunicações. Indenização por recusa injustificada.',
  keywords: [
    'portabilidade número negada',
    'perdeu número portabilidade',
    'operadora não libera número',
    'recuperar número celular',
    'anatel portabilidade',
    'processar operadora portabilidade'
  ],
  openGraph: {
    title: 'Portabilidade de Número Negada - Direito Garantido',
    description: 'Quer mudar de operadora mas não consegue levar seu número? A portabilidade é seu DIREITO.',
    type: 'website',
  }
}

export default function PortabilidadeNumeroPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-800 to-blue-900 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-700/50 px-4 py-2 rounded-full mb-6">
                <PhoneForwarded className="w-4 h-4" />
                <span className="text-sm font-medium">Direito do Consumidor | Telecomunicações</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Quer Mudar de Operadora Mas Não Consegue Levar Seu Número?<br/>
                <span className="text-blue-300">A Portabilidade É Seu DIREITO. Ninguém Pode Negar.</span>
              </h1>

              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Advogado especialista em telecomunicações.<br/>
                Anatel garante: portabilidade em até 3 dias úteis.<br/>
                Operadora que nega pode ser processada.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="#contato"
                  className="inline-flex items-center justify-center gap-2 bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
                >
                  <MessageCircle className="w-5 h-5" />
                  RESOLVER PORTABILIDADE AGORA
                </Link>
              </div>

              <div className="mt-8 flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span className="text-sm">Prazo: 30-60 dias</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span className="text-sm">85% sucesso</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <div className="space-y-4">
                  <div className="flex items-start gap-4 bg-white/5 p-4 rounded-lg">
                    <PhoneForwarded className="w-8 h-8 text-green-400 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-lg">Recuperação do Número</div>
                      <div className="text-blue-200 text-sm">Notificação + Ação Anatel</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 bg-white/5 p-4 rounded-lg">
                    <DollarSign className="w-8 h-8 text-yellow-400 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-lg">Danos Morais</div>
                      <div className="text-blue-200 text-sm">R$ 2.000 a R$ 5.000</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 bg-white/5 p-4 rounded-lg">
                    <Clock className="w-8 h-8 text-blue-400 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-lg">Prazo Legal</div>
                      <div className="text-blue-200 text-sm">3 dias úteis pela Anatel</div>
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
            O Que Está Acontecendo?
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {[
              'Operadora antiga não libera seu número',
              'Operadora nova diz que "não consegue"',
              'Processo travado há semanas',
              'Perdeu o número durante migração',
              'Ficou sem número funcionando',
              'Ninguém assume responsabilidade'
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <span className="text-gray-800 font-medium">{item}</span>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-8 rounded-xl">
            <h3 className="text-2xl font-bold mb-4">A Lei É Clara</h3>
            <div className="space-y-3">
              <p className="text-lg text-blue-100">
                ✓ Portabilidade é DIREITO do consumidor<br/>
                ✓ Prazo máximo: <strong className="text-white">3 dias úteis</strong><br/>
                ✓ Operadora NÃO PODE criar obstáculos<br/>
                ✓ Recusa = indenização por danos morais
              </p>
              <div className="bg-white/10 p-4 rounded-lg mt-4">
                <p className="text-sm text-blue-200">
                  Resolução Anatel nº 460/2007 + Lei Geral de Telecomunicações
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solução Section */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-6 text-gray-900">
            Como Resolver
          </h2>
          <p className="text-xl text-center text-gray-600 mb-12">
            3 etapas para recuperar seu número
          </p>

          <div className="space-y-6 mb-12">
            {[
              {
                num: '1',
                title: 'Notificação Extrajudicial',
                desc: 'Enviamos notificação formal para ambas operadoras',
                details: 'Prazo de 5 dias para resolverem'
              },
              {
                num: '2',
                title: 'Reclamação na Anatel',
                desc: 'Registramos reclamação oficial no órgão regulador',
                details: 'Anatel tem poder de multar operadoras'
              },
              {
                num: '3',
                title: 'Ação Judicial',
                desc: 'Se necessário, entramos com ação pedindo:',
                details: 'Recuperação do número + Danos morais'
              }
            ].map((step, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border-2 border-blue-200 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xl">
                    {step.num}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-700 mb-2">{step.desc}</p>
                    <p className="text-sm text-blue-600 font-medium">{step.details}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 rounded-r-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-yellow-900 mb-2">Urgente?</h4>
                <p className="text-yellow-800">
                  Se você está sem número funcionando (perdeu na migração), podemos pedir LIMINAR para resolver em 24-48h.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Direitos Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Seus Direitos na Portabilidade
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: 'Portabilidade Gratuita',
                desc: 'Operadoras NÃO podem cobrar taxa'
              },
              {
                title: 'Prazo de 3 Dias Úteis',
                desc: 'Contados da solicitação aprovada'
              },
              {
                title: 'Sem Interrupção',
                desc: 'Número deve funcionar durante todo processo'
              },
              {
                title: 'Mesmo Número',
                desc: 'Você MANTÉM o número, apenas muda operadora'
              },
              {
                title: 'Sem Multa',
                desc: 'Se não estiver em fidelidade ativa'
              },
              {
                title: 'Indenização por Falha',
                desc: 'R$ 2.000-5.000 se negarem ou atrasarem'
              }
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <div className="font-semibold text-gray-900">{item.title}</div>
                  <div className="text-sm text-gray-600">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pacote/Oferta Section */}
      <section className="py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Pacote Portabilidade de Número</h2>
            <p className="text-xl text-gray-600">Recupere seu número de forma definitiva</p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl border-2 border-blue-200 overflow-hidden max-w-2xl mx-auto">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 text-center">
              <div className="text-sm font-semibold uppercase tracking-wide mb-2">Telecomunicações</div>
              <div className="text-3xl font-bold">Pacote Completo</div>
            </div>

            <div className="p-8">
              <div className="space-y-4 mb-8">
                {[
                  'Análise da situação e documentação',
                  'Notificação formal às operadoras',
                  'Reclamação oficial na Anatel',
                  'Acompanhamento do processo',
                  'Ação judicial se necessário',
                  'Recuperação definitiva do número',
                  'Indenização por transtornos (R$ 2.000-5.000)'
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
                  <div className="text-5xl font-bold text-blue-900 mb-2">R$ 1.500</div>
                  <div className="text-gray-600">Pagamento único</div>
                </div>
              </div>

              <div className="space-y-3">
                <Link
                  href="#contato"
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-4 rounded-lg font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
                >
                  RECUPERAR MEU NÚMERO
                </Link>
                <p className="text-sm text-center text-gray-500">
                  Resposta em até 2 horas úteis
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-4xl font-bold text-blue-600 mb-2">90%</div>
              <div className="text-gray-600">Automação IA</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-4xl font-bold text-blue-600 mb-2">30-60</div>
              <div className="text-gray-600">Dias</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-4xl font-bold text-blue-600 mb-2">85%+</div>
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
              'Número do celular (que quer portar)',
              'Protocolo da portabilidade',
              'Prints/emails das tentativas',
              'RG e CPF',
              'Comprovante de titularidade da linha',
              'Prints de conversas com operadoras'
            ].map((doc, index) => (
              <div key={index} className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span className="text-gray-700">{doc}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-green-50 border-l-4 border-green-600 p-6 rounded-r-lg">
            <p className="text-green-800">
              <strong>Não tem tudo?</strong> Começamos com o básico. O protocolo da portabilidade + tentativas de contato já são suficientes para iniciar.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Perguntas Frequentes
          </h2>

          <div className="space-y-6">
            {[
              {
                q: 'Por que minha portabilidade não sai?',
                a: 'Comum: débitos pendentes, dados cadastrais divergentes, fidelidade ativa. Mas mesmo com débito, você tem direito de portar (resolve depois). Analisamos seu caso e identificamos o bloqueio.'
              },
              {
                q: 'Perdi meu número na portabilidade. Dá para recuperar?',
                a: 'SIM! É um caso grave que pode render indenização maior. Entramos com urgência para recuperação.'
              },
              {
                q: 'Quanto tempo demora para resolver?',
                a: 'Via Anatel: 5-15 dias. Via judicial: 30-60 dias. Casos urgentes: 24-48h com liminar.'
              },
              {
                q: 'Posso portar mesmo com conta em atraso?',
                a: 'SIM! Débito NÃO impede portabilidade. Você resolve o débito depois com a operadora antiga.'
              },
              {
                q: 'Preciso pagar multa de fidelidade?',
                a: 'Se está em período de fidelidade, sim. Mas se o serviço é ruim (internet lenta, quedas), pode não pagar.'
              },
              {
                q: 'Vale a pena processar?',
                a: 'Sim! Além de resolver, você ganha R$ 2.000-5.000 de indenização pelos transtornos.'
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-blue-100">
                <h3 className="font-semibold text-lg text-gray-900 mb-3">{faq.q}</h3>
                <p className="text-gray-700">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section id="contato" className="py-20 bg-gradient-to-r from-blue-900 via-indigo-800 to-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <PhoneForwarded className="w-16 h-16 mx-auto mb-6 text-blue-300" />
          <h2 className="text-4xl font-bold mb-6">
            Seu Número. Sua Escolha. Seu Direito.
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Não deixe operadora decidir onde você fica.<br/>
            Portabilidade é LEI. Ninguém pode te impedir.<br/><br/>
            Me manda mensagem no WhatsApp agora.<br/>
            Me conta o que está acontecendo.<br/>
            Me manda o número e os protocolos.<br/><br/>
            Em 2 horas eu te respondo com a solução.<br/>
            Vamos recuperar seu número.
          </p>

          <Link
            href="https://wa.me/5511999999999?text=Olá, preciso de ajuda com portabilidade de número"
            target="_blank"
            className="inline-flex items-center justify-center gap-2 bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
          >
            <MessageCircle className="w-5 h-5" />
            RESOLVER PORTABILIDADE - WHATSAPP
          </Link>

          <p className="mt-6 text-blue-200">
            📱 Todas as operadoras • Pré-pago e Pós-pago
          </p>
        </div>
      </section>

    </div>
  )
}
