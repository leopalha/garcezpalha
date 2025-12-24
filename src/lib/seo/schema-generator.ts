import { Solution } from '@/types/checkout'

interface FAQItem {
  question: string
  answer: string
}

/**
 * Gera schema JSON-LD para um produto/servico juridico
 */
export function generateProductSchema(solution: Solution) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: solution.name,
    description: solution.description,
    offers: {
      '@type': 'Offer',
      price: solution.price.toFixed(2),
      priceCurrency: 'BRL',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'LegalService',
        name: 'Garcez Palha Advogados',
        url: 'https://garcezpalha.com',
      },
    },
    provider: {
      '@type': 'LegalService',
      name: 'Garcez Palha Advogados',
      url: 'https://garcezpalha.com',
      telephone: '+55-21-99535-4010',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Av. das Américas 13685',
        addressLocality: 'Rio de Janeiro',
        addressRegion: 'RJ',
        postalCode: '22790-701',
        addressCountry: 'BR',
      },
    },
    category: solution.category,
  }
}

/**
 * Gera schema JSON-LD para FAQ
 */
export function generateFAQSchema(faqItems: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

/**
 * Gera schema JSON-LD para servico juridico
 */
export function generateServiceSchema(
  name: string,
  description: string,
  price: number,
  category: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Legal Service',
    name,
    description,
    provider: {
      '@type': 'Attorney',
      name: 'Garcez Palha Advogados',
      url: 'https://garcezpalha.com',
      telephone: '+55-21-99535-4010',
      priceRange: '$$',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Av. das Américas 13685',
        addressLocality: 'Rio de Janeiro',
        addressRegion: 'RJ',
        postalCode: '22790-701',
        addressCountry: 'BR',
      },
    },
    offers: {
      '@type': 'Offer',
      price: price.toFixed(2),
      priceCurrency: 'BRL',
      availability: 'https://schema.org/InStock',
    },
    category,
    areaServed: {
      '@type': 'Country',
      name: 'Brazil',
    },
  }
}

/**
 * Gera schema JSON-LD para breadcrumb
 */
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://garcezpalha.com${item.url}`,
    })),
  }
}

/**
 * Gera todos os schemas para uma pagina de produto
 */
export function generateProductPageSchemas(
  solution: Solution,
  faqItems: FAQItem[],
  breadcrumbItems: { name: string; url: string }[]
) {
  return {
    product: generateProductSchema(solution),
    service: generateServiceSchema(
      solution.name,
      solution.description,
      solution.price,
      solution.category
    ),
    faq: generateFAQSchema(faqItems),
    breadcrumb: generateBreadcrumbSchema(breadcrumbItems),
  }
}
