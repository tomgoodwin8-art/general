// Internal-link integrity (brief §7): no broken internal links, and no orphan
// indexable pages (every indexable page is linked from somewhere). Run after
// `astro build`.
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;

// Static assets that are valid link targets but not HTML routes.
const STATIC_OK = [/^\/robots\.txt$/, /^\/llms\.txt$/, /^\/sitemap/, /^\/og\//, /^\/_astro\//, /^\/fonts\//, /^\/favicon/, /\.(xml|ico|svg|png|jpg|webp|avif|ics|pdf)$/];

async function htmlFiles(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await htmlFiles(p)));
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

function toRoute(file) {
  let r = file.replace(DIST, '/').replace(/index\.html$/, '').replace(/\.html$/, '/');
  if (!r.endsWith('/')) r += '/';
  return r;
}
const norm = (h) => {
  let p = h.split('#')[0].split('?')[0];
  if (p && !p.endsWith('/') && !/\.[a-z0-9]+$/i.test(p)) p += '/';
  return p;
};

const files = await htmlFiles(DIST);
const routes = new Set(files.map(toRoute));
const linkedTo = new Set();
const indexable = new Set();
const broken = [];

for (const file of files) {
  const route = toRoute(file);
  const html = await readFile(file, 'utf8');
  const noindex = /<meta[^>]+name="robots"[^>]+noindex/i.test(html);
  if (!noindex) indexable.add(route);

  for (const m of html.matchAll(/<a\s[^>]*href="([^"]+)"/gi)) {
    const href = m[1];
    if (!href.startsWith('/')) continue; // external or anchor
    const target = norm(href);
    linkedTo.add(target);
    const isStatic = STATIC_OK.some((rx) => rx.test(target));
    if (!isStatic && !routes.has(target)) broken.push(`${route} → ${href}`);
  }
}

const orphans = [...indexable].filter((r) => r !== '/' && !linkedTo.has(r));

let failed = false;
if (broken.length) {
  failed = true;
  console.error(`link-check: ${broken.length} broken internal link(s):`);
  for (const b of broken) console.error('  ✗ ' + b);
}
if (orphans.length) {
  failed = true;
  console.error(`link-check: ${orphans.length} orphan indexable page(s) (not linked anywhere):`);
  for (const o of orphans) console.error('  ✗ ' + o);
}
if (failed) process.exit(1);
console.log(`link-check: OK — ${routes.size} routes, ${linkedTo.size} internal targets, 0 broken, 0 orphans.`);
