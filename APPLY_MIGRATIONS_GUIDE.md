# 📋 Guia de Aplicação de Migrações - Supabase

## ✅ Status: PRONTO PARA APLICAR

Você tem **2 migrações** pendentes que precisam ser aplicadas no Supabase:

1. **016_qualified_leads.sql** - Tabela de leads qualificados
2. **017_follow_up_tasks.sql** - Tabela de tarefas de follow-up

---

## 🚀 MÉTODO RECOMENDADO: Dashboard do Supabase

### Passo 1: Abrir SQL Editor

Acesse o link abaixo:

```
https://supabase.com/dashboard/project/cpcnzkttcwodvfqyhkou/sql/new
```

### Passo 2: Aplicar Migração Consolidada

**Opção A - Arquivo Único (Mais Rápido)**

1. Abra o arquivo: `supabase/migrations/APPLY_ALL_MIGRATIONS.sql`
2. Copie **TODO** o conteúdo (Ctrl+A, Ctrl+C)
3. Cole no SQL Editor do Supabase
4. Clique em **"Run"** (ou F5)
5. Aguarde a mensagem de sucesso ✅

**Opção B - Arquivos Separados (Mais Controlado)**

**Migração 1:**
1. Abra: `supabase/migrations/016_qualified_leads.sql`
2. Copie todo o conteúdo
3. Cole no SQL Editor
4. Clique em "Run"
5. Verifique se apareceu "Success" ✅

**Migração 2:**
1. Abra: `supabase/migrations/017_follow_up_tasks.sql`
2. Copie todo o conteúdo
3. Cole no SQL Editor
4. Clique em "Run"
5. Verifique se apareceu "Success" ✅

---

## ✅ Verificação

Após aplicar as migrações, verifique se as tabelas foram criadas:

### No Supabase Dashboard

1. Vá para: **Table Editor**
2. Você deve ver 2 novas tabelas:
   - ✅ `qualified_leads` (leads qualificados)
   - ✅ `follow_up_tasks` (tarefas de follow-up)

### Via SQL

Execute este SQL no SQL Editor para confirmar:

```sql
-- Verificar tabelas criadas
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('qualified_leads', 'follow_up_tasks');

-- Verificar views criadas
SELECT table_name
FROM information_schema.views
WHERE table_schema = 'public'
  AND table_name IN ('qualified_leads_analytics', 'follow_up_analytics');
```

Você deve ver **4 resultados**:
- 2 tabelas
- 2 views

---

## 📊 O que será criado?

### Tabela: `qualified_leads`

Armazena todos os leads qualificados pelo sistema:

**Campos principais:**
- `id` - UUID único
- `client_name`, `phone`, `email` - Info do cliente
- `product_id`, `product_name` - Produto de interesse
- `score_total`, `score_urgency`, `score_probability`, `score_complexity` - Scores
- `category` - Categoria do lead (hot/warm/cold/very-cold)
- `answers` - JSONB com respostas completas
- `status` - Status atual (new/contacted/in-progress/converted/lost)
- `created_at`, `updated_at` - Timestamps

**Indexes:**
- phone, product_id, category, status, source, created_at, session_id

**Policies (RLS):**
- Admins podem ver/editar tudo
- Usuários veem apenas leads atribuídos a eles

### Tabela: `follow_up_tasks`

Armazena tarefas de follow-up agendadas:

**Campos principais:**
- `id` - UUID único
- `lead_id` - Referência ao lead (FK)
- `scheduled_for` - Quando executar
- `attempt_number` - Número da tentativa (1-5)
- `category` - Categoria (hot/warm/cold/very-cold)
- `status` - Status (pending/sent/failed/cancelled)
- `sent_at` - Quando foi enviado
- `error` - Mensagem de erro (se houver)
- `metadata` - JSONB com dados extras

**Indexes:**
- lead_id, status, scheduled_for, category, pending_scheduled

**Policies (RLS):**
- Admins podem ver/editar tudo

### Views: Analytics

**`qualified_leads_analytics`**
- Agregação por data, produto, categoria, source, status
- Counts, médias de scores

**`follow_up_analytics`**
- Agregação de tarefas por data, categoria, status
- Counts de enviados, falhados, cancelados
- Tempo médio de delay

---

## 🔧 MÉTODO ALTERNATIVO: Supabase CLI

Se preferir usar a linha de comando:

```bash
# 1. Instalar CLI (se não tiver)
npm install -g supabase

# 2. Fazer login
supabase login

# 3. Linkar projeto
supabase link --project-ref cpcnzkttcwodvfqyhkou

# 4. Aplicar migrações
supabase db push
```

---

## ❌ Troubleshooting

### Erro: "relation already exists"

Se a tabela já existe, você pode:

1. **Remover e recriar:**
```sql
DROP TABLE IF EXISTS follow_up_tasks CASCADE;
DROP TABLE IF EXISTS qualified_leads CASCADE;
-- Depois execute as migrações novamente
```

2. **Ou pular o erro** - Se a estrutura está correta, ignore o erro

### Erro: "permission denied"

Certifique-se de que está logado como admin no Supabase Dashboard.

### Erro: "syntax error"

Verifique se copiou TODO o conteúdo do arquivo corretamente (incluindo a última linha).

---

## 🎯 Próximos Passos (Após Aplicar Migrações)

1. ✅ **Deploy para produção**
   ```bash
   git push origin main
   # ou
   vercel --prod
   ```

2. ✅ **Testar qualificação via WhatsApp**
   - Envie uma mensagem de teste
   - Complete o questionário
   - Verifique se o lead foi salvo

3. ✅ **Verificar dashboard**
   - Acesse: `/admin/leads/qualificados`
   - Veja os leads qualificados
   - Teste os filtros

4. ✅ **Verificar analytics**
   - Acesse: `/admin/analytics/conversao`
   - Veja as métricas
   - Teste os períodos

5. ✅ **Aguardar cron job**
   - O cron roda a cada hora (0 * * * *)
   - Próxima execução: início da próxima hora
   - Verifique logs em: Vercel Dashboard > Functions > Logs

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs do Supabase Dashboard
2. Revise a sintaxe SQL nos arquivos de migração
3. Tente aplicar linha por linha para identificar o erro
4. Consulte a documentação do Supabase: https://supabase.com/docs

---

**Projeto:** Garcez Palha - Sistema de Qualificação de Leads
**Data:** Dezembro 2024
**Status:** ✅ Código Pronto | ⏳ Aguardando Migrações
