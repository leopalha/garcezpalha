'use client'

import { ProductVSL } from '@/components/vsl/ProductVSL'
import { SEOHead, UrgencyBanner, WhatsAppFloat } from '@/components/vsl'
import { PRODUTO_DEFESA_FLAGRANTE } from '@/lib/products/catalog'

export default function DefesaFlagrantePage() {
  return (
    <div className="min-h-screen">
      <SEOHead
        title={PRODUTO_DEFESA_FLAGRANTE.name}
        description={PRODUTO_DEFESA_FLAGRANTE.description}
        keywords={PRODUTO_DEFESA_FLAGRANTE.keywords}
        productName={PRODUTO_DEFESA_FLAGRANTE.name}
        price={PRODUTO_DEFESA_FLAGRANTE.price.basic || 0}
        category={PRODUTO_DEFESA_FLAGRANTE.category}
      />

      <ProductVSL
        product={PRODUTO_DEFESA_FLAGRANTE}
        heroColor="red"
        heroIcon="AlertCircle"
        agitationPoints={[
          'As primeiras 24h após a prisão são CRUCIAIS para sua defesa',
          'Sem advogado, você pode dizer algo que será usado contra você',
          'Auto de prisão em flagrante com vícios pode manter você preso',
          'Delegados podem converter flagrante em prisão preventiva sem defesa',
          'Direito ao silêncio e não autoincriminação são frequentemente violados',
          'Liberdade provisória negada por falta de assistência técnica imediata'
        ]}
        solutionSteps={[
          'Atendimento 24H NA DELEGACIA - advogado criminalista vai até você',
          'Orientação técnica no depoimento - exercício do direito ao silêncio',
          'Análise do auto de prisão em flagrante - identificação de ilegalidades',
          'Pedido imediato de liberdade provisória - audiência de custódia',
          'Habeas corpus preventivo se necessário - protocolo urgente',
          'Acompanhamento completo até a liberação ou julgamento'
        ]}
        stats={{
          years: 15,
          cases: 280,
          successRate: 78,
          clients: 250
        }}
        urgencyMessage="ATENDIMENTO 24 HORAS - Advogado criminalista na delegacia AGORA"
        guaranteeTitle="Atendimento Imediato 24h"
        guaranteeDescription="Plantão criminal 24 horas. Advogado criminalista atende na delegacia em qualquer horário para garantir sua defesa técnica."
        customAlert={{
          title: "PRESO EM FLAGRANTE? NÃO FALE NADA SEM ADVOGADO!",
          description: "Você tem direito ao silêncio e à assistência de advogado. Tudo que disser pode ser usado contra você. Entre em contato IMEDIATAMENTE!"
        }}
      />
    </div>
  )
}
