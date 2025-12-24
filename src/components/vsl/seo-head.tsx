'use client'

import Head from 'next/head'

interface SEOHeadProps {
  title: string
  description: string
  keywords?: string[]
  canonicalUrl?: string
  ogImage?: string
  productName?: string
  price?: number
  category?: string
}

export function SEOHead({
  title,
  description,
  keywords = [],
  canonicalUrl,
  ogImage = '/og-image.jpg',
  productName,
  price,
  category,
}: SEOHeadProps) {
  const siteName = 'Garcez Palha Advocacia'
  const fullTitle = `${title} | ${siteName}`

  // Schema.org JSON-LD for Legal Service
  const legalServiceSchema = {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    name: productName || title,
    description: description,
    provider: {
      '@type': 'Organization',
      name: siteName,
      url: canonicalUrl || 'https://garcezpalha.com.br',
      logo: 'https://garcezpalha.com.br/logo.png',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'BR',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+55-11-0000-0000',
        contactType: 'Customer Service',
        areaServed: 'BR',
        availableLanguage: 'Portuguese',
      },
    },
    ...(price && {
      offers: {
        '@type': 'Offer',
        price: (price / 100).toFixed(2),
        priceCurrency: 'BRL',
        availability: 'https://schema.org/InStock',
      },
    }),
  }

  // Schema.org JSON-LD for Service
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: category || 'Legal Services',
    name: productName || title,
    description: description,
    provider: {
      '@type': 'Attorney',
      name: siteName,
    },
  }

  // Schema.org JSON-LD for Organization
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    name: siteName,
    url: 'https://garcezpalha.com.br',
    logo: 'https://garcezpalha.com.br/logo.png',
    description: 'Escritório de advocacia especializado em direito civil e empresarial',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'BR',
    },
    sameAs: [
      'https://www.linkedin.com/company/garcezpalha',
      'https://www.instagram.com/garcezpalha',
    ],
  }

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      <meta name="author" content={siteName} />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="UTF-8" />

      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph Meta Tags */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="pt_BR" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#3b82f6" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(legalServiceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      {/* Breadcrumb Schema */}
      {category && productName && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Home',
                  item: 'https://garcezpalha.com.br',
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: category,
                  item: `https://garcezpalha.com.br/${category}`,
                },
                {
                  '@type': 'ListItem',
                  position: 3,
                  name: productName,
                  item: canonicalUrl,
                },
              ],
            }),
          }}
        />
      )}
    </Head>
  )
}
