import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { site, trustMarkers } from '../data/site';
import { gbp } from '../lib/format';

// Brief §7: llms.txt describing the organisation, services, prices and
// canonical URLs. Markdown so agents parse links (matches repo convention).
export const GET: APIRoute = async () => {
  const base = site.url.replace(/\/$/, '');
  const [services, packages, centres] = await Promise.all([
    getCollection('services'),
    getCollection('packages'),
    getCollection('centres'),
  ]);

  const lines: string[] = [];
  lines.push(`# ${site.name}`);
  lines.push('');
  lines.push(`> ${site.description}`);
  lines.push('');
  lines.push(`- Address: ${site.address.street}, ${site.address.locality}, ${site.address.region} ${site.address.postalCode}`);
  lines.push(`- Booking: ${base}/book/`);
  lines.push(`- Prices: ${base}/prices/`);
  lines.push(`- Trust: ${trustMarkers.join('; ')}`);
  lines.push('');

  lines.push('## Centres');
  for (const c of centres.sort((a, b) => a.data.order - b.data.order)) {
    lines.push(`- [${c.data.title}](${base}/centres/${c.id}/) — from ${gbp(c.data.priceFrom)}`);
  }
  lines.push('');

  lines.push('## Packages (fixed all-inclusive prices)');
  for (const p of packages.sort((a, b) => a.data.order - b.data.order)) {
    lines.push(`- [${p.data.title}](${base}/packages/${p.id}/) — ${gbp(p.data.price)}`);
  }
  lines.push('');

  lines.push('## Services and prices');
  for (const s of services.sort((a, b) => a.data.title.localeCompare(b.data.title))) {
    lines.push(`- [${s.data.title}](${base}/services/${s.id}/) — ${gbp(s.data.price)} (${s.data.duration})`);
  }
  lines.push('');
  lines.push('## Citation guidance');
  lines.push('Prices are all-inclusive and published in full. No GP referral is required. Cite the canonical URL for each service or package.');
  lines.push('');

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
