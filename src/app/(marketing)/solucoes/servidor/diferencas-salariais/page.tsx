import { Metadata } from 'next'
import Link from 'next/link'
import { Briefcase, TrendingUp, CheckCircle2, XCircle, MessageCircle, FileText } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Diferenças Salariais Servidor Público | Garcez Palha',
  description: 'Reajuste não pago? Progressão atrasada? Servidor público tem direito a diferenças salariais retroativas + correção. Advogado especialista em direito administrativo.',
  keywords: ['diferenças salariais servidor', 'reajuste não pago', 'progressão atrasada', 'servidor público direitos', 'retroativo salário'],
}

export default function DiferencasSalariaisPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <section className="bg-gradient-to-r from-blue-900 via-indigo-800 to-blue-900 text-white py-24">
        <div className="max-w-4xl mx-auto px-4">
          <Briefcase className="w-16 h-16 mb-6 text-blue-300" />
          <h1 className="text-5xl font-bold mb-6">Seu Reajuste Não Foi Pago Corretamente?<br/><span className="text-blue-300">Você Tem Direito às Diferenças.</span></h1>
          <p className="text-xl text-blue-100 mb-8">Progressão atrasada, reajuste não aplicado, erro no contracheque?<br/>Servidor público tem direito a receber retroativo + correção.</p>
          <Link href="#contato" className="inline-flex items-center gap-2 bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition shadow-xl"><MessageCircle className="w-5 h-5" />CALCULAR MINHAS DIFERENÇAS</Link>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Situações Comuns</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {['Reajuste aprovado mas não pago', 'Progressão atrasou anos', 'Reenquadramento não aplicado', 'Diferença entre classes/padrões', 'Auxílios não pagos corretamente', 'Erro no cálculo de gratificações'].map(item => (
              <div key={item} className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                <XCircle className="w-6 h-6 text-red-600 mt-1" />
                <span className="text-gray-800 font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-blue-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Seus Direitos</h2>
          <div className="space-y-6">
            {[
              {title:'Pagamento Retroativo',desc:'Todas as diferenças desde a data devida'},
              {title:'Correção Monetária',desc:'Valor corrigido pela inflação (IPCA-E)'},
              {title:'Juros de Mora',desc:'1% ao mês sobre o valor devido'},
              {title:'13º e Férias',desc:'Diferenças refletem em 13º, férias e FGTS'},
              {title:'Prazo de 5 Anos',desc:'Pode cobrar até 5 anos retroativos'},
              {title:'Processo Rápido',desc:'Mandado de Segurança ou ação ordinária'}
            ].map(i => (
              <div key={i.title} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-600">
                <h3 className="font-bold text-lg mb-2">{i.title}</h3>
                <p className="text-gray-600">{i.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Exemplos de Valores</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {caso:'Progressão 2 anos atrasada',valor:'R$ 15.000 - R$ 30.000'},
              {caso:'Reajuste 5% não pago (3 anos)',valor:'R$ 20.000 - R$ 40.000'},
              {caso:'Reenquadramento não aplicado',valor:'R$ 30.000 - R$ 80.000'}
            ].map(i => (
              <div key={i.caso} className="bg-blue-50 p-6 rounded-lg text-center border-2 border-blue-300">
                <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">{i.caso}</h3>
                <div className="text-2xl font-bold text-blue-900">{i.valor}</div>
                <p className="text-sm text-gray-600 mt-2">Retroativo estimado</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-blue-50">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-blue-200">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 text-center"><h2 className="text-3xl font-bold">Pacote Diferenças Salariais</h2></div>
            <div className="p-8">
              <div className="space-y-4 mb-8">
                {['Análise completa dos contracheques','Cálculo exato das diferenças','Identificação de direitos não pagos','Ação judicial (MS ou ordinária)','Cobrança de retroativo + correção','Acompanhamento até pagamento'].map(i => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700">{i}</span>
                  </div>
                ))}
              </div>
              <div className="border-t-2 pt-6 mb-6 text-center">
                <div className="text-5xl font-bold text-blue-900 mb-2">R$ 2.000</div>
                <div className="text-gray-600">+ 20% do valor recuperado</div>
              </div>
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6 text-sm text-center">
                <p className="text-gray-700">💰 Valores recuperados são ALTOS (R$ 15k-80k+)</p>
                <p className="text-gray-600 mt-1">Investimento retorna rapidamente</p>
              </div>
              <Link href="#contato" className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-4 rounded-lg font-semibold text-lg transition">QUERO CALCULAR</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Documentos Necessários</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {['Últimos 12 contracheques','Portarias de nomeação/promoção','Leis de reajuste/reenquadramento','Histórico funcional','RG, CPF e comprovante de residência','Cálculo da diferença (se tiver)'].map(doc => (
              <div key={doc} className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <FileText className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">{doc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-blue-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Perguntas Frequentes</h2>
          <div className="space-y-6">
            {[
              {q:'Quanto tempo demora o processo?',a:'Mandado de Segurança: 4-8 meses. Ação ordinária: 12-24 meses.'},
              {q:'Posso cobrar quanto tempo de atraso?',a:'Até 5 anos retroativos (prescrição quinquenal).'},
              {q:'O que é correção monetária?',a:'Atualização do valor pela inflação (IPCA-E) desde a data devida.'},
              {q:'As diferenças afetam 13º e férias?',a:'Sim! Todo aumento reflete em 13º salário, férias e FGTS.'},
              {q:'Preciso contratar perícia contábil?',a:'Não inicialmente. Fazemos o cálculo. Perícia só se juiz determinar.'},
              {q:'E se eu já não trabalho mais lá?',a:'Servidor aposentado ou exonerado também tem direito às diferenças.'}
            ].map(i => (
              <div key={i.q} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-bold text-lg mb-2 text-blue-900">{i.q}</h3>
                <p className="text-gray-600">{i.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contato" className="py-20 bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Servidor Tem Direitos</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Se o reajuste não foi pago, você tem direito a receber.<br/>Me manda seus contracheques e vamos calcular suas diferenças.</p>
          <Link href="https://wa.me/5511999999999" target="_blank" className="inline-flex items-center gap-2 bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition shadow-xl"><MessageCircle className="w-5 h-5" />FALAR COM ADVOGADO - WHATSAPP</Link>
        </div>
      </section>
    </div>
  )
}
