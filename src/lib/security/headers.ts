/**
 * Security Headers Configuration
 *
 * Headers for protecting against common web vulnerabilities
 */

/**
 * Security headers for API responses
 */
export const securityHeaders = {
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',

  // Prevent clickjacking
  'X-Frame-Options': 'DENY',

  // Enable XSS filter in older browsers
  'X-XSS-Protection': '1; mode=block',

  // Control referrer information
  'Referrer-Policy': 'strict-origin-when-cross-origin',

  // Prevent DNS prefetching
  'X-DNS-Prefetch-Control': 'off',

  // Remove server identification
  'X-Powered-By': '',
}

/**
 * Content Security Policy for web pages
 */
export const cspHeader = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://js.stripe.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://api.openai.com https://openrouter.ai https://api.mercadopago.com https://api.resend.com wss:",
    "frame-src 'self' https://js.stripe.com https://www.mercadopago.com.br",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join('; '),
}

/**
 * CORS headers for API endpoints
 */
export function corsHeaders(
  origin: string | null,
  allowedOrigins: string[] = []
): Record<string, string> {
  const isAllowed =
    !origin ||
    allowedOrigins.length === 0 ||
    allowedOrigins.includes(origin) ||
    allowedOrigins.includes('*')

  if (!isAllowed) {
    return {}
  }

  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Max-Age': '86400',
    'Access-Control-Allow-Credentials': 'true',
  }
}

/**
 * Apply security headers to a Response
 */
export function applySecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers)

  for (const [key, value] of Object.entries(securityHeaders)) {
    if (value) {
      headers.set(key, value)
    } else {
      headers.delete(key)
    }
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

/**
 * Cache control headers
 */
export const cacheHeaders = {
  // No caching for API responses with sensitive data
  noCache: {
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    Pragma: 'no-cache',
    Expires: '0',
  },

  // Short cache for frequently changing data (1 minute)
  short: {
    'Cache-Control': 'public, max-age=60, s-maxage=60',
  },

  // Medium cache for semi-static data (5 minutes)
  medium: {
    'Cache-Control': 'public, max-age=300, s-maxage=300',
  },

  // Long cache for static data (1 hour)
  long: {
    'Cache-Control': 'public, max-age=3600, s-maxage=3600',
  },

  // Immutable cache for versioned assets (1 year)
  immutable: {
    'Cache-Control': 'public, max-age=31536000, immutable',
  },
}

/**
 * Create webhook validation headers
 */
export function webhookHeaders(timestamp: string, signature: string): Record<string, string> {
  return {
    'X-Webhook-Timestamp': timestamp,
    'X-Webhook-Signature': signature,
  }
}
