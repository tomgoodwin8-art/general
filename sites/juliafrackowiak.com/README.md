# juliafrackowiak.com

Single-page personal site for Julia Frackowiak — Under-16 track and field athlete,
Thames Valley Harriers. Built per the brief (`Build Brief: juliafrackowiak.com`).

**Subject is a minor (U16).** The safeguards below are mandatory and already
baked into the build.

## Stack

- Astro 4 (static output) + TypeScript
- Tailwind CSS 3 (`@astrojs/tailwind`)
- `@astrojs/sitemap`
- Self-hosted fonts: Fraunces (headings), Inter (body)

## Develop

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Deploy — Cloudflare Pages

Automated by `.github/workflows/deploy-juliafrackowiak.yml`: builds this
subdirectory and deploys `dist/` to the Cloudflare Pages project
`juliafrackowiak-com` on every push to the working branch (and manual
`workflow_dispatch`). Reuses repo secrets `CLOUDFLARE_API_TOKEN` and
`CLOUDFLARE_ACCOUNT_ID`. First run creates the project and yields a
`https://juliafrackowiak-com.pages.dev` URL.

## Safeguards in place (minor)

- **robots.txt** blocks AI *training* crawlers (GPTBot, ClaudeBot,
  Google-Extended, CCBot, Bytespider) while leaving search + real-time answers
  allowed. See `public/robots.txt`.
- **Contact routes to an adult** — the page states enquiries are handled by a
  parent/guardian, and the Web3Forms destination must be a guardian inbox.
- **No DOB, home address, school name, or precise location** in copy, schema,
  `og`, or filenames.

## Before it goes live — manual steps

- [ ] **Photo** — replace `public/images/julia-frackowiak.jpg` (generated
      placeholder) with a guardian-approved athletics/trackside image. Regenerate
      `public/og.jpg` (1200×630).
- [ ] **Web3Forms key** — create an access key, set the destination to the
      **guardian inbox** in the Web3Forms dashboard, and replace
      `YOUR_WEB3FORMS_KEY` in `src/components/Contact.astro`.
- [ ] **Custom domain** — add `juliafrackowiak.com` to the Pages project.
- [ ] **CV data** — fill Events / Personal bests / Selected results in
      `src/components/CV.astro` from verified Power of 10 / OpenTrack data (they
      currently render as "To be confirmed"; do not invent them).
- [ ] **About** — add one sentence naming her main events once confirmed.
- [ ] **Discoverability dial** — to reduce exposure, trim `sameAs` in
      `Base.astro` and drop social links; to increase it, add them.
