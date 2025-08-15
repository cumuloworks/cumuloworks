import { defineConfig } from "astro/config";
import icon from "astro-icon";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    prefetch: {
        prefetchAll: true,
    },
    integrations: [
        icon({
            "fa6-solid": ["*"],
            "fa6-brands": ["*"],
        }),
        sitemap(),
    ],
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
    vite: {
      resolve: {
          alias: {
              "@": "/src",
          },
      },

      plugins: [tailwindcss()],
    },
});