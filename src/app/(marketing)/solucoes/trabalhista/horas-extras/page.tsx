import { notFound } from 'next/navigation'
import { ProductVSL } from '@/components/vsl'
import { getProductBySlug } from '@/lib/products/catalog'
import { Shield } from 'lucide-react'

export default function HorasExtrasPage() {
  const product = getProductBySlug('horas-extras')

  if (!product) {
    notFound()
  }

  return (
    <ProductVSL
      product={product}
      heroColor="orange"
      heroIcon="Shield"
      agitationPoints={[
        "Empresa não pagou verbas rescisórias corretamente",
        "Horas extras trabalhadas não foram pagas",
        "Férias e 13º salário calculados errado",
        "FGTS não depositado",
        "Direitos trabalhistas desrespeitados"
]}
      solutionSteps={[
        "Análise de contracheques e rescisão",
        "Cálculo de valores devidos",
        "Tentativa de acordo extrajudicial",
        "Reclamação trabalhista na Justiça do Trabalho",
        "Audiência e sustentação oral",
        "Execução para receber os valores"
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
