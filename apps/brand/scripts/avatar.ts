// The GitHub profile README can't run a build, so the circular logo portrait
// it embeds is the one derived file kept in the repo. Regenerate after the
// portrait changes: pnpm --filter @cumuloworks/brand avatar
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { render, ROOT } from '../src/brand.ts';

const out = join(ROOT, 'public', 'avatar.webp');
await writeFile(out, await render('portrait_05_logo_masked', 512, 'webp'));
console.warn(`wrote ${out}`);
