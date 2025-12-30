/**
 * Image Optimization Script
 * Converts brasao-garcez-palha.png (1.2MB) to WebP (target: ~50KB)
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const INPUT_FILE = path.join(__dirname, '../public/brasao-garcez-palha.png');
const OUTPUT_WEBP = path.join(__dirname, '../public/brasao-garcez-palha.webp');
const OUTPUT_PNG_OPTIMIZED = path.join(__dirname, '../public/brasao-garcez-palha-optimized.png');

async function optimizeBrasao() {
  try {
    console.log('🖼️  Image Optimization Started...\n');

    // Check if input file exists
    if (!fs.existsSync(INPUT_FILE)) {
      throw new Error(`Input file not found: ${INPUT_FILE}`);
    }

    // Get original file info
    const originalStats = fs.statSync(INPUT_FILE);
    const originalSizeMB = (originalStats.size / (1024 * 1024)).toFixed(2);
    console.log(`📊 Original PNG: ${originalSizeMB}MB (${originalStats.size.toLocaleString()} bytes)`);

    // Get image metadata
    const metadata = await sharp(INPUT_FILE).metadata();
    console.log(`📐 Dimensions: ${metadata.width}x${metadata.height}px`);
    console.log(`🎨 Format: ${metadata.format}\n`);

    // Convert to WebP with quality 85
    console.log('🔄 Converting to WebP (quality: 85)...');
    await sharp(INPUT_FILE)
      .webp({ quality: 85, effort: 6 })
      .toFile(OUTPUT_WEBP);

    const webpStats = fs.statSync(OUTPUT_WEBP);
    const webpSizeKB = (webpStats.size / 1024).toFixed(1);
    const webpReduction = (((originalStats.size - webpStats.size) / originalStats.size) * 100).toFixed(1);
    console.log(`✅ WebP created: ${webpSizeKB}KB (${webpStats.size.toLocaleString()} bytes)`);
    console.log(`📉 Reduction: ${webpReduction}%\n`);

    // Also create optimized PNG as fallback
    console.log('🔄 Creating optimized PNG fallback...');
    await sharp(INPUT_FILE)
      .png({ quality: 80, compressionLevel: 9, effort: 10 })
      .toFile(OUTPUT_PNG_OPTIMIZED);

    const pngOptStats = fs.statSync(OUTPUT_PNG_OPTIMIZED);
    const pngOptSizeKB = (pngOptStats.size / 1024).toFixed(1);
    const pngReduction = (((originalStats.size - pngOptStats.size) / originalStats.size) * 100).toFixed(1);
    console.log(`✅ Optimized PNG created: ${pngOptSizeKB}KB (${pngOptStats.size.toLocaleString()} bytes)`);
    console.log(`📉 Reduction: ${pngReduction}%\n`);

    // Summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 OPTIMIZATION SUMMARY:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Original PNG:    ${originalSizeMB}MB`);
    console.log(`WebP:            ${webpSizeKB}KB (-${webpReduction}%)`);
    console.log(`Optimized PNG:   ${pngOptSizeKB}KB (-${pngReduction}%)`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('✅ Optimization complete!');
    console.log(`\n📁 Output files:`);
    console.log(`   - ${OUTPUT_WEBP}`);
    console.log(`   - ${OUTPUT_PNG_OPTIMIZED}`);
    console.log('\n💡 Next steps:');
    console.log('   1. Update components to use WebP with PNG fallback');
    console.log('   2. Test in browsers (Chrome, Firefox, Safari)');
    console.log('   3. Verify visual quality');
    console.log('   4. Delete original PNG if satisfied\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run optimization
optimizeBrasao();
