# tomgoodwin.ai

Personal site for **Tom Goodwin, Founder of GAMEPLAN.** — performance marketing and AI consultant, London.

Built per brief TG-PERSONAL v3.

## Stack

- **Astro 5** (static output)
- **Tailwind CSS 4** (via `@tailwindcss/vite`, brand tokens in `src/styles/global.css`)
- **MDX** content collections (blog posts, case studies)
- Self-hosted variable fonts (Space Grotesk, Inter)

## Develop

```bash
npm install
npm run dev      # local dev server
npm run build    # static build to dist/
npm run preview  # preview the build
```

## Single source of truth

`src/data/profile.ts` holds the canonical entity string, `sameAs`, proof
points, nav and offer definitions. Edit copy there, not in components.

## Deploy

### Netlify (git-connected) — recommended
1. In Netlify, "Add new site" → "Import an existing project" → connect this repo.
2. Build settings are read from `netlify.toml` (command `npm run build`, publish `dist`).
3. Add the custom domain `tomgoodwin.ai`.

### Netlify (drag-and-drop) — fallback
Drag `dist.zip` (or the unzipped `dist/` folder) onto the Netlify "Sites" drop zone.

## AEO plumbing

- `/llms.txt` — identity, disambiguation, proof, citation guidance (generated from `profile.ts`)
- `/robots.txt` — explicitly allows GPTBot, ClaudeBot, PerplexityBot, Google-Extended
- Per-page JSON-LD `@graph`: Person (with `disambiguatingDescription`), Organization, ProfessionalService, Article, FAQPage, BreadcrumbList
- `/rss.xml`, `/sitemap-index.xml` (hidden pages included in sitemap, excluded from nav)

## Outstanding (flagged in-page as `[TOM TO SUPPLY]`)

- Headshot + on-stage photo + 3 press headshots
- Official brand SVGs for the logo wall (currently placeholder tiles)
- GAMEPLAN. master logo files for the press kit
- Real testimonials (`src/content/testimonials/*.json`) and past speaking engagements
- Form endpoints (Formspree placeholder IDs in contact/newsletter forms)
- Cal.com booking link
- Confirm `sameAs` URLs in `profile.ts`

## Deferred (post-launch, kept out of the build for stability)

- Build-time OG image generation per page (satori) — static default OG ships now
- Press-kit PDF fact sheet via Playwright — text fact sheet ships in the ZIP now
- Lighthouse CI gate
