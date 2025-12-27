import { Navbar } from './components/navbar'
import { Footer } from './components/footer'
import { FloatingContactHub } from '@/components/chat/FloatingContactHub'
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
      <FloatingContactHub />
    </div>
  )
}
