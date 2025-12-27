import { Metadata } from 'next'
import Link from 'next/link'
import { Package, Clock, MessageCircle, CheckCircle2, XCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Atraso na Entrega - Comprou e Não Chegou | Garcez Palha',
  description: 'Comprou online e não chegou no prazo? Presente não chegou a tempo? Art. 35 CDC: cancelamento + devolução ou danos morais. Processo rápido no JEC.',
  keywords: ['atraso entrega', 'comprei não chegou', 'presente não chegou', 'art 35 cdc'],
}

export default function AtrasoEntregaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <section className="bg-gradient-to-r from-amber-900 via-orange-800 to-amber-900 text-white py-24">
        <div className="max-w-4xl mx-auto px-4">
          <Clock className="w-16 h-16 mb-6 text-amber-300" />
          <h1 className="text-5xl font-bold mb-6">Comprou Online e Não Chegou No Prazo?<br/><span className="text-amber-300">Você Tem Direito a Indenização.</span></h1>
          <p className="text-xl text-amber-100 mb-8">Presente perdeu a data? Móvel atrasou meses?<br/>CDC garante seus direitos. Processo rápido no JEC.</p>
          <Link href="#contato" className="inline-flex items-center gap-2 bg-white text-amber-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-amber-50 transition shadow-xl"><MessageCircle className="w-5 h-5" />QUERO RESOLVER</Link>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Situações Comuns</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {['Comprou presente e não chegou para a data', 'Móvel/eletrodoméstico atrasou meses', 'Loja enrola mas não entrega', 'Produto essencial que você precisa urgente', 'Rastreio travado há semanas', 'Loja não responde reclamações'].map(item => (
              <div key={item} className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                <XCircle className="w-6 h-6 text-red-600 mt-1" />
                <span className="text-gray-800 font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-amber-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Direitos (Art. 35 CDC)</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[{title:'Cumprimento Forçado',desc:'Obrigar entrega'},{title:'Produto Equivalente',desc:'Mesmo valor'},{title:'Cancelamento',desc:'Dinheiro de volta'},{title:'Danos Morais',desc:'Se presente/data'},{title:'Danos Materiais',desc:'Prejuízos'},{title:'JEC Rápido',desc:'2-3 meses'}].map(i => (
              <div key={i.title} className="bg-white p-6 rounded-lg shadow-md text-center">
                <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">{i.title}</h3>
                <p className="text-gray-600 text-sm">{i.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-amber-200">
            <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white p-6 text-center"><h2 className="text-3xl font-bold">Pacote Atraso Entrega</h2></div>
            <div className="p-8">
              <div className="text-center mb-8"><div className="text-5xl font-bold text-amber-900">R$ 1.500</div></div>
              <Link href="#contato" className="block w-full bg-amber-600 hover:bg-amber-700 text-white text-center py-4 rounded-lg font-semibold text-lg transition">RESOLVER AGORA</Link>
            </div>
          </div>
        </div>
      </section>

      <section id="contato" className="py-20 bg-gradient-to-r from-amber-900 to-orange-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Comprou, Tem Que Chegar</h2>
          <p className="text-xl mb-8">Me manda o comprovante e vamos resolver.</p>
          <Link href="https://wa.me/5511999999999" target="_blank" className="inline-flex items-center gap-2 bg-white text-amber-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-amber-50 transition shadow-xl"><MessageCircle className="w-5 h-5" />WHATSAPP</Link>
        </div>
      </section>
    </div>
  )
}
