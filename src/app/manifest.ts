import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Garcez Palha - Advocacia e Perícia',
    short_name: 'Garcez Palha',
    description: 'Escritório de advocacia e perícia com 364 anos de tradição jurídica',
    start_url: '/',
    display: 'standalone',
    background_color: '#F8FAFC',
    theme_color: '#1E3A8A',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/logo-garcez-palha.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/icons/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
    categories: ['business', 'legal', 'productivity'],
    lang: 'pt-BR',
    dir: 'ltr',
  }
}
