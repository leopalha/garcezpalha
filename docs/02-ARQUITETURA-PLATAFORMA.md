# 02 - ARQUITETURA DA PLATAFORMA
## Garcez Palha - Inteligência Jurídica

---

## 1. VISÃO GERAL DA ARQUITETURA

### 1.1 Conceito

```
PLATAFORMA JURÍDICA INTELIGENTE

Uma máquina que:
1. CAPTURA leads via ads e SEO
2. QUALIFICA automaticamente via IA
3. FECHA contratos com pagamento digital
4. PRODUZ documentos jurídicos com IA
5. MONITORA processos automaticamente
6. ESCALA sem aumentar equipe
```

### 1.2 Diagrama de Alto Nível

```
┌──────────────────────────────────────────────────────────────────────┐
│                        GARCEZ PALHA PLATFORM                          │
└──────────────────────────────────────────────────────────────────────┘
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         │                         │                         │
         ▼                         ▼                         ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   AQUISIÇÃO     │     │   CONVERSÃO     │     │   PRODUÇÃO      │
│                 │     │                 │     │                 │
│ • Landing Pages │────▶│ • IA Triagem    │────▶│ • IA Petições   │
│ • Google Ads    │     │ • Qualificação  │     │ • Templates     │
│ • SEO/Conteúdo  │     │ • Precificação  │     │ • Revisão       │
│ • Redes Sociais │     │ • Proposta      │     │ • Protocolo     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                   │
                                   ▼
                        ┌─────────────────┐
                        │   FECHAMENTO    │
                        │                 │
                        │ • Contrato      │
                        │ • Pagamento     │
                        │ • Onboarding    │
                        └─────────────────┘
                                   │
                                   ▼
                        ┌─────────────────┐
                        │   ENTREGA       │
                        │                 │
                        │ • Monitoramento │
                        │ • Notificações  │
                        │ • Resultado     │
                        └─────────────────┘
```

---

## 2. STACK TECNOLÓGICA

### 2.1 Frontend

```
WEBSITE PRINCIPAL
├── Framework: Next.js 14 (App Router)
├── Hosting: Vercel
├── Styling: Tailwind CSS
├── Componentes: shadcn/ui
└── Domínio: garcezpalha.com

LANDING PAGES (MVPs)
├── Carrd (R$ 19/ano) - rápido
└── Webflow (R$ 14/mês) - mais controle
```

### 2.2 Backend

```
API / AUTOMAÇÃO
├── n8n (self-hosted ou cloud)
│   ├── Workflows de automação
│   ├── Integrações
│   └── Webhooks
├── Supabase
│   ├── Database (PostgreSQL)
│   ├── Auth
│   └── Storage
└── Vercel Functions
    └── APIs serverless
```

### 2.3 Inteligência Artificial

```
IA DE ATENDIMENTO
├── OpenAI GPT-4 (principal)
├── Claude (backup/específico)
└── Prompts customizados

IA DE PRODUÇÃO JURÍDICA
├── OpenAI GPT-4
├── Templates estruturados
└── Base de jurisprudência

INTEGRAÇÕES IA
├── WhatsApp → n8n → OpenAI
├── Formulário → n8n → OpenAI
└── Docs → OpenAI → Petição
```

### 2.4 Comunicação

```
WHATSAPP BUSINESS
├── API Oficial (Meta Business)
│   ├── Custo: ~R$ 0,30/conversa
│   └── Limite: ilimitado
├── Alternativa: Z-API
│   ├── Custo: R$ 65/mês
│   └── Mais simples
└── Alternativa: Evolution API
    ├── Custo: self-hosted
    └── Código aberto

EMAIL
├── Resend (transacional)
└── Gmail Workspace (operacional)
```

### 2.5 Pagamentos

```
GATEWAY PRINCIPAL
├── Mercado Pago
│   ├── Taxa: 4,99% + R$ 0,49
│   ├── PIX: 0,99%
│   └── Parcelamento: até 12x
└── Stripe (backup)
    ├── Taxa: 3,99% + R$ 0,39
    └── Internacional

ASSINATURA DIGITAL
├── ZapSign
│   ├── Custo: R$ 0,50/assinatura
│   └── Validade jurídica
└── Autentique (backup)
    └── 5 grátis/mês
```

### 2.6 Monitoramento Jurídico

```
PROCESSOS
├── Judit.io
│   ├── Custo: ~R$ 0,50/processo/mês
│   ├── Webhooks de movimentação
│   └── Cobertura nacional
└── Escavador (backup)

DIÁRIOS OFICIAIS
├── Judit.io (incluso)
└── DJE direto (manual)
```

### 2.7 CRM e Gestão

```
CRM
├── Notion (gratuito/inicial)
├── Pipedrive (R$ 59/mês)
└── HubSpot (gratuito/básico)

GESTÃO DE TAREFAS
├── Notion
└── Linear (dev)

DOCUMENTOS
├── Google Drive
├── Notion
└── Supabase Storage
```

---

## 3. FLUXO DE DADOS

### 3.1 Jornada do Lead

```
┌─────────────────────────────────────────────────────────────────────┐
│                        FLUXO: LEAD → CLIENTE                        │
└─────────────────────────────────────────────────────────────────────┘

[1] ENTRADA
    │
    ├── Google Ads → Landing Page → WhatsApp
    ├── SEO → Blog → WhatsApp
    └── Indicação → WhatsApp
    │
    ▼
[2] TRIAGEM (IA)
    │
    ├── Boas-vindas automáticas
    ├── Coleta de informações
    ├── Identificação do problema
    └── Classificação: QUALIFICADO / NÃO QUALIFICADO
    │
    ▼
[3] QUALIFICAÇÃO (IA + Humano)
    │
    ├── Perguntas específicas da área
    ├── Análise de viabilidade
    ├── Definição de complexidade
    └── Cálculo de preço
    │
    ▼
[4] PROPOSTA (IA)
    │
    ├── Geração automática
    ├── Envio via WhatsApp
    ├── Quebra de objeções
    └── Negociação (se necessário)
    │
    ▼
[5] FECHAMENTO
    │
    ├── Link de pagamento
    ├── Confirmação automática
    ├── Contrato digital
    └── Assinatura eletrônica
    │
    ▼
[6] ONBOARDING
    │
    ├── Mensagem de boas-vindas
    ├── Solicitação de documentos
    ├── Upload via formulário
    └── Confirmação de recebimento
    │
    ▼
[7] PRODUÇÃO
    │
    ├── IA gera petição/documento
    ├── Advogado revisa (5-15 min)
    ├── Ajustes finais
    └── Aprovação
    │
    ▼
[8] PROTOCOLO
    │
    ├── Submissão no tribunal
    ├── Captura do número
    ├── Registro no sistema
    └── Notificação ao cliente
    │
    ▼
[9] ACOMPANHAMENTO
    │
    ├── Monitoramento via Judit.io
    ├── Webhook de movimentação
    ├── Notificação automática
    └── Atualização do cliente
    │
    ▼
[10] RESULTADO
     │
     ├── Decisão favorável → Celebração
     ├── Decisão parcial → Explicação + Próximos passos
     └── Decisão desfavorável → Análise + Opções
```

### 3.2 Fluxo de Dados Técnico

```
┌─────────────────────────────────────────────────────────────────────┐
│                     ARQUITETURA DE DADOS                            │
└─────────────────────────────────────────────────────────────────────┘

                    ┌─────────────┐
                    │   SUPABASE  │
                    │  (Database) │
                    └──────┬──────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
         ▼                 ▼                 ▼
    ┌─────────┐      ┌─────────┐      ┌─────────┐
    │  Leads  │      │ Clientes│      │Processos│
    │ Table   │      │ Table   │      │ Table   │
    └─────────┘      └─────────┘      └─────────┘
         │                 │                 │
         │                 │                 │
         ▼                 ▼                 ▼
    ┌─────────────────────────────────────────────┐
    │                    n8n                       │
    │              (Automação Central)             │
    │                                              │
    │  ┌─────────┐  ┌─────────┐  ┌─────────┐     │
    │  │WhatsApp │  │ OpenAI  │  │Pagamento│     │
    │  │  Flow   │  │  Flow   │  │  Flow   │     │
    │  └─────────┘  └─────────┘  └─────────┘     │
    └─────────────────────────────────────────────┘
         │                 │                 │
         ▼                 ▼                 ▼
    ┌─────────┐      ┌─────────┐      ┌─────────┐
    │WhatsApp │      │  GPT-4  │      │Mercado  │
    │   API   │      │   API   │      │  Pago   │
    └─────────┘      └─────────┘      └─────────┘
```

---

## 4. MÓDULOS DO SISTEMA

### 4.1 Módulo de Aquisição

```
LANDING PAGE ENGINE
├── Página principal (todas as áreas)
├── Páginas por categoria
│   ├── /financeiro (bloqueio, PIX, negativação)
│   ├── /patrimonial (usucapião, holding, inventário)
│   ├── /saude (plano de saúde, TEA)
│   └── /previdenciario (BPC, aposentadoria)
├── Páginas por produto específico
│   ├── /desbloqueio-conta
│   ├── /golpe-pix
│   └── [...]
└── Blog (SEO)

ANALYTICS
├── Google Analytics 4
├── Google Tag Manager
├── Hotjar (heatmaps)
└── Conversões no GA4
```

### 4.2 Módulo de Conversão

```
IA DE ATENDIMENTO (WhatsApp)
├── Identificação de intenção
├── Roteamento por área
├── Qualificação automática
├── Geração de proposta
├── Quebra de objeções
├── Envio de link de pagamento
└── Escalonamento para humano

FORMULÁRIOS
├── Triagem inicial
├── Coleta de documentos
├── Questionário por área
└── Feedback pós-atendimento
```

### 4.3 Módulo de Fechamento

```
PAGAMENTOS
├── Geração de link (Mercado Pago)
├── Webhook de confirmação
├── Registro em banco de dados
├── Disparo de contrato
└── Notificação ao cliente

CONTRATOS
├── Templates por produto
├── Preenchimento automático
├── Envio via ZapSign
├── Webhook de assinatura
└── Armazenamento
```

### 4.4 Módulo de Produção

```
GERAÇÃO DE DOCUMENTOS
├── Coleta de dados do cliente
├── Seleção de template
├── Prompt para GPT-4
├── Geração da petição
├── Interface de revisão
├── Versionamento
└── Exportação (PDF/DOCX)

CONTROLE DE QUALIDADE
├── Checklist automático
├── Revisão humana obrigatória
├── Aprovação final
└── Log de alterações
```

### 4.5 Módulo de Entrega

```
PROTOCOLO
├── Interface para protocolo manual
├── Captura de número do processo
├── Registro no Judit.io
└── Notificação ao cliente

MONITORAMENTO
├── Integração Judit.io
├── Webhook de movimentação
├── Parser de decisões
├── Alertas automáticos
└── Dashboard de processos
```

---

## 5. INTEGRAÇÕES

### 5.1 Mapa de Integrações

```
┌─────────────────────────────────────────────────────────────────────┐
│                        INTEGRAÇÕES                                   │
└─────────────────────────────────────────────────────────────────────┘

ENTRADA DE DADOS
├── Google Ads API → Métricas de campanha
├── Google Analytics → Comportamento do usuário
├── WhatsApp API → Mensagens de entrada
└── Formulários Web → Dados de lead

PROCESSAMENTO
├── OpenAI API → IA de atendimento e produção
├── Supabase → Armazenamento de dados
├── n8n → Orquestração de fluxos
└── Google Docs API → Geração de documentos

SAÍDA / AÇÃO
├── WhatsApp API → Mensagens de saída
├── Mercado Pago API → Cobranças
├── ZapSign API → Contratos
├── Email (Resend) → Notificações
└── Judit.io API → Monitoramento

MONITORAMENTO
├── Judit.io → Processos judiciais
├── Sentry → Erros de aplicação
└── Grafana → Métricas de sistema
```

### 5.2 APIs Utilizadas

| Serviço | API | Custo | Uso |
|---------|-----|-------|-----|
| OpenAI | GPT-4 API | ~$0.03/1K tokens | IA |
| Meta | WhatsApp Business | R$ 0,30/conversa | Comunicação |
| Mercado Pago | Payments API | 4,99% + R$ 0,49 | Pagamentos |
| ZapSign | Signature API | R$ 0,50/assinatura | Contratos |
| Judit.io | Monitoring API | R$ 0,50/processo/mês | Processos |
| Supabase | Database + Auth | Free tier | Backend |
| Resend | Email API | Free tier | Email |
| Google | Analytics + Ads | Ads budget | Marketing |

---

## 6. SEGURANÇA

### 6.1 Dados Sensíveis

```
DADOS QUE ARMAZENAMOS
├── Nome completo
├── CPF
├── RG
├── Endereço
├── Documentos (contracheque, extratos)
├── Dados do processo
└── Comunicações

MEDIDAS DE SEGURANÇA
├── Criptografia em trânsito (HTTPS)
├── Criptografia em repouso (Supabase)
├── Acesso restrito (RLS)
├── Backup automático
├── Logs de acesso
└── LGPD compliance
```

### 6.2 Compliance

```
LGPD
├── Política de privacidade
├── Termos de uso
├── Consentimento explícito
├── Direito de exclusão
└── Portabilidade de dados

OAB
├── Publicidade dentro das normas
├── Honorários documentados
├── Sigilo profissional
└── Responsabilidade técnica
```

---

## 7. ESCALABILIDADE

### 7.1 Gargalos e Soluções

| Gargalo | Volume | Solução |
|---------|--------|---------|
| WhatsApp | >500 msg/dia | Múltiplos números |
| OpenAI | >10k tokens/min | Rate limiting, cache |
| Supabase | >500 conexões | Upgrade plano |
| Revisão humana | >20 petições/dia | Contratar revisor |
| Protocolo manual | >30/dia | Automação futura |

### 7.2 Roadmap de Escala

```
FASE 1: MVP (0-20 clientes/mês)
├── 1 número WhatsApp
├── Supabase Free
├── n8n Cloud básico
└── Revisão: Leonardo

FASE 2: CRESCIMENTO (20-50 clientes/mês)
├── WhatsApp Business API oficial
├── Supabase Pro
├── n8n Cloud intermediário
└── Revisor contratado (PJ)

FASE 3: ESCALA (50-100 clientes/mês)
├── Múltiplos números WhatsApp
├── Supabase Team
├── n8n Enterprise ou self-hosted
├── Equipe: 1 revisor + 1 atendimento
└── Dashboard de gestão

FASE 4: ENTERPRISE (100+ clientes/mês)
├── Infraestrutura dedicada
├── Time completo
├── White-label para parceiros
└── Expansão nacional
```

---

## 8. AMBIENTES

### 8.1 Desenvolvimento

```
LOCAL
├── Next.js dev server
├── Supabase local (Docker)
├── n8n local (Docker)
└── Ngrok para webhooks

STAGING
├── Vercel Preview
├── Supabase staging project
├── n8n staging instance
└── WhatsApp: número de teste
```

### 8.2 Produção

```
PRODUÇÃO
├── Vercel Production
├── Supabase Production
├── n8n Cloud/Self-hosted
├── WhatsApp Business API
└── Domínio: garcezpalha.com

MONITORAMENTO
├── Vercel Analytics
├── Supabase Dashboard
├── n8n execution logs
└── Sentry (erros)
```

---

## 9. DIAGRAMAS DE SEQUÊNCIA

### 9.1 Novo Lead (WhatsApp)

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│  Lead   │     │WhatsApp │     │   n8n   │     │ OpenAI  │
└────┬────┘     └────┬────┘     └────┬────┘     └────┬────┘
     │               │               │               │
     │──"Oi, tive"──▶│               │               │
     │  "conta"      │               │               │
     │  "bloqueada"  │               │               │
     │               │──webhook─────▶│               │
     │               │               │──prompt──────▶│
     │               │               │◀──resposta────│
     │               │◀──mensagem────│               │
     │◀─"Olá! Sou"──│               │               │
     │   "a Clara"   │               │               │
     │               │               │               │
     │──"Meu salário"│               │               │
     │  "foi preso"  │               │               │
     │               │──webhook─────▶│               │
     │               │               │──qualifica───▶│
     │               │               │◀──resultado───│
     │               │               │               │
     │               │               │──salva lead──▶│
     │               │               │   (Supabase)  │
     │               │◀──proposta────│               │
     │◀─"Podemos"───│               │               │
     │  "resolver"   │               │               │
     │  "por R$2500" │               │               │
```

### 9.2 Pagamento e Contrato

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│ Cliente │     │   n8n   │     │Merc.Pago│     │ ZapSign │
└────┬────┘     └────┬────┘     └────┬────┘     └────┬────┘
     │               │               │               │
     │──"quero"─────▶│               │               │
     │  "contratar"  │               │               │
     │               │──gera link───▶│               │
     │               │◀──link────────│               │
     │◀──link────────│               │               │
     │               │               │               │
     │══════════════════════════════▶│               │
     │        (paga no MP)           │               │
     │               │◀──webhook─────│               │
     │               │   (aprovado)  │               │
     │               │               │               │
     │               │──gera─────────────────────────▶│
     │               │   contrato                     │
     │◀──────────────────────────────────link────────│
     │   (contrato para assinar)     │               │
     │               │               │               │
     │══════════════════════════════════════════════▶│
     │        (assina)               │               │
     │               │◀──────────────────webhook─────│
     │               │   (assinado)  │               │
     │◀──"Contrato"──│               │               │
     │  "assinado!"  │               │               │
```

---

## 10. CUSTOS DE INFRAESTRUTURA

### 10.1 MVP (Mês 1-3)

| Item | Custo/mês |
|------|-----------|
| Vercel | R$ 0 (free) |
| Supabase | R$ 0 (free) |
| n8n Cloud | R$ 100 |
| OpenAI | R$ 100-300 |
| WhatsApp (Z-API) | R$ 65 |
| ZapSign | R$ 50 |
| Domínio | R$ 5 |
| **TOTAL** | **R$ 320-520** |

### 10.2 Crescimento (Mês 4-6)

| Item | Custo/mês |
|------|-----------|
| Vercel Pro | R$ 100 |
| Supabase Pro | R$ 125 |
| n8n Cloud | R$ 250 |
| OpenAI | R$ 500-1000 |
| WhatsApp Business | R$ 200-500 |
| ZapSign | R$ 100 |
| Judit.io | R$ 200 |
| **TOTAL** | **R$ 1.475-2.275** |

### 10.3 Escala (Mês 7-12)

| Item | Custo/mês |
|------|-----------|
| Infraestrutura | R$ 1.000 |
| APIs (OpenAI, etc) | R$ 2.000 |
| Comunicação | R$ 1.000 |
| Ferramentas | R$ 500 |
| **TOTAL** | **R$ 4.500** |

---

## 11. DECISÕES ARQUITETURAIS

### 11.1 Por que Next.js?
```
+ SSR/SSG para SEO
+ Vercel deploy fácil
+ API routes integradas
+ Ecossistema rico
+ Leonardo já conhece
```

### 11.2 Por que Supabase?
```
+ PostgreSQL robusto
+ Auth pronto
+ Storage incluído
+ Tempo real (futuro)
+ Free tier generoso
```

### 11.3 Por que n8n?
```
+ Visual, fácil de debugar
+ Self-host possível
+ Integrações prontas
+ Webhooks nativos
+ Alternativa ao Zapier (mais barato)
```

### 11.4 Por que WhatsApp?
```
+ Onde o cliente está
+ 98% de abertura
+ Conversa natural
+ Integra com IA
+ Brasil: padrão de comunicação
```

---

*Documento: 02-ARQUITETURA-PLATAFORMA.md*
*Versão: 1.0*
*Última atualização: Dezembro/2024*
