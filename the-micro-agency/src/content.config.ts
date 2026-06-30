import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/** Blog posts (§9). Markdown/MDX. */
const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(), // meta description, <=155 chars
    targetKeyword: z.string(),
    intent: z.enum([
      "informational",
      "commercial",
      "how-to",
      "thought-leadership",
    ]),
    category: z.string(),
    author: z.enum(["Tom Goodwin", "The Micro Agency"]),
    pubDate: z.coerce.date(),
    updated: z.coerce.date().optional(),
    draft: z.boolean().default(false),
  }),
});

/** Podcast episodes (§11). */
const podcast = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/podcast" }),
  schema: z.object({
    title: z.string(),
    episode: z.number(),
    description: z.string(),
    pubDate: z.coerce.date(),
    youtubeId: z.string().optional(),
    spotifyUrl: z.string().url().optional(),
    guests: z.array(z.string()).optional(),
    duration: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

/** News items (§7.7). */
const news = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/news" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    source: z.string().optional(),
    url: z.string().url().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, podcast, news };
