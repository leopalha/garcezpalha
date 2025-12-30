// Script to generate PWA icons from SVG
// Run: node scripts/generate-pwa-icons.js

const fs = require('fs');
const path = require('path');

// Icon sizes needed for PWA
const ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512];

const svgContent = `<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1e3a8a;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#2563eb;stop-opacity:1" />
    </linearGradient>

    <filter id="textShadow">
      <feGaussianBlur in="SourceAlpha" stdDeviation="4"/>
      <feOffset dx="0" dy="4" result="offsetblur"/>
      <feComponentTransfer>
        <feFuncA type="linear" slope="0.4"/>
      </feComponentTransfer>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <rect width="512" height="512" rx="102.4" fill="url(#bgGradient)"/>
  <rect width="512" height="512" rx="102.4" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.15"/>

  <text
    x="50%"
    y="52%"
    dominant-baseline="middle"
    text-anchor="middle"
    fill="#F8FAFC"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="240"
    font-weight="600"
    letter-spacing="-8"
    filter="url(#textShadow)">GP</text>

  <line
    x1="140"
    y1="340"
    x2="372"
    y2="340"
    stroke="#ffffff"
    stroke-width="2"
    opacity="0.4"/>

  <text
    x="50%"
    y="390"
    text-anchor="middle"
    fill="#ffffff"
    font-family="Georgia, serif"
    font-size="32"
    font-weight="400"
    opacity="0.7">§</text>
</svg>`;

console.log('📦 Gerando ícones PWA...\n');

// Salvar SVG base
const iconsDir = path.join(__dirname, '..', 'public', 'icons');
fs.writeFileSync(path.join(iconsDir, 'icon-base.svg'), svgContent);

console.log('✅ SVG base criado: public/icons/icon-base.svg');
console.log('\n📋 Para gerar os PNGs, use uma das opções:\n');
console.log('OPÇÃO 1 - Sharp CLI (Recomendado):');
console.log('  npm install -g sharp-cli');
ICON_SIZES.forEach(size => {
  console.log(`  sharp-cli -i public/icons/icon-base.svg -o public/icons/icon-${size}x${size}.png resize ${size} ${size}`);
});

console.log('\nOPÇÃO 2 - ImageMagick:');
ICON_SIZES.forEach(size => {
  console.log(`  convert public/icons/icon-base.svg -resize ${size}x${size} public/icons/icon-${size}x${size}.png`);
});

console.log('\nOPÇÃO 3 - Online (Mais fácil):');
console.log('  1. Acesse: https://realfavicongenerator.net/');
console.log('  2. Upload: public/icons/icon-base.svg');
console.log('  3. Generate icons');
console.log('  4. Download e extrair em public/icons/\n');
