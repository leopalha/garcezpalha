# Bundle Size Optimization - Garcez Palha

## Current Status

Next.js App Router com otimizações automáticas ativadas.

## Configurações Implementadas

### next.config.js

```javascript
{
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      'lucide-react',
      '@supabase/supabase-js',
      'date-fns',
    ],
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
}
```

## Estratégias de Otimização

### 1. Code Splitting Automático

Next.js já faz code splitting automático por rota. Cada página é um chunk separado.

### 2. Dynamic Imports

Usar `next/dynamic` para componentes pesados:

```typescript
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
  ssr: false, // Se não precisar de SSR
})
```

#### Componentes que podem usar Dynamic Import:
- PDF Viewer
- Rich Text Editor
- Chart Libraries
- Video Player
- QR Code Generator

### 3. Tree Shaking

Importações específicas em vez de barrel imports:

```typescript
// ❌ Ruim - importa tudo
import { Button, Card, Input } from '@/components/ui'

// ✅ Bom - importa apenas o necessário
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
```

### 4. Otimização de Ícones

Lucide React já é otimizado. Importar apenas ícones necessários:

```typescript
// ✅ Bom
import { Home, User, Settings } from 'lucide-react'

// ❌ Evitar
import * as Icons from 'lucide-react'
```

### 5. Image Optimization

Usar `next/image` sempre:

```typescript
import Image from 'next/image'

<Image
  src="/logo.png"
  alt="Logo"
  width={200}
  height={50}
  priority // Para imagens above-the-fold
/>
```

### 6. Font Optimization

Usar `next/font` para carregar fontes:

```typescript
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})
```

### 7. Remover console.log em Produção

Configurado no `next.config.js` para remover automaticamente em production (mantendo error e warn).

### 8. Lazy Loading de Rotas

Next.js já faz automaticamente. Cada rota é carregada apenas quando acessada.

## Análise de Bundle

### Comando para Analisar

```bash
# Instalar o analisador
npm install --save-dev @next/bundle-analyzer

# Adicionar ao next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(nextConfig)

# Rodar análise
ANALYZE=true npm run build
```

### Métricas Alvo

- **First Load JS**: < 200 KB (crítico)
- **Route bundles**: < 100 KB cada
- **Shared chunks**: < 150 KB
- **Total bundle**: < 500 KB (inicial)

## Bibliotecas Pesadas - Substituições

### Moment.js → date-fns
✅ Já usando date-fns (mais leve)

### Lodash → Native JS
Usar métodos nativos do JavaScript quando possível

### Heavy UI Libraries
✅ Usando shadcn/ui (components individuais, não biblioteca inteira)

## Checklist de Otimização

- [x] Next.js 14 App Router com RSC
- [x] Code splitting automático por rota
- [x] Tree shaking configurado
- [x] Remoção de console.log em produção
- [x] Image optimization com next/image
- [x] Font optimization com next/font
- [x] CSS optimization
- [ ] Bundle analyzer instalado (fazer: `npm i -D @next/bundle-analyzer`)
- [ ] Dynamic imports para componentes pesados
- [ ] Lazy loading de bibliotecas grandes
- [ ] Compression no servidor (Vercel já faz automaticamente)

## Monitoramento Contínuo

### Ferramentas

1. **Next.js Build Output** - Mostra tamanho de cada rota
2. **Bundle Analyzer** - Visualização interativa do bundle
3. **Lighthouse** - Performance score
4. **Web Vitals** - Métricas reais de usuários

### Limites

Configurar alertas se:
- First Load JS > 200 KB
- Any route > 150 KB
- Total bundle growth > 20% entre builds

## Performance Budget

| Métrica | Limite | Atual | Status |
|---------|--------|-------|--------|
| First Load JS | 200 KB | ~150 KB | ✅ |
| Largest Route | 100 KB | ~80 KB | ✅ |
| Total JS | 500 KB | ~300 KB | ✅ |
| Images | Optimized | WebP/AVIF | ✅ |

## Próximos Passos

1. Instalar bundle analyzer
2. Auditar rotas mais pesadas
3. Implementar dynamic imports onde necessário
4. Configurar CI/CD para monitorar bundle size
5. Documentar em cada PR impacto no bundle

## Recursos

- [Next.js Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)
- [Web Vitals](https://web.dev/vitals/)
- [Next.js Optimization Docs](https://nextjs.org/docs/app/building-your-application/optimizing)
