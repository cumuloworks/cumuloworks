import { fileURLToPath } from 'node:url';

import { defineConfig } from 'astro/config';

// Prerender code is bundled into dist/.prerender, so import.meta.url no longer
// points at the project. Hand the real root to the build instead.
const projectRoot = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  output: 'static',
  site: 'https://brand.cumulo.works',
  // Listen on the PORT/HOST that portless injects (script indirection defeats
  // its --port flag injection); falls back to Astro defaults when run directly.
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : undefined,
    host: process.env.HOST || undefined,
  },
  vite: {
    define: {
      BRAND_ROOT: JSON.stringify(projectRoot),
    },
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  },
});
