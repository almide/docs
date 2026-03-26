---
title: Control Flow
description: if-then-else, for-in loops, while loops, guard, break, and continue in Almide.
---

Almide has a small set of control flow constructs. `if` and `match` are expressions that return values. `for` and `while` are statements that return `Unit`.

## if-then-else

`if` is an expression. Both branches must have the same type:

```almide
let label = if score >= 90 then "A" else "B"
```

Chaining:

```almide
let grade = if score >= 90 then "A"
  else if score >= 80 then "B"
  else if score >= 70 then "C"
  else "F"
```

`if` without `else` returns `Unit` and is used for side effects only:

```almide
if verbose then println("debug info")
```

The condition must be `Bool`. There is no truthiness -- `if 1` or `if "hello"` are compile errors.

Boolean operators use words, not symbols:

```almide
if x > 0 and x < 100 then "in range" else "out of range"
if not found or expired then "unavailable" else "ok"
```

## for-in loops

`for` iterates over lists and ranges:

```almide
let names = ["Alice", "Bob", "Charlie"]
for name in names {
  println(name)
}
```

### Ranges

```almide
for i in 0..5 {                  // 0, 1, 2, 3, 4 (exclusive end)
  println(int.to_string(i))
}

for i in 1..=5 {                 // 1, 2, 3, 4, 5 (inclusive end)
  println(int.to_string(i))
}
```

Ranges in `for` loops are optimized: no list is allocated.

### Destructuring in for

Destructure tuples directly in the loop variable:

```almide
for (key, value) in map.entries(config) {
  println("${key} = ${value}")
}

for (i, item) in list.enumerate(items) {
  println("${int.to_string(i)}: ${item}")
}
```

Use `_` to ignore a component:

```almide
for (_, value) in map.entries(config) {
  println(value)
}
```

### Iterating maps

Iterating a map directly yields keys:

```almide
for key in m {
  println(key)
}
```

Use `map.entries(m)` to iterate key-value pairs.

## while loops

`while` loops repeat while a condition holds:

```almide
var i = 0
while i < 10 {
  println(int.to_string(i))
  i = i + 1
}
```

The condition must be `Bool`. The loop body returns `Unit`.

## break and continue

`break` exits a loop early. `continue` skips to the next iteration:

```almide
var i = 0
while i < 100 {
  i = i + 1
  if i % 2 == 0 then continue
  if i > 10 then break
  println(int.to_string(i))
}
```

These work in both `for` and `while` loops.

## guard

`guard` checks a precondition and exits early when the condition is false:

```almide
effect fn validate(x: Int) -> Result[Int, String] = {
  guard x > 0 else err("must be positive")
  guard x < 1000 else err("too large")
  ok(x * 2)
}
```

The `else` branch must return the enclosing function's return type.

Guard with a block body:

```almide
guard not fs.exists?(path) else {
  println("already exists")
  ok(())
}
```

`guard` is the primary way to do early returns. There is no `return` keyword in Almide.

See [Error Handling](/docs/guide/error-handling/) for more on `guard` with `Result`.

## Operators

### Comparison

| Operator | Meaning |
|----------|---------|
| `==` | Deep equality |
| `!=` | Deep inequality |
| `<` | Less than |
| `<=` | Less than or equal |
| `>` | Greater than |
| `>=` | Greater than or equal |

Comparison operators are non-associative: `a < b < c` is a compile error. Use `a < b and b < c`.

### Arithmetic

| Operator | Meaning |
|----------|---------|
| `+` | Addition, or string/list concatenation |
| `-` | Subtraction |
| `*` | Multiplication |
| `/` | Division |
| `%` | Remainder |
| `^` | Exponentiation (right-associative) |

`^` is power, not XOR. `**` is accepted as an alias for `^`. For bitwise XOR, use `int.bxor(a, b)`.

### Boolean

| Operator | Meaning |
|----------|---------|
| `and` | Logical AND (short-circuit) |
| `or` | Logical OR (short-circuit) |
| `not` | Logical NOT (prefix) |

`&&`, `||`, and `!` are rejected by the compiler with hints to use `and`, `or`, and `not`.

### Precedence (high to low)

| Level | Operators |
|-------|-----------|
| Highest | `.` `()` `[]` |
| | `not` `-` (unary) |
| | `^` (power) |
| | `*` `/` `%` |
| | `+` `-` |
| | `==` `!=` `<` `>` `<=` `>=` |
| | `and` |
| | `or` |
| Lowest | `\|>` (pipe) |

## Next steps

- [Pattern Matching](/docs/guide/pattern-matching/) — match expressions and pattern syntax
- [Error Handling](/docs/guide/error-handling/) — guard with Result, auto-propagation
- [Functions](/docs/guide/functions/) — function definitions and lambdas
