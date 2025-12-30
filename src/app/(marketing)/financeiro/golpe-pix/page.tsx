import { notFound } from 'next/navigation'
import { ProductVSL } from '@/components/vsl'
import { getProductBySlug } from '@/lib/products/catalog'

// ISR: Revalidate every 1 hour (product pages rarely change)
export const revalidate = 3600

// Generate metadata for SEO





export default function GolpePixPage() {
  const product = getProductBySlug('golpe-pix')

  if (!product) {
    notFound()
  }

  return (
    <ProductVSL
      product={product}
      heroColor="red"
      heroIcon="AlertTriangle"
      agitationPoints={[
        'Bancos se recusam a devolver alegando que a transferência foi autorizada por você',
        'Polícia Civil demora meses para investigar e muitas vezes não consegue rastrear',
        'Golpistas transferem rapidamente o dinheiro para várias contas laranjas',
        'Quanto mais tempo passa, menor a chance de encontrar o dinheiro na conta original',
        'Você pode ficar sem o dinheiro E ainda ter que pagar taxas bancárias',
        'Muitas vítimas desistem por não saber que podem processar o banco por negligência',
      ]}
      solutionSteps={[
        'ANÁLISE URGENTE (24h) - Avaliamos viabilidade e identificamos brechas de responsabilidade do banco',
        'BLOQUEIO IMEDIATO - Solicitamos liminar para congelar a conta do golpista antes que movimente o dinheiro',
        'RASTREAMENTO COMPLETO - Mapeamos todas as transferências subsequentes do seu dinheiro',
        'AÇÃO CONTRA O BANCO - Responsabilizamos o banco por falhas nos mecanismos de segurança',
        'REPRESENTAÇÃO CRIMINAL - Acionamos o golpista criminalmente para fortalecer ação civil',
        'RECUPERAÇÃO + INDENIZAÇÃO - Além do valor perdido, buscamos indenização por danos morais',
      ]}
      urgencyMessage="URGENTE: Cada minuto conta! Quanto mais rápido agir, maior a chance de recuperar seu dinheiro"
      guaranteeTitle="Success Fee - Você Só Paga Se Recuperar"
      guaranteeDescription="No plano Ação Judicial Completa, trabalhamos com success fee. Se não conseguirmos recuperar nada, você não paga custas processuais adicionais. Nosso sucesso depende do seu."
      stats={{
        years: 10,
        cases: 500,
        successRate: 98,
        clients: 800,
      }}
      customAlert={{
        title: "ATENÇÃO: CADA MINUTO CONTA!",
        description: "Quanto mais rápido você agir, maiores são suas chances de recuperação. O golpista pode estar movimentando seu dinheiro AGORA MESMO. Temos atendimento 24/7 para casos urgentes e podemos solicitar bloqueio judicial IMEDIATO da conta do criminoso."
      }}
    />
  )
}
