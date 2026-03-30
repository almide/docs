---
title: io
description: Standard I/O operations. Requires `import io`.
---

```almd
import io
```

## Functions

| Function | Signature | Description |
|---|---|---|
| `read_line` | `() -> String` | Read a single line from standard input |
| `print` | `(String) -> Unit` | Print a string to stdout without a trailing newline |
| `read_all` | `() -> String` | Read all of standard input as a single string |
| `write_bytes` | `(List[Int]) -> Unit` | Write raw bytes to stdout (no UTF-8 conversion) |
| `write` | `(Bytes) -> Unit` | Write a Bytes buffer to stdout (zero-copy, buffered) |

## Reference

### `io.read_line() -> String`

Read a single line from standard input

```almd
let name = io.read_line()
```

### `io.print(s: String) -> Unit`

Print a string to stdout without a trailing newline

```almd
io.print("Enter name: ")
```

### `io.read_all() -> String`

Read all of standard input as a single string

```almd
let input = io.read_all()
```

### `io.write_bytes(data: List[Int]) -> Unit`

Write raw bytes to stdout (no UTF-8 conversion)

```almd
io.write_bytes([0x50, 0x34, 0x0A])
```

### `io.write(data: Bytes) -> Unit`

Write a Bytes buffer to stdout (zero-copy, buffered)

```almd
io.write(buf)
```
