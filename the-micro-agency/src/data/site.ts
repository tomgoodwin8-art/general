/**
 * site.ts — single source of truth for tokens (brief find-replace table + §3).
 * Confirm DOMAIN and BOOKING_URL with Tom before deploy.
 */

export const SITE_URL = "https://microagency.co"; // {{DOMAIN}} — confirm before deploy
export const AGENCY = "The Micro Agency"; // {{AGENCY}}
export const BOOKING_URL = "https://cal.eu/tom-goodwin-wpxjme"; // {{BOOKING_URL}} — mirror of tomgoodwin.london; confirm dedicated link
export const CONTACT_EMAIL = "tomgoodwin8@gmail.com"; // {{CONTACT_EMAIL}}
export const REPORT_NAME = "State of Microsoft Ads: UK Edition"; // {{REPORT_NAME}}

export const SIGNATURE_LINE = "Google is where you spend. Microsoft is where you grow.";

/** Positioning line (§3), trimmed to a 155-char default meta description. */
export const POSITIONING =
  "The Micro Agency is the UK's specialist Microsoft Advertising agency: platform-native campaign management, incrementality measurement and search diversification.";

export const ORG_DESCRIPTION =
  "For performance marketing leaders and CMOs seeing diminishing returns on Google Ads, The Micro Agency is the UK's specialist Microsoft Advertising agency. We deliver platform-native campaign management, proprietary incrementality measurement, and search diversification strategy. Unlike full-service agencies that import Google campaigns to Bing as an afterthought, we build for the Microsoft ecosystem from the ground up.";

export const socials = {
  linkedin: "https://www.linkedin.com/company/the-micro-agency",
  youtube: "https://www.youtube.com/@TheMicroAgency",
  spotify: "https://open.spotify.com/show/themicroagency",
};

/** Primary navigation (§4). Resources is a grouped dropdown. */
export const nav = [
  { label: "Services", href: "/services" },
  { label: "The Method", href: "/method" },
  { label: "Why Microsoft", href: "/why-microsoft" },
  {
    label: "Resources",
    href: "/blog",
    children: [
      { label: "Blog", href: "/blog" },
      { label: "Podcast", href: "/podcast" },
      { label: "Report", href: "/report" },
      { label: "Case Studies", href: "/case-studies" },
    ],
  },
  { label: "About", href: "/about" },
];
