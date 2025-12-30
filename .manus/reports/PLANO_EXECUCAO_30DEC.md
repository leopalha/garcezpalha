# 📋 PLANO DE EXECUÇÃO - SCORE 100/100

**Data:** 30/12/2025
**Fase:** PHASE 2 - PLAN (Agent Loop v7.0)
**Score Atual:** 97/100
**Meta:** 100/100
**Esforço Total:** 6h

---

## 🎯 RESUMO EXECUTIVO

| Métrica | Valor |
|---------|-------|
| **Gaps P1 a Corrigir** | 2 |
| **Produtos a Documentar** | 10 |
| **Produtos a Mapear** | 10 |
| **Esforço Total** | 6h |
| **Ganho de Score** | +3 pontos (97 → 100) |
| **Bloqueadores** | 0 |

**Estratégia:** Execução sequencial com 1 agente por gap (otimização de contexto)

---

## 📊 TAREFAS PRIORIZADAS

### ✅ COMPLETADO: FASE 1 - ANALYZE
- [x] Auditoria completa (73+ documentos)
- [x] Validação código-fonte
- [x] Cálculo de score (97/100)
- [x] Identificação de gaps (2 P1)
- [x] Relatórios criados (AUDITORIA + GAPS)

### 🔄 EM ANDAMENTO: FASE 2 - PLAN
- [x] Priorização de correções (P1-001, P1-002)
- [x] Estimativa de esforço (6h total)
- [x] Definição de estratégia (sequencial)
- [ ] Alocação de agentes

### ⏳ PENDENTE: FASE 3 - EXECUTE

#### Task 1: [P1-001] Documentar 10 Produtos
**ID:** P1-001
**Prioridade:** P1 (Alta)
**Esforço:** 5h (30min × 10 produtos)
**Dependências:** Nenhuma
**Agente:** 1 agente dedicado (general-purpose)

**Produtos a Documentar:**

**Digital (2):**
1. **cartao-consignado-rmc**
   - Categoria: Digital/Bancário
   - Demanda: 8k/mês
   - Ticket: R$ 1.800
   - Timeline: 2-3 meses
   - Base legal: CDC Art. 39

2. **lei-maria-penha**
   - Categoria: Digital/Criminal
   - Demanda: 18k/mês
   - Ticket: R$ 3.200
   - Timeline: 6-12 meses
   - Base legal: Lei 11.340/2006

**Criminal (4):**
3. **defesa-flagrante**
   - Categoria: Criminal
   - Demanda: 15k/mês
   - Ticket: R$ 3.500
   - Timeline: 1-3 meses
   - Base legal: CPP Art. 302

4. **inquerito-policial**
   - Categoria: Criminal
   - Demanda: 25k/mês
   - Ticket: R$ 2.800
   - Timeline: 6-18 meses
   - Base legal: CPP Art. 4º

5. **crimes-transito**
   - Categoria: Criminal
   - Demanda: 40k/mês
   - Ticket: R$ 2.500
   - Timeline: 6-12 meses
   - Base legal: CTB Art. 291

6. **revisao-criminal**
   - Categoria: Criminal
   - Demanda: 12k/mês
   - Ticket: R$ 4.500
   - Timeline: 12-24 meses
   - Base legal: CPP Art. 621

**Geral (4):**
7. **busca-apreensao-veiculo**
   - Categoria: Geral/Criminal
   - Demanda: 12k/mês
   - Ticket: R$ 2.500
   - Timeline: 2-4 meses
   - Base legal: CPC Art. 536

8. **vazamento-dados-lgpd**
   - Categoria: Geral/Digital
   - Demanda: 18k/mês
   - Ticket: R$ 2.200
   - Timeline: 3-6 meses
   - Base legal: LGPD Art. 42

9. **perfil-hackeado**
   - Categoria: Geral/Digital
   - Demanda: 22k/mês
   - Ticket: R$ 1.500
   - Timeline: 1-2 meses
   - Base legal: Marco Civil Art. 11

10. **problemas-marketplace**
    - Categoria: Geral/Consumidor
    - Demanda: 35k/mês
    - Ticket: R$ 1.500
    - Timeline: 2-4 meses
    - Base legal: CDC Art. 18

**Template por Produto:**
```markdown
### X.X Nome do Produto
**Slug:** `produto-slug`
**Categoria:** Categoria
**Demanda:** Xk/mês
**Ticket Médio:** R$ X.XXX
**Automação:** X%
**Timeline:** X-X meses

**Problema:**
[Descrição do problema que o cliente enfrenta]

**Solução:**
[O que o escritório faz para resolver]

**Resultado Esperado:**
[Resultado típico do serviço]

**Base Legal:**
[Leis e artigos aplicáveis]

**Features:**
- Feature 1
- Feature 2
- Feature 3

**Keywords SEO:**
- keyword 1
- keyword 2
- keyword 3
```

**Arquivo Alvo:**
`.manus/knowledge/produtos-catalogo.md`

**Critérios de Sucesso:**
- [ ] 10 seções adicionadas em produtos-catalogo.md
- [ ] Cada seção completa (slug, demanda, ticket, problema, solução, resultado, base legal, features, keywords)
- [ ] Changelog atualizado no final do arquivo
- [ ] Compliance OAB 100% (zero frases proibidas)
- [ ] Alinhamento com catalog.ts validado

---

#### Task 2: [P1-002] Mapear 10 Produtos para Agentes
**ID:** P1-002
**Prioridade:** P1 (Alta)
**Esforço:** 1h
**Dependências:** Nenhuma (pode rodar em paralelo com P1-001)
**Agente:** 1 agente dedicado (general-purpose)

**Produtos a Mapear:**
(Mesmos 10 de P1-001)

**Distribuição por Agente:**

**CriminalLawAgent** (adicionar 5 produtos):
```typescript
{
  agentRole: 'criminal',
  productIds: [
    // Existing 4
    'defesa-criminal',
    'habeas-corpus',
    'direito-criminal',
    'direito-aeronautico',
    // ADD 5 below
    'defesa-flagrante',        // +1
    'inquerito-policial',      // +2
    'crimes-transito',         // +3
    'revisao-criminal',        // +4
    'lei-maria-penha',         // +5 (também criminal)
  ],
}
```

**FinancialProtectionAgent** (adicionar 1 produto):
```typescript
{
  agentRole: 'financial-protection',
  productIds: [
    // ... existing 11 products
    'cartao-consignado-rmc',   // +1
  ],
}
```

**GeneralAgent** (adicionar 4 produtos):
```typescript
{
  agentRole: 'general',
  productIds: [
    // ... existing 12 products
    'busca-apreensao-veiculo',    // +1
    'vazamento-dados-lgpd',       // +2
    'perfil-hackeado',            // +3
    'problemas-marketplace',      // +4
  ],
}
```

**Arquivo Alvo:**
`src/lib/ai/qualification/agent-product-mapping.ts`

**Validação Após Mapeamento:**
- [ ] CriminalLawAgent: 9 produtos (4 → 9)
- [ ] FinancialProtectionAgent: 12 produtos (11 → 12)
- [ ] GeneralAgent: 16 produtos (12 → 16)
- [ ] Total mapeado: 57/57 (100%)
- [ ] Teste de roteamento: todos os 57 produtos roteiam corretamente

---

## 🎯 ESTRATÉGIA DE EXECUÇÃO

### Decisão: Sequencial vs Paralelo?

**Opção A: 2 Agentes em Paralelo** ❌
- P1-001 + P1-002 simultâneos
- **Problema**: Alto consumo de contexto (ambos leem catalog.ts + docs)
- **Risco**: Conflitos de memória e redundância

**Opção B: 1 Agente Sequencial** ✅ **ESCOLHIDA**
- P1-001 primeiro (documentação)
- P1-002 depois (mapeamento)
- **Vantagem**: Contexto compartilhado, menor custo, zero conflitos
- **Vantagem**: P1-001 informa P1-002 (conhecimento acumulado sobre produtos)

### Ordem de Execução:

**1. P1-001: Documentar Produtos (5h)**
- Agent lê catalog.ts (fonte de verdade)
- Agent lê produtos-catalogo.md (arquivo alvo)
- Agent adiciona 10 seções seguindo template
- Agent valida compliance OAB
- Agent atualiza changelog

**2. P1-002: Mapear Produtos (1h)**
- Agent reutiliza conhecimento de P1-001
- Agent edita agent-product-mapping.ts
- Agent valida mapeamento (57/57)
- Agent testa roteamento

**Total:** 6h sequenciais

---

## 📈 PROJEÇÃO DE SCORE

### Score Atual: 97/100

**Contribuição por Gap:**

| Gap | Impacto | Score Após Correção |
|-----|---------|---------------------|
| Inicial | - | 97/100 |
| **P1-001** | +2 pontos | 99/100 |
| **P1-002** | +1 ponto | **100/100** ⭐⭐⭐⭐⭐ |

**Cálculo Detalhado:**

Antes (Score 97/100):
- Completude Docs: 95.25/100 (47/57 = 82%)
- Precisão: 98.75/100
- Consistência: 97.5/100
- Utilidade: 98.75/100

Depois (Score 100/100):
- Completude Docs: 100/100 (57/57 = 100%)
- Precisão: 100/100
- Consistência: 100/100
- Utilidade: 100/100

```
Score Final = (100 × 0.30) + (100 × 0.25) + (100 × 0.25) + (100 × 0.20)
Score Final = 30 + 25 + 25 + 20
Score Final = 100/100 ✅
```

---

## ⚠️ RISCOS E MITIGAÇÕES

### Risco 1: Compliance OAB Violation
**Probabilidade:** BAIXA
**Impacto:** ALTO (score cai para 0)
**Mitigação:**
- Agent DEVE ler compliance-oab.md antes de escrever
- Validação automática: grep por 40 frases proibidas
- Double-check manual se necessário

### Risco 2: Inconsistência com catalog.ts
**Probabilidade:** MÉDIA
**Impacto:** MÉDIO (score cai para 95/100)
**Mitigação:**
- Agent DEVE ler catalog.ts como fonte de verdade
- Copiar exatamente: slug, category, name
- Validar demanda/ticket contra DADOS_MESTRES.md

### Risco 3: Template Incompleto
**Probabilidade:** BAIXA
**Impacto:** BAIXO (score 98/100)
**Mitigação:**
- Template fornecido no plano (7 campos obrigatórios)
- Checklist de critérios de sucesso
- Validação por campo antes de marcar completo

---

## ✅ CRITÉRIOS DE SUCESSO GLOBAL

### FASE 3: EXECUTE
- [ ] P1-001 implementado (10 produtos documentados)
- [ ] P1-002 implementado (10 produtos mapeados)
- [ ] Zero violations OAB
- [ ] Changelogs atualizados

### FASE 4: OBSERVE
- [ ] Produtos-catalogo.md validado (57/57 produtos)
- [ ] Agent-product-mapping.ts validado (57/57 mapeados)
- [ ] Compliance OAB: 100%
- [ ] Alinhamento código-docs: 100%

### FASE 5: ITERATE
- [ ] Score re-calculado
- [ ] Score >= 100/100 ✅
- [ ] Zero gaps P1 restantes

### FASE 6: DELIVER
- [ ] Relatório final criado
- [ ] tasks.md atualizado
- [ ] Changelog consolidado
- [ ] Próximo ciclo planejado

---

## 🚀 ALOCAÇÃO DE AGENTES

### Agent 1: Documentation Agent (P1-001)
**Type:** general-purpose
**Task:** Documentar 10 produtos em produtos-catalogo.md
**Esforço:** 5h
**Input:**
- .manus/knowledge/produtos-catalogo.md (read)
- src/lib/products/catalog.ts (read - fonte de verdade)
- business/DADOS_MESTRES.md (read - referência)
- .manus/knowledge/compliance-oab.md (read - validação)
**Output:**
- .manus/knowledge/produtos-catalogo.md (edit - 10 seções adicionadas)
- Changelog atualizado

### Agent 2: Mapping Agent (P1-002)
**Type:** general-purpose
**Task:** Mapear 10 produtos em agent-product-mapping.ts
**Esforço:** 1h
**Input:**
- src/lib/ai/qualification/agent-product-mapping.ts (read)
- src/lib/products/catalog.ts (read - validação)
**Output:**
- src/lib/ai/qualification/agent-product-mapping.ts (edit - 10 produtos adicionados)

**Ordem:** Agent 1 → Agent 2 (sequencial)

---

## 📅 TIMELINE ESTIMADO

**Total:** 6h (1 dia útil)

| Fase | Duração | Descrição |
|------|---------|-----------|
| PLAN (atual) | 30min | Criar plano de execução |
| EXECUTE (P1-001) | 5h | Documentar 10 produtos |
| EXECUTE (P1-002) | 1h | Mapear 10 produtos |
| OBSERVE | 30min | Validar implementações |
| ITERATE | 30min | Re-calcular score, ajustar se necessário |
| DELIVER | 30min | Relatório final + tasks.md |

**Total:** ~8h (incluindo fases 2-6)

---

## 🎯 PRÓXIMA AÇÃO IMEDIATA

**Status Atual:** FASE 2 - PLAN ✅ COMPLETO

**Próximo Passo:** FASE 3 - EXECUTE

**Comando:**
```
Lançar Agent 1 (Documentation Agent) para executar P1-001:
- Documentar 10 produtos em produtos-catalogo.md
- Seguir template fornecido
- Validar compliance OAB
- Atualizar changelog
```

**Após Agent 1:**
```
Lançar Agent 2 (Mapping Agent) para executar P1-002:
- Mapear 10 produtos em agent-product-mapping.ts
- Validar mapeamento total (57/57)
- Testar roteamento
```

**Meta:** Score 100/100 ⭐⭐⭐⭐⭐

---

**Plano criado por:** MANUS v7.0 - FASE 2 (PLAN)
**Data:** 30/12/2025
**Status:** ✅ PLANO APROVADO - PRONTO PARA EXECUÇÃO
