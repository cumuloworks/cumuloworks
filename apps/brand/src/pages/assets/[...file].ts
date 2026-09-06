import { readFile } from 'node:fs/promises';

import type { APIRoute, GetStaticPaths } from 'astro';

import { assetPath, VECTORS } from '@/brand';

export const prerender = true;

/** The vector sources, served as authored. */
export const getStaticPaths: GetStaticPaths = () =>
  VECTORS.map((file) => ({ params: { file } }));

export const GET: APIRoute = async ({ params }) => {
  const bytes = (await readFile(
    assetPath(params.file as string)
  )) as Uint8Array<ArrayBuffer>;

  return new Response(bytes, {
    headers: {
      'content-type': 'image/svg+xml',
      'cache-control': 'public, max-age=31536000, immutable',
    },
  });
};
