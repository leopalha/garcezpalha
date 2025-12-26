import { Navbar } from './components/navbar'
import { Footer } from './components/footer'
import { ChatAssistant } from '@/components/chat/ChatAssistant'
import { WhatsAppFloat } from '@/components/vsl/whatsapp-float'
import { OrganizationJsonLd, LocalBusinessJsonLd } from '@/components/shared/json-ld'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen flex flex-col">
      <OrganizationJsonLd />
      <LocalBusinessJsonLd />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <ChatAssistant
        productId="geral"
        productName="Serviços Jurídicos"
        autoOpen={false}
        openDelay={5000}
      />
      <WhatsAppFloat
        phoneNumber="5521995354010"
        message="Olá! Gostaria de saber mais sobre os serviços jurídicos."
      />
    </div>
  )
}
