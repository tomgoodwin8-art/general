import type { APIRoute } from 'astro';
import { site } from '../data/site';

// Brief §7: explicitly allow answer-engine crawlers.
const body = `# ${site.name}
User-agent: *
Allow: /

# Answer engines — explicitly welcomed (AEO, brief §7)
User-agent: GPTBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Google-Extended
Allow: /

Sitemap: ${site.url.replace(/\/$/, '')}/sitemap-index.xml
`;

export const GET: APIRoute = () =>
  new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
