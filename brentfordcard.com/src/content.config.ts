import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const categoryEnum = z.enum([
  'eat-drink',
  'shop',
  'health-beauty',
  'fitness',
  'services',
  'culture',
]);

// Directory: type-safe frontmatter (brief §10). Slug + taxonomy are permanent.
const directory = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/directory' }),
  schema: z.object({
    name: z.string(),
    category: categoryEnum,
    address: z.string(),
    geo: z.object({ lat: z.number(), lng: z.number() }).optional(),
    phone: z.string().optional(),
    website: z.string().url().optional(),
    hours: z
      .array(z.object({ days: z.string(), open: z.string(), close: z.string() }))
      .default([]),
    offer: z.string().default(''),
    offerTerms: z.string().default(''),
    image: z.string().default(''),
    motif: z.string().optional(), // emblem key for BizImage when no photo
    summary: z.string(), // one factual sentence, required (AEO)
    priceRange: z.string().optional(),
  }),
});

// News frontmatter (brief §10).
const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    standfirst: z.string(), // one-sentence fact-first summary, required
    author: z.string(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.enum(['news', 'guides', 'business', 'regeneration']),
    hero: z.string().default(''),
    relatedListings: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

// Press releases / media items.
const press = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/press' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    kind: z.enum(['release', 'note']).default('release'),
  }),
});

export const collections = { directory, news, press };
