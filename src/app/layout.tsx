import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Playfair_Display } from 'next/font/google'
import { Cormorant_Garamond } from 'next/font/google'
import { JetBrains_Mono } from 'next/font/google'
import { ThemeProvider } from '@/lib/theme/theme-provider'
import { TRPCProvider } from '@/lib/trpc/provider'
import { AuthProvider } from '@/lib/auth/provider'
import { ReferralTracker } from '@/components/referral-tracker'
import { AnalyticsProvider } from '@/components/analytics/analytics-provider'
import { BetaBanner } from '@/components/beta-banner'
import { PWAProvider } from '@/components/pwa-provider'
import { CookieConsentBanner } from '@/components/cookies/CookieConsentBanner'
import { Analytics as VercelAnalytics } from '@vercel/analytics/react'
import { Suspense } from 'react'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-cormorant',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
})

export const metadata: Metadata = {
  title: {
    default: 'Garcez Palha - Tradição desde 1661 | Excelência desde sempre',
    template: '%s | Garcez Palha',
  },
  description: '364 anos de tradição e nobreza. Descendentes de Viscondes, Barões e Governadores Coloniais. Especialistas em consultoria jurídica, perícia documental, avaliação de imóveis e perícia médica trabalhista no Rio de Janeiro.',
  keywords: [
    'advocacia',
    'perícia',
    'direito imobiliário',
    'perícia documental',
    'avaliação de imóveis',
    'perícia médica',
    'advogado Rio de Janeiro',
    'consultoria jurídica',
    'Garcez Palha',
    'tradição jurídica',
    'nobreza portuguesa',
    'visconde de bucelas',
    'barão de combarjua',
  ],
  authors: [{ name: 'Garcez Palha Consultoria Jurídica & Pericial' }],
  creator: 'Garcez Palha',
  publisher: 'Garcez Palha',
  metadataBase: new URL('https://garcezpalha.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://garcezpalha.com',
    siteName: 'Garcez Palha',
    title: 'Garcez Palha - Tradição desde 1661 | Excelência desde sempre',
    description: '364 anos de tradição nobiliárquica e serviço em três continentes. Descendentes de Viscondes, Barões e Governadores Coloniais oferecendo expertise jurídica contemporânea.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Garcez Palha - Consultoria Jurídica & Pericial | Tradição desde 1661',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Garcez Palha - Tradição desde 1661 | Excelência desde sempre',
    description: '364 anos de tradição, nobreza e excelência. Descendentes de Viscondes e Barões.',
    images: ['/images/og-image.jpg'],
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
  verification: {
    google: 'google-site-verification-code', // Replace with actual code
  },
  category: 'Legal Services',
  icons: {
    icon: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  appleWebApp: {
    capable: true,
    title: 'Garcez Palha',
    statusBarStyle: 'black-translucent',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} ${cormorant.variable} ${jetbrains.variable} font-sans antialiased`}
      >
        <PWAProvider>
          <AuthProvider>
            <TRPCProvider>
              <BetaBanner />
              <ThemeProvider>
                <Suspense fallback={null}>
                  <AnalyticsProvider>
                    <ReferralTracker />
                    {children}
                  </AnalyticsProvider>
                </Suspense>
              </ThemeProvider>
            </TRPCProvider>
          </AuthProvider>
        </PWAProvider>
        <VercelAnalytics />
        <CookieConsentBanner />
      </body>
    </html>
  )
}
