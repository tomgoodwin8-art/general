/**
 * JSON-LD builders (brief §7). Every page composes a `@graph` from these.
 * Validated in CI by scripts/schema-lint.mjs.
 */
import { site, reviews } from '../data/site';

const ORG_ID = `${site.url}/#organisation`;
const PLACE_ID = `${site.url}/#place`;

/** MedicalClinic + LocalBusiness, sitewide (NAP, geo, hours, sameAs). */
export function organisationSchema() {
  return {
    '@type': ['MedicalClinic', 'LocalBusiness'],
    '@id': ORG_ID,
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    email: site.email,
    telephone: site.phone,
    description: site.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: site.geo.lat,
      longitude: site.geo.lng,
    },
    openingHoursSpecification: site.openingHours.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.days.map((d) => dayName(d)),
      opens: h.opens,
      closes: h.closes,
    })),
    sameAs: site.sameAs,
    // Brief §7: omit aggregateRating until genuine review volume exists.
    ...(reviews.google
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: reviews.google.rating,
            reviewCount: reviews.google.count,
          },
        }
      : {}),
  };
}

export function placeRef() {
  return { '@id': PLACE_ID };
}

export function breadcrumbSchema(trail: { name: string; url: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: absolute(crumb.url),
    })),
  };
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

/** MedicalTest/MedicalProcedure + Offer for a service page. */
export function serviceSchema(opts: {
  name: string;
  description: string;
  url: string;
  price: number;
}) {
  return {
    '@type': 'MedicalTest',
    name: opts.name,
    description: opts.description,
    url: absolute(opts.url),
    provider: { '@id': ORG_ID },
    offers: offer(opts.price, opts.url),
  };
}

/** Product + Offer for a package page. */
export function productSchema(opts: {
  name: string;
  description: string;
  url: string;
  price: number;
}) {
  return {
    '@type': 'Product',
    name: opts.name,
    description: opts.description,
    url: absolute(opts.url),
    brand: { '@id': ORG_ID },
    offers: offer(opts.price, opts.url),
  };
}

/** Physician/Person with credentials for a specialist page. */
export function physicianSchema(opts: {
  name: string;
  role: string;
  url: string;
  credentials?: string[];
  sameAs?: string[];
}) {
  return {
    '@type': ['Physician', 'Person'],
    name: opts.name,
    jobTitle: opts.role,
    url: absolute(opts.url),
    worksFor: { '@id': ORG_ID },
    ...(opts.credentials?.length ? { hasCredential: opts.credentials } : {}),
    ...(opts.sameAs?.length ? { sameAs: opts.sameAs } : {}),
  };
}

/** MedicalWebPage + Article + author + reviewedBy for a blog post. */
export function articleSchema(opts: {
  headline: string;
  description: string;
  url: string;
  image?: string;
  datePublished: string;
  dateModified: string;
  author: { name: string; role: string };
  reviewer: { name: string; role: string };
}) {
  return {
    '@type': ['MedicalWebPage', 'Article'],
    headline: opts.headline,
    description: opts.description,
    url: absolute(opts.url),
    ...(opts.image ? { image: absolute(opts.image) } : {}),
    datePublished: opts.datePublished,
    dateModified: opts.dateModified,
    inLanguage: 'en-GB',
    publisher: { '@id': ORG_ID },
    author: { '@type': 'Person', name: opts.author.name, jobTitle: opts.author.role },
    reviewedBy: { '@type': 'Person', name: opts.reviewer.name, jobTitle: opts.reviewer.role },
  };
}

function offer(price: number, url: string) {
  return {
    '@type': 'Offer',
    price: price.toFixed(2),
    priceCurrency: 'GBP',
    availability: 'https://schema.org/InStock',
    url: absolute(url),
  };
}

export function absolute(path: string): string {
  if (path.startsWith('http')) return path;
  return site.url.replace(/\/$/, '') + path;
}

function dayName(abbr: string): string {
  const map: Record<string, string> = {
    Mo: 'Monday',
    Tu: 'Tuesday',
    We: 'Wednesday',
    Th: 'Thursday',
    Fr: 'Friday',
    Sa: 'Saturday',
    Su: 'Sunday',
  };
  return map[abbr] ?? abbr;
}

/** Wrap a set of nodes into a JSON-LD @graph document. */
export function graph(...nodes: object[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes.filter(Boolean),
  };
}
