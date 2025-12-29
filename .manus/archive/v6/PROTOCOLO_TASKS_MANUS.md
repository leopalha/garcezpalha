# 📋 PROTOCOLO MANUS v6.0 - GERENCIAMENTO DE TASKS

**Versão**: 1.0
**Data**: 27/12/2025
**Sistema**: MANUS v6.0 (Multi-Agent Network for Unified Systems)

---

## 🎯 VISÃO GERAL

O sistema MANUS v6.0 utiliza **2 arquivos de tasks** para garantir organização e histórico completo:

1. **`docs/tasks.md`** - Planejamento ATUAL + Próximas Sprints (ATIVO)
2. **`docs/tasks-historico.md`** - Histórico completo de tudo já executado (ARQUIVO)

---

## 📁 ESTRUTURA DOS ARQUIVOS

### 1. tasks.md (ATIVO)

**Localização**: `d:/garcezpalha/docs/tasks.md`

**Propósito**:
- Planejamento das próximas sprints
- Tarefas em andamento (in_progress)
- Tarefas pendentes (todo)
- Métricas atuais
- Bloqueadores identificados

**NÃO contém**:
- Histórico de sprints passados (vai para tasks-historico.md)
- Tarefas já concluídas de sprints anteriores
- Logs detalhados de implementações antigas

**Estrutura**:
```markdown
# GARCEZ PALHA - TASKS & SPRINTS (MANUS v6.0)

## 📊 VISÃO GERAL
- Status atual
- Progresso MVP
- Bloqueadores

## 🚨 PRIORIDADE P0 - BLOQUEADORES
- Tarefas críticas que impedem progresso
- Estimativa de esforço
- Deliverables esperados

## ⚡ PRIORIDADE P1 - ALTA
- Tarefas importantes para próximas 2 semanas

## 📌 PRIORIDADE P2 - MÉDIA
- Tarefas importantes mas não urgentes

## 🎯 PRÓXIMAS SPRINTS
- Sprint 6: Objetivos + Tarefas
- Sprint 7: Objetivos + Tarefas
- Sprint 8: Objetivos + Tarefas

## 🔄 PROTOCOLO MANUS
- Regras de atualização
- Hierarquia de prioridades
```

**Tamanho máximo recomendado**: 500-1000 linhas
**Quando fica muito grande**: Mover sprints concluídos para tasks-historico.md

---

### 2. tasks-historico.md (ARQUIVO)

**Localização**: `d:/garcezpalha/docs/tasks-historico.md`

**Propósito**:
- Histórico COMPLETO de todos os sprints executados
- Registro de todas as tarefas concluídas
- Aprendizados e lições aprendidas
- Referência para contexto histórico

**Contém**:
- Sprint 1: Foundation ✅ (COMPLETO)
- Sprint 2: Data Layer ✅ (COMPLETO)
- Sprint 3: Dashboard & Admin ✅ (COMPLETO)
- Sprint 4: Partners & Analytics ✅ (COMPLETO)
- Sprint 5: Production Ready 🔄 (EM ANDAMENTO)
- Todas as 2440 linhas de histórico original

**Estrutura**:
```markdown
# GARCEZ PALHA - HISTÓRICO DE TASKS

## RESUMO EXECUTIVO
- Total de sprints concluídos
- Total de tarefas executadas
- Principais conquistas
- Timeline do projeto

## ✅ SPRINT 1 - FOUNDATION (COMPLETO)
[Todo o detalhamento do Sprint 1]

## ✅ SPRINT 2 - DATA LAYER (COMPLETO)
[Todo o detalhamento do Sprint 2]

[... outros sprints ...]

## 📊 MÉTRICAS HISTÓRICAS
- Velocity por sprint
- Taxa de conclusão
- Bugs encontrados vs corrigidos

## 📚 LIÇÕES APRENDIDAS
- O que funcionou bem
- O que pode melhorar
- Boas práticas identificadas
```

**Tamanho**: Ilimitado (pode crescer indefinidamente)
**Quando atualizar**: A cada sprint concluído

---

## 🔄 WORKFLOW DE ATUALIZAÇÃO

### Cenário 1: Início de Nova Sprint

1. **Agent lê** `tasks.md` para entender estado atual
2. **Agent verifica** bloqueadores (P0)
3. **Agent planeja** próximas tarefas da sprint
4. **Agent atualiza** `tasks.md` com tarefas detalhadas
5. **Agent marca** todas tarefas como `[ ]` (pendente)

### Cenário 2: Durante Execução de Sprint

1. **Agent marca tarefa** como in_progress: `[🔄]`
2. **Agent executa** a tarefa
3. **Agent marca tarefa** como concluída: `[x]`
4. **Agent atualiza** progresso no topo do `tasks.md`
5. **Se bloqueador encontrado**: Escalar para P0

### Cenário 3: Conclusão de Sprint

1. **Agent cria seção** no `tasks-historico.md`:
```markdown
## ✅ SPRINT X - [NOME] (COMPLETO - DD/MM/YYYY)

**Duração**: X semanas
**Objetivo**: [Objetivo principal]
**Resultado**: [Resumo de conquistas]

### Tarefas Concluídas
- [x] Tarefa 1
- [x] Tarefa 2
[... lista completa ...]

### Bloqueadores Encontrados
- Bloqueador 1: [Como foi resolvido]

### Métricas
- Tarefas planejadas: X
- Tarefas concluídas: Y
- Taxa de conclusão: Z%

### Lições Aprendidas
- [Lição 1]
- [Lição 2]
```

2. **Agent remove** todas tarefas concluídas de `tasks.md`
3. **Agent atualiza** "Sprints Completados" em `tasks.md`
4. **Agent planeja** próxima sprint em `tasks.md`

### Cenário 4: Consulta de Contexto Histórico

**Agent precisa entender o que já foi feito:**

1. **Agent lê** `tasks-historico.md` para contexto completo
2. **Agent identifica** padrões e lições aprendidas
3. **Agent evita** refazer trabalho já concluído
4. **Agent usa** aprendizados para planejar melhor

---

## 📊 HIERARQUIA DE PRIORIDADES

### P0 - BLOQUEADOR (🚨 URGENTE!)
- **Definição**: Tarefa que IMPEDE progresso de outras tarefas
- **Exemplo**: Database production não configurado (todo backend parado)
- **SLA**: Resolver em 24h
- **Ação**: Escalar imediatamente, notificar no topo de `tasks.md`

### P1 - ALTA (⚡ IMPORTANTE)
- **Definição**: Tarefa crítica para negócio, mas não bloqueia tudo
- **Exemplo**: Integração de pagamentos (receita depende, mas resto funciona)
- **SLA**: Resolver em 2 semanas
- **Ação**: Planejar para sprint atual ou próxima

### P2 - MÉDIA (📌 PLANEJADA)
- **Definição**: Tarefa importante mas não urgente
- **Exemplo**: Otimização de performance (sistema funciona, mas pode melhorar)
- **SLA**: Resolver em 1-2 meses
- **Ação**: Adicionar em backlog, planejar para sprint futura

### P3 - BAIXA (💡 NICE-TO-HAVE)
- **Definição**: Feature desejável mas não essencial
- **Exemplo**: Temas customizáveis (usuários não pediram)
- **SLA**: Sem SLA definido
- **Ação**: Backlog de baixa prioridade

---

## 🎯 REGRAS CRÍTICAS

### 1. NUNCA perder histórico
- **SEMPRE** mover sprints concluídos para `tasks-historico.md`
- **NUNCA** deletar tarefas antigas
- **SEMPRE** manter registro de lições aprendidas

### 2. SEMPRE atualizar em tempo real
- **Durante execução**: Marcar tarefas como `[🔄]` in_progress
- **Ao concluir**: Marcar como `[x]` IMEDIATAMENTE
- **Ao bloquear**: Escalar para P0 e notificar

### 3. SEMPRE manter tasks.md enxuto
- **Máximo**: 500-1000 linhas
- **Se ultrapassar**: Mover sprints antigas para tasks-historico.md
- **Foco**: Apenas sprint atual + próximas 2-3 sprints

### 4. SEMPRE consultar histórico antes de planejar
- **Ler** tasks-historico.md para contexto
- **Evitar** retrabalho
- **Aprender** com erros passados
- **Reaproveitar** soluções que funcionaram

### 5. SEMPRE seguir metodologia MANUS v6.0
- **6 Fases**: ANALYZE → PLAN → EXECUTE → OBSERVE → ITERATE → DELIVER
- **Scoring**: 0-100 para cada sprint
- **Gap Analysis**: P0/P1/P2/P3
- **SSOT**: Fonte única de verdade (DADOS_MESTRES.md, PRD.md, etc.)

---

## 📋 TEMPLATE DE COMMIT

Ao atualizar tasks:

```
feat(tasks): [Sprint X] Atualizar tasks.md com progresso

- Concluído: [Lista de tarefas concluídas]
- In progress: [Tarefas em andamento]
- Bloqueadores: [Novos bloqueadores identificados]
- Próximos passos: [O que vem depois]

Sprint: X
Score: Y/100
```

---

## 🔍 EXEMPLOS PRÁTICOS

### Exemplo 1: Agent começa nova sprint

**Input**: Agent precisa planejar Sprint 6

**Ações**:
1. Ler `tasks.md` → Sprint 5 está 55% concluída
2. Ler `tasks-historico.md` → Sprints 1-4 completos
3. Identificar bloqueadores: 5 P0 (Database, Auth, APIs, etc.)
4. Planejar Sprint 6 focado em resolver P0s
5. Atualizar `tasks.md` com tarefas detalhadas
6. Marcar todas como `[ ]` pendente

### Exemplo 2: Agent encontra bloqueador durante execução

**Situação**: Agent tentando ativar Agents Verticais, descobre OpenAI API key não configurada

**Ações**:
1. Parar execução da tarefa atual
2. Criar nova tarefa P0: "Configurar OpenAI API key"
3. Escalar no topo de `tasks.md`:
```markdown
## 🚨 BLOQUEADOR CRÍTICO IDENTIFICADO

**Data**: 27/12/2025
**Tarefa bloqueada**: Ativar Agents Verticais
**Bloqueador**: OpenAI API key não configurada
**Impacto**: Todo sistema de IA parado
**Prioridade**: P0
**Estimativa**: 15min (apenas configuração)
**Ação necessária**: Obter API key e adicionar em .env
```
4. Notificar usuário imediatamente

### Exemplo 3: Sprint concluído, mover para histórico

**Situação**: Sprint 5 concluído (100%)

**Ações**:
1. Abrir `tasks-historico.md`
2. Adicionar nova seção:
```markdown
## ✅ SPRINT 5 - PRODUCTION READY (COMPLETO - 27/12/2025)

**Duração**: 3 semanas
**Objetivo**: Configurar produção, APIs, deployment
**Resultado**: 100% concluído - Plataforma LIVE!

### Tarefas Concluídas (50/50)
[... lista completa de 50 tarefas ...]

### Métricas
- Tarefas planejadas: 50
- Tarefas concluídas: 50
- Taxa de conclusão: 100%
- Bloqueadores encontrados: 5
- Bloqueadores resolvidos: 5

### Lições Aprendidas
- Sempre configurar APIs ANTES de testar agents
- Database production é pré-requisito para tudo
- MercadoPago é mais rápido que Stripe no Brasil
```

3. Remover Sprint 5 de `tasks.md`
4. Atualizar "Sprints Completados" em `tasks.md`:
```markdown
### Sprints Completados
- ✅ Sprint 1: Foundation (100%)
- ✅ Sprint 2: Data Layer (100%)
- ✅ Sprint 3: Dashboard & Admin (100%)
- ✅ Sprint 4: Partners & Analytics (100%)
- ✅ Sprint 5: Production Ready (100%) ← NOVO!
```

5. Planejar Sprint 6 em `tasks.md`

---

## 📊 MÉTRICAS DE QUALIDADE

### Tasks.md deve ter:
- ✅ Progresso atual claro (% de conclusão)
- ✅ Bloqueadores destacados no topo
- ✅ Estimativas realistas de esforço
- ✅ Deliverables bem definidos
- ✅ Máximo 1000 linhas
- ✅ Atualizado diariamente durante sprint

### Tasks-historico.md deve ter:
- ✅ Histórico completo de TODOS os sprints
- ✅ Lições aprendidas documentadas
- ✅ Métricas de cada sprint
- ✅ Bloqueadores e como foram resolvidos
- ✅ Timeline clara do projeto

---

## 🚀 COMANDOS RÁPIDOS

### Para Agents

**Começar nova sprint**:
```
1. Ler tasks.md (estado atual)
2. Ler tasks-historico.md (contexto)
3. Planejar tarefas da sprint
4. Atualizar tasks.md
```

**Durante execução**:
```
1. Marcar tarefa como [🔄]
2. Executar
3. Marcar como [x]
4. Atualizar progresso
```

**Concluir sprint**:
```
1. Mover para tasks-historico.md
2. Adicionar lições aprendidas
3. Limpar tasks.md
4. Planejar próxima sprint
```

**Encontrar bloqueador**:
```
1. Parar execução
2. Escalar para P0
3. Notificar no topo de tasks.md
4. Aguardar resolução
```

---

## 📚 DOCUMENTOS RELACIONADOS

### Fontes Únicas (SSOT)
- [DADOS_MESTRES.md](../business/DADOS_MESTRES.md) - Dados empresa, produtos, métricas
- [OAB_COMPLIANCE_GUIDE.md](../business/OAB_COMPLIANCE_GUIDE.md) - Compliance jurídico
- [PRD.md](../docs/03_PRD.md) - Product Requirements
- [STACK_TECNOLOGICA.md](../docs/17-STACK-TECNOLOGICA.md) - Arquitetura técnica

### Documentos MANUS
- [MATRIZ_ALINHAMENTO_DOCS_CODIGO.md](MATRIZ_ALINHAMENTO_DOCS_CODIGO.md) - Alinhamento perfeito
- [RELATORIO_FINAL_SCORE_100.md](RELATORIO_FINAL_SCORE_100.md) - Score 100/100 alcançado

---

**Este protocolo é OBRIGATÓRIO para todos os agents MANUS v6.0.**

*Última atualização: 27/12/2025*
*Versão: 1.0*
*Status: ATIVO*
