'use client'

import { ProductVSL } from '@/components/vsl/ProductVSL'
import { SEOHead, UrgencyBanner } from '@/components/vsl'
import { PRODUTO_AVALIACAO_IMOVEIS } from '@/lib/products/catalog'

export default function AvaliacaoImoveisPage() {
  return (
    <div className="min-h-screen">
      <SEOHead
        title={PRODUTO_AVALIACAO_IMOVEIS.name}
        description={PRODUTO_AVALIACAO_IMOVEIS.description}
        keywords={PRODUTO_AVALIACAO_IMOVEIS.keywords}
        productName={PRODUTO_AVALIACAO_IMOVEIS.name}
        price={PRODUTO_AVALIACAO_IMOVEIS.price.basic || 0}
        category={PRODUTO_AVALIACAO_IMOVEIS.category}
      />

      <ProductVSL
        product={PRODUTO_AVALIACAO_IMOVEIS}
        heroColor="blue"
        heroIcon="Building2"
        agitationPoints={[
          'Venda ou compra de imóvel sem avaliação técnica gera prejuízo',
          'Inventário com valor incorreto aumenta impostos e custos',
          'Partilha em divórcio injusta por falta de avaliação adequada',
          'Garantia em empréstimo subavaliada reduz crédito disponível',
          'Decisão judicial baseada em valor errado causa perdas',
          'Expertise técnica evita super ou subvalorização do patrimônio'
        ]}
        solutionSteps={[
          'Vistoria técnica completa no imóvel - análise de todas características',
          'Pesquisa de mercado - comparação com imóveis similares na região',
          'Avaliação por métodos técnicos reconhecidos - NBR 14653',
          'Laudo técnico detalhado - fundamentação e documentação',
          'Valor justo de mercado - sem super ou subvalorização',
          'Uso em processos judiciais - inventário, partilha, garantia'
        ]}
        stats={{
          years: 15,
          cases: 580,
          successRate: 95,
          clients: 520
        }}
        urgencyMessage="Precisa avaliar imóvel para inventário, divórcio ou venda?"
        guaranteeTitle="Avaliação Técnica"
        guaranteeDescription="Avaliação técnica de imóveis por engenheiros e especialistas. Laudo conforme NBR 14653 aceito em processos judiciais e extrajudiciais."
        customAlert={{
          title: "Valor correto do imóvel é fundamental!",
          description: "Avaliação técnica profissional evita prejuízos em venda, inventário, partilha e garantias. Laudo técnico é documento oficial aceito judicialmente."
        }}
      />
    </div>
  )
}
