// Build-time Open Graph card generator (brief §6). Renders branded 1200x630
// SVG cards (ink background, hazard-tape band, big headline, helmet mark) to
// PNG with sharp. Runs before `astro build`. No network access required.
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'og');

// Per-page cards. `title` is the big line; `kicker` the mono eyebrow.
const cards = [
  { name: 'default', kicker: 'votebinface.com', title: 'THE ONLY ONE WHO TURNED UP' },
  { name: 'home', kicker: 'Clacton by-election', title: 'THE ONLY ONE WHO TURNED UP' },
  { name: 'clacton', kicker: 'The by-election explained', title: 'WHO IS STANDING IN CLACTON?' },
  { name: 'vote', kicker: 'Register & postal votes', title: 'MAKE YOUR VOTE COUNT' },
  { name: 'manifesto', kicker: 'The pledges', title: 'THE BINFACE MANIFESTO' },
  { name: 'about', kicker: 'Who is Count Binface', title: 'THE BIN IS THE JOKE. THE BALLOT IS NOT.' },
  { name: 'faq', kicker: 'Questions, answered', title: 'FREQUENTLY ASKED QUESTIONS' },
  { name: 'press', kicker: 'Press & media kit', title: 'NEWS FROM THE KERBSIDE' },
  { name: 'volunteer', kicker: 'Join BinAid', title: 'A DAY OUT WITH MATES' },
  { name: 'past-campaigns', kicker: 'The record', title: 'EVERY RESULT A VICTORY IF YOU SQUINT' },
];

const helmet = `
  <g transform="translate(940,150) scale(1.7)">
    <rect x="82" y="8" width="36" height="12" rx="6" fill="#c9ced5"/>
    <path d="M34 40c0-11 30-20 66-20s66 9 66 20l-6 14H40z" fill="#dfe3e8" stroke="#5b616b" stroke-width="2"/>
    <path d="M40 54h120l-10 150c-.6 9-8 16-17 16H67c-9 0-16.4-7-17-16z" fill="#cfd4da" stroke="#5b616b" stroke-width="2"/>
    <rect x="58" y="92" width="84" height="34" rx="8" fill="#0b0b0c"/>
    <rect x="70" y="103" width="24" height="12" rx="5" fill="#f5e000"/>
    <rect x="106" y="103" width="24" height="12" rx="5" fill="#f5e000"/>
    <rect x="88" y="150" width="24" height="24" rx="3" fill="#0b0b0c"/>
  </g>`;

function escapeXml(s) {
  return s.replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]));
}

// Wrap a headline into up to 4 lines by character budget.
function wrap(text, max = 13) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const w of words) {
    if ((line + ' ' + w).trim().length > max && line) {
      lines.push(line.trim());
      line = w;
    } else {
      line = (line + ' ' + w).trim();
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 4);
}

function svg({ kicker, title }) {
  const lines = wrap(title);
  const size = lines.length >= 4 ? 62 : lines.length === 3 ? 72 : 82;
  const gap = size * 1.12;
  const startY = 315 - ((lines.length - 1) * gap) / 2;
  const tspans = lines
    .map((l, i) => `<text x="90" y="${startY + i * gap}" font-family="'Anton','Arial Narrow','DejaVu Sans',sans-serif" font-weight="700" font-size="${size}" fill="#edeff2" letter-spacing="1">${escapeXml(l)}</text>`)
    .join('\n');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <defs>
      <pattern id="tape" width="44" height="44" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
        <rect width="44" height="44" fill="#0b0b0c"/>
        <rect width="22" height="44" fill="#f5e000"/>
      </pattern>
    </defs>
    <rect width="1200" height="630" fill="#0b0b0c"/>
    <rect x="0" y="0" width="1200" height="14" fill="url(#tape)"/>
    <rect x="0" y="616" width="1200" height="14" fill="url(#tape)"/>
    <text x="90" y="130" font-family="'Space Mono','DejaVu Sans Mono',monospace" font-size="26" fill="#f5e000" letter-spacing="4">${escapeXml(kicker.toUpperCase())}</text>
    ${tspans}
    <text x="90" y="560" font-family="'Space Mono','DejaVu Sans Mono',monospace" font-size="24" fill="#a7adb6" letter-spacing="2">VOTEBINFACE.COM</text>
    ${helmet}
  </svg>`;
}

await mkdir(outDir, { recursive: true });
for (const card of cards) {
  const buf = Buffer.from(svg(card));
  await sharp(buf).png({ compressionLevel: 9 }).toFile(join(outDir, `${card.name}.png`));
  console.log(`og: ${card.name}.png`);
}
console.log(`Generated ${cards.length} OG cards.`);
