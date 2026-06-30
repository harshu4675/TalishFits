import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0d3d35"/>
      <stop offset="100%" stop-color="#1a5d52"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="96" fill="url(#bg)"/>
  <text x="50%" y="48%" dominant-baseline="central" text-anchor="middle" fill="#c4a87a" font-family="Arial Black, Impact, sans-serif" font-weight="900" font-size="200" letter-spacing="-6">TF</text>
  <g transform="translate(256, 380)">
    <circle cx="-30" cy="0" r="6" fill="#c4a87a" opacity="0.4"/>
    <circle cx="-12" cy="0" r="6" fill="#c4a87a" opacity="0.7"/>
    <circle cx="6" cy="0" r="6" fill="#c4a87a"/>
    <circle cx="24" cy="0" r="6" fill="#c4a87a" opacity="0.7"/>
    <circle cx="42" cy="0" r="6" fill="#c4a87a" opacity="0.4"/>
  </g>
  <text x="50%" y="445" dominant-baseline="central" text-anchor="middle" fill="#c4a87a" font-family="Arial, sans-serif" font-weight="700" font-size="22" letter-spacing="6" opacity="0.6">FITNESS</text>
</svg>
`;

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const outputDir = path.join(__dirname, "..", "public", "icons");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const svgBuffer = Buffer.from(svgContent);

async function generateIcons() {
  console.log("Generating PWA icons...");
  console.log(`Output directory: ${outputDir}`);
  console.log("");

  for (const size of sizes) {
    const outputPath = path.join(outputDir, `icon-${size}.png`);
    await sharp(svgBuffer)
      .resize(size, size)
      .png({ quality: 100, compressionLevel: 9 })
      .toFile(outputPath);
    console.log(`  Created: icon-${size}.png`);
  }

  await sharp(svgBuffer)
    .resize(180, 180)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(outputDir, "apple-touch-icon.png"));
  console.log("  Created: apple-touch-icon.png");

  await sharp(svgBuffer)
    .resize(32, 32)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(outputDir, "favicon-32.png"));
  console.log("  Created: favicon-32.png");

  await sharp(svgBuffer)
    .resize(16, 16)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(outputDir, "favicon-16.png"));
  console.log("  Created: favicon-16.png");

  console.log("");
  console.log("All icons generated successfully!");
  console.log(`Total: ${sizes.length + 3} icons created`);
}

generateIcons().catch((err) => {
  console.error("Icon generation failed:", err);
  process.exit(1);
});
