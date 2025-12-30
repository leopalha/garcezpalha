import { notFound } from 'next/navigation'
import { ProductVSL } from '@/components/vsl'
import { getProductBySlug } from '@/lib/products/catalog'

// ISR: Revalidate every 1 hour (product pages rarely change)
export const revalidate = 3600

// Generate metadata for SEO
export async function generateMetadata() {
  const product = getProductBySlug('desbloqueio-conta')
  if (!product) return {}

  return {
    title: `${product.name} | Garcez Palha Advogados`,
    description: product.description,
  }
}



export default function DesbloqueioContaPage() {
  const product = getProductBySlug('desbloqueio-conta')

  if (!product) {
    notFound()
  }

  return (
    <ProductVSL
      product={product}
      heroColor="blue"
      heroIcon="Banknote"
      agitationPoints={[
        'Não consegue pagar contas e boletos essenciais',
        'Salário bloqueado e inacessível na conta',
        'Impossível fazer transferências ou pagamentos urgentes',
        'Cartões de débito e crédito também bloqueados',
        'Prejuízo financeiro diário crescente e multas acumulando',
        'Risco de perder emprego ou oportunidades importantes',
      ]}
      solutionSteps={[
        'Análise GRATUITA do motivo do bloqueio - Identificamos a causa e estratégia',
        'Petição de urgência com liminar - Solicitamos desbloqueio imediato ao juiz',
        'Acompanhamento diário - Monitoramos o processo 24/7',
        'Comunicação com banco e vara judicial - Agilizamos a execução',
        'Desbloqueio efetivo em 3-7 dias - Recuperação do acesso total',
        'Indenização por danos morais - Se bloqueio foi indevido (R$ 5-15 mil)',
      ]}
      urgencyMessage="⚠️ CONTA BLOQUEADA? Desbloqueio em 3-7 dias - Consulta Gratuita"
      guaranteeTitle="Garantia de Desbloqueio ou Dinheiro de Volta"
      guaranteeDescription="Se não conseguirmos desbloquear sua conta bancária, devolvemos 100% do valor pago. Sem perguntas. Confiamos totalmente no nosso trabalho."
      stats={{
        years: 10,
        cases: 500,
        successRate: 95,
        clients: 600,
      }}
      customAlert={{
        title: "Situação Urgente?",
        description: "Conta bloqueada impede pagamentos, recebimento de salário e movimentações essenciais. Cada dia sem solução aumenta o prejuízo. Agimos com urgência para proteger seus direitos."
      }}
    />
  )
}
