'use client'

import { ProductVSL } from '@/components/vsl/ProductVSL'
import { SEOHead, UrgencyBanner, WhatsAppFloat } from '@/components/vsl'
import { PRODUTO_LEI_MARIA_PENHA } from '@/lib/products/catalog'

export default function LeiMariaPenhaPage() {
  return (
    <div className="min-h-screen">
      <SEOHead
        title={PRODUTO_LEI_MARIA_PENHA.name}
        description={PRODUTO_LEI_MARIA_PENHA.description}
        keywords={PRODUTO_LEI_MARIA_PENHA.keywords}
        productName={PRODUTO_LEI_MARIA_PENHA.name}
        price={PRODUTO_LEI_MARIA_PENHA.price.basic || 0}
        category={PRODUTO_LEI_MARIA_PENHA.category}
      />

      <ProductVSL
        product={PRODUTO_LEI_MARIA_PENHA}
        heroColor="purple"
        heroIcon="Shield"
        agitationPoints={[
          'Medidas protetivas restringem sua liberdade e contato com filhos',
          'Descumprimento de medida protetiva resulta em prisão imediata',
          'Processo criminal por violência doméstica gera antecedentes graves',
          'Lei Maria da Penha é rigorosa e dificulta defesa sem assistência técnica',
          'Condenação pode resultar em até 3 anos de prisão e perda de direitos',
          'Acusações falsas ou exageradas destroem reputação e vida profissional'
        ]}
        solutionSteps={[
          'Análise técnica da medida protetiva - verificação de legalidade',
          'Defesa escrita fundamentada - contestação de acusações',
          'Pedido de revogação ou flexibilização - quando cabível juridicamente',
          'Orientação sobre restrições - evitar descumprimento e prisão',
          'Defesa no processo criminal - estratégia técnica completa',
          'Produção de provas de defesa - testemunhas e documentos'
        ]}
        stats={{
          years: 11,
          cases: 290,
          successRate: 73,
          clients: 260
        }}
        urgencyMessage="Medida protetiva ou acusação de violência doméstica? Defesa técnica especializada"
        guaranteeTitle="Defesa Especializada"
        guaranteeDescription="Atuação técnica em casos de Lei Maria da Penha, com foco na defesa dos seus direitos e nas possibilidades de revogação ou flexibilização de medidas."
        customAlert={{
          title: "Recebeu notificação de medida protetiva?",
          description: "Medidas protetivas impõem restrições sérias. Descumprir pode resultar em prisão. É fundamental ter orientação jurídica para entender as restrições e exercer sua defesa."
        }}
      />
    </div>
  )
}
