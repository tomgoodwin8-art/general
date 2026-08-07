/**
 * Single source of truth for organisation-level facts (NAP, trust markers,
 * navigation). Edit copy here, not in components. Anything marked
 * `[TOM TO CONFIRM]` is an open item from the brief §11.
 */

export const site = {
  name: 'London Private Healthcare Group',
  shortName: 'LPHG',
  legalName: 'London Private Healthcare Group Ltd', // [TOM TO CONFIRM]
  // Domain is TBC — see astro.config.mjs. Keep in sync.
  url: 'https://www.lphg.co.uk',
  tagline: 'Private diagnostics and specialist care',
  strapline: 'Devonshire Place · Harley Street Medical District',
  description:
    'Private healthcare clinic at 11 Devonshire Place in the Harley Street Medical District. Same-week scans, tests and consultant appointments with every price published. No GP referral needed.',
  email: 'hello@lphg.co.uk', // [TOM TO CONFIRM]
  phone: '+44 20 0000 0000', // [TOM TO CONFIRM]
  phoneDisplay: '020 0000 0000', // [TOM TO CONFIRM]
  whatsapp: '+44 7000 000000', // [TOM TO CONFIRM]
  address: {
    street: '11 Devonshire Place',
    locality: 'Marylebone',
    region: 'London',
    postalCode: 'W1G 6HR', // [TOM TO CONFIRM]
    country: 'GB',
  },
  geo: { lat: 51.52123, lng: -0.14738 }, // Devonshire Place, approx
  openingHours: [
    { days: ['Mo', 'Tu', 'We', 'Th', 'Fr'], opens: '08:00', closes: '20:00' },
    { days: ['Sa'], opens: '09:00', closes: '17:00' },
  ],
  // Real profiles to be confirmed at content load (brief §7 sameAs).
  sameAs: [
    'https://www.doctify.com/uk/practice/london-private-healthcare-group', // [TOM TO CONFIRM]
    'https://www.google.com/maps/place/11+Devonshire+Place', // [TOM TO CONFIRM]
  ],
} as const;

/**
 * Trust markers reused from the LPU pattern (brief §3). These are claims that
 * must be true at launch — CQC number is a placeholder pending Tom.
 */
export const trustMarkers = [
  'CQC registered', // [TOM TO CONFIRM: registration number for footer]
  'No GP referral needed',
  'Same-day appointments often available',
  'Report within 24 hours',
] as const;

/**
 * Google / Doctify ratings. Brief §7: DO NOT fabricate ratings or
 * aggregateRating schema. Left null until real figures are supplied at
 * content load; ReviewStrip and rating schema stay hidden while null.
 */
export const reviews = {
  google: null as null | { rating: number; count: number; url: string },
  doctify: null as null | { rating: number; count: number; url: string },
};

export type NavItem = { label: string; href: string; children?: NavItem[] };

export const primaryNav: NavItem[] = [
  { label: 'Centres', href: '/centres/' },
  { label: 'Packages', href: '/packages/' },
  { label: 'Specialists', href: '/specialists/' },
  { label: 'Prices', href: '/prices/' },
  { label: 'Blog', href: '/blog/' },
  { label: 'About', href: '/about/' },
  { label: 'Contact', href: '/contact/' },
];

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: 'Centres',
    items: [
      { label: "Women's Health", href: '/centres/womens-health/' },
      { label: 'Pregnancy Scanning', href: '/centres/pregnancy-scanning/' },
      { label: "Men's Health", href: '/centres/mens-health/' },
      { label: 'MSK & Orthopaedics', href: '/centres/msk-orthopaedics/' },
      { label: 'Heart Health', href: '/centres/heart-health/' },
      { label: 'Imaging & Diagnostics', href: '/centres/imaging-diagnostics/' },
      { label: 'Weight Management', href: '/centres/weight-management/' },
    ],
  },
  {
    title: 'Visit',
    items: [
      { label: 'Prices', href: '/prices/' },
      { label: 'Book an appointment', href: '/book/' },
      { label: 'For clinicians', href: '/for-clinicians/' },
      { label: 'Find us', href: '/contact/' },
    ],
  },
  {
    title: 'Legal',
    items: [
      { label: 'Privacy policy', href: '/privacy/' },
      { label: 'Terms', href: '/terms/' },
    ],
  },
];
