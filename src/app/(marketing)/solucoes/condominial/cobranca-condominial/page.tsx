import { Metadata } from 'next'
import Link from 'next/link'
import { Building, XCircle, CheckCircle2, MessageCircle, FileText, Scale } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Cobrança Condominial Abusiva - Multa Indevida | Garcez Palha',
  description: 'Condomínio cobrando multa abusiva? Rateio sem aprovação? Taxa ilegal? Lei 4.591/64 protege condôminos. Advogado especialista em direito condominial.',
  keywords: ['cobrança condominial abusiva', 'multa condomínio indevida', 'rateio sem aprovação', 'taxa ilegal condomínio'],
}

export default function CobrancaCondominialPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <section className="bg-gradient-to-r from-slate-900 via-gray-800 to-slate-900 text-white py-24">
        <div className="max-w-4xl mx-auto px-4">
          <Building className="w-16 h-16 mb-6 text-slate-300" />
          <h1 className="text-5xl font-bold mb-6">Condomínio Cobrando Taxa Abusiva?<br/><span className="text-slate-300">Você Tem Direitos.</span></h1>
          <p className="text-xl text-slate-100 mb-8">Multa indevida, rateio sem aprovação, obra não autorizada?<br/>Lei 4.591/64 e Convenção de Condomínio protegem você.</p>
          <Link href="#contato" className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-slate-50 transition shadow-xl"><MessageCircle className="w-5 h-5" />CONTESTAR COBRANÇA</Link>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Cobranças Abusivas Comuns</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {['Multa acima do limite legal (2%)', 'Rateio de obra sem aprovação em assembleia', 'Taxa de mudança ilegal', 'Cobrança de fundo de reserva irregular', 'Multa por infração inexistente', 'Juros e correção excessivos'].map(item => (
              <div key={item} className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                <XCircle className="w-6 h-6 text-red-600 mt-1" />
                <span className="text-gray-800 font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">O Que Diz a Lei</h2>
          <div className="space-y-6">
            {[
              {title:'Multa Limitada a 2%',desc:'Lei 4.591/64: multa de condomínio NÃO pode passar de 2% do débito'},
              {title:'Rateio Exige Aprovação',desc:'Obra ou despesa extraordinária precisa de assembleia (maioria)'},
              {title:'Convenção é Lei Interna',desc:'Cobranças devem seguir a convenção de condomínio'},
              {title:'Taxa de Mudança É Ilegal',desc:'STJ: não pode cobrar taxa para mudança (salvo se previsto)'},
              {title:'Transparência Obrigatória',desc:'Condôminos têm direito a ver planilhas e documentos'},
              {title:'Contestação É Direito',desc:'Pode contestar cobrança sem ser multado por isso'}
            ].map(i => (
              <div key={i.title} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-slate-600">
                <h3 className="font-bold text-lg mb-2"><Scale className="inline w-5 h-5 mr-2" />{i.title}</h3>
                <p className="text-gray-600">{i.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Como Resolver</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {step:'1',title:'Análise',desc:'Verificamos boleto, convenção e atas de assembleia'},
              {step:'2',title:'Notificação',desc:'Notificamos o condomínio contestando a cobrança'},
              {step:'3',title:'Judicial',desc:'Se necessário, ação para anular cobrança abusiva'}
            ].map(i => (
              <div key={i.step} className="bg-slate-50 p-6 rounded-lg text-center border-2 border-slate-300">
                <div className="text-4xl font-bold text-slate-900 mb-3">{i.step}</div>
                <h3 className="font-bold text-lg mb-2">{i.title}</h3>
                <p className="text-gray-600 text-sm">{i.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-slate-200">
            <div className="bg-gradient-to-r from-slate-600 to-gray-600 text-white p-6 text-center"><h2 className="text-3xl font-bold">Pacote Condomínio</h2></div>
            <div className="p-8">
              <div className="space-y-4 mb-8">
                {['Análise do boleto e convenção','Identificação de ilegalidades','Notificação ao condomínio','Ação de anulação se necessário','Suspensão da cobrança','Danos morais se aplicável'].map(i => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-slate-600" />
                    <span className="text-gray-700">{i}</span>
                  </div>
                ))}
              </div>
              <div className="text-center mb-8"><div className="text-5xl font-bold text-slate-900">R$ 1.500</div><div className="text-gray-600 mt-2">Investimento único</div></div>
              <Link href="#contato" className="block w-full bg-slate-600 hover:bg-slate-700 text-white text-center py-4 rounded-lg font-semibold text-lg transition">CONTESTAR AGORA</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Documentos Necessários</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {['Boleto da cobrança','Convenção de condomínio','Atas de assembleias (últimas 2)','Planilhas de rateio (se houver)','Emails/avisos do síndico','RG, CPF e comprovante de residência'].map(doc => (
              <div key={doc} className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <FileText className="w-5 h-5 text-slate-600" />
                <span className="text-gray-700">{doc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Perguntas Frequentes</h2>
          <div className="space-y-6">
            {[
              {q:'Qual o limite da multa de condomínio?',a:'2% do valor do débito (Lei 4.591/64). Acima disso é abusivo.'},
              {q:'Podem cobrar taxa de mudança?',a:'Não, salvo se previsto na convenção. STJ já decidiu contra.'},
              {q:'E se a assembleia aprovou obra que não quero pagar?',a:'Obra extraordinária precisa de aprovação da maioria. Se não teve, não pode cobrar.'},
              {q:'Posso deixar de pagar o condomínio?',a:'Não recomendamos. Melhor é pagar sob protesto e contestar judicialmente.'},
              {q:'Quanto tempo demora?',a:'Notificação: 15-30 dias. Judicial: 4-8 meses.'},
              {q:'E se já paguei a cobrança abusiva?',a:'Pode pedir restituição em até 5 anos (prescrição).'}
            ].map(i => (
              <div key={i.q} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-bold text-lg mb-2 text-slate-900">{i.q}</h3>
                <p className="text-gray-600">{i.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contato" className="py-20 bg-gradient-to-r from-slate-900 to-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Condomínio Não Pode Cobrar Qualquer Coisa</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Me manda seu boleto e a convenção.<br/>Vamos verificar se a cobrança é legal.</p>
          <Link href="https://wa.me/5511999999999" target="_blank" className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-slate-50 transition shadow-xl"><MessageCircle className="w-5 h-5" />FALAR COM ADVOGADO - WHATSAPP</Link>
        </div>
      </section>
    </div>
  )
}
