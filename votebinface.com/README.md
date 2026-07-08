# votebinface.com

Supporter campaign site for Count Binface's candidacy in the Clacton
by-election. Static Astro v5 site, Tailwind v4, deployed to Cloudflare Pages.

> The bin is the joke. The ballot is not. Primary conversion: UK voter
> registration and postal-vote applications on gov.uk.

## Commands

```bash
npm install
npm run dev        # local dev server
npm run build      # imprint check -> OG generation -> astro build (to dist/)
npm run preview    # preview the built dist/
npm run deploy      # strict imprint check + build + wrangler deploy
npm run check       # run the imprint/authorisation check only
npm run gen-og      # regenerate the Open Graph cards
```

## Operating mode (READ THIS BEFORE DEPLOY)

The site has two legally distinct modes, resolved in `src/config/mode.ts` from
`SITE.authorisationRef` in `src/data/facts.ts`:

- **Authorised mode** (`authorisationRef` set): the statutory imprint names
  **The Count Binface Party**, disclaimers are dropped, and party framing is
  used. Only valid when the party's written authorisation is genuinely on file.
  All spend on this site then counts toward the candidate's regulated election
  expenses and must be signed off by the election agent.
- **Fan mode** (`authorisationRef` empty, the default): naming the party on the
  imprint without authorisation would be a **false imprint and an offence**, so
  the imprint instead names the real promoter (`fanPromoterName` /
  `fanPromoterAddress`) and the site carries non-affiliation disclaimers.

Before **any** public deploy:

1. If deploying in **fan mode**, replace the `{{IMPRINT_PROMOTER_NAME}}` and
   `{{IMPRINT_PROMOTER_ADDRESS}}` tokens in `src/data/facts.ts` with the real
   promoter's name and postal address.
2. If deploying in **authorised mode**, set `SITE.authorisationRef` to the
   party's written authorisation reference.

`npm run deploy` runs the check with `REQUIRE_AUTHORISATION=1`, which **fails
the build** if the imprint is empty, if authorisation is missing, or if the
fan-mode promoter tokens are unresolved. `npm run build` is lenient (warns and
ships fan mode) so previews work.

## Cloudflare Pages setup

- **Build command:** `npm run build` — **Output directory:** `dist`
- **Custom domain:** add `votebinface.com`. Set a Cloudflare **Redirect Rule**
  to 301 `www.votebinface.com` -> apex (or the reverse); Pages does not do host
  redirects from `_headers`/`_redirects`.
- **Web Analytics:** enable cookieless Cloudflare Web Analytics for the domain
  (auto-injection). The CSP in `public/_headers` already allows
  `static.cloudflareinsights.com` and `cloudflareinsights.com`. gov.uk outbound
  buttons and share buttons carry `data-event` attributes for custom events.
- **Function secrets** (Pages project settings, never commit):
  - `VOLUNTEER_WEBHOOK_URL` — destination for `/volunteer-signup` submissions.
  - `EMAIL_LIST_WEBHOOK_URL` — provider endpoint that starts email double
    opt-in for `/subscribe`.
  Both functions no-op safely if the secret is unset (preview builds).

## Content

Single sources of truth:

- `src/data/facts.ts` — all canonical figures, URLs, deadlines, imprint, config.
- `src/content/pledges/*.md` — manifesto pledges.
- `src/content/faq.json` — FAQ entries.
- `src/content/press/*.md` — press releases (quotes attributed to Baron
  Kerbside only, never Count Binface).

Dates are never hardcoded: they render from `SITE.pollingDate` etc., defaulting
to "to be confirmed" / "TBC".

## Images

All artwork is original SVG/PNG (helmet mascot, hazard tape, favicon, OG cards)
so no third-party licensing is required. **Do not** add scraped or hotlinked
photographs. To add an owner photo or a CC-licensed Commons image, follow
`src/assets/supplied/README.md` and record credits on `/legal`.

## Accessibility & performance

WCAG 2.2 AA: skip link, visible focus, keyboard-operable, reduced-motion
respected, body-text contrast >= 4.5:1 (`--dgrey` is used for borders only,
never body text). Fonts self-hosted and Latin-subset; hero not lazy-loaded;
near-zero client JS.
