# magdafrackowiak.com

Single-page personal site for **Magda Frackowiak** — software engineer and
co-founder of GAMEPLAN, London. Built per the build brief.

## Stack

- **Astro 4** (static output), TypeScript
- **Tailwind CSS 3** via `@astrojs/tailwind`
- **@astrojs/sitemap** (sitemap generated at build; do not hand-write it)
- Self-hosted fonts: **Newsreader** (serif, name + headings), **Inter** (body)
- Contact via **Web3Forms** (no backend)
- Deep-teal accent `#0E4F4A` on off-white `#FAFAFA` / near-black `#111111`

## Develop

```bash
npm install
npm run dev      # local dev server
npm run build    # static build to dist/
npm run preview  # serve the build
```

## Deploy — Cloudflare Pages (git-connected)

This site lives in the `magdafrackowiak.com/` subdirectory of the repo, so set
the **Root directory** in the Pages build config.

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** →
   **Connect to Git**, and select this repository.
2. Build settings:
   - **Framework preset:** Astro
   - **Root directory:** `magdafrackowiak.com`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
3. Deploy. Then **Custom domains** → add `magdafrackowiak.com`; Cloudflare
   provisions TLS automatically.

`public/_headers` sets security headers, immutable font caching, and
`text/plain` for `llms.txt` / `robots.txt`.

## Before it goes live — placeholders to supply

- **Portrait:** `public/images/magda-frackowiak.jpg` is a generated placeholder.
  Drop in a real greyscale portrait (~960×640 or larger, 3:2), then run
  `node scripts/gen-images.mjs` to refresh `og.jpg` if you want it regenerated.
- **Web3Forms key:** set the access key in `src/components/Contact.astro`
  (or provide `WEB3FORMS_KEY` as a build-time env var in Cloudflare) and set the
  destination inbox in the Web3Forms dashboard.
- **Social links:** add LinkedIn / Instagram / TikTok to `Links.astro` and to
  the `sameAs` array in `src/layouts/Base.astro` once confirmed.

## AEO / discoverability

- `Person` JSON-LD in `Base.astro` with `founder`, `worksFor`, `hasCredential`
  (Anthropic CCA-F) and a `disambiguatingDescription` vs the namesake model.
- `/llms.txt`, `/robots.txt` (open), generated `/sitemap-index.xml`.
- Single `<h1>` (the name), canonical URL, OG + Twitter card.
