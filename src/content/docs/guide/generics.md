---
title: Generics
description: Type parameters, generic functions, generic types, and bounds in Almide.
---

Almide uses `[]` for generics, not `<>`. This eliminates ambiguity with comparison operators and makes parsing unambiguous for both compilers and LLMs.

## Generic functions

Declare type parameters in `[]` after the function name:

```almide
fn identity[T](x: T) -> T = x

fn first[T](xs: List[T]) -> Option[T] = list.first(xs)

fn pair[A, B](a: A, b: B) -> (A, B) = (a, b)
```

Type arguments are inferred at the call site:

```almide
let n = identity(42)           // T = Int
let s = identity("hello")     // T = String
let p = pair(1, "one")        // A = Int, B = String
```

## Generic types

Types can be parameterized:

```almide
type Pair[A, B] = {
  first: A,
  second: B,
}

type Tree[T] =
  | Leaf(T)
  | Node(Tree[T], Tree[T])
```

Use with concrete types:

```almide
let p: Pair[Int, String] = { first: 1, second: "one" }
let tree: Tree[Int] = Node(Leaf(1), Leaf(2))
```

## Built-in generic types

The standard library uses generics extensively:

| Type | Description |
|------|-------------|
| `List[T]` | Ordered homogeneous collection |
| `Map[K, V]` | Key-value collection |
| `Set[T]` | Unordered unique collection |
| `Option[T]` | Optional value (`some(x)` or `none`) |
| `Result[T, E]` | Success or failure (`ok(x)` or `err(e)`) |

Nested generics:

```almide
let data: Map[String, List[Int]] = ["scores": [90, 85, 92]]
let result: Result[List[String], String] = ok(["a", "b"])
```

## Bounds

Type parameters can be constrained with protocol bounds using `:`:

```almide
fn show[T: Repr](item: T) -> String = item.repr()

fn process[T: Serializable](item: T) -> String = item.serialize()
```

Multiple bounds are specified by listing protocols:

```almide
fn compare[T: Ord](a: T, b: T) -> Bool = a < b
```

See [Protocols](/docs/guide/protocols/) for defining custom protocols that can be used as bounds.

## Type application syntax

Almide always uses `[]` for type arguments:

```almide
List[Int]                        // list of integers
Map[String, List[Int]]           // nested generics
Result[User, ParseError]         // result type
Fn(Int, Int) -> Bool             // function type (no [] needed)
```

`<>` is never used for generics. `<` and `>` are always comparison operators.

## Why [] instead of <>

Using `[]` for generics is a deliberate design choice:

- `<` and `>` are always comparison operators, never part of type syntax
- No ambiguity in expressions like `a < b` vs `f<T>(x)`
- Simpler parsing for both the compiler and LLMs generating code
- Common mistake prevention: `fn foo<T>(x: T)` is rejected with a clear hint

## Next steps

- [Protocols](/docs/guide/protocols/) — defining and implementing protocol bounds
- [Types & Values](/docs/guide/types/) — records, variants, and type aliases
- [Functions](/docs/guide/functions/) — generic functions and type inference
