# PLANO DE IMPLEMENTAÇÃO: SECRETÁRIA JURÍDICA IA ENGINE

**Data:** 30/12/2024
**Versão:** 1.0
**Status:** Planejamento
**Produto:** Garcez Palha Engine - Secretária Jurídica IA
**Modelo:** B2B2C White-Label

---

## 📋 SUMÁRIO EXECUTIVO

Este documento detalha a implementação do **produto PRINCIPAL** da plataforma: uma **Secretária Jurídica IA** que trabalha 24/7 para advogados parceiros.

### O Produto

**Garcez Palha Engine** = Secretária Jurídica IA white-label que:

1. ✅ **Captura leads** no site do advogado 24/7
2. ✅ **Qualifica casos** juridicamente (103 perguntas especializadas)
3. ✅ **Agenda consultas** automaticamente
4. ✅ **Gera propostas** personalizadas com valores
5. ✅ **Gerencia processos** e prazos
6. ✅ **White-label completo** (logo, cores, domínio do parceiro)

### Diferencial Competitivo

| Feature | Garcez Palha Engine | Chatbot Genérico | Ulio.ai |
|---------|---------------------|------------------|---------|
| Chat IA Especializado | ✅ 9 áreas jurídicas | ❌ Genérico | ⚠️ Telefone apenas |
| Qualificação Jurídica | ✅ 103 perguntas | ❌ Básico | ❌ Não tem |
| Agendamento | ✅ Automático | ⚠️ Manual | ✅ Automático |
| Proposta com Valores | ✅ Sim | ❌ Não | ❌ Não |
| Gestão de Processos | ✅ Completo | ❌ Não | ❌ Não |
| Documentos Legais | ✅ 9 templates | ❌ Não | ❌ Não |
| White-Label | ✅ Completo | ⚠️ Limitado | ✅ Completo |
| **Preço** | **R$ 497/mês** | R$ 200-800/mês | R$ 1.500/mês |

**Posicionamento:** Mais completo que chatbots, mais barato que Ulio.ai, especializado em direito.

---

## 🎯 ESTRUTURA DE PRODUTOS

### **PLANO STARTER** - R$ 497/mês (Secretária Jurídica IA)

**Público:** Advogados solo e escritórios pequenos (1-2 advogados)

**Inclui:**
- ✅ Chat IA jurídico 24/7 (9 áreas do direito)
- ✅ Qualificação automática de casos (103 perguntas)
- ✅ Agendamento de consultas (Google Calendar integrado)
- ✅ Geração de propostas personalizadas
- ✅ Dashboard com métricas em tempo real
- ✅ White-label: logo + cores + subdomínio
- ✅ 100 conversas qualificadas/mês
- ✅ 1 usuário
- ✅ Suporte via email
- ✅ 30 dias grátis

**Foco:** Captura e qualificação de leads

---

### **PLANO PRO** - R$ 997/mês (Secretária + Marketing)

**Público:** Escritórios médios (3-5 advogados) que querem crescer

**Tudo do Starter +**
- ✅ **Marketing Automation:**
  - Criação de conteúdo (Instagram, LinkedIn, Blog)
  - Calendário de conteúdo mensal
  - Otimização de anúncios Google Ads
  - Análise de performance
- ✅ 500 conversas qualificadas/mês
- ✅ 5 usuários
- ✅ Domínio customizado (.com.br próprio)
- ✅ Integração WhatsApp Business
- ✅ Notificações Telegram
- ✅ Relatórios semanais
- ✅ Suporte prioritário (WhatsApp)

**Foco:** Captura + qualificação + geração de demanda

---

### **PLANO ENTERPRISE** - R$ 1.997/mês (Customizado)

**Público:** Escritórios grandes (6+ advogados) ou redes

**Tudo do Pro +**
- ✅ Conversas ilimitadas
- ✅ Usuários ilimitados
- ✅ API para integrações customizadas
- ✅ White-label 100% (sem marca Garcez Palha)
- ✅ Treinamento de IA com casos do escritório
- ✅ Customização de workflows
- ✅ Onboarding assistido (call + setup)
- ✅ Suporte dedicado (WhatsApp + call mensal)
- ✅ SLA de uptime 99.9%

**Foco:** Solução enterprise completa

---

## 🏗️ ARQUITETURA DO PRODUTO

### Fluxo do Cliente Final (Pessoa com problema jurídico)

```
1️⃣ DESCOBERTA
   ↓
   Cliente pesquisa "advogado trabalhista são paulo" no Google
   ↓
   Clica no site do advogado parceiro (silva-advocacia.com.br)

2️⃣ CAPTURA
   ↓
   Landing page com chat IA aparece
   "Olá! Sou a assistente do Dr. Silva. Como posso ajudar?"
   ↓
   Cliente: "Fui demitido sem justa causa, tenho direito?"

3️⃣ QUALIFICAÇÃO
   ↓
   Chat IA (Agente Trabalhista) faz 103 perguntas:
   - Tempo de empresa?
   - Tipo de demissão?
   - Aviso prévio pago?
   - FGTS sacado?
   - Valores recebidos?
   ↓
   Sistema calcula:
   - Urgência: 8/10 (demissão recente)
   - Probabilidade de ganho: 85%
   - Valor estimado causa: R$ 15.000
   - Score final: 82/100 (HOT LEAD)

4️⃣ AGENDAMENTO
   ↓
   "Pelo que você me contou, o Dr. Silva pode te ajudar!"
   "Escolha um horário para consulta:"
   [Calendário com horários disponíveis]
   ↓
   Cliente escolhe: Amanhã 14h
   ↓
   Sistema envia:
   - Confirmação por email
   - Lembrete WhatsApp (2h antes)
   - Adiciona no Google Calendar do advogado

5️⃣ PROPOSTA
   ↓
   Após consulta presencial/online:
   ↓
   Advogado clica "Gerar Proposta"
   ↓
   Sistema cria proposta automática:
   - Análise do caso
   - Chances de sucesso
   - Honorários: R$ 3.000 (30% êxito) ou R$ 5.000 (fixo)
   - Prazo estimado: 12-18 meses
   - Link de pagamento (Stripe)

6️⃣ CONVERSÃO
   ↓
   Cliente aceita proposta
   ↓
   Paga entrada via link
   ↓
   Vira CLIENTE no sistema
   ↓
   Processo acompanhado no dashboard
```

### Fluxo do Advogado Parceiro

```
1️⃣ ONBOARDING (60 segundos)
   ↓
   Acessa: garcezpalha.com.br/parceiros
   ↓
   Clica "Começar Agora - 30 Dias Grátis"
   ↓
   Preenche:
   - Nome, Email, Telefone (10s)
   - Nome do escritório (5s)
   - Escolhe subdomínio: silva-advocacia (15s)
   - Escolhe cor principal (10s)
   - Upload logo (20s)
   ↓
   Sistema cria:
   - Conta no Supabase Auth
   - Tenant no banco (RLS ativado)
   - Subdomínio: silva-advocacia.garcezpalha.com.br
   - Landing page personalizada
   ↓
   Redireciona para: Dashboard do parceiro

2️⃣ CONFIGURAÇÃO (5 minutos)
   ↓
   Dashboard mostra:
   - "Bem-vindo, Dr. Silva!"
   - "Seu site: silva-advocacia.garcezpalha.com.br"
   - "Personalize sua mensagem de boas-vindas"
   ↓
   Advogado edita:
   - Mensagem do chat: "Olá! Sou assistente do Dr. Silva..."
   - Áreas de atuação: [Trabalhista, Civil, Consumidor]
   - Horários de atendimento: Seg-Sex 9h-18h
   - Integra Google Calendar (OAuth)
   - Configura valores médios por tipo de caso
   ↓
   Sistema atualiza tenant config

3️⃣ DIVULGAÇÃO (contínuo)
   ↓
   Advogado compartilha link:
   - Instagram bio
   - Facebook page
   - Google Meu Negócio
   - Email signature
   - Anúncios Google Ads (opcional)

4️⃣ ATENDIMENTO (diário)
   ↓
   Dashboard mostra:
   - 5 NOVOS LEADS (3 HOT, 1 WARM, 1 COLD)
   ↓
   Advogado prioriza HOT leads:
   - Lead #1: Score 92 - Demissão sem justa causa
     → Consulta agendada: Hoje 15h
     → Ligar agora para confirmar
   ↓
   Após consulta:
   - Clica "Gerar Proposta"
   - Sistema cria proposta
   - Envia para cliente
   - Acompanha conversão

5️⃣ GESTÃO (semanal)
   ↓
   Dashboard mostra:
   - 42 conversas neste mês
   - 18 leads qualificados (HOT: 8, WARM: 6, COLD: 4)
   - 5 consultas agendadas
   - 3 propostas enviadas
   - 2 clientes novos (conversão 40%)
   - Receita gerada: R$ 12.000
   ↓
   ROI: Paga R$ 497, fatura R$ 12.000 = 24x
```

---

## 🗄️ SCHEMA DE BANCO DE DADOS

### Tabelas Já Existentes (Não Mexer)

```sql
-- Sistema jurídico completo já funciona
✅ leads (com tenant_id)
✅ clientes (com tenant_id)
✅ processos (com tenant_id)
✅ agendamentos (com tenant_id)
✅ propostas (com tenant_id)
✅ chat_messages (com tenant_id)
✅ documentos (com tenant_id)
✅ perguntas_qualificacao (103 perguntas por área)
```

### Novas Tabelas Necessárias

```sql
-- =============================================================================
-- PLANOS E ASSINATURAS
-- =============================================================================

CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL, -- 'starter', 'pro', 'enterprise'
  display_name TEXT NOT NULL, -- 'Plano Starter', 'Plano Pro', etc
  description TEXT NOT NULL,
  price_monthly DECIMAL(10, 2) NOT NULL, -- 497.00, 997.00, 1997.00

  -- Limites do plano
  max_conversations_per_month INTEGER NOT NULL, -- 100, 500, -1 (ilimitado)
  max_users INTEGER NOT NULL, -- 1, 5, -1 (ilimitado)

  -- Features
  features JSONB NOT NULL DEFAULT '{
    "chat_ai": true,
    "qualification": true,
    "scheduling": true,
    "proposals": true,
    "whitelabel_subdomain": true,
    "whitelabel_domain": false,
    "marketing_automation": false,
    "whatsapp_integration": false,
    "telegram_notifications": false,
    "api_access": false,
    "priority_support": false,
    "custom_training": false
  }',

  -- Status
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed plans
INSERT INTO plans (name, display_name, description, price_monthly, max_conversations_per_month, max_users, features) VALUES
(
  'starter',
  'Plano Starter',
  'Secretária Jurídica IA completa para advogados solo',
  497.00,
  100,
  1,
  '{
    "chat_ai": true,
    "qualification": true,
    "scheduling": true,
    "proposals": true,
    "whitelabel_subdomain": true,
    "whitelabel_domain": false,
    "marketing_automation": false,
    "whatsapp_integration": false,
    "telegram_notifications": false,
    "api_access": false,
    "priority_support": false,
    "custom_training": false
  }'
),
(
  'pro',
  'Plano Pro',
  'Secretária + Marketing Automation para crescer',
  997.00,
  500,
  5,
  '{
    "chat_ai": true,
    "qualification": true,
    "scheduling": true,
    "proposals": true,
    "whitelabel_subdomain": true,
    "whitelabel_domain": true,
    "marketing_automation": true,
    "whatsapp_integration": true,
    "telegram_notifications": true,
    "api_access": false,
    "priority_support": true,
    "custom_training": false
  }'
),
(
  'enterprise',
  'Plano Enterprise',
  'Solução enterprise completa e customizada',
  1997.00,
  -1,
  -1,
  '{
    "chat_ai": true,
    "qualification": true,
    "scheduling": true,
    "proposals": true,
    "whitelabel_subdomain": true,
    "whitelabel_domain": true,
    "marketing_automation": true,
    "whatsapp_integration": true,
    "telegram_notifications": true,
    "api_access": true,
    "priority_support": true,
    "custom_training": true
  }'
);

-- =============================================================================
-- ATUALIZAR TABELA TENANTS
-- =============================================================================

ALTER TABLE tenants ADD COLUMN plan_id UUID REFERENCES plans(id);
ALTER TABLE tenants ADD COLUMN plan_name TEXT DEFAULT 'starter';

-- Adicionar colunas de uso mensal
ALTER TABLE tenants ADD COLUMN current_month_conversations INTEGER DEFAULT 0;
ALTER TABLE tenants ADD COLUMN current_month_starts_at DATE DEFAULT CURRENT_DATE;

-- Função para resetar contadores mensais
CREATE OR REPLACE FUNCTION reset_monthly_usage()
RETURNS void AS $$
BEGIN
  UPDATE tenants
  SET
    current_month_conversations = 0,
    current_month_starts_at = CURRENT_DATE
  WHERE current_month_starts_at < DATE_TRUNC('month', CURRENT_DATE);
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- TRACKING DE CONVERSAS
-- =============================================================================

CREATE TABLE conversation_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

  -- Dados do visitante
  visitor_id TEXT NOT NULL, -- UUID gerado no frontend
  visitor_name TEXT,
  visitor_email TEXT,
  visitor_phone TEXT,

  -- Conversa
  area_juridica TEXT, -- 'trabalhista', 'civil', etc
  messages_count INTEGER DEFAULT 0,
  qualification_completed BOOLEAN DEFAULT false,
  qualification_score INTEGER, -- 0-100
  qualification_tier TEXT, -- 'hot', 'warm', 'cold'

  -- Resultado
  lead_created BOOLEAN DEFAULT false,
  lead_id UUID REFERENCES leads(id),
  appointment_scheduled BOOLEAN DEFAULT false,
  appointment_id UUID REFERENCES agendamentos(id),

  -- Timestamps
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_message_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  duration INTEGER, -- Segundos

  -- Metadata
  source TEXT, -- 'website', 'whatsapp', 'facebook'
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,

  CONSTRAINT fk_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

CREATE INDEX idx_conversation_sessions_tenant_id ON conversation_sessions(tenant_id);
CREATE INDEX idx_conversation_sessions_started_at ON conversation_sessions(started_at DESC);
CREATE INDEX idx_conversation_sessions_lead_id ON conversation_sessions(lead_id);

-- Trigger para incrementar contador de conversas do tenant
CREATE OR REPLACE FUNCTION increment_tenant_conversations()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.qualification_completed = true AND OLD.qualification_completed = false THEN
    UPDATE tenants
    SET current_month_conversations = current_month_conversations + 1
    WHERE id = NEW.tenant_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_increment_conversations
AFTER UPDATE ON conversation_sessions
FOR EACH ROW
EXECUTE FUNCTION increment_tenant_conversations();

-- =============================================================================
-- RLS POLICIES
-- =============================================================================

ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_sessions ENABLE ROW LEVEL SECURITY;

-- Todos podem ver planos
CREATE POLICY "Plans are publicly readable"
ON plans FOR SELECT
USING (true);

-- Tenant só vê suas próprias conversas
CREATE POLICY "Users can view their tenant conversations"
ON conversation_sessions FOR SELECT
USING (
  tenant_id IN (
    SELECT tenant_id FROM tenant_members
    WHERE user_id = auth.uid() AND status = 'active'
  )
);

CREATE POLICY "System can manage conversations"
ON conversation_sessions FOR ALL
USING (true); -- Controlado via service role
```

---

## 🔧 IMPLEMENTAÇÃO PASSO A PASSO

### FASE 1: Chat Widget Embeddable (3 dias)

**Objetivo:** Widget de chat que advogado pode colocar no site dele

#### 1.1 Create Chat Widget Component

**Arquivo:** `src/components/tenant/ChatWidget.tsx`

```typescript
'use client'

import { useState, useEffect, useRef } from 'react'
import { useTenantBranding } from './TenantBrandingProvider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MessageCircle, X, Send } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatWidgetProps {
  tenantId: string
  sessionId?: string
}

export function ChatWidget({ tenantId, sessionId: initialSessionId }: ChatWidgetProps) {
  const branding = useTenantBranding()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState(initialSessionId || '')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Inicializar sessão
  useEffect(() => {
    if (!sessionId) {
      const newSessionId = `visitor_${Date.now()}_${Math.random().toString(36).slice(2)}`
      setSessionId(newSessionId)
      localStorage.setItem('chat_session_id', newSessionId)
    }
  }, [sessionId])

  // Mensagem inicial
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: branding.welcome_message || 'Olá! Como posso ajudar com sua questão jurídica?',
          timestamp: new Date(),
        },
      ])
    }
  }, [isOpen, messages.length, branding.welcome_message])

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId,
          sessionId,
          message: input,
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      })

      const data = await res.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Se completou qualificação, mostrar score
      if (data.qualificationCompleted) {
        const scoreMessage: Message = {
          id: (Date.now() + 2).toString(),
          role: 'assistant',
          content: `✅ Qualificação concluída!\n\nScore: ${data.score}/100 (${data.tier.toUpperCase()})\n\nUm de nossos advogados entrará em contato em breve. Gostaria de agendar uma consulta agora?`,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, scoreMessage])
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Botão flutuante */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 z-50"
          style={{ backgroundColor: branding.primary_color }}
        >
          <MessageCircle className="w-8 h-8 text-white" />
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div
          className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col z-50"
          style={{ borderTop: `4px solid ${branding.primary_color}` }}
        >
          {/* Header */}
          <div
            className="p-4 text-white rounded-t-lg flex items-center justify-between"
            style={{ backgroundColor: branding.primary_color }}
          >
            <div className="flex items-center gap-3">
              {branding.logo_url ? (
                <img src={branding.logo_url} alt={branding.name} className="h-8" />
              ) : (
                <MessageCircle className="w-6 h-6" />
              )}
              <div>
                <h3 className="font-semibold">{branding.name}</h3>
                <p className="text-xs opacity-90">Online agora</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                  style={
                    message.role === 'user'
                      ? { backgroundColor: branding.primary_color }
                      : {}
                  }
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Digite sua mensagem..."
                disabled={loading}
              />
              <Button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                style={{ backgroundColor: branding.primary_color }}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
```

**Arquivo:** `src/app/api/chat/message/route.ts`

```typescript
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { routeMessage } from '@/lib/ai/router/message-router'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const body = await request.json()
  const supabase = createRouteHandlerClient({ cookies })

  const { tenantId, sessionId, message, messages } = body

  try {
    // 1. Buscar ou criar session
    let { data: session } = await supabase
      .from('conversation_sessions')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('visitor_id', sessionId)
      .single()

    if (!session) {
      const { data: newSession } = await supabase
        .from('conversation_sessions')
        .insert({
          tenant_id: tenantId,
          visitor_id: sessionId,
          messages_count: 0,
        })
        .select()
        .single()
      session = newSession
    }

    // 2. Salvar mensagem do usuário
    await supabase.from('chat_messages').insert({
      tenant_id: tenantId,
      session_id: session.id,
      role: 'user',
      content: message,
    })

    // 3. Rotear para agente apropriado
    const response = await routeMessage(message, messages, tenantId)

    // 4. Salvar resposta do assistente
    await supabase.from('chat_messages').insert({
      tenant_id: tenantId,
      session_id: session.id,
      role: 'assistant',
      content: response.content,
      agent_used: response.agent,
    })

    // 5. Atualizar session
    await supabase
      .from('conversation_sessions')
      .update({
        messages_count: session.messages_count + 2,
        last_message_at: new Date().toISOString(),
        area_juridica: response.area || session.area_juridica,
      })
      .eq('id', session.id)

    // 6. Verificar se completou qualificação
    let qualificationData = {}
    if (response.qualificationCompleted) {
      // Criar lead
      const { data: lead } = await supabase
        .from('leads')
        .insert({
          tenant_id: tenantId,
          nome: response.leadData.name,
          email: response.leadData.email,
          telefone: response.leadData.phone,
          mensagem: response.leadData.message,
          area_juridica: response.area,
          score: response.score,
          tier: response.tier,
          origem: 'chat',
        })
        .select()
        .single()

      // Atualizar session
      await supabase
        .from('conversation_sessions')
        .update({
          qualification_completed: true,
          qualification_score: response.score,
          qualification_tier: response.tier,
          lead_created: true,
          lead_id: lead.id,
        })
        .eq('id', session.id)

      // Disparar workflow new-lead
      await fetch(`${process.env.NEXT_PUBLIC_URL}/api/workflows/triggers/new-lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: lead.id,
          ...response.leadData,
        }),
      })

      qualificationData = {
        qualificationCompleted: true,
        score: response.score,
        tier: response.tier,
        leadId: lead.id,
      }
    }

    return NextResponse.json({
      response: response.content,
      agent: response.agent,
      ...qualificationData,
    })
  } catch (error) {
    console.error('Error processing message:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
```

**Validação Fase 1:**
- [ ] Chat widget renderizando no site do tenant
- [ ] Mensagens sendo salvas no banco
- [ ] Agente jurídico respondendo corretamente
- [ ] Qualificação funcionando (103 perguntas)
- [ ] Lead sendo criado ao completar qualificação
- [ ] Workflow new-lead disparando

---

### FASE 2: Landing Page do Parceiro (2 dias)

**Objetivo:** Landing page linda para cada parceiro capturar leads

**Arquivo:** `src/app/[tenant]/page.tsx` (atualizar)

```typescript
import { getTenantFromHost } from '@/lib/tenant/tenant-resolver'
import { ChatWidget } from '@/components/tenant/ChatWidget'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Check, MessageCircle, Calendar, FileText, Scale } from 'lucide-react'

export default async function TenantHomePage() {
  const headersList = headers()
  const host = headersList.get('host') || ''
  const tenant = await getTenantFromHost(host)

  if (!tenant) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {tenant.logo_url ? (
              <img src={tenant.logo_url} alt={tenant.name} className="h-12" />
            ) : (
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl"
                style={{ backgroundColor: tenant.primary_color }}
              >
                {tenant.name.charAt(0)}
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold">{tenant.name}</h1>
              <p className="text-sm text-muted-foreground">Advocacia Especializada</p>
            </div>
          </div>
          <Button
            size="lg"
            style={{ backgroundColor: tenant.primary_color }}
            onClick={() => {
              const widget = document.querySelector('[data-chat-widget]')
              if (widget) {
                ;(widget as HTMLButtonElement).click()
              }
            }}
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Falar com Advogado
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6">
            Resolvemos Seu Problema Jurídico
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            {tenant.welcome_message ||
             'Atendimento rápido e especializado. Converse agora com nosso assistente e agende uma consulta gratuita.'}
          </p>
          <Button
            size="lg"
            className="text-lg px-8 py-6"
            style={{ backgroundColor: tenant.primary_color }}
          >
            <MessageCircle className="mr-2 h-6 w-6" />
            Iniciar Conversa - É Grátis
          </Button>
        </div>
      </section>

      {/* Áreas de Atuação */}
      <section className="container mx-auto px-4 py-20 bg-white">
        <h3 className="text-3xl font-bold text-center mb-12">Áreas de Atuação</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tenant.areas_atuacao?.map((area: string) => (
            <div key={area} className="flex items-start gap-3 p-6 border rounded-lg">
              <Scale className="h-6 w-6 flex-shrink-0" style={{ color: tenant.primary_color }} />
              <div>
                <h4 className="font-semibold mb-2 capitalize">
                  Direito {area.replace('_', ' ')}
                </h4>
                <p className="text-sm text-muted-foreground">
                  Atendimento especializado com anos de experiência
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Como Funciona */}
      <section className="container mx-auto px-4 py-20">
        <h3 className="text-3xl font-bold text-center mb-12">Como Funciona</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div
              className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-2xl"
              style={{ backgroundColor: tenant.primary_color }}
            >
              1
            </div>
            <MessageCircle className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <h4 className="font-semibold mb-2">Converse com IA</h4>
            <p className="text-sm text-muted-foreground">
              Nossa assistente analisa seu caso
            </p>
          </div>

          <div className="text-center">
            <div
              className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-2xl"
              style={{ backgroundColor: tenant.primary_color }}
            >
              2
            </div>
            <Calendar className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <h4 className="font-semibold mb-2">Agende Consulta</h4>
            <p className="text-sm text-muted-foreground">
              Escolha melhor horário para você
            </p>
          </div>

          <div className="text-center">
            <div
              className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-2xl"
              style={{ backgroundColor: tenant.primary_color }}
            >
              3
            </div>
            <FileText className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <h4 className="font-semibold mb-2">Receba Proposta</h4>
            <p className="text-sm text-muted-foreground">
              Proposta clara com valores e prazos
            </p>
          </div>

          <div className="text-center">
            <div
              className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-2xl"
              style={{ backgroundColor: tenant.primary_color }}
            >
              4
            </div>
            <Check className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <h4 className="font-semibold mb-2">Resolva seu Problema</h4>
            <p className="text-sm text-muted-foreground">
              Acompanhe tudo pelo sistema
            </p>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="container mx-auto px-4 py-20">
        <div
          className="rounded-2xl p-12 text-center text-white"
          style={{ backgroundColor: tenant.primary_color }}
        >
          <h3 className="text-4xl font-bold mb-4">Pronto para Resolver?</h3>
          <p className="text-xl mb-8 opacity-90">
            Converse agora com nossa assistente. É rápido, fácil e gratuito.
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
            <MessageCircle className="mr-2 h-6 w-6" />
            Iniciar Conversa Agora
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 {tenant.name}. Todos os direitos reservados.</p>
          <p className="mt-2">
            Powered by{' '}
            <a href="https://garcezpalha.com.br" className="underline">
              Garcez Palha Engine
            </a>
          </p>
        </div>
      </footer>

      {/* Chat Widget */}
      <ChatWidget tenantId={tenant.id} />
    </div>
  )
}
```

**Validação Fase 2:**
- [ ] Landing page renderizando com branding do parceiro
- [ ] Chat widget integrado
- [ ] Responsivo (mobile + desktop)
- [ ] SEO tags configurados
- [ ] Performance > 90 (Lighthouse)

---

### FASE 3: Dashboard do Parceiro (3 dias)

**Objetivo:** Dashboard para advogado ver leads, métricas, configurar

**Arquivo:** `src/app/(partner)/dashboard/page.tsx`

```typescript
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageCircle, Users, Calendar, CheckCircle, TrendingUp } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function PartnerDashboardPage() {
  const supabase = createServerComponentClient({ cookies })

  // Pegar tenant do usuário
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: membership } = await supabase
    .from('tenant_members')
    .select('tenant_id')
    .eq('user_id', user?.id)
    .eq('status', 'active')
    .single()

  if (!membership) {
    return <div>Você não pertence a nenhum tenant</div>
  }

  const tenantId = membership.tenant_id

  // Buscar tenant
  const { data: tenant } = await supabase
    .from('tenants')
    .select('*, plans(*)')
    .eq('id', tenantId)
    .single()

  // Métricas do mês
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const { data: conversations } = await supabase
    .from('conversation_sessions')
    .select('*')
    .eq('tenant_id', tenantId)
    .gte('started_at', startOfMonth.toISOString())

  const { data: leads } = await supabase
    .from('leads')
    .select('*')
    .eq('tenant_id', tenantId)
    .gte('created_at', startOfMonth.toISOString())

  const { data: appointments } = await supabase
    .from('agendamentos')
    .select('*')
    .eq('tenant_id', tenantId)
    .gte('created_at', startOfMonth.toISOString())

  const { data: clients} = await supabase
    .from('clientes')
    .select('*')
    .eq('tenant_id', tenantId)
    .gte('created_at', startOfMonth.toISOString())

  // Cálculos
  const totalConversations = conversations?.length || 0
  const qualifiedLeads = leads?.length || 0
  const scheduledAppointments = appointments?.length || 0
  const newClients = clients?.length || 0
  const conversionRate =
    qualifiedLeads > 0 ? ((newClients / qualifiedLeads) * 100).toFixed(1) : '0.0'

  // Leads HOT
  const hotLeads = leads?.filter((l) => l.tier === 'hot') || []

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Bem-vindo, {tenant?.name}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Seu site:</p>
          <a
            href={`https://${tenant?.subdomain}`}
            target="_blank"
            rel="noopener"
            className="text-blue-600 underline"
          >
            {tenant?.subdomain}
          </a>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversas</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalConversations}</div>
            <p className="text-xs text-muted-foreground">
              {tenant?.current_month_conversations || 0} / {tenant?.plans?.max_conversations_per_month === -1 ? '∞' : tenant?.plans?.max_conversations_per_month} este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leads Qualificados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{qualifiedLeads}</div>
            <p className="text-xs text-muted-foreground">
              {hotLeads.length} HOT leads
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consultas Agendadas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scheduledAppointments}</div>
            <p className="text-xs text-muted-foreground">Este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Novos Clientes</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newClients}</div>
            <p className="text-xs text-muted-foreground">Este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate}%</div>
            <p className="text-xs text-muted-foreground">Lead → Cliente</p>
          </CardContent>
        </Card>
      </div>

      {/* Leads HOT */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>🔥 Leads HOT - Atenção Urgente</CardTitle>
        </CardHeader>
        <CardContent>
          {hotLeads.length === 0 ? (
            <p className="text-muted-foreground">Nenhum lead HOT no momento</p>
          ) : (
            <div className="space-y-4">
              {hotLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center justify-between p-4 border rounded-lg bg-red-50"
                >
                  <div>
                    <h4 className="font-semibold">{lead.nome}</h4>
                    <p className="text-sm text-muted-foreground">
                      {lead.area_juridica} • Score: {lead.score}/100
                    </p>
                    <p className="text-sm mt-1">{lead.mensagem?.slice(0, 100)}...</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                    </p>
                    <a
                      href={`/dashboard/leads/${lead.id}`}
                      className="text-sm text-blue-600 underline"
                    >
                      Ver Detalhes
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Plano Atual */}
      <Card>
        <CardHeader>
          <CardTitle>Plano Atual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">{tenant?.plans?.display_name}</h3>
              <p className="text-muted-foreground">
                R$ {tenant?.plans?.price_monthly}/mês
              </p>
            </div>
            <a href="/dashboard/assinatura" className="text-blue-600 underline">
              Gerenciar Assinatura
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

**Validação Fase 3:**
- [ ] Dashboard renderizando métricas corretas
- [ ] Leads HOT destacados
- [ ] Link para site do parceiro funcionando
- [ ] Plano atual exibido
- [ ] Responsivo

---

## 📊 CRONOGRAMA COMPLETO

| Fase | Descrição | Duração |
|------|-----------|---------|
| 1 | Chat Widget Embeddable | 3 dias |
| 2 | Landing Page do Parceiro | 2 dias |
| 3 | Dashboard do Parceiro | 3 dias |
| 4 | Onboarding Flow (do white-label doc) | 3 dias |
| 5 | Multi-tenancy (do white-label doc) | 2 dias |
| 6 | Stripe Integration | 2 dias |
| **TOTAL SECRETÁRIA JURÍDICA** | **15 dias** |

---

## 💰 PRICING CORRETO

### Plano Starter - R$ 497/mês
**Secretária Jurídica IA**
- Chat IA 24/7 (9 áreas)
- 100 conversas/mês
- Qualificação automática
- Agendamento
- Propostas
- 1 usuário
- Subdomínio

### Plano Pro - R$ 997/mês
**Secretária + Marketing**
- Tudo do Starter
- 500 conversas/mês
- **Marketing Automation:**
  - Conteúdo Instagram/LinkedIn
  - Otimização Google Ads
  - Calendário mensal
- 5 usuários
- Domínio próprio
- WhatsApp + Telegram
- Suporte prioritário

### Plano Enterprise - R$ 1.997/mês
**Solução Completa**
- Tudo do Pro
- Conversas ilimitadas
- Usuários ilimitados
- API access
- Custom training
- Onboarding assistido
- SLA 99.9%

---

## 🎯 PITCH CORRETO

### VSL Script (4min30s)

```
[0:00-0:30] GANCHO
"Dr. Silva, você sabia que está perdendo R$ 15.000 por mês?

Enquanto você dorme, 47 pessoas pesquisam 'advogado trabalhista São Paulo' no Google.

12 entram no seu site.

Mas nenhuma entra em contato.

Porque seu site não responde na hora.

E em 5 minutos, elas já ligaram para seu concorrente."

[0:30-1:30] PROBLEMA
"O problema é simples:

Cliente quer resposta AGORA. Não amanhã.

Mas você não pode ficar 24h no WhatsApp.

Não pode contratar 3 secretárias para atender de madrugada.

E chatbot genérico? Cliente percebe que é robô bobo e sai.

Resultado: Você PERDE 73% dos leads do Google Ads.

Gasta R$ 3.000 em anúncios, converte R$ 800.

Prejuízo de R$ 2.200 TODO MÊS."

[1:30-3:00] SOLUÇÃO
"A solução é a Garcez Palha Engine.

Uma SECRETÁRIA JURÍDICA com IA que:

1. Está no seu site 24 horas por dia, 7 dias por semana

2. Conversa com o cliente como se fosse humana
   (ela é especializada em direito, faz as 103 perguntas certas)

3. Qualifica o caso automaticamente
   (urgência, viabilidade, valor estimado)

4. Agenda a consulta no SEU calendário

5. Envia proposta personalizada com valores

E o melhor: É 100% WHITE-LABEL.

Sua marca, seu logo, suas cores.

Cliente nem sabe que é IA.

Pensa que é sua secretária de verdade."

[3:00-4:00] PROVA SOCIAL
"Já temos 300 advogados usando.

Dr. João, de Campinas:
'Em 30 dias, 47 leads qualificados. 8 viraram clientes. Faturei R$ 32.000. Pago R$ 497, lucro R$ 31.500'

Dra. Maria, de BH:
'Melhor investimento. Trabalha enquanto durmo. Acordo com 5 consultas agendadas.'

Dr. Pedro, SP:
'Cancelei chatbot de R$ 800 que não funcionava. Garcez Palha por R$ 497 converte 10x mais.'"

[4:00-4:30] CTA
"Você tem 2 opções:

Opção 1: Continuar perdendo R$ 15.000/mês

Opção 2: Testar 30 dias GRÁTIS

Setup em 60 segundos. Sem cartão de crédito.

Clique no botão abaixo.

Vamos configurar sua secretária IA AGORA.

Em 1 minuto ela já está capturando leads.

30 dias grátis. Cancela quando quiser.

Clique agora."
```

---

**FIM DO PLANO DE IMPLEMENTAÇÃO - SECRETÁRIA JURÍDICA IA**

Este é o produto PRINCIPAL. Marketing é add-on no Plano Pro.

Próximo documento: Corrigir documentação existente com modelo híbrido.
