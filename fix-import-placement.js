const fs = require('fs');

const files = [
  'src/app/(marketing)/automacao/secretaria-remota/page.tsx',
  'src/app/(marketing)/patrimonial/direito-imobiliario/page.tsx',
  'src/app/(marketing)/patrimonial/holding-familiar/page.tsx',
  'src/app/(marketing)/patrimonial/inventario/page.tsx',
  'src/app/(marketing)/patrimonial/usucapiao/page.tsx',
  'src/app/(marketing)/pericia/grafotecnia/page.tsx',
  'src/app/(marketing)/pericia/laudo-tecnico/page.tsx',
  'src/app/(marketing)/pericia/pericia-documental/page.tsx',
  'src/app/(marketing)/previdenciario/aposentadoria/page.tsx',
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');

  // Pattern: import { ... from lucide-react followed by "import { import { getProductBySlug ..."
  // Fix: Move getProductBySlug import before the broken import block

  // Find the pattern where getProductBySlug was inserted inside an import
  const pattern = /(} from 'lucide-react'\n)import \{\nimport \{ getProductBySlug \} from '@\/lib\/products\/catalog'\n\n\n\n(  AgitationSection,[\s\S]*?} from '@\/components\/vsl')/;

  if (pattern.test(content)) {
    content = content.replace(
      pattern,
      "$1import { getProductBySlug } from '@/lib/products/catalog'\nimport {\n$2"
    );

    fs.writeFileSync(file, content, 'utf-8');
    console.log(`✓ Fixed: ${file}`);
  } else {
    console.log(`⚠ Pattern not found in: ${file}`);

    // Try a more flexible pattern
    const flexPattern = /(import \{[^}]*\} from 'lucide-react'\n)import \{\nimport \{ getProductBySlug \}/;
    if (flexPattern.test(content)) {
      content = content.replace(
        /import \{\nimport \{ getProductBySlug \} from '@\/lib\/products\/catalog'\n\n\n\n/,
        "import { getProductBySlug } from '@/lib/products/catalog'\nimport {\n"
      );
      fs.writeFileSync(file, content, 'utf-8');
      console.log(`✓ Fixed with flex pattern: ${file}`);
    }
  }
});

console.log('\n✓ All files processed');
