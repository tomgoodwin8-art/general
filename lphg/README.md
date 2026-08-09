# London Private Healthcare Group — website

Production website for **London Private Healthcare Group (LPHG)**, a private
clinic at 11 Devonshire Place, London W1. Built per the *Claude Code Build
Brief v1.0*. The site's job is to convert search traffic into booked, paid
appointments — every page publishes its price, and a custom Semble-backed
booking wizard runs the checkout.

## Stack

- **Astro 5** (static-first output), **TypeScript strict**, **Tailwind CSS 4**
  (via `@tailwindcss/vite`; brand tokens in `src/styles/global.css`).
- **Cloudflare Pages** for hosting; **Pages Functions** (`/functions`) for all
  server-side work (Semble booking API, Stripe). No API key ever reaches the
  client.
- **Content collections** with typed **zod** schemas (`src/content.config.ts`) —
  all content is Markdown with typed frontmatter, nothing hardcoded in
  components.
- Self-hosted variable fonts (Inter, Fraunces) via Fontsource, `font-display: swap`.

## Develop

```bash
npm install
npm run dev        # local dev server
npm run build      # static build to dist/ (runs prebuild: gen-catalog)
npm run preview    # preview the build
npm run verify     # build + schema-lint + link-check + unit tests
```

## Deploy (Cloudflare Pages)

Pushing to the working branch triggers `.github/workflows/deploy-lphg.yml`,
which builds, runs the CI checks, then deploys to Cloudflare Pages.

**One-time setup (repo secrets):** `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`
(Settings → Secrets and variables → Actions). The workflow creates the `lphg`
Pages project on first run.

Manual deploy: `npm run deploy` (needs `wrangler login` or the two Cloudflare
env vars).

## Environment variables

Runtime **secrets** are set on the Pages project, never committed
(`wrangler pages secret put <NAME>`), and read by Pages Functions:

| Variable | Used by | Purpose |
|---|---|---|
| `SEMBLE_API_KEY` | `functions/_lib/semble.ts` | Semble GraphQL auth |
| `SEMBLE_API_URL` | `functions/_lib/semble.ts` | Semble GraphQL endpoint |
| `STRIPE_SECRET_KEY` | `functions/_lib/stripe.ts` | Create PaymentIntents |
| `STRIPE_PUBLISHABLE_KEY` | booking wizard (returned by `/api/booking/hold`) | Mount Payment Element |
| `STRIPE_WEBHOOK_SECRET` | `functions/api/stripe/webhook.ts` | Verify webhook signatures |
| `RESEND_API_KEY` | `functions/api/stripe/webhook.ts` | Transactional confirmation email |
| `GA4_ID` | (reserved) | server-side-friendly GA4 |

**Public build var** (safe to expose, set in the Pages build env or `.env`):

| Variable | Purpose |
|---|---|
| `PUBLIC_GA4_ID` | Loads GA4 in Consent-Mode-v2 *denied* default; analytics only fire after consent |

**Optional KV binding:** `AVAILABILITY_CACHE` — 60s availability cache +
webhook idempotency. Create with `wrangler kv namespace create AVAILABILITY_CACHE`
and uncomment the binding in `wrangler.toml`. Functions degrade gracefully
without it.

## Content model (`src/content.config.ts`)

| Collection | Folder | Notes |
|---|---|---|
| `centres` | `src/content/centres` | Welbeck-modelled centre pages (§4.1). 11 centres: women's health, pregnancy, men's health, urology, orthopaedics & MSK, rheumatology, heart, endocrinology, imaging, weight management, private GP |
| `services` | `src/content/services` | One per scan/test/consult (§4.3 schema) |
| `packages` | `src/content/packages` | 6 hero products (§4.2) |
| `specialists` | `src/content/specialists` | Physician schema (SEO asset) |
| `blog` | `src/content/blog` | LPU blog anatomy (§8) |

Schemas enforce SEO limits at build time (`metaTitle` ≤ 65, `metaDescription`
≤ 160) and cross-collection references, so broken links fail the build. Booking
IDs (`sembleBookingTypeId`) are placeholders of the form `LPHG-*` until Tom
supplies the real Semble map; `src/data/booking.ts` detects placeholders and the
wizard shows a call-to-book fallback rather than a dead end.

## Booking flow (`/book/` + `/functions/api`)

Five-step wizard (Service → Time → Details → Payment → Confirmation), a
lazy-loaded vanilla-TS island, deep-linkable via `?service={sembleBookingTypeId}`.

- `POST /api/availability` → Semble slots for a booking type/week (KV-cached 60s).
- `POST /api/booking/hold` → find/create patient, create pending booking, open a
  Stripe PaymentIntent with `bookingId` in metadata, return `client_secret`.
- `POST /api/stripe/webhook` → on `payment_intent.succeeded` confirm the Semble
  booking; on failure/expiry cancel it. Signature-verified, idempotent.

**Sandbox behaviour:** with no Semble/Stripe keys, the endpoints return
synthetic slots and a demo confirmation so the whole flow is demonstrable end to
end. Wire the keys to take live payments. Patient data is never logged or put in
URLs (§6.3).

## SEO / AEO

- Per-page `<Seo>` with canonical, OG/Twitter, and a JSON-LD `@graph`
  (`src/lib/schema.ts`): `MedicalClinic`+`LocalBusiness` sitewide;
  `MedicalTest`+`Offer` on services; `Product`+`Offer` on packages;
  `Physician` on specialists; `MedicalWebPage`+`Article`+`reviewedBy` on posts;
  `FAQPage` and `BreadcrumbList` where relevant.
- `/llms.txt` and `/robots.txt` are generated from data (single source of truth);
  robots explicitly allows GPTBot, ClaudeBot, PerplexityBot, Google-Extended.
- Every service/blog page opens with a bolded 40–60 word AEO answer.
- CI gates: `lint:schema` (all JSON-LD parses) and `lint:links` (zero broken
  internal links, zero orphan indexable pages).

## Brand tokens (⚠ PENDING SIGN-OFF)

Brief §3 requires tokens **extracted from londonsono.com** and signed off before
site-wide use. The live stylesheet could not be crawled in the build
environment, so `src/styles/global.css` currently ships a **clinical-calm
placeholder palette**:

| Token | Value | Role |
|---|---|---|
| `brand.primary` | `#103a3a` | deep clinical teal |
| `brand.accent` | `#a9743b` | warm brass |
| `brand.surface` | `#f6f3ec` | bone |
| `brand.ink` | `#1b2321` | near-black ink |

**Action:** extract the real LPU hexes + heading/body font families, replace the
tokens, and confirm here before launch.

## Open items for Tom (brief §11)

- [ ] LPHG logo asset (text lockup is in use meanwhile) + final palette/type sign-off
- [ ] Real brand tokens extracted from londonsono.com
- [ ] Domain confirmation (placeholder `www.lphg.co.uk` in `astro.config.mjs` + `src/data/site.ts`)
- [ ] NAP details marked `[TOM TO CONFIRM]` in `src/data/site.ts` (phone, email, postcode, CQC number, sameAs)
- [ ] Semble sandbox credentials + real `bookingTypeId` map (replace `LPHG-*` placeholders)
- [ ] Stripe account keys + webhook secret; Resend domain verification
- [ ] Consultant roster content (only Ali Aghaei, named in the brief, is loaded)
- [ ] Real Google/Doctify review figures (`src/data/site.ts` — ratings stay hidden and no `aggregateRating` schema until supplied, §7)
- [ ] 48-hour cancellation policy final wording (`/terms/`)
- [ ] Per-page OG images (a single default ships now)

## What is built vs. staged

**Built and working:** full architecture, 11 centres, ~56 service pages, 6
packages, transparent filterable price list, specialists framework, the complete
booking wizard + Semble/Stripe functions (sandbox-ready), SEO/AEO layer,
`llms.txt`/`robots.txt`/sitemap/RSS/redirects, and the blog component system with
exemplar posts.

**Pricing:** new-specialism service prices follow the business plan v2 §4 tariff
(initial specialist consultation £250, follow-up £150, scans £150–£350,
procedures higher). Phase-1 prices from the original build (e.g. some
consultations at £280–£350, well-woman screen £350) predate that tariff and can
be reconciled to it on request.

**Specialisms:** the six Phase-1 centres plus the plan's Phase-2/3 additions —
Endocrinology & Metabolic, Rheumatology, Urology, an expanded Orthopaedics & MSK
(surgeon, sports medicine, sub-specialty clinics, physiotherapy), and Private GP
as its own front-door centre.

**Blog posts:** the reference anatomy (§8) is implemented as a component system.
The weight-management post (post 20, authored + reviewed by Ali Aghaei) is
`approved` and live; further posts are drafted as `in-review` (built as
`noindex`, excluded from the index) pending named clinical reviewers — the
brief's own gate: *no post goes live without a named reviewer*. The remaining
launch posts follow once the consultant roster is confirmed.
