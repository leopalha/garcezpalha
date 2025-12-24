import { Metadata } from 'next'
import { ProductPageTemplate } from '@/components/marketing/templates'
import { getSolutionById, SOLUTIONS } from '@/types/checkout'

export const metadata: Metadata = {
  title: 'Usucapiao | Garcez Palha Advogados',
  description:
    'Acao de usucapiao para regularizar seu imovel. Conquiste a propriedade do terreno ou casa que voce ocupa ha anos.',
  keywords: [
    'usucapiao',
    'usucapiao urbano',
    'usucapiao rural',
    'regularizacao de imovel',
    'acao de usucapiao',
    'advogado usucapiao',
  ],
}

export default function UsucapiaoPage() {
  const solution = getSolutionById('usucapiao')!

  const relatedProducts = SOLUTIONS.filter(
    (s) => s.category === 'patrimonial' && s.id !== 'usucapiao'
  ).slice(0, 3)

  return (
    <ProductPageTemplate
      heroTitle="Regularize Seu Imovel por Usucapiao"
      heroSubtitle="Acao judicial completa para conquistar a propriedade do imovel que voce ocupa ha anos de forma pacifica e ininterrupta."
      heroProblem="Voce mora em um imovel ha mais de 5 anos mas nao tem a escritura? Cuida do terreno mas o dono nunca apareceu? A usucapiao e seu direito de se tornar proprietario."
      solution={solution}
      solutionBenefits={[
        'Analise completa dos requisitos legais do seu caso',
        'Levantamento de documentacao e testemunhas',
        'Elaboracao e protocolo da acao judicial',
        'Acompanhamento de todo o processo ate sentenca',
        'Registro da sentenca no cartorio de imoveis',
        'Suporte para obtencao da escritura definitiva',
      ]}
      documentsRequired={[
        'RG e CPF do requerente',
        'Comprovante de residencia atualizado',
        'Contas de luz, agua ou IPTU em seu nome (quanto mais antigas, melhor)',
        'Fotos do imovel e benfeitorias realizadas',
        'Certidao de matrimonio ou uniao estavel (se aplicavel)',
        'Dados de testemunhas que comprovem sua posse',
        'Planta ou croqui do imovel (se houver)',
      ]}
      faqItems={[
        {
          question: 'Quanto tempo preciso morar no imovel para pedir usucapiao?',
          answer:
            'Depende do tipo de usucapiao. O urbano especial exige 5 anos de posse ininterrupta em imovel de ate 250m². O usucapiao ordinario exige 10 anos com justo titulo e boa-fe, ou 15 anos sem esses requisitos. Analisamos seu caso para identificar qual modalidade se aplica.',
        },
        {
          question: 'Preciso pagar IPTU atrasado para conseguir usucapiao?',
          answer:
            'Nao necessariamente. Os debitos de IPTU nao impedem a usucapiao, mas podem ser transferidos para voce junto com a propriedade. Avaliamos a situacao e orientamos sobre a melhor estrategia, incluindo possivel negociacao de dividas.',
        },
        {
          question: 'E se aparecer alguem dizendo ser dono do imovel?',
          answer:
            'Por isso a acao de usucapiao e importante - ela resolve definitivamente a questao da propriedade. Se houver oposicao, o juiz analisara as provas de ambos os lados. Nossa experiencia mostra que quando ha posse prolongada e pacifica, as chances de sucesso sao muito altas.',
        },
        {
          question: 'Quanto custa a acao de usucapiao?',
          answer:
            'Nosso pacote completo custa R$ 3.500,00 e inclui toda a assessoria juridica do inicio ao fim. Custas judiciais e cartorarias sao pagas separadamente conforme o andamento do processo, e podem variar de R$ 1.000 a R$ 3.000 dependendo do estado.',
        },
        {
          question: 'Quanto tempo demora o processo de usucapiao?',
          answer:
            'Em media, de 2 a 4 anos, dependendo da comarca e da complexidade do caso. Usucapiao extrajudicial (feito em cartorio) pode ser mais rapido, de 6 meses a 1 ano, quando nao ha oposicao. Avaliamos qual modalidade e viavel no seu caso.',
        },
        {
          question: 'Posso fazer usucapiao de parte de um terreno?',
          answer:
            'Sim, e possivel fazer usucapiao de apenas uma parte do terreno, desde que voce consiga delimitar claramente a area que ocupa e comprovar a posse sobre ela. Um topografo pode ajudar a definir os limites exatos.',
        },
      ]}
      categoryName="Protecao Patrimonial"
      relatedProducts={relatedProducts}
    />
  )
}
