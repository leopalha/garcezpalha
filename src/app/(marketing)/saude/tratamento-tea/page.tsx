import { Metadata } from 'next'
import { ProductPageTemplate } from '@/components/marketing/templates'
import { getSolutionById, SOLUTIONS } from '@/types/checkout'

export const metadata: Metadata = {
  title: 'Tratamento TEA Autismo | Garcez Palha Advogados',
  description:
    'Plano de saude negou tratamento para autismo (TEA)? Conseguimos autorizacao para ABA, fonoaudiologia, terapia ocupacional e mais.',
  keywords: [
    'tratamento TEA',
    'autismo',
    'terapia ABA',
    'plano de saude autismo',
    'direitos autista',
    'cobertura TEA',
  ],
}

export default function TratamentoTEAPage() {
  const solution = getSolutionById('tratamento-tea')!

  const relatedProducts = SOLUTIONS.filter(
    (s) => s.category === 'saude' && s.id !== 'tratamento-tea'
  ).slice(0, 3)

  return (
    <ProductPageTemplate
      heroTitle="Tratamento TEA Negado? Garanta Agora"
      heroSubtitle="Acao judicial para autorizacao de tratamento completo para autismo. ABA, fonoaudiologia, terapia ocupacional, psicologia e todas as terapias necessarias."
      heroProblem="Plano de saude negou ou limitou sessoes de terapia ABA, fono, TO para seu filho com autismo? Alegou que nao e coberto ou limitou quantidade de sessoes? Isso e ilegal - TEA tem cobertura obrigatoria."
      solution={solution}
      solutionBenefits={[
        'Analise do diagnostico e indicacoes terapeuticas',
        'Verificacao das coberturas obrigatorias pela ANS',
        'Pedido de liminar urgente para inicio imediato do tratamento',
        'Cobertura ilimitada de sessoes conforme necessidade medica',
        'Inclusao de todas as terapias: ABA, fono, TO, psicologia',
        'Acompanhamento ate autorizacao e durante tratamento',
      ]}
      documentsRequired={[
        'RG e CPF do responsavel',
        'Certidao de nascimento da crianca/adolescente',
        'Carteirinha e contrato do plano de saude',
        'Laudo medico diagnosticando TEA (CID F84)',
        'Prescricao terapeutica detalhada (quantas sessoes, quais terapias)',
        'Carta de negativa ou limitacao do plano',
        'Relatorios de profissionais que acompanham (se houver)',
      ]}
      faqItems={[
        {
          question: 'Quais tratamentos para TEA o plano e obrigado a cobrir?',
          answer:
            'TODOS os tratamentos medicamente necessarios: terapia ABA (analise comportamental aplicada), fonoaudiologia, terapia ocupacional, psicoterapia, psicopedagogia, musicoterapia, equoterapia quando indicadas. A Lei 12.764/2012 (Lei Berenice Piana) e RN 469 da ANS garantem cobertura obrigatoria sem limite de sessoes.',
        },
        {
          question: 'O plano pode limitar o numero de sessoes?',
          answer:
            'NAO. A jurisprudencia e pacifica: tratamento de TEA nao pode ter limite de sessoes. Se o medico prescrever 20 sessoes de ABA por semana, o plano deve autorizar. Qualquer limitacao e ilegal e revertida rapidamente na justica.',
        },
        {
          question: 'Em quanto tempo consigo autorizacao judicial?',
          answer:
            'Tratamento de TEA e considerado urgente pois cada dia sem terapia prejudica o desenvolvimento. Conseguimos liminares em 24 a 72 horas na maioria dos casos. Criancas tem prioridade legal e juizes tendem a decidir rapidamente.',
        },
        {
          question: 'Preciso ter laudo de medico do plano ou qualquer medico vale?',
          answer:
            'Qualquer medico habilitado pode fazer o diagnostico e prescricao - nao precisa ser da rede do plano. Neurologista, psiquiatra, neuropediatra sao os mais comuns. O plano nao pode exigir segunda opiniao ou avaliacao interna para negar cobertura obrigatoria.',
        },
        {
          question: 'Meu filho tem direito a acompanhante terapeutico na escola?',
          answer:
            'Sim, quando prescrito pelo medico como necessario. Acompanhante terapeutico especializado (AT) para suporte escolar faz parte do tratamento de TEA e e coberto pelo plano. Incluimos no pedido judicial se for o caso.',
        },
        {
          question: 'Quanto custa a acao para tratamento de TEA?',
          answer:
            'Nosso pacote especializado em TEA custa R$ 2.500,00 e inclui toda a acao ate autorizacao de todas as terapias necessarias. Damos prioridade a esses casos pela urgencia e impacto no desenvolvimento das criancas. Parcelamento disponivel.',
        },
      ]}
      categoryName="Protecao de Saude"
      relatedProducts={relatedProducts}
    />
  )
}
