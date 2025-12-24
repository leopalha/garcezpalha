const fs = require('fs');
const path = require('path');

// Simple function to create SVG icons
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

const createSVGIcon = (size) => {
  return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#27272A"/>
  <text x="50%" y="50%" text-anchor="middle" dy=".35em" fill="white" font-family="system-ui, -apple-system, sans-serif" font-weight="bold" font-size="${size * 0.35}">GP</text>
</svg>`;
};

const iconsDir = path.join(__dirname, 'public', 'icons');

// Ensure icons directory exists
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate SVG files (we can convert to PNG later if needed)
sizes.forEach(size => {
  const svgContent = createSVGIcon(size);
  const filename = `icon-${size}x${size}.svg`;
  const filepath = path.join(iconsDir, filename);

  fs.writeFileSync(filepath, svgContent);
  console.log(`✅ Created ${filename}`);
});

// Create apple-touch-icon (180x180 is standard)
const appleTouchIcon = createSVGIcon(180);
fs.writeFileSync(path.join(iconsDir, 'apple-touch-icon.svg'), appleTouchIcon);
console.log('✅ Created apple-touch-icon.svg');

console.log('\n✨ All PWA icons created successfully!');
console.log('\nNote: SVG icons work in most browsers. For PNG conversion, you can:');
console.log('1. Use an online tool like https://cloudconvert.com/svg-to-png');
console.log('2. Install sharp: npm install sharp');
console.log('3. Open SVGs in a browser and screenshot them');
