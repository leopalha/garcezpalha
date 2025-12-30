// Advanced SEO Metadata Generator
// Garcez Palha - MANUS v7.0 (29/12/2025)

import { Metadata } from 'next'

interface SEOConfig {
  title: string
  description: string
  keywords?: string[]
  canonical?: string
  ogImage?: string
  article?: {
    publishedTime?: string
    modifiedTime?: string
    author?: string
    section?: string
    tags?: string[]
  }
  product?: {
    price?: number
    currency?: string
    availability?: string
    condition?: string
  }
}

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://garcezpalha.com.br'
const DEFAULT_OG_IMAGE = '/images/og-image.jpg'

/**
 * Generate complete metadata for a page
 */
export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    canonical,
    ogImage = DEFAULT_OG_IMAGE,
    article,
    product,
  } = config

  const fullTitle = `${title} | Garcez Palha`
  const canonicalUrl = canonical || BASE_URL

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: 'Garcez Palha Consultoria Jurídica & Pericial' }],
    creator: 'Garcez Palha',
    publisher: 'Garcez Palha',
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: article ? 'article' : product ? 'website' : 'website',
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: 'Garcez Palha',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'pt_BR',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }

  // Note: Article-specific metadata would be added via openGraph object
  // Next.js Metadata API handles article type automatically

  return metadata
}

/**
 * Generate metadata for service pages
 */
export function generateServiceMetadata(serviceName: string, serviceDescription: string): Metadata {
  return generateMetadata({
    title: serviceName,
    description: serviceDescription,
    keywords: [
      serviceName,
      'advocacia',
      'direito',
      'advogado',
      'Rio de Janeiro',
      'consultoria jurídica',
      'perícia',
    ],
  })
}

/**
 * Generate metadata for blog posts
 */
export function generateBlogMetadata(
  title: string,
  description: string,
  publishedTime: string,
  author: string,
  tags: string[]
): Metadata {
  return generateMetadata({
    title,
    description,
    keywords: tags,
    article: {
      publishedTime,
      author,
      tags,
      section: 'Blog Jurídico',
    },
  })
}

/**
 * Generate metadata for products
 */
export function generateProductMetadata(
  productName: string,
  description: string,
  price: number
): Metadata {
  return generateMetadata({
    title: productName,
    description,
    product: {
      price,
      currency: 'BRL',
      availability: 'in stock',
      condition: 'new',
    },
  })
}
