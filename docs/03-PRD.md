# 03 - PRD (Product Requirements Document)

Documento de requisitos do produto Garcez Palha.

**Versao**: 4.0
**Data**: 2024-12-23
**Status**: POS-IMPLEMENTACAO COMPLETA

---

## 1. SUMARIO EXECUTIVO

### 1.1 Visao

Construir uma plataforma de automacao juridica **compliant com OAB** que digitaliza o legado de 364 anos da familia Garcez Palha, combinando expertise juridica tradicional com tecnologia moderna de IA.

### 1.2 Missao

Automatizar o ciclo de vida do cliente desde o contato inicial ate assinatura de contrato e pagamento, mantendo:
- **Compliance OAB** em todas as etapas
- **Identidade premium** (364 anos de tradicao)
- **Supervisao humana** para decisoes juridicas
- **Tecnologia proprietaria** (nao SaaS generico)

### 1.3 Propostas de Valor

1. **IA Compliant OAB** - Chatbot com disclaimers obrigatorios
2. **Automacao Completa** - Lead -> Qualificacao -> Consulta -> Contrato -> Pagamento
3. **Agentes Especializados** - 9 agentes IA para diferentes areas do direito
4. **Ecossistema de Parceiros** - Rede de indicacoes com validacao OAB/CNPJ
5. **Posicionamento Premium** - Tradicao familiar como diferencial
6. **Producao Juridica Automatizada** - Geracao de documentos com IA

---

## 2. ESCOPO DO PRODUTO

### 2.1 Modulos Principais

| Modulo | Status | Descricao |
|--------|--------|-----------|
| Website Marketing | COMPLETO | 26+ paginas (6 categorias + 20 produtos) |
| Dashboard Admin | COMPLETO | Gestao de leads, clientes, documentos, metricas |
| Dashboard Executivo | COMPLETO | MRR, CAC, LTV, conversao, KPIs |
| Portal Parceiro | COMPLETO | Tracking de indicacoes e comissoes |
| Dashboard Cliente | COMPLETO | Processos, documentos, prazos, pagamentos |
| Autenticacao | COMPLETO | RBAC (admin, lawyer, partner, client) |
| Pagamentos | COMPLETO | Stripe + MercadoPago PIX + Payment Links |
| Chatbot IA | COMPLETO | 9 agentes especializados + orchestrator |
| Qualificacao de Leads | COMPLETO | Score automatico + follow-up |
| Producao Juridica | COMPLETO | 9 templates + geracao IA + DOCX |
| WhatsApp | IMPLEMENTADO | WhatsApp Cloud API |
| Telegram | OPERACIONAL | @garcezpalha_bot |
| Email | IMPLEMENTADO | Resend + sequences |
| Monitoramento | COMPLETO | Classificacao de urgencia + notificacoes |

### 2.2 Perfis de Usuario

| Perfil | Acesso | Permissoes |
|--------|--------|------------|
| **Admin** | Sistema completo | CRUD total, usuarios, analytics, documentos |
| **Lawyer** | Dados de clientes | Ver leads, gerenciar casos, revisar documentos |
| **Partner** | Portal apenas | Indicacoes, comissoes, marketing |
| **Client** | Dashboard cliente | Processos, documentos, pagamentos, prazos |

---

## 3. REQUISITOS FUNCIONAIS

### 3.1 Website Marketing (FR-100)

- [x] FR-101: Design responsivo mobile-first
- [x] FR-102: 26+ paginas de servicos detalhadas
- [x] FR-103: Timeline historica (1661-2025)
- [x] FR-104: Perfis da equipe
- [x] FR-105: Sistema de blog com MDX
- [x] FR-106: Formulario de contato com captura de leads
- [x] FR-107: Fluxo de registro de parceiros
- [x] FR-108: Politica de privacidade LGPD
- [x] FR-109: Termos de servico
- [x] FR-110: Sistema de temas (Corporate/Dark)
- [x] FR-111: Catalogo de produtos por categoria
- [x] FR-112: Paginas de produto com template unificado

### 3.2 Dashboard Admin (FR-200)

- [x] FR-201: Dashboard executivo com KPIs (MRR, CAC, LTV)
- [x] FR-202: Gestao de leads (lista, filtros, score, categoria)
- [x] FR-203: Gestao de clientes
- [x] FR-204: Calendario de agendamentos
- [x] FR-205: Analytics avancado e conversao
- [x] FR-206: Fila de revisao de documentos
- [x] FR-207: Aprovacao/rejeicao de peticoes
- [x] FR-208: Download de documentos DOCX

### 3.3 Portal Parceiro (FR-300)

- [x] FR-301: Dashboard de indicacoes
- [x] FR-302: Historico de comissoes
- [x] FR-303: Links unicos com estatisticas
- [x] FR-304: Materiais de marketing
- [x] FR-305: Configuracoes de perfil e bancarias
- [x] FR-306: Preferencias de notificacao

### 3.4 Dashboard Cliente (FR-350)

- [x] FR-351: Lista de processos
- [x] FR-352: Detalhes de processo com timeline
- [x] FR-353: Upload/download de documentos
- [x] FR-354: Calendario de prazos
- [x] FR-355: Historico de pagamentos
- [x] FR-356: Configuracoes de perfil

### 3.5 Autenticacao (FR-400)

- [x] FR-401: Login email/senha
- [x] FR-402: Credenciais demo para teste
- [x] FR-403: Protecao de rotas por role
- [x] FR-404: Gestao de sessao JWT
- [x] FR-405: Recuperacao de senha
- [x] FR-406: Cadastro de usuarios

### 3.6 Chatbot IA (FR-500)

- [x] FR-501: 9 agentes especializados
- [x] FR-502: Roteamento inteligente por keywords
- [x] FR-503: Confidence score e reasoning
- [x] FR-504: Disclaimers OAB automaticos
- [x] FR-505: Qualificacao de leads
- [x] FR-506: Persistencia de conversas
- [x] FR-507: Integracao multi-canal (Web, WhatsApp, Telegram)

### 3.7 Sistema de Qualificacao (FR-550) - NOVO

- [x] FR-551: Score Calculator (urgencia 40%, probabilidade 35%, complexidade 25%)
- [x] FR-552: Categorizacao automatica (hot, warm, cold, unqualified)
- [x] FR-553: Question Engine com logica condicional
- [x] FR-554: Agent-Product Mapping (57 produtos -> 9 agentes especializados)
- [x] FR-555: Lead Qualifier com persistencia de estado
- [x] FR-556: Sessoes resumiveis apos reload

### 3.8 Pagamentos e Propostas (FR-600)

- [x] FR-601: Checkout Stripe
- [x] FR-602: PIX MercadoPago
- [x] FR-603: Webhooks de confirmacao
- [x] FR-604: Historico de pagamentos
- [x] FR-605: Calculo de comissoes
- [x] FR-606: Payment Link Generator (MercadoPago + Stripe)
- [x] FR-607: Proposal Generator (8 secoes profissionais)
- [x] FR-608: WhatsApp Message Templates
- [x] FR-609: Follow-up Scheduler multi-canal

### 3.9 Producao Juridica (FR-700) - NOVO

- [x] FR-701: Document Generator com OpenAI GPT-4
- [x] FR-702: Template Engine com variaveis e condicionais
- [x] FR-703: 9 templates de peticoes juridicas
- [x] FR-704: Exportacao DOCX profissional
- [x] FR-705: Fila de revisao de documentos
- [x] FR-706: Workflow: pending -> in_review -> approved/rejected
- [x] FR-707: Interface admin para revisao

### 3.10 Monitoramento (FR-800) - NOVO

- [x] FR-801: Urgency Classifier (critical, high, medium, low)
- [x] FR-802: Notification Service (WhatsApp + Email)
- [x] FR-803: Templates de movimentacao processual
- [x] FR-804: Alertas de prazos urgentes

---

## 4. REQUISITOS NAO-FUNCIONAIS

### 4.1 Performance

- Tempo de carregamento < 3s
- First Contentful Paint < 1.5s
- Core Web Vitals: verde
- API response time < 500ms

### 4.2 Seguranca

- HTTPS obrigatorio
- Rate limiting em APIs (20 req/min)
- Validacao de input (Zod)
- RLS no Supabase (50+ policies)
- Verificacao de webhook signatures
- Audit trail de todas interacoes

### 4.3 Escalabilidade

- Serverless (Vercel)
- Database: Supabase (escalavel)
- CDN para assets estaticos
- Background jobs para follow-ups

### 4.4 Disponibilidade

- Uptime target: 99.9%
- Fallback para modo demo
- Error boundaries
- Graceful degradation

---

## 5. COMPLIANCE OAB

### 5.1 Regras Obrigatorias

1. **Disclaimer em toda interacao IA**
2. **Nunca garantir resultados judiciais**
3. **Sempre recomendar consulta presencial**
4. **Precos como "valores de referencia"**
5. **Validacao OAB/CNPJ para parceiros**

### 5.2 Implementacao

```typescript
// Disclaimer automatico em todas respostas
const OAB_DISCLAIMER = `
As informacoes fornecidas tem carater orientativo e nao
substituem consulta juridica formal. OAB/RJ 219.390.
`
```

---

## 6. ARQUITETURA TECNICA

### 6.1 Stack

| Camada | Tecnologia |
|--------|------------|
| Frontend | Next.js 14, React, TypeScript |
| Styling | Tailwind CSS, shadcn/ui |
| Backend | Next.js API Routes, tRPC |
| Database | Supabase (PostgreSQL) |
| Auth | NextAuth.js |
| AI | OpenAI GPT-4 via OpenRouter |
| Payments | Stripe, MercadoPago |
| Email | Resend |
| Documents | docx library |
| Storage | Supabase Storage |

### 6.2 Estrutura do Banco de Dados

**Tabelas Existentes (20+)**:
- users, profiles, services, contracts, appointments
- conversations, messages, leads, referrals
- invoices, commissions, process_alerts, deadlines

**Novas Tabelas (10)**:
- leads (qualificados)
- qualification_sessions
- payment_links
- proposals
- follow_up_messages
- lead_interactions
- generated_documents
- review_queue
- document_templates
- document_revisions

---

## 7. METRICAS DE SUCESSO

### 7.1 KPIs Principais

| Metrica | Meta | Dashboard |
|---------|------|-----------|
| MRR | R$ 75.000 | /admin |
| Taxa de conversao | 15% | /admin |
| CAC | < R$ 200 | /admin |
| LTV | > R$ 2.500 | /admin |
| LTV/CAC | > 3x | /admin |
| Tempo resposta chat | < 3s | OK |
| NPS | > 50 | - |
| Uptime | 99.9% | - |

### 7.2 OKRs

**Q1 2025**:
- Deploy em producao
- 100 leads qualificados
- 10 clientes convertidos
- 50 documentos gerados

**Q2 2025**:
- 500 leads qualificados
- 50 clientes convertidos
- Sistema de parceiros ativo
- R$ 25.000 MRR

---

## 8. ROADMAP

### Fase 1: MVP (COMPLETO)
- Website marketing
- Dashboard admin
- Autenticacao
- Chatbot basico

### Fase 2: Automacao (COMPLETO)
- Agentes IA especializados
- Integracao WhatsApp/Telegram
- Pagamentos Stripe/MercadoPago
- Portal parceiros

### Fase 3: Qualificacao (COMPLETO)
- Sistema de qualificacao de leads
- Score calculator
- Payment link generator
- Proposal generator
- Follow-up scheduler

### Fase 4: Producao Juridica (COMPLETO)
- Document generator com IA
- 9 templates de peticoes
- Exportacao DOCX
- Fila de revisao

### Fase 5: Monitoramento (COMPLETO)
- Urgency classifier
- Notification service
- Dashboard cliente

### Fase 6: Metricas (COMPLETO)
- Dashboard executivo
- MRR, CAC, LTV
- Analytics avancado

### Fase 7: Refatoracao (COMPLETO)
- [x] Remover nomenclatura "G4" dos componentes
- [x] Renomear src/components/g4/ -> src/components/marketing/
- [x] Atualizar todos os imports (20+ arquivos)
- [x] Renomear isG4 -> isProductized
- [x] Build validado sem erros

### Fase 8: Expansao (FUTURO)
- App mobile
- Video consultas
- Integracao Judit.io
- WebSockets real-time
- Relatorios automaticos
- Testes automatizados E2E

---

## 9. RISCOS E MITIGACOES

| Risco | Probabilidade | Impacto | Mitigacao |
|-------|---------------|---------|-----------|
| Violacao OAB | Baixa | Critico | Disclaimers automaticos |
| Downtime | Baixa | Alto | Modo demo fallback |
| Vazamento dados | Baixa | Critico | RLS + criptografia |
| Abandono de leads | Media | Alto | Follow-up automatico |
| Documentos incorretos | Media | Alto | Fila de revisao humana |

---

## 10. STAKEHOLDERS

### 10.1 Interno

- **Product Owner**: Leonardo Garcez Palha
- **Tech Lead**: Desenvolvimento IA
- **Legal**: Compliance OAB

### 10.2 Externo

- **Clientes**: Pessoas fisicas e juridicas
- **Parceiros**: Advogados e corretores
- **OAB**: Orgao regulador

---

## 11. CHANGELOG

| Versao | Data | Mudancas |
|--------|------|----------|
| 4.1 | 2024-12-23 | Refatoracao G4 completa, nomenclatura limpa |
| 4.0 | 2024-12-23 | Adicao de Qualificacao, Producao Juridica, Monitoramento, Metricas |
| 3.0 | 2024-11-19 | Agentes IA especializados |
| 2.0 | 2024-11-16 | Portal parceiros |
| 1.0 | 2024-11-10 | MVP inicial |
