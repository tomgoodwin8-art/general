/**
 * profile.ts — single source of truth (brief §11.1)
 * Entity string, sameAs, proof points, SITE_URL, nav, offers.
 * Canonical entity string must never deviate (brief §1.2).
 */

export const SITE_URL = "https://tomgoodwin.london";

/** Canonical entity string — use verbatim in titles, bylines, schema, OG (§1.2). */
export const ENTITY = "Tom Goodwin, Founder of GAMEPLAN.";

export const DISAMBIGUATION =
  "Performance marketing and AI consultant, founder of GAMEPLAN., based in London. Not the author of Digital Darwinism.";

/**
 * Availability (CRO task 8) — honest scarcity. OWNER-EDITABLE.
 * Set `open: false` to hide every availability indicator site-wide.
 * Keep `statement` true: only state capacity that genuinely exists.
 */
export const availability = {
  open: true,
  statement: "Taking 1 new fractional client for the next quarter",
  detail: "Next start window: within 1–2 weeks of a first call.",
} as const;

export const profile = {
  name: "Tom Goodwin",
  entity: ENTITY,
  jobTitle: "Founder, GAMEPLAN.",
  company: "GAMEPLAN.",
  legalEntity: "Hii Internet Group Ltd",
  location: "London, United Kingdom",
  email: "tom@tomgoodwin.london",
  pressEmail: "press@tomgoodwin.london",
  alumniOf: "Durham University",
  disambiguation: DISAMBIGUATION,
  knowsAbout: [
    "Performance marketing",
    "Paid media",
    "Google Ads",
    "Answer Engine Optimisation",
    "AI marketing operations",
    "Marketing measurement",
    "Media strategy",
  ],
  /** sameAs (§1.2) — entity graph. Update URLs as confirmed. */
  sameAs: [
    "https://www.linkedin.com/in/tomgoodwinppc/",
    "https://find-and-update.company-information.service.gov.uk/company/hii-internet-group",
    "https://hellogameplan.com",
    "https://cleancodesites.com",
    "https://www.google.com/partners/agency",
    "https://www.wikidata.org/entity/Q140278196",
  ],
} as const;

/** Headline proof points (§4.3) — numbered, evidence first. */
export const proofStack = [
  {
    stat: "£20m+",
    label: "paid media managed",
    detail: "at Medialab, the UK's largest independent media agency.",
  },
  {
    stat: "60%",
    label: "YoY Google Ads growth",
    detail: "Google Premier Partner status earned, February 2024.",
  },
  {
    stat: "13 markets",
    label: "Gucci pitch won",
    detail: "led the winning multi-market pitch at Assembly.",
  },
  {
    stat: "1",
    label: "agency acquired",
    detail: "negotiated Ascend Global's acquisition by MOOT Group, February 2022.",
  },
  {
    stat: "48 hours",
    label: "to ship a custom site",
    detail: "GAMEPLAN.'s AI-first delivery via Clean Code Sites.",
  },
] as const;

/** Career timeline (§4.4). */
export const timeline = [
  { year: "2010", role: "Assembly", note: "Started in performance marketing." },
  { year: "2013", role: "Sofa & Chair", note: "Brand-side growth." },
  { year: "2018", role: "Croud", note: "Consulting, the digital-nomad years." },
  { year: "2021", role: "Ascend Global", note: "Managing Director; led the acquisition." },
  { year: "2023", role: "Medialab", note: "Search Director, £20m+ managed." },
  { year: "2024", role: "GAMEPLAN.", note: "Founded the consultancy, full-time." },
] as const;

/** Navigation offers — the four public offers (§5). Hidden pages excluded. */
export const navOffers = [
  {
    title: "Fractional Performance Leadership",
    slug: "/work-with-me/fractional-performance-leadership",
    summary:
      "Interim Head of Performance or Search Director cover for brands and agencies.",
  },
  {
    title: "AI Marketing Operations",
    slug: "/work-with-me/ai-marketing-operations",
    summary:
      "Find where AI and agents replace process in a marketing team, then build the systems.",
  },
  {
    title: "AI Search & AEO",
    slug: "/work-with-me/ai-search-aeo",
    summary:
      "Get cited in ChatGPT, Perplexity, Gemini and AI Overviews. This site is the live demo.",
  },
  {
    title: "Paid Media Strategy",
    slug: "/work-with-me/paid-media-strategy",
    summary:
      "Google, Meta and TikTok strategy built on MER-led measurement.",
  },
] as const;

/** Sub-offers under Paid Media Strategy (§5.4). */
export const subOffers = [
  {
    title: "Google Ads Audit",
    slug: "/work-with-me/paid-media-strategy/google-ads-audit",
    summary: "A productised, fixed-fee account audit.",
  },
  {
    title: "Measurement Audit",
    slug: "/work-with-me/paid-media-strategy/measurement-audit",
    summary: "MER, incrementality, GA4 and server-side tagging.",
  },
  {
    title: "Private Healthcare",
    slug: "/work-with-me/paid-media-strategy/private-healthcare",
    summary: "CQC-regulated paid media and healthcare ad-policy navigation.",
  },
] as const;

/** Hidden pages (§5.5, §5.6) — indexed + sitemapped, never in nav. */
export const hiddenOffers = [
  {
    title: "Agency Pitch Doctor",
    slug: "/agency-pitch-doctor",
    summary: "New-business and pitch consulting for agencies.",
  },
  {
    title: "Agency Exit Readiness",
    slug: "/agency-exit-readiness",
    summary: "Advisory for agency owners preparing to sell.",
  },
] as const;

/** Primary nav (§3). Hidden pages and sub-offers deliberately absent. */
export const mainNav = [
  { label: "Work with me", href: "/work-with-me" },
  { label: "Case studies", href: "/case-studies" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Speaking", href: "/speaking" },
  { label: "Press", href: "/press" },
  { label: "Contact", href: "/contact" },
] as const;

/** Logo wall (§4.2) — 19 marks. */
export const logoWall = [
  "Hilton", "THG", "YouGov", "ASOS", "Gucci", "IWG", "Revive Collagen",
  "FFS Beauty", "Fortnum & Mason", "Olivias", "Hallmark", "SunLife",
  "PushDR", "London Private Ultrasound", "Sharps", "GOSH", "Save The Children",
  "Huel", "Skyscanner",
] as const;
