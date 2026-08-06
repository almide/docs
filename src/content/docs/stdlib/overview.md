---
title: Standard Library Overview
description: Overview of all Almide standard library modules, categorized by function and import requirements.
---

The Almide standard library covers data types, I/O, networking, numerics and
more. Modules are either auto-imported (usable with no `import` statement at
all) or require an explicit `import`.

The split is not stylistic: everything that can touch the outside world —
files, the network, the clock as a source of entropy, the process environment —
is import-required, so a file's imports are an honest summary of what it can
reach.

## Auto-imported modules

Available in every file with no `import` statement. Writing `import string` is
redundant.

| Module | Description |
|---|---|
| [string](/docs/stdlib/string/) | String manipulation: trim, split, join, replace, search |
| [list](/docs/stdlib/list/) | List operations: map, filter, fold, sort, search |
| [map](/docs/stdlib/map/) | Map (dictionary) operations: get, set, merge, iterate |
| [set](/docs/stdlib/set/) | Set operations: union, intersection, difference |
| [int](/docs/stdlib/int/) | Integer conversion, parsing, bitwise operations |
| [float](/docs/stdlib/float/) | Float conversion, rounding, math utilities |
| [math](/docs/stdlib/math/) | Mathematical functions: trig, logarithms, constants |
| [option](/docs/stdlib/option/) | `Option[T]` utilities: map, flat_map, unwrap_or |
| [result](/docs/stdlib/result/) | `Result[T, E]` utilities: map, flat_map, unwrap_or |
| [value](/docs/stdlib/value/) | Generic dynamic value type shared with JSON |
| [error](/docs/stdlib/error/) | Error construction and chaining |
| [datetime](/docs/stdlib/datetime/) | Date/time: parse, format, arithmetic |
| [bytes](/docs/stdlib/bytes/) | Binary data: read/write, slice, encode, decode |
| [matrix](/docs/stdlib/matrix/) | Matrix operations: create, multiply, transpose |
| [sized numeric types](/docs/guide/numeric-types/) | `int8`…`int32`, `uint8`…`uint64`, `float32` |

## Import-required modules

These need `import <module>`:

### I/O and system

| Module | Description | Effect |
|---|---|---|
| [fs](/docs/stdlib/fs/) | File system: read, write, list directories | Yes |
| [io](/docs/stdlib/io/) | Console I/O: read_line, print (no newline), read_all | Yes |
| [env](/docs/stdlib/env/) | Environment: args, env vars, timestamps, sleep | Yes |
| [process](/docs/stdlib/process/) | Process execution, env vars, spawn/kill, signals | Yes |
| [path](/docs/stdlib/path/) | Path manipulation: join, dirname, basename, extension | No |
| [args](/docs/stdlib/args/) | Command-line flag and option parsing | No |

### Data formats

| Module | Description | Effect |
|---|---|---|
| [json](/docs/stdlib/json/) | JSON parsing, building, path-based access | No |
| [regex](/docs/stdlib/regex/) | Regular expressions: match, find, replace, split | No |
| [base64](/docs/stdlib/base64-hex/) | Base64 encoding and decoding | No |
| [hex](/docs/stdlib/base64-hex/) | Hexadecimal encoding and decoding | No |

### Networking

| Module | Description | Effect |
|---|---|---|
| [http](/docs/stdlib/http/) | HTTP client and server | Yes |

### Development

| Module | Description | Effect |
|---|---|---|
| [testing](/docs/stdlib/testing/) | Test assertions: assert_eq, assert_approx, assert_throws | No |
| [random](/docs/stdlib/random/) | Random number generation | Yes |

## Module Categories

### Data Type Modules

Each built-in data type has a corresponding module for operations:

```almd
string.len("hello")                    // => 5
list.map([1, 2, 3], (x) => x * 2)     // => [2, 4, 6]
map.get(m, "key")                      // => Option[V]
int.to_string(42)                      // => "42"
float.round(3.7)                       // => 4.0
```

### Container Modules

```almd
option.unwrap_or(some(42), 0)          // => 42
result.map(ok(1), (x) => x + 1)       // => ok(2)
set.union(a, b)                        // set union
```

### I/O Modules

Most I/O is `effect fn` returning `Result`, but not all of it — `fs.exists`
and its siblings are effectful yet return `Bool`, and `fs.temp_dir`, `env.os`,
`process.args` and several `io` writers are pure. Check the per-module page
before assuming:

```almd
import fs

effect fn read_config() -> Result[String, String] = {
  let text = fs.read_text("config.toml")!
  ok(text)
}
```

### Functional Operations

Many modules share a consistent vocabulary for higher-order operations:

| Function | Available on |
|---|---|
| `map` | list, map, set, option, result |
| `filter` | list, map, set, option |
| `fold` | list, map, set |
| `each` | list, map, set |
| `any` / `all` | list, map, set |
| `find` | list, map |
| `contains` | list, map, set |
| `len` | list, map, set, string |
| `is_empty` | list, map, set, string |

## UFCS (Universal Function Call Syntax)

All stdlib functions can be called in either prefix or method style:

```almd
// These are equivalent:
string.len("hello")
"hello".len()

// Chaining with method syntax:
text.trim().split(",").map((s: String) => s.to_upper())

// Chaining with pipe:
text |> string.trim |> string.split(",")
```

## Naming Conventions

- **One name per operation**: `len` not `length`/`size`/`count`
- **`is_` prefix**: Boolean-returning functions (`is_empty`, `is_digit`)
- **`to_` prefix**: Type conversion (`to_string`, `to_int`)
- **`from_` prefix**: Construction from another type (`from_list`, `from_bytes`)
- **One canonical name**: the name listed here is the one to use (a few aliases exist for historical reasons, e.g. `string.length`)
