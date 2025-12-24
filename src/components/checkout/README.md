# CheckoutModal Component

Modal de checkout que permite aos usuários contratar serviços jurídicos sem sair da página atual.

## Características

- **Modal Full-Screen/Large**: Utiliza Dialog do shadcn/ui com max-w-6xl
- **3 Steps de Checkout**:
  1. Seleção de Serviço (pode ser pulado)
  2. Detalhes do Cliente
  3. Pagamento
- **Progress Indicator**: Mostra progresso visual (1/3, 2/3, 3/3)
- **Reutiliza Componentes**: ServiceSelector e OrderSummary
- **Validações**: Email, telefone, CPF/CNPJ com máscaras
- **Integração de Pagamento**: Stripe (cartão) e MercadoPago (PIX)
- **Responsive**: Design adaptável para mobile

## Props

```typescript
interface CheckoutModalProps {
  open: boolean              // Controla visibilidade do modal
  onOpenChange: (open: boolean) => void  // Callback quando modal abre/fecha
  serviceId?: string         // ID do serviço pré-selecionado (opcional)
  onSuccess?: () => void     // Callback após checkout completo (opcional)
}
```

## Uso Básico

### 1. Sem serviço pré-selecionado

Usuário começa no Step 1 (Seleção de Serviço):

```tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CheckoutModal } from '@/components/checkout/checkout-modal'

export function MyPage() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Abrir Checkout
      </Button>

      <CheckoutModal
        open={isOpen}
        onOpenChange={setIsOpen}
        onSuccess={() => {
          console.log('Checkout completo!')
        }}
      />
    </>
  )
}
```

### 2. Com serviço pré-selecionado

Usuário começa direto no Step 2 (Detalhes do Cliente):

```tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CheckoutModal } from '@/components/checkout/checkout-modal'

export function ServiceCard() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Contratar Desbloqueio de Conta
      </Button>

      <CheckoutModal
        open={isOpen}
        onOpenChange={setIsOpen}
        serviceId="desbloqueio-conta"  // Pula Step 1
        onSuccess={() => {
          console.log('Serviço contratado!')
          // Redirecionar, atualizar estado, etc.
        }}
      />
    </>
  )
}
```

### 3. Integração com Cards de Serviços

```tsx
'use client'

import { useState } from 'react'
import { CheckoutModal } from '@/components/checkout/checkout-modal'

export function ServicesGrid() {
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [selectedServiceId, setSelectedServiceId] = useState<string>()

  const services = [
    { id: 'desbloqueio-conta', name: 'Desbloqueio de Conta', price: 1500 },
    { id: 'golpe-pix', name: 'Golpe do PIX', price: 1200 },
    // ...outros serviços
  ]

  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        {services.map(service => (
          <ServiceCard
            key={service.id}
            service={service}
            onCheckout={() => {
              setSelectedServiceId(service.id)
              setCheckoutOpen(true)
            }}
          />
        ))}
      </div>

      <CheckoutModal
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        serviceId={selectedServiceId}
        onSuccess={() => {
          console.log('Contratado:', selectedServiceId)
          setCheckoutOpen(false)
        }}
      />
    </>
  )
}
```

## Fluxo de Checkout

### Step 1: Seleção de Serviço (opcional)

- Mostra todos os serviços disponíveis usando `ServiceSelector`
- Permite filtrar por categoria
- Mostra preço, features e prazo de entrega
- **Pulado se `serviceId` for fornecido**

### Step 2: Detalhes do Cliente

Campos obrigatórios:
- Nome completo
- Email (validado)
- Telefone (máscara: `(21) 99999-9999`)
- CPF/CNPJ (máscara automática)

Campos opcionais:
- Descrição do caso
- Urgência (Normal ou Urgente +30%)

### Step 3: Pagamento

Métodos disponíveis:
- **Cartão de Crédito** (Stripe)
  - Redireciona para Stripe Checkout
  - Fecha o modal antes do redirecionamento
- **PIX** (MercadoPago)
  - Gera QR Code
  - Chama `onSuccess()` callback
  - Fecha o modal

## Validações

- **Email**: Regex validado em tempo real
- **Telefone**: Máscara (21) 99999-9999
- **CPF/CNPJ**: Máscara automática
  - CPF: 123.456.789-00
  - CNPJ: 12.345.678/0001-00
- **Campos obrigatórios**: Verifica antes de avançar

## Estados

- **Loading**: Mostra spinner durante processamento
- **Erros**: Toasts informativos
- **Progresso**: Indicador visual com steps

## Design

- **Mobile-First**: Layout responsivo
- **Acessibilidade**: Componentes shadcn/ui acessíveis
- **Consistência**: Mesmos estilos da página `/checkout`
- **UX**: Botões "Voltar" e "Continuar" em cada step

## Dependências

- `@/components/ui/button`
- `@/components/ui/input`
- `@/components/ui/label`
- `@/components/ui/textarea`
- `@/components/ui/radio-group`
- `@/components/ui/card`
- `@/components/ui/dialog`
- `@/components/ui/use-toast`
- `@/components/checkout/service-selector`
- `@/components/checkout/order-summary`
- `@/types/checkout`
- `@/lib/utils`
- `lucide-react`

## APIs Utilizadas

### Stripe (Cartão de Crédito)

```typescript
POST /api/stripe/create-session
{
  serviceId: string
  serviceName: string
  amount: number
  customerName: string
  customerEmail: string
  customerPhone: string
  customerCpfCnpj: string
  description?: string
  urgency: 'normal' | 'urgent'
}
```

### MercadoPago (PIX)

```typescript
POST /api/mercadopago/create-payment
{
  serviceId: string
  serviceName: string
  amount: number
  customerName: string
  customerEmail: string
  customerPhone: string
  customerCpfCnpj: string
  description?: string
  urgency: 'normal' | 'urgent'
}
```

## IDs de Serviços Disponíveis

Exemplos de `serviceId` válidos:

- `desbloqueio-conta` - Desbloqueio de Conta (R$ 1.500)
- `golpe-pix` - Golpe do PIX (R$ 1.200)
- `negativacao-indevida` - Negativação Indevida (R$ 1.000)
- `plano-saude` - Plano de Saúde Negou (R$ 1.500)
- `holding-familiar` - Holding Familiar (R$ 5.000)
- `inventario` - Inventário (R$ 3.500)
- ... (veja `src/types/checkout.ts` para lista completa)

## Notas Importantes

1. **Não modifica `/checkout`**: Modal é independente
2. **State Management**: Estado gerenciado internamente
3. **Limpa ao fechar**: Reseta formulário quando modal fecha
4. **Callbacks**: Use `onSuccess` para ações pós-checkout
5. **Redirecionamento**: Stripe redireciona automaticamente
6. **PIX QR Code**: Implementação básica (pode ser melhorada com modal próprio)

## Exemplo Completo

Veja `src/components/checkout/checkout-modal-example.tsx` para exemplos práticos de uso.
