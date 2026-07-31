# brentfordcard.com

The community platform for **Brentford, TW8** — local news, an independent
business directory, and **The Brentford Card**, a £29/year discount card
delivered as an Apple/Google Wallet pass.

Built to the MVP brief (`brentfordcardcombuildspec.md`): Astro 5, static output,
vanilla CSS, Cloudflare Pages.

## Stack

- **Astro 5**, static output, zero client JS by default (contact form is the
  only page that ships script).
- **Vanilla CSS** with design tokens as custom properties — no Tailwind, no
  framework. All styles live in `src/styles/global.css` (~21KB, budget 40KB).
- **Content collections** (type-safe): `directory`, `news`, `press`.
- Self-hosted variable fonts (Archivo display, Inter body) via `@fontsource`,
  with metric-matched fallbacks for near-zero CLS.
- **Cloudflare Pages** hosting + **Pages Functions** for the forms.

## Develop

```bash
npm install
npm run dev        # local dev server
npm run build      # static build to dist/
npm run preview    # preview the build
```

## Deploy — Cloudflare Pages

### CI (recommended)
Push to the deploy branch; `.github/workflows/deploy-brentfordcard.yml` builds
and deploys. One-time: add repo secrets `CLOUDFLARE_API_TOKEN` and
`CLOUDFLARE_ACCOUNT_ID`. The first run creates the `brentfordcard-com` Pages
project. Then add the custom domain `brentfordcard.com` in the Pages dashboard.

### Local / manual
```bash
npm run deploy     # astro build && wrangler pages deploy dist --project-name brentfordcard-com
```

## Design system

- **Tokens** (FIXED): ink, plaster, river, brass, brick, mist — see
  `:root` in `src/styles/global.css`.
- **The Confluence Mark** — three strokes converging to a point (Thames, Brent,
  Grand Union Canal). `src/components/ConfluenceMark.astro`; used as logo,
  divider, and an animated hero draw-on that respects `prefers-reduced-motion`.
- **The card** renders as pure CSS/SVG (`src/components/Pass.astro`) — crisp at
  any DPR, doubles as the press-kit asset.

## Content — single source of truth

- `src/data/site.ts` — site facts, NAP, card scheme (price, charity %, founding
  count), categories, nav. Edit copy here.
- `src/data/faq.ts` — the eight card FAQ answers (kept as standalone sentences
  for answer engines).
- `src/content/directory/*.md` — 25 listings. `src/content/news/*.md` — 6
  articles. `src/content/press/*.md` — releases.

## SEO / AEO plumbing

- `/llms.txt` (< 2KB), `/robots.txt` (allows GPTBot, ClaudeBot, PerplexityBot,
  Google-Extended, CCBot), `/rss.xml`, `/sitemap-index.xml`.
- One JSON-LD `@graph` per page: `Organization` + `WebSite` site-wide, plus
  `LocalBusiness`/`NewsArticle`/`Product`+`Offer`/`FAQPage`/`BreadcrumbList`.
  See `src/lib/schema.ts` and `src/components/Head.astro`.
- Answer-first pattern: every directory page opens with a one-sentence factual
  summary; every article opens with a fact-first standfirst.

## Forms

`functions/api/contact.ts` and `functions/api/subscribe.ts` are Cloudflare Pages
Functions. They enforce a honeypot and verify Turnstile, and degrade gracefully
until you bind config in the Pages dashboard:

- KV namespace `SUBMISSIONS` — stores submissions.
- Secret `TURNSTILE_SECRET` — server-side Turnstile verification.
- Vars `CONTACT_FORWARD_URL` / `NEWSLETTER_FORWARD_URL` — optional webhooks.

Add the Turnstile **site key** to render the widget client-side (reserved space
is already in the layout, so adding it causes no CLS).

## To supply before public launch (flagged in code)

- **Photography / hero film** — the build ships crisp SVG placeholders (`Poster.astro`);
  swap for Cloudflare Images `<img srcset>` and a Cloudflare Stream loop. The
  poster must remain the LCP element.
- **Stripe Payment Link** — set `CARD.stripeLink` in `src/data/site.ts`.
- **Turnstile keys**, **KV binding**, **wallet-pass provider** (PassKit or
  equivalent) for real pass issuance on `/card/success/`.
- **Cloudflare Web Analytics** token in `src/components/Head.astro`.
- **Directory data** — the 25 listings are a representative launch set on real
  Brentford streets with placeholder phone numbers; confirm details with each
  business at onboarding.
- **Founder bio + real charity partner name** — placeholders in `/press/` and
  `src/data/site.ts`.
- Confirm `sameAs` socials + add the Wikidata entity once created.
