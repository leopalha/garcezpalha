'use client'

import { notFound } from 'next/navigation'
import { ProductVSL } from '@/components/vsl'
import { getProductBySlug } from '@/lib/products/catalog'

export default function IncorporacaoGratificacaoPage() {
  const product = getProductBySlug('incorporacao-gratificacao')

  if (!product) {
    notFound()
  }

  return (
    <ProductVSL
      product={product}
      heroColor="blue"
      heroIcon="TrendingUp"
      agitationPoints={[
        'Empresa pagou gratificação/prêmio por mais de 10 anos mas cortou',
        'Comissão fixa mensal paga por anos foi suprimida sem justificativa',
        'Ajuda de custo paga habitualmente não é mais concedida',
        'Empresa alega que gratificação é "liberalidade" e pode cortar',
        'Você se acostumou com valor adicional e agora salário não fecha',
        'Perdeu padrão de vida após corte de benefício pago por anos'
      ]}
      solutionSteps={[
        'Prova de habitualidade - Demonstramos pagamento por 10+ anos',
        'Incorporação ao salário - Gratificação vira parte do salário',
        'Impossibilidade de redução - Empresa não pode cortar gratificação incorporada',
        'Restabelecimento - Forçamos empresa a voltar a pagar',
        'Retroativo - Recebe desde o corte indevido',
        'Reflexos em verbas rescisórias - Se for demitido, calcula sobre valor maior'
      ]}
      urgencyMessage="📈 GRATIFICAÇÃO CORTADA? Incorpore ao salário + Restabeleça"
      guaranteeTitle="Incorporação Garantida"
      guaranteeDescription="Se gratificação foi paga habitualmente por 10+ anos, ela se incorpora ao salário. Empresa NÃO pode cortar."
      stats={{
        years: 10,
        cases: 340,
        successRate: 91,
        clients: 310,
      }}
      customAlert={{
        title: "10 anos de pagamento = INCORPORAÇÃO!",
        description: "Súmula 372 do TST: gratificação paga por 10+ anos se incorpora ao salário. Empresa não pode suprimir. Se cortou, você tem direito ao restabelecimento + retroativo."
      }}
    />
  )
}
