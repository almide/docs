---
title: error
description: Error construction and inspection. Requires `import error`.
---

```almd
import error
```

## Functions

| Function | Signature | Description |
|---|---|---|
| `context` | `(Result[T, E], String) -> Result[T, String]` | Add context message to an error result. |
| `message` | `(Result[T, String]) -> String` | Extract the error message from a Result, or empty string if ok. |
| `chain` | `(String, String) -> String` | Chain two error messages with a cause separator. |

## Reference

### `error.context(r: Result[T, E], msg: String) -> Result[T, String]`

Add context message to an error result.

```almd
error.context(result, "failed to load config")
```

### `error.message(r: Result[T, String]) -> String`

Extract the error message from a Result, or empty string if ok.

```almd
error.message(err("oops")) // => "oops"
```

### `error.chain(outer: String, cause: String) -> String`

Chain two error messages with a cause separator.

```almd
error.chain("load failed", "file not found") // => "load failed: file not found"
```
