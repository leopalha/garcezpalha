'use client'

import { notFound } from 'next/navigation'
import { ProductVSL } from '@/components/vsl'
import { getProductBySlug } from '@/lib/products/catalog'
import { getVSLConfig } from '@/lib/products/vsl-config'

// ISR: Revalidate pages every 1 hour

interface ProductPageProps {
  params: Promise<{
    category: string
    slug: string
  }>
}



export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params

  const product = getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  // Get VSL configuration for this product
  const vslConfig = getVSLConfig(slug)

  return (
    <ProductVSL
      product={product}
      heroColor={vslConfig.heroColor}
      heroIcon={vslConfig.heroIcon}
      agitationPoints={vslConfig.agitationPoints}
      solutionSteps={vslConfig.solutionSteps}
      urgencyMessage={vslConfig.urgencyMessage}
      guaranteeTitle={vslConfig.guaranteeTitle}
      guaranteeDescription={vslConfig.guaranteeDescription}
      stats={vslConfig.stats}
    />
  )
}

/**
 * Generate static params for all products
 * This enables static generation at build time
 */

/**
 * Generate metadata for SEO
 */
