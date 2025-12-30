# 🚀 Guia Rápido de Migration - Produtos

## ⚡ Método Rápido (5 minutos)

### Passo 1: Criar Função Helper no Supabase

1. Acesse: https://app.supabase.com/project/cpcnzkttcwodvfqyhkou/sql/new

2. Cole este SQL e clique **RUN**:

```sql
-- Função helper para executar SQL via API
CREATE OR REPLACE FUNCTION exec_sql(sql_query text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql_query;
END;
$$;
```

3. Aguarde a confirmação ✅

### Passo 2: Executar Migration

Agora execute no terminal:

```bash
npm run db:execute-migration
```

---

## 📋 Método Manual (Recomendado se o rápido falhar)

### Opção A: Via SQL Editor (MAIS SIMPLES)

1. **Acesse:**
   ```
   https://app.supabase.com/project/cpcnzkttcwodvfqyhkou/sql/new
   ```

2. **Cole TODO o SQL abaixo** e clique **RUN**:

```sql
-- ============================================================
-- MIGRATION: Sistema de Produtos
-- ============================================================

-- Tabela principal de produtos/serviços
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  hero_title TEXT,
  hero_subtitle TEXT,
  hero_problem TEXT,
  base_price INTEGER NOT NULL DEFAULT 0,
  features JSONB DEFAULT '[]',
  benefits JSONB DEFAULT '[]',
  documents_required JSONB DEFAULT '[]',
  faq_items JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de pacotes (múltiplos por produto)
CREATE TABLE IF NOT EXISTS product_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  features JSONB DEFAULT '[]',
  is_recommended BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_packages_product ON product_packages(product_id);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_packages_updated_at BEFORE UPDATE ON product_packages
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

3. **Verifique** se você vê a mensagem "Success. No rows returned"

4. **Confirme** no Table Editor:
   - Table Editor → products ✅
   - Table Editor → product_packages ✅

---

### Opção B: Via CLI (Para Usuários Avançados)

Se você tiver o Supabase CLI configurado:

```bash
npx supabase db push
```

---

## ✅ Após Criar as Tabelas

### 1. Teste a Conexão
```bash
npm run test:db-connection
```

**Saída esperada:**
```
✅ Variáveis de ambiente encontradas
✅ Conexão bem-sucedida!
✅ Tabela 'products' está acessível
✅ Tabela 'product_packages' está acessível
```

### 2. Migre os 22 Produtos
```bash
npm run migrate:products
```

**Saída esperada:**
```
🚀 Iniciando migração de produtos...
📦 Migrando produto: Desbloqueio de Conta Bancária
✅ Produto Desbloqueio de Conta Bancária migrado com sucesso
...
🎉 Migração concluída com sucesso!
```

### 3. Verifique os Dados
```bash
npm run verify:migration
```

---

## 🐛 Troubleshooting

### Erro: "table already exists"
✅ **OK!** Ignore - a migration usou `IF NOT EXISTS`

### Erro: "permission denied"
❌ Verifique se você está logado no projeto correto no Supabase

### Erro: "connection refused"
❌ Verifique suas variáveis de ambiente em `.env.local`

### Migration funcionou mas migrate:products falha
Execute novamente - o script usa `upsert` e não duplica dados

---

## 📊 O que Será Criado

### Tabelas
- ✅ `products` (57 produtos)
- ✅ `product_packages` (múltiplos pacotes por produto)

### Índices
- ✅ `idx_products_category`
- ✅ `idx_products_slug`
- ✅ `idx_products_active`
- ✅ `idx_packages_product`

### Triggers
- ✅ `update_products_updated_at`
- ✅ `update_packages_updated_at`

---

## 🎯 Próximos Passos

Após a migração bem-sucedida:

1. ✅ Acesse `/admin/produtos` para gerenciar produtos
2. ⏳ Atualizar checkout para usar pacotes dinâmicos
3. ⏳ Criar template de landing page dinâmica
4. ⏳ Criar as 15 páginas de serviços

---

## 💡 Dica

Se você executar `npm run migrate:products` múltiplas vezes, não haverá duplicação.
O script usa `upsert` que atualiza se já existir ou insere se não existir.

---

**Tempo total estimado:** 5-10 minutos
**Dificuldade:** Fácil ⭐
