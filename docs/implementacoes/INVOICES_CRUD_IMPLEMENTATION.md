# Implementação Completa do CRUD de Faturas

## Resumo

Foi implementado o CRUD completo de faturas, substituindo todo o mock data por chamadas tRPC reais. A implementação inclui todos os componentes necessários, feedback visual, loading states e confirmações.

## Arquivos Criados

### 1. NewInvoiceDialog
**Arquivo**: `d:\garcezpalha\src\components\admin\invoices\new-invoice-dialog.tsx`

**Funcionalidades**:
- Select para escolher cliente (busca de `trpc.clients.list`)
- Auto-geração de número de fatura (formato: INV-YYYY-XXXX)
- Input para valor com suporte a decimais
- Textarea para descrição
- DatePicker para data de emissão (padrão: hoje)
- DatePicker para data de vencimento (padrão: +15 dias)
- Dois botões de ação:
  - "Salvar como Rascunho" (status: draft)
  - "Criar e Enviar" (status: sent)
- Loading states em todos os botões
- Validação de campos obrigatórios
- Reset automático do formulário após sucesso

### 2. EditInvoiceDialog
**Arquivo**: `d:\garcezpalha\src\components\admin\invoices\edit-invoice-dialog.tsx`

**Funcionalidades**:
- Preenche automaticamente os campos com dados da fatura
- Permite editar: número, valor, descrição, datas
- Loading state no botão de salvar
- Validação de campos obrigatórios
- Callback de sucesso para atualizar lista

### 3. MarkAsPaidDialog
**Arquivo**: `d:\garcezpalha\src\components\admin\invoices\mark-as-paid-dialog.tsx`

**Funcionalidades**:
- Exibe valor da fatura e nome do cliente
- Select para método de pagamento (PIX, Transferência, Cartão, Boleto, Dinheiro, Outro)
- DatePicker para data do pagamento (padrão: hoje)
- Validação de campos obrigatórios
- Loading state durante confirmação
- Atualiza status para "paid" e registra método/data de pagamento

## Arquivo Atualizado

### 4. Página de Faturas
**Arquivo**: `d:\garcezpalha\src\app\(admin)\admin\faturas\page.tsx`

**Mudanças Principais**:

#### Substituição de Mock Data por tRPC
```typescript
// ANTES: const invoices = mockInvoices
// DEPOIS:
const { data: invoicesData, isLoading, refetch } = trpc.invoices.list.useQuery({
  status: statusFilter !== 'all' ? (statusFilter as InvoiceStatus) : undefined,
  limit: 100,
})

const { data: statsData } = trpc.invoices.stats.useQuery()
```

#### Mutations Implementadas

1. **Enviar Fatura**:
```typescript
const sendMutation = trpc.invoices.send.useMutation({
  onSuccess: () => {
    toast({ title: 'Fatura enviada', description: '...' })
    refetch()
  },
  onError: (error) => {
    toast({ variant: 'destructive', title: 'Erro', description: error.message })
  },
})
```

2. **Excluir Fatura**:
```typescript
const deleteMutation = trpc.invoices.delete.useMutation({
  onSuccess: () => {
    toast({ title: 'Fatura excluída', description: '...' })
    setDeleteDialogOpen(false)
    refetch()
  },
})
```

#### Estados de UI Adicionados
- `newInvoiceDialogOpen` - Controla dialog de nova fatura
- `editInvoiceDialogOpen` - Controla dialog de edição
- `markAsPaidDialogOpen` - Controla dialog de marcar como paga
- `deleteDialogOpen` - Controla dialog de confirmação de exclusão
- `invoiceToDelete` - Armazena fatura a ser excluída

#### Ações dos Botões Implementadas

1. **Botão "Atualizar"**:
   - Chama `refetch()` para recarregar dados
   - Loading state com ícone de rotação

2. **Botão "Nova Fatura"**:
   - Abre `NewInvoiceDialog`
   - Ao salvar, atualiza lista e mostra toast de sucesso

3. **Botão "Baixar PDF"**:
   - Estrutura preparada (placeholder)
   - Pode ser implementado com biblioteca de geração de PDF

4. **Botão "Enviar para Cliente"**:
   - Visível apenas para faturas com status "draft"
   - Chama `sendMutation` para alterar status para "sent"
   - Loading state durante envio
   - Toast de sucesso/erro

5. **Botão "Marcar como Paga"**:
   - Visível para faturas "sent" ou "overdue"
   - Abre `MarkAsPaidDialog`
   - Registra método de pagamento e data

6. **Botão "Editar"**:
   - Visível para faturas não pagas
   - Abre `EditInvoiceDialog` com dados preenchidos

7. **Botão "Excluir"**:
   - Abre dialog de confirmação
   - Mostra número da fatura a ser excluída
   - Confirmação necessária antes de deletar
   - Toast de sucesso/erro

#### Feedback Visual

1. **Toast Notifications**:
   - Sucesso: Operações concluídas
   - Erro: Mensagens de erro detalhadas
   - Usa `useToast` do shadcn/ui

2. **Loading States**:
   - Lista de faturas: Spinner durante carregamento
   - Botões: Ícone Loader2 com animação
   - Desabilita botões durante operações

3. **Estados Vazios**:
   - Mensagem quando nenhuma fatura encontrada
   - Ícone e texto para selecionar fatura

#### Melhorias de UX

- Stats em tempo real (receita total, a receber, vencidas, total de faturas)
- Filtro por status funcional
- Busca por número, cliente ou descrição
- Seleção visual da fatura ativa
- Cores e ícones para cada status
- Dialog de confirmação antes de excluir

## Integração com Backend

### Queries tRPC Utilizadas
- `trpc.invoices.list` - Lista faturas com paginação e filtros
- `trpc.invoices.stats` - Estatísticas agregadas
- `trpc.clients.list` - Lista clientes para select

### Mutations tRPC Utilizadas
- `trpc.invoices.create` - Criar nova fatura
- `trpc.invoices.update` - Atualizar fatura existente
- `trpc.invoices.markAsPaid` - Marcar como paga
- `trpc.invoices.send` - Enviar fatura (alterar status)
- `trpc.invoices.delete` - Excluir fatura

## Estrutura de Tipos

```typescript
interface Invoice {
  id: string
  invoice_number: string
  client_id?: string
  amount: number
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  issue_date: string
  due_date: string
  paid_date: string | null
  description: string
  payment_method: string | null
  created_at: string
  clients?: {
    company_name: string
  }
}
```

## Componentes UI Utilizados

Todos os componentes são do shadcn/ui:
- `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`
- `Button`
- `Input`
- `Textarea`
- `Label`
- `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`
- `Card`, `CardContent`, `CardHeader`, `CardTitle`, `CardDescription`
- `useToast`

## Próximos Passos Sugeridos

1. **Implementar geração de PDF**:
   - Biblioteca sugerida: `@react-pdf/renderer` ou `jspdf`
   - Gerar PDF com dados da fatura
   - Permitir download

2. **Envio de email real**:
   - Integrar com serviço de email (SendGrid, Resend, etc.)
   - Enviar fatura por email quando status mudar para "sent"
   - Template de email com link para visualizar fatura

3. **Histórico de alterações**:
   - Adicionar tabela de audit log
   - Registrar mudanças de status
   - Exibir timeline de eventos da fatura

4. **Pagamento online**:
   - Integração com Mercado Pago (já configurado no projeto)
   - Link de pagamento na fatura
   - Webhook para atualizar status automaticamente

5. **Exportação**:
   - Botão "Exportar" funcional
   - Exportar para CSV/Excel
   - Relatórios personalizados

## Observações Técnicas

- Código TypeScript 100% tipado
- Error handling completo em todas as mutations
- Loading states em todas as operações assíncronas
- Validação de formulários antes de enviar
- Feedback visual para usuário em todas as ações
- Confirmação antes de ações destrutivas
- Reset de formulários após sucesso
- Atualização automática da lista após mutations
