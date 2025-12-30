# 17 - STACK TECNOLÓGICA COMPLETA
## Garcez Palha - Inteligência Jurídica

---

## 1. VISÃO GERAL

### 1.1 Filosofia Tecnológica

```
PRINCÍPIOS:
├── Cloud-first (sem servidores próprios)
├── API-first (integrações via API)
├── Low-code quando possível
├── Custos variáveis (escala sob demanda)
└── Ferramentas consolidadas (evitar "reinventar a roda")

OBJETIVOS:
├── Operação 24/7 sem intervenção
├── Escalar de 10 para 1.000 clientes sem reescrever
├── Custo operacional < 10% do faturamento
└── Time to market < 1 semana para novas features
```

### 1.2 Arquitetura Geral

```
┌─────────────────────────────────────────────────────────────────────┐
│                      ARQUITETURA DO SISTEMA                         │
└─────────────────────────────────────────────────────────────────────┘

                    ┌─────────────────────┐
                    │     USUÁRIOS        │
                    │  (Clientes/Admin)   │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
        ┌─────▼─────┐    ┌─────▼─────┐    ┌─────▼─────┐
        │   Site    │    │ WhatsApp  │    │   Admin   │
        │  Next.js  │    │ Evolution │    │  Panel    │
        └─────┬─────┘    └─────┬─────┘    └─────┬─────┘
              │                │                │
              └────────────────┼────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │     VERCEL          │
                    │   (Hosting/CDN)     │
                    └──────────┬──────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
  ┌─────▼─────┐         ┌──────▼──────┐        ┌─────▼─────┐
  │  Supabase │         │    n8n      │        │  Anthropic│
  │  (DB/Auth)│         │ (Automação) │        │   (IA)    │
  └───────────┘         └─────────────┘        └───────────┘
        │                      │                      │
        └──────────────────────┼──────────────────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
        ┌─────▼─────┐    ┌─────▼─────┐    ┌─────▼─────┐
        │ Mercado   │    │  ZapSign  │    │  Judit.io │
        │  Pago     │    │ (Assina.) │    │(Processos)│
        └───────────┘    └───────────┘    └───────────┘
```

---

## 2. FRONTEND

### 2.1 Next.js 14

```
FRAMEWORK: Next.js 14 (App Router)

MOTIVOS:
├── React com SSR/SSG
├── API Routes integradas
├── Edge Functions
├── Otimização automática
└── Deploy fácil na Vercel

ESTRUTURA:
src/
├── app/                    # App Router
│   ├── (public)/          # Rotas públicas
│   │   ├── page.tsx       # Landing page
│   │   ├── produtos/      # Páginas de produto
│   │   └── blog/          # Conteúdo SEO
│   ├── (auth)/            # Rotas autenticadas
│   │   └── admin/         # Painel admin
│   └── api/               # API Routes
│       ├── chat/          # Chatbot
│       ├── webhooks/      # Integrações
│       └── trpc/          # tRPC endpoints
├── components/            # Componentes React
├── lib/                   # Lógica de negócio
└── styles/               # CSS/Tailwind
```

### 2.2 UI/Styling

```
TAILWIND CSS:
├── Utility-first
├── JIT compiler
├── Design tokens customizados
└── Dark mode suportado

SHADCN/UI:
├── Componentes acessíveis
├── Customizáveis
├── Copy-paste (sem dependência)
└── Radix UI primitives

LUCIDE ICONS:
├── Ícones consistentes
├── Tree-shakeable
└── SVG otimizado

FRAMER MOTION:
├── Animações fluidas
├── Gestures
└── Layout animations
```

### 2.3 Dependências Frontend

```json
{
  "dependencies": {
    "next": "14.x",
    "react": "18.x",
    "react-dom": "18.x",
    "@tanstack/react-query": "5.x",
    "@trpc/client": "10.x",
    "@trpc/react-query": "10.x",
    "tailwindcss": "3.x",
    "@radix-ui/react-dialog": "1.x",
    "@radix-ui/react-dropdown-menu": "2.x",
    "framer-motion": "10.x",
    "lucide-react": "0.x",
    "react-hook-form": "7.x",
    "zod": "3.x",
    "date-fns": "2.x"
  }
}
```

### 2.4 PWA (Progressive Web App)

```
PWA COMPLETO:

CAPACIDADES:
├── Instalável (desktop + mobile)
├── Funciona offline
├── Cache estratégico
├── Push notifications
├── Background sync
└── Atualizações automáticas

ARQUITETURA:
src/
├── app/
│   └── manifest.ts              # Manifest PWA (Next.js 14)
├── components/
│   └── pwa/
│       └── service-worker-register.tsx  # Registro + UI updates
public/
├── sw.js                        # Service Worker
├── offline.html                 # Página offline
└── brasao-garcez-palha.png     # Ícones PWA

ESTRATÉGIA DE CACHE: Network First, Cache Fallback
├── APIs: Sempre da rede (dados frescos)
├── Assets: Cache primeiro (performance)
├── Páginas: Rede primeiro, cache fallback
└── Offline: Página customizada

SERVICE WORKER FEATURES:
├── install: Pre-cache assets, skipWaiting
├── activate: Clean old caches, claim clients
├── fetch: Network-first strategy
├── sync: Background sync de formulários
├── push: Push notifications
└── notificationclick: Abrir URLs de notificações

MANIFEST PWA:
{
  name: 'Garcez Palha - Advocacia e Perícia',
  short_name: 'Garcez Palha',
  display: 'standalone',          # Fullscreen sem browser UI
  theme_color: '#1E3A8A',        # Azul Garcez Palha
  icons: [192x192, 512x512, SVG]
}

BENEFÍCIOS:
├── Instalação com 1 clique (sem App Store)
├── Carregamento instantâneo (cache)
├── Funciona offline (consultas)
├── Notificações de processos
├── Menos uso de dados móveis
├── Experiência nativa
└── Lighthouse PWA Score: 100/100

CUSTOS:
└── R$ 0/mês (infraestrutura client-side)
```

---

## 3. BACKEND

### 3.1 API Routes + tRPC

```
NEXT.JS API ROUTES:
├── Serverless functions
├── Edge runtime disponível
├── TypeScript nativo
└── Zero config

tRPC v11:
├── Type-safe API end-to-end
├── Sem código duplicado
├── Inferência automática de tipos
├── React Query integrado
├── SuperJSON transformer
└── 3 níveis de autorização

ESTRUTURA tRPC REAL:
src/lib/trpc/
├── init.ts              # Configuração tRPC + contexto Supabase
├── client.ts            # Cliente React (createTRPCReact)
├── provider.tsx         # TRPCProvider com React Query
└── routers/
    ├── index.ts         # AppRouter principal (combina todos)
    ├── leads.ts         # CRUD leads + qualificação
    ├── clients.ts       # CRUD clientes
    ├── appointments.ts  # CRUD agendamentos
    ├── chat.ts          # Chatbot integration
    ├── analytics.ts     # Analytics e métricas
    ├── referrals.ts     # Indicações de parceiros
    ├── invoices.ts      # Faturas e pagamentos
    ├── products.ts      # Produtos/Pacotes
    └── users.ts         # Usuários e permissões

src/app/api/trpc/[trpc]/
└── route.ts             # HTTP handler (GET/POST)

AUTORIZAÇÃO (3 níveis):
├── publicProcedure      # Sem autenticação (ex: criar lead)
├── protectedProcedure   # Requer usuário autenticado
└── adminProcedure       # Requer role admin
```

### 3.2 Supabase

```
SUPABASE (PostgreSQL + mais):

DATABASE:
├── PostgreSQL gerenciado
├── Row Level Security (RLS)
├── Realtime subscriptions
├── Full-text search
└── Backups automáticos

AUTH:
├── Email/senha
├── OAuth (Google)
├── Magic links
├── JWT tokens
└── Session management

STORAGE:
├── Arquivos até 5GB
├── CDN integrado
├── Políticas de acesso
└── Transformações de imagem

EDGE FUNCTIONS:
├── Deno runtime
├── Webhooks
├── Cron jobs
└── Background tasks

TABELAS PRINCIPAIS:
├── leads
├── qualified_leads
├── orders
├── payments
├── contracts
├── processes
├── process_movements
├── generated_documents
├── messages
└── users
```

### 3.3 Configuração Supabase

```typescript
// src/lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Server-side with service role
export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
```

---

## 4. INTELIGÊNCIA ARTIFICIAL

### 4.1 Anthropic Claude

```
MODELOS UTILIZADOS:

Claude 3.5 Sonnet (Principal):
├── Produção de documentos
├── Análise jurídica
├── Argumentação complexa
├── Custo: $3/1M input, $15/1M output
└── Contexto: 200k tokens

Claude 3 Haiku (Auxiliar):
├── Classificação de leads
├── Respostas simples
├── Validação de dados
├── Custo: $0.25/1M input, $1.25/1M output
└── Mais rápido

INTEGRAÇÃO:
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const response = await anthropic.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 4000,
  messages: [{ role: 'user', content: prompt }]
});
```

### 4.2 OpenRouter (Fallback)

```
OPENROUTER:
├── Acesso a múltiplos modelos
├── Fallback automático
├── Preços competitivos
└── API compatível OpenAI

MODELOS DISPONÍVEIS:
├── openai/gpt-4-turbo
├── anthropic/claude-3-opus
├── google/gemini-pro
└── meta-llama/llama-3-70b

USO:
import OpenAI from 'openai';

const openrouter = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1'
});
```

### 4.3 Custos Estimados IA

```
ESTIMATIVA MENSAL (30 contratos):

Triagem/Qualificação (Haiku):
├── 600 conversas × 2k tokens = 1.2M tokens
├── Custo: ~R$ 2

Produção (Sonnet):
├── 30 docs × 5k tokens = 150k tokens
├── Custo: ~R$ 15

Argumentação (Sonnet):
├── 30 docs × 3k tokens = 90k tokens
├── Custo: ~R$ 10

TOTAL: ~R$ 27/mês (R$ 0,90/contrato)
```

---

## 5. AUTOMAÇÃO

### 5.1 n8n

```
N8N (Self-hosted ou Cloud):

VANTAGENS:
├── Visual workflow builder
├── 400+ integrações
├── Self-hosted (controle)
├── Webhooks
└── Cron jobs

WORKFLOWS PRINCIPAIS:
├── Lead → Qualificação → Proposta
├── Pagamento → Contrato → Onboarding
├── Documento → Revisão → Protocolo
├── Movimentação → Classificação → Notificação
└── Relatórios automáticos

HOSTING:
├── Opção 1: n8n.cloud (~$20/mês)
├── Opção 2: Railway (~$5/mês)
└── Opção 3: VPS própria (~$10/mês)
```

### 5.2 Exemplo de Workflow

```json
{
  "name": "Novo Lead WhatsApp",
  "nodes": [
    {
      "type": "webhook",
      "name": "WhatsApp Webhook"
    },
    {
      "type": "function",
      "name": "Extrair dados"
    },
    {
      "type": "http",
      "name": "Chamar IA Triagem"
    },
    {
      "type": "switch",
      "name": "Verificar qualificação"
    },
    {
      "type": "supabase",
      "name": "Salvar lead"
    },
    {
      "type": "http",
      "name": "Enviar resposta WhatsApp"
    }
  ]
}
```

---

## 6. COMUNICAÇÃO

### 6.1 WhatsApp - Múltiplas Opções (3 Integrações)

O sistema implementa **3 formas diferentes** de integração com WhatsApp:

```
ARQUITETURA MULTI-CANAL:

┌──────────────────────┐
│   CLIENTES           │
│   (WhatsApp)         │
└──────────┬───────────┘
           │
    ┌──────┴──────┬───────────────┬───────────────┐
    │             │               │               │
┌───▼──────┐  ┌──▼─────────┐  ┌──▼────────────┐  │
│ Business │  │  Evolution │  │    Baileys    │  │
│   API    │  │    API     │  │   (Direct)    │  │
│ (Meta)   │  │ (Railway)  │  │  (Railway)    │  │
└───┬──────┘  └──┬─────────┘  └──┬────────────┘  │
    │            │               │               │
    └────────────┴───────────────┴───────────────┘
                 │
         ┌───────▼────────┐
         │   Next.js API  │
         │   /api/chat/   │
         └────────────────┘

OPÇÃO 1: WhatsApp Business API (Oficial - Meta)
├── Arquivo: src/lib/whatsapp/cloud-api.ts
├── Status: ✅ Produção
├── Custo: R$ 0,40-0,80 por conversa
├── Vantagens: Máxima confiabilidade, compliance total, zero risco ban
├── Uso: Produção principal
└── Templates pré-aprovados pela Meta

OPÇÃO 2: Evolution API (Self-hosted)
├── Arquivos: src/app/api/whatsapp/qrcode/route.ts
├── Status: ✅ Backup/Desenvolvimento
├── Hosting: Railway (~R$ 35/mês)
├── Vantagens: Custo fixo, controle total, sem limites de mensagens
├── Uso: Backup e staging
└── URL: https://unique-delight-production-affb.up.railway.app

OPÇÃO 3: Baileys (Direct Library)
├── Arquivos: baileys-server/index.js, src/app/(admin)/whatsapp-baileys/
├── Status: ✅ Desenvolvimento/Teste
├── Biblioteca: @whiskeysockets/baileys ^6.7.9
├── Vantagens: 100% gratuito, controle total
├── Desvantagens: Risco de banimento, menos estável
└── Uso: Apenas desenvolvimento/testes

COMPARAÇÃO:
┌─────────────────┬──────────────┬───────────────┬────────────────┐
│ Característica  │ Business API │ Evolution API │ Baileys Direct │
├─────────────────┼──────────────┼───────────────┼────────────────┤
│ Oficial (Meta)  │      ✅      │      ❌       │      ❌        │
│ Estabilidade    │    Máxima    │     Alta      │     Média      │
│ Custo por msg   │  R$ 0,40-0,80│   Gratuito    │   Gratuito     │
│ Custo fixo/mês  │      $0      │    ~R$ 35     │    ~R$ 35      │
│ Risco de ban    │   Zero (0%)  │    Baixo (5%) │   Alto (15%)   │
│ Setup           │    Difícil   │     Médio     │     Fácil      │
│ Manutenção      │     Zero     │     Baixa     │     Média      │
│ Templates       │      ✅      │      ❌       │      ❌        │
│ Webhooks        │      ✅      │      ✅       │      ✅        │
│ Multi-device    │      ✅      │      ✅       │      ✅        │
└─────────────────┴──────────────┴───────────────┴────────────────┘

ESTRATÉGIA DE FAILOVER:
1. Tenta Business API (oficial)
   ↓ (se falhar)
2. Tenta Evolution API (backup)
   ↓ (se falhar)
3. Tenta Baileys Direct (último recurso)
   ↓ (se falhar)
4. Fallback para Email/SMS

RECOMENDAÇÃO POR AMBIENTE:
├── Produção Principal:  Business API (confiabilidade + compliance)
├── Backup/Failover:     Evolution API (custo fixo + controle)
├── Desenvolvimento:     Baileys Direct (setup rápido + gratuito)
└── Staging/QA:          Evolution API (isolamento + flexibilidade)
```

### 6.2 Email (Resend)

```
RESEND:

FEATURES:
├── API moderna
├── React Email templates
├── Analytics
├── Webhooks
└── Domínio customizado

PREÇO:
├── Free: 100 emails/dia
├── Pro: $20/mês (50k emails)

INTEGRAÇÃO:
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'Garcez Palha <contato@garcezpalha.com>',
  to: cliente.email,
  subject: 'Sua proposta está pronta',
  react: PropostaEmail({ dados })
});
```

### 6.3 SMS (Twilio/Zenvia)

```
TWILIO:
├── SMS global
├── API robusta
├── Custo: ~R$ 0,30/SMS

ZENVIA (alternativa BR):
├── SMS brasileiro
├── Preços locais
├── Suporte PT-BR
└── Custo: ~R$ 0,15/SMS

USO:
import twilio from 'twilio';

const client = twilio(accountSid, authToken);

await client.messages.create({
  body: 'Seu prazo vence amanhã!',
  from: '+55...',
  to: cliente.telefone
});
```

---

## 7. PAGAMENTOS

### 7.1 Mercado Pago

```
MERCADO PAGO:

MÉTODOS:
├── PIX (0,99%)
├── Cartão crédito (4,99%)
├── Boleto (R$ 3,99)
└── Parcelamento

FEATURES:
├── Checkout Pro/Transparente
├── Webhooks (IPN)
├── Recorrência
├── Split de pagamento
└── QR Code PIX

INTEGRAÇÃO:
import { MercadoPago } from 'mercadopago';

const mp = new MercadoPago({
  accessToken: process.env.MP_ACCESS_TOKEN
});

const preference = await mp.preferences.create({
  items: [{ title, unit_price, quantity: 1 }],
  back_urls: { success, failure, pending },
  notification_url: webhookUrl
});
```

### 7.2 Stripe (Futuro)

```
STRIPE (para expansão):

VANTAGENS:
├── Checkout otimizado
├── Billing/Subscriptions
├── Invoice automático
├── Connect (marketplace)
└── Radar (anti-fraude)

QUANDO USAR:
├── Clientes internacionais
├── Subscriptions complexas
├── Marketplace B2B
```

---

## 8. ASSINATURA DIGITAL

### 8.1 ZapSign

```
ZAPSIGN:

FEATURES:
├── ICP-Brasil válido
├── WhatsApp integrado
├── API completa
├── Templates
└── Audit trail

PREÇO:
├── Pay-as-you-go: R$ 8,90/doc
├── Plano 50: R$ 199/mês
└── Plano 100: R$ 349/mês

INTEGRAÇÃO:
const zapsign = new ZapSign(apiToken);

const doc = await zapsign.createDocument({
  name: 'Contrato de Prestação de Serviços',
  url_pdf: pdfUrl,
  signers: [
    { name: cliente.nome, email: cliente.email }
  ]
});

// Retorna link para assinatura
const signUrl = doc.signers[0].sign_url;
```

### 8.2 Alternativas

```
CLICKSIGN:
├── Mais caro
├── Mais features
├── Melhor para volume alto

D4SIGN:
├── Preço médio
├── Boa API
├── Integração WhatsApp

DOCUSIGN:
├── Enterprise
├── Global
├── Muito caro
```

---

## 9. MONITORAMENTO DE PROCESSOS

### 9.1 Judit.io

```
JUDIT.IO:

COBERTURA:
├── 100+ tribunais
├── Todas as instâncias
├── Federal + Estadual
├── Trabalhista

FEATURES:
├── API REST
├── Webhooks
├── Histórico completo
├── Alertas customizados

PREÇO:
├── Por processo: R$ 2-5/mês
├── Pacotes disponíveis
└── Escala com desconto

INTEGRAÇÃO:
const judit = new JuditClient(apiKey);

// Adicionar processo
await judit.addProcess('0001234-56.2024.8.19.0001');

// Configurar webhook
await judit.setWebhook({
  url: 'https://api.garcezpalha.com/webhooks/judit',
  events: ['movement', 'deadline']
});
```

### 9.2 Alternativas

```
ESCAVADOR:
├── Buscador jurídico
├── API limitada
├── Bom para pesquisa

DIGESTO:
├── Similar Judit
├── Preço competitivo
├── Menos tribunais

PRÓPRIO (futuro):
├── Scrapers customizados
├── Maior controle
├── Mais trabalho
└── Manutenção constante
```

---

## 10. HOSTING E INFRAESTRUTURA

### 10.1 Vercel

```
VERCEL:

FEATURES:
├── Deploy automático (Git)
├── Preview deployments
├── Edge Functions
├── Analytics
├── Image optimization
└── CDN global

PREÇO:
├── Hobby: Free (pessoal)
├── Pro: $20/mês (produção)
└── Enterprise: custom

CONFIGURAÇÃO:
// vercel.json
{
  "framework": "nextjs",
  "regions": ["gru1"],
  "env": {
    "DATABASE_URL": "@database-url",
    "ANTHROPIC_API_KEY": "@anthropic-key"
  }
}
```

### 10.2 Domínio e DNS

```
DOMÍNIO:
├── garcezpalha.com (principal)
├── Registrado: Cloudflare
├── DNS: Cloudflare

CLOUDFLARE:
├── DNS gerenciado
├── SSL automático
├── DDoS protection
├── Page rules
└── Free tier suficiente

SUBDOMÍNIOS:
├── www → site principal
├── api → Vercel
├── n8n → automação
└── docs → documentação
```

### 10.3 Serviços Auxiliares

```
RAILWAY:
├── Containers Docker
├── PostgreSQL
├── Redis
├── ~$5-20/mês

RENDER:
├── Similar Railway
├── Free tier generoso
├── Web services

UPSTASH:
├── Redis serverless
├── Rate limiting
├── Caching
├── Free tier: 10k/dia
```

---

## 11. DESENVOLVIMENTO

### 11.1 Ferramentas Dev

```
EDITOR:
├── VS Code / Cursor
├── Extensions: ESLint, Prettier, Tailwind
└── GitHub Copilot

CONTROLE DE VERSÃO:
├── GitHub
├── Branch protection
├── PR reviews
└── GitHub Actions (CI/CD)

TESTES:
├── Vitest (unit)
├── Playwright (e2e)
├── Testing Library (components)
```

### 11.2 CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Type check
        run: npm run typecheck
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 12. CUSTOS MENSAIS ESTIMADOS

### 12.1 Tabela de Custos

```
┌─────────────────────────────────────────────────────────────────────┐
│                    CUSTOS MENSAIS ESTIMADOS                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  INFRAESTRUTURA                                                     │
│  ├── Vercel Pro                          $20      (R$ 100)         │
│  ├── Supabase Pro                        $25      (R$ 125)         │
│  ├── Cloudflare                          Free     (R$ 0)           │
│  └── Railway (n8n + Evolution)           $15      (R$ 75)          │
│                                                                     │
│  COMUNICAÇÃO                                                        │
│  ├── Resend Pro                          $20      (R$ 100)         │
│  ├── WhatsApp (número)                   -        (R$ 30)          │
│  └── SMS (reserva)                       -        (R$ 50)          │
│                                                                     │
│  SERVIÇOS                                                          │
│  ├── ZapSign (50 docs)                   -        (R$ 199)         │
│  ├── Judit.io (~50 processos)            -        (R$ 150)         │
│  └── Domínio (anual/12)                  -        (R$ 15)          │
│                                                                     │
│  IA                                                                │
│  ├── Anthropic                           -        (R$ 50)          │
│  └── OpenRouter (backup)                 -        (R$ 20)          │
│                                                                     │
│  MARKETING                                                         │
│  ├── Google Ads                          -        (R$ 3.000)       │
│  └── Ferramentas SEO                     -        (R$ 100)         │
│                                                                     │
│  ─────────────────────────────────────────────────────────────     │
│  TOTAL FIXO (sem marketing):                      R$ 914/mês       │
│  TOTAL COM MARKETING:                             R$ 4.014/mês     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 12.2 Custos Variáveis (por contrato)

```
POR CONTRATO:
├── IA (geração + triagem): R$ 2
├── Assinatura digital: R$ 4 (volume)
├── Monitoramento processo: R$ 3/mês
├── Taxas pagamento: 3% (~R$ 75)
└── TOTAL VARIÁVEL: ~R$ 84

COM CAC (Google Ads):
├── CAC médio: R$ 100
├── + Custos variáveis: R$ 84
└── TOTAL/CONTRATO: ~R$ 184

MARGEM:
├── Ticket médio: R$ 2.500
├── Custos: R$ 184
├── Margem bruta: R$ 2.316 (93%)
├── - Rateio fixo: ~R$ 30
└── Margem líquida: ~90%
```

---

## 13. CHECKLIST DE SETUP

```
FASE 0: CONTAS E ACESSOS
[ ] GitHub (repositório)
[ ] Vercel (hosting)
[ ] Supabase (banco)
[ ] Cloudflare (domínio/DNS)
[ ] Anthropic (IA)
[ ] Mercado Pago (pagamentos)
[ ] ZapSign (assinaturas)
[ ] Judit.io (processos)
[ ] Resend (emails)
[ ] Railway (n8n + WhatsApp)

FASE 1: INFRAESTRUTURA BASE
[ ] Criar projeto Next.js
[ ] Configurar Supabase
[ ] Setup Tailwind + shadcn
[ ] Deploy inicial Vercel
[ ] Configurar domínio

FASE 2: BACKEND
[ ] Implementar tRPC
[ ] Criar tabelas do banco
[ ] Setup autenticação
[ ] APIs de lead/pedido
[ ] Integração pagamentos

FASE 3: COMUNICAÇÃO
[ ] Setup Evolution API
[ ] Configurar webhooks
[ ] Templates de mensagem
[ ] Integrar Resend
[ ] Testar fluxos

FASE 4: IA E AUTOMAÇÃO
[ ] Integrar Anthropic
[ ] Sistema de agentes
[ ] Produção de documentos
[ ] Workflows n8n
[ ] Testes end-to-end

FASE 5: MONITORAMENTO
[ ] Integrar Judit.io
[ ] Sistema de notificações
[ ] Dashboard admin
[ ] Alertas e métricas
[ ] Go-live! 🚀
```

---

*Documento: 17-STACK-TECNOLOGICA.md*
*Versão: 1.0*
