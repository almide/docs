---
title: math
description: Mathematical functions in the Almide standard library. Auto-imported.
---

The `math` module provides mathematical constants, trigonometric functions, and numeric utilities. It is **auto-imported** -- no `import` statement needed.

## Function Reference

### Constants

| Function | Signature | Description |
|---|---|---|
| `pi` | `() -> Float` | Pi (3.14159...) |
| `e` | `() -> Float` | Euler's number (2.71828...) |

### Integer Arithmetic

| Function | Signature | Description |
|---|---|---|
| `min` | `(Int, Int) -> Int` | Smaller of two integers |
| `max` | `(Int, Int) -> Int` | Larger of two integers |
| `abs` | `(Int) -> Int` | Absolute value |
| `pow` | `(Int, Int) -> Int` | Integer exponentiation |
| `sign` | `(Int) -> Int` | Sign: -1, 0, or 1 |
| `factorial` | `(Int) -> Int` | Factorial of non-negative integer |
| `choose` | `(Int, Int) -> Int` | Binomial coefficient C(n, k) |

### Float Arithmetic

| Function | Signature | Description |
|---|---|---|
| `fmin` | `(Float, Float) -> Float` | Smaller of two floats |
| `fmax` | `(Float, Float) -> Float` | Larger of two floats |
| `fpow` | `(Float, Float) -> Float` | Float exponentiation |
| `sqrt` | `(Float) -> Float` | Square root |

### Trigonometry

| Function | Signature | Description |
|---|---|---|
| `sin` | `(Float) -> Float` | Sine (radians) |
| `cos` | `(Float) -> Float` | Cosine (radians) |
| `tan` | `(Float) -> Float` | Tangent (radians) |

### Logarithms and Exponentials

| Function | Signature | Description |
|---|---|---|
| `log` | `(Float) -> Float` | Natural logarithm (base e) |
| `log2` | `(Float) -> Float` | Base-2 logarithm |
| `log10` | `(Float) -> Float` | Base-10 logarithm |
| `log_gamma` | `(Float) -> Float` | Natural log of gamma function |
| `exp` | `(Float) -> Float` | e raised to power |

## Examples

```almd
math.pi()                    // => 3.141592653589793
math.pow(2, 10)              // => 1024
math.sqrt(16.0)              // => 4.0
math.sin(0.0)                // => 0.0
math.log(1.0)                // => 0.0
math.factorial(5)            // => 120
math.choose(5, 2)            // => 10
math.fpow(2.0, 0.5)          // => 1.4142135623730951
```
