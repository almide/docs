---
title: Error Handling
description: Result, Option, effect fn auto-propagation, guard, and deriving From for error conversion.
---

Almide has no exceptions. All errors are values, represented by `Result[T, E]` and `Option[T]`. The `effect fn` system automates error propagation, making error handling both safe and concise.

## Result

`Result[T, E]` represents a computation that can succeed with `T` or fail with `E`:

```almide
let success = ok(42)            // Result[Int, String]
let failure = err("not found")  // Result[Int, String]
```

Handle both cases with `match`:

```almide
match int.parse(input) {
  ok(n) => println("parsed: ${int.to_string(n)}"),
  err(e) => println("error: ${e}"),
}
```

The `result` module provides combinators:

```almide
let doubled = result.map(int.parse("42"), (n) => n * 2)
let fallback = result.unwrap_or(int.parse("bad"), 0)
let chained = result.and_then(int.parse("42"), (n) =>
  if n > 0 then ok(n) else err("must be positive")
)
```

## Option

`Option[T]` represents a value that may or may not exist:

```almide
let found = some(42)       // Option[Int]
let missing = none         // Option[Int]
```

Common operations:

```almide
let name = option.unwrap_or(map.get(config, "name"), "default")
let upper = option.map(map.get(config, "name"), (s) => string.to_upper(s))
let result = option.ok_or(map.get(config, "name"), "name is required")
```

## effect fn and auto-propagation

The key to ergonomic error handling in Almide is `effect fn`. Inside an `effect fn`, expressions returning `Result[T, E]` are automatically unwrapped:

```almide
effect fn load_config(path: String) -> Result[String, String] = {
  let text = fs.read_text(path)     // Result auto-unwrapped; error propagates
  let trimmed = string.trim(text)   // text is String, not Result
  ok(trimmed)
}
```

Without `effect fn`, you would need to manually match on every `Result`. The compiler inserts error propagation automatically.

The rule is simple: if any expression in an `effect fn` body evaluates to `err(e)`, the entire function immediately returns that error.

## guard

`guard` checks a precondition and exits early when the condition is false:

```almide
effect fn validate(age: Int) -> Result[Int, String] = {
  guard age >= 0 else err("age cannot be negative")
  guard age <= 150 else err("age seems unrealistic")
  ok(age)
}
```

`guard` is Almide's replacement for early `return`. There is no `return` keyword.

Guard with a block body for complex exit logic:

```almide
effect fn process(path: String) -> Result[Unit, String] = {
  guard fs.exists?(path) else {
    println("file not found, skipping")
    ok(())
  }
  let content = fs.read_text(path)
  println(content)
  ok(())
}
```

## Error types with deriving From

For applications with multiple error sources, define a variant error type with `deriving From`:

```almide
type AppError =
  | Io(IoError)
  | Parse(ParseError)
  deriving From
```

`deriving From` generates automatic conversions from each inner error type to the variant. This enables seamless error propagation across different error types:

```almide
effect fn load(path: String) -> Result[Config, AppError] = {
  let text = fs.read_text(path)       // IoError -> AppError::Io (automatic)
  let raw = json.parse(text)          // ParseError -> AppError::Parse (automatic)
  ok(parse_config(raw))
}
```

Without `deriving From`, you would need to manually wrap each error.

## Three-layer error strategy

| Layer | Mechanism | Use case |
|-------|-----------|----------|
| Normal failure | `Result[T, E]` | Parse, validate, I/O, lookup |
| Programmer error | `panic` | Unreachable code, invariant violations |
| Testing | `assert_eq`, `assert` | Test assertions |

Exceptions do not exist. There is no `throw` or `catch`.

## Patterns for error handling

### Match for branching

When you need to handle success and failure differently:

```almide
match int.parse(input) {
  ok(n) if n > 0 => process(n),
  ok(_) => err("must be positive"),
  err(e) => err("invalid input: ${e}"),
}
```

### Guard for preconditions

When you need to validate before proceeding:

```almide
effect fn create_user(name: String, age: Int) -> Result[User, String] = {
  guard string.len(name) > 0 else err("name is required")
  guard age >= 0 else err("age must be non-negative")
  ok({ name, age })
}
```

### unwrap_or for defaults

When a missing value has a sensible default:

```almide
let port = result.unwrap_or(int.parse(port_str), 8080)
let name = option.unwrap_or(map.get(env, "USER"), "anonymous")
```

### and_then for chaining

When each step can fail and depends on the previous:

```almide
let config = int.parse(port_str)
  |> result.and_then(_, (port) =>
    if port > 0 and port < 65536
    then ok(port)
    else err("port out of range")
  )
```

## Next steps

- [Functions](/docs/guide/functions/) — effect fn syntax and visibility
- [Pattern Matching](/docs/guide/pattern-matching/) — matching on Result and Option
- [Types & Values](/docs/guide/types/) — Result, Option, and custom error types
