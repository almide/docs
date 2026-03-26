---
title: Pattern Matching
description: Exhaustive match expressions, pattern syntax, guards, and destructuring in Almide.
---

Pattern matching with `match` is the primary way to inspect and destructure values in Almide. Every `match` must be exhaustive -- the compiler verifies that all possible cases are covered.

## Basic match

```almide
match direction {
  North => "up",
  South => "down",
  East => "right",
  West => "left",
}
```

`match` is an expression: it returns a value. All arms must produce the same type.

Arms are separated by commas. Each arm has the form `Pattern => expr`.

## Pattern types

### Wildcard

`_` matches any value without binding it:

```almide
match status {
  200 => "ok",
  404 => "not found",
  _ => "other",
}
```

### Identifier (binding)

A bare name binds the matched value to a variable:

```almide
match list.first(items) {
  some(x) => println("first: ${x}"),
  none => println("empty"),
}
```

### Literal

Match against specific values:

```almide
match command {
  "start" => run(),
  "stop" => halt(),
  "status" => report(),
  _ => err("unknown command"),
}
```

Supports `Int`, `Float`, `String`, and `Bool` literals. Negative literals are supported:

```almide
match n {
  0 => "zero",
  1 => "one",
  -1 => "negative one",
  _ => "other",
}
```

### Option patterns

`some(pattern)` and `none` destructure `Option[T]`:

```almide
match map.get(config, "port") {
  some(port) => println("port: ${port}"),
  none => println("using default port"),
}
```

### Result patterns

`ok(pattern)` and `err(pattern)` destructure `Result[T, E]`:

```almide
match int.parse(input) {
  ok(n) => n * 2,
  err(e) => {
    println("parse error: ${e}")
    0
  },
}
```

### Constructor patterns

Destructure variant type cases:

```almide
type Shape =
  | Circle(Float)
  | Rect{ width: Float, height: Float }
  | Point

fn describe(s: Shape) -> String =
  match s {
    Circle(r) => "circle with radius ${float.to_string(r)}",
    Rect{ width, height } => "${float.to_string(width)}x${float.to_string(height)}",
    Point => "point",
  }
```

Unit constructors match without parentheses. Tuple constructors use `CaseName(patterns...)`. Record constructors use `CaseName{ fields... }`.

### Record patterns

Destructure record variant cases with field names:

```almide
match shape {
  Rect{ width, height } => width * height,
  Rect{ width, .. } => width,    // .. ignores remaining fields
  _ => 0.0,
}
```

The `..` syntax allows partial matching, ignoring fields you don't need.

### Tuple patterns

Destructure tuples directly:

```almide
match point {
  (0, 0) => "origin",
  (x, 0) => "on x-axis",
  (0, y) => "on y-axis",
  (x, y) => "at (${int.to_string(x)}, ${int.to_string(y)})",
}
```

## Guards

Add `if condition` after a pattern for additional constraints:

```almide
match n {
  x if x > 0 => "positive",
  x if x < 0 => "negative",
  _ => "zero",
}
```

When a guard is false, the next arm is tried:

```almide
fn classify(score: Int) -> String =
  match score {
    n if n >= 90 => "A",
    n if n >= 80 => "B",
    n if n >= 70 => "C",
    _ => "F",
  }
```

Guards can use any boolean expression:

```almide
match item {
  some(s) if string.len(s) > 0 => process(s),
  some(_) => err("empty string"),
  none => err("missing"),
}
```

## Exhaustiveness

The compiler ensures every possible value is covered. Missing cases are compile errors:

```almide
type Color = Red | Green | Blue

match color {
  Red => "red",
  Green => "green",
  // Compile error: non-exhaustive match, missing: Blue
}
```

Use `_` as a catch-all when you don't need to handle every case individually:

```almide
match color {
  Red => "red",
  _ => "not red",
}
```

## Pipe into match

The pipe operator can feed a value directly into `match`:

```almide
list.get(args, 1) |> match {
  some(cmd) => cmd,
  none => "help",
}
```

## Nested patterns

Patterns can be nested to match complex structures:

```almide
match result {
  ok(some(value)) => use(value),
  ok(none) => default(),
  err(e) => handle(e),
}
```

## Next steps

- [Types & Values](/docs/guide/types/) — variant types and records
- [Error Handling](/docs/guide/error-handling/) — matching on Result and Option
- [Control Flow](/docs/guide/control-flow/) — if-then-else and guard
