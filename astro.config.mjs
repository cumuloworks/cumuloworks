import { satteri } from "@astrojs/markdown-satteri";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

/**
 * Defer iframes embedded in markdown until their accordion panel is opened
 * (the homepage hydrates `iframe[data-src]` on expand) and lazy-load images.
 *
 * Ported to a Sätteri HAST plugin: markdown images become real `<img>`
 * elements (handled by the element visitor), while iframes are authored as
 * raw HTML in the markdown and stay as `raw` nodes (handled by the raw
 * visitor with a string rewrite).
 */
const lazyEmbeds = {
  name: "lazy-embeds",
  element: {
    filter: ["img", "iframe"],
    visit(node, ctx) {
      if (node.tagName === "iframe" && node.properties?.src) {
        ctx.setProperty(node, "dataSrc", node.properties.src);
        ctx.setProperty(node, "src", undefined);
        ctx.setProperty(node, "loading", "lazy");
      } else if (node.tagName === "img" && !node.properties?.loading) {
        ctx.setProperty(node, "loading", "lazy");
      }
    },
  },
  raw(node) {
    if (typeof node.value !== "string" || !node.value.includes("<iframe")) return;
    return {
      type: "raw",
      value: node.value.replace(/<iframe\b([^>]*?)\ssrc=/gi, '<iframe$1 loading="lazy" data-src='),
    };
  },
};

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
      // shikiConfig is honoured by the Sätteri pipeline's built-in highlighter.
      theme: "github-light",
    },
    // Astro 7's native Sätteri processor, extended with our lazy-embed plugin.
    processor: satteri({ hastPlugins: [lazyEmbeds] }),
  },
  vite: {
    resolve: {
      alias: {
        "@": "/src",
      },
    },
  },
});
