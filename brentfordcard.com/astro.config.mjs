import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// brentfordcard.com — Astro 5, static output, Cloudflare Pages.
// Vanilla CSS only (see src/styles/global.css); no Tailwind, no UI framework.
const SITE_URL = 'https://brentfordcard.com';

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'always',
  // Split the sitemap by collection and expose it as sitemap-index.xml (brief §7).
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
  ],
  build: {
    // Keep inline styles out of <style> islands where possible; ship one CSS file.
    inlineStylesheets: 'never',
  },
});
