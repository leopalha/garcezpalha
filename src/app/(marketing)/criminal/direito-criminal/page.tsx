import { Metadata } from 'next'
import { ProductPageTemplate } from '@/components/marketing/templates'
import { getSolutionById, SOLUTIONS } from '@/types/checkout'

export const metadata: Metadata = {
  title: 'Direito Criminal | Garcez Palha Advogados',
  description:
    'Defesa criminal completa: processos criminais, habeas corpus, recursos, prisao em flagrante, investigacoes. Atendimento 24h para emergencias.',
  keywords: [
    'advogado criminal',
    'defesa criminal',
    'habeas corpus',
    'processo criminal',
    'prisao em flagrante',
    'recursos criminais',
  ],
}

export default function DireitoCriminalPage() {
  const solution = getSolutionById('direito-criminal')!

  const relatedProducts = SOLUTIONS.filter(
    (s) => s.category === 'criminal' && s.id !== 'direito-criminal'
  ).slice(0, 3)

  return (
    <ProductPageTemplate
      heroTitle="Defesa Criminal Especializada"
      heroSubtitle="Proteja sua liberdade e seus direitos. Defesa tecnica em processos criminais, habeas corpus, recursos e investigacoes. Atendimento emergencial 24h."
      heroProblem="Foi preso em flagrante? Recebeu intimacao criminal? Esta sendo investigado? Tem mandado de prisao? Foi condenado e quer recorrer? Sua liberdade e seus direitos precisam de defesa imediata."
      solution={solution}
      solutionBenefits={[
        'Atendimento emergencial 24h para prisoes em flagrante',
        'Habeas corpus preventivo e liberatorio',
        'Defesa em inqueritos policiais e processos criminais',
        'Recursos: apelacao, agravo, revisao criminal',
        'Negociacao de acordo de nao persecucao penal (ANPP)',
        'Acompanhamento em audiencias e interrogatorios',
        'Estrategia personalizada conforme o caso',
      ]}
      documentsRequired={[
        'RG e CPF',
        'Boletim de ocorrencia (se houver)',
        'Intimacao, notificacao ou mandado',
        'Auto de prisao em flagrante (se aplicavel)',
        'Relatorio de investigacao policial',
        'Provas de inocencia ou atenuantes que possua',
        'Certidao de antecedentes criminais',
      ]}
      faqItems={[
        {
          question: 'Fui preso em flagrante. O que fazer?',
          answer:
            'Contate-nos IMEDIATAMENTE. Temos atendimento 24h. Atuaremos na delegacia para garantir seus direitos, evitar abusos, e buscar liberdade provisoria ou relaxamento de prisao ilegal. Habeas corpus pode ser impetrado em poucas horas. Cada minuto conta.',
        },
        {
          question: 'O que e habeas corpus e quando posso pedir?',
          answer:
            'Habeas corpus e um remedio constitucional para proteger liberdade contra prisao ilegal ou abusiva. Pode ser preventivo (evitar prisao iminente) ou liberatorio (soltar quem ja esta preso). Indicado quando ha ilegalidade, excesso ou coacao na prisao.',
        },
        {
          question: 'Recebi intimacao para depor. Preciso de advogado?',
          answer:
            'SIM, SEMPRE. Nunca va a delegacia ou forum sem advogado, mesmo que seja "so para prestar esclarecimentos". Tudo que disser pode ser usado contra voce. Advogado garante que seus direitos sejam respeitados e evita que voce se incrimine involuntariamente.',
        },
        {
          question: 'Fui condenado. Ainda ha o que fazer?',
          answer:
            'Sim! Voce tem direito a recorrer: apelacao (ao Tribunal), agravo (contra decisoes interlocutorias), revisao criminal (quando surgem provas novas de inocencia). Analisamos a sentenca para identificar erros, nulidades ou injusticas e recorrer em tempo habil.',
        },
        {
          question: 'O que e acordo de nao persecucao penal (ANPP)?',
          answer:
            'E um beneficio que permite ao acusado de crime sem violencia cumprir condicoes (prestacao de servicos, multa, etc) e ter o processo arquivado sem condenacao. Evita antecedentes criminais. Negociamos as melhores condicoes possiveis com o Ministerio Publico.',
        },
        {
          question: 'Quanto custa a defesa criminal?',
          answer:
            'Varia conforme complexidade: Prisao em flagrante (atendimento emergencial + habeas corpus): R$ 5.000 a R$ 10.000. Defesa completa em processo criminal: R$ 8.000 a R$ 30.000 conforme gravidade. Recursos: R$ 4.000 a R$ 15.000. Avaliacao inicial sem custo.',
        },
      ]}
      categoryName="Defesa Criminal"
      relatedProducts={relatedProducts}
    />
  )
}
