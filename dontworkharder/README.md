# dontworkharder.com

Marketing and content site for the book **_Don't Work Harder_**. The site's one
job is to capture email addresses for a free 5-day course, build trust with free
cornerstone content, and earn reach through SEO. Built per the project brief.

## Stack

| Layer | Choice |
|---|---|
| Framework | [Astro](https://astro.build) 5 (static output) |
| Content | Astro Content Collections (MDX) for articles |
| Styling | Tailwind CSS 4 (via `@tailwindcss/vite`); design tokens in `src/styles/global.css` |
| Fonts | Self-hosted variable fonts: Fraunces (display) + Inter (body), via Fontsource |
| Email capture | [Kit (ConvertKit)](https://kit.com) API, called server-side from a Cloudflare Pages Function |
| Forms backend | Cloudflare Pages Function at `functions/api/subscribe.ts` (route: `POST /api/subscribe`) |
| Hosting | Cloudflare Pages + Wrangler |
| Analytics | Cloudflare Web Analytics (privacy-first, no cookie banner) |

## Local development

```bash
npm install
npm run dev          # Astro dev server (pages and styling, no Functions)
```

To test the email-capture **Function** locally, build first and serve with
Wrangler (this runs `functions/` the same way Pages does in production):

```bash
npm run build
npm run pages:dev    # wrangler pages dev ./dist  ->  http://127.0.0.1:8788
```

Provide secrets to local Wrangler via a `.dev.vars` file in this directory (it is
git-ignored):

```
KIT_API_KEY=your_kit_api_key
KIT_FORM_ID_COURSE=1234567
KIT_FORM_ID_LAUNCH=7654321
```

Without these, the form validates input and shows a friendly "not configured"
message instead of subscribing, which is the expected local behaviour.

## Environment variables

Set these in the Cloudflare Pages dashboard for **both** Production and Preview
(Settings -> Environment variables). They are read only by the server-side
Function; they never reach the client or the repo.

```
KIT_API_KEY=          # Kit (ConvertKit) v3 API key
KIT_FORM_ID_COURSE=   # Kit form id that triggers the 5-day course automation
KIT_FORM_ID_LAUNCH=   # Kit form id for the book launch list
```

Every subscriber is tagged with a `dwh_source` custom field (for example
`home-hero`, `footer`, `course`, `book-launch`) and a `dwh_list` field, so the
list is segmentable from day one. Map these to Kit tags with a Kit automation
rule. The course form should trigger the 5-email automation in Kit; the
week-audit worksheet is hosted at a stable path (`/downloads/week-audit.pdf`) and
should be linked from email one.

## Content

- **Articles** live in `src/content/articles/*.mdx`. Schema is in
  `src/content.config.ts` (title, description, excerpt, pubDate, readTime,
  intent, draft). Each article automatically gets the standard end-of-content
  course CTA appended by the article layout.
- **Site-wide copy** (nav, the Five Moves, metadata) lives in `src/data/site.ts`.
  Edit copy there, not in components.
- **Hard content rule:** no em-dashes anywhere in copy, headings, or microcopy.
  Use colons, periods, and parentheses.

### Regenerating generated assets

```bash
node scripts/make-worksheet.mjs   # -> public/downloads/week-audit.pdf
node scripts/make-og.mjs          # -> public/images/og-default.png
```

## Deployment

### Continuous deploy (GitHub Actions)

`.github/workflows/deploy-dontworkharder.yml` builds this subdirectory and deploys
to the Cloudflare Pages project `dontworkharder` on every push that touches
`dontworkharder/**`. It requires one repository secret:

- `CLOUDFLARE_API_TOKEN` — a token with the **Cloudflare Pages: Edit** permission.

The Cloudflare account id is set in the workflow. The Kit env vars are set in the
Cloudflare Pages dashboard (above), not in CI.

### Manual deploy (from this directory)

```bash
npm run build
npx wrangler pages deploy ./dist --project-name dontworkharder
```

Pages Functions in `functions/` deploy automatically with the project.

### Custom domain

- Add `dontworkharder.com` (apex) as a custom domain on the Pages project.
- Add `www.dontworkharder.com` and create a redirect rule `www -> apex`.
- Cloudflare Web Analytics: enable on the Pages project. Cloudflare injects the
  beacon automatically, so there is no script to add and no cookie banner needed.

## Project structure

```
functions/api/subscribe.ts   Cloudflare Pages Function: POST /api/subscribe -> Kit
public/                       Static assets (favicon, OG image, worksheet, _headers, robots)
src/components/               EmailCapture, FiveMoves, CtaCourse, ProofStrip, ArticleCard, Nav, Footer, SEO
src/content/articles/         Cornerstone articles (MDX)
src/data/site.ts              Single source of truth for nav, the Five Moves, metadata
src/layouts/BaseLayout.astro  Shared shell (head, fonts, nav, footer)
src/pages/                    Routes (home, method, course, book, read, articles, about, thanks, privacy, 404)
scripts/                      Generators for the worksheet PDF and OG image
```
