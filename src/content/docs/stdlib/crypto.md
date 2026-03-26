---
title: crypto
description: Cryptographic hashing functions in the Almide standard library. Requires import.
---

The `crypto` module provides cryptographic hash functions. **Requires `import crypto`.**

Note: The crypto module definition file was not found in the current build. The functions below are based on the stdlib specification.

## Function Reference

| Function | Signature | Description |
|---|---|---|
| `sha256` | `(String) -> String` | SHA-256 hash (hex string) |
| `sha256_bytes` | `(List[Int]) -> String` | SHA-256 hash of byte list |
| `md5` | `(String) -> String` | MD5 hash (hex string) |

## Examples

```almd
import crypto

let hash = crypto.sha256("hello world")
println(hash)  // prints hex digest
```
