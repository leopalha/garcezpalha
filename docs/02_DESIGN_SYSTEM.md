# 02 - DESIGN SYSTEM

Sistema de design da plataforma Garcez Palha.

---

## 1. IDENTIDADE VISUAL

### 1.1 Cores Principais

```css
/* Tema Padrao: Corporate (Dark Blue + Platinum) */

/* Primarias */
--primary: #1e3a5f;        /* Navy Blue - Cor principal */
--primary-foreground: #ffffff;

/* Secundarias */
--secondary: #c9a227;      /* Dourado - Acentos */
--secondary-foreground: #1e3a5f;

/* Background */
--background: #ffffff;
--foreground: #1e3a5f;

/* Muted */
--muted: #f1f5f9;
--muted-foreground: #64748b;

/* Cards */
--card: #ffffff;
--card-foreground: #1e3a5f;

/* Borders */
--border: #e2e8f0;
--ring: #c9a227;
```

### 1.2 Temas Disponiveis

| Tema | Primary | Secondary | Uso |
|------|---------|-----------|-----|
| Corporate | Navy #1e3a5f | Gold #c9a227 | **Padrao** |
| Classic | Wine #722f37 | Gold #d4af37 | Tradicional |
| Navy Blue | Navy #0a192f | Gold #ffd700 | Alternativo |
| Prussian | Prussian #003153 | Silver #c0c0c0 | Moderno |
| Slate | Slate #334155 | Amber #f59e0b | Clean |

### 1.3 Tipografia

```css
/* Titulos - Elegancia tradicional */
--font-heading: 'Playfair Display', 'Cormorant Garamond', serif;

/* Corpo - Legibilidade */
--font-body: 'Inter', system-ui, sans-serif;

/* Codigo - Monospace */
--font-mono: 'JetBrains Mono', monospace;
```

**Escalas**:
- h1: 2.5rem (40px)
- h2: 2rem (32px)
- h3: 1.5rem (24px)
- h4: 1.25rem (20px)
- body: 1rem (16px)
- small: 0.875rem (14px)

---

## 2. COMPONENTES UI

### 2.1 Biblioteca Base

Utilizamos **shadcn/ui** como base, com customizacoes:

```bash
# Componentes instalados
npx shadcn@latest add button card input label
npx shadcn@latest add dialog dropdown-menu select
npx shadcn@latest add tabs toast badge progress
npx shadcn@latest add avatar separator checkbox switch
npx shadcn@latest add radio-group skeleton
```

### 2.2 Botoes

```tsx
// Variantes
<Button variant="default">Primary</Button>     // Navy
<Button variant="secondary">Secondary</Button> // Gold
<Button variant="outline">Outline</Button>     // Bordered
<Button variant="ghost">Ghost</Button>         // Transparent
<Button variant="destructive">Delete</Button>  // Red

// Tamanhos
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Icon /></Button>
```

### 2.3 Cards

```tsx
// Card padrao
<Card>
  <CardHeader>
    <CardTitle>Titulo</CardTitle>
    <CardDescription>Descricao</CardDescription>
  </CardHeader>
  <CardContent>Conteudo</CardContent>
  <CardFooter>Footer</CardFooter>
</Card>

// Card de servico
<Card className="hover:shadow-lg transition-shadow">
  <CardHeader className="pb-2">
    <Icon className="h-8 w-8 text-primary" />
    <CardTitle>Direito Imobiliario</CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-muted-foreground">Descricao do servico...</p>
  </CardContent>
</Card>
```

### 2.4 Formularios

```tsx
// Input com label
<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input
    id="email"
    type="email"
    placeholder="seu@email.com"
  />
</div>

// Com validacao (react-hook-form + zod)
<FormField
  control={form.control}
  name="email"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Email</FormLabel>
      <FormControl>
        <Input {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

---

## 3. LAYOUT

### 3.1 Grid System

```tsx
// Container padrao
<div className="container mx-auto px-4 md:px-6 lg:px-8">

// Grid responsivo
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Flexbox
<div className="flex flex-col md:flex-row items-center justify-between gap-4">
```

### 3.2 Breakpoints

| Breakpoint | Largura | Classe |
|------------|---------|--------|
| Mobile | < 640px | `sm:` |
| Tablet | 640px | `md:` |
| Desktop | 1024px | `lg:` |
| Wide | 1280px | `xl:` |
| Ultra | 1536px | `2xl:` |

### 3.3 Espacamento

```css
/* Escala de espacamento (rem) */
1: 0.25rem (4px)
2: 0.5rem (8px)
3: 0.75rem (12px)
4: 1rem (16px)
6: 1.5rem (24px)
8: 2rem (32px)
12: 3rem (48px)
16: 4rem (64px)
```

---

## 4. ANIMACOES

### 4.1 Framer Motion

```tsx
// Fade in
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>

// Hover scale
<motion.div whileHover={{ scale: 1.05 }}>

// Stagger children
<motion.div
  variants={{
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }}
  initial="hidden"
  animate="show"
>
```

### 4.2 CSS Transitions

```css
/* Transicoes padrao */
.transition-colors { transition: color 150ms; }
.transition-shadow { transition: box-shadow 150ms; }
.transition-all { transition: all 200ms; }

/* Hover states */
.hover\:shadow-lg:hover {
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}
```

---

## 5. ICONES

### 5.1 Lucide React

```tsx
import {
  Home, User, Settings, Search,
  Mail, Phone, MapPin, Calendar,
  FileText, Scale, Building, Shield,
  ChevronRight, ArrowLeft, X, Check,
  AlertCircle, Info, AlertTriangle
} from 'lucide-react'

// Uso
<Home className="h-5 w-5" />
<Mail className="h-4 w-4 text-muted-foreground" />
```

### 5.2 Tamanhos Padrao

| Contexto | Tamanho | Classe |
|----------|---------|--------|
| Inline | 16px | `h-4 w-4` |
| Button | 20px | `h-5 w-5` |
| Card | 24px | `h-6 w-6` |
| Hero | 32px | `h-8 w-8` |
| Feature | 48px | `h-12 w-12` |

---

## 6. IMAGENS

### 6.1 Next/Image

```tsx
import Image from 'next/image'

// Com aspect ratio
<div className="relative aspect-video">
  <Image
    src="/images/hero.jpg"
    alt="Hero"
    fill
    className="object-cover"
    priority
  />
</div>

// Avatar
<Image
  src="/images/avatar.jpg"
  alt="Avatar"
  width={40}
  height={40}
  className="rounded-full"
/>
```

### 6.2 Otimizacao

- Formato: WebP preferido
- Lazy loading: Padrao
- Placeholder: blur
- Sizes: Responsivo

---

## 7. ACESSIBILIDADE

### 7.1 WCAG 2.1 AA

- Contraste minimo: 4.5:1 (texto normal)
- Contraste minimo: 3:1 (texto grande)
- Focus visible em todos elementos interativos
- Labels em todos inputs
- Alt text em todas imagens

### 7.2 Implementacao

```tsx
// Focus ring
<Button className="focus-visible:ring-2 focus-visible:ring-ring">

// SR-only labels
<span className="sr-only">Fechar menu</span>

// ARIA
<button aria-label="Abrir menu" aria-expanded={isOpen}>
```

---

## 8. DARK MODE

### 8.1 Configuracao

```tsx
// tailwind.config.ts
{
  darkMode: 'class',
}

// Uso
<html className={theme === 'dark' ? 'dark' : ''}>
```

### 8.2 Classes Dark

```css
/* Exemplo de classes dark */
.bg-background { @apply dark:bg-slate-900; }
.text-foreground { @apply dark:text-slate-100; }
.border-border { @apply dark:border-slate-700; }
```

**Nota**: Dark mode esta preparado mas nao ativado por padrao para manter identidade corporativa.

---

## 9. RESPONSIVIDADE

### 9.1 Mobile First

```tsx
// Padrao mobile-first
<div className="
  p-4          // Mobile: padding 16px
  md:p-6       // Tablet: padding 24px
  lg:p-8       // Desktop: padding 32px
">

// Navegacao
<nav className="
  fixed bottom-0 left-0 right-0  // Mobile: bottom nav
  md:static md:top-0             // Desktop: top nav
">
```

### 9.2 Componentes Responsivos

| Componente | Mobile | Desktop |
|------------|--------|---------|
| Navbar | Hamburger menu | Links visíveis |
| Sidebar | Drawer | Fixed |
| Cards | 1 coluna | 2-3 colunas |
| Tables | Scroll horizontal | Visível |

---

## 10. TOKENS DE DESIGN

### 10.1 CSS Variables

```css
:root {
  /* Cores */
  --primary: 222.2 47.4% 24.5%;
  --secondary: 45 85% 47%;

  /* Radius */
  --radius: 0.5rem;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}
```

### 10.2 Tailwind Config

```typescript
// tailwind.config.ts
{
  theme: {
    extend: {
      colors: {
        primary: 'hsl(var(--primary))',
        secondary: 'hsl(var(--secondary))',
        // ...
      },
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
}
```
