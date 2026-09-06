// Promote After Effects render-queue output into the masters under assets/.
// AE numbers every image sequence, even a single frame, so the queue renders
// into ae/render/ and this copies the results across under their final names:
//   pnpm --filter @cumuloworks/brand masters
import { copyFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

import sharp from 'sharp';

import { ROOT } from '../src/brand.ts';

const RENDER = join(ROOT, 'ae', 'render');
const ASSETS = join(ROOT, 'assets');
const SIZE = 2048;

const STILLS = ['icon', 'gradient'];
const CLIPS = ['animated-icon.mp4'];

const files = await readdir(RENDER);

async function still(name: string): Promise<string> {
  const frame = files.find(
    (f) => f.startsWith(`${name}_`) && f.endsWith('.png')
  );
  if (!frame) {
    throw new Error(`no ${name}_*.png in ae/render — render the queue first`);
  }
  const src = join(RENDER, frame);
  const { width, height } = await sharp(src).metadata();
  if (width !== SIZE || height !== SIZE) {
    throw new Error(`${frame} is ${width}×${height}, expected ${SIZE}²`);
  }
  // Normalised to 8-bit RGB whatever depth or alpha the render carried.
  await sharp(src)
    .removeAlpha()
    .toColourspace('srgb')
    .png({ compressionLevel: 9 })
    .toFile(join(ASSETS, `${name}.png`));
  return `${frame} → assets/${name}.png`;
}

async function clip(name: string): Promise<string> {
  await copyFile(join(RENDER, name), join(ASSETS, name));
  return `${name} → assets/${name}`;
}

const done = await Promise.all([...STILLS.map(still), ...CLIPS.map(clip)]);
console.warn(done.join('\n'));
