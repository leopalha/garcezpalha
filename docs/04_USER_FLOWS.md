# USER FLOWS - FLUXOS DE USUARIO

Este documento descreve todos os fluxos de usuario da plataforma Garcez Palha.

**Versao**: 2.0
**Data**: 2024-12-23

---

## 1. FLUXO DO CHATBOT (PRINCIPAL)

```mermaid
flowchart TD
    A[Usuario acessa site] --> B{Canal de entrada}
    B -->|Website| C[Widget de Chat]
    B -->|WhatsApp| D[WhatsApp Cloud API]
    B -->|Telegram| E[@garcezpalha_bot]

    C --> F[API /api/chat]
    D --> F
    E --> F

    F --> G{AI Configurada?}
    G -->|Nao| H[Modo Demo]
    H --> I[Respostas Pre-definidas]

    G -->|Sim| J[AgentOrchestrator]
    J --> K{Analisa Keywords}

    K -->|Imovel| L[RealEstateAgent]
    K -->|Assinatura| M[ForensicsAgent]
    K -->|Valor| N[ValuationAgent]
    K -->|Medico| O[MedicalAgent]
    K -->|Criminal| P[CriminalAgent]
    K -->|Outros| Q[GeneralAgent]

    L --> R[OpenRouter GPT-4]
    M --> R
    N --> R
    O --> R
    P --> R
    Q --> R

    R --> S[Resposta + Disclaimer OAB]
    S --> T[Salva no Supabase]
    T --> U[Lead Qualification]
    U --> V[Retorna ao Usuario]
```

---

## 2. FLUXO DE QUALIFICACAO AUTOMATICA (NOVO)

```mermaid
flowchart TD
    A[Mensagem do Usuario] --> B[Chat Qualification Integration]
    B --> C{Sessao Existente?}

    C -->|Nao| D[Detectar Agente/Produto]
    D --> E[Criar Sessao de Qualificacao]
    E --> F[Carregar Perguntas do Produto]

    C -->|Sim| G[Recuperar Sessao]
    G --> F

    F --> H[Question Engine]
    H --> I{Resposta Valida?}

    I -->|Nao| J[Pedir Reformulacao]
    J --> H

    I -->|Sim| K[Registrar Resposta]
    K --> L{Mais Perguntas?}

    L -->|Sim| M[Proxima Pergunta]
    M --> H

    L -->|Nao| N[Score Calculator]
    N --> O{Calcular Score}

    O --> P[Urgencia: 40%]
    O --> Q[Probabilidade: 35%]
    O --> R[Complexidade: 25%]

    P --> S[Score Total]
    Q --> S
    R --> S

    S --> T{Categorizar Lead}
    T -->|Score >= 75| U[HOT Lead]
    T -->|Score >= 50| V[WARM Lead]
    T -->|Score >= 25| W[COLD Lead]
    T -->|Score < 25| X[UNQUALIFIED]

    U --> Y[Gerar Payment Link]
    V --> Y
    W --> Z[Agendar Follow-up]
    X --> AA[Encerrar]

    Y --> AB[Gerar Proposta]
    AB --> AC[Salvar no Supabase]
    AC --> AD[Agendar Follow-ups]
```

---

## 3. FLUXO DE GERACAO DE DOCUMENTOS (NOVO)

```mermaid
flowchart TD
    A[Advogado/Admin solicita documento] --> B[API /api/documents/generate]
    B --> C[Selecionar Template]

    C --> D{Template Disponivel?}
    D -->|Nao| E[Erro: Template nao encontrado]

    D -->|Sim| F[Template Engine]
    F --> G[Validar Variaveis]

    G --> H{Variaveis Completas?}
    H -->|Nao| I[Retornar variaveis faltantes]

    H -->|Sim| J[Substituir Variaveis]
    J --> K[Processar Condicionais]
    K --> L{Usar IA para Enhancement?}

    L -->|Sim| M[OpenAI GPT-4]
    M --> N[Enriquecer Documento]

    L -->|Nao| O[Documento Base]
    N --> O

    O --> P[Salvar generated_documents]
    P --> Q[Adicionar a Fila de Revisao]
    Q --> R[Notificar Advogado Responsavel]
```

---

## 4. FLUXO DE REVISAO DE DOCUMENTOS (NOVO)

```mermaid
flowchart TD
    A[Documento na Fila] --> B[Admin acessa /admin/documentos]
    B --> C[Ver Fila de Revisao]

    C --> D[Selecionar Documento]
    D --> E{Acao?}

    E -->|Assumir| F[Atribuir a si mesmo]
    F --> G[Status: in_review]
    G --> H[Revisar Conteudo]

    H --> I{Decisao?}

    I -->|Aprovar| J[Status: approved]
    J --> K[Disponibilizar para Download]
    K --> L[Notificar Cliente]

    I -->|Rejeitar| M[Informar Motivo]
    M --> N[Status: rejected]
    N --> O[Notificar Solicitante]

    I -->|Solicitar Revisao| P[Status: revision_requested]
    P --> Q[Adicionar Notas]
    Q --> R[Retornar para Geracao]

    E -->|Exportar| S[DocxExporter]
    S --> T{Formato?}
    T -->|DOCX| U[Download Word]
    T -->|TXT| V[Download Texto]
    T -->|JSON| W[API Response]
```

---

## 5. FLUXO DE FOLLOW-UP AUTOMATICO (NOVO)

```mermaid
flowchart TD
    A[Lead Qualificado] --> B[Follow-up Scheduler]
    B --> C{Categoria do Lead?}

    C -->|HOT| D[Sequencia Agressiva]
    D --> E[Msg 1: Imediato]
    E --> F[Msg 2: +2h]
    F --> G[Msg 3: +24h]
    G --> H[Msg 4: +48h]

    C -->|WARM| I[Sequencia Moderada]
    I --> J[Msg 1: +1h]
    J --> K[Msg 2: +24h]
    K --> L[Msg 3: +72h]
    L --> M[Msg 4: +7dias]

    C -->|COLD| N[Sequencia Nurturing]
    N --> O[Msg 1: +24h]
    O --> P[Msg 2: +7dias]
    P --> Q[Msg 3: +14dias]
    Q --> R[Msg 4: +30dias]

    H --> S{Canal}
    M --> S
    R --> S

    S -->|WhatsApp| T[WhatsApp Cloud API]
    S -->|Email| U[Resend]
    S -->|SMS| V[SMS Service]

    T --> W[Registrar Envio]
    U --> W
    V --> W

    W --> X{Lead Respondeu?}
    X -->|Sim| Y[Pausar Sequencia]
    X -->|Nao| Z[Continuar]

    Y --> AA{Lead Converteu?}
    AA -->|Sim| AB[Cancelar Follow-ups]
    AA -->|Nao| AC[Retomar Conversa]
```

---

## 6. FLUXO DE CLASSIFICACAO DE URGENCIA (NOVO)

```mermaid
flowchart TD
    A[Nova Movimentacao Processual] --> B[Urgency Classifier]
    B --> C[Analisar Texto]

    C --> D{Contem Keywords Criticas?}
    D -->|Sentenca, Mandado, Bloqueio| E[CRITICAL]

    D -->|Nao| F{Contem Keywords Alta?}
    F -->|Intimacao, Audiencia, Citacao| G[HIGH]

    F -->|Nao| H{Contem Keywords Media?}
    H -->|Despacho, Juntada, Recurso| I[MEDIUM]

    H -->|Nao| J[LOW]

    E --> K[Notificacao Imediata]
    G --> L[Notificacao em 1h]
    I --> M[Notificacao Diaria]
    J --> N[Apenas Log]

    K --> O{Canal?}
    L --> O
    M --> O

    O -->|WhatsApp| P[Enviar WhatsApp]
    O -->|Email| Q[Enviar Email]
    O -->|Ambos| R[Enviar Ambos]

    P --> S[Registrar Notificacao]
    Q --> S
    R --> S

    S --> T[Atualizar Dashboard Cliente]
```

---

## 7. FLUXO DO DASHBOARD EXECUTIVO (NOVO)

```mermaid
flowchart TD
    A[Admin acessa /admin] --> B[Dashboard Executivo]
    B --> C[Carregar Dados]

    C --> D[API /api/admin/leads/stats]
    D --> E{Dados Disponiveis?}

    E -->|Sim| F[Calcular Metricas]
    E -->|Nao| G[Valores Default]

    F --> H[MRR: Soma contratos ativos]
    F --> I[CAC: Marketing / Leads convertidos]
    F --> J[LTV: Ticket medio x Tempo retencao]
    F --> K[Conversao: Convertidos / Total]

    H --> L[Renderizar Cards]
    I --> L
    J --> L
    K --> L

    L --> M[Exibir Leads por Categoria]
    M --> N[Hot / Warm / Cold]

    N --> O[Feed de Atividade]
    O --> P[Ultimas interacoes]

    P --> Q{Acao Rapida?}
    Q -->|Ver Leads| R[/admin/leads]
    Q -->|Ver Documentos| S[/admin/documentos]
    Q -->|Ver Analytics| T[/admin/analytics]
    Q -->|Ver Agenda| U[/admin/agendamentos]
```

---

## 8. FLUXO DE CHECKOUT/PAGAMENTO

```mermaid
flowchart TD
    A[Usuario inicia checkout] --> B[Seleciona Servico]

    B --> C{Servico disponivel}
    C -->|Consultoria Imobiliaria| D[R$ 1.500]
    C -->|Pericia Documental| E[R$ 2.000]
    C -->|Avaliacao Imovel| F[R$ 1.200]
    C -->|Pericia Medica| G[R$ 2.500]
    C -->|Secretaria Remota| H[R$ 800/mes]
    C -->|Consultoria Criminal| I[R$ 1.800]

    D --> J[Formulario de Dados]
    E --> J
    F --> J
    G --> J
    H --> J
    I --> J

    J --> K[Validacao]
    K -->|Erro| L[Mostra erros]
    L --> J

    K -->|OK| M{Metodo de Pagamento}
    M -->|Cartao| N[Stripe Checkout]
    M -->|PIX| O[MercadoPago]

    N --> P[Processamento]
    O --> P

    P -->|Sucesso| Q[/checkout/success]
    P -->|Erro| R[/checkout/cancel]

    Q --> S[Webhook atualiza DB]
    S --> T[Email de confirmacao]
    T --> U[Cria invoice]
```

---

## 9. FLUXO DE AUTENTICACAO

```mermaid
flowchart TD
    A[Usuario] --> B{Autenticado?}

    B -->|Nao| C[/login]
    C --> D[Formulario Login]
    D --> E{Credenciais validas?}

    E -->|Nao| F[Erro: credenciais invalidas]
    F --> D

    E -->|Sim| G[NextAuth Session]
    G --> H{Role do usuario?}

    H -->|Admin| I[/admin]
    H -->|Lawyer| J[/admin acesso parcial]
    H -->|Partner| K[/portal-parceiro]
    H -->|Client| L[/dashboard]

    B -->|Sim| M[Middleware verifica]
    M --> N{Rota permitida?}

    N -->|Sim| O[Acessa pagina]
    N -->|Nao| P[Redirect /unauthorized]
```

---

## 10. FLUXO DO DASHBOARD CLIENTE

```mermaid
flowchart TD
    A[Cliente logado] --> B[/dashboard]

    B --> C{Acao desejada}

    C -->|Ver Processos| D[/dashboard/processos]
    D --> E[Lista de processos]
    E --> F[Clique em processo]
    F --> G[/dashboard/processos/[id]]
    G --> H[Detalhes + Timeline]

    C -->|Ver Documentos| I[/dashboard/documentos]
    I --> J[Lista de documentos]
    J --> K{Acao}
    K -->|Upload| L[Upload arquivo]
    K -->|Download| M[Download PDF]
    K -->|Visualizar| N[Preview inline]

    C -->|Ver Prazos| O[/dashboard/prazos]
    O --> P[Calendario de prazos]
    P --> Q[Filtros por status]

    C -->|Ver Pagamentos| R[/dashboard/pagamentos]
    R --> S[Historico financeiro]
    S --> T[Download comprovantes]

    C -->|Configuracoes| U[/dashboard/configuracoes]
    U --> V[Editar perfil]
    U --> W[Notificacoes]
```

---

## 11. FLUXO DO PORTAL PARCEIRO

```mermaid
flowchart TD
    A[Parceiro logado] --> B[/portal-parceiro]

    B --> C[Dashboard com KPIs]
    C --> D{Acao}

    D -->|Ver Indicacoes| E[/portal-parceiro/indicacoes]
    E --> F[Lista de referrals]
    F --> G[Status de cada indicacao]

    D -->|Ver Comissoes| H[/portal-parceiro/comissoes]
    H --> I[Historico de comissoes]
    I --> J{Status}
    J -->|Pendente| K[Aguardando pagamento]
    J -->|Paga| L[Comissao creditada]

    D -->|Solicitar Saque| M[Formulario de saque]
    M --> N{Validacao OAB/CNPJ}
    N -->|OK| O[Processa saque]
    N -->|Falha| P[Requer verificacao]

    D -->|Material Marketing| Q[Downloads]
    Q --> R[Banners, PDFs, etc]

    D -->|Configuracoes| S[Perfil e dados bancarios]
```

---

## 12. FLUXO DE AGENDAMENTO

```mermaid
flowchart TD
    A[Lead qualificado] --> B{Via}
    B -->|Chatbot| C[Sugere horario]
    B -->|Formulario| D[/contato]
    B -->|Admin| E[/admin/agendamentos]

    C --> F[Seleciona data/hora]
    D --> F
    E --> F

    F --> G[Cria appointment]
    G --> H[Sync Google Calendar]
    H --> I[Email confirmacao]

    I --> J[Lembretes automaticos]
    J -->|24h antes| K[Email]
    J -->|2h antes| L[WhatsApp]

    L --> M{Consulta realizada?}
    M -->|Sim| N[Follow-up pos-consulta]
    M -->|Nao| O[Remarcar]

    N --> P[+3 dias: Como foi?]
    P --> Q[+7 dias: NPS]
    Q --> R[+30 dias: Upsell]
```

---

## 13. FLUXO DE EMAIL SEQUENCE (NURTURING)

```mermaid
flowchart TD
    A[Novo Lead criado] --> B[Inicia sequence]

    B --> C[Dia 1: Welcome]
    C --> D{Lead converteu?}
    D -->|Sim| E[Pausa sequence]
    D -->|Nao| F[Dia 3: How can we help?]

    F --> G{Lead converteu?}
    G -->|Sim| E
    G -->|Nao| H[Dia 7: Servicos overview]

    H --> I{Lead converteu?}
    I -->|Sim| E
    I -->|Nao| J[Dia 14: Last chance]

    J --> K{Lead respondeu?}
    K -->|Sim| L[Continua nurturing]
    K -->|Nao| M[Lead cold]

    E --> N[Email de contrato/pagamento]
```

---

## 14. FLUXO DE ASSINATURA DIGITAL (CLICKSIGN)

```mermaid
flowchart TD
    A[Lead aceita proposta] --> B[Gera contrato]
    B --> C[Envia para ClickSign]

    C --> D[ClickSign cria documento]
    D --> E[Email para cliente]
    E --> F[Cliente acessa link]

    F --> G{Assina?}
    G -->|Sim| H[Webhook recebido]
    G -->|Nao| I[Reminder automatico]
    I --> F

    H --> J[Download PDF assinado]
    J --> K[Salva no Supabase Storage]
    K --> L[Atualiza status do contrato]
    L --> M[Converte lead -> client]
    M --> N[Gera link de pagamento]
    N --> O[Notifica admin]
```

---

## 15. FLUXO DE MONITORAMENTO DE EMAILS (TRIBUNAIS)

```mermaid
flowchart TD
    A[Cron job 15min] --> B[Gmail API]
    B --> C[Busca emails tribunais]

    C --> D{Email de tribunal?}
    D -->|Nao| E[Ignora]

    D -->|Sim| F[Extrai dados]
    F --> G[Numero processo]
    F --> H[Tribunal origem]
    F --> I[Tipo movimentacao]

    G --> J[Cria process_alert]
    J --> K[Status: PENDENTE DOWNLOAD]

    K --> L{Admin acessa /admin/processos}
    L --> M[Ve lista de alertas]
    M --> N[Clica: Baixar Agora]
    N --> O[Redireciona para portal tribunal]

    O --> P[Admin baixa PDF]
    P --> Q[Upload no sistema]
    Q --> R[PDF Processor extrai texto]
    R --> S[Detecta prazos automaticamente]
    S --> T[Sync Google Calendar]
    T --> U[Notifica cliente]
```

---

## LEGENDA

| Simbolo | Significado |
|---------|-------------|
| Retangulo | Acao/Pagina |
| Losango | Decisao |
| Circulo | Inicio/Fim |
| Seta | Fluxo |

---

## METRICAS DE FLUXO

| Fluxo | Taxa de Conversao Esperada |
|-------|---------------------------|
| Chat -> Lead | 30-40% |
| Lead -> Qualificado | 50-60% |
| Qualificado HOT -> Consulta | 70-80% |
| Qualificado WARM -> Consulta | 40-50% |
| Consulta -> Cliente | 60-70% |
| Checkout iniciado -> Pago | 70-80% |
| Documento gerado -> Aprovado | 90-95% |

---

## CHANGELOG

| Versao | Data | Mudancas |
|--------|------|----------|
| 2.0 | 2024-12-23 | Adicao de fluxos: Qualificacao, Documentos, Follow-up, Urgencia, Dashboard Executivo |
| 1.0 | 2024-11-19 | Versao inicial |
