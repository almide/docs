# Almide documentation site

Astro + [Starlight](https://starlight.astro.build), deployed to
<https://almide.github.io/docs/> on every push to `main`.

## Runnable code samples

Docs samples can be run by the reader, in their own browser, with no install
and no server: the playground ships the real compiler as WebAssembly, and a
sample is handed to it through the playground's own share-link format
(`#code=<deflate + base64url>`, encoded here at build time by
`src/lib/playground.ts`).

Samples live as real files under `src/samples/<id>/`, with `main.almd` as the
entry point. Add more files to the same directory for a multi-file sample (tab
names are module names — `import self.greeting` needs a `greeting.almd`), or
data files a sample reads with `fs.read_text`.

Reference one from any `.mdx` page:

```mdx
---
title: Some page
---

import Playground from '../../../components/Playground.astro';

<Playground sample="hello-basic" />
<Playground sample="modules-two-files" height={560} hide={['fixtures.almd']} />
```

Notes for authors:

- **Never inline code in the page.** MDX reindents multi-line template literals
  and eats `${…}`, so a sample written inline reaches the reader subtly altered.
  Files on disk ship byte-for-byte, and `check:embeds` asserts it.
- **The page stays cheap.** The snippet renders as an ordinary highlighted code
  block; the playground iframe is created only when the reader presses Run, and
  opening one closes the previous (each frame loads several MB of compiler).
- **Samples must be browser-safe.** `process.exec`, `env.args` and network
  access are unavailable in the browser sandbox.

## Commands

| Command                  | Action                                                        |
| :----------------------- | :------------------------------------------------------------ |
| `npm install`            | Install dependencies                                           |
| `npm run dev`            | Local dev server at `localhost:4321`                           |
| `npm run build`          | Build the production site to `./dist/`                         |
| `npm run check`          | Both checks below — run after `build`                          |
| `npm run check:links`    | Verify every internal link resolves in the built site          |
| `npm run check:embeds`   | Compile + run every embedded sample (native and wasm)          |
| `npm run preview`        | Preview the build locally                                      |

`check:links` catches the most common docs bug on this site: the base path.
Pages are served under `/docs`, so a link written as `/guide/types/` renders
fine locally and 404s in production — it must be `/docs/guide/types/`.

One gap to know about: `check:embeds` compiles through the `almide` CLI, which
type-checks with the v0 checker before invoking the verified wasm renderer. The
playground calls that renderer directly. The two can disagree (see
[almide#893](https://github.com/almide/almide/issues/893)), so a sample can pass
the harness and still be rejected in the browser. Open a new sample in the
playground once before shipping it.

`check:embeds` decodes the playground links out of the built HTML and checks
that each sample is byte-identical to its `src/samples/` source, then runs it
through the real `almide` CLI on both targets — failing on a compile error or
any native/wasm output drift. The byte comparison is the part that catches
silent reindentation: a reindented sample still compiles, so running it is not
enough. It needs the `almide` binary on the machine (`ALMIDE_BIN` overrides the
default `~/.local/almide/almide`), so it is a local/authoring gate rather than
part of the Pages deploy.
