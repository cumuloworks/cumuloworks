import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    prefetch: {
        prefetchAll: true,
    },
    integrations: [
        sitemap(),
    ],
    image: {
        service: {
            entrypoint: "astro/assets/services/sharp",
        },
        domains: ["api.microlink.io", "img.youtube.com", "img.shields.io"],
    },
    output: "static",
    site: "https://cumulo.works",
    markdown: {
        shikiConfig: {
            theme: "github-dark",
        },
    },
    vite: {
      resolve: {
          alias: {
              "@": "/src",
          },
      },

      plugins: [tailwindcss()],
    },
});