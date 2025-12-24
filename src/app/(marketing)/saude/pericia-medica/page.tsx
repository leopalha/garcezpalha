import { Metadata } from 'next'
import { ProductPageTemplate } from '@/components/marketing/templates'
import { getSolutionById, SOLUTIONS } from '@/types/checkout'

export const metadata: Metadata = {
  title: 'Pericia Medica | Garcez Palha Advogados',
  description:
    'Pericia medica judicial e assistencia tecnica. Questionamento de laudos do INSS, planos de saude e pericias trabalhistas.',
  keywords: [
    'pericia medica',
    'assistente tecnico',
    'laudo pericial',
    'pericia INSS',
    'pericia judicial',
    'questionamento de pericia',
  ],
}

export default function PericiaedicaPage() {
  const solution = getSolutionById('pericia-medica')!

  const relatedProducts = SOLUTIONS.filter(
    (s) => s.category === 'saude' && s.id !== 'pericia-medica'
  ).slice(0, 3)

  return (
    <ProductPageTemplate
      heroTitle="Pericia Medica e Assistencia Tecnica"
      heroSubtitle="Acompanhamento em pericias judiciais, INSS e planos de saude. Questionamento de laudos equivocados com assistente tecnico especializado."
      heroProblem="Pericia do INSS negou seu beneficio mesmo com problemas graves de saude? Laudo judicial foi desfavoravel? Plano de saude usou pericia para negar tratamento? Um assistente tecnico pode fazer diferenca."
      solution={solution}
      solutionBenefits={[
        'Indicacao de medico assistente tecnico da especialidade',
        'Acompanhamento presencial ou analise do laudo',
        'Elaboracao de parecer tecnico questionando conclusoes',
        'Pedido de esclarecimentos ou nova pericia ao juiz',
        'Suporte em audiencias e quesitos periciais',
        'Orientacao sobre exames complementares necessarios',
      ]}
      documentsRequired={[
        'RG e CPF',
        'Laudo pericial que sera questionado (se ja houver)',
        'Prontuario medico e historico de tratamento',
        'Exames medicos, laudos, atestados',
        'Receitas de medicamentos em uso',
        'Relatorios dos medicos que acompanham',
      ]}
      faqItems={[
        {
          question: 'O que faz um assistente tecnico em pericia?',
          answer:
            'Assistente tecnico e um medico de confianca da parte (voce) que acompanha a pericia oficial, formula quesitos (perguntas) ao perito, questiona conclusoes equivocadas, aponta exames nao considerados, e elabora parecer divergente quando necessario. E seu especialista defendendo tecnicamente seus interesses.',
        },
        {
          question: 'Quando devo contratar assistente tecnico?',
          answer:
            'Idealmente ANTES da pericia ser realizada, para acompanhar presencialmente e formular quesitos. Mas mesmo DEPOIS de um laudo desfavoravel, ainda da tempo de questionar com parecer tecnico e pedir esclarecimentos ou nova pericia. Quanto antes, melhor.',
        },
        {
          question: 'Assistente tecnico consegue mudar resultado da pericia?',
          answer:
            'Sim, frequentemente. Quando ha divergencia fundamentada entre perito e assistente, o juiz pode: pedir esclarecimentos, determinar nova pericia, nomear junta medica, ou ate desconsiderar o laudo oficial e acolher o parecer do assistente se mais bem fundamentado.',
        },
        {
          question: 'Quanto custa contratar assistente tecnico?',
          answer:
            'Varia conforme especialidade e complexidade. Em media: R$ 1.500 a R$ 3.000 para acompanhamento de pericia + parecer tecnico. Nosso servico inclui a indicacao do profissional adequado, orientacao sobre quesitos, e assessoria juridica para protocolar as manifestacoes.',
        },
        {
          question: 'Posso questionar pericia do INSS na esfera administrativa?',
          answer:
            'Sim, atraves de recurso administrativo ou pedido de reconsideracao. Mas as chances de reverter sao pequenas. Na justica, com assistente tecnico e provas robustas, as chances aumentam significativamente. Analisamos se vale fazer recurso administrativo ou partir direto para acao judicial.',
        },
        {
          question: 'Em processos trabalhistas, quando preciso de perito?',
          answer:
            'Quando se discute: doenca ocupacional, acidente de trabalho, grau de incapacidade, nexo causal entre trabalho e doenca, insalubridade/periculosidade. Assistente tecnico nessas areas e fundamental pois o laudo pericial costuma definir o resultado do processo.',
        },
      ]}
      categoryName="Protecao de Saude"
      relatedProducts={relatedProducts}
    />
  )
}
