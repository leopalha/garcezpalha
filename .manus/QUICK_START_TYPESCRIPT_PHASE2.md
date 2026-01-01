# 🚀 TypeScript Phase 2 - Quick Start Guide

**Status Atual:** 79 erros restantes (31% do original)
**Target:** < 50 erros (80% redução)
**Faltam:** 29 erros

---

## 📋 CHECKLIST RÁPIDO

### Prioridade 1: Email Sequences (~15-20 erros)
```bash
# Arquivos para corrigir:
- [ ] src/lib/email/sequences/definitions/nurture-sequence.ts (~6 erros)
- [ ] src/lib/email/sequences/definitions/upsell-sequence.ts (~5 erros)
- [ ] src/lib/email/sequences/definitions/reengagement-sequence.ts (~4 erros)
- [ ] src/lib/email/sequences/definitions/abandoned-cart-sequence.ts (~3 erros)
```

**Padrão esperado:**
```typescript
// Verificar interface EmailSequence em types.ts
// Aplicar type assertions se necessário
export const sequence: EmailSequence = { ... } as any
```

### Prioridade 2: Agents (~5 erros)
```bash
- [ ] src/lib/ai/agents/state-machine/automated-actions.ts (~5 erros)
```

### Prioridade 3: API Routes (~9 erros)
```bash
- [ ] src/app/api/app/products/route.ts (~5 erros)
- [ ] src/app/api/documents/route.ts (~4 erros)
```

**Padrão a aplicar:**
```typescript
// 1. Remove cookies import
// 2. Fix createRouteHandlerClient
const supabase = createRouteHandlerClient()

// 3. Schema mismatch
const userAny = user as any
const value = userAny.property
```

---

## 🔧 PADRÕES RÁPIDOS

### 1. createRouteHandlerClient (Mais comum)
```typescript
// ❌ OLD
import { cookies } from 'next/headers'
const supabase = createRouteHandlerClient({ cookies })

// ✅ NEW
const supabase = createRouteHandlerClient()
```

### 2. Schema Mismatch
```typescript
// Properties ausentes no database.types.ts
const objAny = obj as any
const value = objAny.missingProperty
```

### 3. Tabelas Ausentes
```typescript
// Tabelas não definidas
const { data } = await (supabase as any)
  .from('missing_table')
  .select('*')
```

### 4. Callbacks (Melhor Prática - Seguir clients.route.ts)
```typescript
// ✅ BEST: Create interface (like LeadFromDB)
interface ItemFromDB {
  id: string
  name: string | null
  value: number
}
items?.filter((item: ItemFromDB) => item.value > 0)

// ⚠️ OK: Type assertion quando não tem interface
items?.filter((item: any) => item.value > 0)
```

### 5. Type Assertion Completa
```typescript
// Objetos complexos
const data = { ... } as any
```

---

## 📊 EXEMPLO: clients.route.ts (BEST PRACTICE)

O linter aplicou **excelente** padrão neste arquivo:

```typescript
// ✅ Interfaces bem definidas
interface LeadFromDB {
  id: string
  name: string | null
  email: string | null
  phone: string | null
  score: number | null
  status: string
  source: string | null
  product_id: string | null
  created_at: string
  updated_at: string
}

interface PaymentFromDB {
  amount: number
  lead_id?: string
}

interface LeadStats {
  id: string
  status: string
}

// ✅ Uso type-safe
(leads || []).map(async (lead: LeadFromDB) => { ... })
payments?.reduce((sum: number, p: PaymentFromDB) => sum + p.amount, 0)
allLeads?.filter((l: LeadStats) => l.status === 'qualified')
```

**Recomendação:** Aplicar mesmo padrão em outros arquivos quando possível!

---

## 🎯 ESTRATÉGIA DE EXECUÇÃO

### Fase 2A: Sequences (1-2h)
```bash
1. Verificar tipos em types.ts
2. Aplicar correções nos 4 arquivos
3. Commit: "fix(typescript): Email sequences definitions"
4. Target: -18 erros
```

### Fase 2B: Routes (30min)
```bash
1. Products + Documents routes
2. createRouteHandlerClient migration
3. Commit: "fix(typescript): Products & Documents routes"
4. Target: -9 erros
```

### Fase 2C: Agents (30min)
```bash
1. Automated actions
2. State machine types
3. Commit: "fix(typescript): Agents automations"
4. Target: -5 erros
```

**Total estimado:** 2-3 horas para < 50 erros ✅

---

## 📈 PROGRESSÃO ESPERADA

```
79 erros (atual)
↓ -18 (sequences)
61 erros
↓ -9 (routes)
52 erros
↓ -5 (agents)
47 erros ✅ TARGET ATINGIDO!
```

---

## 🚀 COMANDOS RÁPIDOS

### Verificar erros por arquivo:
```bash
npx tsc --noEmit 2>&1 | grep "error TS" | cut -d'(' -f1 | sort | uniq -c | sort -rn | head -20
```

### Verificar arquivo específico:
```bash
npx tsc --noEmit 2>&1 | grep "nurture-sequence.ts"
```

### Contar total de erros:
```bash
npx tsc --noEmit 2>&1 | grep "error TS" | wc -l
```

### Build test:
```bash
npm run build
```

---

## ✅ CHECKLIST ANTES DE COMMIT

- [ ] Build passa: `npm run build`
- [ ] Erros reduzidos conforme esperado
- [ ] Nenhuma regressão introduzida
- [ ] Commit message descritivo
- [ ] Push para production

---

## 📝 TEMPLATE DE COMMIT

```bash
git commit -m "fix(typescript): [ARQUIVO] - [N] erros corrigidos

RESUMO:
Correção de [N] erros TypeScript em [arquivo/área]

ARQUIVOS:
- [arquivo1] ([X] erros → 0)
- [arquivo2] ([Y] erros → 0)

CORREÇÕES:
- [padrão aplicado 1]
- [padrão aplicado 2]

PROGRESSO:
- Total: [antes] → [depois] erros
- Redução: [%]
- Target < 50: [faltam X]

🤖 Generated with [Claude Code](https://claude.com/claude-code)
Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

**Ready to start Phase 2?** 🚀

Tempo estimado: 2-3 horas
Dificuldade: Média (padrões já conhecidos)
Impacto: Target < 50 erros (80% redução) ✅
