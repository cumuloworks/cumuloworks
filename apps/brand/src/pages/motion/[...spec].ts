import type { APIRoute, GetStaticPaths } from 'astro';

import {
  MOTION,
  MOTION_CONTENT_TYPES,
  type MotionFormat,
  type MotionName,
  transcode,
} from '@/motion';

export const prerender = true;

/** `<name>-<width>.<format>`, e.g. animated_icon-512.gif */
export const getStaticPaths: GetStaticPaths = () =>
  Object.entries(MOTION).flatMap(([name, motion]) =>
    Object.entries(motion.formats).flatMap(([format, widths]) =>
      widths.map((width) => ({
        params: { spec: `${name}-${width}.${format}` },
        props: { name, width, format },
      }))
    )
  );

export const GET: APIRoute = async ({ props }) => {
  const { name, width, format } = props as {
    name: MotionName;
    width: number;
    format: MotionFormat;
  };

  const bytes = (await transcode(
    name,
    width,
    format
  )) as Uint8Array<ArrayBuffer>;

  return new Response(bytes, {
    headers: {
      'content-type': MOTION_CONTENT_TYPES[format],
      'cache-control': 'public, max-age=31536000, immutable',
    },
  });
};
