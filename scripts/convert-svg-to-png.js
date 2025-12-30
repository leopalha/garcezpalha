// Script to convert SVG to PNG icons for PWA
// Run: node scripts/convert-svg-to-png.js

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Icon sizes needed for PWA
const ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512];

const iconsDir = path.join(__dirname, '..', 'public', 'icons');
const svgPath = path.join(iconsDir, 'icon.svg');

// Check if sharp is installed
try {
  require.resolve('sharp');
} catch (e) {
  console.error('❌ Sharp não está instalado. Instalando...');
  require('child_process').execSync('npm install sharp', { stdio: 'inherit' });
}

async function convertSvgToPng() {
  console.log('🎨 Convertendo SVG para PNG em todos os tamanhos...\n');

  // Check if SVG exists
  if (!fs.existsSync(svgPath)) {
    console.error('❌ Erro: icon.svg não encontrado em public/icons/');
    process.exit(1);
  }

  // Read SVG content
  const svgBuffer = fs.readFileSync(svgPath);

  // Convert to each size
  for (const size of ICON_SIZES) {
    try {
      const outputPath = path.join(iconsDir, `icon-${size}x${size}.png`);

      await sharp(svgBuffer)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png({
          quality: 100,
          compressionLevel: 9
        })
        .toFile(outputPath);

      console.log(`✅ Criado: icon-${size}x${size}.png`);
    } catch (error) {
      console.error(`❌ Erro ao criar icon-${size}x${size}.png:`, error.message);
    }
  }

  // Create apple-touch-icon.png (192x192 is good for iOS)
  try {
    const appleTouchPath = path.join(iconsDir, 'apple-touch-icon.png');
    await sharp(svgBuffer)
      .resize(192, 192, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png({ quality: 100 })
      .toFile(appleTouchPath);

    console.log(`✅ Criado: apple-touch-icon.png`);
  } catch (error) {
    console.error('❌ Erro ao criar apple-touch-icon.png:', error.message);
  }

  console.log('\n🎉 Conversão concluída com sucesso!');
  console.log(`📁 Ícones salvos em: ${iconsDir}`);
}

// Run conversion
convertSvgToPng().catch(console.error);
