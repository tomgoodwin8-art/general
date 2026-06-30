/**
 * stats.ts — Verified stats library (brief Appendix A).
 * PUBLISH ONLY FROM THIS FILE. Nothing from Appendix B may appear on the site.
 * Each stat carries a named, dated source, rendered as an HTML comment in markup
 * by StatBlock.astro (brief §1.3, §6.4).
 */

export interface Stat {
  id: string;
  figure: string;
  label: string;
  source: string;
}

export const stats: Record<string, Stat> = {
  ecosystem: {
    id: "ecosystem",
    figure: "1bn+",
    label: "Microsoft ecosystem users reached monthly",
    source: "Microsoft Q1 2026 earnings; Search Engine Journal, May 2026",
  },
  ukDesktopShare: {
    id: "ukDesktopShare",
    figure: "~14–16%",
    label: "of UK desktop search share is Microsoft's",
    source: "StatCounter, 2026",
  },
  income: {
    id: "income",
    figure: "~41%",
    label: "of US Bing users earn over $100k (higher-income, desktop-dominant)",
    source: "Microsoft Advertising / Nerdynav, 2025–26",
  },
  cpc: {
    id: "cpc",
    figure: "~33%",
    label: "lower average CPCs than Google, commonly cited",
    source: "Searchlab / GoDataFeed, 2025–26",
  },
  linkedin: {
    id: "linkedin",
    figure: "Exclusive",
    label: "LinkedIn Profile Targeting (job title, company, industry) to Microsoft",
    source: "Microsoft Advertising product docs",
  },
  remedy: {
    id: "remedy",
    figure: "2025",
    label:
      "US v Google remedy orders syndication of search and text-ad feeds on commercial terms; widely read as narrow; under appeal",
    source: "US DoJ; Judge Mehta ruling Sept 2025, finalised Dec 2025",
  },
  searchChange: {
    id: "searchChange",
    figure: "55%",
    label: "of US consumers say how they search for products has changed in five years",
    source: "adMarketplace, State of Search 2025 (US survey, vendor-commissioned)",
  },
};

/** Rotating header proof lines (Appendix A only). */
export const proofLines = [
  "Microsoft's ecosystem reaches over 1 billion users monthly.",
  "Microsoft holds roughly 14–16% of UK desktop search.",
  "Microsoft Ads commonly runs at materially lower CPCs than Google.",
  "LinkedIn Profile Targeting is exclusive to Microsoft Advertising.",
];

/** Home proof strip selection. */
export const homeProof: Stat[] = [
  stats.ecosystem,
  stats.ukDesktopShare,
  stats.cpc,
  stats.linkedin,
];
