import { OG, render } from '@cumuloworks/brand/brand';
import type { APIRoute } from 'astro';

export const prerender = true;

/** The Open Graph image, composed from the brand masters at build. */
export const GET: APIRoute = async () => {
  // sharp hands back a view over ArrayBufferLike; BodyInit wants a plain one.
  const bytes = (await render(
    'ogp',
    OG.width,
    'png'
  )) as Uint8Array<ArrayBuffer>;

  return new Response(bytes, { headers: { 'content-type': 'image/png' } });
};
