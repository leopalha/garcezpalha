# 📦 COMPONENT LIBRARY - MANUS Platform

**Versão:** 1.0
**Data:** 31/12/2024
**Total de Componentes:** 90+
**Framework:** Next.js 14 + React + TypeScript

---

## 📚 ÍNDICE

1. [UI Components](#ui-components) (25 componentes)
2. [Chat Components](#chat-components) (10 componentes)
3. [Admin Components](#admin-components) (15 componentes)
4. [Marketing Components](#marketing-components) (12 componentes)
5. [Dashboard Components](#dashboard-components) (10 componentes)
6. [Shared Components](#shared-components) (8 componentes)
7. [VSL Components](#vsl-components) (8 componentes)
8. [Charts Components](#charts-components) (3 componentes)

---

## 🎨 UI COMPONENTS

Componentes base do design system usando shadcn/ui + Radix UI.

### 1. Button
**Arquivo:** `src/components/ui/button.tsx`
**Tipo:** Base Component
**Dependências:** `class-variance-authority`, `@radix-ui/react-slot`

**Variantes:**
- `default` - Botão primário azul
- `destructive` - Ações destrutivas (vermelho)
- `outline` - Botão com borda
- `secondary` - Botão secundário
- `ghost` - Botão transparente
- `link` - Estilo de link

**Tamanhos:** `default`, `sm`, `lg`, `icon`

**Props:**
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  asChild?: boolean
}
```

**Uso:**
```tsx
<Button variant="default" size="lg">Click Me</Button>
<Button variant="outline" size="sm">Cancel</Button>
```

---

### 2. Card
**Arquivo:** `src/components/ui/card.tsx`
**Tipo:** Container Component

**Sub-componentes:**
- `Card` - Container principal
- `CardHeader` - Cabeçalho do card
- `CardTitle` - Título
- `CardDescription` - Descrição
- `CardContent` - Conteúdo principal
- `CardFooter` - Rodapé com ações

**Uso:**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Título do Card</CardTitle>
    <CardDescription>Descrição opcional</CardDescription>
  </CardHeader>
  <CardContent>
    Conteúdo aqui
  </CardContent>
  <CardFooter>
    <Button>Ação</Button>
  </CardFooter>
</Card>
```

---

### 3. Dialog
**Arquivo:** `src/components/ui/dialog.tsx`
**Tipo:** Modal Component
**Dependências:** `@radix-ui/react-dialog`

**Sub-componentes:**
- `Dialog` - Root component
- `DialogTrigger` - Botão de abertura
- `DialogContent` - Conteúdo do modal
- `DialogHeader` - Cabeçalho
- `DialogTitle` - Título
- `DialogDescription` - Descrição
- `DialogFooter` - Rodapé com ações

**Features:**
- ✅ Overlay com blur
- ✅ Animações de entrada/saída
- ✅ Fechamento ao clicar fora
- ✅ Fechamento com ESC
- ✅ Trap de foco
- ✅ Acessibilidade ARIA

**Uso:**
```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Abrir Modal</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Título do Modal</DialogTitle>
      <DialogDescription>Descrição</DialogDescription>
    </DialogHeader>
    {/* Conteúdo */}
    <DialogFooter>
      <Button>Confirmar</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

### 4. Input
**Arquivo:** `src/components/ui/input.tsx`
**Tipo:** Form Component

**Props:**
```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
}
```

**Features:**
- ✅ Estilos consistentes
- ✅ Estados: default, focus, disabled, error
- ✅ Suporte a ref forwarding
- ✅ Acessibilidade

**Uso:**
```tsx
<Input type="email" placeholder="seu@email.com" />
<Input type="password" disabled />
```

---

### 5. Select
**Arquivo:** `src/components/ui/select.tsx`
**Tipo:** Form Component
**Dependências:** `@radix-ui/react-select`

**Sub-componentes:**
- `Select` - Root
- `SelectTrigger` - Botão seletor
- `SelectContent` - Dropdown content
- `SelectItem` - Item de opção
- `SelectGroup` - Grupo de itens
- `SelectLabel` - Label do grupo

**Features:**
- ✅ Navegação por teclado
- ✅ Busca por digitação
- ✅ Acessibilidade ARIA
- ✅ Customizável

---

### 6. Textarea
**Arquivo:** `src/components/ui/textarea.tsx`
**Tipo:** Form Component

**Features:**
- ✅ Auto-resize opcional
- ✅ Estados de validação
- ✅ Max length visual

---

### 7. Badge
**Arquivo:** `src/components/ui/badge.tsx`
**Tipo:** Display Component

**Variantes:**
- `default` - Azul
- `secondary` - Cinza
- `destructive` - Vermelho
- `outline` - Com borda

**Uso:**
```tsx
<Badge variant="default">Novo</Badge>
<Badge variant="destructive">Urgente</Badge>
```

---

### 8. Table
**Arquivo:** `src/components/ui/table.tsx`
**Tipo:** Data Display

**Sub-componentes:**
- `Table` - Container
- `TableHeader` - Cabeçalho
- `TableBody` - Corpo
- `TableFooter` - Rodapé
- `TableRow` - Linha
- `TableHead` - Célula de cabeçalho
- `TableCell` - Célula de dados
- `TableCaption` - Legenda

**Features:**
- ✅ Responsive
- ✅ Striped rows
- ✅ Hover states
- ✅ Sticky header

---

### 9. Tabs
**Arquivo:** `src/components/ui/tabs.tsx`
**Tipo:** Navigation Component
**Dependências:** `@radix-ui/react-tabs`

**Sub-componentes:**
- `Tabs` - Root
- `TabsList` - Lista de tabs
- `TabsTrigger` - Botão de tab
- `TabsContent` - Conteúdo da tab

**Uso:**
```tsx
<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Conteúdo 1</TabsContent>
  <TabsContent value="tab2">Conteúdo 2</TabsContent>
</Tabs>
```

---

### 10. Toast / Toaster
**Arquivo:** `src/components/ui/toast.tsx`, `toaster.tsx`
**Tipo:** Notification Component
**Dependências:** `@radix-ui/react-toast`

**Variantes:**
- `default` - Informação
- `destructive` - Erro

**Uso:**
```tsx
import { useToast } from '@/components/ui/use-toast'

const { toast } = useToast()

toast({
  title: "Sucesso!",
  description: "Operação concluída com sucesso",
})

toast({
  variant: "destructive",
  title: "Erro",
  description: "Algo deu errado",
})
```

---

### 11-25. Outros UI Components

| # | Componente | Arquivo | Propósito |
|---|------------|---------|-----------|
| 11 | **Accordion** | `accordion.tsx` | Expandir/colapsar seções |
| 12 | **Alert** | `alert.tsx` | Mensagens de alerta inline |
| 13 | **AlertDialog** | `alert-dialog.tsx` | Confirmações modais |
| 14 | **Avatar** | `avatar.tsx` | Imagens de perfil |
| 15 | **Calendar** | `calendar.tsx` | Seletor de data |
| 16 | **Checkbox** | `checkbox.tsx` | Caixa de seleção |
| 17 | **DropdownMenu** | `dropdown-menu.tsx` | Menu contextual |
| 18 | **Label** | `label.tsx` | Rótulos de formulário |
| 19 | **Popover** | `popover.tsx` | Tooltip avançado |
| 20 | **Progress** | `progress.tsx` | Barra de progresso |
| 21 | **RadioGroup** | `radio-group.tsx` | Seleção única |
| 22 | **Separator** | `separator.tsx` | Divisor visual |
| 23 | **Sheet** | `sheet.tsx` | Sidebar modal |
| 24 | **Skeleton** | `skeleton.tsx` | Loading placeholder |
| 25 | **Slider** | `slider.tsx` | Controle deslizante |

---

## 💬 CHAT COMPONENTS

Componentes do sistema de chat AI com 3 modos de operação.

### 1. ChatAssistant (PRINCIPAL)
**Arquivo:** `src/components/chat/ChatAssistant.tsx`
**Tipo:** Unified Chat Component
**Linhas:** ~380

**Descrição:**
Componente consolidado que suporta 3 modos de chat:
1. **chat** - Chat tradicional com arquivos e áudio
2. **agent-flow** - Qualificação de leads com state machine (17 estados)
3. **realtime-voice** - Conversa por voz em tempo real

**Props:**
```typescript
interface UnifiedChatAssistantProps {
  // Identificação
  productId: string
  productName: string

  // Comportamento
  autoOpen?: boolean
  openDelay?: number
  onClose?: () => void

  // Modo de operação
  mode?: 'chat' | 'agent-flow' | 'realtime-voice'
  channel?: 'website' | 'whatsapp' | 'telegram' | 'email'

  // Features
  features?: ChatFeatures

  // Callbacks
  onConversationStart?: (conversationId: string) => void
  onQualificationComplete?: (data: QualificationData) => void

  // Advanced
  customSystemPrompt?: string
  maxFiles?: number
}
```

**Features:**
- ✅ 3 modos de operação
- ✅ 24 agentes IA especializados
- ✅ Upload de arquivos (até 20)
- ✅ Gravação de áudio
- ✅ Text-to-Speech
- ✅ Auto-escalação (score >= 80)
- ✅ State machine com 17 estados
- ✅ Persistência em Supabase
- ✅ Animações Framer Motion
- ✅ Code splitting com dynamic imports

**APIs Utilizadas:**
- `POST /api/chat/assistant` - Modo chat
- `POST /api/chat/agent-flow` - Modo agent-flow
- `WebSocket` - Modo realtime-voice

**Estados Agent-Flow:**
1. greeting
2. qualifying
3. qualified
4. collecting_documents
5. documents_collected
6. analyzing
7. generating_proposal
8. proposal_ready
9. negotiating
10. closed_won
11. closed_lost
12. escalated
13. human_takeover
14. awaiting_payment
15. payment_confirmed
16. onboarding
17. active

**Uso:**
```tsx
// Modo Chat
<ChatAssistant
  productId="desbloqueio-conta"
  productName="Desbloqueio de Conta"
  mode="chat"
  autoOpen={true}
/>

// Modo Agent Flow
<ChatAssistant
  productId="bpc-loas"
  productName="BPC/LOAS"
  mode="agent-flow"
  channel="website"
  onQualificationComplete={(data) => {
    console.log('Lead qualificado:', data.score)
  }}
/>

// Modo Realtime Voice
<ChatAssistant
  productId="geral"
  productName="Assistente Virtual"
  mode="realtime-voice"
/>
```

---

### 2. RealtimeVoiceAssistant
**Arquivo:** `src/components/chat/RealtimeVoiceAssistant.tsx`
**Tipo:** Voice Chat Component

**Descrição:**
Assistente de voz em tempo real usando OpenAI Realtime API + D-ID Avatar.

**Features:**
- ✅ Conversa por voz bidirecional
- ✅ Transcription em tempo real
- ✅ Avatar com lip sync (D-ID)
- ✅ WebSocket connection
- ✅ Latência < 1s

**Props:**
```typescript
interface RealtimeVoiceAssistantProps {
  productId: string
  productName: string
  onClose?: () => void
}
```

---

### 3. FloatingContactHub
**Arquivo:** `src/components/chat/FloatingContactHub.tsx`
**Tipo:** Contact Widget

**Descrição:**
Widget flutuante com múltiplos canais de contato.

**Canais:**
- 💬 WhatsApp
- 📞 Telefone
- 📧 Email
- 💭 Chat AI

---

### 4. AudioRecorder
**Arquivo:** `src/components/chat/AudioRecorder.tsx`
**Tipo:** Audio Input Component

**Features:**
- ✅ Gravação de áudio WebRTC
- ✅ Visualização de forma de onda
- ✅ Limite de tempo
- ✅ Preview antes de enviar

---

### 5. VoicePlayer
**Arquivo:** `src/components/chat/VoicePlayer.tsx`
**Tipo:** Audio Output Component

**Features:**
- ✅ Player de áudio customizado
- ✅ Controles de playback
- ✅ Visualização de progresso

---

### 6. ChatSettings
**Arquivo:** `src/components/chat/ChatSettings.tsx`
**Tipo:** Settings Component

**Settings:**
- TTS enabled/disabled
- Voz TTS (6 opções: alloy, echo, fable, onyx, nova, shimmer)
- Velocidade TTS (1x, 1.5x, 2x)
- Auto-play respostas
- Microfone enabled/disabled
- Notificações
- Sound effects

---

### 7-10. Chat Sub-Components

| # | Componente | Arquivo | Propósito |
|---|------------|---------|-----------|
| 7 | **ChatHeader** | `components/ChatHeader.tsx` | Cabeçalho do chat |
| 8 | **ChatInput** | `components/ChatInput.tsx` | Input com anexos |
| 9 | **MessageBubble** | `components/MessageBubble.tsx` | Bolha de mensagem |
| 10 | **QualificationProgress** | `components/QualificationProgress.tsx` | Progresso de qualificação |

---

## 🔧 ADMIN COMPONENTS

Componentes para painel administrativo (advogados).

### 1. AdminPageHeader
**Arquivo:** `src/components/admin/AdminPageHeader.tsx`
**Tipo:** Header Component

**Props:**
```typescript
interface AdminPageHeaderProps {
  title: string
  description?: string
  actions?: React.ReactNode
}
```

**Features:**
- ✅ Breadcrumbs automáticos
- ✅ Área de ações (botões)
- ✅ Responsive

---

### 2. Breadcrumbs
**Arquivo:** `src/components/admin/Breadcrumbs.tsx`
**Tipo:** Navigation Component

**Features:**
- ✅ Navegação hierárquica
- ✅ Auto-geração baseada em rota
- ✅ Clicável

---

### 3. TemplateEditor
**Arquivo:** `src/components/admin/TemplateEditor.tsx`
**Tipo:** Rich Editor

**Descrição:**
Editor de templates de email/documentos com variáveis dinâmicas.

**Features:**
- ✅ Syntax highlighting
- ✅ Variáveis: {{nome}}, {{email}}, etc
- ✅ Preview em tempo real
- ✅ Validação de sintaxe

---

### 4-15. Admin Dialogs & Forms

| # | Componente | Arquivo | Propósito |
|---|------------|---------|-----------|
| 4 | **NewClientDialog** | `clients/new-client-dialog.tsx` | Cadastrar cliente |
| 5 | **EditClientDialog** | `clients/edit-client-dialog.tsx` | Editar cliente |
| 6 | **NewInvoiceDialog** | `invoices/new-invoice-dialog.tsx` | Criar fatura |
| 7 | **EditInvoiceDialog** | `invoices/edit-invoice-dialog.tsx` | Editar fatura |
| 8 | **MarkAsPaidDialog** | `invoices/mark-as-paid-dialog.tsx` | Marcar pago |
| 9 | **ProductDialog** | `products/product-dialog.tsx` | CRUD de produtos |
| 10 | **PackagesDialog** | `products/packages-dialog.tsx` | Gerenciar pacotes |
| 11 | **NewAppointmentDialog** | `appointments/new-appointment-dialog.tsx` | Agendar consulta |
| 12 | **DocumentsList** | `documents/DocumentsList.tsx` | Lista de documentos |

---

## 🎯 MARKETING COMPONENTS

Componentes para páginas de marketing e landing pages.

### 1. DualHero (NEW)
**Arquivo:** `src/components/marketing/dual-hero.tsx`
**Tipo:** Hero Section

**Descrição:**
Hero section com 2 CTAs: uma para clientes e outra para advogados.

**Features:**
- ✅ 364 anos de tradição
- ✅ 2 CTAs distintos
- ✅ Animações Framer Motion
- ✅ Responsive

**Props:**
```typescript
interface DualHeroProps {
  className?: string
}
```

---

### 2. HeroSection
**Arquivo:** `src/components/marketing/HeroSection.tsx`
**Tipo:** Hero Section

**Descrição:**
Hero tradicional para landing pages de produtos.

**Features:**
- ✅ Headline + subheadline
- ✅ CTA principal
- ✅ Imagem/vídeo de destaque
- ✅ Social proof

---

### 3. ProductPageTemplate
**Arquivo:** `src/components/marketing/templates/ProductPageTemplate.tsx`
**Tipo:** Page Template

**Descrição:**
Template completo para páginas de produtos com 10 seções.

**Seções:**
1. Hero com problema
2. Como funciona (3-5 passos)
3. Benefícios (6-8 items)
4. Resultados esperados
5. FAQ (8-12 perguntas)
6. Documentos necessários
7. Prazos e valores
8. Credenciais OAB
9. Garantias
10. CTA final

**Props:**
```typescript
interface ProductPageTemplateProps {
  product: {
    name: string
    slug: string
    category: string
    problem: string
    solution: string
    benefits: string[]
    steps: Step[]
    faq: FAQ[]
    documents: string[]
    timeline: string
    price: string
  }
}
```

---

### 4-12. Marketing Sections

| # | Componente | Arquivo | Propósito |
|---|------------|---------|-----------|
| 4 | **HowItWorks** | `HowItWorks.tsx` | Passo a passo |
| 5 | **Services** | `Services.tsx` | Grade de serviços |
| 6 | **Testimonials** | `Testimonials.tsx` | Depoimentos |
| 7 | **FAQ** | `FAQ.tsx` | Perguntas frequentes |
| 8 | **WhyChooseUs** | `WhyChooseUs.tsx` | Diferenciais |
| 9 | **FinalCTA** | `FinalCTA.tsx` | CTA de conversão |
| 10 | **Credentials** | `Credentials.tsx` | Credenciais OAB |
| 11 | **ProductsCatalog** | `ProductsCatalog.tsx` | Catálogo de produtos |
| 12 | **HeroBackground** | `hero-background.tsx` | Background animado |

---

## 📊 DASHBOARD COMPONENTS

Componentes para dashboard B2B (advogados).

### 1. LeadsDashboard
**Arquivo:** `src/components/dashboard/leads-dashboard.tsx`
**Tipo:** Dashboard Container

**Features:**
- ✅ Filtros avançados
- ✅ Stats cards
- ✅ Lista de leads
- ✅ Paginação
- ✅ Real-time updates

---

### 2. LeadStatsCards
**Arquivo:** `src/components/dashboard/lead-stats-cards.tsx`
**Tipo:** Stats Display

**Métricas:**
- Total de leads
- Taxa de conversão
- Leads qualificados
- Revenue estimado

---

### 3. LeadsFilters
**Arquivo:** `src/components/dashboard/leads-filters.tsx`
**Tipo:** Filter Component

**Filtros:**
- Status (novo, contatado, qualificado, convertido)
- Produto
- Data range
- Score mínimo
- Origem

---

### 4-10. Dashboard Components

| # | Componente | Arquivo | Propósito |
|---|------------|---------|-----------|
| 4 | **LeadsList** | `leads-list.tsx` | Tabela de leads |
| 5 | **StatsCard** | `stats-card.tsx` | Card de métrica |
| 6 | **ProcessCard** | `process-card.tsx` | Card de processo |
| 7 | **Header** | `header.tsx` | Header do dashboard |
| 8 | **Sidebar** | `sidebar.tsx` | Menu lateral |
| 9 | **LoadingSkeletons** | `loading-skeletons.tsx` | Skeletons de loading |

---

## 🔗 SHARED COMPONENTS

Componentes compartilhados entre diferentes áreas.

| # | Componente | Arquivo | Propósito |
|---|------------|---------|-----------|
| 1 | **Logo** | `shared/logo.tsx` | Logo do escritório |
| 2 | **ThemeSwitcher** | `shared/theme-switcher.tsx` | Trocar tema claro/escuro |
| 3 | **JsonLd** | `shared/json-ld.tsx` | SEO structured data |
| 4 | **ReferralTracker** | `referral-tracker.tsx` | Rastrear UTMs |
| 5 | **AnalyticsProvider** | `analytics/analytics-provider.tsx` | Google Analytics |
| 6 | **BetaBanner** | `beta-banner.tsx` | Banner de beta |
| 7 | **PWAProvider** | `pwa-provider.tsx` | Service Worker |
| 8 | **ServiceWorkerRegister** | `pwa/service-worker-register.tsx` | PWA registration |

---

## 📺 VSL COMPONENTS

Componentes para Video Sales Letters.

| # | Componente | Arquivo | Propósito |
|---|------------|---------|-----------|
| 1 | **ProductVSL** | `vsl/ProductVSL.tsx` | VSL completo |
| 2 | **AgitationSection** | `vsl/agitation-section.tsx` | Agitação do problema |
| 3 | **CredentialsSection** | `vsl/credentials-section.tsx` | Credibilidade |
| 4 | **GuaranteeSection** | `vsl/guarantee-section.tsx` | Garantias |
| 5 | **SolutionSection** | `vsl/solution-section.tsx` | Apresentação da solução |
| 6 | **TestimonialsSection** | `vsl/testimonials-section.tsx` | Provas sociais |
| 7 | **UrgencyBanner** | `vsl/urgency-banner.tsx` | Urgência/escassez |
| 8 | **SEOHead** | `vsl/seo-head.tsx` | Meta tags |

---

## 📈 CHARTS COMPONENTS

Componentes de gráficos e visualização de dados.

### 1. LeadsChart
**Arquivo:** `src/components/charts/LeadsChart.tsx`
**Tipo:** Line Chart
**Dependências:** `recharts`

**Features:**
- ✅ Gráfico de linha temporal
- ✅ Múltiplas séries
- ✅ Tooltip interativo
- ✅ Responsive
- ✅ Dark mode support

**Props:**
```typescript
interface LeadsChartProps {
  data: Array<{
    date: string
    total: number
    qualified: number
    converted: number
  }>
}
```

---

## 🧩 APPOINTMENT COMPONENTS

### 1. AvailableSlotsPicker
**Arquivo:** `src/components/appointments/AvailableSlotsPicker.tsx`
**Tipo:** Datetime Picker

**Features:**
- ✅ Integração Google Calendar
- ✅ Disponibilidade em tempo real
- ✅ Timezone support
- ✅ Bloqueio de horários passados

---

## 🎨 DESIGN TOKENS

### Colors
```css
--primary: 217 91% 60%        /* Blue */
--secondary: 215 20% 65%       /* Gray */
--destructive: 0 84% 60%       /* Red */
--success: 142 76% 36%         /* Green */
--warning: 38 92% 50%          /* Orange */
```

### Typography
- **Font Primary:** `var(--font-geist-sans)` (Geist Sans)
- **Font Mono:** `var(--font-geist-mono)` (Geist Mono)

### Spacing Scale
```
xs: 0.25rem  (4px)
sm: 0.5rem   (8px)
md: 1rem     (16px)
lg: 1.5rem   (24px)
xl: 2rem     (32px)
2xl: 3rem    (48px)
```

### Border Radius
```
sm: 0.375rem  (6px)
md: 0.5rem    (8px)
lg: 0.75rem   (12px)
xl: 1rem      (16px)
```

---

## 🔌 INTEGRATIONS

### Component Dependencies

**Core:**
- React 18
- Next.js 14
- TypeScript 5
- Tailwind CSS 3

**UI Library:**
- shadcn/ui
- Radix UI
- Lucide React (icons)
- Framer Motion (animations)

**Forms:**
- React Hook Form
- Zod (validation)

**Charts:**
- Recharts

**AI/Chat:**
- OpenAI SDK
- D-ID SDK (avatar)

**Backend:**
- Supabase Client
- Axios

---

## 📝 USAGE GUIDELINES

### Importing Components

```tsx
// UI Components
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Chat Components
import { ChatAssistant } from '@/components/chat'

// Admin Components
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'

// Marketing Components
import { DualHero } from '@/components/marketing/dual-hero'
```

### Component Patterns

**1. Server Components (default):**
```tsx
// src/app/page.tsx
import { HeroSection } from '@/components/marketing/HeroSection'

export default function HomePage() {
  return <HeroSection />
}
```

**2. Client Components:**
```tsx
'use client'

import { useState } from 'react'
import { ChatAssistant } from '@/components/chat'

export default function ChatPage() {
  const [isOpen, setIsOpen] = useState(false)

  return <ChatAssistant autoOpen={isOpen} />
}
```

**3. Dynamic Imports (code splitting):**
```tsx
import dynamic from 'next/dynamic'

const ChatAssistant = dynamic(
  () => import('@/components/chat').then(mod => ({ default: mod.ChatAssistant })),
  { ssr: false }
)
```

---

## ✅ ACCESSIBILITY

Todos os componentes seguem:
- ✅ WCAG 2.1 Level AA
- ✅ ARIA attributes corretos
- ✅ Navegação por teclado
- ✅ Screen reader support
- ✅ Focus management
- ✅ Color contrast ratios

---

## 🧪 TESTING

**Unit Tests:**
- Jest + React Testing Library
- Coverage > 60% (target: 80%)

**E2E Tests:**
- Playwright (pendente)

**Visual Regression:**
- Chromatic (pendente)

---

## 📚 ADDITIONAL RESOURCES

- [Figma Design System](https://figma.com) (pendente)
- [Storybook](http://localhost:6006) (pendente)
- [Component API Docs](#) (este arquivo)

---

## 📋 COMPONENT CHECKLIST

Ao criar um novo componente, garantir:

- [ ] TypeScript types definidos
- [ ] Props interface exportada
- [ ] Default props quando aplicável
- [ ] Acessibilidade (ARIA)
- [ ] Responsive design
- [ ] Dark mode support
- [ ] Documentação inline (JSDoc)
- [ ] Testes unitários
- [ ] Exemplo de uso
- [ ] Adicionado a este arquivo

---

## 🔄 CHANGELOG

### v1.0 (31/12/2024)
- ✅ Documentação inicial
- ✅ 90+ componentes catalogados
- ✅ Categorização por área
- ✅ Props interfaces
- ✅ Exemplos de uso

---

**Mantido por:** MANUS v7.0 Documentation System
**Última atualização:** 31/12/2024
**Próxima revisão:** Fevereiro 2025
