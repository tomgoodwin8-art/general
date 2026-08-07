// Generates functions/_lib/catalog.json from service + package frontmatter so
// Pages Functions can price a booking server-side without importing Astro
// content. Runs as `prebuild`, keeping the catalog in sync with content.
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dirs = [
  { path: join(root, 'src/content/services'), kind: 'service' },
  { path: join(root, 'src/content/packages'), kind: 'package' },
];

function field(fm, name) {
  const m = fm.match(new RegExp(`^${name}:\\s*(.+)$`, 'm'));
  if (!m) return undefined;
  return m[1].trim().replace(/^['"]|['"]$/g, '');
}

const catalog = {};
for (const { path, kind } of dirs) {
  let files = [];
  try {
    files = (await readdir(path)).filter((f) => f.endsWith('.md') || f.endsWith('.mdx'));
  } catch {
    continue;
  }
  for (const file of files) {
    const raw = await readFile(join(path, file), 'utf8');
    const fm = raw.split('---')[1] ?? '';
    const id = field(fm, 'sembleBookingTypeId');
    const title = field(fm, 'title');
    const price = Number(field(fm, 'price'));
    if (!id || !title || Number.isNaN(price)) continue;
    catalog[id] = { title, price, kind, slug: file.replace(/\.mdx?$/, '') };
  }
}

const out = join(root, 'functions/_lib/catalog.json');
await mkdir(dirname(out), { recursive: true });
await writeFile(out, JSON.stringify(catalog, null, 2) + '\n');
console.log(`gen-catalog: wrote ${Object.keys(catalog).length} entries to ${out}`);
