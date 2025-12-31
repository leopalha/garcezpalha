'use client'

import { notFound } from 'next/navigation'
import { ProductVSL } from '@/components/vsl'
import { getProductBySlug } from '@/lib/products/catalog'

export default function VerbasRescisoriasPage() {
  const product = getProductBySlug('verbas-rescisoria')

  if (!product) {
    notFound()
  }

  return (
    <ProductVSL
      product={product}
      heroColor="orange"
      heroIcon="DollarSign"
      agitationPoints={[
        'Demitido sem justa causa mas não recebeu todas as verbas',
        'Empresa não pagou aviso prévio, férias proporcionais ou 13º',
        'FGTS não foi depositado corretamente durante anos',
        'Multa de 40% do FGTS não foi paga',
        'Horas extras não refletiram nas verbas rescisórias',
        'Você assinou acordo na demissão sem saber seus direitos'
      ]}
      solutionSteps={[
        'Análise da rescisão - Calculamos todas as verbas devidas',
        'Cálculo completo - Aviso, férias, 13º, FGTS, multa 40%',
        'Reflexos - Horas extras, comissões, gratificações nas verbas',
        'Ação trabalhista - Cobramos diferenças não pagas',
        'Multa do Art. 477 - Empresa paga 1 salário de multa se atrasar',
        'Execução garantida - Penhora de bens até recebimento'
      ]}
      urgencyMessage="💼 VERBAS RESCISÓRIAS ERRADAS? Recupere diferenças + multa"
      guaranteeTitle="Cálculo Completo Gratuito"
      guaranteeDescription="Calculamos gratuitamente todas as verbas que você deveria ter recebido. Honorários apenas sobre diferenças recuperadas (20-30%)."
      stats={{
        years: 14,
        cases: 1350,
        successRate: 91,
        clients: 1230,
      }}
      customAlert={{
        title: "Empresa tem 10 DIAS para pagar rescisão!",
        description: "Se empresa atrasar pagamento das verbas rescisórias em mais de 10 dias, você tem direito a MULTA de 1 salário (Art. 477 CLT). Essa multa é ADICIONAL aos valores devidos!"
      }}
    />
  )
}
