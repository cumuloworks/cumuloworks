import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
    loader: glob({ pattern: '**/index.md', base: './src/content/projects' }),
    schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        date: z.date(),
        category: z.enum(['entertainment', 'ads', 'showreel', 'others']),
        embed: z.string().optional(),
    }),
});

const blogs = defineCollection({
    loader: glob({ pattern: '**/index.md', base: './src/content/blogs' }),
    schema: z.object({
        title: z.string(),
        category: z.enum(['announcement', 'blog', 'techtips', 'others']),
        description: z.string().optional(),
        date: z.date(),
        embed: z.string().optional(),
    }),
});

const downloads = defineCollection({
    loader: glob({ pattern: '**/index.md', base: './src/content/downloads' }),
    schema: z.object({
        title: z.string(),
        category: z.enum(['aviutl', 'ae', 'others']),
        date: z.date(),
        link: z.string().optional(),
    }),
});

export const collections = { projects, blogs, downloads };
