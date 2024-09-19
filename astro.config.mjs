import { defineConfig } from "astro/config";

import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";

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
	],
	content: {
		collections: [
			{
				name: "projects",
				type: "content",
			},
			{
				name: "blogs",
				type: "content",
			},
			{
				name: "downloads",
				type: "content",
			},
		],
	},
	image: {
		service: {
			entrypoint: "astro/assets/services/sharp",
		},
	},
});
