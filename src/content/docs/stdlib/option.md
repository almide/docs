---
title: option
description: Option[T] utility functions in the Almide standard library. Auto-imported.
---

The `option` module provides functions for working with `Option[T]` values. It is **auto-imported** -- no `import` statement needed.

`Option[T]` represents a value that may or may not exist: `some(value)` or `none`. There is no null in Almide.

## Constructors

```almd
some(42)          // Option[Int] containing 42
none              // Option[T] with no value
```

## Pattern Matching

The most common way to work with Options:

```almd
match opt {
  some(x) => println("got: " + int.to_string(x)),
  none => println("nothing"),
}
```

## Functions

### `option.map(o: Option[A], f: Fn(A) -> B) -> Option[B]`

Transform the inner value if present.

```almd
option.map(some(3), (x) => x * 2)    // => some(6)
option.map(none, (x) => x * 2)       // => none
```

### `option.flat_map(o: Option[A], f: Fn(A) -> Option[B]) -> Option[B]`

Transform and flatten. Useful for chaining optional lookups.

```almd
option.flat_map(some("42"), (s) => int.parse(s) |> result.to_option)
// => some(42)
```

### `option.flatten(o: Option[Option[A]]) -> Option[A]`

Unwrap a nested Option.

```almd
option.flatten(some(some(1))) // => some(1)
option.flatten(some(none))    // => none
option.flatten(none)          // => none
```

### `option.unwrap_or(o: Option[A], default: A) -> A`

Get the inner value, or return a default.

```almd
option.unwrap_or(some(42), 0)  // => 42
option.unwrap_or(none, 0)      // => 0
```

### `option.unwrap_or_else(o: Option[A], f: Fn() -> A) -> A`

Get the inner value, or compute a default lazily.

```almd
option.unwrap_or_else(none, () => expensive_default())
```

### `option.is_some(o: Option[A]) -> Bool`

Check if the option contains a value.

```almd
option.is_some(some(1)) // => true
option.is_some(none)     // => false
```

### `option.is_none(o: Option[A]) -> Bool`

Check if the option is empty.

```almd
option.is_none(none)     // => true
option.is_none(some(1))  // => false
```

### `option.to_result(o: Option[A], message: String) -> Result[A, String]`

Convert an Option to a Result, using the message as the error.

```almd
option.to_result(some(42), "not found")  // => ok(42)
option.to_result(none, "not found")      // => err("not found")
```

### `option.filter(o: Option[A], f: Fn(A) -> Bool) -> Option[A]`

Keep the value only if it satisfies the predicate.

```almd
option.filter(some(3), (x) => x > 2)  // => some(3)
option.filter(some(1), (x) => x > 2)  // => none
```

### `option.zip(a: Option[A], b: Option[B]) -> Option[(A, B)]`

Combine two Options into a pair. Returns none if either is none.

```almd
option.zip(some(1), some("a"))  // => some((1, "a"))
option.zip(some(1), none)       // => none
```

### `option.or_else(o: Option[A], f: Fn() -> Option[A]) -> Option[A]`

Return the option if it has a value, otherwise compute an alternative.

```almd
option.or_else(none, () => some(42))       // => some(42)
option.or_else(some(1), () => some(42))    // => some(1)
```

### `option.to_list(o: Option[A]) -> List[A]`

Convert an Option to a single-element or empty list.

```almd
option.to_list(some(42))  // => [42]
option.to_list(none)      // => []
```

## Complete Function Reference

| Function | Signature | Description |
|---|---|---|
| `map` | `(Option[A], Fn(A) -> B) -> Option[B]` | Transform inner value |
| `flat_map` | `(Option[A], Fn(A) -> Option[B]) -> Option[B]` | Transform and flatten |
| `flatten` | `(Option[Option[A]]) -> Option[A]` | Unwrap nested Option |
| `unwrap_or` | `(Option[A], A) -> A` | Get value or default |
| `unwrap_or_else` | `(Option[A], Fn() -> A) -> A` | Get value or compute default |
| `is_some` | `(Option[A]) -> Bool` | Has value check |
| `is_none` | `(Option[A]) -> Bool` | Empty check |
| `to_result` | `(Option[A], String) -> Result[A, String]` | Convert to Result |
| `filter` | `(Option[A], Fn(A) -> Bool) -> Option[A]` | Conditional keep |
| `zip` | `(Option[A], Option[B]) -> Option[(A, B)]` | Combine two Options |
| `or_else` | `(Option[A], Fn() -> Option[A]) -> Option[A]` | Fallback Option |
| `to_list` | `(Option[A]) -> List[A]` | Convert to List |

## Common Patterns

### Guard with Option

```almd
effect fn process(name: Option[String]) -> Result[Unit, String] = {
  let n = option.to_result(name, "name required")
  println("Hello, " + n)
  ok(())
}
```

### Chaining lookups

```almd
let result = map.get(config, "database")
  |> option.flat_map(_, (db) => map.get(db, "host"))
  |> option.unwrap_or(_, "localhost")
```

### Filtering and mapping

```almd
let valid_ids = list.filter_map(inputs, (s) => {
  let n = int.parse(s) |> result.to_option
  option.filter(n, (x) => x > 0)
})
```
