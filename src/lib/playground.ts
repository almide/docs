// Build-time encoder for playground share links.
//
// The playground reads `#code=<deflate-raw + base64url>` (see the playground
// repo's web/share.js). Node's raw DEFLATE is wire-compatible with the
// browser's `DecompressionStream('deflate-raw')`, so a link baked here at
// build time opens straight in the playground with no server involved.

import { deflateRawSync } from 'node:zlib';

export const PLAYGROUND_ORIGIN = 'https://almide.github.io/playground/';

export interface PlaygroundFile {
  name: string;
  content: string;
}

export function encodeFiles(files: PlaygroundFile[]): string {
  const payload = JSON.stringify({ v: 1, files });
  return deflateRawSync(Buffer.from(payload, 'utf8'))
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export interface PlaygroundUrlOptions {
  /** Minimal chrome for iframes (default true). */
  embed?: boolean;
  /** Tabs to keep out of the tab strip while still compiling them. */
  hide?: string[];
  /** Run as soon as the compiler is ready (default true for embeds). */
  autorun?: boolean;
}

export function playgroundUrl(
  files: PlaygroundFile[],
  { embed = true, hide = [], autorun = true }: PlaygroundUrlOptions = {},
): string {
  const params = new URLSearchParams();
  if (embed) params.set('embed', '1');
  if (hide.length) params.set('hide', hide.join(','));
  if (autorun) params.set('autorun', '1');
  const query = params.toString();
  return `${PLAYGROUND_ORIGIN}${query ? '?' + query : ''}#code=${encodeFiles(files)}`;
}
