import { Metadata } from 'next'
import { ProductPageTemplate } from '@/components/marketing/templates'
import { getSolutionById, SOLUTIONS } from '@/types/checkout'

export const metadata: Metadata = {
  title: 'Regularizacao de Imoveis | Garcez Palha Advogados',
  description:
    'Regularize seu imovel irregular ou clandestino. Obtencao de habite-se, averbacao de construcao, regularizacao fundiaria e retificacao de registro.',
  keywords: [
    'regularizacao de imoveis',
    'imovel irregular',
    'habite-se',
    'averbacao de construcao',
    'regularizacao fundiaria',
    'retificacao de registro',
    'legalizacao de imovel',
  ],
}

export default function RegularizacaoImovelPage() {
  const solution = getSolutionById('regularizacao-imovel')!

  const relatedProducts = SOLUTIONS.filter(
    (s) => s.category === 'patrimonial' && s.id !== 'regularizacao-imovel'
  ).slice(0, 3)

  return (
    <ProductPageTemplate
      heroTitle="Regularize Seu Imovel Irregular"
      heroSubtitle="Resolva pendencias de habite-se, averbacao de construcao, regularizacao fundiaria e retificacao de registro. Seu imovel legal e valorizado."
      heroProblem="Seu imovel esta sem habite-se? Construiu ou reformou sem aprovar o projeto? Tem divergencias entre escritura e realidade? Nao consegue vender ou financiar por irregularidades? Podemos regularizar."
      solution={solution}
      solutionBenefits={[
        'Diagnostico completo das irregularidades do imovel',
        'Levantamento topografico e plantas atualizadas',
        'Elaboracao de projeto de regularizacao',
        'Protocolo junto a prefeitura e orgaos competentes',
        'Obtencao de habite-se e certidoes',
        'Averbacao de construcao no registro de imoveis',
        'Retificacao de area, confrontacoes e outros dados',
      ]}
      documentsRequired={[
        'RG e CPF do proprietario',
        'Escritura ou matricula do imovel',
        'IPTU atualizado',
        'Plantas antigas (se houver)',
        'Fotos atuais do imovel',
        'Comprovante de residencia',
        'Certidao de inteiro teor da matricula',
      ]}
      faqItems={[
        {
          question: 'O que e regularizacao de imoveis?',
          answer:
            'E o processo de adequar o imovel as normas legais e urbanisticas, resolvendo pendencias como falta de habite-se, construcoes nao averbadas, divergencias de metragem, loteamentos irregulares, etc. Apos a regularizacao, o imovel fica legal para vender, financiar ou usar como garantia.',
        },
        {
          question: 'Posso regularizar um imovel construido sem aprovacao?',
          answer:
            'Na maioria dos casos sim, atraves de procedimentos de anistia, REURB (Regularizacao Fundiaria Urbana) ou aprovacao retroativa. Analisamos o caso especifico considerando legislacao municipal, zoneamento e viabilidade tecnica.',
        },
        {
          question: 'Quanto custa regularizar um imovel?',
          answer:
            'Nossos honorarios partem de R$ 2.500,00 dependendo da complexidade. Custos adicionais incluem: levantamento topografico (R$ 1.000 a R$ 3.000), taxas de prefeitura e cartorio (variam por cidade), e eventual projeto arquitetonico (se necessario).',
        },
        {
          question: 'Quanto tempo demora a regularizacao?',
          answer:
            'Depende do tipo de irregularidade e orgao competente. Retificacao simples: 2 a 4 meses. Obtencao de habite-se: 4 a 8 meses. REURB completa: 12 a 24 meses. Agilizamos ao maximo acompanhando todos os tramites de perto.',
        },
        {
          question: 'Imovel irregular pode ser vendido?',
          answer:
            'Tecnicamente sim, mas com valor muito reduzido e dificuldades. Comprador nao consegue financiamento bancario, imovel nao serve como garantia, e pode haver problemas futuros. Regularizar antes de vender e essencial para obter o melhor preco e seguranca juridica.',
        },
        {
          question: 'O que e REURB e como funciona?',
          answer:
            'REURB (Regularizacao Fundiaria Urbana) e um programa legal para regularizar nucleos urbanos informais. Permite regularizar loteamentos irregulares, favelas urbanizadas e ocupacoes consolidadas. E mais rapido e economico que processos tradicionais.',
        },
      ]}
      categoryName="Protecao Patrimonial"
      relatedProducts={relatedProducts}
    />
  )
}
