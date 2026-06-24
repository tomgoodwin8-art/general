# Harley Street Digital

A curated directory of private clinics and practices in and around the Harley
Street medical district, London W1. Built with [Astro](https://astro.build) v5
and deployed on Netlify.

## What's here

- **`/`** — landing page with category overview.
- **`/directory`** — the full directory: 12 specialisms, one row per practice,
  each with address, postcode, phone and website where confirmed. Emits
  `ItemList` / `MedicalClinic` JSON-LD covering every entry.

## Data

All listing data lives in a single source of truth: **`src/data/clinics.ts`**.

Each clinic carries a `verified` boolean:

- `verified: true` — name, address, postcode, phone and site all came from a
  primary source.
- `verified: false` — name and site are good, but phone or postcode needs a
  check against the clinic's own contact page (rendered with a **Confirm**
  badge). Blank phone/postcode fields are left blank deliberately, never
  guessed.

To filter the unverified entries before a publish pass:

```bash
grep "verified: false" src/data/clinics.ts
```

`clinics.ts` also exports `totalListings`, `uniqueClinicCount` and
`unverifiedCount`, all computed from the data so the on-page counters never
drift.

### Team notes carried over from the source brief

- One Heart Clinic is set to 68 Harley Street, W1G 7HE.
- **Dentistry** (10 entries) and **General practice** (11 entries) sit just
  under 12. The street genuinely supports 12+; they are short only on verified
  NAP, not on real clinics — flagged in-page for a quick top-up, not padded
  with invented entries.
- A few addresses sit just outside the W1G core (KUER Physio at Hanover Square
  W1S, Fortius at Fitzroy Square W1T, EchoMed at Bulstrode Place W1U,
  SameDayDoctor at Queen Anne Street). Keep or cut depending on how tight the
  district boundary should be.

## Develop

```bash
npm install
npm run dev      # local dev server
npm run build    # production build to ./dist
npm run preview  # preview the production build
```

## Deploy (Netlify)

`netlify.toml` is configured (`npm run build` → publish `dist`). Connect this
repo to a Netlify site and point the `harleystreetdigital.com` domain at it.
