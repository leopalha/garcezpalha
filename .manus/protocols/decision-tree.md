# PROTOCOLO: Decision Tree MANUS v7.0

**Versão**: 1.0
**Data**: 29/12/2025
**Sistema**: MANUS v7.0 (Multi-Agent Network for Unified Systems)
**Projeto**: Garcez Palha - Advocacia Digital

---

## ÍNDICE

1. [Visão Geral](#visão-geral)
2. [Árvore de Decisões Principal](#árvore-de-decisões-principal)
3. [Comandos e Ações](#comandos-e-ações)
4. [Quando Usar Task Tool](#quando-usar-task-tool)
5. [Fluxogramas de Decisão](#fluxogramas-de-decisão)
6. [Exemplos Práticos](#exemplos-práticos)

---

## VISÃO GERAL

### O que é a Decision Tree?

A **Decision Tree** é o mapeamento completo de comandos → ações automáticas do MANUS v7.0.

Define:
- Que arquivos ler para cada comando
- Que tools usar em cada situação
- Quando executar diretamente vs usar Task tool
- Sequência de ações para cada cenário

### Por que usar?

**Benefícios:**
- 🚀 **Velocidade:** MANUS não precisa "pensar", já sabe o que fazer
- 🎯 **Consistência:** Mesmo comando sempre gera mesma ação
- 📊 **Previsibilidade:** Usuário sabe o que esperar
- ⚡ **Automação:** Reduz decisões manuais

### Princípio fundamental

```
Se comando X
  Então ação Y
  Com tools Z
  Resultando em output W
```

---

## ÁRVORE DE DECISÕES PRINCIPAL

### Diagrama ASCII

```
┌─────────────────────────────────────────────────────────────────────────┐
│                   DECISION TREE - MANUS v7.0                             │
└─────────────────────────────────────────────────────────────────────────┘

ENTRADA: Comando do usuário
    │
    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ CLASSIFICAÇÃO DO COMANDO                                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1. AUDITORIA → Agent Loop (protocolo agent-loop.md)                    │
│  2. IMPLEMENTAÇÃO → Execução direta ou Task                             │
│  3. GERAÇÃO DE TASKS → Task Generation (protocolo task-generation.md)  │
│  4. VALIDAÇÃO → Validação específica                                    │
│  5. CRIAÇÃO → Criação específica                                        │
│  6. INFORMAÇÃO → Leitura e resposta                                     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
    │
    ├───────────────┬──────────────┬──────────────┬──────────────┬─────────
    │               │              │              │              │
    ▼               ▼              ▼              ▼              ▼
┌────────┐    ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│AUDITORIA│    │IMPLEMENTA│  │GERAÇÃO   │  │VALIDAÇÃO │  │INFORMAÇÃO│
│        │    │ÇÃO       │  │TASKS     │  │          │  │          │
└────────┘    └──────────┘  └──────────┘  └──────────┘  └──────────┘
    │               │              │              │              │
    └───────────────┴──────────────┴──────────────┴──────────────┘
                             │
                             ▼
                        SAÍDA: Ação executada
```

---

## COMANDOS E AÇÕES

### 1. AUDITORIA

**Comandos que ativam:**
```
- "audite a documentação"
- "verifique alinhamento código-docs"
- "qual o score da documentação?"
- "identifique gaps"
- "análise completa do projeto"
```

**Ação automática:**
```
PROTOCOLO: agent-loop.md
FASES: ANALYZE → PLAN → EXECUTE → OBSERVE → ITERATE → DELIVER
```

**Arquivos a ler (OBRIGATÓRIO):**
```
1. .manus/knowledge/INDEX.md
2. .manus/knowledge/produtos-catalogo.md
3. .manus/knowledge/pages-implementadas.md
4. .manus/knowledge/agentes-juridicos.md
5. .manus/knowledge/compliance-oab.md
6. .manus/knowledge/tech-stack.md
7. docs/tasks.md (se existir)
8. src/lib/products/catalog.ts
9. src/app/(marketing)/solucoes/ (via Glob)
```

**Tools a usar:**
```
1. Read (10-20x) - Ler documentos
2. Glob (3-5x) - Listar arquivos
3. Grep (5-10x) - Buscar padrões
4. Bash (2-5x) - Git status, ls, wc
5. Write (2-4x) - Criar relatórios
6. TodoWrite (1x) - Criar lista de tarefas
```

**Output esperado:**
```
1. .manus/AUDITORIA_COMPLETA_MANUS.md
2. .manus/GAPS_E_INCONSISTENCIAS.md
3. Score: X/100 (classificação)
4. Próximos passos priorizados
```

**Tempo estimado:** 30-60 minutos (ANALYZE) + 5-14h (loop completo)

**Decisão: Usar Task tool?**
```
NÃO - Executar diretamente (MANUS faz auditoria)
```

---

### 2. IMPLEMENTAÇÃO

#### 2.1. Implementar feature específica

**Comandos que ativam:**
```
- "implemente a feature X"
- "crie a página Y"
- "adicione funcionalidade Z"
- "corrija bug W"
```

**Decisão: Usar Task tool?**
```
SE esforço estimado > 4 horas E tarefa tem escopo claro
  ENTÃO usar Task tool (sub-agent implementa)
SENÃO
  Executar diretamente (MANUS implementa)
```

**Arquivos a ler (depende da feature):**
```
SE feature = "criar página produto X"
  1. .manus/knowledge/produtos-catalogo.md (verificar produto existe)
  2. src/lib/products/catalog.ts (pegar dados do produto)
  3. src/lib/products/vsl-config.ts (ver se precisa config)
  4. src/app/(marketing)/solucoes/[category]/[slug]/page.tsx (template)

SE feature = "criar agent Y"
  1. src/lib/ai/agents/ (listar agents existentes)
  2. src/lib/ai/agents/base-agent.ts (estrutura base)
  3. .manus/knowledge/agentes-juridicos.md (documentação)

SE feature = "criar campanha Ads Z"
  1. .manus/knowledge/produtos-catalogo.md (dados produto)
  2. docs/25-GOOGLE-ADS-CAMPANHAS.md (campanhas existentes)
  3. .manus/knowledge/compliance-oab.md (validar copy)
```

**Tools a usar:**
```
1. Read (5-15x) - Ler arquivos relevantes
2. Glob/Grep (2-5x) - Buscar padrões
3. Edit OU Write (3-10x) - Implementar
4. Task (0-1x) - Lançar sub-agent se esforço > 4h
5. TodoWrite (1x) - Atualizar progresso
```

**Output esperado:**
```
1. Arquivos criados/editados conforme solicitado
2. Validação de funcionamento
3. Atualização de documentação (se aplicável)
4. Commit git (se usuário solicitar)
```

**Tempo estimado:** 30min - 8h (varia muito)

---

#### 2.2. Implementar múltiplas features

**Comandos que ativam:**
```
- "implemente as features X, Y e Z"
- "crie páginas para todos os produtos da categoria W"
- "adicione VSLs customizadas para top 10 produtos"
```

**Decisão: Usar Task tool?**
```
SE número de features >= 3 E features são independentes
  ENTÃO usar Task tool (1 sub-agent por feature em paralelo)
SENÃO SE features são interdependentes
  Executar sequencialmente (MANUS faz uma por vez)
```

**Exemplo:**
```
Comando: "Crie páginas para 5 produtos criminais"

Decisão:
- Features: 5 (>= 3)
- Independentes: SIM (cada página é independente)
- Esforço total: 10h (2h por página)
→ Usar Task tool (5 sub-agents em paralelo)
```

---

### 3. GERAÇÃO DE TASKS

**Comandos que ativam:**
```
- "gere tasks"
- "crie tasks.md"
- "liste próximos passos"
- "o que fazer agora?"
- "roadmap de próximas features"
- "após auditoria, o que implementar?"
```

**Ação automática:**
```
PROTOCOLO: task-generation.md
FASES: LEITURA → ANÁLISE → GERAÇÃO → PRIORIZAÇÃO → OUTPUT
```

**Arquivos a ler (OBRIGATÓRIO):**
```
1. .manus/knowledge/INDEX.md
2. .manus/knowledge/produtos-catalogo.md
3. .manus/knowledge/pages-implementadas.md
4. .manus/knowledge/agentes-juridicos.md
5. .manus/knowledge/compliance-oab.md
6. docs/tasks.md (se existir)
7. src/lib/products/catalog.ts
8. .manus/GAPS_E_INCONSISTENCIAS.md (se auditoria foi feita)
```

**Tools a usar:**
```
1. Read (6-10x) - Ler knowledge base
2. Grep (2-5x) - Identificar gaps
3. Write (1x) - Criar/atualizar docs/tasks.md
4. TodoWrite (1x) - Opcional (se usuário pedir tracking)
```

**Output esperado:**
```
1. docs/tasks.md atualizado
2. Resumo executivo (total tasks, P0/P1/P2, esforço)
3. Roadmap de 3 sprints
4. Métricas de sucesso
```

**Tempo estimado:** 5-15 minutos

**Decisão: Usar Task tool?**
```
NÃO - Executar diretamente (task generation é rápida)
```

---

### 4. VALIDAÇÃO

#### 4.1. Validar alinhamento código-docs

**Comandos que ativam:**
```
- "valide alinhamento código-documentação"
- "verifique se docs refletem código"
- "cross-check implementação vs documentação"
```

**Arquivos a ler (OBRIGATÓRIO):**
```
1. .manus/knowledge/produtos-catalogo.md (57 produtos documentados)
2. src/lib/products/catalog.ts (produtos implementados)
3. .manus/knowledge/pages-implementadas.md (páginas documentadas)
4. src/app/(marketing)/solucoes/ (páginas implementadas - via Glob)
5. .manus/knowledge/agentes-juridicos.md (23 agentes documentados)
6. src/lib/ai/agents/ (agentes implementados - via Glob)
```

**Tools a usar:**
```
1. Read (6-10x)
2. Glob (3-5x) - Listar arquivos .tsx, .ts
3. Grep (5-10x) - Buscar padrões
4. Write (1x) - Criar relatório de validação
```

**Output esperado:**
```
1. .manus/VALIDACAO_ALINHAMENTO.md
2. Lista de inconsistências encontradas (se houver)
3. Score de alinhamento: X% (meta: 100%)
```

**Tempo estimado:** 10-20 minutos

**Decisão: Usar Task tool?**
```
NÃO - Executar diretamente (validação é análise, não implementação)
```

---

#### 4.2. Validar compliance OAB

**Comandos que ativam:**
```
- "valide compliance OAB"
- "verifique se há frases proibidas"
- "audite conteúdo contra regras da OAB"
```

**Arquivos a ler (OBRIGATÓRIO):**
```
1. .manus/knowledge/compliance-oab.md (40 frases proibidas)
2. src/app/(marketing)/solucoes/ (todas as páginas - via Glob)
3. src/lib/products/vsl-config.ts (VSLs customizadas)
4. docs/24-LANDING-PAGE-PRINCIPAL.md (se existir)
5. docs/25-GOOGLE-ADS-CAMPANHAS.md (se existir)
```

**Tools a usar:**
```
1. Read (1x) - Ler compliance-oab.md
2. Glob (1x) - Listar todas as páginas .tsx
3. Grep (40x) - Buscar cada frase proibida em todos os arquivos
4. Write (1x) - Criar relatório de compliance
```

**Output esperado:**
```
1. .manus/VALIDACAO_COMPLIANCE_OAB.md
2. Lista de violações encontradas (se houver)
3. Status: ✅ COMPLIANT ou ❌ VIOLAÇÕES ENCONTRADAS
```

**Tempo estimado:** 10-15 minutos

**Decisão: Usar Task tool?**
```
NÃO - Executar diretamente (validação automática via Grep)
```

---

### 5. CRIAÇÃO

#### 5.1. Criar página de produto

**Comandos que ativam:**
```
- "crie página para produto X"
- "gere VSL para produto Y"
- "adicione produto Z ao site"
```

**Arquivos a ler (OBRIGATÓRIO):**
```
1. .manus/knowledge/produtos-catalogo.md (verificar produto existe)
2. src/lib/products/catalog.ts (dados do produto)
3. src/lib/products/vsl-config.ts (ver padrão de VSL)
4. .manus/knowledge/compliance-oab.md (validar copy)
5. src/app/(marketing)/solucoes/[category]/[slug]/page.tsx (template)
```

**Tools a usar:**
```
1. Read (5x) - Ler arquivos relevantes
2. Edit (1-2x) - Adicionar config em vsl-config.ts
3. Grep (1x) - Verificar se produto já tem página
4. Write (0-1x) - Criar arquivo se necessário (roteamento dinâmico já existe)
```

**Output esperado:**
```
1. Produto adicionado/validado em catalog.ts
2. VSL config criada em vsl-config.ts
3. Página acessível em /solucoes/[category]/[slug]
4. Compliance OAB validado
```

**Tempo estimado:** 1-2 horas

**Decisão: Usar Task tool?**
```
SE criar 1 página
  NÃO - Executar diretamente
SE criar 3+ páginas
  SIM - Usar Task tool (1 agent por página)
```

---

#### 5.2. Criar campanha Google Ads

**Comandos que ativam:**
```
- "crie campanha Google Ads para produto X"
- "gere anúncios para produto Y"
- "configure Ads para categoria Z"
```

**Arquivos a ler (OBRIGATÓRIO):**
```
1. .manus/knowledge/produtos-catalogo.md (dados do produto)
2. .manus/knowledge/compliance-oab.md (validar copy dos anúncios)
3. docs/25-GOOGLE-ADS-CAMPANHAS.md (campanhas existentes - padrão)
4. src/lib/products/catalog.ts (keywords, pricing)
```

**Tools a usar:**
```
1. Read (4x) - Ler arquivos relevantes
2. Edit OU Write (1x) - Adicionar campanha em 25-GOOGLE-ADS-CAMPANHAS.md
3. Grep (5-10x) - Validar compliance OAB em copy dos anúncios
```

**Output esperado:**
```
1. Campanha documentada em 25-GOOGLE-ADS-CAMPANHAS.md
2. 3 grupos de anúncios (branded, genérico, concorrência)
3. 10-15 keywords negativas
4. Copy validado contra compliance OAB
5. Budget sugerido baseado em demanda
```

**Tempo estimado:** 2-3 horas

**Decisão: Usar Task tool?**
```
SE criar 1-2 campanhas
  NÃO - Executar diretamente
SE criar 5+ campanhas
  SIM - Usar Task tool (CMOAgent + AdsAgent)
```

---

#### 5.3. Criar documentação técnica

**Comandos que ativam:**
```
- "crie PRD.md"
- "documente componente X"
- "gere COMPONENT_LIBRARY.md"
- "adicione diagrama de arquitetura"
```

**Arquivos a ler (OBRIGATÓRIO):**
```
SE criar PRD.md:
  1. src/app/(marketing)/ (listar páginas via Glob)
  2. src/lib/products/catalog.ts (listar produtos)
  3. .manus/knowledge/produtos-catalogo.md (contexto negócio)

SE criar COMPONENT_LIBRARY.md:
  1. src/components/ (listar componentes via Glob)
  2. src/components/**/*.tsx (extrair Props via Grep)

SE criar diagrama arquitetura:
  1. src/ (estrutura completa via Bash ls)
  2. .manus/knowledge/tech-stack.md (dependências)
  3. package.json (stack tecnológica)
```

**Tools a usar:**
```
1. Read (5-15x) - Ler arquivos de referência
2. Glob (2-5x) - Listar componentes/páginas
3. Grep (5-20x) - Extrair Props TypeScript
4. Bash (2-5x) - Comandos ls, tree
5. Write (1x) - Criar documento
```

**Output esperado:**
```
1. Documento criado (PRD.md, COMPONENT_LIBRARY.md, etc)
2. Estrutura padronizada (seções, changelog, referências)
3. Informação 100% alinhada com código
```

**Tempo estimado:** 1-8 horas (varia muito)

**Decisão: Usar Task tool?**
```
SE documento simples (1-2h esforço)
  NÃO - Executar diretamente
SE documento complexo (4-8h esforço)
  SIM - Usar Task tool (agent especializado)
```

---

### 6. INFORMAÇÃO

#### 6.1. Responder pergunta sobre projeto

**Comandos que ativam:**
```
- "quantos produtos temos?"
- "qual o score atual?"
- "quais agentes estão implementados?"
- "lista de páginas criadas"
```

**Arquivos a ler:**
```
SE pergunta sobre produtos:
  1. .manus/knowledge/produtos-catalogo.md
  2. .manus/knowledge/INDEX.md

SE pergunta sobre agentes:
  1. .manus/knowledge/agentes-juridicos.md
  2. .manus/knowledge/INDEX.md

SE pergunta sobre páginas:
  1. .manus/knowledge/pages-implementadas.md
  2. .manus/knowledge/INDEX.md

SE pergunta sobre score:
  1. .manus/knowledge/INDEX.md
  2. .manus/AUDITORIA_COMPLETA_MANUS.md (se existir)
```

**Tools a usar:**
```
1. Read (1-3x) - Ler arquivos relevantes
```

**Output esperado:**
```
Resposta direta com informação extraída dos arquivos
```

**Tempo estimado:** 1-3 minutos

**Decisão: Usar Task tool?**
```
NUNCA - Apenas leitura e resposta
```

---

## QUANDO USAR TASK TOOL

### Critérios objetivos

```
┌─────────────────────────────────────────────────────────────────────────┐
│                   USAR TASK TOOL SE:                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ✅ Esforço estimado > 4 horas                                          │
│  ✅ Tarefa tem escopo claro e bem definido                              │
│  ✅ Múltiplas tarefas independentes (executar em paralelo)              │
│  ✅ Usuário solicitou explicitamente uso de agents                      │
│  ✅ Tarefa requer especialização (ex: CMOAgent, CFOAgent)               │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                 NÃO USAR TASK TOOL SE:                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ❌ Esforço estimado < 2 horas                                          │
│  ❌ Tarefa é apenas leitura/análise (não criação)                       │
│  ❌ Tarefas são interdependentes (precisam executar sequencialmente)    │
│  ❌ Tarefa é auditoria/validação (MANUS faz diretamente)                │
│  ❌ Tarefa é geração de tasks (protocolo task-generation.md)            │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Exemplos: Usar vs Não usar

**✅ USAR Task Tool:**

```markdown
Comando: "Crie páginas para 10 produtos da categoria bancário"

Análise:
- Esforço: 20h (2h por página)
- Escopo: Claro (cada página é independente)
- Paralelização: Possível (10 agents em paralelo)
→ USAR Task tool (10 sub-agents)
```

```markdown
Comando: "Crie PRD.md completo com 100+ User Stories"

Análise:
- Esforço: 8h (análise + escrita)
- Escopo: Claro (estrutura de PRD conhecida)
- Especialização: Sim (agent PRD)
→ USAR Task tool (1 sub-agent especializado)
```

```markdown
Comando: "Crie campanhas Google Ads para top 20 produtos"

Análise:
- Esforço: 40h (2h por campanha)
- Escopo: Claro (cada campanha é independente)
- Paralelização: Possível (5 agents, 4 campanhas cada)
- Especialização: Sim (CMOAgent + AdsAgent)
→ USAR Task tool (5 sub-agents)
```

---

**❌ NÃO USAR Task Tool:**

```markdown
Comando: "Audite a documentação"

Análise:
- Esforço: 30-60 min (ANALYZE) + loop completo
- Tipo: Auditoria/análise (não criação)
- Protocolo: agent-loop.md (MANUS faz diretamente)
→ NÃO usar Task tool (MANUS executa Agent Loop)
```

```markdown
Comando: "Gere tasks para próximo sprint"

Análise:
- Esforço: 5-15 min
- Tipo: Geração de tasks (não implementação)
- Protocolo: task-generation.md (rápido)
→ NÃO usar Task tool (MANUS gera tasks diretamente)
```

```markdown
Comando: "Valide alinhamento código-docs"

Análise:
- Esforço: 10-20 min
- Tipo: Validação (leitura + grep)
- Não é criação: Apenas análise
→ NÃO usar Task tool (MANUS faz validação diretamente)
```

```markdown
Comando: "Crie 1 página para produto seguro-prestamista"

Análise:
- Esforço: 2h (< 4h)
- Tarefa única: Sem paralelização
→ NÃO usar Task tool (MANUS cria diretamente)
```

---

### Decisão em zona cinza (2-4h esforço)

**Perguntar ao usuário:**

```
MANUS: "Esta tarefa tem esforço estimado de 3 horas.

Prefere que:
A) Eu execute diretamente (mais rápido, você acompanha)
B) Eu lance um sub-agent (você pode trabalhar em paralelo)

O que prefere?"
```

---

## FLUXOGRAMAS DE DECISÃO

### Fluxograma 1: Classificar comando

```
┌─────────────────────────────────────────────────────────────────────────┐
│               CLASSIFICAÇÃO DE COMANDO                                   │
└─────────────────────────────────────────────────────────────────────────┘

ENTRADA: Comando do usuário
    │
    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ Contém palavras: "audite", "verifique alinhamento", "score"?            │
└─────────────────────────────────────────────────────────────────────────┘
    │
    ├─ SIM ──→ AUDITORIA (agent-loop.md)
    │
    NÃO
    │
    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ Contém palavras: "gere tasks", "próximos passos", "roadmap"?            │
└─────────────────────────────────────────────────────────────────────────┘
    │
    ├─ SIM ──→ GERAÇÃO TASKS (task-generation.md)
    │
    NÃO
    │
    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ Contém palavras: "valide", "cross-check", "compliance OAB"?             │
└─────────────────────────────────────────────────────────────────────────┘
    │
    ├─ SIM ──→ VALIDAÇÃO (execução direta)
    │
    NÃO
    │
    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ Contém palavras: "implemente", "crie", "adicione"?                      │
└─────────────────────────────────────────────────────────────────────────┘
    │
    ├─ SIM ──→ IMPLEMENTAÇÃO (decisão: Task tool ou direto?)
    │
    NÃO
    │
    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ É pergunta? ("quantos", "qual", "lista")                                │
└─────────────────────────────────────────────────────────────────────────┘
    │
    ├─ SIM ──→ INFORMAÇÃO (leitura e resposta)
    │
    NÃO
    │
    ▼
COMANDO NÃO RECONHECIDO → Perguntar clarificação ao usuário
```

---

### Fluxograma 2: Decidir usar Task tool

```
┌─────────────────────────────────────────────────────────────────────────┐
│               DECISÃO: USAR TASK TOOL?                                   │
└─────────────────────────────────────────────────────────────────────────┘

ENTRADA: Comando de implementação/criação
    │
    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ Esforço estimado > 4 horas?                                              │
└─────────────────────────────────────────────────────────────────────────┘
    │
    ├─ SIM ──→ Múltiplas tarefas independentes?
    │          │
    │          ├─ SIM ──→ USAR Task tool (N agents em paralelo)
    │          │
    │          NÃO
    │          │
    │          ▼
    │         Escopo bem definido?
    │          │
    │          ├─ SIM ──→ USAR Task tool (1 agent especializado)
    │          │
    │          NÃO ──→ Executar diretamente (iterativo)
    │
    NÃO
    │
    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ Esforço entre 2-4 horas?                                                 │
└─────────────────────────────────────────────────────────────────────────┘
    │
    ├─ SIM ──→ PERGUNTAR ao usuário (A ou B)
    │
    NÃO (< 2h)
    │
    ▼
NÃO USAR Task tool (executar diretamente)
```

---

### Fluxograma 3: Auditoria (Agent Loop)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    AUDITORIA - AGENT LOOP                                │
└─────────────────────────────────────────────────────────────────────────┘

ENTRADA: Comando "audite"
    │
    ▼
FASE 1: ANALYZE (30-60 min)
    │
    ├─ Read .manus/knowledge/*.md (6 arquivos)
    ├─ Glob src/**/*.tsx (listar páginas)
    ├─ Grep padrões (produtos, agents, etc)
    ├─ Calcular scores (0-100)
    │
    ▼
FASE 2: PLAN (15-30 min)
    │
    ├─ Priorizar P0/P1/P2
    ├─ Estimar esforço
    ├─ Decidir: 1 agent ou N agents?
    │
    ▼
FASE 3: EXECUTE (2-8h)
    │
    ├─ SE múltiplos agents
    │   │
    │   ├─ Task (agent 1, run_in_background: true)
    │   ├─ Task (agent 2, run_in_background: true)
    │   └─ Task (agent N, run_in_background: true)
    │
    ├─ SE 1 agent
    │   │
    │   └─ Executar correções sequencialmente
    │
    ▼
FASE 4: OBSERVE (15-30 min)
    │
    ├─ TaskOutput (agent 1)
    ├─ TaskOutput (agent 2)
    ├─ Validar outputs
    │
    ▼
FASE 5: ITERATE (1-3h)
    │
    ├─ Score >= 90? ──SIM──→ Pular para DELIVER
    │                  │
    │                  NÃO
    │                  │
    │                  ▼
    │              Relançar agents / Correções manuais
    │              │
    │              └─ Voltar para OBSERVE
    │
    ▼
FASE 6: DELIVER (30-60 min)
    │
    ├─ Write .manus/VALIDACAO_100_PERCENT.md
    ├─ Consolidar scores
    ├─ Gerar changelog
    │
    ▼
SAÍDA: Relatório final + Score X/100
```

---

### Fluxograma 4: Task Generation

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    TASK GENERATION                                       │
└─────────────────────────────────────────────────────────────────────────┘

ENTRADA: Comando "gere tasks"
    │
    ▼
FASE 1: LEITURA (3-5 min)
    │
    ├─ Read .manus/knowledge/INDEX.md
    ├─ Read .manus/knowledge/produtos-catalogo.md
    ├─ Read .manus/knowledge/pages-implementadas.md
    ├─ Read .manus/knowledge/agentes-juridicos.md
    ├─ Read docs/tasks.md (se existir)
    │
    ▼
FASE 2: ANÁLISE DE GAPS (2-4 min)
    │
    ├─ Identificar produtos sem página → [MANUS-PAGES]
    ├─ Identificar VSLs incompletas → [MANUS-FLOWS]
    ├─ Identificar produtos sem campanha → [MANUS-ADS]
    ├─ Identificar docs ausentes → [MANUS-DOCS]
    │
    ▼
FASE 3: GERAÇÃO (1-2 min)
    │
    ├─ Para cada gap:
    │   │
    │   ├─ Gerar ID único [CATEGORIA-NNN]
    │   ├─ Título descritivo
    │   ├─ Estimar esforço
    │   ├─ Critérios de aceitação (mín 3)
    │   └─ Arquivos afetados
    │
    ▼
FASE 4: PRIORIZAÇÃO (1-2 min)
    │
    ├─ Calcular score de impacto (0-100)
    ├─ Classificar P0/P1/P2
    ├─ Ordenar por prioridade
    ├─ Agrupar por sprint
    │
    ▼
FASE 5: OUTPUT (1-2 min)
    │
    ├─ Write docs/tasks.md
    ├─ Resumo executivo
    ├─ Roadmap 3 sprints
    ├─ Métricas de sucesso
    │
    ▼
SAÍDA: tasks.md atualizado
```

---

## EXEMPLOS PRÁTICOS

### Exemplo 1: Comando ambíguo

**Comando do usuário:**
```
"Melhore o projeto"
```

**Decisão de MANUS:**
```
COMANDO AMBÍGUO → Pedir clarificação

MANUS: "Entendi que você quer melhorar o projeto. Para eu saber como ajudar melhor, você pode especificar:

A) Auditar documentação (verificar score, gaps, inconsistências)
B) Gerar tasks para próximos passos (roadmap de features)
C) Implementar feature específica (qual?)
D) Validar alinhamento código-documentação
E) Outro (especifique)

O que você prefere?"
```

---

### Exemplo 2: Auditoria simples

**Comando do usuário:**
```
"Audite a documentação"
```

**Decisão de MANUS:**
```
CLASSIFICAÇÃO: AUDITORIA
PROTOCOLO: agent-loop.md
AÇÃO: Executar Agent Loop (ANALYZE → ... → DELIVER)
```

**Sequência de ações:**
```
1. Read .manus/knowledge/INDEX.md
2. Read .manus/knowledge/produtos-catalogo.md
3. Read .manus/knowledge/pages-implementadas.md
4. Read .manus/knowledge/agentes-juridicos.md
5. Read .manus/knowledge/compliance-oab.md
6. Read .manus/knowledge/tech-stack.md
7. Glob "src/app/(marketing)/**/*.tsx"
8. Grep "export const ALL_PRODUCTS" em src/lib/products/catalog.ts
9. Calcular scores
10. Write .manus/AUDITORIA_COMPLETA_MANUS.md
11. Write .manus/GAPS_E_INCONSISTENCIAS.md
12. Responder com resumo
```

**Output:**
```
MANUS: "Auditoria concluída!

Score atual: 95/100 (EXCELENTE)

Principais achados:
- ✅ 57 produtos implementados e documentados
- ✅ 23 agentes implementados
- ⚠️ 10 produtos sem documentação completa (P1)
- ⚠️ 5 VSLs usando defaultVSLConfig (P2)

Relatórios criados:
- .manus/AUDITORIA_COMPLETA_MANUS.md
- .manus/GAPS_E_INCONSISTENCIAS.md

Deseja que eu gere tasks para resolver os gaps?"
```

---

### Exemplo 3: Criar 1 página (execução direta)

**Comando do usuário:**
```
"Crie página para o produto 'Cartão Consignado RMC'"
```

**Decisão de MANUS:**
```
CLASSIFICAÇÃO: CRIAÇÃO
TIPO: Página de produto
ESFORÇO: 2h (< 4h)
DECISÃO: Executar diretamente (NÃO usar Task tool)
```

**Sequência de ações:**
```
1. Read .manus/knowledge/produtos-catalogo.md
   → Verificar que produto existe
   → Extrair: demanda, ticket, categoria

2. Read src/lib/products/catalog.ts
   → Validar que produto está no catálogo
   → Slug: "cartao-consignado-rmc"

3. Read src/lib/products/vsl-config.ts
   → Ver padrão de VSL config

4. Read .manus/knowledge/compliance-oab.md
   → Extrair frases proibidas

5. Edit src/lib/products/vsl-config.ts
   → Adicionar config para "cartao-consignado-rmc"

6. Grep "cartao-consignado" em src/
   → Verificar que não há duplicação

7. Validar compliance OAB no copy criado

8. Responder com confirmação
```

**Output:**
```
MANUS: "Página criada com sucesso!

✅ Produto: Cartão Consignado RMC
✅ Rota: /solucoes/bancario/cartao-consignado-rmc
✅ VSL customizada criada
✅ Compliance OAB validado

Arquivo modificado:
- src/lib/products/vsl-config.ts

Próximos passos sugeridos:
1. Testar página localmente (npm run dev)
2. Criar campanha Google Ads para este produto
3. Otimizar keywords SEO

Deseja que eu faça algum desses próximos passos?"
```

---

### Exemplo 4: Criar 10 páginas (usar Task tool)

**Comando do usuário:**
```
"Crie páginas para os 10 produtos sem documentação completa"
```

**Decisão de MANUS:**
```
CLASSIFICAÇÃO: CRIAÇÃO
TIPO: Múltiplas páginas (10)
ESFORÇO: 20h (2h por página)
TAREFAS INDEPENDENTES: SIM
DECISÃO: Usar Task tool (10 sub-agents em paralelo)
```

**Sequência de ações:**
```
1. Read .manus/knowledge/INDEX.md
   → Extrair lista de 10 produtos sem doc:
   ["cartao-consignado-rmc", "busca-apreensao-veiculo", ...]

2. Read .manus/knowledge/produtos-catalogo.md
   → Extrair dados de cada produto

3. Para cada produto, lançar sub-agent:

Task({
  description: "Criar página para cartao-consignado-rmc",
  prompt: `
    Você é um agent especializado em criar páginas de produtos.

    PRODUTO: Cartão Consignado RMC
    DADOS: {dados do produto}

    MISSÃO:
    1. Criar VSL config em src/lib/products/vsl-config.ts
    2. Validar compliance OAB
    3. Testar que rota /solucoes/bancario/cartao-consignado-rmc funciona

    CRITÉRIOS:
    - VSL com 9 seções completas
    - Copy validado contra compliance OAB
    - Compliance: Zero frases proibidas
  `,
  run_in_background: true
})

4. Aguardar conclusão de todos os agents (TaskOutput)

5. Validar outputs

6. Responder com resumo
```

**Output:**
```
MANUS: "10 páginas criadas com sucesso!

✅ cartao-consignado-rmc
✅ busca-apreensao-veiculo
✅ vazamento-dados-lgpd
✅ perfil-hackeado
✅ problemas-marketplace
✅ defesa-flagrante
✅ inquerito-policial
✅ crimes-transito
✅ lei-maria-penha
✅ revisao-criminal

Todas as páginas:
- VSL customizada criada
- Compliance OAB validado
- Acessíveis em /solucoes/{category}/{slug}

Arquivo modificado:
- src/lib/products/vsl-config.ts (10 configs adicionadas)

Próximos passos sugeridos:
1. Criar campanhas Google Ads para estes produtos
2. Documentar produtos em CATALOGO_COMPLETO_47_NICHOS.md
3. Testar conversion rate

Deseja que eu faça algum desses próximos passos?"
```

---

### Exemplo 5: Validar compliance OAB

**Comando do usuário:**
```
"Valide se há frases proibidas pela OAB no site"
```

**Decisão de MANUS:**
```
CLASSIFICAÇÃO: VALIDAÇÃO
TIPO: Compliance OAB
ESFORÇO: 10-15 min
DECISÃO: Executar diretamente (validação automática)
```

**Sequência de ações:**
```
1. Read .manus/knowledge/compliance-oab.md
   → Extrair 40 frases proibidas

2. Glob "src/app/(marketing)/**/*.tsx"
   → Listar todas as páginas

3. Para cada frase proibida:
   Grep "{frase}" em src/app/(marketing)/ (output_mode: "files_with_matches")

4. Compilar lista de violações (se houver)

5. Write .manus/VALIDACAO_COMPLIANCE_OAB.md

6. Responder com resultado
```

**Output (sem violações):**
```
MANUS: "✅ Validação de compliance OAB concluída!

Status: COMPLIANT (zero violações)

Arquivos validados:
- 57 páginas em src/app/(marketing)/solucoes/
- 1 homepage
- 5 landing pages

Frases proibidas verificadas: 40
Violações encontradas: 0

Relatório criado:
- .manus/VALIDACAO_COMPLIANCE_OAB.md

Seu site está em conformidade com as regras da OAB! ✅"
```

**Output (com violações):**
```
MANUS: "⚠️ Validação de compliance OAB concluída!

Status: VIOLAÇÕES ENCONTRADAS

❌ 3 violações críticas:

1. src/app/(marketing)/solucoes/bancario/seguro-prestamista/page.tsx
   Frase proibida: "Garantimos que você vai ganhar"
   Linha: 45

2. src/app/(marketing)/solucoes/previdenciario/bpc-loas/page.tsx
   Frase proibida: "Resolvemos em 30 dias"
   Linha: 67

3. docs/24-LANDING-PAGE-PRINCIPAL.md
   Frase proibida: "Melhor advogado do Brasil"
   Linha: 123

AÇÃO OBRIGATÓRIA:
Corrija IMEDIATAMENTE estas violações antes de lançar o site.

Relatório completo:
- .manus/VALIDACAO_COMPLIANCE_OAB.md

Deseja que eu corrija automaticamente?"
```

---

### Exemplo 6: Gerar tasks após auditoria

**Comando do usuário:**
```
"Gere tasks para próximo sprint"
```

**Decisão de MANUS:**
```
CLASSIFICAÇÃO: GERAÇÃO DE TASKS
PROTOCOLO: task-generation.md
ESFORÇO: 5-15 min
DECISÃO: Executar diretamente (NÃO usar Task tool)
```

**Sequência de ações:**
```
1. LEITURA (3-5 min)
   Read .manus/knowledge/INDEX.md
   Read .manus/knowledge/produtos-catalogo.md
   Read .manus/knowledge/pages-implementadas.md
   Read docs/tasks.md

2. ANÁLISE DE GAPS (2-4 min)
   Identificar:
   - 10 produtos sem página
   - 15 VSLs incompletas
   - 20 produtos sem campanha Ads
   - 5 docs ausentes

3. GERAÇÃO (1-2 min)
   Gerar 50 tasks distribuídas em 4 categorias

4. PRIORIZAÇÃO (1-2 min)
   P0: 2 tasks
   P1: 20 tasks
   P2: 28 tasks

5. OUTPUT (1-2 min)
   Write docs/tasks.md
```

**Output:**
```
MANUS: "Tasks geradas com sucesso!

Total: 50 tasks
- P0 (Crítico): 2
- P1 (Alta): 20
- P2 (Média): 28

Distribuição por categoria:
- [MANUS-PAGES]: 10 tasks (20h)
- [MANUS-FLOWS]: 15 tasks (30h)
- [MANUS-ADS]: 20 tasks (40h)
- [MANUS-DOCS]: 5 tasks (10h)

Esforço total: 100h (5 sprints de 20h)

Roadmap sugerido:

Sprint 1 (Semana 1): 2 P0 + 8 P1 (18h)
- Corrigir violações compliance OAB
- Criar páginas para top 5 produtos

Sprint 2 (Semana 2): 12 P1 (22h)
- Completar VSLs prioritárias
- Criar campanhas Ads top 10 produtos

Sprint 3-5: Tasks P2 (60h)

Arquivo criado:
- docs/tasks.md

Ver detalhes completos em docs/tasks.md

Deseja que eu comece executando Sprint 1?"
```

---

## CHECKLIST FINAL

### Antes de executar ação

- [ ] Comando foi classificado corretamente (auditoria/implementação/geração/validação/informação)
- [ ] Arquivos obrigatórios foram identificados (knowledge/, code, docs)
- [ ] Tools a usar foram selecionadas (Read, Glob, Grep, Edit, Write, Task)
- [ ] Decisão de usar/não usar Task tool foi tomada (baseada em critérios objetivos)
- [ ] Output esperado está claro

### Durante a execução

- [ ] Todos os arquivos obrigatórios foram lidos
- [ ] Tools foram usadas na ordem correta
- [ ] Validações foram feitas (compliance OAB, alinhamento, etc)
- [ ] Outputs parciais foram salvos
- [ ] TodoWrite atualizada (se aplicável)

### Após executar ação

- [ ] Output esperado foi gerado
- [ ] Documentação foi atualizada (se aplicável)
- [ ] Changelog foi criado/atualizado
- [ ] Próximos passos foram sugeridos ao usuário
- [ ] Usuário recebeu confirmação clara do que foi feito

---

**Versão do protocolo:** 1.0
**MANUS:** v7.0
**Data:** 29/12/2025
**Status:** ✅ COMPLETO E PRONTO PARA USO
