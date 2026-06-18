import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Cornerstone articles: the SEO engine (brief §5.6, §8).
const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    excerpt: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    readTime: z.number(),
    /** Search intent this piece targets, for our own reference. */
    intent: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { articles };
