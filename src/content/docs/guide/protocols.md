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
| `Eq` | Equality comparison (`==`, `!=`) | Automatic for all value types |
| `Hash` | Hash computation | Automatic for all value types |
| `Repr` | String representation | Built-in convention |
| `Ord` | Ordering (`<`, `<=`, `>`, `>=`) | Built-in convention |
| `Codec` | Encode/decode | Built-in convention |

`Eq` and `Hash` are compiler-derived from the type structure. No `deriving` is needed:

```almide
type Color = Red | Green | Blue

let same = Red == Red          // true, just works
let diff = Red != Blue         // true, just works
```

## deriving From

`deriving From` is the only explicit deriving directive. It generates `From` implementations for variant types, enabling automatic error conversion:

```almide
type AppError =
  | Io(IoError)
  | Parse(ParseError)
  | Validation(String)
  deriving From
```

This generates:

```almide
// impl From[IoError] for AppError    -> Io(e)
// impl From[ParseError] for AppError -> Parse(e)
```

Used with `effect fn` for seamless error propagation:

```almide
effect fn load(path: String) -> Result[Config, AppError] = {
  let text = fs.read_text(path)    // IoError auto-converts to AppError
  let raw = json.parse(text)       // ParseError auto-converts to AppError
  ok(decode(raw))
}
```

See [Error Handling](/docs/guide/error-handling/) for details on error propagation.

## Traits and impl blocks

For more complex type-class patterns, Almide supports `trait` and `impl` blocks:

```almide
trait Iterable[T] {
  fn map[U](self, f: Fn(T) -> U) -> Self[U]
  fn filter(self, f: Fn(T) -> Bool) -> Self[T]
  fn fold[U](self, init: U, f: Fn(U, T) -> U) -> U
}

impl Iterable[T] for List[T] {
  fn map[U](self, f: Fn(T) -> U) -> List[U] = _
  fn filter(self, f: Fn(T) -> Bool) -> List[T] = _
  fn fold[U](self, init: U, f: Fn(U, T) -> U) -> U = _
}
```

## Design principles

- **No dynamic dispatch** -- all protocol-bounded generics are monomorphized at compile time
- **No implicit instance resolution** -- types explicitly declare protocol satisfaction
- **No operator overloading** -- built-in operators have fixed semantics
- **No inheritance** -- use composition and protocols instead

## Next steps

- [Generics](/docs/guide/generics/) — type parameters and bounds
- [Types & Values](/docs/guide/types/) — records, variants, and deriving
- [Error Handling](/docs/guide/error-handling/) — deriving From for error types
