'use client'

import { notFound } from 'next/navigation'
import { ProductVSL } from '@/components/vsl'
import { getProductBySlug } from '@/lib/products/catalog'

export default function PerfilHackeadoPage() {
  const product = getProductBySlug('perfil-hackeado')

  if (!product) {
    notFound()
  }

  return (
    <ProductVSL
      product={product}
      heroColor="red"
      heroIcon="Lock"
      agitationPoints={[
        'Perfil hackeado usado para golpes, prejudicando sua reputação pessoal e profissional',
        'Instagram/Facebook não responde solicitações de recuperação ou exclusão',
        'Golpistas usam seu nome para aplicar fraudes em amigos e familiares',
        'Fotos íntimas podem ser expostas publicamente ou usadas para chantagem',
        'Empresas te responsabilizam por danos causados pelo hacker',
        'Demora na solução pode resultar em danos morais irreversíveis'
      ]}
      solutionSteps={[
        'Notificação urgente - Notificamos Instagram/Facebook em 24h',
        'Remoção de conteúdo - Solicitamos exclusão de posts fraudulentos',
        'Recuperação de conta - Forçamos devolução do acesso via judicial',
        'Bloqueio de golpistas - Identificamos e bloqueamos hackers',
        'Indenização - Danos morais contra a rede social (R$ 10k a R$ 30k)',
        'Prevenção - Orientação para evitar novos hacks'
      ]}
      urgencyMessage="🚨 PERFIL HACKEADO? Notificação em 24h + Remoção urgente"
      guaranteeTitle="Resposta em 24 Horas"
      guaranteeDescription="Notificamos a rede social em até 24h após contratação. Ação judicial em 48h se não houver resposta."
      stats={{
        years: 4,
        cases: 320,
        successRate: 88,
        clients: 280,
      }}
      customAlert={{
        title: "ATENÇÃO: Cada hora conta!",
        description: "Quanto mais tempo o hacker tiver acesso ao seu perfil, maior o dano à sua reputação. Golpes podem estar acontecendo AGORA em seu nome. Aja imediatamente para minimizar prejuízos."
      }}
    />
  )
}
