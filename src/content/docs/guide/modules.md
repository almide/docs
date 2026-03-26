---
title: Modules & Imports
description: Importing modules, selective imports, auto-imported modules, and visibility in Almide.
---

Almide organizes code into modules. The standard library provides modules for common operations, and user packages are imported the same way.

## Import syntax

Import a module to use its functions:

```almide
import fs
import json
import regex

effect fn main() -> Result[Unit, String] = {
  let content = fs.read_text("data.json")
  let data = json.parse(content)
  ok(())
}
```

All stdlib functions are called with a module prefix: `fs.read_text(...)`, `json.parse(...)`, `string.trim(...)`.

## Import forms

| Form | Syntax | Example |
|------|--------|---------|
| Simple | `import module` | `import fs` |
| Alias | `import module as name` | `import mylib as m` |
| Sub-module | `import pkg.sub` | `import mylib.parser` |
| Selective | `import pkg.{Name1, Name2}` | `import mylib.{Parser, Lexer}` |
| Self-alias | `import self as name` | `import self as app` |

Wildcard imports (`import fs.*`) are a compile error.

## Auto-imported modules (prelude)

These modules are available without `import`:

| Module | Description |
|--------|-------------|
| `string` | String manipulation |
| `list` | List operations |
| `map` | Map operations |
| `set` | Set operations |
| `int` | Integer utilities |
| `float` | Float utilities |
| `math` | Mathematical functions |
| `result` | Result combinators |
| `option` | Option combinators |
| `value` | Dynamic value operations |

Auto-imported types and constructors:

- Primitives: `Int`, `Float`, `Bool`, `String`, `Unit`, `Path`
- Collections: `List[T]`, `Map[K, V]`, `Set[T]`
- Error handling: `Option[T]`, `Result[T, E]`
- Constructors: `some(x)`, `none`, `ok(x)`, `err(x)`
- Booleans: `true`, `false`
- Boundary: `Json`, `Value`

## Import-required modules

These modules require an explicit `import`:

| Module | Description |
|--------|-------------|
| `fs` | File system operations (effect) |
| `env` | Environment variables, timestamps (effect) |
| `io` | Standard I/O (effect) |
| `process` | Process execution (effect) |
| `json` | JSON parsing and building |
| `random` | Random number generation (effect) |
| `regex` | Regular expressions |
| `datetime` | Date and time operations |
| `http` | HTTP client (effect) |
| `log` | Logging (effect) |
| `testing` | Extended test assertions |
| `error` | Error utilities |

## Bundled modules (pure Almide)

These are implemented in Almide itself and imported the same way:

| Module | Description |
|--------|-------------|
| `args` | Command-line argument parsing |
| `path` | File path manipulation |
| `option` | Option[T] utilities |
| `result` | Result[T, E] utilities |

## Aliased imports

Use `as` to create a shorter name for a module:

```almide
import mylib as m
m.hello()
```

Self-alias lets you reference the current package by name:

```almide
import self as app
app.some_function()
```

## Selective imports

Import specific types or items from a module:

```almide
import mylib.{Parser, Lexer}
```

This brings `Parser` and `Lexer` directly into scope without a prefix.

## Visibility

Declarations default to public. Use `mod` or `local` to restrict access:

| Modifier | Scope |
|----------|-------|
| *(none)* | Public -- accessible from anywhere |
| `mod` | Same project only |
| `local` | Same file only |

```almide
fn public_api() -> String = "anyone"
mod fn project_only() -> String = "same project"
local fn file_only() -> String = "same file"
```

Visibility applies to functions, types, and top-level let bindings:

```almide
local type InternalState = { data: String }
mod let INTERNAL_LIMIT = 100
```

## Package configuration

Package identity is declared in `almide.toml`, not in source files. There is no `module` or `package` declaration at the top of `.almd` files.

## Next steps

- [Functions](/docs/guide/functions/) — visibility modifiers on functions
- [Types & Values](/docs/guide/types/) — custom types and records
- [Generics](/docs/guide/generics/) — parameterized types and bounds
