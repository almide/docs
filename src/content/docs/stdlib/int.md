---
title: int
description: Integer operations in the Almide standard library. Auto-imported.
---

The `int` module provides integer conversion, parsing, and bitwise operations. It is **auto-imported** -- no `import` statement needed.

## Function Reference

### Conversion

| Function | Signature | Description |
|---|---|---|
| `to_string` | `(Int) -> String` | Decimal string representation |
| `to_hex` | `(Int) -> String` | Hexadecimal string (lowercase) |
| `to_float` | `(Int) -> Float` | Convert to float |
| `to_u32` | `(Int) -> Int` | Truncate to unsigned 32-bit (0..4294967295) |
| `to_u8` | `(Int) -> Int` | Truncate to unsigned 8-bit (0..255) |

### Parsing

| Function | Signature | Description |
|---|---|---|
| `parse` | `(String) -> Result[Int, String]` | Parse decimal string |
| `from_hex` | `(String) -> Result[Int, String]` | Parse hex string |

### Arithmetic

| Function | Signature | Description |
|---|---|---|
| `abs` | `(Int) -> Int` | Absolute value |
| `min` | `(Int, Int) -> Int` | Smaller of two |
| `max` | `(Int, Int) -> Int` | Larger of two |
| `clamp` | `(Int, Int, Int) -> Int` | Clamp to range [lo, hi] |

### Bitwise

| Function | Signature | Description |
|---|---|---|
| `band` | `(Int, Int) -> Int` | Bitwise AND |
| `bor` | `(Int, Int) -> Int` | Bitwise OR |
| `bxor` | `(Int, Int) -> Int` | Bitwise XOR |
| `bnot` | `(Int) -> Int` | Bitwise NOT |
| `bshl` | `(Int, Int) -> Int` | Shift left |
| `bshr` | `(Int, Int) -> Int` | Shift right (arithmetic) |

### Wrapping Arithmetic

| Function | Signature | Description |
|---|---|---|
| `wrap_add` | `(Int, Int, Int) -> Int` | Wrapping add within bit width |
| `wrap_mul` | `(Int, Int, Int) -> Int` | Wrapping multiply within bit width |
| `rotate_right` | `(Int, Int, Int) -> Int` | Rotate bits right |
| `rotate_left` | `(Int, Int, Int) -> Int` | Rotate bits left |

## Examples

```almd
int.to_string(42)           // => "42"
int.parse("123")            // => ok(123)
int.to_hex(255)             // => "ff"
int.abs(-5)                 // => 5
int.clamp(15, 0, 10)        // => 10
int.band(0b1100, 0b1010)    // => 8 (0b1000)
int.wrap_add(255, 1, 8)     // => 0
```
