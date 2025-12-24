import { Metadata } from 'next'
import { ProductPageTemplate } from '@/components/marketing/templates'
import { getSolutionById, SOLUTIONS } from '@/types/checkout'

export const metadata: Metadata = {
  title: 'Inventario e Partilha | Garcez Palha Advogados',
  description:
    'Inventario judicial e extrajudicial. Resolva a partilha de bens e heranca de forma rapida e segura. Experiencia de 364 anos em sucessoes.',
  keywords: [
    'inventario',
    'inventario extrajudicial',
    'partilha de bens',
    'heranca',
    'sucessao',
    'advogado inventario',
    'alvara judicial',
  ],
}

export default function InventarioPage() {
  const solution = getSolutionById('inventario')!

  const relatedProducts = SOLUTIONS.filter(
    (s) => s.category === 'patrimonial' && s.id !== 'inventario'
  ).slice(0, 3)

  return (
    <ProductPageTemplate
      heroTitle="Inventario Rapido e Sem Complicacoes"
      heroSubtitle="Resolva a partilha de bens e heranca com agilidade. Inventario extrajudicial ou judicial conforme seu caso. 364 anos de tradicao em sucessoes."
      heroProblem="Perdeu um familiar e precisa resolver a partilha dos bens? O inventario esta parado ha anos? Herdeiros discordam sobre a divisao? Podemos resolver de forma rapida e justa."
      solution={solution}
      solutionBenefits={[
        'Analise completa para definir melhor tipo de inventario',
        'Levantamento de todos os bens, direitos e dividas',
        'Elaboracao de toda documentacao necessaria',
        'Inventario extrajudicial (cartorio) quando possivel - mais rapido',
        'Inventario judicial quando ha menores, incapazes ou conflitos',
        'Calculo e orientacao sobre ITCMD (imposto de transmissao)',
        'Acompanhamento ate expedicao do formal de partilha ou alvara',
      ]}
      documentsRequired={[
        'Certidao de obito do falecido',
        'RG e CPF de todos os herdeiros',
        'Certidao de casamento do falecido',
        'Certidao de nascimento dos filhos',
        'Comprovante de residencia de todos os herdeiros',
        'Documentos de todos os bens (imoveis, veiculos, contas bancarias)',
        'Testamento (se houver)',
        'Ultima declaracao de imposto de renda do falecido',
      ]}
      faqItems={[
        {
          question: 'Qual a diferenca entre inventario judicial e extrajudicial?',
          answer:
            'Inventario extrajudicial e feito em cartorio, e mais rapido (3 a 6 meses) e economico, mas so e possivel quando todos herdeiros sao maiores, capazes e concordam com a partilha. Inventario judicial e obrigatorio quando ha menores, incapazes, desacordo entre herdeiros ou testamento.',
        },
        {
          question: 'Quanto tempo demora um inventario?',
          answer:
            'Extrajudicial: 3 a 6 meses em media. Judicial: 1 a 3 anos, podendo ser mais rapido se nao houver conflitos. Com nossa experiencia de 364 anos em direito sucessorio, agilizamos o processo ao maximo evitando erros que causam atrasos.',
        },
        {
          question: 'Quanto custa fazer um inventario?',
          answer:
            'Nossos honorarios variam conforme o valor do patrimonio e complexidade. Inventario extrajudicial basico: a partir de R$ 4.500,00. Inventario judicial: a partir de R$ 6.000,00. Alem dos honorarios, ha custas cartorias, ITCMD (ate 8% do patrimonio) e taxas diversas.',
        },
        {
          question: 'E obrigatorio fazer inventario?',
          answer:
            'Sim, quando ha bens em nome do falecido. Sem o inventario, os herdeiros nao conseguem vender imoveis, sacar saldos bancarios acima de certos valores, ou transferir veiculos. Alem disso, ha multa de 10% a 20% sobre o ITCMD para inventarios abertos apos o prazo de 60 dias do obito.',
        },
        {
          question: 'Posso fazer inventario se os herdeiros nao concordam?',
          answer:
            'Sim, atraves do inventario judicial. O juiz ira mediar e decidir conforme a lei sobre a partilha dos bens. Nossa equipe tem vasta experiencia em resolver conflitos familiares de forma tecnica e humana, buscando sempre o melhor acordo possivel.',
        },
        {
          question: 'Preciso pagar o ITCMD antes de receber a heranca?',
          answer:
            'Sim, o ITCMD (imposto de transmissao) deve ser pago antes da partilha final. A aliquota varia de 4% a 8% conforme o estado. Em alguns casos, e possivel parcelar. Orientamos sobre a melhor forma de quitar ou financiar este imposto.',
        },
      ]}
      categoryName="Protecao Patrimonial"
      relatedProducts={relatedProducts}
    />
  )
}
