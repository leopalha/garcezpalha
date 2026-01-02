# D3 - Tests & Coverage: Plan to 100/100

**Date**: 2025-12-31
**Current Status**: 105 passing / 12 failing
**Target**: 100/100 score (80%+ coverage)

---

## 📊 Current State

### Test Results
- **Total Tests**: 117 (105 ✅ passing, 12 ❌ failing)
- **Test Suites**: 63 (46 ✅ passing, 17 ❌ failing)
- **Main Issues**: Jest→Vitest migration incomplete

### Passing Test Suites (46)
✅ proposal-generator.test.ts - 32 tests
✅ score-calculator.test.ts - 40 tests
✅ agent-orchestrator.test.ts - 19 tests
✅ document.test.ts - 14 tests (CPF/CNPJ validation)

### Failing/Missing Tests (17)
❌ offline-detector.test.tsx - 12 tests (Jest API issues)
❌ Several integration tests - Missing test suites
❌ memory-cache.test.ts - Jest globals
❌ input-sanitizer.test.ts - Jest globals
❌ Others - Missing or incomplete

---

## 🎯 Strategy to 100/100

### Phase 1: Integration Tests for Validated APIs ✅
Create integration tests for the 40+ APIs we just validated with Zod:

#### Admin APIs (19 endpoints)
- [ ] `/api/admin/analytics/*` (10 endpoints)
- [ ] `/api/admin/conversations/*` (4 endpoints)
- [ ] `/api/admin/leads/*` (3 endpoints)
- [ ] `/api/admin/agents/[id]/test`
- [ ] `/api/admin/certificate`

#### Payment APIs
- [ ] `/api/stripe/checkout` - Test Zod validation + mock Stripe
- [ ] `/api/stripe/webhook` - Test webhook handling

#### User Management
- [ ] `/api/documents/upload` - Test file upload + Zod metadata

### Phase 2: Unit Tests for Critical Code
- [ ] `src/lib/validations/*` - Test all Zod schemas
- [ ] `src/lib/security/input-sanitizer.ts` - Security tests
- [ ] `src/lib/ai/qualification/*` - AI flow tests

### Phase 3: E2E Critical Paths
- [ ] User registration → Email verification → Login
- [ ] Lead qualification → Proposal → Payment
- [ ] Admin takeover → Human response

---

## 🚀 Quick Wins for Score

### Coverage Boost Strategy
1. **Test Zod Schemas** (easy, high coverage):
   - admin-schemas.ts (14 schemas)
   - payment-schemas.ts (13 schemas)
   - user-schemas.ts (14 schemas)

2. **Test API Validation** (medium, high value):
   - Mock Supabase responses
   - Test ZodError handling
   - Test 400/401/500 responses

3. **Test Security** (critical, medium effort):
   - Input sanitization
   - XSS prevention
   - SQL injection prevention

---

## 📈 Score Calculation

### D3 - Tests (Current: 68/100)
| Component | Weight | Current | Target | Plan |
|-----------|--------|---------|--------|------|
| **Unit Tests** | 40% | 30/100 | 80/100 | Schema + util tests |
| **Integration Tests** | 35% | 10/100 | 85/100 | API endpoint tests |
| **E2E Tests** | 15% | 0/100 | 60/100 | 2-3 critical paths |
| **Coverage** | 10% | 10% | 80%+ | Focus on src/lib/* |

**Projected D3**: 68 → **85/100** (+17 pontos)

---

## 🎨 Test Templates

### Zod Schema Test Template
```typescript
import { describe, it, expect } from 'vitest'
import { schemaName } from '@/lib/validations/admin-schemas'

describe('schemaName Validation', () => {
  it('should validate correct data', () => {
    const validData = { /* ... */ }
    const result = schemaName.safeParse(validData)

    expect(result.success).toBe(true)
  })

  it('should reject invalid data', () => {
    const invalidData = { /* ... */ }
    const result = schemaName.safeParse(invalidData)

    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toContain('...')
  })
})
```

### API Integration Test Template
```typescript
import { describe, it, expect, vi } from 'vitest'
import { POST } from '@/app/api/admin/leads/qualified/route'
import { createMockRequest } from '@/test/helpers'

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => ({
    auth: { getUser: vi.fn(() => ({ data: { user: { id: 'test' } } })) },
    from: vi.fn(() => ({ insert: vi.fn(), select: vi.fn() }))
  }))
}))

describe('POST /api/admin/leads/qualified', () => {
  it('should validate request with Zod', async () => {
    const req = createMockRequest({
      phone: '11999999999',
      productId: 'prod_123',
      // ... required fields
    })

    const response = await POST(req)
    const json = await response.json()

    expect(response.status).toBe(201)
    expect(json.lead).toBeDefined()
  })

  it('should return 400 for invalid data', async () => {
    const req = createMockRequest({ phone: '' }) // Missing required fields

    const response = await POST(req)
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.error).toBe('Validation failed')
    expect(json.details).toBeInstanceOf(Array)
  })
})
```

---

## ✅ Success Criteria

### To Achieve 100/100:
- [x] D1 - TypeScript: 100/100 (já atingido)
- [x] D2 - Code Quality: 96/100 (Zod completo)
- [ ] D3 - Tests: 85/100 (coverage 80%+)
- [ ] D4 - UX/UI: 90/100 (acessibilidade)
- [ ] D5 - Security: 100/100 (validação completa)
- [ ] D6 - Performance: 85/100 (SSG/ISR)
- [ ] D7 - Monitoring: 80/100 (logs básicos)

**Score Final Projetado**: **92-95/100** 🎯

**Para 100/100**, precisamos:
- D3: 85 → 95 (+10)
- D4: 90 → 100 (+10)
- D6: 85 → 95 (+10)
- D7: 80 → 90 (+10)

---

## 🚀 Next Actions

1. Create test helper utilities
2. Write Zod schema unit tests (quick wins)
3. Create API integration test suite
4. Run coverage report
5. Fill gaps until 80%+ coverage
6. Move to D4 (Accessibility)
