import { defineConfig } from "astro/config";

import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";

import sitemap from "@astrojs/sitemap";

export default defineConfig({
	prefetch: {
		prefetchAll: true,
	},
	integrations: [
		tailwind(),
		icon({
			"fa6-solid": ["*"],
			"fa6-brands": ["*"],
		}),
		sitemap(),
	],
	contentCollections: {
		projects: {
			type: "content",
		},
		blogs: {
			type: "content",
		},
		downloads: {
			type: "content",
		},
	},
	image: {
		service: {
			entrypoint: "astro/assets/services/sharp",
		},
	},
	output: "static",
	site: "https://cumulo.works",
	markdown: {
		shikiConfig: {
			theme: "github-light",
		},
	},
});
