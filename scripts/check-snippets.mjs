#!/usr/bin/env node
// Type-check the ```almide code blocks in the docs against the real compiler.
//
// Most blocks are fragments — an expression, a match arm, a signature — which
// cannot stand alone. Blocks made of top-level declarations CAN: `almide check`
// accepts a file with no `main`. So every block is classified, the checkable
// ones are checked, and the rest are counted and listed so the ratio is visible
// rather than assumed.
//
// A block can opt out with a `no-check` marker on the fence:
//     ```almide no-check
// for deliberately-invalid code (error demonstrations, "do not write this").
//
// Usage: node scripts/check-snippets.mjs [--verbose]

import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync, realpathSync } from 'node:fs';
import { join, resolve, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir, tmpdir } from 'node:os';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DOCS = resolve(__dirname, '../src/content/docs');
const ALMIDE_BIN = process.env.ALMIDE_BIN || join(homedir(), '.local/almide/almide');
const VERBOSE = process.argv.includes('--verbose');

function contentFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...contentFiles(p));
    else if (/\.mdx?$/.test(entry.name)) out.push(p);
  }
  return out;
}

/** Blocks that are a sequence of top-level declarations can be checked alone. */
function isCheckable(code) {
  const lines = code.split('\n').filter((l) => l.trim() && !l.trim().startsWith('//'));
  if (lines.length === 0) return false;
  // The first meaningful line must open a top-level form. `let`/`var` are
  // deliberately excluded: they are legal at the top level, but a block that
  // opens with one is almost always a sequence of statements (`x = x + 1`,
  // a bare `println(…)`) that only makes sense inside a function body.
  return /^(import |fn |effect fn |type |protocol |test |@)/.test(lines[0]);
}

const blocks = [];
for (const file of contentFiles(DOCS)) {
  const text = readFileSync(file, 'utf8');
  const page = relative(DOCS, file);
  const re = /^```almide([^\n]*)\n([\s\S]*?)^```/gm;
  let m;
  let index = 0;
  while ((m = re.exec(text))) {
    const meta = m[1].trim();
    const code = m[2];
    const line = text.slice(0, m.index).split('\n').length;
    blocks.push({ page, line, index: index++, code, optOut: /\bno-check\b/.test(meta) });
  }
}

const scratch = join(realpathSync(tmpdir()), `almide-docs-snippets-${process.pid}`);
mkdirSync(scratch, { recursive: true });

let checked = 0;
let needsContext = 0;
let failed = 0;
const skipped = [];

for (const b of blocks) {
  if (b.optOut) {
    skipped.push({ ...b, why: 'no-check' });
    continue;
  }
  if (!isCheckable(b.code)) {
    skipped.push({ ...b, why: 'fragment' });
    continue;
  }
  const file = join(scratch, `snippet_${checked}.almd`);
  writeFileSync(file, b.code);
  checked++;
  try {
    execFileSync(ALMIDE_BIN, ['check', file], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout: 60_000,
      cwd: scratch,
      env: { ...process.env, PWD: scratch },
    });
  } catch (e) {
    const out = ((e.stderr || '') + (e.stdout || '')).toString().trim();
    // A snippet that illustrates one idea legitimately names helpers the
    // surrounding prose defines. Those read as "undefined function/variable/
    // type", and failing on them would only push authors to stop checking.
    // Everything else — syntax, arity, effect discipline, operator misuse —
    // means the snippet could not be written the way the page shows it.
    const onlyMissingContext =
      /error\[E00[23]\]|error\[E029\]/.test(out) &&
      !/^error(?!\[E00[23]\]|\[E029\])/m.test(out);
    if (onlyMissingContext) {
      needsContext++;
      continue;
    }
    failed++;
    console.error(`✗ ${b.page}:${b.line}`);
    console.error(
      out
        .split('\n')
        .slice(0, 6)
        .map((l) => '    ' + l)
        .join('\n'),
    );
  }
}

rmSync(scratch, { recursive: true, force: true });

const fragments = skipped.filter((s) => s.why === 'fragment').length;
const optOuts = skipped.filter((s) => s.why === 'no-check').length;

if (VERBOSE) {
  console.log('\nUnchecked fragments:');
  for (const s of skipped.filter((x) => x.why === 'fragment')) {
    console.log(`  ${s.page}:${s.line}  ${s.code.split('\n')[0].slice(0, 60)}`);
  }
}

console.log(
  `\n${checked - failed - needsContext}/${checked - needsContext} self-contained snippets type-check ` +
    `(${needsContext} reference helpers defined in the surrounding prose, ` +
    `(${fragments} fragments not standalone-checkable, ${optOuts} opted out, ${blocks.length} total)`,
);
process.exit(failed ? 1 : 0);
