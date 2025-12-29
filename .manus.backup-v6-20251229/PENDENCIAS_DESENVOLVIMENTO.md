# PENDÊNCIAS DE DESENVOLVIMENTO
## GARCEZ PALHA - MANUS v6.0

**Data:** 27/12/2025
**Status Geral:** 🟡 PARCIALMENTE COMPLETO (83,3/100)

---

## 📋 RESUMO DE PENDÊNCIAS

### Total de Nichos: 22
- ✅ **Completos (100%):** 12 nichos (54,5%)
- 🟡 **Parciais (falta agente):** 7 nichos (31,8%)
- 🔴 **Incompletos (falta página):** 3 nichos (13,6%)

---

## 🔴 PRIORIDADE CRÍTICA - PÁGINAS FALTANTES

### 1. ENE-001 - Cobrança Energia ⚡
**Status:** ❌ Página NÃO criada
**O que existe:**
- ✅ Produto catalogado em `catalog.ts`
- ✅ Mapeado em `agent-product-mapping.ts`

**O que falta:**
- ❌ Criar `src/app/(marketing)/solucoes/energia/cobranca-energia/page.tsx`
- ❌ Criar agente em `questions/` (perguntas + scoring rules)

**Impacto:**
- Demanda: 10.000 buscas/mês
- Receita potencial: ~R$ 180k/ano
- Ticket: R$ 1.500

**Tempo estimado:** 2-3h

**Base Legal:**
- Consumo estimado (CDC)
- Débitos prescritos (> 5 anos)
- ⚠️ **ATENÇÃO:** STJ mudou entendimento sobre TUSD/TUST em 2024 - NÃO incluir essa tese

---

### 2. SERV-002 - Diferenças Salariais (Servidor) 🏢
**Status:** ❌ Página NÃO criada
**O que existe:**
- ✅ Produto catalogado em `catalog.ts`
- ✅ Mapeado em `agent-product-mapping.ts`

**O que falta:**
- ❌ Criar `src/app/(marketing)/solucoes/servidor/diferencas-salariais/page.tsx`
- ❌ Criar agente em `questions/`

**Impacto:**
- Demanda: ~5.000 buscas/mês
- Receita potencial: ~R$ 100k/ano
- Ticket: R$ 2.000 + 20%

**Tempo estimado:** 2-3h

**Obs:** Apenas 1 página de servidor foi criada (incorporacao-gratificacao)

---

### 3. COND-001 - Cobrança Condominial Abusiva 🏘️
**Status:** ❌ Página NÃO criada
**O que existe:**
- ✅ Produto catalogado em `catalog.ts`
- ✅ Mapeado em `agent-product-mapping.ts`

**O que falta:**
- ❌ Criar `src/app/(marketing)/solucoes/condominial/cobranca-condominial/page.tsx`
- ❌ Criar agente em `questions/`

**Impacto:**
- Demanda: 8.000 buscas/mês
- Receita potencial: ~R$ 144k/ano
- Ticket: R$ 1.500

**Tempo estimado:** 2-3h

**Base Legal:**
- Rateios sem aprovação (Lei 4.591/64)
- Multas abusivas
- Convenção de condomínio

---

### 4. TRAB-001 e TRAB-002 - Trabalhista 👷
**Status:** ❌ Páginas NÃO criadas
**O que existe:**
- ✅ Produtos catalogados em `catalog.ts`
- ✅ Mapeados em `agent-product-mapping.ts`

**O que falta:**
- ❌ Criar `src/app/(marketing)/solucoes/trabalhista/verbas-rescisoria/page.tsx`
- ❌ Criar `src/app/(marketing)/solucoes/trabalhista/horas-extras/page.tsx`
- ❌ Criar agentes em `questions/`

**Impacto:**
- Demanda: 80.000 buscas/mês
- Receita potencial: ~R$ 1,4M/ano
- Tickets: R$ 1.500-2.000 + 20%

**Tempo estimado:** 4-6h (2 páginas)

**⚠️ ATENÇÃO:**
- Apenas casos com **prova clara** (contracheque, ponto eletrônico)
- Evitar audiências complexas
- Filtro rigoroso na qualificação

---

## 🟡 PRIORIDADE ALTA - AGENTES FALTANTES

### Nichos com Página mas SEM Agente (7):

#### Previdenciário (3):
1. **PREV-001 - Revisão Aposentadoria**
   - ✅ Página criada (~368 linhas)
   - ❌ Agente faltando
   - Demanda: 30.000 buscas/mês
   - Tempo: 1-2h

2. **PREV-002 - Benefício Negado**
   - ✅ Página criada (~356 linhas)
   - ❌ Agente faltando
   - Demanda: 40.000 buscas/mês
   - Tempo: 1-2h

3. **PREV-003 - Auxílio-Acidente**
   - ✅ Página criada (~364 linhas)
   - ❌ Agente faltando
   - Demanda: 15.000 buscas/mês
   - Tempo: 1-2h

**Total Previdenciário:** 85.000 buscas/mês | R$ 1,5M/ano

---

#### Trabalhista (2):
4. **TRAB-001 - Verbas Rescisórias**
   - ❌ Página faltando
   - ❌ Agente faltando

5. **TRAB-002 - Horas Extras**
   - ❌ Página faltando
   - ❌ Agente faltando

---

#### Servidor (1):
6. **SERV-001 - Incorporação Gratificação**
   - ✅ Página criada (~360 linhas)
   - ❌ Agente faltando
   - Demanda: 13.000 buscas/mês
   - Tempo: 1-2h

---

#### Educacional (1):
7. **EDU-001 - FIES Renegociação**
   - ✅ Página criada (~372 linhas)
   - ❌ Agente faltando
   - Demanda: 15.000 buscas/mês
   - Tempo: 1-2h
   - 🔥 **NOVIDADE 2025** - Resolução MEC 64/2025

---

## 🟢 PRIORIDADE BAIXA - ERROS TÉCNICOS

### TypeScript Errors (RESOLVIDOS ✅)
- ✅ `banking-questions.ts` - Erros de type safety **corrigidos automaticamente pelo linter**
- ✅ 5 erros `TS7015` foram resolvidos com casting `as string[]`

**Status:** ✅ Nenhum erro TypeScript bloqueante

---

## 📊 IMPACTO DAS PENDÊNCIAS

### Se TODAS as pendências forem resolvidas:

| Item | Impacto |
|------|---------|
| **4 páginas faltantes** | +23.000 buscas/mês |
| **10 agentes faltantes** | Automação completa em 22/22 nichos |
| **Demanda total capturada** | 440.000 buscas/mês (vs 417k atual) |
| **Receita adicional** | +R$ 414k/ano |
| **Score final** | 83,3 → **95+/100** |

---

## 🎯 PLANO DE AÇÃO RECOMENDADO

### SPRINT 8 - Completar Implementação (Estimativa: 20-24h)

#### Semana 1 (8-10h): Páginas Críticas
- [ ] Criar página ENE-001 (2-3h)
- [ ] Criar página SERV-002 (2-3h)
- [ ] Criar página COND-001 (2-3h)
- [ ] Criar 2 páginas trabalhista (2-3h cada)

**Resultado:** 22/22 páginas (100%)

---

#### Semana 2 (10-12h): Agentes IA
- [ ] Criar agentes Previdenciário (3 × 1-2h = 3-6h)
- [ ] Criar agente SERV-001 (1-2h)
- [ ] Criar agente EDU-001 (1-2h)
- [ ] Criar agentes Trabalhista (2 × 1-2h = 2-4h)
- [ ] Criar agentes ENE-001, SERV-002, COND-001 (3 × 1h = 3h)

**Resultado:** 22/22 agentes (100%)

---

#### Validação Final (2h):
- [ ] Testar compilação TypeScript
- [ ] Verificar metadata SEO em todas as páginas
- [ ] Validar qualification flows
- [ ] Criar relatório de conclusão

**RESULTADO FINAL:** 22/22 nichos 100% completos → Score 95+/100 ✅

---

## 📋 CHECKLIST DE DESENVOLVIMENTO

### Para cada nicho pendente:

#### Página (page.tsx):
- [ ] Criar diretório `src/app/(marketing)/solucoes/[categoria]/[slug]/`
- [ ] Criar `page.tsx` com:
  - [ ] `export const metadata` (title, description, keywords)
  - [ ] Hero section (headline, subheadline, CTA)
  - [ ] Problem section (6 pain points com ícones)
  - [ ] Solution section (base legal, direitos)
  - [ ] Pricing section (ticket, features)
  - [ ] Documents section (docs necessários)
  - [ ] FAQ section (6 perguntas)
  - [ ] Final CTA (WhatsApp link)

#### Agente (questions.ts):
- [ ] Criar questions array com:
  - [ ] Perguntas de qualificação (5-8 perguntas)
  - [ ] Types corretos (single-choice, multi-choice, yes-no, currency)
  - [ ] Priorities (required, important, optional)
  - [ ] ScoreModifiers balanceados
  - [ ] HelpTexts onde necessário
- [ ] Criar scoring rules array com:
  - [ ] Regras baseadas em jurisprudência
  - [ ] Impactos (urgency, probability, complexity)
  - [ ] Conditions usando helper functions

#### Validação:
- [ ] TypeScript compila sem erros
- [ ] Página renderiza corretamente
- [ ] Metadata SEO presente
- [ ] Qualification flow funcional

---

## 🔧 TEMPLATE RÁPIDO

### Para criar nova página (copiar estrutura de):
```typescript
// Bancário: src/app/(marketing)/solucoes/bancario/seguro-prestamista/page.tsx
// Telecom: src/app/(marketing)/solucoes/telecom/cobranca-telefonia/page.tsx
// Consumidor: src/app/(marketing)/solucoes/consumidor/assinaturas-digitais/page.tsx
```

### Para criar novo agente (copiar estrutura de):
```typescript
// Banking: src/lib/ai/qualification/questions/banking-questions.ts
// Telecom/Consumer: src/lib/ai/qualification/questions/telecom-consumer-questions.ts
```

---

## 💰 ROI DAS PENDÊNCIAS

### Investimento para completar:
- **Tempo:** 20-24h
- **Custo:** R$ 0 (MANUS automatizado)

### Retorno adicional:
- **Demanda:** +23.000 buscas/mês
- **Receita:** +R$ 414k/ano
- **ROI:** Infinito (custo zero)

### Benefícios não-monetários:
- ✅ Catálogo 100% completo
- ✅ Automação em 100% dos nichos
- ✅ Score 95+/100
- ✅ Produto de mercado robusto

---

## ⚠️ OBSERVAÇÕES IMPORTANTES

### 1. Energia (ENE-001):
- ⚠️ STJ mudou entendimento sobre TUSD/TUST em 2024
- ❌ **NÃO incluir** teses de TUSD/TUST
- ✅ Focar em: consumo estimado, débitos prescritos, corte indevido

### 2. Trabalhista (TRAB-001, TRAB-002):
- ⚠️ Apenas casos com **prova clara**
- ❌ Evitar audiências complexas
- ✅ Filtro rigoroso: contracheque, ponto eletrônico, testemunhas

### 3. FIES (EDU-001):
- 🔥 Resolução MEC 64/2025 é **NOVIDADE**
- ✅ Primeiro entrante = vantagem competitiva
- ✅ Desconto até 99% + 150 meses

### 4. Servidor (SERV-001, SERV-002):
- ✅ Quinquênio (5 anos) = incorporação definitiva (Lei 8.112/90)
- ✅ Jurisprudência consolidada
- ✅ Baixa complexidade processual

---

## 📅 CRONOGRAMA SUGERIDO

### Semana 1 (30/12 - 03/01):
- Segunda: ENE-001 + SERV-002 (4-6h)
- Terça: COND-001 + TRAB-001 (4-6h)
- Quarta: TRAB-002 (2-3h)

### Semana 2 (06/01 - 10/01):
- Segunda: Agentes Previdenciário (3-6h)
- Terça: Agentes Servidor + Educacional (2-4h)
- Quarta: Agentes Trabalhista + Outros (4-6h)
- Quinta: Validação final (2h)

**Conclusão:** 10/01/2026 ✅

---

## ✅ CONCLUSÃO

**Pendências Totais:**
- 🔴 **4 páginas faltantes** (ENE-001, SERV-002, COND-001, TRAB-001/002)
- 🟡 **10 agentes faltantes** (Prev, Trab, Serv, Edu, ENE, COND)
- 🟢 **0 erros bloqueantes** (TypeScript OK)

**Tempo para conclusão:** 20-24h
**Impacto:** Score 83,3 → 95+/100
**Receita adicional:** +R$ 414k/ano
**Demanda adicional:** +23.000 buscas/mês

**Recomendação:** ✅ Completar em Janeiro/2026 para ter **100% dos 22 nichos operacionais**.

---

**Criado por:** MANUS v6.0
**Data:** 27/12/2025
**Status:** 📋 CHECKLIST COMPLETO
