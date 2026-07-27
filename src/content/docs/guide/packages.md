---
title: Packages
description: almide.toml, declaring and fetching dependencies, the lock file, version coexistence, and module boundaries.
---

An Almide package is a directory with an `almide.toml` and a `src/`. The
package name in that file *is* the import name — there is no separate module
declaration inside source files, and no mapping to remember.

```
mypkg/
  almide.toml          # [package] name = "mypkg"
  almide.lock          # generated; commit it
  src/
    mod.almd           # the package entry point
    parser.almd        # → import self.parser, or mypkg.parser from outside
```

```bash
almide init            # scaffold a new project
```

## almide.toml

Four sections are read; anything else is ignored.

```toml
[package]
name = "mypkg"          # required — this is the import name
version = "0.1.0"
almide = "0.36.0"       # minimum compiler version

[dependencies]
base64 = { git = "https://github.com/almide/base64" }
bindgen = { git = "https://github.com/almide/almide-bindgen", tag = "v0.1.0" }
local_helper = { path = "../helper" }

[permissions]
allow = ["IO", "Net", "Log"]

[native-deps]
wasmtime = "42.0.0"
```

**`name` may not contain hyphens.** Since the name is the import name, `foo-bar`
would not be a legal identifier; the compiler rejects it and tells you to write
`foo_bar`.

`almide` pins the minimum compiler version. A too-old toolchain fails the build
with the required and installed versions side by side.

`[permissions]` restricts what the package's code is allowed to reach; an empty
or absent list allows everything. `[native-deps]` adds Rust crates to the
generated native build.

Dependencies are one line each, in inline-table form. `git` plus optionally
`tag`, `branch` or `version`; or `path` for a local checkout, which takes
precedence over `git`. Multi-line tables are not supported.

## Adding and inspecting dependencies

```bash
almide add base64                              # → github.com/almide/base64
almide add almide/base64@v1.2.0                # owner/repo@tag
almide add mine --git https://git.example/x    # explicit URL
```

`almide add` writes the line into `[dependencies]` and clones the repository
immediately.

```bash
almide deps            # list what almide.toml declares
almide dep-path base64 # print the cached source directory
almide clean           # drop the dependency cache
```

`dep-path` is meant for tooling that wants to shell out to a dependency's own
CLI. It fetches anything missing before answering, so it is not a pure query.
`clean` also clears the incremental cache and `target/compile`, not just
dependencies.

Dependencies are cached under `~/.almide/cache/`.

## The lock file

`almide.lock` sits next to `almide.toml` and pins each direct dependency to an
exact commit:

```
# almide.lock — auto-generated, do not edit

bindgen = { git = "https://github.com/almide/almide-bindgen", ref = "v0.1.0", commit = "a629ede…" }
```

It is written after a fetch and read before the next one, so a locked build
reproduces exactly. Commit it to version control. Delete it (or `almide clean`)
when you want to move to the tip of a tag or branch.

## Importing

```almide
import base64            // a dependency
import base64 as b64     // aliased
import pkg.sub           // one sub-module — referred to as `sub.…`
import self              // this package's src/mod.almd
import self.parser       // a sibling file in this package
```

The name after `import` is the dependency's *package* name — the `[package]
name` in its own `almide.toml`, not the key you wrote in `[dependencies]`. The
two are normally the same; when they differ, the package name wins.

There is no wildcard import. Circular imports are a compile error.

`import self.<name>` resolves against `src/`, so a sibling file needs no path.
Plain `import self` loads `src/mod.almd` and requires that file to exist;
`import self.<name>` does not.

## Module boundaries

Dependencies are not transitive. If your package imports `B`, and `B` imports
`D`, your code cannot see `D`:

```
A → B → D
A cannot call D.func() or name D.Logger
```

To use `D`, declare it yourself. The type checker enforces this against the set
of imports the file actually declares, so a transitive type never leaks into
your API by accident. To deliberately re-export, wrap it — `type Logger =
D.Logger`.

## Two majors at once

A package's identity is `(name, major)`, with `0.x` treating the minor as the
major. Two different majors of the same package coexist rather than conflict:
they resolve to distinct modules (`json_v1`, `json_v2`) with distinct types, so
`json_v1.Config` and `json_v2.Config` are not interchangeable. The compiler
warns when this happens:

```
warning: package 'json' required at two different major versions
  → json v1.x (already loaded)
  → json v2.x (newly required)
  Both versions will coexist. Types from v1 and v2 are incompatible.
```

Within a single major, the first resolution encountered wins — the walk is
depth-first, so your own direct dependency takes precedence over the same
package pulled in transitively. Pin the version you want in your own
`[dependencies]` when that matters.

## Next steps

- [Modules & Imports](/docs/guide/modules/) — imports within a package
- [CLI Usage](/docs/reference/cli/) — every command and flag
