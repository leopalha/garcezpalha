import { Metadata } from 'next'
import Link from 'next/link'
import {
  Monitor, CheckCircle2, XCircle, FileText, Clock, TrendingUp,
  Shield, DollarSign, AlertCircle, MessageCircle, CreditCard
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Assinaturas Digitais Indevidas - Restituição em Dobro | Garcez Palha',
  description: 'Streaming/apps cobrando após cancelamento? Netflix, Spotify, Amazon Prime continuam debitando? Advogado especialista em direito do consumidor. Cancelamento + restituição em dobro + danos morais.',
  keywords: [
    'assinatura digital indevida',
    'netflix spotify cobrando',
    'cancelei mas cobra',
    'trial virou cobrança',
    'app cobrando após cancelar',
    'restituição assinatura',
    'processar netflix',
    'processar spotify'
  ],
  openGraph: {
    title: 'Assinaturas Digitais Indevidas - Cancele e Receba em Dobro',
    description: 'Cancelou mas continua cobrando? Você tem direito a receber em dobro.',
    type: 'website',
  }
}

export default function AssinaturasDigitaisPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white">

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-cyan-900 via-blue-800 to-cyan-900 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-cyan-700/50 px-4 py-2 rounded-full mb-6">
                <Monitor className="w-4 h-4" />
                <span className="text-sm font-medium">Direito do Consumidor | Digital</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Cancelou Assinatura Mas Continuam Cobrando?<br/>
                <span className="text-cyan-300">Você Tem Direito a Receber Em Dobro.</span>
              </h1>

              <p className="text-xl text-cyan-100 mb-8 leading-relaxed">
                Advogado especialista em direito do consumidor digital.<br/>
                Netflix, Spotify, Amazon, apps, academias online.<br/>
                Cancelamento + restituição em dobro garantida pelo CDC.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="#contato"
                  className="inline-flex items-center justify-center gap-2 bg-white text-cyan-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-cyan-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
                >
                  <MessageCircle className="w-5 h-5" />
                  QUERO MEU DINHEIRO DE VOLTA
                </Link>
              </div>

              <div className="mt-8 flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span className="text-sm">Processo rápido (2-4 meses)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span className="text-sm">95% automação</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <div className="space-y-4">
                  <div className="flex items-start gap-4 bg-white/5 p-4 rounded-lg">
                    <DollarSign className="w-8 h-8 text-green-400 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-lg">Restituição em Dobro</div>
                      <div className="text-cyan-200 text-sm">De tudo que foi cobrado indevidamente</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 bg-white/5 p-4 rounded-lg">
                    <TrendingUp className="w-8 h-8 text-yellow-400 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-lg">Danos Morais</div>
                      <div className="text-cyan-200 text-sm">Se negativaram seu nome</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 bg-white/5 p-4 rounded-lg">
                    <Clock className="w-8 h-8 text-blue-400 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-lg">2-4 meses</div>
                      <div className="text-cyan-200 text-sm">Processo no JEC</div>
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
            Qual Desses Problemas É o Seu?
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {[
              'Cancelou mas continua cobrando no cartão',
              'Período de teste virou cobrança sem avisar',
              'Não consegue cancelar (site dificulta)',
              'Cobraram após você pedir cancelamento',
              'Renovação automática sem autorização',
              'Te negativaram por assinatura que você cancelou'
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <span className="text-gray-800 font-medium">{item}</span>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-cyan-900 to-blue-900 text-white p-8 rounded-xl">
            <h3 className="text-2xl font-bold mb-4">Você Não Está Sozinho</h3>
            <p className="text-lg text-cyan-100 mb-4">
              Todo mundo tem assinaturas digitais hoje.<br/>
              E empresas SABEM como dificultar o cancelamento.
            </p>
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div className="bg-white/10 p-4 rounded-lg">
                <div className="text-3xl font-bold text-cyan-300">20.000+</div>
                <div className="text-sm text-cyan-200">Buscas/mês por advogado</div>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <div className="text-3xl font-bold text-cyan-300">95%</div>
                <div className="text-sm text-cyan-200">Casos são ganhos no JEC</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Empresas Section */}
      <section className="py-20 bg-cyan-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Empresas Mais Comuns (Mas Vale Para Todas)
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Streaming', items: ['Netflix', 'Spotify', 'Amazon Prime', 'Apple Music', 'Disney+', 'HBO Max'] },
              { title: 'Apps/Software', items: ['Google Play', 'App Store', 'Adobe', 'Microsoft 365', 'iCloud'] },
              { title: 'Outros', items: ['Academias online', 'Cursos', 'Jogos', 'Dating apps', 'Produtividade'] }
            ].map((cat, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md border border-cyan-200">
                <h3 className="font-bold text-lg text-cyan-900 mb-4">{cat.title}</h3>
                <ul className="space-y-2">
                  {cat.items.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-700">
                      <div className="w-2 h-2 bg-cyan-600 rounded-full"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg">
            <p className="text-blue-800">
              <strong>Importante:</strong> Não importa qual empresa. Se cancelou e continuaram cobrando, ou se renovaram sem avisar, você tem direito à restituição em DOBRO.
            </p>
          </div>
        </div>
      </section>

      {/* Solução Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-6 text-gray-900">
            Seus Direitos (Código de Defesa do Consumidor)
          </h2>
          <p className="text-xl text-center text-gray-600 mb-12">
            A lei está 100% do seu lado
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-cyan-900 mb-6">O Que Você Pode Receber</h3>
              {[
                { title: 'Cancelamento Imediato', desc: 'Da assinatura' },
                { title: 'Restituição em DOBRO', desc: 'De tudo que foi cobrado após cancelar (Art. 42 CDC)' },
                { title: 'Danos Morais', desc: 'R$ 3.000-10.000 se negativaram' },
                { title: 'Processo Rápido', desc: 'JEC resolve em 2-4 meses' }
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3 bg-green-50 p-4 rounded-lg border border-green-200">
                  <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold text-gray-900">{item.title}</div>
                    <div className="text-sm text-gray-600">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <h3 className="text-2xl font-bold text-cyan-900 mb-6">Como Funciona</h3>
              <div className="space-y-4">
                {[
                  { num: '1', text: 'Você me manda os extratos do cartão' },
                  { num: '2', text: 'Identificamos todas as cobranças indevidas' },
                  { num: '3', text: 'Tentamos resolver direto com a empresa' },
                  { num: '4', text: 'Se não resolverem: entramos na Justiça' }
                ].map((step, index) => (
                  <div key={index} className="flex items-start gap-3 bg-cyan-50 p-4 rounded-lg border border-cyan-200">
                    <div className="w-8 h-8 bg-cyan-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                      {step.num}
                    </div>
                    <span className="text-gray-700 pt-1">{step.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pacote/Oferta Section */}
      <section className="py-20 bg-gradient-to-b from-white to-cyan-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Pacote Assinaturas Digitais</h2>
            <p className="text-xl text-gray-600">Tudo incluído para você ganhar o caso</p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl border-2 border-cyan-200 overflow-hidden max-w-2xl mx-auto">
            <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-6 text-center">
              <div className="text-sm font-semibold uppercase tracking-wide mb-2">Consumidor Digital</div>
              <div className="text-3xl font-bold">Pacote Completo</div>
            </div>

            <div className="p-8">
              <div className="space-y-4 mb-8">
                {[
                  'Análise GRATUITA dos extratos',
                  'Identificação de todas cobranças indevidas',
                  'Cálculo do valor a receber (em dobro)',
                  'Tentativa de acordo extrajudicial',
                  'Ação judicial no JEC',
                  'Restituição em DOBRO',
                  'Danos morais (se negativou)',
                  'Acompanhamento até decisão final'
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
                  <div className="text-5xl font-bold text-cyan-900 mb-2">R$ 1.500</div>
                  <div className="text-gray-600">Pagamento único</div>
                </div>
              </div>

              <div className="space-y-3">
                <Link
                  href="#contato"
                  className="block w-full bg-cyan-600 hover:bg-cyan-700 text-white text-center py-4 rounded-lg font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
                >
                  QUERO MEU DINHEIRO DE VOLTA
                </Link>
                <p className="text-sm text-center text-gray-500">
                  Resposta em até 2 horas úteis
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-4xl font-bold text-cyan-600 mb-2">95%</div>
              <div className="text-gray-600">Automação IA</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-4xl font-bold text-cyan-600 mb-2">2-4</div>
              <div className="text-gray-600">Meses (JEC)</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-4xl font-bold text-cyan-600 mb-2">20k+</div>
              <div className="text-gray-600">Casos/mês no Brasil</div>
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
              'Extratos do cartão de crédito',
              'Prints do cancelamento',
              'Emails de confirmação/cancelamento',
              'RG e CPF',
              'Print da fatura do cartão (se negativou)',
              'Protocolo de reclamação (se tiver)'
            ].map((doc, index) => (
              <div key={index} className="flex items-center gap-3 p-4 bg-cyan-50 rounded-lg border border-cyan-200">
                <FileText className="w-5 h-5 text-cyan-600 flex-shrink-0" />
                <span className="text-gray-700">{doc}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-green-50 border-l-4 border-green-600 p-6 rounded-r-lg">
            <p className="text-green-800">
              <strong>Não tem tudo?</strong> Sem problema! Começamos com o extrato do cartão. O resto a gente requisita da empresa.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-cyan-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Perguntas Frequentes
          </h2>

          <div className="space-y-6">
            {[
              {
                q: 'Cancelei mas não guardei comprovante. Ainda posso processar?',
                a: 'SIM! O extrato do cartão mostrando as cobranças após o cancelamento é prova suficiente. Se a empresa alega que você não cancelou, ela que tem que provar.'
              },
              {
                q: 'Quanto vou receber?',
                a: 'DOBRO de tudo que foi cobrado indevidamente. Se te negativaram, mais R$ 3.000-10.000 de danos morais.'
              },
              {
                q: 'Funciona para qualquer assinatura?',
                a: 'Sim! Netflix, Spotify, apps, academias online, cursos, jogos, qualquer assinatura digital.'
              },
              {
                q: 'E se foi só R$ 30/mês?',
                a: 'Não importa o valor! Se cobraram 6 meses indevidamente (R$ 180), você recebe R$ 360 em dobro. E se negativaram, mais os danos morais.'
              },
              {
                q: 'Preciso pagar para começar?',
                a: 'Análise é GRATUITA. Só paga se decidir seguir com o processo. Investimento único de R$ 1.500.'
              },
              {
                q: 'Quanto tempo demora?',
                a: '2 a 4 meses no Juizado Especial Cível. É um dos processos mais rápidos.'
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-cyan-100">
                <h3 className="font-semibold text-lg text-gray-900 mb-3">{faq.q}</h3>
                <p className="text-gray-700">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section id="contato" className="py-20 bg-gradient-to-r from-cyan-900 via-blue-800 to-cyan-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <CreditCard className="w-16 h-16 mx-auto mb-6 text-cyan-300" />
          <h2 className="text-4xl font-bold mb-6">
            Chega de Ser Enganado Por Empresas Digitais
          </h2>
          <p className="text-xl text-cyan-100 mb-8 max-w-2xl mx-auto">
            Você cancelou? Eles têm que PARAR de cobrar.<br/>
            Continuaram? Você tem direito a receber em DOBRO.<br/><br/>
            Me manda mensagem no WhatsApp agora.<br/>
            Me conta o que está acontecendo.<br/>
            Me manda o extrato do cartão.<br/><br/>
            Em 2 horas eu te respondo e te digo quanto você vai receber.
          </p>

          <Link
            href="https://wa.me/5511999999999?text=Olá, cancelei assinatura mas continuam cobrando"
            target="_blank"
            className="inline-flex items-center justify-center gap-2 bg-white text-cyan-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-cyan-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
          >
            <MessageCircle className="w-5 h-5" />
            ANALISAR COBRANÇAS - WHATSAPP
          </Link>

          <p className="mt-6 text-cyan-200">
            💳 Netflix • Spotify • Amazon • Apple • Google • Todas as assinaturas
          </p>
        </div>
      </section>

    </div>
  )
}
