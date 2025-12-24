# Sistema de Gestão de Produtos e Pacotes

## Visão Geral

Sistema completo para gerenciamento de produtos/serviços jurídicos com múltiplos pacotes de preços e landing pages VSL dinâmicas.

## Estrutura do Banco de Dados

### Tabela `products`

Armazena os produtos/serviços principais.

```sql
- id (TEXT, PK): Identificador único (geralmente o slug)
- name (TEXT): Nome do produto
- slug (TEXT, UNIQUE): URL amigável
- category (TEXT): Categoria do produto
- description (TEXT): Descrição curta
- hero_title (TEXT): Título principal da landing page
- hero_subtitle (TEXT): Subtítulo da landing page
- hero_problem (TEXT): Descrição do problema que resolve
- base_price (INTEGER): Preço base em centavos
- features (JSONB): Array de características
- benefits (JSONB): Array de benefícios
- documents_required (JSONB): Array de documentos necessários
- faq_items (JSONB): Array de {question, answer}
- metadata (JSONB): Metadados adicionais
- is_active (BOOLEAN): Produto ativo/inativo
- created_at (TIMESTAMPTZ): Data de criação
- updated_at (TIMESTAMPTZ): Data de atualização
```

### Tabela `product_packages`

Armazena os pacotes de cada produto.

```sql
- id (UUID, PK): Identificador único
- product_id (TEXT, FK): Referência ao produto
- name (TEXT): Nome do pacote
- description (TEXT): Descrição do pacote
- price (INTEGER): Preço em centavos
- features (JSONB): Array de características do pacote
- is_recommended (BOOLEAN): Se é o pacote recomendado
- order_index (INTEGER): Ordem de exibição
- is_active (BOOLEAN): Pacote ativo/inativo
- created_at (TIMESTAMPTZ): Data de criação
- updated_at (TIMESTAMPTZ): Data de atualização
```

## Categorias Disponíveis

1. **previdenciario** - Direito Previdenciário
2. **saude** - Direito da Saúde
3. **patrimonial** - Direito Patrimonial
4. **criminal** - Direito Criminal
5. **financeiro** - Direito Financeiro
6. **pericia** - Perícia e Laudos
7. **automacao** - Automação e Consultoria

## API tRPC

### Endpoints Públicos

#### `products.list`
Lista produtos ativos.

```typescript
const products = await trpc.products.list.query({
  category: 'previdenciario' // opcional
})
```

#### `products.getBySlug`
Busca produto por slug.

```typescript
const product = await trpc.products.getBySlug.query({
  slug: 'aposentadoria-invalidez'
})
```

#### `products.getPackages`
Busca pacotes de um produto.

```typescript
const packages = await trpc.products.getPackages.query({
  productId: 'aposentadoria-invalidez'
})
```

### Endpoints Admin (Protegidos)

#### `products.adminList`
Lista todos os produtos (incluindo inativos) com seus pacotes.

```typescript
const products = await trpc.products.adminList.query()
```

#### `products.create`
Cria novo produto.

```typescript
const product = await trpc.products.create.mutate({
  id: 'meu-produto',
  name: 'Meu Produto',
  slug: 'meu-produto',
  category: 'previdenciario',
  description: 'Descrição...',
  base_price: 0,
  features: ['Feature 1', 'Feature 2'],
  benefits: ['Benefit 1'],
  is_active: true
})
```

#### `products.update`
Atualiza produto existente.

```typescript
const product = await trpc.products.update.mutate({
  id: 'meu-produto',
  data: {
    name: 'Novo Nome',
    description: 'Nova descrição'
  }
})
```

#### `products.delete`
Deleta produto (e todos seus pacotes em cascade).

```typescript
await trpc.products.delete.mutate({
  id: 'meu-produto'
})
```

#### `products.createPackage`
Cria pacote para um produto.

```typescript
const package = await trpc.products.createPackage.mutate({
  product_id: 'meu-produto',
  package: {
    name: 'Pacote Básico',
    price: 99900, // R$ 999,00
    features: ['Feature 1', 'Feature 2'],
    is_recommended: false,
    order_index: 0
  }
})
```

#### `products.updatePackage`
Atualiza pacote existente.

```typescript
const package = await trpc.products.updatePackage.mutate({
  id: 'uuid-do-pacote',
  data: {
    name: 'Novo Nome',
    price: 149900
  }
})
```

#### `products.deletePackage`
Deleta pacote.

```typescript
await trpc.products.deletePackage.mutate({
  id: 'uuid-do-pacote'
})
```

## Painel Admin

### Localização
`/admin/produtos`

### Funcionalidades

1. **Dashboard de Produtos**
   - Listagem de todos os produtos
   - Estatísticas: total, ativos, inativos, pacotes
   - Busca por nome, categoria ou slug
   - Cards com informações resumidas

2. **Gestão de Produtos**
   - Criar novo produto
   - Editar produto existente
   - Ativar/desativar produto
   - Excluir produto
   - Copiar URL da landing page

3. **Gestão de Pacotes**
   - Criar múltiplos pacotes por produto
   - Editar pacotes
   - Marcar pacote recomendado
   - Reordenar pacotes (up/down)
   - Excluir pacotes

4. **Editor de Produto (Abas)**
   - **Básico**: Nome, slug, categoria, preço base, descrição
   - **Hero/VSL**: Títulos e problema para landing page
   - **Conteúdo**: Features, benefícios, documentos necessários
   - **FAQ**: Perguntas e respostas frequentes

## Landing Pages VSL Dinâmicas

### URL Pattern
`/[product-slug]`

Exemplos:
- `/aposentadoria-invalidez`
- `/plano-saude-cobertura`
- `/usucapiao`

### Seções Automáticas

1. **Hero Section**
   - Título (`hero_title` ou `name`)
   - Subtítulo (`hero_subtitle` ou `description`)
   - Problema que resolve (`hero_problem`)
   - Badges de confiança

2. **Como Funciona**
   - Grid de features do produto
   - Ícones de check

3. **Benefícios**
   - Grid 3 colunas
   - Cards com ícones

4. **Pacotes e Preços**
   - Grid responsivo
   - Destaque para pacote recomendado
   - Lista de features de cada pacote
   - Botão de contratação

5. **Documentos Necessários**
   - Lista numerada
   - Ícone de documento

6. **FAQ**
   - Accordion com perguntas e respostas
   - Totalmente customizável

7. **CTA Final**
   - Call-to-action
   - Botões para contato e contratação

## Workflow de Uso

### Para Admins

1. **Criar Produto**
   - Acesse `/admin/produtos`
   - Clique em "Novo Produto"
   - Preencha as 4 abas
   - Salve

2. **Criar Pacotes**
   - No card do produto, clique em "Pacotes"
   - Preencha nome, preço e features
   - Marque como recomendado se for o caso
   - Crie quantos pacotes quiser
   - Use as setas para reordenar

3. **Publicar**
   - Ative o produto
   - Copie a URL
   - Compartilhe em campanhas

### Para Clientes

1. **Acessar Landing Page**
   - Visitam a URL do produto
   - Veem todas as informações

2. **Escolher Pacote**
   - Comparam pacotes
   - Clicam em "Contratar Agora"
   - São redirecionados para checkout

## Preços

Todos os preços são armazenados em **centavos** (INTEGER).

```typescript
// R$ 999,00
price: 99900

// R$ 1.499,90
price: 149990

// R$ 10.000,00
price: 1000000
```

## Formatação de Preço

```typescript
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price / 100)
}

formatPrice(99900) // "R$ 999,00"
```

## Migration

### Aplicar Migration

```bash
# Via Supabase CLI
supabase db push

# Via SQL direto
psql -h [host] -U [user] -d [database] -f supabase/migrations/20251224180414_create_products_system.sql
```

### Seed de Exemplos

```bash
psql -h [host] -U [user] -d [database] -f supabase/migrations/20251224180415_seed_products_examples.sql
```

## Exemplos de Produtos Seed

1. **Aposentadoria por Invalidez** (3 pacotes)
2. **Plano de Saúde - Cobertura Negada** (2 pacotes)
3. **Usucapião** (3 pacotes)
4. **Defesa Criminal** (3 pacotes)

## Personalização

### Adicionar Nova Categoria

1. Edite o enum de categorias em `product-dialog.tsx`
2. Adicione cor correspondente em `categoryColors` na página admin
3. Pronto!

### Customizar VSL Template

Edite `src/app/(marketing)/[product]/page.tsx` para:
- Alterar layout das seções
- Adicionar/remover seções
- Mudar cores e estilos
- Adicionar animações

### Integrar com Checkout

No componente VSL, função `handleSelectPackage`:

```typescript
const handleSelectPackage = (packageId: string) => {
  // Redireciona para checkout com package ID
  router.push(`/checkout?package=${packageId}`)

  // OU integrar com sistema de pagamento
  // createCheckoutSession({ packageId })
}
```

## Segurança

- Endpoints públicos: Apenas leitura de produtos ativos
- Endpoints admin: Protegidos com `protectedProcedure`
- Validação com Zod em todas as mutations
- SQL Injection: Prevenido pelo Supabase/Prisma
- XSS: Sanitização automática do React

## Performance

- Índices em: `category`, `slug`, `is_active`, `product_id`
- Query otimizada com `select` específico
- Caching no cliente via React Query (tRPC)
- Imagens lazy-load na VSL

## SEO

Para cada produto, adicione:

```typescript
// Em metadata (Next.js 13+)
export async function generateMetadata({ params }) {
  const product = await getProductBySlug(params.product)

  return {
    title: product.hero_title || product.name,
    description: product.description,
    openGraph: {
      title: product.hero_title,
      description: product.description,
    }
  }
}
```

## Roadmap

- [ ] Versionamento de produtos
- [ ] A/B testing de pacotes
- [ ] Analytics por produto
- [ ] Cupons de desconto por pacote
- [ ] Comparador de pacotes
- [ ] Calculadora de ROI
- [ ] Depoimentos por produto
- [ ] Galeria de imagens/vídeos
- [ ] Integração com CRM
- [ ] Webhooks de eventos

## Suporte

Para dúvidas ou problemas:
1. Verifique este documento
2. Consulte o código em `src/lib/trpc/routers/products.ts`
3. Entre em contato com a equipe de desenvolvimento
