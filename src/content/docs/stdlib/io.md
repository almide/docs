---
title: io
description: Console I/O functions in the Almide standard library. Requires import.
---

The `io` module provides console input/output functions. **Requires `import io`.** All functions are `effect fn`.

## Function Reference

| Function | Signature | Description |
|---|---|---|
| `read_line` | `() -> String` | Read a single line from stdin |
| `print` | `(String) -> Unit` | Print to stdout without trailing newline |
| `read_all` | `() -> String` | Read all of stdin as a single string |

## Examples

```almd
import io

effect fn prompt(msg: String) -> Result[String, String] = {
  io.print(msg)
  let answer = io.read_line()
  ok(answer)
}

effect fn main(args: List[String]) -> Result[Unit, String] = {
  io.print("Enter your name: ")
  let name = io.read_line()
  println("Hello, " + name + "!")
  ok(())
}
```

Note: `println` is a built-in function (no import needed) and always appends a newline. Use `io.print` when you need output without a trailing newline, such as prompts.
