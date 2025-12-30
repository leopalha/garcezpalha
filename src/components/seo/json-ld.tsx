// JSON-LD Structured Data Components
// Garcez Palha - Rich Snippets & SEO
// MANUS v7.0 (29/12/2025)

import Script from 'next/script'

interface OrganizationLD {
  name: string
  url: string
  logo: string
  description?: string
  address?: {
    streetAddress: string
    addressLocality: string
    addressRegion: string
    postalCode: string
    addressCountry: string
  }
  contactPoint?: {
    telephone: string
    contactType: string
    email?: string
  }
  sameAs?: string[]
}

export function OrganizationJSONLD(props: OrganizationLD) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    name: props.name,
    url: props.url,
    logo: props.logo,
    description: props.description,
    address: props.address
      ? {
          '@type': 'PostalAddress',
          ...props.address,
        }
      : undefined,
    contactPoint: props.contactPoint
      ? {
          '@type': 'ContactPoint',
          ...props.contactPoint,
        }
      : undefined,
    sameAs: props.sameAs,
  }

  return (
    <Script
      id="organization-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

interface ServiceLD {
  name: string
  description: string
  provider: {
    name: string
    url: string
  }
  serviceType: string
  areaServed?: string
  offers?: {
    price: number
    priceCurrency: string
  }
}

export function ServiceJSONLD(props: ServiceLD) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: props.name,
    description: props.description,
    provider: {
      '@type': 'Organization',
      name: props.provider.name,
      url: props.provider.url,
    },
    serviceType: props.serviceType,
    areaServed: props.areaServed
      ? {
          '@type': 'Place',
          name: props.areaServed,
        }
      : undefined,
    offers: props.offers
      ? {
          '@type': 'Offer',
          price: props.offers.price,
          priceCurrency: props.offers.priceCurrency,
        }
      : undefined,
  }

  return (
    <Script
      id="service-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

interface BreadcrumbLD {
  items: Array<{
    name: string
    url: string
  }>
}

export function BreadcrumbJSONLD({ items }: BreadcrumbLD) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <Script
      id="breadcrumb-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

interface ArticleLD {
  headline: string
  description: string
  image: string
  datePublished: string
  dateModified?: string
  author: {
    name: string
    url?: string
  }
}

export function ArticleJSONLD(props: ArticleLD) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: props.headline,
    description: props.description,
    image: props.image,
    datePublished: props.datePublished,
    dateModified: props.dateModified || props.datePublished,
    author: {
      '@type': 'Person',
      name: props.author.name,
      url: props.author.url,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Garcez Palha',
      logo: {
        '@type': 'ImageObject',
        url: '/images/logo.png',
      },
    },
  }

  return (
    <Script
      id="article-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

interface FAQLD {
  questions: Array<{
    question: string
    answer: string
  }>
}

export function FAQJSONLD({ questions }: FAQLD) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  }

  return (
    <Script
      id="faq-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

interface ProductLD {
  name: string
  description: string
  image: string
  price: number
  priceCurrency: string
  availability: string
  rating?: {
    value: number
    count: number
  }
}

export function ProductJSONLD(props: ProductLD) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: props.name,
    description: props.description,
    image: props.image,
    offers: {
      '@type': 'Offer',
      price: props.price,
      priceCurrency: props.priceCurrency,
      availability: `https://schema.org/${props.availability}`,
    },
    aggregateRating: props.rating
      ? {
          '@type': 'AggregateRating',
          ratingValue: props.rating.value,
          reviewCount: props.rating.count,
        }
      : undefined,
  }

  return (
    <Script
      id="product-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
