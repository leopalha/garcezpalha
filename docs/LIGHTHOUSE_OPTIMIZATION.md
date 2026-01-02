# Lighthouse Optimization - Garcez Palha

## Metas de Performance

| Categoria | Meta | Atual (Estimado) |
|-----------|------|------------------|
| Performance | 90+ | ~85 |
| Accessibility | 100 | ~95 |
| Best Practices | 100 | ~90 |
| SEO | 100 | ~95 |
| PWA | 90+ | ~80 |

## Performance (90+)

### Métricas Core Web Vitals

#### 1. LCP (Largest Contentful Paint) - < 2.5s

**Implementado:**
- ✅ Next.js Image optimization
- ✅ Preload critical fonts
- ✅ Server-side rendering
- ✅ CDN (Vercel Edge)

**A fazer:**
- [ ] Implementar `priority` em imagens hero
- [ ] Otimizar fontes customizadas
- [ ] Lazy load imagens below-the-fold

```tsx
// Hero images devem ter priority
<Image
  src="/hero.jpg"
  alt="Hero"
  priority
  width={1200}
  height={600}
/>
```

#### 2. FID (First Input Delay) - < 100ms

**Implementado:**
- ✅ React 18 com Concurrent Rendering
- ✅ Code splitting automático
- ✅ Componentes client-side otimizados

**A fazer:**
- [ ] Usar web workers para tarefas pesadas
- [ ] Debounce/throttle em inputs

#### 3. CLS (Cumulative Layout Shift) - < 0.1

**Implementado:**
- ✅ Dimensões fixas em imagens
- ✅ Skeleton loaders
- ✅ CSS sem font-display: swap excessivo

**A fazer:**
- [ ] Adicionar `aspect-ratio` em todos containers de imagem
- [ ] Reserved space para anúncios/widgets dinâmicos

### Otimizações de Carregamento

#### Fonts

```typescript
// app/layout.tsx
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // Fallback enquanto carrega
  preload: true,
  variable: '--font-inter',
})
```

#### Critical CSS

Next.js já injeta CSS crítico automaticamente.

#### Resource Hints

```tsx
// Preconnect para APIs externas
<link rel="preconnect" href="https://api.supabase.co" />
<link rel="dns-prefetch" href="https://api.mercadopago.com" />
```

## Accessibility (100)

### Implementado

- ✅ Semantic HTML (header, nav, main, footer, article, section)
- ✅ ARIA labels em componentes interativos
- ✅ Keyboard navigation
- ✅ Focus indicators visíveis
- ✅ Color contrast 4.5:1+ para texto
- ✅ Alt text em todas as imagens

### Checklist

- [x] Todos botões têm labels ou aria-label
- [x] Todos inputs têm labels associados
- [x] Headings em ordem hierárquica (h1 → h2 → h3)
- [x] Links têm texto descritivo (não "clique aqui")
- [x] Forms têm validation messages acessíveis
- [x] Modais têm role="dialog" e aria-labelledby
- [ ] Testes com leitor de tela (NVDA/JAWS)
- [ ] Navegação por teclado em todos fluxos

### Padrões de Acessibilidade

```tsx
// Botão acessível
<Button
  aria-label="Adicionar novo cliente"
  onClick={handleAdd}
>
  <Plus className="h-4 w-4" />
</Button>

// Input acessível
<Label htmlFor="email">Email</Label>
<Input
  id="email"
  type="email"
  aria-required="true"
  aria-invalid={!!errors.email}
  aria-describedby={errors.email ? "email-error" : undefined}
/>
{errors.email && (
  <span id="email-error" className="text-sm text-destructive">
    {errors.email.message}
  </span>
)}

// Modal acessível
<Dialog>
  <DialogContent role="dialog" aria-labelledby="dialog-title">
    <DialogTitle id="dialog-title">Título do Modal</DialogTitle>
    ...
  </DialogContent>
</Dialog>
```

## Best Practices (100)

### Implementado

- ✅ HTTPS (Vercel fornece automaticamente)
- ✅ Sem erros de console em produção
- ✅ Cookies seguros (httpOnly, secure, sameSite)
- ✅ CSP (Content Security Policy) básico
- ✅ No `eval()` ou código inseguro
- ✅ Libraries atualizadas

### Security Headers

```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}
```

## SEO (100)

### Meta Tags

```tsx
// app/layout.tsx ou page.tsx
export const metadata: Metadata = {
  title: 'Garcez Palha - Advocacia Jurídica',
  description: 'Plataforma completa de gestão jurídica e captura de leads',
  openGraph: {
    title: 'Garcez Palha',
    description: 'Advocacia moderna com tecnologia',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Garcez Palha',
    description: 'Advocacia moderna com tecnologia',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}
```

### Sitemap

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://garcezpalha.com.br',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://garcezpalha.com.br/servicos',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // ...
  ]
}
```

### robots.txt

```typescript
// app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/dashboard/'],
    },
    sitemap: 'https://garcezpalha.com.br/sitemap.xml',
  }
}
```

### Structured Data (JSON-LD)

```tsx
<script type="application/ld+json">
{JSON.stringify({
  "@context": "https://schema.org",
  "@type": "LegalService",
  "name": "Garcez Palha Advocacia",
  "url": "https://garcezpalha.com.br",
  "logo": "https://garcezpalha.com.br/logo.png",
  "description": "Escritório de advocacia especializado",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "BR"
  }
})}
</script>
```

## PWA (90+)

### Manifest

```json
// public/manifest.json
{
  "name": "Garcez Palha",
  "short_name": "Garcez Palha",
  "description": "Plataforma jurídica completa",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#0080ff",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

### Service Worker

```typescript
// public/sw.js (básico)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v1').then((cache) => {
      return cache.addAll([
        '/',
        '/offline.html',
      ])
    })
  )
})
```

## Ferramentas de Auditoria

### 1. Lighthouse CLI

```bash
# Instalar
npm install -g @lhci/cli

# Rodar
lhci autorun --collect.url=https://garcezpalha.com.br
```

### 2. PageSpeed Insights

https://pagespeed.web.dev/

### 3. WebPageTest

https://www.webpagetest.org/

### 4. Chrome DevTools

- Network tab: Waterfall de requests
- Performance tab: Timeline de rendering
- Lighthouse tab: Auditoria completa

## Monitoramento Contínuo

### CI/CD Integration

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [push]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            https://garcezpalha-preview.vercel.app
          configPath: './lighthouserc.json'
```

### Configuração

```json
// lighthouserc.json
{
  "ci": {
    "collect": {
      "numberOfRuns": 3
    },
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.9}],
        "categories:accessibility": ["error", {"minScore": 1.0}],
        "categories:best-practices": ["error", {"minScore": 1.0}],
        "categories:seo": ["error", {"minScore": 1.0}]
      }
    }
  }
}
```

## Checklist Final

### Performance
- [x] Next.js Image para todas imagens
- [x] Lazy loading de componentes pesados
- [x] Code splitting por rota
- [x] Font optimization
- [ ] Resource hints (preconnect, dns-prefetch)
- [ ] Bundle analyzer configurado

### Accessibility
- [x] Semantic HTML
- [x] ARIA labels
- [x] Keyboard navigation
- [x] Color contrast
- [ ] Screen reader testing

### Best Practices
- [x] HTTPS
- [x] No console errors
- [ ] Security headers
- [x] Cookies seguros

### SEO
- [x] Meta tags
- [ ] Sitemap
- [ ] robots.txt
- [ ] Structured data

### PWA
- [ ] Manifest
- [ ] Service worker
- [ ] Offline page
- [ ] Install prompt

## Prioridades

1. **Crítico** (Fazer agora):
   - Security headers
   - Sitemap e robots.txt
   - PWA manifest

2. **Importante** (Próximas 2 semanas):
   - Service worker básico
   - Screen reader testing
   - Bundle analyzer

3. **Desejável** (Futuro):
   - CI/CD Lighthouse
   - Advanced PWA features
   - Performance monitoring

## Resultados Esperados

Com todas otimizações implementadas:

- Performance: 95+
- Accessibility: 100
- Best Practices: 100
- SEO: 100
- PWA: 90+

**Overall Score: 97+**
