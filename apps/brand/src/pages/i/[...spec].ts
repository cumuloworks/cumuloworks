import type { APIRoute, GetStaticPaths } from 'astro';

import {
  CONTENT_TYPES,
  type Format,
  render,
  SIZES,
  VARIANTS,
  type VariantName,
} from '@/brand';

export const prerender = true;

/** `<variant>-<width>.<format>`, e.g. mark_ink-512.webp */
export const getStaticPaths: GetStaticPaths = () =>
  Object.entries(VARIANTS).flatMap(([name, variant]) =>
    SIZES.flatMap((width) =>
      variant.formats.map((format) => ({
        params: { spec: `${name}-${width}.${format}` },
        props: { name, width, format },
      }))
    )
  );

export const GET: APIRoute = async ({ props }) => {
  const { name, width, format } = props as {
    name: VariantName;
    width: number;
    format: Format;
  };

  // sharp hands back a view over ArrayBufferLike; BodyInit wants a plain one.
  const bytes = (await render(name, width, format)) as Uint8Array<ArrayBuffer>;

  return new Response(bytes, {
    headers: {
      'content-type': CONTENT_TYPES[format],
      'cache-control': 'public, max-age=31536000, immutable',
    },
  });
};
