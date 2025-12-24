export function OrganizationJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    name: 'Garcez Palha - Advocacia e Perícia',
    alternateName: 'Garcez Palha',
    url: 'https://garcezpalha.com',
    logo: 'https://garcezpalha.com/images/logo.png',
    description:
      'Escritório de advocacia e perícia com 364 anos de história familiar. Especialistas em direito imobiliário, perícia documental, avaliação de imóveis e perícia médica trabalhista.',
    foundingDate: '1661',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Av. das Américas 13685',
      addressLocality: 'Rio de Janeiro',
      addressRegion: 'RJ',
      postalCode: '22790-701',
      addressCountry: 'BR',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+55-21-99535-4010',
      contactType: 'customer service',
      availableLanguage: ['Portuguese'],
      areaServed: 'BR',
    },
    sameAs: [
      'https://www.linkedin.com/company/garcezpalha',
      'https://www.instagram.com/garcezpalha',
      'https://www.facebook.com/garcezpalha',
    ],
    priceRange: '$$',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Serviços Jurídicos',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Direito Imobiliário',
            description: 'Consultoria e assessoria em questões imobiliárias',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Perícia Documental',
            description: 'Análise técnica de documentos e assinaturas',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Avaliação de Imóveis',
            description: 'Laudos técnicos de avaliação imobiliária',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Perícia Médica',
            description: 'Perícia médica para questões trabalhistas',
          },
        },
      ],
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export function WebsiteJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Garcez Palha',
    url: 'https://garcezpalha.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://garcezpalha.com/busca?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
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
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export function FAQJsonLd({ faqs }: { faqs: { question: string; answer: string }[] }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export function LocalBusinessJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Attorney',
    name: 'Garcez Palha - Advocacia e Perícia',
    image: 'https://garcezpalha.com/images/office.jpg',
    '@id': 'https://garcezpalha.com',
    url: 'https://garcezpalha.com',
    telephone: '+55-21-99535-4010',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Av. das Américas 13685, Barra da Tijuca',
      addressLocality: 'Rio de Janeiro',
      addressRegion: 'RJ',
      postalCode: '22790-701',
      addressCountry: 'BR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -23.0017,
      longitude: -43.3642,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '127',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
