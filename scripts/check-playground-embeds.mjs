#!/usr/bin/env node
// Every <Playground> snippet in the docs is presented to readers as runnable
// code. This harness decodes them straight out of the BUILT html (the same
// bytes the browser gets) and runs each one through the real compiler on both
// targets, so a docs sample can never silently rot into something that does
// not compile — or that behaves differently in the reader's browser than on
// their machine.
//
// Usage:
//   npx astro build && node scripts/check-playground-embeds.mjs

import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync, realpathSync } from 'node:fs';
import { join, resolve, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir, tmpdir } from 'node:os';
import { inflateRawSync } from 'node:zlib';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(__dirname, '../dist');
const ALMIDE_BIN = process.env.ALMIDE_BIN || join(homedir(), '.local/almide/almide');

function htmlFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...htmlFiles(p));
    else if (entry.name.endsWith('.html')) out.push(p);
  }
  return out;
}

function decodeEmbed(url) {
  const encoded = url.split('#code=')[1];
  if (!encoded) return null;
  const b64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
  const payload = JSON.parse(inflateRawSync(Buffer.from(b64, 'base64')).toString('utf8'));
  return payload.files;
}

function collectEmbeds() {
  const embeds = [];
  for (const file of htmlFiles(DIST)) {
    const html = readFileSync(file, 'utf8');
    const urls = [...html.matchAll(/data-playground-url="([^"]+)"/g)].map((m) =>
      m[1].replace(/&#38;/g, '&').replace(/&amp;/g, '&'),
    );
    urls.forEach((url, i) => {
      const files = decodeEmbed(url);
      if (files) embeds.push({ page: relative(DIST, file), index: i, files });
    });
  }
  return embeds;
}

function run(args, cwd) {
  try {
    const stdout = execFileSync(ALMIDE_BIN, args, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout: 120_000,
      cwd,
      // The wasm leg derives the guest cwd from $PWD, not getcwd() — keep them
      // in sync or relative fs reads fail on wasm only (almide#874).
      env: { ...process.env, PWD: cwd },
    });
    return { ok: true, stdout: stdout.trimEnd() };
  } catch (e) {
    return {
      ok: false,
      stdout: (e.stdout || '').toString().trimEnd(),
      stderr: (e.stderr || '').toString().trimEnd(),
    };
  }
}

const embeds = collectEmbeds();
if (embeds.length === 0) {
  console.error('no playground embeds found in dist/ — did you run `astro build` first?');
  process.exit(1);
}

const scratchRoot = join(realpathSync(tmpdir()), `almide-docs-embeds-${process.pid}`);
let failures = 0;

for (const embed of embeds) {
  const label = `${embed.page}#${embed.index}`;
  const root = join(scratchRoot, label.replace(/[^\w]+/g, '_'));
  mkdirSync(join(root, 'src'), { recursive: true });
  writeFileSync(join(root, 'almide.toml'), '[package]\nname = "docs_embed"\nversion = "0.1.0"\n');
  for (const f of embed.files) {
    const dest = f.name.endsWith('.almd') ? join(root, 'src', f.name) : join(root, f.name);
    writeFileSync(dest, f.content);
  }

  const native = run(['run', 'src/main.almd'], root);
  if (!native.ok) {
    console.error(`✗ ${label} [native]`);
    console.error(native.stderr || native.stdout);
    failures++;
    continue;
  }
  const wasm = run(['run', 'src/main.almd', '--target', 'wasm'], root);
  if (!wasm.ok) {
    console.error(`✗ ${label} [wasm]`);
    console.error(wasm.stderr || wasm.stdout);
    failures++;
    continue;
  }
  if (wasm.stdout !== native.stdout) {
    console.error(`✗ ${label} [cross-target drift]`);
    console.error(`  native: ${JSON.stringify(native.stdout)}`);
    console.error(`  wasm:   ${JSON.stringify(wasm.stdout)}`);
    failures++;
    continue;
  }
  console.log(`✓ ${label} (${embed.files.map((f) => f.name).join(', ')})`);
}

rmSync(scratchRoot, { recursive: true, force: true });
console.log(`\n${embeds.length - failures}/${embeds.length} playground embeds passed`);
process.exit(failures ? 1 : 0);
