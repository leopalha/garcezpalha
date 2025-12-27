# SCRIPTS - Execução de FASES 3, 4, 5, 6

## Visão Geral

Este diretório contém scripts Python para executar as fases finais de reorganização de documentação do projeto GARCEZ PALHA, levando o score de **94/100 para 100/100**.

---

## 🚀 Quick Start

### Executar Tudo de Uma Vez

```bash
cd /d/garcezpalha/.manus/scripts
python3 execute_phases_3456.py
```

Isso executará em sequência:
1. **FASE 3**: Adicionar links cruzados em 33 documentos
2. **FASE 4**: Analisar campos [A confirmar] em DADOS_MESTRES
3. **FASE 6**: Atualizar ÍNDICE-GERAL.md
4. **FASE 5**: Instruções para metadados YAML (opcional)

---

## 📋 Scripts Individuais

### 1. `add_cross_links.py` - FASE 3

**Objetivo**: Adicionar seção "DOCUMENTOS RELACIONADOS" em 33 documentos principais

```bash
python3 add_cross_links.py
```

**O que faz**:
- Lê todos os arquivos numerados em `docs/`
- Verifica se já contêm a seção de links cruzados
- Adiciona links para SSOT (Fontes Únicas de Verdade)
- Preserva metadados finais originais

**Resultado esperado**:
```
✓ ATUALIZADO: 00_ACTIVATION_PROMPT.md
✓ ATUALIZADO: 01-POSICIONAMENTO-MARCA.md
✓ ATUALIZADO: 02-ARQUITETURA-PLATAFORMA.md
... (30 mais)

RESUMO: 33 documentos atualizados, 0 pulados
```

---

### 2. `analyze_dados_mestres.py` - FASE 4

**Objetivo**: Analisar e reportar campos `[A confirmar]` em DADOS_MESTRES.md

```bash
python3 analyze_dados_mestres.py
```

**O que faz**:
- Lê `business/DADOS_MESTRES.md`
- Procura por todos os campos marcados como `[A confirmar]`
- Lista campos pendentes de confirmação
- Fornece instruções para preenchimento

**Resultado esperado**:
```
Total de campos [A confirmar]: 6

1. | **CNPJ** | [A confirmar - aguardando validação] |
2. | **Inscrição OAB Sociedade** | [A confirmar] |
... (4 mais)

INSTRUÇÕES PARA COMPLETAR:
1. CNPJ: Verificar documento de constituição ou site da empresa
...
```

---

### 3. `generate_improved_index.py` - FASE 6

**Objetivo**: Atualizar `00-INDICE-GERAL.md` com nova estrutura de Tiers

```bash
python3 generate_improved_index.py
```

**O que faz**:
- Cria backup do índice atual (`.backup.md`)
- Gera novo índice com estrutura de 4 Tiers:
  - **Tier 1**: Fontes Únicas (SSOT)
  - **Tier 2**: Documentos Principais (01-20)
  - **Tier 3**: Documentação Técnica Especializada
  - **Tier 4**: Relatórios MANUS
- Adiciona referências cruzadas melhoradas
- Melhora navegação e descoberta

**Resultado esperado**:
```
✓ Backup criado: docs/00-INDICE-GERAL.backup.md
✓ Índice atualizado: docs/00-INDICE-GERAL.md

FASE 6 CONCLUÍDA: ÍNDICE-GERAL.md ATUALIZADO
```

---

## 🔧 Execução Avançada

### Modo Simulação (Dry Run)

```bash
python3 execute_phases_3456.py --dry-run
```

Mostra o que seria feito **sem fazer alterações**.

### Incluindo FASE 5 (Metadados YAML)

```bash
python3 execute_phases_3456.py --include-yaml
```

Inclui instruções para adicionar metadados YAML ao início dos documentos.

---

## 📊 Estrutura do Template de Links Cruzados

Todo documento receberá esta seção antes dos metadados finais:

```markdown
---

## 📚 DOCUMENTOS RELACIONADOS

### Fontes Únicas (SSOT)
- [DADOS_MESTRES.md](../business/DADOS_MESTRES.md) - Informações da empresa, produtos, preços, métricas
- [OAB_COMPLIANCE_GUIDE.md](../business/OAB_COMPLIANCE_GUIDE.md) - Regras de compliance jurídico
- [PRD.md](03_PRD.md) - Product Requirements Document
- [STACK_TECNOLOGICA.md](17-STACK-TECNOLOGICA.md) - Arquitetura técnica completa

### Navegação
- [← Índice Geral](00-INDICE-GERAL.md)
- [← Activation Prompt](00_ACTIVATION_PROMPT.md)
- [→ README Principal](../README.md)

---
```

---

## ✅ Checklist de Execução

Antes de rodar os scripts:

- [ ] Estar em `/d/garcezpalha/`
- [ ] Ter Python 3.6+ instalado
- [ ] Ter acesso de escrita para `docs/` e `business/`
- [ ] Branch `fix/markdown-rendering` ativo (não push a main)
- [ ] Ter feito `git pull` recentemente

Após rodar os scripts:

- [ ] Verificar `git status` para arquivos modificados
- [ ] Revisar alterações com `git diff`
- [ ] Testar se os links funcionam abrindo um documento
- [ ] Validar que não houve quebra de conteúdo existente
- [ ] Fazer commit: `git add . && git commit -m "feat: Reorganização MANUS v6.0"`

---

## 🐛 Troubleshooting

### Erro: "ModuleNotFoundError: No module named 'pathlib'"

**Solução**: Atualize Python para 3.6+

```bash
python3 --version
```

### Erro: "PermissionError: [Errno 13] Permission denied"

**Solução**: Verifique permissões de escrita

```bash
ls -la docs/ | head -5
chmod 755 /d/garcezpalha/docs
```

### Alguns arquivos não foram atualizados

**Causa**: Arquivo pode não existir ou já ter a seção

**Verificar**:
```bash
grep -l "DOCUMENTOS RELACIONADOS" /d/garcezpalha/docs/*.md
```

### Script trava ou fica lento

**Solução**: Pode estar processando muitos arquivos

- Deixe completar (pode levar alguns minutos)
- Ou interrompa com Ctrl+C e execute por arquivo:

```bash
python3 analyze_dados_mestres.py  # FASE 4 é rápido
python3 generate_improved_index.py  # FASE 6 é rápido
# FASE 3 pode demorar mais
```

---

## 📈 Impacto Esperado

| Métrica | Antes | Depois |
|---------|-------|--------|
| Score | 94/100 | 100/100 |
| Docs com links cruzados | 1 | 33+ |
| Campos [A confirmar] relatados | N/A | 6 |
| Índice atualizado | v1.0 | v2.0 |
| Metadados YAML (opcional) | 0 | 30+ |

---

## 🔗 Documentação Relacionada

- [PLANO_EXECUCAO_FASES_3456.md](../PLANO_EXECUCAO_FASES_3456.md) - Plano detalhado
- [../README.md](../README.md) - Índice MANUS
- [../../docs/00-INDICE-GERAL.md](../../docs/00-INDICE-GERAL.md) - Índice principal

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique a seção **Troubleshooting** acima
2. Revise o **PLANO_EXECUCAO_FASES_3456.md**
3. Consulte **RELATORIO_ALINHAMENTO_FINAL.md**

---

## 📝 Licença

Estes scripts fazem parte do projeto GARCEZ PALHA e seguem a mesma licença do repositório principal.

---

*Scripts MANUS v6.0 - Multi-Agent Network for Unified Systems*
*Criado em 27 de Dezembro de 2025*
