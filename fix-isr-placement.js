const fs = require('fs');
const glob = require('glob');

// Find all product page files that were modified
const files = glob.sync('src/app/(marketing)/**/*/page.tsx', {
  ignore: ['**/demo/**', '**/forgot-password/**', '**/reset-password/**', '**/signup/**']
});

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  
  // Check if file has the ISR code in wrong place (inside imports)
  if (content.includes('export const revalidate') && content.includes('import {')) {
    // Extract ISR block
    const isrMatch = content.match(/\/\/ ISR:.*?^}\n/ms);
    if (!isrMatch) return;
    
    const isrBlock = isrMatch[0];
    
    // Remove ISR block from wrong location
    let fixed = content.replace(isrBlock, '');
    
    // Find the last import statement
    const lines = fixed.split('\n');
    let lastImportIndex = -1;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith('import ') || lines[i].trim().startsWith('} from')) {
        lastImportIndex = i;
      }
    }
    
    if (lastImportIndex !== -1) {
      // Insert ISR block after last import with blank line
      lines.splice(lastImportIndex + 1, 0, '', isrBlock.trim(), '');
      fixed = lines.join('\n');
      
      fs.writeFileSync(file, fixed, 'utf8');
      console.log(`✓ Fixed ${file}`);
    }
  }
});

console.log('\n✓ All ISR placements fixed');
