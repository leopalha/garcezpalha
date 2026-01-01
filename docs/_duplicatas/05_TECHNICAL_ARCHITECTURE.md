# 05 - ARQUITETURA TECNICA

Documentacao completa da arquitetura tecnica da plataforma Garcez Palha.

---

## 1. VISAO GERAL

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
├─────────────┬─────────────┬─────────────┬─────────────┬─────────┤
│  Marketing  │   Admin     │   Partner   │   Client    │ Chatbot │
│   Website   │  Dashboard  │   Portal    │  Dashboard  │  Widget │
└──────┬──────┴──────┬──────┴──────┬──────┴──────┬──────┴────┬────┘
       │             │             │             │           │
       └─────────────┴─────────────┴─────────────┴───────────┘
                                   │
                            ┌──────▼──────┐
                            │   Next.js   │
                            │  App Router │
                            └──────┬──────┘
                                   │
              ┌────────────────────┼────────────────────┐
              │                    │                    │
       ┌──────▼──────┐      ┌──────▼──────┐     ┌──────▼──────┐
       │  NextAuth   │      │    tRPC     │     │     API     │
       │   (Auth)    │      │   Routers   │     │   Routes    │
       └──────┬──────┘      └──────┬──────┘     └──────┬──────┘
              │                    │                    │
              └────────────────────┼────────────────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              │                    │                    │
       ┌──────▼──────┐      ┌──────▼──────┐     ┌──────▼──────┐
       │  Supabase   │      │  OpenRouter │     │   Stripe/   │
       │ (PostgreSQL)│      │   (GPT-4)   │     │  MercadoPago│
       └─────────────┘      └─────────────┘     └─────────────┘
```

---

## 2. STACK TECNOLOGICA

### 2.1 Frontend

```json
{
  "framework": "Next.js 14.2.x (App Router)",
  "language": "TypeScript 5.x",
  "styling": "Tailwind CSS 3.4.x",
  "components": "shadcn/ui",
  "animations": "Framer Motion 11.x",
  "forms": "React Hook Form + Zod",
  "state": "Zustand 4.x",
  "data-fetching": "@tanstack/react-query 5.x"
}
```

### 2.2 Backend

```json
{
  "api": "Next.js API Routes + tRPC 10.x",
  "database": "Supabase (PostgreSQL 15)",
  "auth": "NextAuth.js 4.x",
  "storage": "Supabase Storage",
  "cron": "Vercel Cron Jobs"
}
```

### 2.3 IA & Automacao

```json
{
  "provider": "OpenRouter",
  "model": "openai/gpt-4-turbo-preview",
  "sdk": "openai 4.x",
  "agentes": "5 especializados + 1 general"
}
```

### 2.4 Integracoes

```json
{
  "pagamentos": ["Stripe", "MercadoPago"],
  "mensagens": ["WhatsApp Cloud API", "Telegram Bot"],
  "email": "Resend",
  "assinatura": "ClickSign",
  "calendario": "Google Calendar API"
}
```

---

## 3. ESTRUTURA DE PASTAS

```
garcezpalha/
├── docs/                      # Documentacao
├── public/                    # Assets estaticos
├── supabase/
│   └── migrations/            # SQL migrations
├── src/
│   ├── app/
│   │   ├── (marketing)/       # Site publico
│   │   ├── (dashboard)/       # Dashboard cliente
│   │   ├── (admin)/           # Painel admin
│   │   ├── (portal-parceiro)/ # Portal parceiros
│   │   ├── (auth)/            # Autenticacao
│   │   ├── checkout/          # Pagamento
│   │   └── api/               # API Routes
│   │       ├── chat/
│   │       ├── cron/
│   │       ├── stripe/
│   │       ├── mercadopago/
│   │       ├── telegram/
│   │       ├── whatsapp-cloud/
│   │       ├── clicksign/
│   │       ├── resend/
│   │       ├── analytics/
│   │       └── trpc/
│   ├── components/
│   │   ├── ui/                # shadcn/ui
│   │   ├── dashboard/
│   │   └── checkout/
│   ├── lib/
│   │   ├── ai/
│   │   │   ├── agents/        # 5 agentes especializados
│   │   │   └── prompts/       # Prompts OAB-compliant
│   │   ├── supabase/
│   │   ├── trpc/
│   │   ├── email/
│   │   ├── telegram/
│   │   ├── whatsapp/
│   │   ├── signature/
│   │   ├── calendar/
│   │   ├── analytics/
│   │   └── notifications/
│   └── types/
├── .env.local
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── vercel.json
```

---

## 4. BANCO DE DADOS

### 4.1 Tabelas Principais (20)

**Core**:
- `profiles` - Usuarios do sistema
- `leads` - Leads capturados
- `clients` - Clientes convertidos
- `appointments` - Agendamentos
- `conversations` - Conversas chat
- `messages` - Mensagens individuais

**Financeiro**:
- `invoices` - Faturas
- `referrals` - Indicacoes
- `commissions` - Comissoes

**Automacao**:
- `contracts` - Contratos assinados
- `process_alerts` - Alertas de processos
- `process_documents` - Documentos de processos
- `notification_logs` - Log de notificacoes
- `email_sequences` - Campanhas de email
- `sequence_emails` - Emails das campanhas
- `user_email_sequences` - Usuarios em campanhas

**Telegram**:
- `telegram_conversations`
- `telegram_messages`

**Config**:
- `pricing_tiers` - Precos de referencia

### 4.2 RLS Policies

```sql
-- Exemplo: leads
CREATE POLICY "Admin full access" ON leads
  FOR ALL TO authenticated
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Lawyers view only" ON leads
  FOR SELECT TO authenticated
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'lawyer')
  );
```

---

## 5. SISTEMA DE AGENTES IA

### 5.1 Arquitetura

```
                    +------------------+
                    |  AgentOrchestrator|
                    +--------+---------+
                             |
        +------+------+------+------+------+
        |      |      |      |      |      |
        v      v      v      v      v      v
      Real   Foren  Valu   Med    Crim   General
      Estate  sics  ation  ical    inal   Agent
```

### 5.2 Agentes

| Agente | Arquivo | Keywords |
|--------|---------|----------|
| Real Estate | `real-estate-agent.ts` | imovel, compra, venda, locacao |
| Forensics | `document-forensics-agent.ts` | assinatura, falsificacao, pericia |
| Valuation | `property-valuation-agent.ts` | avaliacao, valor, preco |
| Medical | `medical-expertise-agent.ts` | medico, acidente, inss |
| Criminal | `criminal-law-agent.ts` | crime, prisao, habeas corpus |
| General | Fallback | - |

### 5.3 Fluxo de Roteamento

```typescript
// AgentOrchestrator.selectAgent()
1. Recebe mensagem do usuario
2. Analisa keywords em cada agente
3. Conta matches e calcula confidence
4. Seleciona agente com maior score
5. Fallback para General se score = 0
```

---

## 6. API ROUTES

### 6.1 Endpoints Principais

| Rota | Metodo | Descricao |
|------|--------|-----------|
| `/api/chat` | POST | Chat com agentes IA |
| `/api/health` | GET | Health check |
| `/api/trpc/*` | ALL | tRPC router |
| `/api/stripe/webhook` | POST | Webhook Stripe |
| `/api/mercadopago/webhook` | POST | Webhook MercadoPago |
| `/api/telegram/webhook` | POST | Webhook Telegram |
| `/api/whatsapp-cloud/webhook` | ALL | Webhook WhatsApp |
| `/api/clicksign/webhook` | POST | Webhook ClickSign |
| `/api/resend/webhook` | POST | Webhook Resend |
| `/api/cron/deadline-reminders` | GET | Cron lembretes |
| `/api/cron/monitor-emails` | GET | Cron monitor emails |

### 6.2 tRPC Routers

```typescript
// src/lib/trpc/routers/
- analytics.ts  // Metricas CAC, LTV
- appointments.ts // Agendamentos CRUD
- chat.ts       // Chat com agentes
- clients.ts    // Clientes CRUD
- leads.ts      // Leads CRUD
- referrals.ts  // Indicacoes CRUD
```

---

## 7. AUTENTICACAO

### 7.1 NextAuth Config

```typescript
// src/lib/auth.ts
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" }
      },
      authorize: async (credentials) => {
        // Valida contra Supabase
      }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) token.role = user.role
      return token
    },
    session: async ({ session, token }) => {
      session.user.role = token.role
      return session
    }
  }
}
```

### 7.2 Middleware

```typescript
// src/middleware.ts
export function middleware(request: NextRequest) {
  // Verifica sessao
  // Verifica role para rota
  // Redireciona se nao autorizado
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/portal-parceiro/:path*']
}
```

---

## 8. CRON JOBS

Configurados em `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/deadline-reminders",
      "schedule": "0 9 * * *"
    },
    {
      "path": "/api/cron/monitor-emails",
      "schedule": "0 8 * * *"
    }
  ]
}
```

---

## 9. DEPLOY

### 9.1 Vercel

- Build: `npm run build`
- Runtime: Node.js 20
- Region: GRU (Sao Paulo)
- Serverless Functions

### 9.2 Variaveis de Ambiente

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Auth
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# AI
OPENAI_API_KEY=sk-or-v1-...

# Pagamentos
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
MERCADOPAGO_ACCESS_TOKEN=

# Mensagens
TELEGRAM_BOT_TOKEN=
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=

# Email
RESEND_API_KEY=

# Assinatura
CLICKSIGN_API_KEY=

# Cron
CRON_SECRET=
```

---

## 10. SEGURANCA

### 10.1 Medidas Implementadas

- HTTPS obrigatorio (Vercel)
- Rate limiting: 20 msg/min chat
- Input validation: Zod schemas
- RLS: Row Level Security no Supabase
- Webhook signatures: Verificacao
- CORS: Configurado
- CSP: Content Security Policy headers

### 10.2 LGPD

- Politica de privacidade publicada
- Consentimento em formularios
- Direito a exclusao de dados
- Criptografia em repouso (Supabase)
