/**
 * founders.ts — founder profiles (brief §7.6, §12.1).
 * Tom Goodwin's bio is supplied verbatim. Peter Cresswell's bio is [TODO]:
 * it must be populated ONLY from his LinkedIn or his own copy — never invented.
 */

export interface Founder {
  name: string;
  role: string;
  bio: string;
  image?: string;
  /** CSS object-position for the avatar crop. */
  imagePosition?: string;
  links: { label: string; href: string }[];
  /** JSON-LD Person node sameAs. */
  sameAs: string[];
  disambiguatingDescription?: string;
  /** Set true only once real copy is in place. */
  populated: boolean;
}

export const founders: Founder[] = [
  {
    name: "Tom Goodwin",
    role: "Founder",
    bio: "Tom Goodwin is a performance marketing and AI consultant and the founder of GAMEPLAN, a performance, media and technology consultancy in London. Fifteen years in performance marketing, £20m+ in paid media managed, Google Premier Partner status earned in 2024. He founded The Micro Agency to build the Microsoft specialism the market keeps treating as an afterthought.",
    image: "/images/founders/tom-goodwin.jpg",
    imagePosition: "center 22%",
    links: [
      { label: "tomgoodwin.london", href: "https://tomgoodwin.london" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/thomasgoodwin/" },
    ],
    sameAs: [
      "https://tomgoodwin.london",
      "https://www.linkedin.com/in/thomasgoodwin/",
      "https://www.wikidata.org/wiki/Q140278196",
    ],
    disambiguatingDescription:
      "Performance marketing and AI consultant and founder of GAMEPLAN; not the author of Digital Darwinism.",
    populated: true,
  },
];
