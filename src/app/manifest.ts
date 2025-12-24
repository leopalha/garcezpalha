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
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    categories: ['business', 'legal', 'productivity'],
    lang: 'pt-BR',
    dir: 'ltr',
  }
}
