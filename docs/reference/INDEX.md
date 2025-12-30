# INDICE DE DOCUMENTACAO - GARCEZ PALHA

Este arquivo lista toda a documentacao disponivel do projeto.

---

## DOCUMENTOS PRINCIPAIS (Estrutura Numerada)

| # | Arquivo | Descricao |
|---|---------|-----------|
| 00 | `00_ACTIVATION_PROMPT.md` | Prompt de ativacao para agentes/devs |
| 00 | `00_EMPRESA.md` | Informacoes completas do escritorio |
| 02 | `02_DESIGN_SYSTEM.md` | Sistema de design, cores, tipografia |
| 03 | `03_PRD.md` | Product Requirements Document |
| 04 | `04_USER_FLOWS.md` | Fluxos de usuario em Mermaid |
| 05 | `05_TECHNICAL_ARCHITECTURE.md` | Arquitetura tecnica completa |
| 06 | `06_COMPONENT_LIBRARY.md` | Biblioteca de componentes UI |
| 07 | `07_DEV_BRIEF.md` | Guia rapido para desenvolvedores |
| 08 | `08_BUSINESS_MODEL.md` | Modelo de negocios |
| 15 | `15_CATALOGO_SERVICOS.md` | Catalogo de servicos oferecidos |
| 16 | `16_ARQUITETURA_AGENTES_IA.md` | Sistema de agentes IA |
| 17 | `17_INTEGRACOES.md` | Mapa de integracoes externas |
| 18 | `18_DEPLOY_GUIDE.md` | Guia completo de deploy |
| 20 | `20_TESTES.md` | Estrategia de testes |

---

## DOCUMENTOS DE REFERENCIA

| Arquivo | Descricao |
|---------|-----------|
| `WARP.md` | Guia para WARP.dev (contexto rapido) |
| `tasks.md` | Task tracking detalhado (sprints) |
| `AUDIT_REPORT.md` | Relatorio de auditoria |

---

## DOCUMENTOS DE NEGOCIO

| Arquivo | Descricao | Status |
|---------|-----------|--------|
| `../business/DADOS_MESTRES.md` | **FONTE UNICA DE VERDADE** - Todos os dados oficiais da empresa | CRITICO |
| `09-PRECIFICACAO-DINAMICA.md` | Precificacao detalhada por produto | Ativo |

---

## DOCUMENTOS LEGADOS (Manter para Historico)

| Arquivo | Status | Nota |
|---------|--------|------|
| `PRD.md` | Substituido | -> `03_PRD.md` |
| `architecture.md` | Substituido | -> `05_TECHNICAL_ARCHITECTURE.md` |
| `FLOWCHART.md` | Substituido | -> `04_USER_FLOWS.md` |
| `DEPLOY_GUIDE.md` | Substituido | -> `18_DEPLOY_GUIDE.md` |

---

## ESTRUTURA IDEAL (Referencia Versati)

A estrutura numerada segue o padrao:

```
docs/
├── 00_ACTIVATION_PROMPT.md     # Contexto inicial
├── 00_EMPRESA.md               # Sobre a empresa
├── 02_DESIGN_SYSTEM.md         # Design system
├── 03_PRD.md                   # Requisitos
├── 04_USER_FLOWS.md            # Fluxos de usuario
├── 05_TECHNICAL_ARCHITECTURE.md # Arquitetura
├── 06_COMPONENT_LIBRARY.md     # Componentes
├── 07_DEV_BRIEF.md             # Guia dev
├── 08_BUSINESS_MODEL.md        # Modelo negocio
├── 15_CATALOGO_SERVICOS.md     # Servicos
├── 16_ARQUITETURA_AGENTES_IA.md # Agentes IA
├── 17_INTEGRACOES.md           # Integracoes
├── 18_DEPLOY_GUIDE.md          # Deploy
├── 20_TESTES.md                # Testes
├── INDEX.md                    # Este arquivo
├── WARP.md                     # Guia WARP
├── tasks.md                    # Task tracking
└── AUDIT_REPORT.md             # Auditoria
```

---

## COMO USAR

### Para Novos Desenvolvedores

1. Ler `00_ACTIVATION_PROMPT.md` primeiro
2. Seguir `07_DEV_BRIEF.md` para setup
3. Consultar `05_TECHNICAL_ARCHITECTURE.md` para entender o sistema

### Para Entender os Agentes IA

1. `16_ARQUITETURA_AGENTES_IA.md` - Documentacao completa
2. Codigo em `src/lib/ai/agents/`

### Para Deploy

1. `18_DEPLOY_GUIDE.md` - Guia passo a passo
2. `17_INTEGRACOES.md` - Configurar webhooks

### Para Entender o Negocio

1. `00_EMPRESA.md` - Sobre o escritorio
2. `08_BUSINESS_MODEL.md` - Modelo de negocios
3. `15_CATALOGO_SERVICOS.md` - Servicos oferecidos

---

## ATUALIZACOES

| Data | Mudanca |
|------|---------|
| 2025-12-22 | Criada estrutura numerada completa |
| 2025-12-22 | Auditoria e reorganizacao |
| 2025-11-21 | Documentacao de agentes IA |
| 2025-11-19 | PRD v3.0 |
