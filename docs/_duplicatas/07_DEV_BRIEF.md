# 07 - DEV BRIEF

Guia rapido para desenvolvedores iniciando no projeto.

---

## 1. SETUP INICIAL

### 1.1 Pre-requisitos

- Node.js 20+
- npm ou pnpm
- Git
- Conta Supabase (para DB)
- VS Code (recomendado)

### 1.2 Clone e Instalacao

```bash
# Clone
git clone https://github.com/leopalha/garcezpalha.git
cd garcezpalha

# Instalar dependencias
npm install

# Copiar env de exemplo
cp .env.example .env.local
```

### 1.3 Variaveis de Ambiente Minimas

```env
# .env.local

# Supabase (obrigatorio)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# Auth (obrigatorio)
NEXTAUTH_SECRET=gerar-com-openssl-rand-base64-32
NEXTAUTH_URL=http://localhost:3000

# AI (opcional - modo demo funciona sem)
OPENAI_API_KEY=sk-or-v1-xxx
```

### 1.4 Rodar Projeto

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Type check
npm run typecheck
```

---

## 2. ESTRUTURA DO PROJETO

### 2.1 Pastas Principais

```
src/
├── app/              # Next.js App Router
│   ├── (marketing)/  # Site publico
│   ├── (dashboard)/  # Dashboard cliente
│   ├── (admin)/      # Painel admin
│   └── api/          # API Routes
├── components/       # Componentes React
│   ├── ui/           # shadcn/ui
│   └── dashboard/    # Componentes dashboard
├── lib/              # Logica de negocio
│   ├── ai/           # Agentes IA
│   ├── supabase/     # Database
│   └── trpc/         # API type-safe
└── types/            # TypeScript types
```

### 2.2 Convencoes

- **Server Components**: Padrao (async/await)
- **Client Components**: Adicionar `'use client'`
- **API Routes**: `src/app/api/*/route.ts`
- **Path Alias**: `@/` = `src/`

---

## 3. PRINCIPAIS TECNOLOGIAS

| Tecnologia | Uso | Docs |
|------------|-----|------|
| Next.js 14 | Framework | nextjs.org |
| TypeScript | Tipagem | typescriptlang.org |
| Tailwind | Estilizacao | tailwindcss.com |
| shadcn/ui | Componentes | ui.shadcn.com |
| Supabase | Database | supabase.com |
| tRPC | API type-safe | trpc.io |
| OpenRouter | AI | openrouter.ai |

---

## 4. FLUXOS PRINCIPAIS

### 4.1 Chat com Agentes IA

```
Usuario -> /api/chat -> AgentOrchestrator -> Agente -> OpenRouter -> Resposta
```

**Arquivos**:
- `src/app/api/chat/route.ts`
- `src/lib/ai/agents/agent-orchestrator.ts`
- `src/lib/ai/agents/*-agent.ts`

### 4.2 Autenticacao

```
Login -> NextAuth -> Supabase -> Session JWT
```

**Arquivos**:
- `src/lib/auth.ts`
- `src/middleware.ts`

### 4.3 Checkout

```
Selecao -> Formulario -> Stripe/MercadoPago -> Webhook -> DB
```

**Arquivos**:
- `src/app/checkout/page.tsx`
- `src/app/api/stripe/*/route.ts`

---

## 5. COMANDOS UTEIS

```bash
# Desenvolvimento
npm run dev              # Servidor local
npm run build            # Build producao
npm run typecheck        # Verificar tipos

# Database
# Migrations sao manuais no Supabase SQL Editor
# Arquivos em: supabase/migrations/

# Analise
npm run analyze          # Bundle size
```

---

## 6. CREDENCIAIS DE TESTE

### 6.1 Login Demo

```
Email: admin@garcezpalha.com
Senha: demo123

Email: parceiro@garcezpalha.com
Senha: demo123
```

### 6.2 Pagamento Teste (Stripe)

```
Cartao: 4242 4242 4242 4242
Validade: Qualquer futura
CVV: Qualquer 3 digitos
```

---

## 7. PADROES DE CODIGO

### 7.1 Componentes

```tsx
// Boa pratica
export function MyComponent({ title, children }: Props) {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </div>
  )
}
```

### 7.2 API Routes

```tsx
// src/app/api/exemplo/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // Logica
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erro' }, { status: 500 })
  }
}
```

### 7.3 tRPC Router

```tsx
// src/lib/trpc/routers/exemplo.ts
export const exemploRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.supabase.from('tabela').select('*')
  }),

  create: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.supabase.from('tabela').insert(input)
    }),
})
```

---

## 8. DEBUGGING

### 8.1 Logs

```tsx
// Console logs aparecem no terminal (server) ou DevTools (client)
console.log('[Contexto]', dados)
```

### 8.2 Erros Comuns

| Erro | Solucao |
|------|---------|
| NEXT_PUBLIC_* undefined | Reiniciar dev server |
| Supabase connection | Verificar credenciais |
| TypeScript error | `npm run typecheck` |
| Build fail | Verificar imports |

### 8.3 Verificar Agente IA

```typescript
// Testar roteamento de agente
import { getOrchestrator } from '@/lib/ai/agents'

const orchestrator = getOrchestrator()
const result = orchestrator.suggestAgent('Preciso comprar um imovel')
console.log(result) // { role: 'real-estate', confidence: 0.8 }
```

---

## 9. DEPLOY

### 9.1 Vercel (Producao)

1. Conectar repo GitHub ao Vercel
2. Configurar env vars
3. Deploy automatico em push

### 9.2 Checklist Pre-deploy

- [ ] `npm run build` local sem erros
- [ ] Todas env vars configuradas
- [ ] Migrations rodadas no Supabase
- [ ] Webhooks configurados

---

## 10. RECURSOS

### 10.1 Documentacao Interna

- `docs/00_ACTIVATION_PROMPT.md` - Contexto geral
- `docs/03_PRD.md` - Requisitos
- `docs/05_TECHNICAL_ARCHITECTURE.md` - Arquitetura
- `docs/16_ARQUITETURA_AGENTES_IA.md` - Sistema de IA

### 10.2 Links Externos

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Supabase Docs](https://supabase.com/docs)
- [tRPC Docs](https://trpc.io/docs)
