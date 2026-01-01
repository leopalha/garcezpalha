# 08 - MODELO DE NEGOCIO

Modelo de negocios da plataforma Garcez Palha.

---

## 1. PROPOSTA DE VALOR

### 1.1 Para Clientes

- **Atendimento 24/7** via chatbot IA especializado
- **Tradicao de 364 anos** com tecnologia moderna
- **Transparencia** em valores de referencia
- **Multicanal** - Site, WhatsApp, Telegram
- **Acompanhamento digital** de processos

### 1.2 Para Parceiros

- **Comissoes atrativas** (10-40% por tier)
- **Tracking em tempo real** de indicacoes
- **Materiais de marketing** prontos
- **Validacao OAB/CNPJ** para credibilidade
- **Pagamentos automaticos**

---

## 2. FONTES DE RECEITA

### 2.1 Servicos Juridicos

| Servico | Valor Referencia | Margem |
|---------|------------------|--------|
| Consultoria Imobiliaria | R$ 1.500 | 60% |
| Pericia Documental | R$ 2.000 | 70% |
| Avaliacao de Imovel | R$ 1.200 | 65% |
| Pericia Medica | R$ 2.500 | 65% |
| Consultoria Criminal | R$ 1.800 | 60% |
| Secretaria Remota | R$ 800/mes | 50% |

### 2.2 Receita Recorrente

- Secretaria Remota: R$ 800/mes por cliente
- Acompanhamento processual: R$ 500/mes
- Retainer mensal: R$ 2.000+/mes

### 2.3 Projecao

| Cenario | Clientes/mes | Receita Mensal |
|---------|--------------|----------------|
| Conservador | 5 | R$ 10.000 |
| Moderado | 15 | R$ 30.000 |
| Otimista | 30 | R$ 60.000 |

---

## 3. ESTRUTURA DE CUSTOS

### 3.1 Custos Fixos Mensais

| Item | Custo |
|------|-------|
| OpenRouter (GPT-4) | R$ 200 |
| Supabase Pro | R$ 100 |
| Vercel Pro | R$ 100 |
| ClickSign | R$ 79 |
| Google Workspace | R$ 30 |
| **TOTAL** | **R$ 509/mes** |

### 3.2 Custos Variaveis

| Item | Custo |
|------|-------|
| Stripe | 2.9% + R$ 0,30 por transacao |
| MercadoPago | 1.99% PIX |
| WhatsApp | R$ 0,05/conversa (apos 1k) |
| Comissoes parceiros | 10-40% |

### 3.3 Ponto de Equilibrio

```
Custos fixos: R$ 509/mes
Ticket medio: R$ 2.000
Margem media: 60%
Margem contribuicao: R$ 1.200

Breakeven = R$ 509 / R$ 1.200 = 0.42 clientes/mes

Com 1 cliente/mes ja temos lucro!
```

---

## 4. CANAIS DE AQUISICAO

### 4.1 Organico

- SEO (blog juridico)
- Redes sociais
- Boca a boca
- Reputacao 364 anos

### 4.2 Pago

- Google Ads (keywords juridicas)
- Facebook/Instagram Ads
- LinkedIn Ads

### 4.3 Parceiros

- Advogados parceiros
- Corretores de imoveis
- Contadores
- Empresas de RH

### 4.4 CAC por Canal

| Canal | CAC Estimado |
|-------|--------------|
| Organico | R$ 50 |
| Google Ads | R$ 200 |
| Parceiros | R$ 100 (comissao) |
| Social | R$ 150 |

---

## 5. SISTEMA DE PARCEIROS

### 5.1 Tiers de Comissao

| Tier | Indicacoes/mes | Comissao |
|------|----------------|----------|
| Bronze | 1-5 | 10% |
| Prata | 6-15 | 20% |
| Ouro | 16-30 | 30% |
| Diamante | 31+ | 40% |

### 5.2 Requisitos

- OAB ou CNPJ valido
- Verificacao de documentos
- Conta bancaria para recebimento
- Aceite dos termos

### 5.3 Materiais

- Banners digitais
- Posts prontos
- Link personalizado
- Dashboard de metricas

---

## 6. METRICAS CHAVE

### 6.1 KPIs de Vendas

- **CAC**: Custo de Aquisicao de Cliente
- **LTV**: Lifetime Value
- **LTV:CAC Ratio**: Meta > 3:1
- **Churn Rate**: Meta < 10%
- **MRR**: Monthly Recurring Revenue

### 6.2 KPIs Operacionais

- **Taxa de conversao**: Lead -> Cliente (meta 15%)
- **Tempo de resposta**: Chat (meta < 3s)
- **NPS**: Net Promoter Score (meta > 50)
- **CSAT**: Customer Satisfaction (meta > 4.5)

### 6.3 Formulas

```
LTV = (Ticket Medio x Frequencia x Tempo de Vida)
CAC = (Custo Marketing + Vendas) / Novos Clientes
LTV:CAC = LTV / CAC

Exemplo:
LTV = R$ 2.000 x 2 x 3 = R$ 12.000
CAC = R$ 1.200
LTV:CAC = 10:1 (excelente!)
```

---

## 7. DIFERENCIAIS COMPETITIVOS

### 7.1 Tradicao

- 364 anos de historia familiar
- Reputacao consolidada
- Conhecimento geracional

### 7.2 Tecnologia

- IA especializada em direito
- 5 agentes para diferentes areas
- Atendimento 24/7 automatizado

### 7.3 Compliance

- 100% OAB compliant
- Disclaimers automaticos
- Validacao de parceiros

### 7.4 Integracao

- Multi-canal (Site, WhatsApp, Telegram)
- Assinatura digital
- Pagamento online

---

## 8. RISCOS E MITIGACOES

| Risco | Probabilidade | Impacto | Mitigacao |
|-------|---------------|---------|-----------|
| Violacao OAB | Baixa | Critico | Disclaimers automaticos |
| Concorrencia | Media | Alto | Diferenciacao por tradicao |
| Dependencia tech | Media | Medio | Multi-provider (OpenRouter) |
| Churn | Media | Alto | Nurturing + follow-up |

---

## 9. ROADMAP DE CRESCIMENTO

### Fase 1: Validacao (Atual)
- MVP funcional
- Primeiros clientes
- Ajuste de pricing

### Fase 2: Tracao (Q1 2025)
- 50 clientes ativos
- MRR R$ 20.000
- 10 parceiros ativos

### Fase 3: Escala (Q2 2025)
- 200 clientes ativos
- MRR R$ 80.000
- 50 parceiros
- Equipe de 3 pessoas

### Fase 4: Expansao (Q3-Q4 2025)
- Novos servicos
- White-label para outros escritorios
- App mobile

---

## 10. UNIT ECONOMICS

### 10.1 Por Cliente (Consultoria Imobiliaria)

```
Receita: R$ 1.500
(-) Comissao parceiro (20%): -R$ 300
(-) Gateway pagamento (3%): -R$ 45
(-) Custo AI (~R$ 2/consulta): -R$ 10
= Margem Bruta: R$ 1.145 (76%)

(-) Custo fixo rateado: -R$ 50
= Margem Liquida: R$ 1.095 (73%)
```

### 10.2 Por Parceiro

```
Indicacoes medias: 5/mes
Ticket medio: R$ 2.000
Conversao: 30%

Receita gerada: 5 x R$ 2.000 x 30% = R$ 3.000
Comissao paga: R$ 600 (20%)
Lucro liquido: R$ 2.400/mes por parceiro ativo
```

### 10.3 Break-even por Servico

| Servico | Margem | Break-even (mes) |
|---------|--------|------------------|
| Consultoria | 73% | < 1 cliente |
| Pericia | 78% | < 1 cliente |
| Secretaria | 50% | 1 cliente |
