---
title: args
description: Command-line flag and option parsing on top of env.args().
---

`import args`

A small argument parser over `env.args()`. The functions are pure `fn`, not
`effect fn`, so they can be called from an ordinary `fn main`.

| Function | Signature |
|---|---|
| `args.raw()` | `() -> List[String]` |
| `args.flag(name)` | `String -> Bool` |
| `args.option(name)` | `String -> Option[String]` |
| `args.option_or(name, fallback)` | `(String, String) -> String` |
| `args.positional()` | `() -> List[String]` |
| `args.positional_at(i)` | `Int -> Option[String]` |

`args.raw()` is `env.args()` verbatim, which does **not** include the program
path — the first element is the user's first argument.

```almide
import args

fn main() -> Unit = {
  let name = args.option_or("name", "world")
  if args.flag("verbose") then println("verbose mode")
  println("hello, ${name}")
}
```

```bash
$ almide run greet.almd -- --name=ada --verbose
verbose mode
hello, ada
```

## Matching rules

`flag(name)` is true for the long form `--name` or the short form built from
its first letter — `flag("verbose")` matches both `--verbose` and `-v`.

`option(name)` reads the long form only, in either spelling: `--name=value` or
`--name value`. A short option with a separate value (`-n value`) is not
recognised.

`positional()` returns the arguments that do not start with `-`. Because it
filters rather than parses, the *value* of a `--name value` option stays in the
list.

With no arguments at all, everything degrades quietly: `raw()` is empty,
`flag` is false, `option` is `none`.

:::caution[One open bug]
Calling `positional_at` twice with **different** indices hangs on the wasm
target ([#903](https://github.com/almide/almide/issues/903)). Reading
`positional()` once and indexing the list is a safe workaround.
:::

Command-line arguments are unavailable in a browser sandbox; a WASI host such
as wasmtime supplies them normally.
