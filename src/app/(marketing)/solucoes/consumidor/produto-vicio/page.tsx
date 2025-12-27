import { Metadata } from 'next'
import Link from 'next/link'
import { Package, CheckCircle2, XCircle, FileText, Clock, MessageCircle, AlertCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Produto com Defeito - Loja Não Troca | Garcez Palha',
  description: 'Produto com defeito e loja não troca? Assistência não resolve em 30 dias? Art. 18 CDC garante: troca, restituição ou abatimento + danos morais. Advogado especialista em direito do consumidor.',
  keywords: ['produto defeito loja não troca', 'celular com defeito', 'eletrodoméstico quebrado', 'art 18 cdc'],
}

export default function ProdutoVicioPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <section className="relative overflow-hidden bg-gradient-to-r from-green-900 via-emerald-800 to-green-900 text-white">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-4xl">
            <Package className="w-16 h-16 mb-6 text-green-300" />
            <h1 className="text-5xl font-bold mb-6">
              Produto Com Defeito e Loja Não Troca?<br/>
              <span className="text-green-300">Você Tem Direito Garantido Pelo CDC.</span>
            </h1>
            <p className="text-xl text-green-100 mb-8">
              Celular, eletrodoméstico, móveis, veículos.<br/>
              Se tem defeito: troca, devolução ou abatimento.<br/>
              Art. 18 do Código de Defesa do Consumidor.
            </p>
            <Link href="#contato" className="inline-flex items-center gap-2 bg-white text-green-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-50 transition-all shadow-xl">
              <MessageCircle className="w-5 h-5" />
              RESOLVER MEU PROBLEMA
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">O Que Está Acontecendo?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {['Produto apresentou defeito dentro da garantia', 'Loja não quer trocar', 'Assistência não resolve em 30 dias', 'Produto essencial parado (geladeira, celular)', 'Loja oferece só conserto', 'Defeito se repete após conserto'].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <span className="text-gray-800 font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-green-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Seus Direitos (Art. 18 CDC)</h2>
          <div className="space-y-6">
            {[
              { title: 'Troca por Produto Novo', desc: 'Mesmo modelo ou equivalente' },
              { title: 'Restituição do Valor', desc: 'Dinheiro de volta com correção' },
              { title: 'Abatimento Proporcional', desc: 'Se quiser ficar com produto' },
              { title: 'Danos Morais', desc: 'Se produto essencial ou transtorno grave' }
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-600">
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-blue-50 border-l-4 border-blue-600 p-6">
            <p className="text-blue-800"><strong>Prazo:</strong> Se em 30 dias não resolverem na assistência, você pode ESCOLHER entre troca, devolução ou abatimento.</p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-green-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 text-center">
              <div className="text-3xl font-bold">Pacote Produto com Vício</div>
            </div>
            <div className="p-8">
              <div className="space-y-4 mb-8">
                {['Análise do caso e nota fiscal', 'Notificação à loja/fabricante', 'Ação judicial no JEC', 'Troca, devolução ou abatimento', 'Danos morais (se aplicável)'].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
              <div className="border-t-2 pt-6 mb-6 text-center">
                <div className="text-5xl font-bold text-green-900 mb-2">R$ 1.500</div>
                <div className="text-gray-600">Investimento único</div>
              </div>
              <Link href="#contato" className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-4 rounded-lg font-semibold text-lg transition">
                QUERO RESOLVER
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="contato" className="py-20 bg-gradient-to-r from-green-900 via-emerald-800 to-green-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Não Aceite Produto Defeituoso</h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Você pagou. O produto tem que funcionar.<br/>
            Me conta o que aconteceu e vamos resolver juntos.
          </p>
          <Link href="https://wa.me/5511999999999?text=Olá, comprei produto com defeito" target="_blank" className="inline-flex items-center gap-2 bg-white text-green-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-50 transition shadow-xl">
            <MessageCircle className="w-5 h-5" />
            FALAR COM ADVOGADO - WHATSAPP
          </Link>
        </div>
      </section>
    </div>
  )
}
