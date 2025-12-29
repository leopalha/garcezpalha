# TEMPLATE: TASKS.MD

## INSTRUÇÕES DE USO

Este é o template padrão para o arquivo `tasks.md` do projeto.

**Formato:** Markdown com checkboxes
**Categorias:** 4 tipos de tasks (PAGES, FLOWS, ADS, DOCS)
**Priorização:** P0 (crítico) → P1 (alto) → P2 (médio)

---

## ESTRUTURA PADRÃO

```markdown
# 📋 TASKS - GARCEZ PALHA

**Última atualização:** [DATA]
**Score atual:** [SCORE]/100
**Responsável:** MANUS v7.0

---

## 🔥 [MANUS-P0] Críticas (Bloqueadoras)

### Páginas com alta demanda SEM landing page

- [ ] **[PRODUTO]** | [DEMANDA]/mês | [TICKET] | [CATEGORIA]
  - **Prioridade:** P0 (alta demanda + sem página)
  - **Automação:** [%]
  - **Agent:** [AgentName]
  - **Estimativa:** [TEMPO]

### Compliance crítico

- [ ] **Validar [DOC/PÁGINA] contra compliance-oab.md**
  - **Risco:** P0 (violação OAB = processo ético)
  - **Estimativa:** [TEMPO]

---

## ⚡ [MANUS-P1] Altas (Importantes)

### Qualification Flows pendentes

- [ ] **Criar flow para [PRODUTO]**
  - **Prioridade:** P1 (produto implementado sem flow)
  - **Demanda:** [DEMANDA]/mês
  - **Estimativa:** [TEMPO]

### Campanhas Google Ads

- [ ] **Adicionar campanha [PRODUTO] no 05-GOOGLE-ADS**
  - **Prioridade:** P1 (produto sem campanha)
  - **Keywords:** [KEYWORDS]
  - **Estimativa:** [TEMPO]

---

## 📝 [MANUS-P2] Médias (Melhorias)

### Documentação técnica

- [ ] **Atualizar [DOC] com [INFO]**
  - **Prioridade:** P2 (melhoria de docs)
  - **Estimativa:** [TEMPO]

### Refatoração de código

- [ ] **Refatorar [COMPONENTE/MÓDULO]**
  - **Prioridade:** P2 (melhoria de código)
  - **Benefício:** [BENEFÍCIO]
  - **Estimativa:** [TEMPO]

---

## ✅ Concluídas Recentemente

- [x] **[TASK CONCLUÍDA 1]** ✅ [DATA]
- [x] **[TASK CONCLUÍDA 2]** ✅ [DATA]
- [x] **[TASK CONCLUÍDA 3]** ✅ [DATA]

---

## 📊 Estatísticas

| Métrica | Valor |
|---------|-------|
| **Tasks P0** | [N] |
| **Tasks P1** | [N] |
| **Tasks P2** | [N] |
| **Total Pendentes** | [N] |
| **Concluídas (7 dias)** | [N] |
| **Taxa de Conclusão** | [%] |

---

## 🎯 Próximos Passos (Auto-gerados por MANUS)

MANUS analisa o projeto e sugere:

1. **Produtos com alta demanda sem página:** [N] produtos
2. **Produtos sem qualification flow:** [N] produtos
3. **Produtos sem campanha ads:** [N] produtos
4. **Documentação desatualizada:** [N] docs

**Comando para gerar tasks:**
```
gere tasks
```

MANUS irá:
- Ler knowledge/produtos-catalogo.md
- Identificar gaps (produtos sem página/flow/campanha)
- Priorizar por demanda e ticket
- Gerar tasks.md atualizado

---

**Gerado por:** MANUS v7.0
**Protocolo:** .manus/protocols/task-generation.md
**Data:** [DATA]
```

---

## EXEMPLO DE TASK POR CATEGORIA

### [MANUS-PAGES] - Criar Landing Page

```markdown
- [ ] **Criar landing page "Lei Maria da Penha"** | 8k/mês | R$ 2.500 | Criminal
  - **Prioridade:** P0 (alta demanda + produto sem página)
  - **Demanda:** 8.000 buscas/mês
  - **Ticket:** R$ 2.500 (médio)
  - **Automação:** 75%
  - **Agent:** CriminalLawAgent
  - **Template:** .manus/templates/landing-page-template.md
  - **Compliance:** Validar contra compliance-oab.md
  - **Estimativa:** 2-3h
  - **Deliverables:**
    - [ ] Criar page.tsx em src/app/(marketing)/solucoes/criminal/lei-maria-penha/
    - [ ] Configurar metadata SEO (8 keywords)
    - [ ] Implementar VSL config (6 agitation points + 6 solution steps)
    - [ ] Adicionar stats grid customizado
    - [ ] Validar compliance OAB
    - [ ] Testar build local
    - [ ] Deploy para produção
```

### [MANUS-FLOWS] - Criar Qualification Flow

```markdown
- [ ] **Criar qualification flow para "Auxílio-Acidente"**
  - **Prioridade:** P1 (produto implementado sem flow)
  - **Produto:** auxilio-acidente
  - **Demanda:** 5.000 buscas/mês
  - **Agent:** SocialSecurityAgent
  - **Template:** .manus/templates/qualification-flow-template.md
  - **Estimativa:** 1-2h
  - **Perguntas principais:**
    1. Qual tipo de acidente? (trabalho, trânsito, outro)
    2. Houve afastamento do trabalho?
    3. Há laudo médico/CAT?
    4. INSS já negou algum benefício?
  - **Deliverables:**
    - [ ] Criar arquivo questions/previdenciario-questions.ts
    - [ ] Definir 6-8 perguntas específicas
    - [ ] Configurar scoring rules (5+ regras)
    - [ ] Definir triggers (qualified/medium/rejected)
    - [ ] Adicionar em agent-product-mapping.ts
    - [ ] Testar fluxo manualmente
```

### [MANUS-ADS] - Criar Campanha Google Ads

```markdown
- [ ] **Adicionar campanha "Revisão de Aposentadoria" no 05-GOOGLE-ADS**
  - **Prioridade:** P1 (produto sem campanha ativa)
  - **Produto:** revisao-aposentadoria
  - **Demanda:** 12.000 buscas/mês
  - **Estimativa:** 30-45min
  - **Keywords:**
    - revisão de aposentadoria
    - aumentar aposentadoria
    - cálculo errado INSS
    - advogado previdenciário
  - **Budget sugerido:** R$ 1.500/mês
  - **CPC estimado:** R$ 2-5
  - **Deliverables:**
    - [ ] Adicionar seção em docs/05-GOOGLE-ADS-CAMPANHAS.md
    - [ ] Criar 2 variações de anúncio (problema + solução)
    - [ ] Definir palavras-chave negativas
    - [ ] Configurar URL de destino
    - [ ] Validar compliance OAB nos anúncios
```

### [MANUS-DOCS] - Atualizar Documentação

```markdown
- [ ] **Atualizar produtos-catalogo.md com 10 produtos extras**
  - **Prioridade:** P2 (gap identificado em knowledge/INDEX.md)
  - **Estimativa:** 2-3h
  - **Produtos faltantes:**
    1. cartao-consignado-rmc
    2. busca-apreensao-veiculo
    3. vazamento-dados-lgpd
    4. perfil-hackeado
    5. problemas-marketplace
    6. defesa-flagrante
    7. inquerito-policial
    8. crimes-transito
    9. lei-maria-penha
    10. revisao-criminal
  - **Deliverables:**
    - [ ] Adicionar fichas completas de cada produto
    - [ ] Definir demanda/mês
    - [ ] Definir ticket (min/avg/max)
    - [ ] Definir % automação
    - [ ] Mapear para agent correto
    - [ ] Atualizar estatísticas do arquivo
```

---

## CHECKLIST DE TASK BEM ESCRITA

Uma boa task deve ter:

- [ ] **Título claro** (verbo + objeto)
- [ ] **Prioridade** (P0/P1/P2)
- [ ] **Categoria** ([MANUS-PAGES/FLOWS/ADS/DOCS])
- [ ] **Contexto** (por que é importante)
- [ ] **Deliverables** (o que será criado/modificado)
- [ ] **Estimativa** (tempo esperado)
- [ ] **Dependências** (se houver)
- [ ] **Validações** (como saber que está pronto)

---

## ESTRUTURA DE PRIORIZAÇÃO

### P0 - CRÍTICO (Fazer AGORA)
- Bloqueadores de deploy
- Violações de compliance OAB
- Produtos de alta demanda SEM página
- Bugs críticos em produção

### P1 - ALTO (2-4 semanas)
- Produtos médios sem página
- Qualification flows pendentes
- Campanhas Ads prioritárias
- Features importantes

### P2 - MÉDIO (1-2 meses)
- Melhorias de documentação
- Refatorações de código
- Produtos de baixa demanda
- Otimizações de performance

### P3 - BAIXO (Backlog)
- Nice to have
- Experimentos
- Pesquisas
- Ideias futuras

---

## WORKFLOW DE TASKS

### 1. CRIAÇÃO
- MANUS analisa projeto (catálogo, páginas, flows, ads)
- Identifica gaps
- Prioriza por demanda × ticket × automação
- Cria tasks estruturadas

### 2. EXECUÇÃO
- Developer pega task P0 mais urgente
- Segue template correspondente
- Valida compliance se aplicável
- Testa localmente

### 3. VALIDAÇÃO
- Marca deliverables concluídos
- Testa em produção (se deploy)
- Valida métricas (se ads/seo)
- Move para "Concluídas"

### 4. MANUTENÇÃO
- Toda semana: mover concluídas para tasks-historico.md
- Todo mês: atualizar estatísticas
- A cada sprint: re-priorizar pendentes

---

## MÉTRICAS DE SUCESSO

### Cobertura de Produtos
```
Total de produtos: 57
Com página: 22
Com flow: 12
Com campanha ads: 13

Cobertura páginas: 38.6% (meta: 80%)
Cobertura flows: 21.1% (meta: 60%)
Cobertura ads: 22.8% (meta: 50%)
```

### Velocity
```
Tasks concluídas/semana: [N]
Tempo médio por task: [T]h
Taxa de conclusão: [%]
```

### ROI Estimado
```
Produtos implementados: [N]
Demanda total capturada: [N]k/mês
Ticket médio: R$ [N]
Potencial receita/ano: R$ [N]M
```

---

## AUTOMAÇÃO COM MANUS

MANUS pode gerar tasks automaticamente:

```bash
# Comando (futuro):
manus generate-tasks

# O que faz:
1. Lê .manus/knowledge/produtos-catalogo.md (57 produtos)
2. Verifica src/app/(marketing)/solucoes/**/page.tsx (22 páginas)
3. Verifica src/lib/ai/qualification/questions/*.ts (12 flows)
4. Verifica docs/05-GOOGLE-ADS-CAMPANHAS.md (13 campanhas)
5. Identifica gaps (35 produtos sem página, 45 sem flow, 44 sem ads)
6. Prioriza por: demanda × ticket × automação
7. Gera tasks.md com P0/P1/P2
```

---

**Criado por:** MANUS v7.0
**Data:** 29/12/2025
**Versão:** 1.0
**Linhas:** ~160
