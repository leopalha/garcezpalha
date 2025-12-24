import { Metadata } from 'next'
import { ProductPageTemplate } from '@/components/marketing/templates'
import { getSolutionById, SOLUTIONS } from '@/types/checkout'

export const metadata: Metadata = {
  title: 'Direito Imobiliario | Garcez Palha Advogados',
  description:
    'Consultoria juridica imobiliaria completa: contratos, compra e venda, locacao, despejo, vizinhanca e todas as questoes sobre imoveis.',
  keywords: [
    'direito imobiliario',
    'advogado imobiliario',
    'contrato de compra e venda',
    'acao de despejo',
    'locacao',
    'conflitos de vizinhanca',
    'consultoria imobiliaria',
  ],
}

export default function DireitoImobiliarioPage() {
  const solution = getSolutionById('direito-imobiliario')!

  const relatedProducts = SOLUTIONS.filter(
    (s) => s.category === 'patrimonial' && s.id !== 'direito-imobiliario'
  ).slice(0, 3)

  return (
    <ProductPageTemplate
      heroTitle="Direito Imobiliario Completo"
      heroSubtitle="Proteja seus interesses em todas as questoes imobiliarias. Contratos, compra e venda, locacao, despejo, vizinhanca e mais."
      heroProblem="Problemas com inquilino que nao paga ou nao sai? Vizinho invadindo seu terreno? Duvidas em contrato de compra e venda? Precisa de consultoria para investimentos? Estamos aqui."
      solution={solution}
      solutionBenefits={[
        'Analise e elaboracao de contratos imobiliarios',
        'Due diligence em compra e venda de imoveis',
        'Acoes de despejo e cobranca de alugueis',
        'Resolucao de conflitos de vizinhanca',
        'Assessoria em incorporacoes e loteamentos',
        'Defesa em acoes relacionadas a imoveis',
        'Consultoria para investidores e construtoras',
      ]}
      documentsRequired={[
        'RG e CPF',
        'Documentos do imovel (matricula, escritura, contrato)',
        'Contratos relacionados ao caso',
        'Correspondencias e notificacoes trocadas',
        'Fotos e evidencias (se aplicavel)',
        'Comprovante de pagamentos ou inadimplencias',
      ]}
      faqItems={[
        {
          question: 'Como funciona uma acao de despejo?',
          answer:
            'Ha varios tipos: despejo por falta de pagamento (mais comum), por fim de contrato, por uso irregular do imovel, etc. Processo dura em media 6 a 12 meses. Fazemos notificacao extrajudicial, tentativa de acordo e, se necessario, ingressamos com acao judicial ate a efetiva desocupacao.',
        },
        {
          question: 'Quanto custa uma consultoria para comprar um imovel?',
          answer:
            'Consultoria basica (analise de contrato e documentacao): R$ 1.500,00. Due diligence completa (verificacao de regularidade, debitos, acoes judiciais, vicios): R$ 3.000,00. Investimento que evita prejuizos de centenas de milhares de reais com imoveis problematicos.',
        },
        {
          question: 'Meu vizinho construiu em cima do meu terreno. O que fazer?',
          answer:
            'Primeiro fazemos levantamento topografico para confirmar a invasao. Depois, notificacao extrajudicial pedindo demolicao ou indenizacao. Se nao resolver, acao de demolicao ou usucapiao inversa (voce ganha a parte invadida). Tambem ha possibilidade de acordo com compensacao financeira.',
        },
        {
          question: 'Posso vender um imovel com inquilino?',
          answer:
            'Sim, mas o comprador assume o contrato existente. Se o contrato tem prazo determinado, deve ser respeitado. Se for indeterminado, novo proprietario pode notificar saida com 30 dias de antecedencia. Orientamos sobre a melhor estrategia conforme o caso.',
        },
        {
          question: 'O que verificar antes de comprar um imovel?',
          answer:
            'Matricula atualizada, ausencia de acoes judiciais (distribuidor civil), regularidade da construcao (habite-se), debitos de IPTU e condominio, regularidade do vendedor, existencia de onus (hipotecas, penhoras), e mais. Nossa due diligence cobre todos esses pontos.',
        },
        {
          question: 'Quanto tempo demora para resolver um conflito de vizinhanca?',
          answer:
            'Depende da natureza do conflito e disposicao para acordo. Mediacao extrajudicial: 1 a 3 meses. Acao judicial (demolicao, dano, servidao): 1 a 3 anos. Sempre priorizamos solucao negociada quando possivel, mais rapida e economica para ambas as partes.',
        },
      ]}
      categoryName="Protecao Patrimonial"
      relatedProducts={relatedProducts}
    />
  )
}
