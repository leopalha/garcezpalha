# Tech Stack - Garcez Palha Platform

**Versão**: 1.0
**Atualização**: 29/12/2025
**Node**: 20.x
**Package Manager**: npm

---

## 1. FRAMEWORK CORE

### Next.js 14.2.35
- **Tipo**: React Framework
- **Uso**: Framework principal da aplicação
- **Features**:
  - App Router (nova arquitetura)
  - Server Components
  - API Routes
  - Static Generation
  - ISR (Incremental Static Regeneration)
  - Middleware
  - Image Optimization

### React 18.3.1
- **Tipo**: UI Library
- **Uso**: Biblioteca de interface
- **Features**:
  - Hooks
  - Server Components
  - Suspense
  - Concurrent Features

### TypeScript 5.x
- **Tipo**: Language
- **Uso**: Linguagem principal
- **Features**:
  - Type safety
  - Intellisense
  - Refactoring
  - Error prevention

---

## 2. UI/UX

### Radix UI (Componentes)
- `@radix-ui/react-accordion` 1.2.12
- `@radix-ui/react-alert-dialog` 1.1.15
- `@radix-ui/react-avatar` 1.1.11
- `@radix-ui/react-checkbox` 1.3.3
- `@radix-ui/react-dialog` 1.1.15
- `@radix-ui/react-dropdown-menu` 2.1.16
- `@radix-ui/react-icons` 1.3.2
- `@radix-ui/react-label` 2.1.8
- `@radix-ui/react-navigation-menu` 1.2.14
- `@radix-ui/react-popover` 1.1.15
- `@radix-ui/react-progress` 1.1.8
- `@radix-ui/react-radio-group` 1.3.8
- `@radix-ui/react-select` 2.2.6
- `@radix-ui/react-separator` 1.1.8
- `@radix-ui/react-slider` 1.3.6
- `@radix-ui/react-slot` 1.2.4
- `@radix-ui/react-switch` 1.2.6
- `@radix-ui/react-tabs` 1.1.13
- `@radix-ui/react-toast` 1.2.15

**Uso**: Componentes headless acessíveis

### Tailwind CSS 3.4.1
- **Tipo**: Utility-first CSS
- **Uso**: Estilização principal
- **Plugins**:
  - `tailwindcss-animate` 1.0.7 (animações)
  - `tailwind-merge` 3.4.0 (merge de classes)
  - `autoprefixer` 10.x (compatibilidade)

### Lucide React 0.553.0
- **Tipo**: Icon Library
- **Uso**: Ícones SVG
- **Features**: 1000+ ícones, tree-shakeable

### Framer Motion 12.23.24
- **Tipo**: Animation Library
- **Uso**: Animações e transições
- **Features**:
  - Animações declarativas
  - Gestos
  - Scroll animations
  - Layout animations

### Class Variance Authority 0.7.1
- **Tipo**: Utility
- **Uso**: Variantes de componentes
- **Features**: Type-safe variants

### CLSX 2.1.1
- **Tipo**: Utility
- **Uso**: Concatenação condicional de classes

---

## 3. STATE MANAGEMENT

### Zustand 5.0.8
- **Tipo**: State Management
- **Uso**: Estado global da aplicação
- **Features**:
  - Simples e leve
  - Sem boilerplate
  - TypeScript friendly
  - Devtools integration

### React Hook Form 7.66.0
- **Tipo**: Form Management
- **Uso**: Gerenciamento de formulários
- **Features**:
  - Performance otimizada
  - Validação integrada
  - TypeScript support
- **Resolvers**: `@hookform/resolvers` 5.2.2

---

## 4. DATA FETCHING & API

### tRPC 11.8.0
- **Tipo**: End-to-end typesafe APIs
- **Packages**:
  - `@trpc/server` 11.8.0
  - `@trpc/client` 11.8.0
  - `@trpc/next` 11.8.0
  - `@trpc/react-query` 11.8.0
- **Uso**: API type-safe entre frontend e backend
- **Features**:
  - Type inference
  - Sem código duplicado
  - Auto-complete
  - Runtime validation

### TanStack Query 5.90.9
- **Package**: `@tanstack/react-query`
- **Tipo**: Data fetching library
- **Uso**: Cache, sincronização, fetching
- **Features**:
  - Cache automático
  - Revalidação
  - Optimistic updates
  - Devtools

### Zod 4.1.12
- **Tipo**: Schema validation
- **Uso**: Validação de dados e tipos runtime
- **Features**:
  - TypeScript inference
  - Validação robusta
  - Error handling

### SuperJSON 2.2.5
- **Tipo**: Data serialization
- **Uso**: Serialização de dados complexos (Date, Map, Set)
- **Features**: Suporte a tipos não-JSON

---

## 5. DATABASE

### Supabase 2.81.1
- **Package**: `@supabase/supabase-js`
- **Tipo**: Backend as a Service
- **Features**:
  - PostgreSQL database
  - Real-time subscriptions
  - Row Level Security
  - Storage
  - Edge Functions

### Supabase Auth
- **Package**: `@supabase/auth-helpers-nextjs` 0.15.0
- **Package**: `@supabase/ssr` 0.7.0
- **Uso**: Autenticação
- **Features**:
  - Email/password
  - OAuth providers
  - Magic links
  - JWT tokens

### PostgreSQL Client
- **Package**: `pg` 8.16.3 (devDependencies)
- **Uso**: Client direto PostgreSQL para scripts

---

## 6. AUTENTICAÇÃO

### NextAuth.js 4.24.13
- **Tipo**: Authentication
- **Uso**: Autenticação completa
- **Features**:
  - Email/password
  - OAuth providers
  - JWT/Session
  - Callbacks customizados

### bcryptjs 3.0.3
- **Tipo**: Password hashing
- **Uso**: Hash de senhas
- **Features**: Bcrypt seguro

---

## 7. INTELIGÊNCIA ARTIFICIAL

### OpenAI 6.9.0
- **Tipo**: AI SDK
- **Uso**: GPT-4, GPT-3.5, embeddings
- **Features**:
  - Chat completions
  - Streaming
  - Function calling
  - Embeddings

**Nota**: Sistema também suporta Claude AI (Anthropic), mas via API direta

---

## 8. PAGAMENTOS

### Stripe 19.3.1
- **Package**: `stripe` (server)
- **Package**: `@stripe/stripe-js` 8.5.2 (client)
- **Tipo**: Payment processor
- **Uso**: Pagamentos internacionais
- **Features**:
  - Checkout sessions
  - Subscriptions
  - Webhooks
  - Payment intents

### MercadoPago 2.10.0
- **Tipo**: Payment processor
- **Uso**: Pagamentos Brasil/LATAM
- **Features**:
  - PIX
  - Boleto
  - Cartão de crédito
  - Parcelamento

---

## 9. COMUNICAÇÃO

### Twilio 5.11.1
- **Tipo**: Communications API
- **Uso**: SMS, WhatsApp, Voice
- **Features**:
  - WhatsApp Business API
  - SMS programmable
  - Phone numbers

### Telegram Bot API
- **Package**: `node-telegram-bot-api` 0.66.0
- **Tipo**: Bot framework
- **Uso**: Bot do Telegram
- **Features**:
  - Webhooks
  - Inline keyboards
  - File handling

### Resend 6.4.2
- **Tipo**: Email API
- **Uso**: Envio de emails transacionais
- **Features**:
  - Templates
  - Tracking
  - React Email support

---

## 10. DOCUMENTOS E ARQUIVOS

### DOCX 9.5.1
- **Tipo**: Document generation
- **Uso**: Geração de documentos Word (.docx)
- **Features**:
  - Contratos
  - Propostas
  - Petições

### PDF Parse 2.4.5
- **Tipo**: PDF parser
- **Uso**: Extração de texto de PDFs
- **Features**: Text extraction, metadata

### QRCode 1.5.4
- **Tipo**: QR Code generator
- **Uso**: Geração de QR codes (PIX, links)
- **Features**: PNG, SVG, terminal

---

## 11. MARKDOWN & CONTENT

### Next MDX Remote 5.0.0
- **Tipo**: MDX processor
- **Uso**: Conteúdo dinâmico em MDX
- **Features**:
  - Components em markdown
  - Serialização server-side

### Gray Matter 4.0.3
- **Tipo**: Front matter parser
- **Uso**: Parse de metadados em arquivos markdown
- **Features**: YAML, JSON, TOML

### Remark/Rehype (MDX)
- `remark-gfm` 4.0.1 (GitHub Flavored Markdown)
- `rehype-slug` 6.0.0 (IDs em headings)
- `rehype-autolink-headings` 7.1.0 (Links em headings)
- `rehype-highlight` 7.0.2 (Syntax highlighting)

### Reading Time 1.5.0
- **Tipo**: Utility
- **Uso**: Cálculo de tempo de leitura
- **Features**: Estimativa em minutos

---

## 12. UTILIDADES

### Date-fns 3.6.0
- **Tipo**: Date utility
- **Uso**: Manipulação de datas
- **Features**:
  - Format, parse
  - Locale support
  - Timezone aware

### UUID 13.0.0
- **Tipo**: UUID generator
- **Uso**: Geração de IDs únicos
- **Features**: v4, v5, v1

### LRU Cache 10.4.3
- **Tipo**: Caching
- **Uso**: Cache em memória
- **Features**:
  - TTL
  - Max size
  - Performance

### Glob 13.0.0
- **Tipo**: File matching
- **Uso**: Pattern matching de arquivos
- **Features**: Fast globbing

### Dotenv 17.2.3
- **Tipo**: Environment variables
- **Uso**: Carregar variáveis de .env
- **Features**: Múltiplos arquivos .env

---

## 13. LOGGING

### Pino 10.1.0
- **Tipo**: Logger
- **Uso**: Logging estruturado
- **Features**:
  - JSON logging
  - High performance
  - Child loggers
  - Log levels

---

## 14. CHARTS & VISUALIZATION

### Recharts 3.6.0
- **Tipo**: Chart library
- **Uso**: Gráficos e dashboards
- **Features**:
  - Composable charts
  - Responsive
  - Animations
  - Types: Line, Bar, Pie, Area, etc.

---

## 15. GOOGLE APIS

### googleapis 166.0.0
- **Tipo**: Google APIs client
- **Uso**: Integração com Google (Drive, Calendar, Sheets)
- **Features**:
  - OAuth2
  - Drive API
  - Calendar API
  - Sheets API

---

## 16. ERROR HANDLING

### @hapi/boom 10.0.1
- **Tipo**: HTTP errors
- **Uso**: Gerenciamento de erros HTTP
- **Features**:
  - Friendly error objects
  - Status codes
  - Payload formatting

---

## 17. TESTING

### Jest 30.2.0
- **Tipo**: Testing framework
- **Uso**: Testes unitários e integração
- **Packages**:
  - `jest` 30.2.0
  - `jest-environment-jsdom` 30.2.0
  - `ts-jest` 29.4.6
  - `@types/jest` 30.0.0

### React Testing Library
- **Package**: `@testing-library/react` 16.3.1
- **Package**: `@testing-library/jest-dom` 6.9.1
- **Tipo**: Testing utilities
- **Uso**: Testes de componentes React

---

## 18. BUILD & DEV TOOLS

### ESLint 9.39.1
- **Package**: `@eslint/eslintrc` 3.3.3
- **Tipo**: Linter
- **Uso**: Code quality e estilo
- **Features**: Regras customizadas

### PostCSS 8.x
- **Tipo**: CSS processor
- **Uso**: Transformação de CSS
- **Features**: Autoprefixer, plugins

---

## 19. SCRIPTS DISPONÍVEIS

```json
{
  "dev": "next dev",                    // Desenvolvimento
  "build": "next build",                // Build produção
  "start": "next start",                // Start produção
  "lint": "echo 'Linting skipped'",     // Lint (desabilitado)
  "typecheck": "tsc --noEmit",          // Type checking
  "test": "jest",                       // Testes
  "test:watch": "jest --watch",         // Testes watch
  "test:coverage": "jest --coverage",   // Cobertura

  // Database
  "db:login": "npx supabase login",
  "db:link": "npx supabase link",
  "db:push": "npx supabase db push",
  "db:pull": "npx supabase db pull",
  "db:reset": "npx supabase db reset",
  "db:types": "npx supabase gen types...",

  // Health checks
  "check:deploy": "node deployment-check.js",
  "check:health": "node health-check.js",
  "check:db": "node verify-database.js",

  // Audit
  "audit": "npx tsx scripts/audit-automation.ts"
}
```

---

## 20. VARIÁVEIS DE AMBIENTE

### Essenciais
```bash
# Database
DATABASE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Auth
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# OpenAI
OPENAI_API_KEY=

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# MercadoPago
MERCADOPAGO_ACCESS_TOKEN=

# Twilio
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_NUMBER=

# Telegram
TELEGRAM_BOT_TOKEN=

# Resend
RESEND_API_KEY=
```

---

## 21. ESTRUTURA DE PASTAS TECH

```
src/
├── lib/
│   ├── ai/              # Sistema de IA
│   │   ├── agents/      # Agentes especializados
│   │   ├── prompts/     # Prompts
│   │   └── qualification/ # Engine de qualificação
│   ├── products/        # Catálogo de produtos
│   ├── supabase/        # Client Supabase
│   ├── stripe/          # Integração Stripe
│   ├── mercadopago/     # Integração MercadoPago
│   ├── twilio/          # Integração Twilio
│   └── utils/           # Utilidades
├── app/                 # Next.js App Router
│   ├── (marketing)/     # Grupo marketing
│   ├── (dashboard)/     # Grupo dashboard
│   └── api/             # API routes
├── components/          # Componentes React
│   ├── ui/              # Componentes base (Radix)
│   └── vsl/             # VSL específicos
└── types/               # TypeScript types
```

---

## 22. PERFORMANCE

### Code Splitting
- Automatic via Next.js
- Dynamic imports
- Route-based splitting

### Image Optimization
- Next.js Image component
- Automatic WebP conversion
- Lazy loading
- Responsive images

### Caching
- ISR (Incremental Static Regeneration)
- SWR via TanStack Query
- LRU Cache para dados em memória
- CDN caching (Vercel)

### Bundle Optimization
- Tree shaking
- Minification
- Compression (gzip/brotli)

---

## 23. SEGURANÇA

### Authentication
- NextAuth.js (JWT/Session)
- Supabase Auth (RLS)
- bcrypt para senhas

### Data Validation
- Zod schemas
- Runtime validation
- TypeScript compile-time

### Database Security
- Row Level Security (Supabase)
- Prepared statements
- Environment variables

### API Security
- CORS configurado
- Rate limiting
- CSRF protection
- API key rotation

---

## 24. DEPLOY

### Plataforma: Vercel
- **Build**: Next.js build
- **Runtime**: Node.js 20.x
- **Regions**: Edge network
- **Analytics**: Vercel Analytics
- **Monitoring**: Vercel Logs

### CI/CD
- Git push → auto deploy
- Preview deployments
- Production deploys (main branch)

---

## 25. MONITORING & OBSERVABILITY

### Logs
- Pino structured logging
- Vercel logs integration
- Error tracking

### Metrics
- Vercel Analytics
- Web Vitals
- Custom events

### Alerts
- Build failures
- Runtime errors
- Performance degradation

---

## RESUMO POR CATEGORIA

| Categoria | Principais Tecnologias |
|-----------|------------------------|
| **Framework** | Next.js 14, React 18, TypeScript 5 |
| **UI** | Radix UI, Tailwind CSS, Framer Motion, Lucide Icons |
| **State** | Zustand, React Hook Form, TanStack Query |
| **API** | tRPC, Zod, SuperJSON |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | NextAuth.js, Supabase Auth, bcryptjs |
| **AI** | OpenAI, Custom agents |
| **Payments** | Stripe, MercadoPago |
| **Comms** | Twilio, Telegram, Resend |
| **Docs** | DOCX, PDF Parse, QRCode |
| **Content** | Next MDX Remote, Gray Matter, Remark/Rehype |
| **Utils** | date-fns, uuid, glob, dotenv |
| **Logging** | Pino |
| **Charts** | Recharts |
| **Testing** | Jest, React Testing Library |
| **Deploy** | Vercel |

---

**Total de Dependencies**: ~80
**Total de DevDependencies**: ~15

**Última atualização**: 29/12/2025
**Package Manager**: npm
**Node Version**: 20.x
