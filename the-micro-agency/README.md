# The Micro Agency

The UK's specialist Microsoft Advertising agency. Static site built with **Astro 5**, **Tailwind CSS v4** and **TypeScript**, designed for Cloudflare Pages.

> Google is where you spend. Microsoft is where you grow.

## Develop

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output to ./dist
npm run preview
```

## Deploy to Cloudflare Pages

**Git integration (recommended).** Create a Pages project connected to this repo with:

| Setting | Value |
|---|---|
| Root directory | `the-micro-agency` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version | 20 or 22 |

**Direct upload.**

```bash
npm run build
npx wrangler pages deploy dist --project-name themicroagency
```

## Before launch — confirm with Tom (see build brief §14)

- [ ] `{{DOMAIN}}` — set the real domain in `astro.config.mjs` and `src/data/site.ts` (`SITE_URL`).
- [ ] `{{BOOKING_URL}}` — confirm the dedicated Cal.com link in `src/data/site.ts`.
- [ ] **Peter Cresswell bio** — populate `src/data/founders.ts` from his LinkedIn / own copy. Do not invent.
- [ ] **Logo asset** — replace the placeholder wordmark / `public/badges/microsoft-elite-partner-2026.svg` with the official Microsoft Advertising Elite Partner 2026 lockup.
- [ ] **OG default image** — replace `public/images/og-default.svg` with a final 1200×630 asset if a raster is preferred.
- [ ] **Report PDF** — wire the gated report delivery on `/report`.
- [ ] Legal review of `/privacy` and `/terms`.
- [ ] Founder headshots in `public/images/founders/`.

## Content governance

- Stats may be published **only** from `src/data/stats.ts` (Verified stats library, brief Appendix A). Every figure carries a named, dated source as an HTML comment in markup.
- Nothing from the brief's Appendix B (unverified / misattributed / dated) may appear on the site.
- Tom Goodwin entity disambiguation (not the author of *Digital Darwinism*) appears in `Person` schema, About copy, FAQ and `llms.txt`.

## Structure

- `src/pages` — routes (Home, Services, Method, Why Microsoft, Case Studies, About, Blog, Podcast, Report, News, Careers, Contact, Privacy, Terms).
- `src/content` — `blog` (20 posts), `podcast` (episode collection), `news`.
- `src/components` — Header, Footer, PartnerBadge, AuditCTA, StatBlock, FounderCard, LogoWall, ContactForm, CalEmbed, Schema, etc.
- `src/data` — `site.ts` (tokens), `stats.ts`, `founders.ts`, `faqs.ts`.
- SEO/AEO: `llms.txt`, `rss.xml`, sitemap (auto), `robots.txt`, JSON-LD via `Schema.astro`.
