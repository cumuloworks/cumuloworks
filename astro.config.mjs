import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

/**
 * Defer iframes embedded in markdown until their accordion panel is opened
 * (the homepage hydrates `iframe[data-src]` on expand) and lazy-load images.
 */
function rehypeLazyEmbeds() {
  const walk = (node) => {
    // Raw HTML embeds (e.g. <iframe> written directly in markdown).
    if (node.type === "raw" && typeof node.value === "string" && node.value.includes("<iframe")) {
      node.value = node.value.replace(
        /<iframe\b([^>]*?)\ssrc=/gi,
        '<iframe$1 loading="lazy" data-src=',
      );
    }
    // Parsed elements.
    if (node.tagName === "iframe" && node.properties?.src) {
      node.properties.dataSrc = node.properties.src;
      node.properties.src = undefined;
      node.properties.loading = "lazy";
    }
    if (node.tagName === "img" && node.properties && !node.properties.loading) {
      node.properties.loading = "lazy";
    }
    for (const child of node.children || []) walk(child);
  };
  return (tree) => walk(tree);
}

export default defineConfig({
  // Aggressive load optimisation: prefetch every same-origin link as it enters
  // the viewport, and (where supported) promote those prefetches to full
  // prerenders via the Speculation Rules API (clientPrerender, eagerness
  // "immediate").
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },
  experimental: {
    clientPrerender: true,
  },
  // Only the homepage is a real content page; /about, /en, /ja, etc. are
  // redirects, and /projects|blogs|downloads/* are rewrites to the homepage.
  integrations: [sitemap({ filter: (page) => page === "https://cumulo.works/" })],
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
      // Light theme to match the editorial light design (credits and code
      // blocks read as quiet light blocks rather than heavy dark boxes).
      theme: "github-light",
    },
    rehypePlugins: [rehypeLazyEmbeds],
  },
  vite: {
    resolve: {
      alias: {
        "@": "/src",
      },
    },
  },
});
