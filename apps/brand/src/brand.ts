import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import sharp, { type OverlayOptions, type Sharp } from 'sharp';

/** Package root, injected by astro.config so it survives bundling. */
declare const BRAND_ROOT: string;

/** Falls back to the source location for plain Node scripts. */
export const ROOT =
  typeof BRAND_ROOT === 'string'
    ? BRAND_ROOT
    : fileURLToPath(new URL('../', import.meta.url));

export const assetPath = (...segments: string[]) =>
  join(ROOT, 'assets', ...segments);

export const INK = '#1d3744';
export const PAPER = '#ffffff';

/** Widths every variant is published at, unless its layout fixes them. */
export const SIZES = [64, 128, 256, 512, 1024, 2048] as const;

/** The Open Graph image: its canvas and the wordmark's share of the width. */
export const OG = { width: 1200, height: 630, wordmark: 0.5 } as const;

export type Format = 'png' | 'webp' | 'jpg';

export interface Variant {
  /**
   * Source under assets/. SVGs are recoloured and rasterised at the target
   * size; rasters are resized.
   */
  src: string;
  /** SVG only: fill applied to the monochrome artwork. */
  fill?: string;
  /**
   * Portraits only: square crop (face-weighted) with the white mark over the
   * chest — the "logo portrait".
   */
  logo?: boolean;
  /** Rasters only: circular clip, keeps a transparent corner. */
  mask?: boolean;
  /**
   * Gradient only: the Open Graph image — a 1.91:1 crop with the white
   * wordmark centred, under the same soft shadow the page's banner gives it.
   */
  og?: boolean;
  /** Widths published instead of every size. */
  widths?: readonly number[];
  formats: readonly Format[];
  /** Previews need ink behind the white variants to be visible at all. */
  onDark?: boolean;
}

export const PORTRAIT_IDS = [
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
] as const;

export type PortraitId = (typeof PORTRAIT_IDS)[number];

type PortraitVariantName =
  | `portrait_${PortraitId}`
  | `portrait_${PortraitId}_logo`
  | `portrait_${PortraitId}_logo_masked`;

const portraits = {} as Record<PortraitVariantName, Variant>;
for (const id of PORTRAIT_IDS) {
  const src = `portraits/${id}.jpg`;
  portraits[`portrait_${id}`] = {
    src,
    formats: ['jpg', 'webp'],
  };
  portraits[`portrait_${id}_logo`] = {
    src,
    logo: true,
    formats: ['jpg', 'webp'],
  };
  portraits[`portrait_${id}_logo_masked`] = {
    src,
    logo: true,
    mask: true,
    formats: ['png', 'webp'],
  };
}

/**
 * Logo portrait geometry, as fractions of the square. The photos are 2:3
 * standing portraits with the head around the top third, so a centred square
 * crop brings the head to the top edge and the mark lands on the chest.
 */
const LOGO_MARK_WIDTH = 0.34;
const LOGO_MARK_TOP = 0.42;

/**
 * Everything published under /i. The icon mirrors the After Effects comp of
 * the same name: the "Gradient" precomp rendered on its own is gradient.png,
 * with the mark composited over it (plus its glow) it is icon.png.
 */
export const VARIANTS = {
  icon: {
    src: 'icon.png',
    formats: ['png', 'webp', 'jpg'],
  },
  icon_masked: {
    src: 'icon.png',
    mask: true,
    formats: ['png', 'webp'],
  },
  gradient: {
    src: 'gradient.png',
    formats: ['png', 'webp', 'jpg'],
  },
  ogp: {
    src: 'gradient.png',
    og: true,
    widths: [OG.width],
    formats: ['png', 'webp', 'jpg'],
  },
  mark: {
    src: 'mark.svg',
    fill: PAPER,
    formats: ['png', 'webp'],
    onDark: true,
  },
  mark_ink: {
    src: 'mark.svg',
    fill: INK,
    formats: ['png', 'webp'],
  },
  type: {
    src: 'type.svg',
    fill: PAPER,
    formats: ['png', 'webp'],
    onDark: true,
  },
  type_ink: {
    src: 'type.svg',
    fill: INK,
    formats: ['png', 'webp'],
  },
  ...portraits,
} satisfies Record<string, Variant>;

export type VariantName = keyof typeof VARIANTS;

/** Vector sources served verbatim under /assets. */
export const VECTORS = ['mark.svg', 'type.svg'] as const;

function viewBox(file: string, raw: string): { width: number; height: number } {
  const m = raw.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
  if (!m) throw new Error(`${file} has no parsable viewBox`);
  return { width: Number(m[1]), height: Number(m[2]) };
}

/** Intrinsic size of a vector source, from its viewBox. */
export async function vectorSize(
  file: string
): Promise<{ width: number; height: number }> {
  return viewBox(file, await readFile(assetPath(file), 'utf8'));
}

/**
 * Both vectors are monochrome, so the authored colour is dropped (a <style>
 * block in mark.svg, per-path attributes in type.svg) and a fill can be
 * inherited from a wrapping <g>.
 */
function svgBody(raw: string): string {
  const openEnd = raw.indexOf('>', raw.indexOf('<svg')) + 1;
  return raw
    .slice(openEnd, raw.lastIndexOf('</svg>'))
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/\s*fill="[^"]*"/gi, '');
}

async function recolourSvg(
  file: string,
  fill: string
): Promise<{ svg: string; width: number }> {
  const raw = await readFile(assetPath(file), 'utf8');
  const { width, height } = viewBox(file, raw);

  return {
    svg:
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">` +
      `<g fill="${fill}">${svgBody(raw)}</g></svg>`,
    width,
  };
}

/** The banner's drop-shadow(0 2px 14px rgba(ink, 0.12)), at the 1200 px canvas. */
const OG_SHADOW = { dy: 2, sigma: 7, opacity: 0.12 };

/** The white wordmark centred on a `width` × `height` canvas, with its shadow. */
async function ogOverlay(width: number, height: number): Promise<Buffer> {
  const raw = await readFile(assetPath('type.svg'), 'utf8');
  const box = viewBox('type.svg', raw);
  const body = svgBody(raw);
  const scale = (width * OG.wordmark) / box.width;
  const x = (width - box.width * scale) / 2;
  const y = (height - box.height * scale) / 2;
  const k = width / OG.width;
  const place = (dy: number) => `translate(${x} ${y + dy}) scale(${scale})`;

  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">` +
      `<filter id="s" filterUnits="userSpaceOnUse" x="0" y="0" width="${width}" height="${height}">` +
      `<feGaussianBlur stdDeviation="${OG_SHADOW.sigma * k}"/></filter>` +
      `<g filter="url(#s)" opacity="${OG_SHADOW.opacity}">` +
      `<g transform="${place(OG_SHADOW.dy * k)}" fill="${INK}">${body}</g></g>` +
      `<g transform="${place(0)}" fill="${PAPER}">${body}</g></svg>`
  );
}

function circle(size: number): Buffer {
  const r = size / 2;
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">` +
      `<circle cx="${r}" cy="${r}" r="${r}"/></svg>`
  );
}

function encode(pipeline: Sharp, format: Format): Promise<Uint8Array> {
  if (format === 'png') return pipeline.png().toBuffer();
  if (format === 'webp') return pipeline.webp({ quality: 90 }).toBuffer();
  return pipeline
    .flatten({ background: PAPER })
    .jpeg({ quality: 90 })
    .toBuffer();
}

/** Rasterise a recoloured vector at exactly `width` px wide. */
async function vector(
  file: string,
  fill: string,
  width: number
): Promise<Sharp> {
  const { svg, width: canvasW } = await recolourSvg(file, fill);
  // Rasterise at the target size rather than resampling a default-DPI render.
  const density = Math.max(
    72,
    Math.min(2400, Math.round((72 * width) / canvasW))
  );
  return sharp(Buffer.from(svg), { density }).resize(width);
}

export async function render(
  name: VariantName,
  width: number,
  format: Format
): Promise<Uint8Array> {
  const variant: Variant = VARIANTS[name];

  if (variant.fill) {
    return encode(await vector(variant.src, variant.fill, width), format);
  }

  const layers: OverlayOptions[] = [];
  let pipeline = sharp(assetPath(variant.src));

  if (variant.og) {
    const height = Math.round((width * OG.height) / OG.width);
    pipeline = pipeline.resize(width, height, { fit: 'cover' });
    layers.push({ input: await ogOverlay(width, height) });
  } else if (variant.logo) {
    pipeline = pipeline.resize(width, width, { fit: 'cover' });
    const markW = Math.round(width * LOGO_MARK_WIDTH);
    layers.push({
      input: await (await vector('mark.svg', PAPER, markW)).png().toBuffer(),
      left: Math.round((width - markW) / 2),
      top: Math.round(width * LOGO_MARK_TOP),
    });
  } else {
    pipeline = pipeline.resize(width);
  }

  if (variant.mask) layers.push({ input: circle(width), blend: 'dest-in' });

  return encode(layers.length ? pipeline.composite(layers) : pipeline, format);
}

export const CONTENT_TYPES: Record<Format, string> = {
  png: 'image/png',
  webp: 'image/webp',
  jpg: 'image/jpeg',
};
