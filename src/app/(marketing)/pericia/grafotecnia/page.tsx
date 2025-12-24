import { Metadata } from 'next'
import { ProductPageTemplate } from '@/components/marketing/templates'
import { getSolutionById, SOLUTIONS } from '@/types/checkout'

export const metadata: Metadata = {
  title: 'Grafotecnia | Garcez Palha Advogados',
  description:
    'Pericia grafotecnica para verificar autenticidade de assinaturas. Laudo de falsificacao de assinatura aceito em processos judiciais.',
  keywords: [
    'grafotecnia',
    'pericia grafotecnica',
    'assinatura falsa',
    'falsificacao de assinatura',
    'exame grafotecnico',
    'laudo de assinatura',
  ],
}

export default function GrafotecniaPage() {
  const solution = getSolutionById('grafotecnia')!

  const relatedProducts = SOLUTIONS.filter(
    (s) => s.category === 'pericia' && s.id !== 'grafotecnia'
  ).slice(0, 3)

  return (
    <ProductPageTemplate
      heroTitle="Grafotecnia: Pericia de Assinaturas"
      heroSubtitle="Exame grafotecnico para verificar autenticidade de assinaturas em contratos, cheques, testamentos e documentos. Laudo pericial tecnico e judicial."
      heroProblem="Suspeita que sua assinatura foi falsificada em contrato, cheque, procuracao ou testamento? Alguem alega que voce assinou algo que nao assinou? Ou precisa comprovar que assinatura e falsa? Fazemos a pericia."
      solution={solution}
      solutionBenefits={[
        'Coleta de padroes graficos genuinos',
        'Analise comparativa detalhada com assinatura questionada',
        'Exame de caracteristicas individualizadoras da escrita',
        'Verificacao de pressao, inclinacao, velocidade, tremores',
        'Laudo conclusivo: autentica, falsa ou inconclusivo',
        'Assinatura de perito grafotecnico habilitado',
      ]}
      documentsRequired={[
        'Documento com assinatura questionada (original preferencialmente)',
        'Padroes de assinatura genuina (documentos antigos com firma reconhecida)',
        'RG, CNH, passaporte do punho (para comparacao)',
        'Outros documentos assinados pela mesma pessoa',
        'Contexto: quando foi assinado, circunstancias',
      ]}
      faqItems={[
        {
          question: 'Como funciona o exame grafotecnico?',
          answer:
            'Perito coleta padroes graficos genuinos (assinaturas que sabe que sao verdadeiras), compara com a assinatura questionada analisando dezenas de caracteristicas: pressao do punho, inclinacao, proporcoes, ligacoes entre letras, tremores, retoques, velocidade. Com base nessa analise cientifica, conclui se e autentica ou falsa.',
        },
        {
          question: 'Preciso de quantas assinaturas verdadeiras para comparacao?',
          answer:
            'Minimo de 3 a 5 assinaturas genuinas, sendo ideais 10 ou mais. Quanto mais padroes, mais precisa a analise. Devem ser de periodos proximos a assinatura questionada. Assinaturas em documentos com firma reconhecida em cartorio sao as melhores.',
        },
        {
          question: 'E possivel saber quem falsificou a assinatura?',
          answer:
            'Grafotecnia identifica SE a assinatura e falsa, nao QUEM falsificou. Para identificar o autor, seria necessario ter padroes de escrita dos suspeitos e fazer analise comparativa. Isso e mais comum em pericias criminais policiais.',
        },
        {
          question: 'Quanto tempo demora a pericia grafotecnica?',
          answer:
            'De 10 a 15 dias uteis em media, considerando coleta de padroes, analise tecnica e elaboracao do laudo. Casos urgentes podem ter prazo reduzido com acrescimo de taxa de urgencia.',
        },
        {
          question: 'Quanto custa um laudo de grafotecnia?',
          answer:
            'A partir de R$ 1.800,00 para analise de 1 a 2 assinaturas. Para multiplas assinaturas no mesmo documento ou varios documentos, valor pode variar. Consulte-nos com detalhes do caso para orcamento preciso.',
        },
        {
          question: 'O laudo grafotecnico e aceito como prova judicial?',
          answer:
            'Sim, totalmente. E uma das principais provas em acoes de falsidade documental, anulatoria de contratos, investigacao de paternidade (quando ha testamento), fraudes bancarias com cheques, etc. Nossos peritos tem habilitacao reconhecida e laudos fundamentados cientificamente.',
        },
      ]}
      categoryName="Pericia e Documentos"
      relatedProducts={relatedProducts}
    />
  )
}
