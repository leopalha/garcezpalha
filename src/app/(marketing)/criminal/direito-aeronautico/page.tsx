import { Metadata } from 'next'
import { ProductPageTemplate } from '@/components/marketing/templates'
import { getSolutionById, SOLUTIONS } from '@/types/checkout'

export const metadata: Metadata = {
  title: 'Direito Aeronautico | Garcez Palha Advogados',
  description:
    'Defesa em processos administrativos e criminais aeronauticos. PAD ANAC, CENIPA, acidentes aereos e infrações de voo.',
  keywords: [
    'direito aeronautico',
    'PAD ANAC',
    'CENIPA',
    'acidente aereo',
    'infração de voo',
    'defesa piloto',
    'processo administrativo aeronautico',
  ],
}

export default function DireitoAeronauticoPage() {
  const solution = getSolutionById('direito-aeronautico')!

  const relatedProducts = SOLUTIONS.filter(
    (s) => s.category === 'criminal' && s.id !== 'direito-aeronautico'
  ).slice(0, 3)

  return (
    <ProductPageTemplate
      heroTitle="Direito Aeronautico Especializado"
      heroSubtitle="Defesa tecnica em processos administrativos e criminais aeronauticos. PAD ANAC, CENIPA, acidentes aereos, infracoes de voo e licencas."
      heroProblem="Recebeu notificacao da ANAC? Esta sendo investigado por acidente aereo? Teve licenca suspensa ou cassada? Cometeu infracao de voo? Precisa de defesa especializada que entenda aviacao."
      solution={solution}
      solutionBenefits={[
        'Defesa em Processo Administrativo Disciplinar (PAD) da ANAC',
        'Acompanhamento de investigacao CENIPA',
        'Recursos contra suspensao ou cassacao de licencas',
        'Defesa em acoes criminais aeronauticas',
        'Assessoria preventiva para operadores aereos',
        'Analise tecnica com suporte de peritos aeronauticos',
      ]}
      documentsRequired={[
        'RG, CPF e licenca de piloto/comissario/mecanico',
        'Notificacao da ANAC ou auto de infracao',
        'Relatorio de investigacao CENIPA (se houver)',
        'Documentos da aeronave envolvida',
        'Registros de voo, plano de voo, fichas de peso',
        'Laudo de exame toxicologico (se aplicavel)',
        'Atestado medico aeronautico (CMA)',
      ]}
      faqItems={[
        {
          question: 'O que e PAD da ANAC e como funciona?',
          answer:
            'Processo Administrativo Disciplinar e o procedimento que a ANAC usa para apurar infrações de aviacao e aplicar penalidades (advertencia, multa, suspensao ou cassacao de licenca). Voce tem direito a ampla defesa e contraditorio. Prazo para defesa costuma ser curto (10-15 dias), por isso aja rapido.',
        },
        {
          question: 'Minha licenca foi suspensa. Posso continuar voando?',
          answer:
            'NAO durante a suspensao - exercer atividade com licenca suspensa ou cassada e crime. MAS podemos entrar com recurso administrativo e/ou judicial com pedido de efeito suspensivo para permitir que continue voando enquanto discute a penalidade. Analisamos a viabilidade urgentemente.',
        },
        {
          question: 'Qual a diferenca entre investigacao CENIPA e PAD ANAC?',
          answer:
            'CENIPA investiga acidentes/incidentes para PREVENCAO (melhorar seguranca), nao para punir. Relatorio CENIPA nao pode ser usado para punir. PAD ANAC e para APURAR RESPONSABILIDADE e punir infracoes. Sao independentes mas podem correr em paralelo. Estrategia de defesa e diferente em cada um.',
        },
        {
          question: 'Cometi infracao de voo mas nao causou acidente. E grave?',
          answer:
            'Depende da infracao. Violacao de espaco aereo controlado, voo em condicoes meteorologicas abaixo dos minimos, excesso de jornada - sao infrações graves mesmo sem acidente. Podem resultar em multa pesada ou suspensao. Defesa bem fundamentada pode reduzir ou anular penalidade.',
        },
        {
          question: 'Acidente aereo sempre resulta em processo criminal?',
          answer:
            'Nao necessariamente. Nem todo acidente e crime. Depende se houve dolo (intencao) ou culpa grave (negligencia, impericia, imprudencia). Muitos acidentes decorrem de fatores tecnicos sem responsabilidade criminal do piloto. Analisamos tecnicamente se ha tipificacao penal.',
        },
        {
          question: 'Quanto custa defesa em processo aeronautico?',
          answer:
            'PAD ANAC (defesa administrativa): R$ 4.000 a R$ 8.000. Recurso judicial contra cassacao/suspensao: R$ 6.000 a R$ 12.000. Defesa criminal em acidente aereo: R$ 15.000 a R$ 40.000 conforme gravidade. Honorarios consideram complexidade tecnica e necessidade de peritos aeronauticos.',
        },
      ]}
      categoryName="Defesa Criminal"
      relatedProducts={relatedProducts}
    />
  )
}
