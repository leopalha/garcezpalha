import { Metadata } from 'next'
import Link from 'next/link'
import { Plane, Clock, AlertCircle, CheckCircle2, XCircle, MessageCircle, FileText } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Overbooking e Voo Cancelado - Indenização | Garcez Palha',
  description: 'Voo cancelado, overbooking, atraso +4h, bagagem extraviada? Resolução ANAC 400 + CDC garantem indenização R$ 1.000-5.000 + danos materiais. Advogado especialista.',
  keywords: ['overbooking', 'voo cancelado indenização', 'atraso voo', 'bagagem extraviada', 'anac 400', 'indenização aérea'],
}

export default function OverbookingVooPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <section className="bg-gradient-to-r from-sky-900 via-blue-800 to-sky-900 text-white py-24">
        <div className="max-w-4xl mx-auto px-4">
          <Plane className="w-16 h-16 mb-6 text-sky-300" />
          <h1 className="text-5xl font-bold mb-6">Voo Cancelado, Overbooking ou Atraso?<br/><span className="text-sky-300">Você Tem Direito a Indenização.</span></h1>
          <p className="text-xl text-sky-100 mb-8">Perdeu compromisso, casamento, reunião?<br/>Resolução ANAC 400 + CDC garantem compensação.<br/>Processo rápido no JEC.</p>
          <Link href="#contato" className="inline-flex items-center gap-2 bg-white text-sky-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-sky-50 transition shadow-xl"><MessageCircle className="w-5 h-5" />QUERO MINHA INDENIZAÇÃO</Link>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">O Que Aconteceu Com Você?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {['Overbooking - não embarcou', 'Voo cancelado sem avisar', 'Atraso superior a 4 horas', 'Bagagem extraviada ou danificada', 'Perdeu compromisso importante', 'Companhia não deu assistência'].map(item => (
              <div key={item} className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                <XCircle className="w-6 h-6 text-red-600 mt-1" />
                <span className="text-gray-800 font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-sky-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Seus Direitos (ANAC 400 + CDC)</h2>
          <div className="space-y-6">
            {[
              {title:'Danos Morais',desc:'R$ 1.000 a R$ 5.000 por constrangimento'},
              {title:'Danos Materiais',desc:'Hotel, alimentação, transporte, prejuízos'},
              {title:'Reembolso Passagem',desc:'Valor integral se não reacomodado'},
              {title:'Assistência Material',desc:'Alimentação, hospedagem, comunicação'},
              {title:'Reacomodação',desc:'Próximo voo ou empresa concorrente'},
              {title:'Indenização Bagagem',desc:'Até 1.131 DES (R$ 6.000+)'}
            ].map(i => (
              <div key={i.title} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-sky-600">
                <h3 className="font-bold text-lg mb-2">{i.title}</h3>
                <p className="text-gray-600">{i.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Valores de Indenização</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {periodo:'Atraso 4h+',valor:'R$ 1.000 - R$ 2.000'},
              {periodo:'Cancelamento',valor:'R$ 2.000 - R$ 3.000'},
              {periodo:'Overbooking',valor:'R$ 3.000 - R$ 5.000'},
              {periodo:'Bagagem Extraviada',valor:'R$ 1.000 - R$ 6.000'},
              {periodo:'Compromisso Perdido',valor:'R$ 5.000 - R$ 10.000'},
              {periodo:'Danos Materiais',valor:'Valor comprovado'}
            ].map(i => (
              <div key={i.periodo} className="bg-sky-50 p-6 rounded-lg text-center border border-sky-200">
                <div className="font-bold text-lg mb-2">{i.periodo}</div>
                <div className="text-2xl font-bold text-sky-900">{i.valor}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-sky-50">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-sky-200">
            <div className="bg-gradient-to-r from-sky-600 to-blue-600 text-white p-6 text-center"><h2 className="text-3xl font-bold">Pacote Voo - Indenização</h2></div>
            <div className="p-8">
              <div className="space-y-4 mb-8">
                {['Análise completa do caso','Coleta de provas e protocolos','Notificação à companhia aérea','Ação judicial no JEC','Danos morais + materiais','Reembolso da passagem'].map(i => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-sky-600" />
                    <span className="text-gray-700">{i}</span>
                  </div>
                ))}
              </div>
              <div className="text-center mb-8"><div className="text-5xl font-bold text-sky-900">R$ 2.000</div><div className="text-gray-600 mt-2">Investimento único</div></div>
              <Link href="#contato" className="block w-full bg-sky-600 hover:bg-sky-700 text-white text-center py-4 rounded-lg font-semibold text-lg transition">RESOLVER AGORA</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Documentos Necessários</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {['Bilhete aéreo (e-ticket)','Boarding pass ou PIR','Protocolos de reclamação','Comprovantes de despesas (hotel, táxi, alimentação)','RG e CPF','Prints de comunicações'].map(doc => (
              <div key={doc} className="flex items-center gap-3 p-4 bg-sky-50 rounded-lg border border-sky-200">
                <FileText className="w-5 h-5 text-sky-600" />
                <span className="text-gray-700">{doc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-sky-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Perguntas Frequentes</h2>
          <div className="space-y-6">
            {[
              {q:'Quanto tempo demora o processo?',a:'Entre 3 e 6 meses no Juizado Especial Cível.'},
              {q:'Posso processar qualquer companhia?',a:'Sim. Nacionais e internacionais que operam no Brasil.'},
              {q:'E se já faz tempo?',a:'Prazo de 5 anos para cobrar (prescrição).'},
              {q:'Preciso ter ido à ANAC antes?',a:'Não é obrigatório, mas ajuda fortalecer o caso.'},
              {q:'Quanto posso receber?',a:'De R$ 1.000 a R$ 10.000+ dependendo da gravidade.'},
              {q:'E se a companhia faliu?',a:'Responsabilidade solidária pode atingir outras empresas.'}
            ].map(i => (
              <div key={i.q} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-bold text-lg mb-2 text-sky-900">{i.q}</h3>
                <p className="text-gray-600">{i.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contato" className="py-20 bg-gradient-to-r from-sky-900 to-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Seu Voo, Seus Direitos</h2>
          <p className="text-xl mb-8">Me manda os detalhes do voo e vamos buscar sua indenização.</p>
          <Link href="https://wa.me/5511999999999" target="_blank" className="inline-flex items-center gap-2 bg-white text-sky-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-sky-50 transition shadow-xl"><MessageCircle className="w-5 h-5" />WHATSAPP</Link>
        </div>
      </section>
    </div>
  )
}
