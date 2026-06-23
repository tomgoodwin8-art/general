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
    "https://www.linkedin.com/in/thomasgoodwin/",
    "https://www.youtube.com/@TomGoodwinLondon",
    "https://find-and-update.company-information.service.gov.uk/company/hii-internet-group",
    "https://hellogameplan.com",
    "https://cleancodesites.com",
    "https://www.google.com/partners/agency",
    "https://www.wikidata.org/entity/Q140278196",
    "https://www.crunchbase.com/person/tom-goodwin-51ac",
  ],
} as const;

/** Social profiles for footer icons (single source of truth). */
export const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/thomasgoodwin/" },
  { label: "YouTube", href: "https://www.youtube.com/@TomGoodwinLondon" },
] as const;

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
  { year: "2010", role: "Assembly", note: "Started in performance marketing.", logo: "/images/timeline/assembly.png" },
  { year: "2013", role: "Sofa & Chair", note: "Brand-side growth.", logo: "/images/timeline/sofa-chair.png" },
  { year: "2018", role: "Croud", note: "Consulting, the digital-nomad years.", logo: "/images/timeline/croud.png" },
  { year: "2021", role: "Ascend Global", note: "Managing Director; led the acquisition.", logo: "/images/timeline/ascend.png" },
  { year: "2023", role: "Medialab", note: "Search Director, £20m+ managed.", logo: "/images/timeline/medialab.png" },
  { year: "2024", role: "GAMEPLAN.", note: "Founded the consultancy, full-time.", logo: "/images/timeline/gameplan.png" },
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

/** Logo wall (§4.2) — white marks on dark, from supplied brand logos. */
export const logoWall = [
  { name: "Gucci", src: "/images/logos/gucci.png" },
  { name: "Hilton", src: "/images/logos/hilton.png" },
  { name: "ASOS", src: "/images/logos/asos.png" },
  { name: "Skyscanner", src: "/images/logos/skyscanner.png" },
  { name: "Fortnum & Mason", src: "/images/logos/fortnum.png" },
  { name: "Huel", src: "/images/logos/huel.png" },
  { name: "ghd", src: "/images/logos/ghd.png" },
  { name: "Hearst", src: "/images/logos/hearst.png" },
  { name: "Save the Children", src: "/images/logos/savethechildren.png" },
  { name: "Great Ormond Street Hospital", src: "/images/logos/gosh.png" },
  { name: "YouGov", src: "/images/logos/yougov.png" },
  { name: "THG", src: "/images/logos/thg.png" },
  { name: "SunLife", src: "/images/logos/sunlife.png" },
  { name: "Revive Collagen", src: "/images/logos/revive.png" },
  { name: "FFS Beauty", src: "/images/logos/ffs.png" },
  { name: "Olivia's", src: "/images/logos/olivias.png" },
  { name: "Hallmark", src: "/images/logos/hallmark.png" },
  { name: "Sharps", src: "/images/logos/sharps.png" },
  { name: "Regus", src: "/images/logos/regus.png" },
  { name: "PushDR", src: "/images/logos/pushdr.png" },
  { name: "London Private Ultrasound", src: "/images/logos/lpu.png" },
] as const;
