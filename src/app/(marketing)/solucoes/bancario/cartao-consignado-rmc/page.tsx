'use client'

import { ProductVSL } from '@/components/vsl/ProductVSL'
import { SEOHead, UrgencyBanner } from '@/components/vsl'
import { PRODUTO_CARTAO_CONSIGNADO_RMC } from '@/lib/products/catalog'

export default function CartaoConsignadoRMCPage() {
  return (
    <div className="min-h-screen">
      <SEOHead
        title={PRODUTO_CARTAO_CONSIGNADO_RMC.name}
        description={PRODUTO_CARTAO_CONSIGNADO_RMC.description}
        keywords={PRODUTO_CARTAO_CONSIGNADO_RMC.keywords}
        productName={PRODUTO_CARTAO_CONSIGNADO_RMC.name}
        price={PRODUTO_CARTAO_CONSIGNADO_RMC.price.basic || 0}
        category={PRODUTO_CARTAO_CONSIGNADO_RMC.category}
      />

      <ProductVSL
        product={PRODUTO_CARTAO_CONSIGNADO_RMC}
        heroColor="green"
        heroIcon="CreditCard"
        agitationPoints={[
          'Cartão RMC consome margem consignável mesmo sem usar o limite',
          'Descontos mensais automáticos de parcela mínima (geralmente 5% do limite)',
          'Impossibilidade de fazer novos empréstimos por falta de margem',
          'Contrato feito sem explicação clara sobre funcionamento do RMC',
          'Banco se recusa a cancelar mesmo sem uso do cartão',
          'Margem bloqueada por anos prejudica aposentados e pensionistas'
        ]}
        solutionSteps={[
          'Análise gratuita do contrato - identificação do cartão RMC',
          'Verificação de margem consignável - quanto está bloqueado',
          'Notificação extrajudicial ao banco - pedido de cancelamento',
          'Ação judicial se necessário - cancelamento forçado do RMC',
          'Liberação imediata da margem - recuperação para novos empréstimos',
          'Restituição de valores descontados indevidamente'
        ]}
        stats={{
          years: 8,
          cases: 450,
          successRate: 91,
          clients: 420
        }}
        urgencyMessage="Cartão RMC bloqueando sua margem? Cancele e recupere valores"
        guaranteeTitle="Cancelamento Garantido"
        guaranteeDescription="Especialistas em cancelamento de cartão consignado RMC. Liberamos sua margem e recuperamos valores descontados indevidamente."
        customAlert={{
          title: "Margem consignável bloqueada por cartão que você nem usa?",
          description: "O cartão RMC (Reserva de Margem Consignável) desconta parcela mínima todo mês mesmo sem usar. Isso impede novos empréstimos e consome sua aposentadoria. Você pode cancelar!"
        }}
      />
    </div>
  )
}
