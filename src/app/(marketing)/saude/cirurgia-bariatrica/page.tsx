import { Metadata } from 'next'
import { ProductPageTemplate } from '@/components/marketing/templates'
import { getSolutionById, SOLUTIONS } from '@/types/checkout'

export const metadata: Metadata = {
  title: 'Cirurgia Bariatrica | Garcez Palha Advogados',
  description:
    'Plano de saude negou cirurgia bariatrica? Conseguimos autorizacao judicial rapida. Especialistas em reverter negativas de gastroplastia.',
  keywords: [
    'cirurgia bariatrica',
    'gastroplastia',
    'plano negou bariatrica',
    'obesidade',
    'reducao de estomago',
  ],
}

export default function CirurgiaBariatricaPage() {
  const solution = getSolutionById('cirurgia-bariatrica')!

  const relatedProducts = SOLUTIONS.filter(
    (s) => s.category === 'saude' && s.id !== 'cirurgia-bariatrica'
  ).slice(0, 3)

  return (
    <ProductPageTemplate
      heroTitle="Cirurgia Bariatrica Negada? Reverta"
      heroSubtitle="Acao judicial especializada para autorizacao de cirurgia bariatrica. Conseguimos liminares rapidas quando voce preenche os criterios medicos."
      heroProblem="Seu medico indicou cirurgia bariatrica mas o plano negou alegando que nao e necessaria, que e estetica ou que falta carencia? Isso pode ser ilegal se voce tem indicacao medica clara."
      solution={solution}
      solutionBenefits={[
        'Analise dos criterios medicos (IMC, comorbidades, tentativas previas)',
        'Verificacao da cobertura contratual e carencias',
        'Pedido de liminar para autorizacao urgente',
        'Fundamentacao completa com jurisprudencia especializada',
        'Acompanhamento ate realizacao da cirurgia',
        'Inclusao de cirurgia plastica reparadora pos-bariatrica se indicada',
      ]}
      documentsRequired={[
        'RG e CPF',
        'Carteirinha e contrato do plano de saude',
        'Relatorio medico indicando a cirurgia',
        'Exames comprovando IMC e comorbidades',
        'Historico de tentativas de emagrecimento (dietas, acompanhamento)',
        'Carta de negativa do plano',
        'Laudos de endocrinologista, nutricionista, psicologo (se houver)',
      ]}
      faqItems={[
        {
          question: 'Quais sao os criterios para ter direito a cirurgia bariatrica?',
          answer:
            'Segundo o CFM e ANS: IMC acima de 40 kg/m², ou IMC acima de 35 kg/m² com comorbidades graves (diabetes, hipertensao, apneia do sono, etc), tentativas previas de emagrecimento sem sucesso por pelo menos 2 anos, e avaliacao psicologica favoravel. Se voce preenche esses criterios, o plano nao pode negar.',
        },
        {
          question: 'O plano alegou que e cirurgia estetica. Isso procede?',
          answer:
            'Nao. Cirurgia bariatrica com indicacao medica NAO e estetica, e sim tratamento de saude obrigatorio conforme Resolucao Normativa da ANS. Essa alegacao e ilegal e facilmente derrubada na justica com a documentacao medica adequada.',
        },
        {
          question: 'Quanto tempo demora para conseguir autorizacao judicial?',
          answer:
            'Em casos com documentacao completa e indicacao clara, conseguimos liminares em 3 a 7 dias na maioria dos casos. Se houver urgencia medica (comorbidades graves), pode ser ainda mais rapido com pedido em plantao judicial.',
        },
        {
          question: 'O plano cobre cirurgia plastica depois da bariatrica?',
          answer:
            'A cirurgia plastica reparadora (abdominoplastia, mamoplastia) apos bariatrica e coberta quando ha indicacao medica funcional: problemas de pele, infeccoes, limitacoes de movimento. Puramente estetico nao e coberto. Analisamos se seu caso se enquadra e incluimos no pedido quando aplicavel.',
        },
        {
          question: 'E se eu nao tiver acompanhamento de 2 anos comprovado?',
          answer:
            'Isso pode dificultar mas nao impossibilita. Analisamos seu historico medico, tentativas anteriores mesmo sem documentacao formal, e estado de saude atual. Em casos de comorbidades graves e urgentes, esse requisito pode ser flexibilizado. Avaliamos a viabilidade do seu caso especificamente.',
        },
        {
          question: 'Quanto custa a acao para cirurgia bariatrica?',
          answer:
            'Nosso pacote especializado custa R$ 2.800,00 e inclui toda a acao ate a autorizacao e realizacao da cirurgia. Valor inclui analise detalhada dos criterios medicos e estrategia processual especifica para bariatrica.',
        },
      ]}
      categoryName="Protecao de Saude"
      relatedProducts={relatedProducts}
    />
  )
}
