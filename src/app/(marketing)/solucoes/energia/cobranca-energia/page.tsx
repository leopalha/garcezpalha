import { Metadata } from 'next'
import Link from 'next/link'
import { Zap, XCircle, CheckCircle2, MessageCircle, FileText, AlertCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Cobrança Indevida Energia - Conta de Luz Alta | Garcez Palha',
  description: 'Conta de luz muito alta? Consumo estimado, troca de medidor com retroativo, corte indevido? CDC garante restituição em dobro. Advogado especialista em direito do consumidor.',
  keywords: ['cobrança indevida energia', 'conta luz alta', 'consumo estimado', 'corte luz indevido', 'troca medidor', 'débito prescrito energia'],
}

export default function CobrancaEnergiaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white">
      <section className="bg-gradient-to-r from-yellow-900 via-amber-800 to-yellow-900 text-white py-24">
        <div className="max-w-4xl mx-auto px-4">
          <Zap className="w-16 h-16 mb-6 text-yellow-300" />
          <h1 className="text-5xl font-bold mb-6">Sua Conta de Luz Veio Muito Alta?<br/><span className="text-yellow-300">Você Pode Ter Direito a Restituição.</span></h1>
          <p className="text-xl text-yellow-100 mb-8">Consumo estimado, troca de medidor com cobrança retroativa, débitos prescritos?<br/>CDC garante seus direitos. Processo rápido no JEC.</p>
          <Link href="#contato" className="inline-flex items-center gap-2 bg-white text-yellow-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-50 transition shadow-xl"><MessageCircle className="w-5 h-5" />QUERO RESOLVER</Link>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">O Que Está Acontecendo?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {['Conta veio muito mais alta que o normal', 'Cobrança por consumo estimado (medidor não lido)', 'Trocaram o medidor e cobraram retroativo', 'Cobrando débitos de mais de 5 anos (prescritos)', 'Cortaram a luz sem avisar', 'Taxas e tarifas estranhas na conta'].map(item => (
              <div key={item} className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                <XCircle className="w-6 h-6 text-red-600 mt-1" />
                <span className="text-gray-800 font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-yellow-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Seus Direitos (CDC)</h2>
          <div className="space-y-6">
            {[
              {title:'Consumo Estimado É Exceção',desc:'Medidor deve ser lido mensalmente. Estimativa só em caso excepcional.'},
              {title:'Cobrança Retroativa Limitada',desc:'Após troca de medidor, máximo 90 dias de diferença.'},
              {title:'Débitos Prescritos (> 5 anos)',desc:'Dívidas com mais de 5 anos NÃO podem ser cobradas.'},
              {title:'Corte Exige Aviso Prévio',desc:'15 dias de antecedência por escrito. Sem aviso = ilegal.'},
              {title:'Restituição em Dobro',desc:'Se cobrança indevida, devolução em dobro (Art. 42 CDC).'},
              {title:'Danos Morais',desc:'Corte indevido, constrangimento, transtornos.'}
            ].map(i => (
              <div key={i.title} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-600">
                <h3 className="font-bold text-lg mb-2">{i.title}</h3>
                <p className="text-gray-600">{i.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-red-50 border-l-4 border-red-600 p-6">
            <p className="text-red-800"><AlertCircle className="inline w-5 h-5 mr-2" /><strong>IMPORTANTE:</strong> STJ mudou entendimento sobre TUSD/TUST em 2024. Não trabalhamos mais com essa tese. Foco em: consumo estimado, débitos prescritos, corte indevido.</p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Como Funciona</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {step:'1',title:'Análise',desc:'Envie suas contas de luz dos últimos meses'},
              {step:'2',title:'Identificação',desc:'Identificamos cobranças indevidas, prescrição, erros'},
              {step:'3',title:'Ação',desc:'Notificação + Ação no JEC se necessário'}
            ].map(i => (
              <div key={i.step} className="bg-yellow-50 p-6 rounded-lg text-center border-2 border-yellow-300">
                <div className="text-4xl font-bold text-yellow-900 mb-3">{i.step}</div>
                <h3 className="font-bold text-lg mb-2">{i.title}</h3>
                <p className="text-gray-600 text-sm">{i.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-yellow-50">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-yellow-200">
            <div className="bg-gradient-to-r from-yellow-600 to-amber-600 text-white p-6 text-center"><h2 className="text-3xl font-bold">Pacote Cobrança Energia</h2></div>
            <div className="p-8">
              <div className="space-y-4 mb-8">
                {['Análise completa das contas','Identificação de cobranças indevidas','Cálculo de prescrição (5 anos)','Notificação à concessionária','Ação judicial no JEC','Restituição em dobro + danos morais'].map(i => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-yellow-600" />
                    <span className="text-gray-700">{i}</span>
                  </div>
                ))}
              </div>
              <div className="text-center mb-8"><div className="text-5xl font-bold text-yellow-900">R$ 1.500</div><div className="text-gray-600 mt-2">Investimento único</div></div>
              <Link href="#contato" className="block w-full bg-yellow-600 hover:bg-yellow-700 text-white text-center py-4 rounded-lg font-semibold text-lg transition">QUERO RESOLVER</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Documentos Necessários</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {['Últimas 12 contas de luz','Histórico de consumo (se tiver)','Notificações de corte ou débito','Comprovantes de pagamento','RG, CPF e comprovante de residência','Prints de reclamações (se houver)'].map(doc => (
              <div key={doc} className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <FileText className="w-5 h-5 text-yellow-600" />
                <span className="text-gray-700">{doc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-yellow-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Perguntas Frequentes</h2>
          <div className="space-y-6">
            {[
              {q:'Consumo estimado é permitido?',a:'Só em casos excepcionais (chuva forte, cachorro bravo, etc). A regra é leitura mensal.'},
              {q:'Trocaram meu medidor e a conta triplicou. É normal?',a:'Não. A cobrança retroativa é limitada a 90 dias de diferença.'},
              {q:'Tenho débitos de 2015. Podem cobrar?',a:'Não! Dívidas com mais de 5 anos estão prescritas (não podem ser cobradas).'},
              {q:'Cortaram minha luz sem avisar. E agora?',a:'Corte sem aviso prévio (15 dias) é ILEGAL. Você tem direito a religação imediata + danos morais.'},
              {q:'Quanto tempo demora?',a:'Notificação: 10-15 dias. Se precisar judicial: 3-6 meses no JEC.'},
              {q:'Quanto posso receber?',a:'Restituição em dobro do valor indevido + R$ 3.000-8.000 de danos morais (se corte indevido).'}
            ].map(i => (
              <div key={i.q} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-bold text-lg mb-2 text-yellow-900">{i.q}</h3>
                <p className="text-gray-600">{i.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contato" className="py-20 bg-gradient-to-r from-yellow-900 to-amber-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Conta de Luz Não Pode Ser Abusiva</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Me manda suas contas e vamos identificar cobranças indevidas.<br/>Você tem direitos.</p>
          <Link href="https://wa.me/5511999999999" target="_blank" className="inline-flex items-center gap-2 bg-white text-yellow-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-50 transition shadow-xl"><MessageCircle className="w-5 h-5" />FALAR COM ADVOGADO - WHATSAPP</Link>
        </div>
      </section>
    </div>
  )
}
