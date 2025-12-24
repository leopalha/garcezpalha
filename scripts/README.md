# Scripts de Migração e Manutenção

Este diretório contém scripts para migração de dados e manutenção do banco de dados.

## Scripts Disponíveis

### 1. Teste de Conexão com o Banco

Testa a conexão com o Supabase e verifica se as tabelas necessárias existem.

```bash
npm run test:db-connection
```

**O que faz:**
- Verifica se as variáveis de ambiente estão configuradas
- Testa a conexão com o Supabase
- Verifica se as tabelas `products` e `product_packages` existem
- Mostra quantos produtos já existem no banco

### 2. Migração de Produtos

Migra todos os produtos do arquivo `src/types/checkout.ts` para o banco de dados Supabase.

```bash
npm run migrate:products
```

**O que faz:**
- Lê todos os produtos definidos em `src/types/checkout.ts`
- Insere ou atualiza cada produto na tabela `products`
- Insere os pacotes relacionados na tabela `product_packages`
- Exibe um resumo ao final com sucessos e erros

**Produtos migrados:**
- 22 produtos no total
- 4 produtos de Proteção Financeira
- 6 produtos de Proteção Patrimonial
- 5 produtos de Proteção de Saúde
- 3 produtos de Perícia e Documentos
- 2 produtos de Defesa Criminal
- 2 produtos de Automação Jurídica

**Pacotes configurados:**
- Desbloqueio de Conta: 2 pacotes
- Golpe do PIX: 3 pacotes
- Negativação Indevida: 3 pacotes
- Plano de Saúde: 3 pacotes

## Pré-requisitos

1. **Variáveis de Ambiente**

   Certifique-se de que o arquivo `.env.local` contém:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
   SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key
   ```

2. **Tabelas do Banco**

   As seguintes tabelas devem existir no Supabase:

   - `products` - Tabela principal de produtos
   - `product_packages` - Tabela de pacotes/planos de cada produto

3. **Dependências**

   ```bash
   npm install
   ```

## Uso Recomendado

### Primeira Migração

1. Teste a conexão primeiro:
   ```bash
   npm run test:db-connection
   ```

2. Se tudo estiver OK, execute a migração:
   ```bash
   npm run migrate:products
   ```

### Atualizações

O script usa `upsert`, então pode ser executado múltiplas vezes sem duplicar dados:

```bash
npm run migrate:products
```

## Estrutura dos Dados

### Produto (products)

```typescript
{
  id: string                    // ID único do produto
  name: string                  // Nome do produto
  slug: string                  // URL amigável
  category: string              // Categoria (financeiro, patrimonial, etc)
  description: string           // Descrição curta
  hero_title: string            // Título da página do produto
  hero_subtitle: string         // Subtítulo da página
  hero_problem?: string         // Problema que resolve
  base_price: number            // Preço base em centavos
  features: string[]            // Lista de características
  benefits?: string[]           // Lista de benefícios
  documents_required?: string[] // Documentos necessários
  estimated_delivery: string    // Prazo de entrega
  is_active: boolean            // Se está ativo
  is_featured: boolean          // Se é destaque
}
```

### Pacote (product_packages)

```typescript
{
  product_id: string      // ID do produto pai
  name: string           // Nome do pacote
  description: string    // Descrição do pacote
  price: number         // Preço em centavos
  features: string[]    // Lista de características
  is_recommended: boolean // Se é o pacote recomendado
  order_index: number   // Ordem de exibição
}
```

## Troubleshooting

### Erro: Variáveis de ambiente não encontradas

Certifique-se de que o arquivo `.env.local` existe e contém as variáveis corretas.

### Erro: Tabela não encontrada

Execute as migrações do banco de dados:

```bash
npm run db:push
```

### Erro: Permissão negada

Verifique se a `SUPABASE_SERVICE_ROLE_KEY` está correta. Ela deve ter permissões de admin.

### Alguns produtos falharam

O script continua mesmo se alguns produtos falharem. Verifique os logs para ver qual produto teve problema e corrija-o manualmente.

## Logs

O script exibe logs detalhados:
- ✅ Sucesso
- ❌ Erro
- 📦 Progresso
- 📊 Resumo final

Exemplo de saída:

```
🚀 Iniciando migração de produtos...

📦 Migrando produto: Desbloqueio de Conta Bancária
✅ Produto Desbloqueio de Conta Bancária migrado com sucesso
   📦 Migrando 2 pacotes...
   ✅ Pacote Análise Gratuita migrado
   ✅ Pacote Desbloqueio Completo migrado

...

==================================================
📊 RESUMO DA MIGRAÇÃO
==================================================
✅ Produtos migrados com sucesso: 22
❌ Produtos com erro: 0
📦 Total de produtos processados: 22
==================================================

🎉 Migração concluída com sucesso!
```

## Manutenção

Para adicionar novos produtos:

1. Adicione o produto no array `products` em `migrate-products-to-db.mjs`
2. Se tiver pacotes, adicione-os no objeto `packages`
3. Execute: `npm run migrate:products`

O script usa `upsert`, então produtos existentes serão atualizados e novos serão inseridos.
