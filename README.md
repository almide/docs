# Almide documentation site

Astro + [Starlight](https://starlight.astro.build), deployed to
<https://almide.github.io/docs/> on every push to `main`.

## Runnable code samples

Docs samples can be run by the reader, in their own browser, with no install
and no server: the playground ships the real compiler as WebAssembly, and a
sample is handed to it through the playground's own share-link format
(`#code=<deflate + base64url>`, encoded here at build time by
`src/lib/playground.ts`).

Use the component from any `.mdx` page:

```mdx
---
title: Some page
---

import Playground from '../../../components/Playground.astro';

<Playground code={`fn main() -> Unit = println("hi")`} />
```

Multi-file samples (tab names are module names — `import self.greeting` needs a
`greeting.almd` tab), and setup code hidden from the tab strip but still
compiled:

```mdx
<Playground
  height={560}
  hide={['fixtures.almd']}
  files={[
    { name: 'main.almd', content: `…` },
    { name: 'greeting.almd', content: `…` },
  ]}
/>
```

Notes for authors:

- **Escape interpolation.** Inside a JS template literal, Almide's `${…}` must
  be written `\${…}` or JS will substitute it.
- **The page stays cheap.** The snippet renders as an ordinary highlighted code
  block; the playground iframe is created only when the reader presses Run, and
  opening one closes the previous (each frame loads several MB of compiler).
- **Samples must be `main.almd`-entry, browser-safe.** `process.exec`,
  `env.args` and network access are unavailable in the browser sandbox.

## Commands

| Command                  | Action                                                        |
| :----------------------- | :------------------------------------------------------------ |
| `npm install`            | Install dependencies                                           |
| `npm run dev`            | Local dev server at `localhost:4321`                           |
| `npm run build`          | Build the production site to `./dist/`                         |
| `npm run check:embeds`   | Compile + run every embedded sample (native and wasm) — run after `build` |
| `npm run preview`        | Preview the build locally                                      |

`check:embeds` decodes the playground links out of the built HTML and runs each
sample through the real `almide` CLI on both targets, failing on a compile
error or any native/wasm output drift. It needs the `almide` binary on the
machine (`ALMIDE_BIN` overrides the default `~/.local/almide/almide`), so it is
a local/authoring gate rather than part of the Pages deploy.
