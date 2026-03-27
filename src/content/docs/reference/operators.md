---
title: Operators
description: Complete operator precedence table and reference for the Almide programming language.
---

## Precedence Table

Operators are listed from highest precedence (binds tightest) to lowest.

| Precedence | Operators | Associativity | Description |
|:---:|---|---|---|
| 1 | `. ()` `[]` `!` `??` `?` | Left | Member access, call, index, unwrap ops |
| 2 | `not` `-` (unary) | Right | Boolean negation, numeric negation |
| 3 | `^` | Right | Exponentiation (power) |
| 4 | `*` `/` `%` | Left | Multiplication, division, modulo |
| 5 | `+` `-` `++` | Left | Addition/concatenation, subtraction, concat (legacy) |
| 6 | `..` `..=` | None | Exclusive range, inclusive range |
| 7 | `==` `!=` `<` `>` `<=` `>=` | None | Comparison (non-associative) |
| 8 | `and` | Left | Logical AND (short-circuit) |
| 9 | `or` | Left | Logical OR (short-circuit) |
| 10 | `\|>` `>>` | Left | Pipe, function composition |

## Detailed Reference

### Member Access, Calls, and Unwrap (`. ()` `[]` `!` `??` `?`)

```almd
user.name                      // field access
string.len(s)                  // module function call
xs[0]                          // index read
xs[i] = value                  // index write (var only)
```

#### Unwrap operators

Three postfix operators for unwrapping `Result` and `Option` values:

```almd
fs.read_text(path)!            // unwrap or propagate error (effect fn only)
int.parse(s) ?? 0              // unwrap with fallback value
int.parse(s)?                  // convert Result to Option (discard error)
```

| Operator | On Result | On Option | Valid in |
|----------|-----------|-----------|----------|
| `expr!` | `ok(v)` -> `v`, `err(e)` -> propagate | `some(v)` -> `v`, `none` -> propagate | `effect fn` only |
| `expr ?? fallback` | `ok(v)` -> `v`, `err(_)` -> `fallback` | `some(v)` -> `v`, `none` -> `fallback` | Anywhere |
| `expr?` | `ok(v)` -> `some(v)`, `err(_)` -> `none` | Passthrough | Anywhere |

See [Error Handling](/docs/guide/error-handling/) for detailed examples.

### Unary Operators (`not`, `-`)

```almd
not active                     // boolean negation
-x                             // numeric negation
```

There is no boolean `!` operator. Use `not` for boolean negation. The postfix `!` is the unwrap/propagate operator.

### Exponentiation (`^`)

```almd
2 ^ 10                         // => 1024
3.0 ^ 0.5                     // => 1.732...
2 ** 3                         // => 8 (** is an alias for ^)
```

Right-associative: `2 ^ 3 ^ 2` is evaluated as `2 ^ (3 ^ 2)` = `2 ^ 9` = 512.

### Arithmetic (`*` `/` `%` `+` `-`)

```almd
10 * 3                         // => 30
10 / 3                         // => 3 (integer division)
10 % 3                         // => 1 (modulo)
5 + 3                          // => 8
5 - 3                          // => 2
```

### Concatenation (`+`)

The `+` operator is overloaded for strings and lists:

```almd
"hello" + " " + "world"       // => "hello world"
[1, 2] + [3, 4]               // => [1, 2, 3, 4]
```

### Range (`..` `..=`)

```almd
0..5                           // [0, 1, 2, 3, 4] (exclusive end)
1..=5                          // [1, 2, 3, 4, 5] (inclusive end)
for i in 0..n { ... }          // optimized: no list allocation
```

Ranges are non-associative -- you cannot chain them.

### Comparison (`==` `!=` `<` `>` `<=` `>=`)

```almd
x == y                         // deep equality
x != y                         // not equal
a < b                          // less than
a > b                          // greater than
a <= b                         // less than or equal
a >= b                         // greater than or equal
```

Comparison operators are **non-associative**: `a < b < c` is a compile error. Write `a < b and b < c` instead.

Deep equality works on all value types (records, variants, lists, maps). Function types do not support `==`.

### Logical (`and` `or`)

```almd
a > 0 and b > 0               // short-circuit AND
x == 0 or y == 0              // short-circuit OR
```

There are no `&&` or `||` operators. Use `and` and `or`.

### Pipe (`|>`)

```almd
text |> string.trim |> string.split(",")

// with placeholder:
xs |> filter(_, (x) => x > 0) // _ = placeholder for piped value
```

The pipe operator passes the left-hand value as the first argument to the right-hand function. Use `_` as a placeholder to control argument position.

### Function Composition (`>>`)

```almd
let transform = string.trim >> string.to_upper
transform("  hello  ")        // => "HELLO"
```

Composes two functions left-to-right: `(f >> g)(x)` is equivalent to `g(f(x))`.

## Special Operators

### Spread (`...`)

Used in record expressions to spread fields from another record:

```almd
let updated = { ...base, name: "bob" }
```

### Assignment (`=`)

```almd
var x = 1
x = x + 1                     // reassign (var only)
m["key"] = value               // map index write (var only)
xs[i] = value                  // list index write (var only)
```

### Arrows (`->` `=>`)

- `->` separates parameter types from return type in function signatures
- `=>` separates patterns/parameters from bodies in match arms and lambdas

```almd
fn add(a: Int, b: Int) -> Int = a + b
(x) => x + 1
match color { Red => "red", Blue => "blue" }
```

## Bitwise Operations

Bitwise operations are provided as stdlib functions, not operators:

```almd
int.band(a, b)                 // bitwise AND
int.bor(a, b)                  // bitwise OR
int.bxor(a, b)                 // bitwise XOR
int.bnot(a)                    // bitwise NOT
int.bshl(a, n)                 // shift left
int.bshr(a, n)                 // shift right
```
