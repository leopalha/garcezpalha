import { Metadata } from 'next'
import { ProductPageTemplate } from '@/components/marketing/templates'
import { getSolutionById, SOLUTIONS } from '@/types/checkout'

export const metadata: Metadata = {
  title: 'Defesa em Execucao - Proteja seu Patrimonio | Garcez Palha',
  description:
    'Sendo executado por divida? Defenda-se com embargos a execucao e proteja seus bens. Especialistas em defesa patrimonial.',
  keywords: [
    'embargos a execucao',
    'defesa execucao',
    'suspensao penhora',
    'execucao divida',
    'bloqueio patrimonio',
    'advogado execucao',
    'defesa patrimonial',
    'cobranca judicial',
  ],
}

export default function DefesaExecucaoPage() {
  const solution = getSolutionById('defesa-execucao')!

  const relatedProducts = SOLUTIONS.filter(
    (s) => s.category === 'financeiro' && s.id !== 'defesa-execucao'
  ).slice(0, 3)

  return (
    <ProductPageTemplate
      heroTitle="Sendo executado por divida? Defenda-se e proteja seu patrimonio agora"
      heroSubtitle="Embargos a execucao, suspensao de penhora e protecao total dos seus bens. Mais de 700 execucoes revertidas."
      heroProblem="Recebeu citacao de execucao judicial e esta com medo de perder sua casa, carro ou ter salario bloqueado? Voce pode se defender e proteger seu patrimonio."
      solution={solution}
      solutionBenefits={[
        'Analise completa da execucao (prescricao, valores, erros)',
        'Embargos a execucao com fundamentacao tecnica robusta',
        'Suspensao imediata da penhora atraves de liminar',
        'Protecao de patrimonio (blindagem de bens)',
        'Negociacao de acordo vantajoso com desconto',
        'Reducao de ate 70% do valor cobrado',
        'Parcelamento em condicoes viaveis',
      ]}
      packages={[
        {
          solutionId: 'defesa-execucao-basico',
          name: 'Analise + Orientacao',
          description: 'Ideal para entender sua situacao',
          price: 49700, // R$ 497
          features: [
            'Analise completa do processo',
            'Parecer sobre chances de defesa',
            'Identificacao de prescricao',
            'Calculo de valores corretos',
            'Orientacao sobre proximos passos',
            'Suporte por WhatsApp 15 dias',
          ],
        },
        {
          solutionId: 'defesa-execucao-intermediario',
          name: 'Embargos a Execucao',
          description: 'Defesa tecnica completa',
          price: 149700, // R$ 1.497
          recommended: true,
          features: [
            'Tudo do plano Basico',
            'Peticao de embargos a execucao',
            'Pedido de suspensao da penhora',
            'Apresentacao de toda documentacao',
            'Acompanhamento ate decisao',
            'Garantia de defesa tecnica',
          ],
        },
        {
          solutionId: 'defesa-execucao-completo',
          name: 'Defesa Completa + Acordo',
          description: 'Protecao total do patrimonio',
          price: 299700, // R$ 2.997
          features: [
            'Tudo do plano Intermediario',
            'Negociacao de acordo com desconto',
            'Reducao de ate 70% do valor',
            'Parcelamento em ate 120x',
            'Blindagem patrimonial preventiva',
            'Recursos em todas as instancias',
            'Success Fee: desconto no honorario se conseguir acordo',
          ],
        },
      ]}
      documentsRequired={[
        'Citacao da execucao (mandado ou AR)',
        'Peticao inicial da execucao',
        'Documentos pessoais (RG, CPF)',
        'Comprovante de endereco',
        'Documentos relacionados a divida (se tiver)',
        'Extratos bancarios (se ja houve penhora)',
      ]}
      faqItems={[
        {
          question: 'O que sao embargos a execucao?',
          answer:
            'Embargos a execucao sao a defesa do executado (quem esta sendo cobrado) contra o processo de execucao. E a oportunidade de contestar a divida, apontar erros nos calculos, alegar prescricao ou apresentar qualquer outra defesa que possa suspender ou extinguir a execucao.',
        },
        {
          question: 'Como sei se a divida esta prescrita?',
          answer:
            'A prescricao varia conforme o tipo de divida. Dividas de cheque prescrevem em 5 anos, contratos em geral em 5 anos, dividas trabalhistas em 2 anos. Analisamos seu caso para verificar se a divida esta prescrita e, se estiver, apresentamos essa defesa nos embargos.',
        },
        {
          question: 'Quanto tempo tenho para me defender?',
          answer:
            'Apos receber a citacao da execucao, voce tem 15 dias para apresentar embargos a execucao. Se esse prazo vencer, voce perde o direito de apresentar defesa autonoma e a execucao continua normalmente. Por isso e fundamental agir rapidamente.',
        },
        {
          question: 'Podem penhorar minha casa?',
          answer:
            'A lei protege o bem de familia, que e o imovel residencial proprio onde voce mora. Em regra, a casa onde voce reside nao pode ser penhorada, salvo em casos excepcionais (divida de IPTU do proprio imovel, pensao alimenticia, etc). Analisamos seu caso para garantir essa protecao.',
        },
        {
          question: 'E se ja foi penhorado? Posso reverter?',
          answer:
            'Sim! Mesmo apos a penhora, e possivel reverter atraves de embargos a execucao ou impugnacao. Analisamos se a penhora foi feita corretamente e se recaiu sobre bens protegidos por lei (salario, aposentadoria, bem de familia). Em muitos casos conseguimos suspender e reverter a penhora.',
        },
        {
          question: 'Quanto custa um processo de execucao?',
          answer:
            'O custo varia conforme o valor da divida. Alem dos honorarios advocaticios do credor (normalmente 10% a 20% sobre o valor da divida), ha custas processuais e honorarios periciais se necessario. Por isso, defender-se pode economizar muito dinheiro.',
        },
        {
          question: 'Posso negociar acordo direto?',
          answer:
            'Sim! Inclusive e uma das melhores estrategias. Negociamos diretamente com o credor buscando desconto e parcelamento. Em muitos casos conseguimos descontos de 50% a 70% do valor cobrado, especialmente em dividas antigas ou prescritas.',
        },
        {
          question: 'Qual o desconto medio conseguido?',
          answer:
            'A media de desconto varia conforme o caso, mas geralmente conseguimos entre 40% a 70% de reducao no valor total cobrado. Em dividas prescritas ou com erros graves nos calculos, o desconto pode chegar a 100% (extincao total da divida).',
        },
        {
          question: 'Preciso ir ao forum?',
          answer:
            'Nao necessariamente. Na maioria dos casos, todo o processo pode ser conduzido online, sem necessidade de sua presenca no forum. Apenas em audiencias especificas pode ser necessaria sua presenca, mas sempre te avisamos com antecedencia e te preparamos para isso.',
        },
        {
          question: 'Quanto tempo dura a execucao?',
          answer:
            'O tempo varia muito. Uma execucao pode durar de 1 a 5 anos ou mais, dependendo da complexidade. Com embargos a execucao bem fundamentados, conseguimos suspender a execucao por meses ou ate anos, ganhando tempo para negociar ou esperar a prescricao.',
        },
        {
          question: 'Podem bloquear meu salario?',
          answer:
            'A lei protege o salario de bloqueio judicial, salvo em casos de pensao alimenticia. No entanto, valores que permanecem depositados na conta bancaria podem ser bloqueados. Por isso e importante agir rapidamente para proteger seu patrimonio.',
        },
        {
          question: 'O que acontece se eu nao fizer nada?',
          answer:
            'Se voce nao se defender, a execucao prossegue normalmente. Seus bens poderao ser penhorados (casa, carro, valores em conta), seu salario podera sofrer desconto em folha, e o valor da divida aumentara com juros, honorarios e custas processuais. Quanto antes agir, melhor.',
        },
      ]}
      categoryName="Protecao Financeira"
      relatedProducts={relatedProducts}
    />
  )
}
