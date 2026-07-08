import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

// Pledges: one markdown file each. Body = "why it matters" (sincere register).
const pledges = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/pledges' }),
  schema: z.object({
    order: z.number(),
    pledge: z.string(),
    whySlaps: z.string(), // Gen-Z register, short
    genuine: z.boolean().default(true),
    source: z.string().url().optional(),
  }),
});

// FAQ: single JSON array, file() loader (brief §5.8).
const faq = defineCollection({
  loader: file('./src/content/faq.json'),
  schema: z.object({
    id: z.string(),
    order: z.number(),
    category: z.string(),
    question: z.string(),
    answer: z.string(), // one-sentence direct answer first, elaboration after
  }),
});

// Press releases: one markdown file each. Body = release body.
const press = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/press' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    standfirst: z.string(),
    spokesperson: z.string().default('Baron Kerbside, spokesperson, votebinface.com'),
    contactEmail: z.string(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { pledges, faq, press };
