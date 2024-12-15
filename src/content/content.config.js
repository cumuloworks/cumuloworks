import { z, defineCollection } from "astro:content";
import { glob } from "astro/loaders";

const projects = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
	schema: z.object({
		title: z.string(),
		permalink: z.string().optional(),
	}),
});

// Expose your defined collection to Astro
// with the `collections` export
export const collections = { projects };
