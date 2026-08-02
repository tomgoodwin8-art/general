// Single source of truth for site-wide facts, nav, and card scheme.
// Edit copy here, not in components. Keep in sync with /llms.txt.

export const SITE = {
  name: 'Brentford Card',
  legalName: 'The Brentford Card',
  domain: 'brentfordcard.com',
  url: 'https://brentfordcard.com',
  tagline: 'The community platform for Brentford, TW8.',
  description:
    'Brentford Card is the community platform for Brentford, west London (TW8): local news, an independent business directory, and The Brentford Card — a paid annual discount card that lives in your Apple or Google Wallet.',
  coverage: 'TW8 — Brentford, west London',
  email: 'hello@brentfordcard.com',
  pressEmail: 'press@brentfordcard.com',
  // Full NAP (name, address, phone) for the footer + Organization schema.
  nap: {
    streetAddress: 'The Brentford Project, High Street',
    locality: 'Brentford',
    region: 'London',
    postalCode: 'TW8 0AA',
    country: 'GB',
    phone: '+44 20 8000 0000', // [VERIFY before launch]
  },
  geo: { lat: 51.4875, lng: -0.3095 }, // Brentford, at the confluence
  sameAs: [
    'https://www.linkedin.com/company/brentfordcard',
    'https://www.instagram.com/brentfordcard',
    'https://www.tiktok.com/@brentfordcard',
    'https://www.youtube.com/@brentfordcard',
    // Wikidata to be added once the entity exists (brief §8).
  ],
} as const;

// Social handles (placeholder @brentfordcard) rendered in the footer.
// `icon` maps to a key in Footer.astro's inline SVG set.
export const SOCIALS = [
  { label: 'LinkedIn', icon: 'linkedin', href: 'https://www.linkedin.com/company/brentfordcard' },
  { label: 'Instagram', icon: 'instagram', href: 'https://www.instagram.com/brentfordcard' },
  { label: 'TikTok', icon: 'tiktok', href: 'https://www.tiktok.com/@brentfordcard' },
  { label: 'YouTube', icon: 'youtube', href: 'https://www.youtube.com/@brentfordcard' },
] as const;

// The Brentford Card scheme facts — mirror in FAQ + /llms.txt on any change.
export const CARD = {
  price: 29,
  currency: 'GBP',
  priceDisplay: '£29',
  term: 'year',
  charityPct: 10,
  charityName: 'Brentford Community Sports Trust', // named Brentford cause
  stripeLink: 'https://buy.stripe.com/test_brentfordcard', // [VERIFY — live Payment Link]
} as const;

export const CATEGORIES = [
  { slug: 'eat-drink', name: 'Eat & Drink', schema: 'FoodEstablishment' },
  { slug: 'shop', name: 'Shop', schema: 'Store' },
  { slug: 'health-beauty', name: 'Health & Beauty', schema: 'HealthAndBeautyBusiness' },
  { slug: 'fitness', name: 'Fitness', schema: 'ExerciseGym' },
  { slug: 'services', name: 'Services', schema: 'LocalBusiness' },
  { slug: 'culture', name: 'Culture', schema: 'LocalBusiness' },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]['slug'];

export const categoryName = (slug: string) =>
  CATEGORIES.find((c) => c.slug === slug)?.name ?? slug;
export const categorySchema = (slug: string) =>
  CATEGORIES.find((c) => c.slug === slug)?.schema ?? 'LocalBusiness';

export const NAV = [
  { href: '/directory/', label: 'Directory' },
  { href: '/news/', label: 'News' },
  { href: '/street-portraits/', label: 'Portraits' },
  { href: '/card/', label: 'The Card' },
  { href: '/about/', label: 'About' },
  { href: '/contact/', label: 'Contact' },
] as const;
