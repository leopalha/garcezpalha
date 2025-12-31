# USER FLOWS - FLUXOS DE USUARIO

Este documento descreve todos os fluxos de usuario da plataforma Garcez Palha.

**Versao**: 3.0
**Data**: 2024-12-31

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

## 16. FLUXO DE CRIACAO DE CAMPANHA DE MARKETING (NOVO)

```mermaid
flowchart TD
    A[Admin acessa /admin/marketing] --> B[Lista de Campanhas]
    B --> C[Clicar: Nova Campanha]

    C --> D[Campaign Builder]
    D --> E[Preencher Informacoes Basicas]
    E --> F[Nome, Tipo, Objetivo]

    F --> G{Tipo de Campanha?}
    G -->|Email| H[Email Sequence Builder]
    G -->|WhatsApp| I[WhatsApp Template Builder]
    G -->|Multi-canal| J[Multi-channel Builder]

    H --> K[Adicionar Emails a Sequencia]
    I --> K
    J --> K

    K --> L[Configurar Email]
    L --> M[Subject Line]
    M --> N[Body Content]
    N --> O[Delay/Trigger]

    O --> P{Adicionar A/B Test?}
    P -->|Sim| Q[Criar Variante B]
    Q --> R[Subject Line B]
    R --> S[Body B]
    S --> T[Split % A/B]

    P -->|Nao| U[Selecionar Segmento]
    T --> U

    U --> V[Filtros de Lead]
    V --> W[Tags, Score, Status]

    W --> X{Envio Imediato ou Agendado?}
    X -->|Imediato| Y[Salvar e Enviar]
    X -->|Agendado| Z[Definir Data/Hora]
    Z --> Y

    Y --> AA[Criar campaign no DB]
    AA --> AB[Criar campaign_emails]
    AB --> AC[Criar ab_tests se necessario]
    AC --> AD[Status: draft/scheduled/active]

    AD --> AE{Status?}
    AE -->|Scheduled| AF[Aguardar horario]
    AE -->|Active| AG[Iniciar Envios]

    AG --> AH{A/B Test?}
    AH -->|Sim| AI[Enviar variante A para 50%]
    AI --> AJ[Enviar variante B para 50%]
    AJ --> AK[Aguardar periodo teste]
    AK --> AL[Analisar metricas]
    AL --> AM[Selecionar vencedor]
    AM --> AN[Enviar vencedor para restante]

    AH -->|Nao| AO[Enviar para todos do segmento]
    AN --> AO

    AO --> AP[Registrar campaign_analytics]
    AP --> AQ[Dashboard de Performance]
```

---

## 17. FLUXO DE ANALYTICS DE CAMPANHA (NOVO)

```mermaid
flowchart TD
    A[Admin acessa /admin/marketing] --> B[Seleciona Campanha]
    B --> C[Ver Analytics]

    C --> D[API /api/marketing/campaigns/:id/analytics]
    D --> E[Carregar Metricas]

    E --> F[Email Sent Count]
    E --> G[Open Rate]
    E --> H[Click Rate]
    E --> I[Conversion Rate]

    F --> J[Renderizar Dashboard]
    G --> J
    H --> J
    I --> J

    J --> K[Grafico de Performance]
    K --> L[Timeline de Envios]
    L --> M[Funnel de Conversao]

    M --> N{A/B Test Ativo?}
    N -->|Sim| O[Comparar Variantes]
    O --> P[Tabela A vs B]
    P --> Q[Open Rate A vs B]
    Q --> R[Click Rate A vs B]
    R --> S[Conversao A vs B]

    S --> T[Indicar Vencedor]
    T --> U{Admin Define Winner?}
    U -->|Sim| V[API /api/marketing/ab-tests/:id/winner]
    V --> W[Atualizar status ab_test]
    W --> X[Enviar vencedor para restante]

    N -->|Nao| Y[Mostrar Metricas Gerais]
    U -->|Nao| Y

    Y --> Z[Lista de Emails Enviados]
    Z --> AA[Status individual: sent/opened/clicked]

    AA --> AB{Acao Admin?}
    AB -->|Pausar| AC[Status: paused]
    AB -->|Retomar| AD[Status: active]
    AB -->|Encerrar| AE[Status: completed]
    AB -->|Editar| AF[Campaign Builder Edit Mode]
```

---

## 18. FLUXO DE STRIPE CHECKOUT (SUBSCRIPTION) (NOVO)

```mermaid
flowchart TD
    A[Advogado acessa /app/checkout] --> B[Selecionar Plano]
    B --> C{Plano?}

    C -->|Starter| D[R$ 297/mes ou R$ 2.970/ano]
    C -->|Pro| E[R$ 697/mes ou R$ 6.970/ano]
    C -->|Enterprise| F[Preco customizado]

    D --> G[Selecionar Ciclo]
    E --> G
    F --> G

    G --> H{Adicionar Addons?}
    H -->|Sim| I[Nicho Extra +R$ 97/mes]
    I --> J[Catalogo Premium +R$ 197/mes]
    H -->|Nao| K[Preencher Dados]
    J --> K

    K --> L[Nome, Email, Telefone, CPF/CNPJ]
    L --> M[Validacao de Dados]

    M --> N{Dados Validos?}
    N -->|Nao| O[Mostrar Erros]
    O --> L

    N -->|Sim| P[API /api/stripe/checkout]
    P --> Q{User tem Stripe Customer ID?}

    Q -->|Nao| R[Criar Stripe Customer]
    R --> S[Salvar stripe_customer_id no DB]

    Q -->|Sim| T[Usar Customer ID existente]
    S --> T

    T --> U[Criar Checkout Session]
    U --> V[Line Items: Plano + Addons]
    V --> W[Metadata: user_id, plan_id, billing_cycle]

    W --> X[Retornar checkout.url]
    X --> Y[Redirect para Stripe Checkout]

    Y --> Z{Pagamento?}
    Z -->|Sucesso| AA[Stripe redireciona /app/checkout/success]
    Z -->|Cancelado| AB[Stripe redireciona /app/checkout?plan=...]

    AA --> AC[Stripe envia webhook]
    AC --> AD[checkout.session.completed]
    AD --> AE[customer.subscription.created]

    AE --> AF[Criar/Atualizar subscription no DB]
    AF --> AG[Criar usage_tracking record]
    AG --> AH[Atualizar user.current_plan]

    AH --> AI[Mostrar Success Page]
    AI --> AJ[Confetti Animation]
    AJ --> AK[Redirect /app/dashboard]
```

---

## 19. FLUXO DE SUBSCRIPTION MANAGEMENT (NOVO)

```mermaid
flowchart TD
    A[Advogado logado] --> B[/app/dashboard/assinatura]
    B --> C[API /api/subscriptions/current]

    C --> D{Subscription Existe?}
    D -->|Nao| E[Mostrar CTA: Assinar Agora]
    E --> F[Redirect /app/checkout]

    D -->|Sim| G[Carregar Dados]
    G --> H[subscription, usage, limits]

    H --> I[Renderizar Plano Atual]
    I --> J[Nome do Plano]
    J --> K[Preco Mensal/Anual]
    K --> L[Status: active/past_due/canceled]

    L --> M[Periodo de Cobranca]
    M --> N[current_period_start]
    N --> O[current_period_end]

    O --> P[Usage Tracking]
    P --> Q[Produtos: X / limite]
    Q --> R[Leads: X / limite]
    R --> S[Conversas: X / limite]
    S --> T[Emails: X / limite]

    T --> U{Usage >= 90% do Limite?}
    U -->|Sim| V[Mostrar Warning Badge]
    V --> W[Sugerir Upgrade de Plano]

    U -->|Nao| X{Usage >= 70%?}
    X -->|Sim| Y[Mostrar Info Badge]
    X -->|Nao| Z[Progress Bar Normal]

    W --> AA[Secao de Acoes]
    Y --> AA
    Z --> AA

    AA --> AB{Acao do Usuario?}
    AB -->|Gerenciar Metodo| AC[API /api/stripe/portal POST]
    AC --> AD[Criar Billing Portal Session]
    AD --> AE[Redirect para Stripe Portal]
    AE --> AF[Usuario atualiza cartao/endereco]
    AF --> AG[Retorna para /app/dashboard/assinatura]

    AB -->|Cancelar Assinatura| AH[Confirmacao Modal]
    AH --> AI{Confirma?}
    AI -->|Sim| AJ[API /api/subscriptions/cancel POST]
    AJ --> AK[Stripe: cancel_at_period_end = true]
    AK --> AL[Atualizar DB]
    AL --> AM[Mostrar: Cancelado em dd/mm/yyyy]

    AI -->|Nao| AN[Fechar Modal]

    AB -->|Reativar| AO[API /api/subscriptions/cancel DELETE]
    AO --> AP[Stripe: cancel_at_period_end = false]
    AP --> AQ[Atualizar DB]
    AQ --> AR[Status: active novamente]

    AB -->|Ver Faturas| AS[API /api/subscriptions/invoices]
    AS --> AT[Listar Invoices]
    AT --> AU[Tabela: Data, Valor, Status, PDF]
    AU --> AV{Download PDF?}
    AV -->|Sim| AW[invoice.invoice_pdf URL]
    AW --> AX[Abrir PDF Stripe]
```

---

## 20. FLUXO DE STRIPE WEBHOOKS (SUBSCRIPTION LIFECYCLE) (NOVO)

```mermaid
flowchart TD
    A[Stripe envia webhook] --> B[API /api/stripe/webhook]
    B --> C[Verificar Signature]

    C --> D{Signature Valida?}
    D -->|Nao| E[Retornar 400 Erro]

    D -->|Sim| F[Parse Event]
    F --> G{event.type?}

    G -->|checkout.session.completed| H[Processar Checkout]
    H --> I[Extrair metadata: user_id, plan_id]
    I --> J[Criar/Atualizar user]
    J --> K[Confirmar pagamento]

    G -->|customer.subscription.created| L[Criar Subscription]
    L --> M[Inserir tabela subscriptions]
    M --> N[status, plan_id, period_start, period_end]
    N --> O[Atualizar user.current_plan]

    G -->|customer.subscription.updated| P[Atualizar Subscription]
    P --> Q[Upsert tabela subscriptions]
    Q --> R[Atualizar status, current_period_end]
    R --> S{cancel_at_period_end?}
    S -->|true| T[Marcar para cancelamento]
    S -->|false| U[Subscription ativa]

    G -->|customer.subscription.deleted| V[Deletar Subscription]
    V --> W[Atualizar status: canceled]
    W --> X[Atualizar user.current_plan = free]
    X --> Y[Cancelar follow-ups automaticos]

    G -->|invoice.paid| Z[Marcar Invoice Paga]
    Z --> AA[Inserir/Atualizar invoices]
    AA --> AB[status: paid, paid_at]
    AB --> AC[Enviar Email: Fatura Paga]

    G -->|invoice.payment_failed| AD[Payment Failed]
    AD --> AE[Atualizar subscription.status = past_due]
    AE --> AF[Enviar Email: Falha no Pagamento]
    AF --> AG[Criar notificacao in-app]

    G -->|payment_method.attached| AH[Metodo Anexado]
    AH --> AI[Salvar payment_method_id]

    G -->|payment_method.detached| AJ[Metodo Removido]
    AJ --> AK[Remover payment_method_id]

    K --> AL[Retornar 200 OK]
    O --> AL
    U --> AL
    T --> AL
    Y --> AL
    AC --> AL
    AG --> AL
    AI --> AL
    AK --> AL
```

---

## 21. FLUXO DE USAGE TRACKING (SUBSCRIPTION LIMITS) (NOVO)

```mermaid
flowchart TD
    A[Usuario realiza acao] --> B{Tipo de Acao?}

    B -->|Criar Produto| C[API /api/products]
    B -->|Criar Lead| D[API /api/leads]
    B -->|Enviar Email| E[API /api/marketing/send]
    B -->|Nova Conversa| F[API /api/chat]

    C --> G[Verificar Limite]
    D --> G
    E --> G
    F --> G

    G --> H[API /api/subscriptions/current]
    H --> I[Carregar limits do plano]

    I --> J{plan_limits?}
    J -->|Nao encontrado| K[Usar Free Plan Limits]
    J -->|Encontrado| L[Usar limits do plano]

    K --> M[Calcular Usage Atual]
    L --> M

    M --> N[Query usage_tracking]
    N --> O[Filtrar por current_period]
    O --> P[SUM(quantity) GROUP BY metric]

    P --> Q{metric: products}
    Q --> R[usage.products vs limits.max_products]

    R --> S{usage < limit?}
    S -->|Nao| T[Mostrar Modal: Limite Atingido]
    T --> U[CTA: Fazer Upgrade de Plano]
    U --> V[Redirect /app/checkout]

    S -->|Sim| W[Permitir Acao]
    W --> X[Executar Acao: Criar Produto]
    X --> Y[Inserir em products]

    Y --> Z[Registrar Usage]
    Z --> AA[INSERT usage_tracking]
    AA --> AB[user_id, metric: products, quantity: +1]
    AB --> AC[period_start, period_end]

    AC --> AD{usage >= 90% do limite?}
    AD -->|Sim| AE[Enviar Warning Email]
    AE --> AF[Notificacao in-app]
    AF --> AG[Badge vermelho no dashboard]

    AD -->|Nao| AH{usage >= 70%?}
    AH -->|Sim| AI[Badge amarelo]
    AH -->|Nao| AJ[Badge verde]

    AG --> AK[Retornar Sucesso]
    AI --> AK
    AJ --> AK
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
| Campanha Enviada -> Email Aberto | 20-30% |
| Email Aberto -> Click | 10-15% |
| Email Click -> Conversao | 5-10% |
| Subscription Checkout -> Pagamento | 65-75% |
| Free Trial -> Assinatura Paga | 40-50% |
| Usage 90% -> Upgrade | 30-40% |

---

## CHANGELOG

| Versao | Data | Mudancas |
|--------|------|----------|
| 3.0 | 2024-12-31 | Adicao de 6 novos fluxos: Marketing Campaigns, Analytics, Stripe Checkout, Subscription Management, Webhooks, Usage Tracking |
| 2.0 | 2024-12-23 | Adicao de fluxos: Qualificacao, Documentos, Follow-up, Urgencia, Dashboard Executivo |
| 1.0 | 2024-11-19 | Versao inicial |
