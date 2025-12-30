# Comparação: APIs de Conversações

## Resumo

Existem **2 endpoints de conversações** no projeto que **NÃO são duplicados** - cada um serve propósitos distintos:

- `/api/conversations` - Chat em tempo real com IA (OpenAI Realtime)
- `/api/admin/conversations` - Interface administrativa para handoff humano

---

## `/api/conversations`

**Arquivo**: `src/app/api/conversations/route.ts`

### Propósito
Gerenciar conversas **em tempo real** entre usuários e a IA (OpenAI Realtime API).

### Autenticação
- **NextAuth**: Usa `getToken()` com JWT
- **Requer**: `token.role === 'admin'`

### Tabelas Supabase
```typescript
realtime_conversations {
  id, user_id, product_id, session_id,
  status, mode, started_at, updated_at,
  total_messages
}

realtime_messages {
  id, conversation_id, role, content,
  created_at
}
```

### Filtros
```typescript
.in('status', ['active', 'human_takeover'])
.order('updated_at', { ascending: false })
```

### Resposta
```json
{
  "conversations": [
    {
      "id": "uuid",
      "user_id": "user_uuid",
      "product_id": "product_id",
      "session_id": "session_id",
      "status": "active",
      "mode": "audio",
      "started_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-01-01T00:10:00Z",
      "total_messages": 10,
      "messages": [...]
    }
  ]
}
```

### Casos de Uso
- Dashboard de monitoramento de conversas ativas
- Visualização de sessões OpenAI Realtime
- Debug de problemas de chat
- Métricas de uso do chat IA

---

## `/api/admin/conversations`

**Arquivo**: `src/app/api/admin/conversations/route.ts`

### Propósito
Interface administrativa para **handoff humano** - quando um advogado assume uma conversa que estava sendo atendida por IA ou chatbot.

### Autenticação
- **Supabase Auth**: Usa `supabase.auth.getUser()`
- **Requer**: `profiles.role in ['admin', 'lawyer']`

### Tabelas Supabase
```typescript
conversations {
  id, channel, status (com state),
  last_message_at, ...
}

profiles {
  id, role
}
```

### Filtros
```typescript
// Query params
state: string     // status->state filter
channel: string   // canal de origem (whatsapp, web, email)
limit: number     // paginação (padrão: 50)
offset: number    // paginação (padrão: 0)

.eq('status->>state', state)
.eq('channel', channel)
.order('last_message_at', { ascending: false })
.range(offset, offset + limit - 1)
```

### Resposta
```json
{
  "conversations": [...],
  "total": 42
}
```

### Casos de Uso
- UI de handoff humano (advogado assume conversa)
- Filtrar conversas por estado/canal
- Paginação de grandes volumes
- Acesso por advogados (não só admin)

---

## Comparação Lado a Lado

| Característica | `/api/conversations` | `/api/admin/conversations` |
|----------------|---------------------|---------------------------|
| **Sistema de Chat** | OpenAI Realtime API | Multi-canal (WhatsApp, Web, Email) |
| **Autenticação** | NextAuth JWT | Supabase Auth |
| **Permissões** | Apenas `admin` | `admin` ou `lawyer` |
| **Tabela Principal** | `realtime_conversations` | `conversations` |
| **Tabela de Mensagens** | `realtime_messages` | (não carrega mensagens) |
| **Filtros** | Fixos (active/human_takeover) | Dinâmicos (state, channel) |
| **Paginação** | Não | Sim (limit/offset) |
| **Ordenação** | Por `updated_at` | Por `last_message_at` |
| **Casos de Uso** | Monitorar chat IA | Handoff humano |

---

## Recomendações

### ✅ Manter Ambos
Ambos os endpoints devem ser **mantidos** pois servem propósitos diferentes e complementares:

1. `/api/conversations` → Foco em IA/automação
2. `/api/admin/conversations` → Foco em atendimento humano

### 📝 Melhorias Futuras

**Padronizar Autenticação** (opcional):
- Considerar migrar `/api/conversations` para Supabase Auth
- Ou manter NextAuth mas adicionar suporte a `lawyer` role

**Unificar Tabelas** (longo prazo):
- Avaliar migrar `realtime_conversations` para `conversations`
- Adicionar campo `type: 'realtime' | 'handoff'`
- Requer migração de dados e pode quebrar queries existentes

**Documentar no Código**:
- Adicionar comentários JSDoc explicando a diferença
- Evitar confusão futura de desenvolvedores

---

## Conclusão

**NÃO são duplicados** - cada endpoint tem:
- Propósito distinto
- Modelo de dados diferente
- Requisitos de autenticação específicos
- Casos de uso complementares

A arquitetura atual está **correta** para suportar:
- Chat IA em tempo real (OpenAI)
- Handoff para atendimento humano (advogados)
