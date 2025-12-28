'use client'

import { ProductVSL } from '@/components/vsl/ProductVSL'
import { SEOHead, UrgencyBanner, WhatsAppFloat } from '@/components/vsl'
import { PRODUTO_INQUERITO_POLICIAL } from '@/lib/products/catalog'

export default function InqueritoPolicialPage() {
  return (
    <div className="min-h-screen">
      <SEOHead
        title={PRODUTO_INQUERITO_POLICIAL.name}
        description={PRODUTO_INQUERITO_POLICIAL.description}
        keywords={PRODUTO_INQUERITO_POLICIAL.keywords}
        productName={PRODUTO_INQUERITO_POLICIAL.name}
        price={PRODUTO_INQUERITO_POLICIAL.price.basic || 0}
        category={PRODUTO_INQUERITO_POLICIAL.category}
      />

      <ProductVSL
        product={PRODUTO_INQUERITO_POLICIAL}
        heroColor="violet"
        heroIcon="Search"
        agitationPoints={[
          'Inquérito policial sem defesa técnica resulta em indiciamento injusto',
          'Depoimentos sem orientação podem criar provas contra você',
          'Falta de acompanhamento impede a produção de provas de defesa',
          'Delegado pode formar convicção equivocada sem manifestação técnica',
          'Denúncia do MP é quase certa sem defesa prévia na investigação',
          'Arquivamento do inquérito só ocorre com estratégia defensiva adequada'
        ]}
        solutionSteps={[
          'Acompanhamento técnico em depoimentos - orientação sobre direitos',
          'Análise completa do inquérito policial - identificação de falhas',
          'Juntada de documentos e provas de defesa - contraprovas efetivas',
          'Pedido de diligências investigativas - esclarecimento dos fatos',
          'Parecer técnico ao delegado e ao MP - fundamentação jurídica',
          'Pedido de arquivamento do inquérito - evitar denúncia criminal'
        ]}
        stats={{
          years: 12,
          cases: 420,
          successRate: 71,
          clients: 380
        }}
        urgencyMessage="Sendo investigado? Defesa técnica desde o início evita denúncia"
        guaranteeTitle="Defesa Estratégica"
        guaranteeDescription="Atuação completa na fase de investigação para evitar denúncia ou reduzir acusação. Estratégia defensiva desde o primeiro momento."
        customAlert={{
          title: "Foi notificado para depor na delegacia?",
          description: "O inquérito policial é a fase mais importante para evitar processo criminal. Com defesa técnica adequada, é possível conseguir o arquivamento do caso."
        }}
      />
    </div>
  )
}
