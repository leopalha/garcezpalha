# Sistema de Automação de Follow-ups G4

Sistema completo de follow-up automatizado baseado em categoria de leads, com envio via WhatsApp e notificações para equipe.

## 📋 Visão Geral

O sistema de follow-up automatiza o contato com leads qualificados baseado em:
- **Categoria do lead** (hot, warm, cold, very-cold)
- **Cronograma específico** por categoria
- **Mensagens personalizadas** por tentativa
- **Status do lead** (new, contacted, in-progress, converted, lost)

## ⏰ Cronogramas de Follow-up

### 🔥 Leads Quentes (Hot - Score 75-100)
**Objetivo**: Conversão rápida

| Tentativa | Delay | Quando |
|-----------|-------|--------|
| 1 | 2 horas | 2h após qualificação |
| 2 | 6 horas | 6h após qualificação |
| 3 | 1 dia | 24h após qualificação |
| 4 | 3 dias | 3 dias após qualificação |
| 5 | 7 dias | 7 dias após qualificação |

### ☀️ Leads Mornos (Warm - Score 50-74)
**Objetivo**: Nurturing ativo

| Tentativa | Delay | Quando |
|-----------|-------|--------|
| 1 | 1 dia | 24h após qualificação |
| 2 | 3 dias | 3 dias após qualificação |
| 3 | 7 dias | 7 dias após qualificação |
| 4 | 14 dias | 14 dias após qualificação |

### ❄️ Leads Frios (Cold - Score 25-49)
**Objetivo**: Nurturing passivo

| Tentativa | Delay | Quando |
|-----------|-------|--------|
| 1 | 7 dias | 7 dias após qualificação |
| 2 | 14 dias | 14 dias após qualificação |
| 3 | 30 dias | 30 dias após qualificação |

### 🧊 Leads Muito Frios (Very Cold - Score 0-24)
**Objetivo**: Manter contato mínimo

| Tentativa | Delay | Quando |
|-----------|-------|--------|
| 1 | 30 dias | 30 dias após qualificação |
| 2 | 60 dias | 60 dias após qualificação |

## 📨 Mensagens Personalizadas

Cada categoria tem mensagens específicas para cada tentativa:

### Exemplo - Lead Quente, Tentativa 1
```
Olá Maria! 👋

Vi que você se interessou por Defesa Criminal. Como está sua situação? Gostaria de conversar com um de nossos especialistas?

Estamos prontos para te ajudar! 🔥
```

### Exemplo - Lead Morno, Tentativa 2
```
João! 📋

Já teve tempo de pensar sobre Usucapião? Estou aqui para esclarecer qualquer dúvida que você tenha.

Podemos conversar?
```

## 🚀 Como Funciona

### 1. Lead Qualificado
Quando um lead completa a qualificação via WhatsApp:

```typescript
// Automaticamente:
1. Lead é salvo no banco (qualified_leads)
2. Score é calculado (urgency, probability, complexity)
3. Categoria é definida (hot, warm, cold, very-cold)
4. Follow-ups são agendados (follow_up_tasks)
```

### 2. Processamento Automático
Via cron job (rodando a cada hora):

```typescript
// API: POST /api/admin/follow-ups/process
1. Busca tasks pendentes com scheduled_for <= NOW()
2. Verifica se lead ainda está elegível
3. Gera mensagem personalizada
4. Envia via WhatsApp (ou cria notificação)
5. Atualiza status da task (sent/failed/cancelled)
```

### 3. Cancelamento Inteligente
Follow-ups são cancelados quando:
- Lead é convertido (status = 'converted')
- Lead é perdido (status = 'lost')
- Lead foi manualmente arquivado

## 💻 Implementação

### Agendar Follow-ups ao Criar Lead

```typescript
import { scheduleFollowUps } from '@/lib/automation/follow-up-automation'

// Após salvar o lead
const lead = await saveQualifiedLead(data)

// Agendar follow-ups
await scheduleFollowUps(lead.id, lead.category)
```

### Processar Follow-ups Pendentes (Cron Job)

```typescript
import { processPendingFollowUps } from '@/lib/automation/follow-up-automation'

// Rodar a cada hora
export async function cronHandler() {
  await processPendingFollowUps()
}
```

### Follow-up Manual

```typescript
import { triggerManualFollowUp } from '@/lib/automation/follow-up-automation'

// Enviar mensagem customizada
const result = await triggerManualFollowUp(leadId, 'Olá! Como posso ajudar?')
```

## 🔧 Configuração do Cron Job

### Vercel Cron (Recomendado)

1. Adicionar em `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/admin/follow-ups/process",
      "schedule": "0 * * * *"
    }
  ]
}
```

2. Configurar variável de ambiente:
```bash
CRON_API_KEY=your-secret-key
```

3. Headers na requisição:
```bash
curl -X POST https://yourdomain.com/api/admin/follow-ups/process \
  -H "x-api-key: your-secret-key"
```

### GitHub Actions

```yaml
name: Process Follow-ups
on:
  schedule:
    - cron: '0 * * * *'  # A cada hora

jobs:
  process:
    runs-on: ubuntu-latest
    steps:
      - name: Call Follow-up API
        run: |
          curl -X POST ${{ secrets.API_URL }}/api/admin/follow-ups/process \
            -H "x-api-key: ${{ secrets.CRON_API_KEY }}"
```

## 📊 Monitoramento

### Analytics de Follow-ups

```sql
SELECT
  category,
  status,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE status = 'sent') as sent,
  COUNT(*) FILTER (WHERE status = 'failed') as failed,
  AVG(EXTRACT(EPOCH FROM (sent_at - scheduled_for))) as avg_delay
FROM follow_up_tasks
GROUP BY category, status;
```

### Leads Sem Resposta

```sql
SELECT
  l.*,
  COUNT(f.id) as follow_ups_sent
FROM qualified_leads l
LEFT JOIN follow_up_tasks f ON f.lead_id = l.id AND f.status = 'sent'
WHERE l.status = 'new'
  AND l.created_at < NOW() - INTERVAL '7 days'
GROUP BY l.id
HAVING COUNT(f.id) >= 3;
```

## 🎯 Melhores Práticas

1. **Respeitar Horários**
   - Não enviar antes das 8h ou depois das 20h
   - Considerar fusos horários

2. **Personalização**
   - Usar nome do cliente quando disponível
   - Mencionar produto específico
   - Adaptar tom à categoria

3. **Monitoramento**
   - Verificar taxa de resposta por categoria
   - Ajustar cronogramas baseado em dados
   - Identificar horários com melhor engajamento

4. **Cancelamento**
   - Cancelar follow-ups quando lead responder
   - Não insistir após muitas tentativas sem resposta
   - Marcar leads inativos para limpeza

## 🔄 Fluxo Completo

```
Lead Qualificado (WhatsApp)
    ↓
Salvo no Banco (qualified_leads)
    ↓
Score Calculado (urgency, probability, complexity)
    ↓
Categoria Definida (hot, warm, cold, very-cold)
    ↓
Follow-ups Agendados (follow_up_tasks)
    ↓
Cron Job (a cada hora)
    ↓
Tasks Pendentes Processadas
    ↓
    ├─→ Lead Convertido? → Cancelar follow-ups
    ├─→ Lead Perdido? → Cancelar follow-ups
    └─→ Lead Ativo? → Enviar mensagem
         ↓
         ├─→ WhatsApp: Enviar via API
         └─→ Outro: Criar notificação
              ↓
         Atualizar Status (sent/failed)
              ↓
         Próximo Follow-up Agendado
```

## 📈 Métricas de Sucesso

### KPIs Principais
- **Taxa de Resposta**: % de leads que respondem após follow-up
- **Taxa de Conversão por Categoria**: Conversões / Total de leads
- **Tempo Médio de Conversão**: Tempo entre qualificação e conversão
- **Tentativas até Conversão**: Média de follow-ups antes de converter

### Metas Sugeridas
| Categoria | Taxa de Resposta | Taxa de Conversão | Tempo Médio |
|-----------|------------------|-------------------|-------------|
| Hot | > 50% | > 30% | < 7 dias |
| Warm | > 30% | > 15% | < 14 dias |
| Cold | > 15% | > 5% | < 30 dias |
| Very Cold | > 5% | > 2% | < 60 dias |

## 🛠️ Troubleshooting

### Follow-ups Não Estão Sendo Enviados
1. Verificar se cron job está rodando
2. Checar logs do API em `/api/admin/follow-ups/process`
3. Confirmar que `scheduled_for` está no passado
4. Verificar se lead está com status válido

### Mensagens Duplicadas
1. Verificar se cron não está rodando em múltiplos servidores
2. Confirmar que tasks são marcadas como 'sent' imediatamente
3. Checar locks no banco de dados

### Taxa de Falha Alta
1. Validar credenciais do WhatsApp Cloud API
2. Verificar se números de telefone estão no formato correto
3. Checar rate limits da API
4. Analisar logs de erro nas tasks

---

**Versão**: 1.0.0
**Última atualização**: Dezembro 2024
**Desenvolvido por**: Garcez Palha - 364 anos de tradição
