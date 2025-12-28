import { Metadata } from 'next'
import {
  HeroSection,
  ProductsCatalog,
  HowItWorks,
  WhyChooseUs,
  Credentials,
  Testimonials,
  FAQ,
  FinalCTA,
} from '@/components/marketing'
import { Timeline } from './components/timeline'

export const metadata: Metadata = {
  title: 'Garcez Palha | Advogado Online - Solucoes Juridicas',
  description:
    'Plataforma juridica com IA. Desbloqueio de conta, golpe do PIX, usucapiao, plano de saude. OAB/RJ 219.390. Tecnologia + 364 anos de tradicao.',
  keywords: [
    'advogado online',
    'conta bloqueada',
    'golpe pix',
    'usucapiao',
    'plano saude negou',
    'advogado rio de janeiro',
    'desbloqueio de conta',
    'advogado digital',
  ],
  openGraph: {
    title: 'Garcez Palha | Inteligencia Juridica',
    description:
      'Solucoes juridicas especializadas. Tecnologia de ponta + 364 anos de tradicao.',
    url: 'https://garcezpalha.com',
    siteName: 'Garcez Palha',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Garcez Palha | Inteligencia Juridica',
    description: 'Solucoes juridicas especializadas com tecnologia e tradicao.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ProductsCatalog />
      <HowItWorks />
      <WhyChooseUs />
      <Credentials />
      <Testimonials />

      {/* Keep Timeline from original - valuable content */}
      <Timeline />

      <FAQ />
      <FinalCTA />
    </>
  )
}
