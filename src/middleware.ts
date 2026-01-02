import { type NextRequest, NextResponse } from 'next/server'
import { detectSuspiciousRequest, getClientIP, logSecurityEvent } from '@/lib/security-headers'
import { getToken } from 'next-auth/jwt'
import { trackApiCall, trackPerformance } from '@/lib/monitoring/observability'
import { tracer, getTraceContextFromHeaders, injectTraceContext } from '@/lib/tracing'

// Define protected routes that require authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/admin',
  '/portal-parceiro',
  '/cliente',
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
  const startTime = Date.now()
  const { pathname } = request.nextUrl

  // Start distributed trace
  const traceContext = getTraceContextFromHeaders(request.headers)
  const parentContext = traceContext ? tracer.parseTraceContext(traceContext) : null

  const span = tracer.startSpan(`${request.method} ${pathname}`, {
    kind: 'SERVER',
    parentSpanId: parentContext?.spanId,
    attributes: {
      'http.method': request.method,
      'http.url': request.url,
      'http.route': pathname,
      'http.user_agent': request.headers.get('user-agent') || '',
    },
  })

  // Security check: Detect suspicious requests
  if (detectSuspiciousRequest(request)) {
    const clientIP = getClientIP(request)
    logSecurityEvent('suspicious_request', {
      ip: clientIP,
      url: request.url,
      userAgent: request.headers.get('user-agent'),
      method: request.method,
    })

    tracer.addEvent(span.spanId, 'suspicious_request', { ip: clientIP })
    tracer.endSpan(span.spanId, 'ERROR')

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
    if (pathname.startsWith('/admin') && token.role !== 'admin' && token.role !== 'lawyer') {
      // Redirect non-admin users to their appropriate dashboard
      if (token.role === 'partner') {
        return NextResponse.redirect(new URL('/portal-parceiro', request.url))
      } else if (token.role === 'client') {
        return NextResponse.redirect(new URL('/cliente/dashboard', request.url))
      } else {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }

    if (pathname.startsWith('/portal-parceiro') && token.role !== 'partner') {
      // Redirect non-partner users to their appropriate dashboard
      if (token.role === 'admin' || token.role === 'lawyer') {
        return NextResponse.redirect(new URL('/admin', request.url))
      } else if (token.role === 'client') {
        return NextResponse.redirect(new URL('/cliente/dashboard', request.url))
      } else {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }

    if (pathname.startsWith('/cliente') && token.role !== 'client') {
      // Redirect non-client users to their appropriate dashboard
      if (token.role === 'admin' || token.role === 'lawyer') {
        return NextResponse.redirect(new URL('/admin', request.url))
      } else if (token.role === 'partner') {
        return NextResponse.redirect(new URL('/portal-parceiro', request.url))
      } else {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }

    if (pathname.startsWith('/dashboard') && (token.role === 'client' || token.role === 'admin' || token.role === 'lawyer')) {
      // Redirect clients and admins to their specific portals
      if (token.role === 'client') {
        return NextResponse.redirect(new URL('/cliente/dashboard', request.url))
      } else if (token.role === 'admin' || token.role === 'lawyer') {
        return NextResponse.redirect(new URL('/admin', request.url))
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
      if (token.role === 'admin' || token.role === 'lawyer') {
        return NextResponse.redirect(new URL('/admin', request.url))
      } else if (token.role === 'partner') {
        return NextResponse.redirect(new URL('/portal-parceiro', request.url))
      } else if (token.role === 'client') {
        return NextResponse.redirect(new URL('/cliente/dashboard', request.url))
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
  let response: NextResponse
  try {
    const { updateSession } = await import('@/lib/supabase/middleware')
    response = await updateSession(request)
  } catch {
    response = NextResponse.next()
  }

  // Track API performance (only for API routes)
  if (pathname.startsWith('/api/')) {
    const duration = Date.now() - startTime
    const status = response.status

    // Track API call
    trackApiCall(pathname, duration, status, {
      method: request.method,
    })

    // Track slow requests
    if (duration > 500) {
      trackPerformance(`Slow middleware: ${pathname}`, duration, {
        method: request.method,
        status,
      })
      tracer.addEvent(span.spanId, 'slow_request', { duration, threshold: 500 })
    }
  }

  // Add trace attributes and end span
  tracer.setAttributes(span.spanId, {
    'http.status_code': response.status,
    'http.duration_ms': Date.now() - startTime,
  })

  const spanStatus = response.status >= 400 ? 'ERROR' : 'OK'
  tracer.endSpan(span.spanId, spanStatus)

  // Inject trace context into response headers
  const newTraceContext = tracer.createTraceContext(span.spanId)
  if (newTraceContext) {
    injectTraceContext(response.headers, newTraceContext)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/* (all API routes - they handle their own auth)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
