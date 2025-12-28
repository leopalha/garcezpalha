'use client'

import { ProductVSL } from '@/components/vsl/ProductVSL'
import { SEOHead, UrgencyBanner, WhatsAppFloat } from '@/components/vsl'
import { PRODUTO_BUSCA_APREENSAO_VEICULO } from '@/lib/products/catalog'

export default function BuscaApreensaoVeiculoPage() {
  return (
    <div className="min-h-screen">
      <SEOHead
        title={PRODUTO_BUSCA_APREENSAO_VEICULO.name}
        description={PRODUTO_BUSCA_APREENSAO_VEICULO.description}
        keywords={PRODUTO_BUSCA_APREENSAO_VEICULO.keywords}
        productName={PRODUTO_BUSCA_APREENSAO_VEICULO.name}
        price={PRODUTO_BUSCA_APREENSAO_VEICULO.price.basic || 0}
        category={PRODUTO_BUSCA_APREENSAO_VEICULO.category}
      />

      <ProductVSL
        product={PRODUTO_BUSCA_APREENSAO_VEICULO}
        heroColor="red"
        heroIcon="Truck"
        agitationPoints={[
          'Liminar de busca e apreensão toma seu veículo em 24-48h',
          'Sem o carro, você fica sem trabalhar e sem locomoção',
          'Banco vende o veículo em leilão por valor muito abaixo do mercado',
          'Diferença do leilão vira dívida que você continua devendo',
          'Apreensão do veículo gera custos de guincho, pátio e leilão',
          'Sem defesa técnica, você perde o bem e ainda fica devendo'
        ]}
        solutionSteps={[
          'Análise urgente do contrato - identificação de cláusulas abusivas',
          'Defesa contra liminar de busca e apreensão - suspensão judicial',
          'Negociação de renegociação - acordo direto com o banco',
          'Purgação da mora - pagamento das parcelas atrasadas para manter veículo',
          'Revisão de juros e encargos - redução do valor devido',
          'Defesa completa até sentença - proteção do seu patrimônio'
        ]}
        stats={{
          years: 9,
          cases: 380,
          successRate: 82,
          clients: 340
        }}
        urgencyMessage="Recebeu notificação de busca e apreensão? Defenda seu veículo AGORA"
        guaranteeTitle="Defesa Urgente"
        guaranteeDescription="Atendimento urgente para suspender busca e apreensão de veículo. Negociação e defesa técnica para proteger seu patrimônio."
        customAlert={{
          title: "Ação de busca e apreensão do seu veículo?",
          description: "Você tem poucos dias para se defender! A liminar pode ser concedida rapidamente e seu veículo será tomado. Entre em contato URGENTE para defesa técnica."
        }}
      />
    </div>
  )
}
