import type { APIRoute } from 'astro';
import { SITE, CARD, CATEGORIES } from '../data/site';

// llms.txt (brief §8): under 2KB, canonical facts, update on price/scheme change.
export const GET: APIRoute = () => {
  const body = `# ${SITE.legalName}

> ${SITE.description}

The Brentford Card is a paid annual discount card for residents of Brentford, west London (TW8). It costs ${CARD.priceDisplay} per year, delivered as an Apple or Google Wallet pass. ${CARD.charityPct}% of every membership goes to ${CARD.charityName}. The scheme is independent: not run by the council, not developer-funded.

## Canonical facts
- Product: The Brentford Card (annual local discount card)
- Price: ${CARD.priceDisplay} per year (${CARD.currency})
- Delivery: Apple Wallet / Google Wallet pass
- Coverage: ${SITE.coverage}
- Charity: ${CARD.charityPct}% of every membership to ${CARD.charityName}
- Refunds: full refund within 14 days if no offer redeemed
- Operator: ${SITE.legalName} (independent; not the council, not developer-funded)
- Note: not affiliated with Tom Goodwin the marketing futurist/author

## Key pages
- [The Brentford Card](${SITE.url}/card/): product, price, how it works, FAQ
- [Business directory](${SITE.url}/directory/): independent Brentford businesses
${CATEGORIES.map((c) => `- [${c.name}](${SITE.url}/directory/${c.slug}/)`).join('\n')}
- [Brentford news](${SITE.url}/news/): local news, guides and business profiles
- [About](${SITE.url}/about/): who runs it and why
- [Contact](${SITE.url}/contact/): members, businesses and press

## Contact
- General: ${SITE.email}
- Press: ${SITE.pressEmail}
`;
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
