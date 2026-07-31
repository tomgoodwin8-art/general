import { SITE, CARD, categorySchema, categoryName } from '../data/site';

export function breadcrumbList(items: { label: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.label,
      item: new URL(it.path, SITE.url).href,
    })),
  };
}

export function localBusiness(entry: {
  slug: string;
  data: any;
}) {
  const { slug, data } = entry;
  const url = `${SITE.url}/directory/${data.category}/${slug}/`;
  const node: Record<string, unknown> = {
    '@type': categorySchema(data.category),
    '@id': `${url}#business`,
    name: data.name,
    description: data.summary,
    url,
    address: { '@type': 'PostalAddress', streetAddress: data.address, addressLocality: 'Brentford', addressRegion: 'London', addressCountry: 'GB' },
    areaServed: SITE.coverage,
    isAccessibleForFree: false,
  };
  if (data.geo) node.geo = { '@type': 'GeoCoordinates', latitude: data.geo.lat, longitude: data.geo.lng };
  if (data.phone) node.telephone = data.phone;
  if (data.website) node.sameAs = [data.website];
  if (data.priceRange) node.priceRange = data.priceRange;
  if (Array.isArray(data.hours) && data.hours.length) {
    node.openingHoursSpecification = data.hours.map((h: any) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: expandDays(h.days),
      opens: h.open,
      closes: h.close,
    }));
  }
  if (data.offer && data.offer !== 'pending') {
    node.hasOfferCatalog = {
      '@type': 'OfferCatalog',
      name: 'Brentford Card member offers',
      itemListElement: [
        {
          '@type': 'Offer',
          name: data.offer,
          description: data.offerTerms || undefined,
          eligibleCustomerType: 'https://schema.org/BusinessEntityType',
          availability: 'https://schema.org/InStock',
        },
      ],
    };
  }
  return node;
}

function expandDays(label: string): string[] {
  const map: Record<string, string> = {
    Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday',
    Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday',
  };
  const order = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const clean = label.replace(/\s/g, '');
  if (clean.includes('–') || clean.includes('-')) {
    const [a, b] = clean.split(/[–-]/);
    const i = order.indexOf(a), j = order.indexOf(b);
    if (i >= 0 && j >= 0) return order.slice(i, j + 1).map((d) => `https://schema.org/${map[d]}`);
  }
  return clean.split(',').map((d) => `https://schema.org/${map[d] ?? d}`).filter(Boolean);
}

export function newsArticle(entry: { slug: string; data: any }) {
  const { slug, data } = entry;
  const url = `${SITE.url}/news/${slug}/`;
  return {
    '@type': 'NewsArticle',
    '@id': `${url}#article`,
    headline: data.title,
    description: data.standfirst,
    datePublished: new Date(data.publishDate).toISOString(),
    dateModified: new Date(data.updatedDate ?? data.publishDate).toISOString(),
    author: { '@type': 'Person', name: data.author },
    publisher: { '@id': `${SITE.url}/#org` },
    mainEntityOfPage: url,
    articleSection: categoryName(data.category),
  };
}

export function cardProduct() {
  const url = `${SITE.url}/card/`;
  return {
    '@type': 'Product',
    '@id': `${url}#product`,
    name: 'The Brentford Card',
    description:
      'Annual membership card for Brentford (TW8) giving discounts and offers at independent local businesses, delivered as an Apple or Google Wallet pass.',
    brand: { '@id': `${SITE.url}/#org` },
    offers: {
      '@type': 'Offer',
      price: String(CARD.price),
      priceCurrency: CARD.currency,
      availability: 'https://schema.org/InStock',
      url,
      priceValidUntil: '2027-07-31',
    },
  };
}

export function faqPage(faqs: { q: string; a: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}
