import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE_URL, ENTITY } from "../data/profile";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const posts = (await getCollection("posts"))
    .filter((p) => !p.data.draft)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: `${ENTITY} — Blog`,
    description:
      "Notes on performance marketing, measurement, paid media and AI search from Tom Goodwin, Founder of GAMEPLAN.",
    site: context.site ?? SITE_URL,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.pubDate,
      link: `/blog/${p.id}`,
    })),
    customData: `<language>en-gb</language>`,
  });
}
