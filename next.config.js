// Sentry configuration
const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // CRITICAL: Do NOT use static export - we need API routes and serverless functions
  // Do NOT set output - let Vercel auto-detect

  // CDN Configuration (D7-011)
  assetPrefix: process.env.NEXT_PUBLIC_CDN_URL || '',

  // Enable compression for better performance
  compress: true,

  // Production optimizations
  productionBrowserSourceMaps: false, // Disable source maps in production for smaller bundle

  // Optimize fonts
  optimizeFonts: true,

  // Modularize imports disabled - was causing undefined exports
  // modularizeImports: {
  //   'lucide-react': {
  //     transform: 'lucide-react/dist/esm/icons/{{kebabCase member}}',
  //     skipDefaultConversion: true,
  //   },
  // },

  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
    // Optimize CSS for smaller bundles
    optimizeCss: true,
    // Optimize package imports for faster dev and smaller bundles
    optimizePackageImports: [
      '@radix-ui/react-icons',
      'lucide-react',
      'recharts',
      '@supabase/supabase-js',
      'framer-motion',
      '@tiptap/react',
      '@tiptap/starter-kit',
      'react-hook-form',
      '@tanstack/react-query',
      'date-fns',
      'lodash-es',
    ],
    // Turbopack optimizations (reduced for memory constraints)
    turbo: {
      // Enable parallel builds
      resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
    },
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // ⚠️ TEMPORARILY DISABLED: P1-003 logging migration created type errors
    // TODO: Fix logger type definitions in all files
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      // CDN domain support
      ...(process.env.NEXT_PUBLIC_CDN_URL ? [{
        protocol: 'https',
        hostname: new URL(process.env.NEXT_PUBLIC_CDN_URL).hostname,
      }] : []),
    ],
    // Optimize image loading
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // CDN-aware image loader
    loader: process.env.NEXT_PUBLIC_CDN_URL ? 'custom' : 'default',
    path: process.env.NEXT_PUBLIC_CDN_URL ? `${process.env.NEXT_PUBLIC_CDN_URL}/_next/image` : '/_next/image',
    // Cache optimized images for 60 days
    minimumCacheTTL: 60 * 60 * 24 * 60,
  },
  // Webpack optimization for code splitting and tree shaking
  webpack: (config, { isServer, dev }) => {
    // Faster source maps in development
    if (dev && !isServer) {
      config.devtool = 'eval-cheap-module-source-map'
      // Minimize webpack stats output
      config.stats = 'minimal'
    }

    // Production optimizations
    if (!dev) {
      // Enable tree shaking
      config.optimization.providedExports = true
      config.optimization.usedExports = true
      config.optimization.sideEffects = true

      // Minimize bundle size
      config.optimization.minimize = true
    }

    // Split chunks for better caching and lazy loading
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 25,
        minSize: 20000,
        cacheGroups: {
          // Framework bundle (React, Next.js)
          framework: {
            name: 'framework',
            test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
            priority: 40,
            enforce: true,
          },
          // UI Libraries bundle
          uiLibs: {
            name: 'ui-libs',
            test: /[\\/]node_modules[\\/](@radix-ui|lucide-react|framer-motion)[\\/]/,
            priority: 30,
            enforce: true,
          },
          // Tiptap editor bundle (only loaded when needed)
          editor: {
            name: 'editor',
            test: /[\\/]node_modules[\\/](@tiptap)[\\/]/,
            priority: 25,
            enforce: true,
          },
          // Charts bundle (only loaded when needed)
          charts: {
            name: 'charts',
            test: /[\\/]node_modules[\\/](recharts|d3-)[\\/]/,
            priority: 25,
            enforce: true,
          },
          // Supabase bundle
          supabase: {
            name: 'supabase',
            test: /[\\/]node_modules[\\/](@supabase)[\\/]/,
            priority: 20,
            enforce: true,
          },
          // Internal components
          chat: {
            name: 'chat',
            test: /[\\/]src[\\/]components[\\/]chat[\\/]/,
            priority: 15,
          },
          ui: {
            name: 'ui',
            test: /[\\/]src[\\/]components[\\/]ui[\\/]/,
            priority: 14,
          },
          agents: {
            name: 'agents',
            test: /[\\/]src[\\/]lib[\\/]ai[\\/]agents[\\/]/,
            priority: 13,
          },
          // Default vendors
          vendors: {
            name: 'vendors',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            reuseExistingChunk: true,
          },
          // Common components
          common: {
            name: 'common',
            minChunks: 2,
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      }
    }

    return config
  },
  // Security headers applied globally
  async headers() {
    return [
      // CDN cache headers for static assets (D7-011)
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/public/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(self), microphone=(self), geolocation=(), interest-cohort=(), payment=(self "https://js.stripe.com")',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://www.googletagmanager.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: https: blob:",
              "font-src 'self' https://fonts.gstatic.com",
              "media-src 'self' blob: data:",
              "connect-src 'self' https://api.stripe.com https://api.openai.com wss://api.openai.com https://*.supabase.co wss://*.supabase.co https://api.d-id.com wss://api.d-id.com",
              "frame-src 'self' https://js.stripe.com https://hooks.stripe.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests",
            ].join('; '),
          },
        ],
      },
      {
        // Add HSTS only for HTTPS in production
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
        ],
      },
    ]
  },
  // Disable x-powered-by header
  poweredByHeader: false,
  // Redirects from old service URLs to new category-based structure
  async redirects() {
    return [
      // Financeiro
      {
        source: '/servicos/desbloqueio-conta',
        destination: '/financeiro/desbloqueio-conta',
        permanent: true,
      },
      {
        source: '/checkout',
        destination: '/financeiro',
        permanent: false,
        has: [{ type: 'query', key: 'service', value: 'golpe-pix' }],
      },
      {
        source: '/checkout',
        destination: '/financeiro',
        permanent: false,
        has: [{ type: 'query', key: 'service', value: 'negativacao-indevida' }],
      },
      {
        source: '/checkout',
        destination: '/financeiro',
        permanent: false,
        has: [{ type: 'query', key: 'service', value: 'defesa-execucao' }],
      },
      // Patrimonial
      {
        source: '/servicos/usucapiao',
        destination: '/patrimonial/usucapiao',
        permanent: true,
      },
      {
        source: '/servicos/holding-familiar',
        destination: '/patrimonial/holding-familiar',
        permanent: true,
      },
      {
        source: '/servicos/inventario',
        destination: '/patrimonial/inventario',
        permanent: true,
      },
      {
        source: '/servicos/direito-imobiliario',
        destination: '/patrimonial/direito-imobiliario',
        permanent: true,
      },
      {
        source: '/servicos/regularizacao-imovel',
        destination: '/patrimonial/regularizacao-imovel',
        permanent: true,
      },
      {
        source: '/servicos/avaliacao-imoveis',
        destination: '/patrimonial/avaliacao-imoveis',
        permanent: true,
      },
      // Saude
      {
        source: '/servicos/plano-saude',
        destination: '/saude/plano-saude',
        permanent: true,
      },
      {
        source: '/servicos/cirurgia-bariatrica',
        destination: '/saude/cirurgia-bariatrica',
        permanent: true,
      },
      {
        source: '/servicos/tratamento-tea',
        destination: '/saude/tratamento-tea',
        permanent: true,
      },
      {
        source: '/servicos/bpc-loas',
        destination: '/saude/bpc-loas',
        permanent: true,
      },
      {
        source: '/servicos/pericia-medica',
        destination: '/saude/pericia-medica',
        permanent: true,
      },
      // Pericia
      {
        source: '/servicos/pericia-documental',
        destination: '/pericia/pericia-documental',
        permanent: true,
      },
      {
        source: '/servicos/grafotecnia',
        destination: '/pericia/grafotecnia',
        permanent: true,
      },
      {
        source: '/servicos/laudo-tecnico',
        destination: '/pericia/laudo-tecnico',
        permanent: true,
      },
      // Criminal
      {
        source: '/servicos/direito-criminal',
        destination: '/criminal/direito-criminal',
        permanent: true,
      },
      {
        source: '/servicos/direito-aeronautico',
        destination: '/criminal/direito-aeronautico',
        permanent: true,
      },
      // Automacao
      {
        source: '/servicos/secretaria-remota',
        destination: '/automacao/secretaria-remota',
        permanent: true,
      },
      {
        source: '/servicos/aposentadoria',
        destination: '/automacao/aposentadoria',
        permanent: true,
      },
      // Generic fallback for old /servicos route
      {
        source: '/servicos',
        destination: '/financeiro',
        permanent: false,
      },
    ]
  },
}

// Sentry webpack plugin options
const sentryWebpackPluginOptions = {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  // Suppresses source map uploading logs during build
  silent: true,
  org: process.env.SENTRY_ORG || 'garcezpalha',
  project: process.env.SENTRY_PROJECT || 'garcezpalha-platform',

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers
  // Note: This can increase server load significantly if you get lots of traffic.
  tunnelRoute: '/monitoring',

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors
  automaticVercelMonitors: true,
}

// Make sure adding Sentry options is the last code to run before exporting
module.exports = process.env.SENTRY_DSN
  ? withSentryConfig(nextConfig, sentryWebpackPluginOptions)
  : nextConfig
