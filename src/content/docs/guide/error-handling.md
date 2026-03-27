---
title: Error Handling
description: Result, Option, unwrap operators (!, ??, ?), effect fn, and guard for safe error handling.
---

Almide has no exceptions. All errors are values, represented by `Result[T, E]` and `Option[T]`. Three postfix operators -- `!`, `??`, and `?` -- provide concise, explicit control over unwrapping.

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
let chained = result.flat_map(int.parse("42"), (n) =>
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
let result = option.to_result(map.get(config, "name"), "name is required")
```

## Unwrap operators: `!`, `??`, `?`

Almide provides three postfix operators for unwrapping `Result` and `Option` values. These are the primary way to work with fallible values.

### `!` — propagate error

`expr!` unwraps a `Result` or `Option`. If the value is `err(e)` or `none`, the enclosing `effect fn` immediately returns the error. Only valid inside `effect fn`.

```almide
effect fn load_config(path: String) -> Result[String, String] = {
  let text = fs.read_text(path)!      // unwrap or propagate error
  let trimmed = string.trim(text)
  ok(trimmed)
}
```

On `Option`:

```almide
effect fn first_name(users: List[User]) -> Result[String, String] = {
  let user = list.first(users)!       // none becomes err, propagated
  ok(user.name)
}
```

### `??` — fallback value

`expr ?? fallback` unwraps with a default. If the value is `err(_)` or `none`, the fallback is used instead. Valid anywhere (not limited to `effect fn`).

```almide
let port = int.parse(port_str) ?? 8080
let name = map.get(env, "USER") ?? "anonymous"
```

### `?` — convert to Option

`expr?` converts a `Result[T, E]` to `Option[T]`, discarding the error. On `Option`, it is a passthrough. Valid anywhere.

```almide
let parsed = int.parse(input)?        // Result[Int, String] -> Option[Int]
let found = map.get(config, "key")?   // Option[String] -> Option[String] (passthrough)
```

### Summary table

| Operator | On Result | On Option | Valid in |
|----------|-----------|-----------|----------|
| `expr!` | `ok(v)` -> `v`, `err(e)` -> propagate | `some(v)` -> `v`, `none` -> propagate | `effect fn` only |
| `expr ?? fallback` | `ok(v)` -> `v`, `err(_)` -> `fallback` | `some(v)` -> `v`, `none` -> `fallback` | Anywhere |
| `expr?` | `ok(v)` -> `some(v)`, `err(_)` -> `none` | Passthrough | Anywhere |

## effect fn

Functions with side effects use `effect fn`. The `!` operator is the standard way to propagate errors inside an `effect fn`:

```almide
effect fn process(path: String) -> Result[String, String] = {
  let text = fs.read_text(path)!          // propagate on error
  let data = json.parse(text)!            // propagate on error
  ok(data)
}
```

Without `!`, you would need to manually match on every `Result`.

## Error type conversion with map_err

When different functions return different error types, use `result.map_err` combined with `!` to convert errors:

```almide
type AppError =
  | Io(String)
  | Parse(String)

effect fn load(path: String) -> Result[Config, AppError] = {
  let text = fs.read_text(path)
    |> result.map_err(_, (e) => Io(e))!
  let raw = json.parse(text)
    |> result.map_err(_, (e) => Parse(e))!
  ok(parse_config(raw))
}
```

This pattern replaces the former `From` convention with explicit, visible error conversion.

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
  let content = fs.read_text(path)!
  println(content)
  ok(())
}
```

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

### `??` for defaults

When a missing value has a sensible default:

```almide
let port = int.parse(port_str) ?? 8080
let name = map.get(env, "USER") ?? "anonymous"
```

### flat_map for chaining

When each step can fail and depends on the previous:

```almide
let config = int.parse(port_str)
  |> result.flat_map(_, (port) =>
    if port > 0 and port < 65536
    then ok(port)
    else err("port out of range")
  )
```

## Next steps

- [Functions](/docs/guide/functions/) — effect fn syntax and visibility
- [Pattern Matching](/docs/guide/pattern-matching/) — matching on Result and Option
- [Types & Values](/docs/guide/types/) — Result, Option, and custom error types
