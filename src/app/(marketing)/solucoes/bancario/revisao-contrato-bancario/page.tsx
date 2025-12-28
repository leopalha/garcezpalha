import { notFound } from 'next/navigation'
import { ProductVSL } from '@/components/vsl'
import { getProductBySlug } from '@/lib/products/catalog'
import { Shield } from 'lucide-react'

export default function RevisaoContratoBancarioPage() {
  const product = getProductBySlug('revisao-contrato-bancario')

  if (!product) {
    notFound()
  }

  return (
    <ProductVSL
      product={product}
      heroColor="blue"
      heroIcon={Shield}
      agitationPoints={[
        "Tarifas e juros abusivos consomem seu dinheiro sem você perceber",
        "Contratos bancários complexos escondem cobranças ilegais",
        "Bancos dificultam portabilidade e revisão de contratos",
        "Seguros embutidos sem autorização geram prejuízos",
        "Falta de transparência mantém você pagando mais"
]}
      solutionSteps={[
        "Análise detalhada do contrato e extratos bancários",
        "Identificação de cobranças ilegais e juros abusivos",
        "Cálculo de valores a restituir",
        "Notificação extrajudicial ao banco",
        "Ação judicial para restituição em dobro",
        "Acompanhamento até recuperação total"
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
