# Guia Rápido - Sistema de Produtos

## 1. Aplicar Migrations

```bash
# Via terminal na raiz do projeto
cd d:\garcezpalha

# Aplicar schema
supabase db push

# OU executar SQL manualmente no Supabase Dashboard
# Copie e cole o conteúdo dos arquivos:
# - supabase/migrations/20251224180414_create_products_system.sql
# - supabase/migrations/20251224180415_seed_products_examples.sql
```

## 2. Acessar Painel Admin

1. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

2. Acesse: http://localhost:3000/admin/produtos

3. Faça login como admin

## 3. Criar Seu Primeiro Produto

### Passo 1: Clicar em "Novo Produto"

### Passo 2: Aba BÁSICO
- Nome: `Aposentadoria por Tempo de Contribuição`
- Slug: `aposentadoria-tempo` (gerado automaticamente)
- Categoria: Selecione `Previdenciário`
- Preço Base: `0` (pode deixar em 0 se vai usar pacotes)
- Descrição: `Conte com especialistas para garantir sua aposentadoria`

### Passo 3: Aba HERO/VSL
- Título Hero: `Garanta Sua Aposentadoria por Tempo de Contribuição`
- Subtítulo: `Especialistas em INSS cuidam de tudo para você`
- Problema: `Já trabalhou por anos mas não sabe se tem direito à aposentadoria? Nós analisamos seu caso gratuitamente e cuidamos de todo o processo.`

### Passo 4: Aba CONTEÚDO
Adicione Features:
- `Análise gratuita do seu caso`
- `Cálculo de tempo de contribuição`
- `Averbação de tempo de serviço`
- `Entrada do pedido no INSS`
- `Acompanhamento até a concessão`

Adicione Benefícios:
- `Equipe especializada em direito previdenciário`
- `95% de taxa de aprovação`
- `Atendimento personalizado`

Adicione Documentos:
- `RG e CPF`
- `Carteiras de Trabalho (todas)`
- `Carnês de contribuição`
- `Holerites dos últimos 12 meses`

### Passo 5: Aba FAQ
Adicione perguntas:

**Pergunta 1:**
- Pergunta: `Quanto tempo demora para aposentar?`
- Resposta: `Após entrada do pedido, o INSS tem até 45 dias para analisar. Acompanhamos todo o processo.`

**Pergunta 2:**
- Pergunta: `Posso trabalhar depois de aposentado?`
- Resposta: `Sim! Após a concessão você pode continuar trabalhando normalmente.`

### Passo 6: Salvar
Clique em "Salvar Produto"

## 4. Criar Pacotes de Preços

### Passo 1: No card do produto, clique em "Pacotes"

### Pacote 1 - BÁSICO
- Nome: `Básico`
- Descrição: `Para quem já tem documentação organizada`
- Preço: `999.00` (sistema salva em centavos: 99900)
- Features:
  - `Análise de viabilidade`
  - `Orientação sobre documentos`
  - `Entrada do pedido`
  - `Suporte por e-mail`
- Recomendado: NÃO
- Clique em "Criar Pacote"

### Pacote 2 - COMPLETO (Recomendado)
- Nome: `Completo`
- Descrição: `O mais escolhido pelos clientes`
- Preço: `1899.00`
- Features:
  - `Tudo do Básico`
  - `Levantamento de documentos`
  - `Cálculo detalhado`
  - `Averbações necessárias`
  - `Recursos se necessário`
  - `Suporte WhatsApp`
- Recomendado: SIM ✓
- Clique em "Criar Pacote"

### Pacote 3 - PREMIUM
- Nome: `Premium`
- Descrição: `Máxima tranquilidade`
- Preço: `2999.00`
- Features:
  - `Tudo do Completo`
  - `Atendimento VIP`
  - `Acompanhamento presencial`
  - `Consultoria pós-aposentadoria`
  - `Planejamento financeiro`
- Recomendado: NÃO
- Clique em "Criar Pacote"

## 5. Testar Landing Page

1. No painel admin, copie a URL do produto (botão de copiar ao lado do slug)

2. Ou acesse diretamente: http://localhost:3000/aposentadoria-tempo

3. Veja sua landing page VSL completa com:
   - Hero section personalizado
   - Features e benefícios
   - 3 pacotes com preços
   - Documentos necessários
   - FAQ
   - CTA final

## 6. Publicar

1. Certifique-se que o produto está ATIVO (toggle verde)

2. Compartilhe a URL nas suas campanhas:
   - Facebook Ads
   - Google Ads
   - WhatsApp
   - Instagram
   - Email marketing

## 7. Editar/Gerenciar

### Editar Produto
- Clique em "Editar" no card
- Altere o que precisar
- Salve

### Gerenciar Pacotes
- Clique em "Pacotes"
- Use as setas ↑↓ para reordenar
- Edite ou exclua pacotes existentes

### Desativar Temporariamente
- Clique no toggle (ícone de liga/desliga)
- Produto some da listagem pública
- Continua visível no admin

### Copiar Produto
- Use um produto existente como base
- Edite nome, slug e detalhes
- Crie novos pacotes

## 8. Integração com Checkout

### No seu checkout (src/app/checkout/page.tsx):

```typescript
const searchParams = useSearchParams()
const packageId = searchParams.get('package')

// Buscar dados do pacote
const { data: packageData } = trpc.products.getPackages.useQuery(...)

// Processar pagamento com o preço do pacote
const price = packageData.price // já em centavos

// Integrar com Mercado Pago, Stripe, etc.
```

## 9. Analytics e Conversão

### Rastrear no Google Analytics:

```typescript
// Ao clicar em "Contratar Agora"
gtag('event', 'begin_checkout', {
  items: [{
    item_id: pkg.id,
    item_name: pkg.name,
    price: pkg.price / 100,
  }]
})
```

### Rastrear no Meta Pixel:

```typescript
fbq('track', 'InitiateCheckout', {
  content_ids: [pkg.id],
  content_name: pkg.name,
  value: pkg.price / 100,
  currency: 'BRL'
})
```

## 10. Dicas Profissionais

### SEO
- Use slugs descritivos: `aposentadoria-tempo-contribuicao`
- Título hero com palavra-chave principal
- Descrição entre 150-160 caracteres
- Features com termos que as pessoas buscam

### Conversão
- SEMPRE marque 1 pacote como recomendado (geralmente o do meio)
- Preço médio: coloque o mais caro, depois o recomendado, depois o básico
- Use números ímpares: R$ 1.897 converte mais que R$ 1.900
- FAQ: responda objeções comuns

### Design
- Máximo 3-4 pacotes (não sobrecarregue)
- Features: 5-7 itens (não mais que isso)
- Benefícios: 3-6 itens
- FAQ: 4-8 perguntas

### Copy
- Hero title: promessa clara e direta
- Hero subtitle: complementa o título
- Hero problem: dor do cliente + solução
- Features: o que você FAZ
- Benefícios: o que o cliente GANHA

## Troubleshooting

### Produto não aparece na VSL
- Verifique se está ATIVO
- Confira o slug (deve ser exato na URL)
- Limpe cache do navegador

### Pacotes não aparecem
- Verifique se product_id está correto
- Pacotes devem estar ATIVOS
- Recarregue a página

### Erro ao salvar
- Verifique campos obrigatórios (nome, slug, categoria)
- Slug deve ser único
- Preços devem ser números positivos

### Permissão negada
- Certifique-se que está logado como admin
- Verifique roles no Supabase

## Próximos Passos

1. Crie produtos para todos os seus serviços
2. Teste diferentes combinações de pacotes
3. Faça A/B testing de preços
4. Adicione depoimentos de clientes
5. Implemente sistema de cupons
6. Integre com seu CRM

## Suporte

Consulte a documentação completa em `docs/PRODUCTS_SYSTEM.md`
