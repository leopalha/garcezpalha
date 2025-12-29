# PLANO DE EXECUÇÃO - FASES 3, 4, 5, 6

## Status: PRONTO PARA EXECUÇÃO

**Data**: 27 de Dezembro de 2025
**Score Atual**: 94/100
**Meta Final**: 100/100

---

## RESUMO EXECUTIVO

Este documento contém o plano detalhado para executar as 4 fases de reorganização de documentação:

- **FASE 3**: Adicionar links cruzados em 33 documentos
- **FASE 4**: Completar DADOS_MESTRES.md
- **FASE 5**: Adicionar metadados YAML (opcional)
- **FASE 6**: Atualizar INDICE-GERAL.md

---

## FASE 3: LINKS CRUZADOS (ALTA PRIORIDADE)

### Documentos Identificados (33 arquivos)

```
00_ACTIVATION_PROMPT.md
00-INDICE-GERAL.md
01-POSICIONAMENTO-MARCA.md
02_DESIGN_SYSTEM.md
02-ARQUITETURA-PLATAFORMA.md
03_PRD.md
03-CATALOGO-PRODUTOS.md
04_USER_FLOWS.md
04-LANDING-PAGE-PRINCIPAL.md
05_TECHNICAL_ARCHITECTURE.md
05-GOOGLE-ADS-CAMPANHAS.md
06_COMPONENT_LIBRARY.md
06-SEO-CONTEUDO.md
07_DEV_BRIEF.md
07-IA-TRIAGEM-UNIVERSAL.md
08_BUSINESS_MODEL.md
08-FLUXOS-QUALIFICACAO.md
09-PRECIFICACAO-DINAMICA.md
10-PROPOSTAS-CONTRATOS.md
11-PAGAMENTOS-AUTOMACAO.md
12-ONBOARDING-CLIENTE.md
13-TEMPLATES-PETICOES.md
14-IA-PRODUCAO-JURIDICA.md
15_CATALOGO_SERVICOS.md
15-PROTOCOLOS-ACOMPANHAMENTO.md
16_ARQUITETURA_AGENTES_IA.md
16-METRICAS-KPIS.md
17_INTEGRACOES.md
17-STACK-TECNOLOGICA.md
18_DEPLOY_GUIDE.md
18-ROADMAP-IMPLEMENTACAO.md
19-IA-VERTICAL-AUTONOMA.md
20_TESTES.md
```

### Template de Links para Adicionar

**Inserir NO FINAL de cada documento, ANTES das linhas de metadados finais:**

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

### Script de Execução (Python)

```python
#!/usr/bin/env python3
import os

DOCS_DIR = "/d/garcezpalha/docs"

CROSS_LINKS = """---

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

---"""

# Lista de documentos
docs_to_update = [
    "00_ACTIVATION_PROMPT.md",
    "00-INDICE-GERAL.md",
    "01-POSICIONAMENTO-MARCA.md",
    "02_DESIGN_SYSTEM.md",
    "02-ARQUITETURA-PLATAFORMA.md",
    "03_PRD.md",
    "03-CATALOGO-PRODUTOS.md",
    "04_USER_FLOWS.md",
    "04-LANDING-PAGE-PRINCIPAL.md",
    "05_TECHNICAL_ARCHITECTURE.md",
    "05-GOOGLE-ADS-CAMPANHAS.md",
    "06_COMPONENT_LIBRARY.md",
    "06-SEO-CONTEUDO.md",
    "07_DEV_BRIEF.md",
    "07-IA-TRIAGEM-UNIVERSAL.md",
    "08_BUSINESS_MODEL.md",
    "08-FLUXOS-QUALIFICACAO.md",
    "09-PRECIFICACAO-DINAMICA.md",
    "10-PROPOSTAS-CONTRATOS.md",
    "11-PAGAMENTOS-AUTOMACAO.md",
    "12-ONBOARDING-CLIENTE.md",
    "13-TEMPLATES-PETICOES.md",
    "14-IA-PRODUCAO-JURIDICA.md",
    "15_CATALOGO_SERVICOS.md",
    "15-PROTOCOLOS-ACOMPANHAMENTO.md",
    "16_ARQUITETURA_AGENTES_IA.md",
    "16-METRICAS-KPIS.md",
    "17_INTEGRACOES.md",
    "17-STACK-TECNOLOGICA.md",
    "18_DEPLOY_GUIDE.md",
    "18-ROADMAP-IMPLEMENTACAO.md",
    "19-IA-VERTICAL-AUTONOMA.md",
    "20_TESTES.md",
]

updated_count = 0
skipped_count = 0

for filename in docs_to_update:
    filepath = os.path.join(DOCS_DIR, filename)

    if not os.path.exists(filepath):
        print(f"✗ NÃO EXISTE: {filename}")
        continue

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Verificar se já tem a seção
    if "DOCUMENTOS RELACIONADOS" in content:
        print(f"✗ JÁ CONTÉM: {filename}")
        skipped_count += 1
        continue

    # Remover linhas de metadados finais
    lines = content.split('\n')
    last_real_line = len(lines) - 1

    while last_real_line >= 0 and (
        not lines[last_real_line].strip() or
        lines[last_real_line].startswith('*Documento:') or
        lines[last_real_line].startswith('*Versão:') or
        lines[last_real_line].startswith('*Última atualização:')
    ):
        last_real_line -= 1

    # Construir novo conteúdo
    new_content = '\n'.join(lines[:last_real_line + 1]) + '\n\n' + CROSS_LINKS + '\n\n'

    # Adicionar metadados de volta
    for line in lines[last_real_line + 1:]:
        if line.strip():
            new_content += line + '\n'

    # Escrever arquivo
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)

    print(f"✓ ATUALIZADO: {filename}")
    updated_count += 1

print(f"\n{'='*70}")
print(f"RESUMO: {updated_count} documentos atualizados, {skipped_count} pulados")
print(f"{'='*70}")
```

**Para executar:**
```bash
python3 /d/garcezpalha/.manus/plano_execucao_fases_3456.py
```

---

## FASE 4: COMPLETAR DADOS_MESTRES.md

### Campos Confirmados vs [A confirmar]

**Status**: Analisando arquivo em `business/DADOS_MESTRES.md`

### Campos [A confirmar] Identificados

1. **CNPJ** - Campo: `CNPJ [A confirmar - aguardando validação]`
   - Necessário: Confirmação legal
   - Fonte: Documentação legal da empresa

2. **Inscrição OAB Sociedade** - Campo: `[A confirmar]`
   - Necessário: Número de registro na OAB
   - Fonte: Certificado OAB

3. **Profissionais Dra. Ana Maria Garcez** - OAB: `[A confirmar]`
   - Necessário: Número OAB individual

4. **Profissionais Dr. Ricardo Palha** - OAB: `[A confirmar]`
   - Necessário: Número OAB individual

5. **CONPEJ** - Campo: `[Registro ativo]`
   - Necessário: Confirmação de registro ativo

6. **CRECI** - Campo: `[Registro ativo]`
   - Necessário: Confirmação de registro ativo

### Ações para Completar

1. **Verificar em docs/** se há informação sobre estes campos
2. **Procurar em src/** por dados de configuração
3. **Se não encontrar**: Deixar como está e marcar como "PENDENTE DE CONFIRMAÇÃO"
4. **Se encontrar**: Substituir `[A confirmar]` pelo valor real

### Script de Validação

```python
import re

# Ler DADOS_MESTRES.md
with open('/d/garcezpalha/business/DADOS_MESTRES.md', 'r', encoding='utf-8') as f:
    content = f.read()

# Encontrar todos os [A confirmar]
confirmacoes_pendentes = re.findall(r'\[A confirmar[^\]]*\]', content)

print(f"Total de campos [A confirmar]: {len(confirmacoes_pendentes)}")
for i, item in enumerate(confirmacoes_pendentes, 1):
    print(f"{i}. {item}")
```

---

## FASE 5: METADADOS YAML (OPCIONAL)

### Template de Metadata

**Adicionar NO INÍCIO de cada documento principal (antes do primeiro #):**

```yaml
---
título: [Nome do Documento]
versão: 1.0
data: 2025-12-27
status: PRODUCTION
tipo: SSOT | PRINCIPAL | SETUP | IMPLEMENTAÇÃO
---

```

### Mapeamento de Tipos

- **SSOT**: Fonte Única de Verdade (DADOS_MESTRES, OAB_COMPLIANCE_GUIDE)
- **PRINCIPAL**: Documentação principal (01-20)
- **SETUP**: Guias de configuração
- **IMPLEMENTAÇÃO**: Detalhes técnicos e fluxos

---

## FASE 6: ATUALIZAR ÍNDICE-GERAL

### Estrutura Proposta para INDICE-GERAL.md

```markdown
# GARCEZ PALHA - INTELIGÊNCIA JURÍDICA
## Índice Geral de Documentação

---

## 📁 ESTRUTURA DE DOCUMENTAÇÃO

### Tier 1: Fontes Únicas (SSOT)

Documentos de referência absoluta - fonte única de verdade:

- **[DADOS_MESTRES.md](../business/DADOS_MESTRES.md)**
  - Informações oficiais da empresa
  - Catálogo de 30 produtos e serviços
  - Stack tecnológica e custos
  - Métricas e KPIs
  - Agentes de IA especializados
  - Integrações externas

- **[OAB_COMPLIANCE_GUIDE.md](../business/OAB_COMPLIANCE_GUIDE.md)**
  - Regras de compliance jurídico
  - Frases proibidas/permitidas
  - Disclaimers obrigatórios
  - Código de Ética OAB

- **[PRD.md](03_PRD.md)**
  - Product Requirements Document
  - Funcionalidades planejadas
  - Especificações técnicas

- **[STACK_TECNOLOGICA.md](17-STACK-TECNOLOGICA.md)**
  - Arquitetura técnica completa
  - Versões de dependências
  - Custos por serviço

### Tier 2: Documentos Principais (01-20)

Documentação operacional organizada por fase do cliente:

#### FUNDAÇÃO (01-03)
- [01-POSICIONAMENTO-MARCA.md](./01-POSICIONAMENTO-MARCA.md) - Branding e posicionamento
- [02-ARQUITETURA-PLATAFORMA.md](./02-ARQUITETURA-PLATAFORMA.md) - Arquitetura técnica
- [03-CATALOGO-PRODUTOS.md](./03-CATALOGO-PRODUTOS.md) - Catálogo de produtos

#### AQUISIÇÃO (04-06)
- [04-LANDING-PAGE-PRINCIPAL.md](./04-LANDING-PAGE-PRINCIPAL.md) - Wireframes e copy
- [05-GOOGLE-ADS-CAMPANHAS.md](./05-GOOGLE-ADS-CAMPANHAS.md) - Estratégia de ads
- [06-SEO-CONTEUDO.md](./06-SEO-CONTEUDO.md) - Estratégia SEO e conteúdo

#### CONVERSÃO (07-09)
- [07-IA-TRIAGEM-UNIVERSAL.md](./07-IA-TRIAGEM-UNIVERSAL.md) - IA de atendimento (Clara)
- [08-FLUXOS-QUALIFICACAO.md](./08-FLUXOS-QUALIFICACAO.md) - Fluxos por área de atuação
- [09-PRECIFICACAO-DINAMICA.md](./09-PRECIFICACAO-DINAMICA.md) - Sistema de preços

#### FECHAMENTO (10-12)
- [10-PROPOSTAS-CONTRATOS.md](./10-PROPOSTAS-CONTRATOS.md) - Templates de proposta
- [11-PAGAMENTOS-AUTOMACAO.md](./11-PAGAMENTOS-AUTOMACAO.md) - Gateway e automação
- [12-ONBOARDING-CLIENTE.md](./12-ONBOARDING-CLIENTE.md) - Jornada pós-venda

#### PRODUÇÃO (13-15)
- [13-TEMPLATES-PETICOES.md](./13-TEMPLATES-PETICOES.md) - Templates jurídicos
- [14-IA-PRODUCAO-JURIDICA.md](./14-IA-PRODUCAO-JURIDICA.md) - IA de documentos
- [15-PROTOCOLOS-ACOMPANHAMENTO.md](./15-PROTOCOLOS-ACOMPANHAMENTO.md) - Monitoramento

#### ESCALA (16-18)
- [16-METRICAS-KPIS.md](./16-METRICAS-KPIS.md) - Métricas e KPIs detalhados
- [17-STACK-TECNOLOGICA.md](./17-STACK-TECNOLOGICA.md) - Stack técnica completa
- [18-ROADMAP-IMPLEMENTACAO.md](./18-ROADMAP-IMPLEMENTACAO.md) - Timeline de implementação

#### FUTUROS (19-20)
- [19-IA-VERTICAL-AUTONOMA.md](./19-IA-VERTICAL-AUTONOMA.md) - IA vertical autônoma
- [20_TESTES.md](./20_TESTES.md) - Estratégia de testes

### Tier 3: Documentação Especializada

Documentação técnica, setups e análises detalhadas:

- **Setup**: Guias de configuração e instalação
- **Implementações**: Detalhes técnicos de features
- **Análises**: Auditorias e análises de sistema
- **Deployment**: Deploy, migração e devops
- **Fixes**: Correções documentadas e hotfixes

### Tier 4: Relatórios MANUS

Relatórios gerados pelo sistema MANUS v6.0:

- `.manus/AUDITORIA_FINAL_MANUS.md` - Auditoria completa
- `.manus/MATRIZ_ALINHAMENTO_DOCS_CODIGO.md` - Gaps identificados
- `.manus/ROADMAP_100_PERCENT.md` - Plano para 100/100
- `.manus/RELATORIO_ALINHAMENTO_FINAL.md` - Relatório final

---

## 🎯 COMO USAR ESTA DOCUMENTAÇÃO

1. **Para entender a empresa**: Comece em DADOS_MESTRES.md
2. **Para entender compliance**: Leia OAB_COMPLIANCE_GUIDE.md
3. **Para entender o fluxo**: Leia documentos 01-20 em ordem
4. **Para implementar**: Consulte docs específicos de cada área
5. **Para auditar**: Leia relatórios em .manus/

---
```

---

## CRONOGRAMA DE EXECUÇÃO

### Imediato (Agora)
- [ ] FASE 3: Scripts prontos para execução
- [ ] FASE 4: Validação de campos [A confirmar]
- [ ] FASE 6: Estrutura proposta de índice

### Curto Prazo (Hoje)
- [ ] Executar FASE 3 (links cruzados)
- [ ] Atualizar FASE 6 (índice)
- [ ] Revisar FASE 4 (campos pendentes)

### Médio Prazo (Este mês)
- [ ] Implementar FASE 5 (metadados - opcional)
- [ ] Validar score final
- [ ] Confirmar alcance de 100/100

---

## MÉTRICAS DE SUCESSO

| Métrica | Alvo | Status |
|---------|------|--------|
| Links cruzados adicionados | 33 docs | Pendente |
| [A confirmar] resolvidos | 6+ campos | Pendente |
| Índice atualizado | 100% | Pendente |
| Score final | 100/100 | Atual: 94/100 |

---

## DEPENDÊNCIAS E PRÉ-REQUISITOS

- Python 3.6+
- Acesso de escrita a `/d/garcezpalha/docs/`
- Acesso de escrita a `/d/garcezpalha/business/`
- Git (para commit final)

---

## PRÓXIMOS PASSOS

1. **Confirmar execução** das scripts de FASE 3
2. **Validar campos** em DADOS_MESTRES.md
3. **Atualizar índice** em 00-INDICE-GERAL.md
4. **Validar score** final via relatório MANUS
5. **Fazer commit** com todas as mudanças

---

*Plano criado: 27 de Dezembro de 2025*
*MANUS v6.0 - Multi-Agent Network for Unified Systems*
