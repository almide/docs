---
title: Protocols
description: Protocol declarations, implementing protocols, built-in protocols, and deriving in Almide.
---

Protocols define a set of functions that a type must implement. They enable generic programming through bounded type parameters, with all dispatch resolved at compile time (no dynamic dispatch).

## Defining a protocol

A protocol declares required method signatures using `Self` as a placeholder for the implementing type:

```almide
protocol Serializable {
  fn serialize(a: Self) -> String
  fn deserialize(raw: String) -> Result[Self, String]
}
```

Protocols can include `effect fn` methods:

```almide
protocol Storage {
  effect fn save(a: Self, path: String) -> Result[Unit, String]
  effect fn load(path: String) -> Result[Self, String]
}
```

## Implementing a protocol

A type declares protocol satisfaction with `: ProtocolName` in its type declaration. Methods are defined as convention functions with the type name prefix:

```almide
type Config: Serializable = {
  key: String,
  value: String,
}

fn Config.serialize(c: Config) -> String =
  c.key + "=" + c.value

fn Config.deserialize(raw: String) -> Result[Config, String] = {
  let parts = string.split(raw, "=")
  match (list.get(parts, 0), list.get(parts, 1)) {
    (some(k), some(v)) => ok({ key: k, value: v }),
    _ => err("invalid format"),
  }
}
```

Methods use UFCS, so both call styles work:

```almide
let s = Config.serialize(config)
let s = config.serialize()          // equivalent via UFCS
```

The checker validates the convention method against the protocol's declared
signature (arity, parameter types, return type — `Self` substituted for the
declaring type), and pins a diagnostic to the method on mismatch. There is no
`impl Protocol for Type { ... }` block: convention methods are Almide's only
way to attach a method to a type, protocol-bound or not — they stay flat,
top-level functions with no extra nesting or indentation.

## Using protocols as bounds

Protocols constrain generic type parameters:

```almide
fn show[T: Serializable](item: T) -> String =
  item.serialize()

fn save_all[T: Serializable](items: List[T], path: String) -> String = {
  let lines = list.map(items, (item) => item.serialize())
  string.join(lines, "\n")
}
```

Only types that satisfy the protocol can be used as arguments:

```almide
show(config)        // OK: Config implements Serializable
show(42)            // Compile error: Int does not implement Serializable
```

## Built-in protocols

Several protocols are built into the language:

| Protocol | Description | Deriving |
|----------|-------------|----------|
| `Eq` | Equality (`==`, `!=`) | Structural, for the operators |
| `Hash` | Hash computation — needed for `Map` keys | Structural, except types containing `Float` |
| `Repr` | String representation, used by interpolation | Built-in convention |
| `Ord` | `cmp(a, b) -> Int` | Built-in convention |
| `Codec` / `Encode` / `Decode` | Serialization | Built-in convention |
| `Numeric` | Arithmetic — satisfied by the built-in numeric types | Built-in convention |

`Ord` provides `cmp`, **not** the comparison operators: `<` / `<=` / `>` / `>=`
stay limited to `Int`, `Float`, `String` and `Bool` even on a type declared
`: Ord`.

`Eq` and `Hash` work structurally for the *operators* — `==` on a record needs
no declaration. Satisfying them as a generic **bound** (`[T: Eq]`) is a
different thing and does require `: Eq` on the type declaration:

```almide
type Color = Red | Green | Blue

let same = Red == Red          // true, just works
let diff = Red != Blue         // true, just works
```

The first parameter can be named/typed explicitly (`a: Point`) or written as
bare `self`, sugar for `self: Self` that resolves to the declaring type on a
convention method the same way it does inside a `protocol { ... }` declaration
itself.

## Design principles

- **No dynamic dispatch** -- all protocol-bounded generics are monomorphized at compile time
- **No implicit instance resolution** -- types explicitly declare protocol satisfaction
- **No arbitrary operator overloading** -- only `==` / `!=` and string interpolation dispatch to a type's `eq` / `repr` convention methods; every other operator has fixed semantics
- **No inheritance** -- use composition and protocols instead
- **No `impl` block** -- convention methods (`fn Type.method(...)`) are the only way to attach a method to a type; flat, top-level, no extra nesting

## Next steps

- [Generics](/docs/guide/generics/) — type parameters and bounds
- [Types & Values](/docs/guide/types/) — records, variants, and deriving
- [Error Handling](/docs/guide/error-handling/) — unwrap operators and error propagation
