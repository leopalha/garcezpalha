'use client'

import { Metadata } from 'next'
import {
  DualHero,
  ProductsCatalog,
  HowItWorks,
  WhyChooseUs,
  Credentials,
  Testimonials,
  FAQ,
  FinalCTA,
} from '@/components/marketing'
import { Timeline } from './components/timeline'


export default function HomePage() {
  return (
    <>
      <DualHero />
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
