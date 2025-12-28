'use client'

import { ProductVSL } from '@/components/vsl/ProductVSL'
import { SEOHead, UrgencyBanner, WhatsAppFloat } from '@/components/vsl'
import { PRODUTO_PROBLEMAS_MARKETPLACE } from '@/lib/products/catalog'

export default function ProblemasMarketplacePage() {
  return (
    <div className="min-h-screen">
      <SEOHead
        title={PRODUTO_PROBLEMAS_MARKETPLACE.name}
        description={PRODUTO_PROBLEMAS_MARKETPLACE.description}
        keywords={PRODUTO_PROBLEMAS_MARKETPLACE.keywords}
        productName={PRODUTO_PROBLEMAS_MARKETPLACE.name}
        price={PRODUTO_PROBLEMAS_MARKETPLACE.price.basic || 0}
        category={PRODUTO_PROBLEMAS_MARKETPLACE.category}
      />

      <ProductVSL
        product={PRODUTO_PROBLEMAS_MARKETPLACE}
        heroColor="orange"
        heroIcon="ShoppingCart"
        agitationPoints={[
          'Produto não chegou mas marketplace não devolve o dinheiro',
          'Item defeituoso ou diferente do anunciado sem solução',
          'Vendedor desaparece e plataforma não se responsabiliza',
          'Reembolso prometido nunca é processado',
          'SAC ignora reclamações e não resolve o problema',
          'Prejuízo financeiro sem entrega do produto ou devolução'
        ]}
        solutionSteps={[
          'Análise do caso - verificação de pedido, pagamento e comunicações',
          'Notificação extrajudicial - pedido formal de reembolso ou entrega',
          'Reclamação em órgãos de defesa - Procon e consumidor.gov.br',
          'Ação no Juizado Especial - processo rápido sem custas iniciais',
          'Reembolso em dobro do valor - Art. 42 do CDC',
          'Indenização por danos morais - R$ 3 mil a R$ 8 mil'
        ]}
        stats={{
          years: 7,
          cases: 520,
          successRate: 88,
          clients: 480
        }}
        urgencyMessage="Problema em marketplace sem solução? Reembolso em dobro + danos morais"
        guaranteeTitle="Defesa do Consumidor"
        guaranteeDescription="Especialistas em direito do consumidor digital. Responsabilização de marketplaces e vendedores por problemas em compras online."
        customAlert={{
          title: "Comprou e não recebeu? Produto defeituoso sem solução?",
          description: "Marketplaces são responsáveis solidários pelas vendas. CDC garante reembolso em dobro quando cobrança indevida ou não entrega. Você tem direito à indenização!"
        }}
      />
    </div>
  )
}
