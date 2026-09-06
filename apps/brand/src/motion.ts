import { execFile } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';

import ffmpegPath from 'ffmpeg-static';

import { assetPath } from '@/brand';

const run = promisify(execFile);

export type MotionFormat = 'mp4' | 'webm' | 'gif';

export interface Motion {
  label: string;
  /** Master render under assets/, straight out of After Effects. */
  src: string;
  /** Master width; the same width is served as a byte-for-byte copy. */
  width: number;
  /** Widths published per format. GIF is capped where the palette still holds. */
  formats: Readonly<Record<MotionFormat, readonly number[]>>;
}

/** Everything published under /motion. The "Animated Icon" comp is the source. */
export const MOTION = {
  animated_icon: {
    label: 'animated icon',
    src: 'animated-icon.mp4',
    width: 2048,
    formats: {
      mp4: [2048, 1024, 512],
      webm: [1024, 512],
      gif: [512, 256],
    },
  },
} satisfies Record<string, Motion>;

export type MotionName = keyof typeof MOTION;

export const MOTION_NAMES = Object.keys(MOTION) as MotionName[];

const GIF_FPS = 15;

function args(format: MotionFormat, width: number): string[] {
  const scale = `scale=${width}:-2:flags=lanczos`;
  switch (format) {
    case 'mp4':
      return [
        '-vf',
        scale,
        '-c:v',
        'libx264',
        '-preset',
        'slow',
        '-crf',
        '18',
        '-pix_fmt',
        'yuv420p',
        '-movflags',
        '+faststart',
        '-an',
      ];
    case 'webm':
      return [
        '-vf',
        scale,
        '-c:v',
        'libvpx-vp9',
        '-crf',
        '32',
        '-b:v',
        '0',
        '-row-mt',
        '1',
        '-pix_fmt',
        'yuv420p',
        '-an',
      ];
    case 'gif':
      // Two-pass palette in one graph: a per-frame diff palette keeps the
      // gradient from banding while the mark draws on.
      return [
        '-vf',
        `fps=${GIF_FPS},${scale},split[a][b];[a]palettegen=stats_mode=diff[p];[b][p]paletteuse=dither=sierra2_4a`,
        '-loop',
        '0',
      ];
  }
}

// Encodes are deterministic per spec, so one build (or dev session) only ever
// pays for each once, even when the page and the endpoint both ask.
const cache = new Map<string, Promise<Uint8Array>>();

export function transcode(
  name: MotionName,
  width: number,
  format: MotionFormat
): Promise<Uint8Array> {
  const key = `${name}-${width}.${format}`;
  let job = cache.get(key);
  if (!job) {
    job = encode(MOTION[name], width, format);
    cache.set(key, job);
  }
  return job;
}

async function encode(
  motion: Motion,
  width: number,
  format: MotionFormat
): Promise<Uint8Array> {
  const src = assetPath(motion.src);
  if (format === 'mp4' && width === motion.width) return readFile(src);

  if (!ffmpegPath)
    throw new Error('ffmpeg-static has no binary for this platform');

  const dir = await mkdtemp(join(tmpdir(), 'brand-motion-'));
  const out = join(dir, `out.${format}`);
  try {
    await run(
      ffmpegPath,
      ['-v', 'error', '-y', '-i', src, ...args(format, width), out],
      {
        maxBuffer: 1 << 20,
      }
    );
    return await readFile(out);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

export const MOTION_CONTENT_TYPES: Record<MotionFormat, string> = {
  mp4: 'video/mp4',
  webm: 'video/webm',
  gif: 'image/gif',
};
