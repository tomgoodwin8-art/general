# nelafrackowiak.com

Single-page personal site for Nela Frackowiak — A-level student, licensed glider
pilot, aspiring engineer. Built per the brief (`Build Brief: nelafrackowiak.com`).

**Subject is an adult (18).** Full professional discoverability is intended; the
only restraint is the CV-vs-public distinction (no phone, DOB, or home address).

## Stack

- Astro 4 (static output) + TypeScript
- Tailwind CSS 3 (`@astrojs/tailwind`)
- `@astrojs/sitemap`
- Self-hosted fonts: Fraunces (headings), Inter (body)

## Develop

```bash
npm install
npm run dev      # local dev server
npm run build    # static build to dist/
npm run preview
```

## Deploy — Cloudflare Pages

Deployment is automated by `.github/workflows/deploy-nelafrackowiak.yml`, which
builds this subdirectory and deploys `dist/` to the Cloudflare Pages project
`nelafrackowiak-com` on every push to the working branch (and on manual
`workflow_dispatch`). It reuses the repo secrets `CLOUDFLARE_API_TOKEN` and
`CLOUDFLARE_ACCOUNT_ID`.

The first successful run creates the project and yields a
`https://nelafrackowiak-com.pages.dev` URL.

## Before it goes live — manual steps (need dashboard / real assets)

- [ ] **Portrait** — replace `public/images/nela-frackowiak.jpg` (currently a
      generated greyscale placeholder) with the supplied portrait, cropped 4:5.
      Regenerate `public/og.jpg` (1200×630) to match.
- [ ] **Web3Forms key** — create an access key, set the destination to
      `nela.frackowiak12@gmail.com` in the Web3Forms dashboard, and replace
      `YOUR_WEB3FORMS_KEY` in `src/components/Contact.astro`.
- [ ] **Custom domain** — add `nelafrackowiak.com` to the Pages project;
      Cloudflare provisions TLS.
- [ ] **Social handles** — add Instagram/TikTok to `src/components/Links.astro`
      and to the `sameAs` array in `src/layouts/Base.astro` once known.
- [ ] **Confirm** the restaurant name "Villa di Gignano" before publishing.

## Kept private (per brief §11)

No mobile number, date of birth, or home address appears in copy, schema, `og`,
or filenames.
