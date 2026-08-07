import type { APIRoute } from 'astro';
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { site } from '../../data/site';

export const GET: APIRoute = async (context) => {
  const posts = (await getCollection('blog'))
    .filter((p) => p.data.reviewStatus === 'approved' && !p.data.draft)
    .sort((a, b) => b.data.published.getTime() - a.data.published.getTime());

  return rss({
    title: `${site.name} — Patient Education`,
    description: 'Clinically reviewed guides to scans, tests and conditions.',
    site: context.site ?? site.url,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.metaDescription,
      pubDate: p.data.published,
      link: `/blog/${p.id}/`,
    })),
    customData: '<language>en-gb</language>',
  });
};
