const fs = require('fs');

const files = [
  'src/app/(marketing)/aeronautico/direito-aeronautico/page.tsx',
  'src/app/(marketing)/automacao/secretaria-remota/page.tsx',
  'src/app/(marketing)/criminal/habeas-corpus/page.tsx',
  'src/app/(marketing)/patrimonial/avaliacao-imoveis/page.tsx',
  'src/app/(marketing)/patrimonial/direito-imobiliario/page.tsx',
  'src/app/(marketing)/patrimonial/holding-familiar/page.tsx',
  'src/app/(marketing)/patrimonial/inventario/page.tsx',
  'src/app/(marketing)/patrimonial/regularizacao-imovel/page.tsx',
  'src/app/(marketing)/patrimonial/usucapiao/page.tsx',
  'src/app/(marketing)/pericia/grafotecnia/page.tsx',
  'src/app/(marketing)/pericia/laudo-tecnico/page.tsx',
  'src/app/(marketing)/pericia/pericia-documental/page.tsx',
  'src/app/(marketing)/previdenciario/aposentadoria-invalidez/page.tsx',
  'src/app/(marketing)/previdenciario/aposentadoria/page.tsx',
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Check if getProductBySlug is used but not imported
  if (content.includes('getProductBySlug') && !content.includes('import.*getProductBySlug')) {
    // Find import from @/lib/products/catalog
    if (content.includes("from '@/lib/products/catalog'")) {
      // Add getProductBySlug to existing import
      content = content.replace(
        /(import.*{[^}]*})\s*from '@\/lib\/products\/catalog'/,
        (match, importPart) => {
          if (!importPart.includes('getProductBySlug')) {
            return importPart.replace('}', ', getProductBySlug }') + " from '@/lib/products/catalog'";
          }
          return match;
        }
      );
    } else {
      // Add new import line
      const lines = content.split('\n');
      let insertIndex = 0;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('import ')) {
          insertIndex = i + 1;
        }
      }
      lines.splice(insertIndex, 0, "import { getProductBySlug } from '@/lib/products/catalog'");
      content = lines.join('\n');
    }
    
    fs.writeFileSync(file, content, 'utf8');
    console.log(`✓ Added import to ${file}`);
  }
});

console.log('\n✓ All imports fixed');
