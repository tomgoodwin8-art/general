import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE } from '../data/site';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = (await getCollection('news')).sort(
    (a, b) => +new Date(b.data.publishDate) - +new Date(a.data.publishDate),
  );
  return rss({
    title: 'Brentford News',
    description: 'Local news for Brentford, TW8 — from the Brentford Card.',
    site: context.site ?? SITE.url,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.standfirst,
      pubDate: new Date(post.data.publishDate),
      author: post.data.author,
      link: `/news/${post.id}/`,
    })),
    customData: `<language>en-gb</language>`,
  });
}
