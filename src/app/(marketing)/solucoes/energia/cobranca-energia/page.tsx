import { notFound } from 'next/navigation'
import { ProductVSL } from '@/components/vsl'
import { getProductBySlug } from '@/lib/products/catalog'
import { Shield } from 'lucide-react'

export default function CobrancaEnergiaPage() {
  const product = getProductBySlug('cobranca-energia')

  if (!product) {
    notFound()
  }

  return (
    <ProductVSL
      product={product}
      heroColor="yellow"
      heroIcon="Shield"
      agitationPoints={[
        "Contas de luz absurdamente altas sem explicação",
        "Cobranças retroativas de consumo não medido",
        "Religação negada ou demorada",
        "Medidores com defeito gerando cobranças erradas",
        "Distribuidora não resolve problemas"
]}
      solutionSteps={[
        "Análise técnica do histórico de consumo",
        "Perícia em medidor (se necessário)",
        "Protocolo na Aneel",
        "Notificação à distribuidora",
        "Ação para anular cobranças indevidas",
        "Restituição em dobro + danos morais"
]}
      urgencyMessage="⚡ Atendimento prioritário - Análise gratuita do seu caso"
      guaranteeTitle="Garantia de Resultado"
      guaranteeDescription="Trabalhamos com honorários de êxito. Só cobramos se você ganhar."
      stats={{
        years: 10,
        cases: 300,
        successRate: 85,
        clients: 250,
      }}
    />
  )
}
