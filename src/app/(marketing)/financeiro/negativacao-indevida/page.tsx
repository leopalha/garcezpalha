import { Metadata } from 'next'
import { ProductPageTemplate } from '@/components/marketing/templates'
import { getSolutionById, SOLUTIONS } from '@/types/checkout'

export const metadata: Metadata = {
  title: 'Negativacao Indevida - Limpe seu Nome e Receba Indenizacao | Garcez Palha',
  description:
    'Nome sujo sem dever? Removemos negativacao indevida em 48h e garantimos indenizacao de ate R$ 15 mil. Atendimento 24/7.',
  keywords: [
    'negativacao indevida',
    'limpar nome',
    'remover negativacao',
    'indenizacao serasa',
    'spc indevido',
    'danos morais negativacao',
    'limpar cpf',
  ],
}

export default function NegativacaoIndevidaPage() {
  const solution = getSolutionById('negativacao-indevida')!

  const relatedProducts = SOLUTIONS.filter(
    (s) => s.category === 'financeiro' && s.id !== 'negativacao-indevida'
  ).slice(0, 3)

  // Pacotes customizados para diferentes niveis de servico
  const packages = [
    {
      name: 'Notificacao Extrajudicial',
      description: 'Ideal para casos simples',
      price: 39700, // R$ 397
      solutionId: 'negativacao-indevida',
      features: [
        'Analise da negativacao',
        'Notificacao extrajudicial a empresa',
        'Prazo de 10 dias para resposta',
        'Orientacao completa',
        'Suporte por WhatsApp',
      ],
    },
    {
      name: 'Remocao com Liminar',
      description: 'Remocao garantida em 48h',
      price: 89700, // R$ 897
      recommended: true,
      solutionId: 'negativacao-indevida',
      features: [
        'Tudo do plano Basico',
        'Acao judicial com pedido de liminar',
        'Remocao da negativacao em 24-48h',
        'Certidao de regularizacao',
        'Acompanhamento processual',
        'Garantia de limpeza do nome',
      ],
    },
    {
      name: 'Remocao + Indenizacao',
      description: 'Limpeza + R$ 5 a 15 mil',
      price: 199700, // R$ 1.997
      solutionId: 'negativacao-indevida',
      features: [
        'Tudo do plano Intermediario',
        'Pedido de indenizacao por danos morais',
        'Valor entre R$ 5.000 e R$ 15.000',
        'Cobranca de custas da empresa',
        'Acompanhamento ate sentenca',
        'Success Fee: so paga se ganhar indenizacao',
      ],
    },
  ]

  return (
    <ProductPageTemplate
      heroTitle="Nome sujo sem dever? Limpe seu CPF e receba indenizacao em ate 60 dias"
      heroSubtitle="Removemos sua negativacao em 48h e garantimos indenizacao de R$ 5 mil a R$ 15 mil por danos morais."
      heroProblem="Seu CPF ou CNPJ esta negativado sem ter divida? Voce nao consegue fazer financiamento, emprestimo ou compras a prazo? Isso pode ser resolvido rapidamente e voce ainda recebe indenizacao."
      solution={solution}
      solutionBenefits={[
        'Remocao imediata da negativacao (liminar em 24-48h)',
        'Indenizacao por danos morais (R$ 5.000 a R$ 15.000)',
        'Limpeza definitiva do nome',
        'Regularizacao completa do CPF/CNPJ',
        'Direito de resposta contra a empresa',
        'Cobranca de custas da empresa',
      ]}
      packages={packages}
      documentsRequired={[
        'Documento de identidade (RG/CNH)',
        'CPF',
        'Comprovante de residencia atualizado',
        'Consulta do Serasa/SPC/Boa Vista (podemos fazer)',
        'Comprovante de que nao deve (se tiver)',
      ]}
      faqItems={[
        {
          question: 'Como sei se minha negativacao e indevida?',
          answer:
            'A negativacao e indevida quando: (1) Voce nunca teve relacao com a empresa; (2) A divida ja foi paga; (3) A divida esta prescrita (mais de 5 anos); (4) Nao foi notificado antes da negativacao; (5) O valor esta incorreto. Analisamos gratuitamente seu caso em ate 24h.',
        },
        {
          question: 'Quanto tempo para limpar o nome?',
          answer:
            'Com liminar, seu nome e limpo em 24 a 48h. Em casos urgentes (compra de imovel, emprego, etc.), podemos solicitar decisao em ate 12h. Ja a sentenca final com indenizacao leva de 6 a 12 meses.',
        },
        {
          question: 'Qual o valor da indenizacao que posso receber?',
          answer:
            'O valor varia de R$ 5.000 a R$ 15.000, dependendo: (1) Tempo que ficou negativado; (2) Quantidade de empresas que negativaram; (3) Danos comprovados (perda de emprego, recusa de credito); (4) Constrangimento sofrido. Nossa media e R$ 8.500 por caso.',
        },
        {
          question: 'Preciso pagar custas judiciais?',
          answer:
            'No plano Basico, nao ha custas. Nos planos Intermediario e Completo, as custas sao cobradas da empresa perdedora (nao de voce). Trabalhamos com Justica Gratuita se voce se qualificar.',
        },
        {
          question: 'Funciona para qualquer empresa (Serasa, SPC, etc.)?',
          answer:
            'Sim, atuamos contra qualquer orgao de protecao ao credito: Serasa, SPC Brasil, Boa Vista SCPC, Quod. Tambem atuamos contra a empresa que fez a negativacao indevida (banco, loja, operadora).',
        },
        {
          question: 'E se a divida foi paga mas continua negativado?',
          answer:
            'Isso e uma irregularidade grave. Apos pagar a divida, a empresa tem ate 5 dias uteis para remover a negativacao. Se nao fizer, voce tem direito a indenizacao mesmo tendo pago a divida. Apresente o comprovante de pagamento.',
        },
        {
          question: 'Posso fazer emprestimo logo apos limpar o nome?',
          answer:
            'Sim. Apos a liminar ser concedida e a negativacao removida (24-48h), seu CPF volta ao normal imediatamente. Voce pode fazer emprestimos, financiamentos e compras a prazo normalmente. Fornecemos certidao da liminar para comprovar.',
        },
        {
          question: 'A empresa pode negativar novamente?',
          answer:
            'Nao. A liminar proibe a empresa de negativar novamente. Se ela descumprir, pode ser multada em ate R$ 10.000 por dia. Apos a sentenca final declarando a negativacao indevida, a empresa jamais podera negativar voce por aquela divida.',
        },
        {
          question: 'Quanto tempo dura o processo?',
          answer:
            'A liminar (limpeza do nome) sai em 24-48h. Ja a sentenca final com indenizacao leva de 6 a 12 meses. Mas voce pode usar seu CPF normalmente logo apos a liminar. Acompanhamos o processo ate o final.',
        },
        {
          question: 'Posso fazer tudo online?',
          answer:
            'Sim, 100% online. Voce envia os documentos por WhatsApp, assinamos o contrato digitalmente, entramos com a acao e acompanhamos tudo pelo celular. Nao precisa ir ao escritorio ou ao forum. Quando a indenizacao for paga, depositamos na sua conta.',
        },
      ]}
      categoryName="Protecao Financeira"
      relatedProducts={relatedProducts}
    />
  )
}
