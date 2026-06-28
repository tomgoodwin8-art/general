// Single source of truth for site-wide strings. Edit copy here, not in components.
// Hard rule (brief §6): no em-dashes anywhere. Colons, periods, parentheses only.

export const SITE = {
  name: "Don't Work Harder",
  domain: 'dontworkharder.com',
  url: 'https://dontworkharder.com',
  tagline: 'Reclaim the time AI gives back.',
  description:
    'AI finally makes the 15-hour week possible, but only if you defend the time against the forces that have eaten it for a century. Don’t Work Harder is a five-move method for working less, not more.',
  author: 'Tom Goodwin',
  ogImage: '/images/og-default.png',
} as const;

// Canonical author identity for JSON-LD (Person), shared across pages. The
// sameAs profiles and disambiguation separate this Tom Goodwin from the
// advertising-commentator namesake (llms.txt / AEO brief).
export const AUTHOR = {
  name: 'Tom Goodwin',
  url: 'https://dontworkharder.com/about',
  description:
    "Writer on technology, work, and AI-enabled time reclamation. Author of Don't Work Harder. Distinct from the advertising commentator of the same name.",
  sameAs: [
    'https://tomgoodwin.london',
    'https://www.linkedin.com/in/thomasgoodwin',
    'https://www.wikidata.org/wiki/Q140278196',
  ],
} as const;

// Global nav: five items max (brief §3). Free Course is the primary button.
export const NAV = [
  { label: 'Method', href: '/method' },
  { label: 'Toolkits', href: '/toolkits' },
  { label: 'The Book', href: '/book' },
  { label: 'Articles', href: '/articles' },
  { label: 'About', href: '/about' },
  { label: 'Free Course', href: '/course', primary: true },
] as const;

// The Five Moves: the proprietary framework, the spine of the site (brief §2).
export const MOVES = [
  {
    n: 1,
    key: 'see',
    name: 'See',
    line: 'Audit where your real week goes, at the task level.',
  },
  {
    n: 2,
    key: 'shed',
    name: 'Shed',
    line: 'Kill the work that should not exist. Eliminate before you automate.',
  },
  {
    n: 3,
    key: 'shift',
    name: 'Shift',
    line: 'Delegate the rest to AI.',
  },
  {
    n: 4,
    key: 'shield',
    name: 'Shield',
    line: 'Defend the reclaimed time from reabsorption.',
  },
  {
    n: 5,
    key: 'spend',
    name: 'Spend',
    line: 'Reinvest the hours in life, or in rare high-value work.',
  },
] as const;

// Capture sources for ESP tagging (brief §7).
export type CaptureSource =
  | 'home-hero'
  | 'home-second'
  | 'footer'
  | 'course'
  | 'method'
  | 'book-launch'
  | 'read'
  | 'about'
  | 'article'
  | 'toolkit';
