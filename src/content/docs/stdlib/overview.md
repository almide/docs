---
title: Standard Library Overview
description: Overview of all Almide standard library modules, categorized by function and import requirements.
---

The Almide standard library provides 22 modules covering data types, I/O, networking, and more. Modules are either auto-imported (available without an `import` statement) or require explicit import.

## Auto-Imported Modules

These modules are available in every Almide file without an `import` statement:

| Module | Description |
|---|---|
| [string](/stdlib/string/) | String manipulation: trim, split, join, replace, search |
| [list](/stdlib/list/) | List operations: map, filter, fold, sort, search |
| [map](/stdlib/map/) | Map (dictionary) operations: get, set, merge, iterate |
| [int](/stdlib/int/) | Integer conversion, parsing, bitwise operations |
| [float](/stdlib/float/) | Float conversion, rounding, math utilities |
| [option](/stdlib/option/) | Option[T] utilities: map, flat_map, unwrap_or |
| [result](/stdlib/result/) | Result[T, E] utilities: map, flat_map, unwrap_or |
| [math](/stdlib/math/) | Mathematical functions: trig, logarithms, constants |
| [set](/stdlib/set/) | Set operations: union, intersection, difference |
| value | Generic value type for JSON and dynamic data |

## Import-Required Modules

These modules must be explicitly imported with `import <module>`:

### I/O and System

| Module | Description | Effect |
|---|---|---|
| [fs](/stdlib/fs/) | File system: read, write, list directories | Yes |
| [io](/stdlib/io/) | Console I/O: read_line, print (no newline), read_all | Yes |
| env | Environment: args, env vars, timestamps, sleep | Yes |
| process | Process execution: exec, exit, stdin | Yes |

### Data Formats

| Module | Description | Effect |
|---|---|---|
| [json](/stdlib/json/) | JSON parsing, building, path-based access | No |
| [regex](/stdlib/regex/) | Regular expressions: match, find, replace, split | No |
| [datetime](/stdlib/datetime/) | Date/time: parse, format, arithmetic | Mixed |
| bytes | Binary data: encode, decode, slice, hex | No |
| random | Random number generation | Yes |

### Networking

| Module | Description | Effect |
|---|---|---|
| [http](/stdlib/http/) | HTTP client and server | Yes |

### Numeric / Scientific

| Module | Description | Effect |
|---|---|---|
| matrix | Matrix operations: create, multiply, transpose | No |

### Development

| Module | Description | Effect |
|---|---|---|
| log | Structured logging | Yes |
| testing | Test utilities | No |
| error | Error type utilities | No |

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

All I/O functions are `effect fn` and return `Result`:

```almd
import fs

effect fn read_config() -> Result[String, String] = {
  let text = fs.read_text("config.toml")
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
text.trim().split(",").map((s) => s.to_upper())

// Chaining with pipe:
text |> string.trim |> string.split(",")
```

## Naming Conventions

- **One name per operation**: `len` not `length`/`size`/`count`
- **`is_` prefix**: Boolean-returning functions (`is_empty`, `is_digit`)
- **`to_` prefix**: Type conversion (`to_string`, `to_int`)
- **`from_` prefix**: Construction from another type (`from_list`, `from_bytes`)
- **No synonyms**: The name listed in the docs is the only valid name
