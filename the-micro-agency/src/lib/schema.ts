/**
 * schema.ts — builders for page-level JSON-LD nodes (§12.1).
 * Organization + Person nodes are emitted site-wide by Schema.astro.
 */
import type { Faq } from "../data/faqs";
import { SITE_URL, AGENCY } from "../data/site";

const orgRef = { "@id": `${SITE_URL}/#organization` };

export function faqSchema(faqs: Faq[]) {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function breadcrumbSchema(crumbs: { label: string; href: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      item: new URL(c.href, SITE_URL).href.replace(/\/$/, ""),
    })),
  };
}

export function blogPostingSchema(opts: {
  title: string;
  description: string;
  path: string;
  author: string;
  pubDate: Date;
  updated?: Date;
}) {
  return {
    "@type": "BlogPosting",
    headline: opts.title,
    description: opts.description,
    url: new URL(opts.path, SITE_URL).href.replace(/\/$/, ""),
    mainEntityOfPage: new URL(opts.path, SITE_URL).href.replace(/\/$/, ""),
    datePublished: opts.pubDate.toISOString(),
    ...(opts.updated ? { dateModified: opts.updated.toISOString() } : {}),
    author:
      opts.author === AGENCY
        ? orgRef
        : { "@id": `${SITE_URL}/#person-${opts.author.toLowerCase().replace(/\s+/g, "-")}` },
    publisher: orgRef,
  };
}

export function articleSchema(opts: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified: string;
  author?: string;
}) {
  return {
    "@type": "Article",
    headline: opts.title,
    description: opts.description,
    url: new URL(opts.path, SITE_URL).href.replace(/\/$/, ""),
    mainEntityOfPage: new URL(opts.path, SITE_URL).href.replace(/\/$/, ""),
    datePublished: opts.datePublished,
    dateModified: opts.dateModified,
    author: opts.author
      ? { "@id": `${SITE_URL}/#person-${opts.author.toLowerCase().replace(/\s+/g, "-")}` }
      : orgRef,
    publisher: orgRef,
  };
}

export function podcastEpisodeSchema(opts: {
  title: string;
  description: string;
  path: string;
  episode: number;
  pubDate: Date;
}) {
  return {
    "@type": "PodcastEpisode",
    name: opts.title,
    episodeNumber: opts.episode,
    description: opts.description,
    url: new URL(opts.path, SITE_URL).href.replace(/\/$/, ""),
    datePublished: opts.pubDate.toISOString(),
    partOfSeries: {
      "@type": "PodcastSeries",
      name: "The Diversification Podcast",
      url: `${SITE_URL}/podcast`,
    },
    publisher: orgRef,
  };
}
