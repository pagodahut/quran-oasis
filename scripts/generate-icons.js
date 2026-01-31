#!/usr/bin/env node
/**
 * Generate PWA icons from SVG
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SIZES = [72, 96, 128, 144, 152, 192, 384, 512];
const SVG_PATH = path.join(__dirname, '../public/icon.svg');
const OUTPUT_DIR = path.join(__dirname, '../public/icons');

async function generateIcons() {
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const svgBuffer = fs.readFileSync(SVG_PATH);

  console.log('🎨 Generating PWA icons from icon.svg...\n');

  for (const size of SIZES) {
    const outputPath = path.join(OUTPUT_DIR, `icon-${size}x${size}.png`);
    
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outputPath);
    
    console.log(`  ✓ icon-${size}x${size}.png`);
  }

  // Also create apple-touch-icon
  const appleTouchPath = path.join(__dirname, '../public/apple-touch-icon.png');
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(appleTouchPath);
  console.log('  ✓ apple-touch-icon.png (180x180)');

  // Create favicon.ico (32x32 PNG, browsers accept this)
  const faviconPath = path.join(__dirname, '../public/favicon.png');
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(faviconPath);
  console.log('  ✓ favicon.png (32x32)');

  console.log('\n✨ All icons generated successfully!');
}

generateIcons().catch(console.error);
