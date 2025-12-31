# 06 - BIBLIOTECA DE COMPONENTES

Catalogo de todos os componentes reutilizaveis da plataforma.

---

## 1. COMPONENTES UI (shadcn/ui)

### 1.1 Instalados

```bash
# Lista completa de componentes shadcn/ui
src/components/ui/
├── avatar.tsx
├── badge.tsx
├── button.tsx
├── card.tsx
├── checkbox.tsx
├── dialog.tsx
├── dropdown-menu.tsx
├── input.tsx
├── label.tsx
├── progress.tsx
├── radio-group.tsx
├── select.tsx
├── separator.tsx
├── skeleton.tsx
├── switch.tsx
├── tabs.tsx
├── toast.tsx
├── toaster.tsx
└── use-toast.ts
```

### 1.2 Button

```tsx
import { Button } from "@/components/ui/button"

// Variantes
<Button variant="default">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
<Button variant="destructive">Destructive</Button>

// Tamanhos
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Icon /></Button>

// Estados
<Button disabled>Disabled</Button>
<Button loading>Loading...</Button>
```

### 1.3 Card

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Titulo</CardTitle>
    <CardDescription>Descricao</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Conteudo do card</p>
  </CardContent>
  <CardFooter>
    <Button>Acao</Button>
  </CardFooter>
</Card>
```

### 1.4 Input

```tsx
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input
    id="email"
    type="email"
    placeholder="seu@email.com"
  />
</div>
```

### 1.5 Dialog

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

<Dialog>
  <DialogTrigger asChild>
    <Button>Abrir</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Titulo</DialogTitle>
      <DialogDescription>Descricao</DialogDescription>
    </DialogHeader>
    {/* Conteudo */}
  </DialogContent>
</Dialog>
```

### 1.6 Toast

```tsx
import { useToast } from "@/components/ui/use-toast"

const { toast } = useToast()

toast({
  title: "Sucesso!",
  description: "Operacao realizada com sucesso.",
})

// Variantes
toast({ variant: "default" })
toast({ variant: "destructive" })
```

---

## 2. COMPONENTES CUSTOMIZADOS

### 2.1 Dashboard Components

```bash
src/components/dashboard/
├── sidebar.tsx      # Menu lateral
├── header.tsx       # Header com user menu
├── stats-card.tsx   # Cards de estatisticas
└── process-card.tsx # Card de processo
```

#### StatsCard

```tsx
import { StatsCard } from "@/components/dashboard/stats-card"

<StatsCard
  title="Total de Leads"
  value={150}
  change="+12%"
  changeType="positive"
  icon={<Users />}
/>
```

#### Sidebar

```tsx
import { Sidebar } from "@/components/dashboard/sidebar"

// Menu items
const menuItems = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Processos", href: "/dashboard/processos", icon: FileText },
  { label: "Documentos", href: "/dashboard/documentos", icon: Folder },
]

<Sidebar items={menuItems} />
```

### 2.2 Checkout Components

```bash
src/components/checkout/
├── service-selector.tsx  # Grid de selecao de servicos
└── order-summary.tsx     # Resumo do pedido
```

#### ServiceSelector

```tsx
import { ServiceSelector } from "@/components/checkout/service-selector"

<ServiceSelector
  services={services}
  selected={selectedService}
  onSelect={setSelectedService}
/>
```

### 2.3 Marketing Components

```bash
src/app/(marketing)/components/
├── navbar.tsx       # Navegacao principal
├── footer.tsx       # Rodape
├── hero.tsx         # Hero section
├── services.tsx     # Grid de servicos
├── timeline.tsx     # Timeline historica
└── contact-form.tsx # Formulario de contato
```

#### Navbar

```tsx
// Componentes internos
- Logo
- Navigation links
- Mobile menu (hamburger)
- CTA button "Entrar"
```

#### Timeline

```tsx
// Eventos da timeline
const events = [
  { year: "1661", title: "Fundacao", description: "..." },
  { year: "2025", title: "Era Digital", description: "..." },
]

<Timeline events={events} />
```

---

## 3. COMPONENTES DE FORMULARIO

### 3.1 React Hook Form + Zod

```tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  email: z.string().email("Email invalido"),
  phone: z.string().regex(/^\(\d{2}\) \d{5}-\d{4}$/, "Telefone invalido"),
})

const form = useForm({
  resolver: zodResolver(schema),
  defaultValues: { name: "", email: "", phone: "" }
})
```

### 3.2 FormField Pattern

```tsx
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input placeholder="email@exemplo.com" {...field} />
          </FormControl>
          <FormDescription>
            Seu email para contato
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
    <Button type="submit">Enviar</Button>
  </form>
</Form>
```

### 3.3 Mascaras de Input

```tsx
// Telefone
const formatPhone = (value: string) => {
  const cleaned = value.replace(/\D/g, '')
  if (cleaned.length <= 2) return `(${cleaned}`
  if (cleaned.length <= 7) return `(${cleaned.slice(0,2)}) ${cleaned.slice(2)}`
  return `(${cleaned.slice(0,2)}) ${cleaned.slice(2,7)}-${cleaned.slice(7,11)}`
}

// CPF
const formatCPF = (value: string) => {
  const cleaned = value.replace(/\D/g, '')
  if (cleaned.length <= 3) return cleaned
  if (cleaned.length <= 6) return `${cleaned.slice(0,3)}.${cleaned.slice(3)}`
  if (cleaned.length <= 9) return `${cleaned.slice(0,3)}.${cleaned.slice(3,6)}.${cleaned.slice(6)}`
  return `${cleaned.slice(0,3)}.${cleaned.slice(3,6)}.${cleaned.slice(6,9)}-${cleaned.slice(9,11)}`
}
```

---

## 4. COMPONENTES DE LAYOUT

### 4.1 Container

```tsx
<div className="container mx-auto px-4 md:px-6 lg:px-8">
  {children}
</div>
```

### 4.2 Section

```tsx
<section className="py-12 md:py-16 lg:py-24">
  <div className="container">
    {children}
  </div>
</section>
```

### 4.3 Grid

```tsx
// Grid responsivo
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>
```

---

## 5. COMPONENTES DE FEEDBACK

### 5.1 Loading States

```tsx
import { Skeleton } from "@/components/ui/skeleton"

// Card skeleton
<Card>
  <CardHeader>
    <Skeleton className="h-6 w-1/2" />
  </CardHeader>
  <CardContent>
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-3/4 mt-2" />
  </CardContent>
</Card>

// Spinner
<div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
```

### 5.2 Empty States

```tsx
<div className="flex flex-col items-center justify-center py-12 text-center">
  <FileX className="h-12 w-12 text-muted-foreground mb-4" />
  <h3 className="text-lg font-semibold">Nenhum item encontrado</h3>
  <p className="text-muted-foreground mt-1">
    Tente ajustar os filtros ou adicione um novo item.
  </p>
  <Button className="mt-4">Adicionar</Button>
</div>
```

### 5.3 Error States

```tsx
<div className="flex flex-col items-center justify-center py-12 text-center">
  <AlertCircle className="h-12 w-12 text-destructive mb-4" />
  <h3 className="text-lg font-semibold">Algo deu errado</h3>
  <p className="text-muted-foreground mt-1">
    Nao foi possivel carregar os dados.
  </p>
  <Button variant="outline" className="mt-4" onClick={retry}>
    Tentar novamente
  </Button>
</div>
```

---

## 6. COMPONENTES DE NAVEGACAO

### 6.1 Breadcrumb

```tsx
<nav className="flex text-sm text-muted-foreground">
  <Link href="/dashboard">Dashboard</Link>
  <ChevronRight className="h-4 w-4 mx-2" />
  <Link href="/dashboard/processos">Processos</Link>
  <ChevronRight className="h-4 w-4 mx-2" />
  <span className="text-foreground">Detalhes</span>
</nav>
```

### 6.2 Pagination

```tsx
<div className="flex items-center justify-between">
  <p className="text-sm text-muted-foreground">
    Mostrando 1-10 de 100 resultados
  </p>
  <div className="flex gap-2">
    <Button variant="outline" size="sm" disabled={page === 1}>
      Anterior
    </Button>
    <Button variant="outline" size="sm" disabled={page === totalPages}>
      Proximo
    </Button>
  </div>
</div>
```

### 6.3 Tabs

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Visao Geral</TabsTrigger>
    <TabsTrigger value="details">Detalhes</TabsTrigger>
    <TabsTrigger value="history">Historico</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">...</TabsContent>
  <TabsContent value="details">...</TabsContent>
  <TabsContent value="history">...</TabsContent>
</Tabs>
```

---

## 7. HOOKS CUSTOMIZADOS

### 7.1 useToast

```tsx
import { useToast } from "@/components/ui/use-toast"

const { toast } = useToast()

// Sucesso
toast({
  title: "Salvo!",
  description: "Suas alteracoes foram salvas.",
})

// Erro
toast({
  variant: "destructive",
  title: "Erro",
  description: "Nao foi possivel salvar.",
})
```

### 7.2 useMediaQuery

```tsx
const isMobile = useMediaQuery("(max-width: 768px)")
```

---

## 8. PATTERNS

### 8.1 Client vs Server Components

```tsx
// Server Component (default)
// src/app/page.tsx
export default async function Page() {
  const data = await fetchData()
  return <div>{data}</div>
}

// Client Component
// src/components/counter.tsx
'use client'
export function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
```

### 8.2 Composition Pattern

```tsx
// Componente composto
<Card>
  <Card.Header>
    <Card.Title>Titulo</Card.Title>
  </Card.Header>
  <Card.Body>Conteudo</Card.Body>
  <Card.Footer>Footer</Card.Footer>
</Card>
```

### 8.3 Render Props

```tsx
<DataFetcher url="/api/data">
  {({ data, loading, error }) => {
    if (loading) return <Skeleton />
    if (error) return <Error />
    return <DataDisplay data={data} />
  }}
</DataFetcher>
```
