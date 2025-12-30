# Guia de Clientes Supabase

## Resumo

O projeto usa **3 clientes Supabase diferentes** para contextos específicos. Esta separação é **intencional e necessária** para segurança e funcionalidade.

---

## 📋 Visão Geral

| Cliente | Arquivo | Uso | Chave | Ambiente |
|---------|---------|-----|-------|----------|
| **Browser Client** | `src/lib/supabase/client.ts` | Componentes Client | `ANON_KEY` | Cliente (browser) |
| **Server Client** | `src/lib/supabase/server.ts` | Server Components/API | `ANON_KEY` | Servidor (com cookies) |
| **Admin Client** | `src/lib/supabase/admin.ts` | Operações privilegiadas | `SERVICE_ROLE_KEY` | Servidor (admin) |

---

## 🌐 Browser Client (`client.ts`)

### Quando Usar
- Componentes **client-side** (`'use client'`)
- Interações do usuário no navegador
- Queries que respeitam RLS (Row Level Security)

### Características
- Usa `NEXT_PUBLIC_SUPABASE_ANON_KEY` (pública)
- Respeita políticas RLS
- Auth baseado em session do usuário
- Persistência automática de sessão no browser

### Exemplo de Uso
```typescript
'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export function MyClientComponent() {
  const [data, setData] = useState([])
  const supabase = createClient()

  useEffect(() => {
    async function loadData() {
      // Query respeitará RLS automaticamente
      const { data: leads } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', userId)  // Apenas dados do usuário

      setData(leads || [])
    }
    loadData()
  }, [])

  return <div>{/* ... */}</div>
}
```

### ⚠️ Limitações
- **NÃO** pode acessar dados de outros usuários (RLS)
- **NÃO** pode fazer operações admin
- **NÃO** pode bypassar políticas de segurança

---

## 🖥️ Server Client (`server.ts`)

### Quando Usar
- **Server Components** do Next.js
- **API Routes** que precisam de auth do usuário
- Operações que respeitam RLS **no servidor**

### Características
- Usa `NEXT_PUBLIC_SUPABASE_ANON_KEY` (pública)
- Acessa **cookies de sessão** via Next.js
- Respeita políticas RLS
- Executa no servidor (mais seguro que client)

### Exemplo de Uso
```typescript
// app/dashboard/page.tsx (Server Component)

import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()

  // Obtém usuário autenticado via cookies
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Query respeitará RLS baseado na sessão do cookie
  const { data: processes } = await supabase
    .from('processes')
    .select('*')
    .eq('client_id', user.id)

  return <div>{/* ... */}</div>
}
```

### Exemplo em API Route
```typescript
// app/api/processes/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // RLS aplicado automaticamente
  const { data } = await supabase
    .from('processes')
    .select('*')
    .eq('lawyer_id', user.id)

  return NextResponse.json({ processes: data })
}
```

### ⚠️ Limitações
- **NÃO** pode acessar dados de outros usuários (RLS)
- **NÃO** pode fazer operações admin
- Requer sessão válida do usuário

---

## 🔐 Admin Client (`admin.ts`)

### Quando Usar
- Operações **privilegiadas** que bypassam RLS
- **Webhooks** externos (Stripe, MercadoPago)
- **Cron jobs** automatizados
- Migração de dados
- Criação de recursos admin

### Características
- Usa `SUPABASE_SERVICE_ROLE_KEY` (secreta)
- **Bypassa** todas políticas RLS
- Acesso total ao banco
- **NUNCA** expor no client-side

### Exemplo de Uso
```typescript
// app/api/stripe/webhook/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  // Webhook do Stripe - não tem sessão de usuário
  const supabase = getSupabaseAdmin()

  // Pode acessar/modificar qualquer dado (bypassa RLS)
  const { error } = await supabase
    .from('checkout_orders')
    .update({ payment_status: 'paid' })
    .eq('stripe_session_id', sessionId)

  if (error) {
    console.error('Failed to update order:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
```

### Exemplo: Cron Job
```typescript
// app/api/cron/send-follow-ups/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  // Verifica cron secret
  if (request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = getSupabaseAdmin()

  // Acessa todos os leads que precisam follow-up
  const { data: leads } = await supabase
    .from('leads')
    .select('*')
    .is('last_followup_at', null)
    .lt('created_at', thirtyDaysAgo)

  // Processa follow-ups...

  return NextResponse.json({ success: true, processed: leads.length })
}
```

### ⚠️ Segurança Crítica
- **NUNCA** use no client-side
- **NUNCA** exponha SERVICE_ROLE_KEY
- **SEMPRE** valide autenticação antes
- Use apenas para:
  - Webhooks verificados
  - Cron jobs protegidos
  - Operações admin validadas

---

## 🎯 Guia de Decisão Rápido

```
┌─ Estou escrevendo código client-side ('use client')?
│
├─ SIM → Use createClient() de 'supabase/client'
│
└─ NÃO → Continua...
    │
    ┌─ Preciso de dados do usuário autenticado?
    │
    ├─ SIM → Use createClient() de 'supabase/server'
    │         (Server Component ou API Route com auth)
    │
    └─ NÃO → Continua...
        │
        ┌─ É um webhook, cron job, ou operação admin?
        │
        ├─ SIM → Use getSupabaseAdmin() de 'supabase/admin'
        │         ⚠️ VALIDE AUTENTICAÇÃO EXTERNA PRIMEIRO!
        │
        └─ NÃO → Reavalie: provavelmente precisa de auth
```

---

## 📚 Exemplos Práticos

### ❌ ERRADO: Admin Client no Cliente
```typescript
'use client'  // ❌ NUNCA faça isso!

import { getSupabaseAdmin } from '@/lib/supabase/admin'

export function BadComponent() {
  const supabase = getSupabaseAdmin()  // ❌ Expõe SERVICE_ROLE_KEY!
  // ...
}
```

### ✅ CORRETO: Client no Cliente
```typescript
'use client'  // ✅ Correto

import { createClient } from '@/lib/supabase/client'

export function GoodComponent() {
  const supabase = createClient()  // ✅ Usa ANON_KEY pública
  // ...
}
```

### ❌ ERRADO: Client no Webhook
```typescript
// app/api/stripe/webhook/route.ts

import { createClient } from '@/lib/supabase/client'  // ❌ Não tem cookies!

export async function POST(request: NextRequest) {
  const supabase = createClient()  // ❌ Vai falhar (sem sessão)
  // ...
}
```

### ✅ CORRETO: Admin no Webhook
```typescript
// app/api/stripe/webhook/route.ts

import { getSupabaseAdmin } from '@/lib/supabase/admin'  // ✅ Correto

export async function POST(request: NextRequest) {
  // Valida webhook do Stripe primeiro
  const signature = request.headers.get('stripe-signature')
  // ... verificação ...

  const supabase = getSupabaseAdmin()  // ✅ Acesso total (validado)
  // ...
}
```

---

## 🔍 Verificação de Uso Correto

### Checklist de Segurança

**Antes de usar Admin Client (`admin.ts`), confirme:**
- [ ] Código roda **apenas no servidor** (não client-side)
- [ ] **Validei autenticação** (webhook signature, cron secret, etc.)
- [ ] **Realmente preciso** bypassar RLS?
- [ ] **Não posso** usar Server Client com auth?

**Antes de usar Server Client (`server.ts`), confirme:**
- [ ] Código roda em **Server Component** ou **API Route**
- [ ] Preciso de **dados do usuário autenticado**
- [ ] RLS está **configurado corretamente** nas tabelas

**Antes de usar Browser Client (`client.ts`), confirme:**
- [ ] Componente tem `'use client'`
- [ ] Interação é **do lado do usuário**
- [ ] RLS protege os dados sensíveis

---

## 📝 Resumo

| Contexto | Cliente Correto |
|----------|----------------|
| Componente `'use client'` | `client.ts` (ANON_KEY) |
| Server Component | `server.ts` (ANON_KEY + cookies) |
| API Route com auth | `server.ts` (ANON_KEY + cookies) |
| Webhook externo | `admin.ts` (SERVICE_ROLE) + validação |
| Cron job | `admin.ts` (SERVICE_ROLE) + secret |
| Operação admin | `admin.ts` (SERVICE_ROLE) + validação |

---

## ⚠️ Regras de Ouro

1. **NUNCA** use Admin Client no client-side
2. **SEMPRE** valide autenticação antes de usar Admin Client
3. **PREFIRA** Server Client quando possível (mais seguro que Admin)
4. **CONFIE** nas políticas RLS - deixe-as fazer o trabalho
5. **DOCUMENTE** quando usar Admin Client (justifique no código)

---

**Dúvida?** Pergunte: "Preciso bypassar RLS?"
- **NÃO** → Use `client.ts` ou `server.ts`
- **SIM** → Valide autenticação + use `admin.ts`
