import { Metadata } from 'next'
import Link from 'next/link'
import { Building2, XCircle, CheckCircle2, MessageCircle, FileText, AlertCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Distrato Imobiliário - Cancelar Imóvel Planta | Garcez Palha',
  description: 'Desistir de imóvel na planta? Lei 13.786/2018 garante devolução de até 75% ou 100% se culpa da construtora. Advogado especialista em distrato imobiliário.',
  keywords: ['distrato imobiliário', 'cancelar imóvel planta', 'devolver dinheiro construtora', 'atraso entrega imóvel', 'lei 13786'],
}

export default function DistratoImobiliarioPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
      <section className="bg-gradient-to-r from-stone-900 via-neutral-800 to-stone-900 text-white py-24">
        <div className="max-w-4xl mx-auto px-4">
          <Building2 className="w-16 h-16 mb-6 text-amber-400" />
          <h1 className="text-5xl font-bold mb-6">Quer Desistir Do Imóvel Na Planta?<br/><span className="text-amber-400">Você Tem Direito De Reaver Seu Dinheiro.</span></h1>
          <p className="text-xl text-stone-100 mb-8">Obra atrasou, mudou de planos ou arrependeu-se?<br/>Lei 13.786/2018: devolução de até 75%.<br/>Se culpa da construtora: 100% + perdas e danos.</p>
          <Link href="#contato" className="inline-flex items-center gap-2 bg-amber-500 text-stone-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-amber-400 transition shadow-xl"><MessageCircle className="w-5 h-5" />QUERO MEU DINHEIRO DE VOLTA</Link>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Por Que Você Quer Desistir?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {['Obra atrasou anos', 'Perdeu a condição financeira', 'Mudou de cidade/planos', 'Construtora alterou projeto', 'Descobriu problemas na região', 'Construtora em recuperação judicial'].map(item => (
              <div key={item} className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                <XCircle className="w-6 h-6 text-red-600 mt-1" />
                <span className="text-gray-800 font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-stone-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Seus Direitos (Lei 13.786/2018)</h2>
          <div className="space-y-6">
            {[
              {title:'Devolução de 75%',desc:'Percentual mínimo garantido por lei (desconto máximo de 25%)'},
              {title:'Se Culpa da Construtora: 100%',desc:'Atraso na obra, alteração de projeto, problemas graves'},
              {title:'Devolução Imediata',desc:'Em até 30 dias se obra concluída, ou na entrega das chaves'},
              {title:'Danos Morais',desc:'Se construtora agiu de má-fé ou causou transtornos graves'},
              {title:'Perdas e Danos',desc:'Prejuízos comprovados (aluguel pago, mudança, etc.)'},
              {title:'Correção Monetária',desc:'Valor corrigido desde o pagamento'}
            ].map(i => (
              <div key={i.title} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-amber-500">
                <h3 className="font-bold text-lg mb-2">{i.title}</h3>
                <p className="text-gray-600">{i.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-blue-50 border-l-4 border-blue-600 p-6">
            <p className="text-blue-800"><AlertCircle className="inline w-5 h-5 mr-2" /><strong>Importante:</strong> A construtora NUNCA pode reter mais de 25% do valor pago. Qualquer cláusula acima disso é ABUSIVA e nula.</p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Quando Devolução é 100%?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {title:'Atraso na Obra',desc:'Superior a 180 dias do prazo contratual'},
              {title:'Alteração de Projeto',desc:'Mudanças significativas sem autorização'},
              {title:'Problemas Estruturais',desc:'Defeitos graves na construção'},
              {title:'Propaganda Enganosa',desc:'Promessas não cumpridas no lançamento'},
              {title:'Má-fé da Construtora',desc:'Ocultação de informações relevantes'},
              {title:'Recuperação Judicial',desc:'Construtora em dificuldades financeiras'}
            ].map(i => (
              <div key={i.title} className="bg-amber-50 p-6 rounded-lg border border-amber-200">
                <CheckCircle2 className="w-6 h-6 text-amber-600 mb-3" />
                <h3 className="font-bold text-lg mb-2">{i.title}</h3>
                <p className="text-gray-600 text-sm">{i.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-stone-50">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-amber-200">
            <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white p-6 text-center"><h2 className="text-3xl font-bold">Pacote Distrato Imobiliário</h2></div>
            <div className="p-8">
              <div className="space-y-4 mb-8">
                {['Análise completa do contrato','Levantamento de valores pagos','Notificação extrajudicial','Ação judicial de distrato','Busca de 75% a 100% + correção','Danos morais e materiais (se aplicável)'].map(i => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-amber-600" />
                    <span className="text-gray-700">{i}</span>
                  </div>
                ))}
              </div>
              <div className="border-t-2 pt-6 mb-6 text-center">
                <div className="text-5xl font-bold text-stone-900 mb-2">R$ 3.000</div>
                <div className="text-gray-600">ou R$ 4.000 (pacote completo com danos)</div>
              </div>
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mb-6 text-sm text-center">
                <p className="text-gray-700">💰 <strong>Valores envolvidos são ALTOS</strong> (R$ 50k a R$ 500k+)</p>
                <p className="text-gray-600 mt-1">Recuperar 25% a mais = Dezenas de milhares de reais</p>
              </div>
              <Link href="#contato" className="block w-full bg-amber-600 hover:bg-amber-700 text-white text-center py-4 rounded-lg font-semibold text-lg transition">QUERO RESOLVER</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Documentos Necessários</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {['Contrato de compra e venda','Todos os comprovantes de pagamento','Comunicações com a construtora (emails, WhatsApp)','Memorial descritivo do imóvel','Propaganda/material de lançamento','RG, CPF e comprovante de residência'].map(doc => (
              <div key={doc} className="flex items-center gap-3 p-4 bg-stone-50 rounded-lg border border-stone-200">
                <FileText className="w-5 h-5 text-amber-600" />
                <span className="text-gray-700">{doc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-stone-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Perguntas Frequentes</h2>
          <div className="space-y-6">
            {[
              {q:'Quanto tempo demora o processo?',a:'Entre 4 e 8 meses no Juizado ou Vara Cível comum.'},
              {q:'A construtora pode reter quanto?',a:'Máximo de 25% por lei. Acima disso é cláusula abusiva.'},
              {q:'Posso desistir mesmo sem culpa dela?',a:'Sim, mas aí é 75%. Se provar culpa dela, busca 100%.'},
              {q:'E se já paguei mais de 50%?',a:'Não importa. O percentual de devolução é sobre tudo que pagou.'},
              {q:'Quanto posso receber de danos morais?',a:'R$ 5.000 a R$ 20.000, dependendo do transtorno causado.'},
              {q:'E se a construtora falir?',a:'Pode ir contra o patrimônio ou responsabilizar sócios/incorporadora.'}
            ].map(i => (
              <div key={i.q} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-bold text-lg mb-2 text-stone-900">{i.q}</h3>
                <p className="text-gray-600">{i.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contato" className="py-20 bg-gradient-to-r from-stone-900 to-neutral-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Seu Dinheiro, Sua Decisão</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Você tem o direito de desistir e reaver seu investimento.<br/>Me conta sua situação e vamos buscar a melhor solução.</p>
          <Link href="https://wa.me/5511999999999" target="_blank" className="inline-flex items-center gap-2 bg-amber-500 text-stone-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-amber-400 transition shadow-xl"><MessageCircle className="w-5 h-5" />FALAR COM ADVOGADO - WHATSAPP</Link>
        </div>
      </section>
    </div>
  )
}
