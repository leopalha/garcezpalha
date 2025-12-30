# ACTIVATION PROMPT - GARCEZ PALHA v3.0
## Documento de Contextualização para Agentes de Desenvolvimento

---

## IMPORTANTE: LEIA PRIMEIRO

Este documento é o **ponto de entrada obrigatório** para qualquer agente de IA ou desenvolvedor que trabalhe nesta plataforma. Contém o contexto completo, regras críticas, arquitetura e protocolos que DEVEM ser seguidos.

**Última atualização:** Dezembro/2024
**Versão:** 3.0

---

## 1. CONTEXTO GERAL

### 1.1 O Que É Esta Plataforma

```
GARCEZ PALHA - INTELIGÊNCIA JURÍDICA

Uma plataforma de automação jurídica que combina:
- 364 anos de tradição familiar (desde 1661)
- Tecnologia de ponta (IA, automação)
- Múltiplas credenciais (OAB, CONPEJ, CRECI)

OBJETIVO: R$ 75.000 MRR em 6 meses
COMO: 30-40 contratos/mês × ticket médio R$ 2.500
```

### 1.2 Informações da Empresa

```
NOME COMPLETO: Garcez Palha - Advocacia e Perícia
FUNDAÇÃO: 1661 (364 anos de tradição)
SEDE: Rua Miguel Lemos, 41 - Copacabana, Rio de Janeiro/RJ
TELEFONES: (21) 3495-3046 | (21) 97503-0018
EMAIL: contato@garcezpalha.com
WEBSITE: https://garcezpalha.com

CREDENCIAIS:
- OAB/RJ 219.390 (Leonardo Mendonça Palha da Silva)
- CONPEJ/RJ (Conselho de Peritos Judiciais)
- CRECI/RJ (Corretor de Imóveis)

ADVOGADO PRINCIPAL: Dr. Leonardo Garcez Palha da Silva (@leopalha)
```

---

## 2. REGRAS CRÍTICAS DE COMPLIANCE

### 2.1 ÉTICA OAB - CRÍTICO

```
⛔ NUNCA PROMETER:
- Prazos de RESOLUÇÃO judicial (decisão depende do juiz)
- Resultados de processos
- Garantias de êxito

✅ PODE PROMETER:
- Prazo de RESPOSTA/ATENDIMENTO (controlável)
- Prazo para PROTOCOLAR petição (até 72h após docs)
- Acompanhamento e atualizações
- Qualidade do trabalho
```

**VIOLAÇÃO CRÍTICA:** Prometer "resolução em 72h" ou qualquer prazo de decisão judicial viola o Código de Ética da OAB (Art. 34, §4º). Isso NUNCA deve aparecer em:
- Landing pages
- Mensagens de WhatsApp
- Propostas comerciais
- Qualquer comunicação

### 2.2 Copy Aprovada (Hero Section)

```
✅ APROVADO:
"364 Anos de Tradição em Soluções Jurídicas"

❌ PROIBIDO:
"Resolução em 72h"
"Garantimos o resultado"
"Sucesso garantido"
```

### 2.3 Regras Gerais OAB

```
1. NUNCA fornecer aconselhamento jurídico definitivo via chat
2. SEMPRE incluir disclaimer em respostas de IA
3. NUNCA garantir resultados de processos
4. SEMPRE recomendar consulta presencial para casos complexos
5. NUNCA orientar sobre crimes ou práticas ilegais
6. SEMPRE citar base legal quando aplicável

DISCLAIMER PADRÃO:
"As informações fornecidas têm caráter orientativo e não substituem
consulta jurídica formal. Cada caso possui particularidades que devem
ser analisadas individualmente por profissional habilitado.
OAB/RJ 219.390 | CONPEJ/RJ | CRECI/RJ"
```

---

## 3. STACK TECNOLÓGICA

### 3.1 Frontend

```
Framework: Next.js 14.2.13 (App Router)
Linguagem: TypeScript (strict mode)
Styling: Tailwind CSS
Componentes: shadcn/ui
Hosting: Vercel
Domínio: garcezpalha.com
```

### 3.2 Backend

```
API: tRPC + Next.js API Routes
Database: Supabase (PostgreSQL) com Row Level Security
Auth: NextAuth.js
Storage: Supabase Storage
Automação: n8n (workflows)
```

### 3.3 Inteligência Artificial

```
Modelo Principal: GPT-4 Turbo (via OpenRouter)
Modelo ID: openai/gpt-4-turbo-preview
Temperature: 0.7
Max Tokens: 4000
Rate Limit: 20 mensagens/minuto

Modelo Backup: Claude 3.5 Sonnet (Anthropic)
Modelo Auxiliar: Claude Haiku (tarefas simples)
```

### 3.4 Integrações Externas

```
COMUNICAÇÃO:
- WhatsApp Cloud API (Meta Business)
- Evolution API (alternativa self-hosted)
- Telegram Bot (alertas admin)
- Resend (email transacional)

PAGAMENTOS:
- MercadoPago (principal - PIX, cartão)
- Stripe (backup - internacional)

ASSINATURA DIGITAL:
- ZapSign (principal)
- ClickSign (backup)

MONITORAMENTO JURÍDICO:
- Judit.io (processos e movimentações)
- Webhooks para notificações em tempo real
```

### 3.5 Custos Estimados

```
FIXOS MENSAIS:
├── Infraestrutura: R$ 500-1.000
├── APIs (OpenAI, etc): R$ 500-2.000
├── Ferramentas SaaS: R$ 400
├── Marketing: R$ 3.000 (mínimo)
└── TOTAL: ~R$ 4.000-6.500/mês

VARIÁVEIS (por contrato):
├── CAC (Google Ads): ~R$ 100
├── IA (produção docs): ~R$ 5
├── Assinatura digital: ~R$ 3
├── Taxas pagamento: ~3%
└── TOTAL: ~R$ 180/contrato
```

---

## 4. ARQUITETURA DE AGENTES IA

### 4.1 Sistema Multi-Agente (G4)

```
AgentOrchestrator (Orquestrador Central)
    │
    ├── FinancialAgent (Proteção Financeira)
    │   ├── Desbloqueio de conta
    │   ├── Golpe do PIX
    │   ├── Negativação indevida
    │   └── Defesa em execução
    │
    ├── PatrimonialAgent (Proteção Patrimonial)
    │   ├── Usucapião
    │   ├── Holding familiar
    │   ├── Inventário
    │   └── Regularização imóvel
    │
    ├── HealthAgent (Proteção Saúde)
    │   ├── Plano de saúde
    │   ├── Tratamento TEA
    │   └── BPC LOAS
    │
    ├── ExpertiseAgent (Perícias)
    │   ├── Grafotécnica
    │   ├── Avaliação imobiliária
    │   └── Perícia médica
    │
    ├── CriminalAgent (Criminal)
    │   └── Defesa criminal
    │
    └── AutomationAgent (Automação Interna)
        ├── Gestão de prazos
        ├── Geração de documentos
        └── Monitoramento processos
```

### 4.2 Fluxo de Processamento

```
1. Usuário envia mensagem
2. Orchestrator analisa keywords e contexto
3. Seleciona agente mais adequado (confidence score)
4. Agente processa com prompt especializado
5. Resposta inclui disclaimer OAB obrigatório
6. Mensagem salva no Supabase
7. Lead qualification automática
```

---

## 5. CATÁLOGO DE PRODUTOS (26 Serviços)

### 5.1 Proteção Financeira (6 produtos)

| Código | Produto | Ticket | Prioridade |
|--------|---------|--------|------------|
| FIN-001 | Desbloqueio de Conta | R$ 1.500-3.500 | ⭐⭐⭐⭐⭐ |
| FIN-002 | Golpe do PIX | R$ 1.500-4.000 | ⭐⭐⭐⭐⭐ |
| FIN-003 | Negativação Indevida | R$ 1.200-2.500 | ⭐⭐⭐⭐ |
| FIN-004 | Defesa em Execução | R$ 2.000-4.500 | ⭐⭐⭐ |
| FIN-005 | Revisional de Contrato | R$ 1.500-3.000 | ⭐⭐ |
| FIN-006 | Superendividamento | R$ 1.500-3.000 | ⭐⭐ |

### 5.2 Proteção Patrimonial (6 produtos)

| Código | Produto | Ticket | Prioridade |
|--------|---------|--------|------------|
| PAT-001 | Usucapião Extrajudicial | R$ 5.000-10.000 | ⭐⭐⭐⭐ |
| PAT-002 | Holding Familiar | R$ 8.000-15.000 | ⭐⭐⭐ |
| PAT-003 | Inventário Extrajudicial | R$ 4.000-10.000 | ⭐⭐⭐ |
| PAT-004 | Regularização de Imóvel | R$ 3.000-8.000 | ⭐⭐⭐ |
| PAT-005 | Distrato Imobiliário | R$ 2.500-5.000 | ⭐⭐ |
| PAT-006 | Divórcio Extrajudicial | R$ 3.000-6.000 | ⭐⭐ |

### 5.3 Proteção Saúde (6 produtos)

| Código | Produto | Ticket | Prioridade |
|--------|---------|--------|------------|
| PES-001 | Plano de Saúde | R$ 2.500-5.000 | ⭐⭐⭐⭐ |
| PES-002 | Cirurgia Bariátrica | R$ 3.000-5.500 | ⭐⭐⭐ |
| PES-003 | Tratamento TEA | R$ 3.000-5.500 | ⭐⭐⭐ |
| PES-004 | BPC LOAS | R$ 800-2.500 | ⭐⭐⭐ |
| PES-005 | Aposentadoria/Revisão | R$ 1.500-4.000 | ⭐⭐ |
| PES-006 | Auxílio-Doença | R$ 1.500-3.500 | ⭐⭐ |

### 5.4 Perícias (4 produtos)

| Código | Produto | Ticket | Prioridade |
|--------|---------|--------|------------|
| PER-001 | Perícia Grafotécnica | R$ 3.000-8.000 | ⭐⭐⭐ |
| PER-002 | Avaliação Imobiliária | R$ 2.000-6.000 | ⭐⭐⭐ |
| PER-003 | Perícia Médica | R$ 2.500-6.000 | ⭐⭐ |
| PER-004 | Perícia Trabalhista | R$ 2.500-6.000 | ⭐⭐ |

### 5.5 Criminal (2 produtos)

| Código | Produto | Ticket | Prioridade |
|--------|---------|--------|------------|
| CRI-001 | Defesa Criminal | R$ 3.000-10.000 | ⭐⭐ |
| CRI-002 | Habeas Corpus | R$ 5.000-15.000 | ⭐⭐ |

### 5.6 Automação (2 produtos)

| Código | Produto | Ticket | Prioridade |
|--------|---------|--------|------------|
| AUT-001 | Gestão de Prazos | R$ 500/mês | ⭐⭐⭐ |
| AUT-002 | Monitoramento Processos | R$ 300/mês | ⭐⭐⭐ |

### 5.7 Ordem de Lançamento (Rollout)

```
FASE 1 (Mês 1-2): VALIDAÇÃO
├── FIN-001: Desbloqueio de Conta
└── FIN-002: Golpe do PIX

FASE 2 (Mês 3-4): EXPANSÃO FINANCEIRO
├── FIN-003: Negativação Indevida
└── FIN-004: Defesa em Execução

FASE 3 (Mês 5-6): PATRIMONIAL
├── PAT-001: Usucapião
└── PAT-004: Regularização Imóvel

FASE 4 (Mês 7-9): SAÚDE
├── PES-001: Plano de Saúde
├── PES-002: Bariátrica
└── PES-003: TEA

FASE 5 (Mês 10-12): ESPECIALIZADO
└── Demais produtos
```

---

## 6. FLUXO COMPLETO DO CLIENTE

### 6.1 Jornada Lead → Cliente

```
[1] AQUISIÇÃO
    ├── Google Ads → Landing Page → WhatsApp
    ├── SEO → Blog → WhatsApp
    └── Indicação → WhatsApp

[2] TRIAGEM (IA - CLARA)
    ├── Boas-vindas automáticas
    ├── Coleta de informações
    ├── Identificação do problema
    └── Classificação: QUALIFICADO / NÃO QUALIFICADO

[3] QUALIFICAÇÃO (IA + Humano)
    ├── Perguntas específicas da área
    ├── Análise de viabilidade
    ├── Definição de complexidade
    └── Cálculo de preço

[4] PROPOSTA (IA)
    ├── Geração automática
    ├── Envio via WhatsApp
    ├── Quebra de objeções
    └── Negociação (se necessário)

[5] FECHAMENTO
    ├── Link de pagamento (MercadoPago)
    ├── Confirmação automática
    ├── Contrato digital (ZapSign)
    └── Assinatura eletrônica

[6] ONBOARDING
    ├── Mensagem de boas-vindas
    ├── Solicitação de documentos
    ├── Checklist por produto
    └── Confirmação de recebimento

[7] PRODUÇÃO JURÍDICA
    ├── IA gera petição/documento (80% automatizado)
    ├── Advogado revisa (5-15 min)
    ├── Ajustes finais
    └── Aprovação

[8] PROTOCOLO
    ├── Preparação (PDF/A, custas)
    ├── Submissão no tribunal
    ├── Captura do número
    └── Notificação ao cliente

[9] ACOMPANHAMENTO
    ├── Monitoramento via Judit.io
    ├── Webhook de movimentação
    ├── Notificação automática
    └── Gestão de prazos

[10] RESULTADO
     ├── Decisão favorável → Celebração
     ├── Decisão parcial → Explicação + Próximos passos
     └── Decisão desfavorável → Análise + Opções
```

### 6.2 Lead Scoring (Qualificação)

```
DIMENSÕES AVALIADAS:
├── Urgência (0-25 pts)
├── Viabilidade jurídica (0-25 pts)
├── Capacidade financeira (0-20 pts)
├── Documentação (0-15 pts)
├── Complexidade (0-10 pts)
└── Fit com serviços (0-5 pts)

CLASSIFICAÇÃO:
├── HOT (75-100): Prioridade máxima, proposta imediata
├── WARM (50-74): Bom potencial, qualificação adicional
└── COLD (<50): Baixo potencial, nurturing ou dispensa
```

---

## 7. PRECIFICAÇÃO

### 7.1 Escada de Valor Padrão

```
PREMIUM ────── Tudo do Completo + Extras + Acompanhamento longo
    │
COMPLETO ⭐ ── Resolução completa (80% das vendas)
    │
ESSENCIAL ─── Solução básica
```

### 7.2 Fatores de Ajuste

```
AUMENTOS:
├── Urgência extrema (24h): +30%
├── Complexidade alta: +20-50%
├── Valor da causa alto: +20%
├── Múltiplos processos: +10% cada
└── Trabalho extra: +15%

DESCONTOS:
├── Pagamento à vista: -5%
├── Cliente recorrente: -10%
├── Indicação: -5%
└── Pacote família: -10%
```

### 7.3 Formas de Pagamento

```
PADRÃO:
├── 50% na contratação (entrada)
└── 50% em até 3x (antes do protocolo)

ALTERNATIVAS:
├── À vista: -5% desconto
├── 6x: sem juros
└── 12x: +10% (juros gateway)
```

---

## 8. ESTRUTURA DO PROJETO

```
garcezpalha/
├── src/
│   ├── app/
│   │   ├── (marketing)/     # Site público
│   │   │   ├── page.tsx     # Homepage
│   │   │   ├── blog/        # Blog SEO
│   │   │   ├── equipe/      # Página equipe
│   │   │   └── [área]/      # Páginas por área
│   │   ├── (dashboard)/     # Dashboard cliente
│   │   ├── (admin)/         # Painel admin
│   │   ├── (auth)/          # Autenticação
│   │   ├── checkout/        # Pagamento
│   │   └── api/             # API Routes
│   │       ├── chat/        # Endpoint IA
│   │       ├── webhooks/    # Webhooks externos
│   │       └── trpc/        # tRPC router
│   ├── components/
│   │   ├── ui/              # shadcn/ui
│   │   ├── dashboard/       # Componentes dashboard
│   │   ├── checkout/        # Componentes pagamento
│   │   └── g4/              # Componentes G4 (IA)
│   └── lib/
│       ├── ai/              # Agentes IA
│       │   ├── agents/      # Agentes especializados
│       │   └── prompts/     # Prompts base
│       ├── supabase/        # Database
│       ├── trpc/            # tRPC routers
│       ├── auth/            # Autenticação
│       └── ...              # Outros serviços
├── docs/                    # Documentação completa
├── supabase/                # Migrations SQL
├── public/                  # Assets estáticos
└── content/                 # Conteúdo MDX (blog)
```

---

## 9. VARIÁVEIS DE AMBIENTE

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI (OpenRouter)
OPENAI_API_KEY=sk-or-v1-...

# Auth
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# Pagamentos
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
MERCADOPAGO_ACCESS_TOKEN=
MERCADOPAGO_PUBLIC_KEY=

# Email
RESEND_API_KEY=

# WhatsApp
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_VERIFY_TOKEN=

# Telegram
TELEGRAM_BOT_TOKEN=

# Monitoramento Jurídico
JUDIT_API_KEY=

# Assinatura Digital
ZAPSIGN_TOKEN=
```

---

## 10. COMANDOS DE DESENVOLVIMENTO

```bash
# Iniciar desenvolvimento
npm run dev

# Build produção
npm run build

# Type check
npx tsc --noEmit

# Linting
npm run lint

# Testes
npm run test

# Deploy (automático via Vercel)
git push origin main
```

---

## 11. MÉTRICAS E KPIs

### 11.1 North Star Metric

```
MRR (Receita Recorrente Mensal)

METAS:
├── Mês 3: R$ 30.000
├── Mês 6: R$ 75.000
├── Mês 12: R$ 180.000
└── Mês 24: R$ 400.000
```

### 11.2 KPIs Principais

```
AQUISIÇÃO:
├── Leads/mês: meta 400
├── CPL: meta < R$ 30
├── Conversão site→lead: meta > 4%

CONVERSÃO:
├── Taxa qualificação: meta 60%
├── Taxa fechamento: meta 20%
├── Ticket médio: meta R$ 2.500

OPERAÇÃO:
├── Docs gerados por IA: meta 80%
├── Tempo revisão: meta < 10min
├── Prazos cumpridos: meta 100%

SATISFAÇÃO:
├── NPS: meta > 70
├── CSAT: meta > 4.5/5
├── Taxa sucesso processos: meta > 80%
```

---

## 12. DOCUMENTAÇÃO ADICIONAL

Para contexto completo, consulte os documentos em `docs/`:

| Documento | Conteúdo |
|-----------|----------|
| 00-INDICE-GERAL.md | Índice de toda documentação |
| 01-POSICIONAMENTO-MARCA.md | Branding e posicionamento |
| 02-ARQUITETURA-PLATAFORMA.md | Arquitetura técnica |
| 03-CATALOGO-PRODUTOS.md | Detalhes de todos os produtos |
03_PRD
04_USER_FLOWS

| 04-LANDING-PAGE-PRINCIPAL.md | Wireframes e copy |
05_TECHNICAL_ARCHITECTURE
| 05-GOOGLE-ADS-CAMPANHAS.md | Estratégia de ads |
06_COMPONENT_LIBRARY
| 06-SEO-CONTEUDO.md | Estratégia SEO |
07_DEV_BRIEF
| 07-IA-TRIAGEM-UNIVERSAL.md | IA de atendimento (Clara) |
08_BUSINESS_MODEL
| 08-FLUXOS-QUALIFICACAO.md | Fluxos por área |
| 09-PRECIFICACAO-DINAMICA.md | Sistema de preços |
| 10-PROPOSTAS-CONTRATOS.md | Templates de proposta |
| 11-PAGAMENTOS-AUTOMACAO.md | Gateway e automação |
| 12-ONBOARDING-CLIENTE.md | Jornada pós-venda |
| 13-TEMPLATES-PETICOES.md | Templates jurídicos |
| 14-IA-PRODUCAO-JURIDICA.md | IA de documentos |
| 15-PROTOCOLOS-ACOMPANHAMENTO.md | Monitoramento |
15_CATALOGO_SERVICOS
| 16-METRICAS-KPIS.md | Métricas detalhadas |
16_ARQUITETURA_AGENTES_IA
| 17-STACK-TECNOLOGICA.md | Stack completa |
17_INTEGRACOES
18_DEPLOY_GUIDE
| 18-ROADMAP-IMPLEMENTACAO.md | Timeline de implementação |
20_TESTES
QUALIFICATION_SYSTEM
---

## 13. CHECKLIST ANTES DE QUALQUER ALTERAÇÃO

```
PRÉ-CÓDIGO:
[ ] Li este activation prompt completamente
[ ] Entendi as regras de compliance OAB
[ ] Verifiquei se a feature está no roadmap
[ ] Consultei a documentação relevante

PRÉ-DEPLOY:
[ ] Código não contém promessas de prazo judicial
[ ] Disclaimers OAB presentes onde necessário
[ ] Testes passando
[ ] Build sem erros
[ ] TypeScript sem erros

PRÉ-COMUNICAÇÃO:
[ ] Copy não promete resultados
[ ] Copy não promete prazos de decisão
[ ] Informações de contato corretas
[ ] Preços atualizados
```

---

## 14. COMO USAR ESTE PROMPT

Este documento deve ser usado como contexto inicial quando:

1. **Novo desenvolvedor** entra no projeto
2. **Agente AI** precisa entender o sistema
3. **Auditoria** de código ou documentação
4. **Planejamento** de novas features
5. **Debug** de problemas complexos
6. **Atualização** de qualquer componente

**IMPORTANTE:** Mantenha este documento atualizado conforme o projeto evolui.

---

## 15. PRÓXIMOS PASSOS RECOMENDADOS

Para um agente que está iniciando trabalho neste projeto:

1. **Leia** este documento completamente
2. **Explore** a estrutura de pastas
3. **Consulte** docs/ para detalhes específicos
4. **Verifique** o status atual via `git status`
5. **Execute** `npm run dev` para ambiente local
6. **Confirme** as variáveis de ambiente
7. **Siga** os protocolos de compliance SEMPRE

---

## 16. PROTOCOLOS MANUS v6.0 (Multi-Agent Network for Unified Systems)

Este projeto utiliza o **MANUS v6.0**, um sistema de orquestração de documentação e desenvolvimento multi-agent.

### 16.1 Agent Loop (6 Fases)

O MANUS opera em um loop contínuo de 6 fases:

```
1. ANALYZE (Análise)
   └── Ler documentação e código
   └── Identificar gaps e inconsistências
   └── Mapear arquitetura atual

2. PLAN (Planejamento)
   └── Criar matriz de problemas (P0/P1/P2)
   └── Estimar esforço de correção
   └── Priorizar por impacto

3. EXECUTE (Execução)
   └── Lançar agents especializados em paralelo
   └── Cada agent trabalha em fase específica
   └── Agents podem spawnar sub-agents

4. OBSERVE (Observação)
   └── Monitorar progresso dos agents
   └── Validar outputs parciais
   └── Identificar bloqueadores

5. ITERATE (Iteração)
   └── Ajustar plano baseado em descobertas
   └── Re-lançar agents para correções
   └── Refinar documentação

6. DELIVER (Entrega)
   └── Consolidar resultados
   └── Validar score final
   └── Entregar documentação completa
```

### 16.2 Sistema de Scoring (0-100)

```
SCORE 0-100: Alinhamento Documentação ↔ Código

├── 90-100: EXCELENTE (Production-ready)
├── 80-89:  BOM (Pequenos ajustes)
├── 70-79:  MÉDIO (Requer melhorias)
├── 60-69:  FRACO (Refatoração necessária)
└── 0-59:   CRÍTICO (Refazer documentação)

COMPOSIÇÃO DO SCORE:
├── Completude (30 pts): Docs cobrem 100% do código?
├── Precisão (25 pts): Docs refletem implementação real?
├── Consistência (20 pts): Sem contradições entre docs?
├── Atualização (15 pts): Docs estão atualizados?
└── Usabilidade (10 pts): Fácil de entender e usar?
```

### 16.3 Priorização de Gaps

```
P0 (CRÍTICA): Bloqueadores de produção
├── Documentação menciona features não implementadas
├── Código implementa features não documentadas (críticas)
├── Inconsistências arquiteturais fundamentais
└── Informações incorretas de compliance/segurança

P1 (ALTA): Impacto significativo
├── Features implementadas mas não documentadas
├── Documentação desatualizada em partes importantes
├── Gaps de informação em fluxos principais
└── Exemplos incorretos ou desatualizados

P2 (MÉDIA): Melhorias incrementais
├── Documentação incompleta em features secundárias
├── Falta de exemplos adicionais
├── Diagramas ausentes ou desatualizados
└── Detalhes técnicos superficiais
```

### 16.4 Protocolos de Validação

```
PRÉ-AUDITORIA:
[ ] Ler business/DADOS_MESTRES.md (Single Source of Truth)
[ ] Ler business/OAB_COMPLIANCE_GUIDE.md (Regras jurídicas)
[ ] Ler todos os arquivos em docs/
[ ] Ler estrutura de src/ completa

DURANTE AUDITORIA:
[ ] Criar MATRIZ_ALINHAMENTO_DOCS_CODIGO.md
[ ] Identificar todos os gaps (P0/P1/P2)
[ ] Calcular score de alinhamento (0-100)
[ ] Criar ROADMAP_100_PERCENT.md

PÓS-AUDITORIA:
[ ] Lançar agents para correção de gaps
[ ] Validar outputs de cada agent
[ ] Re-calcular score final
[ ] Consolidar RELATORIO_ALINHAMENTO_FINAL.md
```

### 16.5 Estrutura .manus/

```
.manus/
├── README.md                          # Índice mestre MANUS
├── AUDITORIA_FINAL_MANUS.md          # Relatório de auditoria
├── MATRIZ_ALINHAMENTO_DOCS_CODIGO.md # Gaps identificados
├── PROGRESSO_MANUS_26DEC.md          # Progresso atual
├── ROADMAP_100_PERCENT.md            # Plano para 100/100
├── RELATORIO_ALINHAMENTO_FINAL.md    # Relatório final
└── bootstrap/
    └── META_MANUS_INSTALLER.md       # Sistema de auto-instalação
```

### 16.6 Single Source of Truth (SSOT)

O arquivo `business/DADOS_MESTRES.md` é a **fonte única de verdade** para:

- Informações da empresa (nome, endereço, CNPJ, etc.)
- Catálogo de produtos (30 produtos com preços)
- Stack tecnológica (versões, custos)
- Métricas e KPIs (MRR, conversão, etc.)
- Agentes de IA (6 agents especializados)
- Integrações externas (APIs, webhooks)

**REGRA**: Qualquer alteração nestes dados deve ser feita PRIMEIRO em DADOS_MESTRES.md, depois propagada para outros documentos.

### 16.7 Compliance OAB (Crítico)

**NUNCA** documentar ou implementar:

- ❌ Promessas de prazo de RESOLUÇÃO judicial
- ❌ Garantias de resultado em processos
- ❌ Promessas de "sucesso garantido"
- ❌ Violações do Código de Ética da OAB

**SEMPRE** incluir:

- ✅ Disclaimer OAB em respostas de IA
- ✅ Informações de registro (OAB/RJ 219.390)
- ✅ Recomendação de consulta presencial para casos complexos
- ✅ Base legal quando aplicável

Consulte `business/OAB_COMPLIANCE_GUIDE.md` para lista completa de frases proibidas/permitidas.

### 16.8 Workflow de Documentação

```
NOVA FEATURE IMPLEMENTADA:
1. Atualizar DADOS_MESTRES.md (se aplicável)
2. Atualizar docs/03_PRD.md (requisitos)
3. Atualizar docs/17-STACK-TECNOLOGICA.md (arquitetura)
4. Atualizar docs específicos da feature
5. Executar auditoria MANUS para validar

NOVA DOCUMENTAÇÃO:
1. Verificar se já existe doc similar
2. Seguir template apropriado (.manus/templates/)
3. Referenciar DADOS_MESTRES.md quando possível
4. Adicionar ao índice em docs/00-INDICE-GERAL.md
5. Linkar de/para outros documentos relevantes
```

### 16.9 Score Atual do Projeto

```
SCORE HISTÓRICO:
├── Inicial (01/12/2024): 78/100
├── Após MANUS v1-5:       85/100
└── Atual (26/12/2024):    95/100

GAPS RESOLVIDOS:
├── GAP-001 (tRPC):     ✅ RESOLVIDO (falso positivo)
├── GAP-002 (PWA):      ✅ DOCUMENTADO
└── GAP-003 (WhatsApp): ✅ DOCUMENTADO

PRÓXIMA META: 100/100 (Excelência Absoluta)
```

### 16.10 Comandos MANUS

```bash
# Executar auditoria completa (via Claude Code)
# Inicie nova conversa com: "Execute auditoria MANUS v6.0"

# Verificar score atual
# Leia: .manus/RELATORIO_ALINHAMENTO_FINAL.md

# Verificar gaps pendentes
# Leia: .manus/MATRIZ_ALINHAMENTO_DOCS_CODIGO.md

# Ver roadmap para 100/100
# Leia: .manus/ROADMAP_100_PERCENT.md
```

---

*Documento: 00_ACTIVATION_PROMPT.md*
*Versão: 4.0 (com Protocolos MANUS v6.0)*
*Última atualização: 26 de Dezembro de 2024*
