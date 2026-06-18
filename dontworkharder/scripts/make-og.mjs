// Generates the default Open Graph / Twitter share image (1200x630).
// Run: node scripts/make-og.mjs  ->  public/images/og-default.png
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = resolve(__dirname, '../public/images/og-default.png');
mkdirSync(dirname(out), { recursive: true });

const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#faf7f2"/>
  <rect x="0" y="0" width="1200" height="12" fill="#6d2a32"/>
  <text x="80" y="120" font-family="Helvetica, Arial, sans-serif" font-size="22" font-weight="700" letter-spacing="3" fill="#6d2a32">A BOOK AND A FREE COURSE</text>
  <text x="76" y="250" font-family="Georgia, 'Times New Roman', serif" font-size="104" font-weight="600" fill="#16130f">Don&#8217;t Work</text>
  <text x="76" y="360" font-family="Georgia, 'Times New Roman', serif" font-size="104" font-weight="600" fill="#16130f">Harder.</text>
  <text x="80" y="450" font-family="Helvetica, Arial, sans-serif" font-size="32" fill="#4a443c">AI gave back the hours. This is how you keep them.</text>
  <text x="80" y="560" font-family="Helvetica, Arial, sans-serif" font-size="26" font-weight="700" fill="#16130f">See · Shed · Shift · Shield · Spend</text>
  <text x="1120" y="560" text-anchor="end" font-family="Helvetica, Arial, sans-serif" font-size="24" fill="#6d2a32">dontworkharder.com</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(out);
console.log('Wrote', out);
