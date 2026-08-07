// Validates every JSON-LD block in the built site parses and is well-formed
// (brief §7: validate all schema in CI). Run after `astro build`.
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;

async function htmlFiles(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await htmlFiles(p)));
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

const files = await htmlFiles(DIST);
let blocks = 0;
const errors = [];

for (const file of files) {
  const html = await readFile(file, 'utf8');
  const rx = /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g;
  let m;
  while ((m = rx.exec(html))) {
    blocks++;
    const rel = file.replace(DIST, '/');
    let data;
    try {
      data = JSON.parse(m[1]);
    } catch (err) {
      errors.push(`${rel}: invalid JSON-LD — ${err.message}`);
      continue;
    }
    const nodes = data['@graph'] ?? [data];
    if (!data['@context']) errors.push(`${rel}: JSON-LD missing @context`);
    for (const node of nodes) {
      if (!node['@type']) errors.push(`${rel}: JSON-LD node missing @type`);
    }
  }
}

if (errors.length) {
  console.error(`schema-lint: ${errors.length} problem(s) in ${files.length} pages:`);
  for (const e of errors) console.error('  ✗ ' + e);
  process.exit(1);
}
console.log(`schema-lint: OK — ${blocks} JSON-LD blocks across ${files.length} pages validate.`);
