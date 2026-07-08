import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// votebinface.com - static Astro site for Cloudflare Pages.
// Trailing-slash policy: never (enforced in Cloudflare + canonical tags).
export default defineConfig({
  site: 'https://votebinface.com',
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
