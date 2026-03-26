---
title: Types & Values
description: Built-in types, collections, Option, Result, and custom types in Almide.
---

Almide is statically typed with full type inference. Every value has a known type at compile time. There are no implicit conversions, no null, and no truthiness.

## Primitive types

| Type | Description | Examples |
|------|-------------|---------|
| `Int` | 64-bit signed integer | `42`, `0xFF`, `1_000_000` |
| `Float` | 64-bit floating point | `3.14`, `1.0e-3` |
| `String` | UTF-8 text | `"hello"`, `'raw'`, `"""heredoc"""` |
| `Bool` | Boolean | `true`, `false` |
| `Unit` | No meaningful value | `()` |
| `Path` | File system path | Used by `fs` module functions |

Numeric literals support `_` as a visual separator: `1_000_000`, `0xFF_FF`.

## Strings

Double-quoted strings support interpolation and escape sequences:

```almide
let name = "world"
let msg = "hello ${name}, 1+1=${1 + 1}"    // "hello world, 1+1=2"
let escaped = "line1\nline2"
```

Single-quoted strings support escapes (`\'`, `\\`, `\n`, `\t`, `\r`) and interpolation:

```almide
let s = 'it\'s a string'
```

Raw strings have no escapes and no interpolation:

```almide
let pattern = r"^\d+\.\d+$"
```

Heredoc strings strip leading whitespace based on minimum indent:

```almide
let sql = """
  SELECT *
  FROM users
  WHERE active = true
"""
```

Raw heredocs (`r"""..."""`) disable both escapes and interpolation.

## Bool

Boolean values are `true` and `false`. Almide uses keyword operators for logic:

```almide
let a = true and false    // false
let b = true or false     // true
let c = not true          // false
```

There is no `!`, `&&`, or `||`. The compiler rejects them with helpful hints.

## Unit

`Unit` represents "no meaningful value." Its only value is `()`. Functions that perform side effects and return nothing use `Unit`:

```almide
effect fn log(msg: String) -> Result[Unit, String] = {
  println(msg)
  ok(())
}
```

## List

Lists are ordered, homogeneous collections:

```almide
let xs = [1, 2, 3]              // List[Int]
let empty: List[String] = []    // empty list
let first = xs[0]               // index access: 1
```

Mutable lists support index writes:

```almide
var items = ["a", "b", "c"]
items[1] = "B"                  // ["a", "B", "c"]
list.push(items, "d")           // ["a", "B", "c", "d"]
```

`+` concatenates lists:

```almide
let combined = [1, 2] + [3, 4]  // [1, 2, 3, 4]
```

See the [list stdlib](/docs/stdlib/list/) for full API.

## Map

Maps are key-value collections. Map literals use square brackets with `:` separating keys and values:

```almide
let m = ["name": "Alice", "role": "admin"]   // Map[String, String]
let empty: Map[String, Int] = [:]            // empty map
```

Map access returns `Option[V]`:

```almide
let name = m["name"]   // some("Alice")
let age = m["age"]     // none
```

Mutable maps support writes:

```almide
var scores: Map[String, Int] = [:]
scores["alice"] = 100
scores["bob"] = 85
```

See the [map stdlib](/docs/stdlib/map/) for full API.

## Set

Sets are unordered collections of unique values:

```almide
let s = set.from_list([1, 2, 3, 2])   // Set containing 1, 2, 3
set.contains(s, 2)                      // true
```

## Tuple

Tuples are fixed-size collections of heterogeneous types:

```almide
let pair = (1, "hello")          // (Int, String)
let triple = (true, 42, "ok")   // (Bool, Int, String)
```

Access tuple elements with `.0`, `.1`, etc.:

```almide
let x = pair.0    // 1
let y = pair.1    // "hello"
```

Tuples are commonly used for multiple return values and `for` loop destructuring:

```almide
for (i, item) in list.enumerate(items) {
  println("${int.to_string(i)}: ${item}")
}
```

## Option

`Option[T]` represents a value that may or may not exist. It replaces null:

```almide
let found = some(42)       // Option[Int] with a value
let missing = none         // Option[Int] with no value
```

Use `match` to handle both cases:

```almide
match list.get(xs, 0) {
  some(x) => println("found: ${int.to_string(x)}"),
  none => println("empty list"),
}
```

See [Error Handling](/docs/guide/error-handling/) for more on `Option`.

## Result

`Result[T, E]` represents a computation that can succeed or fail:

```almide
let success = ok(42)            // Result[Int, String]
let failure = err("not found")  // Result[Int, String]
```

Use `match` to handle both cases:

```almide
match int.parse(input) {
  ok(n) => println("parsed: ${int.to_string(n)}"),
  err(e) => println("error: ${e}"),
}
```

See [Error Handling](/docs/guide/error-handling/) for `effect fn` auto-propagation and `guard`.

## Record types

Records are named product types with labeled fields:

```almide
type User = {
  name: String,
  age: Int,
  active: Bool,
}
```

Create records with the same syntax:

```almide
let alice = { name: "Alice", age: 30, active: true }
```

Access fields with `.`:

```almide
println(alice.name)    // "Alice"
```

Update records with spread:

```almide
let inactive = { ...alice, active: false }
```

Field shorthand works when the variable name matches the field name:

```almide
let name = "Bob"
let age = 25
let bob = { name, age, active: true }
```

## Variant types

Variants (algebraic data types) represent values that can be one of several cases:

```almide
type Shape =
  | Circle(Float)
  | Rect{ width: Float, height: Float }
  | Point
```

Three case forms are supported:

| Form | Syntax | Example |
|------|--------|---------|
| Unit | `\| CaseName` | `\| Point` |
| Tuple | `\| CaseName(Types...)` | `\| Circle(Float)` |
| Record | `\| CaseName{ fields... }` | `\| Rect{ width: Float, height: Float }` |

Use `match` to destructure variants:

```almide
fn area(s: Shape) -> Float =
  match s {
    Circle(r) => 3.14159 * r ^ 2,
    Rect{ width, height } => width * height,
    Point => 0.0,
  }
```

Inline variants (without leading `|`) work for simple enumerations:

```almide
type Direction = North | South | East | West
```

## Generic types

Types can be parameterized with type variables using `[]`:

```almide
type Pair[A, B] = {
  first: A,
  second: B,
}

let p: Pair[Int, String] = { first: 1, second: "one" }
```

See [Generics](/docs/guide/generics/) for details.

## Type aliases

Type aliases create transparent alternative names for existing types:

```almide
type Score = Int
type Handler = (String) -> String
```

Aliases are interchangeable with their underlying type.

## Function types

Function types describe callable values:

```almide
type Predicate = Fn(Int) -> Bool
type Transform = Fn(String) -> String
```

Used with higher-order functions:

```almide
fn apply(f: Fn(Int) -> Int, x: Int) -> Int = f(x)
```

## deriving From

Variant types can derive `From` to enable automatic error conversion:

```almide
type AppError =
  | Io(IoError)
  | Parse(ParseError)
  deriving From
```

This generates `From` implementations for each case, enabling auto-conversion in `effect fn`. See [Error Handling](/docs/guide/error-handling/) for details.

## Built-in protocols

`Eq` and `Hash` are automatically derived by the compiler for all value types (except function types). No explicit `deriving` is needed:

```almide
let same = color_a == color_b    // just works
```

See [Protocols](/docs/guide/protocols/) for user-defined protocols.

## Next steps

- [Variables](/docs/guide/variables/) — binding values with `let` and `var`
- [Functions](/docs/guide/functions/) — defining and calling functions
- [Pattern Matching](/docs/guide/pattern-matching/) — destructuring values with `match`
