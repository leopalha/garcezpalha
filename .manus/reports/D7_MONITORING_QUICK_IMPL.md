# D7 - Monitoring: Quick Implementation Plan

**Target**: 65 → 80/100 (+15 pontos)
**Time**: 4-5h
**Priority**: Medium (pode atingir 95/100 sem isso, mas 100/100 precisa)

---

## 🎯 Quick Wins para D7

### 1. Error Tracking (2h) - +8 pontos
**Implementação**:
```typescript
// src/lib/monitoring/error-tracker.ts
export function trackError(error: Error, context?: any) {
  if (process.env.NODE_ENV === 'production') {
    // Log to external service (Sentry, LogRocket, etc)
    console.error('[ERROR]', {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
    })
  }
}

// Usage in API routes:
catch (error) {
  trackError(error, { endpoint: '/api/admin/leads', userId })
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
}
```

### 2. Performance Monitoring (1h) - +4 pontos
**Web Vitals Tracking**:
```typescript
// src/app/layout.tsx
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
```

### 3. API Monitoring (1h) - +3 pontos
**Response Time Tracking**:
```typescript
// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const start = Date.now()

  const response = NextResponse.next()

  // Log API performance
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const duration = Date.now() - start
    console.log('[API]', {
      path: request.nextUrl.pathname,
      method: request.method,
      duration,
      status: response.status,
    })

    // Alert if slow
    if (duration > 1000) {
      console.warn('[SLOW API]', request.nextUrl.pathname, `${duration}ms`)
    }
  }

  return response
}
```

---

## 📊 Implementação Rápida (30min)

### Arquivo: `src/lib/monitoring/index.ts`
```typescript
/**
 * Simple Monitoring Layer
 * Tracks errors, performance, and API health
 */

interface MonitoringEvent {
  type: 'error' | 'performance' | 'api' | 'user_action'
  message: string
  data?: any
  timestamp: string
}

class Monitor {
  private events: MonitoringEvent[] = []
  private maxEvents = 100

  track(event: Omit<MonitoringEvent, 'timestamp'>) {
    const fullEvent: MonitoringEvent = {
      ...event,
      timestamp: new Date().toISOString(),
    }

    this.events.push(fullEvent)

    // Keep only recent events
    if (this.events.length > this.maxEvents) {
      this.events.shift()
    }

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${event.type.toUpperCase()}]`, event.message, event.data)
    }

    // In production, send to external service
    if (process.env.NODE_ENV === 'production') {
      this.sendToExternalService(fullEvent)
    }
  }

  private sendToExternalService(event: MonitoringEvent) {
    // Placeholder for Sentry, LogRocket, etc.
    // fetch('/api/monitoring/log', {
    //   method: 'POST',
    //   body: JSON.stringify(event),
    // })
  }

  getRecentEvents(type?: MonitoringEvent['type']) {
    if (type) {
      return this.events.filter(e => e.type === type)
    }
    return this.events
  }
}

export const monitor = new Monitor()

// Helper functions
export function trackError(error: Error, context?: any) {
  monitor.track({
    type: 'error',
    message: error.message,
    data: {
      stack: error.stack,
      ...context,
    },
  })
}

export function trackPerformance(metric: string, value: number, context?: any) {
  monitor.track({
    type: 'performance',
    message: metric,
    data: {
      value,
      unit: 'ms',
      ...context,
    },
  })
}

export function trackApiCall(endpoint: string, duration: number, status: number) {
  monitor.track({
    type: 'api',
    message: endpoint,
    data: {
      duration,
      status,
    },
  })
}

export function trackUserAction(action: string, data?: any) {
  monitor.track({
    type: 'user_action',
    message: action,
    data,
  })
}
```

---

## 🚀 Integração em APIs (5min cada)

### Template para adicionar em rotas:
```typescript
import { trackError, trackApiCall } from '@/lib/monitoring'

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    // ... lógica da API

    const duration = Date.now() - startTime
    trackApiCall('/api/admin/leads/qualified', duration, 201)

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    trackError(error as Error, {
      endpoint: '/api/admin/leads/qualified',
      userId: user?.id,
    })

    const duration = Date.now() - startTime
    trackApiCall('/api/admin/leads/qualified', duration, 500)

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

---

## ✅ Checklist Rápido

### Básico (30min) - +10 pontos
- [ ] Criar `src/lib/monitoring/index.ts`
- [ ] Adicionar trackError em 5 APIs principais
- [ ] Adicionar console.log estruturado

### Intermediário (2h) - +5 pontos
- [ ] Integrar @vercel/analytics
- [ ] Integrar @vercel/speed-insights
- [ ] Criar middleware para API timing

### Avançado (2h) - Opcional
- [ ] Integrar Sentry
- [ ] Dashboard de métricas
- [ ] Alertas automáticos

---

## 📈 Impacto no Score

| Componente | Weight | Implementação | Pontos |
|-----------|--------|---------------|--------|
| Error Tracking | 40% | trackError() | +8 |
| Performance | 30% | Web Vitals | +6 |
| API Monitoring | 20% | Middleware | +4 |
| Alerting | 10% | Console logs | +2 |

**Total D7**: 65 → **80/100** ✅

---

## 🎯 Resultado Final

Com D7 básico implementado:
- D1: 100/100 ✅
- D2: 96/100 ✅
- D3: 85/100 (com tests)
- D4: 90/100 (com aria-labels)
- D5: 95/100 ✅
- D6: 85/100 (com SSG/ISR)
- D7: 80/100 (com monitoring)

**Score Final**: **90-95/100** 🎯

Para **100/100**, apenas refinar D3, D4, D6, D7 para 95-100 cada.
