# Componentes de CRUD de Clientes

Componentes React para gerenciamento completo de clientes na plataforma administrativa.

## Componentes

### NewClientDialog

Dialog modal para criação de novos clientes.

**Props:**
- `open: boolean` - Controla visibilidade do dialog
- `onOpenChange: (open: boolean) => void` - Callback para mudança de estado
- `onSuccess?: () => void` - Callback executado após sucesso na criação

**Campos:**
- Nome completo * (obrigatório)
- Email * (obrigatório, com validação)
- Telefone * (obrigatório, com máscara)
- Empresa/Nome da Empresa (opcional)
- CPF/CNPJ (opcional, com máscara automática)
- Endereço (opcional)
- Cidade (opcional)
- Estado (opcional, select com estados BR)
- CEP (opcional, com máscara)

**Funcionalidades:**
- Validação de email
- Máscara automática para telefone (celular/fixo)
- Máscara automática para CPF/CNPJ
- Máscara automática para CEP
- Toast notifications para feedback
- Loading states durante submissão
- Invalidação automática de cache após sucesso

**Uso:**
```tsx
import { NewClientDialog } from '@/components/admin/clients'

function MyComponent() {
  const [open, setOpen] = useState(false)

  return (
    <NewClientDialog
      open={open}
      onOpenChange={setOpen}
      onSuccess={() => {
        console.log('Cliente criado!')
      }}
    />
  )
}
```

### EditClientDialog

Dialog modal para edição de clientes existentes.

**Props:**
- `open: boolean` - Controla visibilidade do dialog
- `onOpenChange: (open: boolean) => void` - Callback para mudança de estado
- `client: ClientWithProfile | null` - Dados do cliente a ser editado
- `onSuccess?: () => void` - Callback executado após sucesso na atualização

**Campos:**
Mesmos campos do NewClientDialog, mais:
- Status * (obrigatório, select: Ativo/Inativo/Arquivado)

**Funcionalidades:**
- Pré-preenchimento automático dos campos
- Todas as funcionalidades do NewClientDialog
- Atualização do status do cliente

**Uso:**
```tsx
import { EditClientDialog } from '@/components/admin/clients'

function MyComponent() {
  const [open, setOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState(null)

  return (
    <EditClientDialog
      open={open}
      onOpenChange={setOpen}
      client={selectedClient}
      onSuccess={() => {
        console.log('Cliente atualizado!')
      }}
    />
  )
}
```

## Integração com tRPC

Os componentes utilizam as seguintes mutations tRPC:

- `trpc.clients.create.useMutation()` - Criação de clientes
- `trpc.clients.update.useMutation()` - Atualização de clientes
- `utils.clients.list.invalidate()` - Invalidação de cache

## Validações

### Email
- Formato válido de email
- Campo obrigatório

### Telefone
- Máscara automática: `(XX) XXXXX-XXXX` ou `(XX) XXXX-XXXX`
- Campo obrigatório

### CPF/CNPJ
- Máscara automática:
  - CPF: `XXX.XXX.XXX-XX`
  - CNPJ: `XX.XXX.XXX/XXXX-XX`
- Detecta automaticamente baseado no comprimento

### CEP
- Máscara automática: `XXXXX-XXX`

## Máscaras de Formatação

As funções de formatação estão implementadas internamente em cada componente:

- `formatPhone(value: string)` - Formata telefone
- `formatCpfCnpj(value: string)` - Formata CPF ou CNPJ
- `formatCep(value: string)` - Formata CEP

## Toast Notifications

Mensagens exibidas ao usuário:

**Sucesso:**
- "Cliente criado com sucesso"
- "Cliente atualizado com sucesso"

**Erro:**
- "Nome obrigatório"
- "Email obrigatório"
- "Email inválido"
- "Telefone obrigatório"
- "Erro ao criar cliente"
- "Erro ao atualizar cliente"

## Estados BR

Lista completa de estados brasileiros disponível no select:
```
AC, AL, AP, AM, BA, CE, DF, ES, GO, MA,
MT, MS, MG, PA, PB, PR, PE, PI, RJ, RN,
RS, RO, RR, SC, SP, SE, TO
```

## TypeScript

Todos os componentes são totalmente tipados com TypeScript, garantindo type safety e autocomplete.

## Dependências

- `@/components/ui/dialog` - Componente de dialog modal
- `@/components/ui/button` - Componente de botão
- `@/components/ui/input` - Componente de input
- `@/components/ui/label` - Componente de label
- `@/components/ui/select` - Componente de select
- `@/components/ui/use-toast` - Hook para toast notifications
- `@/lib/trpc/client` - Cliente tRPC
- `lucide-react` - Ícones (Loader2)

## Notas

- Os componentes lidam automaticamente com estados de loading
- Validações são feitas no client-side antes de enviar para o servidor
- Cache é invalidado automaticamente após mutações bem-sucedidas
- Formulários são resetados após submissão bem-sucedida
