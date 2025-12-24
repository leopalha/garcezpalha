import { Metadata } from 'next'
import { ProductPageTemplate } from '@/components/marketing/templates'
import { getSolutionById, SOLUTIONS } from '@/types/checkout'

export const metadata: Metadata = {
  title: 'Aposentadoria INSS | Garcez Palha Advogados',
  description:
    'Planejamento e concessao de aposentadoria. Revisao de beneficios, aposentadoria especial, por idade, tempo de contribuicao. Maximize seu beneficio.',
  keywords: [
    'aposentadoria',
    'INSS',
    'aposentadoria especial',
    'revisao de aposentadoria',
    'planejamento previdenciario',
    'beneficio previdenciario',
  ],
}

export default function AposentadoriaPage() {
  const solution = getSolutionById('aposentadoria')!

  const relatedProducts = SOLUTIONS.filter(
    (s) => s.category === 'automacao' && s.id !== 'aposentadoria'
  ).slice(0, 3)

  return (
    <ProductPageTemplate
      heroTitle="Aposentadoria e Beneficios INSS"
      heroSubtitle="Planejamento previdenciario, concessao e revisao de aposentadorias. Maximize o valor do seu beneficio com estrategia juridica especializada."
      heroProblem="INSS negou sua aposentadoria? Voce ja se aposentou mas o valor esta baixo? Quer saber qual a melhor hora de se aposentar? Planejamento correto pode aumentar seu beneficio em 30% ou mais."
      solution={solution}
      solutionBenefits={[
        'Planejamento previdenciario completo (qual aposentadoria e melhor)',
        'Levantamento de todo historico contributivo (CNIS)',
        'Inclusao de periodos nao reconhecidos pelo INSS',
        'Pedido administrativo ou acao judicial de concessao',
        'Revisao de aposentadoria ja concedida',
        'Calculo de atrasados e correcao de valores',
      ]}
      documentsRequired={[
        'RG e CPF',
        'Carteiras de trabalho (todas)',
        'Carnês de contribuicao como autonomo (se houver)',
        'Certidoes de tempo de contribuicao de outros regimes',
        'PPP - Perfil Profissiografico Previdenciario (para aposentadoria especial)',
        'Comprovantes de atividade rural (para trabalhador rural)',
        'Carta de concessao ou extrato do beneficio (se ja aposentado)',
      ]}
      faqItems={[
        {
          question: 'Qual e a diferenca entre as aposentadorias?',
          answer:
            'Principais tipos: Por IDADE (65 anos homem, 62 mulher + 15 anos contribuicao), Por TEMPO (35 anos homem, 30 mulher - antes da reforma), ESPECIAL (15/20/25 anos em condicoes prejudiciais a saude), Por INVALIDEZ (incapacidade permanente). Cada uma tem regras e valores diferentes. Planejamento identifica a melhor.',
        },
        {
          question: 'Como sei se tenho direito a aposentadoria especial?',
          answer:
            'Se trabalhou exposto a agentes nocivos (ruido, calor, produtos quimicos, radiacao, etc) tem direito. Precisa comprovar com PPP fornecido pela empresa. Aposentadoria especial e muito vantajosa (menos tempo, melhor calculo). Analisamos seu historico para identificar periodos especiais.',
        },
        {
          question: 'Vale a pena revisar aposentadoria ja concedida?',
          answer:
            'Frequentemente SIM. INSS comete erros: nao conta periodos, usa salarios errados, aplica regras desfavoráveis. Revisao pode aumentar beneficio em 20% a 50%. Voce recebe atrasados dos ultimos 10 anos. Fazemos analise gratuita para ver se seu caso tem potencial.',
        },
        {
          question: 'Quando devo me aposentar? Agora ou esperar?',
          answer:
            'Depende de varios fatores: idade atual, tempo de contribuicao, valor dos ultimos salarios, regra de transicao aplicavel. As vezes esperar 6 meses aumenta o beneficio em R$ 500/mes. Outras vezes, melhor aposentar ja. Nosso planejamento calcula cenarios e indica a melhor estrategia.',
        },
        {
          question: 'INSS negou minha aposentadoria. E agora?',
          answer:
            'Nao desista. Muitas negativas sao equivocadas. Podemos: fazer recurso administrativo, buscar documentos que faltaram, ou entrar direto com acao judicial. Na justica, com provas corretas, maioria dos casos e revertida. Voce recebe atrasados desde a data do pedido negado.',
        },
        {
          question: 'Quanto custa para conseguir ou revisar aposentadoria?',
          answer:
            'Planejamento previdenciario: R$ 800,00. Concessao (acao judicial): R$ 2.500,00 + 20% das parcelas atrasadas quando ganhar. Revisao: R$ 2.000,00 + 25% do valor que conseguir aumentar. So paga honorarios de exito se realmente ganhar. Sem risco.',
        },
      ]}
      categoryName="Automacao Juridica"
      relatedProducts={relatedProducts}
    />
  )
}
