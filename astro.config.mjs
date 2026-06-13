import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

const SITE_URL = 'https://tomgoodwin.london';

// Hidden pages are indexed + sitemapped but excluded from nav (brief §3).
// They remain in the sitemap; only nav/homepage exclude them.
export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'ignore',
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
