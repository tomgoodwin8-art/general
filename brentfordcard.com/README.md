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

## Payments + wallet passes

End-to-end flow: **buy → pay (Stripe) → record (Supabase) → issue an Apple/Google
Wallet pass**. All server-side in Cloudflare Pages Functions; the browser never
touches Supabase or the signing keys.

```
/card/  ──POST /api/checkout──▶  Stripe Checkout
                                     │ pays
                                     ▼
Stripe ──▶ POST /api/stripe-webhook ──▶ Supabase (member, order, pass)
                                     │            └─ Google Wallet object created
                                     ▼
/card/success/?session_id=… ──GET /api/pass/by-session──▶ { serial, token, cardNumber }
        │  "Add to Apple Wallet" ▶ GET /api/pass/apple/:serial?t=…  (signed .pkpass)
        └─ "Add to Google Wallet" ▶ GET /api/pass/google/:serial?t=… (Save-to-Wallet JWT)
```

Key files:
- `functions/api/checkout.ts` — creates the Stripe Checkout Session (zero-JS form POST).
- `functions/api/stripe-webhook.ts` — verifies the signature (WebCrypto) and provisions.
- `functions/_lib/provision.ts` — upserts member + order + pass (idempotent on the session).
- `functions/_lib/applePass.ts` — builds and signs the `.pkpass` (node-forge + fflate).
- `functions/_lib/googleWallet.ts` — creates the class/object and mints the Save JWT (jose).
- `functions/api/apple/[[path]].ts` — Apple Wallet web service for pass push-updates.

### Setup checklist

1. **Supabase** — create a project, run `supabase/migrations/0001_init.sql` (CLI
   `supabase db push`, or paste into the SQL editor). Set `SUPABASE_URL` and
   `SUPABASE_SERVICE_ROLE_KEY` in the Pages dashboard.
2. **Stripe** — create a restricted/secret key. Add a webhook endpoint pointing at
   `https://brentfordcard.com/api/stripe-webhook` for the `checkout.session.completed`
   event; copy its signing secret. Set `STRIPE_SECRET_KEY` and
   `STRIPE_WEBHOOK_SECRET` (optionally `STRIPE_PRICE_ID`).
3. **Apple Wallet** — Apple Developer account → create a Pass Type ID and its
   certificate; export the cert+key as `.p12`. Download the Apple WWDR
   intermediate cert. Base64-encode each (`base64 -w0`) and set
   `APPLE_PASS_TYPE_ID`, `APPLE_TEAM_ID`, `APPLE_PASS_CERT_P12_BASE64` (+
   `APPLE_PASS_KEY_PASSWORD`), `APPLE_WWDR_PEM_BASE64`.
4. **Google Wallet** — enable the Wallet API, create an issuer account and a
   service account with the Wallet Object Issuer role; download its key. Set
   `GOOGLE_WALLET_ISSUER_ID`, `GOOGLE_SA_EMAIL`, `GOOGLE_SA_PRIVATE_KEY`.
5. **Email (optional)** — `RESEND_API_KEY` + `EMAIL_FROM` to send the pass link.

Every Function returns a clear `503 { "not_configured", missing: […] }` until its
vars exist, so you can wire the pieces in any order without breaking the site.
`compatibility_flags = ["nodejs_compat"]` (in `wrangler.toml`) is required — the
Apple pass signer uses Node built-ins.

### Local dev

```bash
cp .dev.vars.example .dev.vars   # fill in test keys (git-ignored)
npm run build && npx wrangler pages dev dist   # Functions run locally
# In another shell, forward Stripe test webhooks:
stripe listen --forward-to localhost:8788/api/stripe-webhook
```

### Regenerating the pass image assets

`functions/_lib/passAssets.ts` holds base64 PNGs (icon/logo) for the `.pkpass`.
Regenerate from the Confluence Mark with `npm i -D sharp && node scripts/gen-pass-assets.mjs .`
(sharp is only needed for this one-off step; the generated file is committed).

## To supply before public launch (flagged in code)

- **Photography / hero film** — the build ships crisp SVG placeholders (`Poster.astro`);
  swap for Cloudflare Images `<img srcset>` and a Cloudflare Stream loop. The
  poster must remain the LCP element.
- **Payment + pass credentials** — the full checkout → pass flow is built (see
  "Payments + wallet passes"); it needs Stripe, Supabase, Apple Wallet and Google
  Wallet accounts + keys set as Pages env vars before it goes live.
- **Turnstile keys** and **KV binding** for the contact/newsletter forms.
- **Cloudflare Web Analytics** token in `src/components/Head.astro`.
- **Directory data** — the 25 listings are a representative launch set on real
  Brentford streets with placeholder phone numbers; confirm details with each
  business at onboarding.
- **Founder bio + real charity partner name** — placeholders in `/press/` and
  `src/data/site.ts`.
- Confirm `sameAs` socials + add the Wikidata entity once created.
