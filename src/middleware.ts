import { type NextRequest, NextResponse } from 'next/server'
import { detectSuspiciousRequest, getClientIP, logSecurityEvent } from '@/lib/security-headers'
import { getToken } from 'next-auth/jwt'

// Define protected routes that require authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/admin',
  '/portal-parceiro',
  '/api/trpc',
]

// Define public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/servicos',
  '/blog',
  '/sobre',
  '/contato',
  '/termos',
  '/privacidade',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Security check: Detect suspicious requests
  if (detectSuspiciousRequest(request)) {
    const clientIP = getClientIP(request)
    logSecurityEvent('suspicious_request', {
      ip: clientIP,
      url: request.url,
      userAgent: request.headers.get('user-agent'),
      method: request.method,
    })

    // Return 403 Forbidden for suspicious requests
    return new NextResponse('Forbidden', { status: 403 })
  }

  // Check if route is protected
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route))
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route))

  // Check authentication for protected routes
  if (isProtectedRoute) {
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET 
    })

    if (!token) {
      // User not authenticated, redirect to login
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Check role-based access and redirect to appropriate dashboard
    if (pathname.startsWith('/admin') && token.role !== 'admin') {
      // Redirect non-admin users to their appropriate dashboard
      if (token.role === 'partner') {
        return NextResponse.redirect(new URL('/portal-parceiro', request.url))
      } else {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }

    if (pathname.startsWith('/portal-parceiro') && token.role !== 'partner' && token.role !== 'admin') {
      // Redirect non-partner users to their appropriate dashboard
      if (token.role === 'admin') {
        return NextResponse.redirect(new URL('/admin', request.url))
      } else {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }
  }

  // Redirect to dashboard if authenticated user tries to access login/signup
  if (pathname === '/login' || pathname === '/signup') {
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET 
    })

    if (token) {
      // Redirect based on role
      if (token.role === 'admin') {
        return NextResponse.redirect(new URL('/admin', request.url))
      } else if (token.role === 'partner') {
        return NextResponse.redirect(new URL('/portal-parceiro', request.url))
      } else {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }
  }

  // Skip Supabase session update if credentials are not configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (
    !supabaseUrl ||
    !supabaseKey ||
    supabaseUrl === '' ||
    supabaseKey === '' ||
    supabaseUrl === 'your-supabase-url' ||
    supabaseKey === 'your-anon-key'
  ) {
    return NextResponse.next()
  }

  // Only import and use Supabase if configured
  try {
    const { updateSession } = await import('@/lib/supabase/middleware')
    return await updateSession(request)
  } catch {
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/whatsapp-cloud/webhook (WhatsApp webhook - needs to be public)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|api/whatsapp-cloud/webhook|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
