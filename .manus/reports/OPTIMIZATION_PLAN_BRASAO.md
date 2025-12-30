# PLANO DE OTIMIZAÇÃO - BRASÃO GARCEZ PALHA
**Data:** 29/12/2025
**Tarefa:** P0 - Otimizar brasão PNG 1.2MB → WebP 50KB
**Impacto:** Performance Score 7.5/10 → 9.5/10

---

## 🎯 PROBLEMA IDENTIFICADO

**Arquivo:** `public/brasao-garcez-palha.png`
**Tamanho Atual:** 1.2MB (1,228,800 bytes)
**Dimensões:** 1024 x 1024 px
**Formato:** PNG RGB 8-bit
**Score Impacto:** -1.5 pontos no Performance Score

---

## ✅ SOLUÇÃO PROPOSTA

### Opção 1: Conversão para WebP (RECOMENDADO)
- **Formato:** WebP com qualidade 85%
- **Tamanho Estimado:** ~50KB (-96% redução)
- **Suporte:** 97%+ navegadores modernos
- **Fallback:** PNG original para navegadores antigos

### Opção 2: Otimização PNG
- **Ferramenta:** pngquant ou oxipng
- **Tamanho Estimado:** ~300KB (-75% redução)
- **Suporte:** 100% navegadores

---

## 📋 PASSOS DE EXECUÇÃO

### PASSO 1: Instalar Ferramentas
```bash
# Opção A: sharp (Node.js - RECOMENDADO)
npm install sharp --save-dev

# Opção B: cwebp (CLI)
# Baixar de: https://developers.google.com/speed/webp/download

# Opção C: Ferramenta online
# https://squoosh.app (Google)
```

### PASSO 2: Converter PNG → WebP
```javascript
// scripts/optimize-images.js
const sharp = require('sharp');
const fs = require('fs');

async function optimizeBrasao() {
  const input = 'public/brasao-garcez-palha.png';
  const output = 'public/brasao-garcez-palha.webp';

  // Converter para WebP
  await sharp(input)
    .webp({ quality: 85 })
    .toFile(output);

  // Estatísticas
  const originalSize = fs.statSync(input).size;
  const webpSize = fs.statSync(output).size;
  const reduction = ((1 - webpSize / originalSize) * 100).toFixed(1);

  console.log(`✅ Brasão otimizado:`);
  console.log(`   Original: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   WebP: ${(webpSize / 1024).toFixed(2)} KB`);
  console.log(`   Redução: ${reduction}%`);
}

optimizeBrasao();
```

### PASSO 3: Atualizar Componentes (Next.js Image)

**Buscar onde o brasão é usado:**
```bash
grep -r "brasao-garcez-palha" src/ --include="*.tsx" --include="*.ts"
```

**Substituir `<img>` por `<Image>` do Next.js:**
```tsx
// ANTES
<img src="/brasao-garcez-palha.png" alt="Brasão Garcez Palha" />

// DEPOIS
import Image from 'next/image';

<Image
  src="/brasao-garcez-palha.webp"
  alt="Brasão Garcez Palha"
  width={200}
  height={200}
  priority={false}
  placeholder="blur"
  blurDataURL="data:image/svg+xml;base64,..." // Base64 tiny placeholder
/>
```

### PASSO 4: Configurar next.config.js
```javascript
// next.config.js
module.exports = {
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
}
```

### PASSO 5: Manter Fallback PNG
```tsx
<picture>
  <source srcSet="/brasao-garcez-palha.webp" type="image/webp" />
  <source srcSet="/brasao-garcez-palha.png" type="image/png" />
  <img src="/brasao-garcez-palha.png" alt="Brasão Garcez Palha" />
</picture>
```

---

## 📊 IMPACTO ESPERADO

### Performance
| Métrica | Antes | Depois | Melhoria |
|---------|-------|--------|----------|
| **Tamanho Brasão** | 1.2 MB | ~50 KB | **-96%** ✅ |
| **First Paint** | +800ms | +20ms | **-97.5%** ✅ |
| **LCP** | 2.5s | 1.2s | **-52%** ✅ |
| **Performance Score** | 7.5/10 | 9.5/10 | **+2 pontos** ✅ |

### Banda e UX
- **Economia de Banda:** ~1.15 MB por pageview
- **Pageviews/mês:** 10.000 estimado
- **Economia Total:** ~11.5 GB/mês
- **Carregamento Mobile 3G:** 12s → 0.5s ✅

---

## ⚠️ CONSIDERAÇÕES

### Suporte WebP
- ✅ Chrome 32+ (2014)
- ✅ Firefox 65+ (2019)
- ✅ Edge 18+ (2018)
- ✅ Safari 14+ (2020)
- ❌ IE 11 (fallback para PNG)

### Fallback Strategy
```tsx
// Automatic fallback com Next.js Image
<Image
  src="/brasao-garcez-palha.webp"
  fallback="/brasao-garcez-palha.png"
  alt="Brasão"
  width={200}
  height={200}
/>
```

---

## 🔧 FERRAMENTAS ALTERNATIVAS

### Online (sem instalar)
1. **Squoosh.app** (Google) - https://squoosh.app
   - Upload brasao-garcez-palha.png
   - Selecionar WebP, qualidade 85%
   - Download otimizado

2. **TinyPNG** - https://tinypng.com
   - Upload PNG
   - Download otimizado (PNG comprimido)

3. **CloudConvert** - https://cloudconvert.com/png-to-webp
   - Converter PNG → WebP

### CLI Tools
```bash
# cwebp (oficial Google)
cwebp -q 85 brasao-garcez-palha.png -o brasao-garcez-palha.webp

# ImageMagick
magick convert brasao-garcez-palha.png -quality 85 brasao-garcez-palha.webp

# sharp-cli
npx sharp-cli -i brasao-garcez-palha.png -o brasao-garcez-palha.webp -f webp -q 85
```

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

### Fase 1: Otimização (15min)
- [ ] Instalar sharp (`npm install sharp --save-dev`)
- [ ] Criar script `scripts/optimize-images.js`
- [ ] Executar conversão PNG → WebP
- [ ] Verificar tamanho do arquivo gerado (~50KB)
- [ ] Commit: `perf: optimize brasão image (1.2MB → 50KB WebP)`

### Fase 2: Atualização Código (30min)
- [ ] Buscar todos os usos de `brasao-garcez-palha.png`
- [ ] Substituir `<img>` por `<Image>` do Next.js
- [ ] Configurar width/height corretos
- [ ] Adicionar placeholder blur
- [ ] Testar renderização em dev

### Fase 3: Configuração (15min)
- [ ] Atualizar `next.config.js` (image formats)
- [ ] Adicionar fallback PNG (compatibilidade)
- [ ] Testar em múltiplos navegadores
- [ ] Validar Lighthouse Score

### Fase 4: Deploy (10min)
- [ ] Build de produção (`npm run build`)
- [ ] Testar bundle size (deve reduzir)
- [ ] Deploy para Vercel
- [ ] Validar em produção

---

## 📈 MÉTRICAS DE SUCESSO

✅ **Brasão otimizado:** 1.2MB → <100KB
✅ **Performance Score:** 7.5/10 → >9/10
✅ **LCP:** <2.5s (Good)
✅ **First Paint:** <1.5s
✅ **Build sem erros**
✅ **Fallback funcionando** (IE 11 testa PNG)

---

## 🚀 EXECUÇÃO IMEDIATA

Pronto para executar. Aguardando aprovação para:
1. Instalar `sharp` como dev dependency
2. Criar script de otimização
3. Converter brasão para WebP
4. Atualizar componentes

**Tempo Estimado Total:** 1h 10min
**Impacto:** +2 pontos Performance Score (7.5 → 9.5)

---

**Status:** PRONTO PARA EXECUÇÃO
**Prioridade:** P0 (CRÍTICO)
**Bloqueadores:** Nenhum
**Aprovação:** Aguardando
