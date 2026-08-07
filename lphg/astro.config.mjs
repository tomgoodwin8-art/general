import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Domain is TBC (open item for Tom). Placeholder until confirmed.
const SITE_URL = 'https://www.lphg.co.uk';

// Static-first (brief §2). Server-side work (Semble, Stripe) lives in
// Cloudflare Pages Functions under /functions, NOT in Astro SSR — this keeps
// every content page a static asset for the Lighthouse budget.
export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    mdx(),
    sitemap({
      // Split by type per brief §7 (XML sitemap split by type).
      i18n: undefined,
      filter: (page) => !page.includes('/404'),
      serialize(item) {
        if (item.url.includes('/blog/')) item.changefreq = 'monthly';
        else if (item.url.includes('/services/') || item.url.includes('/centres/'))
          item.changefreq = 'weekly';
        return item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
