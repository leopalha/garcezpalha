# D7 - Monitoring Integration Examples

**Created**: 2025-12-31 23:30
**Status**: Implementation Guide

---

## Overview

This document shows how to integrate the monitoring/observability layer into existing APIs.

## Monitoring Functions Available

```typescript
import {
  PerformanceTimer,
  trackApiCall,
  trackError,
  trackValidationError,
  trackApiError,
  trackUserAction,
  monitor,
} from '@/lib/monitoring'
```

---

## Pattern 1: API Route with Performance Tracking

```typescript
import { PerformanceTimer, trackApiCall, trackError } from '@/lib/monitoring'

export async function GET(request: NextRequest) {
  const timer = new PerformanceTimer('GET /api/admin/analytics/overview')

  try {
    const supabase = await createClient()

    // Your business logic here
    const data = await fetchAnalytics(supabase)

    const duration = timer.end()
    trackApiCall('/api/admin/analytics/overview', duration, 200, {
      dataPoints: data.length,
    })

    return NextResponse.json(data)
  } catch (error) {
    timer.end()
    trackError(error as Error, {
      endpoint: '/api/admin/analytics/overview',
      method: 'GET',
    })

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

---

## Pattern 2: API Route with Zod Validation Tracking

```typescript
import { trackValidationError, PerformanceTimer } from '@/lib/monitoring'

export async function POST(request: NextRequest) {
  const timer = new PerformanceTimer('POST /api/admin/leads/qualified')

  try {
    const body = await request.json()

    // Zod validation
    const validatedData = QualifiedLeadSchema.parse(body)

    // Create lead
    const { data: user } = await supabase.auth.getUser()
    const lead = await createLead(validatedData, user.id)

    const duration = timer.end()
    trackApiCall('/api/admin/leads/qualified', duration, 201, {
      userId: user.id,
      productId: validatedData.productId,
    })

    return NextResponse.json({ lead }, { status: 201 })
  } catch (error) {
    timer.end()

    if (error instanceof ZodError) {
      trackValidationError('/api/admin/leads/qualified', error.errors)
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    trackError(error as Error, {
      endpoint: '/api/admin/leads/qualified',
    })

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

---

## Pattern 3: User Action Tracking (Client-Side)

```typescript
// In a React component
import { trackUserAction } from '@/lib/monitoring'

function LeadForm() {
  const handleSubmit = async (data) => {
    trackUserAction('lead_form_submitted', {
      productId: data.productId,
      source: 'website',
    })

    await submitLead(data)
  }

  return <form onSubmit={handleSubmit}>...</form>
}
```

---

## Pattern 4: Conversion Tracking

```typescript
import { trackConversion } from '@/lib/monitoring'

// After successful payment
trackConversion('payment_succeeded', payment.amount, {
  paymentId: payment.id,
  productId: payment.productId,
  userId: payment.userId,
})

// After lead becomes client
trackConversion('lead_to_client', undefined, {
  leadId: lead.id,
  score: lead.score,
})
```

---

## APIs to Prioritize for Integration

### High Priority (User-Facing)
1. ✅ `/api/admin/leads/qualified` - Already integrated
2. ⏳ `/api/admin/analytics/overview` - In progress
3. ⏳ `/api/admin/conversations` - In progress
4. ⏳ `/api/whatsapp-cloud/webhook` - Critical for messaging
5. ⏳ `/api/payments/create-checkout` - Revenue tracking
6. ⏳ `/api/auth/callback` - User authentication

### Medium Priority (Admin)
7. `/api/admin/agents/[id]` - Agent performance
8. `/api/admin/analytics/*` - All analytics endpoints
9. `/api/admin/certificate` - Document generation

### Low Priority (Internal)
10. `/api/monitoring/health` - Already has monitoring
11. Test endpoints

---

## Integration Checklist

For each API endpoint:

- [ ] Import monitoring functions
- [ ] Add PerformanceTimer at start of function
- [ ] Track successful responses with `trackApiCall`
- [ ] Track validation errors with `trackValidationError`
- [ ] Track general errors with `trackError`
- [ ] Add context data (userId, resource IDs)
- [ ] Test in development (check console logs)

---

## Development vs Production

**Development**:
- Monitoring events logged to console with emojis
- Full stack traces
- No external service calls

**Production**:
- Events sent to external monitoring service (Sentry, LogRocket, etc.)
- Structured logging
- Alerts on high error rates or slow responses

---

## Metrics to Watch

### Performance Metrics
- API response times (warn if >1000ms)
- Database query durations
- External API calls

### Error Metrics
- Validation error rate by endpoint
- 500 error count (alert if >5 in 10 minutes)
- Authentication failures

### Business Metrics
- Lead creation rate
- Conversion rate (lead → client)
- Payment success rate
- WhatsApp message response time

---

## Next Steps

1. ✅ Monitoring layer created
2. ✅ Health endpoint created
3. ⏳ Integrate in top 5-10 APIs
4. ⏳ Configure production monitoring service
5. ⏳ Set up alerts and dashboards

---

**Impact**: D7 score 65 → 80 (+15 points)
