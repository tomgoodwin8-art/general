import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/** Blog posts (§6). MDX. */
const posts = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    targetQuery: z.string().optional(),
    funnelsTo: z.string().optional(),
    pubDate: z.coerce.date(),
    draft: z.boolean().default(false),
    faqs: z
      .array(z.object({ q: z.string(), a: z.string() }))
      .default([]),
  }),
});

/** Case studies (§3). */
const caseStudies = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/case-studies" }),
  schema: z.object({
    title: z.string(),
    client: z.string(),
    description: z.string(),
    result: z.string(),
    sector: z.string().optional(),
    // CRO task 6: optional client quote + attribution, rendered when present.
    quote: z.string().optional(),
    quoteAuthor: z.string().optional(),
    order: z.number().default(0),
  }),
});

/** Testimonials (§4.9). Real only — never invented. */
const testimonials = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/testimonials" }),
  schema: z.object({
    quote: z.string(),
    author: z.string(),
    role: z.string(),
    // Optional avatar (path under /public, e.g. /images/testimonials/foo.jpg).
    image: z.string().optional(),
    order: z.number().default(0),
  }),
});

/** Talks (§7). Markdown body = transcript. */
const talks = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/talks" }),
  schema: z.object({
    title: z.string(),
    abstract: z.string(),
    order: z.number().default(0),
    runtime: z.string().optional(),
    format: z.string().optional(),
    slideCount: z.number().optional(),
    deck: z.string().optional(),
  }),
});

/** Press items / coverage (§8). */
const pressItems = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/press-items" }),
  schema: z.object({
    outlet: z.string(),
    title: z.string(),
    url: z.string().url().optional(),
    note: z.string().optional(),
    client: z.string().optional(),
    order: z.number().default(0),
  }),
});

export const collections = { posts, caseStudies, testimonials, talks, pressItems };
