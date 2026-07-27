---
title: Functions
description: Pure functions, effect functions, parameters, default args, named args, lambdas, and visibility.
---

Functions are the core building block in Almide. Every function has explicit parameter types and a return type. The body is a single expression after `=`.

## Basic syntax

```almide
fn add(a: Int, b: Int) -> Int = a + b

fn greet(name: String) -> String = "Hello, ${name}!"
```

Key rules:

- Parameter types are required
- Return type is required
- The body follows `=` (not `{}`)
- The last expression is the return value (no `return` keyword)

## Multi-statement bodies

Use a block `{ }` for multiple statements. The last expression in the block is the return value:

```almide
fn classify(n: Int) -> String = {
  let abs_n = int.abs(n)
  let label = if abs_n > 100 then "large" else "small"
  "${label}: ${int.to_string(n)}"
}
```

## effect fn

Functions with side effects (I/O, network, randomness) must be marked `effect fn`:

```almide
import fs

effect fn save(path: String, content: String) -> Result[Unit, String] = {
  fs.write(path, content)!
  ok(())
}
```

The `effect` modifier enforces a strict boundary:

- Calling an `effect fn` from a non-effect function is a **compile error**
- `effect fn` typically returns `Result[T, E]`
- Use the `!` operator to unwrap `Result` values and propagate errors explicitly

```almide
fn pure() -> String =
  fs.read_text("file.txt")    // Compile error: cannot call effect fn

effect fn safe() -> Result[String, String] =
  fs.read_text("file.txt")    // OK: effect fn calling effect fn
```

See [Error Handling](/docs/guide/error-handling/) for the `!`, `??`, and `?` operators.

## Parameters

### Required parameters

All parameters require type annotations:

```almide
fn distance(x1: Float, y1: Float, x2: Float, y2: Float) -> Float =
  float.sqrt((x2 - x1) ^ 2 + (y2 - y1) ^ 2)
```

### Default arguments

Parameters can have default values. All parameters after the first default must also have defaults:

```almide
fn connect(host: String, port: Int = 8080, secure: Bool = false) -> String =
  "${host}:${int.to_string(port)}"
```

### Named arguments

Arguments can be named at the call site, useful with default parameters:

```almide
connect("localhost")
connect("localhost", port: 443, secure: true)
connect(host: "localhost", secure: true)    // skip port, use default
```

Named arguments after positional ones are allowed. Positional arguments after named ones are not:

```almide
connect("localhost", secure: true)      // OK
connect(secure: true, "localhost")      // Compile error
```

### Mutable parameters

`mut` on a parameter passes it by mutable reference: an assignment inside the
function is visible to the caller after the call returns, in place — there's
no return value carrying the new state back.

```almide
fn incr(mut x: Int) -> Unit = { x = x + 1 }

fn main() -> Unit = {
  var n = 5
  incr(n)
  println(int.to_string(n))   // 6
}
```

The caller must pass a `var` binding — a `let` binding or a temporary
expression is rejected (E007), since there's nothing to write the mutation
back into. `mut` can appear on any parameter, not just the first. This is how
in-place stdlib operations are written (`list.push`, `list.pop`,
`list.clear`, …) — an ordinary parameter marked `mut`, not a hidden receiver
convention.

## Predicate functions

Predicates are named with an `is_` prefix, matching the standard library
(`string.is_empty`, `list.is_empty`, `string.is_digit`):

```almide
fn is_empty(xs: List[Int]) -> Bool = list.len(xs) == 0
fn is_positive(n: Int) -> Bool = n > 0
```

There is no `?` suffix in identifiers — `fn empty?(…)` is a syntax error.
(`?` is an operator, used postfix on a `Result` to turn it into an `Option`.)

## Lambdas

Lambdas (anonymous functions) use the `(params) => expr` syntax:

```almide
let double = (x: Int) => x * 2
```

Type annotations on lambda parameters are optional when inferrable:

```almide
let xs = [1, 2, 3]
let doubled = list.map(xs, (x) => x * 2)
let evens = list.filter(xs, (x) => x % 2 == 0)
```

Multi-parameter lambdas:

```almide
let add = (a: Int, b: Int) => a + b
list.fold([1, 2, 3], 0, (acc, x) => acc + x)    // 6
```

Use `_` for unused lambda parameters:

```almide
list.map(xs, (_) => 0)    // replace every element with 0
```

There is only one lambda syntax. No shorthand forms like `{x -> x}` or `x => x`.

## Visibility

Three visibility levels control access to functions:

| Modifier | Scope | Rust equivalent |
|----------|-------|-----------------|
| *(none)* | Public (default) | `pub` |
| `mod` | Same project only | `pub(crate)` |
| `local` | Same file only | (private) |

```almide
fn public_api() -> String = "anyone can call this"
mod fn internal_helper() -> String = "project-internal"
local fn file_private() -> String = "only this file"
```

Visibility applies to `fn`, `type`, and `let` declarations:

```almide
local type Internal = { data: String }
mod let THRESHOLD = 100
```

## Modifier order

When combining modifiers, the order is: `[local|mod]? effect? fn`

```almide
mod effect fn internal_io() -> Result[Unit, String] = {
  println("internal")
  ok(())
}

local effect fn private_io() -> Result[Unit, String] = {
  println("private")
  ok(())
}
```

## Holes and todo

Use `_` (hole) or `todo(msg)` as placeholder implementations:

```almide
fn parse(text: String) -> Ast = _                       // type-checked stub
fn optimize(ast: Ast) -> Ast = todo("implement later")  // todo with message
```

The compiler accepts any expected type for holes and reports the expected type, available variables, and suggestions.

## UFCS (Uniform Function Call Syntax)

`f(x, y)` and `x.f(y)` are equivalent. The compiler resolves automatically:

```almide
string.trim(text)       // canonical module.function form
text.trim()             // UFCS dot-call form (equivalent)

string.split(text, ",")
text.split(",")         // equivalent
```

## Pipe operator

The pipe operator `|>` passes a value as the first argument to the next function:

```almide
text |> string.trim |> string.split(",")
// equivalent to: string.split(string.trim(text), ",")
```

The piped value always becomes the first argument; there is no placeholder for
other positions. Call the function directly when it does not fit:

```almide
list.filter(xs, (x) => x > 0)
```

Pipe into `match`:

```almide
list.get(args, 1) |> match {
  some(cmd) => cmd,
  none => "default",
}
```

## Next steps

- [Control Flow](/docs/guide/control-flow/) — if, for, while, guard
- [Error Handling](/docs/guide/error-handling/) — Result, Option, unwrap operators, effect fn
- [Modules & Imports](/docs/guide/modules/) — organizing code across files
