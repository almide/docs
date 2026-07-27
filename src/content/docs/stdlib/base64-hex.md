---
title: base64 / hex
description: Base64 and hexadecimal encoding and decoding, including the URL-safe Base64 alphabet.
---

Both modules encode from `Bytes` to `String` and decode back into
`Result[Bytes, String]`. Neither takes a `String` directly — go through
[bytes](/docs/stdlib/bytes/):

```almide
let b = bytes.from_string("Hello, Almide!")   // String -> Bytes
let s = bytes.to_string(b) ?? "<invalid>"     // Bytes -> Result[String, String]
```

## base64

`import base64`

| Function | Signature |
|---|---|
| `base64.encode(b)` | `Bytes -> String` |
| `base64.decode(s)` | `String -> Result[Bytes, String]` |
| `base64.encode_url(b)` | `Bytes -> String` |
| `base64.decode_url(s)` | `String -> Result[Bytes, String]` |

```almide
import base64

fn main() -> Unit = {
  let b = bytes.from_string("Hello, Almide!")
  println(base64.encode(b))                       // SGVsbG8sIEFsbWlkZSE=
  match base64.decode("SGVsbG8sIEFsbWlkZSE=") {
    ok(d)  => println(bytes.to_string(d) ?? "?"), // Hello, Almide!
    err(e) => println(e),
  }
}
```

`encode` produces the standard RFC 4648 alphabet with `=` padding;
`encode_url` produces the URL-safe alphabet (`-` and `_`) instead.

The decoder is deliberately liberal: it accepts both alphabets and both padded
and unpadded input, so `decode` and `decode_url` behave identically. It rejects
characters outside the alphabets with `invalid base64 character`, and a length
that cannot describe any byte string with `invalid base64 length: <n>`.

## hex

`import hex`

| Function | Signature |
|---|---|
| `hex.encode(b)` | `Bytes -> String` |
| `hex.encode_upper(b)` | `Bytes -> String` |
| `hex.decode(s)` | `String -> Result[Bytes, String]` |

```almide
import hex

fn main() -> Unit = {
  let b = bytes.from_string("Almide")
  println(hex.encode(b))        // 416c6d696465
  println(hex.encode_upper(b))  // 416C6D696465
}
```

One byte becomes two characters. `decode` accepts either case — there is no
`decode_upper` — and reports `hex string has odd length: <n>` or
`invalid hex char at <i>` with the position of the first offending character.

Both modules round-trip arbitrary binary data, not just text, and produce
identical results on the native and wasm targets.
