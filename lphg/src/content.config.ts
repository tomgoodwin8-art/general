import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

/* ---------- shared fragments ---------- */

const faq = z.object({ q: z.string(), a: z.string() });

const person = z.object({
  name: z.string(),
  role: z.string(),
  credentials: z.string().optional(),
  profileUrl: z.string().optional(), // internal /specialists/ path or external
  bio: z.string().optional(),
});

const seo = {
  // Brief §7: title < 60, description < 155. Validated here so CI catches drift.
  metaTitle: z.string().max(65),
  metaDescription: z.string().max(160),
  ogImage: z.string().optional(),
};

/* ---------- centres (Welbeck-modelled centre pages) ---------- */

const centres = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/centres' }),
  schema: z.object({
    title: z.string(),
    promise: z.string(), // one-line hero promise
    priceFrom: z.number(),
    intro: z.string(), // bolded 40–60 word AEO answer (§7)
    order: z.number().default(50),
    heroImage: z.string().optional(),
    heroAlt: z.string().optional(),
    // "What we treat" symptom/condition grid → each links a service page.
    whatWeTreat: z.array(z.object({ label: z.string(), href: z.string() })),
    specialists: z.array(reference('specialists')).default([]),
    relatedPackage: reference('packages').optional(),
    faqs: z.array(faq).default([]),
    ...seo,
  }),
});

/* ---------- services (one per scan / test / consultation) ---------- */

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    // Brief §4.3 schema, extended with SEO + AEO fields.
    title: z.string(),
    centre: reference('centres'),
    price: z.number(),
    duration: z.string(), // e.g. "30 minutes"
    preparation: z.string(), // used on confirmation step too (§6.1.5)
    aeoAnswer: z.string(), // bolded 40–60 word direct answer (§7)
    whatItShows: z.array(z.string()),
    whatItCannotShow: z.array(z.string()),
    sembleBookingTypeId: z.string(), // placeholder `LPHG-*` until Tom's map
    faqs: z.array(faq).default([]),
    relatedServices: z.array(reference('services')).default([]),
    relatedPackage: reference('packages').optional(),
    order: z.number().default(50),
    ...seo,
  }),
});

/* ---------- packages (hero products) ---------- */

const packages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/packages' }),
  schema: z.object({
    title: z.string(),
    promise: z.string(),
    price: z.number(),
    // Itemised inclusions; sum shown struck against bundle price (§4.2).
    includes: z.array(z.object({ label: z.string(), value: z.number() })),
    whoFor: z.array(z.string()),
    // "What happens on the day" timeline component (§4.2).
    onTheDay: z.array(z.object({ time: z.string(), label: z.string() })),
    team: z.array(reference('specialists')).default([]),
    centre: reference('centres').optional(),
    relatedServices: z.array(reference('services')).default([]),
    sembleBookingTypeId: z.string(),
    faqs: z.array(faq).default([]),
    order: z.number().default(50),
    ...seo,
  }),
});

/* ---------- specialists (SEO assets, Physician schema) ---------- */

const specialists = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/specialists' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    credentials: z.array(z.string()).default([]),
    gmcNumber: z.string().optional(),
    specialties: z.array(z.string()).default([]),
    centres: z.array(reference('centres')).default([]),
    languages: z.array(z.string()).default([]),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    profileExternal: z.string().optional(),
    order: z.number().default(50),
    ...seo,
  }),
});

/* ---------- blog (LPU anatomy, §8) ---------- */

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    topic: z.string(), // breadcrumb: "Patient Education · {topic}"
    category: z.string(),
    primaryKeyword: z.string(),
    keywordVolume: z.number().optional(),
    author: person,
    reviewer: person, // every post names a clinical reviewer (§8)
    published: z.coerce.date(),
    lastReviewed: z.coerce.date(),
    readTime: z.number().optional(), // minutes; computed if absent
    hero: z.object({
      src: z.string().optional(),
      alt: z.string(),
      caption: z.string(), // italic caption stating what it shows
    }),
    answer: z.string(), // bolded 40–60 word definitional answer (§8.6)
    relatedServices: z.array(reference('services')).min(3), // §7 linking rule
    relatedPackage: reference('packages'), // exactly 1 package CTA (§7)
    references: z.array(z.object({ label: z.string(), url: z.string().url() })).min(1),
    faqs: z.array(faq).min(6), // 8–10 questions target (§8.10)
    // No post goes live without a named reviewer (§8). Gate on this.
    reviewStatus: z.enum(['draft', 'in-review', 'approved']).default('draft'),
    draft: z.boolean().default(false),
    ...seo,
  }),
});

export const collections = { centres, services, packages, specialists, blog };
