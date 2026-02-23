import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().optional(),
    date: z.coerce.date().optional(),
    categories: z.union([z.string(), z.array(z.string())]).optional(),
    author: z.string().optional(),
    authors: z.string().optional(),
    accepted: z.string().optional(),
    venue: z.string().optional(),
    shortVenue: z.string().optional(),
    paper: z.string().optional(),
    arxiv: z.string().optional(),
    code: z.string().optional(),
    video: z.string().optional(),
    poster: z.string().optional(),
    slides: z.string().optional(),
    image: z.string().optional(),
    important: z.string().optional(),
    spotlight: z.string().optional(),
    subtitle: z.string().optional()
  })
});

const pages = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().optional(),
    date: z.union([z.string(), z.coerce.date()]).optional(),
    categories: z.union([z.string(), z.array(z.string())]).optional(),
    important: z.string().optional(),
    permalink: z.string().optional(),
    layout: z.string().optional()
  })
});

const news = defineCollection({
  type: 'data',
  schema: z.object({
    items: z
      .array(
        z.object({
          date: z.coerce.date(),
          html: z.string(),
          showOnHome: z.boolean().optional().default(true),
          sort: z.number().int().optional()
        })
      )
      .default([])
  })
});

export const collections = { posts, pages, news };
