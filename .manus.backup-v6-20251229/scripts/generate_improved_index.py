#!/usr/bin/env python3
"""
Script para gerar ÍNDICE-GERAL.md melhorado com nova estrutura
FASE 6: Atualizar Índice com estrutura de Tiers

Uso:
    python3 generate_improved_index.py

Resultado:
    - Arquivo 00-INDICE-GERAL.md atualizado com nova estrutura
    - Melhor organização em Tiers (SSOT, Principais, Especializada, MANUS)
    - Links melhorados para navegação
"""

from pathlib import Path

def generate_improved_index():
    """Generate improved INDICE-GERAL.md with new structure."""

    INDEX_FILE = Path(__file__).parent.parent.parent / "docs" / "00-INDICE-GERAL.md"

    NEW_INDEX = """# GARCEZ PALHA - INTELIGÊNCIA JURÍDICA
## Índice Completo de Documentação

**Versão:** 2.0 (Reorganizada MANUS v6.0)
**Data:** 27 de Dezembro de 2025
**Status:** Documentação Completa

---

```
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║     G A R C E Z   P A L H A                                     ║
║     INTELIGÊNCIA JURÍDICA                                        ║
║                                                                  ║
║     "Resolvemos seu problema jurídico em 72h. Qualquer um."     ║
║                                                                  ║
║     Tecnologia de Ponta + 364 Anos de Tradição                  ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## 📁 ESTRUTURA DE DOCUMENTAÇÃO

### ⭐ TIER 1: FONTES ÚNICAS (SSOT - Single Source of Truth)

Documentos de referência absoluta - **leia primeiro**:

| Documento | Descrição | Versão |
|-----------|-----------|--------|
| [DADOS_MESTRES.md](../business/DADOS_MESTRES.md) | Dados oficiais da empresa, produtos, métricas | 1.0 |
| [OAB_COMPLIANCE_GUIDE.md](../business/OAB_COMPLIANCE_GUIDE.md) | Regras jurídicas e compliance OAB | 1.0 |
| [03_PRD.md](./03_PRD.md) | Product Requirements Document | 1.0 |
| [17-STACK-TECNOLOGICA.md](./17-STACK-TECNOLOGICA.md) | Arquitetura técnica e stack completa | 1.0 |

**Como usar**: Estes documentos são a fonte de verdade. Todas as alterações devem ser feitas PRIMEIRO aqui, depois propagadas para outros docs.

---

### 📋 TIER 2: DOCUMENTOS PRINCIPAIS (01-20)

Documentação operacional completa, organizada por **fase do cliente**:

#### 🏛️ FUNDAÇÃO (Arquitetura Base)

| # | Arquivo | Descrição |
|---|---------|-----------|
| 00 | [00_ACTIVATION_PROMPT.md](./00_ACTIVATION_PROMPT.md) | Prompt de ativação com contexto completo |
| 01 | [01-POSICIONAMENTO-MARCA.md](./01-POSICIONAMENTO-MARCA.md) | Identidade, narrativa, diferenciação da marca |
| 02 | [02-ARQUITETURA-PLATAFORMA.md](./02-ARQUITETURA-PLATAFORMA.md) | Estrutura técnica e fluxos principais |
| 03 | [03-CATALOGO-PRODUTOS.md](./03-CATALOGO-PRODUTOS.md) | Todos os 30 produtos e serviços |

#### 📢 AQUISIÇÃO (Tração e Leads)

| # | Arquivo | Descrição |
|---|---------|-----------|
| 04 | [04-LANDING-PAGE-PRINCIPAL.md](./04-LANDING-PAGE-PRINCIPAL.md) | Wireframe, copy e CTAs da homepage |
| 05 | [05-GOOGLE-ADS-CAMPANHAS.md](./05-GOOGLE-ADS-CAMPANHAS.md) | Estratégia de Google Ads por categoria |
| 06 | [06-SEO-CONTEUDO.md](./06-SEO-CONTEUDO.md) | Estratégia de SEO e conteúdo orgânico |

#### 🎯 CONVERSÃO (Qualificação e Venda)

| # | Arquivo | Descrição |
|---|---------|-----------|
| 07 | [07-IA-TRIAGEM-UNIVERSAL.md](./07-IA-TRIAGEM-UNIVERSAL.md) | IA de atendimento (Clara) - O cérebro da operação |
| 08 | [08-FLUXOS-QUALIFICACAO.md](./08-FLUXOS-QUALIFICACAO.md) | Qualificação por área jurídica |
| 09 | [09-PRECIFICACAO-DINAMICA.md](./09-PRECIFICACAO-DINAMICA.md) | Sistema de preços dinâmicos |

#### 💳 FECHAMENTO (Contrato e Pagamento)

| # | Arquivo | Descrição |
|---|---------|-----------|
| 10 | [10-PROPOSTAS-CONTRATOS.md](./10-PROPOSTAS-CONTRATOS.md) | Templates de proposta e contrato |
| 11 | [11-PAGAMENTOS-AUTOMACAO.md](./11-PAGAMENTOS-AUTOMACAO.md) | Fluxo de pagamento e automação |
| 12 | [12-ONBOARDING-CLIENTE.md](./12-ONBOARDING-CLIENTE.md) | Jornada pós-fechamento |

#### ⚖️ PRODUÇÃO (Execução Jurídica)

| # | Arquivo | Descrição |
|---|---------|-----------|
| 13 | [13-TEMPLATES-PETICOES.md](./13-TEMPLATES-PETICOES.md) | Templates jurídicos por área |
| 14 | [14-IA-PRODUCAO-JURIDICA.md](./14-IA-PRODUCAO-JURIDICA.md) | Automação de documentos jurídicos |
| 15 | [15-PROTOCOLOS-ACOMPANHAMENTO.md](./15-PROTOCOLOS-ACOMPANHAMENTO.md) | Monitoramento de processos |

#### 📊 ESCALA (Métricas e Roadmap)

| # | Arquivo | Descrição |
|---|---------|-----------|
| 16 | [16-METRICAS-KPIS.md](./16-METRICAS-KPIS.md) | KPIs e indicadores de performance |
| 17 | [17-STACK-TECNOLOGICA.md](./17-STACK-TECNOLOGICA.md) | Stack tecnológica completa |
| 18 | [18-ROADMAP-IMPLEMENTACAO.md](./18-ROADMAP-IMPLEMENTACAO.md) | Cronograma de implementação |

#### 🚀 FUTURO (Visão e Expansão)

| # | Arquivo | Descrição |
|---|---------|-----------|
| 19 | [19-IA-VERTICAL-AUTONOMA.md](./19-IA-VERTICAL-AUTONOMA.md) | IA vertical autônoma para especialização |
| 20 | [20_TESTES.md](./20_TESTES.md) | Estratégia de testes e QA |

---

### 🛠️ TIER 3: DOCUMENTAÇÃO TÉCNICA ESPECIALIZADA

Documentação detalhada por área:

#### Setup & Instalação
- Guias de configuração de ambiente
- Instruções de deploy
- Configuração de variáveis de ambiente

#### Implementações
- Detalhes técnicos de features
- Exemplos de código
- Padrões de desenvolvimento

#### Análises
- Auditorias de sistema
- Relatórios de qualidade
- Análises de performance

#### Deployment
- Instruções de deploy
- Migração de dados
- Rollback procedures

#### Fixes
- Correções documentadas
- Hotfixes críticos
- Resoluções de problemas

---

### 📈 TIER 4: RELATÓRIOS MANUS v6.0

Relatórios gerados pelo sistema de auditoria MANUS:

| Arquivo | Descrição |
|---------|-----------|
| [.manus/README.md](../.manus/README.md) | Índice do MANUS |
| [.manus/AUDITORIA_FINAL_MANUS.md](../.manus/AUDITORIA_FINAL_MANUS.md) | Auditoria completa do projeto |
| [.manus/MATRIZ_ALINHAMENTO_DOCS_CODIGO.md](../.manus/MATRIZ_ALINHAMENTO_DOCS_CODIGO.md) | Gaps identificados entre docs e código |
| [.manus/ROADMAP_100_PERCENT.md](../.manus/ROADMAP_100_PERCENT.md) | Plano para alcançar 100/100 |
| [.manus/RELATORIO_ALINHAMENTO_FINAL.md](../.manus/RELATORIO_ALINHAMENTO_FINAL.md) | Relatório final com score |
| [.manus/PLANO_EXECUCAO_FASES_3456.md](../.manus/PLANO_EXECUCAO_FASES_3456.md) | Plano de execução das fases finais |

---

## 🎯 COMO USAR ESTA DOCUMENTAÇÃO

### Para Iniciantes
1. **Comece em**: DADOS_MESTRES.md (entenda o que é a empresa)
2. **Leia depois**: OAB_COMPLIANCE_GUIDE.md (regras críticas)
3. **Explore**: 01-POSICIONAMENTO-MARCA.md até 20_TESTES.md em ordem

### Para Implementadores
1. **Consulte**: 03_PRD.md (requisitos)
2. **Use**: 17-STACK-TECNOLOGICA.md (arquitetura)
3. **Siga**: 18-ROADMAP-IMPLEMENTACAO.md (timeline)

### Para Auditores
1. **Leia**: .manus/AUDITORIA_FINAL_MANUS.md (visão geral)
2. **Analise**: .manus/MATRIZ_ALINHAMENTO_DOCS_CODIGO.md (gaps)
3. **Valide**: .manus/RELATORIO_ALINHAMENTO_FINAL.md (score)

### Para Consultores
1. **Explore**: DADOS_MESTRES.md (números e métricas)
2. **Entenda**: Documentos 01-18 (operação completa)
3. **Recomende**: Baseado em .manus/ROADMAP_100_PERCENT.md

---

## 📊 VISÃO GERAL DO SISTEMA

```
┌─────────────────────────────────────────────────────────────────────┐
│                    JORNADA COMPLETA DO CLIENTE                      │
└─────────────────────────────────────────────────────────────────────┘

AQUISIÇÃO (Docs 04-06)    │  CONVERSÃO (Docs 07-09)    │  FECHAMENTO (Docs 10-12)
   ↓                       │      ↓                      │       ↓
Google Ads, SEO ─────────>│ IA Triagem + Qualificação ─│─> Proposta + Pagamento
                           │      ↓                      │       ↓
Landing Page       ───────>│  Cálculo Dinâmico          │  Contrato Digital
                           │                             │
                           ↓                             ↓
                      Lead Scored              Cliente Confirmado
                           │
                           ↓
PRODUÇÃO (Docs 13-15)    │  ACOMPANHAMENTO           │  ESCALA (Docs 16-18)
   ↓                       │      ↓                      │       ↓
Geração IA Docs ─────────>│ Monitoramento Judit.io ───│─> Métricas + Roadmap
  Revisão Humana           │ Notificações Automáticas   │
                           │                             │
                           ↓                             ↓
                      Decisão Judicial        Otimização Contínua
```

---

## 🔗 REFERÊNCIAS CRUZADAS PRINCIPAIS

### Por Tipo de Busca

**"Como ativar a plataforma?"**
→ [00_ACTIVATION_PROMPT.md](./00_ACTIVATION_PROMPT.md)

**"Quais são os produtos?"**
→ [DADOS_MESTRES.md](../business/DADOS_MESTRES.md) ou [03-CATALOGO-PRODUTOS.md](./03-CATALOGO-PRODUTOS.md)

**"Como estruturo ads?"**
→ [05-GOOGLE-ADS-CAMPANHAS.md](./05-GOOGLE-ADS-CAMPANHAS.md)

**"Como qualificar leads?"**
→ [08-FLUXOS-QUALIFICACAO.md](./08-FLUXOS-QUALIFICACAO.md)

**"Como funciona a IA?"**
→ [07-IA-TRIAGEM-UNIVERSAL.md](./07-IA-TRIAGEM-UNIVERSAL.md)

**"Como gero documentos?"**
→ [14-IA-PRODUCAO-JURIDICA.md](./14-IA-PRODUCAO-JURIDICA.md)

**"Quais são os KPIs?"**
→ [16-METRICAS-KPIS.md](./16-METRICAS-KPIS.md)

**"Qual é o roadmap?"**
→ [18-ROADMAP-IMPLEMENTACAO.md](./18-ROADMAP-IMPLEMENTACAO.md)

**"O que é compliance OAB?"**
→ [../business/OAB_COMPLIANCE_GUIDE.md](../business/OAB_COMPLIANCE_GUIDE.md)

---

## 📝 ATUALIZAÇÕES RECENTES

- **27/12/2025**: MANUS v6.0 - Reorganização completa de documentação
- **26/12/2025**: Auditoria final e geração de relatórios
- **Anteriormente**: Implementação iterativa de features

---

## 🚀 PRÓXIMAS FASES

1. **Agora**: Implementação dos Docs 04-09 (Aquisição + Conversão)
2. **Próximo**: Implementação dos Docs 10-15 (Fechamento + Produção)
3. **Futuro**: Expansão para Docs 19-20 (Escala + IA Autônoma)

---

## 📞 CONTATOS

- **Site Principal**: garcezpalha.com
- **Email**: contato@garcezpalha.com
- **WhatsApp**: (21) 99535-4010
- **GitHub**: @leopalha

---

*Documentação GARCEZ PALHA - Índice Geral*
*Mantido por MANUS v6.0 - Multi-Agent Network for Unified Systems*
*Última atualização: 27 de Dezembro de 2025*
"""

    # Fazer backup do índice original
    if INDEX_FILE.exists():
        backup_file = INDEX_FILE.parent / "00-INDICE-GERAL.backup.md"
        with open(INDEX_FILE, 'r', encoding='utf-8') as f:
            backup_content = f.read()
        with open(backup_file, 'w', encoding='utf-8') as f:
            f.write(backup_content)
        print(f"✓ Backup criado: {backup_file}")

    # Escrever novo índice
    with open(INDEX_FILE, 'w', encoding='utf-8') as f:
        f.write(NEW_INDEX)

    print(f"✓ Índice atualizado: {INDEX_FILE}")
    print()
    print("=" * 70)
    print("FASE 6 CONCLUÍDA: ÍNDICE-GERAL.md ATUALIZADO")
    print("=" * 70)

    return True

if __name__ == "__main__":
    try:
        generate_improved_index()
    except Exception as e:
        print(f"ERRO: {str(e)}")
