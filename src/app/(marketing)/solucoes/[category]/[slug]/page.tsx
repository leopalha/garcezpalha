import { notFound } from 'next/navigation'
import { ProductVSL } from '@/components/vsl'
import { getProductBySlug } from '@/lib/products/catalog'
import { getVSLConfig } from '@/lib/products/vsl-config'

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
export async function generateStaticParams() {
  // Import all products from catalog
  const { getAllProducts } = await import('@/lib/products/catalog')
  const products = getAllProducts()

  return products.map((product) => ({
    category: product.category,
    slug: product.slug,
  }))
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params
  const product = getProductBySlug(slug)

  if (!product) {
    return {
      title: 'Produto não encontrado',
    }
  }

  return {
    title: `${product.name} | Garcez Palha Advogados`,
    description: product.description,
    keywords: product.keywords,
    openGraph: {
      title: product.name,
      description: product.description,
      type: 'website',
    },
  }
}
