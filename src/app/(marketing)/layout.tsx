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
      {/* Skip to main content link for keyboard navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
      >
        Pular para o conteúdo principal
      </a>

      <OrganizationJsonLd />
      <LocalBusinessJsonLd />
      <Navbar />
      <main id="main-content" className="flex-1" role="main">
        {children}
      </main>
      <Footer />
      <FloatingContactHub />
    </div>
  )
}
