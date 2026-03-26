---
title: result
description: Result[T, E] utility functions in the Almide standard library. Auto-imported.
---

The `result` module provides functions for working with `Result[T, E]` values. It is **auto-imported** -- no `import` statement needed.

`Result[T, E]` represents a computation that may succeed (`ok(value)`) or fail (`err(error)`). There are no exceptions in Almide.

## Function Reference

| Function | Signature | Description |
|---|---|---|
| `map` | `(Result[A, E], Fn(A) -> B) -> Result[B, E]` | Transform the ok value |
| `map_err` | `(Result[A, E], Fn(E) -> F) -> Result[A, F]` | Transform the error value |
| `flat_map` | `(Result[A, E], Fn(A) -> Result[B, E]) -> Result[B, E]` | Chain fallible operations |
| `unwrap_or` | `(Result[A, E], A) -> A` | Get value or default |
| `unwrap_or_else` | `(Result[A, E], Fn(E) -> A) -> A` | Get value or compute from error |
| `is_ok` | `(Result[A, E]) -> Bool` | Success check |
| `is_err` | `(Result[A, E]) -> Bool` | Failure check |
| `to_option` | `(Result[A, E]) -> Option[A]` | Convert to Option (discard error) |
| `to_err_option` | `(Result[A, E]) -> Option[E]` | Extract error as Option |
| `collect` | `(List[Result[T, E]]) -> Result[List[T], List[E]]` | Collect all oks or all errors |
| `partition` | `(List[Result[T, E]]) -> (List[T], List[E])` | Separate oks and errors |
| `collect_map` | `(List[T], Fn(T) -> Result[U, E]) -> Result[List[U], List[E]]` | Map and collect results |

## Examples

```almd
// Transform success value
result.map(ok(3), (x) => x * 2)       // => ok(6)
result.map(err("fail"), (x) => x * 2) // => err("fail")

// Chain operations
result.flat_map(ok(42), (x) => {
  if x > 0 then ok(x) else err("negative")
})

// Provide fallback
result.unwrap_or(err("fail"), 0)       // => 0

// Collect a list of results
let results = [ok(1), ok(2), ok(3)]
result.collect(results)                // => ok([1, 2, 3])

let mixed = [ok(1), err("bad"), ok(3)]
result.collect(mixed)                  // => err(["bad"])
```
