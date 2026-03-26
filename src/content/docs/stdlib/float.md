---
title: float
description: Floating-point operations in the Almide standard library. Auto-imported.
---

The `float` module provides float conversion, rounding, and math utilities. It is **auto-imported** -- no `import` statement needed.

## Function Reference

### Conversion

| Function | Signature | Description |
|---|---|---|
| `to_string` | `(Float) -> String` | String representation |
| `to_int` | `(Float) -> Int` | Truncate toward zero |
| `from_int` | `(Int) -> Float` | Convert integer to float |
| `parse` | `(String) -> Result[Float, String]` | Parse string to float |
| `to_fixed` | `(Float, Int) -> String` | Format with fixed decimal places |

### Rounding

| Function | Signature | Description |
|---|---|---|
| `round` | `(Float) -> Float` | Round to nearest integer |
| `floor` | `(Float) -> Float` | Round down |
| `ceil` | `(Float) -> Float` | Round up |

### Arithmetic

| Function | Signature | Description |
|---|---|---|
| `abs` | `(Float) -> Float` | Absolute value |
| `sqrt` | `(Float) -> Float` | Square root |
| `min` | `(Float, Float) -> Float` | Smaller of two |
| `max` | `(Float, Float) -> Float` | Larger of two |
| `clamp` | `(Float, Float, Float) -> Float` | Clamp to range [lo, hi] |
| `sign` | `(Float) -> Float` | Sign: -1.0, 0.0, or 1.0 |

### Checks

| Function | Signature | Description |
|---|---|---|
| `is_nan` | `(Float) -> Bool` | Check if NaN |
| `is_infinite` | `(Float) -> Bool` | Check if infinite |

## Examples

```almd
float.to_string(3.14)       // => "3.14"
float.to_int(3.9)           // => 3
float.round(3.6)            // => 4.0
float.parse("3.14")         // => ok(3.14)
float.to_fixed(3.14159, 2)  // => "3.14"
float.abs(-2.5)             // => 2.5
float.clamp(15.0, 0.0, 10.0)// => 10.0
```
