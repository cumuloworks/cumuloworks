import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
    schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        date: z.date(),
        category: z.enum(['entertainment', 'ads', 'showreel', 'others']),
        embed: z.string().optional(),
    }),
});

const blogs = defineCollection({
    schema: z.object({
        title: z.string(),
        category: z.enum(['announcement', 'blog', 'techtips', 'others']),
        description: z.string().optional(),
        date: z.date(),
        embed: z.string().optional(),
    }),
});

const downloads = defineCollection({
    schema: z.object({
        title: z.string(),
        category: z.enum(['aviutl', 'ae', 'others']),
        date: z.date(),
        link: z.string().optional(),
    }),
});

export const collections = { projects, blogs, downloads };
