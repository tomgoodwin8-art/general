# London Private Ultrasound — homepage mockup

A static, responsive HTML/CSS mockup of the londonsono.com homepage implementing
the CRO audit changes. Single file, no build step, no framework.

## Deploy to Netlify

**Drag-and-drop (fastest):**
1. Unzip `londonsono-mockup.zip`.
2. Go to the Netlify dashboard → "Sites" → drag the unzipped folder onto the drop zone.

**Or via the Netlify CLI:**
```bash
npx netlify deploy --dir=. --prod
```

## What's in here

- `index.html` — the whole mockup (CSS in a `<style>` block, a little vanilla JS).
- `netlify.toml` — publishes the current directory with basic security headers.

## Reviewing the mockup

- Loads in the **After** (redesign) layout by default.
- Use the small grey **Before / After** toggle (top-right) to flip the fold.
- Test at desktop (≥1024px) and mobile (≤480px) widths — the fold differs at both.
