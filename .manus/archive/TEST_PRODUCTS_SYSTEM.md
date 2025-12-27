# Roteiro de Testes - Sistema de Produtos

## Pré-requisitos
- ✅ Migrations aplicadas
- ✅ Servidor dev rodando (`npm run dev`)
- ✅ Usuário admin criado

---

## TESTE 1: Verificar Banco de Dados

### No Supabase Dashboard > Table Editor

1. **Verificar tabela `products`**
   - Deve existir
   - Deve ter 4 registros (produtos de exemplo)
   - Campos: id, name, slug, category, etc.

2. **Verificar tabela `product_packages`**
   - Deve existir
   - Deve ter 11 registros (pacotes de exemplo)
   - Campo product_id deve referenciar products

3. **Verificar dados de exemplo**
   ```sql
   SELECT p.name, COUNT(pp.id) as packages_count
   FROM products p
   LEFT JOIN product_packages pp ON p.id = pp.product_id
   GROUP BY p.id, p.name;
   ```

   Resultado esperado:
   - Aposentadoria por Invalidez: 3 pacotes
   - Cobertura Negada: 2 pacotes
   - Usucapião: 3 pacotes
   - Defesa Criminal: 3 pacotes

**Status**: [ ] ✅ | [ ] ❌

---

## TESTE 2: Acessar Painel Admin

### URL: http://localhost:3000/admin/produtos

1. **Verificar Dashboard**
   - [ ] Página carrega sem erros
   - [ ] Mostra 4 cards de estatísticas
   - [ ] Total de Produtos: 4
   - [ ] Produtos Ativos: 4
   - [ ] Total de Pacotes: 11

2. **Verificar Listagem**
   - [ ] Mostra 4 produtos em cards
   - [ ] Cada card tem: nome, categoria, badge ativo, slug, preço base
   - [ ] Botões: Editar, Pacotes, Excluir

3. **Verificar Busca**
   - [ ] Digite "aposentadoria"
   - [ ] Deve filtrar e mostrar apenas "Aposentadoria por Invalidez"
   - [ ] Limpe a busca
   - [ ] Deve voltar a mostrar todos

**Status**: [ ] ✅ | [ ] ❌

---

## TESTE 3: Criar Novo Produto

### No painel admin

1. **Clicar em "Novo Produto"**
   - [ ] Dialog abre
   - [ ] Mostra 4 abas: Básico, Hero/VSL, Conteúdo, FAQ

2. **Aba BÁSICO**
   - Nome: `Teste de Produto`
   - Slug: `teste-produto` (auto-gerado)
   - Categoria: `Patrimonial`
   - Preço Base: `0`
   - Descrição: `Produto de teste do sistema`
   - [ ] Todos os campos funcionam

3. **Aba HERO/VSL**
   - Título Hero: `Teste de Título Hero`
   - Subtítulo: `Teste de Subtítulo`
   - Problema: `Este é um teste do problema que o produto resolve`
   - [ ] Campos salvam corretamente

4. **Aba CONTEÚDO**
   - Adicionar Feature: `Feature de teste 1`
   - Adicionar Feature: `Feature de teste 2`
   - [ ] Features aparecem na lista
   - [ ] Botão X remove features

   - Adicionar Benefício: `Benefício de teste 1`
   - [ ] Benefícios aparecem

   - Adicionar Documento: `Documento de teste`
   - [ ] Documentos aparecem

5. **Aba FAQ**
   - Pergunta: `Esta é uma pergunta de teste?`
   - Resposta: `Esta é uma resposta de teste.`
   - Clicar em "Adicionar FAQ"
   - [ ] FAQ aparece na lista

6. **Salvar**
   - Clicar em "Salvar Produto"
   - [ ] Toast de sucesso aparece
   - [ ] Dialog fecha
   - [ ] Produto aparece na listagem
   - [ ] Total de produtos agora é 5

**Status**: [ ] ✅ | [ ] ❌

---

## TESTE 4: Editar Produto

### No card do produto "Teste de Produto"

1. **Clicar em "Editar"**
   - [ ] Dialog abre com dados preenchidos
   - [ ] Todos os campos estão com os valores salvos

2. **Alterar Nome**
   - Mudar para: `Produto Editado`
   - Salvar
   - [ ] Nome atualiza no card

3. **Adicionar mais uma feature**
   - Aba Conteúdo
   - Adicionar: `Feature editada`
   - Salvar
   - [ ] Salvou com sucesso

**Status**: [ ] ✅ | [ ] ❌

---

## TESTE 5: Criar Pacotes

### No produto "Produto Editado", clicar em "Pacotes"

1. **Dialog de Pacotes abre**
   - [ ] Lado esquerdo: formulário
   - [ ] Lado direito: lista (vazia)

2. **Criar Pacote Básico**
   - Nome: `Básico`
   - Descrição: `Pacote básico de teste`
   - Preço: `999`
   - Adicionar features:
     - `Feature do pacote 1`
     - `Feature do pacote 2`
   - Recomendado: NÃO
   - Clicar "Criar Pacote"
   - [ ] Pacote aparece do lado direito
   - [ ] Preço formatado: R$ 999,00

3. **Criar Pacote Premium**
   - Nome: `Premium`
   - Descrição: `Pacote premium de teste`
   - Preço: `1999`
   - Features:
     - `Tudo do Básico`
     - `Feature premium 1`
     - `Feature premium 2`
   - Recomendado: SIM ✓
   - Criar
   - [ ] Aparece com badge "Recomendado"
   - [ ] Tem estrela amarela

4. **Reordenar**
   - No pacote Premium, clicar na seta ↓
   - [ ] Premium desce
   - [ ] Básico sobe

5. **Editar Pacote**
   - No Básico, clicar "Editar"
   - Mudar preço para `899`
   - Atualizar
   - [ ] Preço atualiza para R$ 899,00

6. **Deletar Pacote**
   - No Premium, clicar "Excluir"
   - Confirmar
   - [ ] Pacote removido da lista

**Status**: [ ] ✅ | [ ] ❌

---

## TESTE 6: Toggle Ativo/Inativo

### No produto "Produto Editado"

1. **Desativar**
   - Clicar no toggle (deve estar verde)
   - [ ] Toggle fica cinza
   - [ ] Badge muda para "Inativo"
   - [ ] Toast: "Produto desativado"

2. **Reativar**
   - Clicar no toggle novamente
   - [ ] Toggle fica verde
   - [ ] Badge volta para "Ativo"
   - [ ] Toast: "Produto ativado"

**Status**: [ ] ✅ | [ ] ❌

---

## TESTE 7: Copiar URL

### No produto "Produto Editado"

1. **Clicar no botão de copiar** (ao lado do slug)
   - [ ] Toast: "URL copiada"
   - [ ] Clipboard tem: http://localhost:3000/teste-produto

2. **Colar no navegador**
   - [ ] Deve abrir a VSL page

**Status**: [ ] ✅ | [ ] ❌

---

## TESTE 8: Deletar Produto

### No produto "Produto Editado"

1. **Clicar em "Excluir"**
   - [ ] Dialog de confirmação abre
   - [ ] Aviso sobre pacotes

2. **Confirmar**
   - [ ] Produto removido
   - [ ] Toast de sucesso
   - [ ] Total volta para 4 produtos

**Status**: [ ] ✅ | [ ] ❌

---

## TESTE 9: VSL Page - Produto de Exemplo

### URL: http://localhost:3000/aposentadoria-invalidez

1. **Hero Section**
   - [ ] Título: "Aposentadoria por Invalidez Garantida"
   - [ ] Subtítulo visível
   - [ ] Box de problema visível
   - [ ] 3 badges (Rápido, Especializada, Seguro)

2. **Como Funciona**
   - [ ] Grid com 5 features
   - [ ] Cada um com ícone de check

3. **Benefícios**
   - [ ] Grid 3 colunas
   - [ ] 5 benefícios
   - [ ] Ícones verdes

4. **Pacotes e Preços**
   - [ ] 3 pacotes lado a lado
   - [ ] Pacote "Completo" destacado (recomendado)
   - [ ] Badge "Recomendado" com estrela
   - [ ] Preços formatados corretamente:
     - Básico: R$ 999,00
     - Completo: R$ 1.999,00
     - Premium: R$ 3.499,00
   - [ ] Botões "Contratar Agora"

5. **Documentos Necessários**
   - [ ] Lista numerada
   - [ ] 6 documentos

6. **FAQ**
   - [ ] Accordion funcionando
   - [ ] 4 perguntas
   - [ ] Expandir/recolher funciona

7. **CTA Final**
   - [ ] Seção roxa com call-to-action
   - [ ] 2 botões (contato e contratar)

**Status**: [ ] ✅ | [ ] ❌

---

## TESTE 10: VSL Page - Responsividade

### Na mesma página, redimensionar navegador

1. **Desktop (> 1024px)**
   - [ ] Grid de 3 colunas nos pacotes
   - [ ] Layout espaçoso

2. **Tablet (768px - 1024px)**
   - [ ] Grid de 2 colunas nos pacotes
   - [ ] Elementos se ajustam

3. **Mobile (< 768px)**
   - [ ] Pacotes empilham (1 coluna)
   - [ ] Menu responsivo
   - [ ] Texto legível
   - [ ] Botões acessíveis

**Status**: [ ] ✅ | [ ] ❌

---

## TESTE 11: Integração com Checkout

### Na VSL, clicar em "Contratar Agora" de um pacote

1. **Verificar redirecionamento**
   - [ ] URL: `/checkout?package=[UUID]`
   - [ ] UUID é válido (formato correto)

2. **Na página de checkout**
   - [ ] Package ID está na query string
   - [ ] (Implementar busca do pacote via tRPC)

**Status**: [ ] ✅ | [ ] ⏳ (depende de implementação do checkout)

---

## TESTE 12: tRPC Endpoints (Via Console)

### Abrir DevTools > Console na página admin

```javascript
// Teste 1: Listar produtos públicos
const produtos = await window.trpc.products.list.query()
console.log(produtos) // Deve retornar array com 4 produtos

// Teste 2: Buscar por slug
const produto = await window.trpc.products.getBySlug.query({
  slug: 'aposentadoria-invalidez'
})
console.log(produto) // Deve retornar o produto completo

// Teste 3: Buscar pacotes
const pacotes = await window.trpc.products.getPackages.query({
  productId: 'aposentadoria-invalidez'
})
console.log(pacotes) // Deve retornar 3 pacotes
```

**Status**: [ ] ✅ | [ ] ❌

---

## TESTE 13: Validações

### Tentar criar produto inválido

1. **Sem nome**
   - Deixar nome vazio
   - Tentar salvar
   - [ ] Erro de validação

2. **Slug duplicado**
   - Usar slug existente
   - [ ] Erro do banco

3. **Preço negativo**
   - Preço: -100
   - [ ] Validação impede

**Status**: [ ] ✅ | [ ] ❌

---

## TESTE 14: Performance

### No painel admin

1. **Tempo de carregamento inicial**
   - Recarregar página
   - [ ] Carrega em < 2 segundos

2. **Busca em tempo real**
   - Digitar na busca
   - [ ] Filtra instantaneamente

3. **Abrir dialogs**
   - [ ] Abre suavemente, sem lag

**Status**: [ ] ✅ | [ ] ❌

---

## TESTE 15: Edge Cases

1. **Produto sem pacotes**
   - Criar produto sem pacotes
   - Acessar VSL
   - [ ] Seção de pacotes não aparece ou mostra mensagem

2. **Produto sem FAQ**
   - [ ] Seção FAQ não aparece

3. **Produto sem documentos**
   - [ ] Seção documentos não aparece

**Status**: [ ] ✅ | [ ] ❌

---

## Resumo dos Testes

| # | Teste | Status | Observações |
|---|-------|--------|-------------|
| 1 | Banco de Dados | [ ] | |
| 2 | Painel Admin | [ ] | |
| 3 | Criar Produto | [ ] | |
| 4 | Editar Produto | [ ] | |
| 5 | Criar Pacotes | [ ] | |
| 6 | Toggle Status | [ ] | |
| 7 | Copiar URL | [ ] | |
| 8 | Deletar Produto | [ ] | |
| 9 | VSL Page | [ ] | |
| 10 | Responsividade | [ ] | |
| 11 | Checkout | [ ] | |
| 12 | tRPC API | [ ] | |
| 13 | Validações | [ ] | |
| 14 | Performance | [ ] | |
| 15 | Edge Cases | [ ] | |

---

## Bugs Encontrados

Liste aqui qualquer bug encontrado:

1.
2.
3.

---

## Melhorias Sugeridas

Liste sugestões de melhoria:

1.
2.
3.

---

## Conclusão

- [ ] Todos os testes principais passaram
- [ ] Sistema está pronto para produção
- [ ] Documentação foi consultada e está clara
- [ ] Equipe foi treinada no uso do sistema

---

**Testado por**: _____________
**Data**: _____________
**Ambiente**: [ ] Dev | [ ] Staging | [ ] Produção
