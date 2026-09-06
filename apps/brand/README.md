# @cumuloworks/brand

Brand assets for cumuloworks, published at brand.cumulo.works and consumed by
`apps/web` as a workspace package.

## Sources of truth

Everything served is derived at build time from a small set of masters. Nothing
under `dist/` is committed.

| Master                     | Origin                                        | Served as                                    |
| -------------------------- | --------------------------------------------- | -------------------------------------------- |
| `assets/mark.svg`          | Vector artwork                                | `/assets/mark.svg`, `/i/mark*`               |
| `assets/type.svg`          | Vector artwork                                | `/assets/type.svg`, `/i/type*`               |
| `assets/gradient.png`      | `ae/branding.aep` › **Gradient** comp, t = 0  | `/i/gradient-*`                              |
| `assets/icon.png`          | `ae/branding.aep` › **Icon** comp, t = 0      | `/i/icon-*`, `/i/icon_masked-*`              |
| `assets/animated-icon.mp4` | `ae/branding.aep` › **Animated Icon** comp    | `/motion/animated_icon-*.{mp4,webm,gif}`     |
| `assets/portraits/NN.jpg`  | Photos of Tomoya Eguchi                       | `/i/portrait_NN*`                            |

The icon is composed in After Effects exactly as it is described on the page:
the **Gradient** precomp (portrait 05, blurred, through curl noise) sits under
the mark, which carries a soft teal drop shadow. **Icon** and **Animated Icon**
share that structure; the animated one draws the mark on from
`ae/footage/icon_check.mp4`.

Logo portraits (`portrait_NN_logo`, `portrait_NN_logo_masked`) are composed in
code from any of the photos: a face-weighted square crop with the white mark
over the chest. Portraits may not be used without permission from the subject;
the page says so and the license excludes them.

## Re-rendering from After Effects

The render queue in `branding.aep` writes into `ae/render/` (ignored by git):

| Queue item    | Output                          | Settings                     |
| ------------- | ------------------------------- | ---------------------------- |
| Icon          | `ae/render/icon_[#####].png`    | PNG, 8 bpc, first frame only |
| Gradient      | `ae/render/gradient_[#####].png`| PNG, 8 bpc, first frame only |
| Animated Icon | `ae/render/animated-icon.mp4`   | H.264 (Rec.709), work area   |

Open the project, make the change, render the queue, then promote the results
into `assets/` (AE numbers every image sequence, even a single frame, so the
stills are renamed and normalised to 8-bit RGB on the way):

```sh
pnpm --filter @cumuloworks/brand masters
```

All footage the project needs lives in this package (`assets/` and
`ae/footage/`), so it opens cleanly from a fresh checkout.

## URL scheme

- `/i/<variant>-<width>.<format>` — every variant in `src/brand.ts` at
  64 … 2048 px. `_masked` variants are circular with a transparent corner.
- `/motion/<name>-<width>.<format>` — the motion variants in `src/motion.ts`;
  the master width is served as a byte-for-byte copy of the AE render.
- `/assets/<file>.svg` — the vectors, as authored.

Images are rasterised with sharp and the motion variants with the bundled
`ffmpeg-static`, both as static endpoints, so a build produces the full set.

## Consumers

`apps/web` imports the sources it needs through the package export:

```ts
import wordmark from '@cumuloworks/brand/assets/type.svg?raw';
import portrait from '@cumuloworks/brand/assets/portraits/05.jpg';
```

`public/avatar.webp` is the one derived file kept in the repo — the GitHub
profile README embeds it and cannot run a build. Regenerate it after portrait 05
or the mark placement changes:

```sh
pnpm --filter @cumuloworks/brand avatar
```

## Deployment

Static output on Cloudflare Workers (`wrangler.jsonc`, assets only, custom
domain `brand.cumulo.works`). Headers live in `public/_headers`.

Workers Builds deploys every push to `main` for both Workers, each with its
app directory as the root: `cumuloworks-brand` from `/apps/brand` and
`cumuloworks-web` from `/apps/web`, running `pnpm run build` then
`npx wrangler deploy`. To deploy by hand:

```sh
pnpm --filter @cumuloworks/brand build && pnpm --filter @cumuloworks/brand exec wrangler deploy
```
