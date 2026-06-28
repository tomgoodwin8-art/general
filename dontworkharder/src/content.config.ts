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

    // Extended metadata carried by the imported article set (AEO / EEAT).
    slug: z.string().optional(),
    canonical: z.string().optional(),
    datePublished: z.coerce.date().optional(),
    dateModified: z.coerce.date().optional(),
    category: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    author: z
      .object({
        name: z.string().optional(),
        role: z.string().optional(),
        url: z.string().optional(),
        image: z.string().optional(),
        bio: z.string().optional(),
      })
      .optional(),
    schema: z
      .object({
        type: z.string().optional(),
        publisher: z.string().optional(),
      })
      .optional(),
    faq: z
      .array(
        z.object({
          question: z.string(),
          answer: z.string(),
        }),
      )
      .optional(),
  }),
});

// Role-based toolkits: the five moves applied to one line of work (toolkits brief).
const toolkits = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/toolkits' }),
  schema: z.object({
    slug: z.string(),
    name: z.string(),
    wave: z.number(),
    order: z.number(),
    status: z.enum(['live', 'soon']).default('live'),
    seoTitle: z.string(),
    title: z.string(),
    meta: z.string(),
    h1: z.string(),
    lede: z.string(),
    ledeKicker: z.string(),
    underLedeNote: z.string().optional(),
    cardLine: z.string(),
    moves: z
      .array(
        z.object({
          n: z.number(),
          name: z.string(),
          role: z.string(),
          body: z.string(),
          doThis: z.string(),
        }),
      )
      .length(5),
  }),
});

export const collections = { articles, toolkits };
