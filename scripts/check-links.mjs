#!/usr/bin/env node
// Internal links in the built site must resolve. The site is served under a
// `/docs` base, so a link written as `/stdlib/string/` looks fine in the
// markdown and 404s in production — exactly the drift this catches.
//
// Usage:
//   npx astro build && node scripts/check-links.mjs

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, resolve, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(__dirname, '../dist');
const BASE = '/docs';

function htmlFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...htmlFiles(p));
    else if (entry.name.endsWith('.html')) out.push(p);
  }
  return out;
}

/** A built page exists for `/docs/foo/` as dist/foo/index.html. */
function resolves(href) {
  const path = href.split('#')[0].split('?')[0];
  if (!path.startsWith(BASE + '/')) return false;
  const rel = path.slice(BASE.length + 1).replace(/\/$/, '');
  if (rel === '') return existsSync(join(DIST, 'index.html'));
  return (
    existsSync(join(DIST, rel, 'index.html')) ||
    existsSync(join(DIST, rel)) ||
    existsSync(join(DIST, rel + '.html'))
  );
}

let broken = 0;
let checked = 0;

for (const file of htmlFiles(DIST)) {
  const html = readFileSync(file, 'utf8');
  const page = relative(DIST, file);
  const seen = new Set();
  for (const m of html.matchAll(/href="(\/[^"#][^"]*)"/g)) {
    const href = m[1];
    // Only site-internal page links; assets and externals are out of scope.
    if (href.startsWith('/_astro/') || /\.(css|js|png|svg|ico|webp|xml|txt|json)$/.test(href)) continue;
    if (seen.has(href)) continue;
    seen.add(href);
    checked++;
    if (!resolves(href)) {
      console.error(`✗ ${page} → ${href}`);
      broken++;
    }
  }
}

console.log(`\n${checked - broken}/${checked} internal links resolve`);
if (broken) {
  console.error(
    `\nhint: the site is served under "${BASE}" — write links as "${BASE}/guide/types/", not "/guide/types/"`,
  );
}
process.exit(broken ? 1 : 0);
