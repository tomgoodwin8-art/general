import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE_URL, AGENCY } from "../data/site";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const posts = (await getCollection("blog"))
    .filter((p) => !p.data.draft)
    .map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.pubDate,
      link: `/blog/${p.id}`,
    }));

  const episodes = (await getCollection("podcast"))
    .filter((e) => !e.data.draft)
    .map((e) => ({
      title: `Podcast, Ep ${e.data.episode}: ${e.data.title}`,
      description: e.data.description,
      pubDate: e.data.pubDate,
      link: `/podcast/${e.id}`,
    }));

  const items = [...posts, ...episodes].sort(
    (a, b) => b.pubDate.valueOf() - a.pubDate.valueOf()
  );

  return rss({
    title: `${AGENCY}: Blog & Podcast`,
    description:
      "Evidence-led writing and conversation on Microsoft Advertising, search diversification, incrementality and the Microsoft ecosystem.",
    site: context.site ?? SITE_URL,
    items,
    customData: `<language>en-gb</language>`,
  });
}
