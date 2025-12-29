# PROTOCOLO: Task Generation MANUS v7.0

**Versão**: 1.0
**Data**: 29/12/2025
**Sistema**: MANUS v7.0 (Multi-Agent Network for Unified Systems)
**Projeto**: Garcez Palha - Advocacia Digital

---

## ÍNDICE

1. [Visão Geral](#visão-geral)
2. [Quando Ativar](#quando-ativar)
3. [Processo de Geração](#processo-de-geração)
4. [Template tasks.md](#template-tasksmd)
5. [Categorias de Tasks](#categorias-de-tasks)
6. [Priorização Automática](#priorização-automática)
7. [Exemplos Práticos](#exemplos-práticos)
8. [Integração com Agent Loop](#integração-com-agent-loop)

---

## VISÃO GERAL

### O que é Task Generation?

**Task Generation** é o protocolo automático de MANUS v7.0 para:
- Identificar próximos passos do projeto
- Gerar lista de tasks actionable
- Priorizar tasks por impacto/urgência
- Categorizar tasks por tipo (PAGES, FLOWS, ADS, DOCS)
- Estimar esforço e prazo

### Por que usar?

**Benefícios:**
- 🎯 **Clareza:** Usuário sabe exatamente o que fazer
- ⚡ **Velocidade:** Tasks geradas em 5-10 minutos
- 📊 **Priorização:** Tasks já vêm ordenadas por P0/P1/P2
- 🔄 **Continuidade:** Mantém projeto em movimento constante
- 📈 **Mensuração:** Progresso visível e mensurável

### Diferença vs Agent Loop

| Aspecto | Agent Loop | Task Generation |
|---------|-----------|-----------------|
| **Foco** | Auditoria + correção | Geração de próximos passos |
| **Input** | Documentação existente | Knowledge base + gaps |
| **Output** | Relatórios + correções | Lista de tasks priorizadas |
| **Duração** | 5-14 horas | 5-15 minutos |
| **Quando usar** | Auditoria completa | Após sprint, após feature |

---

## QUANDO ATIVAR

### Comandos que ativam Task Generation

MANUS DEVE ativar Task Generation automaticamente quando usuário disser:

1. **"Gere tasks"** / "Crie tasks" / "Liste próximos passos"
2. **"O que fazer agora?"** / "Próximas ações"
3. **"Atualize tasks.md"** / "Refresh tasks"
4. **"Após auditoria, o que implementar?"**
5. **"Roadmap de próximas features"**

### Gatilhos automáticos

MANUS PODE sugerir Task Generation quando:

1. **Após DELIVER no Agent Loop**
   - Auditoria finalizada, score 90+
   - Usuário pergunta "E agora?"

2. **Após implementar feature**
   - Código commitado
   - Usuário pergunta próximos passos

3. **Após identificar gaps**
   - ANALYZE encontrou 10+ gaps P1/P2
   - Usuário quer roadmap

4. **Início de sprint**
   - Usuário quer planejar sprint
   - Precisa de backlog priorizado

### Quando NÃO ativar

NÃO use Task Generation se:
- Usuário pediu apenas auditoria (use Agent Loop)
- Usuário pediu implementação específica (execute diretamente)
- Usuário está no meio de uma task (finalize antes)
- tasks.md já foi atualizado recentemente (< 24h)

---

## PROCESSO DE GERAÇÃO

### Fluxo completo

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     TASK GENERATION - FLUXO                              │
└─────────────────────────────────────────────────────────────────────────┘

  START (comando "gere tasks")
    │
    ▼
┌─────────────────┐
│  1. LEITURA     │  ⏱️ 3-5 min
│                 │
│ • Ler knowledge/│
│ • Ler docs/     │
│ • Ler tasks.md  │
│   atual         │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│  2. ANÁLISE     │  ⏱️ 2-4 min
│     DE GAPS     │
│                 │
│ • Produtos sem  │
│   página        │
│ • Flows sem VSL │
│ • Campanhas sem │
│   criativo      │
│ • Docs ausentes │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│  3. GERAÇÃO     │  ⏱️ 1-2 min
│                 │
│ • Criar tasks   │
│   por categoria │
│ • Estimar       │
│   esforço       │
│ • Adicionar     │
│   contexto      │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│ 4. PRIORIZAÇÃO  │  ⏱️ 1-2 min
│                 │
│ • Classificar   │
│   P0/P1/P2      │
│ • Ordenar por   │
│   impacto       │
│ • Agrupar por   │
│   sprint        │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│  5. OUTPUT      │  ⏱️ 1-2 min
│                 │
│ • Gerar tasks.md│
│ • Resumo        │
│   executivo     │
│ • Roadmap       │
│   sugerido      │
└─────────────────┘
    │
    ▼
  END (tasks.md atualizado)
```

---

## FASE 1: LEITURA

### Objetivo

Ler TODA a knowledge base para entender estado atual do projeto.

### Tempo estimado

**3-5 minutos**

### Arquivos obrigatórios a ler

| Arquivo | Informação extraída |
|---------|---------------------|
| `.manus/knowledge/INDEX.md` | Visão geral, scores, próximos passos |
| `.manus/knowledge/produtos-catalogo.md` | 57 produtos, gaps de documentação |
| `.manus/knowledge/pages-implementadas.md` | Páginas implementadas, sistema de roteamento |
| `.manus/knowledge/agentes-juridicos.md` | 23 agentes, mapeamento agent→produto |
| `.manus/knowledge/compliance-oab.md` | Regras OAB, frases proibidas/permitidas |
| `.manus/knowledge/tech-stack.md` | Dependências, versões |
| `docs/tasks.md` (se existir) | Tasks atuais, status de cada uma |

### Tools usadas

```typescript
Read(".manus/knowledge/INDEX.md")
Read(".manus/knowledge/produtos-catalogo.md")
Read(".manus/knowledge/pages-implementadas.md")
Read(".manus/knowledge/agentes-juridicos.md")
Read(".manus/knowledge/compliance-oab.md")
Read(".manus/knowledge/tech-stack.md")
Read("docs/tasks.md") // pode não existir
```

### O que extrair de cada arquivo

**INDEX.md:**
- Score atual do projeto
- Próximos passos já identificados (seção "PRÓXIMOS PASSOS")
- Gaps conhecidos (seção "GAPS IDENTIFICADOS")

**produtos-catalogo.md:**
- 57 produtos implementados
- Produtos sem documentação completa (identificados no INDEX)
- Produtos prioritários (prioridade 5)

**pages-implementadas.md:**
- 57 páginas potenciais (roteamento dinâmico)
- Sistema de VSL implementado
- Componentes ProductVSL

**agentes-juridicos.md:**
- 23 agentes implementados
- Mapeamento agent→produto
- Produtos sem agent dedicado

**compliance-oab.md:**
- 40 frases proibidas
- 40 alternativas permitidas
- Regras críticas de compliance

**tasks.md (se existir):**
- Tasks pendentes
- Tasks em andamento
- Tasks completadas (para não duplicar)

---

## FASE 2: ANÁLISE DE GAPS

### Objetivo

Identificar o que está faltando no projeto, categorizando em 4 tipos de gaps.

### Tempo estimado

**2-4 minutos**

### 4 Tipos de Gaps

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          TIPOS DE GAPS                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1. [MANUS-PAGES]   - Páginas/features faltando                         │
│  2. [MANUS-FLOWS]   - Fluxos de usuário/VSLs incompletos                │
│  3. [MANUS-ADS]     - Campanhas/criativos faltando                      │
│  4. [MANUS-DOCS]    - Documentação ausente/desatualizada                │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 1. MANUS-PAGES (Páginas/Features)

**O que procurar:**
- Produtos no catálogo SEM página implementada
- Features mencionadas em docs mas não no código
- Páginas incompletas (sem VSL, sem CTA, sem SEO)

**Exemplo de gap:**
```markdown
[MANUS-PAGES-001] Criar página para "Cartão Consignado RMC"
- Contexto: Produto existe no catálogo mas não tem página
- Impacto: Perda de vendas (demanda 15k/mês)
- Esforço: 2h
```

### 2. MANUS-FLOWS (Fluxos/VSLs)

**O que procurar:**
- VSLs incompletas (falta seção de agitation, social proof, etc)
- Qualification flows não implementados
- User journeys não documentados
- Checkout flows com problemas

**Exemplo de gap:**
```markdown
[MANUS-FLOWS-002] Completar VSL de "Seguro Prestamista"
- Contexto: VSL existe mas falta seção de FAQ e garantia
- Impacto: Taxa de conversão baixa
- Esforço: 1h
```

### 3. MANUS-ADS (Campanhas/Criativos)

**O que procurar:**
- Produtos sem campanha Google Ads
- Produtos sem criativos Meta Ads
- Landing pages sem pixel de conversão
- Keywords SEO não otimizadas

**Exemplo de gap:**
```markdown
[MANUS-ADS-003] Criar campanha Google Ads para "Fraude Consignado"
- Contexto: Produto prioritário (25k buscas/mês) sem campanha
- Impacto: Perda de tráfego qualificado
- Esforço: 3h
```

### 4. MANUS-DOCS (Documentação)

**O que procurar:**
- Produtos sem documentação completa
- Componentes sem doc no COMPONENT_LIBRARY
- Agentes sem documentação de prompts
- Fluxos técnicos não documentados

**Exemplo de gap:**
```markdown
[MANUS-DOCS-004] Documentar 10 produtos extras
- Contexto: Produtos implementados mas não em CATALOGO_COMPLETO
- Impacto: Documentação incompleta (score 95→100)
- Esforço: 4h
```

### Como identificar gaps automaticamente

**1. Produtos sem página:**
```typescript
// Ler catálogo
const catalog = Read(".manus/knowledge/produtos-catalogo.md")
const products = extractProducts(catalog) // 57 produtos

// Ler páginas implementadas
const pages = Read(".manus/knowledge/pages-implementadas.md")

// Identificar gaps
const gaps = products.filter(p => !pages.includes(p.slug))
// Resultado: lista de produtos sem página
```

**2. VSLs incompletas:**
```typescript
// Ler vsl-config.ts
const vslConfig = Read("src/lib/products/vsl-config.ts")

// Produtos usando defaultVSLConfig (incompleto)
const incompleteVSLs = products.filter(p =>
  vslConfig.includes(`case '${p.slug}': return defaultVSLConfig`)
)
```

**3. Produtos sem campanha Ads:**
```typescript
// Ler arquivo de campanhas (se existir)
const campaigns = Read("docs/25-GOOGLE-ADS-CAMPANHAS.md")

// Produtos prioritários sem campanha
const noCampaign = products
  .filter(p => p.priority >= 4)
  .filter(p => !campaigns.includes(p.slug))
```

**4. Produtos sem doc completa:**
```typescript
// Ler INDEX.md seção "GAPS IDENTIFICADOS"
const index = Read(".manus/knowledge/INDEX.md")

// Extrair lista de produtos sem documentação
const undocumented = extractUndocumentedProducts(index)
// Resultado: ["cartao-consignado-rmc", "busca-apreensao-veiculo", ...]
```

---

## FASE 3: GERAÇÃO

### Objetivo

Transformar gaps identificados em tasks actionable e bem descritas.

### Tempo estimado

**1-2 minutos**

### Estrutura de uma task

```markdown
### [CATEGORIA-XXX] Título da task

**Prioridade:** P0 | P1 | P2
**Esforço:** Xh
**Sprint:** Sprint X
**Responsável:** MANUS | Dev | Designer

**Contexto:**
Descrição do problema/oportunidade

**Critérios de Aceitação:**
- [ ] Critério 1
- [ ] Critério 2
- [ ] Critério 3

**Dependências:**
- Task YYY (se aplicável)

**Arquivos afetados:**
- src/path/to/file.ts
- docs/path/to/doc.md
```

### Regras de geração

1. **ID único:** [CATEGORIA-NNN] (ex: [MANUS-PAGES-001])
2. **Título descritivo:** Ação + Objeto (ex: "Criar página para X")
3. **Prioridade obrigatória:** P0/P1/P2
4. **Esforço estimado:** Em horas (0.5h, 1h, 2h, 4h, 8h)
5. **Critérios de aceitação:** Mínimo 3 critérios objetivos
6. **Arquivos afetados:** Lista completa de arquivos a criar/editar

### Exemplos de tasks geradas

**MANUS-PAGES:**
```markdown
### [MANUS-PAGES-001] Criar página para "Cartão Consignado RMC"

**Prioridade:** P1
**Esforço:** 2h
**Sprint:** Sprint 2
**Responsável:** Dev

**Contexto:**
Produto "Cartão Consignado RMC" existe no catálogo (demanda 15k/mês)
mas não tem página implementada. Potencial de 30-50 contratos/mês.

**Critérios de Aceitação:**
- [ ] Página acessível em /solucoes/bancario/cartao-consignado-rmc
- [ ] VSL completa com 9 seções (hero, agitation, solution, etc)
- [ ] SEO metadata configurada (title, description, keywords)
- [ ] Integração com ChatAssistant (context: "cartao-consignado")
- [ ] CTA funcionais (contratar agora → checkout)
- [ ] Compliance OAB validado (sem frases proibidas)

**Dependências:**
- [MANUS-FLOWS-005] Criar VSL config para cartao-consignado-rmc
- [MANUS-DOCS-008] Documentar produto em CATALOGO_COMPLETO

**Arquivos afetados:**
- src/app/(marketing)/solucoes/[category]/[slug]/page.tsx (já existe - roteamento dinâmico)
- src/lib/products/vsl-config.ts (adicionar config específica)
- src/lib/products/catalog.ts (validar que produto existe)
```

**MANUS-FLOWS:**
```markdown
### [MANUS-FLOWS-002] Completar VSL de "Seguro Prestamista"

**Prioridade:** P2
**Esforço:** 1h
**Sprint:** Sprint 1
**Responsável:** MANUS

**Contexto:**
VSL do produto "Seguro Prestamista" está usando defaultVSLConfig.
Precisa customizar para aumentar conversão (produto prioritário).

**Critérios de Aceitação:**
- [ ] Seção de agitation com 5 dores específicas de seguro prestamista
- [ ] Seção de social proof com estatísticas reais (1.200+ clientes, 94% sucesso)
- [ ] FAQ com 10 perguntas frequentes
- [ ] Seção de garantia customizada (processo JEC, sem custas)
- [ ] Urgency message sobre prazo prescricional (5 anos)

**Dependências:**
Nenhuma

**Arquivos afetados:**
- src/lib/products/vsl-config.ts
```

**MANUS-ADS:**
```markdown
### [MANUS-ADS-003] Criar campanha Google Ads para "Fraude Consignado"

**Prioridade:** P1
**Esforço:** 3h
**Sprint:** Sprint 2
**Responsável:** CMO Agent

**Contexto:**
Produto "Fraude Consignado" tem demanda alta (25k buscas/mês) mas
zero tráfego orgânico. Campanha Ads pode gerar 100-200 leads/mês.

**Critérios de Aceitação:**
- [ ] 3 grupos de anúncios criados (branded, genérico, concorrência)
- [ ] 10-15 keywords negativas configuradas
- [ ] Landing page otimizada (/solucoes/bancario/fraude-consignado)
- [ ] Pixel de conversão instalado
- [ ] Budget R$ 3.000/mês alocado
- [ ] Lances otimizados para CPA < R$ 50

**Dependências:**
- [MANUS-PAGES-002] Otimizar landing page de fraude-consignado

**Arquivos afetados:**
- docs/25-GOOGLE-ADS-CAMPANHAS.md (adicionar campanha)
- src/app/(marketing)/solucoes/bancario/fraude-consignado/ (otimizar)
```

**MANUS-DOCS:**
```markdown
### [MANUS-DOCS-004] Documentar 10 produtos extras

**Prioridade:** P1
**Esforço:** 4h
**Sprint:** Sprint 1
**Responsável:** MANUS

**Contexto:**
10 produtos estão implementados no código mas não documentados em
CATALOGO_COMPLETO_47_NICHOS.md. Score atual 95/100, meta 100/100.

**Critérios de Aceitação:**
- [ ] 10 produtos adicionados em CATALOGO_COMPLETO_47_NICHOS.md
- [ ] Cada produto tem: slug, demanda/mês, ticket, automação%, agent, status
- [ ] Mapeamento agent→produto atualizado
- [ ] INDEX.md atualizado (remover da seção GAPS)
- [ ] Score recalculado (esperado 100/100)

**Dependências:**
Nenhuma

**Arquivos afetados:**
- docs/CATALOGO_COMPLETO_47_NICHOS.md
- .manus/knowledge/produtos-catalogo.md (sincronizar)
- .manus/knowledge/INDEX.md (atualizar gaps)
```

---

## FASE 4: PRIORIZAÇÃO

### Objetivo

Ordenar tasks por prioridade (P0 → P1 → P2) e impacto/urgência.

### Tempo estimado

**1-2 minutos**

### Critérios de priorização

**P0 (Crítico):**
- Bloqueia vendas (página de produto prioritário não existe)
- Violação compliance OAB (frases proibidas no site)
- Bug crítico em produção
- **Prazo:** 0-24h

**P1 (Alta):**
- Impacta conversão significativamente (VSL incompleta)
- Produto com demanda > 20k/mês sem campanha Ads
- Documentação crítica ausente (score < 90)
- **Prazo:** 1-3 dias

**P2 (Média):**
- Melhorias de UX/UI
- Documentação complementar
- Otimizações de performance
- **Prazo:** 1-2 semanas

### Matriz de priorização

```
Impacto vs Urgência

         │ Alta Urgência │ Média Urgência │ Baixa Urgência │
─────────┼───────────────┼────────────────┼────────────────┤
Alto     │      P0       │       P1       │       P1       │
Impacto  │               │                │                │
─────────┼───────────────┼────────────────┼────────────────┤
Médio    │      P1       │       P1       │       P2       │
Impacto  │               │                │                │
─────────┼───────────────┼────────────────┼────────────────┤
Baixo    │      P1       │       P2       │       P2       │
Impacto  │               │                │                │
```

### Fatores de impacto

**Alto impacto:**
- Produto com demanda > 20k/mês
- Conversão > 5% esperada
- Receita potencial > R$ 10k/mês
- Compliance OAB crítico

**Médio impacto:**
- Produto com demanda 10-20k/mês
- Conversão 2-5% esperada
- Receita potencial R$ 5-10k/mês
- Melhoria de score significativa

**Baixo impacto:**
- Produto com demanda < 10k/mês
- Conversão < 2% esperada
- Receita potencial < R$ 5k/mês
- Refinamentos estéticos

### Agrupamento por sprint

**Sprint 1 (1 semana):**
- TODAS as tasks P0
- Tasks P1 de alto impacto
- Total: 8-15h de trabalho

**Sprint 2 (1 semana):**
- Tasks P1 remanescentes
- Tasks P2 de médio impacto
- Total: 8-15h de trabalho

**Sprint 3 (1 semana):**
- Tasks P2 remanescentes
- Melhorias contínuas
- Total: 8-15h de trabalho

---

## FASE 5: OUTPUT

### Objetivo

Gerar arquivo `docs/tasks.md` completo e atualizado.

### Tempo estimado

**1-2 minutos**

### Estrutura do output

Ver seção [Template tasks.md](#template-tasksmd) para estrutura completa.

**Componentes obrigatórios:**

1. **Resumo executivo**
   - Total de tasks
   - Distribuição P0/P1/P2
   - Esforço total estimado
   - Duração estimada (sprints)

2. **Tasks por categoria**
   - [MANUS-PAGES]
   - [MANUS-FLOWS]
   - [MANUS-ADS]
   - [MANUS-DOCS]

3. **Roadmap sugerido**
   - Sprint 1: Tasks P0 + P1 críticas
   - Sprint 2: Tasks P1 remanescentes
   - Sprint 3: Tasks P2

4. **Métricas de sucesso**
   - Score meta: 100/100
   - MRR meta: R$ 75.000/mês
   - Taxa de conversão meta: 5%

### Tools usadas

```typescript
Write("docs/tasks.md", generatedContent)
```

---

## TEMPLATE TASKS.MD

```markdown
# TASKS - GARCEZ PALHA

**Versão**: 1.0
**Última atualização**: 29/12/2025
**Score atual**: 95/100
**Meta**: 100/100

---

## RESUMO EXECUTIVO

| Métrica | Valor |
|---------|-------|
| **Total de tasks** | 28 |
| **P0 (Crítico)** | 2 |
| **P1 (Alta)** | 14 |
| **P2 (Média)** | 12 |
| **Esforço total** | 72h |
| **Duração estimada** | 3 sprints (3 semanas) |

**Distribuição por categoria:**
- [MANUS-PAGES]: 8 tasks (22h)
- [MANUS-FLOWS]: 6 tasks (12h)
- [MANUS-ADS]: 7 tasks (24h)
- [MANUS-DOCS]: 7 tasks (14h)

---

## SPRINT 1: CRÍTICO (1 semana - 18h)

### [MANUS-PAGES-001] Criar página para "Cartão Consignado RMC"

**Prioridade:** P1
**Esforço:** 2h
**Status:** ⏳ PENDENTE
**Responsável:** Dev

**Contexto:**
Produto "Cartão Consignado RMC" existe no catálogo (demanda 15k/mês)
mas não tem página implementada. Potencial de 30-50 contratos/mês.

**Critérios de Aceitação:**
- [ ] Página acessível em /solucoes/bancario/cartao-consignado-rmc
- [ ] VSL completa com 9 seções
- [ ] SEO metadata configurada
- [ ] Integração com ChatAssistant
- [ ] CTA funcionais
- [ ] Compliance OAB validado

**Arquivos afetados:**
- src/app/(marketing)/solucoes/[category]/[slug]/page.tsx
- src/lib/products/vsl-config.ts
- src/lib/products/catalog.ts

---

### [MANUS-DOCS-004] Documentar 10 produtos extras

**Prioridade:** P1
**Esforço:** 4h
**Status:** ⏳ PENDENTE
**Responsável:** MANUS

**Contexto:**
10 produtos estão implementados no código mas não documentados.
Score atual 95/100, meta 100/100.

**Critérios de Aceitação:**
- [ ] 10 produtos adicionados em CATALOGO_COMPLETO_47_NICHOS.md
- [ ] Mapeamento agent→produto atualizado
- [ ] INDEX.md atualizado
- [ ] Score recalculado (esperado 100/100)

**Arquivos afetados:**
- docs/CATALOGO_COMPLETO_47_NICHOS.md
- .manus/knowledge/produtos-catalogo.md
- .manus/knowledge/INDEX.md

---

### [MANUS-ADS-003] Criar campanha Google Ads para "Fraude Consignado"

**Prioridade:** P1
**Esforço:** 3h
**Status:** ⏳ PENDENTE
**Responsável:** CMO Agent

**Contexto:**
Produto com demanda alta (25k buscas/mês) sem tráfego.
Campanha Ads pode gerar 100-200 leads/mês.

**Critérios de Aceitação:**
- [ ] 3 grupos de anúncios criados
- [ ] 10-15 keywords negativas configuradas
- [ ] Landing page otimizada
- [ ] Pixel de conversão instalado
- [ ] Budget R$ 3.000/mês alocado
- [ ] CPA meta < R$ 50

**Arquivos afetados:**
- docs/25-GOOGLE-ADS-CAMPANHAS.md
- src/app/(marketing)/solucoes/bancario/fraude-consignado/

---

[... demais tasks do Sprint 1 ...]

---

## SPRINT 2: ALTA PRIORIDADE (1 semana - 28h)

### [MANUS-PAGES-002] Criar páginas para 5 produtos criminais

**Prioridade:** P1
**Esforço:** 8h
**Status:** ⏳ PENDENTE
**Responsável:** Dev

**Contexto:**
5 produtos da área criminal não têm páginas implementadas:
- defesa-flagrante
- inquerito-policial
- crimes-transito
- direito-aeronautico
- lei-maria-penha

**Critérios de Aceitação:**
- [ ] 5 páginas criadas em /solucoes/criminal/
- [ ] VSLs customizadas para cada produto
- [ ] Compliance OAB extra rigoroso (área criminal)
- [ ] Integration com CriminalLawAgent

**Arquivos afetados:**
- src/lib/products/vsl-config.ts (5 configs)
- src/lib/ai/qualification/criminal-flow.ts (validar)

---

[... demais tasks do Sprint 2 ...]

---

## SPRINT 3: MELHORIAS (1 semana - 26h)

### [MANUS-FLOWS-005] Adicionar qualification flows interativos

**Prioridade:** P2
**Esforço:** 6h
**Status:** ⏳ PENDENTE
**Responsável:** Dev

**Contexto:**
VSLs atuais são estáticas. Adicionar qualification flow interativo
pode aumentar conversão de 3% para 7-10%.

**Critérios de Aceitação:**
- [ ] Implementar multi-step form no VSL
- [ ] Integrar com ChatAssistant para qualificação
- [ ] Salvar respostas em localStorage
- [ ] Pré-preencher checkout com dados qualificados
- [ ] A/B test configurado (VSL estática vs interativa)

**Arquivos afetados:**
- src/components/vsl/ProductVSL.tsx
- src/components/qualification/MultiStepForm.tsx (criar)
- src/lib/ai/qualification/ (integrar)

---

[... demais tasks do Sprint 3 ...]

---

## ROADMAP SUGERIDO

```
Sprint 1 (Semana 1)
├── [MANUS-PAGES-001] Página Cartão Consignado RMC (2h)
├── [MANUS-DOCS-004] Documentar 10 produtos (4h)
├── [MANUS-ADS-003] Campanha Fraude Consignado (3h)
├── [MANUS-FLOWS-001] Completar VSLs prioritárias (4h)
└── [MANUS-DOCS-001] Criar COMPONENT_LIBRARY (5h)
Total: 18h

Sprint 2 (Semana 2)
├── [MANUS-PAGES-002] 5 páginas criminais (8h)
├── [MANUS-ADS-005] 10 campanhas produtos P1 (12h)
├── [MANUS-FLOWS-003] Otimizar checkout (4h)
└── [MANUS-DOCS-002] Diagramas arquitetura (4h)
Total: 28h

Sprint 3 (Semana 3)
├── [MANUS-FLOWS-005] Qualification flows (6h)
├── [MANUS-ADS-008] A/B tests criativos (8h)
├── [MANUS-PAGES-006] Landing pages específicas (8h)
└── [MANUS-DOCS-006] Tradução docs para inglês (4h)
Total: 26h
```

---

## MÉTRICAS DE SUCESSO

### Score de Documentação
- **Atual:** 95/100
- **Meta Sprint 1:** 98/100
- **Meta Sprint 2:** 100/100
- **Meta Sprint 3:** 100/100 (mantido)

### MRR (Receita Recorrente Mensal)
- **Atual:** R$ 0 (pré-launch)
- **Meta Sprint 1:** R$ 10.000 (soft launch)
- **Meta Sprint 2:** R$ 30.000 (ramp up)
- **Meta Sprint 3:** R$ 50.000
- **Meta 6 meses:** R$ 75.000

### Taxa de Conversão
- **Atual:** 0% (sem tráfego)
- **Meta Sprint 1:** 2-3% (VSLs básicas)
- **Meta Sprint 2:** 4-5% (VSLs otimizadas)
- **Meta Sprint 3:** 7-10% (qualification flows)

### Tráfego Mensal
- **Atual:** 0 visitantes
- **Meta Sprint 1:** 1.000 visitantes (orgânico + ads)
- **Meta Sprint 2:** 5.000 visitantes
- **Meta Sprint 3:** 10.000 visitantes

---

## CHANGELOG

### v1.0 - 29/12/2025
- ✅ Tasks geradas por MANUS v7.0
- ✅ 28 tasks criadas e priorizadas
- ✅ Roadmap de 3 sprints definido
- ✅ Métricas de sucesso estabelecidas

---

**Gerado por MANUS v7.0**
**Próxima atualização:** Após conclusão Sprint 1
```

---

## CATEGORIAS DE TASKS

### [MANUS-PAGES] - Páginas e Features

**Escopo:**
- Criar novas páginas de produtos
- Implementar features faltantes
- Otimizar páginas existentes
- Corrigir bugs em páginas

**Exemplos:**
- Criar página para produto X
- Adicionar seção de FAQ em página Y
- Otimizar performance de checkout
- Corrigir bug em formulário de contato

**Responsável típico:** Dev

**Esforço típico:** 1-8h por task

---

### [MANUS-FLOWS] - Fluxos de Usuário

**Escopo:**
- Criar/completar VSLs
- Implementar qualification flows
- Otimizar user journeys
- Criar funnels de conversão

**Exemplos:**
- Completar VSL de produto X
- Criar qualification flow interativo
- Otimizar fluxo de checkout
- Implementar abandoned cart recovery

**Responsável típico:** Dev + Designer

**Esforço típico:** 2-6h por task

---

### [MANUS-ADS] - Campanhas e Marketing

**Escopo:**
- Criar campanhas Google Ads
- Criar campanhas Meta Ads
- Otimizar keywords SEO
- Criar criativos
- Configurar pixels de conversão

**Exemplos:**
- Criar campanha Google Ads para produto X
- Otimizar keywords de produto Y
- Criar 10 variações de criativo para Facebook
- Configurar Google Analytics 4

**Responsável típico:** CMO Agent + AdsAgent

**Esforço típico:** 2-8h por task

---

### [MANUS-DOCS] - Documentação

**Escopo:**
- Documentar produtos
- Documentar componentes
- Criar diagramas técnicos
- Atualizar knowledge base

**Exemplos:**
- Documentar 10 produtos extras
- Criar COMPONENT_LIBRARY.md
- Adicionar diagramas de arquitetura
- Traduzir documentação para inglês

**Responsável típico:** MANUS

**Esforço típico:** 1-8h por task

---

## PRIORIZAÇÃO AUTOMÁTICA

### Algoritmo de priorização

```typescript
function calculatePriority(task: Task): 'P0' | 'P1' | 'P2' {
  const score = calculateScore(task)

  if (score >= 80) return 'P0'  // Crítico
  if (score >= 50) return 'P1'  // Alta
  return 'P2'                   // Média
}

function calculateScore(task: Task): number {
  let score = 0

  // Fator 1: Demanda do produto (0-30 pontos)
  if (task.productDemand >= 30000) score += 30
  else if (task.productDemand >= 20000) score += 25
  else if (task.productDemand >= 10000) score += 20
  else if (task.productDemand >= 5000) score += 15
  else score += 10

  // Fator 2: Receita potencial (0-30 pontos)
  if (task.revenuePerMonth >= 20000) score += 30
  else if (task.revenuePerMonth >= 10000) score += 25
  else if (task.revenuePerMonth >= 5000) score += 20
  else if (task.revenuePerMonth >= 2000) score += 15
  else score += 10

  // Fator 3: Urgência (0-20 pontos)
  if (task.urgency === 'immediate') score += 20
  else if (task.urgency === 'high') score += 15
  else if (task.urgency === 'medium') score += 10
  else score += 5

  // Fator 4: Compliance (0-20 pontos)
  if (task.isComplianceCritical) score += 20
  else if (task.hasComplianceRisk) score += 10

  return score
}
```

### Exemplos de cálculo

**Task: Criar página "Fraude Consignado"**
```
Demanda: 25.000/mês           → 25 pontos
Receita: R$ 15.000/mês        → 25 pontos
Urgência: Alta                → 15 pontos
Compliance: Crítico (OAB)     → 20 pontos
────────────────────────────────────────
TOTAL: 85 pontos → P0 (CRÍTICO)
```

**Task: Completar VSL "Seguro Prestamista"**
```
Demanda: 20.000/mês           → 25 pontos
Receita: R$ 8.000/mês         → 20 pontos
Urgência: Média               → 10 pontos
Compliance: Não crítico       → 0 pontos
────────────────────────────────────────
TOTAL: 55 pontos → P1 (ALTA)
```

**Task: Adicionar FAQ em página X**
```
Demanda: 5.000/mês            → 15 pontos
Receita: R$ 1.000/mês         → 10 pontos
Urgência: Baixa               → 5 pontos
Compliance: Não crítico       → 0 pontos
────────────────────────────────────────
TOTAL: 30 pontos → P2 (MÉDIA)
```

---

## EXEMPLOS PRÁTICOS

### Exemplo 1: Após auditoria MANUS

**Contexto:**
- Auditoria MANUS finalizada
- Score: 95/100
- Usuário pergunta: "O que fazer agora?"

**Processo:**

```markdown
1. LEITURA (3 min)
   - Ler INDEX.md → Identificar gaps: 10 produtos sem doc
   - Ler produtos-catalogo.md → Produtos prioritários
   - Ler pages-implementadas.md → Sistema de páginas OK

2. ANÁLISE DE GAPS (2 min)
   - [MANUS-DOCS] 10 produtos sem documentação (4h)
   - [MANUS-PAGES] 5 produtos sem página (10h)
   - [MANUS-ADS] 15 produtos sem campanha (24h)

3. GERAÇÃO (2 min)
   - Gerar 30 tasks distribuídas em 4 categorias
   - Estimar esforço total: 72h

4. PRIORIZAÇÃO (1 min)
   - P0: 0 tasks (nenhum bloqueador)
   - P1: 15 tasks (documentação + páginas prioritárias)
   - P2: 15 tasks (melhorias)

5. OUTPUT (1 min)
   - Criar docs/tasks.md
   - Resumo: 30 tasks, 3 sprints, 72h total
```

**Output gerado:**
```markdown
# TASKS - GARCEZ PALHA

**Total**: 30 tasks
**P0**: 0 | **P1**: 15 | **P2**: 15
**Esforço**: 72h (3 sprints)

## SPRINT 1 (P1 críticas - 24h)
- [MANUS-DOCS-001] Documentar 10 produtos (4h)
- [MANUS-PAGES-001] Criar 5 páginas produtos prioritários (10h)
- [MANUS-ADS-001] Criar campanhas para 5 produtos top (10h)

[...]
```

---

### Exemplo 2: Após implementar feature

**Contexto:**
- Dev implementou 3 novas páginas
- Código commitado
- Usuário pergunta: "Gere tasks para próximas features"

**Processo:**

```markdown
1. LEITURA (2 min)
   - Ler git log → 3 páginas implementadas
   - Ler produtos-catalogo.md → 54 produtos restantes sem página
   - Ler tasks.md atual → Identificar tasks completadas

2. ANÁLISE DE GAPS (2 min)
   - [MANUS-PAGES] 54 produtos sem página (mas priorizar top 10)
   - [MANUS-FLOWS] 3 páginas novas sem VSL customizada (3h)
   - [MANUS-ADS] 3 páginas novas sem campanha (6h)

3. GERAÇÃO (1 min)
   - Gerar 16 tasks (10 PAGES + 3 FLOWS + 3 ADS)
   - Focar em produtos P1 (demanda > 15k/mês)

4. PRIORIZAÇÃO (1 min)
   - P0: 0
   - P1: 10 tasks (produtos alta demanda)
   - P2: 6 tasks (refinamentos)

5. OUTPUT (1 min)
   - Atualizar docs/tasks.md
   - Marcar 3 tasks anteriores como ✅ CONCLUÍDO
   - Adicionar 16 novas tasks
```

---

### Exemplo 3: Planejamento de sprint

**Contexto:**
- Início de sprint
- Usuário: "Liste tarefas para Sprint 3"

**Processo:**

```markdown
1. LEITURA (3 min)
   - Ler tasks.md → Identificar tasks P2 pendentes
   - Ler INDEX.md → Score atual 98/100 (meta 100/100)
   - Ler produtos-catalogo.md → Produtos com maior ROI

2. ANÁLISE DE GAPS (1 min)
   - [MANUS-FLOWS] Qualification flows não implementados
   - [MANUS-ADS] A/B tests pendentes
   - [MANUS-DOCS] Documentação em inglês (expansão)

3. GERAÇÃO (1 min)
   - Selecionar tasks P2 de maior impacto
   - Agrupar tasks relacionadas

4. PRIORIZAÇÃO (1 min)
   - Ordenar por ROI esperado
   - Balancear esforço (15h total para sprint)

5. OUTPUT (1 min)
   - Gerar lista de 8-10 tasks para Sprint 3
   - Roadmap detalhado
```

**Output:**
```markdown
## SPRINT 3: MELHORIAS (1 semana - 15h)

### Tasks selecionadas (ordenadas por ROI)

1. [MANUS-FLOWS-005] Qualification flows interativos (6h)
   - ROI esperado: +5% conversão = +R$ 15k MRR

2. [MANUS-ADS-012] A/B tests criativos (4h)
   - ROI esperado: -30% CPA = economia R$ 3k/mês

3. [MANUS-PAGES-018] Landing pages específicas (5h)
   - ROI esperado: +2% conversão = +R$ 6k MRR

**Total esforço:** 15h
**ROI esperado:** +R$ 24k MRR
```

---

## INTEGRAÇÃO COM AGENT LOOP

### Quando usar Task Generation vs Agent Loop

| Situação | Usar |
|----------|------|
| Auditoria completa | Agent Loop |
| Correção de inconsistências | Agent Loop |
| Score < 80 | Agent Loop |
| Após auditoria (score 90+) | Task Generation |
| Planejamento de sprint | Task Generation |
| Após implementar feature | Task Generation |
| Roadmap de 3-6 meses | Task Generation |

### Fluxo integrado

```
┌─────────────────┐
│  AGENT LOOP     │
│  (Auditoria)    │
│                 │
│  Score: 95/100  │
└────────┬────────┘
         │
         ▼
    Usuário: "O que fazer agora?"
         │
         ▼
┌─────────────────┐
│ TASK GENERATION │
│ (Próximos passos)│
│                 │
│ 30 tasks geradas│
└────────┬────────┘
         │
         ▼
    Sprint 1 executado
         │
         ▼
┌─────────────────┐
│  AGENT LOOP     │
│  (Validação)    │
│                 │
│  Score: 98/100  │
└────────┬────────┘
         │
         ▼
    Usuário: "Gere tasks Sprint 2"
         │
         ▼
┌─────────────────┐
│ TASK GENERATION │
│ (Sprint 2)      │
└─────────────────┘
```

### Task Generation após DELIVER

**Automático:**

Ao final da FASE 6 (DELIVER) do Agent Loop, MANUS DEVE perguntar:

```
MANUS: "Auditoria finalizada! Score: 95/100 → EXCELENTE

Deseja que eu gere a lista de próximos passos (tasks.md)?
Isso levará 5-10 minutos e criará roadmap de 3 sprints."
```

Se usuário responder "sim", executar Task Generation imediatamente.

---

## CHECKLIST FINAL

### Antes de gerar tasks

- [ ] Ler TODOS os arquivos de knowledge/
- [ ] Identificar gaps objetivos (não "achismos")
- [ ] Validar que tasks não estão duplicadas em tasks.md atual
- [ ] Confirmar prioridades com matriz de priorização

### Durante a geração

- [ ] Cada task tem ID único [CATEGORIA-NNN]
- [ ] Cada task tem prioridade P0/P1/P2
- [ ] Cada task tem esforço estimado
- [ ] Cada task tem critérios de aceitação (mín 3)
- [ ] Cada task tem arquivos afetados listados

### Após gerar tasks.md

- [ ] Resumo executivo criado (total, P0/P1/P2, esforço)
- [ ] Tasks agrupadas por sprint
- [ ] Roadmap sugerido criado
- [ ] Métricas de sucesso definidas
- [ ] Changelog atualizado

---

**Versão do protocolo:** 1.0
**MANUS:** v7.0
**Data:** 29/12/2025
**Status:** ✅ COMPLETO E PRONTO PARA USO
