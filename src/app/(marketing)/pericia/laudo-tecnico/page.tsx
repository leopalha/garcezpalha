import { Metadata } from 'next'
import { ProductPageTemplate } from '@/components/marketing/templates'
import { getSolutionById, SOLUTIONS } from '@/types/checkout'

export const metadata: Metadata = {
  title: 'Laudo Tecnico | Garcez Palha Advogados',
  description:
    'Laudos tecnicos especializados: engenharia, contabil, informatica, ambiental e outras areas. Prova pericial para processos judiciais.',
  keywords: [
    'laudo tecnico',
    'pericia tecnica',
    'laudo de engenharia',
    'laudo contabil',
    'pericia informatica',
    'prova pericial',
  ],
}

export default function LaudoTecnicoPage() {
  const solution = getSolutionById('laudo-tecnico')!

  const relatedProducts = SOLUTIONS.filter(
    (s) => s.category === 'pericia' && s.id !== 'laudo-tecnico'
  ).slice(0, 3)

  return (
    <ProductPageTemplate
      heroTitle="Laudos Tecnicos Especializados"
      heroSubtitle="Pericia tecnica em diversas areas: engenharia, contabilidade, informatica, ambiental e mais. Laudos fundamentados para processos judiciais e negociacoes."
      heroProblem="Precisa de prova tecnica especializada para seu processo? Defeito de construcao? Calculo de dividas? Invasao de sistema? Dano ambiental? Conectamos voce ao perito tecnico certo."
      solution={solution}
      solutionBenefits={[
        'Indicacao de perito especializado na area necessaria',
        'Vistoria tecnica e coleta de provas',
        'Analise fundamentada com metodologia cientifica',
        'Laudo detalhado com fotos, calculos e conclusoes',
        'Aceito em processos judiciais e arbitragens',
        'Perito pode prestar esclarecimentos e depor',
      ]}
      documentsRequired={[
        'Descricao detalhada do que precisa ser periciado',
        'Documentos relacionados (contratos, projetos, notas fiscais)',
        'Fotos ou evidencias do problema',
        'Acesso ao local/objeto da pericia (quando aplicavel)',
        'Informacoes tecnicas disponiveis',
      ]}
      faqItems={[
        {
          question: 'Quais tipos de laudos tecnicos voces fazem?',
          answer:
            'Principais areas: Engenharia Civil (construcao, estrutura, patologias), Contabil (calculos, balancos, fraudes), Informatica (invasao, recuperacao de dados, analise de sistemas), Ambiental (poluicao, danos), Agronomia, Mecanica, Eletrica, Seguranca do Trabalho e outras. Consulte sobre sua necessidade especifica.',
        },
        {
          question: 'Como e feita a escolha do perito?',
          answer:
            'Analisamos a natureza tecnica do caso e indicamos profissional com formacao, experiencia e registro em conselho de classe (CREA, CRC, etc) na area especifica. Priorizamos peritos que ja atuaram em casos judiciais e tem laudos reconhecidos.',
        },
        {
          question: 'Quanto tempo demora para elaborar o laudo?',
          answer:
            'Varia muito conforme complexidade: laudo simples (vistoria em apartamento): 15 dias. Medio (calculo contabil complexo): 30 dias. Complexo (analise estrutural de edificio): 45-60 dias. Informamos prazo especifico apos avaliar o caso.',
        },
        {
          question: 'Quanto custa um laudo tecnico?',
          answer:
            'Depende da area e complexidade. Faixa indicativa: Laudo simples: R$ 2.000 a R$ 4.000. Medio: R$ 4.000 a R$ 8.000. Complexo: R$ 8.000 a R$ 20.000+. Fornecemos orcamento detalhado apos entender o escopo necessario. Nosso servico inclui intermediacao e assessoria juridica.',
        },
        {
          question: 'O laudo pode ser usado em qualquer tribunal?',
          answer:
            'Sim. Laudos extrajudiciais (feitos antes ou fora do processo) sao aceitos como prova documental. Juiz pode dar credito integral, determinar esclarecimentos, ou nomear perito oficial para contraprova. Quanto mais robusto tecnicamente, maior a chance de ser acolhido integralmente.',
        },
        {
          question: 'E se a outra parte contestar o laudo?',
          answer:
            'E normal haver contestacao. A parte adversa pode apresentar laudo divergente, pedir esclarecimentos ou nova pericia. Por isso e fundamental que nosso laudo seja tecnicamente impecavel, bem fundamentado e assinado por profissional qualificado - para resistir ao contraditorio.',
        },
      ]}
      categoryName="Pericia e Documentos"
      relatedProducts={relatedProducts}
    />
  )
}
