import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Garcez Palha - Plataforma para Advogados',
  description: 'Crie seu próprio escritório digital com IA. A mesma tecnologia que atende 10.000 clientes/mês.',
  keywords: [
    'plataforma jurídica',
    'software para advogados',
    'CRM jurídico',
    'IA para advogados',
    'automação advocacia',
    'white-label jurídico',
  ],
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
