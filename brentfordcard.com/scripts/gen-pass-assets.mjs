import sharp from 'sharp';
import { writeFileSync } from 'node:fs';

const ROOT = process.argv[2];

// Icon: brass Confluence mark on river-green rounded tile.
const icon = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 48 48">
  <rect width="48" height="48" rx="9" fill="#2e4a43"/>
  <g fill="none" stroke="#b08d3e" stroke-width="2.6" stroke-linecap="round">
    <path d="M11 11 C 17 22, 21 31, 24 41"/>
    <path d="M24 9 L 24 41"/>
    <path d="M37 11 C 31 22, 27 31, 24 41"/>
  </g>
</svg>`;

// Logo: brass mark + wordmark on transparent (for the top of the pass).
const logo = (w, h) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 320 80">
  <g fill="none" stroke="#b08d3e" stroke-width="4" stroke-linecap="round" transform="translate(6,14)">
    <path d="M0 0 C 9 15, 14 27, 18 40"/>
    <path d="M18 -3 L 18 40"/>
    <path d="M36 0 C 27 15, 22 27, 18 40"/>
  </g>
  <text x="58" y="38" font-family="Arial, sans-serif" font-size="26" font-weight="800" letter-spacing="1.5" fill="#f2eee6">BRENTFORD</text>
  <text x="58" y="64" font-family="Arial, sans-serif" font-size="20" font-weight="600" letter-spacing="4" fill="#b08d3e">CARD</text>
</svg>`;

async function png(svg) {
  return (await sharp(Buffer.from(svg)).png().toBuffer()).toString('base64');
}

const assets = {
  'icon.png': await png(icon(29)),
  'icon@2x.png': await png(icon(58)),
  'icon@3x.png': await png(icon(87)),
  'logo.png': await png(logo(160, 40)),
  'logo@2x.png': await png(logo(320, 80)),
  'logo@3x.png': await png(logo(480, 120)),
};

const ts = `// AUTO-GENERATED. Base64-encoded PNG assets for the Apple Wallet pass bundle.
// Regenerate with scripts/gen-pass-assets.mjs. Do not edit by hand.
export const PASS_ASSETS: Record<string, string> = {
${Object.entries(assets).map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)},`).join('\n')}
};
`;
writeFileSync(`${ROOT}/functions/_lib/passAssets.ts`, ts);
console.log('wrote passAssets.ts with', Object.keys(assets).length, 'assets, total b64 bytes:',
  Object.values(assets).reduce((n, v) => n + v.length, 0));
