# CHECKLIST DE CORREÇÕES P0/P1 - ATINGIR SCORE 100/100

**Data:** 29/12/2025
**Arquivo Alvo:** `d:\garcezpalha\src\lib\ai\qualification\agent-product-mapping.ts`
**Esforço:** 15-20 minutos
**Score Atual:** 96/100
**Score Esperado:** 100/100

---

## P0 - CRÍTICO (1 correção)

### [ ] P0-001: Remover pericia-medica do mapping

**Problema:** Produto mapeado mas NÃO existe no catalog
**Risco:** Erro 404 quando sistema tentar buscar produto
**Localização:** Linha 103-107

**Antes:**
```typescript
// Medical Expertise Agent (work-related)
{
  agentRole: 'medical',
  productIds: [
    'pericia-medica',           // Medical expertise (work accidents, medical errors, disability)
  ],
},
```

**Depois:**
```typescript
// Medical Expertise Agent (work-related)
// REMOVED: 'pericia-medica' - produto não existe no catalog.ts
// Este agent não tem produtos mapeados no momento
// TODO: Implementar produto pericia-medica no catalog.ts ou remover agent completamente
```

**Validação:**
- [ ] Grep no mapping não retorna "pericia-medica"
- [ ] Testes de integração passam sem erros 404

---

## P1 - ALTA PRIORIDADE (4 correções)

### [ ] P1-003a: Corrigir slugs do Health Insurance Agent

**Problema:** 3 slugs no mapping não correspondem ao catalog
**Risco:** Sistema pode não encontrar produtos quando usuário busca
**Localização:** Linha 42-48

**Antes:**
```typescript
// Health Insurance Agent
{
  agentRole: 'health-insurance',
  productIds: [
    'plano-saude',              // Health insurance denial
    'bariatrica',               // Bariatric surgery
    'tratamento-tea',           // TEA/Autism treatment
  ],
},
```

**Depois:**
```typescript
// Health Insurance Agent
{
  agentRole: 'health-insurance',
  productIds: [
    'plano-saude-negou',        // Health insurance denial (FIXED: was plano-saude)
    'cirurgia-bariatrica',      // Bariatric surgery (FIXED: was bariatrica)
    'tea',                      // TEA/Autism treatment (FIXED: was tratamento-tea)
  ],
},
```

**Validação:**
- [ ] Slugs correspondem exatamente aos do catalog.ts
- [ ] Sistema encontra produtos quando usuário pergunta sobre plano de saúde, bariátrica ou TEA

---

### [ ] P1-003b: Corrigir slug do Forensics Agent

**Problema:** Slug "grafotecnica" incorreto (termo técnico é "grafotecnia")
**Risco:** Sistema pode não encontrar produto
**Localização:** Linha 93-99

**Antes:**
```typescript
// Document Forensics Agent
{
  agentRole: 'forensics',
  productIds: [
    'pericia-documental',       // Document forensics
    'grafotecnica',             // Signature analysis (graphotechnical expertise)
    'laudo-tecnico',            // Technical report
  ],
},
```

**Depois:**
```typescript
// Document Forensics Agent
{
  agentRole: 'forensics',
  productIds: [
    'pericia-documental',       // Document forensics
    'grafotecnia',              // Signature analysis (FIXED: was grafotecnica)
    'laudo-tecnico',            // Technical report
  ],
},
```

**Validação:**
- [ ] Slug corresponde exatamente ao do catalog.ts
- [ ] Sistema encontra produto quando usuário pergunta sobre grafotecnia

---

## VALIDAÇÃO FINAL

### [ ] Verificar Alinhamento Completo

**Comando de verificação:**
```bash
# Listar todos os slugs mapeados
grep -oP "(?<=')[^']+(?=')" src/lib/ai/qualification/agent-product-mapping.ts | sort | uniq

# Listar todos os slugs do catalog
grep -oP "slug: '\K[^']+" src/lib/products/catalog.ts | sort | uniq

# Fazer diff
diff <(grep -oP "slug: '\K[^']+" src/lib/products/catalog.ts | sort | uniq) \
     <(grep -oP "(?<=')[^']+(?=')" src/lib/ai/qualification/agent-product-mapping.ts | sort | uniq)
```

**Resultado esperado:** NENHUMA discrepância

---

### [ ] Re-calcular Coverage

**Fórmula:**
```
Coverage = (Slugs Corretos / Total Mapeado) × 100
```

**Antes:**
- Total Mapeado: 58
- Slugs Corretos: 53
- Coverage: 91.4%

**Depois (esperado):**
- Total Mapeado: 57 (removeu pericia-medica)
- Slugs Corretos: 57
- Coverage: 100% ✅

---

### [ ] Re-calcular Score

**Métricas Esperadas:**

| Métrica | Antes | Depois | Melhoria |
|---------|-------|--------|----------|
| Completude | 100/100 | 100/100 | - |
| Precisão | 91/100 | 100/100 | +9 |
| Consistência | 91/100 | 100/100 | +9 |
| Utilidade | 100/100 | 100/100 | - |
| **TOTAL** | **96/100** | **100/100** | **+4** |

---

## TESTES DE REGRESSÃO

### [ ] Executar Testes Unitários
```bash
npm test src/lib/ai/qualification/agent-product-mapping.test.ts
```

### [ ] Executar Testes de Integração
```bash
npm test src/lib/ai/qualification/integration.test.ts
```

### [ ] Validar em Ambiente de Dev
- [ ] Iniciar servidor de desenvolvimento
- [ ] Testar qualificação para cada produto corrigido:
  - "Meu plano de saúde negou minha cirurgia"
  - "Preciso fazer cirurgia bariátrica mas plano negou"
  - "Meu filho tem TEA e preciso de tratamento"
  - "Preciso de perícia grafotécnica para validar assinatura"

**Resultado esperado:** Sistema identifica produto correto em todos os casos

---

## COMMITS

### [ ] Commit das Correções

```bash
git add src/lib/ai/qualification/agent-product-mapping.ts
git commit -m "$(cat <<'EOF'
fix(P0/P1): Corrigir 5 discrepâncias de slugs no agent-product-mapping

Correções:
- P0: Remover pericia-medica (produto não existe no catalog)
- P1: Renomear plano-saude → plano-saude-negou
- P1: Renomear bariatrica → cirurgia-bariatrica
- P1: Renomear tratamento-tea → tea
- P1: Renomear grafotecnica → grafotecnia

Impacto:
- Coverage: 91.4% → 100%
- Score: 96/100 → 100/100
- Fix de bugs potenciais em runtime (404s)

Refs: .manus/reports/VALIDATION_P1_001_002_FINAL.md

Generated with Claude Code (https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
EOF
)"
```

---

## DOCUMENTAÇÃO

### [ ] Atualizar Changelog

**Arquivo:** `.manus/knowledge/produtos-catalogo.md`

**Adicionar em Changelog:**
```markdown
### v2.2 - 29/12/2025
- Corrigido alinhamento de 5 slugs entre catalog.ts e agent-product-mapping.ts
- Removido pericia-medica do mapping (produto não implementado)
- Score de consistência: 91% → 100%
- Coverage do mapping: 91.4% → 100%
```

---

## CRITÉRIOS DE SUCESSO

- [ ] Todas as 5 correções aplicadas
- [ ] Nenhum slug mapeado aponta para produto inexistente
- [ ] Todos os slugs mapeados correspondem exatamente aos do catalog
- [ ] Coverage = 100%
- [ ] Score = 100/100
- [ ] Testes passando
- [ ] Commit realizado
- [ ] Changelog atualizado

---

**Status:** PENDENTE
**Próxima Fase:** FASE 5 - ORIENTAR (Aplicar correções)
**Responsável:** Development Team
**Deadline Sugerido:** 30/12/2025

---

**Gerado em:** 29/12/2025 às 00:00 UTC
**Validation Agent:** Claude Sonnet 4.5
**Relatório Base:** `d:\garcezpalha\.manus\reports\VALIDATION_P1_001_002_FINAL.md`
