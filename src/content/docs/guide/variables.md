---
title: Variables
description: Immutable bindings with let, mutable bindings with var, destructuring, and type annotations.
---

Almide has two ways to bind values: `let` for immutable bindings and `var` for mutable bindings.

## let (immutable)

`let` creates an immutable binding. Once bound, the value cannot be changed:

```almide
let name = "Alice"
let age = 30
let active = true
```

Attempting to reassign a `let` binding is a compile error:

```almide
let x = 1
x = 2    // Compile error: cannot reassign immutable binding
```

## var (mutable)

`var` creates a mutable binding that can be reassigned:

```almide
var count = 0
count = count + 1
count = count + 1
println(int.to_string(count))    // "2"
```

Mutable bindings also enable in-place operations on collections:

```almide
var items = ["a", "b", "c"]
items[0] = "A"                   // index write
list.push(items, "d")            // push to end

var scores: Map[String, Int] = [:]
scores["alice"] = 100            // map write
```

Use `var` sparingly. Prefer `let` unless mutation is necessary.

## Type annotations

Type annotations are optional when the type can be inferred:

```almide
let x = 42              // inferred as Int
let y: Int = 42         // explicit annotation
```

Annotations are required when the type cannot be inferred, such as empty collections:

```almide
let xs: List[String] = []
let m: Map[String, Int] = [:]
```

The annotation syntax is `name: Type`:

```almide
let pair: (Int, String) = (1, "one")
let f: Fn(Int) -> Int = (x) => x + 1
```

## Destructuring

Record destructuring extracts fields into individual bindings:

```almide
type User = { name: String, age: Int }

let user = { name: "Alice", age: 30 }
let { name, age } = user
println(name)    // "Alice"
```

Destructuring rules:

- Only one level deep (no nested destructuring)
- No renaming (field names become variable names)
- `let` only (no `var` destructuring)

## Top-level let (constants)

`let` at the top level creates module-scope constants:

```almide
let PI = 3.14159265358979323846
let MAX_RETRIES = 3
let GREETING = "Hello, world"
```

By convention, top-level constants use `UPPER_CASE` names. They are evaluated at compile time when possible.

## Shadowing

A new `let` binding can shadow an existing binding in the same scope:

```almide
let x = 1
let x = x + 1    // shadows the previous x
println(int.to_string(x))    // "2"
```

Shadowing creates a new binding rather than mutating the existing one.

## Discard with _

Use `_` to discard a value you don't need:

```almide
let _ = some_function()    // call for side effect, discard result
```

In `for` loops, `_` ignores the loop variable:

```almide
for _ in 0..5 {
  println("tick")
}
```

In tuple destructuring within `for`:

```almide
for (_, v) in map.entries(config) {
  println(v)
}
```

## Next steps

- [Types & Values](/docs/guide/types/) — the full type system
- [Functions](/docs/guide/functions/) — defining and calling functions
- [Control Flow](/docs/guide/control-flow/) — if, for, while, guard
