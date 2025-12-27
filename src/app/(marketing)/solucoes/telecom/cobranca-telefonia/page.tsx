import { Metadata } from 'next'
import Link from 'next/link'
import {
  Phone, CheckCircle2, XCircle, FileText, Clock, TrendingUp,
  Shield, DollarSign, AlertCircle, MessageCircle
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Cobrança Indevida Telefonia/Internet - Restituição em Dobro | Garcez Palha',
  description: 'Operadora cobrando serviços que você não pediu? SVA, planos alterados, faturas acima do contratado. Advogado especialista em direito do consumidor. Restituição em dobro + danos morais.',
  keywords: [
    'cobrança indevida operadora',
    'vivo cobrando serviço não pedido',
    'claro cobrança indevida',
    'tim SVA não autorizado',
    'processar operadora telefonia',
    'cancelei mas continua cobrando',
    'serviço adicional não pedido',
    'plano alterado sem autorização'
  ],
  openGraph: {
    title: 'Cobrança Indevida Telefonia - Restituição em Dobro',
    description: 'Operadora cobrando serviços não contratados? Você tem direito a receber em dobro.',
    type: 'website',
  }
}

export default function CobrancaTelefoniaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-purple-700/50 px-4 py-2 rounded-full mb-6">
                <Phone className="w-4 h-4" />
                <span className="text-sm font-medium">Direito do Consumidor | Telecomunicações</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Sua Conta de Celular Veio Com Cobranças Que Você Não Pediu?<br/>
                <span className="text-purple-300">Você Tem Direito a Receber Em Dobro.</span>
              </h1>

              <p className="text-xl text-purple-100 mb-8 leading-relaxed">
                Advogado especialista em direito do consumidor.<br/>
                SVA, planos alterados, serviços não contratados.<br/>
                Repetição em dobro garantida pelo CDC.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="#contato"
                  className="inline-flex items-center justify-center gap-2 bg-white text-purple-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-purple-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
                >
                  <MessageCircle className="w-5 h-5" />
                  VERIFICAR MINHAS COBRANÇAS
                </Link>
              </div>

              <div className="mt-8 flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span className="text-sm">Atendimento 24h</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span className="text-sm">Sem custo inicial</span>
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
                      <div className="text-purple-200 text-sm">Garantida pelo Art. 42 CDC</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 bg-white/5 p-4 rounded-lg">
                    <TrendingUp className="w-8 h-8 text-blue-400 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-lg">Danos Morais</div>
                      <div className="text-purple-200 text-sm">R$ 3.000 a R$ 10.000 se negativou</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 bg-white/5 p-4 rounded-lg">
                    <Clock className="w-8 h-8 text-yellow-400 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-lg">Prazo: 2-4 meses</div>
                      <div className="text-purple-200 text-sm">Processo no JEC (rápido)</div>
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
            O Que Está Acontecendo Com Você?
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {[
              'Contratou plano de R$ 100 mas fatura vem R$ 150+',
              'Aparecem "Serviços de Valor Adicionado" (SVA)',
              'Jogos, apps, assinaturas que NUNCA pediu',
              'Plano mudou sem você autorizar',
              'Internet/ligações cobradas acima do contratado',
              'Operadora nega, mas continua cobrando'
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <span className="text-gray-800 font-medium">{item}</span>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-8 rounded-xl text-center">
            <h3 className="text-2xl font-bold mb-4">Você Não Está Sozinho</h3>
            <p className="text-lg text-purple-100 mb-2">
              Operadoras de telefonia são CAMPEÃS de reclamação no Brasil
            </p>
            <p className="text-3xl font-bold text-purple-300">30.000+ buscas/mês</p>
            <p className="text-sm text-purple-200 mt-2">Pessoas procurando advogado para processar operadora</p>
          </div>
        </div>
      </section>

      {/* Solução Section */}
      <section className="py-20 bg-purple-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-6 text-gray-900">
            O Que Você Pode Fazer
          </h2>
          <p className="text-xl text-center text-gray-600 mb-12">
            A lei está 100% do seu lado
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-purple-900">Seus Direitos (CDC)</h3>
              <div className="space-y-4">
                {[
                  { title: 'Cancelamento Imediato', desc: 'De todos os serviços não contratados' },
                  { title: 'Restituição em DOBRO', desc: 'De tudo que foi cobrado indevidamente (Art. 42)' },
                  { title: 'Danos Morais', desc: 'R$ 3.000-10.000 se te negativaram' },
                  { title: 'Processo Rápido', desc: 'Juizado Especial Cível (2-4 meses)' }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3 bg-white p-4 rounded-lg border border-purple-200">
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
              <h3 className="text-2xl font-bold mb-6 text-purple-900">Tipos de Cobrança Indevida</h3>
              <div className="space-y-3">
                {[
                  'SVA (Jogos, Horóscopo, Torpedos)',
                  'Plano alterado para mais caro',
                  'Internet/ligações acima do plano',
                  'Serviços cancelados mas ainda cobrados',
                  'Linha aberta no seu nome (fraude)',
                  'Fidelidade não contratada'
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 bg-white p-3 rounded-lg border border-purple-100">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">Jurisprudência Favorável</h4>
                <p className="text-blue-800">
                  Tribunais condenam operadoras DIARIAMENTE por cobrança indevida.<br/>
                  Taxa de sucesso: <strong>85%+</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pacote/Oferta Section */}
      <section className="py-20 bg-gradient-to-b from-white to-purple-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Pacote Cobrança Indevida Telefonia</h2>
            <p className="text-xl text-gray-600">Tudo incluído para você ganhar o caso</p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl border-2 border-purple-200 overflow-hidden max-w-2xl mx-auto">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 text-center">
              <div className="text-sm font-semibold uppercase tracking-wide mb-2">Telecomunicações</div>
              <div className="text-3xl font-bold">Pacote Completo</div>
            </div>

            <div className="p-8">
              <div className="space-y-4 mb-8">
                {[
                  'Análise GRATUITA das suas faturas',
                  'Identificação de todas as cobranças indevidas',
                  'Notificação extrajudicial à operadora',
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
                  <div className="text-5xl font-bold text-purple-900 mb-2">R$ 1.500</div>
                  <div className="text-gray-600">ou 3x de R$ 500 sem juros</div>
                </div>
              </div>

              <div className="space-y-3">
                <Link
                  href="#contato"
                  className="block w-full bg-purple-600 hover:bg-purple-700 text-white text-center py-4 rounded-lg font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
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
              <div className="text-4xl font-bold text-purple-600 mb-2">95%</div>
              <div className="text-gray-600">Automação IA</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-4xl font-bold text-purple-600 mb-2">2-4</div>
              <div className="text-gray-600">Meses (JEC)</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-4xl font-bold text-purple-600 mb-2">85%+</div>
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
              'Faturas dos últimos 12 meses',
              'Prints do plano contratado',
              'Protocolos de reclamação',
              'RG e CPF',
              'Comprovante de residência',
              'Extrato bancário (se debitou automaticamente)'
            ].map((doc, index) => (
              <div key={index} className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <FileText className="w-5 h-5 text-purple-600 flex-shrink-0" />
                <span className="text-gray-700">{doc}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-green-50 border-l-4 border-green-600 p-6 rounded-r-lg">
            <p className="text-green-800">
              <strong>Não tem todos?</strong> Sem problema! Começamos com o que você tem e requisitamos o resto da operadora.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-purple-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Perguntas Frequentes
          </h2>

          <div className="space-y-6">
            {[
              {
                q: 'Como sei se tenho cobranças indevidas?',
                a: 'Compare sua fatura com o plano contratado. Qualquer serviço que você não reconhece (SVA, assinaturas, serviços adicionais) ou valor acima do contratado é cobrança indevida.'
              },
              {
                q: 'Posso processar se já cancelei os serviços?',
                a: 'SIM! Você tem direito à restituição em DOBRO de tudo que foi cobrado indevidamente nos últimos 5 anos, mesmo que já tenha cancelado.'
              },
              {
                q: 'Quanto vou receber?',
                a: 'DOBRO de tudo que foi cobrado indevidamente + R$ 3.000 a R$ 10.000 de danos morais se você foi negativado.'
              },
              {
                q: 'Funciona para qualquer operadora?',
                a: 'Sim! Vivo, Claro, Tim, Oi, e todas as outras operadoras.'
              },
              {
                q: 'Quanto tempo demora?',
                a: '2 a 4 meses no Juizado Especial Cível. É um dos processos mais rápidos.'
              },
              {
                q: 'Preciso pagar para começar?',
                a: 'Análise é GRATUITA. Só paga se decidir seguir com o processo. Parcelamos em até 3x.'
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-purple-100">
                <h3 className="font-semibold text-lg text-gray-900 mb-3">{faq.q}</h3>
                <p className="text-gray-700">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section id="contato" className="py-20 bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Phone className="w-16 h-16 mx-auto mb-6 text-purple-300" />
          <h2 className="text-4xl font-bold mb-6">
            Conta Alta? Cobranças Estranhas?<br/>
            Não Aceite Isso.
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Me manda mensagem no WhatsApp agora.<br/>
            Me conta sua situação. Me manda as faturas.<br/><br/>
            Em 2 horas eu te respondo e te digo exatamente o que fazer.<br/><br/>
            Você não precisa aceitar essa injustiça.<br/>
            A lei está do seu lado.
          </p>

          <Link
            href="https://wa.me/5511999999999?text=Olá, quero verificar cobranças indevidas na minha conta de celular/internet"
            target="_blank"
            className="inline-flex items-center justify-center gap-2 bg-white text-purple-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-purple-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
          >
            <MessageCircle className="w-5 h-5" />
            ANALISAR MINHAS FATURAS - WHATSAPP
          </Link>

          <p className="mt-6 text-purple-200">
            📱 Vivo • Claro • Tim • Oi • Todas as operadoras
          </p>
        </div>
      </section>

    </div>
  )
}
