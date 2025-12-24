import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Security headers configuration
export const securityHeaders = {
  // Prevent XSS attacks
  'X-XSS-Protection': '1; mode=block',

  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',

  // Prevent clickjacking
  'X-Frame-Options': 'DENY',

  // Control referrer information
  'Referrer-Policy': 'strict-origin-when-cross-origin',

  // Content Security Policy
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://www.googletagmanager.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https: blob:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://api.stripe.com https://api.openai.com https://*.supabase.co wss://*.supabase.co",
    "frame-src 'self' https://js.stripe.com https://hooks.stripe.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join('; '),

  // Permissions Policy (formerly Feature Policy)
  'Permissions-Policy': [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'interest-cohort=()',
    'payment=(self "https://js.stripe.com")',
  ].join(', '),

  // Strict Transport Security (HSTS)
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',

  // Cross-Origin policies
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'require-corp',
}

// Apply security headers to response
export function applySecurityHeaders(response: NextResponse): NextResponse {
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  return response
}

// Middleware to add security headers
export function securityHeadersMiddleware(request: NextRequest): NextResponse | null {
  // Skip for API routes and static files
  const pathname = request.nextUrl.pathname

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return null
  }

  return null // Let Next.js handle the response, we'll add headers in next.config.js
}

// CORS configuration
export const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
}

// Apply CORS headers for API routes
export function applyCorsHeaders(response: NextResponse): NextResponse {
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  return response
}

// Validate request origin
export function validateOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin')
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://garcezpalha.com',
    'https://www.garcezpalha.com',
  ]

  if (!origin) {
    // Allow requests without origin (same-origin requests)
    return true
  }

  return allowedOrigins.includes(origin)
}

// Check for suspicious patterns in request
export function detectSuspiciousRequest(request: NextRequest): boolean {
  const url = request.url
  const userAgent = request.headers.get('user-agent') || ''

  // Check for SQL injection patterns
  const sqlInjectionPatterns = [
    /(\%27)|(\')|(\-\-)|(\%23)|(#)/i,
    /((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))/i,
    /\w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i,
    /((\%27)|(\'))union/i,
  ]

  // Check for XSS patterns
  const xssPatterns = [
    /((\%3C)|<)((\%2F)|\/)*[a-z0-9\%]+((\%3E)|>)/i,
    /((\%3C)|<)((\%69)|i|(\%49))((\%6D)|m|(\%4D))((\%67)|g|(\%47))[^\n]+((\%3E)|>)/i,
    /((\%3C)|<)[^\n]+((\%3E)|>)/i,
  ]

  // Check URL
  for (const pattern of [...sqlInjectionPatterns, ...xssPatterns]) {
    if (pattern.test(url)) {
      return true
    }
  }

  // Check for malicious user agents
  const maliciousUserAgents = [
    'sqlmap',
    'nikto',
    'nmap',
    'masscan',
    'zgrab',
  ]

  for (const agent of maliciousUserAgents) {
    if (userAgent.toLowerCase().includes(agent)) {
      return true
    }
  }

  return false
}

// Get client IP address
export function getClientIP(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }

  const realIP = request.headers.get('x-real-ip')
  if (realIP) {
    return realIP
  }

  return 'unknown'
}

// Log security event
export function logSecurityEvent(
  type: 'suspicious_request' | 'rate_limit' | 'auth_failure' | 'cors_violation',
  details: Record<string, unknown>
): void {
  const event = {
    timestamp: new Date().toISOString(),
    type,
    ...details,
  }

  // In production, this would send to a security monitoring service
  console.warn('Security Event:', JSON.stringify(event))
}
