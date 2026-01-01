# 🎯 PLANO DE CONSOLIDAÇÃO - SINGLE DOMAIN ARCHITECTURE

**Objetivo:** Migrar de arquitetura multi-domain (www + app subdomains) para single-domain unificado em `www.garcezpalha.com`

**Motivação:**
- ❌ Usuário sai do ambiente desnecessariamente (app.garcezpalha.com)
- ❌ Múltiplas áreas de login causam confusão
- ❌ Experiência fragmentada
- ✅ Consolidar tudo em www.garcezpalha.com para UX coesa

**Esforço Estimado:** 12-16h (2-3 dias)
**Prioridade:** P1 (Alto impacto na UX)
**Data:** 01/01/2025

---

## 📊 SITUAÇÃO ATUAL vs IDEAL

### ANTES (Problemático):
```
┌─────────────────────────────────────┐
│ www.garcezpalha.com                 │
│  ├─ / (marketing)                   │
│  ├─ /login                          │
│  └─ /checkout                       │
└─────────────────────────────────────┘
                ↓ Redirect
┌─────────────────────────────────────┐
│ app.garcezpalha.com                 │  ❌ SAIR DO AMBIENTE!
│  ├─ /app/dashboard                  │
│  ├─ /app/produtos                   │
│  ├─ /app/conversas                  │
│  ├─ /app/clientes                   │
│  └─ /app/configuracoes              │
└─────────────────────────────────────┘

PROBLEMAS:
❌ Usuário sai do www.garcezpalha.com
❌ Confusão: "Onde estou?"
❌ 2 logins diferentes (aparência)
❌ Fragmentação da experiência
```

### DEPOIS (Ideal):
```
┌─────────────────────────────────────┐
│ www.garcezpalha.com                 │  ✅ TUDO EM UM LUGAR!
│                                     │
│ PÚBLICO (sem login):                │
│  ├─ / (homepage)                    │
│  ├─ /solucoes                       │
│  ├─ /blog                           │
│  └─ /contato                        │
│                                     │
│ AUTENTICADO (após login):           │
│  ├─ /dashboard                      │  ← era /app/dashboard
│  ├─ /produtos                       │  ← era /app/produtos
│  ├─ /conversas                      │  ← era /app/conversas
│  ├─ /clientes                       │  ← era /app/clientes
│  ├─ /analytics                      │  ← era /app/analytics
│  └─ /configuracoes                  │  ← era /app/configuracoes
│                                     │
│ ADMIN (role-based):                 │
│  ├─ /admin                          │  (mantém)
│  └─ /parceiro                       │  (mantém)
│                                     │
│ AUTH:                               │
│  ├─ /login (único)                  │
│  ├─ /cadastro                       │
│  └─ /checkout (único)               │
└─────────────────────────────────────┘

BENEFÍCIOS:
✅ Navegação fluida sem mudança de domínio
✅ Login único centralizado
✅ UX coesa e profissional
✅ Menos confusão para usuário
✅ SEO melhorado (single domain authority)
```

---

## 🔍 ANÁLISE TÉCNICA COMPLETA

### 1. ESTRUTURA DE PASTAS ATUAL

```
src/app/
├── (marketing)/          # Público - rotas raiz (/, /blog, /solucoes)
├── (app)/               # B2B Dashboard - PREFIXO /app/ ❌
│   └── dashboard/
│       ├── page.tsx                    # /app/dashboard
│       ├── produtos/                   # /app/dashboard/produtos
│       ├── conversas/                  # /app/dashboard/conversas
│       ├── clientes/                   # /app/dashboard/clientes
│       ├── analytics/                  # /app/dashboard/analytics
│       ├── agent/                      # /app/dashboard/agent
│       ├── landing-pages/              # /app/dashboard/landing-pages
│       ├── white-label/                # /app/dashboard/white-label
│       ├── assinatura/                 # /app/dashboard/assinatura
│       └── configuracoes/              # /app/dashboard/configuracoes
├── (admin)/             # Admin - /admin (OK)
├── (auth)/              # Auth - /login, /cadastro (OK)
├── (partner)/           # Partner - /parceiro (OK)
└── api/                 # APIs (OK)
```

**Problema:** Route group `(app)` força prefixo `/app/` em todas rotas

### 2. HARDCODED PATHS ENCONTRADOS

**Total:** 14+ ocorrências de `/app/dashboard`

| Arquivo | Linha | Código |
|---------|-------|--------|
| `src/app/(app)/dashboard/layout.tsx` | 42-52 | Links sidebar (10x) |
| `src/app/(marketing)/components/navbar.tsx` | 156 | Link "Dashboard" |
| `src/app/(app)/dashboard/produtos/page.tsx` | 89 | Link criar produto |
| `src/app/(app)/dashboard/conversas/page.tsx` | 67 | Link conversas |
| `src/app/(app)/checkout/page.tsx` | 45 | Redirect após checkout |
| `src/components/dashboard/sidebar.tsx` | Multiple | Links navegação |

**Busca global necessária:** `/app/` em todos arquivos .tsx, .ts

### 3. COMPONENTES DE NAVEGAÇÃO

| Componente | Localização | Links Afetados |
|------------|-------------|----------------|
| **Marketing Navbar** | `(marketing)/components/navbar.tsx` | `/login`, `/dashboard` (se logado) |
| **Dashboard Sidebar** | `(app)/dashboard/layout.tsx` | 10 links `/app/dashboard/*` |
| **Admin Sidebar** | `(admin)/layout.tsx` | Links `/admin/*` (OK) |
| **Partner Sidebar** | `(partner)/layout.tsx` | Links `/parceiro/*` (OK) |

### 4. MIDDLEWARE & AUTH

**Arquivo:** `src/middleware.ts`

```typescript
// ATUAL - Protected routes
const protectedRoutes = ['/dashboard', '/admin', '/portal-parceiro']

// Role-based redirects
if (role === 'admin') redirect('/admin')
if (role === 'partner') redirect('/portal-parceiro')
redirect('/dashboard')  // Default para user
```

**Status:** ✅ Middleware já usa `/dashboard` (não `/app/dashboard`)!
**Ação:** Nenhuma mudança necessária no middleware

### 5. NEXT.CONFIG.JS - REDIRECTS

**Arquivo:** `next.config.js`

**Redirects existentes:**
- `/servicos/*` → `/financeiro/*` (legacy)
- Nenhum redirect de `/app/*` configurado

**Ação necessária:** Adicionar redirects 301 para SEO:
```javascript
{
  source: '/app/dashboard/:path*',
  destination: '/dashboard/:path*',
  permanent: true  // 301
}
```

---

## 📋 PLANO DE MIGRAÇÃO - 5 ETAPAS

### ETAPA 1: REESTRUTURAR PASTAS (2h)

**Objetivo:** Mover rotas de `(app)/dashboard/*` para raiz sem prefixo

**Ações:**

1. **Renomear route group `(app)` → `(dashboard)`**
   ```bash
   mv src/app/\(app\) src/app/\(dashboard\)
   ```

2. **Mover conteúdo de `dashboard/` para raiz do grupo**
   ```
   ANTES:
   src/app/(app)/
   └── dashboard/
       ├── page.tsx
       ├── produtos/
       └── ...

   DEPOIS:
   src/app/(dashboard)/
   ├── dashboard/
   │   └── page.tsx
   ├── produtos/
   ├── conversas/
   ├── clientes/
   └── ...
   ```

3. **Atualizar layouts**
   - `(dashboard)/layout.tsx` - sidebar com links corretos
   - Remover `(app)/dashboard/layout.tsx` se duplicado

**Arquivos afetados:** ~15 pastas/arquivos movidos

**Risco:** Baixo (apenas restructuring de pastas)

---

### ETAPA 2: BUSCAR/SUBSTITUIR HARDCODED PATHS (3h)

**Objetivo:** Remover todos `/app/` prefixes

**Comando de busca:**
```bash
grep -r "/app/dashboard" src/ --include="*.tsx" --include="*.ts"
grep -r "/app/checkout" src/ --include="*.tsx" --include="*.ts"
grep -r "href=\"/app" src/ --include="*.tsx"
```

**Substituições necessárias:**

| ANTES | DEPOIS |
|-------|--------|
| `/app/dashboard` | `/dashboard` |
| `/app/dashboard/produtos` | `/produtos` |
| `/app/dashboard/conversas` | `/conversas` |
| `/app/dashboard/clientes` | `/clientes` |
| `/app/dashboard/analytics` | `/analytics` |
| `/app/dashboard/landing-pages` | `/landing-pages` |
| `/app/dashboard/white-label` | `/white-label` |
| `/app/dashboard/assinatura` | `/assinatura` |
| `/app/dashboard/configuracoes` | `/configuracoes` |
| `/app/checkout` | `/checkout` |
| `/app/checkout/success` | `/checkout/success` |
| `/app/checkout/cancel` | `/checkout/cancel` |

**Script automatizado:**
```bash
# Criar script de busca/substituição
find src/ -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i 's|/app/dashboard|/dashboard|g' {} +
find src/ -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i 's|/app/checkout|/checkout|g' {} +
```

**Arquivos estimados:** 20-30 arquivos

**Verificação:**
```bash
# Após substituição, verificar se ainda existe /app/
grep -r "href=\"/app" src/
grep -r "router.push('/app" src/
grep -r "redirect('/app" src/
```

---

### ETAPA 3: ATUALIZAR COMPONENTES DE NAVEGAÇÃO (2h)

**Componentes a atualizar:**

#### 3.1 Marketing Navbar
**Arquivo:** `src/app/(marketing)/components/navbar.tsx`

```tsx
// ANTES
<Link href="/login">Login</Link>
{session && <Link href="/app/dashboard">Dashboard</Link>}

// DEPOIS
<Link href="/login">Login</Link>
{session && <Link href="/dashboard">Dashboard</Link>}
```

#### 3.2 Dashboard Sidebar
**Arquivo:** `src/app/(app)/dashboard/layout.tsx` → `src/app/(dashboard)/layout.tsx`

```tsx
// ANTES
const navigation = [
  { name: 'Dashboard', href: '/app/dashboard', icon: Home },
  { name: 'Produtos', href: '/app/dashboard/produtos', icon: Package },
  // ... mais 8 links
]

// DEPOIS
const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Produtos', href: '/produtos', icon: Package },
  { name: 'Conversas', href: '/conversas', icon: MessageSquare },
  { name: 'Clientes', href: '/clientes', icon: Users },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Agent IA', href: '/agent', icon: Bot },
  { name: 'Landing Pages', href: '/landing-pages', icon: Layout },
  { name: 'White Label', href: '/white-label', icon: Palette },
  { name: 'Assinatura', href: '/assinatura', icon: CreditCard },
  { name: 'Configurações', href: '/configuracoes', icon: Settings },
]
```

#### 3.3 Breadcrumbs
**Arquivos:** Páginas com breadcrumbs

```tsx
// ANTES
<Breadcrumbs>
  <Link href="/app/dashboard">Dashboard</Link>
  <Link href="/app/dashboard/produtos">Produtos</Link>
</Breadcrumbs>

// DEPOIS
<Breadcrumbs>
  <Link href="/dashboard">Dashboard</Link>
  <Link href="/produtos">Produtos</Link>
</Breadcrumbs>
```

**Arquivos afetados:** 4-6 componentes

---

### ETAPA 4: CONFIGURAR REDIRECTS & SEO (1h)

**Arquivo:** `next.config.js`

#### 4.1 Adicionar redirects permanentes (301)

```javascript
async redirects() {
  return [
    // === CONSOLIDAÇÃO SINGLE DOMAIN ===
    // Redirect de rotas antigas /app/* para raiz
    {
      source: '/app/dashboard/:path*',
      destination: '/dashboard/:path*',
      permanent: true,  // 301 - Mantém SEO
    },
    {
      source: '/app/checkout',
      destination: '/checkout',
      permanent: true,
    },
    {
      source: '/app/checkout/:path*',
      destination: '/checkout/:path*',
      permanent: true,
    },

    // === REDIRECTS LEGACY (já existentes) ===
    {
      source: '/servicos/desbloqueio-conta',
      destination: '/financeiro/desbloqueio-conta',
      permanent: true,
    },
    // ... outros redirects legacy
  ]
}
```

#### 4.2 Atualizar metadata canônica

**Arquivo:** `src/app/layout.tsx`

```tsx
// VERIFICAR se já está correto:
export const metadata = {
  metadataBase: new URL('https://www.garcezpalha.com'),
  // ...
}
```

**Status:** ✅ Já está correto!

---

### ETAPA 5: TESTES & VALIDAÇÃO (4h)

#### 5.1 Checklist de Testes Funcionais

- [ ] **Homepage (/)** - Renderiza corretamente
- [ ] **Login (/login)** - Login funciona
- [ ] **Redirect pós-login** - Vai para `/dashboard` (não `/app/dashboard`)
- [ ] **Dashboard (/dashboard)** - Carrega corretamente após login
- [ ] **Navegação sidebar** - Todos links funcionam
  - [ ] `/produtos` - Abre página de produtos
  - [ ] `/conversas` - Abre conversas
  - [ ] `/clientes` - Abre clientes
  - [ ] `/analytics` - Abre analytics
  - [ ] `/configuracoes` - Abre configurações
- [ ] **Checkout (/checkout)** - Funciona sem prefixo `/app`
- [ ] **Redirects 301** - `/app/dashboard` → `/dashboard` funciona
- [ ] **Admin (/admin)** - Funciona para role admin
- [ ] **Parceiro (/parceiro)** - Funciona para role partner
- [ ] **Logout** - Logout e redirect para `/`

#### 5.2 Testes de Segurança

- [ ] Middleware bloqueia `/dashboard` sem auth
- [ ] Middleware bloqueia `/admin` sem role admin
- [ ] Middleware bloqueia `/parceiro` sem role partner
- [ ] Public routes acessíveis: `/`, `/blog`, `/solucoes`

#### 5.3 Testes de Performance

- [ ] Build sem erros: `npm run build`
- [ ] TypeScript sem erros: `npx tsc --noEmit`
- [ ] Lighthouse score mantido (>90)
- [ ] Core Web Vitals OK

#### 5.4 Verificação de Links

```bash
# Verificar se ainda existe /app/ hardcoded
grep -r "/app/" src/ --include="*.tsx" --include="*.ts" | grep -v "node_modules"

# Deve retornar ZERO resultados (exceto comentários)
```

#### 5.5 Teste Manual - User Flow

1. **Visitante**
   - Acessa www.garcezpalha.com
   - Navega pelo site (blog, soluções)
   - Clica "Login"
   - Faz login
   - **Deve ir para `/dashboard`** ✅

2. **Usuário logado**
   - Acessa `/dashboard`
   - Clica "Produtos" → vai para `/produtos` ✅
   - Clica "Conversas" → vai para `/conversas` ✅
   - Clica "Clientes" → vai para `/clientes` ✅
   - **Nunca sai de www.garcezpalha.com** ✅

3. **Legacy URLs (SEO)**
   - Acessa `/app/dashboard`
   - **Redireciona 301 para `/dashboard`** ✅
   - Preserva query params: `/app/dashboard?tab=produtos` → `/dashboard?tab=produtos` ✅

---

## 🎯 RESUMO EXECUTIVO

### Mudanças Principais

| Categoria | ANTES | DEPOIS | Impacto |
|-----------|-------|--------|---------|
| **Domínio** | www + app subdomains | www único | Alto UX |
| **Dashboard** | `/app/dashboard` | `/dashboard` | Alto |
| **Produtos** | `/app/dashboard/produtos` | `/produtos` | Médio |
| **Conversas** | `/app/dashboard/conversas` | `/conversas` | Médio |
| **Clientes** | `/app/dashboard/clientes` | `/clientes` | Médio |
| **Checkout** | `/app/checkout` | `/checkout` | Alto |
| **Admin** | `/admin` | `/admin` | Sem mudança |
| **Parceiro** | `/parceiro` | `/parceiro` | Sem mudança |
| **Login** | `/login` | `/login` | Sem mudança |

### Arquivos Modificados (Estimativa)

- **Pastas movidas:** 15
- **Arquivos .tsx/.ts editados:** 25-35
- **Componentes navegação:** 4-6
- **Config files:** 1 (next.config.js)
- **Middleware:** 0 (já correto!)

### Riscos

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Links quebrados | Médio | Alto | Busca/substituição exaustiva + testes |
| SEO impacto | Baixo | Médio | Redirects 301 permanentes |
| Build errors | Baixo | Alto | TypeScript check antes de deploy |
| Regressões auth | Baixo | Crítico | Testes de middleware completos |

### Rollback Plan

Se algo der errado após deploy:

1. **Revert Git:** `git revert <commit-hash>`
2. **Redirects temporários:** Adicionar redirects reversos `/dashboard` → `/app/dashboard` (temporário)
3. **Deploy anterior:** Vercel instant rollback

---

## ✅ CHECKLIST DE EXECUÇÃO

### PRÉ-MIGRAÇÃO
- [ ] Backup do código atual (Git tag)
- [ ] Criar branch: `git checkout -b feat/single-domain-consolidation`
- [ ] Documentar rotas atuais (este documento)
- [ ] Comunicar equipe sobre mudança

### MIGRAÇÃO
- [ ] **ETAPA 1:** Reestruturar pastas (2h)
- [ ] **ETAPA 2:** Buscar/substituir paths (3h)
- [ ] **ETAPA 3:** Atualizar componentes navegação (2h)
- [ ] **ETAPA 4:** Configurar redirects (1h)
- [ ] **ETAPA 5:** Testes & validação (4h)

### PÓS-MIGRAÇÃO
- [ ] Build de produção: `npm run build`
- [ ] Testes E2E completos
- [ ] Deploy staging para validação
- [ ] Deploy produção
- [ ] Monitorar erros (Sentry) primeiras 24h
- [ ] Atualizar documentação
- [ ] Comunicar usuários (se necessário)

---

## 📊 MÉTRICAS DE SUCESSO

### KPIs para Validar Sucesso

1. **Zero links quebrados** - Todas rotas funcionais
2. **Redirects 301 ativos** - SEO preservado
3. **Build passing** - Zero erros TypeScript
4. **Lighthouse >90** - Performance mantida
5. **Zero regressões auth** - Login/logout funcionais
6. **User feedback positivo** - UX melhorada

### Antes vs Depois

| Métrica | ANTES | DEPOIS | Meta |
|---------|-------|--------|------|
| Domínios usados | 2 (www + app) | 1 (www) | ✅ |
| Mudanças de domínio/sessão | 2-3x | 0 | ✅ |
| Confusão usuário | Alta | Baixa | ✅ |
| Links hardcoded `/app/` | 14+ | 0 | ✅ |
| Redirects 301 | 8 | 11 | ✅ |

---

## 🚀 CRONOGRAMA

### Estimativa Conservadora: 12-16h (2-3 dias)

**DIA 1 (8h):**
- Manhã (4h): ETAPA 1 + ETAPA 2 (reestruturar + buscar/substituir)
- Tarde (4h): ETAPA 3 (componentes navegação)

**DIA 2 (6h):**
- Manhã (2h): ETAPA 4 (redirects)
- Tarde (4h): ETAPA 5 (testes)

**DIA 3 (2h):**
- Deploy staging + produção
- Monitoramento

### Fast-Track: 8-10h (1 dia intenso)

Se necessário urgente, pode ser feito em 1 dia com foco total.

---

## 📝 NOTAS FINAIS

### Benefícios Esperados

1. **UX Unificada** - Usuário nunca sai de www.garcezpalha.com
2. **Menos Confusão** - Login único, navegação clara
3. **SEO Melhorado** - Single domain authority
4. **Manutenção Simples** - Menos complexidade
5. **Performance** - Menos redirects entre domínios

### Próximos Passos Após Migração

1. **Monitorar analytics** - Verificar impacto em conversões
2. **Coletar feedback** - Usuários notam melhoria?
3. **Documentar learnings** - Para futuras migrações
4. **Otimizar SEO** - Aproveitar consolidação de domínio

---

**Gerado por:** MANUS v7.0 Architecture Planning Agent
**Data:** 01/01/2025 - 02:00
**Versão:** 1.0
**Status:** PRONTO PARA EXECUÇÃO
