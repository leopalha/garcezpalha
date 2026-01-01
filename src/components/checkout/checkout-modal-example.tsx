'use client'

/**
 * EXEMPLO DE USO DO CHECKOUT MODAL
 *
 * Este arquivo demonstra como usar o componente CheckoutModal
 * em diferentes cenários.
 */

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CheckoutModal } from '@/components/checkout/checkout-modal'

export function CheckoutModalExample() {
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenWithService, setIsOpenWithService] = useState(false)

  return (
    <div className="space-y-4 p-8">
      <h2 className="text-2xl font-bold">Exemplos de Uso do CheckoutModal</h2>

      {/* Exemplo 1: Modal sem serviço pré-selecionado */}
      <div className="space-y-2">
        <h3 className="font-semibold">1. Modal sem serviço pré-selecionado</h3>
        <p className="text-sm text-muted-foreground">
          O usuário começa no Step 1 (Seleção de Serviço)
        </p>
        <Button onClick={() => setIsOpen(true)}>
          Abrir Checkout (sem serviço)
        </Button>

        <CheckoutModal
          open={isOpen}
          onOpenChange={setIsOpen}
          onSuccess={() => {
            // Checkout completed successfully
          }}
        />
      </div>

      {/* Exemplo 2: Modal com serviço pré-selecionado */}
      <div className="space-y-2">
        <h3 className="font-semibold">2. Modal com serviço pré-selecionado</h3>
        <p className="text-sm text-muted-foreground">
          O usuário começa direto no Step 2 (Detalhes do Cliente)
        </p>
        <Button onClick={() => setIsOpenWithService(true)}>
          Contratar Desbloqueio de Conta
        </Button>

        <CheckoutModal
          open={isOpenWithService}
          onOpenChange={setIsOpenWithService}
          serviceId="desbloqueio-conta"
          onSuccess={() => {
            // Service contracted successfully - additional actions can be added here
          }}
        />
      </div>

      {/* Exemplo 3: Integração com card de serviço */}
      <ServiceCard />
    </div>
  )
}

/**
 * Exemplo de Card de Serviço que abre o modal
 */
function ServiceCard() {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  return (
    <div className="space-y-2">
      <h3 className="font-semibold">3. Integração com Card de Serviço</h3>
      <p className="text-sm text-muted-foreground">
        Exemplo de como usar em cards de serviços
      </p>

      <div className="border rounded-lg p-4 max-w-md space-y-4">
        <div>
          <h4 className="font-bold">Desbloqueio de Conta</h4>
          <p className="text-sm text-muted-foreground">
            Ação judicial para desbloqueio de conta bancária ou poupança
          </p>
        </div>
        <div className="text-2xl font-bold">R$ 1.500,00</div>
        <Button className="w-full" onClick={() => setIsCheckoutOpen(true)}>
          Contratar Agora
        </Button>
      </div>

      <CheckoutModal
        open={isCheckoutOpen}
        onOpenChange={setIsCheckoutOpen}
        serviceId="desbloqueio-conta"
        onSuccess={() => {
          setIsCheckoutOpen(false)
        }}
      />
    </div>
  )
}

/**
 * OUTROS EXEMPLOS DE INTEGRAÇÃO
 */

// 1. Na página de serviços:
// <Button onClick={() => setCheckoutOpen(true)}>
//   Contratar
// </Button>
// <CheckoutModal
//   open={checkoutOpen}
//   onOpenChange={setCheckoutOpen}
//   serviceId="golpe-pix"
// />

// 2. No hero section:
// <Button size="lg" onClick={() => setCheckoutOpen(true)}>
//   Começar Agora
// </Button>
// <CheckoutModal
//   open={checkoutOpen}
//   onOpenChange={setCheckoutOpen}
// />

// 3. Em uma lista de serviços:
// {services.map(service => (
//   <ServiceCard
//     key={service.id}
//     service={service}
//     onCheckout={() => {
//       setSelectedServiceId(service.id)
//       setCheckoutOpen(true)
//     }}
//   />
// ))}
// <CheckoutModal
//   open={checkoutOpen}
//   onOpenChange={setCheckoutOpen}
//   serviceId={selectedServiceId}
// />
