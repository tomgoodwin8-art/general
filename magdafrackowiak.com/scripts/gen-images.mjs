// Generates placeholder portrait + OG card. Replace magda-frackowiak.jpg with a
// real greyscale portrait when supplied; re-run to regenerate og.jpg to match.
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'public');

const INK = '#111111';
const PAPER = '#FAFAFA';
const ACCENT = '#0E4F4A';

// --- Portrait placeholder (960x640), muted greyscale to match sibling sites ---
const portraitSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="960" height="640">
  <rect width="960" height="640" fill="#e9e9e7"/>
  <rect width="960" height="640" fill="url(#g)"/>
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#efefec"/>
      <stop offset="1" stop-color="#dcdcd8"/>
    </linearGradient>
  </defs>
  <text x="480" y="330" text-anchor="middle" font-family="Georgia, serif"
        font-size="140" font-weight="600" fill="#8a8a86" letter-spacing="4">MF</text>
  <text x="480" y="400" text-anchor="middle" font-family="Georgia, serif"
        font-size="22" fill="#a0a09b" letter-spacing="2">PORTRAIT TO SUPPLY</text>
</svg>`;

await sharp(Buffer.from(portraitSvg))
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(join(out, 'images', 'magda-frackowiak.jpg'));

// --- OG social card (1200x630) ---
const ogSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="${PAPER}"/>
  <rect x="0" y="0" width="12" height="630" fill="${ACCENT}"/>
  <text x="90" y="300" font-family="Georgia, serif" font-size="82" font-weight="600"
        fill="${INK}">Magda Frackowiak</text>
  <text x="92" y="360" font-family="Georgia, serif" font-size="34" fill="#555">
    Software engineer and co-founder of GAMEPLAN — London</text>
  <text x="92" y="430" font-family="Georgia, serif" font-size="26" fill="${ACCENT}">
    Claude Certified Architect</text>
</svg>`;

await sharp(Buffer.from(ogSvg))
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(join(out, 'og.jpg'));

console.log('Generated images/magda-frackowiak.jpg and og.jpg');
