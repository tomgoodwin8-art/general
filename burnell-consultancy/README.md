# burnellconsultancy.co.uk (static site)

A self-contained static HTML build of the Burnell Consultancy website, ready to
drag-and-drop onto Netlify. No build tooling or framework required at deploy
time: every page is plain HTML, one CSS file, and ~1KB of JavaScript for the
mobile nav.

## Deploy to Netlify (drag-and-drop)

1. Unzip `burnell-consultancy-site.zip`.
2. Go to Netlify, "Add new site" > "Deploy manually".
3. Drag the **unzipped `dist/` folder** (or the zip itself) onto the drop zone.

That is the whole deploy. `_headers` and `_redirects` are honoured automatically.

## What is in the box

- 18 pages: home, /assessment, 4 service pages, 3 persona pages, /about,
  /scorecard, /contact, insights index + 4 article outlines, /thank-you, 404.
- AEO layer: JSON-LD `@graph` (Organization, Person, ProfessionalService,
  Service/Offer, FAQPage, Article, BreadcrumbList) on every page, `/llms.txt`,
  `/robots.txt` (allows GPTBot, ClaudeBot, Claude-Web, PerplexityBot,
  Google-Extended), `/sitemap.xml`.
- Design system in `css/styles.css` using the brief's brand tokens.
- Favicon (monogram B), SVG OG card, portrait placeholder.

## Regenerating

Everything is generated from `build.py` (pure Python 3, no dependencies):

```bash
python3 build.py            # writes ./dist
```

## Content included

- **Founder photo**: the real portrait ships at `assets/dave.jpeg` (processed
  from `DaveBurnell.png`) and appears in the hero, founder strip and About page.
  To swap it, replace `assets-src/dave.jpeg` and rebuild. An SVG placeholder
  still auto-shows if the file is ever missing.
- **Calendly**: a real inline booking widget is embedded on `/assessment` and
  `/contact` (loads `assets.calendly.com/assets/external/widget.js`, with a
  no-JS fallback link). Point `CALENDLY_URL` in `build.py` at the live event.
- **Insights**: ten complete, AEO-optimised articles across the three ICPs, each
  with a branded thumbnail, inline contextual links to the service pages, a
  "services referenced" block and a CTA footer.
- **Enterprise track record**: a greyscale logo bar (IBM, HP, G-Research,
  Aristocrat) on the home page, captioned as the founder's employer history.

## Before go-live (placeholders to replace)

- **Forms**: the contact and scorecard forms post to `/thank-you/` by default.
  Wire them to a Netlify Form, Formspark or a Function delivering to
  `hello@burnellconsultancy.co.uk` (both forms carry a `source` field).
- **Company number**, `sameAs` URLs (LinkedIn, GitHub, ORCID, Google Scholar,
  Companies House) and the OG PNG export are marked `[placeholder]` in-page and
  in the JSON-LD.
- **Fonts**: ships with a system font stack (renders Inter where installed). To
  fully self-host Inter, add the woff2 files and an `@font-face` block.

No fabricated testimonials, client logos, review scores or certifications are
present anywhere, per the brief's integrity rule.
