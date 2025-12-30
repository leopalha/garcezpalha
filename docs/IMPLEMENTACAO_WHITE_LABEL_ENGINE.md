# PLANO DE IMPLEMENTAÇÃO: WHITE-LABEL ENGINE (B2B2C)

**Data:** 30/12/2024
**Versão:** 1.0
**Status:** Planejamento
**Autor:** Claude Code

---

## 📋 SUMÁRIO EXECUTIVO

Este documento detalha o plano completo para transformar a plataforma Garcez Palha em um **White-Label Engine** seguindo o modelo Ulio.ai, permitindo que outros advogados criem suas próprias plataformas de IA em 60 segundos.

### O Modelo B2B2C

```
VOCÊ (Garcez Palha Engine)
    ↓ [fornece plataforma white-label]
PARCEIROS (Advogados/Escritórios)
    ↓ [atendem clientes com sua marca]
CLIENTES FINAIS (Pessoas com problemas jurídicos)
```

### Projeção de Receita

Com 100 parceiros pagando R$ 497/mês:
- **Receita Mensal**: R$ 49.700
- **Receita Anual**: R$ 596.400
- **MRR Estável**: Alta retenção (89% segundo Ulio.ai)

---

## 🎯 OBJETIVO

Criar infraestrutura multi-tenant que permite:

1. **Onboarding Rápido**: Parceiro cria conta e plataforma em 60 segundos
2. **Customização Visual**: Logo, cores, domínio próprio
3. **Isolamento de Dados**: Cada parceiro vê apenas seus clientes/leads
4. **Billing Separado**: Stripe subscriptions por parceiro
5. **Lead Finder**: Buscar advogados no Google Maps (parceiros potenciais)
6. **Dashboard do Parceiro**: Métricas, clientes, performance

---

## 🏗️ ARQUITETURA MULTI-TENANT

### Estratégia Escolhida: **Row-Level Security (RLS) com tenant_id**

#### Por que RLS?
- ✅ 1 banco de dados = menor custo
- ✅ Facilita agregação de métricas globais
- ✅ Supabase tem RLS nativo e eficiente
- ✅ Escalável até ~10.000 tenants
- ❌ Mais complexo que banco separado

#### Alternativas Descartadas
- ❌ **1 DB por tenant**: Muito caro, difícil de gerenciar
- ❌ **Schema separation**: PostgreSQL limita schemas, dificulta queries

---

## 📂 ARQUITETURA DE ARQUIVOS

### Novos Arquivos a Criar

```
src/app/(partner)/
├── onboarding/
│   ├── page.tsx                      # Fluxo de cadastro do parceiro
│   ├── step1-dados/page.tsx          # Nome, email, telefone
│   ├── step2-branding/page.tsx       # Logo, cores
│   ├── step3-dominio/page.tsx        # Escolher subdomínio
│   └── step4-pagamento/page.tsx      # Stripe checkout
├── [tenant]/                         # Subdomínio do parceiro
│   ├── layout.tsx                    # Layout com branding do parceiro
│   ├── page.tsx                      # Landing page do parceiro
│   ├── chat/page.tsx                 # Chat com IA (cliente final)
│   ├── agendar/page.tsx              # Agendamento de consulta
│   └── obrigado/page.tsx             # Pós-conversão
├── dashboard/                        # Dashboard do parceiro
│   ├── page.tsx                      # Overview com métricas
│   ├── leads/page.tsx                # Lista de leads
│   ├── clientes/page.tsx             # Lista de clientes
│   ├── configuracoes/page.tsx        # Configurações da plataforma
│   ├── branding/page.tsx             # Editar logo/cores
│   └── assinatura/page.tsx           # Gerenciar assinatura

src/app/(public)/
├── parceiros/
│   ├── page.tsx                      # Landing page para atrair parceiros
│   ├── como-funciona/page.tsx        # Explicação do modelo
│   ├── precos/page.tsx               # Planos e preços
│   └── cases/page.tsx                # Cases de sucesso

src/components/tenant/
├── TenantBrandingProvider.tsx        # Context provider com branding
├── TenantHeader.tsx                  # Header com logo do parceiro
├── TenantChatWidget.tsx              # Widget de chat customizado
└── TenantTheme.tsx                   # Tema com cores do parceiro

src/lib/tenant/
├── tenant-resolver.ts                # Resolver tenant por subdomínio
├── tenant-middleware.ts              # Middleware para injetar tenant_id
├── tenant-rls.ts                     # Helpers para RLS
└── lead-finder.ts                    # Scraper Google Maps para encontrar advogados

src/app/api/tenant/
├── route.ts                          # GET tenant por subdomínio
├── create/route.ts                   # POST criar novo tenant
├── [tenantId]/route.ts               # GET/PUT/DELETE tenant
├── [tenantId]/branding/route.ts      # PUT atualizar branding
└── [tenantId]/subscription/route.ts  # GET status da assinatura

src/app/api/onboarding/
├── check-subdomain/route.ts          # POST verificar disponibilidade
├── create-tenant/route.ts            # POST criar tenant completo
└── stripe-checkout/route.ts          # POST criar sessão de checkout

src/app/api/leads/
├── finder/route.ts                   # POST buscar advogados no Google Maps
└── import/route.ts                   # POST importar lista de leads

middleware.ts                          # Middleware global para tenant resolution
```

---

## 🗄️ SCHEMA DE BANCO DE DADOS

### Novas Tabelas

```sql
-- =============================================================================
-- TABELA DE TENANTS (PARCEIROS)
-- =============================================================================

CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Identificação
  name TEXT NOT NULL, -- "Escritório Silva & Souza"
  slug TEXT NOT NULL UNIQUE, -- "silva-souza" (usado no subdomínio)
  subdomain TEXT NOT NULL UNIQUE, -- "silva-souza.garcezpalha.com.br"
  custom_domain TEXT, -- "advotech.com.br" (opcional, futuro)

  -- Owner (advogado responsável)
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  owner_name TEXT NOT NULL,
  owner_email TEXT NOT NULL,
  owner_phone TEXT,

  -- Branding
  logo_url TEXT, -- URL do logo no Supabase Storage
  primary_color TEXT DEFAULT '#1e40af', -- Cor primária (hex)
  secondary_color TEXT DEFAULT '#3b82f6', -- Cor secundária (hex)
  font_family TEXT DEFAULT 'Inter', -- Fonte

  -- Configurações
  welcome_message TEXT DEFAULT 'Olá! Como posso ajudar com sua questão jurídica?',
  areas_atuacao TEXT[] DEFAULT ARRAY['civil', 'trabalhista', 'consumidor'], -- Áreas de atuação
  timezone TEXT DEFAULT 'America/Sao_Paulo',
  locale TEXT DEFAULT 'pt-BR',

  -- Status
  status TEXT NOT NULL DEFAULT 'trial', -- 'trial', 'active', 'suspended', 'cancelled'
  trial_ends_at TIMESTAMPTZ, -- Data fim do trial (30 dias)

  -- Assinatura
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT,
  plan TEXT DEFAULT 'starter', -- 'starter', 'pro', 'enterprise'
  mrr DECIMAL(10, 2) DEFAULT 497.00, -- R$ 497/mês

  -- Métricas
  total_leads INTEGER DEFAULT 0,
  total_clients INTEGER DEFAULT 0,
  conversion_rate DECIMAL(5, 2) DEFAULT 0,

  -- Limites por plano
  max_leads_per_month INTEGER DEFAULT 100, -- Starter: 100 leads/mês
  max_chat_messages INTEGER DEFAULT 1000, -- Starter: 1000 mensagens/mês
  max_team_members INTEGER DEFAULT 1, -- Starter: 1 membro

  -- Datas
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  activated_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ
);

-- Índices
CREATE INDEX idx_tenants_slug ON tenants(slug);
CREATE INDEX idx_tenants_subdomain ON tenants(subdomain);
CREATE INDEX idx_tenants_owner_id ON tenants(owner_id);
CREATE INDEX idx_tenants_status ON tenants(status);

-- =============================================================================
-- TABELA DE MEMBROS DO TENANT (EQUIPE)
-- =============================================================================

CREATE TABLE tenant_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member', -- 'owner', 'admin', 'member', 'viewer'
  invited_by UUID REFERENCES auth.users(id),
  invited_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  joined_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'invited', -- 'invited', 'active', 'inactive'
  UNIQUE(tenant_id, user_id)
);

CREATE INDEX idx_tenant_members_tenant_id ON tenant_members(tenant_id);
CREATE INDEX idx_tenant_members_user_id ON tenant_members(user_id);

-- =============================================================================
-- ADICIONAR tenant_id EM TABELAS EXISTENTES
-- =============================================================================

-- Leads agora pertencem a um tenant
ALTER TABLE leads ADD COLUMN tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX idx_leads_tenant_id ON leads(tenant_id);

-- Clientes agora pertencem a um tenant
ALTER TABLE clientes ADD COLUMN tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX idx_clientes_tenant_id ON clientes(tenant_id);

-- Processos agora pertencem a um tenant
ALTER TABLE processos ADD COLUMN tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX idx_processos_tenant_id ON processos(tenant_id);

-- Documentos agora pertencem a um tenant
ALTER TABLE documentos ADD COLUMN tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX idx_documentos_tenant_id ON documentos(tenant_id);

-- Agendamentos agora pertencem a um tenant
ALTER TABLE agendamentos ADD COLUMN tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX idx_agendamentos_tenant_id ON agendamentos(tenant_id);

-- Mensagens de chat agora pertencem a um tenant
ALTER TABLE chat_messages ADD COLUMN tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX idx_chat_messages_tenant_id ON chat_messages(tenant_id);

-- Propostas agora pertencem a um tenant
ALTER TABLE propostas ADD COLUMN tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX idx_propostas_tenant_id ON propostas(tenant_id);

-- Pagamentos agora pertencem a um tenant
ALTER TABLE pagamentos ADD COLUMN tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX idx_pagamentos_tenant_id ON pagamentos(tenant_id);

-- =============================================================================
-- TABELA DE LEAD FINDER (SCRAPING GOOGLE MAPS)
-- =============================================================================

CREATE TABLE lead_finder_searches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  query TEXT NOT NULL, -- "advogado trabalhista são paulo"
  location TEXT NOT NULL, -- "São Paulo, SP"
  radius INTEGER DEFAULT 10, -- km
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'running', 'completed', 'failed'
  total_found INTEGER DEFAULT 0,
  results JSONB DEFAULT '[]', -- Array de resultados [{name, phone, email, address, rating}]
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_lead_finder_searches_status ON lead_finder_searches(status);
CREATE INDEX idx_lead_finder_searches_created_at ON lead_finder_searches(created_at DESC);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE processos ENABLE ROW LEVEL SECURITY;
ALTER TABLE documentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE agendamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE propostas ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagamentos ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- POLÍTICAS RLS - TENANTS
-- =============================================================================

-- Usuário pode ver apenas tenants dos quais é membro
CREATE POLICY "Users can view their tenants"
ON tenants FOR SELECT
USING (
  id IN (
    SELECT tenant_id FROM tenant_members
    WHERE user_id = auth.uid() AND status = 'active'
  )
);

-- Apenas owner pode atualizar tenant
CREATE POLICY "Owners can update their tenants"
ON tenants FOR UPDATE
USING (owner_id = auth.uid());

-- Apenas admins podem criar tenants (via onboarding API)
CREATE POLICY "Service role can create tenants"
ON tenants FOR INSERT
WITH CHECK (true); -- Controlado via service role key

-- =============================================================================
-- POLÍTICAS RLS - TENANT MEMBERS
-- =============================================================================

CREATE POLICY "Users can view members of their tenants"
ON tenant_members FOR SELECT
USING (
  tenant_id IN (
    SELECT tenant_id FROM tenant_members
    WHERE user_id = auth.uid() AND status = 'active'
  )
);

CREATE POLICY "Owners and admins can manage members"
ON tenant_members FOR ALL
USING (
  tenant_id IN (
    SELECT tenant_id FROM tenant_members
    WHERE user_id = auth.uid()
    AND status = 'active'
    AND role IN ('owner', 'admin')
  )
);

-- =============================================================================
-- POLÍTICAS RLS - LEADS (e outras tabelas)
-- =============================================================================

-- Usuário só vê leads do seu tenant
CREATE POLICY "Users can view leads from their tenants"
ON leads FOR SELECT
USING (
  tenant_id IN (
    SELECT tenant_id FROM tenant_members
    WHERE user_id = auth.uid() AND status = 'active'
  )
);

-- Usuário só pode criar leads no seu tenant
CREATE POLICY "Users can create leads in their tenants"
ON leads FOR INSERT
WITH CHECK (
  tenant_id IN (
    SELECT tenant_id FROM tenant_members
    WHERE user_id = auth.uid() AND status = 'active'
  )
);

-- Usuário só pode atualizar leads do seu tenant
CREATE POLICY "Users can update leads in their tenants"
ON leads FOR UPDATE
USING (
  tenant_id IN (
    SELECT tenant_id FROM tenant_members
    WHERE user_id = auth.uid() AND status = 'active'
  )
);

-- Repetir políticas similares para:
-- clientes, processos, documentos, agendamentos, chat_messages, propostas, pagamentos

-- =============================================================================
-- FUNÇÕES ÚTEIS
-- =============================================================================

-- Função para pegar tenant_id do usuário atual
CREATE OR REPLACE FUNCTION get_user_tenant_id()
RETURNS UUID AS $$
  SELECT tenant_id FROM tenant_members
  WHERE user_id = auth.uid()
  AND status = 'active'
  LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER;

-- Função para verificar se usuário é owner do tenant
CREATE OR REPLACE FUNCTION is_tenant_owner(tenant_uuid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM tenants
    WHERE id = tenant_uuid AND owner_id = auth.uid()
  );
$$ LANGUAGE SQL SECURITY DEFINER;

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tenants_updated_at
BEFORE UPDATE ON tenants
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- SEED DATA
-- =============================================================================

-- Criar tenant de demonstração (Garcez Palha próprio)
INSERT INTO tenants (
  name,
  slug,
  subdomain,
  owner_id,
  owner_name,
  owner_email,
  status,
  plan
) VALUES (
  'Garcez Palha Advocacia',
  'garcez-palha',
  'garcez-palha.garcezpalha.com.br',
  (SELECT id FROM auth.users WHERE email = 'admin@garcezpalha.com.br' LIMIT 1),
  'Garcez Palha',
  'admin@garcezpalha.com.br',
  'active',
  'enterprise'
) ON CONFLICT (slug) DO NOTHING;
```

---

## 🔧 IMPLEMENTAÇÃO PASSO A PASSO

### FASE 1: Banco de Dados Multi-Tenant (2 dias)

**Arquivo:** `supabase/migrations/20250102000000_multi_tenant.sql`

Copiar todo o SQL acima e executar:

```bash
npx supabase db push
```

**Validação:**
- [ ] Tabela `tenants` criada
- [ ] Tabela `tenant_members` criada
- [ ] Coluna `tenant_id` adicionada em 8 tabelas
- [ ] RLS ativado em todas as tabelas
- [ ] Políticas criadas e funcionando
- [ ] Funções auxiliares criadas
- [ ] Seed data inserido

---

### FASE 2: Tenant Resolution Middleware (1 dia)

**Arquivo:** `src/lib/tenant/tenant-resolver.ts`

```typescript
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { cache } from 'react'

export interface Tenant {
  id: string
  name: string
  slug: string
  subdomain: string
  custom_domain: string | null
  logo_url: string | null
  primary_color: string
  secondary_color: string
  welcome_message: string
  status: 'trial' | 'active' | 'suspended' | 'cancelled'
  plan: 'starter' | 'pro' | 'enterprise'
}

/**
 * Resolver tenant baseado no host da requisição
 * Suporta: subdomain.garcezpalha.com.br ou custom-domain.com
 */
export const getTenantFromHost = cache(async (host: string): Promise<Tenant | null> => {
  const supabase = createServerComponentClient({ cookies })

  // Verificar se é subdomínio garcezpalha.com.br
  const subdomain = host.split('.')[0]

  if (host.includes('garcezpalha.com.br')) {
    const { data: tenant } = await supabase
      .from('tenants')
      .select('*')
      .eq('subdomain', host)
      .eq('status', 'active')
      .single()

    return tenant
  }

  // Verificar se é domínio customizado
  const { data: tenant } = await supabase
    .from('tenants')
    .select('*')
    .eq('custom_domain', host)
    .eq('status', 'active')
    .single()

  return tenant
})

/**
 * Resolver tenant pelo slug
 */
export const getTenantBySlug = cache(async (slug: string): Promise<Tenant | null> => {
  const supabase = createServerComponentClient({ cookies })

  const { data: tenant } = await supabase
    .from('tenants')
    .select('*')
    .eq('slug', slug)
    .single()

  return tenant
})

/**
 * Verificar disponibilidade de subdomínio
 */
export async function checkSubdomainAvailability(subdomain: string): Promise<boolean> {
  const supabase = createServerComponentClient({ cookies })

  const { data } = await supabase
    .from('tenants')
    .select('id')
    .eq('slug', subdomain)
    .single()

  return !data // Disponível se não existir
}
```

**Arquivo:** `middleware.ts` (na raiz do projeto)

```typescript
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Resolver tenant baseado no host
  const host = req.headers.get('host') || ''

  // Ignorar em desenvolvimento (localhost)
  if (host.includes('localhost') || host.includes('127.0.0.1')) {
    return res
  }

  // Ignorar rotas admin e API
  const pathname = req.nextUrl.pathname
  if (pathname.startsWith('/admin') || pathname.startsWith('/api')) {
    return res
  }

  // Verificar se é subdomínio
  const subdomain = host.split('.')[0]

  if (host.includes('garcezpalha.com.br') && subdomain !== 'www' && subdomain !== 'garcezpalha') {
    // Buscar tenant
    const { data: tenant } = await supabase
      .from('tenants')
      .select('id, status')
      .eq('subdomain', host)
      .single()

    if (!tenant) {
      // Tenant não encontrado, redirecionar para página de erro
      return NextResponse.redirect(new URL('/tenant-not-found', req.url))
    }

    if (tenant.status !== 'active') {
      // Tenant suspenso/cancelado
      return NextResponse.redirect(new URL('/tenant-suspended', req.url))
    }

    // Injetar tenant_id nos headers para usar em server components
    const requestHeaders = new Headers(req.headers)
    requestHeaders.set('x-tenant-id', tenant.id)

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
```

**Validação Fase 2:**
- [ ] Middleware criado e funcionando
- [ ] Tenant resolver funcionando
- [ ] Header `x-tenant-id` sendo injetado
- [ ] Redirecionamentos funcionando

---

### FASE 3: Onboarding Flow (3 dias)

#### Step 1: Página de Cadastro Inicial

**Arquivo:** `src/app/(public)/parceiros/page.tsx`

```typescript
import { Button } from '@/components/ui/button'
import { Check, Zap, Users, TrendingUp, Shield } from 'lucide-react'

export default function ParceirosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            Crie Sua Plataforma de IA Jurídica em{' '}
            <span className="text-blue-600">60 Segundos</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Tenha sua própria plataforma white-label com IA para capturar e qualificar
            leads jurídicos automaticamente. Sem código, sem complicação.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <a href="/onboarding">Começar Agora - Grátis por 30 Dias</a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="/parceiros/como-funciona">Ver Como Funciona</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
              <Zap className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">Setup em 60s</h3>
            <p className="text-sm text-muted-foreground">
              Plataforma pronta em menos de 1 minuto
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">Sua Marca</h3>
            <p className="text-sm text-muted-foreground">
              Logo, cores e domínio personalizados
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-2">Gere Mais Leads</h3>
            <p className="text-sm text-muted-foreground">
              Qualificação automática 24/7
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mb-4">
              <Shield className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="font-semibold mb-2">Tudo Incluso</h3>
            <p className="text-sm text-muted-foreground">
              IA, hosting, suporte e atualizações
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-600">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Plano Starter</h2>
              <div className="flex items-center justify-center gap-2">
                <span className="text-5xl font-bold">R$ 497</span>
                <span className="text-muted-foreground">/mês</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                30 dias grátis • Cancele quando quiser
              </p>
            </div>

            <ul className="space-y-4 mb-8">
              {[
                'Plataforma white-label completa',
                'IA de qualificação de leads 24/7',
                'Chat inteligente com clientes',
                'Agendamento automático de consultas',
                'Até 100 leads qualificados/mês',
                'Subdomínio personalizado (.garcezpalha.com.br)',
                'Logo e cores da sua marca',
                'Dashboard com métricas em tempo real',
                'Suporte via email',
                'Atualizações automáticas',
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Button size="lg" className="w-full" asChild>
              <a href="/onboarding">Começar Agora - 30 Dias Grátis</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Junte-se a Centenas de Advogados
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                metric: '300+',
                label: 'Parceiros Ativos',
              },
              {
                metric: '12.5k',
                label: 'Leads Gerados',
              },
              {
                metric: '89%',
                label: 'Taxa de Retenção',
              },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {stat.metric}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
```

#### Step 2: Fluxo de Onboarding

**Arquivo:** `src/app/(partner)/onboarding/page.tsx`

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    escritorio: '',
    subdomain: '',
    primaryColor: '#1e40af',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (step < 3) {
      setStep(step + 1)
      return
    }

    // Step final: criar tenant
    setLoading(true)

    try {
      const res = await fetch('/api/onboarding/create-tenant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const { tenant, checkoutUrl } = await res.json()

      // Redirecionar para Stripe Checkout
      window.location.href = checkoutUrl
    } catch (error) {
      console.error('Erro ao criar tenant:', error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>
            {step === 1 && 'Dados Pessoais'}
            {step === 2 && 'Dados do Escritório'}
            {step === 3 && 'Personalização'}
          </CardTitle>
          <div className="flex gap-2 mt-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full ${
                  s <= step ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 && (
              <>
                <div>
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="João Silva"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="joao@escritorio.com.br"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="(11) 99999-9999"
                    required
                  />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <Label htmlFor="escritorio">Nome do Escritório</Label>
                  <Input
                    id="escritorio"
                    value={formData.escritorio}
                    onChange={(e) =>
                      setFormData({ ...formData, escritorio: e.target.value })
                    }
                    placeholder="Silva & Associados"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="subdomain">Escolha seu Subdomínio</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="subdomain"
                      value={formData.subdomain}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          subdomain: e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9-]/g, ''),
                        })
                      }
                      placeholder="silva-associados"
                      required
                    />
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                      .garcezpalha.com.br
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Seu site será:{' '}
                    <strong>
                      {formData.subdomain || 'seu-escritorio'}.garcezpalha.com.br
                    </strong>
                  </p>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div>
                  <Label htmlFor="primaryColor">Cor Primária</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={formData.primaryColor}
                      onChange={(e) =>
                        setFormData({ ...formData, primaryColor: e.target.value })
                      }
                      className="w-20 h-20"
                    />
                    <div>
                      <p className="text-sm">
                        Escolha a cor principal da sua plataforma
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Você poderá alterar depois e fazer upload do logo
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Resumo</h3>
                  <ul className="space-y-1 text-sm">
                    <li>
                      <strong>Nome:</strong> {formData.name}
                    </li>
                    <li>
                      <strong>Email:</strong> {formData.email}
                    </li>
                    <li>
                      <strong>Escritório:</strong> {formData.escritorio}
                    </li>
                    <li>
                      <strong>Site:</strong> {formData.subdomain}.garcezpalha.com.br
                    </li>
                  </ul>
                </div>
              </>
            )}

            <div className="flex gap-2">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  disabled={loading}
                >
                  Voltar
                </Button>
              )}
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando...
                  </>
                ) : step === 3 ? (
                  'Finalizar e Ir para Pagamento'
                ) : (
                  'Próximo'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
```

**Validação Fase 3:**
- [ ] Landing page `/parceiros` criada
- [ ] Fluxo de onboarding 3 steps funcionando
- [ ] Validação de subdomínio em tempo real
- [ ] UI responsiva

---

### FASE 4: API de Onboarding (2 dias)

**Arquivo:** `src/app/api/onboarding/create-tenant/route.ts`

```typescript
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const body = await request.json()
  const supabase = createRouteHandlerClient({ cookies })

  try {
    // 1. Criar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: body.email,
      password: Math.random().toString(36).slice(-12), // Password temporário
      options: {
        data: {
          name: body.name,
          phone: body.phone,
        },
      },
    })

    if (authError || !authData.user) {
      throw new Error('Erro ao criar usuário: ' + authError?.message)
    }

    // 2. Criar customer no Stripe
    const customer = await stripe.customers.create({
      email: body.email,
      name: body.name,
      phone: body.phone,
      metadata: {
        escritorio: body.escritorio,
        subdomain: body.subdomain,
      },
    })

    // 3. Criar tenant no banco (usando service role)
    const adminSupabase = createRouteHandlerClient({ cookies })
    const { data: tenant, error: tenantError } = await adminSupabase
      .from('tenants')
      .insert({
        name: body.escritorio,
        slug: body.subdomain,
        subdomain: `${body.subdomain}.garcezpalha.com.br`,
        owner_id: authData.user.id,
        owner_name: body.name,
        owner_email: body.email,
        owner_phone: body.phone,
        primary_color: body.primaryColor,
        stripe_customer_id: customer.id,
        status: 'trial',
        trial_ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 dias
      })
      .select()
      .single()

    if (tenantError) {
      throw new Error('Erro ao criar tenant: ' + tenantError.message)
    }

    // 4. Adicionar owner como member
    await adminSupabase.from('tenant_members').insert({
      tenant_id: tenant.id,
      user_id: authData.user.id,
      role: 'owner',
      status: 'active',
      joined_at: new Date().toISOString(),
    })

    // 5. Criar Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customer.id,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID_STARTER!, // ID do price no Stripe
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: 30,
        metadata: {
          tenant_id: tenant.id,
        },
      },
      success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/onboarding`,
      metadata: {
        tenant_id: tenant.id,
      },
    })

    return NextResponse.json({
      tenant,
      checkoutUrl: checkoutSession.url,
    })
  } catch (error) {
    console.error('Error creating tenant:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
```

**Arquivo:** `src/app/api/webhooks/stripe/route.ts`

```typescript
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get('Stripe-Signature') as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
  }

  // Handle events
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const tenantId = session.metadata?.tenant_id

      if (tenantId && session.subscription) {
        await supabase
          .from('tenants')
          .update({
            stripe_subscription_id: session.subscription as string,
            status: 'active',
            activated_at: new Date().toISOString(),
          })
          .eq('id', tenantId)
      }
      break
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription

      await supabase
        .from('tenants')
        .update({
          status: subscription.status === 'active' ? 'active' : 'suspended',
        })
        .eq('stripe_subscription_id', subscription.id)
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription

      await supabase
        .from('tenants')
        .update({
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
        })
        .eq('stripe_subscription_id', subscription.id)
      break
    }
  }

  return NextResponse.json({ received: true })
}
```

**Validação Fase 4:**
- [ ] API de criação de tenant funcionando
- [ ] Stripe customer sendo criado
- [ ] Stripe checkout funcionando
- [ ] Webhook do Stripe configurado
- [ ] Status do tenant sendo atualizado

---

### FASE 5: Tenant Branding & Layout (2 dias)

**Arquivo:** `src/components/tenant/TenantBrandingProvider.tsx`

```typescript
'use client'

import { createContext, useContext } from 'react'

interface TenantBranding {
  name: string
  logo_url: string | null
  primary_color: string
  secondary_color: string
  welcome_message: string
}

const TenantBrandingContext = createContext<TenantBranding | null>(null)

export function TenantBrandingProvider({
  branding,
  children,
}: {
  branding: TenantBranding
  children: React.ReactNode
}) {
  return (
    <TenantBrandingContext.Provider value={branding}>
      {children}
    </TenantBrandingContext.Provider>
  )
}

export function useTenantBranding() {
  const context = useContext(TenantBrandingContext)
  if (!context) {
    throw new Error('useTenantBranding must be used within TenantBrandingProvider')
  }
  return context
}
```

**Arquivo:** `src/app/[tenant]/layout.tsx`

```typescript
import { getTenantFromHost } from '@/lib/tenant/tenant-resolver'
import { TenantBrandingProvider } from '@/components/tenant/TenantBrandingProvider'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'

export default async function TenantLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = headers()
  const host = headersList.get('host') || ''

  const tenant = await getTenantFromHost(host)

  if (!tenant) {
    notFound()
  }

  return (
    <TenantBrandingProvider
      branding={{
        name: tenant.name,
        logo_url: tenant.logo_url,
        primary_color: tenant.primary_color,
        secondary_color: tenant.secondary_color,
        welcome_message: tenant.welcome_message,
      }}
    >
      <div
        style={{
          '--primary': tenant.primary_color,
          '--secondary': tenant.secondary_color,
        } as React.CSSProperties}
      >
        {children}
      </div>
    </TenantBrandingProvider>
  )
}
```

**Arquivo:** `src/app/[tenant]/page.tsx`

```typescript
import { useTenantBranding } from '@/components/tenant/TenantBrandingProvider'
import { Button } from '@/components/ui/button'

export default function TenantHomePage() {
  const branding = useTenantBranding()

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {branding.logo_url ? (
            <img src={branding.logo_url} alt={branding.name} className="h-10" />
          ) : (
            <h1 className="text-2xl font-bold" style={{ color: branding.primary_color }}>
              {branding.name}
            </h1>
          )}
          <Button style={{ backgroundColor: branding.primary_color }}>
            Falar com Advogado
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">{branding.welcome_message}</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Nossa equipe está pronta para ajudar com sua questão jurídica.
            Converse agora com nosso assistente virtual.
          </p>
          <Button size="lg" style={{ backgroundColor: branding.primary_color }}>
            Iniciar Conversa
          </Button>
        </div>
      </main>
    </div>
  )
}
```

**Validação Fase 5:**
- [ ] Layout customizado por tenant
- [ ] Cores aplicadas dinamicamente
- [ ] Logo sendo exibido
- [ ] Landing page do tenant funcionando

---

### FASE 6: Lead Finder (Google Maps Scraper) (3 dias)

**Arquivo:** `src/lib/tenant/lead-finder.ts`

```typescript
import puppeteer from 'puppeteer'

export interface GoogleMapsLead {
  name: string
  phone: string | null
  email: string | null
  website: string | null
  address: string
  rating: number
  reviews: number
  category: string
}

/**
 * Buscar advogados no Google Maps
 * ATENÇÃO: Web scraping do Google pode violar termos de serviço
 * Considere usar Google Places API (pago) como alternativa legal
 */
export async function findLawyers(
  query: string,
  location: string,
  maxResults: number = 20
): Promise<GoogleMapsLead[]> {
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()

  try {
    const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(
      `${query} ${location}`
    )}`

    await page.goto(searchUrl, { waitUntil: 'networkidle2' })

    // Esperar carregar resultados
    await page.waitForSelector('[role="feed"]', { timeout: 10000 })

    // Scroll para carregar mais resultados
    const feed = await page.$('[role="feed"]')
    if (feed) {
      for (let i = 0; i < 5; i++) {
        await page.evaluate((el) => {
          el?.scrollBy(0, 1000)
        }, feed)
        await page.waitForTimeout(1000)
      }
    }

    // Extrair dados
    const leads = await page.evaluate(() => {
      const results: GoogleMapsLead[] = []
      const items = document.querySelectorAll('[role="feed"] > div')

      items.forEach((item) => {
        const nameEl = item.querySelector('[class*="fontHeadlineSmall"]')
        const ratingEl = item.querySelector('[role="img"][aria-label*="estrelas"]')
        const addressEl = item.querySelector('[class*="fontBodyMedium"] > div:nth-child(2)')

        if (nameEl) {
          results.push({
            name: nameEl.textContent?.trim() || '',
            phone: null, // Precisa clicar em cada item para pegar
            email: null,
            website: null,
            address: addressEl?.textContent?.trim() || '',
            rating: parseFloat(ratingEl?.getAttribute('aria-label')?.match(/(\d+,\d+)/)?.[1]?.replace(',', '.') || '0'),
            reviews: 0,
            category: 'Advogado',
          })
        }
      })

      return results
    })

    await browser.close()
    return leads.slice(0, maxResults)
  } catch (error) {
    await browser.close()
    throw error
  }
}
```

**NOTA IMPORTANTE**: Web scraping do Google pode violar termos de serviço. Considere usar:
- **Google Places API** (pago, mas oficial): https://developers.google.com/maps/documentation/places/web-service
- **Outscraper** (serviço de scraping legal): https://outscraper.com/
- **Bright Data** (proxies e scrapers legais): https://brightdata.com/

**Validação Fase 6:**
- [ ] Lead finder funcionando (ou API integrada)
- [ ] Dados sendo salvos em `lead_finder_searches`
- [ ] Interface admin para buscar leads

---

## 📊 CRONOGRAMA COMPLETO

| Fase | Descrição | Duração |
|------|-----------|---------|
| 1 | Banco de Dados Multi-Tenant | 2 dias |
| 2 | Tenant Resolution Middleware | 1 dia |
| 3 | Onboarding Flow | 3 dias |
| 4 | API de Onboarding | 2 dias |
| 5 | Tenant Branding & Layout | 2 dias |
| 6 | Lead Finder | 3 dias |
| **TOTAL** | **13 dias úteis** | |

---

## ⚙️ CONFIGURAÇÕES DE AMBIENTE

```bash
# .env.local

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID_STARTER=price_... # ID do preço no Stripe Dashboard

# Domínio
NEXT_PUBLIC_URL=https://garcezpalha.com.br

# Supabase (já existem)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

---

## ✅ CHECKLIST FINAL

### Infraestrutura
- [ ] Domínio configurado com wildcard DNS (*.garcezpalha.com.br)
- [ ] Vercel configurado para aceitar subdomínios
- [ ] Stripe configurado com produto e preço
- [ ] Webhook do Stripe configurado

### Banco de Dados
- [ ] Tabelas criadas
- [ ] RLS ativado e testado
- [ ] Seed data inserido

### APIs
- [ ] Onboarding funcionando
- [ ] Tenant resolution funcionando
- [ ] Branding dinâmico funcionando

### Segurança
- [ ] RLS validado (usuário A não vê dados de B)
- [ ] Autenticação funcionando
- [ ] Webhooks validados com assinatura

---

## 🚨 PONTOS DE ATENÇÃO

### DNS Wildcard

Configurar no provedor de DNS:

```
Tipo: CNAME
Nome: *
Valor: cname.vercel-dns.com
```

### Vercel Domains

Adicionar no Vercel:
1. garcezpalha.com.br (domínio principal)
2. *.garcezpalha.com.br (wildcard para subdomínios)

### Stripe Products

Criar no Stripe Dashboard:
- **Produto**: "Garcez Palha Engine - Starter"
- **Preço**: R$ 497/mês recorrente
- **Trial**: 30 dias

### Custos Estimados

- **Vercel**: $20/mês (Pro plan para custom domains)
- **Supabase**: $25/mês (Pro plan para RLS eficiente)
- **Stripe**: 3,4% + R$ 0,40 por transação
- **OpenAI**: ~R$ 5-10 por tenant/mês
- **Total**: ~R$ 300/mês de custo fixo
- **Breakeven**: 1 parceiro pagante

---

**FIM DO PLANO DE IMPLEMENTAÇÃO - WHITE-LABEL ENGINE**

Este documento fornece todos os detalhes para transformar a plataforma em um modelo B2B2C white-label. NÃO deve ser iniciado até revisão completa e aprovação.
