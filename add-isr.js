const fs = require('fs');
const path = require('path');

// Categories to process (exclude system pages)
const categories = ['financeiro', 'patrimonial', 'saude', 'pericia', 'criminal', 'aeronautico', 'automacao', 'previdenciario', 'bancario', 'imobiliario'];

const isrTemplate = `
// ISR: Revalidate every 1 hour (product pages rarely change)
export const revalidate = 3600

// Generate metadata for SEO
export async function generateMetadata() {
  const product = getProductBySlug('SLUG_HERE')
  if (!product) return {}

  return {
    title: \`\${product.name} | Garcez Palha Advogados\`,
    description: product.description,
  }
}

`;

categories.forEach(category => {
  const categoryPath = path.join('src', 'app', '(marketing)', category);
  
  if (!fs.existsSync(categoryPath)) return;
  
  const items = fs.readdirSync(categoryPath);
  
  items.forEach(item => {
    const itemPath = path.join(categoryPath, item);
    const pagePath = path.join(itemPath, 'page.tsx');
    
    if (!fs.existsSync(pagePath)) return;
    
    const content = fs.readFileSync(pagePath, 'utf8');
    
    // Skip if already has revalidate
    if (content.includes('export const revalidate')) {
      console.log(`✓ Skipped ${category}/${item} (already has ISR)`);
      return;
    }
    
    // Find the slug from the folder name
    const slug = item;
    
    // Insert ISR config after imports
    const lines = content.split('\n');
    let insertIndex = 0;
    
    // Find last import line
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('import ')) {
        insertIndex = i + 1;
      } else if (insertIndex > 0 && lines[i].trim() === '') {
        break;
      }
    }
    
    const isrCode = isrTemplate.replace('SLUG_HERE', slug);
    lines.splice(insertIndex, 0, isrCode);
    
    const newContent = lines.join('\n');
    fs.writeFileSync(pagePath, newContent, 'utf8');
    
    console.log(`✓ Added ISR to ${category}/${item}`);
  });
});

console.log('\n✓ Done! ISR added to all product pages.');
