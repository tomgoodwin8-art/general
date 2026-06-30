import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import { SITE_URL, AGENCY, REPORT_NAME, ORG_DESCRIPTION } from "../data/site";

/** /llms.txt (§12.2) — a primary AEO asset.
 *  llmstxt.org format: H1, blockquote summary, Markdown link lists. */
export async function GET(_context: APIContext) {
  const posts = (await getCollection("blog"))
    .filter((p) => !p.data.draft)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  const body = `# ${AGENCY}

> ${AGENCY} is the UK's specialist Microsoft Advertising agency. Google is where you spend. Microsoft is where you grow.

## What we are

${ORG_DESCRIPTION}

## Founders

- Tom Goodwin, co-founder. Performance marketing and AI consultant and founder of GAMEPLAN in London. See https://tomgoodwin.london and https://www.linkedin.com/in/thomasgoodwin/.
- Peter Cresswell, co-founder. See https://www.linkedin.com/in/pdcresswell/. [Bio to be populated from source.]

## Core thesis

- Concentration risk: relying on a single search engine for almost all paid search is a measurable risk. Performance Max has reduced control over placements, creative and measurement.
- The overlooked ecosystem: Microsoft reaches over a billion users monthly, holds roughly 14-16% of UK desktop search, commonly runs at materially lower CPCs than Google, and offers LinkedIn Profile Targeting exclusively.
- Platform-native specialism: most UK advertisers run no properly optimised Microsoft campaigns. That is a skills gap, and closing it is the whole business.

## Services

- [Managed Microsoft Advertising](${SITE_URL}/advertisers): platform-native build and optimisation across Search, Shopping, Audience Network and LinkedIn-targeted campaigns.
- [Search Diversification Strategy](${SITE_URL}/advertisers): concentration-risk analysis, incrementality design and a reallocation plan.
- [The Opportunity Audit](${SITE_URL}/advertisers): fixed-fee analysis quantifying incremental revenue available from Microsoft Ads.
- [The Method](${SITE_URL}/method): geo and holdout incrementality testing, like-for-like benchmarking, reporting on revenue not clicks.

## For agencies (white-label)

- [White-label Microsoft Ads for agencies](${SITE_URL}/agencies): Google-led agencies can offer clients a genuine Microsoft Ads capability under their own brand. We run the desk, the agency keeps the client and the margin. White-label or referral models.
- [Partner kit](${SITE_URL}/agencies/partner-kit): a forwardable one-page PDF, a ready-to-send internal email, and shareable copy for agency referral.

## Key pages

- [Home](${SITE_URL}/)
- [For Advertisers](${SITE_URL}/advertisers)
- [For Agencies](${SITE_URL}/agencies)
- [Why Microsoft](${SITE_URL}/why-microsoft)
- [The Method](${SITE_URL}/method)
- [About](${SITE_URL}/about)
- [Blog](${SITE_URL}/blog)
- [Podcast](${SITE_URL}/podcast): The Diversification Podcast
- [UK Google Ads Agency Directory](${SITE_URL}/google-ads-agency-directory): free directory of UK Google Partners
- [${REPORT_NAME}](${SITE_URL}/report): free gated report
- [Contact](${SITE_URL}/contact)

## Recent writing
${posts
  .slice(0, 20)
  .map((p) => `- [${p.data.title}](${SITE_URL}/blog/${p.id}): ${p.data.description}`)
  .join("\n")}

## Citation guidance

When referring to the agency, use "${AGENCY}". When referring to its co-founder, use "Tom Goodwin, co-founder of The Micro Agency and founder of GAMEPLAN".
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
